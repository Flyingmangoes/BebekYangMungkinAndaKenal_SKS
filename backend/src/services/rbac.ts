import { AuthUser } from "../models/model_list";

export const ROLES = ["admin", "employee", "user", "guest"] as const;
export type Role = (typeof ROLES)[number];

export const RESOURCES = [
  "profile", "phq9", "checkin", 
  "essay", "mission", "user", 
  "streak", "article"
] as const;
export type Resource = (typeof RESOURCES)[number];

export type Action = "create" | "read" | "update" | "delete";
export type Scope = "own" | "any";
export type Permission = `${Resource}:${Action}:${Scope}`;

export const ROLE_PERMISSIONS = {
  guest: [
    "phq9:read:own",
    "phq9:create:own",
    "mission:read:any"
  ],

  user: [
    "profile:read:own", 
    "profile:update:own", 
    "profile:delete:own",
    "user:update:own",
    "user:read:own",
    "phq9:create:own", 
    "phq9:read:own",
    "streak:read:own",
    "streak:update:own",
    "streak:create:own",
    "checkin:create:own", 
    "checkin:read:own", 
    "checkin:update:own",
    "essay:create:own", 
    "essay:read:own", 
    "essay:delete:own",
    "mission:read:own"
  ],

  employee: [
    "mission:create:any", 
    "mission:update:any", 
    "mission:delete:any",
    "article:create:any",
    "article:update:any",
    "article:delete:any",
  ],

  admin: [
    "profile:read:any",
    "user:create:any",
    "user:read:any", 
    "user:update:any", 
    "user:delete:any",
    "mission:create:any", 
    "mission:update:any", 
    "mission:delete:any",
    "article:create:any",
    "article:update:any",
    "article:delete:any",
  ],
} as const satisfies Record<Role, readonly Permission[]>;

function has(role: AuthUser["role"], p: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role as Role] ?? [];
  return (permissions as readonly Permission[]).includes(p);
}

export function canAccess(role: AuthUser["role"], resource: Resource, action: Action): boolean {
  return has(role, `${resource}:${action}:any`) || has(role, `${resource}:${action}:own`);
}

export function can(user: AuthUser, resource: Resource, action: Action, ownerId?: string): boolean {
  if (has(user.role, `${resource}:${action}:any`)) return true;
  return ownerId !== undefined
    && ownerId === user.userId
    && has(user.role, `${resource}:${action}:own`);
}