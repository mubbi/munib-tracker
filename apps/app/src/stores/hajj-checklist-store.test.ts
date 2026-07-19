import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { hajjChecklistStore, migrateLegacyMixedChecklist } from "./hajj-checklist-store";
import { umrahChecklistStore } from "./umrah-checklist-store";

const LEGACY_FLAG = `${DB_KEYS.hajjChecklist}::migrated_v4`;

beforeEach(async () => {
  await AsyncStorage.clear();
  hajjChecklistStore.setState({ done: {}, isReady: false });
  umrahChecklistStore.setState({ done: {}, isReady: false });
});

describe("migrateLegacyMixedChecklist", () => {
  it("moves umrah-* rows out of the hajj blob and drops non-rite keys", async () => {
    await writeJSON(DB_KEYS.hajjChecklist, {
      "hajj-arafah-stand": {
        id: "hajj-arafah-stand",
        completedAt: "2026-01-01T00:00:00.000Z",
      },
      "umrah-tawaf": { id: "umrah-tawaf", completedAt: "2026-01-02T00:00:00.000Z" },
      "prep-pack-list": { id: "prep-pack-list", completedAt: "2026-01-03T00:00:00.000Z" },
    });

    await migrateLegacyMixedChecklist();

    expect(await readJSON(DB_KEYS.hajjChecklist, {})).toEqual({
      "hajj-arafah-stand": {
        id: "hajj-arafah-stand",
        completedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(await readJSON(DB_KEYS.umrahChecklist, {})).toEqual({
      "umrah-tawaf": { id: "umrah-tawaf", completedAt: "2026-01-02T00:00:00.000Z" },
    });
  });

  it("still re-partitions after a leftover sticky migration flag (restore/sync)", async () => {
    await writeJSON(LEGACY_FLAG, true);
    await writeJSON(DB_KEYS.hajjChecklist, {
      "umrah-sai": { id: "umrah-sai", completedAt: "2026-02-01T00:00:00.000Z" },
    });

    await migrateLegacyMixedChecklist();

    expect(await readJSON(DB_KEYS.hajjChecklist, {})).toEqual({});
    expect(await readJSON(DB_KEYS.umrahChecklist, {})).toEqual({
      "umrah-sai": { id: "umrah-sai", completedAt: "2026-02-01T00:00:00.000Z" },
    });
    expect(await AsyncStorage.getItem(LEGACY_FLAG)).toBeNull();
  });
});
