// lib/auth.ts
// Authentication utilities — session reading, cookie handling, server-side guards.
// Built on Supabase Auth. Future: swap in custom JWT if needed.
//
// IMPORTANT: This file is server-only (no "use client").
// For client-side auth state use the AuthProvider / useAuth hook (future).

import { supabase } from "@/lib/supabase";
import type { AuthUser, UserRole } from "@/types/auth";

// ─── Session reading ──────────────────────────────────────────────────────────

/**
 * Get the current authenticated user from the Supabase session.
 * Returns null if not authenticated.
 * Safe to call from server components and API routes.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Role stored in user_metadata — default to retail_client for authenticated users
  const role: UserRole = (user.user_metadata?.role as UserRole) ?? "retail_client";

  return {
    id:         user.id,
    email:      user.email ?? "",
    role,
    name:       user.user_metadata?.name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    created_at: user.created_at,
  };
}

/**
 * Get current user role. Returns "guest" if not authenticated.
 */
export async function getCurrentRole(): Promise<UserRole> {
  const user = await getCurrentUser();
  return user?.role ?? "guest";
}

// ─── Server-side guards ───────────────────────────────────────────────────────

/**
 * Assert the current user is authenticated.
 * Throws a redirect-compatible error if not.
 * Use in server components / server actions that require auth.
 *
 * @example
 * const user = await requireAuth();
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    // In Next.js App Router, import { redirect } from "next/navigation" and call it
    // We throw here so callers can handle redirect themselves
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

/**
 * Assert the current user has a specific role or higher.
 * @example
 * await requireRole("premium_client"); // Blocks guests and retail clients
 */
export async function requireRole(minimumRole: UserRole): Promise<AuthUser> {
  const { roleAtLeast } = await import("@/lib/rbac");
  const user = await requireAuth();
  if (!roleAtLeast(user.role, minimumRole)) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

// ─── Session payload for middleware ──────────────────────────────────────────

/**
 * Decode the session from the Supabase JWT stored in cookies.
 * Used in middleware where we can't call Supabase directly.
 * Returns null if no valid session exists.
 */
export function decodeSessionFromToken(token: string | undefined): {
  userId: string;
  role: UserRole;
  email: string;
  exp: number;
} | null {
  if (!token) return null;
  try {
    // JWT payload is base64url encoded in the second segment
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8")
    );
    return {
      userId: payload.sub,
      email:  payload.email ?? "",
      role:   (payload.user_metadata?.role as UserRole) ?? "retail_client",
      exp:    payload.exp,
    };
  } catch {
    return null;
  }
}
