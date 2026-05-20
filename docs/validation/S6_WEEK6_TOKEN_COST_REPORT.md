# Sprint 6 — Token Cost Report
## Claude API Usage Estimates, Cost Projections, and Optimisation Notes

**Sprint:** 6, Week 6  
**Date:** 2026-05-20  
**Model:** claude-sonnet-4-6 (all templates use `model_target: claude-sonnet-4-6`)  
**Pricing basis:** Claude Sonnet 4.6 standard API pricing at time of sprint  
**Note:** This is a static projection — live token counts are logged in `ai_generation_jobs` and `ai_outputs.total_tokens`. Actual figures should be pulled from DB after first production run.

---

## 1. Pricing Reference

Claude Sonnet 4.6:
- Input tokens:  $3.00 per 1M tokens
- Output tokens: $15.00 per 1M tokens

All projections below use these rates. Cached outputs (cache hits) cost $0.00.

---

## 2. Per-Generation Token Estimates

Estimated from prompt template sizes + typical output lengths. Template sizes measured from migration 027.

| Output Type | Est. Input Tokens | Est. Output Tokens | Total Tokens | Cost/Generation |
|---|---|---|---|---|
| company_narrative | ~1,800 | ~350 | ~2,150 | $0.0108 |
| conviction_interpretation | ~600 | ~80 | ~680 | $0.0030 |
| risk_summary | ~500 | ~120 | ~620 | $0.0033 |
| catalyst_summary | ~450 | ~120 | ~570 | $0.0031 |
| peer_comparison | ~800 | ~160 | ~960 | $0.0048 |
| sector_brief | ~2,500 | ~280 | ~2,780 | $0.0150 |
| market_summary (long) | ~2,000 | ~320 | ~2,320 | $0.0120 |
| market_summary (short) | ~2,000 | ~180 | ~2,180 | $0.0105 |
| alert_summary | ~400 | ~60 | ~460 | $0.0021 |

**Cost/generation = (input × $3 + output × $15) / 1,000,000**

---

## 3. PSX Universe Size Assumptions

| Assumption | Value |
|---|---|
| Active PSX companies in AHM system | 100 (conservative) |
| Sectors | 7 |
| Alert events per day (steady state) | 10–30 |
| Daily market snapshots | 2 (long + short per snapshot_type) |

---

## 4. Generation Frequency per Output Type

| Output Type | TTL | Full Universe Regeneration Cycle |
|---|---|---|
| company_narrative | 72h | Every 3 days, all 100 companies |
| conviction_interpretation | 48h | Every 2 days, all 100 companies |
| risk_summary | 48h | Every 2 days (if wired) |
| catalyst_summary | 48h | Every 2 days (if wired) |
| peer_comparison | 168h | Weekly |
| sector_brief | 168h | Weekly, all 7 sectors |
| market_summary (long + short) | 24h | Daily |
| alert_summary | No cache | Per event (~10–30/day) |

**Note:** In practice, generation only occurs when input changes (input_hash differs). The 72h/48h TTLs are ceilings. A company whose conviction scores haven't changed since the last generation will NOT be regenerated at TTL expiry unless scores or intelligence blocks change. Actual generation frequency will be lower than the TTL-based cycle.

---

## 5. Steady-State Daily Cost Projection

### 5.1 Company-Level Outputs (100 companies)

| Output Type | Regen/Day | Generations/Day | Cost/Day |
|---|---|---|---|
| company_narrative | Every 3 days | 100 / 3 ≈ 33 | $0.36 |
| conviction_interpretation | Every 2 days | 100 / 2 = 50 | $0.15 |

Subtotal company outputs: **~$0.51/day**

### 5.2 Sector-Level Outputs (7 sectors)

| Output Type | Regen/Day | Generations/Day | Cost/Day |
|---|---|---|---|
| sector_brief | Weekly | 7 / 7 = 1/day | $0.015 |

Subtotal sector outputs: **~$0.015/day**

### 5.3 Market Snapshots

| Output Type | Generations/Day | Cost/Day |
|---|---|---|
| market_summary long + short | 2 | $0.023 |

Subtotal market: **~$0.023/day**

### 5.4 Alert Summaries

| Scenario | Events/Day | Cost/Day |
|---|---|---|
| Low volume (quiet market) | 10 | $0.021 |
| Medium volume | 20 | $0.042 |
| High volume (volatile day) | 50 | $0.105 |

Subtotal alerts (medium): **~$0.042/day**

### 5.5 Total Daily Cost (Steady State)

| Category | Daily Cost |
|---|---|
| Company outputs | $0.51 |
| Sector outputs | $0.015 |
| Market snapshots | $0.023 |
| Alerts (medium volume) | $0.042 |
| **Total** | **~$0.59/day** |

**Monthly projection:** ~$17.70/month

---

## 6. PSX Scale-Up Projection

| Universe Size | Additional company narratives/day | Added Daily Cost | Total Monthly |
|---|---|---|---|
| 100 companies (current) | 33 | — | ~$17.70 |
| 200 companies | 67 | +$0.51 | ~$33 |
| 400 companies | 133 | +$1.53 | ~$64 |

**Scaling is linear** — no shared context across companies means no batch savings from grouping. The only lever is cache hit rate.

---

## 7. Cache Hit Rate Impact

In a low-change-frequency market (conviction scores stable, no new intel blocks), the actual regeneration rate will be well below TTL-driven ceiling:

| Scenario | Cache Hit Rate | Actual Daily Cost |
|---|---|---|
| 80% of companies unchanged per day | 80% | ~$0.20/day |
| 50% unchanged | 50% | ~$0.38/day |
| All change daily (high volatility) | 0% | ~$0.59/day |

**Expected realistic scenario:** 80–90% cache hits in steady state (most companies are not re-scored daily). Daily cost likely closer to **$0.15–$0.25/day**.

---

## 8. Token Optimisation Notes

### 8.1 High-impact levers

**Company narrative system prompt:** At ~800 tokens, the system prompt is a fixed cost per generation. This cannot be reduced without weakening constraint guarantees. Accept as-is.

**Sector brief:** At ~2,500 input tokens, the richest context — 6 data sources assembled per sector. Reducing `intelligence_blocks.limit(12)` to limit(6) would cut ~600 input tokens per sector brief. Trade-off: less intel context for the LLM.

**Alert summary:** At ~400 input tokens and ~60 output tokens, already the leanest type. No optimisation needed.

**peer_comparison:** Currently seeded as a template but not wired into any active generation. Zero cost until activated. When activated, the 168h TTL makes it the cheapest on a per-day basis (1 generation per 7 days).

### 8.2 Low-impact levers (not recommended)

- Reducing temperature: no token impact
- Reducing max_tokens: reduces completion ceiling but not actual output cost (charged on actual output tokens, not max_tokens)

### 8.3 Phase 2 consideration

If the PSX universe grows to 300+ companies, consider batching conviction_interpretation (2-sentence output, 680 tokens) with company_narrative in the same Claude call. Would require a combined prompt architecture but could cut API call overhead.

---

## 9. Audit Trail for Live Verification

Once production generation begins, actual token counts are available via:

```sql
-- Per output type costs (live)
SELECT
  output_type,
  COUNT(*) AS generations,
  SUM(prompt_tokens)     AS total_input_tokens,
  SUM(completion_tokens) AS total_output_tokens,
  SUM(total_tokens)      AS total_tokens,
  ROUND(SUM(prompt_tokens) * 3.0 / 1000000
      + SUM(completion_tokens) * 15.0 / 1000000, 4) AS estimated_cost_usd
FROM ai_outputs
WHERE created_at > now() - interval '30 days'
GROUP BY output_type
ORDER BY estimated_cost_usd DESC;
```

```sql
-- Cache hit rate
SELECT
  output_type,
  COUNT(*) FILTER (WHERE is_current AND input_hash IS NOT NULL) AS cache_hits,
  COUNT(*) FILTER (WHERE NOT is_current AND total_tokens > 0) AS actual_generations
FROM ai_outputs
GROUP BY output_type;
```

---

## Summary

| Metric | Value |
|---|---|
| Model | claude-sonnet-4-6 |
| Estimated steady-state daily cost | $0.59/day (ceiling) |
| Realistic daily cost (80% cache hits) | ~$0.15–$0.25/day |
| Monthly cost projection | ~$5–$18/month |
| Highest cost output type | company_narrative ($0.0108/gen) |
| Lowest cost output type | alert_summary ($0.0021/gen) |
| Cost at 400 companies | ~$64/month (ceiling) |

**Conclusion:** At current PSX scope (100 companies, 7 sectors), Claude API costs are immaterial. The caching architecture ensures the vast majority of page reads are zero-cost. Cost monitoring via `ai_outputs` and `ai_generation_jobs` tables is in place for ongoing tracking.
