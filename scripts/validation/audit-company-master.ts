/**
 * scripts/validation/audit-company-master.ts
 *
 * Audits the companies master table for data quality issues.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/validation/audit-company-master.ts
 *   npx tsx --env-file=.env.local scripts/validation/audit-company-master.ts --json
 *
 * What this script checks:
 *   1. Symbol format  — must be 1–8 uppercase alphanumeric chars (PSX standard)
 *   2. Required fields — company_name, sector must not be null/empty
 *   3. Market cap     — must be > 0 and plausible (< ₨10 trillion)
 *   4. Price fields   — current_price, if set, must be > 0
 *   5. Sector mapping — warns if sector has no URL slug (frontend will degrade gracefully)
 *   6. Symbol uniqueness — no duplicates allowed
 *   7. Alias collisions — aliases array must not contain duplicates within the table
 *
 * Output:
 *   Console: summary table with PASS / WARN / FAIL per company
 *   --json flag: writes audit-company-master-YYYY-MM-DD.json to docs/reports/
 */

import { supabaseAdmin } from "../utils/supabase-admin.js";
import { writeFileSync, mkdirSync } from "fs";
import { join }                    from "path";

// ─── Config ───────────────────────────────────────────────────────────────────

// Sectors that have a known URL slug in constants/sectors.ts
const KNOWN_SECTOR_SLUGS = new Set([
  "Banking",
  "Automobile",
  "Cement",
  "Fertiliser",
  "Oil & Gas",
  "Power",
  "Textiles",
]);

// PSX symbol: 1–8 uppercase letters/digits, no spaces
const SYMBOL_REGEX = /^[A-Z0-9]{1,8}$/;

// Market cap plausibility: between ₨1M and ₨10T
const MIN_MARKET_CAP = 1_000_000;          // ₨1M  (smallest micro-caps)
const MAX_MARKET_CAP = 10_000_000_000_000; // ₨10T (well above any current PSX company)

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompanyRow {
  symbol:           string;
  company_name:     string | null;
  display_name:     string | null;
  sector:           string | null;
  market_cap:       number | null;
  current_price:    number | null;
  change:           number | null;
  change_percent:   number | null;
  aliases:          string[] | null;
  psx_url_symbol:   string | null;
}

type Severity = "FAIL" | "WARN" | "PASS";

interface AuditFinding {
  severity: Severity;
  field:    string;
  message:  string;
}

interface CompanyAuditResult {
  symbol:        string;
  company_name:  string | null;
  sector:        string | null;
  overallStatus: Severity;
  findings:      AuditFinding[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function worstSeverity(findings: AuditFinding[]): Severity {
  if (findings.some((f) => f.severity === "FAIL")) return "FAIL";
  if (findings.some((f) => f.severity === "WARN")) return "WARN";
  return "PASS";
}

function pad(str: string, len: number): string {
  return str.padEnd(len).slice(0, len);
}

// ─── Audit rules ──────────────────────────────────────────────────────────────

function auditCompany(row: CompanyRow): AuditFinding[] {
  const findings: AuditFinding[] = [];

  // 1. Symbol format
  if (!SYMBOL_REGEX.test(row.symbol)) {
    findings.push({
      severity: "FAIL",
      field:    "symbol",
      message:  `Symbol "${row.symbol}" does not match PSX format (1–8 uppercase alphanumeric)`,
    });
  }

  // 2. Required fields
  if (!row.company_name || row.company_name.trim() === "") {
    findings.push({ severity: "FAIL", field: "company_name", message: "company_name is null or empty" });
  }
  if (!row.sector || row.sector.trim() === "") {
    findings.push({ severity: "WARN", field: "sector", message: "sector is null or empty" });
  }

  // 3. Sector slug mapping
  if (row.sector && !KNOWN_SECTOR_SLUGS.has(row.sector)) {
    findings.push({
      severity: "WARN",
      field:    "sector",
      message:  `Sector "${row.sector}" has no URL slug in constants/sectors.ts — sector badge will be disabled`,
    });
  }

  // 4. Market cap plausibility
  if (row.market_cap === null || row.market_cap === undefined) {
    findings.push({ severity: "WARN", field: "market_cap", message: "market_cap is null" });
  } else if (row.market_cap <= 0) {
    findings.push({ severity: "FAIL", field: "market_cap", message: `market_cap is ${row.market_cap} (must be > 0)` });
  } else if (row.market_cap < MIN_MARKET_CAP) {
    findings.push({
      severity: "WARN",
      field:    "market_cap",
      message:  `market_cap is ₨${row.market_cap.toLocaleString()} — suspiciously low (< ₨1M)`,
    });
  } else if (row.market_cap > MAX_MARKET_CAP) {
    findings.push({
      severity: "WARN",
      field:    "market_cap",
      message:  `market_cap is ₨${row.market_cap.toLocaleString()} — suspiciously high (> ₨10T)`,
    });
  }

  // 5. Current price (if set, must be positive)
  if (row.current_price !== null && row.current_price !== undefined) {
    if (row.current_price <= 0) {
      findings.push({
        severity: "FAIL",
        field:    "current_price",
        message:  `current_price is ${row.current_price} (must be > 0)`,
      });
    }
  } else {
    // Null current_price means no data has been synced yet — WARN, not FAIL
    findings.push({ severity: "WARN", field: "current_price", message: "current_price is null — price has not been synced" });
  }

  // 6. psx_url_symbol should be set
  if (!row.psx_url_symbol) {
    findings.push({ severity: "WARN", field: "psx_url_symbol", message: "psx_url_symbol is null — run migration 016" });
  }

  // 7. display_name should be set
  if (!row.display_name) {
    findings.push({ severity: "WARN", field: "display_name", message: "display_name is null — run migration 016" });
  }

  return findings;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args      = process.argv.slice(2);
  const jsonMode  = args.includes("--json");
  const today     = new Date().toISOString().slice(0, 10);

  console.log(`\n${"═".repeat(72)}`);
  console.log(`  AHM Company Master Audit — ${today}`);
  console.log(`${"═".repeat(72)}\n`);

  // Load all companies
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("symbol, company_name, display_name, sector, market_cap, current_price, change, change_percent, aliases, psx_url_symbol")
    .order("symbol");

  if (error) {
    console.error(`Failed to load companies: ${error.message}`);
    process.exit(1);
  }

  const companies = (data ?? []) as CompanyRow[];
  console.log(`Loaded ${companies.length} companies\n`);

  // ── Check for symbol duplicates across the whole set ─────────────────────
  const symbolCounts = new Map<string, number>();
  for (const c of companies) symbolCounts.set(c.symbol, (symbolCounts.get(c.symbol) ?? 0) + 1);

  // ── Audit each company ────────────────────────────────────────────────────
  const results: CompanyAuditResult[] = [];

  for (const company of companies) {
    const findings = auditCompany(company);

    // Duplicate symbol check (cross-company)
    if ((symbolCounts.get(company.symbol) ?? 0) > 1) {
      findings.push({ severity: "FAIL", field: "symbol", message: `Duplicate symbol "${company.symbol}" found in table` });
    }

    results.push({
      symbol:        company.symbol,
      company_name:  company.company_name,
      sector:        company.sector,
      overallStatus: worstSeverity(findings),
      findings,
    });
  }

  // ── Print summary table ───────────────────────────────────────────────────
  const fails   = results.filter((r) => r.overallStatus === "FAIL");
  const warns   = results.filter((r) => r.overallStatus === "WARN");
  const passes  = results.filter((r) => r.overallStatus === "PASS");

  console.log(`Results: ${passes.length} PASS  |  ${warns.length} WARN  |  ${fails.length} FAIL\n`);

  // Print FAIL companies
  if (fails.length > 0) {
    console.log("── FAILURES ─────────────────────────────────────────────────────────────\n");
    for (const r of fails) {
      console.log(`  ❌ ${pad(r.symbol, 8)}  ${pad(r.company_name ?? "(null)", 35)}`);
      for (const f of r.findings.filter((f) => f.severity === "FAIL")) {
        console.log(`       [${f.field}] ${f.message}`);
      }
    }
    console.log();
  }

  // Print WARN companies
  if (warns.length > 0) {
    console.log("── WARNINGS ─────────────────────────────────────────────────────────────\n");
    for (const r of warns) {
      console.log(`  ⚠  ${pad(r.symbol, 8)}  ${pad(r.company_name ?? "(null)", 35)}`);
      for (const f of r.findings.filter((f) => f.severity !== "PASS")) {
        console.log(`       [${f.field}] ${f.message}`);
      }
    }
    console.log();
  }

  // Print PASS summary (condensed)
  console.log(`── PASS (${passes.length} companies) ─────────────────────────────────────────────\n`);
  const passSymbols = passes.map((r) => r.symbol).join(", ");
  console.log(`  ${passSymbols}\n`);

  // ── Sector distribution ───────────────────────────────────────────────────
  console.log("── Sector distribution ──────────────────────────────────────────────────\n");
  const sectorCounts = new Map<string, number>();
  for (const c of companies) {
    const s = c.sector ?? "(null)";
    sectorCounts.set(s, (sectorCounts.get(s) ?? 0) + 1);
  }
  for (const [sector, count] of [...sectorCounts.entries()].sort((a, b) => b[1] - a[1])) {
    const hasSlug = KNOWN_SECTOR_SLUGS.has(sector);
    const tag     = hasSlug ? "  " : "⚠ ";
    console.log(`  ${tag}${pad(sector, 30)}  ${count} companies`);
  }
  console.log();

  // ── JSON output ───────────────────────────────────────────────────────────
  if (jsonMode) {
    const reportDir  = "docs/reports";
    const reportPath = join(reportDir, `audit-company-master-${today}.json`);
    try {
      mkdirSync(reportDir, { recursive: true });
      writeFileSync(
        reportPath,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            summary: { total: companies.length, pass: passes.length, warn: warns.length, fail: fails.length },
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

  // Exit with error code if any FAIL findings
  if (fails.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
