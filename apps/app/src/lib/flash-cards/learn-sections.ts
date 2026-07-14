import { TRAVEL_RAKATS } from "@munib-tracker/shared/content/travel-guide";
import type { Href } from "expo-router";

import {
  ensureAqeedahContent,
  getAqeedahGlossary,
  getAqeedahTopics,
  isAqeedahContentReady,
} from "@/lib/aqeedah";
import {
  ensureBattlesContent,
  getBattlesGlossary,
  getBattlesTopics,
  isBattlesContentReady,
} from "@/lib/battles";
import { ensureEidGuideContent, getEidGuideTopics } from "@/lib/eid-guide";
import {
  ensureHajjGuideContent,
  getHajjGuideSections,
  isHajjGuideContentReady,
} from "@/lib/hajj-guide";
import {
  ensureIslamicHistoryContent,
  getIslamicHistoryEvents,
  isIslamicHistoryContentReady,
} from "@/lib/islamic-history";
import { ensureJahannamContent, getJahannamTopics, isJahannamContentReady } from "@/lib/jahannam";
import { ensureJannahContent, getJannahTopics, isJannahContentReady } from "@/lib/jannah";
import {
  ensureLastDayContent,
  getLastDayQuiz,
  getLastDayTopics,
  isLastDayContentReady,
} from "@/lib/last-day";
import { ensureLaylatAlQadrContent, getLaylatAlQadrTopics } from "@/lib/laylat-al-qadr";
import { ensureLearnDuaContent, getLearnDuaTopics, isLearnDuaContentReady } from "@/lib/learn-dua";
import { ensureNewMuslimContent, getNewMuslimTopics } from "@/lib/new-muslim";
import { ensureProphetsContent, getProphetsTopics, isProphetsContentReady } from "@/lib/prophets";
import {
  ensureQuranGuideContent,
  getQuranGuideQuiz,
  getQuranGuideTopics,
  getQuranGuideVocabulary,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { ensureRuqyahContent, getRuqyahTopics } from "@/lib/ruqyah";
import { ensureSahabaContent, getSahabaProfiles, isSahabaContentReady } from "@/lib/sahaba";
import {
  ensureSalahGuideContent,
  getSalahGuideTopics,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import { ensureSeerahContent, getSeerahEvents, isSeerahContentReady } from "@/lib/seerah";
import { ensureTaharahContent, getTaharahTopics, isTaharahContentReady } from "@/lib/taharah";

import { mcqsFromLastDayQuiz, mcqsFromQuranGuideQuiz } from "./from-existing-quizzes";
import { mcqsFromGlossary } from "./from-glossary";
import { mcqsFromHajj, mcqsFromTravelRakats } from "./from-hajj-travel";
import { mcqsFromNamedSummaries, mcqsFromProfiles } from "./from-named-summaries";
import { mcqsFromTopics } from "./from-topics";
import type { StudyMcq, StudySourceId } from "./types";

export type LearnQuizSectionId = Exclude<StudySourceId, "names" | "hadith" | "quran" | "duas">;

export type LearnSectionDef = {
  id: LearnQuizSectionId;
  route: Href;
  quizPath: Href;
  /** Primary i18n namespace for quiz chrome (eyebrow falls back to common). */
  i18nNamespace: string;
  ensure: () => Promise<unknown>;
  isReady: () => boolean;
  collect: () => StudyMcq[];
};

function alwaysReady(): boolean {
  return true;
}

function noopEnsure(): Promise<void> {
  return Promise.resolve();
}

function mcqsFromLastDayAuthored(): StudyMcq[] {
  return mcqsFromLastDayQuiz(getLastDayQuiz());
}

function mcqsFromQuranAuthored(): StudyMcq[] {
  return mcqsFromQuranGuideQuiz(getQuranGuideQuiz());
}

export const LEARN_QUIZ_SECTIONS: LearnSectionDef[] = [
  {
    id: "salahGuide",
    route: "/salah-guide" as Href,
    quizPath: "/salah-guide/quiz" as Href,
    i18nNamespace: "salahGuide",
    ensure: ensureSalahGuideContent,
    isReady: isSalahGuideContentReady,
    collect: () =>
      mcqsFromTopics("salahGuide", getSalahGuideTopics(), "flashCards.category.salahGuide"),
  },
  {
    id: "jannah",
    route: "/jannah" as Href,
    quizPath: "/jannah/quiz" as Href,
    i18nNamespace: "jannah",
    ensure: ensureJannahContent,
    isReady: isJannahContentReady,
    collect: () => mcqsFromTopics("jannah", getJannahTopics(), "flashCards.category.jannah"),
  },
  {
    id: "lastDay",
    route: "/last-day" as Href,
    quizPath: "/last-day/quiz" as Href,
    i18nNamespace: "lastDay",
    ensure: ensureLastDayContent,
    isReady: isLastDayContentReady,
    collect: () => {
      const authored = mcqsFromLastDayAuthored();
      const topics = mcqsFromTopics("lastDay", getLastDayTopics(), "flashCards.category.lastDay");
      return authored.length >= 4 ? [...authored, ...topics] : topics;
    },
  },
  {
    id: "jahannam",
    route: "/jahannam" as Href,
    quizPath: "/jahannam/quiz" as Href,
    i18nNamespace: "jahannam",
    ensure: ensureJahannamContent,
    isReady: isJahannamContentReady,
    collect: () => mcqsFromTopics("jahannam", getJahannamTopics(), "flashCards.category.jahannam"),
  },
  {
    id: "battles",
    route: "/battles" as Href,
    quizPath: "/battles/quiz" as Href,
    i18nNamespace: "battles",
    ensure: ensureBattlesContent,
    isReady: isBattlesContentReady,
    collect: () => [
      ...mcqsFromTopics("battles", getBattlesTopics(), "flashCards.category.battles"),
      ...mcqsFromGlossary(
        "battles",
        getBattlesGlossary().map((g) => ({
          id: g.id,
          term: g.term,
          definition: g.definition,
        })),
        "flashCards.category.battles",
      ),
    ],
  },
  {
    id: "learnQuran",
    route: "/learn-quran" as Href,
    quizPath: "/learn-quran/quiz" as Href,
    i18nNamespace: "learnQuran",
    ensure: ensureQuranGuideContent,
    isReady: isQuranGuideContentReady,
    collect: () => {
      const authored = mcqsFromQuranAuthored();
      const topics = mcqsFromTopics(
        "learnQuran",
        getQuranGuideTopics().filter((t) => !t.comingSoon),
        "flashCards.category.learnQuran",
      );
      const vocab = mcqsFromGlossary(
        "learnQuran",
        getQuranGuideVocabulary().map((v) => ({
          id: v.id,
          term: v.transliteration || v.arabic,
          definition: v.meaning,
        })),
        "flashCards.category.learnQuran",
      );
      return authored.length >= 4 ? [...authored, ...topics, ...vocab] : [...topics, ...vocab];
    },
  },
  {
    id: "taharah",
    route: "/taharah" as Href,
    quizPath: "/taharah/quiz" as Href,
    i18nNamespace: "taharah",
    ensure: ensureTaharahContent,
    isReady: isTaharahContentReady,
    collect: () => mcqsFromTopics("taharah", getTaharahTopics(), "flashCards.category.taharah"),
  },
  {
    id: "hayd",
    route: "/hayd" as Href,
    quizPath: "/hayd/quiz" as Href,
    i18nNamespace: "hayd",
    ensure: noopEnsure,
    isReady: alwaysReady,
    collect: () => [], // filled via i18n in build-bank
  },
  {
    id: "sick",
    route: "/sick" as Href,
    quizPath: "/sick/quiz" as Href,
    i18nNamespace: "sick",
    ensure: noopEnsure,
    isReady: alwaysReady,
    collect: () => [],
  },
  {
    id: "prophets",
    route: "/prophets" as Href,
    quizPath: "/prophets/quiz" as Href,
    i18nNamespace: "prophets",
    ensure: ensureProphetsContent,
    isReady: isProphetsContentReady,
    collect: () => mcqsFromTopics("prophets", getProphetsTopics(), "flashCards.category.prophets"),
  },
  {
    id: "aqeedah",
    route: "/aqeedah" as Href,
    quizPath: "/aqeedah/quiz" as Href,
    i18nNamespace: "aqeedah",
    ensure: ensureAqeedahContent,
    isReady: isAqeedahContentReady,
    collect: () => [
      ...mcqsFromTopics("aqeedah", getAqeedahTopics(), "flashCards.category.aqeedah"),
      ...mcqsFromGlossary(
        "aqeedah",
        getAqeedahGlossary().map((g) => ({
          id: g.id,
          term: g.term,
          definition: g.definition,
        })),
        "flashCards.category.aqeedah",
      ),
    ],
  },
  {
    id: "learnDua",
    route: "/learn-dua" as Href,
    quizPath: "/learn-dua/quiz" as Href,
    i18nNamespace: "learnDua",
    ensure: ensureLearnDuaContent,
    isReady: isLearnDuaContentReady,
    collect: () => mcqsFromTopics("learnDua", getLearnDuaTopics(), "flashCards.category.learnDua"),
  },
  {
    id: "travel",
    route: "/travel" as Href,
    quizPath: "/travel/quiz" as Href,
    i18nNamespace: "travel",
    ensure: noopEnsure,
    isReady: alwaysReady,
    collect: () => mcqsFromTravelRakats(TRAVEL_RAKATS),
  },
  {
    id: "hajj",
    route: "/hajj" as Href,
    quizPath: "/hajj/quiz" as Href,
    i18nNamespace: "hajj",
    ensure: ensureHajjGuideContent,
    isReady: isHajjGuideContentReady,
    collect: () => mcqsFromHajj(getHajjGuideSections()),
  },
  {
    id: "seerah",
    route: "/seerah" as Href,
    quizPath: "/seerah/quiz" as Href,
    i18nNamespace: "seerah",
    ensure: ensureSeerahContent,
    isReady: isSeerahContentReady,
    collect: () =>
      mcqsFromNamedSummaries(
        "seerah",
        getSeerahEvents().map((e) => ({ id: e.id, title: e.title, body: e.body })),
        "flashCards.category.seerah",
      ),
  },
  {
    id: "events",
    route: "/events" as Href,
    quizPath: "/events/quiz" as Href,
    i18nNamespace: "events",
    ensure: noopEnsure,
    isReady: alwaysReady,
    collect: () => [], // filled via i18n in build-bank
  },
  {
    id: "sahaba",
    route: "/sahaba" as Href,
    quizPath: "/sahaba/quiz" as Href,
    i18nNamespace: "sahaba",
    ensure: ensureSahabaContent,
    isReady: isSahabaContentReady,
    collect: () =>
      mcqsFromProfiles(
        "sahaba",
        getSahabaProfiles().map((p) => ({ id: p.id, name: p.name, summary: p.summary })),
        "flashCards.category.sahaba",
      ),
  },
  {
    id: "history",
    route: "/history" as Href,
    quizPath: "/history/quiz" as Href,
    i18nNamespace: "history",
    ensure: ensureIslamicHistoryContent,
    isReady: isIslamicHistoryContentReady,
    collect: () =>
      mcqsFromNamedSummaries(
        "history",
        getIslamicHistoryEvents().map((e) => ({ id: e.id, title: e.title, body: e.body })),
        "flashCards.category.history",
      ),
  },
  {
    id: "laylatAlQadr",
    route: "/laylat-al-qadr" as Href,
    quizPath: "/laylat-al-qadr/quiz" as Href,
    i18nNamespace: "laylatAlQadr",
    ensure: ensureLaylatAlQadrContent,
    isReady: alwaysReady,
    collect: () =>
      mcqsFromTopics("laylatAlQadr", getLaylatAlQadrTopics(), "flashCards.category.laylatAlQadr"),
  },
  {
    id: "eid",
    route: "/eid" as Href,
    quizPath: "/eid/quiz" as Href,
    i18nNamespace: "eid",
    ensure: ensureEidGuideContent,
    isReady: alwaysReady,
    collect: () => mcqsFromTopics("eid", getEidGuideTopics(), "flashCards.category.eid"),
  },
  {
    id: "ruqyah",
    route: "/ruqyah" as Href,
    quizPath: "/ruqyah/quiz" as Href,
    i18nNamespace: "ruqyah",
    ensure: ensureRuqyahContent,
    isReady: alwaysReady,
    collect: () => mcqsFromTopics("ruqyah", getRuqyahTopics(), "flashCards.category.ruqyah"),
  },
  {
    id: "newMuslim",
    route: "/new-muslim" as Href,
    quizPath: "/new-muslim/quiz" as Href,
    i18nNamespace: "newMuslim",
    ensure: ensureNewMuslimContent,
    isReady: alwaysReady,
    collect: () =>
      mcqsFromTopics("newMuslim", getNewMuslimTopics(), "flashCards.category.newMuslim"),
  },
];

export function getLearnSectionDef(id: LearnQuizSectionId): LearnSectionDef | undefined {
  return LEARN_QUIZ_SECTIONS.find((section) => section.id === id);
}
