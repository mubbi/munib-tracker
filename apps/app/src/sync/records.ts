import type { SyncRecordDto } from "@munib-tracker/api-client";
import type {
  PrayerLog,
  QazaCounter,
  QazaRozaCounter,
  UserPreferences,
  ZikrProgress,
} from "@munib-tracker/shared/types";

import { prayerLogKey, zikrProgressKey } from "@/db/keys";
import type { HadithBookmark } from "@/db/repositories/hadith-repository";
import type { QuranBookmark, QuranLastRead } from "@/db/repositories/quran-repository";
import type { Tombstone } from "@/db/repositories/tombstone-repository";
import type { FavoritesBlob } from "@/stores/create-favorites-store";
import type { CustomTasbeehBlob } from "@/stores/custom-tasbeeh-store";

export interface LocalSnapshot {
  nowIso: string;
  prayerLogs: PrayerLog[];
  zikrProgress: ZikrProgress[];
  qazaCounters: QazaCounter[];
  roza: QazaRozaCounter;
  preferences: UserPreferences;
  /** Pending local deletions to emit as `deletedAt` records. */
  tombstones: Tombstone[];
  // Blob entities synced as a single last-write-wins record each.
  duaFavorites: FavoritesBlob;
  duroodFavorites: FavoritesBlob;
  nameFavorites: FavoritesBlob;
  quranBookmarks: QuranBookmark[];
  quranBookmarksUpdatedAt?: string;
  quranLastRead: QuranLastRead | null;
  hadithBookmarks: HadithBookmark[];
  hadithBookmarksUpdatedAt?: string;
  customTasbeeh: CustomTasbeehBlob;
}

/** Reconstructs the minimal payload a tombstone needs from its record id. */
function tombstoneData(tombstone: Tombstone): Record<string, unknown> {
  if (tombstone.entity === "prayer_logs") {
    const [prayerId, date] = tombstone.id.split("::");
    return { prayerId, date };
  }
  return {};
}

/**
 * Maps the local database into the flat record list the sync API expects. Each
 * record carries the entity's real `updatedAt` (not "now") so the server's
 * last-write-wins comparison reflects the true edit time; deletions are emitted
 * as records with `deletedAt` set so they propagate instead of resurrecting.
 */
export function buildSyncRecords(snapshot: LocalSnapshot): SyncRecordDto[] {
  const records: SyncRecordDto[] = [];

  for (const log of snapshot.prayerLogs) {
    records.push({
      entity: "prayer_logs",
      id: prayerLogKey(log.prayerId, log.date),
      data: { ...log },
      updatedAt: log.updatedAt,
    });
  }

  for (const entry of snapshot.zikrProgress) {
    records.push({
      entity: "zikr_progress",
      id: zikrProgressKey(entry.zikrId, entry.date),
      data: { ...entry },
      updatedAt: entry.updatedAt ?? snapshot.nowIso,
    });
  }

  for (const counter of snapshot.qazaCounters) {
    records.push({
      entity: "qaza_entries",
      id: counter.prayerId,
      data: { ...counter },
      updatedAt: counter.updatedAt ?? snapshot.nowIso,
    });
  }
  records.push({
    entity: "qaza_entries",
    id: "roza",
    data: { ...snapshot.roza },
    updatedAt: snapshot.roza.updatedAt ?? snapshot.nowIso,
  });

  records.push({
    entity: "preferences",
    id: "preferences",
    data: { ...snapshot.preferences },
    updatedAt: snapshot.preferences.updatedAt ?? snapshot.nowIso,
  });

  records.push({
    entity: "favorites",
    id: "favorites",
    data: {
      ids: snapshot.preferences.favoriteZikrIds,
      order: snapshot.preferences.favoriteZikrOrder,
    },
    updatedAt: snapshot.preferences.favoritesUpdatedAt ?? snapshot.nowIso,
  });

  records.push({
    entity: "dua_favorites",
    id: "dua_favorites",
    data: { order: snapshot.duaFavorites.order },
    updatedAt: snapshot.duaFavorites.updatedAt ?? snapshot.nowIso,
  });

  records.push({
    entity: "durood_favorites",
    id: "durood_favorites",
    data: { order: snapshot.duroodFavorites.order },
    updatedAt: snapshot.duroodFavorites.updatedAt ?? snapshot.nowIso,
  });

  records.push({
    entity: "name_favorites",
    id: "name_favorites",
    data: { order: snapshot.nameFavorites.order },
    updatedAt: snapshot.nameFavorites.updatedAt ?? snapshot.nowIso,
  });

  records.push({
    entity: "quran_bookmarks",
    id: "quran_bookmarks",
    data: { bookmarks: snapshot.quranBookmarks },
    updatedAt: snapshot.quranBookmarksUpdatedAt ?? snapshot.nowIso,
  });

  if (snapshot.quranLastRead) {
    records.push({
      entity: "quran_last_read",
      id: "quran_last_read",
      data: { ...snapshot.quranLastRead },
      updatedAt: snapshot.quranLastRead.updatedAt ?? snapshot.nowIso,
    });
  }

  records.push({
    entity: "hadith_bookmarks",
    id: "hadith_bookmarks",
    data: { bookmarks: snapshot.hadithBookmarks },
    updatedAt: snapshot.hadithBookmarksUpdatedAt ?? snapshot.nowIso,
  });

  records.push({
    entity: "custom_tasbeeh",
    id: "custom_tasbeeh",
    data: { items: snapshot.customTasbeeh.items },
    updatedAt: snapshot.customTasbeeh.updatedAt ?? snapshot.nowIso,
  });

  for (const tombstone of snapshot.tombstones) {
    records.push({
      entity: tombstone.entity as SyncRecordDto["entity"],
      id: tombstone.id,
      data: tombstoneData(tombstone),
      updatedAt: tombstone.deletedAt,
      deletedAt: tombstone.deletedAt,
    });
  }

  return records;
}
