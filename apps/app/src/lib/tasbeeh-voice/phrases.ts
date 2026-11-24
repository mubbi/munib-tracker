/**
 * Hands-free tasbeeh v1 phrase catalog (NF-3.20). The Arabic is NEVER typed here
 * (§2.1): every phrase and variant is a reference into the bundled adhkar / dua
 * datasets (`@munib-tracker/shared/content/{zikr,duas}`) — a whole entry, or a
 * word slice of one, or a concatenation of such slices. The build script
 * `scripts/build-tasbeeh-voice-tokens.mjs` resolves these refs against the
 * dataset and the pinned model vocab into `phrase-tokens.json`.
 *
 * Import-free on purpose: the Node build / eval scripts load this file directly.
 */

export const PHRASE_KEYS = [
  "subhanallah",
  "alhamdulillah",
  "allahu_akbar",
  "tahlil",
  "istighfar",
  "subhanallah_wb",
  "hawqala",
  "salawat_short",
] as const;

export type PhraseKey = (typeof PHRASE_KEYS)[number];

/** A dataset reference: one entry, optionally the word slice `[start, end)` of its Arabic. */
export type PhraseRef = {
  corpus: "zikr" | "dua";
  id: string;
  words?: readonly [number, number];
};

export type PhraseVariant = {
  /** Stable id inside the phrase (`base`, `azim`, …). */
  id: string;
  /** Concatenated in order to form the spoken phrase. */
  parts: readonly PhraseRef[];
};

export type VoicePhrase = {
  key: PhraseKey;
  /** What the listening chip shows (Arabic from the dataset + its translation). */
  display: PhraseRef;
  /** Accepted forms. The first is the base phrase. */
  variants: readonly PhraseVariant[];
  /** `tasbeeh/[zikrId]` counters that listen for this phrase. */
  zikrIds: readonly string[];
  /**
   * Shortest plausible duration of one repetition (ms). Two hits closer than this
   * are one hit (hit-dedupe). Measured on the reference recordings (proof log).
   */
  minMs: number;
};

const z = (id: string, words?: readonly [number, number]): PhraseRef => ({
  corpus: "zikr",
  id,
  ...(words ? { words } : {}),
});
const d = (id: string, words?: readonly [number, number]): PhraseRef => ({
  corpus: "dua",
  id,
  ...(words ? { words } : {}),
});

export const VOICE_PHRASES: Record<PhraseKey, VoicePhrase> = {
  subhanallah: {
    key: "subhanallah",
    display: z("after_prayer-tasbih"),
    variants: [{ id: "base", parts: [z("after_prayer-tasbih")] }],
    zikrIds: ["after_prayer-tasbih"],
    minMs: 400,
  },
  alhamdulillah: {
    key: "alhamdulillah",
    display: z("after_prayer-tahmid"),
    variants: [{ id: "base", parts: [z("after_prayer-tahmid")] }],
    zikrIds: ["after_prayer-tahmid"],
    minMs: 400,
  },
  allahu_akbar: {
    key: "allahu_akbar",
    display: z("after_prayer-takbir"),
    variants: [{ id: "base", parts: [z("after_prayer-takbir")] }],
    zikrIds: ["after_prayer-takbir"],
    minMs: 400,
  },
  tahlil: {
    key: "tahlil",
    // "La ilaha illallah" = the first four words of the long tahlil entry.
    display: z("anytime-tahlil", [0, 4]),
    variants: [{ id: "base", parts: [z("anytime-tahlil", [0, 4])] }],
    zikrIds: [],
    minMs: 560,
  },
  istighfar: {
    key: "istighfar",
    display: z("anytime-istighfar"),
    variants: [
      { id: "base", parts: [z("anytime-istighfar")] },
      // + "al-'Azim": the word الْعَظِيمِ as it appears in the kalimatan entry.
      { id: "azim", parts: [z("anytime-istighfar"), z("anytime-kalimatan", [5, 6])] },
      // + "wa atubu ilayh": Hisnul Muslim 96.
      { id: "atubu", parts: [d("hisn-96", [0, 4])] },
    ],
    zikrIds: ["anytime-istighfar", "after_prayer-istighfar-three"],
    minMs: 480,
  },
  subhanallah_wb: {
    key: "subhanallah_wb",
    display: z("anytime-subhanallah-bihamdihi"),
    variants: [
      { id: "base", parts: [z("anytime-subhanallah-bihamdihi")] },
      // + "SubhanAllahil-'Azim": the full kalimatan entry.
      { id: "azim", parts: [z("anytime-kalimatan")] },
    ],
    zikrIds: [
      "anytime-subhanallah-bihamdihi",
      "morning-tasbih-hundred",
      "evening-tasbih-hundred",
      "anytime-kalimatan",
    ],
    minMs: 720,
  },
  hawqala: {
    key: "hawqala",
    display: z("anytime-hawqala"),
    variants: [{ id: "base", parts: [z("anytime-hawqala")] }],
    zikrIds: ["anytime-hawqala"],
    minMs: 960,
  },
  salawat_short: {
    key: "salawat_short",
    display: z("before_prayer-salawat"),
    variants: [
      { id: "base", parts: [z("before_prayer-salawat")] },
      // + "wa 'ala ali Muhammad".
      { id: "al", parts: [z("after_azan-salawat")] },
    ],
    zikrIds: ["before_prayer-salawat", "after_azan-salawat"],
    minMs: 800,
  },
};

export function isPhraseKey(value: unknown): value is PhraseKey {
  return typeof value === "string" && (PHRASE_KEYS as readonly string[]).includes(value);
}

/** The phrase a `tasbeeh/[zikrId]` counter listens for, or null (no voice counting). */
export function phraseForZikr(zikrId: string | null | undefined): PhraseKey | null {
  if (!zikrId) return null;
  for (const key of PHRASE_KEYS) {
    if (VOICE_PHRASES[key].zikrIds.includes(zikrId)) return key;
  }
  return null;
}
