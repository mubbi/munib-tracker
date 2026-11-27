import type { TajweedCoachingPlan } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { fetchSurahTajweed } from "@/api/quran-tajweed";
import { fetchSurahWords } from "@/api/quran-words";
import { buildDueQueue } from "@/lib/quran-companion/due-queue";
import {
  alignmentBoundaryReliable,
  loadFlaggedWords,
} from "@/lib/quran-pronunciation/flagged-words";
import { hifzStore } from "@/stores/hifz-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranMemorizationStore } from "@/stores/quran-memorization-store";
import { quranPracticeStore } from "@/stores/quran-practice-store";
import { tajweedCoachingStore } from "@/stores/tajweed-coaching-store";

import { type StudyWordTajweed, studyWordTajweed } from "./ayah-words";
import { ayahKey, buildCoachingPlan, collectCoachingAyahs } from "./plan";

/**
 * Build (or rebuild) the coaching plan from the person's own practice and save
 * it in the `tajweed_coaching` store. Reads the lazy practice stores, NF-3.24's
 * flagged words (`loadFlaggedWords` — `[]` when they opted out, D20) and the
 * cache-first tajweed markup + study words of the touched surahs. All local
 * except the one-time, cache-first content fetches; no audio is involved.
 *
 * - `no-practice`: nothing to build from yet (the stored plan is cleared);
 * - `offline`: the markup couldn't be loaded for any ayah (stored plan kept);
 * - `empty`: the ayahs contain no coachable sound (plan cleared);
 * - `ok`: a new plan was saved.
 */
export type RefreshOutcome = "ok" | "empty" | "no-practice" | "offline";

async function ensureLoaded(store: {
  getState: () => { isReady: boolean; load: () => Promise<void> };
}) {
  if (!store.getState().isReady) await store.getState().load();
}

export async function refreshCoachingPlan(
  options: { language?: string; now?: Date } = {},
): Promise<{ outcome: RefreshOutcome; plan: TajweedCoachingPlan | null }> {
  const now = options.now ?? new Date();
  const language = options.language ?? "en";
  await Promise.all([
    ensureLoaded(quranCompanionPrefsStore),
    ensureLoaded(quranPracticeStore),
    ensureLoaded(quranMemorizationStore),
    ensureLoaded(hifzStore),
    ensureLoaded(tajweedCoachingStore),
  ]);

  const flagged = await loadFlaggedWords();
  const due = buildDueQueue({
    records: quranMemorizationStore.getState().records,
    hifz: hifzStore.getState().statuses,
    includeHifzReview: quranCompanionPrefsStore.getState().prefs.includeHifzReview,
    today: getLocalDateString(now),
  });
  const ayahs = collectCoachingAyahs({
    history: quranPracticeStore.getState().history,
    due,
    flagged,
  });
  const coaching = tajweedCoachingStore.getState();
  if (!ayahs.length) {
    await coaching.setPlan(null);
    return { outcome: "no-practice", plan: null };
  }

  const wordData = new Map<string, StudyWordTajweed[]>();
  const surahs = [...new Set(ayahs.map((a) => a.surah))];
  await Promise.all(
    surahs.map(async (surah) => {
      try {
        const [markup, words] = await Promise.all([
          fetchSurahTajweed(surah),
          fetchSurahWords(surah, language),
        ]);
        for (const a of ayahs) {
          if (a.surah !== surah) continue;
          const segments = markup[String(a.ayah)];
          const study = words[String(a.ayah)];
          if (!segments?.length || !study?.length) continue;
          wordData.set(
            ayahKey(a.surah, a.ayah),
            studyWordTajweed(
              segments,
              study.map((w) => w.arabic),
            ),
          );
        }
      } catch {
        // Offline / CDN failure for this surah: build from the rest.
      }
    }),
  );
  if (wordData.size === 0) {
    return { outcome: "offline", plan: coaching.data.plan ?? null };
  }

  const plan = buildCoachingPlan({
    ayahs,
    wordData,
    flagged,
    state: tajweedCoachingStore.getState().data,
    alignmentReliable: alignmentBoundaryReliable(),
    now,
  });
  await tajweedCoachingStore.getState().setPlan(plan);
  return { outcome: plan ? "ok" : "empty", plan };
}
