import fs from "node:fs";
import path from "node:path";

import type { Href } from "expo-router";

import {
  getCurrentPathname,
  goBackOrReplace,
  parentRouteFor,
  setCurrentPathname,
} from "@/lib/navigation";

afterEach(() => setCurrentPathname(null));

describe("goBackOrReplace", () => {
  const fallback = "/settings" as Href;

  it("pops when the router can dismiss", () => {
    const router = {
      back: jest.fn(),
      replace: jest.fn(),
      canDismiss: jest.fn(() => true),
    };

    goBackOrReplace(router, fallback);

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("replaces when there is nothing to dismiss", () => {
    const router = {
      back: jest.fn(),
      replace: jest.fn(),
      canDismiss: jest.fn(() => false),
    };

    goBackOrReplace(router, fallback);

    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith(fallback);
  });
});

describe("parentRouteFor", () => {
  it.each([
    ["/qaza/planner", "/qaza"],
    ["/hadith/bukhari", "/hadith"],
    ["/aqeedah/tawheed", "/aqeedah"],
    ["/quran", "/library"],
    ["/hadith", "/library"],
    ["/dua/detail/12", "/dua"],
    ["/quran/page/3?x=1", "/quran"],
    ["/learn-quran/tajweed/drill/madd", "/learn-quran/tajweed"],
    ["/settings/notifications/prayer", "/settings/notifications"],
    ["/settings/language", "/settings"],
    ["/masjids/node/42", "/masjids"],
    ["/fiqh/ghusl", "/library"],
    ["/tasbeeh/free", "/zikr"],
    ["/qaza/", "/library"],
    ["/(tabs)/library", null],
    ["/", null],
    ["/login", null],
    ["/search", null],
    ["/notifications", null],
    ["/profile", "/settings"],
    ["/credits", "/settings/about"],
  ])("%s -> %s", (path, parent) => {
    expect(parentRouteFor(path)).toBe(parent);
  });

  const appDir = path.join(__dirname, "..", "app");
  const routes: string[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), `${prefix}/${entry.name}`);
        continue;
      }
      const m = /^(.+)\.tsx$/.exec(entry.name);
      if (!m || m[1] === "_layout" || m[1].endsWith(".test")) continue;
      routes.push(m[1] === "index" ? prefix || "/" : `${prefix}/${m[1]}`);
    }
  };
  walk(appDir, "");

  it("resolves every route file to a non-home parent or a tab root", () => {
    expect(routes.length).toBeGreaterThan(100);
    for (const route of routes) {
      const parent = parentRouteFor(route);
      expect(parent === null ? route : parent).not.toBe("/");
      if (parent !== null) expect(parent).not.toBe(route);
    }
  });
});

describe("parentRouteFor targets", () => {
  const appDir = path.join(__dirname, "..", "app");
  /** Route templates without groups, e.g. `/hadith/[collection]`. */
  const templates: string[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const seg = /^\(.+\)$/.test(entry.name) ? "" : `/${entry.name}`;
        walk(path.join(dir, entry.name), `${prefix}${seg}`);
        continue;
      }
      const m = /^(.+)\.tsx$/.exec(entry.name);
      if (!m || m[1] === "_layout" || m[1].startsWith("+") || m[1].endsWith(".test")) continue;
      templates.push(m[1] === "index" ? prefix || "/" : `${prefix}/${m[1]}`);
    }
  };
  walk(appDir, "");
  const matchers = templates.map(
    (tpl) =>
      new RegExp(`^${tpl.replace(/\[\.\.\.[^\]]+\]/g, ".+").replace(/\[[^\]]+\]/g, "[^/]+")}$`),
  );
  const isRoute = (pathname: string) => matchers.some((re) => re.test(pathname));

  // A real pathname (dynamic segments filled in) must fall back to a screen
  // that exists — `goBackOrReplace(router, "/")` now replaces with it.
  it("always points at an existing route", () => {
    for (const tpl of templates) {
      const parent = parentRouteFor(tpl.replace(/\[[^\]]+\]/g, "x1"));
      if (parent !== null) expect([tpl, parent, isRoute(parent)]).toEqual([tpl, parent, true]);
    }
  });
});

describe("goBackOrReplace parent fallback", () => {
  const router = () => ({ back: jest.fn(), replace: jest.fn(), canDismiss: () => false });

  it("prefers the parent hub over the generic home fallback", () => {
    const r = router();
    goBackOrReplace(r, "/", "/qaza/planner");
    expect(r.replace).toHaveBeenCalledWith("/qaza");
  });

  it("keeps an explicit fallback", () => {
    const r = router();
    goBackOrReplace(r, "/quran" as Href, "/qaza/planner");
    expect(r.replace).toHaveBeenCalledWith("/quran");
  });

  it("keeps home without a pathname or parent", () => {
    const r = router();
    goBackOrReplace(r, "/");
    goBackOrReplace(r, "/", "/login");
    expect(r.replace).toHaveBeenNthCalledWith(1, "/");
    expect(r.replace).toHaveBeenNthCalledWith(2, "/");
  });

  it("reads the pathname tracked by the root stack for the generic fallback", () => {
    const r = router();
    setCurrentPathname("/hadith/bukhari");
    goBackOrReplace(r, "/");
    expect(getCurrentPathname()).toBe("/hadith/bukhari");
    expect(r.replace).toHaveBeenCalledWith("/hadith");
  });

  it.each([
    ["/dua/detail/42", "/dua"],
    ["/zikr/session/morning", "/zikr"],
    ["/learn-quran/tajweed/coach/madd", "/learn-quran/tajweed"],
    ["/settings/notifications/prayer", "/settings/notifications"],
    ["/qaza/roza", "/qaza"],
    ["/zakat", "/library"],
  ])("deep route %s falls back to %s", (pathname, parent) => {
    const r = router();
    setCurrentPathname(pathname);
    goBackOrReplace(r, "/");
    expect(r.replace).toHaveBeenCalledWith(parent);
  });

  it("an explicit pathname argument wins over the tracked one", () => {
    const r = router();
    setCurrentPathname("/hadith/bukhari");
    goBackOrReplace(r, "/", "/qaza/planner");
    expect(r.replace).toHaveBeenCalledWith("/qaza");
  });

  it("keeps explicit fallbacks and still pops when it can", () => {
    const r = router();
    setCurrentPathname("/hadith/bukhari");
    goBackOrReplace(r, "/quran" as Href);
    expect(r.replace).toHaveBeenCalledWith("/quran");
    const pop = { back: jest.fn(), replace: jest.fn(), canDismiss: () => true };
    goBackOrReplace(pop, "/");
    expect(pop.back).toHaveBeenCalledTimes(1);
    expect(pop.replace).not.toHaveBeenCalled();
  });
});
