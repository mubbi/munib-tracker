import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { applyRemoteBlob, buildBlobRecords, isBlobEntity } from "./blob-sync";

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
    expect(isBlobEntity("reading_text_visibility")).toBe(true);
    expect(isBlobEntity("hadith_prefs")).toBe(true);
    expect(isBlobEntity("zakat_calculator")).toBe(true);
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
    expect((record?.data as { value: { method: string } }).value.method).toBe("Egyptian");
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
