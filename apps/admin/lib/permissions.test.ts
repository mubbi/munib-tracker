import type { AdminRole } from "@munib-tracker/db/schema";
import { describe, expect, it } from "vitest";
import {
  canAccessModule,
  canManageAdmins,
  canManageAppVersions,
  canModerateReports,
  canPerformSupportActions,
  canSendBroadcasts,
  NAV_ITEMS,
  type NavItem,
  visibleNavItems,
} from "./permissions";

const ROLES: AdminRole[] = ["super_admin", "support", "analytics", "ops", "content"];

function requireNavItem(module: string): NavItem {
  const item = NAV_ITEMS.find((candidate) => candidate.module === module);
  if (!item) {
    throw new Error(`Missing nav item for module ${module}`);
  }
  return item;
}

const unrestrictedItem: NavItem = { href: "/dashboard", label: "Dashboard", module: "1" };
const reportsItem = requireNavItem("3");
const feedbackItem = requireNavItem("4");
const administrationItem = requireNavItem("11");
const platformItem = requireNavItem("10");

describe("canAccessModule", () => {
  it("allows all roles when item has no roles restriction", () => {
    for (const role of ROLES) {
      expect(canAccessModule(role, unrestrictedItem)).toBe(true);
    }
  });

  it("allows super_admin for any restricted item", () => {
    for (const item of NAV_ITEMS) {
      expect(canAccessModule("super_admin", item)).toBe(true);
    }
  });

  it("restricts reports to super_admin, support, and content", () => {
    expect(canAccessModule("support", reportsItem)).toBe(true);
    expect(canAccessModule("content", reportsItem)).toBe(true);
    expect(canAccessModule("ops", reportsItem)).toBe(false);
    expect(canAccessModule("analytics", reportsItem)).toBe(false);
  });

  it("restricts feedback to super_admin, support, and analytics", () => {
    expect(canAccessModule("analytics", feedbackItem)).toBe(true);
    expect(canAccessModule("content", feedbackItem)).toBe(false);
    expect(canAccessModule("ops", feedbackItem)).toBe(false);
  });

  it("restricts administration to super_admin only", () => {
    expect(canAccessModule("super_admin", administrationItem)).toBe(true);
    expect(canAccessModule("support", administrationItem)).toBe(false);
    expect(canAccessModule("ops", administrationItem)).toBe(false);
  });

  it("restricts platform to super_admin and ops", () => {
    expect(canAccessModule("ops", platformItem)).toBe(true);
    expect(canAccessModule("support", platformItem)).toBe(false);
  });
});

describe("visibleNavItems", () => {
  it("returns all items for super_admin", () => {
    expect(visibleNavItems("super_admin")).toHaveLength(NAV_ITEMS.length);
  });

  it("hides administration for non-super_admin roles", () => {
    for (const role of ROLES.filter((r) => r !== "super_admin")) {
      const items = visibleNavItems(role);
      expect(items.some((item) => item.module === "11")).toBe(false);
    }
  });

  it("shows dashboard and users for every role", () => {
    for (const role of ROLES) {
      const modules = visibleNavItems(role).map((item) => item.module);
      expect(modules).toContain("1");
      expect(modules).toContain("2");
    }
  });
});

describe("canManageAdmins", () => {
  it.each([
    ["super_admin", true],
    ["support", false],
    ["analytics", false],
    ["ops", false],
    ["content", false],
  ] as const)("%s → %s", (role, expected) => {
    expect(canManageAdmins(role)).toBe(expected);
  });
});

describe("canManageAppVersions", () => {
  it.each([
    ["super_admin", true],
    ["ops", true],
    ["support", false],
    ["analytics", false],
    ["content", false],
  ] as const)("%s → %s", (role, expected) => {
    expect(canManageAppVersions(role)).toBe(expected);
  });
});

describe("canSendBroadcasts", () => {
  it.each([
    ["super_admin", true],
    ["ops", true],
    ["content", true],
    ["support", false],
    ["analytics", false],
  ] as const)("%s → %s", (role, expected) => {
    expect(canSendBroadcasts(role)).toBe(expected);
  });
});

describe("canPerformSupportActions", () => {
  it.each([
    ["super_admin", true],
    ["support", true],
    ["ops", false],
    ["analytics", false],
    ["content", false],
  ] as const)("%s → %s", (role, expected) => {
    expect(canPerformSupportActions(role)).toBe(expected);
  });
});

describe("canModerateReports", () => {
  it.each([
    ["super_admin", true],
    ["support", true],
    ["content", true],
    ["ops", false],
    ["analytics", false],
  ] as const)("%s → %s", (role, expected) => {
    expect(canModerateReports(role)).toBe(expected);
  });
});
