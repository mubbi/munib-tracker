import type { ZikrProgress } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ZikrRepository } from "./zikr-repository";

const entry = (overrides: Partial<ZikrProgress> = {}): ZikrProgress => ({
  id: "zp1",
  zikrId: "z1",
  date: "2026-07-03",
  count: 3,
  target: 10,
  completed: false,
  updatedAt: "2026-07-03T05:00:00.000Z",
  ...overrides,
});

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("ZikrRepository sync helpers", () => {
  it("upsertProgress writes an entry verbatim", async () => {
    await ZikrRepository.upsertProgress(entry());
    await expect(ZikrRepository.getProgress("z1", "2026-07-03")).resolves.toEqual(entry());
  });

  it("applyRemoteProgress inserts a missing entry", async () => {
    await ZikrRepository.applyRemoteProgress(entry({ prayerId: "fajr" }));
    expect((await ZikrRepository.getProgress("z1", "2026-07-03", "fajr"))?.count).toBe(3);
  });

  it("applyRemoteProgress keeps a newer local entry", async () => {
    await ZikrRepository.upsertProgress(entry({ count: 9 }));
    await ZikrRepository.applyRemoteProgress(
      entry({ count: 1, updatedAt: "2000-01-01T00:00:00Z" }),
    );
    expect((await ZikrRepository.getProgress("z1", "2026-07-03"))?.count).toBe(9);
  });

  it("applyRemoteProgress replaces an older or unstamped local entry", async () => {
    await ZikrRepository.upsertProgress(entry({ count: 9, updatedAt: undefined }));
    await ZikrRepository.applyRemoteProgress(entry({ count: 1 }));
    expect((await ZikrRepository.getProgress("z1", "2026-07-03"))?.count).toBe(1);
  });

  it("clear removes all progress", async () => {
    await ZikrRepository.upsertProgress(entry());
    await ZikrRepository.clear();
    await expect(ZikrRepository.getAll()).resolves.toEqual([]);
  });
});
