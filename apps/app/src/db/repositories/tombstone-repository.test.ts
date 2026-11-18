import AsyncStorage from "@react-native-async-storage/async-storage";

import { TombstoneRepository } from "./tombstone-repository";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("TombstoneRepository", () => {
  it("records one tombstone per entity and id", async () => {
    await TombstoneRepository.record("prayer_logs", "a", "2026-07-01T00:00:00Z");
    await TombstoneRepository.record("prayer_logs", "a", "2026-07-02T00:00:00Z");
    await TombstoneRepository.record("zikr_progress", "a", "2026-07-02T00:00:00Z");
    expect(await TombstoneRepository.getAll()).toEqual([
      { entity: "prayer_logs", id: "a", deletedAt: "2026-07-02T00:00:00Z" },
      { entity: "zikr_progress", id: "a", deletedAt: "2026-07-02T00:00:00Z" },
    ]);
  });

  it("clear drops only the pushed entries", async () => {
    await TombstoneRepository.record("prayer_logs", "a", "t");
    await TombstoneRepository.record("prayer_logs", "b", "t");
    await TombstoneRepository.clear([{ entity: "prayer_logs", id: "a" }]);
    expect((await TombstoneRepository.getAll()).map((t) => t.id)).toEqual(["b"]);
  });

  it("clear with no entries leaves storage untouched", async () => {
    await TombstoneRepository.record("prayer_logs", "a", "t");
    await TombstoneRepository.clear([]);
    expect(await TombstoneRepository.getAll()).toHaveLength(1);
  });

  it("clearAll removes every tombstone", async () => {
    await TombstoneRepository.record("prayer_logs", "a", "t");
    await TombstoneRepository.clearAll();
    expect(await TombstoneRepository.getAll()).toEqual([]);
  });
});
