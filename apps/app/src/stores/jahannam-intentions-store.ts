import { getLocalDateString } from "@munib-tracker/shared/utils";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/** Private daily self-accountability toggles — not a measure of fate with Allah. */
export type JahannamIntentionId =
  | "istighfar"
  | "charity"
  | "character"
  | "repentance"
  | "reconcile"
  | "guard-tongue";

type DayFlags = Partial<Record<JahannamIntentionId, boolean>>;

interface JahannamIntentionsState {
  byDate: Record<string, DayFlags>;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (id: JahannamIntentionId) => Promise<void>;
  isSet: (id: JahannamIntentionId) => boolean;
  countSetToday: () => number;
  reflectionStreak: () => number;
}

export const JAHANNAM_INTENTION_IDS: JahannamIntentionId[] = [
  "istighfar",
  "repentance",
  "guard-tongue",
  "charity",
  "character",
  "reconcile",
];

export const jahannamIntentionsStore = createStore<JahannamIntentionsState>((set, get) => ({
  byDate: {},
  isReady: false,

  async load() {
    const byDate = await readJSON<Record<string, DayFlags>>(DB_KEYS.jahannamIntentions, {});
    set({ byDate, isReady: true });
  },

  async toggle(id) {
    const today = getLocalDateString();
    const prev = get().byDate[today] ?? {};
    const nextDay = { ...prev, [id]: !prev[id] };
    const byDate = { ...get().byDate, [today]: nextDay };
    set({ byDate });
    await writeJSON(DB_KEYS.jahannamIntentions, byDate);
  },

  isSet(id) {
    const today = getLocalDateString();
    return Boolean(get().byDate[today]?.[id]);
  },

  countSetToday() {
    const today = getLocalDateString();
    const flags = get().byDate[today] ?? {};
    return JAHANNAM_INTENTION_IDS.filter((id) => flags[id]).length;
  },

  reflectionStreak() {
    const { byDate } = get();
    let streak = 0;
    let day = getLocalDateString();
    while (true) {
      const flags = byDate[day];
      const active = flags && JAHANNAM_INTENTION_IDS.some((id) => flags[id]);
      if (!active) break;
      streak += 1;
      const d = new Date(`${day}T12:00:00`);
      d.setDate(d.getDate() - 1);
      day = d.toISOString().slice(0, 10);
    }
    return streak;
  },
}));

export function useJahannamIntentionsReady(): boolean {
  return useStore(jahannamIntentionsStore, (s) => s.isReady);
}

export function useJahannamIntention(id: JahannamIntentionId): boolean {
  return useStore(jahannamIntentionsStore, (s) => s.isSet(id));
}

export function useJahannamIntentionsCount(): number {
  return useStore(jahannamIntentionsStore, (s) => s.countSetToday());
}

export function useJahannamReflectionStreak(): number {
  return useStore(jahannamIntentionsStore, (s) => s.reflectionStreak());
}

export function useJahannamIntentionActions() {
  return useStore(jahannamIntentionsStore, (s) => ({ toggle: s.toggle, load: s.load }));
}

export function useEnsureJahannamIntentionsLoaded(): void {
  const ready = useJahannamIntentionsReady();
  const load = useStore(jahannamIntentionsStore, (s) => s.load);
  if (!ready) void load();
}
