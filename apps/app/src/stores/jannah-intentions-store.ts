import { getLocalDateString } from "@munib-tracker/shared/utils";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/** Private daily intention flags — not a measure of rank with Allah. */
export type JannahIntentionId = "tawbah" | "charity" | "character";

type DayFlags = Partial<Record<JannahIntentionId, boolean>>;

interface JannahIntentionsState {
  byDate: Record<string, DayFlags>;
  isReady: boolean;
  load: () => Promise<void>;
  toggle: (id: JannahIntentionId) => Promise<void>;
  isSet: (id: JannahIntentionId) => boolean;
}

export const jannahIntentionsStore = createStore<JannahIntentionsState>((set, get) => ({
  byDate: {},
  isReady: false,

  async load() {
    const byDate = await readJSON<Record<string, DayFlags>>(DB_KEYS.jannahIntentions, {});
    set({ byDate, isReady: true });
  },

  async toggle(id) {
    const today = getLocalDateString();
    const prev = get().byDate[today] ?? {};
    const nextDay = { ...prev, [id]: !prev[id] };
    const byDate = { ...get().byDate, [today]: nextDay };
    set({ byDate });
    await writeJSON(DB_KEYS.jannahIntentions, byDate);
  },

  isSet(id) {
    const today = getLocalDateString();
    return Boolean(get().byDate[today]?.[id]);
  },
}));

export function useJannahIntentionsReady(): boolean {
  return useStore(jannahIntentionsStore, (s) => s.isReady);
}

export function useJannahIntention(id: JannahIntentionId): boolean {
  return useStore(jannahIntentionsStore, (s) => s.isSet(id));
}

export function useJannahIntentionActions() {
  return useStore(jannahIntentionsStore, (s) => ({ toggle: s.toggle, load: s.load }));
}

export function useEnsureJannahIntentionsLoaded(): void {
  const ready = useJannahIntentionsReady();
  const load = useStore(jannahIntentionsStore, (s) => s.load);
  if (!ready) void load();
}
