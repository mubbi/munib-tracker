import fs from "node:fs";
import path from "node:path";

import {
  effectiveBlocklist,
  isNeverBlocked,
  NEVER_BLOCK_PACKAGES,
  pickableApps,
} from "./allowlist";

const ctx = {
  ownPackage: "app.munibtracker",
  defaultDialer: "com.oem.dialer",
  defaultSms: "com.oem.sms",
  defaultLauncher: "com.oem.home",
};

describe("never-block rules", () => {
  it.each([
    "app.munibtracker",
    "com.oem.dialer",
    "com.oem.sms",
    "com.oem.home",
    "com.android.settings",
    "com.android.emergency",
    "com.google.android.dialer",
  ])("never blocks %s", (pkg) => {
    expect(isNeverBlocked(pkg, ctx)).toBe(true);
  });

  it("blocks ordinary apps the user chose, deduped", () => {
    expect(
      effectiveBlocklist(
        ["com.video.app", "app.munibtracker", "com.video.app", "com.oem.dialer", "com.game"],
        ctx,
      ),
    ).toEqual(["com.video.app", "com.game"]);
  });

  it("offers only pickable apps, sorted by label", () => {
    expect(
      pickableApps(
        [
          { packageName: "com.zeta", label: "Zeta" },
          { packageName: "com.android.settings", label: "Settings" },
          { packageName: "com.alpha", label: "Alpha" },
          { packageName: "com.alpha", label: "Alpha (dup)" },
        ],
        ctx,
        "en",
      ),
    ).toEqual([
      { packageName: "com.alpha", label: "Alpha" },
      { packageName: "com.zeta", label: "Zeta" },
    ]);
  });
});

describe("Kotlin parity", () => {
  it("FocusLockAllowlist.kt lists exactly NEVER_BLOCK_PACKAGES", () => {
    const kt = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../modules/munib-focus-lock/android/src/main/java/expo/modules/munibfocuslock/FocusLockAllowlist.kt",
      ),
      "utf8",
    );
    const block = kt.match(/NEVER_BLOCK: Set<String> = setOf\(([\s\S]*?)\)/)?.[1] ?? "";
    const kotlinList = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    expect(kotlinList).toEqual([...NEVER_BLOCK_PACKAGES]);
  });
});
