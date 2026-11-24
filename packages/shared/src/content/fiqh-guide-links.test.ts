import { describe, expect, it } from "vitest";

import { FIQH_DIFFERENCES, getFiqhDifference, isFiqhDifferenceId } from "../fiqh/differences";
import {
  FIQH_GUIDE_SOURCES,
  guideTopicsForDifference,
  isGuideAnchor,
  resolveGuideAnchor,
  SCHOOL_NAME_PATTERN,
  schoolMentions,
  topicAnchors,
  unlistedTopicLinks,
} from "./fiqh-guide-links";
import { SALAH_GUIDE_QUIZ } from "./salah-guide-quiz";

const allTopics = FIQH_GUIDE_SOURCES.flatMap(({ basePath, topics }) =>
  topics.map((topic) => ({ basePath, topic })),
);

describe("fiqh guide links (NF-3.0a §4.1.2 coverage)", () => {
  it("links only catalog ids, without duplicates", () => {
    for (const { basePath, topic } of allTopics) {
      const ids = topic.differenceIds ?? [];
      expect(new Set(ids).size, `${basePath}/${topic.id}`).toBe(ids.length);
      for (const id of ids)
        expect(isFiqhDifferenceId(id), `${basePath}/${topic.id}: ${id}`).toBe(true);
    }
  });

  it("every guide paragraph naming a school has a structured difference attached", () => {
    const missing = allTopics
      .filter(({ topic }) => schoolMentions(topic).length > 0 && !topic.differenceIds?.length)
      .map(({ basePath, topic }) => `${basePath}/${topic.id}`);
    expect(missing).toEqual([]);
  });

  it("every attached difference lists the topic (or its section) in usedIn", () => {
    const unlisted = allTopics.flatMap(({ basePath, topic }) =>
      unlistedTopicLinks(basePath, topic).map(({ id }) => `${id} ← ${basePath}/${topic.id}`),
    );
    expect(unlisted).toEqual([]);
  });

  it("every guide usedIn anchor resolves to topics that render the note", () => {
    const broken: string[] = [];
    for (const diff of FIQH_DIFFERENCES) {
      for (const anchor of diff.usedIn) {
        if (!isGuideAnchor(anchor)) continue;
        const resolved = resolveGuideAnchor(anchor);
        if (!resolved?.topics.some((topic) => topic.differenceIds?.includes(diff.id))) {
          broken.push(`${diff.id} → ${anchor}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("covers the plan §4.1.4 guide rows", () => {
    const linked = (path: string) => resolveGuideAnchor(path)?.topics[0]?.differenceIds ?? [];
    expect(linked("/salah-guide/how-to-pray")).toEqual(
      expect.arrayContaining(["salah.raisingHands", "salah.fatihaBehindImam", "salah.fajrQunut"]),
    );
    expect(linked("/salah-guide/prayer-types")).toEqual(
      expect.arrayContaining(["witr.status", "witr.form"]),
    );
    expect(linked("/salah-guide/prayer-times")).toEqual(
      expect.arrayContaining(["fajr.preferred", "isha.preferred", "asr.preferred"]),
    );
    expect(linked("/taharah/wudu-obligatory")).toEqual(
      expect.arrayContaining(["wudu.intention", "wudu.tartib", "wudu.muwalat", "wudu.dalk"]),
    );
    expect(linked("/taharah/wudu-breakers")).toEqual(
      expect.arrayContaining(["wudu.touchOppositeSex", "wudu.touchPrivateParts"]),
    );
    expect(linked("/friday/jumuah-obligation")).toEqual([
      "jumuah.minCongregation",
      "jumuah.sunnah",
    ]);
    expect(linked("/eid/eid-prayer-how-to")).toEqual(["eid.status", "eid.extraTakbirs"]);
    expect(linked("/janazah/how-to-pray-janazah")).toEqual(["janazah.fatiha"]);
    expect(linked("/hajj/umrah-tawaf")).toEqual(["tawaf.wudu"]);
  });

  it("resolves topic and section anchors, and rejects screens", () => {
    expect(resolveGuideAnchor("/eid#prayer")?.topics.map((t) => t.id)).toEqual([
      "eid-prayer-how-to",
    ]);
    expect(resolveGuideAnchor("/salah-guide/jumuah")?.topics.map((t) => t.id)).toEqual(["jumuah"]);
    expect(resolveGuideAnchor("/eid#nope")).toBeNull();
    expect(resolveGuideAnchor("/travel#qasr")).toBeNull();
    expect(isGuideAnchor("/fidyah")).toBe(false);
    expect(isGuideAnchor("/fidyah#kaffarah")).toBe(true);
  });

  it("lists topic anchors with and without a section", () => {
    expect(topicAnchors("/eid", { id: "x", title: "X", section: "prayer", body: [] })).toEqual([
      "/eid/x",
      "/eid#prayer",
    ]);
    expect(topicAnchors("/salah-guide", { id: "x", title: "X", body: [] })).toEqual([
      "/salah-guide/x",
    ]);
  });

  it("finds the guide topics for a difference, with routes", () => {
    expect(guideTopicsForDifference("janazah.fatiha").map((l) => l.href)).toEqual([
      "/janazah/how-to-pray-janazah",
      "/janazah/takbir-steps",
    ]);
    expect(guideTopicsForDifference("mirath.radd")).toEqual([]);
  });

  it("detects school names but not the Fatihah transliteration", () => {
    expect(SCHOOL_NAME_PATTERN.test("Hanafis count it wajib")).toBe(true);
    expect(SCHOOL_NAME_PATTERN.test("the Shafi’i school")).toBe(true);
    expect(SCHOOL_NAME_PATTERN.test("Maliki yawmid-din")).toBe(false);
    expect(SCHOOL_NAME_PATTERN.test("The Malikis add rubbing")).toBe(true);
  });
});

describe("school-dependent quiz questions", () => {
  const tagged = SALAH_GUIDE_QUIZ.filter((q) => q.differenceId);

  it("tags only questions whose answer really depends on the school", () => {
    for (const question of tagged) {
      expect(question.answerSchools?.length, question.id).toBeGreaterThan(0);
      expect(isFiqhDifferenceId(question.differenceId)).toBe(true);
    }
  });

  it("words the rawatib-count questions per the hadith, so they need no school tag", () => {
    // Proof log madhhab.md "Quiz tagging": the answers (12; 4 before / 2 after Dhuhr) are what
    // Umm Habibah's hadith states, true whatever the user's school — the preset itself differs.
    for (const id of ["rawatib-total", "rawatib-dhuhr"]) {
      const question = SALAH_GUIDE_QUIZ.find((q) => q.id === id);
      expect(question?.prompt, id).toMatch(/Umm Habibah/);
      expect(question?.differenceId, id).toBeUndefined();
      expect(question?.prompt, id).not.toMatch(/agreed/i);
    }
    expect(getFiqhDifference("rawatib.preset").positions.hanafi.value).toBe(12);
  });
});
