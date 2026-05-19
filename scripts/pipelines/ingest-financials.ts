/**
 * scripts/pipelines/ingest-financials.ts
 *
 * Manual-entry-compatible financial data ingestion pipeline.
 * Reads financial records from a JSON payload, validates them,
 * creates an upload batch audit record, and upserts into:
 *   - financial_metrics (primary flat table)
 *   - financial_reporting_periods (period registry)
 *   - financial_statement_lines (normalized line items, if provided)
 *
 * Usage:
 *   npm run ingest:financials                            # dry run (reads sample)
 *   npm run ingest:financials -- --file=data/hbl-fy25.json
 *   npm run ingest:financials -- --symbol=HBL --period=FY25 --apply
 *
 * Data File Format (JSON):
 *   {
 *     batchName: "HBL FY2025 Annual Results",
 *     submittedBy: "analyst",
 *     sourceType: "manual",
 *     sourceReference: "https://psx.com.pk/announcements/...",
 *     records: [
 *       {
 *         symbol: "HBL",
 *         period: "FY25",
 *         periodType: "annual",
 *         periodEndDate: "2025-12-31",
 *         yearEndMonth: 12,
 *         isConsolidated: true,
 *         confidence: 1.0,
 *         // All monetary values in PKR millions
 *         revenue: 234567,
 *         pat: 45678,
 *         eps: 31.2,
 *         totalAssets: 5678900,
 *         totalEquity: 345678,
 *         totalDebt: 0,
 *         dps: 6.5,
 *         cfo: 56789,
 *         // Banking specific
 *         nim: 4.8,
 *         casaRatio: 72.3,
 *         nplRatio: 5.2,
 *         // ... any other financial_metrics columns
 *       }
 *     ]
 *   }
 */

import { supabaseAdmin }       from "../utils/supabase-admin.js";
import { parsePeriodKey,
         inferYearEndMonth,
         buildDisplayLabel,
         getPeriodDates }      from "../utils/period-utils.js";
import { readFileSync }        from "fs";
import { resolve }             from "path";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME = "ingest_financials";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FinancialRecord {
  symbol:            string;
  period:            string;       // 'FY25', '1HFY25', etc.
  periodType:        string;       // 'annual' | 'half_year' | 'quarter' | ...
  periodEndDate?:    string;       // YYYY-MM-DD (overrides computed)
  periodStartDate?:  string;       // YYYY-MM-DD (overrides computed)
  yearEndMonth?:     number;       // 6 | 12 | 9 | 3 — overrides inferred
  isConsolidated?:   boolean;
  confidence?:       number;
  notes?:            string;
  announcementDate?: string;

  // Income statement (PKR millions)
  revenue?:                  number;
  revenueFromOperations?:    number;
  otherIncome?:              number;
  costOfRevenue?:            number;
  grossProfit?:              number;
  distributionExpense?:      number;
  adminExpense?:             number;
  operatingProfit?:          number;
  ebit?:                     number;
  ebitda?:                   number;
  depreciationAmortisation?: number;
  financeCost?:              number;
  profitBeforeTax?:          number;
  taxExpense?:               number;
  pat?:                      number;

  // Balance sheet (PKR millions)
  totalAssets?:        number;
  currentAssets?:      number;
  cashAndEquivalents?: number;
  inventories?:        number;
  tradeReceivables?:   number;
  totalLiabilities?:   number;
  currentLiabilities?: number;
  tradePayables?:      number;
  totalDebt?:          number;
  longTermDebt?:       number;
  netDebt?:            number;
  totalEquity?:        number;
  shareCapital?:       number;
  retainedEarnings?:   number;
  sharesOutstanding?:  number;
  bookValue?:          number;

  // Cash flow (PKR millions)
  cfo?:           number;
  capex?:         number;
  fcf?:           number;
  cfi?:           number;
  cff?:           number;
  dividendsPaid?: number;

  // Pre-computed ratios (optional — engine can recompute later)
  eps?:         number;
  bvps?:        number;
  dps?:         number;
  peRatio?:     number;
  pbRatio?:     number;
  roe?:         number;
  roa?:         number;
  roce?:        number;
  grossMargin?: number;
  netMargin?:   number;

  // Banking specific
  nim?:           number;
  casaRatio?:     number;
  nplRatio?:      number;
  coverageRatio?: number;
  car?:           number;
  costToIncome?:  number;
  depositGrowth?: number;
  advanceGrowth?: number;
}

interface IngestionBatch {
  batchName:        string;
  submittedBy?:     string;
  sourceType?:      "manual" | "api_capital_stake" | "pdf_extract" | "csv_import";
  sourceReference?: string;
  notes?:           string;
  records:          FinancialRecord[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toN(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function buildMetricsRow(rec: FinancialRecord, batchId: string): Record<string, unknown> {
  return {
    symbol:                    rec.symbol.toUpperCase(),
    period:                    rec.period.toUpperCase(),
    period_type:               rec.periodType,
    period_end_date:           rec.periodEndDate ?? null,

    // Income statement
    revenue:                   toN(rec.revenue),
    revenue_from_operations:   toN(rec.revenueFromOperations),
    other_income:              toN(rec.otherIncome),
    cost_of_revenue:           toN(rec.costOfRevenue),
    gross_profit:              toN(rec.grossProfit),
    distribution_expense:      toN(rec.distributionExpense),
    admin_expense:             toN(rec.adminExpense),
    operating_profit:          toN(rec.operatingProfit ?? rec.ebit),
    ebit:                      toN(rec.ebit ?? rec.operatingProfit),
    ebitda:                    toN(rec.ebitda),
    depreciation_amortisation: toN(rec.depreciationAmortisation),
    finance_cost:              toN(rec.financeCost),
    profit_before_tax:         toN(rec.profitBeforeTax),
    tax_expense:               toN(rec.taxExpense),
    pat:                       toN(rec.pat),

    // Balance sheet
    total_assets:       toN(rec.totalAssets),
    current_assets:     toN(rec.currentAssets),
    cash_and_equivalents: toN(rec.cashAndEquivalents),
    inventories:        toN(rec.inventories),
    trade_receivables:  toN(rec.tradeReceivables),
    total_liabilities:  toN(rec.totalLiabilities),
    current_liabilities: toN(rec.currentLiabilities),
    trade_payables:     toN(rec.tradePayables),
    total_debt:         toN(rec.totalDebt),
    long_term_debt:     toN(rec.longTermDebt),
    net_debt:           toN(rec.netDebt),
    total_equity:       toN(rec.totalEquity),
    share_capital:      toN(rec.shareCapital),
    retained_earnings:  toN(rec.retainedEarnings),
    shares_outstanding: toN(rec.sharesOutstanding),
    book_value:         toN(rec.bookValue ?? rec.totalEquity),

    // Cash flow
    cfo:           toN(rec.cfo),
    capex:         toN(rec.capex),
    fcf:           toN(rec.fcf),
    cfi:           toN(rec.cfi),
    cff:           toN(rec.cff),
    dividends_paid: toN(rec.dividendsPaid),

    // Per share
    eps:  toN(rec.eps),
    bvps: toN(rec.bvps),
    dps:  toN(rec.dps),

    // Pre-computed ratios (analyst-provided)
    pe_ratio:     toN(rec.peRatio),
    pb_ratio:     toN(rec.pbRatio),
    roe:          toN(rec.roe),
    roa:          toN(rec.roa),
    roce:         toN(rec.roce),
    gross_margin: toN(rec.grossMargin),
    net_margin:   toN(rec.netMargin),

    // Banking specific
    nim:            toN(rec.nim),
    casa_ratio:     toN(rec.casaRatio),
    npl_ratio:      toN(rec.nplRatio),
    coverage_ratio: toN(rec.coverageRatio),
    car:            toN(rec.car),
    cost_to_income: toN(rec.costToIncome),
    deposit_growth: toN(rec.depositGrowth),
    advance_growth: toN(rec.advanceGrowth),

    // Audit
    is_consolidated: rec.isConsolidated ?? true,
    confidence:      rec.confidence ?? 1.0,
    upload_batch_id: batchId,
    notes:           rec.notes ?? null,
    source:          "manual",
    updated_at:      new Date().toISOString(),
  };
}

function buildPeriodRow(rec: FinancialRecord): Record<string, unknown> | null {
  const parsed = parsePeriodKey(rec.period);
  if (!parsed) return null;

  const yearEndMonth = rec.yearEndMonth ?? inferYearEndMonth(rec.symbol);
  const dates = rec.periodEndDate
    ? { periodEnd: new Date(rec.periodEndDate), periodStart: rec.periodStartDate ? new Date(rec.periodStartDate) : null }
    : getPeriodDates(parsed, yearEndMonth);

  return {
    symbol:            rec.symbol.toUpperCase(),
    period_key:        rec.period.toUpperCase(),
    period_type:       parsed.periodType,
    fiscal_year:       parsed.fiscalYear,
    period_num:        parsed.periodNum,
    period_start:      dates.periodStart != null ? (dates.periodStart as Date).toISOString().slice(0, 10) : null,
    period_end:        dates.periodEnd != null ? (dates.periodEnd as Date).toISOString().slice(0, 10) : null,
    is_announced:      rec.announcementDate != null,
    announcement_date: rec.announcementDate ?? null,
    display_label:     buildDisplayLabel(parsed),
    year_end_month:    yearEndMonth,
    updated_at:        new Date().toISOString(),
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args    = process.argv.slice(2);
  const apply   = args.includes("--apply");
  const dryRun  = !apply;
  const fileArg = args.find((a) => a.startsWith("--file="));
  const startedAt = new Date();

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Financial Data Ingestion`);
  console.log(`  Mode: ${dryRun ? "DRY RUN (pass --apply to write)" : "APPLY"}`);
  console.log(`${"═".repeat(60)}\n`);

  // ── Load batch data ──────────────────────────────────────────────────────────
  let batch: IngestionBatch;
  if (fileArg) {
    const filePath = resolve(fileArg.replace("--file=", ""));
    console.log(`Loading batch from: ${filePath}`);
    batch = JSON.parse(readFileSync(filePath, "utf-8")) as IngestionBatch;
  } else {
    console.log("No --file specified. Using built-in sample data.\n");
    batch = getSampleBatch();
  }

  console.log(`Batch: "${batch.batchName}"`);
  console.log(`Records: ${batch.records.length}`);
  console.log(`Source: ${batch.sourceType ?? "manual"}\n`);

  // ── Validate records ─────────────────────────────────────────────────────────
  const errors: string[] = [];
  for (const rec of batch.records) {
    if (!rec.symbol)     errors.push(`Missing symbol in record: ${JSON.stringify(rec).slice(0, 80)}`);
    if (!rec.period)     errors.push(`Missing period for symbol: ${rec.symbol}`);
    if (!rec.periodType) errors.push(`Missing periodType for ${rec.symbol} ${rec.period}`);
    if (!parsePeriodKey(rec.period)) {
      errors.push(`Unrecognised period format: "${rec.period}" for ${rec.symbol}`);
    }
  }
  if (errors.length > 0) {
    console.error("Validation errors:");
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }
  console.log(`  ✓ All ${batch.records.length} records validated\n`);

  if (dryRun) {
    console.log("Dry run complete. Records that would be written:");
    for (const rec of batch.records) {
      console.log(`  ${rec.symbol.padEnd(8)} ${rec.period.padEnd(10)} revenue=${rec.revenue ?? "—"} pat=${rec.pat ?? "—"}`);
    }
    console.log("\nRun with --apply to write to database.\n");
    return;
  }

  // ── Create upload batch record ───────────────────────────────────────────────
  const { data: batchRow, error: batchErr } = await supabaseAdmin
    .from("financial_upload_batches")
    .insert({
      batch_name:       batch.batchName,
      source_type:      batch.sourceType ?? "manual",
      source_reference: batch.sourceReference ?? null,
      submitted_by:     batch.submittedBy ?? "analyst",
      symbols_affected: [...new Set(batch.records.map((r) => r.symbol.toUpperCase()))],
      periods_affected: [...new Set(batch.records.map((r) => r.period.toUpperCase()))],
      records_planned:  batch.records.length,
      status:           "applied",
      applied_at:       new Date().toISOString(),
      notes:            batch.notes ?? null,
    })
    .select("id")
    .single();

  if (batchErr || !batchRow) {
    console.error(`Failed to create upload batch: ${batchErr?.message}`);
    process.exit(1);
  }
  const batchId = batchRow.id as string;
  console.log(`Created upload batch: ${batchId}\n`);

  let upserted = 0, failed = 0;

  for (const rec of batch.records) {
    const sym    = rec.symbol.toUpperCase();
    const period = rec.period.toUpperCase();

    // ── Upsert financial_metrics ───────────────────────────────────────────────
    const metricsRow = buildMetricsRow(rec, batchId);
    const { error: metricsErr } = await supabaseAdmin
      .from("financial_metrics")
      .upsert(metricsRow, { onConflict: "symbol,period" });

    if (metricsErr) {
      console.error(`  ✗ financial_metrics upsert failed (${sym} ${period}): ${metricsErr.message}`);
      failed++;
      continue;
    }

    // ── Upsert financial_reporting_periods ─────────────────────────────────────
    const periodRow = buildPeriodRow(rec);
    if (periodRow) {
      const { error: periodErr } = await supabaseAdmin
        .from("financial_reporting_periods")
        .upsert(periodRow, { onConflict: "symbol,period_key" });
      if (periodErr) {
        console.warn(`  ⚠ financial_reporting_periods upsert failed (${sym} ${period}): ${periodErr.message}`);
      }
    }

    console.log(`  ✓ ${sym} ${period} — revenue=${rec.revenue ?? "—"} pat=${rec.pat ?? "—"}`);
    upserted++;
  }

  // ── Update batch record with results ─────────────────────────────────────────
  await supabaseAdmin
    .from("financial_upload_batches")
    .update({ records_applied: upserted, records_failed: failed })
    .eq("id", batchId);

  // ── Log ingestion run ─────────────────────────────────────────────────────────
  await supabaseAdmin.from("ingestion_runs").insert({
    pipeline_name:    PIPELINE_NAME,
    pipeline_version: "1.0.0",
    run_date:         new Date().toISOString().slice(0, 10),
    source:           batch.sourceType ?? "manual",
    trigger:          "manual",
    status:           failed > 0 ? "failed" : "completed",
    records_fetched:  batch.records.length,
    records_upserted: upserted,
    records_failed:   failed,
    error_summary:    failed > 0 ? `${failed} records failed` : null,
    started_at:       startedAt.toISOString(),
    completed_at:     new Date().toISOString(),
    duration_ms:      Date.now() - startedAt.getTime(),
  });

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Done. ${upserted}/${batch.records.length} records ingested.`);
  if (failed > 0) console.log(`  ✗ ${failed} records failed.`);
  console.log(`${"═".repeat(60)}\n`);

  if (failed > 0) process.exit(1);
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
// Minimal example for testing. Replace with real data file.

function getSampleBatch(): IngestionBatch {
  return {
    batchName:    "Sample — HBL FY2024 (Demo Data)",
    submittedBy:  "system",
    sourceType:   "manual",
    sourceReference: "https://psx.com.pk/",
    notes:        "Sample data for pipeline testing only",
    records: [
      {
        symbol:          "HBL",
        period:          "FY24",
        periodType:      "annual",
        periodEndDate:   "2024-12-31",
        yearEndMonth:    12,
        isConsolidated:  true,
        confidence:      0.9,
        // Income statement (PKR millions — illustrative, not real)
        revenue:         250000,
        pat:             55000,
        eps:             37.5,
        dps:             7.0,
        // Balance sheet
        totalAssets:     5800000,
        totalEquity:     380000,
        totalDebt:       0,
        cashAndEquivalents: 120000,
        // Cash flow
        cfo:             62000,
        capex:           8000,
        // Banking
        nim:             4.9,
        casaRatio:       71.2,
        nplRatio:        5.8,
        coverageRatio:   87.0,
        car:             18.2,
        costToIncome:    41.5,
        announcementDate: "2025-02-28",
        notes: "Illustrative demo data — not from official filings",
      },
    ],
  };
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
