import type { AqeedahTopic } from "../types/aqeedah";

export { AQEDAH_GLOSSARY } from "./aqeedah-glossary";

/**
 * Learn Aqeedah — core creed topics based on clear Qur'an and authentic Sunnah.
 * This module presents broad Sunni agreement and notes differences respectfully.
 * Bump the version when content changes.
 */
export const AQEDAH_CONTENT_VERSION = 1;

export const AQEDAH_SECTION_ORDER = [
  "intro",
  "articles",
  "tawheed",
  "afterlife",
  "signs",
  "reference",
] as const;

export const AQEDAH_TOPICS: AqeedahTopic[] = [
  // ── Introduction ────────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "intro",
    title: "Introduction",
    summary: "Aqeedah is the foundation of faith that shapes worship, character, and purpose.",
    importance: "foundational",
    body: [
      "Aqeedah means the core beliefs a Muslim holds with conviction: belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree (qadr).",
      "In Sunni scholarship, aqeedah is taken first from the Qur'an, then authentic Sunnah, with the understanding of the Prophet's companions and early generations.",
      "Correct belief protects worship from confusion and keeps the heart balanced between hope, fear, trust, gratitude, and repentance.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 177,
        label: "Qur'an 2:177",
        excerpt:
          "Righteousness is to believe in Allah, the Last Day, the angels, the Book, and the prophets.",
      },
      {
        surah: 4,
        ayahFrom: 136,
        label: "Qur'an 4:136",
        excerpt:
          "Believe in Allah, His Messenger, the Book He sent down, and the scripture He sent before.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt:
          "Iman is to believe in Allah, His angels, His books, His messengers, the Last Day, and divine decree, its good and its difficult.",
      },
    ],
    appLinks: [
      { label: "Names of Allah", route: "/names-of-allah" },
      { label: "Path to Jannah", route: "/jannah" },
    ],
  },
  {
    id: "what-is-aqeedah",
    section: "intro",
    title: "What Is Aqeedah?",
    summary: "Aqeedah is not philosophy class; it is lived belief rooted in revelation.",
    body: [
      "Aqeedah is what the heart affirms with certainty and what appears in worship and conduct. It is not merely abstract theory.",
      "Muslim scholars wrote aqeedah summaries to preserve clarity and protect ordinary believers from confusion, exaggeration, and denial.",
      "Differences in wording may exist between Sunni schools, but the shared essentials are one: Allah's oneness, truthfulness of revelation, and accountability in the Hereafter.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 7,
        label: "Qur'an 3:7",
        excerpt:
          "Those firmly grounded in knowledge say: We believe in it; all of it is from our Lord.",
      },
    ],
    actions: [
      "Learn aqeedah from reliable scholars and primary texts.",
      "Connect every belief point to worship and daily choices.",
    ],
  },
  {
    id: "why-aqeedah-matters",
    section: "intro",
    title: "Why Aqeedah Matters",
    summary: "Sound creed gives spiritual stability and protects from extremes.",
    body: [
      "When belief is sound, deeds become sincere and consistent. When belief is shaky, practice often becomes unstable or purely emotional.",
      "Aqeedah helps believers handle hardship, blessings, uncertainty, and death with patience and trust in Allah.",
      "It also teaches adab in disagreement: hold firmly to clear fundamentals while showing respect in secondary scholarly differences.",
    ],
    quran: [
      {
        surah: 14,
        ayahFrom: 27,
        label: "Qur'an 14:27",
        excerpt:
          "Allah keeps firm those who believe with the firm word in worldly life and in the Hereafter.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2664",
        grade: "sahih",
        excerpt:
          "Be eager for what benefits you, seek help from Allah, and do not become helpless.",
      },
    ],
  },

  // ── Six Articles ────────────────────────────────────────────────────────────
  {
    id: "six-articles",
    section: "articles",
    title: "The Six Articles of Iman",
    summary: "The Prophet ﷺ summarized iman in six foundational beliefs.",
    importance: "foundational",
    body: [
      "The famous hadith of Jibril defines iman through six beliefs accepted across Sunni scholarship.",
      "These six are interconnected: belief in revelation and messengers leads to accountability in the Last Day, and belief in qadr teaches trust and humility.",
      "Learning them in order helps build a clear, balanced worldview for worship and life decisions.",
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
    appLinks: [{ label: "Aqeedah glossary", route: "/aqeedah/glossary" }],
  },
  {
    id: "belief-allah",
    section: "articles",
    title: "Belief in Allah",
    summary: "Belief in Allah includes His lordship, worship, names, and attributes.",
    importance: "foundational",
    body: [
      "Belief in Allah begins with certainty that He alone created, owns, and governs all things.",
      "He alone deserves all worship: prayer, dua, reliance, fear, hope, sacrifice, and love in the highest sense.",
      "Sunni scholarship affirms Allah's beautiful names and perfect attributes as revealed, without likening Him to creation and without denying what He affirmed for Himself.",
    ],
    quran: [
      {
        surah: 112,
        ayahFrom: 1,
        ayahTo: 4,
        label: "Qur'an 112:1–4",
        excerpt: "He is Allah, One… There is nothing comparable to Him.",
      },
      {
        surah: 7,
        ayahFrom: 180,
        label: "Qur'an 7:180",
        excerpt: "To Allah belong the most beautiful names, so call upon Him by them.",
      },
    ],
    appLinks: [{ label: "Explore Names of Allah", route: "/names-of-allah" }],
  },
  {
    id: "belief-angels",
    section: "articles",
    title: "Belief in Angels",
    summary: "Angels are honored servants of Allah who never disobey Him.",
    body: [
      "Angels are unseen beings created from light. They worship Allah continuously and carry out His commands perfectly.",
      "Belief in angels reminds a Muslim that revelation, records of deeds, and events of the Hereafter are real and near.",
      "Major angels include Jibril (revelation), Mikail (provision), Israfil (the Trumpet), and Malak al-Mawt (angel of death).",
    ],
    quran: [
      {
        surah: 66,
        ayahFrom: 6,
        label: "Qur'an 66:6",
        excerpt:
          "Over it are angels, stern and mighty, who do not disobey Allah in what He commands.",
      },
      {
        surah: 2,
        ayahFrom: 97,
        label: "Qur'an 2:97",
        excerpt:
          "Whoever is an enemy to Jibril — he brought it down upon your heart by Allah's permission.",
      },
    ],
  },
  {
    id: "belief-books",
    section: "articles",
    title: "Belief in the Divine Books",
    summary: "Allah sent scriptures as guidance; the Qur'an confirms and supersedes earlier texts.",
    body: [
      "Muslims believe Allah revealed scriptures to His messengers, including the Torah, Zabur, Injil, and finally the Qur'an.",
      "The Qur'an is preserved and final, serving as the criterion over prior scriptures whose original forms were altered over time.",
      "Belief in the books means honoring revelation, reading the Qur'an with reflection, and submitting to its guidance.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 48,
        label: "Qur'an 5:48",
        excerpt:
          "We revealed to you the Book in truth, confirming what came before it and as a criterion over it.",
      },
      {
        surah: 15,
        ayahFrom: 9,
        label: "Qur'an 15:9",
        excerpt: "Indeed, We sent down the Reminder, and indeed, We will preserve it.",
      },
    ],
    appLinks: [{ label: "Read Qur'an", route: "/quran" }],
  },
  {
    id: "belief-prophets",
    section: "articles",
    title: "Belief in the Prophets",
    summary: "All prophets conveyed truth; Muhammad ﷺ is the final messenger.",
    body: [
      "A Muslim believes in all prophets sent by Allah without rejecting any of them. They called to tawheed and upright living.",
      "Prophets are the best of creation in truthfulness and trustworthiness, while still human and not objects of worship.",
      "Muhammad ﷺ is the final prophet, and his message is universal until the Day of Judgment.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 285,
        label: "Qur'an 2:285",
        excerpt: "We make no distinction between any of His messengers.",
      },
      {
        surah: 33,
        ayahFrom: 40,
        label: "Qur'an 33:40",
        excerpt:
          "Muhammad is not the father of any of your men, but the Messenger of Allah and the seal of the prophets.",
      },
    ],
    appLinks: [{ label: "Stories of Prophets", route: "/prophets" }],
  },
  {
    id: "belief-last-day",
    section: "articles",
    title: "Belief in the Last Day",
    summary: "Life has a final meeting with Allah, justice, and eternal outcomes.",
    body: [
      "Belief in the Last Day includes resurrection, gathering, judgment, the scale, the bridge, Paradise, and Hell.",
      "This belief disciplines choices: hidden deeds are known to Allah and nothing good or harmful is truly lost.",
      "Sunni scholars agree on the certainty of these realities while differing on some detailed interpretations of specific signs.",
    ],
    quran: [
      {
        surah: 99,
        ayahFrom: 6,
        ayahTo: 8,
        label: "Qur'an 99:6–8",
        excerpt:
          "Whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.",
      },
    ],
    appLinks: [
      { label: "The Day of Judgment", route: "/last-day" },
      { label: "Journey to Jannah", route: "/jannah" },
    ],
  },
  {
    id: "belief-qadr",
    section: "articles",
    title: "Belief in Qadr (Divine Decree)",
    summary: "Allah's knowledge and decree are complete; humans still choose and are accountable.",
    body: [
      "Belief in qadr means Allah eternally knows all things, wrote them, wills what occurs, and creates all that exists.",
      "At the same time, people have real will and choice within what Allah has allowed; this is why commands, prohibitions, reward, and accountability are meaningful.",
      "Sunni scholars reject both extremes: denying divine decree and fatalism that cancels human responsibility.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt: "Iman includes belief in divine decree, its good and its difficult.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2664",
        grade: "sahih",
        excerpt:
          "Be eager for what benefits you, seek help from Allah… if something happens, say: Qaddar Allah wa ma sha'a fa'al.",
      },
    ],
    quran: [
      {
        surah: 54,
        ayahFrom: 49,
        label: "Qur'an 54:49",
        excerpt: "Indeed, We created everything according to a measure.",
      },
      {
        surah: 13,
        ayahFrom: 11,
        label: "Qur'an 13:11",
        excerpt:
          "Allah does not change the condition of a people until they change what is in themselves.",
      },
    ],
    misconceptions: [
      "Misconception: If everything is decreed, effort is useless. Correction: Islam commands effort, prayer, planning, and repentance while trusting Allah's decree.",
      "Misconception: Qadr means blaming Allah for sin. Correction: A person chooses sin and is accountable; qadr is not an excuse for disobedience.",
      "Misconception: Hardship always means Allah hates me. Correction: Trials may be purification, elevation, warning, or a call back to Allah.",
    ],
    actions: [
      "Take means with excellence, then rely on Allah.",
      "Replace regret loops with 'Qaddar Allah' and constructive action.",
    ],
  },

  // ── Tawheed & Heart Work ───────────────────────────────────────────────────
  {
    id: "tawheed-explained",
    section: "tawheed",
    title: "Tawheed Explained",
    summary: "Tawheed gathers lordship, worship, and Allah's names and attributes.",
    importance: "foundational",
    body: [
      "Tawheed is to single out Allah in all acts of worship and to affirm His perfection as He described Himself.",
      "Sunni teaching commonly explains tawheed through three connected aspects: Allah's lordship, His sole right to worship, and His names and attributes.",
      "This framework is educational, not a source of division; its purpose is to help believers protect sincerity and avoid confusion.",
    ],
    quran: [
      {
        surah: 1,
        ayahFrom: 5,
        label: "Qur'an 1:5",
        excerpt: "You alone we worship, and You alone we ask for help.",
      },
      {
        surah: 20,
        ayahFrom: 8,
        label: "Qur'an 20:8",
        excerpt: "Allah — there is no deity except Him. To Him belong the most beautiful names.",
      },
    ],
    misconceptions: [
      "Misconception: Tawheed is only saying one sentence. Correction: It includes heart, speech, and worship practice.",
      "Misconception: Knowing Allah is Creator is enough. Correction: Even many disbelievers acknowledged creation but still failed in worshipping Allah alone.",
    ],
    appLinks: [
      { label: "Names of Allah", route: "/names-of-allah" },
      { label: "Jannah path: Tawheed", route: "/jannah" },
    ],
  },
  {
    id: "shirk-explained",
    section: "tawheed",
    title: "Shirk Explained",
    summary: "Shirk is directing any exclusive right of Allah to other than Him.",
    importance: "foundational",
    body: [
      "Major shirk is to direct worship to other than Allah, such as invoking the unseen for independent aid, sacrifice, or vows for created beings.",
      "Minor shirk includes forms of showing off (riya) and oath statements that compromise pure devotion.",
      "Sunni scholars stress care in language: warning against shirk is essential, but declaring specific people guilty requires knowledge, evidence, and justice.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 48,
        label: "Qur'an 4:48",
        excerpt:
          "Allah does not forgive association with Him, but forgives less than that for whom He wills.",
      },
      {
        surah: 31,
        ayahFrom: 13,
        label: "Qur'an 31:13",
        excerpt: "Associating partners with Allah is indeed a great ظلم (injustice).",
      },
    ],
    hadith: [
      {
        collection: "Musnad Ahmad",
        citation: "23630",
        grade: "sahih",
        excerpt: "What I fear most for you is minor shirk: showing off.",
      },
    ],
    misconceptions: [
      "Misconception: Every mistake in wording is major shirk. Correction: Scholars distinguish levels and judge carefully with evidence.",
      "Misconception: Warning against shirk means harshness toward people. Correction: The prophetic way combines clarity with mercy and teaching.",
    ],
  },
  {
    id: "sincerity",
    section: "tawheed",
    title: "Sincerity (Ikhlas)",
    summary: "Acts are accepted by intention and purity for Allah alone.",
    body: [
      "Ikhlas means seeking Allah's pleasure, not status, praise, or control over people.",
      "A small deed with sincerity can outweigh many outwardly impressive deeds done for reputation.",
      "Sincerity is renewed repeatedly; believers ask Allah for protection from hidden riya and self-deception.",
    ],
    quran: [
      {
        surah: 98,
        ayahFrom: 5,
        label: "Qur'an 98:5",
        excerpt: "They were commanded only to worship Allah sincerely in religion.",
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
    appLinks: [{ label: "Learn dua and intentions", route: "/learn-dua" }],
  },
  {
    id: "love-fear-allah",
    section: "tawheed",
    title: "Love and Fear of Allah",
    summary: "A sound heart balances love, reverence, and humble fear.",
    body: [
      "Love of Allah is the foundation of worship, and fear of Him protects from sin and heedlessness.",
      "Sunni scholars teach balance: love without fear may lead to carelessness, and fear without hope can lead to despair.",
      "Practical balance appears in prayer, repentance, service to others, and patience in hardship.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 165,
        label: "Qur'an 2:165",
        excerpt: "Those who believe are stronger in love for Allah.",
      },
      {
        surah: 7,
        ayahFrom: 56,
        label: "Qur'an 7:56",
        excerpt: "Call upon Him in fear and hope.",
      },
    ],
    appLinks: [
      { label: "Names of Allah", route: "/names-of-allah" },
      { label: "Supplications", route: "/learn-dua" },
    ],
  },
  {
    id: "hope-repentance",
    section: "tawheed",
    title: "Hope and Repentance",
    summary: "No sin is too great for sincere tawbah and hope in Allah's mercy.",
    body: [
      "A believer never despairs of Allah's mercy and never feels safe from accountability; both hope and repentance are continuous.",
      "Repentance has conditions: stop the sin, regret it, resolve not to return, and restore others' rights when harmed.",
      "Scholars agree that doors of tawbah remain open until death; therefore spiritual growth is always possible.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt: "Do not despair of Allah's mercy; Allah forgives all sins.",
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
        collection: "Sahih Muslim",
        citation: "2749",
        grade: "sahih",
        excerpt:
          "Allah is more joyful with the repentance of His servant than one who finds his lost mount in a barren land.",
      },
    ],
    appLinks: [{ label: "Daily duas", route: "/learn-dua" }],
  },

  // ── Afterlife ───────────────────────────────────────────────────────────────
  {
    id: "paradise",
    section: "afterlife",
    title: "Paradise (Jannah)",
    summary: "Jannah is the eternal reward prepared for believers by Allah's mercy.",
    body: [
      "Jannah is real, everlasting, and beyond full human imagination. Its greatest reward is Allah's pleasure.",
      "Entry into Paradise is by Allah's mercy, while righteous faith and deeds are the means He accepts.",
      "Belief in Paradise encourages patience, generosity, and perseverance in worship.",
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
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3244",
        grade: "sahih",
        excerpt:
          "In Paradise are things no eye has seen, no ear has heard, and no heart has imagined.",
      },
    ],
    appLinks: [{ label: "Journey to Jannah", route: "/jannah" }],
  },
  {
    id: "hell",
    section: "afterlife",
    title: "Hell (Jahannam)",
    summary: "Jahannam is a true warning so hearts return to Allah before it is too late.",
    body: [
      "Belief in Hell is part of believing the unseen and divine justice.",
      "Warnings of punishment are meant to protect people from arrogance, oppression, and persistent rejection of truth.",
      "Sunni creed joins fear with hope: warnings are serious, and Allah's mercy remains vast for the repentant.",
    ],
    quran: [
      {
        surah: 67,
        ayahFrom: 6,
        label: "Qur'an 67:6",
        excerpt: "For those who disbelieved in their Lord is the punishment of Hell.",
      },
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt: "Do not despair of Allah's mercy.",
      },
    ],
    appLinks: [
      { label: "Understanding Jahannam", route: "/jahannam" },
      { label: "Repentance lesson", route: "/jahannam/repentance" },
    ],
  },
  {
    id: "resurrection",
    section: "afterlife",
    title: "Resurrection",
    summary: "After death, all people will be raised bodily for judgment.",
    body: [
      "Resurrection is bodily and real, not symbolic. Allah who created first can recreate with greater ease for us to understand.",
      "People return to Allah after barzakh, then stand in gathering awaiting judgment.",
      "Belief in resurrection gives meaning to moral responsibility and endurance under injustice.",
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
        excerpt:
          "The Hour is coming, no doubt about it, and Allah will resurrect those in the graves.",
      },
    ],
  },
  {
    id: "judgment-day",
    section: "afterlife",
    title: "The Day of Judgment",
    summary: "Every soul stands before Allah; justice is perfect and complete.",
    body: [
      "On Judgment Day, deeds, intentions, rights, and responsibilities are all accounted for with perfect justice.",
      "No tribe, class, language, or worldly status benefits without sincere faith and righteous action.",
      "This certainty calls believers to honesty, trustworthiness, and repairing wrongs before meeting Allah.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 47,
        label: "Qur'an 21:47",
        excerpt:
          "We place the just scales for the Day of Resurrection, so no soul will be wronged at all.",
      },
    ],
    appLinks: [{ label: "The Day of Judgment — full guide", route: "/last-day" }],
  },
  {
    id: "scale-sirat",
    section: "afterlife",
    title: "The Scale and the Sirat",
    summary: "Deeds are weighed, and people cross the bridge according to faith and deeds.",
    body: [
      "Sunni creed affirms the Mizan (scale) and the Sirat (bridge over Hell) as realities of the Hereafter.",
      "People's crossing differs by Allah's mercy and their deeds: some cross swiftly, others with hardship, and some fall.",
      "These teachings cultivate seriousness about character, worship, and rights of others.",
    ],
    quran: [
      {
        surah: 101,
        ayahFrom: 6,
        ayahTo: 9,
        label: "Qur'an 101:6–9",
        excerpt: "As for one whose scales are heavy… and as for one whose scales are light…",
      },
      {
        surah: 19,
        ayahFrom: 71,
        ayahTo: 72,
        label: "Qur'an 19:71–72",
        excerpt:
          "There is none among you except that he will pass over it; then We will save those who were mindful of Allah.",
      },
    ],
    appLinks: [
      { label: "The Scale (Mizan)", route: "/last-day/scale" },
      { label: "The Bridge (Sirat)", route: "/last-day/sirat" },
    ],
  },
  {
    id: "intercession",
    section: "afterlife",
    title: "Intercession (Shafa'ah)",
    summary: "Intercession is true but only by Allah's permission and for whom He is pleased with.",
    body: [
      "Intercession on the Last Day is affirmed in Qur'an and Sunnah. The greatest intercession belongs to Prophet Muhammad ﷺ.",
      "No one intercedes independently; all intercession happens only by Allah's permission and for those He allows.",
      "Scholars mention different categories of intercession in authentic reports, while agreeing that ultimate judgment remains Allah's alone.",
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
        excerpt:
          "The people will come to the Prophet ﷺ, and he will prostrate; then he will be told: Raise your head, ask and you will be given, intercede and your intercession will be accepted.",
      },
    ],
    misconceptions: [
      "Misconception: Intercession means no need for repentance. Correction: Intercession is by Allah's permission and never a license to persist in sin.",
      "Misconception: Anyone can be called upon for intercession now. Correction: Worship and dua are for Allah alone; intercession in the Hereafter is by His judgment.",
      "Misconception: Intercession opposes Allah's justice. Correction: It is one form of Allah's mercy within His perfect justice.",
    ],
    appLinks: [
      { label: "The Day of Judgment", route: "/last-day" },
      { label: "Journey to Jannah", route: "/jannah" },
    ],
  },

  // ── Signs ──────────────────────────────────────────────────────────────────
  {
    id: "signs-last-day",
    section: "signs",
    title: "Signs of the Last Day",
    summary: "Minor and major signs are true; focus on preparation over speculation.",
    body: [
      "Authentic texts mention minor and major signs before the Hour. Some minor signs have appeared, and major signs will occur near the end.",
      "Scholars may differ on sequence details of some signs, but they agree the Hour is certain and unknown in exact timing.",
      "The prophetic method is practical: increase iman, repentance, justice, and beneficial deeds rather than endless prediction debates.",
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
        excerpt:
          "The Hour will not come until you see ten signs… (including the Dajjal, descent of Isa, and others).",
      },
    ],
    misconceptions: [
      "Misconception: Every world event is definitely a final sign. Correction: Claims need authentic evidence and scholarly caution.",
      "Misconception: Knowing signs means we can date the Hour. Correction: The exact time is known only to Allah.",
    ],
    appLinks: [{ label: "Signs of the Last Day", route: "/last-day/signs-overview" }],
  },

  // ── Reference ───────────────────────────────────────────────────────────────
  {
    id: "faq",
    section: "reference",
    title: "Aqeedah FAQ",
    summary: "Common creed questions answered with balance, evidence, and adab.",
    body: [
      "Q: Are all Sunni schools identical in every detail? A: They share core foundations and may differ in some technical formulations; respectful learning is essential.",
      "Q: Does learning aqeedah require advanced philosophy? A: No. Every Muslim learns essentials according to need; deeper study is beneficial with qualified teachers.",
      "Q: Should aqeedah make us harsh? A: No. Sound creed should increase humility, mercy, and careful speech, not arrogance.",
    ],
    actions: [
      "Prioritize clear agreed fundamentals before disputed details.",
      "Ask qualified local scholars when complex issues affect your practice.",
    ],
  },
  {
    id: "references",
    section: "reference",
    title: "References and Further Study",
    summary: "Start with Qur'an and sahih Sunnah, then study trusted Sunni primers.",
    body: [
      "Primary reference is always the Qur'an and authentic Sunnah, understood by the companions and the early scholars of Ahl al-Sunnah.",
      "Beneficial study includes concise creed primers taught by reliable Sunni scholars, with explanation suited to your level.",
      "When scholars differ on secondary points, learn the evidence respectfully and avoid turning technical disputes into sectarian hostility.",
    ],
    disclaimer:
      "This module is educational and non-polemical. For personal rulings or sensitive creed concerns, consult qualified scholars you trust.",
    actions: [
      "Study one creed topic per week with a teacher or trusted primer.",
      "Memorise the six articles of faith in your own words.",
    ],
    appLinks: [
      { label: "Qur'an", route: "/quran" },
      { label: "Hadith", route: "/hadith" },
      { label: "Learn Dua", route: "/learn-dua" },
    ],
  },
];
