/**
 * scripts/pipelines/ingest-announcements.ts
 *
 * Pipeline: Fetch PSX company announcements → classify → upsert into announcements_raw.
 *
 * ── What this does ──────────────────────────────────────────────────────────
 * 1. Loads the companies master (symbols to fetch)
 * 2. For each symbol, fetches the company page from dps.psx.com.pk/company/{SYMBOL}
 * 3. Parses the three announcement tables (Financial Results / Board Meetings / Others)
 * 4. Classifies each announcement (event_type, importance_score, direction)
 * 5. Extracts structured data (dividend amount, bonus %, etc.)
 * 6. Upserts into announcements_raw (idempotent — UNIQUE on symbol + document_id)
 * 7. Logs to ingestion_runs, flags quality issues to data_quality_flags
 *
 * ── Idempotency ─────────────────────────────────────────────────────────────
 * Each PSX announcement has a numeric document_id (from its PDF URL).
 * The UNIQUE constraint on (symbol, document_id) makes every run safe to re-run.
 * Re-runs update classification fields but preserve created_at.
 *
 * ── Usage ───────────────────────────────────────────────────────────────────
 *   npm run ingest:announcements                    # All symbols
 *   npm run ingest:announcements -- --symbols=HBL,MCB,OGDC  # Specific symbols
 *   npm run ingest:announcements -- --symbol=HBL    # Single symbol (alias)
 *
 * ── Rate limiting ───────────────────────────────────────────────────────────
 * The connector enforces a 500ms pause between symbol fetches.
 * A full run over 95 symbols takes ~50–60 seconds.
 */

import { PSXAnnouncementsConnector, type RawAnnouncement } from "../connectors/psx-announcements.js";
import { classifyAnnouncement }                            from "../utils/event-classifier.js";
import { extractStructuredData }                           from "../utils/announcement-parser.js";
import { flagDataIssues, type DataIssue }                  from "../utils/data-quality.js";
import { supabaseAdmin }                                   from "../utils/supabase-admin.js";
import { PipelineLogger }                                  from "../utils/pipeline-logger.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME = "announcements";
const SOURCE        = "dps_psx";
const BATCH_SIZE    = 25;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAllSymbols(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("symbol")
    .order("symbol");

  if (error) throw new Error(`Failed to load companies master: ${error.message}`);
  return (data ?? []).map((r: { symbol: string }) => r.symbol);
}

function parseSymbolsArg(args: string[]): string[] | null {
  for (const arg of args) {
    // --symbols=HBL,MCB,OGDC
    const multi = arg.match(/^--symbols=(.+)$/i);
    if (multi) return multi[1].split(",").map((s) => s.trim().toUpperCase());

    // --symbol=HBL
    const single = arg.match(/^--symbol=(.+)$/i);
    if (single) return [single[1].trim().toUpperCase()];
  }
  return null;
}

// ─── Upsert logic ─────────────────────────────────────────────────────────────

interface AnnotatedAnnouncement extends RawAnnouncement {
  event_type:                string;
  importance_score:          number;
  catalyst_direction:        string | null;
  is_price_sensitive:        boolean;
  classification_confidence: string;
  needs_corporate_action:    boolean;
  structured_data:           Record<string, unknown>;
}

async function upsertBatch(
  records: AnnotatedAnnouncement[]
): Promise<{ upserted: number; failed: number }> {
  if (records.length === 0) return { upserted: 0, failed: 0 };

  const rows = records.map((r) => ({
    symbol:                    r.symbol,
    document_id:               r.document_id,
    document_url:              r.document_url,
    announcement_date:         r.announcement_date,
    title:                     r.title,
    raw_category:              r.raw_category,
    source:                    r.source,
    event_type:                r.event_type,
    importance_score:          r.importance_score,
    catalyst_direction:        r.catalyst_direction,
    is_price_sensitive:        r.is_price_sensitive,
    classification_confidence: r.classification_confidence,
    needs_corporate_action:    r.needs_corporate_action,
    structured_data:           Object.keys(r.structured_data).length > 0
      ? r.structured_data
      : null,
    updated_at: new Date().toISOString(),
  }));

  let upserted = 0;
  let failed   = 0;

  // Upsert in batches
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabaseAdmin
      .from("announcements_raw")
      .upsert(batch, {
        onConflict:        "symbol,document_id",
        ignoreDuplicates:  false, // Update classification fields on re-run
      });

    if (error) {
      console.error(`  [upsert] Batch error: ${error.message}`);
      failed += batch.length;
    } else {
      upserted += batch.length;
    }
  }

  return { upserted, failed };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const runDate = new Date().toISOString().slice(0, 10);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Announcements Ingestion Pipeline`);
  console.log(`  Run date: ${runDate}  |  Source: ${SOURCE}`);
  console.log(`${"═".repeat(60)}\n`);

  const run = await PipelineLogger.start(PIPELINE_NAME, runDate, SOURCE, "cron");

  try {
    // ── Step 1: Determine symbols to fetch ─────────────────────────────────
    const requestedSymbols = parseSymbolsArg(args);
    const symbols = requestedSymbols ?? await getAllSymbols();

    if (requestedSymbols) {
      console.log(`Fetching ${symbols.length} specific symbol(s): ${symbols.join(", ")}\n`);
    } else {
      console.log(`Loaded ${symbols.length} symbols from companies master\n`);
    }

    // ── Step 2: Fetch announcements per symbol ──────────────────────────────
    console.log("Fetching announcements from DPS PSX...");
    console.log(`  (${symbols.length} symbols × ~500ms delay ≈ ${Math.round(symbols.length * 0.5)}s)\n`);

    let totalFetched    = 0;
    let fetchErrors     = 0;
    const allAnnotated: AnnotatedAnnouncement[] = [];
    const allQualityIssues: DataIssue[] = [];

    const results = await PSXAnnouncementsConnector.fetchSymbols(
      symbols,
      (symbol, index) => {
        if ((index + 1) % 10 === 0 || index === 0) {
          process.stdout.write(`\r  Progress: ${index + 1}/${symbols.length} symbols`);
        }
      }
    );

    process.stdout.write("\n\n");

    // ── Step 3: Classify + extract structured data ──────────────────────────
    console.log("Classifying announcements...");

    for (const result of results) {
      if (result.error) {
        fetchErrors++;
        allQualityIssues.push({
          entityType:  "announcement",
          symbol:      result.symbol,
          issueType:   "missing_data",
          severity:    "warning",
          description: `Failed to fetch announcements for ${result.symbol}: ${result.error}`,
          source:      SOURCE,
        });
        continue;
      }

      totalFetched += result.announcements.length;

      for (const ann of result.announcements) {
        const classification = classifyAnnouncement(ann.title, ann.raw_category);
        const structured     = extractStructuredData(ann.title, classification.event_type as Parameters<typeof extractStructuredData>[1]);

        // Flag low-confidence classifications for analyst review
        if (classification.classification_confidence === "low" &&
            classification.event_type === "unclassified") {
          allQualityIssues.push({
            entityType:  "announcement",
            symbol:      ann.symbol,
            marketDate:  ann.announcement_date,
            issueType:   "parse_error",
            severity:    "info",
            description: `Could not classify announcement: "${ann.title.slice(0, 100)}"`,
            source:      SOURCE,
          });
        }

        allAnnotated.push({
          ...ann,
          event_type:                classification.event_type,
          importance_score:          classification.importance_score,
          catalyst_direction:        classification.catalyst_direction,
          is_price_sensitive:        classification.is_price_sensitive,
          classification_confidence: classification.classification_confidence,
          needs_corporate_action:    classification.needs_corporate_action,
          structured_data:           structured as Record<string, unknown>,
        });
      }
    }

    // Summary by event type
    const typeCount: Record<string, number> = {};
    for (const a of allAnnotated) {
      typeCount[a.event_type] = (typeCount[a.event_type] ?? 0) + 1;
    }
    const topTypes = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([type, n]) => `${type}:${n}`)
      .join("  ");

    console.log(`  Fetched: ${totalFetched} announcements across ${results.length - fetchErrors} symbols`);
    console.log(`  Fetch errors: ${fetchErrors}`);
    console.log(`  Classification: ${topTypes}\n`);

    // ── Step 4: Upsert ──────────────────────────────────────────────────────
    console.log("Upserting into announcements_raw...");
    const { upserted, failed } = await upsertBatch(allAnnotated);
    console.log(`  ✓ Upserted: ${upserted}  |  Failed: ${failed}\n`);

    // ── Step 5: Flag quality issues ─────────────────────────────────────────
    if (allQualityIssues.length > 0) {
      await flagDataIssues(allQualityIssues);
    }

    // ── Step 6: Summary stats ───────────────────────────────────────────────
    const highImportance = allAnnotated.filter((a) => a.importance_score >= 4).length;
    const priceMovers    = allAnnotated.filter((a) => a.is_price_sensitive).length;
    const needsCA        = allAnnotated.filter((a) => a.needs_corporate_action).length;

    console.log(`  High-importance (4+): ${highImportance}`);
    console.log(`  Price-sensitive:      ${priceMovers}`);
    console.log(`  Needs corp action:    ${needsCA}`);

    if (needsCA > 0) {
      console.log(`\n  ⚑ Run 'npm run normalize:corp-actions' to process ${needsCA} pending corporate actions.`);
    }

    await run.complete({
      fetched:  totalFetched,
      upserted,
      failed:   failed + fetchErrors,
    });

  } catch (err) {
    await run.fail(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
