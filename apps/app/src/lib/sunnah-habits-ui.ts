import type {
  SunnahHabitLink,
  SunnahHabitSource,
} from "@munib-tracker/shared/content/sunnah-habits";
import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

/** Route a habit row's "open" action goes to (adhkar set, ayah, tasbeeh, dua, hub). */
export function habitLinkHref(link: SunnahHabitLink): Href {
  switch (link.kind) {
    case "zikrCategory":
      return { pathname: "/zikr/[category]", params: { category: link.category } } as Href;
    case "quran":
      return {
        pathname: "/quran/[surah]",
        params: {
          surah: String(link.surah),
          ...(link.ayah != null && { ayah: String(link.ayah) }),
        },
      } as Href;
    case "tasbeeh":
      return { pathname: "/tasbeeh/[zikrId]", params: { zikrId: link.zikrId } } as Href;
    case "dua":
      return { pathname: "/dua/detail/[id]", params: { id: link.duaId } } as Href;
    case "route":
      return link.route as Href;
  }
}

/** i18n key of the "from …" label on a derived habit. */
export function habitSourceLabelKey(source: SunnahHabitSource): string {
  if (source === "sadaqah") return "sunnahHabits.from.sadaqah";
  if (source.startsWith("zikr:")) return "sunnahHabits.from.tasbeeh";
  return "sunnahHabits.from.adhkar";
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
