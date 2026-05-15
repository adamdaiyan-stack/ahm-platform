// types/auth.ts
// Authentication and RBAC type definitions.
// These mirror the future users/sessions schema — update when DB tables are added.

// ─── Roles ────────────────────────────────────────────────────────────────────

export type UserRole =
  | "guest"
  | "retail_client"
  | "premium_client"
  | "institutional_client"
  | "analyst"
  | "admin";

// Ordered by privilege level — higher index = more access
export const ROLE_HIERARCHY: UserRole[] = [
  "guest",
  "retail_client",
  "premium_client",
  "institutional_client",
  "analyst",
  "admin",
];

// ─── Permissions ──────────────────────────────────────────────────────────────

export type Permission =
  // Market & research
  | "view:market"
  | "view:research:public"
  | "view:research:premium"
  | "view:research:institutional"
  // Portfolio
  | "view:portfolio"
  | "view:holdings"
  | "view:transactions"
  | "view:watchlist"
  // Analyst tools
  | "view:analyst_tools"
  | "write:research"
  | "publish:research"
  // Admin
  | "view:admin"
  | "manage:users"
  | "manage:content"
  | "manage:platform";

// ─── User & Session ───────────────────────────────────────────────────────────

export type AuthUser = {
  id:         string;
  email:      string;
  role:       UserRole;
  name:       string | null;
  avatar_url: string | null;
  created_at: string;
};

export type AuthSession = {
  user:        AuthUser;
  access_token:  string;
  refresh_token: string;
  expires_at:    number; // Unix timestamp
};

// Lightweight shape stored in cookies / middleware
export type SessionPayload = {
  userId: string;
  role:   UserRole;
  email:  string;
  exp:    number;
};
