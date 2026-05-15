// lib/rbac.ts
// Role-Based Access Control — permission map and helpers.
// All permission logic lives here. Never hardcode roles in components.
//
// Usage:
//   import { hasPermission } from "@/lib/rbac";
//   if (!hasPermission(user.role, "view:research:premium")) redirect("/upgrade");

import type { UserRole, Permission } from "@/types/auth";

// ─── Permission Map ───────────────────────────────────────────────────────────
// Each role gets the permissions listed, PLUS all permissions of roles below it
// (handled by buildRolePermissions below).

const ROLE_OWN_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [
    "view:market",
    "view:research:public",
  ],
  retail_client: [
    "view:portfolio",
    "view:holdings",
    "view:transactions",
    "view:watchlist",
  ],
  premium_client: [
    "view:research:premium",
  ],
  institutional_client: [
    "view:research:institutional",
  ],
  analyst: [
    "view:analyst_tools",
    "write:research",
    "publish:research",
  ],
  admin: [
    "view:admin",
    "manage:users",
    "manage:content",
    "manage:platform",
  ],
};

// Role hierarchy — each role inherits all permissions from roles before it
const ROLE_ORDER: UserRole[] = [
  "guest",
  "retail_client",
  "premium_client",
  "institutional_client",
  "analyst",
  "admin",
];

// Pre-computed cumulative permission sets
function buildRolePermissions(): Map<UserRole, Set<Permission>> {
  const map = new Map<UserRole, Set<Permission>>();
  const accumulated = new Set<Permission>();

  for (const role of ROLE_ORDER) {
    for (const perm of ROLE_OWN_PERMISSIONS[role]) {
      accumulated.add(perm);
    }
    map.set(role, new Set(accumulated));
  }
  return map;
}

const ROLE_PERMISSIONS = buildRolePermissions();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Check if a role has a specific permission.
 * Guests always have public market/research access.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS.get(role)?.has(permission) ?? false;
}

/**
 * Check if a role has ALL of the given permissions.
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the given permissions.
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Return all permissions for a given role.
 */
export function getPermissions(role: UserRole): Permission[] {
  return Array.from(ROLE_PERMISSIONS.get(role) ?? []);
}

/**
 * Compare role privilege levels.
 * Returns true if roleA has equal or higher privilege than roleB.
 */
export function roleAtLeast(roleA: UserRole, roleB: UserRole): boolean {
  return ROLE_ORDER.indexOf(roleA) >= ROLE_ORDER.indexOf(roleB);
}

// ─── Route → Required Permission Map ─────────────────────────────────────────
// Used by middleware to enforce access without scattering role checks across pages.

export const PROTECTED_ROUTES: Array<{ pattern: RegExp; permission: Permission }> = [
  { pattern: /^\/portfolio/,        permission: "view:portfolio"         },
  { pattern: /^\/watchlist/,        permission: "view:watchlist"         },
  { pattern: /^\/admin/,            permission: "view:admin"             },
  { pattern: /^\/research\/premium/,permission: "view:research:premium"  },
];

/**
 * Determine the required permission for a given pathname.
 * Returns null if the route is public.
 */
export function getRequiredPermission(pathname: string): Permission | null {
  for (const { pattern, permission } of PROTECTED_ROUTES) {
    if (pattern.test(pathname)) return permission;
  }
  return null;
}
