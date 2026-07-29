import type { BattlesFigure } from "../types/battles";

/** Bump when figure profiles change. */
export const BATTLES_FIGURES_VERSION = 2;

export const BATTLES_FIGURES: BattlesFigure[] = [
  {
    id: "abu-bakr",
    name: "Abu Bakr al-Siddiq",
    epithet: "May Allah be pleased with him",
    summary:
      "The Prophet's closest companion, first adult male believer, and his companion on the Hijra.",
    role: "Advisor, fighter, and standard-bearer in early campaigns.",
    battles: ["badr", "uhud", "trench", "hunayn", "tabuk"],
    lesson:
      "Steadfast loyalty and truthfulness under pressure — he spent his wealth to free persecuted Muslims before any victory.",
  },
  {
    id: "umar",
    name: "Umar ibn al-Khattab",
    epithet: "May Allah be pleased with him",
    summary:
      "Entered Islam in the years of persecution and became one of the strongest defenders of the faith.",
    role: "Fighter and later architect of justice as the second Caliph.",
    battles: ["badr", "uhud", "trench", "khaybar", "conquest-makkah"],
    lesson:
      "Courage paired with accountability — he publicly accepted counsel when his opinion differed from the Prophet's at Hudaybiyyah.",
  },
  {
    id: "ali",
    name: "Ali ibn Abi Talib",
    epithet: "May Allah be pleased with him",
    summary: "Cousin and son-in-law of the Prophet ﷺ; among the first children to accept Islam.",
    role: "Champion in single combat and bearer of the banner at Khaybar.",
    battles: ["badr", "uhud", "trench", "khaybar", "hunayn"],
    lesson:
      "Valour with humility — he slept in the Prophet's bed on the night of the Hijra, risking his life so the mission could continue.",
  },
  {
    id: "hamza",
    name: "Hamza ibn Abd al-Muttalib",
    epithet: "May Allah be pleased with him",
    summary: "The Prophet's uncle, known as Asadullah (Lion of Allah) after embracing Islam.",
    role: "Elite warrior and morale leader at Badr and Uhud.",
    battles: ["badr", "uhud"],
    lesson:
      "Martyrdom is not defeat — his death at Uhud grieved the Prophet deeply yet strengthened resolve to complete the mission.",
  },
  {
    id: "khalid",
    name: "Khalid ibn al-Walid",
    epithet: "May Allah be pleased with him",
    summary:
      "A brilliant Quraysh general who accepted Islam after Hudaybiyyah and became Saifullah (Sword of Allah).",
    role: "Led the flanking cavalry against the Muslims at Uhud before his Islam; later took command at Mu'tah and was decisive in the caliphal campaigns.",
    battles: ["mutah", "hunayn", "conquest-makkah"],
    lesson:
      "Past opposition is no bar to sincere repentance — the very skill that struck the Muslims at Uhud was, once faith entered his heart, redirected entirely to the cause of Allah.",
  },
  {
    id: "saad",
    name: "Sa'd ibn Abi Waqqas",
    epithet: "May Allah be pleased with him",
    summary: "One of the ten promised Paradise; famed archer of the community.",
    role: "Archer at Uhud; later led the Muslim armies at al-Qadisiyyah under the Caliph Umar.",
    battles: ["badr", "uhud", "trench"],
    lesson:
      "Discipline in one's role — archery defined his service; he later carried that precision into leadership of a nation.",
  },
  {
    id: "salman",
    name: "Salman al-Farisi",
    epithet: "May Allah be pleased with him",
    summary:
      "A seeker from Persia who joined the Muslims in Madinah after a long spiritual journey.",
    role: "Proposed digging the trench — a Persian tactic unfamiliar to the Arabs.",
    battles: ["trench"],
    lesson:
      "Wisdom can come from any background — shura means hearing expertise wherever Allah places it.",
  },
  {
    id: "zayd",
    name: "Zayd ibn Harithah",
    epithet: "May Allah be pleased with him",
    summary:
      "The Prophet's freed man and beloved companion, and the first commander appointed over a Muslim army.",
    role: "Led the expedition to Mu'tah; martyred there as the first of the three named commanders to fall.",
    battles: ["mutah", "badr", "trench"],
    lesson:
      "Merit over lineage — he was chosen to lead when men of higher tribal rank were present.",
  },
  {
    id: "saad-ibn-muadh",
    name: "Sa'd ibn Mu'adh",
    epithet: "May Allah be pleased with him",
    summary: "Chief of the Aws of Madinah, one of the earliest and most respected of the Ansar.",
    role: "Wounded at the Trench; chosen by Banu Qurayzah as the arbiter of their fate.",
    battles: ["badr", "uhud", "trench", "banu-qurayzah"],
    lesson:
      "Justice through an agreed judge — even a defeated enemy was allowed an impartial arbiter rather than unchecked vengeance; he died of his wound soon after.",
  },
];
