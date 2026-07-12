import type { AdminRole } from "@munib-tracker/db/schema";

export type NavItem = {
  href: string;
  label: string;
  module: string;
  roles?: AdminRole[];
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", module: "1" },
  { href: "/users", label: "Users", module: "2" },
  {
    href: "/reports",
    label: "Content reports",
    module: "3",
    roles: ["super_admin", "support", "content"],
  },
  {
    href: "/feedback",
    label: "App feedback",
    module: "4",
    roles: ["super_admin", "support", "analytics"],
  },
  {
    href: "/contact-messages",
    label: "Contact messages",
    module: "14",
    roles: ["super_admin", "support"],
  },
  {
    href: "/oss-failures",
    label: "OSS download failures",
    module: "13",
    roles: ["super_admin", "ops", "content", "support"],
  },
  {
    href: "/versions",
    label: "App versions",
    module: "5",
    roles: ["super_admin", "ops", "support"],
  },
  {
    href: "/notifications",
    label: "Notifications",
    module: "6",
    roles: ["super_admin", "support", "ops", "content"],
  },
  { href: "/media", label: "User media", module: "7", roles: ["super_admin", "support", "ops"] },
  { href: "/sync", label: "Sync & devices", module: "8", roles: ["super_admin", "support", "ops"] },
  {
    href: "/auth-abuse",
    label: "Auth & abuse",
    module: "9",
    roles: ["super_admin", "support", "ops"],
  },
  { href: "/platform", label: "Platform", module: "10", roles: ["super_admin", "ops"] },
  { href: "/administration", label: "Administration", module: "11", roles: ["super_admin"] },
  {
    href: "/playbooks",
    label: "Playbooks",
    module: "12",
    roles: ["super_admin", "support", "ops", "content"],
  },
];

export function canAccessModule(role: AdminRole, item: NavItem): boolean {
  if (!item.roles) return true;
  if (role === "super_admin") return true;
  return item.roles.includes(role);
}

export function visibleNavItems(role: AdminRole): NavItem[] {
  return NAV_ITEMS.filter((item) => canAccessModule(role, item));
}

export function canManageAdmins(role: AdminRole): boolean {
  return role === "super_admin";
}

/** Release control — create/edit/delete app_versions rows. */
export function canManageAppVersions(role: AdminRole): boolean {
  return role === "super_admin" || role === "ops";
}

/** Admin broadcast notifications — marketing, product news, content. */
export function canSendBroadcasts(role: AdminRole): boolean {
  return role === "super_admin" || role === "ops" || role === "content";
}

export function canPerformSupportActions(role: AdminRole): boolean {
  return role === "super_admin" || role === "support";
}

export function canModerateReports(role: AdminRole): boolean {
  return role === "super_admin" || role === "support" || role === "content";
}
