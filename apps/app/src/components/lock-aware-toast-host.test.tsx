import { screen } from "@testing-library/react-native";

import { LockAwareToastHost } from "@/components/lock-aware-toast-host";
import type { PinLockContextValue } from "@/features/pin-lock/providers/pin-lock-provider";
import { renderWithTheme } from "@/test-support/render";

let mockPinLock: Partial<PinLockContextValue> = {};

jest.mock("@/features/pin-lock", () => ({ usePinLock: () => mockPinLock }));
jest.mock("@/providers/toast-provider", () => ({
  ToastHost: require("@/test-support/mocks/stub-component").stubComponent("toast-host"),
}));

const UNLOCKED: Partial<PinLockContextValue> = {
  isReady: true,
  isLocked: false,
  hasStoredPin: true,
  pinSetupRequired: false,
};

async function renderHost(state: Partial<PinLockContextValue>) {
  mockPinLock = { ...UNLOCKED, ...state };
  await renderWithTheme(<LockAwareToastHost />);
}

describe("LockAwareToastHost (G-92)", () => {
  it("shows toasts while the app is unlocked", async () => {
    await renderHost({});

    expect(screen.getByText("toast-host")).toBeTruthy();
  });

  it.each([
    ["the PIN lock is up", { isLocked: true }],
    ["PIN setup is required", { pinSetupRequired: true }],
  ])("keeps toasts out of the tree above the lock while %s", async (_case, state) => {
    await renderHost(state);

    expect(screen.queryByText("toast-host", { includeHiddenElements: true })).toBeNull();
  });

  it("does not wait on a lock that has no stored PIN", async () => {
    await renderHost({ isLocked: true, hasStoredPin: false });

    expect(screen.getByText("toast-host")).toBeTruthy();
  });
});
