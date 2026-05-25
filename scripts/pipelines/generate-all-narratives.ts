/**
 * scripts/pipelines/generate-all-narratives.ts
 *
 * Calls all three AI narrative Edge Functions in sequence:
 *   1. fn-generate-company-narrative — for every scored company (or --symbol=HBL)
 *   2. fn-generate-sector-brief      — for every active sector   (or --sector=banking)
 *   3. fn-generate-market-summary    — for today's EOD snapshot
 *
 * Each Edge Function manages its own cache. Outputs are written to ai_outputs.
 * fn-generate-market-summary additionally writes to ai_market_snapshots.
 *
 * Usage:
 *   npm run generate:narratives
 *   npm run generate:narratives -- --symbol=HBL        # one company only
 *   npm run generate:narratives -- --sector=banking    # one sector only
 *   npm run generate:narratives -- --market            # market summary only
 *   npm run generate:narratives -- --companies         # company narratives only
 *   npm run generate:narratives -- --sectors           # sector briefs only
 *   npm run generate:narratives -- --dry-run           # print plan, no API calls
 *   npm run generate:narratives -- --force             # bypass cache, force regeneration
 *
 * Exit codes:
 *   0 — completed (partial failures are warned, not fatal unless all failed)
 *   1 — fatal configuration error or all tasks failed
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";

// ── CLI args ──────────────────────────────────────────────────────────────────

const args        = process.argv.slice(2);
const dryRun      = args.includes("--dry-run");
const force       = args.includes("--force");
const onlyMarket  = args.includes("--market");
const onlyCompanies = args.includes("--companies");
const onlySectors = args.includes("--sectors");

const symbolArg = (() => {
  const f = args.find(a => a.startsWith("--symbol="));
  return f ? f.split("=")[1].toUpperCase().trim() : null;
})();

const sectorArg = (() => {
  const f = args.find(a => a.startsWith("--sector="));
  return f ? f.split("=")[1].toLowerCase().trim() : null;
})();

// Determine which phases to run
// If no phase flag is given, run all three
const runCompanies = !onlyMarket && !onlySectors;
const runSectors   = !onlyMarket && !onlyCompanies;
const runMarket    = !onlyCompanies && !onlySectors;

// ── Edge Function URL construction ────────────────────────────────────────────

function getEdgeFnUrl(fnName: string): string {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) throw new Error("SUPABASE_URL not set in environment");
  // SUPABASE_URL = https://{project-id}.supabase.co
  // Edge fn URL  = https://{project-id}.supabase.co/functions/v1/{fn-name}
  return `${supabaseUrl.replace(/\/$/, "")}/functions/v1/${fnName}`;
}

// ── HTTP caller ───────────────────────────────────────────────────────────────

type FnResult = {
  ok:           boolean;
  status:       number;
  body:         unknown;
  generationMs: number;
};

async function callEdgeFn(
  fnName: string,
  payload: Record<string, unknown>,
): Promise<FnResult> {
  const url        = getEdgeFnUrl(fnName);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const t0         = Date.now();

  const res = await fetch(url, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");
  let body: unknown;
  try { body = JSON.parse(text); } catch { body = { raw: text }; }
  const generationMs = Date.now() - t0;

  return { ok: res.ok, status: res.status, body, generationMs };
}

// ── Summary helpers ───────────────────────────────────────────────────────────

type PhaseStats = {
  total:   number;
  success: number;
  cached:  number;
  failed:  number;
  errors:  { key: string; message: string }[];
};

function emptyStats(): PhaseStats {
  return { total: 0, success: 0, cached: 0, failed: 0, errors: [] };
}

function printStats(label: string, s: PhaseStats): void {
  const parts: string[] = [];
  if (s.success > 0) parts.push(`${s.success} generated`);
  if (s.cached  > 0) parts.push(`${s.cached} cached`);
  if (s.failed  > 0) parts.push(`${s.failed} failed`);
  console.log(`  ${label.padEnd(20)} ${parts.join(" | ")}`);
  s.errors.forEach(e => console.log(`    ✗ ${e.key}: ${e.message.slice(0, 100)}`));
}

// ── Phase 1: Company narratives ───────────────────────────────────────────────

async function generateCompanyNarratives(): Promise<PhaseStats> {
  const stats = emptyStats();

  // Load companies that have a current conviction score
  const { data: companies, error } = await supabaseAdmin
    .from("conviction_scores")
    .select("symbol")
    .eq("is_current", true)
    .order("symbol");

  if (error || !companies) {
    console.error(`  ✗ Could not load scored companies: ${error?.message}`);
    return stats;
  }

  type SymbolRow = { symbol: string };
  let targets = (companies as SymbolRow[]).map(r => r.symbol);

  if (symbolArg) {
    targets = targets.filter(s => s === symbolArg);
    if (targets.length === 0) {
      console.error(`  ✗ Symbol "${symbolArg}" not found in conviction_scores.`);
      return stats;
    }
  }

  console.log(`  ${targets.length} companies to process`);
  stats.total = targets.length;

  for (const symbol of targets) {
    if (dryRun) {
      console.log(`  [dry] fn-generate-company-narrative  symbol=${symbol}`);
      stats.cached++;
      continue;
    }

    try {
      const result = await callEdgeFn("fn-generate-company-narrative", {
        symbol,
        ...(force ? { force: true } : {}),
      });

      if (!result.ok) {
        const msg = (result.body as { error?: string })?.error ?? `HTTP ${result.status}`;
        throw new Error(msg);
      }

      const body = result.body as {
        narrative?:     { qualityStatus: string; fromCache: boolean; skipped: boolean };
        conviction?:    { qualityStatus: string; fromCache: boolean; skipped: boolean };
      };

      const skipped = body.narrative?.skipped && body.conviction?.skipped;
      const qualityOk = (body.narrative?.qualityStatus ?? "passed") !== "failed"
                     && (body.conviction?.qualityStatus ?? "passed") !== "failed";

      if (skipped) {
        console.log(`  = ${symbol.padEnd(12)} (cached)`);
        stats.cached++;
      } else {
        const nq = body.narrative?.qualityStatus  ?? "?";
        const cq = body.conviction?.qualityStatus ?? "?";
        const icon = qualityOk ? "✓" : "⚠";
        console.log(`  ${icon} ${symbol.padEnd(12)} narrative=${nq} conviction=${cq}  ${result.generationMs}ms`);
        stats.success++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${symbol.padEnd(12)} ${message.slice(0, 100)}`);
      stats.failed++;
      stats.errors.push({ key: symbol, message });
    }

    // Rate limit: avoid hammering the Edge Functions and Claude API
    await new Promise(r => setTimeout(r, 500));
  }

  return stats;
}

// ── Phase 2: Sector briefs ────────────────────────────────────────────────────

async function generateSectorBriefs(): Promise<PhaseStats> {
  const stats = emptyStats();

  const { data: sectors, error } = await supabaseAdmin
    .from("sectors")
    .select("slug, name")
    .order("slug");

  if (error || !sectors) {
    console.error(`  ✗ Could not load sectors: ${error?.message}`);
    return stats;
  }

  type SectorRow = { slug: string; name: string };
  let targets = (sectors as SectorRow[]);

  if (sectorArg) {
    targets = targets.filter(s => s.slug === sectorArg);
    if (targets.length === 0) {
      console.error(`  ✗ Sector slug "${sectorArg}" not found in sectors table.`);
      return stats;
    }
  }

  console.log(`  ${targets.length} sectors to process`);
  stats.total = targets.length;

  for (const sector of targets) {
    if (dryRun) {
      console.log(`  [dry] fn-generate-sector-brief  sector_slug=${sector.slug}`);
      stats.cached++;
      continue;
    }

    try {
      const result = await callEdgeFn("fn-generate-sector-brief", {
        sector_slug: sector.slug,
        ...(force ? { force: true } : {}),
      });

      if (!result.ok) {
        const msg = (result.body as { error?: string })?.error ?? `HTTP ${result.status}`;
        throw new Error(msg);
      }

      const body = result.body as {
        qualityStatus?: string;
        fromCache?:     boolean;
        skipped?:       boolean;
      };

      if (body.skipped) {
        console.log(`  = ${sector.slug.padEnd(16)} (cached)`);
        stats.cached++;
      } else {
        const q    = body.qualityStatus ?? "?";
        const icon = q !== "failed" ? "✓" : "⚠";
        console.log(`  ${icon} ${sector.slug.padEnd(16)} quality=${q}  ${result.generationMs}ms`);
        stats.success++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${sector.slug.padEnd(16)} ${message.slice(0, 100)}`);
      stats.failed++;
      stats.errors.push({ key: sector.slug, message });
    }

    await new Promise(r => setTimeout(r, 500));
  }

  return stats;
}

// ── Phase 3: Market summary ───────────────────────────────────────────────────

async function generateMarketSummary(): Promise<PhaseStats> {
  const stats = emptyStats();
  stats.total = 1;

  if (dryRun) {
    console.log(`  [dry] fn-generate-market-summary  snapshot_type=eod_summary`);
    stats.cached++;
    return stats;
  }

  try {
    const result = await callEdgeFn("fn-generate-market-summary", {
      snapshot_type: "eod_summary",
      ...(force ? { force: true } : {}),
    });

    if (!result.ok) {
      const msg = (result.body as { error?: string })?.error ?? `HTTP ${result.status}`;
      throw new Error(msg);
    }

    const body = result.body as {
      long?:  { qualityStatus: string; fromCache: boolean; skipped: boolean };
      short?: { qualityStatus: string; fromCache: boolean; skipped: boolean };
    };

    const skipped = body.long?.skipped && body.short?.skipped;

    if (skipped) {
      console.log(`  = eod_summary (cached)`);
      stats.cached++;
    } else {
      const lq   = body.long?.qualityStatus  ?? "?";
      const sq   = body.short?.qualityStatus ?? "?";
      const ok   = lq !== "failed" && sq !== "failed";
      const icon = ok ? "✓" : "⚠";
      console.log(`  ${icon} eod_summary  long=${lq}  short=${sq}  ${result.generationMs}ms`);
      stats.success++;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ market summary: ${message.slice(0, 100)}`);
    stats.failed++;
    stats.errors.push({ key: "market_summary", message });
  }

  return stats;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startMs = Date.now();
  const today   = new Date().toISOString().slice(0, 10);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Narrative Generation Pipeline`);
  console.log(`  ${today}`);
  if (dryRun) console.log(`  MODE: DRY RUN — no API calls`);
  if (force)  console.log(`  MODE: FORCE — bypassing cache`);
  if (symbolArg) console.log(`  FILTER: symbol = ${symbolArg}`);
  if (sectorArg) console.log(`  FILTER: sector = ${sectorArg}`);
  console.log(`${"═".repeat(60)}\n`);

  const allStats: { label: string; stats: PhaseStats }[] = [];

  // ── Phase 1: Companies
  if (runCompanies) {
    console.log(`── Company Narratives ───────────────────────────────────`);
    const s = await generateCompanyNarratives();
    allStats.push({ label: "Company narratives", stats: s });
    console.log();
  }

  // ── Phase 2: Sector Briefs
  if (runSectors) {
    console.log(`── Sector Briefs ─────────────────────────────────────────`);
    const s = await generateSectorBriefs();
    allStats.push({ label: "Sector briefs", stats: s });
    console.log();
  }

  // ── Phase 3: Market Summary
  if (runMarket) {
    console.log(`── Market Summary ────────────────────────────────────────`);
    const s = await generateMarketSummary();
    allStats.push({ label: "Market summary", stats: s });
    console.log();
  }

  // ── Summary
  const durationMs = Date.now() - startMs;
  const totalFailed = allStats.reduce((n, a) => n + a.stats.failed, 0);

  console.log(`${"─".repeat(60)}`);
  allStats.forEach(({ label, stats: s }) => printStats(label, s));
  console.log(`  Duration: ${(durationMs / 1000).toFixed(1)}s`);

  if (totalFailed > 0) {
    console.log(`\n  ⚠  ${totalFailed} generation(s) failed — check errors above.`);
    process.exit(1);
  } else if (dryRun) {
    console.log(`\n  Dry run complete. Run without --dry-run to execute.`);
  } else {
    console.log(`\n  All narratives up to date.`);
  }
}

main().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
