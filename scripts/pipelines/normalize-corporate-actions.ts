/**
 * scripts/pipelines/normalize-corporate-actions.ts
 *
 * Pipeline: Promote classified announcements into structured corporate_actions rows.
 *
 * ── What this does ──────────────────────────────────────────────────────────
 * Reads announcements_raw rows where needs_corporate_action = true
 * and corporate_action_id IS NULL (unprocessed), then:
 *
 * 1. For each qualifying announcement, creates or updates a corporate_actions row
 * 2. Computes the adjustment_factor where applicable (bonus/split/rights)
 * 3. Links the announcement back to its corporate_action row
 * 4. Logs to ingestion_runs
 *
 * ── Idempotency ─────────────────────────────────────────────────────────────
 * Only processes announcements where corporate_action_id IS NULL.
 * After processing, the announcement is linked (corporate_action_id set),
 * so re-runs skip already-processed rows automatically.
 *
 * ── When to run ─────────────────────────────────────────────────────────────
 * After ingest:announcements. The ingest pipeline prints a reminder.
 * Recommended: run once daily after the announcements pipeline.
 *
 * ── Usage ───────────────────────────────────────────────────────────────────
 *   npm run normalize:corp-actions
 *   npm run normalize:corp-actions -- --dry-run    # Preview only, no DB writes
 */

import { supabaseAdmin }                from "../utils/supabase-admin.js";
import { PipelineLogger }               from "../utils/pipeline-logger.js";
import { flagDataIssues, type DataIssue } from "../utils/data-quality.js";
import { computeAdjustmentFactor }      from "../utils/announcement-parser.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const PIPELINE_NAME = "corporate_actions_normalization";
const SOURCE        = "announcements_raw";

// Map announcement event_type → corporate_actions.action_type
const EVENT_TO_ACTION: Record<string, string> = {
  cash_dividend:     "cash_dividend",
  bonus_shares:      "bonus_shares",
  stock_split:       "stock_split",
  reverse_split:     "reverse_split",
  rights_issue:      "rights_issue",
  merger_acquisition: "merger_acquisition",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingAnnouncement {
  id:               string;
  symbol:           string;
  announcement_date: string;
  title:            string;
  event_type:       string;
  structured_data:  Record<string, unknown> | null;
  document_url:     string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getPreviousClose(
  symbol: string,
  beforeDate: string
): Promise<number | null> {
  const { data } = await supabaseAdmin
    .from("daily_prices")
    .select("close")
    .eq("symbol", symbol)
    .lt("market_date", beforeDate)
    .order("market_date", { ascending: false })
    .limit(1)
    .single();

  return data?.close ?? null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args   = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const runDate = new Date().toISOString().slice(0, 10);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  AHM Corporate Actions Normalization`);
  console.log(`  Run date: ${runDate}${dryRun ? "  |  DRY RUN" : ""}`);
  console.log(`${"═".repeat(60)}\n`);

  const run = await PipelineLogger.start(PIPELINE_NAME, runDate, SOURCE, "cron");

  try {
    // ── Step 1: Load pending announcements ──────────────────────────────────
    console.log("Loading pending announcements (needs_corporate_action = true, unlinked)...");

    const { data: pending, error: fetchError } = await supabaseAdmin
      .from("announcements_raw")
      .select("id, symbol, announcement_date, title, event_type, structured_data, document_url")
      .eq("needs_corporate_action", true)
      .is("corporate_action_id", null)
      .order("announcement_date", { ascending: true });

    if (fetchError) throw new Error(`Failed to load pending announcements: ${fetchError.message}`);

    const rows = (pending ?? []) as PendingAnnouncement[];
    console.log(`  Found ${rows.length} pending announcement(s)\n`);

    if (rows.length === 0) {
      console.log("  Nothing to process.");
      await run.complete({ fetched: 0, upserted: 0, failed: 0 });
      return;
    }

    // ── Step 2: Process each announcement ──────────────────────────────────
    let processed = 0;
    let skipped   = 0;
    let failed    = 0;
    const qualityIssues: DataIssue[] = [];

    for (const ann of rows) {
      const actionType = EVENT_TO_ACTION[ann.event_type];
      if (!actionType) {
        // Shouldn't happen — but guard against stale data
        skipped++;
        continue;
      }

      const sd = ann.structured_data ?? {};

      // ── Build the corporate_actions row ──────────────────────────────────
      const caRow: Record<string, unknown> = {
        symbol:            ann.symbol,
        action_type:       actionType,
        announced_date:    ann.announcement_date,   // new column (added in 010b)
        announcement_date: ann.announcement_date,   // legacy column — keep in sync
        status:            "announced",
        source:            "dps_psx",
        announcement_url:  ann.document_url,
        notes:             ann.title,
      };

      // Populate type-specific fields from structured_data
      if (actionType === "cash_dividend") {
        if (sd.cash_dividend != null) caRow.cash_dividend = sd.cash_dividend;
        if (sd.period        != null) caRow.period        = sd.period;
        if (sd.financial_year != null) caRow.financial_year = sd.financial_year;
      }

      if (actionType === "bonus_shares") {
        if (sd.bonus_percent != null) caRow.bonus_percent = sd.bonus_percent;
      }

      if (actionType === "stock_split" || actionType === "reverse_split") {
        if (sd.split_ratio != null) caRow.split_ratio = sd.split_ratio;
      }

      if (actionType === "rights_issue") {
        if (sd.rights_ratio != null) caRow.rights_ratio = sd.rights_ratio;
        if (sd.rights_price != null) caRow.rights_price = sd.rights_price;
      }

      // ── Compute adjustment factor ─────────────────────────────────────────
      let prevClose: number | null = null;
      if (actionType === "rights_issue") {
        prevClose = await getPreviousClose(ann.symbol, ann.announcement_date);
      }

      const adjustmentFactor = computeAdjustmentFactor({
        actionType,
        bonusPercent: sd.bonus_percent as number | null,
        splitRatio:   sd.split_ratio  as number | null,
        rightsRatio:  sd.rights_ratio as number | null,
        rightsPrice:  sd.rights_price as number | null,
        prevClose,
      });

      if (adjustmentFactor !== null) {
        caRow.adjustment_factor = adjustmentFactor;
      }

      // ── Validate required fields ─────────────────────────────────────────
      if (actionType === "cash_dividend" && caRow.cash_dividend == null) {
        qualityIssues.push({
          entityType:  "corporate_action",
          symbol:      ann.symbol,
          marketDate:  ann.announcement_date,
          issueType:   "parse_error",
          severity:    "warning",
          description: `cash_dividend amount could not be parsed from: "${ann.title.slice(0, 100)}"`,
          source:      SOURCE,
        });
        // Still create the row — analyst can fill in the amount manually
      }

      if (dryRun) {
        console.log(`  [DRY RUN] Would create ${actionType} for ${ann.symbol}:`);
        console.log(`    announced: ${ann.announcement_date}`);
        if (caRow.cash_dividend)    console.log(`    cash_dividend: ${caRow.cash_dividend}`);
        if (caRow.bonus_percent)    console.log(`    bonus_percent: ${caRow.bonus_percent}%`);
        if (caRow.split_ratio)      console.log(`    split_ratio: ${caRow.split_ratio}`);
        if (caRow.adjustment_factor) console.log(`    adj_factor: ${caRow.adjustment_factor}`);
        console.log(`    "${ann.title.slice(0, 80)}"`);
        processed++;
        continue;
      }

      // ── Upsert into corporate_actions ────────────────────────────────────
      // Check for existing row (duplicate announcement for same event)
      const { data: existing } = await supabaseAdmin
        .from("corporate_actions")
        .select("id")
        .eq("symbol", ann.symbol)
        .eq("action_type", actionType)
        .eq("announced_date", ann.announcement_date)
        .limit(1)
        .single();

      let corporateActionId: number | null = null;

      if (existing?.id) {
        // Link to existing row — don't overwrite manually curated data
        corporateActionId = existing.id;
      } else {
        // Insert new corporate_actions row
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from("corporate_actions")
          .insert(caRow)
          .select("id")
          .single();

        if (insertError) {
          console.warn(`  ⚠ Failed to insert corporate_action for ${ann.symbol} (${actionType}): ${insertError.message}`);
          failed++;

          qualityIssues.push({
            entityType:  "corporate_action",
            symbol:      ann.symbol,
            marketDate:  ann.announcement_date,
            issueType:   "parse_error",
            severity:    "warning",
            description: `Failed to insert corporate_action: ${insertError.message}`,
            source:      SOURCE,
          });
          continue;
        }

        corporateActionId = inserted?.id ?? null;
      }

      // ── Link announcement back to corporate_action ────────────────────────
      if (corporateActionId) {
        const { error: linkError } = await supabaseAdmin
          .from("announcements_raw")
          .update({
            corporate_action_id: corporateActionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", ann.id);

        if (linkError) {
          console.warn(`  ⚠ Failed to link announcement ${ann.id}: ${linkError.message}`);
        }
      }

      processed++;
      if (processed % 10 === 0) process.stdout.write(".");
    }

    if (processed > 0 && !dryRun) process.stdout.write("\n");

    // ── Step 3: Write quality flags ─────────────────────────────────────────
    if (qualityIssues.length > 0) {
      await flagDataIssues(qualityIssues);
    }

    // ── Summary ─────────────────────────────────────────────────────────────
    console.log(`\n  ✓ Processed: ${processed}  |  Skipped: ${skipped}  |  Failed: ${failed}`);
    if (dryRun) {
      console.log("\n  DRY RUN complete — no DB writes made. Remove --dry-run to apply.");
    }

    await run.complete({
      fetched:  rows.length,
      upserted: processed,
      failed,
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
