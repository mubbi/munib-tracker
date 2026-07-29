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
    body: "Early prophets called their people back to tawheed. Nuh preached for centuries; when rejection persisted, the flood came and the ark saved the believers as a sign.",
    prophetId: "nuh",
  },
  {
    id: "ibrahim-era",
    era: "Mesopotamia / Levant",
    title: "Ibrahim and his family",
    body: "Khalilullah, the friend of Allah: he shattered the idols, was saved from the fire, built the Ka'bah with Ismail, and fathered a line of prophets through Ismail and Ishaq.",
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
