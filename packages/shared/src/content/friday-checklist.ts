import type { FridayChecklistItem } from "../types/friday";

/**
 * Default Friday / Jumu'ah checklist items. Titles and hints live in app i18n
 * (`tracker.friday.items.<id>.*`); this corpus only carries stable ids, deep
 * links, and classical citation labels. Shown only when the local calendar day
 * is Friday (Gregorian `getDay() === 5`).
 */
export const FRIDAY_CHECKLIST: FridayChecklistItem[] = [
  {
    id: "ghusl",
    route: "/taharah",
    reference: "Muslim 846 · Bukhari 877",
  },
  {
    id: "prepare",
    reference: "Bukhari 883",
  },
  {
    id: "jumuah",
    route: "/salah-guide/jumuah",
    reference: "Qur'an 62:9 · Abu Dawud 1067",
  },
  {
    id: "kahf",
    route: "/quran/18",
    reference: "Muslim 809",
  },
  {
    id: "salawat",
    route: "/duroods",
    reference: "Abu Dawud 1047",
  },
  {
    id: "dua",
    route: "/dua",
    reference: "Bukhari 935 · Abu Dawud 1048",
  },
];
