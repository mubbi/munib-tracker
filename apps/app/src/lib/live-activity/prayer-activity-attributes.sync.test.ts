import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * ActivityKit matches Live Activities by attributes type name + Codable shape
 * in both the main app module and the widget extension. The two Swift files
 * must stay byte-for-byte identical (aside from the cross-reference comment).
 */
describe("PrayerActivityAttributes sync", () => {
  it("keeps module and widget attribute files identical", () => {
    // Test lives under src/lib/live-activity — app root is three levels up.
    const root = join(__dirname, "../../..");
    const modulePath = join(root, "modules/munib-live-activity/ios/PrayerActivityAttributes.swift");
    const widgetPath = join(root, "targets/munib-tracker-widgets/PrayerActivityAttributes.swift");

    const normalize = (src: string) =>
      src
        // Drop the one-line "duplicated in …" comment that differs by path.
        .replace(
          /\/\/\/ IMPORTANT: this file is duplicated verbatim in[\s\S]*?Change one → change the other\.\n/,
          "",
        )
        .replace(/\r\n/g, "\n")
        .trim();

    const moduleSrc = normalize(readFileSync(modulePath, "utf8"));
    const widgetSrc = normalize(readFileSync(widgetPath, "utf8"));
    expect(moduleSrc).toBe(widgetSrc);
  });
});
