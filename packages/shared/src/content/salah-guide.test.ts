import { describe, expect, it } from "vitest";

import { QAZA_PRAYERS } from "../constants";
import { PRAYER_RAKATS, SALAH_GUIDE_CONTENT_VERSION, SALAH_GUIDE_TOPICS } from "./salah-guide";

describe("salah guide content", () => {
  it("has a positive content version", () => {
    expect(SALAH_GUIDE_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("ships the v1 topics with ordered, non-empty steps", () => {
    const ids = SALAH_GUIDE_TOPICS.map((t) => t.id);
    expect(ids).toEqual(expect.arrayContaining(["overview", "wudu", "how-to-pray"]));
    for (const topic of SALAH_GUIDE_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.steps.length).toBeGreaterThan(0);
      for (const step of topic.steps) {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.body.length).toBeGreaterThan(0);
      }
    }
  });

  it("has a rakats row for every tracked qaza prayer", () => {
    const covered = new Set(PRAYER_RAKATS.map((r) => r.prayerId));
    for (const prayer of QAZA_PRAYERS) expect(covered.has(prayer)).toBe(true);
  });
});
