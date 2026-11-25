import { DUA_ITEMS } from "@munib-tracker/shared/content/duas";
import { PROPHETS_BIO_TOPICS } from "@munib-tracker/shared/content/prophets-bios";
import { SALAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/salah-guide";
import { ZIKR_ITEMS } from "@munib-tracker/shared/content/zikr";

import {
  isKidsAllowedPath,
  KIDS_ADHKAR_IDS,
  KIDS_DUA_IDS,
  KIDS_LEARN_ROUTES,
  KIDS_PROPHET_IDS,
  KIDS_PROPHETS_EXCLUDED,
  KIDS_SALAH_TOPIC_IDS,
  KIDS_SESSION_CATEGORIES,
  KIDS_SURAHS,
  kidsProphetView,
  kidsRedirectFor,
  kidsSalahTopicView,
  kidsSessionItems,
  pickKidsDuaList,
} from "./kids-content";

/** Adult purity / sexual themes that must never reach a kids screen (A2). */
const ADULT_TERMS =
  /hayd|haid|menstru|nifas|postnatal|janab|ghusl|sexual|intercourse|seduc|madhy|wet dream|discharge|immoral|indecen/i;

/** D27: every curated item exists in the bundled corpus and has existing audio. */
describe("kids content selection (D27)", () => {
  const duas = new Map(DUA_ITEMS.map((d) => [d.id, d]));
  const adhkar = new Map(ZIKR_ITEMS.map((z) => [z.id, z]));

  it.each(KIDS_DUA_IDS)("dua %s is bundled with audio and a reference", (id) => {
    const item = duas.get(id);
    expect(item).toBeDefined();
    expect(item?.audioUri).toMatch(/^https:\/\//);
    expect(item?.reference?.trim()).toBeTruthy();
  });

  it.each(KIDS_ADHKAR_IDS)("zikr %s is bundled with audio and a reference", (id) => {
    const item = adhkar.get(id);
    expect(item).toBeDefined();
    expect(item?.audioUri).toMatch(/^https:\/\//);
    expect(item?.reference?.trim()).toBeTruthy();
  });

  it("lists short surahs only, without duplicates", () => {
    expect(new Set(KIDS_SURAHS).size).toBe(KIDS_SURAHS.length);
    for (const n of KIDS_SURAHS) expect(n === 1 || n >= 97).toBe(true);
  });
});

describe("kids salah path (E12, D27)", () => {
  const topics = new Map(SALAH_GUIDE_TOPICS.map((t) => [t.id, t]));

  it.each(KIDS_SALAH_TOPIC_IDS)("topic %s is bundled with steps", (id) => {
    const view = kidsSalahTopicView(topics.get(id) as never);
    expect(view?.steps.length).toBeGreaterThan(0);
  });

  it("renders no hayd / nifas / janabah / ghusl content", () => {
    for (const id of KIDS_SALAH_TOPIC_IDS) {
      const view = kidsSalahTopicView(topics.get(id) as never);
      expect(JSON.stringify(view)).not.toMatch(ADULT_TERMS);
    }
  });

  it("never offers the adult purity topics", () => {
    for (const id of ["taharah", "tayammum", "who-must-pray", "conditions", "qada"]) {
      expect(kidsSalahTopicView(topics.get(id) as never)).toBeNull();
    }
  });
});

describe("kids prophets (E12, D27)", () => {
  const bios = new Map(PROPHETS_BIO_TOPICS.map((t) => [t.id, t]));

  it("accounts for every bundled bio exactly once (included or excluded)", () => {
    const all = [...KIDS_PROPHET_IDS, ...KIDS_PROPHETS_EXCLUDED];
    expect(new Set(all).size).toBe(all.length);
    expect([...all].sort()).toEqual([...bios.keys()].sort());
  });

  it.each(KIDS_PROPHET_IDS)("bio %s has no adult themes in what kids see", (id) => {
    const view = kidsProphetView(bios.get(id) as never);
    expect(view?.body.length).toBeGreaterThan(0);
    expect(JSON.stringify(view)).not.toMatch(ADULT_TERMS);
  });

  it.each(KIDS_PROPHETS_EXCLUDED)("excluded bio %s is not rendered", (id) => {
    expect(kidsProphetView(bios.get(id) as never)).toBeNull();
  });
});

describe("isKidsAllowedPath", () => {
  it.each([
    "/kids",
    "/kids/link?token=mtl_x",
    KIDS_LEARN_ROUTES.salahGuide,
    `${KIDS_LEARN_ROUTES.salahGuide}?topic=wudu`,
    KIDS_LEARN_ROUTES.prophets,
    `${KIDS_LEARN_ROUTES.prophets}/adam`,
    KIDS_LEARN_ROUTES.letters,
    KIDS_LEARN_ROUTES.names,
    "/quran/112",
    "/dua/detail/hisn-1",
    "/zikr/detail/before_sleep-name",
    // Counting the curated adhkar (D69): session, counter, after-Salah sequence.
    "/zikr/session/before_sleep",
    "/zikr/session/anytime",
    "/tasbeeh/before_sleep-tasbih-fatimah",
    "/tasbeeh/anytime-istighfar",
    "/tasbeeh/sequence",
    "/tasbeeh/sequence?prayer=fajr",
  ])("allows %s", (path) => {
    expect(isKidsAllowedPath(path)).toBe(true);
  });

  it.each([
    "/",
    "/tracker",
    "/settings",
    "/family",
    "/quran/2",
    "/dua/detail/hisn-74",
    "/zikr/detail/morning-radeetu",
    "/hadith/bukhari",
    "/hayd",
    // A2: the adult guides carry hayd / nifas / janabah material.
    "/salah-guide",
    "/salah-guide/taharah",
    "/salah-guide/wudu",
    "/prophets",
    "/prophets/lut",
    // Not curated: other sessions, other counters, the free counter (adult picker).
    "/zikr/session/morning",
    "/tasbeeh/after_prayer-ayat-al-kursi",
    "/tasbeeh/free",
    "/tasbeeh/custom/abc",
    "/tasbeeh/dua/sunnah-laylat-qadr-afw",
    "/quran/practice/session",
  ])("blocks %s", (path) => {
    expect(isKidsAllowedPath(path)).toBe(false);
  });
});

describe("pickKidsDuaList", () => {
  it("lists every curated dua then adhkar, in curated order", () => {
    const list = pickKidsDuaList(DUA_ITEMS, ZIKR_ITEMS);
    expect(list.map((x) => `${x.kind}:${x.item.id}`)).toEqual([
      ...KIDS_DUA_IDS.map((id) => `dua:${id}`),
      ...KIDS_ADHKAR_IDS.map((id) => `zikr:${id}`),
    ]);
  });

  it("skips ids missing from the loaded data", () => {
    expect(pickKidsDuaList([], [])).toEqual([]);
  });
});

describe("kids guided sessions and redirects (D27, D68)", () => {
  it("opens sessions only for the categories of the curated adhkar", () => {
    const byId = new Map(ZIKR_ITEMS.map((z) => [z.id, z]));
    for (const id of KIDS_ADHKAR_IDS) {
      expect(KIDS_SESSION_CATEGORIES).toContain(byId.get(id)?.categoryId);
    }
    expect(KIDS_SESSION_CATEGORIES).not.toContain("morning");
  });

  it("keeps only the curated adhkar of a set", () => {
    const set = ZIKR_ITEMS.filter((z) => z.categoryId === "before_sleep");
    const kids = kidsSessionItems(set);
    expect(kids.length).toBeGreaterThan(0);
    expect(kids.length).toBeLessThan(set.length);
    expect(kids.every((z) => (KIDS_ADHKAR_IDS as readonly string[]).includes(z.id))).toBe(true);
  });

  it("sends the reader's Practise on a curated surah to kids recite-along", () => {
    expect(kidsRedirectFor("/quran/practice/session", { surah: "112" })).toBe(
      "/kids/recite?surah=112",
    );
    expect(kidsRedirectFor("/quran/practice/session", { surah: ["1"] })).toBe(
      "/kids/recite?surah=1",
    );
    // Not curated: the kids picker, never the adult surah.
    expect(kidsRedirectFor("/quran/practice/session", { surah: "2" })).toBe("/kids/recite");
    expect(kidsRedirectFor("/quran/practice")).toBe("/kids/recite");
    expect(kidsRedirectFor("/settings")).toBe("/kids");
  });
});
