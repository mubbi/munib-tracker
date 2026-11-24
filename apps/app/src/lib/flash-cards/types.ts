import type { FiqhDifferenceId, MadhhabId } from "@munib-tracker/shared/fiqh";

/** Learn hubs + global corpora that can supply study MCQs. */
export type StudySourceId =
  | "salahGuide"
  | "jannah"
  | "lastDay"
  | "jahannam"
  | "battles"
  | "learnQuran"
  | "taharah"
  | "hayd"
  | "sick"
  | "prophets"
  | "aqeedah"
  | "learnDua"
  | "travel"
  | "hajj"
  | "seerah"
  | "events"
  | "sahaba"
  | "history"
  | "laylatAlQadr"
  | "eid"
  | "whiteDays"
  | "ruqyah"
  | "newMuslim"
  | "janazah"
  | "fidyah"
  | "names"
  | "hadith"
  | "quran"
  | "duas";

/** Multiple-choice study item for section quizzes and Flash cards. */
export type StudyMcq = {
  id: string;
  sourceId: StudySourceId;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Optional i18n key for a category chip. */
  categoryLabelKey?: string;
  /** NF-3.0a: the answer depends on the school — see `filterMcqsForMadhhab`. */
  differenceId?: FiqhDifferenceId;
  /** Schools for which `correctIndex` is the right answer (set with `differenceId`). */
  answerSchools?: readonly MadhhabId[];
};

/** Topic-like shape used by most learn hubs. */
export type TopicLike = {
  id: string;
  title: string;
  summary: string;
};

/** Glossary / vocab term shape. */
export type TermLike = {
  id: string;
  term: string;
  definition: string;
};

export const SECTION_QUIZ_SIZE = 10;
