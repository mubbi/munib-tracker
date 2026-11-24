import { describe, expect, it } from "vitest";
import { isActivePath, menuIsActive } from "@/lib/nav";
import type { NavMenu } from "@/lib/site";

const MENU: NavMenu = {
  id: "learn",
  label: "Learn",
  href: "/resources",
  viewAllLabel: "All guides",
  columns: [{ heading: "Guides", items: [{ href: "/learn", label: "Library" }] }],
};

describe("isActivePath", () => {
  it("matches the page itself and its descendants", () => {
    expect(isActivePath("/features", "/features")).toBe(true);
    expect(isActivePath("/features/quran", "/features")).toBe(true);
  });

  it("does not match a sibling that only shares a prefix", () => {
    expect(isActivePath("/features-old", "/features")).toBe(false);
  });

  it("matches home only on the home page", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/about", "/")).toBe(false);
  });
});

describe("menuIsActive", () => {
  it("is active on the menu landing page, its children and its items", () => {
    expect(menuIsActive("/resources", MENU)).toBe(true);
    expect(menuIsActive("/resources/salah/x", MENU)).toBe(true);
    expect(menuIsActive("/learn", MENU)).toBe(true);
  });

  it("is inactive elsewhere", () => {
    expect(menuIsActive("/compare", MENU)).toBe(false);
  });
});
