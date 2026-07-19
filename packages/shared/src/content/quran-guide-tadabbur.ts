import type { QuranGuideTadabburPrompt } from "../types/quran-guide";

/**
 * Guided reflection questions — not tafsir, but personal tadabbur. Bump
 * QURAN_GUIDE_TADABBUR_VERSION on content change.
 */
export const QURAN_GUIDE_TADABBUR_VERSION = 2;

export const QURAN_GUIDE_TADABBUR_PROMPTS: QuranGuideTadabburPrompt[] = [
  {
    id: "teach",
    question: "What is Allah teaching me in this ayah?",
    hint: "Read the verse slowly and notice its building blocks: is Allah giving a command, a warning, a promise, or telling a story? Which of His names does He use, and what does that name reveal about how He is dealing with us here?",
  },
  {
    id: "apply",
    question: "How can I apply this today in one concrete action?",
    hint: "Vague resolutions fade; specific ones stick. Turn the verse into a single doable step — one conversation to have, one habit to start, one choice to make before the day ends.",
  },
  {
    id: "habit",
    question: "What habit should I improve or remove because of this verse?",
    hint: "Bring the ayah down to your daily routine — your sleep, your speech, your spending, your prayer, your relationships. Which one does this verse quietly put a finger on?",
  },
  {
    id: "fear-hope",
    question:
      "Does this ayah move me toward hope in Allah's mercy or fear of His justice — and why both matter?",
    hint: "The believer walks between khawf (fear of Allah's punishment) and raja (hope in His mercy), like two wings. Ask which one this verse strengthens in you right now, and whether your heart needs more of it.",
  },
  {
    id: "prophet",
    question: "How did the Prophet ﷺ live this ayah?",
    hint: "The Prophet ﷺ was described as a 'walking Qur'an.' Look to authentic seerah and tafsir — Ibn Kathir often cites how he embodied a verse — and take his example as the practical model.",
  },
  {
    id: "dua",
    question: "What dua does this ayah inspire?",
    hint: "Let the verse become a prayer. Ask Allah, in your own words during sujood, for whatever the ayah has stirred — protection from a warning, a share in a promise, or help to obey a command.",
  },
];
