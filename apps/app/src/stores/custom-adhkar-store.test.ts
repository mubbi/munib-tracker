import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { buildCustomAdhkar } from "@/test-support/fixtures/zikr";

import {
  type CustomAdhkar,
  type CustomAdhkarImage,
  customAdhkarStore,
  useCustomAdhkarActions,
  useCustomAdhkarList,
  useEnsureCustomAdhkarLoaded,
} from "./custom-adhkar-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  customAdhkarStore.setState({ items: [], isReady: false });
});

const state = () => customAdhkarStore.getState();

async function seed(...items: CustomAdhkar[]) {
  await writeJSON(DB_KEYS.customAdhkar, Object.fromEntries(items.map((i) => [i.id, i])));
  await state().load();
}

const image = (overrides: Partial<CustomAdhkarImage> = {}): CustomAdhkarImage => ({
  mimeType: "image/png",
  ...overrides,
});

describe("create", () => {
  it("trims fields and blanks empty optionals", async () => {
    const item = await state().create({
      title: "  Title ",
      arabic: " سبحان الله ",
      transliteration: "  ",
      translation: " Glory ",
      reference: "",
    });
    expect(item).toMatchObject({
      title: "Title",
      arabic: "سبحان الله",
      transliteration: undefined,
      translation: "Glory",
      reference: undefined,
      images: undefined,
    });
    expect(Object.keys(await readJSON(DB_KEYS.customAdhkar, {}))).toEqual([item.id]);
  });

  it("stores an empty Arabic body when omitted", async () => {
    expect((await state().create({ title: "t" })).arabic).toBe("");
  });

  it("normalises images: caps the count, drops local URIs once uploaded, defaults the type", async () => {
    const images = [
      image({ mediaId: "m1", localUri: "file:///a" }),
      image({ localUri: "file:///b", mimeType: "" }),
      ...Array.from({ length: 6 }, () => image()),
    ];
    const item = await state().create({ title: "t", images });
    expect(item.images).toHaveLength(5);
    expect(item.images?.[0]).toEqual({
      mediaId: "m1",
      localUri: undefined,
      mimeType: "image/png",
      filename: undefined,
    });
    expect(item.images?.[1]).toMatchObject({ localUri: "file:///b", mimeType: "image/jpeg" });
  });
});

describe("update", () => {
  it("returns undefined for an unknown id", async () => {
    await expect(state().update("missing", { title: "x" })).resolves.toBeUndefined();
  });

  it("keeps existing images when none are passed", async () => {
    await seed(
      buildCustomAdhkar({ images: [image({ mediaId: "m" })] }),
      buildCustomAdhkar({ id: "b" }),
    );
    const next = await state().update("adhkar-1", { title: " Renamed " });
    expect(state().items.find((i) => i.id === "b")).toEqual(buildCustomAdhkar({ id: "b" }));
    expect(next).toMatchObject({ title: "Renamed", arabic: "", images: [{ mediaId: "m" }] });
  });

  it("replaces images when passed, clearing them with an empty list", async () => {
    await seed(buildCustomAdhkar({ images: [image({ mediaId: "m" })] }));
    const next = await state().update("adhkar-1", { title: "t", arabic: " a ", images: [] });
    expect(next).toMatchObject({ arabic: "a", images: undefined });
    expect(state().items[0]?.images).toBeUndefined();
  });
});

describe("remove", () => {
  it("returns the removed item", async () => {
    await seed(buildCustomAdhkar());
    await expect(state().remove("adhkar-1")).resolves.toEqual(buildCustomAdhkar());
    expect(state().items).toEqual([]);
  });

  it("returns undefined when nothing matched", async () => {
    await expect(state().remove("missing")).resolves.toBeUndefined();
  });
});

describe("restore (Undo after delete)", () => {
  it("brings the entry back under the same id, attachments included", async () => {
    const original = buildCustomAdhkar({ images: [image({ mediaId: "m1" })] });
    await seed(original);
    const removed = await state().remove(original.id);
    expect(state().items).toEqual([]);

    const restored = await state().restore(removed as CustomAdhkar);
    expect(restored.id).toBe(original.id);
    expect(restored.images).toEqual([expect.objectContaining({ mediaId: "m1" })]);
    expect(state().items.map((i) => i.id)).toEqual([original.id]);
    expect(Object.keys(await readJSON(DB_KEYS.customAdhkar, {}))).toEqual([original.id]);
  });

  it("is idempotent when the id is already present", async () => {
    await seed(buildCustomAdhkar());
    await state().restore(buildCustomAdhkar());
    expect(state().items).toHaveLength(1);
  });
});

describe("hooks", () => {
  function setup() {
    return renderHook(() => {
      useEnsureCustomAdhkarLoaded();
      return { list: useCustomAdhkarList(), actions: useCustomAdhkarActions() };
    });
  }

  it("load newest first on mount", async () => {
    await writeJSON(DB_KEYS.customAdhkar, {
      a: buildCustomAdhkar({ id: "a", updatedAt: "2026-01-01T00:00:00.000Z" }),
      b: buildCustomAdhkar({ id: "b", updatedAt: "2026-02-01T00:00:00.000Z" }),
    });
    const { result } = await setup();
    await waitFor(() => expect(result.current.list.map((i) => i.id)).toEqual(["b", "a"]));
  });

  it("route actions to the store", async () => {
    customAdhkarStore.setState({ isReady: true });
    const { result } = await setup();
    await act(async () => {
      const item = await result.current.actions.create({ title: "x" });
      await result.current.actions.update(item.id, { title: "y" });
    });
    expect(result.current.list.map((i) => i.title)).toEqual(["y"]);

    await act(async () => {
      await result.current.actions.remove(result.current.list[0]?.id ?? "");
      await result.current.actions.load();
    });
    expect(result.current.list).toEqual([]);
  });
});
