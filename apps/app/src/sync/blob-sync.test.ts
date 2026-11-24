import type { AyahNote } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON, writeJSON } from "@/db/store";
import { DEFAULT_LOCATION } from "@/lib/location";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import { fastingStore } from "@/stores/fasting-store";
import { khatmStore } from "@/stores/khatm-store";
import { locationStore } from "@/stores/location-store";
import { trackerStore } from "@/stores/tracker-store";
import { buildStoredLocation } from "@/test-support/fixtures/location";

import { readBlobHold } from "./blob-hold";
import {
  applyRemoteBlob,
  buildBlobRecords,
  getSkippedBlobEntities,
  isBlobEntity,
  reloadBlobStores,
} from "./blob-sync";

const FASTING = "fasting";
/** Pure last-write-wins blob (not in the union-merge set). */
const KHATM = "khatm";
const T1 = "2026-07-01T00:00:00.000Z";
const T2 = "2026-07-02T00:00:00.000Z";
const T3 = "2026-07-03T00:00:00.000Z";

function fastingRecord(records: Awaited<ReturnType<typeof buildBlobRecords>>) {
  return records.find((r) => r.entity === FASTING);
}

function khatmRecord(records: Awaited<ReturnType<typeof buildBlobRecords>>) {
  return records.find((r) => r.entity === KHATM);
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("isBlobEntity", () => {
  it("recognizes newly-synced blob entities and rejects typed ones", () => {
    expect(isBlobEntity("fasting")).toBe(true);
    expect(isBlobEntity("qaza_schedule")).toBe(true);
    expect(isBlobEntity("learn_dua_progress")).toBe(true);
    expect(isBlobEntity("location")).toBe(true);
    // D13: merged into preferences.readingDisplay — no longer a client blob.
    expect(isBlobEntity("reading_text_visibility")).toBe(false);
    expect(isBlobEntity("hadith_prefs")).toBe(true);
    expect(isBlobEntity("zakat_calculator")).toBe(true);
    expect(isBlobEntity("fidyah_calculator")).toBe(true);
    expect(isBlobEntity("sadaqah_goals")).toBe(true);
    expect(isBlobEntity("tours_seen")).toBe(true);
    // Entities with their own bespoke sync path must NOT be treated as blobs.
    expect(isBlobEntity("prayer_logs")).toBe(false);
    expect(isBlobEntity("custom_tasbeeh")).toBe(false);
    expect(isBlobEntity("unknown")).toBe(false);
  });
});

describe("buildBlobRecords", () => {
  it("skips an untouched (empty, never-tracked) entity so it can't clobber another device", async () => {
    const records = await buildBlobRecords(T1);
    expect(fastingRecord(records)).toBeUndefined();
    // Nothing was tracked, so no state row was written.
    expect(await readJSON(DB_KEYS.blobSyncState, null)).toBeNull();
  });

  it("emits a record once the entity has data and stamps the sync time", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    const records = await buildBlobRecords(T1);
    const record = fastingRecord(records);
    expect(record).toBeDefined();
    expect(record?.id).toBe(FASTING);
    expect(record?.data).toEqual({ value: { "2026-03-01": "fasted" } });
    expect(record?.updatedAt).toBe(T1);
  });

  it("reuses the stored timestamp when content is unchanged (delta filter can skip it)", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    await buildBlobRecords(T1);
    const again = fastingRecord(await buildBlobRecords(T2));
    // Same content → keep the original timestamp even though "now" advanced.
    expect(again?.updatedAt).toBe(T1);
  });

  it("re-stamps when content changes", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    await buildBlobRecords(T1);
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted", "2026-03-02": "missed" });
    const changed = fastingRecord(await buildBlobRecords(T2));
    expect(changed?.updatedAt).toBe(T2);
  });

  it("propagates a clear-to-empty as a real change (deletion) once tracked", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    await buildBlobRecords(T1);
    // User cleared every fasting day; the empty value must still push.
    await writeJSON(DB_KEYS.fasting, {});
    const cleared = fastingRecord(await buildBlobRecords(T2));
    expect(cleared).toBeDefined();
    expect(cleared?.data).toEqual({ value: {} });
    expect(cleared?.updatedAt).toBe(T2);
  });

  it("skips pristine default location so a fresh device cannot clobber another", async () => {
    await writeJSON(DB_KEYS.location, {
      latitude: 21.4225,
      longitude: 39.8262,
      label: "Makkah, Saudi Arabia",
      city: "Makkah",
      country: "Saudi Arabia",
      method: "MuslimWorldLeague",
      madhab: "shafi",
      source: "default",
      updatedAt: null,
    });
    const records = await buildBlobRecords(T1);
    expect(records.find((r) => r.entity === "location")).toBeUndefined();
  });

  it("emits location once the user changes calc settings", async () => {
    await writeJSON(DB_KEYS.location, {
      latitude: 21.4225,
      longitude: 39.8262,
      label: "Makkah, Saudi Arabia",
      method: "Egyptian",
      madhab: "shafi",
      source: "default",
      updatedAt: null,
    });
    const record = (await buildBlobRecords(T1)).find((r) => r.entity === "location");
    expect(record).toBeDefined();
    expect((record?.data as { value: { method: string } } | undefined)?.value.method).toBe(
      "Egyptian",
    );
  });
});

describe("location coarsening (D46)", () => {
  const EXACT = buildStoredLocation({ latitude: 24.894812, longitude: 91.871534 });

  it("pushes coordinates rounded to ~1 km and keeps the exact fix on the device", async () => {
    await writeJSON(DB_KEYS.location, EXACT);
    const record = (await buildBlobRecords(T1)).find((r) => r.entity === "location");
    expect(record?.data).toEqual({ value: { ...EXACT, latitude: 24.89, longitude: 91.87 } });
    expect(await readJSON(DB_KEYS.location, null)).toEqual(EXACT);
  });

  it("doesn't re-push for GPS jitter inside the same ~1 km cell", async () => {
    await writeJSON(DB_KEYS.location, EXACT);
    await buildBlobRecords(T1);
    await writeJSON(DB_KEYS.location, { ...EXACT, latitude: 24.8932 });
    const record = (await buildBlobRecords(T2)).find((r) => r.entity === "location");
    expect(record?.updatedAt).toBe(T1);
  });

  it("a pulled rounded copy of the same place keeps the exact coordinates", async () => {
    await writeJSON(DB_KEYS.location, EXACT);
    await buildBlobRecords(T1);
    const pulled = { ...EXACT, latitude: 24.89, longitude: 91.87, method: "Egyptian" };

    await applyRemoteBlob("location", { value: pulled }, T2);

    expect(await readJSON(DB_KEYS.location, null)).toEqual({
      ...pulled,
      latitude: 24.894812,
      longitude: 91.871534,
    });
    // Our own echo is then a no-op (the push form is what's fingerprinted).
    const record = (await buildBlobRecords(T3)).find((r) => r.entity === "location");
    expect(record?.updatedAt).toBe(T2);
  });

  it("a pulled different place replaces the location", async () => {
    await writeJSON(DB_KEYS.location, EXACT);
    await buildBlobRecords(T1);
    const elsewhere = buildStoredLocation({ latitude: 51.51, longitude: -0.13 });

    await applyRemoteBlob("location", { value: elsewhere }, T2);

    expect(await readJSON(DB_KEYS.location, null)).toEqual(elsewhere);
  });
});

describe("applyRemoteBlob (last-write-wins)", () => {
  it("writes a pulled value and records it as applied", async () => {
    const applied = await applyRemoteBlob(KHATM, { value: { plan: "juz" } }, T2);
    expect(applied).toBe(true);
    expect(await readJSON(DB_KEYS.khatm, null)).toEqual({ plan: "juz" });
  });

  it("keeps a newer local value when the pulled copy is older (last-write-wins)", async () => {
    await writeJSON(DB_KEYS.khatm, { local: "plan" });
    await buildBlobRecords(T2);
    const applied = await applyRemoteBlob(KHATM, { value: { old: "plan" } }, T1);
    expect(applied).toBe(false);
    expect(await readJSON(DB_KEYS.khatm, null)).toEqual({ local: "plan" });
  });

  it("does not ping-pong: re-applying our own just-pushed record is a no-op", async () => {
    await writeJSON(DB_KEYS.khatm, { plan: "juz" });
    const record = khatmRecord(await buildBlobRecords(T2));
    const applied = await applyRemoteBlob(KHATM, record?.data ?? {}, record?.updatedAt ?? T2);
    expect(applied).toBe(false);
  });

  it("applies a newer remote over tracked local content", async () => {
    await writeJSON(DB_KEYS.khatm, { local: "plan" });
    await buildBlobRecords(T2);
    const applied = await applyRemoteBlob(KHATM, { value: { remote: "plan" } }, T3);
    expect(applied).toBe(true);
    expect(await readJSON(DB_KEYS.khatm, null)).toEqual({ remote: "plan" });
  });
});

describe("applyRemoteBlob (union-merge)", () => {
  it("merges keys from an older remote without dropping local edits", async () => {
    await writeJSON(DB_KEYS.fasting, { local: "fasted" });
    await buildBlobRecords(T2);
    const applied = await applyRemoteBlob(FASTING, { value: { old: "missed" } }, T1);
    expect(applied).toBe(true);
    expect(await readJSON(DB_KEYS.fasting, null)).toEqual({ old: "missed", local: "fasted" });
  });

  it("does not ping-pong when the server echoes an identical union-merge blob", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    const record = fastingRecord(await buildBlobRecords(T2));
    const applied = await applyRemoteBlob(FASTING, record?.data ?? {}, record?.updatedAt ?? T2);
    expect(applied).toBe(false);
  });

  it("keeps local values on key conflict when merging a newer remote", async () => {
    await writeJSON(DB_KEYS.fasting, { day: "fasted", local: "fasted" });
    await buildBlobRecords(T2);
    const applied = await applyRemoteBlob(
      FASTING,
      { value: { day: "missed", remote: "missed" } },
      T3,
    );
    expect(applied).toBe(true);
    expect(await readJSON(DB_KEYS.fasting, null)).toEqual({
      day: "fasted",
      remote: "missed",
      local: "fasted",
    });
  });
});

describe("Qur'an practice blobs (§10, D7)", () => {
  const sessionsKey = DB_KEYS.quranPracticeSessions;
  const memoKey = DB_KEYS.quranMemorization;

  it("registers the three practice entities", () => {
    expect(isBlobEntity("quran_companion_prefs")).toBe(true);
    expect(isBlobEntity("quran_practice_sessions")).toBe(true);
    expect(isBlobEntity("quran_memorization")).toBe(true);
  });

  it("never pushes pristine default practice prefs from a fresh device", async () => {
    await writeJSON(DB_KEYS.quranCompanionPrefs, {
      ...DEFAULT_COMPANION_PREFS,
      showTranslation: false,
      readingTogglesSeeded: true,
    });
    const records = await buildBlobRecords(T1);
    expect(records.find((r) => r.entity === "quran_companion_prefs")).toBeUndefined();
  });

  it("pushes prefs once the person changes a practice setting", async () => {
    await writeJSON(DB_KEYS.quranCompanionPrefs, {
      ...DEFAULT_COMPANION_PREFS,
      dailyRevisionLimit: 20,
    });
    const records = await buildBlobRecords(T1);
    expect(records.find((r) => r.entity === "quran_companion_prefs")).toBeDefined();
  });

  it("converges memorization on the later record, even when local is newer by watermark", async () => {
    await writeJSON(memoKey, {
      schemaVersion: 1,
      records: { "1:1": { s: "p", k: 1, i: 1, n: "2026-07-02", a: 100, l: 0, u: 100 } },
    });
    await buildBlobRecords(T3);
    const applied = await applyRemoteBlob(
      "quran_memorization",
      {
        value: {
          schemaVersion: 1,
          records: {
            "1:1": { s: "p", k: 2, i: 3, n: "2026-07-05", a: 200, l: 0, u: 200 },
            "2:255": { s: "l", k: 0, i: 0, n: "2026-07-02", a: 150, l: 0, u: 150 },
          },
        },
      },
      T1,
    );
    expect(applied).toBe(true);
    const stored = await readJSON<{ records: Record<string, { i: number }> }>(memoKey, {
      records: {},
    });
    expect(stored.records["1:1"].i).toBe(3);
    expect(Object.keys(stored.records).sort()).toEqual(["1:1", "2:255"]);
  });

  it("a remote history clear removes local sessions that ended before it", async () => {
    await writeJSON(sessionsKey, {
      schemaVersion: 1,
      items: [{ id: "old", endedAt: "2026-07-01T10:00:00.000Z" }],
    });
    await applyRemoteBlob(
      "quran_practice_sessions",
      { value: { schemaVersion: 1, clearedAt: "2026-07-01T12:00:00.000Z", items: [] } },
      T2,
    );
    const stored = await readJSON<{ items: unknown[]; clearedAt?: string }>(sessionsKey, {
      items: [],
    });
    expect(stored.items).toEqual([]);
    expect(stored.clearedAt).toBe("2026-07-01T12:00:00.000Z");
  });

  it("pushes the merged value back when it differs from the server's", async () => {
    await writeJSON(sessionsKey, {
      schemaVersion: 1,
      items: [{ id: "local", endedAt: "2026-07-02T10:00:00.000Z" }],
    });
    await applyRemoteBlob(
      "quran_practice_sessions",
      {
        value: { schemaVersion: 1, items: [{ id: "remote", endedAt: "2026-07-01T10:00:00.000Z" }] },
      },
      T2,
    );
    const records = await buildBlobRecords(T3);
    const pushed = records.find((r) => r.entity === "quran_practice_sessions");
    expect(pushed?.updatedAt).toBe(T3);
    expect(
      (pushed?.data as { value: { items: { id: string }[] } } | undefined)?.value.items.map(
        (i) => i.id,
      ),
    ).toEqual(["local", "remote"]);
  });
});

describe("applyRemoteBlob edge cases", () => {
  it("ignores an entity that is not blob-synced", async () => {
    await expect(applyRemoteBlob("prayer_logs", { value: {} }, T1)).resolves.toBe(false);
  });

  it("treats a record without a value as an empty blob", async () => {
    await writeJSON(DB_KEYS.khatm, { plan: null, ayahsRead: 3 });
    await applyRemoteBlob(KHATM, {}, T1);
    expect(await readJSON(DB_KEYS.khatm, "missing")).toBeNull();
  });

  it("union-merges array blobs without duplicates", async () => {
    await writeJSON(DB_KEYS.toursSeen, ["home", "qibla"]);
    await applyRemoteBlob("tours_seen", { value: ["qibla", "zikr"] }, T1);
    expect(await readJSON(DB_KEYS.toursSeen, [])).toEqual(["home", "qibla", "zikr"]);
  });

  it("de-duplicates object entries in array blobs by content", async () => {
    await writeJSON(DB_KEYS.toursSeen, [{ id: "a" }]);
    await applyRemoteBlob("tours_seen", { value: [{ id: "a" }, { id: "b" }] }, T1);
    expect(await readJSON(DB_KEYS.toursSeen, [])).toEqual([{ id: "a" }, { id: "b" }]);
  });

  it("keeps local content when the remote union blob is empty", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    await applyRemoteBlob(FASTING, { value: {} }, T1);
    expect(await readJSON(DB_KEYS.fasting, {})).toEqual({ "2026-03-01": "fasted" });
  });

  it("takes the remote value when union shapes disagree", async () => {
    await writeJSON(DB_KEYS.toursSeen, ["home"]);
    await applyRemoteBlob("tours_seen", { value: { legacy: true } }, T1);
    expect(await readJSON(DB_KEYS.toursSeen, null)).toEqual({ legacy: true });
  });
});

describe("buildBlobRecords pristine guards", () => {
  const entityRecord = (records: Awaited<ReturnType<typeof buildBlobRecords>>, entity: string) =>
    records.find((r) => r.entity === entity);

  it("never writes the retired reading-text visibility blob (D13)", async () => {
    await writeJSON(DB_KEYS.readingTextVisibility, { showTranslation: false });
    expect(entityRecord(await buildBlobRecords(T1), "reading_text_visibility")).toBeUndefined();
  });

  it("emits a default-sourced location that carries per-salah adjustments", async () => {
    await writeJSON(DB_KEYS.location, { ...DEFAULT_LOCATION, prayerAdjustments: { fajr: 2 } });
    expect(entityRecord(await buildBlobRecords(T1), "location")).toBeDefined();
  });

  it("skips a default location with an empty adjustments map", async () => {
    await writeJSON(DB_KEYS.location, { ...DEFAULT_LOCATION, prayerAdjustments: {} });
    expect(entityRecord(await buildBlobRecords(T1), "location")).toBeUndefined();
  });
});

describe("reloadBlobStores", () => {
  const originals = {
    fasting: fastingStore.getState(),
    khatm: khatmStore.getState(),
    tracker: trackerStore.getState(),
    location: locationStore.getState(),
  };

  afterEach(() => {
    fastingStore.setState(originals.fasting);
    khatmStore.setState(originals.khatm);
    trackerStore.setState(originals.tracker);
    locationStore.setState(originals.location);
  });

  it("reloads each loaded store once and skips stores never loaded", async () => {
    const fastingLoad = jest.fn(async () => {});
    const khatmLoad = jest.fn(async () => {});
    fastingStore.setState({ isReady: true, load: fastingLoad });
    khatmStore.setState({ isReady: false, load: khatmLoad });

    await reloadBlobStores(["fasting", "fasting", "khatm", "not_a_blob"]);

    expect(fastingLoad).toHaveBeenCalledTimes(1);
    expect(khatmLoad).not.toHaveBeenCalled();
  });

  it("refreshes the tracker only when it is loaded", async () => {
    const refresh = jest.fn(async () => {});
    trackerStore.setState({ isReady: false, refresh });
    await reloadBlobStores(["qaza_schedule"]);
    expect(refresh).not.toHaveBeenCalled();

    trackerStore.setState({ isReady: true });
    await reloadBlobStores(["qaza_daily_progress"]);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("applies a synced location from disk without a GPS refresh", async () => {
    locationStore.setState({ isReady: true, location: DEFAULT_LOCATION, status: "loading" });
    await writeJSON(DB_KEYS.location, buildStoredLocation({ city: "Synced" }));

    await reloadBlobStores(["location"]);

    expect(locationStore.getState()).toMatchObject({
      status: "ready",
      location: { city: "Synced" },
    });
  });

  it("leaves the location alone when nothing is stored or the store is not loaded", async () => {
    locationStore.setState({ isReady: true, location: DEFAULT_LOCATION, status: "loading" });
    await reloadBlobStores(["location"]);
    expect(locationStore.getState().status).toBe("loading");

    locationStore.setState({ isReady: false });
    await writeJSON(DB_KEYS.location, buildStoredLocation({ city: "Synced" }));
    await reloadBlobStores(["location"]);
    expect(locationStore.getState().location).toBe(DEFAULT_LOCATION);
  });
});

describe("quran_notes over the 1 MB sync cap (H2)", () => {
  const NOTES = "quran_notes";
  const LATER = "2026-07-04T00:00:00.000Z";

  /** ~130 notes of 4.5 KB each (~600 KB): two of these don't fit under the cap. */
  function bigNotes(prefix: string, at: string): Record<string, AyahNote> {
    const map: Record<string, AyahNote> = {};
    for (let i = 0; i < 130; i++) {
      const id = `${prefix}${i}`;
      map[id] = {
        id,
        surah: 2,
        ayah: 255,
        body: "x".repeat(4500),
        tags: [],
        createdAt: at,
        updatedAt: at,
      };
    }
    return map;
  }

  const notesRecord = (records: Awaited<ReturnType<typeof buildBlobRecords>>) =>
    records.find((r) => r.entity === NOTES);

  it("keeps every local note, parks the remote and pauses pushes; resumes once there's room", async () => {
    const local = bigNotes("mine", T1);
    const remote = bigNotes("theirs", T2);
    await writeJSON(DB_KEYS.quranNotes, local);
    await buildBlobRecords(T1);

    // Never throws, never drops a local note.
    await applyRemoteBlob(NOTES, { value: remote }, T2);
    const kept = await readJSON<Record<string, AyahNote>>(DB_KEYS.quranNotes, {});
    for (const id of Object.keys(local)) expect(kept[id]?.body).toBe(local[id]?.body);
    const hold = await readBlobHold(NOTES);
    expect(hold).toMatchObject({ reason: "overflow", updatedAt: T2 });
    expect(hold?.pending).toBeGreaterThan(0);
    // Pushing now would overwrite the server copy the parked notes came from.
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    const paused = await buildBlobRecords(T3);
    expect(notesRecord(paused)).toBeUndefined();
    expect(fastingRecord(paused)).toBeDefined();

    // The user deletes most local notes: the next push merges the parked notes and resumes.
    const trimmed = Object.fromEntries(Object.entries(kept).filter(([id]) => id === "mine0"));
    await writeJSON(DB_KEYS.quranNotes, trimmed);
    const resumed = notesRecord(await buildBlobRecords(LATER));
    expect(resumed).toBeDefined();
    const pushed = (resumed?.data as { value: Record<string, AyahNote> } | undefined)?.value ?? {};
    expect(Object.keys(pushed)).toEqual(expect.arrayContaining(["mine0", ...Object.keys(remote)]));
    expect(await readBlobHold(NOTES)).toBeNull();
  });

  it("a newer remote that merges cleanly releases an older parked one", async () => {
    await writeJSON(DB_KEYS.quranNotes, bigNotes("mine", T1));
    await applyRemoteBlob(NOTES, { value: bigNotes("theirs", T2) }, T2);
    expect(await readBlobHold(NOTES)).not.toBeNull();
    await applyRemoteBlob(NOTES, { value: {} }, T3);
    expect(await readBlobHold(NOTES)).toBeNull();
  });

  it("skips an invalid value instead of failing the whole push", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    // A legacy blob over the cap (e.g. written before the store capped saves).
    await writeJSON(DB_KEYS.quranNotes, { ...bigNotes("a", T1), ...bigNotes("b", T1) });
    const records = await buildBlobRecords(T1);
    expect(notesRecord(records)).toBeUndefined();
    expect(fastingRecord(records)).toBeDefined();
    expect(getSkippedBlobEntities()).toContain(NOTES);

    await writeJSON(DB_KEYS.quranNotes, bigNotes("a", T1));
    expect(notesRecord(await buildBlobRecords(T2))).toBeDefined();
    expect(getSkippedBlobEntities()).not.toContain(NOTES);
  });
});

describe("applyRemoteBlob serializes with local writers (H1)", () => {
  // The edit-during-async-merge regression lives in lib/vault/vault-sync.test.ts (H1).
  it("an overlapping store edit and pull both survive, and the result is pushed", async () => {
    const at = "2026-07-01T00:00:00.000Z";
    const note = (id: string, body: string): AyahNote => ({
      id,
      surah: 1,
      ayah: 1,
      body,
      tags: [],
      createdAt: at,
      updatedAt: at,
    });
    await writeJSON(DB_KEYS.quranNotes, { a: note("a", "local") });
    await buildBlobRecords(T1);

    // Start the pull, then a local save on the same key before the pull settles.
    const pull = applyRemoteBlob("quran_notes", { value: { b: note("b", "remote") } }, T2);
    const edit = updateJSON<Record<string, AyahNote>>(DB_KEYS.quranNotes, {}, (current) => ({
      ...current,
      c: note("c", "typed during sync"),
    }));
    await Promise.all([pull, edit]);

    const stored = await readJSON<Record<string, AyahNote>>(DB_KEYS.quranNotes, {});
    expect(Object.keys(stored).sort()).toEqual(["a", "b", "c"]);
    const pushed = (await buildBlobRecords(T3)).find((r) => r.entity === "quran_notes");
    expect(
      Object.keys((pushed?.data as { value: object } | undefined)?.value ?? {}).sort(),
    ).toEqual(["a", "b", "c"]);
  });
});
