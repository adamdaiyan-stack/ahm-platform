/**
 * scripts/validation/audit-company-universe.ts
 *
 * Full-universe validation — validates every company in the DB across
 * all data dimensions. Designed to run against all 90 (or more) companies,
 * not a sample.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/validation/audit-company-universe.ts
 *   npx tsx --env-file=.env.local scripts/validation/audit-company-universe.ts --date=2026-05-15
 *   npx tsx --env-file=.env.local scripts/validation/audit-company-universe.ts --json
 *
 * What this script validates per company:
 *   1. Has at least one price record in daily_prices (ever)
 *   2. Has a price record for the most recent non-weekend trading day
 *   3. companies.current_price is not null
 *   4. Has a daily_snapshot for the most recent trading day
 *   5. market_cap is plausible (> 0, < ₨10T)
 *   6. Symbol format is valid PSX format
 *   7. Sector is set
 *
 * Output:
 *   Console: per-company status + aggregate summary
 *   --json: docs/reports/audit-company-universe-YYYY-MM-DD.json
 *
 * Exit codes:
 *   0 — no FAILures (warnings are acceptable)
 *   1 — one or more FAIL results
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";
import { parseDateArg, isWeekend } from "../utils/date-utils.js";
import { writeFileSync, mkdirSync } from "fs";
import { join }                    from "path";

// ─── Config ───────────────────────────────────────────────────────────────────

const MAX_MARKET_CAP = 10_000_000_000_000; // ₨10T
const MIN_PRICE_DAYS = 1;                  // At least 1 price record ever
const SYMBOL_REGEX   = /^[A-Z0-9]{1,8}$/;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompanyRow {
  symbol:        string;
  company_name:  string | null;
  sector:        string | null;
  market_cap:    number | null;
  current_price: number | null;
}

type CheckStatus = "PASS" | "WARN" | "FAIL";

interface CompanyCheck {
  name:    string;
  status:  CheckStatus;
  message: string;
}

interface CompanyResult {
  symbol:       string;
  company_name: string | null;
  sector:       string | null;
  overall:      CheckStatus;
  checks:       CompanyCheck[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the most recent weekday on or before a given date string. */
function mostRecentWeekday(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString().slice(0, 10);
}

function worst(statuses: CheckStatus[]): CheckStatus {
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("WARN")) return "WARN";
  return "PASS";
}

// ─── Data loading ─────────────────────────────────────────────────────────────

async function loadAllCompanies(): Promise<CompanyRow[]> {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("symbol, company_name, sector, market_cap, current_price")
    .order("symbol");

  if (error) throw new Error(`Failed to load companies: ${error.message}`);
  return (data ?? []) as CompanyRow[];
}

/** Returns a set of symbols that have at least one row in daily_prices. */
async function getSymbolsWithAnyPrice(): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from("daily_prices")
    .select("symbol")
    .limit(50_000);

  if (error) {
    console.warn(`Could not load daily_prices for coverage check: ${error.message}`);
    return new Set();
  }

  return new Set((data ?? []).map((r: { symbol: string }) => r.symbol));
}

/** Returns a set of symbols with a price record on the given date. */
async function getSymbolsWithPriceOnDate(date: string): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from("daily_prices")
    .select("symbol")
    .eq("market_date", date)
    .limit(10_000);

  if (error) {
    console.warn(`Could not load daily_prices for ${date}: ${error.message}`);
    return new Set();
  }

  return new Set((data ?? []).map((r: { symbol: string }) => r.symbol));
}

/** Returns a set of symbols with a daily_snapshot on the given date. */
async function getSymbolsWithSnapshotOnDate(date: string): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from("daily_snapshots")
    .select("symbol")
    .eq("snapshot_date", date)
    .limit(10_000);

  if (error) {
    console.warn(`Could not load daily_snapshots for ${date}: ${error.message}`);
    return new Set();
  }

  return new Set((data ?? []).map((r: { symbol: string }) => r.symbol));
}

// ─── Audit rules ──────────────────────────────────────────────────────────────

function auditCompany(
  row: CompanyRow,
  context: {
    symbolsWithAnyPrice:     Set<string>;
    symbolsWithPriceOnDate:  Set<string>;
    symbolsWithSnapshotOnDate: Set<string>;
    latestTradingDay:        string;
  }
): CompanyCheck[] {
  const checks: CompanyCheck[] = [];

  // 1. Symbol format
  checks.push(
    SYMBOL_REGEX.test(row.symbol)
      ? { name: "symbol_format",  status: "PASS", message: "Valid PSX format" }
      : { name: "symbol_format",  status: "FAIL", message: `"${row.symbol}" is not valid PSX format (1–8 uppercase alphanumeric)` }
  );

  // 2. Sector set
  checks.push(
    row.sector
      ? { name: "sector",        status: "PASS", message: `Sector: ${row.sector}` }
      : { name: "sector",        status: "WARN", message: "Sector is null" }
  );

  // 3. Market cap plausibility
  if (row.market_cap == null) {
    checks.push({ name: "market_cap", status: "WARN", message: "market_cap is null" });
  } else if (row.market_cap <= 0) {
    checks.push({ name: "market_cap", status: "FAIL", message: `market_cap=${row.market_cap} (must be > 0)` });
  } else if (row.market_cap > MAX_MARKET_CAP) {
    checks.push({ name: "market_cap", status: "WARN", message: `market_cap=₨${row.market_cap.toLocaleString()} — suspiciously large (> ₨10T)` });
  } else {
    checks.push({ name: "market_cap", status: "PASS", message: `₨${row.market_cap.toLocaleString()}` });
  }

  // 4. Has any price history
  if (context.symbolsWithAnyPrice.has(row.symbol)) {
    checks.push({ name: "has_price_history", status: "PASS", message: "Has ≥1 price record in daily_prices" });
  } else {
    checks.push({ name: "has_price_history", status: "FAIL", message: `No price records in daily_prices — symbol may be newly added or wrong` });
  }

  // 5. Has price on latest trading day
  if (context.symbolsWithPriceOnDate.has(row.symbol)) {
    checks.push({ name: `price_on_${context.latestTradingDay}`, status: "PASS", message: `Price present for ${context.latestTradingDay}` });
  } else {
    // Distinguish: no history at all vs missing just this day
    const severity: CheckStatus = context.symbolsWithAnyPrice.has(row.symbol) ? "WARN" : "FAIL";
    checks.push({
      name:    `price_on_${context.latestTradingDay}`,
      status:  severity,
      message: `No price for ${context.latestTradingDay} — company may have been suspended or delisted`,
    });
  }

  // 6. current_price is populated
  if (row.current_price != null && row.current_price > 0) {
    checks.push({ name: "current_price_sync", status: "PASS", message: `current_price=₨${row.current_price}` });
  } else {
    checks.push({ name: "current_price_sync", status: "WARN", message: "current_price is null — sync-company-snapshots may not have run" });
  }

  // 7. Has daily_snapshot for latest trading day
  if (context.symbolsWithSnapshotOnDate.has(row.symbol)) {
    checks.push({ name: `snapshot_on_${context.latestTradingDay}`, status: "PASS", message: `Snapshot present for ${context.latestTradingDay}` });
  } else {
    checks.push({
      name:    `snapshot_on_${context.latestTradingDay}`,
      status:  "WARN",
      message: `No daily_snapshot for ${context.latestTradingDay} — build-daily-snapshots may not have run`,
    });
  }

  return checks;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args     = process.argv.slice(2);
  const runDate  = parseDateArg(args);
  const jsonMode = args.includes("--json");
  const today    = runDate;

  // Find the most recent non-weekend trading day on or before runDate
  const latestTradingDay = mostRecentWeekday(today);

  console.log(`\n${"═".repeat(72)}`);
  console.log(`  AHM Full-Universe Company Validation`);
  console.log(`  Run date: ${today}  |  Latest trading day: ${latestTradingDay}`);
  console.log(`${"═".repeat(72)}\n`);

  console.log("Loading data...");
  const [
    companies,
    symbolsWithAnyPrice,
    symbolsWithPriceOnDate,
    symbolsWithSnapshotOnDate,
  ] = await Promise.all([
    loadAllCompanies(),
    getSymbolsWithAnyPrice(),
    getSymbolsWithPriceOnDate(latestTradingDay),
    getSymbolsWithSnapshotOnDate(latestTradingDay),
  ]);

  console.log(`  ${companies.length} companies, checking against ${latestTradingDay}\n`);

  const context = {
    symbolsWithAnyPrice,
    symbolsWithPriceOnDate,
    symbolsWithSnapshotOnDate,
    latestTradingDay,
  };

  // Run audit for each company
  const results: CompanyResult[] = companies.map((row) => {
    const checks  = auditCompany(row, context);
    const overall = worst(checks.map((c) => c.status));
    return { symbol: row.symbol, company_name: row.company_name, sector: row.sector, overall, checks };
  });

  // ── Group by status ────────────────────────────────────────────────────────
  const failures = results.filter((r) => r.overall === "FAIL");
  const warnings = results.filter((r) => r.overall === "WARN");
  const passes   = results.filter((r) => r.overall === "PASS");

  // ── Print failures ─────────────────────────────────────────────────────────
  if (failures.length > 0) {
    console.log(`── FAILURES (${failures.length}) ──────────────────────────────────────────────────\n`);
    for (const r of failures) {
      console.log(`  ❌  ${r.symbol.padEnd(10)} ${(r.company_name ?? "").padEnd(40)}`);
      for (const c of r.checks.filter((c) => c.status === "FAIL")) {
        console.log(`        [${c.name}] ${c.message}`);
      }
    }
    console.log();
  }

  // ── Print warnings ─────────────────────────────────────────────────────────
  if (warnings.length > 0) {
    console.log(`── WARNINGS (${warnings.length}) ────────────────────────────────────────────────\n`);
    for (const r of warnings) {
      const failingChecks = r.checks.filter((c) => c.status === "WARN" || c.status === "FAIL");
      console.log(`  ⚠   ${r.symbol.padEnd(10)} ${(r.company_name ?? "").padEnd(40)}`);
      for (const c of failingChecks) {
        console.log(`        [${c.name}] ${c.message}`);
      }
    }
    console.log();
  }

  // ── Pass summary ───────────────────────────────────────────────────────────
  if (passes.length > 0) {
    console.log(`── PASS (${passes.length} companies) ───────────────────────────────────────────────\n`);
    const symbols = passes.map((r) => r.symbol).join(", ");
    console.log(`  ${symbols}\n`);
  }

  // ── Aggregate summary ──────────────────────────────────────────────────────
  console.log(`${"═".repeat(72)}`);
  console.log(`  Total: ${results.length}  |  Pass: ${passes.length}  |  Warn: ${warnings.length}  |  Fail: ${failures.length}`);
  console.log(`${"═".repeat(72)}\n`);

  // ── JSON report ────────────────────────────────────────────────────────────
  if (jsonMode) {
    const reportDir  = "docs/reports";
    const reportPath = join(reportDir, `audit-company-universe-${today}.json`);
    try {
      mkdirSync(reportDir, { recursive: true });
      writeFileSync(
        reportPath,
        JSON.stringify(
          {
            generatedAt:    new Date().toISOString(),
            runDate:        today,
            latestTradingDay,
            summary: {
              total:    results.length,
              pass:     passes.length,
              warn:     warnings.length,
              fail:     failures.length,
            },
            results,
          },
          null,
          2
        )
      );
      console.log(`Report written to ${reportPath}\n`);
    } catch (err) {
      console.warn(`Could not write JSON report: ${(err as Error).message}`);
    }
  }

  // Exit code
  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
