import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { APP_WIDGET_NAMES } from "@/lib/appSurfaces/widgets/constants";

const APP = join(__dirname, "../../../..");

describe("iOS widget Localizable.xcstrings", () => {
  it("is generated from the app catalogs (run scripts/generate-widget-xcstrings.mjs)", () => {
    const result = spawnSync(
      process.execPath,
      ["scripts/generate-widget-xcstrings.mjs", "--check"],
      {
        cwd: APP,
        encoding: "utf8",
      },
    );
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  });

  it("names every widget the app ships", () => {
    const xc = JSON.parse(
      readFileSync(join(APP, "targets/munib-tracker-widgets/Localizable.xcstrings"), "utf8"),
    ) as { strings: Record<string, unknown> };
    const swift = readFileSync(
      join(APP, "targets/munib-tracker-widgets/PrayerWidgets.swift"),
      "utf8",
    );
    for (const name of APP_WIDGET_NAMES) {
      expect(swift).toContain(`let kind = "${name}"`);
    }
    const keys = [...swift.matchAll(/LocalizedStringResource\("(widget\.gallery\.[\w.]+)"/g)].map(
      (m) => m[1],
    );
    expect(keys.length).toBeGreaterThanOrEqual(APP_WIDGET_NAMES.length * 2);
    for (const key of keys) expect(xc.strings[key]).toBeDefined();
  });
});
