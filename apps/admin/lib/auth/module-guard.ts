import type { AdminRole } from "@munib-tracker/db/schema";
import { redirect } from "next/navigation";
import { canAccessModule, NAV_ITEMS, type NavItem } from "../permissions";

export function assertModuleAccess(role: AdminRole, href: string): void {
  const item = NAV_ITEMS.find((nav) => href === nav.href || href.startsWith(`${nav.href}/`));
  if (!item) return;
  if (!canAccessModule(role, item)) {
    redirect("/dashboard");
  }
}

export function getModuleForPath(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
