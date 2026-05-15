// middleware.ts
// Next.js Edge Middleware — route protection + auth enforcement.
// Runs before every matched request; no DB access (edge-safe only).
//
// Architecture:
//   1. Read Supabase session token from cookie
//   2. Decode JWT payload (no Supabase SDK — edge compatible)
//   3. Check required permission for the route
//   4. Redirect unauthenticated/unauthorized users appropriately

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole, Permission } from "@/types/auth";

// ─── Route protection config ──────────────────────────────────────────────────
// Mirrors lib/rbac.ts PROTECTED_ROUTES but kept here for edge compatibility.

const PROTECTED_ROUTES: Array<{ pattern: RegExp; permission: Permission; minRole: UserRole }> = [
  { pattern: /^\/portfolio/,  permission: "view:portfolio", minRole: "retail_client"      },
  { pattern: /^\/watchlist/,  permission: "view:watchlist", minRole: "retail_client"      },
  { pattern: /^\/admin/,      permission: "view:admin",     minRole: "admin"              },
];

// ─── Edge-safe JWT decode ─────────────────────────────────────────────────────

function decodeJWTPayload(token: string): {
  sub?: string;
  email?: string;
  exp?: number;
  user_metadata?: { role?: string };
} | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ─── Role hierarchy check ─────────────────────────────────────────────────────

const ROLE_ORDER: UserRole[] = [
  "guest", "retail_client", "premium_client",
  "institutional_client", "analyst", "admin",
];

function roleAtLeast(a: UserRole, b: UserRole): boolean {
  return ROLE_ORDER.indexOf(a) >= ROLE_ORDER.indexOf(b);
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find if this route requires protection
  const protection = PROTECTED_ROUTES.find(({ pattern }) => pattern.test(pathname));
  if (!protection) return NextResponse.next();

  // Read Supabase access token from cookie
  // Supabase stores the session under `sb-<ref>-auth-token` or `supabase-auth-token`
  const tokenCookie =
    request.cookies.get("sb-qiunhqgxsjyvcrcnfajl-auth-token")?.value ??
    request.cookies.get("supabase-auth-token")?.value;

  // Try to parse as JSON array (Supabase stores [access_token, refresh_token])
  let accessToken: string | undefined;
  if (tokenCookie) {
    try {
      const parsed = JSON.parse(tokenCookie);
      accessToken = Array.isArray(parsed) ? parsed[0] : tokenCookie;
    } catch {
      accessToken = tokenCookie;
    }
  }

  // No token → unauthenticated
  if (!accessToken) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("auth_required", "1");
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJWTPayload(accessToken);

  // Invalid or expired token
  if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("session_expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  // Check role
  const userRole: UserRole = (payload.user_metadata?.role as UserRole) ?? "retail_client";
  if (!roleAtLeast(userRole, protection.minRole)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/portfolio/:path*",
    "/watchlist/:path*",
    "/admin/:path*",
  ],
};
