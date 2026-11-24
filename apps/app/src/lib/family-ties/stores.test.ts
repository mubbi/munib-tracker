import type { MuhasabahConfig } from "@munib-tracker/shared/types";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import {
  muhasabahActions,
  muhasabahVault,
  readMuhasabahWeekSummary,
} from "@/lib/muhasabah/muhasabah-store";
import { makeMuhasabahEntry } from "@/test-support/fixtures/self-review";
import { resetVaultTestState } from "@/test-support/mocks/vault";

import {
  familyTiesActions,
  logsOf,
  readFamilyTiesSummary,
  relativesOf,
  relativesVault,
} from "./family-ties-store";

jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
const mockReschedule = jest.fn();
jest.mock("@/lib/quran-companion/reschedule", () => ({
  requestReminderReschedule: () => mockReschedule(),
}));

function resetStore(store: typeof relativesVault.store | typeof muhasabahVault.store) {
  store.setState({ isReady: false, items: [], doc: { v: 1, items: {} }, status: "idle" } as never);
}

beforeEach(async () => {
  await resetVaultTestState();
  resetStore(relativesVault.store);
  resetStore(muhasabahVault.store);
  mockReschedule.mockClear();
});

describe("family ties store (vault `relatives`)", () => {
  it("stores names and numbers encrypted and reschedules reminders", async () => {
    await relativesVault.actions.load();
    await familyTiesActions.addRelative({
      name: "Aunt Khadijah",
      kinship: "aunt_maternal",
      phone: "+44 7700 900123",
      cadenceDays: 30,
    });
    const raw = JSON.stringify(await readJSON(DB_KEYS.vaultRelatives, null));
    expect(raw).not.toContain("Khadijah");
    expect(raw).not.toContain("7700");
    expect(mockReschedule).toHaveBeenCalled();
  });

  it("logs contacts (dua rule), recomputes on log removal, removes history with the relative", async () => {
    await relativesVault.actions.load();
    const id = await familyTiesActions.addRelative({
      name: "Yusuf",
      kinship: "sibling",
      cadenceDays: 7,
    });
    await familyTiesActions.logContact(id, "call", "2026-11-20");
    await familyTiesActions.logContact(id, "dua", "2026-11-22");
    let items = relativesVault.store.getState().items;
    expect(relativesOf(items)[0]?.lastContact).toEqual({ date: "2026-11-20", kind: "call" });
    expect(logsOf(items)).toHaveLength(2);

    const callLog = logsOf(items).find((l) => l.contact === "call");
    await familyTiesActions.removeLog(callLog?.id ?? "");
    items = relativesVault.store.getState().items;
    // Only the dua is left, which doesn't count as contact for a 7-day cadence.
    expect(relativesOf(items)[0]?.lastContact).toBeUndefined();

    await familyTiesActions.removeRelative(id);
    items = relativesVault.store.getState().items;
    expect(relativesOf(items)).toHaveLength(0);
    expect(logsOf(items)).toHaveLength(0);
  });

  it("clears optional fields on update", async () => {
    await relativesVault.actions.load();
    const id = await familyTiesActions.addRelative({
      name: "Umar",
      kinship: "cousin",
      cadenceDays: 60,
      phone: "123456",
      notes: "x",
    });
    await familyTiesActions.updateRelative(id, {
      name: "Umar",
      kinship: "cousin",
      cadenceDays: 45,
    });
    const r = relativesOf(relativesVault.store.getState().items)[0];
    expect(r).toMatchObject({ cadenceDays: 45 });
    expect(r?.phone).toBeUndefined();
    expect(r?.notes).toBeUndefined();
  });

  it("exposes a counts-only summary", async () => {
    await relativesVault.actions.load();
    await familyTiesActions.addRelative({ name: "Mum", kinship: "mother", cadenceDays: 2 });
    const summary = await readFamilyTiesSummary("2099-01-01");
    expect(summary).toMatchObject({ tracked: 1, dueCount: 1, parentDue: true });
    expect(JSON.stringify(summary)).not.toContain("Mum");
  });
});

describe("muhasabah store (vault `muhasabah`)", () => {
  it("saves entries encrypted, stamps the first completion and reschedules", async () => {
    await muhasabahVault.actions.load();
    await muhasabahActions.saveEntry(
      makeMuhasabahEntry("2026-11-23", { repentNote: "very private" }),
      new Date("2026-11-23T21:00:00.000Z"),
    );
    const raw = JSON.stringify(await readJSON(DB_KEYS.vaultMuhasabah, null));
    expect(raw).not.toContain("very private");
    const config = muhasabahVault.store.getState().items.find((i) => i.kind === "config") as
      | MuhasabahConfig
      | undefined;
    expect(config?.firstCompletedAt).toBe("2026-11-23T21:00:00.000Z");
    expect(mockReschedule).toHaveBeenCalled();
  });

  it("deletes entries past the retention window", async () => {
    await muhasabahVault.actions.load();
    await muhasabahActions.saveEntry(makeMuhasabahEntry("2026-01-01"));
    await muhasabahActions.saveEntry(makeMuhasabahEntry("2026-11-20"));
    const removed = await muhasabahActions.runRetention(new Date(2026, 10, 23, 12));
    expect(removed).toBe(1);
    const dates = muhasabahVault.store
      .getState()
      .items.filter((i) => i.kind === "entry")
      .map((i) => (i as { date: string }).date);
    expect(dates).toEqual(["2026-11-20"]);
  });

  it("weekly summary for the coach has counts only", async () => {
    await muhasabahVault.actions.load();
    await muhasabahActions.saveEntry(makeMuhasabahEntry("2026-11-17", { gratitude: "hidden" }));
    const summary = await readMuhasabahWeekSummary("2026-11-16");
    expect(summary).toMatchObject({ reviewDays: 1, istighfarDays: 1 });
    expect(JSON.stringify(summary)).not.toContain("hidden");
  });
});
