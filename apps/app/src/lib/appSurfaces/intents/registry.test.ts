import { readFileSync } from "node:fs";
import { join } from "node:path";

import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";

import {
  getIntentById,
  getIntentDeepLink,
  getIntentsForPlatform,
  INTENT_REGISTRY,
} from "@/lib/appSurfaces/intents/registry";

describe("INTENT_REGISTRY", () => {
  it("has unique ids", () => {
    const ids = INTENT_REGISTRY.map((intent) => intent.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a deep link for every navigation intent", () => {
    for (const intent of INTENT_REGISTRY.filter((item) => item.type === "navigation")) {
      const link = getIntentDeepLink(intent);
      expect(link).toMatch(/^munib-tracker:\/\//);
    }
  });

  it("gives every background mark-prayer intent a valid obligatory prayerId", () => {
    for (const intent of INTENT_REGISTRY.filter((item) => item.commandType === "mark-prayer")) {
      expect(intent.prayerId).toBeDefined();
      expect(OBLIGATORY_PRAYERS).toContain(intent.prayerId);
    }
  });

  it("exposes a named mark intent for every obligatory prayer", () => {
    const namedMarkIds = INTENT_REGISTRY.filter((item) => item.commandType === "mark-prayer").map(
      (item) => item.id,
    );
    for (const prayerId of OBLIGATORY_PRAYERS) {
      expect(namedMarkIds).toContain(`mark-${prayerId}`);
    }
  });

  it("looks up intents by id", () => {
    expect(getIntentById("open-quran")?.href).toBe("/quran");
    expect(getIntentById("does-not-exist")).toBeUndefined();
  });
});

describe("getIntentsForPlatform", () => {
  it("limits named-prayer mark intents to iOS", () => {
    const android = getIntentsForPlatform("android");
    expect(android.some((intent) => intent.commandType === "mark-prayer")).toBe(false);

    const ios = getIntentsForPlatform("ios");
    expect(ios.some((intent) => intent.commandType === "mark-prayer")).toBe(true);
  });

  it("shares navigation intents across both platforms", () => {
    const androidHrefs = getIntentsForPlatform("android").map((intent) => intent.href);
    const iosHrefs = getIntentsForPlatform("ios").map((intent) => intent.href);
    for (const href of ["/ramadan", "/quran/khatm", "/qaza", "/quran"]) {
      expect(androidHrefs).toContain(href);
      expect(iosHrefs).toContain(href);
    }
  });
});

describe("native mirrors", () => {
  const appRoot = join(__dirname, "../../../..");

  it("exposes every shared screen in the Android App Actions inventory", () => {
    const plugin = readFileSync(join(appRoot, "plugins/withExternalCommands.cjs"), "utf8");
    for (const intent of getIntentsForPlatform("android")) {
      if (intent.type !== "navigation" || !intent.href || intent.href === "/search") continue;
      expect(plugin).toContain(`url="munib-tracker://${intent.href.slice(1)}"`);
    }
    expect(plugin).toContain("actions.intent.GET_THING");
  });

  it("gives every shared screen a Siri MunibFeature case with the same route", () => {
    const swift = readFileSync(
      join(appRoot, "targets/munib-tracker-widgets/_shared/MunibFeatureIntents.swift"),
      "utf8",
    );
    for (const intent of getIntentsForPlatform("ios")) {
      if (intent.type !== "navigation" || !intent.href) continue;
      expect(swift).toContain(`return "${intent.href}"`);
    }
  });

  it("stays within Apple's 10 App Shortcuts limit", () => {
    const swift = readFileSync(
      join(appRoot, "targets/munib-tracker-intents/_shared/MunibAppIntents.swift"),
      "utf8",
    );
    const count = (swift.match(/^\s+AppShortcut\(/gm) ?? []).length;
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10);
  });
});
