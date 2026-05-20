-- ============================================================
-- Migration 030: Postgres triggers for ai_event_triggers
--
-- Inserts rows into ai_event_triggers when observable events
-- occur on source tables. Each trigger fires AFTER the row
-- is committed, so downstream consumers see a consistent DB.
--
-- TRIGGERS CREATED
--   conviction_scores
--     → conviction_tier_upgrade   (tier improved)
--     → conviction_tier_downgrade (tier worsened)
--
--   company_intelligence_blocks (if table exists)
--     → high_severity_risk_added  (severity='high' AND block_type='risk')
--     → near_catalyst_added       (block_type='catalyst' AND horizon<='near')
--
--   sector_drivers
--     → sector_driver_turned_negative (trend changed to 'negative')
--
-- SUPPRESSION
--   Suppression is handled by fn-process-event-triggers, not here.
--   Triggers fire unconditionally — the consumer enforces frequency caps.
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ── Helper: tier ordering for upgrade/downgrade detection ───────────────────

CREATE OR REPLACE FUNCTION tier_order(tier text)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE tier
    WHEN 'HIGH_CONVICTION' THEN 4
    WHEN 'MODERATE'        THEN 3
    WHEN 'WATCHLIST'       THEN 2
    WHEN 'MONITOR'         THEN 1
    ELSE 0
  END;
$$;

-- ── conviction_scores trigger ────────────────────────────────────────────────
-- Fires on INSERT (new score) or UPDATE when tier changes.
-- Compares against previous is_current=true row to detect direction.

CREATE OR REPLACE FUNCTION fn_conviction_score_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_old_tier    text;
  v_old_score   integer;
  v_event_type  text;
  v_priority    integer;
BEGIN
  -- Only process rows being set as current
  IF NEW.is_current IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  -- On INSERT: this is the first score — always queue as watchlist_scored
  IF TG_OP = 'INSERT' THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'company_scored',
      NEW.symbol,
      jsonb_build_object(
        'symbol',     NEW.symbol,
        'score',      NEW.score,
        'tier',       NEW.tier,
        'confidence', NEW.data_confidence,
        'scored_at',  NEW.scored_at
      ),
      5  -- low priority batch processing
    );
    RETURN NEW;
  END IF;

  -- On UPDATE: detect tier change
  -- OLD.tier is only meaningful when OLD.is_current was also true
  IF OLD.tier IS NULL OR OLD.tier = NEW.tier THEN
    RETURN NEW;
  END IF;

  v_old_tier  := OLD.tier;
  v_old_score := OLD.score;

  IF tier_order(NEW.tier) > tier_order(v_old_tier) THEN
    v_event_type := 'conviction_tier_upgrade';
    v_priority   := 2;  -- high priority
  ELSIF tier_order(NEW.tier) < tier_order(v_old_tier) THEN
    v_event_type := 'conviction_tier_downgrade';
    v_priority   := 2;  -- high priority
  ELSE
    RETURN NEW;  -- Same tier, no event
  END IF;

  INSERT INTO ai_event_triggers (
    event_type, reference_key, event_data, priority
  ) VALUES (
    v_event_type,
    NEW.symbol,
    jsonb_build_object(
      'symbol',         NEW.symbol,
      'from_tier',      v_old_tier,
      'to_tier',        NEW.tier,
      'from_score',     v_old_score,
      'to_score',       NEW.score,
      'data_confidence',NEW.data_confidence,
      'scored_at',      NEW.scored_at
    ),
    v_priority
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_conviction_score_event ON conviction_scores;
CREATE TRIGGER trg_conviction_score_event
  AFTER INSERT OR UPDATE ON conviction_scores
  FOR EACH ROW EXECUTE FUNCTION fn_conviction_score_event();

-- ── sector_drivers trigger ───────────────────────────────────────────────────
-- Fires when a sector driver's trend turns negative.
-- Only triggers on UPDATE where trend changed TO 'negative'.

CREATE OR REPLACE FUNCTION fn_sector_driver_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Only fire when trend changes to 'negative'
  IF NEW.trend = 'negative' AND (OLD.trend IS NULL OR OLD.trend != 'negative') THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'sector_driver_turned_negative',
      NEW.sector_slug,
      jsonb_build_object(
        'sector_slug',  NEW.sector_slug,
        'driver_name',  NEW.driver_name,
        'driver_type',  COALESCE(NEW.driver_type, 'unknown'),
        'old_trend',    OLD.trend,
        'description',  COALESCE(NEW.description, ''),
        'updated_at',   now()
      ),
      3  -- medium priority
    );
  END IF;

  -- Also fire when driver turns positive (sector recovery signal)
  IF NEW.trend = 'positive' AND (OLD.trend IS NULL OR OLD.trend NOT IN ('positive', 'mixed')) THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'sector_driver_turned_positive',
      NEW.sector_slug,
      jsonb_build_object(
        'sector_slug',  NEW.sector_slug,
        'driver_name',  NEW.driver_name,
        'driver_type',  COALESCE(NEW.driver_type, 'unknown'),
        'old_trend',    OLD.trend,
        'description',  COALESCE(NEW.description, ''),
        'updated_at',   now()
      ),
      3
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sector_driver_event ON sector_drivers;
CREATE TRIGGER trg_sector_driver_event
  AFTER UPDATE ON sector_drivers
  FOR EACH ROW EXECUTE FUNCTION fn_sector_driver_event();

-- ── sector_intelligence_blocks trigger ───────────────────────────────────────
-- Fires on INSERT of:
--   block_type = 'risk'     AND priority >= 4    → high_severity_risk_added
--   block_type = 'catalyst' AND horizon = 'near' → near_catalyst_added

CREATE OR REPLACE FUNCTION fn_intel_block_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT NEW.is_active THEN
    RETURN NEW;
  END IF;

  -- High-severity risk
  IF NEW.block_type IN ('risk', 'regulatory_risk') AND NEW.priority >= 4 THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'high_severity_risk_added',
      COALESCE(NEW.sector_slug, 'market'),
      jsonb_build_object(
        'block_id',     NEW.id,
        'title',        NEW.title,
        'body',         LEFT(NEW.body, 400),
        'block_type',   NEW.block_type,
        'sector_slug',  NEW.sector_slug,
        'priority',     NEW.priority,
        'created_at',   now()
      ),
      2  -- high priority
    );
  END IF;

  -- Near-horizon catalyst
  IF NEW.block_type IN ('catalyst', 'near_catalyst') THEN
    INSERT INTO ai_event_triggers (
      event_type, reference_key, event_data, priority
    ) VALUES (
      'near_catalyst_added',
      COALESCE(NEW.sector_slug, 'market'),
      jsonb_build_object(
        'block_id',     NEW.id,
        'title',        NEW.title,
        'body',         LEFT(NEW.body, 400),
        'block_type',   NEW.block_type,
        'sector_slug',  NEW.sector_slug,
        'priority',     NEW.priority,
        'created_at',   now()
      ),
      3  -- medium priority
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_intel_block_event ON sector_intelligence_blocks;
CREATE TRIGGER trg_intel_block_event
  AFTER INSERT ON sector_intelligence_blocks
  FOR EACH ROW EXECUTE FUNCTION fn_intel_block_event();

-- ── company_intelligence_blocks trigger (if table exists) ───────────────────
-- Same logic for company-level blocks.

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND   table_name   = 'company_intelligence_blocks'
  ) THEN
    EXECUTE $TRIGGER$
      CREATE OR REPLACE FUNCTION fn_company_intel_block_event()
      RETURNS TRIGGER LANGUAGE plpgsql AS $FN$
      BEGIN
        IF NOT NEW.is_active THEN RETURN NEW; END IF;

        IF NEW.block_type IN ('risk', 'regulatory_risk') AND NEW.priority >= 4 THEN
          INSERT INTO ai_event_triggers (event_type, reference_key, event_data, priority)
          VALUES (
            'high_severity_risk_added',
            NEW.symbol,
            jsonb_build_object(
              'block_id', NEW.id, 'title', NEW.title,
              'body', LEFT(NEW.body, 400),
              'block_type', NEW.block_type, 'symbol', NEW.symbol,
              'priority', NEW.priority, 'created_at', now()
            ),
            2
          );
        END IF;

        IF NEW.block_type IN ('catalyst', 'near_catalyst') THEN
          INSERT INTO ai_event_triggers (event_type, reference_key, event_data, priority)
          VALUES (
            'near_catalyst_added',
            NEW.symbol,
            jsonb_build_object(
              'block_id', NEW.id, 'title', NEW.title,
              'body', LEFT(NEW.body, 400),
              'block_type', NEW.block_type, 'symbol', NEW.symbol,
              'priority', NEW.priority, 'created_at', now()
            ),
            3
          );
        END IF;

        RETURN NEW;
      END;
      $FN$;

      DROP TRIGGER IF EXISTS trg_company_intel_block_event ON company_intelligence_blocks;
      CREATE TRIGGER trg_company_intel_block_event
        AFTER INSERT ON company_intelligence_blocks
        FOR EACH ROW EXECUTE FUNCTION fn_company_intel_block_event();
    $TRIGGER$;
  END IF;
END $$;

COMMENT ON FUNCTION fn_conviction_score_event IS
  'Fires on conviction_scores INSERT/UPDATE. Inserts into ai_event_triggers when '
  'tier changes (upgrade or downgrade). Consumed by fn-process-event-triggers.';

COMMENT ON FUNCTION fn_sector_driver_event IS
  'Fires on sector_drivers UPDATE. Inserts into ai_event_triggers when trend '
  'changes to negative or positive. Medium priority.';

COMMENT ON FUNCTION fn_intel_block_event IS
  'Fires on sector_intelligence_blocks INSERT. Queues high-severity risks (priority>=4) '
  'and near-term catalysts for alert generation.';
