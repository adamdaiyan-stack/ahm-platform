/**
 * scripts/utils/announcement-parser.ts
 *
 * Structured data extraction from PSX announcement titles.
 *
 * Once an announcement is classified (event-classifier.ts), this module
 * extracts the numeric parameters and dates needed to populate
 * structured_data (JSONB) and eventually corporate_actions rows.
 *
 * All parsing is regex-based and deterministic — no AI calls.
 * Returns null for fields that cannot be reliably extracted.
 *
 * ── Example outputs ─────────────────────────────────────────────────────────
 *
 *   parseDividend("Final Cash Dividend of Rs. 7.5 per share for FY2025")
 *   → { cash_dividend: 7.5, period: "Final", financial_year: "FY25" }
 *
 *   parseBonusShares("20% Bonus Shares declared")
 *   → { bonus_percent: 20 }
 *
 *   parseStockSplit("Notice of Book Closure for Sub-Division of Shares 2-for-1")
 *   → { split_ratio: 2.0 }
 *
 *   parseFinancialPeriod("Financial Results for the Quarter Ended March 31, 2026")
 *   → { period: "Q1 FY26", period_type: "quarter", period_end_date: "2026-03-31" }
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DividendData {
  cash_dividend?:   number;       // PKR per share
  period?:          string;       // "Final" | "Interim" | "Special" | "1H" | "1Q"
  financial_year?:  string;       // "FY25", "FY2025"
}

export interface BonusSharesData {
  bonus_percent?:   number;       // e.g. 20 for 20% bonus
}

export interface RightsIssueData {
  rights_ratio?:    number;       // e.g. 0.25 = 1 share per 4 held
  rights_price?:    number;       // PKR subscription price
}

export interface StockSplitData {
  split_ratio?:     number;       // e.g. 2.0 for 2-for-1 split
}

export interface FinancialPeriodData {
  period?:          string;       // "Q1 FY26", "1H FY26", "FY25"
  period_type?:     "quarter" | "half_year" | "annual";
  period_end_date?: string;       // ISO date "2026-03-31"
}

export interface BoardMeetingData {
  board_meeting_date?: string;    // ISO date, if extractable from title
}

export type StructuredData =
  | DividendData
  | BonusSharesData
  | RightsIssueData
  | StockSplitData
  | FinancialPeriodData
  | BoardMeetingData
  | Record<string, never>;       // empty object for unextractable titles

// ─── Helper: parse a numeric value from text ─────────────────────────────────

function parseNum(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

// ─── Helper: parse a financial year string ───────────────────────────────────

/**
 * extractFinancialYear: Extracts a normalized financial year from text.
 * Handles: "FY2025", "FY25", "2025", "FY 2025", "year 2025"
 * Returns: "FY25" format, or null
 */
function extractFinancialYear(text: string): string | null {
  // Explicit FY prefix
  const fyMatch = text.match(/\bFY\s*(\d{2,4})\b/i);
  if (fyMatch) {
    const y = fyMatch[1];
    return `FY${y.length === 4 ? y.slice(2) : y}`;
  }
  // Four-digit year standalone
  const yearMatch = text.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    return `FY${yearMatch[1].slice(2)}`;
  }
  return null;
}

// ─── Helper: map month names to quarter/half-year ────────────────────────────

const MONTH_TO_NUM: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4,
  may: 5, june: 6, july: 7, august: 8,
  september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4,
  jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function monthToNum(monthName: string): number | null {
  return MONTH_TO_NUM[monthName.toLowerCase()] ?? null;
}

function numToISO(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * quarterFromEndDate: Maps period-end month to fiscal quarter/half-year.
 * PSX companies have various fiscal year ends (June 30, Dec 31, Mar 31).
 * We report the calendar period rather than trying to infer fiscal calendar.
 */
function periodFromEndDate(
  month: number,
  year: number
): { period_type: "quarter" | "half_year" | "annual"; period: string } {
  // Use calendar year convention — Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec
  if (month === 3)  return { period_type: "quarter",   period: `Q1 FY${String(year).slice(2)}` };
  if (month === 6)  return { period_type: "half_year", period: `1H FY${String(year).slice(2)}` };
  if (month === 9)  return { period_type: "quarter",   period: `Q3 FY${String(year).slice(2)}` };
  if (month === 12) return { period_type: "annual",    period: `FY${String(year).slice(2)}` };
  // Non-standard period end
  return {
    period_type: "quarter",
    period: `${year}-${String(month).padStart(2, "0")}`,
  };
}

// ─── Dividend parser ──────────────────────────────────────────────────────────

/**
 * parseDividend: Extracts dividend parameters from announcement title.
 *
 * Handles patterns like:
 * - "Final Cash Dividend of Rs. 7.5 per share for FY2025"
 * - "Interim Cash Dividend - Rs 3.50/share"
 * - "Declares Final Dividend of Rs. 2.0 per Share"
 * - "Final Dividend 12.5%"   (some companies state as % of face value)
 */
export function parseDividend(title: string): DividendData {
  const result: DividendData = {};

  // Dividend period
  if (/\bfinal\b/i.test(title))    result.period = "Final";
  else if (/\binterim\b/i.test(title)) result.period = "Interim";
  else if (/\bspecial\b/i.test(title)) result.period = "Special";
  else if (/\b1st\b/i.test(title))     result.period = "1st";
  else if (/\b2nd\b/i.test(title))     result.period = "2nd";
  else if (/\b3rd\b/i.test(title))     result.period = "3rd";

  // Financial year
  const fy = extractFinancialYear(title);
  if (fy) result.financial_year = fy;

  // Cash dividend per share — PKR amount
  // Patterns: "Rs. 7.5 per share", "Rs 3.50/share", "PKR 7.5", "@ 7.5 per share"
  const amountPatterns = [
    /(?:Rs\.?|PKR|@)\s*([\d,]+(?:\.\d+)?)\s*(?:per\s+share|\/\s*share)/i,
    /(?:dividend|payout)\s+of\s+(?:Rs\.?|PKR)?\s*([\d,]+(?:\.\d+)?)\s*(?:per\s+share)?/i,
    /(?:Rs\.?|PKR)\s*([\d,]+(?:\.\d+)?)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = title.match(pattern);
    if (match) {
      const amount = parseNum(match[1]);
      if (amount !== null && amount > 0 && amount < 10_000) {
        result.cash_dividend = amount;
        break;
      }
    }
  }

  return result;
}

// ─── Bonus shares parser ──────────────────────────────────────────────────────

/**
 * parseBonusShares: Extracts bonus percentage from announcement title.
 *
 * Handles patterns like:
 * - "20% Bonus Shares declared"
 * - "Bonus issue of 15 shares for every 100 held"
 * - "1 bonus share for every 10 shares"
 */
export function parseBonusShares(title: string): BonusSharesData {
  const result: BonusSharesData = {};

  // Direct percentage: "20% bonus"
  const pctMatch = title.match(/([\d,]+(?:\.\d+)?)\s*%\s*bonus/i);
  if (pctMatch) {
    const pct = parseNum(pctMatch[1]);
    if (pct !== null && pct > 0 && pct <= 1000) {
      result.bonus_percent = pct;
      return result;
    }
  }

  // Ratio: "15 shares for every 100 held" or "1 for 10"
  const ratioMatch = title.match(
    /(\d+(?:\.\d+)?)\s+(?:bonus\s+)?shares?\s+for\s+every\s+(\d+(?:\.\d+)?)/i
  ) ?? title.match(/(\d+)\s+for\s+(?:every\s+)?(\d+)/i);

  if (ratioMatch) {
    const numerator   = parseNum(ratioMatch[1]);
    const denominator = parseNum(ratioMatch[2]);
    if (numerator !== null && denominator !== null && denominator > 0) {
      result.bonus_percent = (numerator / denominator) * 100;
    }
  }

  return result;
}

// ─── Rights issue parser ──────────────────────────────────────────────────────

/**
 * parseRightsIssue: Extracts rights parameters from announcement title.
 *
 * Handles patterns like:
 * - "Rights issue of 1 share for every 4 held at Rs 30 per share"
 * - "Right shares at Rs. 25/share, ratio 1:5"
 */
export function parseRightsIssue(title: string): RightsIssueData {
  const result: RightsIssueData = {};

  // Rights ratio: "1 share for every 4 held" → 0.25
  const ratioMatch = title.match(
    /(\d+(?:\.\d+)?)\s+(?:right\s+)?shares?\s+for\s+every\s+(\d+(?:\.\d+)?)/i
  ) ?? title.match(/(\d+)\s*:\s*(\d+)/);

  if (ratioMatch) {
    const n = parseNum(ratioMatch[1]);
    const d = parseNum(ratioMatch[2]);
    if (n !== null && d !== null && d > 0) {
      result.rights_ratio = n / d;
    }
  }

  // Price per rights share
  const priceMatch = title.match(/(?:Rs\.?|PKR|@)\s*([\d,]+(?:\.\d+)?)\s*(?:per\s+share|\/\s*share)/i);
  if (priceMatch) {
    const price = parseNum(priceMatch[1]);
    if (price !== null && price > 0) {
      result.rights_price = price;
    }
  }

  return result;
}

// ─── Stock split parser ───────────────────────────────────────────────────────

/**
 * parseStockSplit: Extracts split ratio from announcement title.
 *
 * Handles patterns like:
 * - "Sub-Division of Shares in ratio 2:1"
 * - "Stock split 5 for 1"
 * - "Face value reduced from Rs 10 to Rs 5"
 */
export function parseStockSplit(title: string): StockSplitData {
  const result: StockSplitData = {};

  // Explicit ratio: "2:1", "5-for-1", "2 for 1"
  const ratioMatch =
    title.match(/(\d+(?:\.\d+)?)\s*(?::|for|-for-)\s*(\d+(?:\.\d+)?)/i) ??
    title.match(/split\s+of\s+(\d+(?:\.\d+)?)/i);

  if (ratioMatch) {
    const n = parseNum(ratioMatch[1]);
    const d = ratioMatch[2] ? parseNum(ratioMatch[2]) : 1;
    if (n !== null && d !== null && d > 0) {
      result.split_ratio = n / d;
    }
  }

  // Face value reduction: "from Rs 10 to Rs 5" implies 2-for-1 split
  if (!result.split_ratio) {
    const fvMatch = title.match(
      /(?:face\s+value|par\s+value)\s+(?:reduced\s+)?from\s+(?:Rs\.?|PKR)?\s*([\d.]+)\s+to\s+(?:Rs\.?|PKR)?\s*([\d.]+)/i
    );
    if (fvMatch) {
      const from = parseNum(fvMatch[1]);
      const to   = parseNum(fvMatch[2]);
      if (from !== null && to !== null && to > 0) {
        result.split_ratio = from / to;
      }
    }
  }

  return result;
}

// ─── Financial period parser ──────────────────────────────────────────────────

/**
 * parseFinancialPeriod: Extracts period metadata from results announcement titles.
 *
 * Handles patterns like:
 * - "Financial Results for the Quarter Ended March 31, 2026"
 * - "Financial Results for the Half Year Ended June 30, 2025"
 * - "Financial Results for the Year Ended December 31, 2025"
 */
export function parseFinancialPeriod(title: string): FinancialPeriodData {
  const result: FinancialPeriodData = {};

  // Pattern: "Ended {Month} {Day}, {Year}" or "Ended {Month} {Year}"
  const endedMatch = title.match(
    /ended\s+([A-Za-z]+)\s+(\d{1,2})?,?\s*(\d{4})/i
  );

  if (endedMatch) {
    const monthName = endedMatch[1];
    const day       = endedMatch[2] ? parseInt(endedMatch[2]) : 30;
    const year      = parseInt(endedMatch[3]);
    const month     = monthToNum(monthName);

    if (month && year) {
      result.period_end_date = numToISO(year, month, day);
      const derived = periodFromEndDate(month, year);
      result.period      = derived.period;
      result.period_type = derived.period_type;
    }
  }

  // Override period_type from explicit keywords if period_end_date could not be found
  if (!result.period_type) {
    if (/\b(annual|full.?year|year\s+ended)\b/i.test(title))     result.period_type = "annual";
    else if (/\b(half.?year|six.?month|1H|2H|h1|h2)\b/i.test(title)) result.period_type = "half_year";
    else if (/\b(quarter|q[1-4]|three.?month)\b/i.test(title))   result.period_type = "quarter";
  }

  // Financial year fallback
  if (!result.period) {
    const fy = extractFinancialYear(title);
    if (fy) result.period = fy;
  }

  return result;
}

// ─── Board meeting date parser ────────────────────────────────────────────────

/**
 * parseBoardMeeting: Extracts scheduled meeting date from board meeting titles.
 *
 * Handles:
 * - "Board meeting scheduled on May 28, 2026"
 * - "Board Meeting to be held on June 5, 2026"
 */
export function parseBoardMeeting(title: string): BoardMeetingData {
  const result: BoardMeetingData = {};

  const dateMatch = title.match(
    /(?:on|held\s+on|scheduled\s+on|dated?)\s+([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/i
  );

  if (dateMatch) {
    const month = monthToNum(dateMatch[1]);
    const day   = parseInt(dateMatch[2]);
    const year  = parseInt(dateMatch[3]);
    if (month && year) {
      result.board_meeting_date = numToISO(year, month, day);
    }
  }

  return result;
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

import type { EventType } from "./event-classifier.js";

/**
 * extractStructuredData: Routes to the appropriate parser based on event_type.
 * Returns a JSONB-ready object or an empty object if not parseable.
 */
export function extractStructuredData(
  title: string,
  eventType: EventType
): StructuredData {
  switch (eventType) {
    case "cash_dividend":
    case "dividend_paid":
      return parseDividend(title);

    case "bonus_shares":
      return parseBonusShares(title);

    case "rights_issue":
      return parseRightsIssue(title);

    case "stock_split":
    case "reverse_split":
      return parseStockSplit(title);

    case "financial_results":
    case "quarterly_report":
    case "annual_report":
      return parseFinancialPeriod(title);

    case "board_meeting":
      return parseBoardMeeting(title);

    default:
      return {};
  }
}

// ─── Adjustment factor calculator ─────────────────────────────────────────────

/**
 * computeAdjustmentFactor: Calculates the price adjustment factor for a corporate action.
 *
 * The adjustment factor is applied to all historical prices BEFORE the ex_date.
 * Multiply raw historical close by this factor to get the adjusted close.
 *
 * Formulas:
 *   Bonus:    factor = 1 / (1 + bonus_percent / 100)
 *             e.g. 20% bonus: 1 / 1.20 = 0.8333
 *
 *   Split:    factor = 1 / split_ratio
 *             e.g. 2-for-1: 1 / 2.0 = 0.5
 *
 *   Cash dividend: No price adjustment to historical data.
 *             Dividend-adjusted returns are computed separately.
 *             Returns null (no adjustment).
 *
 *   Rights:   TERP (Theoretical Ex-Rights Price) formula:
 *             factor = (prevClose + ratio * price) / (prevClose * (1 + ratio))
 *             Requires prevClose — caller must provide it.
 */
export function computeAdjustmentFactor(params: {
  actionType:   string;
  bonusPercent?: number | null;
  splitRatio?:   number | null;
  rightsRatio?:  number | null;
  rightsPrice?:  number | null;
  prevClose?:    number | null;
}): number | null {
  const { actionType, bonusPercent, splitRatio, rightsRatio, rightsPrice, prevClose } = params;

  if (actionType === "bonus_shares" && bonusPercent != null && bonusPercent > 0) {
    return 1 / (1 + bonusPercent / 100);
  }

  if ((actionType === "stock_split" || actionType === "reverse_split") &&
      splitRatio != null && splitRatio > 0) {
    return 1 / splitRatio;
  }

  if (actionType === "rights_issue" &&
      rightsRatio != null && rightsPrice != null &&
      prevClose != null && prevClose > 0) {
    const terp = (prevClose + rightsRatio * rightsPrice) / (1 + rightsRatio);
    return terp / prevClose;
  }

  // Cash dividends: no adjustment to raw price series
  return null;
}
