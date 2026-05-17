// services/api/index.ts — barrel export for all data services.
// All components import from "@/services/api" — never from supabase directly.

export * from "./companies";
export * from "./market";
export * from "./research";
export * from "./intelligence";
export * from "./prices";
export * from "./fundamentals";
