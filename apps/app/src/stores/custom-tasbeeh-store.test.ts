import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { buildCustomTasbeeh } from "@/test-support/fixtures/zikr";

import {
  applyRemoteCustomTasbeeh,
  type CustomTasbeeh,
  customTasbeehStore,
  readCustomTasbeehBlob,
  useCustomTasbeeh,
  useCustomTasbeehActions,
  useCustomTasbeehList,
  useEnsureCustomTasbeehLoaded,
  useTasbeehUpdatedToday,
} from "./custom-tasbeeh-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  customTasbeehStore.setState({ items: [], isReady: false });
});

const state = () => customTasbeehStore.getState();
const watermark = () => readJSON<string | null>(DB_KEYS.customTasbeehUpdatedAt, null);

async function seed(...items: CustomTasbeeh[]) {
  await writeJSON(DB_KEYS.customTasbeeh, Object.fromEntries(items.map((i) => [i.id, i])));
  await state().load();
}

describe("load", () => {
  it("sorts items newest first", async () => {
    await seed(
      buildCustomTasbeeh({ id: "old", updatedAt: "2026-01-01T00:00:00.000Z" }),
      buildCustomTasbeeh({ id: "new", updatedAt: "2026-02-01T00:00:00.000Z" }),
    );
    expect(state().items.map((i) => i.id)).toEqual(["new", "old"]);
  });
});

describe("create", () => {
  it("trims input, starts at zero and bumps the watermark", async () => {
    const item = await state().create({
      title: "  Tahmid ",
      description: " after salah ",
      target: 33,
    });
    expect(item).toMatchObject({
      title: "Tahmid",
      description: "after salah",
      target: 33,
      count: 0,
    });
    expect(state().items).toEqual([item]);
    expect(await watermark()).toEqual(expect.any(String));
  });
});

describe("update", () => {
  it("ignores unknown ids", async () => {
    await state().update("missing", { title: "x" });
    expect(await watermark()).toBeNull();
  });

  it("changes only the provided fields and re-clamps the count", async () => {
    await seed(
      buildCustomTasbeeh({ count: 30, description: "keep" }),
      buildCustomTasbeeh({ id: "other" }),
    );
    await state().update("tasbeeh-1", { title: " New ", target: 10 });
    expect(state().items.find((i) => i.id === "other")).toEqual(
      buildCustomTasbeeh({ id: "other" }),
    );
    expect(state().items[0]).toMatchObject({
      title: "New",
      description: "keep",
      target: 10,
      count: 10,
    });
  });

  it("can update the description and keep the target", async () => {
    await seed(buildCustomTasbeeh({ count: 5 }));
    await state().update("tasbeeh-1", { description: " d " });
    expect(state().items[0]).toMatchObject({ title: "SubhanAllah", description: "d", target: 33 });
  });
});

describe("setCount", () => {
  it.each([
    [33, 50, 33],
    [33, -2, 0],
    [0, 500, 500],
    [0, -1, 0],
  ])("target %p: count %p is stored as %p", async (target, count, expected) => {
    await seed(buildCustomTasbeeh({ target }), buildCustomTasbeeh({ id: "other" }));
    await state().setCount("tasbeeh-1", count);
    expect(state().items[0]?.count).toBe(expected);
  });

  it("ignores unknown ids", async () => {
    await state().setCount("missing", 3);
    expect(state().items).toEqual([]);
  });
});

describe("remove", () => {
  it("deletes the item and bumps the watermark", async () => {
    await seed(buildCustomTasbeeh());
    await state().remove("tasbeeh-1");
    expect(state().items).toEqual([]);
    expect((await readCustomTasbeehBlob()).items).toEqual([]);
    expect(await watermark()).toEqual(expect.any(String));
  });
});

describe("blob sync", () => {
  it("readCustomTasbeehBlob returns items and watermark", async () => {
    await seed(buildCustomTasbeeh());
    await writeJSON(DB_KEYS.customTasbeehUpdatedAt, "2026-07-01T00:00:00.000Z");
    await expect(readCustomTasbeehBlob()).resolves.toEqual({
      items: [buildCustomTasbeeh()],
      updatedAt: "2026-07-01T00:00:00.000Z",
    });
  });

  it("applyRemote skips a remote that is not newer", async () => {
    await writeJSON(DB_KEYS.customTasbeehUpdatedAt, "2026-07-02T00:00:00.000Z");
    await applyRemoteCustomTasbeeh([buildCustomTasbeeh()], "2026-07-01T00:00:00.000Z");
    expect((await readCustomTasbeehBlob()).items).toEqual([]);
  });

  it("applyRemote replaces the list and updates a loaded store", async () => {
    await seed(buildCustomTasbeeh({ id: "local" }));
    await applyRemoteCustomTasbeeh(
      [buildCustomTasbeeh({ id: "remote" })],
      "2026-07-05T00:00:00.000Z",
    );
    expect(state().items.map((i) => i.id)).toEqual(["remote"]);
    expect(await watermark()).toBe("2026-07-05T00:00:00.000Z");
  });

  it("applyRemote without a watermark writes items only and leaves an unloaded store", async () => {
    await applyRemoteCustomTasbeeh([buildCustomTasbeeh()]);
    expect(await watermark()).toBeNull();
    expect(state().items).toEqual([]);
    expect((await readCustomTasbeehBlob()).items).toHaveLength(1);
  });
});

describe("hooks", () => {
  function setup(id?: string) {
    return renderHook(() => {
      useEnsureCustomTasbeehLoaded();
      return {
        list: useCustomTasbeehList(),
        one: useCustomTasbeeh(id),
        today: useTasbeehUpdatedToday(),
        actions: useCustomTasbeehActions(),
      };
    });
  }

  it("load on mount and select by id", async () => {
    await writeJSON(DB_KEYS.customTasbeeh, { "tasbeeh-1": buildCustomTasbeeh() });
    const { result } = await setup("tasbeeh-1");
    await waitFor(() => expect(result.current.one?.id).toBe("tasbeeh-1"));
  });

  it("report no counter touched today when empty or stale", async () => {
    const { result } = await setup();
    await waitFor(() => expect(state().isReady).toBe(true));
    expect(result.current.today).toBeUndefined();
    await act(async () => {
      customTasbeehStore.setState({ items: [buildCustomTasbeeh()] });
    });
    expect(result.current.today).toBeUndefined();
  });

  it("route actions and surface the counter touched today", async () => {
    customTasbeehStore.setState({ isReady: true });
    const { result } = await setup();
    let created: CustomTasbeeh | undefined;
    await act(async () => {
      created = await result.current.actions.create({ title: "A", description: "", target: 0 });
      await result.current.actions.setCount(created.id, 4);
      await result.current.actions.update(created.id, { title: "B" });
    });
    expect(result.current.today).toMatchObject({ title: "B", count: 4 });
    expect(getLocalDateString(new Date(result.current.today?.updatedAt ?? ""))).toBe(
      getLocalDateString(),
    );

    await act(async () => {
      await result.current.actions.remove(created?.id ?? "");
      await result.current.actions.load();
    });
    expect(result.current.list).toEqual([]);
  });
});
