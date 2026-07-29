import type { TaharahChecklistItem } from "../types/taharah";

/** Daily purification habits to review — not a fiqh ruling tool. */
export const TAHARAH_CHECKLIST: TaharahChecklistItem[] = [
  {
    id: "wudu-before-fajr",
    title: "Wudu before Fajr",
    hint: "Start the day in a state of purity when possible.",
  },
  {
    id: "siwak",
    title: "Siwak / brush teeth",
    hint: "A sunnah before wudu and before salah.",
  },
  {
    id: "clean-clothes",
    title: "Prayer clothes free of najasah",
    hint: "Check for visible impurity before salah.",
  },
  {
    id: "prayer-space",
    title: "Clean prayer place",
    hint: "Remove anything impure from where you pray.",
  },
  {
    id: "renew-wudu",
    title: "Renew wudu after nullifiers",
    hint: "Wind, sleep, toilet — know what breaks wudu.",
  },
  {
    id: "ghusl-if-needed",
    title: "Ghusl when required",
    hint: "After major impurity, menstruation ends, or postnatal bleeding.",
  },
];
