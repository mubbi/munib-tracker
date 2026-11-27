import AsyncStorage from "@react-native-async-storage/async-storage";

import { resetDatabase } from "@/db";
import { clearPinLockStorage } from "@/features/pin-lock/lib/pin-lock-storage";
import {
  emptyWidgetSnapshot,
  writeWidgetSnapshot,
} from "@/lib/appSurfaces/widgets/snapshotStorage";
import { clearDownloadedAudio, clearDownloadedQcfFonts } from "@/lib/cache-manager";
import { clearChildSession } from "@/lib/circles/child-session";
import { clearPendingExternalCommands } from "@/lib/external-commands/native-bridge";
import { resetNative as resetFocusLockNative } from "@/lib/focus-lock/native";
import { clearAllInAppNotifications } from "@/lib/in-app-notifications/storage";
import { clearPrintableExports } from "@/lib/printable/export-document";
import { deleteRecitationModelFiles } from "@/lib/quran-companion/model/model-store";
import { clearRecentSearches } from "@/lib/search-history";
import { THEME_MIRROR_KEYS } from "@/lib/theme-storage-keys";
import { clearOcrBrowserData } from "@/lib/timetable-ocr/recognize";
import { deleteVaultKey } from "@/lib/vault/vault";
import { clearVaultUnlockSession } from "@/lib/vault/vault-lock";
import { quranListenerStore } from "@/stores/quran-listener-store";
import { wipePronunciationModels } from "@/stores/quran-pronunciation-store";
import { reloadAllStores } from "@/stores/reload-all-stores";

/**
 * Full local wipe used by account deletion and “Reset app data”. It preserves
 * the auth session while clearing every RESET_KEYS entry plus ancillary storage that lives outside `DB_KEYS`
 * (downloaded files, PIN, vault data key, search history, in-app inbox, widget snapshot, theme mirror, and the
 * Qur'an practice listener files, which live outside AsyncStorage).
 *
 * Callers that own React state for PIN / inbox should also reset those providers
 * afterward so in-memory UI matches disk.
 */
export async function wipeLocalDeviceData(): Promise<void> {
  await resetDatabase();
  await Promise.all([
    clearDownloadedAudio(),
    clearDownloadedQcfFonts(),
    // `resetDatabase()` only clears the manifest key; the model files are separate.
    quranListenerStore
      .getState()
      .remove()
      .catch(() => deleteRecitationModelFiles()),
    wipePronunciationModels(),
    // NF-3.22 corpus file (outside DB_KEYS) + in-memory root index.
    // Lazy import keeps the root engine out of this module's static graph.
    import("@/stores/quran-roots-store")
      .then((m) => m.quranRootsStore.getState().clear())
      .catch(() => {}),
    clearRecentSearches(),
    clearAllInAppNotifications(),
    clearPinLockStorage(),
    writeWidgetSnapshot(emptyWidgetSnapshot()),
    // B6: theme mirror (colour mode / accent / custom accent) lives outside DB_KEYS.
    AsyncStorage.removeMany([...THEME_MIRROR_KEYS]),
    // Vault DEK (SecureStore / IndexedDB) — the ciphertext itself is in RESET_KEYS.
    deleteVaultKey().catch(() => {}),
    // NF-3.16: scoped child-session token (SecureStore) + its device-local cache.
    clearChildSession().catch(() => {}),
    // NF-3.13: picked apps + plan live natively (iOS App Group / Android prefs).
    resetFocusLockNative(),
    // Plaintext wasiyyah / debts PDF left in the cache by a killed share sheet.
    clearPrintableExports().catch(() => {}),
    // Widget / Siri / Wear commands still queued natively must not re-apply.
    clearPendingExternalCommands().catch(() => {}),
    // Web OCR: the download consent flag + Tesseract's cached language data.
    clearOcrBrowserData().catch(() => {}),
  ]);
  // In-memory "vault unlocked" grace window: the next vault screen asks again.
  clearVaultUnlockSession();
  await reloadAllStores();
}
