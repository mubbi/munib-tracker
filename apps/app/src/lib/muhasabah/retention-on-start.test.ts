import type { MuhasabahItem } from "@munib-tracker/shared/types";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { liveItems, vault } from "@/lib/vault";
import { makeMuhasabahEntry } from "@/test-support/fixtures/self-review";
import { resetVaultTestState, switchToFreshDevice } from "@/test-support/mocks/vault";

import { muhasabahActions, muhasabahVault } from "./muhasabah-store";
import { runMuhasabahRetentionOnStart } from "./retention-on-start";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock("@/lib/quran-companion/reschedule", () => ({ requestReminderReschedule: jest.fn() }));

const NOW = new Date(2026, 10, 23, 12);
const idle = { isReady: false, items: [], doc: { v: 1, items: {} }, status: "idle" } as never;

beforeEach(async () => {
  await resetVaultTestState();
  muhasabahVault.store.setState(idle);
});

async function seedOldAndRecentEntries() {
  await muhasabahVault.actions.load();
  await muhasabahActions.saveEntry(makeMuhasabahEntry("2026-01-01"));
  await muhasabahActions.saveEntry(makeMuhasabahEntry("2026-11-20"));
  // Fresh launch: nothing has loaded the store (home card hidden, flow never opened).
  muhasabahVault.store.setState(idle);
}

const entryDates = async () =>
  liveItems(await vault.read<MuhasabahItem>("muhasabah"))
    .filter((i) => i.kind === "entry")
    .map((i) => (i as { date: string }).date);

describe("runMuhasabahRetentionOnStart (NF-3.6)", () => {
  it("deletes expired entries on app start without the card or flow mounting", async () => {
    await seedOldAndRecentEntries();
    expect(await runMuhasabahRetentionOnStart(NOW)).toBe(1);
    expect(await entryDates()).toEqual(["2026-11-20"]);
  });

  it("is a no-op (and creates no vault key) when there is no muhasabah document", async () => {
    expect(await runMuhasabahRetentionOnStart(NOW)).toBe(0);
    expect(await readJSON(DB_KEYS.vaultMuhasabah, null)).toBeNull();
    expect(muhasabahVault.store.getState().isReady).toBe(false);
  });

  it("does nothing while the vault can't be opened on this device", async () => {
    await seedOldAndRecentEntries();
    const before = await readJSON(DB_KEYS.vaultMuhasabah, null);
    switchToFreshDevice(); // ciphertext without the key → locked
    expect(await runMuhasabahRetentionOnStart(NOW)).toBe(0);
    expect(await readJSON(DB_KEYS.vaultMuhasabah, null)).toEqual(before);
  });
});
