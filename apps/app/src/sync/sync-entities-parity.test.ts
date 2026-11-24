import { readFileSync } from "node:fs";
import path from "node:path";

import { SyncRecordDtoEntity } from "@munib-tracker/api-client";
import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";

import { BACKUP_KEYS } from "@/db/keys";

import { BLOB_ENTITIES } from "./blob-sync";
import { buildSyncRecords, TYPED_SYNC_ENTITIES } from "./records";

/**
 * Data-integrity guard: the client's sync entities (typed records + generic
 * blobs) and the API's `SYNC_ENTITIES` whitelist (`@IsIn` on every pushed
 * record) must agree. A client-only entity is rejected by the server on every
 * push; a server-only entity is data nobody writes or applies.
 */

/** Accepted by the API but never pushed by this client (documented in sync.dto.ts). */
const SERVER_ONLY = new Set([
  // Server-managed reset marker: pulled and applied by `sync-engine`, never pushed.
  "data_reset",
]);

/** A `const NAME = [...] as const` list parsed from the API source (the app can't import NestJS DTOs). */
function serverEntityList(name: "SYNC_ENTITIES" | "RETIRED_SYNC_ENTITIES"): string[] {
  const file = path.resolve(__dirname, "../../../api/src/sync/dto/sync.dto.ts");
  const source = readFileSync(file, "utf8");
  const body = new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const;`).exec(source)?.[1];
  if (!body) throw new Error(`${name} not found in apps/api/src/sync/dto/sync.dto.ts`);
  const withoutComments = body.replace(/\/\/.*$/gm, "");
  return [...withoutComments.matchAll(/"([a-z_]+)"/g)].map((m) => m[1] as string);
}

const EMPTY_SNAPSHOT = {
  nowIso: "2026-11-24T00:00:00.000Z",
  prayerLogs: [],
  zikrProgress: [],
  qazaCounters: [],
  roza: { remaining: 0, completed: 0 },
  preferences: DEFAULT_USER_PREFERENCES,
  tombstones: [],
  duaFavorites: { order: [] },
  duroodFavorites: { order: [] },
  nameFavorites: { order: [] },
  quranBookmarks: [],
  quranLastRead: null,
  hadithBookmarks: [],
  customTasbeeh: { items: [] },
};

const clientEntities = [...TYPED_SYNC_ENTITIES, ...BLOB_ENTITIES.map((e) => e.entity)];

describe("sync entity parity (client ↔ API)", () => {
  const server = serverEntityList("SYNC_ENTITIES");
  const retired = serverEntityList("RETIRED_SYNC_ENTITIES");

  it("has no duplicate entity on either side", () => {
    expect(new Set(server).size).toBe(server.length);
    expect(new Set(clientEntities).size).toBe(clientEntities.length);
  });

  it("every entity the client pushes is whitelisted by the API", () => {
    const missingOnServer = clientEntities.filter((e) => !server.includes(e));
    expect(missingOnServer).toEqual([]);
  });

  it("every API entity is written by the client (or is a documented server-only one)", () => {
    const unusedOnClient = server.filter((e) => !clientEntities.includes(e) && !SERVER_ONLY.has(e));
    expect(unusedOnClient).toEqual([]);
    for (const e of SERVER_ONLY) expect(clientEntities).not.toContain(e);
  });

  it("never pushes an entity the API has retired (accepted only for old clients, then ignored)", () => {
    expect(retired).toEqual(
      expect.arrayContaining(["khushu_journal", "reading_text_visibility", "white_days_checklist"]),
    );
    for (const e of retired) {
      expect(server).not.toContain(e);
      expect(clientEntities).not.toContain(e);
    }
  });

  it("the generated api-client enum matches the API source (run `pnpm generate:api` if not)", () => {
    expect([...Object.values(SyncRecordDtoEntity)].sort()).toEqual([...server].sort());
  });

  it("buildSyncRecords only emits entities listed in TYPED_SYNC_ENTITIES", () => {
    const t = "2026-11-24T10:00:00.000Z";
    const records = buildSyncRecords({
      nowIso: t,
      prayerLogs: [
        {
          id: "p",
          prayerId: "fajr",
          date: "2026-11-24",
          status: "completed",
          updatedAt: t,
          source: "manual",
        },
      ],
      zikrProgress: [
        { id: "z", zikrId: "z1", date: "2026-11-24", count: 1, target: 33, completed: false },
      ],
      qazaCounters: [{ prayerId: "fajr", remaining: 3, completed: 1, updatedAt: t }],
      roza: { remaining: 1, completed: 0, updatedAt: t },
      preferences: { ...DEFAULT_USER_PREFERENCES, updatedAt: t, favoritesUpdatedAt: t },
      tombstones: [{ entity: "prayer_logs", id: "fajr::2026-11-23", deletedAt: t }],
      duaFavorites: { order: ["d1"], updatedAt: t },
      duroodFavorites: { order: ["r1"], updatedAt: t },
      nameFavorites: { order: ["n1"], updatedAt: t },
      quranBookmarks: [{ surah: 1, ayah: 1, createdAt: t }],
      quranBookmarksUpdatedAt: t,
      quranLastRead: { surah: 2, ayah: 255, updatedAt: t },
      hadithBookmarks: [{ collection: "bukhari", number: 1, createdAt: t }],
      hadithBookmarksUpdatedAt: t,
      customTasbeeh: { items: [], updatedAt: t },
    } as unknown as Parameters<typeof buildSyncRecords>[0]);

    const emitted = new Set(records.map((r) => r.entity as string));
    for (const entity of emitted) expect(TYPED_SYNC_ENTITIES).toContain(entity);
    // The fixture touches every typed entity, so the list has no dead entries either.
    expect([...emitted].sort()).toEqual([...TYPED_SYNC_ENTITIES].sort());
  });

  it("D46: private data syncs only through the vault", () => {
    const blobs = BLOB_ENTITIES.map((e) => e.entity);
    expect(blobs).not.toContain("khushu_journal");
    expect(blobs).toEqual(expect.arrayContaining(["vault_excused", "vault_khushu"]));
    const log = buildSyncRecords({
      ...EMPTY_SNAPSHOT,
      prayerLogs: [
        {
          id: "p",
          prayerId: "fajr",
          date: "2026-11-24",
          status: "pending",
          isExcused: true,
          excusedReason: "hayd",
          updatedAt: "2026-11-24T00:00:00.000Z",
          source: "manual",
        },
      ],
      preferences: {
        ...DEFAULT_USER_PREFERENCES,
        activeExcusedReason: "hayd",
        updatedAt: "2026-11-24T00:00:00.000Z",
      },
    } as unknown as Parameters<typeof buildSyncRecords>[0]);
    expect(JSON.stringify(log)).not.toContain("hayd");
    expect(log.find((r) => r.entity === "prayer_logs")?.data).toMatchObject({ isExcused: true });
  });

  it("only backed-up user data syncs — device-local keys and caches never do", () => {
    // BACKUP_KEYS = `userData` + `watermark` (keys.ts); `deviceLocal` / `cache` /
    // `schema` keys are excluded, so a blob outside it would leak device state.
    const deviceOrCache = BLOB_ENTITIES.filter((e) => !BACKUP_KEYS.includes(e.storageKey));
    expect(deviceOrCache.map((e) => e.entity)).toEqual([]);
  });
});
