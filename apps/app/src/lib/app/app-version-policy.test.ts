import { describe, expect, it } from "@jest/globals";
import { needsExplicitVersionPolling } from "@/lib/app/app-version-background-check";
import {
  isHardUpdateBlockingApp,
  normalizeIncomingVersionMeta,
  shouldShowSettingsUpdateBadge,
  shouldShowUpdateModal,
} from "@/lib/app/app-version-policy";

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
