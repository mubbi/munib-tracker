import type { QuranGuidePronunciationPair } from "../types/quran-guide";

/** Difficult Arabic letters — side-by-side comparisons. */
export const QURAN_GUIDE_PRONUNCIATION: QuranGuidePronunciationPair[] = [
  {
    id: "ayn-ha",
    letters: ["ع", "ح"],
    title: "Ayn vs Ha",
    tip: "Ayn constricts the middle throat with voice; Ha is a breathy friction without full voice.",
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
    tip: "Sad is emphatic — widen the mouth slightly and raise the tongue.",
    examples: ["سَلَام vs صَلَاة"],
  },
  {
    id: "dal-dad",
    letters: ["د", "ض"],
    title: "Dal vs Dad",
    tip: "Dad is the 'language of Dad' — emphatic, pressing the tongue to the palate.",
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
    tip: "Qaf is uvular — back of tongue to soft palate; Kaf is forward.",
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
