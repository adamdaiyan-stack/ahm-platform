/**
 * scripts/utils/pipeline-logger.ts
 *
 * Manages ingestion_runs rows throughout a pipeline execution.
 * Usage:
 *   const run = await PipelineLogger.start('daily_prices', '2026-05-19', 'dps_psx');
 *   // ... do work ...
 *   await run.complete({ upserted: 450, failed: 2, symbolsFailed: ['XYZ', 'ABC'] });
 *   // or on error:
 *   await run.fail(error);
 */

import { supabaseAdmin } from "./supabase-admin.js";
import { durationMs } from "./date-utils.js";

export type PipelineStatus = "running" | "success" | "partial" | "failed" | "skipped";
export type PipelineTrigger = "cron" | "manual" | "retry" | "backfill";

export interface RunSummary {
  fetched?: number;
  upserted?: number;
  skipped?: number;
  failed?: number;
  symbolsFailed?: string[];
  errorSummary?: string;
  errors?: unknown;
}

export class PipelineRun {
  private runId: string;
  private startedAt: Date;
  private pipelineName: string;

  constructor(runId: string, pipelineName: string) {
    this.runId = runId;
    this.startedAt = new Date();
    this.pipelineName = pipelineName;
  }

  async complete(summary: RunSummary): Promise<void> {
    const end = new Date();
    const failed = summary.failed ?? 0;
    const upserted = summary.upserted ?? 0;
    const status: PipelineStatus =
      failed === 0 ? "success" : upserted > 0 ? "partial" : "failed";

    const { error } = await supabaseAdmin
      .from("ingestion_runs")
      .update({
        status,
        records_fetched:  summary.fetched   ?? 0,
        records_upserted: upserted,
        records_skipped:  summary.skipped   ?? 0,
        records_failed:   failed,
        symbols_failed:   summary.symbolsFailed ?? [],
        error_summary:    summary.errorSummary ?? null,
        errors:           summary.errors ?? null,
        completed_at:     end.toISOString(),
        duration_ms:      durationMs(this.startedAt, end),
      })
      .eq("id", this.runId);

    if (error) {
      console.error(`[logger] Failed to update ingestion_runs: ${error.message}`);
    }

    const symbol = status === "success" ? "✅" : status === "partial" ? "⚠️" : "❌";
    console.log(
      `${symbol} [${this.pipelineName}] ${status.toUpperCase()} — ` +
      `upserted: ${upserted}, failed: ${failed}, ` +
      `duration: ${durationMs(this.startedAt, end)}ms`
    );
  }

  async fail(err: unknown): Promise<void> {
    const end = new Date();
    const message = err instanceof Error ? err.message : String(err);

    await supabaseAdmin
      .from("ingestion_runs")
      .update({
        status:        "failed",
        error_summary: message,
        errors:        { stack: err instanceof Error ? err.stack : null },
        completed_at:  end.toISOString(),
        duration_ms:   durationMs(this.startedAt, end),
      })
      .eq("id", this.runId);

    console.error(`❌ [${this.pipelineName}] FAILED — ${message}`);
  }

  async skip(reason: string): Promise<void> {
    const end = new Date();
    await supabaseAdmin
      .from("ingestion_runs")
      .update({
        status:        "skipped",
        error_summary: reason,
        completed_at:  end.toISOString(),
        duration_ms:   durationMs(this.startedAt, end),
      })
      .eq("id", this.runId);

    console.log(`⏭️  [${this.pipelineName}] SKIPPED — ${reason}`);
  }
}

export class PipelineLogger {
  static async start(
    pipelineName: string,
    runDate: string,
    source: string,
    trigger: PipelineTrigger = "cron"
  ): Promise<PipelineRun> {
    const { data, error } = await supabaseAdmin
      .from("ingestion_runs")
      .insert({
        pipeline_name:    pipelineName,
        pipeline_version: "1.0",
        run_date:         runDate,
        source,
        trigger,
        status:           "running",
        started_at:       new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) {
      // Don't crash the pipeline because logging failed — just warn and continue
      console.warn(`[logger] Could not create ingestion_run row: ${error?.message}`);
      // Return a no-op run object
      return new PipelineRun("no-op", pipelineName);
    }

    console.log(
      `🚀 [${pipelineName}] Starting — date: ${runDate}, source: ${source}, id: ${data.id}`
    );
    return new PipelineRun(data.id as string, pipelineName);
  }
}
