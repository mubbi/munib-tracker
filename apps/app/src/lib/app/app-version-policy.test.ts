import { describe, expect, it } from "@jest/globals";
import { needsExplicitVersionPolling } from "@/lib/app/app-version-background-check";
import {
  clientNeedsUpdate,
  isHardUpdateBlockingApp,
  isPendingUpdate,
  normalizeIncomingVersionMeta,
  shouldShowSettingsUpdateBadge,
  shouldShowUpdateModal,
} from "@/lib/app/app-version-policy";
import { resolveAppPlatform } from "@/lib/app/resolve-app-platform";
import { buildAppVersionMeta } from "@/test-support/fixtures/app-version";
import { usePlatform } from "@/test-support/platform";

describe("appVersionPolicy", () => {
  const softMeta = {
    updateRequired: "soft" as const,
    latestVersion: "2.0.0",
    minSoftVersion: "1.5.0",
    minHardVersion: "1.0.0",
    message: null,
    storeUrl: null,
  };

  it("shows soft modal until dismissed", () => {
    expect(shouldShowUpdateModal(softMeta, false)).toBe(true);
    expect(shouldShowUpdateModal(softMeta, true)).toBe(false);
  });

  it("shows settings badge only after soft dismiss", () => {
    expect(shouldShowSettingsUpdateBadge(softMeta, false)).toBe(false);
    expect(shouldShowSettingsUpdateBadge(softMeta, true)).toBe(true);
  });

  it("blocks app on hard update", () => {
    expect(
      isHardUpdateBlockingApp("hard", true, {
        ...softMeta,
        updateRequired: "hard",
      }),
    ).toBe(true);
  });

  it("ignores stale meta when client already current", () => {
    expect(normalizeIncomingVersionMeta(null, softMeta, "2.0.0")).toBeNull();
  });
});

describe("needsExplicitVersionPolling", () => {
  it("polls for guests", () => {
    expect(needsExplicitVersionPolling({ isLoggedIn: false, isOnline: true })).toBe(true);
  });

  it("polls when offline", () => {
    expect(needsExplicitVersionPolling({ isLoggedIn: true, isOnline: false })).toBe(true);
  });

  it("skips interval poll when signed in and online", () => {
    expect(needsExplicitVersionPolling({ isLoggedIn: true, isOnline: true })).toBe(false);
  });
});

describe("clientNeedsUpdate", () => {
  it.each([
    ["hard, below the minimum", "0.4.0", { updateRequired: "hard" as const }, true],
    ["hard, at the minimum", "0.5.0", { updateRequired: "hard" as const }, false],
    ["soft, below the soft minimum", "1.0.0", {}, true],
    ["soft, below latest only", "1.1.5", {}, true],
    ["soft, current", "1.2.0", {}, false],
    ["none", "0.1.0", { updateRequired: "none" as const }, false],
  ])("%s → %p", (_label, client, overrides, expected) => {
    expect(clientNeedsUpdate(client, buildAppVersionMeta(overrides))).toBe(expected);
  });
});

describe("normalizeIncomingVersionMeta / isPendingUpdate", () => {
  it("drops metadata that requires nothing", () => {
    expect(
      normalizeIncomingVersionMeta(null, buildAppVersionMeta({ updateRequired: "none" }), "1.0.0"),
    ).toBeNull();
    expect(isPendingUpdate(null)).toBe(false);
  });

  it("keeps metadata the client still needs", () => {
    const meta = buildAppVersionMeta();
    expect(normalizeIncomingVersionMeta(null, meta, "1.0.0")).toBe(meta);
    expect(isPendingUpdate(meta)).toBe(true);
  });

  it("never badges settings for a hard update", () => {
    expect(
      shouldShowSettingsUpdateBadge(buildAppVersionMeta({ updateRequired: "hard" }), true),
    ).toBe(false);
    expect(shouldShowSettingsUpdateBadge(null, true)).toBe(false);
  });

  it("always shows the modal for hard updates", () => {
    expect(shouldShowUpdateModal(buildAppVersionMeta({ updateRequired: "hard" }), true)).toBe(true);
  });
});

describe("resolveAppPlatform", () => {
  it("is ios by default", () => {
    expect(resolveAppPlatform()).toBe("ios");
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("is web", () => {
      expect(resolveAppPlatform()).toBe("web");
    });
  });
});
