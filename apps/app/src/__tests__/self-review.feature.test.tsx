import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import FamilyTiesEditScreen from "@/app/family-ties/edit";
import FamilyTiesScreen from "@/app/family-ties/index";
import MuhasabahScreen from "@/app/muhasabah/index";
import { relativesOf, relativesVault } from "@/lib/family-ties/family-ties-store";
import { entriesOf, muhasabahVault } from "@/lib/muhasabah/muhasabah-store";
import { isTV } from "@/lib/platform/is-tv";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { resetVaultTestState } from "@/test-support/mocks/vault";
import { renderWithProviders } from "@/test-support/render";

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
// "Lock private journals" off / no PIN: the VaultLockGate opens straight away.
// Stable object: VaultLockGate memoizes on these callbacks.
const mockPinLock = {
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
const mockIsTV = isTV as jest.Mock;

function resetVaultStores() {
  for (const store of [relativesVault.store, muhasabahVault.store]) {
    store.setState({
      isReady: false,
      items: [],
      doc: { v: 1, items: {} },
      status: "idle",
    } as never);
  }
}

beforeEach(async () => {
  resetExpoRouterMock();
  resetToastMock();
  mockIsTV.mockReturnValue(false);
  await resetVaultTestState();
  resetVaultStores();
});

describe("Nightly muhasabah", () => {
  it("walks the five steps and saves the review privately", async () => {
    await renderWithProviders(<MuhasabahScreen />);
    await waitFor(() => expect(screen.getByText("Your Salah today")).toBeTruthy(), {
      timeout: 15_000,
    });
    expect(screen.getByText("Step 1 of 5")).toBeTruthy();

    await fireEvent.press(screen.getByText("Next"));
    expect(screen.getByText("A few honest questions")).toBeTruthy();
    await fireEvent.press(
      screen.getByLabelText("Did I guard my tongue (backbiting, lying, harsh words)?: Yes"),
    );

    await fireEvent.press(screen.getByText("Next"));
    await fireEvent.press(screen.getByText("Next"));
    expect(screen.getByText("Turning back to Allah")).toBeTruthy();
    await fireEvent.press(screen.getByText("Next"));
    await fireEvent.changeText(screen.getByLabelText("Tomorrow I intend to"), "Call my mother");
    await fireEvent.press(screen.getByText("Finish"));

    await waitFor(() => expect(screen.getByText("Tonight's muhasabah is done")).toBeTruthy());
    const [entry] = entriesOf(muhasabahVault.store.getState().items);
    expect(entry).toMatchObject({ answers: { tongue: "yes" }, intention: "Call my mother" });
    expect(mockToast.success).toHaveBeenCalledWith(
      "Saved privately",
      "May Allah accept from you and forgive us all.",
    );
    // One-time offer of the nightly reminder after the first review.
    expect(screen.getByText("A gentle nightly reminder?")).toBeTruthy();
  });

  it("is hidden on TV", async () => {
    mockIsTV.mockReturnValue(true);
    await renderWithProviders(<MuhasabahScreen />);
    expect(screen.getByText("Available on your phone")).toBeTruthy();
    expect(screen.queryByText("Your Salah today")).toBeNull();
  });
});

describe("Family ties", () => {
  it("adds a relative, lists them as due and logs a dua", async () => {
    await renderWithProviders(<FamilyTiesEditScreen />);
    await waitFor(() => expect(screen.getByLabelText("Name")).toBeTruthy(), { timeout: 15_000 });
    await fireEvent.changeText(screen.getByLabelText("Name"), "Aunt Maryam");
    await fireEvent.press(screen.getByLabelText("Relationship: Maternal aunt"));
    await fireEvent.press(screen.getByText("Save"));
    await waitFor(() => expect(relativesOf(relativesVault.store.getState().items)).toHaveLength(1));
    expect(relativesOf(relativesVault.store.getState().items)[0]).toMatchObject({
      kinship: "aunt_maternal",
      cadenceDays: 30,
    });

    screen.unmount();
    await renderWithProviders(<FamilyTiesScreen />);
    await waitFor(() => expect(screen.getByText("Aunt Maryam")).toBeTruthy(), { timeout: 15_000 });
    expect(screen.getByText("A good day to reach out")).toBeTruthy();
    expect(screen.getByText("No contact logged yet")).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getAllByText("Make dua")[0]);
    });
    await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith("Logged: Dua"));
    // Cadence 30 days: the dua counts as contact.
    expect(relativesOf(relativesVault.store.getState().items)[0]?.lastContact?.kind).toBe("dua");
  });
});
