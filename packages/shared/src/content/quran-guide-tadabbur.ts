import type { QuranGuideTadabburPrompt } from "../types/quran-guide";

/** Guided reflection questions — not tafsir, but personal tadabbur. */
export const QURAN_GUIDE_TADABBUR_PROMPTS: QuranGuideTadabburPrompt[] = [
  {
    id: "teach",
    question: "What is Allah teaching me in this ayah?",
    hint: "Look for commands, warnings, promises, and names of Allah used.",
  },
  {
    id: "apply",
    question: "How can I apply this today in one concrete action?",
    hint: "Small and specific beats vague intentions — one habit, one conversation, one choice.",
  },
  {
    id: "habit",
    question: "What habit should I improve or remove because of this verse?",
    hint: "Link the ayah to sleep, speech, spending, prayer, or relationships.",
  },
  {
    id: "fear-hope",
    question:
      "Does this ayah move me toward hope in Allah's mercy or fear of His justice — and why both matter?",
    hint: "Balance — the believer is between khashya and raja.",
  },
  {
    id: "prophet",
    question: "How did the Prophet ﷺ live this ayah?",
    hint: "Check authentic seerah and tafsir — Ibn Kathir often cites prophetic practice.",
  },
  {
    id: "dua",
    question: "What du'a does this ayah inspire?",
    hint: "Turn the verse into your own words in sujood.",
  },
];
