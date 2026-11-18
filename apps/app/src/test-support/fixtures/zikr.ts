import type { ZikrItem } from "@munib-tracker/shared/types";

import type { CustomAdhkar } from "@/stores/custom-adhkar-store";
import type { CustomTasbeeh } from "@/stores/custom-tasbeeh-store";

/** A user-made tasbeeh counter (custom-tasbeeh store / blob sync). */
export function buildCustomTasbeeh(overrides: Partial<CustomTasbeeh> = {}): CustomTasbeeh {
  return {
    id: "tasbeeh-1",
    title: "SubhanAllah",
    description: "",
    target: 33,
    count: 0,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}

/** A user-authored adhkar entry (custom-adhkar store / blob sync). */
export function buildCustomAdhkar(overrides: Partial<CustomAdhkar> = {}): CustomAdhkar {
  return {
    id: "adhkar-1",
    title: "Morning reminder",
    arabic: "",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}

/** A bundled-style zikr row item (morning category, recite 3×). */
export function buildZikrItem(overrides: Partial<ZikrItem> = {}): ZikrItem {
  return {
    id: "morning-bismillah",
    categoryId: "morning",
    title: "Bismillah",
    arabic: "",
    transliteration: "Bismillah",
    translation: "",
    targetCount: 3,
    ...overrides,
  };
}
