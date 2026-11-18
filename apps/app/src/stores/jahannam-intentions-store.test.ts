import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import {
  JAHANNAM_INTENTION_IDS,
  jahannamIntentionsStore,
  useEnsureJahannamIntentionsLoaded,
  useJahannamIntention,
  useJahannamIntentionActions,
  useJahannamIntentionsCount,
  useJahannamIntentionsReady,
  useJahannamReflectionStreak,
} from "./jahannam-intentions-store";

/** Mirrors the store's day stepping (noon anchor → ISO date). */
function daysBefore(day: string, n: number): string {
  let current = day;
  for (let i = 0; i < n; i += 1) {
    const d = new Date(`${current}T12:00:00`);
    d.setDate(d.getDate() - 1);
    current = d.toISOString().slice(0, 10);
  }
  return current;
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jahannamIntentionsStore.setState({ byDate: {}, isReady: false });
});

describe("jahannamIntentionsStore", () => {
  it("exposes every intention id once", () => {
    expect(new Set(JAHANNAM_INTENTION_IDS).size).toBe(6);
  });

  it("toggles flags for today, counts them and persists", async () => {
    const today = getLocalDateString();
    const { toggle } = jahannamIntentionsStore.getState();

    await toggle("istighfar");
    await toggle("charity");
    expect(jahannamIntentionsStore.getState().countSetToday()).toBe(2);
    expect(jahannamIntentionsStore.getState().isSet("istighfar")).toBe(true);
    expect(await readJSON(DB_KEYS.jahannamIntentions, {})).toEqual({
      [today]: { istighfar: true, charity: true },
    });

    await toggle("istighfar");
    expect(jahannamIntentionsStore.getState().isSet("istighfar")).toBe(false);
    expect(jahannamIntentionsStore.getState().countSetToday()).toBe(1);
  });

  it("counts zero when nothing is set today", () => {
    expect(jahannamIntentionsStore.getState().countSetToday()).toBe(0);
  });

  it("counts consecutive active days back from today and stops at a gap", async () => {
    const today = getLocalDateString();
    await writeJSON(DB_KEYS.jahannamIntentions, {
      [today]: { repentance: true },
      [daysBefore(today, 1)]: { reconcile: true },
      [daysBefore(today, 2)]: { "guard-tongue": true },
      // Day 3 has only cleared flags, which breaks the streak.
      [daysBefore(today, 3)]: { charity: false },
      [daysBefore(today, 4)]: { charity: true },
    });
    await jahannamIntentionsStore.getState().load();

    expect(jahannamIntentionsStore.getState().reflectionStreak()).toBe(3);
  });

  it("has no streak when today is empty", () => {
    jahannamIntentionsStore.setState({ byDate: { "2020-01-01": { charity: true } } });
    expect(jahannamIntentionsStore.getState().reflectionStreak()).toBe(0);
  });
});

describe("jahannam intention hooks", () => {
  it("loads on render and derives count, streak and flags", async () => {
    const { result } = await renderHook(() => {
      useEnsureJahannamIntentionsLoaded();
      return {
        ready: useJahannamIntentionsReady(),
        charity: useJahannamIntention("charity"),
        count: useJahannamIntentionsCount(),
        streak: useJahannamReflectionStreak(),
        actions: useJahannamIntentionActions(),
      };
    });

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.count).toBe(0);
    expect(result.current.streak).toBe(0);

    await act(async () => {
      await result.current.actions.toggle("charity");
    });
    expect(result.current.charity).toBe(true);
    expect(result.current.count).toBe(1);
    expect(result.current.streak).toBe(1);
  });
});
