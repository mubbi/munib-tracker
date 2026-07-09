import {
  buildActiveDebtGoals,
  buildClearedDebtMilestones,
  evaluateProgression,
  PROGRESSION_TRACKS,
} from "@munib-tracker/shared/achievements";
import en from "./en.json";

/**
 * Guards the Phase-0 fix for the achievements module: `packages/shared/achievements`
 * must never bake a display string into a `MilestoneProgress` — every title/description
 * is an i18n key (resolved via `apps/app/src/lib/achievements-i18n.ts`), so a track or
 * milestone can never silently ship English regardless of the active locale.
 */
function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

const PLURAL_SUFFIXES = ["", "_zero", "_one", "_two", "_few", "_many", "_other"];
function keyResolvesToString(key: string): boolean {
  return PLURAL_SUFFIXES.some((suffix) => typeof get(en, key + suffix) === "string");
}

describe("achievements i18n keys", () => {
  it("every progression-track milestone resolves to a real en.json string", () => {
    const stats = {
      streak: 400,
      prayersCompleted: 4000,
      zikrCompleted: 1200,
      perfectDays: 400,
      qazaDebt: null,
      rozaDebt: null,
    };
    const state = evaluateProgression(stats);
    const missing = [...state.activeGoals, ...state.unlockedMilestones]
      .flatMap((m) => [m.titleKey, m.descriptionKey])
      .filter((key) => !keyResolvesToString(key));
    expect(missing).toEqual([]);
  });

  it("every track's titleFallback and full titles range resolve to en.json strings", () => {
    const missing: string[] = [];
    for (const track of PROGRESSION_TRACKS) {
      if (!keyResolvesToString(`achievements.milestones.${track.id}.titleFallback`)) {
        missing.push(`achievements.milestones.${track.id}.titleFallback`);
      }
      for (let i = 0; i < track.titlesCount; i++) {
        const key = `achievements.milestones.${track.id}.titles.${i}`;
        if (!keyResolvesToString(key)) missing.push(key);
      }
    }
    expect(missing).toEqual([]);
  });

  it("every debt milestone (active + cleared, qaza + roza) resolves to en.json strings", () => {
    const debt = { total: 10, completed: 5, remaining: 5 };
    const clearedDebt = { total: 10, completed: 10, remaining: 0 };
    const milestones = [
      ...buildActiveDebtGoals({ qaza: debt, roza: debt }),
      ...buildClearedDebtMilestones({ qaza: clearedDebt, roza: clearedDebt }),
    ];
    const missing = milestones
      .flatMap((m) => [m.titleKey, m.descriptionKey])
      .filter((key) => !keyResolvesToString(key));
    expect(missing).toEqual([]);
  });

  it("devotion rank titles, fallback, and starting states resolve to en.json strings", () => {
    const keys = [
      "achievements.devotionRank.titleFallback",
      "achievements.devotionRank.startingOut",
      "achievements.devotionRank.beginJourney",
      "achievements.devotionRank.description",
      ...Array.from({ length: 10 }, (_, i) => `achievements.devotionRank.titles.${i}`),
    ];
    const missing = keys.filter((key) => !keyResolvesToString(key));
    expect(missing).toEqual([]);
  });
});
