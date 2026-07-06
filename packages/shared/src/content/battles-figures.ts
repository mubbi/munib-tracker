import type { BattlesFigure } from "../types/battles";

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
    role: "Commander at Mu'tah and decisive leader in later campaigns under the Caliphs.",
    battles: ["mutah", "hunayn", "conquest-makkah"],
    lesson:
      "Past opposition does not bar sincere repentance — his skill was redirected entirely to Allah's cause after faith entered his heart.",
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
    summary: "The Prophet's adopted son and the first commander appointed over a Muslim army.",
    role: "Led the expedition to Mu'tah; martyred there.",
    battles: ["mutah", "trench"],
    lesson:
      "Merit over lineage — he was chosen to lead when others of higher tribal rank were present.",
  },
];
