import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The App Group contract (plan / state / selection keys, Codable models) is
 * compiled separately into the module pod and each focus-lock extension, so the
 * four copies of FocusLockShared.swift must stay byte-identical.
 */
const APP_ROOT = join(__dirname, "../../..");
const COPIES = [
  "modules/munib-focus-lock/ios/FocusLockShared.swift",
  "targets/munib-tracker-focus-monitor/FocusLockShared.swift",
  "targets/munib-tracker-focus-shield/FocusLockShared.swift",
  "targets/munib-tracker-focus-action/FocusLockShared.swift",
];

describe("FocusLockShared.swift", () => {
  const [source, ...copies] = COPIES.map((p) =>
    readFileSync(join(APP_ROOT, p), "utf8").replaceAll("\r\n", "\n"),
  );

  it.each(COPIES.slice(1).map((p, i) => [p, i] as const))("%s matches the module copy", (_p, i) => {
    expect(copies[i]).toBe(source);
  });

  it("uses the shared widget App Group and the deep link the shield posts", () => {
    expect(source).toContain('static let appGroup = "group.app.munibtracker.widgets"');
    const action = readFileSync(
      join(APP_ROOT, "targets/munib-tracker-focus-action/ShieldActionExtension.swift"),
      "utf8",
    );
    expect(action).toContain('"route": "/mark-current"');
  });
});
