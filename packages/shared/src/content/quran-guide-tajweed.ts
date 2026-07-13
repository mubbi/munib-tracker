import type { QuranGuideTajweedLesson } from "../types/quran-guide";

/**
 * Core tajweed rules — explanations with examples (a later version adds audio &
 * quizzes). Bump QURAN_GUIDE_TAJWEED_VERSION on content change.
 */
export const QURAN_GUIDE_TAJWEED_VERSION = 3;

export const QURAN_GUIDE_TAJWEED: QuranGuideTajweedLesson[] = [
  {
    id: "noon-sakin",
    title: "Noon Sakinah & Tanween",
    summary: "Rules for ن with sukun and tanween — izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "A noon sakinah is the letter ن carrying a sukun (no vowel); tanween is the doubled vowel-ending (an, in, un) that sounds the same as a noon at the end of a word. Both follow the same four rules, decided entirely by the letter that comes next.",
      "Izhar (clear pronunciation): when followed by one of the six throat letters (ء ه ع ح غ خ), pronounce the noon clearly and distinctly, with no nasal blending.",
      "Idgham (merging): before the letters of the word 'yarmaloon' (ي ر م ل و ن), the noon merges into the next letter — with ghunnah (nasal sound) for ي ن م و, and without ghunnah for ل ر.",
      "Iqlab (conversion): when followed by ب, the noon is turned into a hidden meem sound accompanied by ghunnah.",
      "Ikhfa (hiding): before the remaining fifteen letters, the noon is neither fully pronounced nor fully merged — it is 'hidden' with a light nasal ghunnah while the tongue prepares for the next letter.",
    ],
    examples: ["مِنْ عِلْم", "مِنْ رَبِّهِمْ", "مِنْ بَعْدِ", "أَنْتُمْ"],
    practice:
      "Recite Surah al-Fatiha slowly, and each time you meet a noon sakinah or tanween, pause to name which of the four rules applies and why.",
  },
  {
    id: "meem-sakin",
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi, and izhar shafawi for م with sukun.",
    explanation: [
      "A meem sakinah is the letter م carrying a sukun. It has exactly three rules, each named 'shafawi' (labial) because meem is produced with the lips, and which one applies depends only on the following letter.",
      "Idgham shafawi (labial merging): when a meem sakinah is followed by another meem, the two merge into one stressed meem held with ghunnah.",
      "Ikhfa shafawi (labial hiding): when followed by ب, the meem is lightly hidden — the lips come close but do not press fully — accompanied by ghunnah.",
      "Izhar shafawi (labial clarity): before every other letter, the meem is pronounced clearly. Take special care before the letters و and ف, where learners are most tempted to blur it.",
    ],
    examples: ["لَهُمْ مَّا", "تَرْمِيهِمْ بِحِجَارَةٍ", "أَمْ لَمْ"],
    practice:
      "Read several short surahs from Juz Amma and mark every meem sakinah, naming its rule before you recite the word.",
  },
  {
    id: "madd",
    title: "Madd (Elongation)",
    summary: "Natural, secondary, and necessary prolongation of vowels.",
    explanation: [
      "Madd means stretching a vowel sound, and it happens on the three madd letters — alif (ا), waw (و), and ya (ي) — when they carry no vowel of their own and follow their matching short vowel.",
      "Madd asli (natural madd) is the basic elongation of about two counts, present wherever a madd letter appears with no special cause after it. Every reciter holds it evenly.",
      "Madd far'i (secondary madd) is triggered by a following hamza or sukun and is held longer — commonly four or six counts. The exact length depends on the type of madd and the recitation (riwayah) you follow.",
      "Because stopping at the end of a word can create a sukun, it can also lengthen a madd — one more reason to learn the durations by ear from a qualified teacher rather than guessing.",
    ],
    examples: ["قَالَ", "السَّمَاء", "الرَّحِيم"],
    practice:
      "Pick a familiar short surah and gently count '1-2' on every natural madd and '1-2-3-4' on the secondary madds, keeping your timing even.",
  },
  {
    id: "ghunnah",
    title: "Ghunnah",
    summary: "Nasal sound accompanying noon and meem in idgham and ikhfa.",
    explanation: [
      "Ghunnah is a nasal resonance produced through the nose, an inherent quality of the letters noon (ن) and meem (م). In standard recitation it is held for about two counts.",
      "It is required and most pronounced in several rules you have already met: idgham with ghunnah, ikhfa, iqlab, and whenever a noon or meem carries a shaddah.",
      "The sound should be smooth and controlled — it is not singing or humming a tune, but a steady nasal tone measured to the correct length.",
      "A simple test: pinch your nose lightly while producing a ghunnah letter; if the sound is blocked, the resonance is genuinely coming through the nose as it should.",
    ],
    examples: ["مِنْ نُّور", "إِنَّ", "ثُمَّ"],
    practice:
      "Recite a word with shaddah on noon or meem, holding the ghunnah for a steady two counts, then record yourself and compare against a qualified reciter.",
  },
  {
    id: "qalqalah",
    title: "Qalqalah",
    summary: "Echoing bounce on ق ط ب ج د when sakin or when stopping on them.",
    explanation: [
      "Qalqalah is a slight echoing 'bounce' given to five letters — collected in the phrase قُطْبُ جَدٍ, that is ق ط ب ج د — whenever they carry a sukun.",
      "The bounce is a light vibration of the articulation point; you must not add a full vowel after the letter, only let it 'rebound' cleanly.",
      "It is lighter (sughra) when the letter has a sukun in the middle of a word, and stronger and clearer (kubra) when you stop on that letter at the end of a word.",
      "Keep the bounce neutral — do not tilt it toward an 'a', 'i', or 'u' sound; it is the same crisp echo regardless of the surrounding vowels.",
    ],
    examples: ["يَجْعَلُونَ", "الْحَقّْ", "أَحَدْ"],
    practice:
      "Recite Surah al-Ikhlas and stop firmly on each qalqalah letter — the د of 'ahad' and 'yulad' — feeling the clean rebound.",
  },
  {
    id: "waqf",
    title: "Waqf (Stopping)",
    summary: "Where to stop, breathe, and how stopping changes pronunciation.",
    explanation: [
      "Waqf is the art of where and how to pause. The mushaf marks stopping points with small symbols — for example م for a required stop, ط and ج for permitted stops, and لا meaning do not stop here — to guide the reciter.",
      "Stopping usually silences the final vowel, turning the last letter into a sukun. That change can then trigger other rules, such as qalqalah or an elongated madd, so a word can sound different when you stop on it than when you continue.",
      "Where you pause can affect the meaning, so never break mid-phrase in a way that distorts it. A special case is the mu'anaqa (embracing) waqf, marked with three dots, where you may stop at one of two points but not both.",
      "The safest way to learn correct stops is with a mushaf that shows waqf marks alongside a qualified reciter, so your pauses match the transmitted recitation.",
    ],
    examples: ["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"],
    practice:
      "Take one page with waqf marks and read it aloud following a tajweed teacher's recording, stopping exactly where the symbols indicate.",
  },
  {
    id: "hamzat-wasl",
    title: "Hamzat Wasl",
    summary:
      "The connecting hamza that is pronounced only when starting, and dropped when joining.",
    explanation: [
      "Hamzat wasl (ٱ) is a connecting hamza written with a small saddah-like mark above an alif. It appears at the start of many nouns, verbs, and particles — including the definite article ال.",
      "When you begin recitation on a word that starts with hamzat wasl, you pronounce it with a clear hamza sound so the word can open cleanly.",
      "When the word is joined to what comes before it, the hamzat wasl is silent — you glide from the previous letter straight into the following letter and do not sound a separate hamza.",
      "Recognizing hamzat wasl helps you avoid inserting an extra glottal stop mid-phrase, which is a common beginner habit when reading the mushaf slowly.",
    ],
    examples: ["ٱللَّهِ", "ٱلرَّحْمَٰنِ", "ٱهْدِنَا"],
    practice:
      "Recite the basmalah and Surah al-Fatiha, pausing at each ٱ to decide whether you are starting (pronounce) or joining (drop).",
  },
  {
    id: "lam-shamsiyah",
    title: "Lam Shamsiyah",
    summary: "Sun letters that assimilate the لام of ال, versus moon letters that keep it clear.",
    explanation: [
      "When the definite article ال is attached to a noun, the لام may be pronounced clearly or assimilated, depending on the following letter.",
      "Sun letters (huruf shamsiyah) cause the لام to be silent and the next letter to be doubled with a shaddah — as in ٱلرَّحْمَٰن where the ر absorbs the لام.",
      "Moon letters (huruf qamariyah) keep the لام clear — as in ٱلْقَمَر — so you hear both the لام and the following letter.",
      "Learning the sun and moon sets by heart (or by ear from a teacher) prevents over-pronouncing silent لام and under-pronouncing clear لام.",
    ],
    examples: ["ٱلرَّحْمَٰنِ", "ٱلشَّمْسِ", "ٱلْقَمَرِ"],
    practice:
      "Open Juz Amma and mark ten nouns with ال: for each, name whether the لام is shamsiyah (silent) or qamariyah (clear) before you recite.",
  },
  {
    id: "silent",
    title: "Silent Letters",
    summary: "Letters written in the mushaf that are not pronounced in continuous recitation.",
    explanation: [
      "Some letters appear in the Uthmani script for historical or orthographic reasons but are not sounded when you recite — they are marked silent in tajweed colorings.",
      "Common cases include certain alifs that are written but not elongated, and letters that are assimilated into a following shaddah so they leave no separate sound.",
      "Silent marking is a reading aid: it keeps the written mushaf faithful while guiding the tongue not to invent an extra sound.",
      "When in doubt, follow a colored tajweed mushaf or a qualified reciter — the goal is fidelity to the transmitted reading, not guessing from spelling alone.",
    ],
    examples: ["ذَٰلِكَ", "أُو۟لَٰٓئِكَ"],
    practice:
      "With tajweed colors on, read one page slowly and whisper only the colored (sounded) letters — skip every silent-marked letter deliberately.",
  },
];
