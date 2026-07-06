import type { ProphetsTimelineEvent } from "../types/prophets";

/** Chronological overview of prophets mentioned in the Qur'an — approximate eras. */
export const PROPHETS_TIMELINE: ProphetsTimelineEvent[] = [
  {
    id: "creation-adam",
    era: "Beginning",
    title: "Adam — first prophet",
    body: "Allah created Adam, taught him names, and made him His vicegerent on earth.",
    prophetId: "adam",
  },
  {
    id: "early-prophets",
    era: "Antiquity",
    title: "Idris, Nuh, and early nations",
    body: "Prophets called their people to tawheed; Nuh's ark survives as a sign.",
    prophetId: "nuh",
  },
  {
    id: "ibrahim-era",
    era: "Mesopotamia / Levant",
    title: "Ibrahim and his family",
    body: "The friend of Allah, builder of the Ka'bah, father of Ismail and Ishaq.",
    prophetId: "ibrahim",
  },
  {
    id: "bani-israil",
    era: "Egypt & Sinai",
    title: "Musa and Bani Isra'il",
    body: "Liberation from Pharaoh, Torah revealed, long line of prophets to Bani Isra'il.",
    prophetId: "musa",
  },
  {
    id: "yusuf-story",
    era: "Egypt",
    title: "Yusuf in Egypt",
    body: "Patience through betrayal, prison, and rise to authority — a model of trust.",
    prophetId: "yusuf",
  },
  {
    id: "dawud-sulayman",
    era: "Jerusalem",
    title: "Dawud and Sulayman",
    body: "Kingship, wisdom, Zabur, and the kingdom praised in the Qur'an.",
    prophetId: "dawud",
  },
  {
    id: "isa",
    era: "1st century CE",
    title: "Isa ibn Maryam",
    body: "Born miraculously, spoke in the cradle, raised to Allah — not killed on the cross per Qur'an.",
    prophetId: "isa",
  },
  {
    id: "final-prophet",
    era: "7th century CE",
    title: "Muhammad ﷺ — seal of prophets",
    body: "The final messenger to all humanity; the Qur'an preserved until the Last Day.",
    prophetId: "muhammad",
  },
];
