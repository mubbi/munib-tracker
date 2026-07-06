import type { QuranGuideTheme } from "../types/quran-guide";

/** Major themes of the Qur'an with verses, hadith, and practical lessons. */
export const QURAN_GUIDE_THEMES: QuranGuideTheme[] = [
  {
    id: "faith",
    title: "Faith (Iman)",
    summary: "Belief in Allah, His angels, books, messengers, the Last Day, and divine decree.",
    lessons: [
      "Iman is not mere affirmation — it increases with obedience and decreases with sin.",
      "The heart must know Allah, love Him, fear Him, and rely upon Him.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 285,
        label: "Qur'an 2:285",
        excerpt:
          "The Messenger believes in what was revealed to him from his Lord, and so do the believers…",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 8",
        grade: "sahih",
        excerpt:
          "Faith is seventy-odd branches; the highest is 'There is no god but Allah' and the lowest is removing harm from the road.",
      },
    ],
    actions: [
      "Renew your shahada with understanding today.",
      "Learn one name of Allah and use it in du'a.",
    ],
  },
  {
    id: "prayer",
    title: "Prayer (Salah)",
    summary:
      "The first deed asked about on the Day of Judgment — the pillar that connects servant to Lord.",
    lessons: [
      "Salah prevents immorality and wrongdoing when performed with presence.",
      "It was prescribed during the Mi'raj — a gift and ascension for the ummah.",
    ],
    quran: [
      {
        surah: 29,
        ayahFrom: 45,
        label: "Qur'an 29:45",
        excerpt:
          "Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.",
      },
    ],
    actions: [
      "Pray one salah today with full awareness of what you recite.",
      "Open Munib's Learn Salah guide.",
    ],
  },
  {
    id: "parents",
    title: "Parents",
    summary:
      "Kindness to parents is paired with worship of Allah — after shirk, ingratitude to them is warned against.",
    lessons: [
      "Speak gently; never say 'uff' — the smallest expression of annoyance is forbidden.",
      "Du'a for parents continues even after their death.",
    ],
    quran: [
      {
        surah: 17,
        ayahFrom: 23,
        ayahTo: 24,
        label: "Qur'an 17:23–24",
        excerpt:
          "Your Lord has decreed that you worship none but Him, and that you be kind to parents…",
      },
    ],
    actions: [
      "Call or message a parent with kind words today.",
      "Make du'a for your parents by name.",
    ],
  },
  {
    id: "patience",
    title: "Patience (Sabr)",
    summary: "Steadfastness in obedience, restraint from sin, and acceptance of trials.",
    lessons: [
      "Allah is with the patient — sabr is not passive despair but active trust.",
      "The prophets were tested most severely; their stories model patience.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 153,
        label: "Qur'an 2:153",
        excerpt:
          "O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.",
      },
    ],
    actions: ["When irritated today, pause and say 'Inna lillahi wa inna ilayhi raji'un'."],
  },
  {
    id: "charity",
    title: "Charity (Sadaqah & Zakat)",
    summary: "Purifying wealth and feeding the needy — a sign of true faith.",
    lessons: [
      "Even a smile is charity.",
      "Zakat is the obligatory minimum; sadaqah is voluntary and unlimited.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 261,
        label: "Qur'an 2:261",
        excerpt:
          "The example of those who spend in the way of Allah is like a grain that grows seven spikes…",
      },
    ],
    actions: [
      "Give something today — money, time, or a kind word.",
      "Review zakat obligations in Munib.",
    ],
  },
  {
    id: "repentance",
    title: "Repentance (Tawbah)",
    summary: "Allah loves those who repent — the door is open until the soul reaches the throat.",
    lessons: [
      "Tawbah requires regret, leaving the sin, and resolving not to return.",
      "Do not despair of Allah's mercy — He forgives all sins for those who repent sincerely.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah…",
      },
    ],
    actions: ["Make istighfar 100 times today.", "Identify one habit to leave for Allah's sake."],
  },
  {
    id: "heaven",
    title: "Paradise (Jannah)",
    summary: "Eternal reward prepared for the muttaqin — described in vivid, motivating detail.",
    lessons: [
      "Jannah is not earned by deeds alone — it is by Allah's mercy through faith and effort.",
      "The greatest joy is seeing Allah.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 133,
        label: "Qur'an 3:133",
        excerpt:
          "And hasten to forgiveness from your Lord and a Garden as wide as the heavens and earth…",
      },
    ],
    appLinks: [{ label: "Journey to Jannah", route: "/jannah" }],
  },
  {
    id: "hell",
    title: "Hellfire (Jahannam)",
    summary: "A real warning — not to despair believers but to awaken heedfulness.",
    lessons: [
      "Fear of Jahannam motivates righteousness when balanced with hope in mercy.",
      "Allah warns so that we return — not to crush the repentant.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 48,
        label: "Qur'an 4:48",
        excerpt:
          "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills.",
      },
    ],
    actions: ["Ask Allah for protection from the Fire after every salah."],
  },
  {
    id: "justice",
    title: "Justice",
    summary: "Stand firm for justice even against yourselves or your kin.",
    lessons: [
      "Justice is closest to taqwa.",
      "Oppression (dhulm) is darkness on the Day of Resurrection.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 135,
        label: "Qur'an 4:135",
        excerpt:
          "Be maintainers of justice, witnesses for Allah, even if against yourselves or parents and relatives.",
      },
    ],
  },
  {
    id: "knowledge",
    title: "Knowledge",
    summary: "Read, reflect, and say 'My Lord, increase me in knowledge.'",
    lessons: [
      "The first revelation was 'Read' — literacy of heart and mind.",
      "Scholars are heirs of the prophets.",
    ],
    quran: [
      {
        surah: 20,
        ayahFrom: 114,
        label: "Qur'an 20:114",
        excerpt: "And say: My Lord, increase me in knowledge.",
      },
    ],
    actions: ["Learn one new thing from the Qur'an today and teach it to someone."],
  },
  {
    id: "prophets",
    title: "Prophets",
    summary: "Stories of guidance, trial, and divine support — not entertainment but instruction.",
    lessons: [
      "Every nation was sent a warner.",
      "Muhammad ﷺ is the seal — belief in all prophets is required.",
    ],
    quran: [
      {
        surah: 12,
        ayahFrom: 111,
        label: "Qur'an 12:111",
        excerpt: "In their stories is a lesson for those of understanding…",
      },
    ],
    appLinks: [{ label: "Prophet stories", route: "/learn-quran/stories" }],
  },
  {
    id: "women",
    title: "Women",
    summary: "Rights, dignity, and spiritual equality — Maryam is among the best of women.",
    lessons: [
      "Paradise lies at the feet of mothers.",
      "Women are partners in faith, not possessions.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 1,
        label: "Qur'an 4:1",
        excerpt: "Fear your Lord, who created you from one soul and created from it its mate…",
      },
    ],
  },
  {
    id: "children",
    title: "Children",
    summary: "A trust (amana) — to be raised upon tawheed and kindness.",
    lessons: [
      "Play with them for seven years, discipline for seven, befriend for seven.",
      "Teaching a child one verse is ongoing charity.",
    ],
    quran: [
      {
        surah: 66,
        ayahFrom: 6,
        label: "Qur'an 66:6",
        excerpt: "O you who believe, protect yourselves and your families from a Fire…",
      },
    ],
  },
];
