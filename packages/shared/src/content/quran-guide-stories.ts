import type { QuranGuideStory } from "../types/quran-guide";

/** Stories of prophets in the Qur'an — summaries with lessons and references. */
export const QURAN_GUIDE_STORIES: QuranGuideStory[] = [
  {
    id: "adam",
    prophetName: "Adam",
    title: "Adam — first prophet and father of humanity",
    summary: "Creation, the angels' prostration, the test of the tree, repentance accepted.",
    body: [
      "Allah created Adam from clay, breathed into him of His spirit, and taught him the names of all things. When the angels were commanded to prostrate, Iblis refused out of pride.",
      "Adam and Hawwa were placed in the Garden and warned not to approach one tree. Shaytan whispered; they ate, their shame became visible, and they called upon Allah: 'Our Lord, we have wronged ourselves…'",
      "Allah accepted their repentance and sent them to earth as His vicegerents — not as a punishment without purpose, but as a test with guidance.",
    ],
    lessons: [
      "Repentance is always open — Adam's tawbah is a model for every sinner.",
      "Knowledge and humility belong together; arrogance was Iblis's ruin.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 30,
        ayahTo: 39,
        label: "Qur'an 2:30–39",
        excerpt: "Creation of Adam and the angels' prostration.",
      },
      {
        surah: 7,
        ayahFrom: 19,
        ayahTo: 25,
        label: "Qur'an 7:19–25",
        excerpt: "The test, fall, and repentance.",
      },
    ],
    location: "Jannah, then earth",
  },
  {
    id: "nuh",
    prophetName: "Nuh",
    title: "Nuh — patience through centuries of rejection",
    summary: "950 years of da'wah, the Ark, and the flood as divine judgment.",
    body: [
      "Nuh called his people day and night, publicly and privately. Only a few believed. He built the Ark by Allah's command while his people mocked.",
      "When the oven overflowed — the sign — pairs of animals and believers boarded. The flood destroyed the rejecters; Nuh's son chose disbelief and was among the drowned.",
      "The Ark settled on Judi — a sign for all who reflect.",
    ],
    lessons: [
      "Length of mission does not guarantee acceptance — sincerity with Allah does.",
      "Family ties do not save without faith.",
    ],
    quran: [
      {
        surah: 11,
        ayahFrom: 25,
        ayahTo: 49,
        label: "Surah Hud",
        excerpt: "Nuh's story in detail.",
      },
      { surah: 71, ayahFrom: 1, label: "Surah Nuh", excerpt: "Nuh's plea to his people." },
    ],
    location: "Ancient Mesopotamia (scholarly estimates)",
  },
  {
    id: "ibrahim",
    prophetName: "Ibrahim",
    title: "Ibrahim — the friend of Allah (Khalilullah)",
    summary: "Breaking idols, the fire made cool, sacrifice of Ismail, building the Ka'bah.",
    body: [
      "Ibrahim questioned idol worship, smashed the idols of his people, and was thrown into fire — which Allah made cool and safe.",
      "He left his wife Hajar and infant Ismail in Makkah by divine command; Zamzam flowed. Later he saw in a dream that he must sacrifice Ismail — both submitted; Allah ransomed him with a ram.",
      "He and Ismail raised the foundations of the Ka'bah and prayed for a prophet from their descendants.",
    ],
    lessons: [
      "Tawheed requires breaking false attachments — even popular ones.",
      "Trust in Allah's wisdom when His command seems hardest.",
    ],
    quran: [
      {
        surah: 37,
        ayahFrom: 83,
        ayahTo: 113,
        label: "Qur'an 37:83–113",
        excerpt: "Ibrahim, Ismail, and the sacrifice.",
      },
      {
        surah: 2,
        ayahFrom: 124,
        ayahTo: 141,
        label: "Qur'an 2:124–141",
        excerpt: "Covenant and legacy.",
      },
    ],
    location: "Iraq, Levant, Makkah",
  },
  {
    id: "yusuf",
    prophetName: "Yusuf",
    title: "Yusuf — beauty of patience (sabr jameel)",
    summary: "Betrayal, slavery, prison, rise to authority — trust through every trial.",
    body: [
      "His brothers threw him in a well out of jealousy. Sold in Egypt, he resisted temptation in the palace, and was imprisoned unjustly.",
      "In prison he interpreted dreams by Allah's leave. Years later he interpreted the king's dream and was appointed over storehouses.",
      "When famine brought his brothers, he tested then forgave them: 'No blame upon you today.'",
    ],
    lessons: [
      "Sabr jameel — beautiful patience without complaint to people.",
      "Allah's plan may hide behind years of hardship.",
    ],
    quran: [
      {
        surah: 12,
        ayahFrom: 1,
        label: "Surah Yusuf",
        excerpt: "The best of stories — told in one surah.",
      },
    ],
    location: "Canaan, Egypt",
  },
  {
    id: "musa",
    prophetName: "Musa",
    title: "Musa — spoke to Allah and faced Pharaoh",
    summary: "Burning bush, signs against Pharaoh, Exodus, Torah, and the wandering nation.",
    body: [
      "Allah spoke to Musa at Tur Sinai: 'Verily, I am your Lord.' Sent with Harun to Pharaoh — 'Let the Children of Israel go.'",
      "Staff becoming serpent, hand shining white, plagues — Pharaoh's magicians believed at Badr-like clarity.",
      "The sea was split; Pharaoh drowned. Musa received the Torah and led Bani Isra'il through forty years of trials.",
    ],
    lessons: [
      "Speak truth to tyranny with reliance on Allah.",
      "A nation can witness miracles yet remain stubborn — guidance is Allah's gift.",
    ],
    quran: [
      {
        surah: 20,
        ayahFrom: 9,
        ayahTo: 98,
        label: "Qur'an 20:9–98",
        excerpt: "Musa at Tur and before Pharaoh.",
      },
      { surah: 28, ayahFrom: 3, label: "Surah al-Qasas", excerpt: "Birth and upbringing." },
    ],
    location: "Egypt, Sinai",
  },
  {
    id: "isa",
    prophetName: "Isa",
    title: "Isa ibn Maryam — word and spirit from Allah",
    summary: "Miraculous birth, signs, raised to Allah — not killed nor crucified per Qur'an.",
    body: [
      "Maryam withdrew from her family; Jibreel brought news of a pure son. She bore Isa alone; he spoke in the cradle defending her honour.",
      "Allah gave him signs: healing the blind and leper, reviving the dead — by His permission.",
      "When his followers disagreed, Allah raised Isa to Himself. The Qur'an denies crucifixion and affirms his return before the Last Day (scholars detail eschatology).",
    ],
    lessons: [
      "Allah creates as He wills — no need for worldly causes.",
      "Prophets are human servants, not divine.",
    ],
    quran: [
      {
        surah: 19,
        ayahFrom: 16,
        ayahTo: 36,
        label: "Surah Maryam",
        excerpt: "Birth and cradle speech.",
      },
      {
        surah: 4,
        ayahFrom: 157,
        ayahTo: 158,
        label: "Qur'an 4:157–158",
        excerpt: "Not killed nor crucified; raised.",
      },
    ],
    location: "Palestine",
  },
  {
    id: "muhammad",
    prophetName: "Muhammad ﷺ",
    title: "Muhammad ﷺ — seal of the prophets",
    summary: "Final messenger; Qur'an revealed across 23 years; mercy to the worlds.",
    body: [
      "Born in Makkah, orphaned early, known for truthfulness. Revelation began in Cave Hira at forty.",
      "He endured boycott, loss of Khadijah and Abu Talib, Ta'if's stones, and Badr through Uhud — yet forgave at the Conquest of Makkah.",
      "The Qur'an names him 'a mercy to the worlds' and charges him only to convey the message clearly.",
    ],
    lessons: [
      "The best character is prophetic character — study seerah to embody it.",
      "Convey, do not compel — guidance is Allah's.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 107,
        label: "Qur'an 21:107",
        excerpt: "We have not sent you except as a mercy to the worlds.",
      },
      {
        surah: 48,
        ayahFrom: 29,
        label: "Qur'an 48:29",
        excerpt: "Merciful among themselves, firm against disbelievers.",
      },
    ],
    appLinks: [{ label: "Seerah timeline", route: "/seerah" }],
  },
];
