import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { isTV } from "@/lib/platform/is-tv";
import { setUpVaultSync, vault } from "@/lib/vault/vault";
import { vaultStatusStore } from "@/lib/vault/vault-store";
import { resetVaultTestState, TEST_PASSPHRASE } from "@/test-support/mocks/vault";
import { renderWithTheme } from "@/test-support/render";

import { PassphraseStrengthMeter } from "./passphrase-strength-meter";
import { RecoveryCodeDisplay } from "./recovery-code-display";
import { VaultSyncSheet } from "./vault-sync-sheet";
import { VaultUnlockSheet } from "./vault-unlock-sheet";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

jest.mock("@/lib/platform/is-tv", () => ({ isTV: jest.fn(() => false) }));
const mockIsTV = isTV as jest.Mock;

const WORDS = Array.from({ length: 24 }, (_, i) => `word${i + 1}`);

beforeEach(async () => {
  await resetVaultTestState();
  vaultStatusStore.setState({ status: null });
  mockIsTV.mockReturnValue(false);
});

describe("PassphraseStrengthMeter", () => {
  it("reports progress toward the 10-character minimum, then a strength label", async () => {
    const { rerender } = await renderWithTheme(<PassphraseStrengthMeter passphrase="abc" />);
    expect(screen.getByText("3 of 10 characters")).toBeTruthy();
    await rerender(<PassphraseStrengthMeter passphrase="Tq9#vL2!mZ8@pX4$" />);
    expect(screen.getByText("Strong")).toBeTruthy();
    expect(screen.getByRole("progressbar").props.accessibilityValue).toMatchObject({ now: 4 });
  });
});

describe("RecoveryCodeDisplay", () => {
  it("shows all words and enables Done only after confirming they were saved", async () => {
    const onConfirmed = jest.fn();
    await renderWithTheme(<RecoveryCodeDisplay words={WORDS} onConfirmed={onConfirmed} />);
    expect(screen.getByText("word24")).toBeTruthy();

    await fireEvent.press(screen.getByText("Done"));
    expect(onConfirmed).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole("checkbox"));
    await fireEvent.press(screen.getByText("Done"));
    expect(onConfirmed).toHaveBeenCalledTimes(1);
  });
});

describe("VaultSyncSheet", () => {
  it("renders nothing on TV", async () => {
    mockIsTV.mockReturnValue(true);
    await renderWithTheme(<VaultSyncSheet visible onClose={jest.fn()} />);
    expect(screen.queryByText("Sync private journals")).toBeNull();
  });

  it("warns plainly that losing both secrets loses the cloud copy, then sets up sync", async () => {
    const onEnabled = jest.fn();
    await renderWithTheme(<VaultSyncSheet visible onClose={jest.fn()} onEnabled={onEnabled} />);
    await waitFor(() => expect(screen.getByText("Sync private journals")).toBeTruthy());
    expect(screen.getByText(/lose both your passphrase and your recovery code/)).toBeTruthy();

    await fireEvent.press(screen.getByText("Continue"));
    await fireEvent.changeText(screen.getByLabelText("Passphrase"), TEST_PASSPHRASE);
    await fireEvent.changeText(screen.getByLabelText("Confirm passphrase"), TEST_PASSPHRASE);
    await fireEvent.press(screen.getByText("Turn on encrypted sync"));

    await waitFor(() => expect(screen.getByText("Your recovery code")).toBeTruthy(), {
      timeout: 10_000,
    });
    expect(await readJSON(DB_KEYS.vaultKeyring, null)).not.toBeNull();
    await fireEvent.press(screen.getByRole("checkbox"));
    await fireEvent.press(screen.getByText("Done"));
    expect(onEnabled).toHaveBeenCalled();
  });
});

describe("VaultUnlockSheet", () => {
  it("shows a typed, translated error for a wrong passphrase", async () => {
    await vault.write("debts", { v: 1, items: {} });
    await setUpVaultSync(TEST_PASSPHRASE);
    await act(async () => {
      await vaultStatusStore.getState().refresh();
    });

    await renderWithTheme(<VaultUnlockSheet visible onClose={jest.fn()} />);
    await fireEvent.changeText(screen.getByLabelText("Passphrase"), "not the right one");
    await fireEvent.press(screen.getByText("Unlock"));

    await waitFor(
      () => expect(screen.getByText("That passphrase isn't right. Try again.")).toBeTruthy(),
      { timeout: 10_000 },
    );
  });
});
