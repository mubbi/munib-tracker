import { resetDatabase } from "@/db";
import { clearPinLockStorage } from "@/features/pin-lock/lib/pin-lock-storage";
import {
  emptyWidgetSnapshot,
  writeWidgetSnapshot,
} from "@/lib/appSurfaces/widgets/snapshotStorage";
import { clearDownloadedAudio, clearDownloadedQcfFonts } from "@/lib/cache-manager";
import { clearAllInAppNotifications } from "@/lib/in-app-notifications/storage";
import { clearRecentSearches } from "@/lib/search-history";
import { reloadAllStores } from "@/stores/reload-all-stores";

/**
 * Full local wipe used by account deletion and “Reset app data”. It preserves
 * the auth session while clearing every RESET_KEYS entry plus ancillary storage that lives outside `DB_KEYS`
 * (downloaded files, PIN, search history, in-app inbox, widget snapshot).
 *
 * Callers that own React state for PIN / inbox should also reset those providers
 * afterward so in-memory UI matches disk.
 */
export async function wipeLocalDeviceData(): Promise<void> {
  await resetDatabase();
  await Promise.all([
    clearDownloadedAudio(),
    clearDownloadedQcfFonts(),
    clearRecentSearches(),
    clearAllInAppNotifications(),
    clearPinLockStorage(),
    writeWidgetSnapshot(emptyWidgetSnapshot()),
  ]);
  await reloadAllStores();
}
