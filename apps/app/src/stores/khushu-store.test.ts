import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";

import {
  type KhushuInput,
  khushuStore,
  useEnsureKhushuLoaded,
  useKhushuActions,
  useKhushuEntries,
} from "./khushu-store";

const input = (overrides: Partial<KhushuInput> = {}): KhushuInput => ({
  date: "2026-07-03",
  prayerId: "fajr",
  rating: 4,
  ...overrides,
});

beforeEach(async () => {
  await AsyncStorage.clear();
  khushuStore.setState({ items: [], isReady: false });
});

const items = () => khushuStore.getState().items;

describe("save", () => {
  it("creates an entry with a clamped rating and trimmed note", async () => {
    await khushuStore.getState().save(input({ rating: 9, note: "  calm  " }));
    expect(items()).toHaveLength(1);
    expect(items()[0]).toMatchObject({
      date: "2026-07-03",
      prayerId: "fajr",
      rating: 5,
      note: "calm",
    });
    expect(Object.keys(await readJSON(DB_KEYS.khushuJournal, {}))).toEqual(["2026-07-03:fajr"]);
  });

  it("drops a blank note", async () => {
    await khushuStore.getState().save(input({ note: "   " }));
    expect(items()[0]?.note).toBeUndefined();
  });

  it("re-rating the same salah overwrites in place, keeping id and createdAt", async () => {
    await khushuStore.getState().save(input({ rating: 2 }));
    const first = items()[0];
    await khushuStore.getState().save(input({ rating: 3 }));
    expect(items()).toHaveLength(1);
    expect(items()[0]).toMatchObject({ id: first?.id, createdAt: first?.createdAt, rating: 3 });
  });
});

describe("remove", () => {
  it("removes only the matching date and salah", async () => {
    await khushuStore.getState().save(input());
    await khushuStore.getState().save(input({ prayerId: "isha" }));
    await khushuStore.getState().save(input({ date: "2026-07-04" }));

    await khushuStore.getState().remove("2026-07-03", "fajr");

    expect(
      items()
        .map((i) => `${i.date}:${i.prayerId}`)
        .sort(),
    ).toEqual(["2026-07-03:isha", "2026-07-04:fajr"]);
  });
});

describe("hooks", () => {
  it("load entries newest first and route actions", async () => {
    await khushuStore.getState().save(input({ prayerId: "dhuhr" }));
    await new Promise((resolve) => setTimeout(resolve, 2));
    await khushuStore.getState().save(input({ prayerId: "asr" }));
    khushuStore.setState({ items: [], isReady: false });

    const { result } = await renderHook(() => {
      useEnsureKhushuLoaded();
      return { entries: useKhushuEntries(), actions: useKhushuActions() };
    });

    await waitFor(() => expect(result.current.entries).toHaveLength(2));
    expect(result.current.entries.map((e) => e.prayerId)).toEqual(["asr", "dhuhr"]);

    await act(async () => {
      await result.current.actions.remove("2026-07-03", "asr");
      await result.current.actions.save(input({ prayerId: "maghrib" }));
      await result.current.actions.load();
    });
    expect(result.current.entries.map((e) => e.prayerId).sort()).toEqual(["dhuhr", "maghrib"]);
  });

  it("skip loading when already ready", async () => {
    khushuStore.setState({ isReady: true });
    await renderHook(() => useEnsureKhushuLoaded());
    expect(items()).toEqual([]);
  });
});
