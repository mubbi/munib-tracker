import { describe, expect, it } from "vitest";

import { QAZA_PRAYERS } from "../constants";
import {
  PRAYER_RAKATS,
  SALAH_GUIDE_CONTENT_VERSION,
  SALAH_GUIDE_JOURNEY_ORDER,
  SALAH_GUIDE_PHRASES,
  SALAH_GUIDE_QUIZ,
  SALAH_GUIDE_TOPICS,
} from "./salah-guide";

describe("salah guide content", () => {
  it("has a positive content version", () => {
    expect(SALAH_GUIDE_CONTENT_VERSION).toBeGreaterThan(1);
  });

  it("ships topics across every journey phase with evidence or steps", () => {
    for (const phase of SALAH_GUIDE_JOURNEY_ORDER) {
      const inPhase = SALAH_GUIDE_TOPICS.filter((t) => t.journey === phase);
      expect(inPhase.length).toBeGreaterThan(0);
    }

    const ids = SALAH_GUIDE_TOPICS.map((t) => t.id);
    expect(ids).toEqual(expect.arrayContaining(["wudu", "how-to-pray", "introduction", "khushu"]));

    for (const topic of SALAH_GUIDE_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.body.length).toBeGreaterThan(0);
      const hasContent =
        (topic.steps?.length ?? 0) > 0 ||
        (topic.quran?.length ?? 0) > 0 ||
        (topic.hadith?.length ?? 0) > 0 ||
        (topic.actions?.length ?? 0) > 0;
      expect(hasContent).toBe(true);
      if (topic.appLinks?.length) {
        for (const link of topic.appLinks) {
          expect(link.route.startsWith("/")).toBe(true);
        }
      }
    }
  });

  it("ships phrases with arabic, translation, and meaning", () => {
    expect(SALAH_GUIDE_PHRASES.length).toBeGreaterThan(5);
    for (const phrase of SALAH_GUIDE_PHRASES) {
      expect(phrase.arabic.length).toBeGreaterThan(0);
      expect(phrase.translation.length).toBeGreaterThan(0);
      expect(phrase.meaning.length).toBeGreaterThan(0);
    }
  });

  it("has a rakats row for every tracked qaza prayer", () => {
    const covered = new Set(PRAYER_RAKATS.map((r) => r.prayerId));
    for (const prayer of QAZA_PRAYERS) expect(covered.has(prayer)).toBe(true);
  });

  it("ships an authored quiz with scored multiple-choice questions", () => {
    expect(SALAH_GUIDE_QUIZ.length).toBeGreaterThan(10);
    for (const question of SALAH_GUIDE_QUIZ) {
      expect(question.prompt.length).toBeGreaterThan(0);
      expect(question.explanation.length).toBeGreaterThan(0);
      if (question.type === "reflection") continue;
      expect(question.options?.length).toBeGreaterThanOrEqual(2);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    }
  });
});
