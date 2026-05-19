/**
 * scripts/utils/period-utils.ts
 *
 * Canonical period string handling for AHM financial data.
 *
 * Period String Format (AHM standard):
 *   Annual:    FY25       → fiscal year 2025
 *   Half-year: 1HFY25     → first half of FY25
 *             2HFY25     → second half of FY25
 *   Quarter:   1QFY25     → Q1 of FY25
 *             3QFY25     → Q3 of FY25 (nine-month result)
 *   TTM:       TTM_3QFY25 → trailing twelve months ending Q3 FY25
 *
 * Pakistani Fiscal Year Conventions:
 *   Standard companies (Jun year-end): FY25 = Jul 2024 – Jun 2025
 *   Banks (Dec year-end):              FY25 = Jan 2025 – Dec 2025
 *   Some companies (Sep year-end):     FY25 = Oct 2024 – Sep 2025
 *   Some companies (Mar year-end):     FY25 = Apr 2024 – Mar 2025
 */

export type PeriodType = "annual" | "half_year" | "quarter" | "nine_month" | "ttm" | "custom";

export interface ParsedPeriod {
  periodKey:    string;        // Original: 'FY25', '3QFY25', etc.
  periodType:   PeriodType;
  fiscalYear:   number;        // 2025
  periodNum:    number | null; // Quarter (1-4) or Half (1-2). null for annual/ttm.
  displayLabel: string;        // '3Q FY2025', 'H1 FY2025', 'FY 2025'
  isTTM:        boolean;
}

export interface PeriodDates {
  periodStart: Date;
  periodEnd:   Date;
}

/**
 * Parse an AHM period string into its components.
 * Returns null for unrecognised formats.
 */
export function parsePeriodKey(periodKey: string): ParsedPeriod | null {
  const upper = periodKey.trim().toUpperCase();

  // TTM: TTM_3QFY25
  const ttmMatch = upper.match(/^TTM_(.+)$/);
  if (ttmMatch) {
    const inner = parsePeriodKey(ttmMatch[1]);
    if (!inner) return null;
    return {
      periodKey,
      periodType:   "ttm",
      fiscalYear:   inner.fiscalYear,
      periodNum:    inner.periodNum,
      displayLabel: `TTM ending ${inner.displayLabel}`,
      isTTM:        true,
    };
  }

  // Annual: FY25
  const annualMatch = upper.match(/^FY(\d{2,4})$/);
  if (annualMatch) {
    const fy = normaliseFiscalYear(parseInt(annualMatch[1], 10));
    return {
      periodKey,
      periodType:   "annual",
      fiscalYear:   fy,
      periodNum:    null,
      displayLabel: `FY ${fy}`,
      isTTM:        false,
    };
  }

  // Half-year: 1HFY25 or 2HFY25
  const halfMatch = upper.match(/^([12])HFY(\d{2,4})$/);
  if (halfMatch) {
    const halfNum = parseInt(halfMatch[1], 10);
    const fy      = normaliseFiscalYear(parseInt(halfMatch[2], 10));
    return {
      periodKey,
      periodType:   "half_year",
      fiscalYear:   fy,
      periodNum:    halfNum,
      displayLabel: `H${halfNum} FY${fy}`,
      isTTM:        false,
    };
  }

  // Quarter: 1QFY25, 2QFY25, 3QFY25, 4QFY25
  const quarterMatch = upper.match(/^([1234])QFY(\d{2,4})$/);
  if (quarterMatch) {
    const qNum = parseInt(quarterMatch[1], 10);
    const fy   = normaliseFiscalYear(parseInt(quarterMatch[2], 10));
    const qLabel = qNum === 3 ? "9M" : `Q${qNum}`;  // 3Q = nine-month in PSX convention
    return {
      periodKey,
      periodType:   qNum === 3 ? "nine_month" : "quarter",
      fiscalYear:   fy,
      periodNum:    qNum,
      displayLabel: `${qLabel} FY${fy}`,
      isTTM:        false,
    };
  }

  return null;
}

/**
 * Normalise 2-digit fiscal year to 4 digits.
 * 25 → 2025, 99 → 1999 (threshold at 50)
 */
function normaliseFiscalYear(twoOrFour: number): number {
  if (twoOrFour >= 100) return twoOrFour;
  return twoOrFour >= 50 ? 1900 + twoOrFour : 2000 + twoOrFour;
}

/**
 * Compute the calendar date range for a period given the company's fiscal year-end month.
 *
 * @param parsed     - Parsed period from parsePeriodKey()
 * @param yearEndMonth - 6 = June (standard PSX), 12 = December (banks), 9 = September
 */
export function getPeriodDates(parsed: ParsedPeriod, yearEndMonth = 6): PeriodDates {
  const fy = parsed.fiscalYear;
  // The fiscal year end date
  const fyEnd = new Date(fy, yearEndMonth - 1, lastDayOfMonth(fy, yearEndMonth));
  // The fiscal year start (one day after previous year end)
  const fyStart = new Date(fy - 1, yearEndMonth, 1); // month + 1 (0-indexed) = next month

  switch (parsed.periodType) {
    case "annual":
      return { periodStart: fyStart, periodEnd: fyEnd };

    case "half_year": {
      const midDate = addMonths(fyStart, 6);
      if (parsed.periodNum === 1) {
        return { periodStart: fyStart, periodEnd: lastDayOfDate(subDays(midDate, 1)) };
      } else {
        return { periodStart: midDate, periodEnd: fyEnd };
      }
    }

    case "quarter": {
      const qStart = addMonths(fyStart, ((parsed.periodNum ?? 1) - 1) * 3);
      const qEnd   = subDays(addMonths(qStart, 3), 1);
      return { periodStart: qStart, periodEnd: qEnd };
    }

    case "nine_month": {
      // 9M = Q1 start to Q3 end (3 quarters)
      const nineEnd = subDays(addMonths(fyStart, 9), 1);
      return { periodStart: fyStart, periodEnd: nineEnd };
    }

    case "ttm": {
      // TTM ends at the quarter end — compute using inner period
      const innerParsed = parsePeriodKey(parsed.periodKey.replace(/^TTM_/, ""));
      if (innerParsed) {
        const innerDates = getPeriodDates(innerParsed, yearEndMonth);
        return {
          periodStart: subMonths(innerDates.periodEnd, 12),
          periodEnd:   innerDates.periodEnd,
        };
      }
      return { periodStart: subMonths(fyEnd, 12), periodEnd: fyEnd };
    }

    default:
      return { periodStart: fyStart, periodEnd: fyEnd };
  }
}

/**
 * Returns the four quarterly period_keys needed to construct a TTM,
 * going back from the given period.
 * E.g. '3QFY25' → ['3QFY25', '2QFY25', '1QFY25', '4QFY24']
 */
export function getTTMComponents(latestPeriodKey: string): string[] {
  const parsed = parsePeriodKey(latestPeriodKey);
  if (!parsed || (parsed.periodType !== "quarter" && parsed.periodType !== "nine_month")) {
    return [];
  }

  const components: string[] = [];
  let qNum = parsed.periodNum ?? 3;
  let fy   = parsed.fiscalYear;

  for (let i = 0; i < 4; i++) {
    components.push(`${qNum}QFY${String(fy).slice(-2)}`);
    qNum--;
    if (qNum <= 0) {
      qNum = 4;
      fy--;
    }
  }
  return components;
}

/**
 * Determine the prior period for YoY comparison.
 * FY25 → FY24
 * 3QFY25 → 3QFY24
 * 1HFY25 → 1HFY24
 */
export function getPriorYearPeriod(periodKey: string): string | null {
  const parsed = parsePeriodKey(periodKey);
  if (!parsed) return null;

  const fy2 = parsed.fiscalYear - 1;
  const fySuffix = String(fy2).slice(-2);

  switch (parsed.periodType) {
    case "annual":     return `FY${fySuffix}`;
    case "half_year":  return `${parsed.periodNum}HFY${fySuffix}`;
    case "quarter":
    case "nine_month": return `${parsed.periodNum}QFY${fySuffix}`;
    default:           return null;
  }
}

/**
 * Sort period keys chronologically (newest first).
 * Requires yearEndMonth to correctly resolve dates.
 */
export function sortPeriodKeys(
  periodKeys: string[],
  yearEndMonth = 6,
  ascending   = false,
): string[] {
  return [...periodKeys].sort((a, b) => {
    const pa = parsePeriodKey(a);
    const pb = parsePeriodKey(b);
    if (!pa || !pb) return 0;
    const da = getPeriodDates(pa, yearEndMonth).periodEnd;
    const db = getPeriodDates(pb, yearEndMonth).periodEnd;
    return ascending
      ? da.getTime() - db.getTime()
      : db.getTime() - da.getTime();
  });
}

/**
 * Format a period key for display.
 * 'FY25' → 'FY 2025', '3QFY25' → '9M FY2025', '1HFY25' → 'H1 FY2025'
 */
export function formatPeriodLabel(periodKey: string): string {
  const parsed = parsePeriodKey(periodKey);
  return parsed?.displayLabel ?? periodKey;
}

/**
 * Infer the fiscal year-end month for a company based on its symbol.
 * Banks in Pakistan (large commercial banks) have Dec year-end.
 * Most other companies have Jun year-end.
 * Update this list as new companies are confirmed.
 */
export function inferYearEndMonth(symbol: string): number {
  const DEC_YEAR_END = new Set([
    "HBL", "MCB", "UBL", "ABL", "BAFL", "BAHL", "FABL", "MEBL",
    "SNBL", "AKBL", "BOP", "BOK", "SILK", "NBP", "SCB",
    "HMBL", "JSBL", "SMBL", "MYBL", "BIPL", "FAYSAL",
  ]);
  const SEP_YEAR_END = new Set(["ATRL", "GATM"]);
  const MAR_YEAR_END = new Set(["EPCL"]);

  if (DEC_YEAR_END.has(symbol.toUpperCase())) return 12;
  if (SEP_YEAR_END.has(symbol.toUpperCase())) return 9;
  if (MAR_YEAR_END.has(symbol.toUpperCase())) return 3;
  return 6; // Default: June year-end
}

// ─── Date arithmetic helpers ──────────────────────────────────────────────────

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function subMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

function subDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function lastDayOfDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Build a display_label for a period given parsed data.
 * Exported for use in ingestion pipelines.
 */
export function buildDisplayLabel(parsed: ParsedPeriod): string {
  return parsed.displayLabel;
}

/**
 * Compute the TTM period key string.
 * '3QFY25' → 'TTM_3QFY25'
 */
export function buildTTMKey(latestQuarterKey: string): string {
  return `TTM_${latestQuarterKey.toUpperCase()}`;
}

/**
 * Check if a period key represents an announced / fully completed period.
 * For today's date, a period is "past" if its end date is before today.
 */
export function isPeriodCompleted(periodKey: string, yearEndMonth = 6): boolean {
  const parsed = parsePeriodKey(periodKey);
  if (!parsed) return false;
  const { periodEnd } = getPeriodDates(parsed, yearEndMonth);
  return periodEnd <= new Date();
}
