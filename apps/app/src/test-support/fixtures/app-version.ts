import type { AppVersionMeta } from "@munib-tracker/api-client";

/** Server version metadata recommending a soft update to 1.2.0 (client 1.0.0 needs it). */
export function buildAppVersionMeta(overrides: Partial<AppVersionMeta> = {}): AppVersionMeta {
  return {
    updateRequired: "soft",
    latestVersion: "1.2.0",
    minSoftVersion: "1.1.0",
    minHardVersion: "0.5.0",
    ...overrides,
  };
}
