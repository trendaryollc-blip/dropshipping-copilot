export type UserRole = "owner" | "admin" | "editor" | "viewer";
export type Permission =
  | "products:write"
  | "orders:write"
  | "settings:write"
  | "team:manage"
  | "billing:manage"
  | "workflows:manage"
  | "webhooks:manage";

const rolePermissions: Record<UserRole, Permission[]> = {
  owner: ["products:write", "orders:write", "settings:write", "team:manage", "billing:manage", "workflows:manage", "webhooks:manage"],
  admin: ["products:write", "orders:write", "settings:write", "team:manage", "workflows:manage", "webhooks:manage"],
  editor: ["products:write", "orders:write", "workflows:manage"],
  viewer: [],
};

export function can(role: UserRole = "viewer", permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function assertPermission(role: UserRole | undefined, permission: Permission): void {
  if (!can(role ?? "viewer", permission)) {
    throw new Error("Insufficient permissions");
  }
}

export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role];
}
