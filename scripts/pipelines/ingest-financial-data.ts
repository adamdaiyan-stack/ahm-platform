/**
 * scripts/pipelines/ingest-financial-data.ts
 *
 * AHM Canonical Financial Data Ingestion Pipeline — v1.0.0
 *
 * Reads structured CSV/JSON financial input files, validates, computes
 * ratios deterministically, and upserts into financial_ratio_snapshots.
 *
 * Usage:
 *   npx tsx scripts/pipelines/ingest-financial-data.ts --file=data/financials/banking_FY24.csv
 *   npx tsx scripts/pipelines/ingest-financial-data.ts --file=data/financials/all_FY24.json
 *   npx tsx scripts/pipelines/ingest-financial-data.ts --dir=data/financials/  (process all files)
 *   npx tsx scripts/pipelines/ingest-financial-data.ts --dry-run --file=...    (validate only)
 *
 * Input format: CSV with headers matching FinancialStatementInputs fields.
 * See data/financials/TEMPLATE.csv for the canonical input template.
 *
 * RULES:
 *   - Invalid rows (validation errors) are REJECTED — never written to DB.
 *   - Warnings are logged but do not block ingestion.
 *   - All ratios are computed fresh from inputs — never trust pre-computed ratios in CSV.
 *   - Existing rows are upserted (conflict on symbol + period_key).
 */

import fs   from 'fs';
import path from 'path';
import { supabaseAdmin } from '../utils/supabase-admin.js';
import { validateFinancialInputs, formatValidationReport } from '../intelligence/financial-validator.js';
import { computeRatios } from '../intelligence/compute-ratios.js';
import type { FinancialStatementInputs } from '../intelligence/financial-definitions.js';

// ─── CSV Parser ───────────────────────────────────────────────────────────────

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

function parseNumber(val: string | undefined): number | null {
  if (!val || val === '' || val === '-' || val.toLowerCase() === 'null' || val.toLowerCase() === 'n/a') return null;
  const cleaned = val.replace(/,/g, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function parseBool(val: string | undefined): boolean {
  if (!val) return false;
  return val.toLowerCase() === 'true' || val === '1';
}

/** Map a raw CSV/JSON row to FinancialStatementInputs */
function mapToInputs(row: Record<string, string>): Partial<FinancialStatementInputs> {
  return {
    symbol:       row.symbol?.toUpperCase().trim(),
    period_key:   row.period_key?.trim(),
    period_type:  (row.period_type?.trim() as FinancialStatementInputs['period_type']) || 'annual',
    period_end:   row.period_end?.trim(),
    is_ttm:       parseBool(row.is_ttm),
    price:                parseNumber(row.price)               ?? undefined,
    snapshot_date:        row.snapshot_date?.trim(),
    shares_outstanding:   parseNumber(row.shares_outstanding)  ?? undefined,
    revenue:              parseNumber(row.revenue)             ?? undefined,
    gross_profit:         parseNumber(row.gross_profit),
    ebitda:               parseNumber(row.ebitda),
    ebit:                 parseNumber(row.ebit),
    interest_expense:     parseNumber(row.interest_expense),
    pat:                  parseNumber(row.pat)                 ?? undefined,
    eps:                  parseNumber(row.eps)                 ?? undefined,
    total_assets:         parseNumber(row.total_assets)        ?? undefined,
    total_equity:         parseNumber(row.total_equity)        ?? undefined,
    total_debt:           parseNumber(row.total_debt),
    cash_equivalents:     parseNumber(row.cash_equivalents),
    current_assets:       parseNumber(row.current_assets),
    current_liabilities:  parseNumber(row.current_liabilities),
    cfo:                  parseNumber(row.cfo),
    capex:                parseNumber(row.capex),
    dps:                  parseNumber(row.dps),
    prev_revenue:         parseNumber(row.prev_revenue),
    prev_pat:             parseNumber(row.prev_pat),
    prev_eps:             parseNumber(row.prev_eps),
    revenue_3y_ago:       parseNumber(row.revenue_3y_ago),
    pat_3y_ago:           parseNumber(row.pat_3y_ago),
    eps_3y_ago:           parseNumber(row.eps_3y_ago),
    net_interest_income:  parseNumber(row.net_interest_income),
    total_deposits:       parseNumber(row.total_deposits),
    casa_deposits:        parseNumber(row.casa_deposits),
    gross_loans:          parseNumber(row.gross_loans),
    non_performing_loans: parseNumber(row.non_performing_loans),
    loan_loss_provisions: parseNumber(row.loan_loss_provisions),
    tier1_capital:        parseNumber(row.tier1_capital),
    risk_weighted_assets: parseNumber(row.risk_weighted_assets),
    total_income_banking: parseNumber(row.total_income_banking),
    operating_expenses:   parseNumber(row.operating_expenses),
    production_boepd:     parseNumber(row.production_boepd),
    reserves_mmboe:       parseNumber(row.reserves_mmboe),
    prev_production_boepd: parseNumber(row.prev_production_boepd),
    installed_capacity_mw: parseNumber(row.installed_capacity_mw),
    receivables:          parseNumber(row.receivables),
  };
}

// ─── DB write ─────────────────────────────────────────────────────────────────

async function getSectorForSymbol(symbol: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('companies')
    .select('sector')
    .eq('symbol', symbol)
    .single();
  return data?.sector ?? null;
}

async function upsertSnapshot(
  inp: FinancialStatementInputs,
  sector: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const ratios = computeRatios(inp, sector ?? undefined);

  const row = {
    symbol:             inp.symbol,
    period_key:         inp.period_key,
    period_type:        inp.period_type,
    period_end:         inp.period_end,
    is_ttm:             inp.is_ttm,
    snapshot_date:      inp.snapshot_date,
    price_used:         inp.price,
    market_cap_used:    ratios.market_cap,
    shares_outstanding: inp.shares_outstanding,
    enterprise_value:   ratios.enterprise_value,
    pe_ratio:           ratios.pe_ratio,
    pb_ratio:           ratios.pb_ratio,
    ev_ebitda:          ratios.ev_ebitda,
    ps_ratio:           ratios.ps_ratio,
    ev_revenue:         ratios.ev_revenue,
    fcf_yield:          ratios.fcf_yield,
    dividend_yield:     ratios.dividend_yield,
    gross_margin:       ratios.gross_margin,
    ebitda_margin:      ratios.ebitda_margin,
    operating_margin:   ratios.operating_margin,
    net_margin:         ratios.net_margin,
    roe:                ratios.roe,
    roa:                ratios.roa,
    roce:               ratios.roce,
    revenue_growth:     ratios.revenue_growth,
    pat_growth:         ratios.pat_growth,
    eps_growth:         ratios.eps_growth,
    revenue_cagr_3y:    ratios.revenue_cagr_3y,
    pat_cagr_3y:        ratios.pat_cagr_3y,
    debt_to_equity:     ratios.debt_to_equity,
    net_debt_to_ebitda: ratios.net_debt_to_ebitda,
    current_ratio:      ratios.current_ratio,
    interest_cover:     ratios.interest_cover,
    cfo_to_pat:         ratios.cfo_to_pat,
    fcf_margin:         ratios.fcf_margin,
    capex_to_revenue:   ratios.capex_to_revenue,
    eps:                inp.eps,
    bvps:               ratios.bvps,
    cfps:               ratios.cfps,
    dps:                inp.dps,
    payout_ratio:       ratios.payout_ratio,
    nim:                ratios.nim,
    casa_ratio:         ratios.casa_ratio,
    npl_ratio:          ratios.npl_ratio,
    coverage_ratio:     ratios.coverage_ratio,
    car:                ratios.car,
    cost_to_income:     ratios.cost_to_income,
    computed_at:        new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from('financial_ratio_snapshots')
    .upsert(row, { onConflict: 'symbol,period_key' });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args    = process.argv.slice(2);
  const dryRun  = args.includes('--dry-run');
  const fileArg = args.find(a => a.startsWith('--file='))?.split('=')[1];
  const dirArg  = args.find(a => a.startsWith('--dir='))?.split('=')[1];

  if (!fileArg && !dirArg) {
    console.error('Usage: ingest-financial-data.ts --file=path/to/file.csv [--dry-run]');
    console.error('       ingest-financial-data.ts --dir=data/financials/ [--dry-run]');
    process.exit(1);
  }

  const files: string[] = [];
  if (fileArg) files.push(fileArg);
  if (dirArg) {
    const entries = fs.readdirSync(dirArg)
      .filter(f => f.endsWith('.csv') || f.endsWith('.json'))
      .filter(f => !f.startsWith('TEMPLATE'))
      .map(f => path.join(dirArg, f));
    files.push(...entries);
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  AHM Financial Data Ingestion${dryRun ? ' [DRY RUN]' : ''}`);
  console.log(`  Files: ${files.length}`);
  console.log(`${'═'.repeat(60)}\n`);

  let totalRows = 0, accepted = 0, rejected = 0, warned = 0;

  for (const file of files) {
    console.log(`\nProcessing: ${file}`);
    const content = fs.readFileSync(file, 'utf8');
    const rows: Record<string, string>[] = file.endsWith('.json')
      ? JSON.parse(content)
      : parseCSV(content);

    console.log(`  ${rows.length} rows found\n`);

    for (const row of rows) {
      totalRows++;
      const inputs = mapToInputs(row);
      const validation = validateFinancialInputs(inputs);

      console.log(formatValidationReport(
        inputs.symbol ?? '?',
        inputs.period_key ?? '?',
        validation,
      ));

      if (!validation.valid) {
        rejected++;
        console.log(`  → REJECTED — will not write to DB\n`);
        continue;
      }

      if (validation.warnings.length > 0) warned++;

      if (!dryRun) {
        const sector = await getSectorForSymbol(inputs.symbol!);
        const result = await upsertSnapshot(inputs as FinancialStatementInputs, sector);
        if (result.ok) {
          accepted++;
          console.log(`  → UPSERTED ✓\n`);
        } else {
          rejected++;
          console.log(`  → DB ERROR: ${result.error}\n`);
        }
      } else {
        accepted++;
        console.log(`  → DRY RUN: would upsert\n`);
      }
    }
  }

  console.log(`${'═'.repeat(60)}`);
  console.log(`  Done: ${accepted} accepted, ${rejected} rejected, ${warned} with warnings`);
  console.log(`  Total rows processed: ${totalRows}`);
  if (dryRun) console.log(`  [DRY RUN] No data was written to the database.`);
  console.log(`${'═'.repeat(60)}\n`);

  if (rejected > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
