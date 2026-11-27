import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import DebtsScreen from "@/app/debts/index";
import { debtsVault } from "@/lib/debts/debts-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { resetToastMock } from "@/test-support/mocks/toast-provider";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { resetVaultTestState } from "@/test-support/mocks/vault";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(() => Promise.resolve()),
}));
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
// No app PIN: the VaultLockGate opens straight away.
const mockPinLock = {
  isReady: true,
  isPinEnabled: false,
  hasStoredPin: false,
  biometricsAvailable: false,
  unlock: jest.fn(),
  unlockWithBiometrics: jest.fn(),
};
jest.mock("@/features/pin-lock/providers/pin-lock-provider", () => ({
  ...jest.requireActual("@/features/pin-lock/providers/pin-lock-provider"),
  usePinLock: () => mockPinLock,
}));
jest.mock("@/lib/platform/is-tv", () => ({ isTV: jest.fn(() => false) }));

beforeEach(async () => {
  resetExpoRouterMock();
  resetToastMock();
  await resetVaultTestState();
  debtsVault.store.setState({
    isReady: false,
    items: [],
    doc: { v: 1, items: {} },
    status: "idle",
  });
  await debtsVault.actions.put("d1", {
    kind: "debt",
    direction: "i_owe",
    counterparty: "Yusuf",
    amount: 100,
    currency: "USD",
    createdOn: "2026-11-01",
    payments: [],
    status: "open",
  });
});

afterEach(resetMockWindowSize);

describe("Debts list–detail", () => {
  it("phones push the record screen", async () => {
    await renderWithProviders(<DebtsScreen />);
    await waitFor(() => expect(screen.getByText("Yusuf")).toBeTruthy(), { timeout: 15_000 });
    await fireEvent.press(screen.getByText("Yusuf"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/debts/[id]",
      params: { id: "d1" },
    });
  });

  it("wide windows open the record beside the list", async () => {
    setMockWindowSize(1280);
    await renderWithProviders(<DebtsScreen />);
    await waitFor(() => expect(screen.getByText("Yusuf")).toBeTruthy(), { timeout: 15_000 });
    expect(screen.getByText("Select a record")).toBeTruthy();

    await fireEvent.press(screen.getByText("Yusuf"));
    expect(mockRouter.push).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText("Repayments")).toBeTruthy());
    expect(screen.queryByText("Select a record")).toBeNull();
  });
});
