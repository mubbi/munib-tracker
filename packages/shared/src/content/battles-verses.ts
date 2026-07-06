import type { BattlesVerse } from "../types/battles";

/** Bump when curated battle verses change. */
export const BATTLES_VERSES_VERSION = 2;

export const BATTLES_VERSES: BattlesVerse[] = [
  {
    id: "permission-fight",
    battleId: "introduction",
    surah: 22,
    ayahFrom: 39,
    ayahTo: 40,
    label: "Qur'an 22:39–40",
    excerpt:
      "Permission is given to those who fight because they have been wronged… Had Allah not checked one set of people by means of another, monasteries, churches, synagogues, and mosques would have been destroyed.",
    context:
      "The first general permission to fight — after years of unarmed persecution in Makkah.",
  },
  {
    id: "no-transgression",
    battleId: "ethics-of-warfare",
    surah: 2,
    ayahFrom: 190,
    label: "Qur'an 2:190",
    excerpt:
      "Fight in the way of Allah those who fight you, but do not transgress. Indeed, Allah does not like transgressors.",
    context: "The foundational limit: defence only, with strict prohibition of exceeding bounds.",
  },
  {
    id: "badr-angels",
    battleId: "badr",
    surah: 8,
    ayahFrom: 9,
    label: "Qur'an 8:9",
    excerpt:
      "When you asked your Lord for help, He answered: I will reinforce you with a thousand angels, rank upon rank.",
    context: "Revealed regarding Badr — divine aid to the outnumbered believers.",
  },
  {
    id: "badr-small-group",
    battleId: "badr",
    surah: 3,
    ayahFrom: 13,
    label: "Qur'an 3:13",
    excerpt:
      "There has already been for you a sign in the two armies that met — one fighting in the way of Allah and another of disbelievers, seeing them twice their number with their eyes.",
    context: "Allah made the Muslims appear larger to the enemy at Badr, strengthening hearts.",
  },
  {
    id: "uhud-lesson",
    battleId: "uhud",
    surah: 3,
    ayahFrom: 152,
    label: "Qur'an 3:152",
    excerpt:
      "Allah had certainly fulfilled His promise to you when you were killing them by His permission, until you lost courage and fell to disputing about the order and disobeyed after He had shown you that which you love.",
    context: "Addresses the archers' disobedience and the turning point at Uhud.",
  },
  {
    id: "trench-confederates",
    battleId: "trench",
    surah: 33,
    ayahFrom: 9,
    ayahTo: 10,
    label: "Qur'an 33:9–10",
    excerpt:
      "O you who believe, remember the favour of Allah upon you when armies came to you and We sent against them a wind and armies you did not see.",
    context: "Surah al-Ahzab on the Confederate siege and divine assistance.",
  },
  {
    id: "qurayzah-fortresses",
    battleId: "banu-qurayzah",
    surah: 33,
    ayahFrom: 26,
    ayahTo: 27,
    label: "Qur'an 33:26–27",
    excerpt:
      "And He brought down those of the People of the Scripture who supported them from their fortresses and cast terror into their hearts — a party you killed, and a party you took captive. And He caused you to inherit their land and their homes.",
    context:
      "Surah al-Ahzab on Banu Qurayzah, who broke the covenant during the siege — a bounded episode of wartime treason, not a ruling against a faith.",
  },
  {
    id: "hudaybiyyah-fath",
    battleId: "hudaybiyyah",
    surah: 48,
    ayahFrom: 1,
    ayahTo: 3,
    label: "Qur'an 48:1–3",
    excerpt:
      "Indeed, We have given you a manifest victory, that Allah may forgive you what preceded of your sin and what will follow, complete His favour upon you, and guide you to a straight path.",
    context:
      "Revealed on the return from Hudaybiyyah — naming as a manifest victory what the companions had first felt as a bitter compromise.",
  },
  {
    id: "hudaybiyyah-ridwan",
    battleId: "hudaybiyyah",
    surah: 48,
    ayahFrom: 18,
    label: "Qur'an 48:18",
    excerpt:
      "Certainly was Allah pleased with the believers when they pledged allegiance to you under the tree, and He knew what was in their hearts, so He sent down tranquillity upon them and rewarded them with an imminent conquest.",
    context:
      "The Pledge of Ridwan — about 1,400 companions pledged under an acacia tree not to flee, and Allah declared His pleasure with them.",
  },
  {
    id: "makkah-nasr",
    battleId: "conquest-makkah",
    surah: 110,
    ayahFrom: 1,
    ayahTo: 3,
    label: "Qur'an 110:1–3",
    excerpt:
      "When the victory of Allah has come and the conquest, and you see the people entering the religion of Allah in multitudes, then exalt with praise of your Lord and ask His forgiveness. Indeed, He is ever Accepting of repentance.",
    context:
      "Surah an-Nasr on the opening of Makkah — a conquest crowned not with triumph but with praise, seeking forgiveness, and multitudes entering the faith.",
  },
  {
    id: "hunayn-pride",
    battleId: "hunayn",
    surah: 9,
    ayahFrom: 25,
    ayahTo: 26,
    label: "Qur'an 9:25–26",
    excerpt:
      "Allah has already given you victory in many regions… Then Allah sent down His tranquillity upon His Messenger and upon the believers.",
    context:
      "Allah reminds the believers that victory is His gift, not a result of boasting in numbers.",
  },
  {
    id: "tabuk-stay-behind",
    battleId: "tabuk",
    surah: 9,
    ayahFrom: 81,
    label: "Qur'an 9:81",
    excerpt:
      "Those who remained behind rejoiced in their staying behind the Messenger of Allah and disliked to strive with their wealth and lives in the cause of Allah.",
    context:
      "Surah at-Tawbah addresses those who excused themselves from the difficult Tabuk march.",
  },
];
