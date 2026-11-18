/**
 * Shared `@/providers/app-version-provider` mock with mutable context state
 * (defaults: client 1.0.0, no pending update):
 *
 *   jest.mock("@/providers/app-version-provider", () =>
 *     require("@/test-support/mocks/app-version-provider").appVersionProviderMock);
 *   import { mockAppVersion, resetAppVersionMock } from "@/test-support/mocks/app-version-provider";
 *   Object.assign(mockAppVersion, { versionMeta: buildAppVersionMeta(), hasPendingUpdate: true });
 */
import type { ReactNode } from "react";

import type { AppVersionContextValue } from "@/providers/app-version-provider";

const defaults = (): Omit<AppVersionContextValue, "dismissUpdatePrompt" | "openUpdatePrompt"> => ({
  clientVersion: "1.0.0",
  versionMeta: null,
  updateRequired: "none",
  hasPendingUpdate: false,
  updatePromptDismissed: false,
  showUpdateModal: false,
  isHardUpdateBlocking: false,
  showSettingsBadge: false,
});

export const mockAppVersion: AppVersionContextValue = {
  ...defaults(),
  dismissUpdatePrompt: jest.fn(),
  openUpdatePrompt: jest.fn(),
};

export function resetAppVersionMock(): void {
  Object.assign(mockAppVersion, defaults());
  (mockAppVersion.dismissUpdatePrompt as jest.Mock).mockClear();
  (mockAppVersion.openUpdatePrompt as jest.Mock).mockClear();
}

export const appVersionProviderMock = {
  __esModule: true,
  AppVersionProvider: ({ children }: { children: ReactNode }) => children,
  useAppVersion: () => mockAppVersion,
  useAppVersionOptional: () => mockAppVersion,
};
