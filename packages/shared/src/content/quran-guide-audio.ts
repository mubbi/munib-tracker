import type { QuranGuideAyahAudio } from "../types/quran-guide";

/**
 * Learn Qur'an audio maps — letter streams + ayah clips for lesson examples.
 * Bump QURAN_GUIDE_AUDIO_VERSION when maps change.
 *
 * Letter pronunciation: Abjad-Kids (MIT) via Hugging Face CDN — Telkom Hijaiyah
 * (CC0) is preferred when a stable CDN mirror is available.
 * Ayah clips: everyayah.com per-ayah MP3; clipStart/clipEnd from QuranCDN
 * word segments (Alafasy murattal) converted to verse-relative seconds.
 */
export const QURAN_GUIDE_AUDIO_VERSION = 2;

const HF_ABJAD = "https://huggingface.co/datasets/Aziz-snoubra/Abjad-Kids/resolve/main";

/** Relative path under Abjad-Kids — encoded for URI use. */
function abjadLetterUri(path: string): string {
  return `${HF_ABJAD}/${path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

/**
 * Isolated letter pronunciation (fatha-class name). Keys match `QURAN_GUIDE_LETTERS` ids.
 */
export const QURAN_GUIDE_LETTER_AUDIO_URI = {
  alif: abjadLetterUri("alphabet/Alif/Alif_adam khatab_1d0e6910-bb75-4f8a-b2e9-d2e9a31ba537.wav"),
  ba: abjadLetterUri("alphabet/Ba/Ba_adam khatab_02886e03-7daf-4cf9-89f1-9c7fddcf3f72.wav"),
  ta: abjadLetterUri("alphabet/Ta/Ta_adam khatab_5b6c355e-8726-47c7-9852-5858a1e36548.wav"),
  tha: abjadLetterUri("alphabet/Tha/Tha_adam khatab_34af578d-c62f-414a-bdfb-f4b29720ea9f.wav"),
  jim: abjadLetterUri("alphabet/Jeem/Jeem_adam khatab_7a12de18-3454-4fca-b85b-964dc8ed24b2.wav"),
  ha: abjadLetterUri("alphabet/Hha/Hha_adam khatab_aa81a920-e085-4c07-9622-6249492531d5.wav"),
  kha: abjadLetterUri("alphabet/Kha/Kha_adam khatab_251a7175-bf52-494c-a934-a232bbd2fa11.wav"),
  dal: abjadLetterUri("alphabet/Dal/Dal_adam khatab_1825d410-bc02-4ddd-8e1f-c55011f70b9f.wav"),
  dhal: abjadLetterUri("alphabet/zal/Zal_adam khatab_2872bed3-61dd-41db-8ba3-033e727fed8d.wav"),
  ra: abjadLetterUri("alphabet/Ra/Ra_adam khatab_31d6a01c-9dc9-4e6f-8afc-1c99a12aa993.wav"),
  zay: abjadLetterUri("alphabet/Zai/Zai_adam khatab_3c8bcd3a-81f8-4ed1-b37e-a854361976f7.wav"),
  sin: abjadLetterUri("alphabet/Seen/Seen_adam khatab_3207f0ad-a204-4994-8bcd-a508c570c877.wav"),
  shin: abjadLetterUri("alphabet/Sheen/Sheen_adam khatab_7d1c6ad1-bf07-49ef-8b5a-eb316fe21f07.wav"),
  sad: abjadLetterUri("alphabet/sad/Sad_adam khatab_c108c519-3cb2-4c30-984a-e3d11e26a78f.wav"),
  dad: abjadLetterUri("alphabet/Dad/Dad_adam khatab_4f2ecc34-b72d-409e-941d-c73e88100aed.wav"),
  "ta-emph": abjadLetterUri(
    "alphabet/Tah/Tah_adam khatab_3a775423-9a5e-46c3-913d-9393e63d2629.wav",
  ),
  "za-emph": abjadLetterUri(
    "alphabet/Zah/Zah_adam khatab_56b115db-4fe9-4e81-9e6a-3ff4ce78dabb.wav",
  ),
  ayn: abjadLetterUri("alphabet/Ayn/Ayn_adam khatab_8656618d-1507-4483-bf98-b7018e62dffe.wav"),
  ghayn: abjadLetterUri(
    "alphabet/Gheen/Gheen_adam khatab_b2ba82be-98af-4725-8b97-ae778c95b650.wav",
  ),
  fa: abjadLetterUri("alphabet/Fa/Fa_adam khatab_aaba8bc3-24d1-4f6f-aba8-2eb5527406b3.wav"),
  qaf: abjadLetterUri("alphabet/Qaf/Qaf_adam khatab_4dee73ed-eaae-432d-a217-41de65c607a1.wav"),
  kaf: abjadLetterUri("alphabet/Kaf/Kaf_adam khatab_6b2c6818-d661-417e-b49e-5d4c56b25aaa.wav"),
  lam: abjadLetterUri("alphabet/Lam/Lam_adam khatab_19453494-d25b-40b1-b0ff-b6bd25713aca.wav"),
  mim: abjadLetterUri("alphabet/Meem/Meem_adam khatab_27148d7f-660b-4ed2-92c4-ac03f8e24de4.wav"),
  nun: abjadLetterUri("alphabet/Noon/Noon_adam khatab_1567798e-35f0-4871-a0f6-26351d31f9d9.wav"),
  "ha-end": abjadLetterUri("alphabet/Ha/Ha_adam khatab_4f9079d4-32b6-411b-8376-092b37e4b572.wav"),
  waw: abjadLetterUri("alphabet/Wow/Wow_adam khatab_209e1ec2-3d56-4d06-a8a6-4b26531ab9b0.wav"),
  ya: abjadLetterUri("alphabet/Ya/Ya_adam khatab_0d070f0a-b857-4ea9-b8eb-f776f9103142.wav"),
} as const satisfies Record<string, string>;

/** Letter glyph → audio for pronunciation-pair cards (reuse letter streams). */
export const QURAN_GUIDE_GLYPH_AUDIO_URI: Record<string, string> = {
  ا: QURAN_GUIDE_LETTER_AUDIO_URI.alif,
  ب: QURAN_GUIDE_LETTER_AUDIO_URI.ba,
  ت: QURAN_GUIDE_LETTER_AUDIO_URI.ta,
  ث: QURAN_GUIDE_LETTER_AUDIO_URI.tha,
  ج: QURAN_GUIDE_LETTER_AUDIO_URI.jim,
  ح: QURAN_GUIDE_LETTER_AUDIO_URI.ha,
  خ: QURAN_GUIDE_LETTER_AUDIO_URI.kha,
  د: QURAN_GUIDE_LETTER_AUDIO_URI.dal,
  ذ: QURAN_GUIDE_LETTER_AUDIO_URI.dhal,
  ر: QURAN_GUIDE_LETTER_AUDIO_URI.ra,
  ز: QURAN_GUIDE_LETTER_AUDIO_URI.zay,
  س: QURAN_GUIDE_LETTER_AUDIO_URI.sin,
  ش: QURAN_GUIDE_LETTER_AUDIO_URI.shin,
  ص: QURAN_GUIDE_LETTER_AUDIO_URI.sad,
  ض: QURAN_GUIDE_LETTER_AUDIO_URI.dad,
  ط: QURAN_GUIDE_LETTER_AUDIO_URI["ta-emph"],
  ظ: QURAN_GUIDE_LETTER_AUDIO_URI["za-emph"],
  ع: QURAN_GUIDE_LETTER_AUDIO_URI.ayn,
  غ: QURAN_GUIDE_LETTER_AUDIO_URI.ghayn,
  ف: QURAN_GUIDE_LETTER_AUDIO_URI.fa,
  ق: QURAN_GUIDE_LETTER_AUDIO_URI.qaf,
  ك: QURAN_GUIDE_LETTER_AUDIO_URI.kaf,
  ل: QURAN_GUIDE_LETTER_AUDIO_URI.lam,
  م: QURAN_GUIDE_LETTER_AUDIO_URI.mim,
  ن: QURAN_GUIDE_LETTER_AUDIO_URI.nun,
  ه: QURAN_GUIDE_LETTER_AUDIO_URI["ha-end"],
  و: QURAN_GUIDE_LETTER_AUDIO_URI.waw,
  ي: QURAN_GUIDE_LETTER_AUDIO_URI.ya,
};

/**
 * Arabic example string → ayah clip. Keys use the exact `examples[]` text from
 * English quran-guide content (tajweed, letters, pronunciation).
 */
export const QURAN_GUIDE_EXAMPLE_AUDIO: Record<string, QuranGuideAyahAudio> = {
  // --- Noon sakinah & tanween ---
  "مِنْ عِلْم": { surah: 17, ayah: 85, wordFrom: 10, wordTo: 12, clipStart: 9.505, clipEnd: 12.755 },
  "مِنْ رَبِّهِمْ": {
    surah: 2,
    ayah: 5,
    wordFrom: 4,
    wordTo: 5,
    clipStart: 3.485,
    clipEnd: 5.465,
  },
  "مِنْ بَعْدِ": { surah: 2, ayah: 27, wordFrom: 3, wordTo: 4, clipStart: 2.785, clipEnd: 4.155 },
  أَنْتُمْ: { surah: 2, ayah: 4, wordFrom: 10, wordTo: 10, clipStart: 10.665, clipEnd: 12.115 },

  // --- Meem sakinah ---
  "لَهُمْ مَّا": { surah: 2, ayah: 2, wordFrom: 5, wordTo: 6, clipStart: 2.695, clipEnd: 5.255 },
  "تَرْمِيهِمْ بِحِجَارَةٍ": { surah: 105, ayah: 4 },
  "أَمْ لَمْ": { surah: 2, ayah: 4, wordFrom: 1, wordTo: 2, clipStart: 0, clipEnd: 2.185 },

  // --- Madd / ghunnah / qalqalah ---
  قَالَ: { surah: 2, ayah: 30 },
  السَّمَاء: { surah: 2, ayah: 19 },
  الرَّحِيم: { surah: 1, ayah: 3, wordFrom: 2, wordTo: 2, clipStart: 1.175, clipEnd: 4.5 },
  "مِنْ نُّور": { surah: 24, ayah: 35 },
  إِنَّ: { surah: 1, ayah: 7, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 0.685 },
  يَجْعَلُونَ: { surah: 2, ayah: 19 },
  الْحَقّْ: { surah: 2, ayah: 42 },
  أَحَدْ: { surah: 112, ayah: 4, wordFrom: 5, wordTo: 5, clipStart: 2.935, clipEnd: 4.63 },

  // --- Waqf / hamzat wasl / lam shamsiyah / silent ---
  "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ": { surah: 1, ayah: 2 },
  ٱللَّهِ: { surah: 1, ayah: 1, wordFrom: 2, wordTo: 2, clipStart: 0.58, clipEnd: 1.409 },
  ٱلرَّحْمَٰنِ: { surah: 1, ayah: 3, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 1.175 },
  ٱهْدِنَا: { surah: 1, ayah: 6 },
  ٱلشَّمْسِ: { surah: 91, ayah: 1, wordFrom: 2, wordTo: 2, clipStart: 1.07, clipEnd: 2.575 },
  ٱلْقَمَرِ: { surah: 54, ayah: 1 },
  ذَٰلِكَ: { surah: 2, ayah: 2, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 0.845 },
  أُو۟لَٰٓئِكَ: { surah: 2, ayah: 5, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 2.474 },

  // --- Letter example words (first hit used pedagogically) ---
  اَللَّه: { surah: 1, ayah: 1, wordFrom: 2, wordTo: 2, clipStart: 0.58, clipEnd: 1.409 },
  اِبْدَأ: { surah: 96, ayah: 1 },
  بِسْم: { surah: 1, ayah: 1, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 0.58 },
  رَبِّ: { surah: 1, ayah: 2, wordFrom: 3, wordTo: 3, clipStart: 1.795, clipEnd: 2.425 },
  تَبَارَك: { surah: 67, ayah: 1 },
  رَحِيم: { surah: 1, ayah: 3, wordFrom: 2, wordTo: 2, clipStart: 1.175, clipEnd: 4.5 },
  ثُمَّ: { surah: 2, ayah: 28 },
  مِيثَاق: { surah: 2, ayah: 27 },
  جَنَّة: { surah: 2, ayah: 25 },
  رَجُل: { surah: 2, ayah: 282 },
  الْحَمْد: { surah: 1, ayah: 2, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 0.935 },
  رَحْمَن: { surah: 1, ayah: 3, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 1.175 },
  خَيْر: { surah: 2, ayah: 184 },
  سَمِيع: { surah: 2, ayah: 127 },
  دِين: { surah: 1, ayah: 4 },
  عَبْد: { surah: 2, ayah: 23 },
  ذَٰلِك: { surah: 2, ayah: 2, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 0.845 },
  أُولَٰئِكَ: { surah: 2, ayah: 5, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 2.474 },
  قُرْآن: { surah: 2, ayah: 185 },
  زَكَاة: { surah: 2, ayah: 43 },
  عَزِيز: { surah: 2, ayah: 129 },
  سَلَام: { surah: 36, ayah: 58 },
  نَفْس: { surah: 2, ayah: 48 },
  شَهْر: { surah: 2, ayah: 185 },
  مُشْرِك: { surah: 2, ayah: 221 },
  صِرَاط: { surah: 1, ayah: 6 },
  صَبْر: { surah: 2, ayah: 45 },
  ضَالِّين: { surah: 1, ayah: 7, wordFrom: 8, wordTo: 9, clipStart: 6.315, clipEnd: 13.11 },
  أَرْض: { surah: 2, ayah: 11 },
  طَيِّبَات: { surah: 2, ayah: 57 },
  مُطَهَّر: { surah: 2, ayah: 25 },
  ظَالِم: { surah: 2, ayah: 35 },
  حَفِيظ: { surah: 11, ayah: 57 },
  عَلِيم: { surah: 2, ayah: 29 },
  غَفُور: { surah: 2, ayah: 173 },
  بَغْي: { surah: 2, ayah: 213 },
  فَاتِحَة: { surah: 1, ayah: 1 },
  كَافِر: { surah: 2, ayah: 19 },
  وَقَّى: { surah: 2, ayah: 201 },
  كِتَاب: { surah: 2, ayah: 2, wordFrom: 2, wordTo: 2, clipStart: 0.845, clipEnd: 1.745 },
  مُلْك: { surah: 1, ayah: 4 },
  لَا: { surah: 2, ayah: 2, wordFrom: 3, wordTo: 3, clipStart: 1.745, clipEnd: 2.125 },
  عَبْدُ: { surah: 2, ayah: 23 },
  مُحَمَّد: { surah: 3, ayah: 144 },
  نُور: { surah: 24, ayah: 35, wordFrom: 3, wordTo: 3, clipStart: 1.705, clipEnd: 3.305 },
  إِنْسَان: { surah: 4, ayah: 28 },
  إِلَٰه: { surah: 2, ayah: 163 },
  فَتْح: { surah: 48, ayah: 1 },
  وَ: { surah: 1, ayah: 2 },
  يَوْم: { surah: 1, ayah: 4 },

  // --- Pronunciation pair examples (take left / right words where split) ---
  "عَلِيم vs حَلِيم": { surah: 2, ayah: 29 },
  "سَمِيع vs رَحِيم": { surah: 2, ayah: 127 },
  "الْحَقُّ vs خَيْر": { surah: 2, ayah: 42 },
  "سَلَام vs صَلَاة": { surah: 2, ayah: 43 },
  "دِين vs ضَالِّين": { surah: 1, ayah: 4 },
  "تَوْبَة vs طَيِّبَات": { surah: 2, ayah: 57 },
  "ذَٰلِك vs ظَالِم": { surah: 2, ayah: 2 },
  "كِتَاب vs قُرْآن": { surah: 2, ayah: 2 },
  "غَفُور vs خَالِق": { surah: 2, ayah: 173 },
};

/** Surah audio entry points for memorization plans (first ayah). */
export const QURAN_GUIDE_MEMORIZATION_LISTEN: Record<string, QuranGuideAyahAudio> = {
  beginner: { surah: 114, ayah: 1 },
  intermediate: { surah: 1, ayah: 1 },
  advanced: { surah: 67, ayah: 1 },
  hafiz: { surah: 1, ayah: 1 },
};

export const AL_FATIHA_PRACTICE_AUDIO: QuranGuideAyahAudio = { surah: 1, ayah: 1 };

/**
 * Vocabulary headword → timed word clip (Alafasy / QuranCDN segments on everyayah).
 * Keys match `QURAN_GUIDE_VOCABULARY` ids. Citation on the card may differ when the
 * listed ayah lacks an isolating form of the headword (e.g. rahma → 30:21).
 */
export const QURAN_GUIDE_VOCAB_AUDIO: Record<string, QuranGuideAyahAudio> = {
  allah: { surah: 1, ayah: 1, wordFrom: 2, wordTo: 2, clipStart: 0.58, clipEnd: 1.409 },
  rabb: { surah: 1, ayah: 2, wordFrom: 3, wordTo: 3, clipStart: 1.795, clipEnd: 2.425 },
  rahma: { surah: 30, ayah: 21, wordFrom: 14, wordTo: 14, clipStart: 17.885, clipEnd: 19.575 },
  jannah: { surah: 2, ayah: 25, wordFrom: 8, wordTo: 8, clipStart: 6.265, clipEnd: 8.155 },
  nar: { surah: 2, ayah: 24, wordFrom: 7, wordTo: 7, clipStart: 4.905, clipEnd: 6.145 },
  iman: { surah: 2, ayah: 108, wordFrom: 14, wordTo: 14, clipStart: 11.965, clipEnd: 13.315 },
  sabr: { surah: 2, ayah: 153, wordFrom: 5, wordTo: 5, clipStart: 5.565, clipEnd: 6.505 },
  shukr: { surah: 14, ayah: 7, wordFrom: 5, wordTo: 5, clipStart: 3.95, clipEnd: 5.41 },
  taqwa: { surah: 49, ayah: 13, wordFrom: 16, wordTo: 16, clipStart: 27.985, clipEnd: 29.825 },
  rizq: { surah: 5, ayah: 114, wordFrom: 22, wordTo: 22, clipStart: 31.385, clipEnd: 34.46 },
  nur: { surah: 24, ayah: 35, wordFrom: 2, wordTo: 2, clipStart: 1.085, clipEnd: 1.705 },
  dunya: { surah: 6, ayah: 32, wordFrom: 3, wordTo: 3, clipStart: 1.585, clipEnd: 4.405 },
  akhira: { surah: 87, ayah: 17, wordFrom: 1, wordTo: 1, clipStart: 0, clipEnd: 1.105 },
  salat: { surah: 20, ayah: 14, wordFrom: 10, wordTo: 10, clipStart: 12.655, clipEnd: 13.795 },
  kitab: { surah: 2, ayah: 2, wordFrom: 2, wordTo: 2, clipStart: 0.845, clipEnd: 1.745 },
};

export function resolveExampleAudio(example: string): QuranGuideAyahAudio | undefined {
  return QURAN_GUIDE_EXAMPLE_AUDIO[example];
}

export function resolveVocabAudio(vocabId: string): QuranGuideAyahAudio | undefined {
  return QURAN_GUIDE_VOCAB_AUDIO[vocabId];
}

export function resolveLetterAudioUri(letterId: string): string | undefined {
  return (QURAN_GUIDE_LETTER_AUDIO_URI as Record<string, string>)[letterId];
}

export function resolveGlyphAudioUri(glyph: string): string | undefined {
  return QURAN_GUIDE_GLYPH_AUDIO_URI[glyph];
}
