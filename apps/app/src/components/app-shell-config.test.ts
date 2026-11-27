import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Shell configuration the native navigation relies on (WP-4B).
 */
const appRoot = join(__dirname, "..", "..");

describe("Android predictive back (E-20)", () => {
  it("opts in to the system predictive back gesture", () => {
    const appJson = JSON.parse(readFileSync(join(appRoot, "app.json"), "utf8")) as {
      expo: { android: { predictiveBackGestureEnabled?: boolean } };
    };

    expect(appJson.expo.android.predictiveBackGestureEnabled).toBe(true);
  });
});

describe("root overlay order (G-92)", () => {
  const layout = readFileSync(join(appRoot, "src", "app", "_layout.tsx"), "utf8");

  it("mounts the toast host below the PIN lock gate", () => {
    const toast = layout.indexOf("<LockAwareToastHost />");
    const gate = layout.indexOf("<PinLockGate />");

    expect(toast).toBeGreaterThan(-1);
    expect(gate).toBeGreaterThan(toast);
    expect(layout).not.toMatch(/<ToastHost\s*\/>/);
  });
});
