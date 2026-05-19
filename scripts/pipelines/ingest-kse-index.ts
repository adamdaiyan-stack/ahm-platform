/**
 * scripts/pipelines/ingest-kse-index.ts
 *
 * Dedicated KSE-100 (and other PSX indices) ingestion pipeline.
 * Runs SEPARATELY from ingest-daily-prices.ts to avoid hitting PSX rate limits
 * when both /market-watch and /indices are fetched in the same run.
 *
 * Usage:
 *   npm run ingest:index                        # Uses today's PKT date
 *   npm run ingest:index -- --date=2026-05-19   # Specific date (backfill)
 *   npm run ingest:index -- --force             # Run even on weekends
 *
 * What this script does:
 *   1. Fetches https://dps.psx.com.pk/indices (the PSX indices summary page)
 *   2. Parses the table: [Index | High | Low | Current | Change | % Change]
 *   3. Upserts each index row into index_history
 *   4. Updates market_index (one row per index — the "current snapshot" table)
 *   5. Logs a completed ingestion_runs row
 *
 * Idempotent — safe to re-run for the same date (ON CONFLICT upsert).
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";
import { parseDateArg, isWeekend } from "../utils/date-utils.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME   = "kse_index";
const SOURCE          = "dps_psx";
const FETCH_TIMEOUT   = 30_000;
const INDICES_URL     = "https://dps.psx.com.pk/indices";

/** PSX label → canonical index_name used throughout AHM */
const INDEX_NAME_MAP: Record<string, string> = {
  KSE100:    "KSE-100",
  KSE30:     "KSE-30",
  KMIALLSHR: "KMI-All-Share",
  KMI30:     "KMI-30",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface IndexRow {
  index_symbol:   string;
  market_date:    string;
  open:           null;          // /indices page does not expose open
  high:           number | null;
  low:            number | null;
  close:          number;
  change:         number | null;
  change_percent: number | null;
  volume:         null;          // not on this page; compute_market_breadth fills it
  advances:       null;
  declines:       null;
  unchanged:      null;
  source:         string;
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function parseNumber(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/,/g, "").replace(/\s/g, "").replace(/%$/, "");
  if (cleaned === "-" || cleaned === "" || cleaned === "N/A") return null;
  if (cleaned.startsWith("(") && cleaned.endsWith(")")) {
    return -parseFloat(cleaned.slice(1, -1));
  }
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

/**
 * Extract <tr><td>…</td></tr> rows from raw HTML.
 * Skips header rows (those containing <th> tags).
 * Returns an array of string arrays (one per data row).
 */
function extractTableRows(html: string, startHint?: string): string[][] {
  let src = html;
  if (startHint) {
    const idx = html.indexOf(startHint);
    if (idx !== -1) src = html.slice(idx);
  }

  const rows: string[][] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch: RegExpExecArray | null;

  while ((trMatch = trRegex.exec(src)) !== null) {
    const rowHtml = trMatch[1];
    if (/<th/i.test(rowHtml)) continue;      // skip header rows

    const cells: string[] = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch: RegExpExecArray | null;

    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      const text = tdMatch[1]
        .replace(/<[^>]+>/g, "")             // strip nested tags
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c)))
        .trim();
      cells.push(text);
    }

    if (cells.length > 0) rows.push(cells);
  }

  return rows;
}

/**
 * Parse the PSX /indices page HTML into index records.
 *
 * Table columns (confirmed May 2026):
 *   [0] Index name  e.g. "KSE100"
 *   [1] High
 *   [2] Low
 *   [3] Current     today's close
 *   [4] Change
 *   [5] % Change
 */
function parseIndicesHTML(html: string, marketDate: string): IndexRow[] {
  // Start parsing from the first occurrence of "Index" heading area or table header.
  // Using "Indices" as the hint because it appears just before the data table.
  const rows = extractTableRows(html, "Indices");

  if (rows.length === 0) {
    // Fallback: try broader search starting from first KSE mention
    const fallbackRows = extractTableRows(html, "KSE");
    if (fallbackRows.length === 0) {
      console.warn("[ingest-kse-index] No index rows found — PSX may have changed page structure.");
      return [];
    }
    return parseIndexRows(fallbackRows, marketDate);
  }

  return parseIndexRows(rows, marketDate);
}

function parseIndexRows(rows: string[][], marketDate: string): IndexRow[] {
  const records: IndexRow[] = [];

  for (const cells of rows) {
    if (cells.length < 4) continue;

    const rawName   = cells[0]?.trim().toUpperCase().replace(/\s+/g, "");
    if (!rawName) continue;

    const indexSymbol = INDEX_NAME_MAP[rawName] ?? rawName;
    const high        = parseNumber(cells[1]);
    const low         = parseNumber(cells[2]);
    const close       = parseNumber(cells[3]);   // "Current"
    const change      = parseNumber(cells[4]);
    const changePct   = parseNumber(cells[5]);

    // Skip rows where close is missing or zero (e.g. N/A rows for some sector indices)
    if (close == null || close <= 0) continue;

    records.push({
      index_symbol:   indexSymbol,
      market_date:    marketDate,
      open:           null,
      high,
      low,
      close,
      change,
      change_percent: changePct,
      volume:         null,
      advances:       null,
      declines:       null,
      unchanged:      null,
      source:         SOURCE,
    });
  }

  return records;
}

// ─── HTTP fetch ───────────────────────────────────────────────────────────────

async function fetchIndicesPage(): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(INDICES_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent":      "AHM-Platform-DataPipeline/1.0 (contact: admin@ahm.com)",
        "Accept":          "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control":   "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${INDICES_URL}`);
    }

    return await response.text();

  } finally {
    clearTimeout(timeout);
  }
}

// ─── DB writes ────────────────────────────────────────────────────────────────

async function upsertIndexHistory(rows: IndexRow[]): Promise<{ upserted: number; failed: number }> {
  let upserted = 0;
  let failed   = 0;

  for (const row of rows) {
    const { error } = await supabaseAdmin
      .from("index_history")
      .upsert(row, { onConflict: "index_symbol,market_date" });

    if (error) {
      console.error(`  ✗ index_history upsert failed for ${row.index_symbol}: ${error.message}`);
      failed++;
    } else {
      upserted++;
    }
  }

  return { upserted, failed };
}

async function syncMarketIndex(rows: IndexRow[]): Promise<void> {
  for (const row of rows) {
    const { error } = await supabaseAdmin
      .from("market_index")
      .update({
        level:          row.close,
        change:         row.change,
        change_percent: row.change_percent,
        updated_at:     new Date().toISOString(),
      })
      .eq("index_name", row.index_symbol);

    if (error) {
      console.warn(`  ⚠ market_index update failed for ${row.index_symbol}: ${error.message}`);
    } else {
      console.log(
        `  ✓ market_index updated: ${row.index_symbol} = ${row.close.toLocaleString("en-PK")} ` +
        `(${row.change_percent != null ? row.change_percent.toFixed(2) + "%" : "n/a"})`
      );
    }
  }
}

async function logIngestionRun(
  runDate:  string,
  status:   "completed" | "failed",
  fetched:  number,
  upserted: number,
  failed:   number,
  errorMsg: string | null,
  startedAt: Date
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("ingestion_runs")
    .insert({
      pipeline_name:    PIPELINE_NAME,
      pipeline_version: "1.0.0",
      run_date:         runDate,
      source:           SOURCE,
      trigger:          "scheduled",
      status,
      records_fetched:  fetched,
      records_upserted: upserted,
      records_failed:   failed,
      error_summary:    errorMsg,
      started_at:       startedAt.toISOString(),
      completed_at:     new Date().toISOString(),
      duration_ms:      Date.now() - startedAt.getTime(),
    });

  if (error) {
    console.warn(`[ingest-kse-index] Failed to write ingestion_runs row: ${error.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args      = process.argv.slice(2);
  const runDate   = parseDateArg(args);
  const forceRun  = args.includes("--force");
  const startedAt = new Date();

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM KSE Index Ingestion`);
  console.log(`  Date: ${runDate}`);
  console.log(`${"═".repeat(60)}\n`);

  // Skip weekends unless --force
  if (isWeekend(runDate) && !forceRun) {
    console.log(`  PSX is closed on weekends. Skipping (pass --force to override).\n`);
    await logIngestionRun(runDate, "completed", 0, 0, 0, "Weekend skip", startedAt);
    return;
  }

  let fetched  = 0;
  let upserted = 0;
  let failed   = 0;

  try {
    // Step 1: Fetch
    console.log(`Fetching ${INDICES_URL} ...`);
    const html = await fetchIndicesPage();
    console.log(`  Fetched ${html.length.toLocaleString()} bytes\n`);

    // Step 2: Parse
    console.log("Parsing index data...");
    const rows = parseIndicesHTML(html, runDate);
    fetched = rows.length;

    if (rows.length === 0) {
      console.error("  No index rows parsed. Aborting.\n");
      await logIngestionRun(runDate, "failed", 0, 0, 0, "parse returned 0 rows", startedAt);
      process.exit(1);
    }

    console.log(`  Parsed ${rows.length} index records:`);
    for (const r of rows) {
      console.log(
        `    ${r.index_symbol.padEnd(15)} close=${r.close.toLocaleString("en-PK")} ` +
        `(${r.change_percent != null ? r.change_percent.toFixed(2) + "%" : "n/a"})`
      );
    }
    console.log();

    // Step 3: Write to index_history
    console.log("Upserting to index_history...");
    const result = await upsertIndexHistory(rows);
    upserted = result.upserted;
    failed   = result.failed;
    console.log(`  Upserted: ${upserted}  |  Failed: ${failed}\n`);

    // Step 4: Sync market_index snapshot
    console.log("Syncing market_index...");
    await syncMarketIndex(rows.filter((r) => r.index_symbol === "KSE-100"));
    console.log();

    // Step 5: Log
    await logIngestionRun(
      runDate, failed > 0 ? "failed" : "completed",
      fetched, upserted, failed, null, startedAt
    );

    console.log(`${"═".repeat(60)}`);
    console.log(`  Done. ${upserted}/${fetched} index records upserted.`);
    console.log(`${"═".repeat(60)}\n`);

    if (failed > 0) process.exit(1);

  } catch (err) {
    const msg = (err as Error).message;
    console.error(`\n[ingest-kse-index] Fatal error: ${msg}\n`);
    await logIngestionRun(runDate, "failed", fetched, upserted, failed, msg, startedAt);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
