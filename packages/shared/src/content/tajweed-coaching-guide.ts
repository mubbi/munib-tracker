import type { TajweedCoachingCategory } from "../types/tajweed-coaching";

/**
 * NF-3.15 tajweed coaching — the rule explanation shown on each coaching card.
 *
 * Procedural guide copy (how a sound is produced), authored in English and
 * checked against the classical works in {@link TAJWEED_CLASSICAL_SOURCES}
 * (proof log: `docs/proofs/tajweed-coaching.md`). No Qur'an text is typed here:
 * single Arabic letters name a letter, and example words always come from the
 * user's own ayahs, rendered by reference from the corpus.
 *
 * Bump {@link TAJWEED_COACHING_GUIDE_VERSION} on any content change.
 */
export const TAJWEED_COACHING_GUIDE_VERSION = 1;

export type TajweedSourceId =
  | "jazariyyah"
  | "tuhfah"
  | "nashr"
  | "tamhid"
  | "riayah"
  | "shatibiyyah"
  | "hidayah";

export interface TajweedClassicalSource {
  id: TajweedSourceId;
  title: string;
  author: string;
}

/** Classical tajweed works the explanations follow (cited by title, D11). */
export const TAJWEED_CLASSICAL_SOURCES: Readonly<Record<TajweedSourceId, TajweedClassicalSource>> =
  {
    jazariyyah: {
      id: "jazariyyah",
      title: "al-Muqaddimah al-Jazariyyah (Matn al-Jazariyyah)",
      author: "Ibn al-Jazari (d. 833 AH)",
    },
    tuhfah: {
      id: "tuhfah",
      title: "Tuhfat al-Atfal wa al-Ghilman fi Tajwid al-Qur'an",
      author: "Sulayman al-Jamzuri (12th century AH)",
    },
    nashr: {
      id: "nashr",
      title: "al-Nashr fi al-Qira'at al-'Ashr",
      author: "Ibn al-Jazari (d. 833 AH)",
    },
    tamhid: {
      id: "tamhid",
      title: "al-Tamhid fi 'Ilm al-Tajwid",
      author: "Ibn al-Jazari (d. 833 AH)",
    },
    riayah: {
      id: "riayah",
      title: "al-Ri'ayah li-Tajwid al-Qira'ah wa Tahqiq Lafz al-Tilawah",
      author: "Makki ibn Abi Talib al-Qaysi (d. 437 AH)",
    },
    shatibiyyah: {
      id: "shatibiyyah",
      title: "Hirz al-Amani wa Wajh al-Tahani (al-Shatibiyyah)",
      author: "al-Qasim ibn Firruh al-Shatibi (d. 590 AH)",
    },
    hidayah: {
      id: "hidayah",
      title: "Hidayat al-Qari ila Tajwid Kalam al-Bari",
      author: "'Abd al-Fattah al-Sayyid 'Ajami al-Marsafi (d. 1409 AH)",
    },
  };

export interface TajweedCoachingGuideEntry {
  id: TajweedCoachingCategory;
  title: string;
  summary: string;
  /** How the sound is produced (paragraphs). */
  explanation: string[];
  /** Listen-and-repeat steps for the card. */
  howTo: string[];
  /** Where the readings (qira'at) or the manuals differ — shown as a note. */
  note?: string;
  /** Learn Qur'an tajweed lesson with the longer explanation. */
  lessonId?: string;
  sources: TajweedSourceId[];
}

export const TAJWEED_COACHING_GUIDE: Readonly<
  Record<TajweedCoachingCategory, TajweedCoachingGuideEntry>
> = {
  qalqalah: {
    id: "qalqalah",
    title: "Qalqalah (echo)",
    summary: "A light bounce on five letters when they carry a sukun.",
    explanation: [
      'Qalqalah is a slight echo, or bounce, heard when one of five letters carries a sukun: ق ط ب ج د (remembered as "qutbu jad"). The letter is released with a small rebound instead of being held silent.',
      "It applies when the sukun is in the middle of a word and when you stop on one of these letters at the end of a word. The manuals describe the bounce at a stop as the clearer of the two.",
      "The bounce is not a vowel: don't add a short a, i or u after the letter, and don't let it grow into an extra syllable.",
    ],
    howTo: [
      "Listen to the reciter say the word and notice the short rebound on the letter.",
      "Say the word slowly, releasing the letter with a light bounce, then say it at your normal pace.",
      "Listen to the reciter once more and compare.",
    ],
    lessonId: "qalqalah",
    sources: ["jazariyyah", "nashr", "hidayah"],
  },
  ghunna: {
    id: "ghunna",
    title: "Ghunnah (nasal sound)",
    summary:
      "The nasal sound of noon and meem, held in idgham with ghunnah, ikhfa, iqlab and on a doubled noon or meem.",
    explanation: [
      "Ghunnah is a sound carried through the nose. It belongs to the letters noon (ن) and meem (م).",
      "It is held clearly, for about two counts, on a noon or meem with shaddah, and on a noon sakinah or tanween in three cases: idgham with ghunnah (before ي ن م و), ikhfa (before the fifteen ikhfa letters) and iqlab (before ب, where the noon turns into a meem sound).",
      "With a meem sakinah it is held in ikhfa shafawi (before ب) and in idgham shafawi (before another م).",
      "Keep it smooth and even: a steady nasal sound, not a hum that rises and falls.",
    ],
    howTo: [
      "Listen for where the reciter's voice moves into the nose and how long it stays there.",
      "Hold the nasal sound for an even two counts, then release into the next letter.",
      "Try the word again and compare with the reciter.",
    ],
    note: "The two-count length is the common teaching for the riwayah of Hafs from 'Asim; follow your teacher where your riwayah differs.",
    lessonId: "ghunnah",
    sources: ["tuhfah", "jazariyyah", "hidayah"],
  },
  gemination: {
    id: "gemination",
    title: "Shaddah (doubled letter)",
    summary:
      "A letter with shaddah is two letters in one: the first silent, merged into the second.",
    explanation: [
      "A shaddah over a letter means the letter is doubled: a first, silent copy merges into a second one that carries the vowel.",
      "So the letter is pressed and held a little longer than a single letter before you move on. Reading it as a single, light letter can change the word.",
      "When the doubled letter is noon or meem, it also carries ghunnah.",
    ],
    howTo: [
      "Listen for the moment the reciter leans on the doubled letter.",
      "Close on the letter, hold it briefly, then release it with its vowel.",
      "Repeat the word with the reciter.",
    ],
    sources: ["riayah", "tamhid", "nashr"],
  },
  madd: {
    id: "madd",
    title: "Madd (lengthening)",
    summary: "Stretching the long vowels alif, waw and ya by a set number of counts.",
    explanation: [
      "Madd is lengthening a long vowel: an alif after a fatha, a waw sakinah after a damma, or a ya sakinah after a kasra.",
      "The natural madd is two counts. A hamza or a sukun after the long vowel makes it longer, and the length of each kind is taught by riwayah.",
      "In the riwayah of Hafs from 'Asim by way of al-Shatibiyyah: a hamza in the same word (muttasil) is held four or five counts, a hamza at the start of the next word (munfasil) four or five counts, and a permanent sukun after the long vowel (lazim) six counts.",
    ],
    howTo: [
      "Listen to the reciter and count the length on your fingers.",
      "Repeat the word, keeping the same length each time.",
    ],
    note: "Lengths differ between the readings (qira'at), so follow your teacher's riwayah. The app doesn't measure the length of your madd; this card is for listening and repeating only.",
    lessonId: "madd",
    sources: ["tuhfah", "shatibiyyah", "hidayah"],
  },
  ham_wasl: {
    id: "ham_wasl",
    title: "Hamzat al-wasl (joining hamza)",
    summary:
      "A hamza heard when you start on the word, and dropped when you join it to the word before.",
    explanation: [
      "Hamzat al-wasl is written as an alif with a small mark above it (ٱ). It is sounded only when you begin reading from that word.",
      "When you join the word to the one before it, it isn't sounded at all: the voice carries straight on to the next letter.",
      "When you do start on it, it takes a fatha with the article al-, a damma in a verb whose third letter has a damma, and a kasra in most other cases, with a few exceptions your teacher will point out.",
    ],
    howTo: [
      "Listen to the reciter join into the word without any hamza.",
      "Say the joined phrase smoothly, without a catch in the throat.",
    ],
    lessonId: "hamzat-wasl",
    sources: ["jazariyyah", "nashr", "hidayah"],
  },
  laam_shamsiyah: {
    id: "laam_shamsiyah",
    title: "Lam shamsiyyah (sun letters)",
    summary: "The lam of al- is silent before the fourteen sun letters, which are doubled instead.",
    explanation: [
      'The lam of the article al- is pronounced clearly before fourteen "moon" letters and is silent before the other fourteen, the "sun" letters.',
      "Before a sun letter the lam merges into it, so the sun letter is doubled (it carries a shaddah) and the lam isn't heard.",
    ],
    howTo: [
      "Listen: the reciter goes straight from the vowel into the doubled sun letter.",
      "Say it without any trace of the lam, leaning on the doubled letter.",
    ],
    lessonId: "lam-shamsiyah",
    sources: ["tuhfah", "hidayah"],
  },
  idgham_wo_ghunnah: {
    id: "idgham_wo_ghunnah",
    title: "Idgham without ghunnah",
    summary:
      "A noon sakinah or tanween merges fully into a following lam or ra, with no nasal sound.",
    explanation: [
      "When a noon sakinah or tanween is followed by ل or ر at the start of the next word, the noon disappears completely into that letter, which is then doubled.",
      "No ghunnah is held here in the riwayah of Hafs from 'Asim: the merge is complete.",
    ],
    howTo: [
      "Listen: there's no nasal sound, just the doubled lam or ra.",
      "Say the two words joined, leaning on the doubled letter.",
    ],
    note: "Some other readings and transmission routes keep a ghunnah here; follow your teacher's riwayah.",
    lessonId: "noon-sakin",
    sources: ["tuhfah", "jazariyyah", "hidayah"],
  },
};
