import type { JahannamTopic } from "../types/jahannam";
import { JAHANNAM_MAJOR_SIN_IDS, JAHANNAM_MAJOR_SIN_TOPICS } from "./jahannam-major-sins";

export * from "./jahannam-collections";
export { JAHANNAM_MAJOR_SIN_IDS, JAHANNAM_MAJOR_SIN_TOPICS };

export const JAHANNAM_CONTENT_VERSION = 1;

export const JAHANNAM_SECTION_ORDER = [
  "intro",
  "understanding",
  "nature",
  "warnings",
  "major-sins",
  "mercy",
] as const;

/**
 * Understanding Jahannam — core lesson topics (excluding individual major sins).
 * Scholar-neutral; every claim cites Qur'an or authentic hadith.
 * Bump the version when content changes.
 */
export const JAHANNAM_CORE_TOPICS: JahannamTopic[] = [
  // ── Introduction ──────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "intro",
    title: "Introduction",
    summary: "Allah informs us about Jahannam for guidance — not despair.",
    importance: "foundational",
    body: [
      "Allah describes Jahannam in the Qur'an and through His Messenger ﷺ so that hearts may awaken, turn back, and choose the path of mercy before it is too late.",
      "Warnings of the Fire are paired throughout revelation with calls to repentance, forgiveness, and hope in Allah's vast mercy. The purpose is accountability that leads to righteousness — not hopelessness.",
      "Belief in Jahannam is part of believing the unseen (ghayb), divine justice, and the reality of the Hereafter. It balances hope in Paradise with seriousness about sin.",
      "This module presents what the texts clearly state, notes where scholars have differed, and consistently directs you toward tawbah, good deeds, and trust in Allah.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 131,
        label: "Qur'an 3:131",
        excerpt:
          "Fear the Fire prepared for the disbelievers — and obey Allah and the Messenger that you may receive mercy.",
      },
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
      },
      {
        surah: 66,
        ayahFrom: 8,
        label: "Qur'an 66:8",
        excerpt:
          "O you who believe, repent to Allah with sincere repentance — perhaps your Lord will remove from you your misdeeds and admit you into Gardens.",
      },
    ],
    appLinks: [
      { label: "Hope in Allah's mercy", route: "/jahannam/hope-in-mercy" },
      { label: "Journey to Jannah", route: "/jannah" },
    ],
  },

  // ── Understanding ─────────────────────────────────────────────────────────
  {
    id: "why-jahannam",
    section: "understanding",
    title: "Why Allah Created Jahannam",
    summary: "Divine justice, accountability, and the consequences of free choice.",
    importance: "foundational",
    body: [
      "Jahannam exists as a manifestation of Allah's perfect justice. He does not wrong anyone — every soul receives what it earned, and no one is punished beyond what is just.",
      "Human beings were given free will and clear guidance. Choosing persistent rejection of truth, oppression, or major sin without repentance has consequences in the Hereafter.",
      "Reward and punishment are not arbitrary. They follow from Allah's wisdom: He warns so that people may return, and He punishes only those who deserve it by their own choices.",
      "Understanding why Jahannam exists should increase taqwa (God-consciousness) and gratitude for every chance to repent — not paralyse the heart with despair.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 23,
        label: "Qur'an 21:23",
        excerpt: "He is not questioned about what He does, but they will be questioned.",
      },
      {
        surah: 4,
        ayahFrom: 40,
        label: "Qur'an 4:40",
        excerpt: "Indeed, Allah does not wrong the people at all, but the people wrong themselves.",
      },
      {
        surah: 18,
        ayahFrom: 29,
        label: "Qur'an 18:29",
        excerpt:
          "Whoever wills — let him believe; and whoever wills — let him disbelieve. We have prepared for the wrongdoers a Fire.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2766",
        grade: "sahih",
        excerpt:
          "None of you will enter Paradise by his deeds alone — not even me, unless Allah covers me with His mercy.",
      },
    ],
    appLinks: [{ label: "Learn Aqeedah — divine justice", route: "/aqeedah/belief-qadr" }],
  },
  {
    id: "hereafter-reality",
    section: "understanding",
    title: "Reality of the Hereafter",
    summary: "From death to judgment — every stage is real and linked to aqeedah.",
    body: [
      "Islam teaches a clear sequence after death: the soul departs, barzakh (the interval grave-life) begins, then resurrection, gathering, judgment, the scale of deeds, the bridge (as-Sirat), and finally Paradise or Hell — by Allah's decree and mercy.",
      "Each stage is affirmed in Sunni aqeedah. This timeline is not symbolic; it is part of believing the Last Day.",
      "Knowing this sequence helps a believer prepare: live with remembrance of death, repair wrongs, and strive in worship before the door of action closes.",
    ],
    quran: [
      {
        surah: 23,
        ayahFrom: 15,
        ayahTo: 16,
        label: "Qur'an 23:15–16",
        excerpt:
          "Then indeed, after that you are to die. Then indeed you will be resurrected on the Day of Resurrection.",
      },
      {
        surah: 101,
        ayahFrom: 6,
        ayahTo: 9,
        label: "Qur'an 101:6–9",
        excerpt:
          "As for one whose scales are heavy — he will be in a pleasant life. As for one whose scales are light — his refuge will be an abyss.",
      },
    ],
    actions: [
      "Study each stage in Learn Aqeedah and connect belief to daily choices.",
      "Increase remembrance of death (dhikr al-mawt) without neglecting hope in mercy.",
    ],
    appLinks: [
      { label: "Aqeedah — the Last Day", route: "/aqeedah/belief-last-day" },
      { label: "Resurrection", route: "/aqeedah/resurrection" },
      { label: "Judgment Day", route: "/aqeedah/judgment-day" },
      { label: "Scale & Sirat", route: "/aqeedah/scale-sirat" },
      { label: "Hell in Aqeedah", route: "/aqeedah/hell" },
      { label: "Paradise in Aqeedah", route: "/aqeedah/paradise" },
    ],
  },

  // ── Nature of Jahannam ────────────────────────────────────────────────────
  {
    id: "names-of-hell",
    section: "nature",
    title: "Names of Hell",
    summary: "Qur'anic names with meanings — scholars differ on whether each is a separate level.",
    body: [
      "The Qur'an uses several names for Hell: Jahannam, Jaheem, Saqar, Sa'ir, Hutamah, Hawiyah, and Lazaa, among others. Each name carries a meaning that deepens our understanding of its severity.",
      "Classical tafsir explains these names from the Arabic roots — crushing, blazing, depth, and consuming fire. Ibn Kathir, al-Tabari, and others discuss their contexts verse by verse.",
      "Some later writers list each name as a distinct level of Hell. This is a scholarly interpretation, not an explicit Qur'anic checklist. The safer approach: learn the meanings the texts give, and avoid presenting speculative diagrams as certainty.",
      "Browse the full names collection for each name's Qur'anic occurrence, context, and tafsir summary.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 206,
        label: "Qur'an 2:206",
        excerpt: "Enough is Hell as a resting place — Jahannam.",
      },
      {
        surah: 104,
        ayahFrom: 4,
        ayahTo: 9,
        label: "Qur'an 104:4–9",
        excerpt: "He will be thrown into al-Hutamah — the crushing Fire.",
      },
    ],
    appLinks: [{ label: "Browse all names", route: "/jahannam/names" }],
  },
  {
    id: "levels-of-hell",
    section: "nature",
    title: "Levels of Hell",
    summary:
      "Different degrees of punishment — the exact structure is not fully detailed in texts.",
    body: [
      "The Qur'an clearly teaches that people will have different degrees of punishment according to their deeds: 'For all there will be degrees according to what they did' (6:132).",
      "Scholars have discussed levels, depths, and categories of punishment in Jahannam based on verses and hadith. However, revelation does not provide a complete numbered map that believers must memorise.",
      "What is certain: oppression, shirk, and persistent major sin without repentance carry severe warning. What is also certain: Allah's mercy and forgiveness remain open until death for those who return sincerely.",
      "Avoid treating unverified lists of seven or nineteen levels as definitive doctrine unless citing them explicitly as scholarly opinion.",
    ],
    quran: [
      {
        surah: 6,
        ayahFrom: 132,
        label: "Qur'an 6:132",
        excerpt: "For all there will be degrees according to what they did.",
      },
      {
        surah: 4,
        ayahFrom: 145,
        label: "Qur'an 4:145",
        excerpt:
          "Whoever allies with them among you — they will be in the lowest depth of the Fire.",
      },
    ],
    disclaimer:
      "Diagrams of Hell's levels found in some books reflect scholarly interpretation, not unanimous agreement.",
  },
  {
    id: "gates-of-hell",
    section: "nature",
    title: "Gates of Hell",
    summary: "Seven gates — what the Qur'an states and where interpretation differs.",
    body: [
      "Allah says: 'Indeed, Hell has seven gates; for every gate is a designated portion of them' (15:44). This is explicit in the Qur'an.",
      "The verse affirms seven gates and that sinners will be divided among them. Classical tafsir discusses whether this means categories of people, degrees of punishment, or both.",
      "Later works sometimes assign each gate to a specific sin. These assignments are not uniformly agreed upon in the earliest sources. Present them as scholarly views, not as prophetic specification.",
    ],
    quran: [
      {
        surah: 15,
        ayahFrom: 43,
        ayahTo: 44,
        label: "Qur'an 15:43–44",
        excerpt:
          "And indeed, Hell is the promised place for them all. It has seven gates; for every gate is a portion assigned.",
      },
    ],
    appLinks: [{ label: "Gates in detail", route: "/jahannam/gates" }],
  },
  {
    id: "descriptions",
    section: "nature",
    title: "Descriptions of Jahannam",
    summary: "Fire, heat, chains, regret — presented with reverence, not sensationalism.",
    body: [
      "The Qur'an and authentic Sunnah describe Jahannam with vivid language so hearts may take heed: intense fire, unbearable heat, restricted food and drink, chains, darkness, and crushing regret.",
      "Descriptions include boiling water, zaqqum (a bitter tree), garments of fire, and separation from every worldly comfort. These are real warnings — not metaphors that negate accountability.",
      "The believer reads these descriptions with adab: fear of Allah, humility, and immediate turning to repentance — not morbid curiosity or despair.",
      "Regret in the Hereafter is among the severest themes: 'If only I had…' will be said when the door of action has closed.",
    ],
    quran: [
      {
        surah: 14,
        ayahFrom: 16,
        ayahTo: 17,
        label: "Qur'an 14:16–17",
        excerpt:
          "Before him is Hell, and he will be given foul water to drink. He will gulp it but hardly swallow.",
      },
      {
        surah: 22,
        ayahFrom: 19,
        ayahTo: 22,
        label: "Qur'an 22:19–22",
        excerpt:
          "Garments of fire will be cut for them, and boiling water poured over their heads.",
      },
      {
        surah: 89,
        ayahFrom: 23,
        ayahTo: 26,
        label: "Qur'an 89:23–26",
        excerpt:
          "Hell, on that Day, will be brought forth — on that Day man will remember, but what good to him will be the remembrance?",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6562",
        grade: "sahih",
        excerpt:
          "The Fire was kindled for one thousand years until it reddened, then for one thousand until it whitened — and it is black and dark.",
      },
    ],
    appLinks: [{ label: "Protection from Hell", route: "/jahannam/protection" }],
  },

  // ── Warnings ──────────────────────────────────────────────────────────────
  {
    id: "who-is-warned",
    section: "warnings",
    title: "Who Is Warned?",
    summary: "Categories in the Qur'an and Sunnah — not judgments on individuals.",
    body: [
      "Revelation warns groups and behaviours: those who persist in disbelief after clear truth, hypocrites who outwardly profess faith while inwardly rejecting it, oppressors, the arrogant, and those who die upon major unrepented sin.",
      "Islam does not permit declaring the fate of a specific person except where Allah or His Messenger ﷺ explicitly stated it in authentic revelation.",
      "Warnings are meant to awaken the living — whoever you are, return to Allah today. Tomorrow is not guaranteed.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 145,
        label: "Qur'an 4:145",
        excerpt: "The hypocrites will be in the lowest depth of the Fire.",
      },
      {
        surah: 2,
        ayahFrom: 81,
        label: "Qur'an 2:81",
        excerpt:
          "Whoever earns sin and is engulfed by it — those are the companions of the Fire, abiding eternally.",
      },
      {
        surah: 14,
        ayahFrom: 42,
        label: "Qur'an 14:42",
        excerpt:
          "Do not think Allah is unaware of what the wrongdoers do. He only delays them for a Day when eyes will stare.",
      },
    ],
    appLinks: [{ label: "Major sins", route: "/jahannam/major-sins" }],
  },
  {
    id: "major-sins",
    section: "warnings",
    title: "Major Sins",
    summary: "Kabair — grave sins that require sincere tawbah.",
    body: [
      "Major sins (kabair) are those Allah and His Messenger ﷺ warned against with severe language. Scholars compile lists from Qur'an and hadith; the exact count varies, but the principle is clear: these sins destroy souls if persisted in without repentance.",
      "Each major sin topic in this module includes Qur'anic evidence, hadith where available, why it is serious, how to repent, and links to related lessons.",
      "Minor sins also require istighfar. The difference is severity and the urgency of turning back. Never delay tawbah.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 31,
        label: "Qur'an 4:31",
        excerpt:
          "If you avoid the major sins you are forbidden, We will remove from you your lesser sins.",
      },
      {
        surah: 53,
        ayahFrom: 32,
        label: "Qur'an 53:32",
        excerpt:
          "Those who avoid major sins and immoralities — only slight ones; indeed your Lord is vast in forgiveness.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5570",
        grade: "sahih",
        excerpt:
          "The major sins are associating partners with Allah, disobedience to parents, killing a soul, and false testimony.",
      },
    ],
    appLinks: [
      { label: "Browse major sins", route: "/jahannam/major-sins" },
      { label: "Repentance", route: "/jahannam/repentance" },
    ],
  },
  {
    id: "sins-of-tongue",
    section: "warnings",
    title: "Sins of the Tongue",
    summary: "Backbiting, lying, mockery — sins that are easy to commit and hard to undo.",
    body: [
      "The tongue can build or destroy. Backbiting (ghibah), slander, gossip, lying, mockery, and false oaths are warned against repeatedly in the Qur'an and Sunnah.",
      "Backbiting is mentioned as eating the flesh of one's dead brother (49:12). Many people fall into it without realising — daily reflection on speech is essential.",
      "Repentance requires stopping the sin, regretting it, resolving not to return, and restoring the rights of others where applicable — including asking forgiveness or clearing someone's name.",
    ],
    quran: [
      {
        surah: 49,
        ayahFrom: 12,
        label: "Qur'an 49:12",
        excerpt:
          "Do not backbite one another. Would one of you like to eat the flesh of his dead brother?",
      },
      {
        surah: 104,
        ayahFrom: 1,
        label: "Qur'an 104:1",
        excerpt: "Woe to every scorner and mocker.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6477",
        grade: "sahih",
        excerpt: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
      },
    ],
    actions: [
      "Before speaking, ask: Is it true? Is it necessary? Is it kind?",
      "If you backbit someone, make dua for them and seek their forgiveness where possible.",
    ],
    appLinks: [
      { label: "Daily reflection", route: "/jahannam/reflection" },
      { label: "Jannah — good character", route: "/jannah/character" },
      { label: "Repentance", route: "/jahannam/repentance" },
    ],
  },
  {
    id: "sins-against-others",
    section: "warnings",
    title: "Sins Against Others",
    summary: "Rights of people require restitution — not only repentance to Allah.",
    body: [
      "Oppression (dhulm), injustice, breaking trusts, cheating, unpaid debts, and severing family ties are among the sins that endanger the Hereafter.",
      "On the Day of Judgment, rights owed to people may be settled before deeds — even good deeds can be taken as compensation for wrongs done to others.",
      "Tawbah to Allah is necessary but not always sufficient when human rights are involved. Return stolen property, fulfil debts, restore reputations, and reconcile with estranged kin where possible.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 279,
        label: "Qur'an 2:279",
        excerpt:
          "If you do not desist from riba, then take notice of war from Allah and His Messenger.",
      },
      {
        surah: 13,
        ayahFrom: 25,
        label: "Qur'an 13:25",
        excerpt: "Those who break the covenant of Allah and sever what He ordered joined.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2581",
        grade: "sahih",
        excerpt:
          "Do you know who the bankrupt one is? The one who comes with prayer, fasting, and charity, but he insulted, slandered, consumed wealth unlawfully, and shed blood — so his good deeds are given to others.",
      },
    ],
    actions: [
      "List anyone you may have wronged and take a step toward repair this week.",
      "Pay outstanding debts even in small instalments if that is all you can manage.",
    ],
    appLinks: [
      { label: "My Journey", route: "/jahannam/journey" },
      { label: "Repentance", route: "/jahannam/repentance" },
    ],
  },
  {
    id: "hypocrisy",
    section: "warnings",
    title: "Hypocrisy",
    summary: "Major hypocrisy in belief — and traits of hypocrisy in behaviour.",
    body: [
      "Major hypocrisy (nifaq i'tiqadi) is outward Islam with inward disbelief. It is among the severest warnings in the Qur'an regarding the Hereafter.",
      "The Prophet ﷺ also described traits of hypocrisy in behaviour: when he speaks he lies, when he promises he breaks it, when entrusted he betrays, when he disputes he is foul.",
      "These behavioural signs are a warning for every believer to purify the heart — not a license to label others as hypocrites. Only Allah knows what is hidden.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 145,
        label: "Qur'an 4:145",
        excerpt: "The hypocrites will be in the lowest depth of the Fire.",
      },
      {
        surah: 63,
        ayahFrom: 1,
        label: "Qur'an 63:1",
        excerpt:
          "When the hypocrites come to you, they say: We bear witness that you are the Messenger of Allah — and Allah knows they are liars.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "33",
        grade: "sahih",
        excerpt:
          "The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks it, and when he is entrusted he betrays.",
      },
    ],
    disclaimer:
      "Do not accuse individuals of nifaq. The texts warn the community; purification begins with oneself.",
  },
  {
    id: "punishments",
    section: "warnings",
    title: "Punishments Mentioned",
    summary: "What the texts describe — read with fear of Allah and hope in His mercy.",
    body: [
      "The Qur'an and Sunnah mention specific punishments and categories of wrongdoers: those who consume riba, slander chaste women, hoard wealth, abandon prayer, and persist in major sin.",
      "Some punishments are described for the grave ( adab al-qabr) as well as Jahannam. Belief in both is part of Sunni aqeedah.",
      "The believer does not obsess over graphic detail. Take the warning, repent, and increase in deeds that bring protection — which this module emphasises even more than punishment.",
    ],
    quran: [
      {
        surah: 24,
        ayahFrom: 4,
        label: "Qur'an 24:4",
        excerpt:
          "Those who accuse chaste women and do not produce four witnesses — flog them with eighty stripes.",
      },
      {
        surah: 9,
        ayahFrom: 34,
        ayahTo: 35,
        label: "Qur'an 9:34–35",
        excerpt:
          "Those who hoard gold and silver and do not spend them in Allah's cause — give them tidings of a painful punishment.",
      },
    ],
    appLinks: [
      { label: "Protection from Hell", route: "/jahannam/protection" },
      { label: "Hope in mercy", route: "/jahannam/hope-in-mercy" },
    ],
  },

  // ── Mercy & action ────────────────────────────────────────────────────────
  {
    id: "protection",
    section: "mercy",
    title: "Protection from Hell",
    summary: "Tawheed, salah, tawbah, charity, Qur'an, and du'a — the heart of this module.",
    importance: "foundational",
    body: [
      "The greatest protection is correct tawheed — worshipping Allah alone without partners. Every accepted deed rests on this foundation.",
      "Establishing the five daily prayers, sincere repentance, charity, fasting, reciting and acting on the Qur'an, good character, mercy to others, dhikr, and seeking forgiveness are among the means Allah loves.",
      "The Prophet ﷺ taught specific du'as seeking refuge from Jahannam — especially in salah and morning/evening adhkar. Learn them and live them.",
      "This section is intentionally larger than the punishment section: Islam balances warning with hope and action.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 16,
        label: "Qur'an 3:16",
        excerpt:
          "Those who say: Our Lord, we have believed, so forgive us our sins and protect us from the punishment of the Fire.",
      },
      {
        surah: 2,
        ayahFrom: 201,
        label: "Qur'an 2:201",
        excerpt:
          "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6318",
        grade: "sahih",
        excerpt:
          "Whoever asks Allah for Paradise three times, Paradise says: O Allah, admit him. Whoever seeks refuge from the Fire three times, the Fire says: O Allah, protect him.",
      },
    ],
    actions: [
      "Memorise the du'a seeking refuge from Jahannam before salam in prayer.",
      "Pray the five daily prayers on time — among the strongest shields.",
      "Give charity regularly, even small amounts.",
    ],
    appLinks: [
      { label: "Duas for protection", route: "/jahannam/duas" },
      { label: "Journey to Jannah", route: "/jannah" },
      { label: "Morning & evening adhkar", route: "/zikr" },
      { label: "Learn Dua", route: "/learn-dua" },
    ],
  },
  {
    id: "repentance",
    section: "mercy",
    title: "Repentance (Tawbah)",
    summary: "Allah accepts sincere repentance — no sin is too great before death.",
    importance: "foundational",
    body: [
      "Tawbah is turning back to Allah with regret for the sin, abandoning it immediately, and resolving not to return. If the sin involved rights of others, restitution is required.",
      "Allah's mercy encompasses all things. He accepts repentance even after repeated falls — as long as the heart is sincere and death has not arrived.",
      "The door of tawbah remains open until the soul reaches the throat. Do not postpone returning to Allah.",
      "Conditions of valid tawbah: stop the sin, regret it, intend not to repeat, and restore rights where due. For shirk, repentance must occur before death.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins. He is the Forgiving, the Merciful.",
      },
      {
        surah: 25,
        ayahFrom: 70,
        label: "Qur'an 25:70",
        excerpt:
          "Except for those who repent, believe, and do righteous deeds — Allah will replace their evil deeds with good.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6307",
        grade: "sahih",
        excerpt:
          "Allah is more joyful with the repentance of His servant than one who finds his lost mount in a barren land.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2747",
        grade: "sahih",
        excerpt:
          "Allah extends His hand at night for the repentant by day, and during the day for the repentant by night.",
      },
    ],
    actions: [
      "Say Astaghfirullah throughout the day — aim for consistency, not only after major slips.",
      "Learn Sayyid al-Istighfar and recite it morning and evening.",
    ],
    appLinks: [
      { label: "Daily adhkar & istighfar", route: "/zikr" },
      { label: "Learn Dua — forgiveness", route: "/learn-dua/forgiveness-guidance" },
      { label: "Hope in Allah's mercy", route: "/jahannam/hope-in-mercy" },
      { label: "My Journey", route: "/jahannam/journey" },
    ],
  },
  {
    id: "hope-in-mercy",
    section: "mercy",
    title: "Hope in Allah's Mercy",
    summary: "Never despair — good deeds erase sins; consistency matters.",
    importance: "foundational",
    body: [
      "Allah is ar-Rahman ar-Raheem — His mercy precedes His wrath. The believer lives between hope and fear: fear of sin, hope in forgiveness.",
      "Never despair of Allah's mercy, no matter how far you feel you have strayed. Shaytan wants you to give up; Allah wants you to return.",
      "Good deeds erase bad deeds. Consistent small worship — one prayer on time, one act of charity, one moment of patience — builds a life of nearness to Allah.",
      "Let this be the conclusion of your study: know the warning, choose the path of mercy, and walk it every day until you meet Allah.",
    ],
    quran: [
      {
        surah: 7,
        ayahFrom: 156,
        label: "Qur'an 7:156",
        excerpt: "My mercy encompasses all things.",
      },
      {
        surah: 11,
        ayahFrom: 114,
        label: "Qur'an 11:114",
        excerpt: "Indeed, good deeds remove evil deeds. That is a reminder for those who remember.",
      },
      {
        surah: 65,
        ayahFrom: 2,
        label: "Qur'an 65:2",
        excerpt:
          "Whoever fears Allah — He will make for him a way out and provide from where he does not expect.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2751",
        grade: "sahih",
        excerpt:
          "By the One in whose hand is my soul, if you did not sin, Allah would replace you with people who sin and seek forgiveness.",
      },
    ],
    actions: [
      "End each day with istighfar and gratitude for every blessing.",
      "Pair this module with Journey to Jannah — warning and hope together.",
    ],
    appLinks: [
      { label: "Journey to Jannah", route: "/jannah" },
      { label: "Aqeedah — hope & repentance", route: "/aqeedah/hope-repentance" },
      { label: "My Journey", route: "/jahannam/journey" },
    ],
  },
];

export const JAHANNAM_TOPICS: JahannamTopic[] = [
  ...JAHANNAM_CORE_TOPICS,
  ...JAHANNAM_MAJOR_SIN_TOPICS,
];
