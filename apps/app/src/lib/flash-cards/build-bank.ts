import i18n from "@/i18n";
import { loadDuaItems, loadNamesOfAllah } from "@/lib/content-loaders";
import { ensureBundledCollection, getBundledCollection } from "@/lib/hadith-bundled";
import { ISLAMIC_EVENTS } from "@/lib/islamic-events";
import { getSurahMeta } from "@/lib/quran-meta";

import { mcqsFromDuas } from "./from-duas";
import { mcqsFromIslamicEvents } from "./from-events";
import { mcqsFromHaydGuide, mcqsFromSickGuide, mcqsFromTravelGuideCopy } from "./from-excused-i18n";
import { mcqsFromHadith } from "./from-hadith";
import { mcqsFromNames } from "./from-names";
import { mcqsFromQuranMeta } from "./from-quran-meta";
import { getLearnSectionDef, LEARN_QUIZ_SECTIONS, type LearnQuizSectionId } from "./learn-sections";
import { dedupeMcqs, sampleMcqs } from "./mcq-helpers";
import { SECTION_QUIZ_SIZE, type StudyMcq } from "./types";

type Translate = (key: string) => string;

function translate(key: string): string {
  return i18n.t(key);
}

let warmNames: StudyMcq[] = [];
let warmDuas: StudyMcq[] = [];
let warmHadith: StudyMcq[] = [];
let globalWarmPromise: Promise<void> | undefined;

/** Warm Names / duas / Nawawi once for the global flash pool. */
export async function warmGlobalFlashCorpora(): Promise<void> {
  if (!globalWarmPromise) {
    globalWarmPromise = (async () => {
      const [names, duas] = await Promise.all([loadNamesOfAllah(), loadDuaItems()]);
      warmNames = mcqsFromNames(names);
      warmDuas = mcqsFromDuas(duas);
      await ensureBundledCollection("nawawi40");
      const nawawi = getBundledCollection("nawawi40");
      warmHadith = nawawi ? mcqsFromHadith(nawawi.items) : [];
    })();
  }
  await globalWarmPromise;
}

/** Ensure all learn hubs that power the bank (best-effort parallel). */
export async function ensureFlashCardContent(): Promise<void> {
  await Promise.allSettled([
    ...LEARN_QUIZ_SECTIONS.map((section) => section.ensure()),
    warmGlobalFlashCorpora(),
  ]);
}

/** Ensure content for one learn section quiz. */
export async function ensureSectionQuizContent(sectionId: LearnQuizSectionId): Promise<void> {
  const def = getLearnSectionDef(sectionId);
  if (def) await def.ensure();
}

function collectReadyLearnSections(): StudyMcq[] {
  const out: StudyMcq[] = [];
  for (const section of LEARN_QUIZ_SECTIONS) {
    out.push(...section.collect());
  }
  return out;
}

function collectI18nGuides(t: Translate): StudyMcq[] {
  return [
    ...mcqsFromHaydGuide(t),
    ...mcqsFromSickGuide(t),
    ...mcqsFromTravelGuideCopy(t),
    ...mcqsFromIslamicEvents(ISLAMIC_EVENTS, t),
  ];
}

/**
 * Full flash-card pool from every loaded corpus.
 * Call {@link ensureFlashCardContent} first for a larger bank; safe to call early.
 */
export function getFlashCardPool(t: Translate = translate): StudyMcq[] {
  return dedupeMcqs([
    ...collectReadyLearnSections(),
    ...collectI18nGuides(t),
    ...mcqsFromQuranMeta(getSurahMeta()),
    ...warmNames,
    ...warmDuas,
    ...warmHadith,
  ]);
}

/**
 * Finite scored quiz set for a learn hub.
 * Samples {@link SECTION_QUIZ_SIZE} from the section bank.
 */
export function getQuestionsForSection(
  sectionId: LearnQuizSectionId,
  t: Translate = translate,
): StudyMcq[] {
  const def = getLearnSectionDef(sectionId);
  if (!def) return [];

  let collected = def.collect();

  if (sectionId === "hayd") collected = [...collected, ...mcqsFromHaydGuide(t)];
  if (sectionId === "sick") collected = [...collected, ...mcqsFromSickGuide(t)];
  if (sectionId === "travel") {
    collected = [...collected, ...mcqsFromTravelGuideCopy(t)];
  }
  if (sectionId === "events") {
    collected = [...collected, ...mcqsFromIslamicEvents(ISLAMIC_EVENTS, t)];
  }

  return sampleMcqs(dedupeMcqs(collected), SECTION_QUIZ_SIZE);
}

/** Map StudyMcq → QuizPlayer question shape. */
export function toQuizPlayerQuestions(items: readonly StudyMcq[]) {
  return items.map((item) => ({
    id: item.id,
    prompt: item.prompt,
    options: item.options,
    correctIndex: item.correctIndex,
    explanation: item.explanation,
    type: item.options.length === 2 ? "true-false" : "multiple-choice",
    category: item.categoryLabelKey,
  }));
}

/** Test helper: reset warm caches. */
export function __resetFlashCardWarmCachesForTests(): void {
  warmNames = [];
  warmDuas = [];
  warmHadith = [];
  globalWarmPromise = undefined;
}
