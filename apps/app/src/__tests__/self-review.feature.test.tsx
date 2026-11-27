import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import FamilyTiesEditScreen from "@/app/family-ties/edit";
import FamilyTiesScreen from "@/app/family-ties/index";
import MuhasabahScreen from "@/app/muhasabah/index";
import MuhasabahSettingsScreen from "@/app/muhasabah/settings";
import { DB_KEYS } from "@/db/keys";
import { writeJSON } from "@/db/store";
import { relativesOf, relativesVault } from "@/lib/family-ties/family-ties-store";
import { entriesOf, muhasabahVault } from "@/lib/muhasabah/muhasabah-store";
import { isTV } from "@/lib/platform/is-tv";
import { vaultLockPrefStore } from "@/lib/vault/vault-lock";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { resetVaultTestState } from "@/test-support/mocks/vault";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
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
  mockPinLock.isPinEnabled = false;
  mockPinLock.hasStoredPin = false;
  vaultLockPrefStore.setState({ lockJournals: false, isReady: false });
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

  it("never shows the review before a stored journal lock has loaded", async () => {
    mockPinLock.isPinEnabled = true;
    mockPinLock.hasStoredPin = true;
    await writeJSON(DB_KEYS.vaultLockJournals, true);
    await renderWithProviders(<MuhasabahScreen />);
    await waitFor(() => expect(screen.getByText("Enter your PIN to open")).toBeTruthy(), {
      timeout: 15_000,
    });
    expect(screen.queryByText("Your Salah today")).toBeNull();
  });

  it("offers Undo when a custom question is removed", async () => {
    await renderWithProviders(<MuhasabahSettingsScreen />);
    await waitFor(() => expect(screen.getByText("Add your own question")).toBeTruthy(), {
      timeout: 15_000,
    });
    await fireEvent.changeText(screen.getByLabelText("Add your own question"), "Did I smile?");
    await fireEvent.press(screen.getByText("Add question"));
    await waitFor(() => expect(screen.getByText("Did I smile?")).toBeTruthy());

    await fireEvent.press(screen.getByText("Remove"));
    await waitFor(() => expect(screen.queryByText("Did I smile?")).toBeNull());
    const options = mockToast.show.mock.calls.at(-1)?.[1];
    expect(options?.action?.label).toBe("Undo");
    await act(async () => {
      options?.action?.onPress();
    });
    await waitFor(() => expect(screen.getByText("Did I smile?")).toBeTruthy());
  });

  it("confirms before a shorter retention deletes older reviews", async () => {
    await muhasabahVault.actions.load();
    await muhasabahVault.actions.put("entry:2020-01-01", {
      kind: "entry",
      date: "2020-01-01",
      answers: {},
      readIstighfar: false,
      durationMs: 0,
    });
    await renderWithProviders(<MuhasabahSettingsScreen />);
    await waitFor(() => expect(screen.getByText("Keep reviews for")).toBeTruthy(), {
      timeout: 15_000,
    });
    await fireEvent.press(screen.getByLabelText("Keep reviews for: 30 days"));
    expect(screen.getByText("Delete older reviews?")).toBeTruthy();
    expect(entriesOf(muhasabahVault.store.getState().items)).toHaveLength(1);
  });

  it("offers to clear saved repentance notes when saving them is turned off", async () => {
    await muhasabahVault.actions.load();
    for (const date of ["2026-11-20", "2026-11-21"]) {
      await muhasabahVault.actions.put(`entry:${date}`, {
        kind: "entry",
        date,
        answers: {},
        repented: true,
        repentNote: "private words",
        readIstighfar: false,
        durationMs: 0,
      });
    }
    await renderWithProviders(<MuhasabahSettingsScreen />);
    await waitFor(() => expect(screen.getByText("Save repentance notes")).toBeTruthy(), {
      timeout: 15_000,
    });
    await fireEvent(screen.getByLabelText("Save repentance notes"), "valueChange", false);
    expect(screen.getByText("Delete saved notes too?")).toBeTruthy();
    expect(screen.getByText(/2 saved reviews still hold repentance notes/)).toBeTruthy();

    await fireEvent.press(screen.getByText("Delete notes"));
    await waitFor(() =>
      expect(entriesOf(muhasabahVault.store.getState().items).every((e) => !e.repentNote)).toBe(
        true,
      ),
    );
    // Only the words go; the fact of turning to Allah stays.
    expect(entriesOf(muhasabahVault.store.getState().items).every((e) => e.repented)).toBe(true);
  });

  it("is hidden on TV", async () => {
    mockIsTV.mockReturnValue(true);
    await renderWithProviders(<MuhasabahScreen />);
    expect(screen.getByText("Available on your phone")).toBeTruthy();
    expect(screen.queryByText("Your Salah today")).toBeNull();
  });
});

describe("Family ties", () => {
  it("offers one-tap cadences in the form", async () => {
    await renderWithProviders(<FamilyTiesEditScreen />);
    await waitFor(() => expect(screen.getByLabelText("Name")).toBeTruthy(), { timeout: 15_000 });
    await fireEvent.changeText(screen.getByLabelText("Name"), "Grandfather Ahmad");
    await fireEvent.press(screen.getByLabelText("Keep in touch every: 14 days"));
    await fireEvent.press(screen.getByText("Save"));
    await waitFor(() => expect(relativesOf(relativesVault.store.getState().items)).toHaveLength(1));
    expect(relativesOf(relativesVault.store.getState().items)[0]).toMatchObject({
      cadenceDays: 14,
    });
  });

  it("keeps a relative who passed away editable from the dua list", async () => {
    await relativesVault.actions.load();
    await relativesVault.actions.put("r1", {
      type: "relative",
      name: "Grandfather Ahmad",
      kinship: "grandparent",
      cadenceDays: 7,
      deceased: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    } as never);
    await renderWithProviders(<FamilyTiesScreen />);
    await waitFor(() => expect(screen.getByText("Grandfather Ahmad")).toBeTruthy(), {
      timeout: 15_000,
    });
    await fireEvent.press(screen.getByText("Edit"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/family-ties/edit",
      params: { id: "r1" },
    });
  });

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

    const [makeDua] = screen.getAllByText("Make dua");
    if (makeDua) await fireEvent.press(makeDua);
    await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith("Logged: Dua"));
    // Cadence 30 days: the dua counts as contact.
    expect(relativesOf(relativesVault.store.getState().items)[0]?.lastContact?.kind).toBe("dua");
  });
});
