import { SUNNAH_HABITS } from "@munib-tracker/shared/content/sunnah-habits";
import { SUNNAH_HABITS_MAX_SELECTED } from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";

import { sessionItems } from "@/lib/adhkar-session";
import {
  addCustomHabit,
  addHabit,
  bedtimeHabitIds,
  consistencyDots,
  dayProgressSummary,
  habitCheckKey,
  habitProgress,
  mergeSunnahHabits,
  mostConsistentHabit,
  moveHabit,
  pickSpotlight,
  pruneOldChecks,
  removeHabit,
  resolveHabit,
  SPOTLIGHT_COOLDOWN_DAYS,
  sanitizeSunnahHabits,
  setHabitTarget,
  setHabitValue,
  toggleHabit,
} from "@/lib/sunnah-habits";
import { defined } from "@/test-support/assert";
import { buildHabitContext, buildSunnahHabitsState } from "@/test-support/fixtures/seasonal";

const DAY = "2026-11-23";
const habit = (state = buildSunnahHabitsState(), id = "miswak") =>
  defined(resolveHabit(state, id), id);

describe("sunnah habits — list editing", () => {
  it("adds catalog habits once and caps the list at 12", () => {
    let state = buildSunnahHabitsState();
    for (const def of SUNNAH_HABITS) state = addHabit(state, def.id);
    expect(state.selected).toHaveLength(SUNNAH_HABITS_MAX_SELECTED);
    expect(addHabit(state, "miswak")).toBe(state);
    expect(state.listUpdatedAt).toBeDefined();
  });

  it("ignores unknown ids", () => {
    const state = buildSunnahHabitsState();
    expect(addHabit(state, "nope")).toBe(state);
  });

  it("adds, reorders and removes a custom habit (removing drops its definition)", () => {
    let state = addHabit(buildSunnahHabitsState(), "miswak");
    state = addCustomHabit(state, { id: "x1", title: "  Call my mother  ", target: 3 });
    expect(state.custom).toEqual([{ id: "custom:x1", title: "Call my mother", target: 3 }]);
    state = moveHabit(state, "custom:x1", -1);
    expect(state.selected).toEqual(["custom:x1", "miswak"]);
    expect(resolveHabit(state, "custom:x1")).toMatchObject({ target: 3, isCount: true });
    state = removeHabit(state, "custom:x1");
    expect(state.custom).toEqual([]);
    expect(state.selected).toEqual(["miswak"]);
  });

  it("rejects an empty custom title", () => {
    const state = buildSunnahHabitsState();
    expect(addCustomHabit(state, { id: "x", title: "   " })).toBe(state);
  });

  it("lets the user tune the salawat target only", () => {
    let state = setHabitTarget(buildSunnahHabitsState(), "salawat", 33);
    expect(habit(state, "salawat").target).toBe(33);
    state = setHabitTarget(state, "miswak", 5);
    expect(habit(state, "miswak").target).toBe(1);
  });
});

describe("sunnah habits — daily progress", () => {
  it("toggles a yes/no habit", () => {
    let state = toggleHabit(buildSunnahHabitsState(), "miswak", DAY);
    expect(state.checks[habitCheckKey("miswak", DAY)]).toBe(1);
    expect(habitProgress(state, habit(state), DAY, buildHabitContext()).done).toBe(true);
    state = toggleHabit(state, "miswak", DAY);
    expect(state.checks).toEqual({});
  });

  it("derives salawat from the tasbeeh count against the user's own target", () => {
    const state = setHabitTarget(buildSunnahHabitsState(), "salawat", 100);
    const ctx = buildHabitContext({ zikrCountsFor: () => ({ "after_azan-salawat": 27 }) });
    expect(habitProgress(state, habit(state, "salawat"), DAY, ctx)).toMatchObject({
      value: 27,
      target: 100,
      done: false,
      derivedFrom: "zikr:after_azan-salawat",
    });
    const full = buildHabitContext({ zikrCountsFor: () => ({ "after_azan-salawat": 100 }) });
    expect(habitProgress(state, habit(state, "salawat"), DAY, full).done).toBe(true);
  });

  it("lets salawat be ticked by hand (said away from the tasbeeh) and unticked", () => {
    let state = setHabitTarget(buildSunnahHabitsState(), "salawat", 33);
    state = toggleHabit(state, "salawat", DAY);
    expect(state.checks[habitCheckKey("salawat", DAY)]).toBe(33);
    const progress = habitProgress(state, habit(state, "salawat"), DAY, buildHabitContext());
    expect(progress).toMatchObject({ value: 0, target: 33, done: true, ticked: true });
    state = toggleHabit(state, "salawat", DAY);
    expect(state.checks).toEqual({});
    expect(habitProgress(state, habit(state, "salawat"), DAY, buildHabitContext()).done).toBe(
      false,
    );
  });

  it("keeps old salawat stepper days: done when the stored count reached the target", () => {
    const past = "2026-11-20";
    const state = buildSunnahHabitsState({
      checks: { [habitCheckKey("salawat", past)]: 12, [habitCheckKey("salawat", DAY)]: 7 },
    });
    const ctx = buildHabitContext();
    expect(habitProgress(state, habit(state, "salawat"), past, ctx).done).toBe(true);
    expect(habitProgress(state, habit(state, "salawat"), DAY, ctx).done).toBe(false);
  });

  it("derives istighfar from the tasbeeh count and never stores it", () => {
    const state = setHabitValue(buildSunnahHabitsState(), "istighfar_100", DAY, 100);
    expect(state.checks).toEqual({});
    const ctx = buildHabitContext({ zikrCountsFor: () => ({ "anytime-istighfar": 100 }) });
    expect(habitProgress(state, habit(state, "istighfar_100"), DAY, ctx)).toMatchObject({
      value: 100,
      done: true,
      derivedFrom: "zikr:anytime-istighfar",
    });
  });

  it("auto-checks daily sadaqah from the sadaqah log and still allows a manual tick", () => {
    const state = buildSunnahHabitsState();
    const fromLog = habitProgress(
      state,
      habit(state, "daily_sadaqah"),
      DAY,
      buildHabitContext({ sadaqahDates: new Set([DAY]) }),
    );
    expect(fromLog).toMatchObject({ done: true, derivedFrom: "sadaqah" });
    const manual = toggleHabit(state, "daily_sadaqah", DAY);
    const progress = habitProgress(
      manual,
      habit(manual, "daily_sadaqah"),
      DAY,
      buildHabitContext(),
    );
    expect(progress.done).toBe(true);
    expect(progress.derivedFrom).toBeUndefined();
  });

  it("auto-checks morning adhkar only when the whole set is done", () => {
    const counts = Object.fromEntries(
      sessionItems({ categoryId: "morning" }).map((item) => [item.id, item.targetCount ?? 1]),
    );
    const state = buildSunnahHabitsState();
    const ctx = buildHabitContext({ zikrCountsFor: () => counts });
    expect(habitProgress(state, habit(state, "morning_adhkar"), DAY, ctx)).toMatchObject({
      done: true,
      derivedFrom: "adhkar:morning",
    });
    expect(habitProgress(state, habit(state, "evening_adhkar"), DAY, ctx).done).toBe(false);
  });
});

describe("sunnah habits — consistency (dots, no streak language)", () => {
  it("returns 30 dots oldest → newest and highlights the most consistent habit", () => {
    let state = buildSunnahHabitsState({ selected: ["miswak", "smile"] });
    state = toggleHabit(state, "miswak", DAY);
    state = toggleHabit(state, "miswak", addDays(DAY, -2));
    state = toggleHabit(state, "smile", DAY);
    const dots = consistencyDots(state, habit(state), DAY, buildHabitContext());
    expect(dots).toHaveLength(30);
    expect(dots.at(-1)).toBe(true);
    expect(dots.at(-2)).toBe(false);
    expect(dots.at(-3)).toBe(true);
    expect(mostConsistentHabit(state, DAY, buildHabitContext())).toEqual({ id: "miswak", days: 2 });
    expect(dayProgressSummary(state, DAY, buildHabitContext())).toEqual({ done: 2, total: 2 });
  });

  it("does not highlight a habit kept only once", () => {
    const state = toggleHabit(buildSunnahHabitsState({ selected: ["miswak"] }), "miswak", DAY);
    expect(mostConsistentHabit(state, DAY, buildHabitContext())).toBeNull();
  });
});

describe("sunnah habits — spotlight", () => {
  it("picks an unselected habit and keeps it for the day", () => {
    const state = buildSunnahHabitsState({ selected: ["miswak"] });
    const id = defined(pickSpotlight(state, DAY), "spotlight");
    expect(id).not.toBe("miswak");
    expect(pickSpotlight({ ...state, spotlightSeen: { [id]: DAY } }, DAY)).toBe(id);
  });

  it("skips habits shown in the last 14 days", () => {
    const recent = Object.fromEntries(
      SUNNAH_HABITS.filter((h) => h.id !== "smile").map((h) => [h.id, addDays(DAY, -3)]),
    );
    expect(pickSpotlight(buildSunnahHabitsState({ spotlightSeen: recent }), DAY)).toBe("smile");
    const allOld = Object.fromEntries(
      SUNNAH_HABITS.map((h) => [h.id, addDays(DAY, -SPOTLIGHT_COOLDOWN_DAYS)]),
    );
    expect(pickSpotlight(buildSunnahHabitsState({ spotlightSeen: allOld }), DAY)).not.toBeNull();
  });

  it("returns null once every catalog habit is selected", () => {
    const state = buildSunnahHabitsState({ selected: SUNNAH_HABITS.map((h) => h.id) });
    expect(pickSpotlight(state, DAY)).toBeNull();
  });
});

describe("sunnah habits — sanitise, merge, prune", () => {
  it("drops malformed input", () => {
    const state = sanitizeSunnahHabits({
      selected: ["miswak", "miswak", "bogus", 3, "custom:a"],
      custom: [
        { id: "custom:a", title: "Read" },
        { id: "x", title: "bad" },
      ],
      checks: { "miswak::2026-11-23": 1, "miswak::nope": 1, "smile::2026-11-23": -1 },
      spotlightSeen: { smile: "yesterday" },
    });
    expect(state.selected).toEqual(["miswak", "custom:a"]);
    expect(state.custom).toEqual([{ id: "custom:a", title: "Read" }]);
    expect(state.checks).toEqual({ "miswak::2026-11-23": 1 });
    expect(state.spotlightSeen).toEqual({});
    expect(sanitizeSunnahHabits(null).selected).toEqual([]);
  });

  it("merges checks by max, spotlight by latest, and the list by listUpdatedAt", () => {
    const local = buildSunnahHabitsState({
      selected: ["miswak"],
      listUpdatedAt: "2026-11-23T10:00:00.000Z",
      checks: { "salawat::2026-11-23": 4 },
      spotlightSeen: { smile: "2026-11-20" },
    });
    const remote = buildSunnahHabitsState({
      selected: ["smile", "salawat"],
      listUpdatedAt: "2026-11-23T11:00:00.000Z",
      checks: { "salawat::2026-11-23": 9, "miswak::2026-11-22": 1 },
      spotlightSeen: { smile: "2026-11-10" },
    });
    const merged = mergeSunnahHabits(local, remote);
    expect(merged.selected).toEqual(["smile", "salawat"]);
    expect(merged.checks).toEqual({ "salawat::2026-11-23": 9, "miswak::2026-11-22": 1 });
    expect(merged.spotlightSeen).toEqual({ smile: "2026-11-20" });
    expect(mergeSunnahHabits(remote, local).selected).toEqual(["smile", "salawat"]);
  });

  it("prunes checks older than the window", () => {
    const state = buildSunnahHabitsState({
      checks: { "miswak::2026-01-01": 1, [habitCheckKey("miswak", DAY)]: 1 },
    });
    expect(pruneOldChecks(state, DAY).checks).toEqual({ [habitCheckKey("miswak", DAY)]: 1 });
  });

  describe("tick → untick across two devices", () => {
    const T1 = new Date("2026-11-23T05:00:00.000Z");
    const T2 = new Date("2026-11-23T06:00:00.000Z");
    const T3 = new Date("2026-11-23T07:00:00.000Z");
    const KEY = habitCheckKey("miswak", DAY);

    it("keeps the newest write per key in both merge directions", () => {
      const a = toggleHabit(buildSunnahHabitsState({ selected: ["miswak"] }), "miswak", DAY, T1);
      const b = toggleHabit(mergeSunnahHabits(buildSunnahHabitsState(), a), "miswak", DAY, T2);
      expect(b.checks).toEqual({});
      expect(mergeSunnahHabits(a, b).checks).toEqual({});
      expect(mergeSunnahHabits(b, a).checks).toEqual({});
      const a2 = toggleHabit(mergeSunnahHabits(a, b), "miswak", DAY, T3);
      expect(mergeSunnahHabits(b, a2).checks).toEqual({ [KEY]: 1 });
    });

    it("keeps a lowered count instead of the max", () => {
      const high = setHabitValue(buildSunnahHabitsState(), "salawat", DAY, 50, T1);
      const low = setHabitValue(high, "salawat", DAY, 10, T2);
      expect(mergeSunnahHabits(high, low).checks).toEqual({ [habitCheckKey("salawat", DAY)]: 10 });
      expect(mergeSunnahHabits(low, high).checks).toEqual({ [habitCheckKey("salawat", DAY)]: 10 });
    });

    it("migrates legacy unstamped checks (max on tie; any stamped write wins)", () => {
      const legacy = buildSunnahHabitsState({ checks: { [KEY]: 1 } });
      expect(sanitizeSunnahHabits(legacy).checkStamps).toBeUndefined();
      const unticked = toggleHabit(legacy, "miswak", DAY, T1);
      expect(mergeSunnahHabits(legacy, unticked).checks).toEqual({});
      expect(mergeSunnahHabits(unticked, legacy).checks).toEqual({});
    });

    it("prunes old checks and tombstones and keeps them pruned after a merge", () => {
      const old = addDays(DAY, -200);
      let state = setHabitValue(buildSunnahHabitsState(), "miswak", old, 1, T1);
      state = toggleHabit(state, "smile", old, T1);
      state = toggleHabit(state, "smile", old, T2); // tombstone
      const other = state;
      const pruned = pruneOldChecks(state, DAY);
      expect(pruned.checks).toEqual({});
      expect(pruned.checkStamps).toEqual({});
      expect(pruned.prunedBefore).toBe(addDays(DAY, -120));
      const merged = mergeSunnahHabits(other, pruned);
      expect(merged.checks).toEqual({});
      expect(merged.checkStamps ?? {}).toEqual({});
      expect(merged.prunedBefore).toBe(addDays(DAY, -120));
    });
  });

  it("lists the bedtime habits folded into the before-sleep reminder", () => {
    const state = buildSunnahHabitsState({
      selected: ["miswak", "ayat_kursi_sleep", "mulk_nightly"],
    });
    expect(bedtimeHabitIds(state)).toEqual(["ayat_kursi_sleep", "mulk_nightly"]);
  });
});
