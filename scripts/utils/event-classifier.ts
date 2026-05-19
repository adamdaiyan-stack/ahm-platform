/**
 * scripts/utils/event-classifier.ts
 *
 * Deterministic, regex-based announcement classification engine.
 *
 * Rules:
 * - No AI/ML — fully deterministic, no external calls
 * - Title + raw_category are the only inputs
 * - Returns event_type, importance_score, catalyst_direction,
 *   is_price_sensitive, and classification_confidence
 * - Newspaper clippings are detected and scored low
 * - Ambiguous titles get 'unclassified' with low confidence
 *
 * To add or tune rules: edit CLASSIFICATION_RULES below.
 * Rules are evaluated in order — first match wins.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "financial_results"
  | "quarterly_report"
  | "annual_report"
  | "board_meeting"
  | "agm"
  | "egm"
  | "cash_dividend"
  | "bonus_shares"
  | "stock_split"
  | "reverse_split"
  | "rights_issue"
  | "book_closure"
  | "dividend_paid"
  | "material_notice"
  | "merger_acquisition"
  | "newspaper_clipping"
  | "regulatory_filing"
  | "unclassified";

export type CatalystDirection = "bullish" | "bearish" | "neutral";
export type ClassificationConfidence = "high" | "medium" | "low";

export interface EventClassification {
  event_type:               EventType;
  importance_score:         number;         // 1–5
  catalyst_direction:       CatalystDirection | null;
  is_price_sensitive:       boolean;
  classification_confidence: ClassificationConfidence;
  needs_corporate_action:   boolean;        // Should this feed corporate_actions?
}

// ─── Rule definitions ─────────────────────────────────────────────────────────

interface ClassificationRule {
  /** Description — used for logging and debugging */
  label:                    string;
  /** Match against lowercased title */
  titlePattern?:            RegExp;
  /** Match against raw_category */
  categoryMatch?:           "financial_results" | "board_meetings" | "others" | null;
  /** Result when this rule matches */
  result:                   EventClassification;
}

// Rules are evaluated in order — first match wins.
// More specific rules should come before general ones.
const CLASSIFICATION_RULES: ClassificationRule[] = [

  // ── Newspaper clippings (derivative — always low importance) ────────────────
  {
    label: "newspaper_clipping",
    titlePattern: /\bnewspaper\s+clip/i,
    result: {
      event_type:                "newspaper_clipping",
      importance_score:          1,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },

  // ── Financial results ───────────────────────────────────────────────────────
  {
    label: "financial_results_result",
    titlePattern: /\b(financial\s+results?|results?\s+for\s+the)\b/i,
    result: {
      event_type:                "financial_results",
      importance_score:          5,
      catalyst_direction:        "neutral",   // Direction set after parsing EPS
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "quarterly_report_transmission",
    titlePattern: /\b(transmission|dispatch)\b.*\b(quarterly|half.?year|annual)\s+report\b/i,
    result: {
      event_type:                "quarterly_report",
      importance_score:          3,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "annual_report_transmission",
    titlePattern: /\b(transmission|dispatch)\b.*\bannual\s+report\b/i,
    result: {
      event_type:                "annual_report",
      importance_score:          3,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "financial_results_category_fallback",
    categoryMatch: "financial_results",
    result: {
      event_type:                "financial_results",
      importance_score:          3,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "medium",
      needs_corporate_action:    false,
    },
  },

  // ── Dividends ───────────────────────────────────────────────────────────────
  {
    label: "dividend_paid_credit",
    titlePattern: /\b(credit\s+of|payment\s+of|paid|disbursed)\b.*\bdividend\b/i,
    result: {
      event_type:                "dividend_paid",
      importance_score:          3,
      catalyst_direction:        "bullish",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,    // Already linked to corporate_action row
    },
  },
  {
    label: "cash_dividend_declaration",
    titlePattern: /\b(cash\s+dividend|interim\s+dividend|final\s+dividend|declares?\s+dividend|dividend\s+declared)\b/i,
    result: {
      event_type:                "cash_dividend",
      importance_score:          5,
      catalyst_direction:        "bullish",
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    true,
    },
  },
  {
    label: "dividend_general",
    titlePattern: /\bdividend\b/i,
    result: {
      event_type:                "cash_dividend",
      importance_score:          4,
      catalyst_direction:        "bullish",
      is_price_sensitive:        true,
      classification_confidence: "medium",
      needs_corporate_action:    true,
    },
  },

  // ── Bonus shares ────────────────────────────────────────────────────────────
  {
    label: "bonus_shares",
    titlePattern: /\b(bonus\s+shares?|bonus\s+issue|stock\s+dividend|scrip\s+dividend)\b/i,
    result: {
      event_type:                "bonus_shares",
      importance_score:          5,
      catalyst_direction:        "bullish",
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    true,
    },
  },

  // ── Stock splits ────────────────────────────────────────────────────────────
  {
    label: "stock_split",
    titlePattern: /\b(sub.?division|stock\s+split|share\s+split|split\s+of\s+shares)\b/i,
    result: {
      event_type:                "stock_split",
      importance_score:          5,
      catalyst_direction:        "neutral",
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    true,
    },
  },
  {
    label: "reverse_split",
    titlePattern: /\b(consolidation\s+of\s+shares|reverse\s+split|share\s+consolidation)\b/i,
    result: {
      event_type:                "reverse_split",
      importance_score:          5,
      catalyst_direction:        "neutral",
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    true,
    },
  },

  // ── Rights issues ────────────────────────────────────────────────────────────
  {
    label: "rights_issue",
    titlePattern: /\b(rights?\s+(share|issue|offering)|right\s+shares?)\b/i,
    result: {
      event_type:                "rights_issue",
      importance_score:          5,
      catalyst_direction:        "bearish",   // Dilutive unless accretive deal
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    true,
    },
  },

  // ── Book closures ────────────────────────────────────────────────────────────
  {
    label: "book_closure",
    titlePattern: /\bbook\s+closure\b/i,
    result: {
      event_type:                "book_closure",
      importance_score:          4,
      catalyst_direction:        "neutral",
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },

  // ── Material disclosures ─────────────────────────────────────────────────────
  {
    label: "material_notice",
    titlePattern: /\b(material\s+(information|disclosure|event)|disclosure\s+of\s+material)\b/i,
    result: {
      event_type:                "material_notice",
      importance_score:          5,
      catalyst_direction:        "neutral",   // Direction unknown without content
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },

  // ── M&A ──────────────────────────────────────────────────────────────────────
  {
    label: "merger_acquisition",
    titlePattern: /\b(merger|acquisition|takeover|amalgamation|scheme\s+of\s+arrangement)\b/i,
    result: {
      event_type:                "merger_acquisition",
      importance_score:          5,
      catalyst_direction:        "bullish",
      is_price_sensitive:        true,
      classification_confidence: "high",
      needs_corporate_action:    true,
    },
  },

  // ── Board meetings ───────────────────────────────────────────────────────────
  {
    label: "board_meeting",
    categoryMatch: "board_meetings",
    titlePattern: /\bboard\s+meeting\b/i,
    result: {
      event_type:                "board_meeting",
      importance_score:          4,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "agm",
    titlePattern: /\b(annual\s+general\s+meeting|agm\b|a\.g\.m\.)\b/i,
    result: {
      event_type:                "agm",
      importance_score:          4,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "egm",
    titlePattern: /\b(extraordinary\s+general\s+meeting|e\.?o\.?g\.?m\.?|special\s+general\s+meeting)\b/i,
    result: {
      event_type:                "egm",
      importance_score:          4,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "board_meeting_category_fallback",
    categoryMatch: "board_meetings",
    result: {
      event_type:                "board_meeting",
      importance_score:          4,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "medium",
      needs_corporate_action:    false,
    },
  },

  // ── Regulatory / routine filings ─────────────────────────────────────────────
  {
    label: "regulatory_resolution",
    titlePattern: /\b(certified\s+copies?\s+of\s+resolution|resolutions?\s+passed\s+in)\b/i,
    result: {
      event_type:                "regulatory_filing",
      importance_score:          2,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "regulatory_notice",
    titlePattern: /\b(notice\s+of\s+(agm|egm|annual|extraordinary|general\s+meeting))\b/i,
    result: {
      event_type:                "regulatory_filing",
      importance_score:          2,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
  {
    label: "regulatory_placement",
    titlePattern: /\b(placement|upload)\b.*\b(financial\s+statement|accounts?|report)\b/i,
    result: {
      event_type:                "regulatory_filing",
      importance_score:          2,
      catalyst_direction:        "neutral",
      is_price_sensitive:        false,
      classification_confidence: "high",
      needs_corporate_action:    false,
    },
  },
];

// ─── Main classification function ─────────────────────────────────────────────

/**
 * classifyAnnouncement: Returns a deterministic EventClassification for
 * an announcement given its title and raw_category.
 *
 * Evaluation order: rules are checked in CLASSIFICATION_RULES order.
 * If a rule specifies both titlePattern and categoryMatch, BOTH must match.
 * If only one is specified, only that condition is checked.
 * First match wins.
 */
export function classifyAnnouncement(
  title: string,
  rawCategory: "financial_results" | "board_meetings" | "others"
): EventClassification {
  for (const rule of CLASSIFICATION_RULES) {
    const titleMatches =
      rule.titlePattern == null || rule.titlePattern.test(title);
    const categoryMatches =
      rule.categoryMatch == null || rule.categoryMatch === rawCategory;

    if (titleMatches && categoryMatches) {
      return { ...rule.result };
    }
  }

  // No rule matched
  return {
    event_type:                "unclassified",
    importance_score:          1,
    catalyst_direction:        null,
    is_price_sensitive:        false,
    classification_confidence: "low",
    needs_corporate_action:    false,
  };
}

// ─── Batch classify ───────────────────────────────────────────────────────────

export interface AnnotatedAnnouncement {
  title:        string;
  raw_category: "financial_results" | "board_meetings" | "others";
  classification: EventClassification;
}

export function classifyBatch(
  announcements: Array<{ title: string; raw_category: "financial_results" | "board_meetings" | "others" }>
): AnnotatedAnnouncement[] {
  return announcements.map((ann) => ({
    ...ann,
    classification: classifyAnnouncement(ann.title, ann.raw_category),
  }));
}

// ─── Standalone test ─────────────────────────────────────────────────────────

if (
  process.argv[1]?.endsWith("event-classifier.ts") ||
  process.argv[1]?.endsWith("event-classifier.js")
) {
  const TEST_CASES: Array<{ title: string; category: "financial_results" | "board_meetings" | "others" }> = [
    { title: "Financial Results for the Quarter Ended March 31, 2026", category: "financial_results" },
    { title: "Transmission of Quarterly Report for the Period Ended March 31, 2026", category: "financial_results" },
    { title: "Newspaper clipping - Placement of Financial Statements on the Website", category: "financial_results" },
    { title: "Board Meeting", category: "board_meetings" },
    { title: "Certified Copies of Resolutions passed in 34th Annual General Meeting", category: "board_meetings" },
    { title: "Notice of the 34th Annual General Meeting of Bank Alfalah Limited", category: "board_meetings" },
    { title: "Newspaper Clippings - Notice of Interim Cash Dividend and Book Closure", category: "others" },
    { title: "Disclosure of Material Information - Bank Alfalah Limited", category: "others" },
    { title: "Notice of Book Closure for Sub-Division of Shares of Bank Alfalah Limited", category: "others" },
    { title: "Credit of final cash dividend of Bank Alfalah Limited", category: "others" },
    { title: "Announcement of 20% Bonus Shares", category: "others" },
    { title: "Rights Issue at Rs 30 per share", category: "others" },
  ];

  console.log("\n═══ Event Classifier Test ═══\n");
  for (const tc of TEST_CASES) {
    const result = classifyAnnouncement(tc.title, tc.category);
    const dir = result.catalyst_direction ?? "n/a";
    console.log(
      `[${result.classification_confidence.toUpperCase()}] ` +
      `${result.event_type.padEnd(22)} ` +
      `score:${result.importance_score} ` +
      `${dir.padEnd(8)} ` +
      `ca:${result.needs_corporate_action ? "Y" : "N"}`
    );
    console.log(`  "${tc.title}"\n`);
  }
}
