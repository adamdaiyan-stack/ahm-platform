/**
 * scripts/utils/supabase-admin.ts
 *
 * Supabase client for pipeline scripts — uses the SERVICE ROLE key.
 * This bypasses Row Level Security, which is correct for server-side
 * ingestion pipelines running in a trusted environment.
 *
 * NEVER import this file into Next.js pages or components.
 * Frontend code must use lib/supabase.ts (anon key).
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[supabase-admin] Missing required environment variable: ${key}\n` +
      `Pipeline scripts require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n` +
      `Add them to your .env.local or GitHub Actions secrets.`
    );
  }
  return value;
}

let _client: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (_client) return _client;

  const url = getEnv("SUPABASE_URL");
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  _client = createClient(url, key, {
    auth: {
      // Pipelines don't use auth — disable session persistence
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}

// Convenience export — matches the pattern used in services/api/*.ts
export const supabaseAdmin = getAdminClient();
