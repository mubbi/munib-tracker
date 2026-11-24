import { describe, expect, it } from "vitest";

import { FIQH_DIFFERENCES } from "../fiqh/differences";
import { UMRAH_STEPS } from "../types/umrah";
import { DUA_ITEMS } from "./duas";
import { HAJJ_GUIDE_TOPICS } from "./hajj-guide";
import { MIQAT_IDS, UMRAH_DUA_IDS, UMRAH_EVIDENCE, UMRAH_STEP_CONTENT } from "./umrah-mode";

const duaById = new Map(DUA_ITEMS.map((dua) => [dua.id, dua]));

describe.concurrent("Umrah mode content", () => {
  it("has content for every step, keyed by its own step", () => {
    for (const step of UMRAH_STEPS) expect(UMRAH_STEP_CONTENT[step].step).toBe(step);
  });

  it("references duas that exist in the bundled dataset (rendered by reference, never typed)", () => {
    for (const id of Object.values(UMRAH_DUA_IDS)) expect(duaById.has(id)).toBe(true);
    for (const step of UMRAH_STEPS) {
      for (const id of UMRAH_STEP_CONTENT[step].duaIds) expect(duaById.has(id)).toBe(true);
    }
  });

  it("points the corner dua at the Hisnul Muslim entry citing Abu Dawud 1892 and Qur'an 2:201", () => {
    const corner = duaById.get(UMRAH_DUA_IDS.yemeniCorner);
    expect(corner?.categoryId).toBe("hajj");
    expect(corner?.reference).toContain("1892");
    expect(corner?.reference).toContain("201");
    expect(UMRAH_EVIDENCE.tawaf).toContainEqual(
      expect.objectContaining({ collection: "abudawud", number: 1892 }),
    );
  });

  it("uses the talbiyah entry with recorded audio", () => {
    const talbiyah = duaById.get(UMRAH_DUA_IDS.talbiyah);
    expect(talbiyah?.reference).toContain("1549");
    expect(talbiyah?.audioUri).toMatch(/^https:\/\//);
  });

  it("links every step's guide topic to an existing Hajj & Umrah guide topic", () => {
    const topicIds = new Set(HAJJ_GUIDE_TOPICS.map((topic) => topic.id));
    for (const step of UMRAH_STEPS) {
      const id = UMRAH_STEP_CONTENT[step].guideTopicId;
      if (id) expect(topicIds.has(id)).toBe(true);
    }
  });

  it("pairs Muslim refs with their Abd al-Baqi numbers (corpus numbering differs)", () => {
    const muslim = Object.values(UMRAH_EVIDENCE)
      .flat()
      .filter((ref) => ref.kind === "hadith" && ref.collection === "muslim");
    expect(muslim.length).toBeGreaterThan(0);
    for (const ref of muslim) expect(ref).toHaveProperty("arabicNumber");
  });

  it("shows the tawaf wudu difference, which lists the Umrah mode anchor", () => {
    expect(UMRAH_STEP_CONTENT.tawaf.differenceIds).toEqual(["tawaf.wudu"]);
    const diff = FIQH_DIFFERENCES.find((d) => d.id === "tawaf.wudu");
    expect(diff?.usedIn).toContain("/umrah#tawaf");
  });

  it("lists the five miqats of Bukhari 1524 / Abu Dawud 1739", () => {
    expect(MIQAT_IDS).toHaveLength(5);
  });
});
