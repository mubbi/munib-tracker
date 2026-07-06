import type { LastDayTopic } from "../types/last-day";

export { LAST_DAY_HADITH } from "./last-day-hadith";
export { LAST_DAY_QUIZ } from "./last-day-quiz";
export { LAST_DAY_REFERENCES } from "./last-day-references";
export { LAST_DAY_TIMELINE } from "./last-day-timeline";
export { LAST_DAY_VERSES } from "./last-day-verses";

/**
 * The Day of Judgment — from death through eternal life according to Qur'an
 * and authentic Sunnah. Scholar-neutral; speculative details avoided.
 * Bump version on change.
 */
export const LAST_DAY_CONTENT_VERSION = 1;

export const LAST_DAY_SECTION_ORDER = [
  "intro",
  "journey",
  "signs",
  "events",
  "outcomes",
  "practice",
] as const;

export const LAST_DAY_TOPICS: LastDayTopic[] = [
  // ── Introduction ───────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "intro",
    title: "Introduction",
    summary: "What is the Last Day, and why does it change how we live today?",
    importance: "foundational",
    body: [
      "Yawm al-Qiyamah — the Day of Resurrection and Judgment — is when every soul returns to Allah. It is not a distant myth but a pillar of faith that shapes worship, character, and justice in daily life.",
      "Belief in the Last Day means accountability is real: hidden deeds are known, rights of others matter, and mercy and justice both belong to Allah.",
      "This module follows the journey from death to eternity using the Qur'an and authentic Sunnah. Where scholars differ on details, that is noted — preparation through sincere worship is what the Prophet ﷺ emphasized.",
      "Theme: Prepare today for the Day when every soul will stand before Allah.",
    ],
    quran: [
      {
        surah: 99,
        ayahFrom: 1,
        ayahTo: 8,
        label: "Qur'an 99:1–8",
        excerpt:
          "When the earth is shaken with its final earthquake… whoever does an atom's weight of good or evil will see it.",
      },
    ],
    appLinks: [
      { label: "Timeline of the Hereafter", route: "/last-day/timeline" },
      { label: "Learn Aqeedah", route: "/aqeedah" },
    ],
  },
  {
    id: "why-believe",
    section: "intro",
    title: "Why believe in the Last Day?",
    summary: "One of the six articles of faith — motivation, hope, and ultimate justice.",
    importance: "foundational",
    body: [
      "Belief in the Last Day is the fifth of the six articles of Iman. Without it, worship loses its purpose and injustice appears final.",
      "It motivates righteous deeds: prayer, honesty, charity, and patience are investments for a meeting with Allah, not mere social habits.",
      "It gives hope to the oppressed that wrongs will be righted, and accountability to the powerful that no status shields from divine justice.",
      "It balances fear and hope: warnings are real, and Allah's mercy is vast for those who repent sincerely before death.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 177,
        label: "Qur'an 2:177",
        excerpt:
          "Righteousness is not to turn your faces east or west, but to believe in Allah, the Last Day, the angels, the Book, and the prophets.",
      },
      {
        surah: 14,
        ayahFrom: 42,
        label: "Qur'an 14:42",
        excerpt:
          "Never think Allah is unaware of what wrongdoers do. He only delays them for a limited term.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt:
          "Iman is to believe in Allah, His angels, His books, His messengers, the Last Day, and divine decree.",
      },
    ],
    actions: [
      "Renew intention daily: deeds are for Allah and for the Day you will meet Him.",
      "When injustice pains you, remember ultimate justice belongs to Allah.",
    ],
    appLinks: [{ label: "Six articles of faith", route: "/aqeedah/six-articles" }],
  },

  // ── Journey: Death & Barzakh ──────────────────────────────────────────────
  {
    id: "death",
    section: "journey",
    title: "Death",
    summary: "Every soul will taste death — husn al-khatimah and what benefits the deceased.",
    body: [
      "Death is certain for every soul. The believer prepares through tawbah, salah, and good character, hoping for a good ending (husn al-khatimah).",
      "A poor ending (su' al-khatimah) is feared for persistent sin without repentance — yet the door of tawbah remains open until the soul reaches the throat.",
      "The Angel of Death takes souls by Allah's command. Descriptions in Qur'an and Sunnah teach awe and preparation without indulging unverified details.",
      "What benefits the deceased after death includes ongoing charity (sadaqah jariyah), beneficial knowledge, and a righteous child who supplicates for them — as in authentic hadith.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 185,
        label: "Qur'an 3:185",
        excerpt:
          "Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection.",
      },
      {
        surah: 32,
        ayahFrom: 11,
        label: "Qur'an 32:11",
        excerpt:
          "Say: The Angel of Death, who has been entrusted with you, will take you; then to your Lord you will be returned.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1631",
        grade: "sahih",
        excerpt:
          "When a person dies, his deeds are cut off except for ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "6512",
        grade: "sahih",
        excerpt: "Remember often the destroyer of pleasures — death.",
      },
    ],
    actions: [
      "Increase istighfar and salah — especially when health is good.",
      "Support causes that outlive you: knowledge, charity, and raising children upon tawheed.",
    ],
    appLinks: [
      { label: "Learn Dua — supplications", route: "/learn-dua" },
      { label: "Zakat & charity", route: "/zakat" },
    ],
  },
  {
    id: "barzakh",
    section: "journey",
    title: "Barzakh (life in the grave)",
    summary: "The interval after death until resurrection — questioning and its consequences.",
    body: [
      "Barzakh is the barrier between this world and the Day of Resurrection. The soul experiences a taste of what is to come before the final judgment.",
      "Authentic reports describe questioning in the grave about one's Lord, religion, and prophet. Correct answers bring expansion and light; failure brings constriction — by Allah's wisdom.",
      "Bliss and punishment in the grave are affirmed in sahih and hasan reports. Matters of the unseen are presented only from these sources, not from folklore.",
      "The grave reminds the living to prepare: what you send ahead of deeds and what you leave behind in legacy matter.",
    ],
    quran: [
      {
        surah: 23,
        ayahFrom: 99,
        label: "Qur'an 23:99–100",
        excerpt:
          "Until, when death comes to one of them, he says: My Lord, send me back that I might do righteousness… No — it is only a word he says.",
      },
      {
        surah: 40,
        ayahFrom: 46,
        label: "Qur'an 40:46",
        excerpt:
          "The Fire — they are exposed to it morning and evening. And the Day the Hour appears…",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2870",
        grade: "sahih",
        excerpt:
          "The grave is either a garden from the gardens of Paradise or a pit from the pits of Hell.",
      },
      {
        collection: "Sunan al-Tirmidhi",
        citation: "1071",
        grade: "hasan",
        excerpt:
          "When the deceased is buried, two angels question him about his Lord, his religion, and his prophet.",
      },
    ],
    misconceptions: [
      "Misconception: The names Munkar and Nakir appear in the strongest sahih collections as a pair. Correction: Questioning in the grave is well established; some naming reports are weaker — focus on preparation, not dispute over labels.",
    ],
    appLinks: [{ label: "Morning & evening adhkar", route: "/zikr" }],
  },

  // ── Signs ──────────────────────────────────────────────────────────────────
  {
    id: "signs-overview",
    section: "signs",
    title: "Signs of the Last Day",
    summary: "Minor and major signs — certainty of the Hour, unknown timing.",
    body: [
      "The Hour is certain; its exact time is known only to Allah. Authentic texts describe minor signs (gradual social changes) and major signs (dramatic events near the end).",
      "Some minor signs — widespread dishonesty, loss of knowledge, time passing quickly, competition in tall buildings — are discussed by scholars in light of modern changes, without claiming certainty about every application.",
      "Major signs include al-Mahdi, the Dajjal, the descent of 'Isa (peace be upon him), Ya'juj and Ma'juj, and the sun rising from the west — in authentic hadith. Sequence details differ among scholars.",
      "The prophetic method: increase iman, repentance, and beneficial deeds rather than endless speculation or fear-mongering.",
    ],
    quran: [
      {
        surah: 7,
        ayahFrom: 187,
        label: "Qur'an 7:187",
        excerpt: "They ask you about the Hour… its knowledge is only with my Lord.",
      },
      {
        surah: 47,
        ayahFrom: 18,
        label: "Qur'an 47:18",
        excerpt: "Do they await except the Hour? Some of its signs have already come.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2901",
        grade: "sahih",
        excerpt: "The Hour will not come until you see ten signs…",
      },
    ],
    appLinks: [
      { label: "Minor signs", route: "/last-day/minor-signs" },
      { label: "Major signs", route: "/last-day/major-signs" },
    ],
  },
  {
    id: "minor-signs",
    section: "signs",
    title: "Minor signs",
    summary: "Gradual changes the Prophet ﷺ described — preparation over panic.",
    body: [
      "Minor signs are widespread social and moral shifts that increase as the Hour approaches. They are numerous in hadith literature.",
      "Examples in authentic reports include: honesty disappearing until no trustworthy person remains; bare-footed shepherds competing in building tall structures; increase in killing; knowledge taken away while ignorance spreads; and time seeming to pass quickly.",
      "Scholars caution against claiming every modern event is a specific sign — the principle is to recognize the general trend and return to Allah.",
      "Loss of knowledge here means loss of practice and scholars, not absence of information — a reminder to learn and apply Islam sincerely.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1036",
        grade: "sahih",
        excerpt:
          "When honesty is lost, wait for the Hour… when the destitute barefoot shepherds compete in building tall structures.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "7061",
        grade: "sahih",
        excerpt:
          "The Hour will not come until knowledge is taken away, earthquakes increase, and time passes quickly.",
      },
    ],
    disclaimer:
      "Applying specific minor signs to current events is interpretive. This module presents the hadith without asserting which modern phenomena fulfill them.",
    actions: [
      "Seek beneficial knowledge and teach it.",
      "Guard truthfulness in speech and business.",
    ],
  },
  {
    id: "major-signs",
    section: "signs",
    title: "Major signs",
    summary: "Ten major signs in Sahih Muslim — Mahdi, Dajjal, 'Isa, and more.",
    body: [
      "Major signs are dramatic events near the end of time. Sahih Muslim narrates ten signs including the Dajjal, descent of 'Isa ibn Maryam, Ya'juj and Ma'juj, three landslides, the smoke (Dukhan), the beast (Dabbat al-Ard), the sun rising from the west, and fire driving people to the place of gathering.",
      "Al-Mahdi appears in authentic reports as a righteous leader from the Prophet's ﷺ lineage before the Dajjal. Details and timing are among matters scholars discuss carefully.",
      "'Isa (peace be upon him) will descend, kill the Dajjal, and establish justice according to authentic hadith — a core belief in Sunni creed.",
      "Scholars differ on the order of some major signs. Authenticity grades vary for individual reports about Dukhan and Dabbat al-Ard — they are mentioned in the famous ten-signs hadith in Muslim.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2901",
        grade: "sahih",
        excerpt:
          "The Hour will not come until you see ten signs: the smoke, the Dajjal, the beast, the rising of the sun from the west, the descent of 'Isa ibn Maryam, Ya'juj and Ma'juj, and three landslides…",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "3439",
        grade: "sahih",
        excerpt:
          "How will you be when the son of Maryam descends among you and your imam is from among you?",
      },
    ],
    disclaimer:
      "Sequence and timing of major signs are not fully agreed upon. Avoid date-setting or claiming certainty about current figures.",
    appLinks: [{ label: "Learn Aqeedah — signs", route: "/aqeedah/signs-last-day" }],
  },

  // ── Events of the Last Day ─────────────────────────────────────────────────
  {
    id: "trumpet",
    section: "events",
    title: "The Trumpet",
    summary: "Israfil — first blast, second blast, and resurrection.",
    body: [
      "The angel entrusted with the Trumpet (Israfil, in authentic reports) will blow when Allah commands.",
      "The first blast causes all creation in the heavens and earth to swoon or die. The second blast brings resurrection.",
      "The Qur'an describes the Trumpet and the terror of that Day — awakening to stand before Allah without prior warning for the heedless.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 68,
        label: "Qur'an 39:68",
        excerpt:
          "The Trumpet will be blown, and whoever is in the heavens and earth will fall dead except whom Allah wills.",
      },
      {
        surah: 50,
        ayahFrom: 20,
        label: "Qur'an 50:20",
        excerpt: "And the Trumpet will be blown. That is the Day of Warning.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "4810",
        grade: "sahih",
        excerpt: "How can I relax when the one with the Trumpet has placed it to his mouth…?",
      },
    ],
  },
  {
    id: "resurrection",
    section: "events",
    title: "Resurrection",
    summary: "Bodies restored — universality of standing before Allah.",
    body: [
      "Resurrection is bodily and real. Allah who created mankind from nothing can recreate them from dust and bones.",
      "All nations will be raised — none exempt. The first to be clothed on the Mahshar will be Ibrahim (peace be upon him), in authentic hadith.",
      "Qur'anic proofs emphasize Allah's power over creation and the certainty of return to Him.",
    ],
    quran: [
      {
        surah: 36,
        ayahFrom: 78,
        ayahTo: 79,
        label: "Qur'an 36:78–79",
        excerpt:
          "Who gives life to bones when they are decayed? Say: The One who produced them the first time.",
      },
      {
        surah: 22,
        ayahFrom: 7,
        label: "Qur'an 22:7",
        excerpt: "The Hour is coming — no doubt — and Allah will resurrect those in the graves.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6527",
        grade: "sahih",
        excerpt: "People will be gathered barefoot, naked, and uncircumcised.",
      },
    ],
  },
  {
    id: "gathering",
    section: "events",
    title: "The Gathering (Mahshar)",
    summary: "Standing before Allah — sun near, sweat, and states of people.",
    body: [
      "All people are gathered in one plain for judgment. The sun draws near until people sink in sweat according to their deeds — in sahih reports.",
      "Different states are described: some shaded under Allah's throne, some given light proportional to their faith, others in distress.",
      "The length of the Day feels immense — fifty thousand years by one measure in the Qur'an — yet Allah eases it for the believer.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 104,
        label: "Qur'an 21:104",
        excerpt:
          "The Day We will fold the heaven like the folding of a scroll… as We began the first creation, We will repeat it.",
      },
      {
        surah: 70,
        ayahFrom: 4,
        label: "Qur'an 70:4",
        excerpt:
          "The angels and the Spirit ascend to Him in a Day whose measure is fifty thousand years.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2865",
        grade: "sahih",
        excerpt:
          "The sun will be brought near until it is about a mile away. People will sink in sweat according to their deeds.",
      },
    ],
  },
  {
    id: "intercession",
    section: "events",
    title: "Intercession (Shafa'ah)",
    summary: "By Allah's permission only — types and the greatest intercession.",
    body: [
      "Shafa'ah means intercession — speaking on behalf of another before Allah. It is real but never independent of His permission and pleasure.",
      "Types mentioned in authentic reports include the Prophet's ﷺ greatest intercession (al-Shafa'ah al-'Udhma), intercession for believers to enter Paradise, and intercession for reduction of punishment.",
      "Prophets, angels, believers, and even children who died young may intercede by permission — details vary in narration strength.",
      "Intercession never replaces the need for faith and repentance in this life. Calling upon the dead for help now is shirk — distinct from Hereafter intercession granted by Allah.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 255,
        label: "Qur'an 2:255",
        excerpt: "Who can intercede with Him except by His permission?",
      },
      {
        surah: 20,
        ayahFrom: 109,
        label: "Qur'an 20:109",
        excerpt:
          "Intercession will not benefit except one to whom the Most Merciful has given permission.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7440",
        grade: "sahih",
        excerpt: "Ask and you will be given, intercede and your intercession will be accepted.",
      },
    ],
    misconceptions: [
      "Misconception: Intercession means worship of the Prophet ﷺ. Correction: Worship is for Allah alone; shafa'ah on the Last Day is a mercy Allah grants to whom He wills.",
    ],
  },
  {
    id: "record-of-deeds",
    section: "events",
    title: "The Record of Deeds",
    summary: "Recording angels — right hand, left hand, nothing omitted.",
    body: [
      "Noble recording angels write every deed. The believer hopes for the record in the right hand; the wicked fear the record behind the back or in the left.",
      "Nothing is omitted — even an atom's weight. Intentions matter alongside outward deeds.",
      "Accountability includes what the limbs earned and what the tongue said.",
    ],
    quran: [
      {
        surah: 18,
        ayahFrom: 49,
        label: "Qur'an 18:49",
        excerpt:
          "The record will be placed, and you will see the criminals fearful of what is within it.",
      },
      {
        surah: 69,
        ayahFrom: 19,
        ayahTo: 25,
        label: "Qur'an 69:19–25",
        excerpt:
          "Whoever is given his record in his right hand… and whoever is given his record in his left…",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7501",
        grade: "sahih",
        excerpt:
          "Guard your tongue… Do you not hear that the people of Hell are thrown into it for what their tongues harvested?",
      },
    ],
    actions: [
      "Guard the tongue.",
      "Review your day before sleep — what would you want in your record?",
    ],
    appLinks: [{ label: "Prayer journal", route: "/journal" }],
  },
  {
    id: "scale",
    section: "events",
    title: "The Scale (Mizan)",
    summary: "Deeds weighed — sincerity, character, and dhikr make scales heavy.",
    body: [
      "The Mizan weighs deeds with perfect justice. Heavy scales bring joy; light scales bring ruin.",
      "What weighs heavy includes sincere faith, good character, phrases of dhikr that are light on the tongue but heavy on the scale, and deeds done purely for Allah.",
      "Hypocrisy and showing off can hollow deeds — sincerity (ikhlas) is essential.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 47,
        label: "Qur'an 21:47",
        excerpt: "We place the just scales… so no soul will be wronged at all.",
      },
      {
        surah: 101,
        ayahFrom: 6,
        ayahTo: 9,
        label: "Qur'an 101:6–9",
        excerpt: "As for one whose scales are heavy… as for one whose scales are light…",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6406",
        grade: "sahih",
        excerpt:
          "Two phrases beloved to the Most Merciful, light on the tongue, heavy on the scale: SubhanAllahi wa bihamdihi, SubhanAllahil-Azim.",
      },
    ],
    appLinks: [
      { label: "Tasbeeh", route: "/tasbeeh/free" },
      { label: "Adhkar", route: "/zikr" },
    ],
  },
  {
    id: "accountability",
    section: "events",
    title: "Accountability (Hisab)",
    summary: "Easy reckoning, detailed reckoning, and rights owed to others.",
    body: [
      "Hisab is the reckoning. Some receive an easy account — shown their deeds and forgiven much. Others face detailed questioning.",
      "Rights of people are not forgiven by Allah until they are settled — oppression, slander, and unpaid debts must be addressed in this life through repentance and restitution.",
      "Allah's justice is perfect; His mercy encompasses those who tried sincerely and repented.",
    ],
    quran: [
      {
        surah: 84,
        ayahFrom: 7,
        ayahTo: 9,
        label: "Qur'an 84:7–9",
        excerpt: "Whoever is given his record in his right hand will have an easy account.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "295",
        grade: "sahih",
        excerpt: "Whoever is given his record in his right hand will have an easy reckoning.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2581",
        grade: "sahih",
        excerpt:
          "Do you know who is bankrupt? One who comes with prayer and fasting but abused and slandered people.",
      },
    ],
    actions: [
      "Settle debts and apologize where you have wronged someone.",
      "Ask forgiveness from people you have harmed before it is too late.",
    ],
    appLinks: [{ label: "Qaza & debts", route: "/qaza" }],
  },
  {
    id: "hawd",
    section: "events",
    title: "The Pond (Hawd)",
    summary: "The Prophet's ﷺ basin — who drinks and who is turned away.",
    body: [
      "The Hawd is a vast basin given to Prophet Muhammad ﷺ on the Day of Resurrection. Its water is whiter than milk and sweeter than honey — in sahih descriptions.",
      "His ummah drinks from it. Some are turned away — described in reports as those who innovated major deviation after his time. Scholars discuss the exact meaning carefully.",
      "Reaching the Hawd is a mercy to hope for through following the Sunnah and unity of the ummah.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6579",
        grade: "sahih",
        excerpt: "My Hawd is wider than the distance between Aden and 'Amman…",
      },
      {
        collection: "Sahih Muslim",
        citation: "247",
        grade: "sahih",
        excerpt: "I will be at my Hawd waiting for those of you who will come to me…",
      },
    ],
    disclaimer:
      "Reports about those turned away from the Hawd refer to specific categories mentioned in hadith — not a license for Muslims to declare others misguided.",
  },
  {
    id: "sirat",
    section: "events",
    title: "The Bridge (Sirat)",
    summary: "Crossing over Hell — speed according to deeds and mercy.",
    body: [
      "The Sirat is a bridge over Hell that every person must cross. Qur'an 19:71 affirms passage; salvation is for those Allah protects.",
      "Speeds vary in authentic narrations: like lightning, wind, running, crawling — and some fall, may Allah protect us.",
      "Righteous deeds, prayer, charity, and good character lighten the crossing. The Prophet ﷺ will intercede for believers to cross.",
      "Avoid speculation about the bridge's physical nature beyond what revelation states — focus on deeds that help you cross safely.",
    ],
    quran: [
      {
        surah: 19,
        ayahFrom: 71,
        ayahTo: 72,
        label: "Qur'an 19:71–72",
        excerpt:
          "There is none among you except that he will pass over it… Then We will save those who were mindful of Allah.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6573",
        grade: "sahih",
        excerpt:
          "Some cross like lightning, some like wind, some running, some crawling — and some fall.",
      },
    ],
    actions: ["Pray on time.", "Give charity regularly.", "Keep ties of kinship."],
  },

  // ── Outcomes ───────────────────────────────────────────────────────────────
  {
    id: "paradise",
    section: "outcomes",
    title: "Paradise",
    summary: "Concise overview — eternal reward; explore Journey to Jannah for depth.",
    body: [
      "Jannah is the eternal home prepared for believers — beyond imagination, with the greatest reward being Allah's pleasure and vision of Him (in interpretations affirmed by many scholars).",
      "Entry is by Allah's mercy, through faith and righteous deeds. The Last Day concludes with the people of Paradise in lasting bliss.",
      "This module does not duplicate the full Journey to Jannah guide — explore that module for gates, ranks, duas, and paths of deeds.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 133,
        label: "Qur'an 3:133",
        excerpt:
          "Race toward forgiveness from your Lord and a Garden as wide as the heavens and earth.",
      },
    ],
    appLinks: [
      { label: "Journey to Jannah", route: "/jannah" },
      { label: "Learn Aqeedah — Paradise", route: "/aqeedah/paradise" },
    ],
  },
  {
    id: "hell",
    section: "outcomes",
    title: "Hell",
    summary: "Concise overview — true warning; explore Understanding Jahannam for depth.",
    body: [
      "Jahannam is a real abode of punishment — a warning to return to Allah before it is too late. It is part of believing the unseen and divine justice.",
      "Warnings are meant to prevent arrogance and persistent rejection of truth, balanced with hope in repentance while alive.",
      "For a fuller treatment of warnings, major sins, repentance, and mercy, explore the Understanding Jahannam module and related aqeedah topics.",
    ],
    quran: [
      {
        surah: 67,
        ayahFrom: 6,
        label: "Qur'an 67:6",
        excerpt: "For those who disbelieved in their Lord is the punishment of Hell.",
      },
    ],
    appLinks: [
      { label: "Understanding Jahannam", route: "/jahannam" },
      { label: "Learn Aqeedah — Hell", route: "/aqeedah/hell" },
    ],
  },
  {
    id: "without-reckoning",
    section: "outcomes",
    title: "Who enters without reckoning?",
    summary: "Authentic hadith on those who bypass detailed hisab — scholarly discussion.",
    body: [
      "Sahih al-Bukhari mentions seventy thousand of the ummah entering Paradise without reckoning — those who do not seek ruqyah, do not cauterize, and trust in their Lord, in one wording.",
      "Scholars broaden or interpret this category to include others Allah wills — the core is Allah's mercy exceeding human expectation for the sincere.",
      "This is not a excuse for negligence — it inspires hope and tawakkul alongside striving in worship.",
      "Characteristics in reports point to tawakkul, avoiding superstitious practices, and sincerity — not to a checklist for arrogance.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "654",
        grade: "sahih",
        excerpt: "Seventy thousand of my ummah will enter Paradise without reckoning…",
      },
      {
        collection: "Sahih Muslim",
        citation: "295",
        grade: "sahih",
        excerpt:
          "Whoever is given his record in his right hand will have an easy reckoning — not necessarily the same as without reckoning; scholars discuss layers of mercy.",
      },
    ],
    disclaimer:
      "Scholars differ whether 'without reckoning' is literal for a fixed number or includes broader categories. All agree ultimate salvation is by Allah's mercy.",
  },

  // ── Practice ───────────────────────────────────────────────────────────────
  {
    id: "preparing",
    section: "practice",
    title: "Preparing for the Last Day",
    summary: "Practical worship — connect every habit to your meeting with Allah.",
    importance: "foundational",
    body: [
      "Preparation is not panic — it is consistent worship. Tawheed and sincerity are the foundation of every deed accepted by Allah.",
      "Salah on time anchors the day. Qur'an recitation and reflection feed the heart. Repentance (tawbah) clears the record. Charity purifies wealth. Dhikr keeps the tongue moist with remembrance.",
      "Good character — especially guarding the tongue and fulfilling trusts — prevents bankrupting deeds on the Last Day.",
      "Rights of others must be settled: debts, apologies, and fairness in dealings. Use Munib's trackers not as a score but as healthy habits pointing toward Allah.",
    ],
    quran: [
      {
        surah: 51,
        ayahFrom: 56,
        label: "Qur'an 51:56",
        excerpt: "I did not create jinn and mankind except to worship Me.",
      },
      {
        surah: 66,
        ayahFrom: 8,
        label: "Qur'an 66:8",
        excerpt: "O believers, turn to Allah in sincere repentance.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1",
        grade: "sahih",
        excerpt: "Actions are judged by intentions.",
      },
    ],
    actions: [
      "Pray the five daily prayers on time.",
      "Read or listen to Qur'an daily — even a few ayahs.",
      "Morning and evening adhkar.",
      "Give charity regularly — even small amounts.",
      "Repent daily and seek forgiveness.",
      "Review character: tongue, honesty, and keeping promises.",
      "Fulfill rights owed to family, neighbours, and creditors.",
      "Reflect in your prayer journal on khushu and sincerity.",
    ],
    appLinks: [
      { label: "My Preparation dashboard", route: "/last-day/preparation" },
      { label: "Learn Salah", route: "/salah-guide" },
      { label: "Learn Qur'an", route: "/learn-quran" },
      { label: "Learn Dua", route: "/learn-dua" },
      { label: "Learn Aqeedah", route: "/aqeedah" },
      { label: "Prayer tracker", route: "/tracker" },
    ],
  },
];
