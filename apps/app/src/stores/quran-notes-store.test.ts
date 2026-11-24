import type { QuranNotesMap } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { applyRemoteBlob, buildBlobRecords, isBlobEntity } from "@/sync/blob-sync";

import { quranNotesStore } from "./quran-notes-store";

const T1 = "2026-11-20T00:00:00.000Z";
const T2 = "2026-11-21T00:00:00.000Z";

async function reset() {
  await AsyncStorage.clear();
  await quranNotesStore.getState().load();
}

async function stored(): Promise<QuranNotesMap> {
  return readJSON<QuranNotesMap>(DB_KEYS.quranNotes, {});
}

beforeEach(reset);

describe("quran notes store", () => {
  it("saves a note offline and indexes it immediately", async () => {
    const result = await quranNotesStore.getState().save({
      surah: 38,
      ayah: 29,
      body: "Reflect, then act.",
      tags: ["#Tadabbur", "tadabbur "],
    });
    expect(result.ok).toBe(true);
    const { index } = quranNotesStore.getState();
    expect(index.byAyah["38:29"]?.[0]?.body).toBe("Reflect, then act.");
    expect(index.tags).toEqual(["tadabbur"]);
    expect(Object.values(await stored())).toHaveLength(1);
  });

  it("refuses an empty note and keeps a tombstone on delete", async () => {
    expect(
      await quranNotesStore.getState().save({ surah: 1, ayah: 1, body: "  ", tags: [] }),
    ).toEqual({ ok: false, error: "empty" });
    const saved = await quranNotesStore.getState().save({ surah: 1, ayah: 1, body: "x", tags: [] });
    if (!saved.ok) throw new Error("save failed");
    await quranNotesStore.getState().remove(saved.note.id);
    expect(quranNotesStore.getState().index.live).toHaveLength(0);
    const tomb = (await stored())[saved.note.id];
    expect(tomb?.deletedAt).toBeDefined();
    expect(tomb?.body).toBe("");
  });

  it("highlights a whole ayah and clearing a highlight-only note deletes it", async () => {
    await quranNotesStore.getState().setAyahHighlight(2, 255, "gold");
    await quranNotesStore.getState().setAyahHighlight(2, 255, "violet");
    const live = quranNotesStore.getState().index.live;
    expect(live).toHaveLength(1);
    expect(live[0]?.color).toBe("violet");
    await quranNotesStore.getState().setAyahHighlight(2, 255, null);
    expect(quranNotesStore.getState().index.live).toHaveLength(0);
  });

  it("clearing a highlight keeps the note body", async () => {
    await quranNotesStore
      .getState()
      .save({ surah: 2, ayah: 2, body: "guidance", tags: [], color: "green" });
    await quranNotesStore.getState().setAyahHighlight(2, 2, null);
    const [note] = quranNotesStore.getState().index.live;
    expect(note?.body).toBe("guidance");
    expect(note?.color).toBeUndefined();
  });

  it("only keeps a word span together with the ayah text hash", async () => {
    const res = await quranNotesStore.getState().save({
      surah: 1,
      ayah: 2,
      body: "",
      tags: [],
      color: "blue",
      words: { start: 0, end: 1 },
      textHash: null,
    });
    expect(res.ok && res.note.words).toBeFalsy();
  });

  it("rejects a save that would push the blob over the 1 MB cap", async () => {
    const big: QuranNotesMap = {};
    for (let i = 0; i < 240; i++) {
      big[`n${i}`] = {
        id: `n${i}`,
        surah: 2,
        ayah: 1,
        body: "x".repeat(4100),
        tags: [],
        createdAt: T1,
        updatedAt: T1,
      };
    }
    await writeJSON(DB_KEYS.quranNotes, big);
    await quranNotesStore.getState().load();
    expect(quranNotesStore.getState().usage).toBeGreaterThan(0.8);
    const res = await quranNotesStore.getState().save({
      surah: 1,
      ayah: 1,
      body: "y".repeat(5000),
      tags: [],
    });
    expect(res).toEqual({ ok: false, error: "full" });
  });
});

describe("quran_notes blob sync (two devices)", () => {
  it("is a registered blob entity", () => {
    expect(isBlobEntity("quran_notes")).toBe(true);
  });

  it("an edit on device B and a delete on device A converge per note", async () => {
    // Device A holds two notes; note `a` was deleted later than B edited it.
    await writeJSON<QuranNotesMap>(DB_KEYS.quranNotes, {
      a: {
        id: "a",
        surah: 1,
        ayah: 1,
        body: "",
        tags: [],
        createdAt: T1,
        updatedAt: T2,
        deletedAt: T2,
      },
      b: { id: "b", surah: 1, ayah: 2, body: "old", tags: [], createdAt: T1, updatedAt: T1 },
    });
    await quranNotesStore.getState().load();
    await buildBlobRecords(T1);

    const applied = await applyRemoteBlob(
      "quran_notes",
      {
        value: {
          a: {
            id: "a",
            surah: 1,
            ayah: 1,
            body: "edited before delete",
            tags: [],
            createdAt: T1,
            updatedAt: T1,
          },
          b: {
            id: "b",
            surah: 1,
            ayah: 2,
            body: "new from B",
            tags: [],
            createdAt: T1,
            updatedAt: T2,
          },
        },
      },
      T2,
    );
    expect(applied).toBe(true);
    const merged = await stored();
    expect(merged.a?.deletedAt).toBe(T2);
    expect(merged.b?.body).toBe("new from B");
    // The store reloads through `reloadIfReady`; the reader sees B's edit and not `a`.
    await quranNotesStore.getState().load();
    expect(quranNotesStore.getState().index.live.map((n) => n.id)).toEqual(["b"]);

    // The merged value differs from the server's, so the next push carries it.
    const records = await buildBlobRecords("2026-11-22T00:00:00.000Z");
    const pushed = records.find((r) => r.entity === "quran_notes");
    const pushedValue = (pushed?.data as { value: QuranNotesMap } | undefined)?.value;
    expect(pushedValue?.a?.deletedAt).toBe(T2);
  });
});
