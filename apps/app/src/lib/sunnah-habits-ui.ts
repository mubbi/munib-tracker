import type {
  SunnahHabitDef,
  SunnahHabitLink,
  SunnahHabitSource,
} from "@munib-tracker/shared/content/sunnah-habits";
import type { SunnahHabitsState } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

import { parsePassage } from "@/lib/quran-companion/passage";
import type { Passage } from "@/lib/quran-companion/types";
import { wholeSurah } from "@/lib/recite-along/passages";
import { EMPTY_HABIT_CONTEXT, habitProgress, resolveHabit } from "@/lib/sunnah-habits";

/** Route a habit row's "open" action goes to (adhkar set, ayah, tasbeeh, dua, hub). */
export function habitLinkHref(link: SunnahHabitLink): Href {
  switch (link.kind) {
    case "zikrCategory":
      return { pathname: "/zikr/[category]", params: { category: link.category } } as Href;
    case "quran":
      // One ayah (Ayat al-Kursi) opens just that passage, not the whole surah.
      return link.ayah != null
        ? ({
            pathname: "/quran/passage",
            params: { surah: String(link.surah), from: String(link.ayah), to: String(link.ayah) },
          } as unknown as Href)
        : ({ pathname: "/quran/[surah]", params: { surah: String(link.surah) } } as Href);
    case "tasbeeh":
      return { pathname: "/tasbeeh/[zikrId]", params: { zikrId: link.zikrId } } as Href;
    case "dua":
      return { pathname: "/dua/detail/[id]", params: { id: link.duaId } } as Href;
    case "route":
      return link.route as Href;
  }
}

/**
 * The passage a Qur'an-recitation habit is recited along with (D68): its Qur'an
 * link — one ayah (Ayat al-Kursi 2:255) or the whole surah (al-Mulk, sectioned
 * by the recite-along sheet). `null` for every other habit.
 */
export function habitRecitePassage(
  def: Pick<SunnahHabitDef, "link" | "quranRecitation"> | undefined,
): Passage | null {
  const link = def?.link;
  if (!def?.quranRecitation || link?.kind !== "quran") return null;
  return link.ayah != null
    ? parsePassage({ surah: link.surah, from: link.ayah, to: link.ayah })
    : wholeSurah(link.surah);
}

/**
 * D74: whether a practice summary offers "Mark habit done" — the session came
 * from a Qur'an-recitation habit's recite-along (`habit` route param), at least
 * one ayah was credited (heard ≥ ⅔ of its words), and the habit isn't ticked on
 * `date` yet. Never ticks anything itself.
 */
export function canOfferHabitDone(input: {
  state: SunnahHabitsState;
  habitId: string | null | undefined;
  date: string;
  creditedAyahs: number;
}): boolean {
  if (!input.habitId || !(input.creditedAyahs > 0)) return false;
  const habit = resolveHabit(input.state, input.habitId);
  if (!habit || !habitRecitePassage(habit.def)) return false;
  return !habitProgress(input.state, habit, input.date, EMPTY_HABIT_CONTEXT).done;
}

/** i18n key of the "from …" label on a derived habit. */
export function habitSourceLabelKey(source: SunnahHabitSource): string {
  if (source === "sadaqah") return "sunnahHabits.from.sadaqah";
  if (source.startsWith("zikr:")) return "sunnahHabits.from.tasbeeh";
  return "sunnahHabits.from.adhkar";
}

/** Time-of-day groups of the "Add more" catalog (derived from each habit's flags and links). */
export type HabitTimeGroup = "morningEvening" | "day" | "bedtime";

export const HABIT_TIME_GROUPS: readonly HabitTimeGroup[] = ["morningEvening", "day", "bedtime"];

export function habitTimeGroup(def: Pick<SunnahHabitDef, "bedtime" | "source">): HabitTimeGroup {
  if (def.bedtime) return "bedtime";
  if (def.source === "adhkar:morning" || def.source === "adhkar:evening") return "morningEvening";
  return "day";
}

type Icon = SymbolViewProps["name"];

const ICONS: Record<string, Icon> = {
  miswak: { ios: "mouth.fill", android: "clean_hands", web: "clean_hands" },
  wudu_before_sleep: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  sleep_right_side: { ios: "bed.double.fill", android: "bed", web: "bed" },
  ayat_kursi_sleep: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  mulk_nightly: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
  istighfar_100: { ios: "hand.tap.fill", android: "touch_app", web: "touch_app" },
  salawat: { ios: "heart.fill", android: "favorite", web: "favorite" },
  salam_home: { ios: "house.fill", android: "home", web: "home" },
  spread_salam: { ios: "person.2.fill", android: "group", web: "group" },
  eat_right_bismillah: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  smile: { ios: "face.smiling", android: "sentiment_satisfied", web: "sentiment_satisfied" },
  daily_sadaqah: { ios: "heart.circle.fill", android: "savings", web: "savings" },
  morning_adhkar: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
  evening_adhkar: { ios: "sunset.fill", android: "nights_stay", web: "nights_stay" },
};

const CUSTOM_ICON: Icon = { ios: "star.fill", android: "star", web: "star" };

export function habitIcon(id: string): Icon {
  return ICONS[id] ?? CUSTOM_ICON;
}

export const SUNNAH_HABITS_ICON: Icon = {
  ios: "checkmark.seal.fill",
  android: "verified",
  web: "verified",
};
