import type { QuranGuidePronunciationPair } from "../types/quran-guide";

/**
 * Difficult Arabic letters — side-by-side comparisons. Bump
 * QURAN_GUIDE_PRONUNCIATION_VERSION on content change.
 */
export const QURAN_GUIDE_PRONUNCIATION_VERSION = 2;

export const QURAN_GUIDE_PRONUNCIATION: QuranGuidePronunciationPair[] = [
  {
    id: "ayn-ha",
    letters: ["ع", "ح"],
    title: "Ayn vs Ha",
    tip: "Both come from the throat but differ in voice. Ayn (ع) is a voiced constriction from the middle of the throat — the vocal cords vibrate. Ha (ح) is a strong, voiceless breathy friction, like a heavy sigh with no vibration. Neither exists in English, so learn them by ear from a reciter.",
    examples: ["عَلِيم vs حَلِيم", "سَمِيع vs رَحِيم"],
  },
  {
    id: "ha-kha",
    letters: ["ح", "خ"],
    title: "Ha vs Kha",
    tip: "Ha is sharper and lighter; Kha is deeper with more friction — like 'loch'.",
    examples: ["الْحَقُّ vs خَيْر"],
  },
  {
    id: "sin-sad",
    letters: ["س", "ص"],
    title: "Sin vs Sad",
    tip: "Sin (س) is a light, thin 's' like in English 'see'. Sad (ص) is its heavy, emphatic twin: raise the back of the tongue, round the mouth slightly, and the sound deepens. Mixing them can change words — sabr (patience) versus a light-s reading.",
    examples: ["سَلَام vs صَلَاة"],
  },
  {
    id: "dal-dad",
    letters: ["د", "ض"],
    title: "Dal vs Dad",
    tip: "Dal (د) is a plain 'd'. Dad (ض) is a heavy, emphatic 'd' unique to Arabic — press the side of the tongue against the upper molars and let the sound fill the mouth. Arabic is even nicknamed 'the language of Dad' because of this distinctive letter.",
    examples: ["دِين vs ضَالِّين"],
  },
  {
    id: "ta-emph-pair",
    letters: ["ت", "ط"],
    title: "Ta vs Ta (emphatic)",
    tip: "Emphatic ط is deeper; do not replace with English 't' only.",
    examples: ["تَوْبَة vs طَيِّبَات"],
  },
  {
    id: "dhal-za",
    letters: ["ذ", "ظ"],
    title: "Dhal vs Za (emphatic)",
    tip: "Both involve 'th' sounds; ظ is heavier and emphatic.",
    examples: ["ذَٰلِك vs ظَالِم"],
  },
  {
    id: "kaf-qaf",
    letters: ["ك", "ق"],
    tip: "Kaf (ك) is a forward 'k' like English 'key'. Qaf (ق) is made much further back — the very back of the tongue touches the uvula, giving a deep, guttural 'k' with no English equivalent. Keep them distinct: qalb (heart) is not kalb (dog).",
    title: "Kaf vs Qaf",
    examples: ["كِتَاب vs قُرْآن"],
  },
  {
    id: "ghayn-kha",
    letters: ["غ", "خ"],
    title: "Ghayn vs Kha",
    tip: "Ghayn has voice; Kha is voiceless friction.",
    examples: ["غَفُور vs خَالِق"],
  },
];
