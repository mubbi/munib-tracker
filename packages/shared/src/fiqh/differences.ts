import type { FiqhDomain, MadhhabId } from "../types/preferences";

/**
 * Catalog of labelled differences between the four Sunni schools (NF-3.0a,
 * plan §4.1.2–4.1.3). This is guide copy, not scripture: every title and
 * position is an i18n key (`fiqh.diff.<id>.*`, 24 locales), every claim has a
 * proof-log entry in `docs/proofs/madhhab.md` (D11), and Qur'an/hadith refs
 * were checked against the corpus the app renders.
 *
 * Display rules: a selected school shows its own position plus a collapsed
 * "Other views" disclosure; `null` (all views) shows `<RulingCompare>`. No
 * position is ever phrased as the only valid one.
 */

export type HadithCollectionKey =
  | "bukhari"
  | "muslim"
  | "abudawud"
  | "tirmidhi"
  | "nasai"
  | "ibnmajah";

/** Classical works cited by the proof log, keyed for compact refs. */
export const CLASSICAL_WORKS = {
  hidayah: { title: "al-Hidayah (al-Marghinani)", school: "hanafi" },
  raddMuhtar: { title: "Radd al-Muhtar 'ala al-Durr al-Mukhtar (Ibn 'Abidin)", school: "hanafi" },
  sirajiyyah: { title: "al-Sirajiyyah (Siraj al-Din al-Sajawandi)", school: "hanafi" },
  minhaj: { title: "Minhaj al-Talibin (al-Nawawi)", school: "shafii" },
  tuhfah: { title: "Tuhfat al-Muhtaj (Ibn Hajar al-Haytami)", school: "shafii" },
  rahbiyyah: { title: "Matn al-Rahbiyyah (al-Rahbi)", school: "shafii" },
  khalil: { title: "Mukhtasar Khalil (Khalil ibn Ishaq)", school: "maliki" },
  sharhKabir: { title: "al-Sharh al-Kabir (al-Dardir) with Hashiyat al-Dasuqi", school: "maliki" },
  zad: { title: "Zad al-Mustaqni' (al-Hajjawi)", school: "hanbali" },
  kashshaf: { title: "Kashshaf al-Qina' (al-Buhuti)", school: "hanbali" },
  mughni: { title: "al-Mughni (Ibn Qudamah)", school: "hanbali" },
  bidayah: { title: "Bidayat al-Mujtahid (Ibn Rushd)", school: null },
} as const satisfies Record<string, { title: string; school: MadhhabId | null }>;

export type ClassicalWorkId = keyof typeof CLASSICAL_WORKS;

/** A checkable reference: Qur'an by ayah, hadith by collection number, or a classical work by id. */
export type FiqhContentRef =
  | { kind: "quran"; surah: number; ayahFrom: number; ayahTo?: number }
  | {
      kind: "hadith";
      collection: HadithCollectionKey;
      /**
       * Hadith number in the corpus the app renders (fawazahmed0 hadith-api,
       * `hadithnumber`). Matches sunnah.com for every collection except Muslim,
       * whose corpus numbering is sequential — see `arabicNumber`.
       */
      number: number;
      /** Muslim only: the Abd al-Baqi number (corpus `arabicnumber`, e.g. "1977.03") cited in print. */
      arabicNumber?: string;
      /** `disputed` = hadith critics differ on the grading (see the proof log). */
      grade: "sahih" | "hasan" | "disputed";
    }
  | { kind: "book"; work: ClassicalWorkId };

export interface FiqhPosition {
  summaryKey: string;
  value?: string | number;
  refs?: readonly FiqhContentRef[];
}

export const FIQH_DIFFERENCE_IDS = [
  "asr.start",
  "asr.preferred",
  "fajr.preferred",
  "isha.start",
  "isha.preferred",
  "witr.status",
  "witr.form",
  "witr.qaza",
  "salah.raisingHands",
  "salah.fatihaBehindImam",
  "salah.fajrQunut",
  "salah.lastSitting",
  "salah.firstTashahhud",
  "salah.abandoning",
  "jumuah.minCongregation",
  "jumuah.sunnah",
  "eid.status",
  "eid.extraTakbirs",
  "janazah.fatiha",
  "rawatib.preset",
  "rawatib.fajrMakeup",
  "masjid.tahiyyat",
  "tarawih.rakahs",
  "tashriq.takbir",
  "wudu.intention",
  "wudu.tartib",
  "wudu.muwalat",
  "wudu.dalk",
  "wudu.touchOppositeSex",
  "wudu.touchPrivateParts",
  "hayd.min",
  "hayd.max",
  "hayd.minPurity",
  "hayd.beyondMax",
  "nifas.max",
  "hayd.quranRecitation",
  "qasr.distance",
  "qasr.status",
  "qasr.residency",
  "jam.travel",
  "jam.rain",
  "travel.rawatib",
  "zakat.nisabBasis",
  "zakat.combineGoldSilver",
  "zakat.jewellery",
  "fasting.forgetfulEating",
  "fasting.kaffarah",
  "fasting.afterMidShaban",
  "fidyah.measure",
  "fitr.measure",
  "tawaf.wudu",
  "umrah.taqsir",
  "udhiyah.status",
  "udhiyah.hairNails",
  "mirath.grandfatherSiblings",
  "mirath.mushtarakah",
  "mirath.paternalGrandmother",
  "mirath.radd",
  "mirath.malikiyyah",
  "wasiyyah.debtsToAllah",
  "wasiyyah.noHeirs",
] as const;

export type FiqhDifferenceId = (typeof FIQH_DIFFERENCE_IDS)[number];

export interface FiqhDifference {
  id: FiqhDifferenceId;
  domain: FiqhDomain;
  titleKey: string;
  positions: Readonly<Record<MadhhabId, FiqhPosition>>;
  /** Evidence every school discusses (e.g. the verse all four interpret). */
  refs?: readonly FiqhContentRef[];
  /** Optional label when 3+ schools agree. */
  majority?: readonly MadhhabId[];
  /** Where the difference is shown (route, optionally `#section`) — read by the §4.1.2 coverage test. */
  usedIn: readonly string[];
  /**
   * Shown only as a guide note (salah method, wudu details): no calculator or
   * tracker consumes it, so `MADHHAB_RULES` has no typed field to check it against.
   */
  guideNoteOnly?: true;
}

// ── ref helpers ─────────────────────────────────────────────────────────────
const q = (surah: number, ayahFrom: number, ayahTo?: number): FiqhContentRef =>
  ayahTo == null ? { kind: "quran", surah, ayahFrom } : { kind: "quran", surah, ayahFrom, ayahTo };
const h = (
  collection: HadithCollectionKey,
  number: number,
  grade: "sahih" | "hasan" | "disputed" = "sahih",
): FiqhContentRef => ({ kind: "hadith", collection, number, grade });
/** Sahih Muslim by corpus number + Abd al-Baqi number (verified against the corpus `arabicnumber`). */
const m = (corpusNumber: number, arabicNumber: string): FiqhContentRef => ({
  kind: "hadith",
  collection: "muslim",
  number: corpusNumber,
  arabicNumber,
  grade: "sahih",
});
const b = (...works: ClassicalWorkId[]): FiqhContentRef[] =>
  works.map((work) => ({ kind: "book", work }));

const HANAFI = b("hidayah", "raddMuhtar");
const SHAFII = b("minhaj", "tuhfah");
const MALIKI = b("khalil", "sharhKabir");
const HANBALI = b("zad", "kashshaf");

type PosInput = { key: string; value?: string | number; refs?: readonly FiqhContentRef[] };

/** Guide-note-only rows (see `FiqhDifference.guideNoteOnly`). */
const GUIDE_NOTE_ONLY: ReadonlySet<FiqhDifferenceId> = new Set<FiqhDifferenceId>([
  "salah.raisingHands",
  "salah.fatihaBehindImam",
  "salah.fajrQunut",
  "salah.lastSitting",
  "salah.firstTashahhud",
  "salah.abandoning",
  "jumuah.sunnah",
  "masjid.tahiyyat",
  "wudu.intention",
  "wudu.tartib",
  "wudu.muwalat",
  "wudu.dalk",
  "wudu.touchOppositeSex",
  "wudu.touchPrivateParts",
  // Umrah mode / guide note only: the app tracks halq vs taqsir, not an amount.
  "umrah.taqsir",
]);

/**
 * Builds one catalog row. `positions[school].key` is the summary suffix, so
 * schools that hold the same view share one translated string
 * (`fiqh.diff.<id>.<key>`). Each school's own fiqh manuals are appended to its refs.
 */
function row(
  id: FiqhDifferenceId,
  domain: FiqhDomain,
  positions: Record<MadhhabId, PosInput>,
  usedIn: readonly string[],
  extra: { refs?: readonly FiqhContentRef[]; majority?: readonly MadhhabId[] } = {},
): FiqhDifference {
  const manuals: Record<MadhhabId, FiqhContentRef[]> = {
    hanafi: HANAFI,
    shafii: SHAFII,
    maliki: MALIKI,
    hanbali: HANBALI,
  };
  const build = (school: MadhhabId): FiqhPosition => {
    const p = positions[school];
    return {
      summaryKey: `fiqh.diff.${id}.${p.key}`,
      ...(p.value !== undefined && { value: p.value }),
      refs: [...(p.refs ?? []), ...manuals[school]],
    };
  };
  return {
    id,
    domain,
    titleKey: `fiqh.diff.${id}.title`,
    positions: {
      hanafi: build("hanafi"),
      shafii: build("shafii"),
      maliki: build("maliki"),
      hanbali: build("hanbali"),
    },
    ...(extra.refs && { refs: extra.refs }),
    ...(extra.majority && { majority: extra.majority }),
    usedIn,
    ...(GUIDE_NOTE_ONLY.has(id) && { guideNoteOnly: true as const }),
  };
}

/** Same position (same summary key + value) for several schools. */
const same = (
  key: string,
  value?: string | number,
  refs?: readonly FiqhContentRef[],
): PosInput => ({
  key,
  ...(value !== undefined && { value }),
  ...(refs && { refs }),
});

const NOT_HANAFI: readonly MadhhabId[] = ["shafii", "maliki", "hanbali"];

export const FIQH_DIFFERENCES: readonly FiqhDifference[] = [
  // ── Salah times ────────────────────────────────────────────────────────────
  row(
    "asr.start",
    "salah",
    {
      hanafi: { key: "hanafi", value: "2x" },
      shafii: same("majority", "1x"),
      maliki: same("majority", "1x"),
      hanbali: same("majority", "1x"),
    },
    ["/location", "/salah-guide/prayer-times"],
    { refs: [h("abudawud", 393, "hasan"), h("tirmidhi", 149, "hasan")], majority: NOT_HANAFI },
  ),
  row(
    "asr.preferred",
    "salah",
    {
      hanafi: { key: "hanafi", value: "delay_before_yellowing" },
      shafii: same("majority", "early"),
      maliki: same("majority", "early"),
      hanbali: same("majority", "early"),
    },
    ["/salah-guide/prayer-times", "/(tabs)/index#hero"],
    { majority: NOT_HANAFI },
  ),
  row(
    "fajr.preferred",
    "salah",
    {
      hanafi: { key: "hanafi", value: "isfar", refs: [h("tirmidhi", 154)] },
      shafii: same("majority", "taghlis", [h("bukhari", 578)]),
      maliki: same("majority", "taghlis", [h("bukhari", 578)]),
      hanbali: same("majority", "taghlis", [h("bukhari", 578)]),
    },
    ["/salah-guide/prayer-times", "/(tabs)/index#hero", "/settings/reminder-offsets"],
    { majority: NOT_HANAFI },
  ),
  row(
    "isha.start",
    "salah",
    {
      hanafi: { key: "hanafi", value: "white" },
      shafii: same("majority", "red"),
      maliki: same("majority", "red"),
      hanbali: same("majority", "red"),
    },
    ["/salah-guide/prayer-times", "/location"],
    { refs: [h("abudawud", 393, "hasan")], majority: NOT_HANAFI },
  ),
  row(
    "isha.preferred",
    "salah",
    {
      hanafi: { key: "delay", value: "delay_third" },
      shafii: { key: "shafii", value: "early" },
      maliki: { key: "maliki", value: "early" },
      hanbali: { key: "hanbali", value: "delay_third" },
    },
    ["/salah-guide/prayer-times", "/(tabs)/index#hero", "/settings/reminder-offsets"],
    { refs: [h("tirmidhi", 167)] },
  ),
  // ── Witr ───────────────────────────────────────────────────────────────────
  row(
    "witr.status",
    "salah",
    {
      hanafi: { key: "hanafi", value: "wajib", refs: [h("abudawud", 1422)] },
      shafii: same("majority", "sunnah_muakkadah", [h("bukhari", 46)]),
      maliki: same("majority", "sunnah_muakkadah", [h("bukhari", 46)]),
      hanbali: same("majority", "sunnah_muakkadah", [h("bukhari", 46)]),
    },
    ["/(tabs)/tracker#witr", "/salah-guide/prayer-types", "/travel#witr"],
    { majority: NOT_HANAFI },
  ),
  row(
    "witr.form",
    "salah",
    {
      hanafi: { key: "hanafi", value: "three_one_salam" },
      shafii: { key: "shafii", value: "separated_or_joined", refs: [h("abudawud", 1422)] },
      maliki: { key: "maliki", value: "one_after_shaf" },
      hanbali: { key: "hanbali", value: "separated_or_joined", refs: [h("abudawud", 1422)] },
    },
    ["/(tabs)/tracker#witr", "/salah-guide/prayer-types"],
    { refs: [h("abudawud", 1425)] },
  ),
  row(
    "witr.qaza",
    "salah",
    {
      hanafi: { key: "hanafi", value: "required" },
      shafii: same("recommended", "recommended"),
      maliki: { key: "maliki", value: "not_after_fajr" },
      hanbali: same("recommended", "recommended"),
    },
    ["/(tabs)/tracker#witr", "/qaza"],
  ),
  // ── Salah method (guide notes) ─────────────────────────────────────────────
  row(
    "salah.raisingHands",
    "salah",
    {
      hanafi: { key: "hanafi", value: "opening_only", refs: [h("tirmidhi", 257, "disputed")] },
      shafii: { key: "shafii", value: "opening_ruku_rising_third", refs: [h("bukhari", 739)] },
      maliki: { key: "maliki", value: "opening_only" },
      hanbali: { key: "hanbali", value: "opening_ruku_rising", refs: [h("bukhari", 735)] },
    },
    ["/salah-guide/how-to-pray"],
  ),
  row(
    "salah.fatihaBehindImam",
    "salah",
    {
      hanafi: {
        key: "hanafi",
        value: "not_recited",
        refs: [q(7, 204), m(905, "404.02"), h("ibnmajah", 850, "disputed")],
      },
      shafii: { key: "shafii", value: "obligatory", refs: [h("bukhari", 756)] },
      maliki: { key: "maliki", value: "silent_prayers", refs: [q(7, 204)] },
      hanbali: { key: "hanbali", value: "silent_prayers_and_pauses", refs: [q(7, 204)] },
    },
    ["/salah-guide/jahri-sirri", "/salah-guide/how-to-pray"],
  ),
  row(
    "salah.fajrQunut",
    "salah",
    {
      hanafi: { key: "hanafi", value: "no" },
      shafii: { key: "shafii", value: "after_ruku", refs: [h("bukhari", 1001)] },
      maliki: { key: "maliki", value: "before_ruku", refs: [h("bukhari", 1002)] },
      hanbali: { key: "hanbali", value: "nazilah_only", refs: [h("bukhari", 1001)] },
    },
    ["/salah-guide/how-to-pray"],
  ),
  row(
    "salah.lastSitting",
    "salah",
    {
      hanafi: { key: "hanafi", value: "iftirash_all" },
      shafii: { key: "shafii", value: "tawarruk_every_final", refs: [h("bukhari", 828)] },
      maliki: { key: "maliki", value: "tawarruk_all" },
      hanbali: { key: "hanbali", value: "tawarruk_final_of_two", refs: [h("bukhari", 828)] },
    },
    ["/salah-guide/positions"],
  ),
  row(
    "salah.firstTashahhud",
    "salah",
    {
      hanafi: same("wajib", "wajib"),
      shafii: same("sunnah", "sunnah"),
      maliki: same("sunnah", "sunnah"),
      hanbali: same("wajib", "wajib"),
    },
    ["/salah-guide/pillars-nullifiers", "/salah-guide/sujud-al-sahw"],
    { refs: [h("bukhari", 829)] },
  ),
  row(
    "salah.abandoning",
    "salah",
    {
      hanafi: same("majority", "sinful_muslim"),
      shafii: same("majority", "sinful_muslim"),
      maliki: same("majority", "sinful_muslim"),
      hanbali: { key: "hanbali", value: "kufr_after_summons" },
    },
    ["/salah-guide/importance"],
    {
      refs: [m(246, "82.01"), h("tirmidhi", 2621)],
      majority: ["hanafi", "shafii", "maliki"],
    },
  ),
  // ── Jumu'ah, Eid, janazah ─────────────────────────────────────────────────
  row(
    "jumuah.minCongregation",
    "salah",
    {
      hanafi: { key: "hanafi", value: 3 },
      shafii: same("forty", 40, [h("abudawud", 1069, "hasan")]),
      maliki: { key: "maliki", value: 12, refs: [h("bukhari", 936)] },
      hanbali: same("forty", 40, [h("abudawud", 1069, "hasan")]),
    },
    ["/friday#obligation", "/salah-guide/jumuah"],
    { refs: [q(62, 9), q(62, 11)] },
  ),
  row(
    "jumuah.sunnah",
    "salah",
    {
      hanafi: { key: "hanafi", value: "4+4", refs: [m(2036, "881.01")] },
      shafii: { key: "shafii", value: "like_dhuhr", refs: [h("bukhari", 937)] },
      maliki: { key: "maliki", value: "no_fixed" },
      hanbali: {
        key: "hanbali",
        value: "after_2_to_6",
        refs: [h("bukhari", 937), m(2036, "881.01")],
      },
    },
    ["/friday#obligation", "/salah-guide/jumuah"],
  ),
  row(
    "eid.status",
    "salah",
    {
      hanafi: { key: "hanafi", value: "wajib" },
      shafii: same("sunnah", "sunnah_muakkadah"),
      maliki: same("sunnah", "sunnah_muakkadah"),
      hanbali: { key: "hanbali", value: "fard_kifayah" },
    },
    ["/eid#prayer"],
  ),
  row(
    "eid.extraTakbirs",
    "salah",
    {
      hanafi: { key: "hanafi", value: "3+3", refs: [h("abudawud", 1153, "disputed")] },
      shafii: {
        key: "shafii",
        value: "7+5",
        refs: [h("abudawud", 1149, "hasan"), h("abudawud", 1151, "hasan")],
      },
      maliki: same("sixFive", "6+5", [h("abudawud", 1149, "hasan")]),
      hanbali: same("sixFive", "6+5", [h("abudawud", 1149, "hasan")]),
    },
    ["/eid#prayer"],
  ),
  row(
    "janazah.fatiha",
    "salah",
    {
      hanafi: { key: "hanafi", value: "not_recited" },
      shafii: same("obligatory", "obligatory", [h("bukhari", 1335)]),
      maliki: { key: "maliki", value: "not_recited" },
      hanbali: same("obligatory", "obligatory", [h("bukhari", 1335)]),
    },
    ["/janazah#salah"],
  ),
  // ── Voluntary salah ────────────────────────────────────────────────────────
  row(
    "rawatib.preset",
    "salah",
    {
      hanafi: {
        key: "hanafi",
        value: 12,
        refs: [m(1694, "728.01"), h("tirmidhi", 415), h("bukhari", 1182)],
      },
      shafii: same("ten", 10, [h("bukhari", 1180)]),
      maliki: { key: "maliki", value: 10 },
      hanbali: same("ten", 10, [h("bukhari", 1180)]),
    },
    ["/(tabs)/tracker#rawatib", "/statistics#rawatib", "/salah-guide/prayer-types", "/rawatib"],
  ),
  // NF-3.1: making up the Fajr sunnah after sunrise (Tirmidhi 423 — graders differ).
  row(
    "rawatib.fajrMakeup",
    "salah",
    {
      hanafi: { key: "hanafi", value: "with_fard_only" },
      shafii: same("recommended", "recommended"),
      maliki: { key: "maliki", value: "until_zawal" },
      hanbali: same("recommended", "recommended"),
    },
    ["/(tabs)/tracker#rawatib", "/rawatib"],
    { refs: [h("tirmidhi", 423, "disputed")] },
  ),
  // NF-3.11: tahiyyat al-masjid — sunnah in all four schools; they differ on the
  // disliked times and on praying it during the Friday khutbah. Proof log:
  // docs/proofs/masjid-finder.md §2.3 (Muslim refs by corpus number).
  row(
    "masjid.tahiyyat",
    "salah",
    {
      hanafi: same("notDislikedTimes", "not_in_disliked_times_or_khutbah"),
      shafii: {
        key: "shafii",
        value: "any_time_with_cause",
        refs: [h("bukhari", 930), m(2018, "875.01")],
      },
      maliki: same("notDislikedTimes", "not_in_disliked_times_or_khutbah"),
      hanbali: {
        key: "hanbali",
        value: "khutbah_only",
        refs: [h("bukhari", 930), ...b("mughni")],
      },
    },
    ["/rawatib#tahiyyat"],
    { refs: [h("bukhari", 444), m(1654, "714.01"), h("bukhari", 586), m(1929, "831")] },
  ),
  row(
    "tarawih.rakahs",
    "salah",
    {
      hanafi: same("twenty", 20),
      shafii: same("twenty", 20),
      maliki: { key: "maliki", value: 20 },
      hanbali: same("twenty", 20),
    },
    ["/ramadan"],
    { refs: [h("bukhari", 2010)] },
  ),
  row(
    "tashriq.takbir",
    "salah",
    {
      hanafi: { key: "hanafi", value: "fajr9-asr13" },
      shafii: { key: "shafii", value: "fajr9-asr13" },
      maliki: { key: "maliki", value: "dhuhr10-fajr13" },
      hanbali: { key: "hanbali", value: "fajr9-asr13" },
    },
    ["/dhul-hijjah", "/eid#adha"],
    { refs: [q(2, 203)] },
  ),
  // ── Wudu (taharah guide) ───────────────────────────────────────────────────
  row(
    "wudu.intention",
    "taharah",
    {
      hanafi: { key: "hanafi", value: "sunnah" },
      shafii: same("majority", "required", [h("bukhari", 1)]),
      maliki: same("majority", "required", [h("bukhari", 1)]),
      hanbali: same("majority", "required", [h("bukhari", 1)]),
    },
    ["/taharah/wudu-conditions", "/taharah/wudu-obligatory"],
    { majority: NOT_HANAFI },
  ),
  row(
    "wudu.tartib",
    "taharah",
    {
      hanafi: same("sunnah", "sunnah"),
      shafii: same("fard", "fard"),
      maliki: same("sunnah", "sunnah"),
      hanbali: same("fard", "fard"),
    },
    ["/taharah/wudu-conditions", "/taharah/wudu-obligatory"],
    { refs: [q(5, 6)] },
  ),
  row(
    "wudu.muwalat",
    "taharah",
    {
      hanafi: same("sunnah", "sunnah"),
      shafii: same("sunnah", "sunnah"),
      maliki: { key: "maliki", value: "fard_when_remembered", refs: [h("abudawud", 175)] },
      hanbali: { key: "hanbali", value: "fard", refs: [h("abudawud", 175)] },
    },
    ["/taharah/wudu-conditions", "/taharah/wudu-obligatory"],
  ),
  row(
    "wudu.dalk",
    "taharah",
    {
      hanafi: same("majority", "sunnah"),
      shafii: same("majority", "sunnah"),
      maliki: { key: "maliki", value: "fard" },
      hanbali: same("majority", "sunnah"),
    },
    ["/taharah/wudu-obligatory"],
    { refs: [q(5, 6)], majority: ["hanafi", "shafii", "hanbali"] },
  ),
  row(
    "wudu.touchOppositeSex",
    "taharah",
    {
      hanafi: { key: "hanafi", value: "no", refs: [h("bukhari", 382)] },
      shafii: { key: "shafii", value: "breaks" },
      maliki: same("desire", "with_desire"),
      hanbali: same("desire", "with_desire"),
    },
    ["/taharah/wudu-breakers"],
    { refs: [q(4, 43), q(5, 6)] },
  ),
  row(
    "wudu.touchPrivateParts",
    "taharah",
    {
      hanafi: { key: "hanafi", value: "no", refs: [h("abudawud", 182, "disputed")] },
      shafii: { key: "shafii", value: "inner_hand", refs: [h("abudawud", 181, "disputed")] },
      maliki: { key: "maliki", value: "man_inner_hand", refs: [h("abudawud", 181, "disputed")] },
      hanbali: { key: "hanbali", value: "hand", refs: [h("abudawud", 181, "disputed")] },
    },
    ["/taharah/wudu-breakers"],
  ),
  // ── Hayd / nifas ───────────────────────────────────────────────────────────
  row(
    "hayd.min",
    "taharah",
    {
      hanafi: { key: "hanafi", value: 72 },
      shafii: same("dayNight", 24),
      maliki: { key: "maliki", value: 0 },
      hanbali: same("dayNight", 24),
    },
    ["/hayd", "/calendar#excused"],
    { refs: [q(2, 222)] },
  ),
  row(
    "hayd.max",
    "taharah",
    {
      hanafi: { key: "hanafi", value: 10 },
      shafii: same("fifteen", 15),
      maliki: { key: "maliki", value: 15 },
      hanbali: same("fifteen", 15),
    },
    ["/hayd", "/calendar#excused", "/(tabs)/tracker#excused"],
    { refs: [q(2, 222)], majority: NOT_HANAFI },
  ),
  row(
    "hayd.minPurity",
    "taharah",
    {
      hanafi: same("fifteen", 15),
      shafii: same("fifteen", 15),
      maliki: same("fifteen", 15),
      hanbali: { key: "hanbali", value: 13 },
    },
    ["/hayd", "/calendar#excused"],
    { majority: ["hanafi", "shafii", "maliki"] },
  ),
  row(
    "hayd.beyondMax",
    "taharah",
    {
      hanafi: { key: "hanafi", value: "istihada" },
      shafii: same("habitColour", "istihada"),
      maliki: { key: "maliki", value: "istihada" },
      hanbali: same("habitColour", "istihada"),
    },
    ["/hayd", "/(tabs)/tracker#excused"],
    { refs: [h("bukhari", 306)] },
  ),
  row(
    "nifas.max",
    "taharah",
    {
      hanafi: same("forty", 40, [h("abudawud", 311, "hasan"), h("tirmidhi", 139, "hasan")]),
      shafii: same("sixty", 60),
      maliki: same("sixty", 60),
      hanbali: same("forty", 40, [h("abudawud", 311, "hasan"), h("tirmidhi", 139, "hasan")]),
    },
    ["/hayd", "/calendar#excused"],
  ),
  // NF-3.5: reciting the Qur'an during hayd (Sunnah habits: Ayat al-Kursi, al-Mulk).
  // Listening, and dhikr / dua phrased from the Qur'an with the intent of dhikr,
  // are allowed by all four; see docs/proofs/sunnah-habits.md.
  row(
    "hayd.quranRecitation",
    "taharah",
    {
      hanafi: same("majority", "not_recited", [h("tirmidhi", 131, "disputed")]),
      shafii: same("majority", "not_recited", [h("tirmidhi", 131, "disputed")]),
      maliki: { key: "maliki", value: "recited_from_memory", refs: [h("bukhari", 305)] },
      hanbali: same("majority", "not_recited", [h("tirmidhi", 131, "disputed")]),
    },
    ["/habits"],
    { majority: ["hanafi", "shafii", "hanbali"] },
  ),
  // ── Travel ─────────────────────────────────────────────────────────────────
  row(
    "qasr.distance",
    "travel",
    {
      hanafi: { key: "hanafi", value: "77-78", refs: [h("bukhari", 1086)] },
      shafii: same("majority", "81-89"),
      maliki: same("majority", "81-89"),
      hanbali: same("majority", "81-89"),
    },
    ["/travel#distance", "/travel#calculator"],
    { refs: [q(4, 101), ...b("bidayah")], majority: NOT_HANAFI },
  ),
  row(
    "qasr.status",
    "travel",
    {
      hanafi: { key: "hanafi", value: "wajib", refs: [m(1570, "685.01"), h("bukhari", 1090)] },
      shafii: same("concession", "concession", [q(4, 101)]),
      maliki: { key: "maliki", value: "sunnah" },
      hanbali: same("concession", "concession", [q(4, 101)]),
    },
    ["/travel#qasr", "/travel#calculator"],
  ),
  row(
    "qasr.residency",
    "travel",
    {
      hanafi: { key: "hanafi", value: 15 },
      shafii: { key: "shafii", value: 4 },
      maliki: { key: "maliki", value: 4 },
      hanbali: { key: "hanbali", value: 4 },
    },
    ["/travel#when", "/travel#calculator"],
    { refs: [h("bukhari", 1081)] },
  ),
  row(
    "jam.travel",
    "travel",
    {
      hanafi: { key: "hanafi", value: "hajj_only" },
      shafii: same("allowed", "allowed", [h("bukhari", 1107)]),
      maliki: { key: "maliki", value: "while_moving", refs: [h("bukhari", 1106)] },
      hanbali: same("allowed", "allowed", [h("bukhari", 1107)]),
    },
    ["/travel#jam", "/travel#jamTypes", "/travel#calculator", "/(tabs)/tracker#combined"],
  ),
  row(
    "jam.rain",
    "salah",
    {
      hanafi: { key: "hanafi", value: "none" },
      shafii: { key: "shafii", value: "both" },
      maliki: same("maghribIsha", "maghrib_isha"),
      hanbali: same("maghribIsha", "maghrib_isha"),
    },
    ["/travel#jamTypes", "/(tabs)/tracker#combined"],
    { refs: [m(1628, "705.01")] },
  ),
  row(
    "travel.rawatib",
    "travel",
    {
      hanafi: { key: "hanafi", value: "optional_except_fajr" },
      shafii: same("optional", "optional"),
      maliki: same("optional", "optional"),
      hanbali: { key: "hanbali", value: "left_except_fajr_witr" },
    },
    ["/travel#sunnah", "/(tabs)/tracker#rawatib", "/rawatib"],
  ),
  // ── Zakat ──────────────────────────────────────────────────────────────────
  row(
    "zakat.nisabBasis",
    "zakat",
    {
      hanafi: { key: "hanafi", value: "lower" },
      shafii: same("contested", "gold"),
      maliki: same("contested", "gold"),
      hanbali: { key: "hanbali", value: "lower" },
    },
    ["/zakat", "/zakat#calculator"],
    { refs: [q(9, 34), h("bukhari", 1447), h("abudawud", 1573, "disputed")] },
  ),
  row(
    "zakat.combineGoldSilver",
    "zakat",
    {
      hanafi: { key: "hanafi", value: "value" },
      shafii: { key: "shafii", value: "no" },
      maliki: same("parts", "parts"),
      hanbali: same("parts", "parts"),
    },
    ["/zakat", "/zakat#calculator"],
  ),
  row(
    "zakat.jewellery",
    "zakat",
    {
      hanafi: { key: "hanafi", value: "zakatable", refs: [h("abudawud", 1563, "hasan")] },
      shafii: same("majority", "exempt"),
      maliki: same("majority", "exempt"),
      hanbali: same("majority", "exempt"),
    },
    ["/zakat", "/zakat#calculator"],
    { majority: NOT_HANAFI },
  ),
  // ── Fasting ────────────────────────────────────────────────────────────────
  row(
    "fasting.forgetfulEating",
    "fasting",
    {
      hanafi: same("majority", "valid", [h("bukhari", 1933), m(2716, "1155")]),
      shafii: same("majority", "valid", [h("bukhari", 1933), m(2716, "1155")]),
      maliki: { key: "maliki", value: "make_up" },
      hanbali: same("majority", "valid", [h("bukhari", 1933), m(2716, "1155")]),
    },
    ["/ramadan", "/fasting"],
    { majority: ["hanafi", "shafii", "hanbali"] },
  ),
  row(
    "fasting.kaffarah",
    "fasting",
    {
      hanafi: same("eatingToo", "intercourse_or_eating"),
      shafii: same("intercourse", "intercourse"),
      maliki: same("eatingToo", "intercourse_or_eating"),
      hanbali: same("intercourse", "intercourse"),
    },
    ["/ramadan", "/fidyah#kaffarah"],
    { refs: [h("bukhari", 1936)] },
  ),
  row(
    "fasting.afterMidShaban",
    "fasting",
    {
      hanafi: same("noRule", "no_specific_rule"),
      shafii: {
        key: "shafii",
        value: "restricted",
        refs: [h("abudawud", 2337, "disputed"), h("tirmidhi", 738, "disputed")],
      },
      maliki: same("noRule", "no_specific_rule"),
      hanbali: same("noRule", "no_specific_rule"),
    },
    ["/fasting"],
    { refs: [h("bukhari", 1914)], majority: ["hanafi", "maliki", "hanbali"] },
  ),
  row(
    "fidyah.measure",
    "fasting",
    {
      hanafi: { key: "hanafi", value: "half_sa_wheat" },
      shafii: { key: "shafii", value: "mudd" },
      maliki: { key: "maliki", value: "mudd" },
      hanbali: { key: "hanbali", value: "mudd" },
    },
    ["/fidyah", "/fidyah#fidyah"],
    { refs: [q(2, 184)] },
  ),
  row(
    "fitr.measure",
    "fasting",
    {
      hanafi: { key: "hanafi", value: "half_sa_wheat", refs: [m(2287, "985.05")] },
      shafii: same("majority", "sa", [h("bukhari", 1503)]),
      maliki: same("majority", "sa", [h("bukhari", 1503)]),
      hanbali: same("majority", "sa", [h("bukhari", 1503)]),
    },
    ["/ramadan", "/eid#zakat-fitr"],
    { majority: NOT_HANAFI },
  ),
  // ── Hajj / Umrah / udhiyah ─────────────────────────────────────────────────
  row(
    "tawaf.wudu",
    "hajj",
    {
      hanafi: { key: "hanafi", value: "wajib" },
      shafii: same("majority", "condition", [h("tirmidhi", 960)]),
      maliki: same("majority", "condition", [h("tirmidhi", 960)]),
      hanbali: same("majority", "condition", [h("tirmidhi", 960)]),
    },
    ["/hajj#rulings", "/hajj#umrah", "/umrah/checklist", "/umrah#tawaf"],
    { refs: [q(22, 29), h("bukhari", 1614), h("bukhari", 305)], majority: NOT_HANAFI },
  ),
  // How much a man must shorten (taqsir) to leave ihram — docs/proofs/madhhab.md §10.
  row(
    "umrah.taqsir",
    "hajj",
    {
      hanafi: { key: "hanafi", value: "quarter_of_head" },
      shafii: { key: "shafii", value: "three_hairs" },
      maliki: same("wholeHead", "whole_head"),
      hanbali: same("wholeHead", "whole_head", b("mughni")),
    },
    ["/umrah#halq_taqsir", "/hajj#umrah"],
    { refs: [q(48, 27), h("bukhari", 1727)] },
  ),
  row(
    "udhiyah.status",
    "udhiyah",
    {
      hanafi: {
        key: "hanafi",
        value: "wajib_for_capable",
        refs: [h("ibnmajah", 3123, "disputed")],
      },
      shafii: { key: "shafii", value: "sunnah_muakkadah" },
      maliki: same("sunnah12", "sunnah_muakkadah"),
      hanbali: same("sunnah12", "sunnah_muakkadah"),
    },
    ["/eid#udhiyah", "/dhul-hijjah"],
    { refs: [q(108, 2), q(22, 28)], majority: NOT_HANAFI },
  ),
  row(
    "udhiyah.hairNails",
    "udhiyah",
    {
      hanafi: { key: "hanafi", value: "mustahabb_to_refrain" },
      shafii: same("makruh", "makruh"),
      maliki: same("makruh", "makruh"),
      hanbali: { key: "hanbali", value: "haram" },
    },
    ["/dhul-hijjah", "/eid#udhiyah"],
    { refs: [m(5119, "1977.03")] },
  ),
  // ── Inheritance (NF-3.10) ─────────────────────────────────────────────────
  row(
    "mirath.grandfatherSiblings",
    "inheritance",
    {
      hanafi: { key: "hanafi", value: "grandfather_excludes" },
      shafii: same("majority", "muqasamah"),
      maliki: same("majority", "muqasamah"),
      hanbali: same("majority", "muqasamah"),
    },
    ["/mirath"],
    { refs: [q(4, 11), q(4, 176), ...b("sirajiyyah", "rahbiyyah")], majority: NOT_HANAFI },
  ),
  row(
    "mirath.mushtarakah",
    "inheritance",
    {
      hanafi: same("excluded", "full_siblings_excluded"),
      shafii: same("share", "full_siblings_share"),
      maliki: same("share", "full_siblings_share"),
      hanbali: same("excluded", "full_siblings_excluded"),
    },
    ["/mirath"],
    { refs: [q(4, 12), ...b("sirajiyyah", "rahbiyyah")] },
  ),
  row(
    "mirath.paternalGrandmother",
    "inheritance",
    {
      hanafi: same("excluded", "excluded"),
      shafii: same("excluded", "excluded"),
      maliki: same("excluded", "excluded"),
      hanbali: { key: "hanbali", value: "inherits", refs: b("mughni") },
    },
    ["/mirath"],
    { majority: ["hanafi", "shafii", "maliki"] },
  ),
  row(
    "mirath.radd",
    "inheritance",
    {
      hanafi: same("heirs", "to_heirs"),
      shafii: same("treasury", "to_treasury"),
      maliki: same("treasury", "to_treasury"),
      hanbali: same("heirs", "to_heirs"),
    },
    ["/mirath"],
    { refs: b("sirajiyyah", "rahbiyyah") },
  ),
  row(
    "mirath.malikiyyah",
    "inheritance",
    {
      hanafi: { key: "hanafi", value: "not_applied" },
      shafii: same("zayd", "not_applied"),
      maliki: { key: "maliki", value: "applies" },
      hanbali: same("zayd", "not_applied"),
    },
    ["/mirath"],
    { refs: [q(4, 12), ...b("khalil", "sharhKabir", "rahbiyyah", "mughni")] },
  ),
  // ── Wasiyyah (NF-3.9) — proof log docs/proofs/wasiyyah.md ──────────────────
  row(
    "wasiyyah.debtsToAllah",
    "inheritance",
    {
      hanafi: same("third", "from_third_if_bequeathed"),
      shafii: same("capital", "from_estate_first"),
      maliki: same("third", "from_third_if_bequeathed"),
      hanbali: same("capital", "from_estate_first"),
    },
    ["/wasiyyah/edit#debts"],
    { refs: [q(4, 11), q(4, 12), ...b("mughni", "bidayah")] },
  ),
  row(
    "wasiyyah.noHeirs",
    "inheritance",
    {
      hanafi: same("whole", "whole_estate_allowed"),
      shafii: same("third", "third_only"),
      maliki: same("third", "third_only"),
      hanbali: same("whole", "whole_estate_allowed", b("mughni")),
    },
    ["/wasiyyah/edit#bequests"],
    { refs: [h("bukhari", 2742), ...b("bidayah")] },
  ),
];

const BY_ID: ReadonlyMap<FiqhDifferenceId, FiqhDifference> = new Map(
  FIQH_DIFFERENCES.map((d) => [d.id, d]),
);

export function isFiqhDifferenceId(value: unknown): value is FiqhDifferenceId {
  return typeof value === "string" && BY_ID.has(value as FiqhDifferenceId);
}

export function getFiqhDifference(id: FiqhDifferenceId): FiqhDifference {
  const diff = BY_ID.get(id);
  if (!diff) throw new Error(`Unknown fiqh difference: ${id}`);
  return diff;
}

/** The other three schools, in catalog order — for the "Other views (3)" disclosure. */
export function otherSchools(school: MadhhabId): MadhhabId[] {
  return (["hanafi", "shafii", "maliki", "hanbali"] as const).filter((s) => s !== school);
}

/** Every translation key the catalog references (titles + position summaries), deduped. */
export function fiqhDifferenceKeys(): string[] {
  const keys = new Set<string>();
  for (const d of FIQH_DIFFERENCES) {
    keys.add(d.titleKey);
    for (const p of Object.values(d.positions)) keys.add(p.summaryKey);
  }
  return [...keys];
}

/** Differences that apply to a domain (e.g. to list under Settings › "Where this applies"). */
export function differencesForDomain(domain: FiqhDomain): FiqhDifference[] {
  return FIQH_DIFFERENCES.filter((d) => d.domain === domain);
}
