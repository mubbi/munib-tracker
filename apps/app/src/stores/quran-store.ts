import { initDatabase, QuranRepository } from "@/db";
import {
  DEFAULT_QURAN_PREFS,
  type QuranBookmark,
  type QuranLastRead,
  type QuranPrefs,
} from "@/db/repositories/quran-repository";
import { buildQuranActivity } from "@/lib/continue-activity";
import { getPageForAyah } from "@/lib/quran-meta";
import { recordContinueActivity } from "@/stores/continue-store";

import { createStore, useStore } from "./create-store";
import { devicePreferencesStore, overlayDeviceOnQuranPrefs } from "./device-preferences-store";

/** B4: `ttsVoiceByLang` is a device preference (voice ids differ per device). */
function withDevice(prefs: QuranPrefs): QuranPrefs {
  return overlayDeviceOnQuranPrefs(prefs, devicePreferencesStore.getState().prefs);
}

export interface QuranState {
  prefs: QuranPrefs;
  lastRead: QuranLastRead | null;
  bookmarks: QuranBookmark[];
  isReady: boolean;

  load: () => Promise<void>;
  updatePrefs: (patch: Partial<QuranPrefs>) => Promise<void>;
  setLastRead: (
    surah: number,
    ayah: number,
    options?: { isAudio?: boolean; page?: number },
  ) => Promise<void>;
  toggleBookmark: (surah: number, ayah: number) => Promise<boolean>;
  recordProgress: (surah: number, ayah: number) => Promise<void>;
}

export const quranStore = createStore<QuranState>((set, get) => ({
  prefs: DEFAULT_QURAN_PREFS,
  lastRead: null,
  bookmarks: [],
  isReady: false,

  async load() {
    await initDatabase();
    const [prefs, lastRead, bookmarks] = await Promise.all([
      QuranRepository.getPrefs(),
      QuranRepository.getLastRead(),
      QuranRepository.getBookmarks(),
    ]);
    set({ prefs: withDevice(prefs), lastRead, bookmarks, isReady: true });
  },

  async updatePrefs(input) {
    const { ttsVoiceByLang, ...patch } = input;
    if (ttsVoiceByLang !== undefined) {
      await devicePreferencesStore.getState().update({ ttsVoiceByLang });
      if (Object.keys(patch).length === 0) return;
    }
    const prefs = await QuranRepository.updatePrefs(patch);
    set({ prefs: withDevice(prefs) });
  },

  async setLastRead(surah, ayah, options) {
    const page = options?.page ?? getPageForAyah(surah, ayah);
    await QuranRepository.setLastRead(surah, ayah, page);
    set({ lastRead: { surah, ayah, page, updatedAt: new Date().toISOString() } });
    recordContinueActivity(
      buildQuranActivity(surah, ayah, {
        isAudio: options?.isAudio,
        page,
        layout: get().prefs.readerLayout,
      }),
    );
  },

  async toggleBookmark(surah, ayah) {
    const added = await QuranRepository.toggleBookmark(surah, ayah);
    set({ bookmarks: await QuranRepository.getBookmarks() });
    return added;
  },

  async recordProgress(surah, ayah) {
    await QuranRepository.recordProgress(surah, ayah);
    await get().setLastRead(surah, ayah);
  },
}));

export function useQuranPrefs(): QuranPrefs {
  return useStore(quranStore, (s) => s.prefs);
}

export function useQuranReady(): boolean {
  return useStore(quranStore, (s) => s.isReady);
}

export function useLastRead(): QuranLastRead | null {
  return useStore(quranStore, (s) => s.lastRead);
}

export function useQuranBookmarks(): QuranBookmark[] {
  return useStore(quranStore, (s) => s.bookmarks);
}

export function useIsAyahBookmarked(surah: number, ayah: number): boolean {
  return useStore(quranStore, (s) => s.bookmarks.some((b) => b.surah === surah && b.ayah === ayah));
}

const quranActions = {
  load: (...args: Parameters<QuranState["load"]>) => quranStore.getState().load(...args),
  updatePrefs: (...args: Parameters<QuranState["updatePrefs"]>) =>
    quranStore.getState().updatePrefs(...args),
  setLastRead: (...args: Parameters<QuranState["setLastRead"]>) =>
    quranStore.getState().setLastRead(...args),
  toggleBookmark: (...args: Parameters<QuranState["toggleBookmark"]>) =>
    quranStore.getState().toggleBookmark(...args),
  recordProgress: (...args: Parameters<QuranState["recordProgress"]>) =>
    quranStore.getState().recordProgress(...args),
} as const;

export function useQuranActions() {
  return quranActions;
}

// B4: a device-preference write re-overlays the Qur'an prefs readers see.
devicePreferencesStore.subscribe(() => {
  const current = quranStore.getState().prefs;
  const next = withDevice(current);
  if (next !== current) quranStore.setState({ prefs: next });
});
