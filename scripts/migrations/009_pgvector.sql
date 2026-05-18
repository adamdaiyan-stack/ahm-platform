-- ============================================================
-- Migration 009: pgvector + intelligence_embeddings
-- Enables semantic search over all intelligence content.
-- The embeddings table is NOT populated in this sprint —
-- this migration just prepares the infrastructure.
-- Safe to run multiple times (idempotent).
-- ============================================================

-- Enable pgvector extension (available on all Supabase plans)
CREATE EXTENSION IF NOT EXISTS vector;

-- ── intelligence_embeddings ───────────────────────────────────────────────────
-- One row per embeddable intelligence entity.
-- Populated by Phase 2 embedding pipeline (not this sprint).

CREATE TABLE IF NOT EXISTS intelligence_embeddings (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table  text    NOT NULL,
  -- 'sector_intelligence_blocks' | 'company_intelligence_blocks'
  -- | 'research_reports' | 'announcements' | 'earnings_calendar'
  source_id     text    NOT NULL,        -- The UUID or ID from the source table
  content_hash  text    NOT NULL,        -- SHA-256 of embedded content text
  -- Used to detect when content has changed and re-embedding is needed
  embedding     vector(1536),            -- OpenAI text-embedding-3-small
  -- Voyage AI finance-2 model uses 1024 dimensions — update if switching
  model         text    NOT NULL DEFAULT 'text-embedding-3-small',
  token_count   int,                     -- Tokens used (for cost tracking)
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),

  UNIQUE (source_table, source_id)
);

-- IVFFlat index for approximate nearest-neighbor search
-- lists = 100 is appropriate for up to ~1M vectors
-- Rebuild with higher lists if embedding count exceeds 500K
CREATE INDEX IF NOT EXISTS embeddings_cosine_idx
  ON intelligence_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

COMMENT ON TABLE intelligence_embeddings IS
  'Semantic embeddings of all intelligence content. '
  'Populated by Phase 2 embedding pipeline. '
  'Enables semantic search: find intelligence blocks related to a theme without exact keyword match.';

-- ── Semantic search helper function ─────────────────────────────────────────
-- Usage: SELECT * FROM match_intelligence_blocks('[...embedding...]', 0.7, 5);
-- Returns the top N intelligence blocks most similar to the query embedding.

CREATE OR REPLACE FUNCTION match_intelligence_blocks(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  source_table  text,
  source_id     text,
  similarity    float
)
LANGUAGE sql STABLE AS $$
  SELECT
    source_table,
    source_id,
    1 - (embedding <=> query_embedding) AS similarity
  FROM intelligence_embeddings
  WHERE 1 - (embedding <=> query_embedding) > similarity_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
