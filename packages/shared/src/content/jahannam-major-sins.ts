import type { JahannamTopic } from "../types/jahannam";

/** Major sin topic slugs — each has a full lesson page. */
export const JAHANNAM_MAJOR_SIN_IDS = [
  "shirk",
  "murder",
  "zina",
  "riba",
  "false-testimony",
  "sorcery",
  "orphan-wealth",
  "disobeying-parents",
  "theft",
  "intoxicants",
] as const;

export const JAHANNAM_MAJOR_SIN_TOPICS: JahannamTopic[] = [
  {
    id: "shirk",
    section: "major-sins",
    title: "Shirk",
    summary: "Associating partners with Allah — the one sin not forgiven if one dies upon it.",
    importance: "foundational",
    body: [
      "Shirk is directing any act of worship, ultimate love, fear, or reliance to other than Allah. It contradicts the very purpose of creation: worship Allah alone.",
      "Allah forgives all sins except shirk if a person dies without repenting from it (4:48). This is why tawheed is the foundation of salvation.",
      "Shirk includes major forms (worshipping idols, saints, or created things) and hidden forms (showing off worship, relying on omens, or fearing people as one should fear Allah alone).",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 48,
        label: "Qur'an 4:48",
        excerpt:
          "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills.",
      },
      {
        surah: 31,
        ayahFrom: 13,
        label: "Qur'an 31:13",
        excerpt:
          "O my son, do not associate anything with Allah. Indeed, association is great wrongdoing.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5977",
        grade: "sahih",
        excerpt:
          "Shall I not inform you of the greatest of major sins? Associating partners with Allah, disobedience to parents, and false testimony.",
      },
    ],
    actions: [
      "Learn tawheed through Learn Aqeedah and the 99 Names of Allah.",
      "Purify intentions in worship — ask Allah for sincerity daily.",
    ],
    appLinks: [
      { label: "Aqeedah — shirk explained", route: "/aqeedah/shirk-explained" },
      { label: "Repentance", route: "/jahannam/repentance" },
    ],
  },
  {
    id: "murder",
    section: "major-sins",
    title: "Murder",
    summary: "Taking innocent life unlawfully — among the gravest violations.",
    importance: "foundational",
    body: [
      "Unjust killing is condemned severely in the Qur'an. The first sin on earth was murder, and its gravity echoes through revelation.",
      "Islam establishes the sanctity of life — especially of believers, but also the prohibition of killing innocents generally.",
      "Repentance is required; where blood money or legal consequences apply, scholars must be consulted according to Islamic law.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 32,
        label: "Qur'an 5:32",
        excerpt:
          "Whoever kills a soul unless for a soul or for corruption in the land — it is as if he killed all mankind.",
      },
      {
        surah: 25,
        ayahFrom: 68,
        label: "Qur'an 25:68",
        excerpt:
          "Those who do not invoke with Allah another deity or kill the soul Allah has forbidden.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5570",
        grade: "sahih",
        excerpt: "The major sins include killing a soul that Allah has forbidden.",
      },
    ],
    actions: ["Value every life; resolve disputes with patience and justice."],
    appLinks: [{ label: "Sins against others", route: "/jahannam/sins-against-others" }],
  },
  {
    id: "zina",
    section: "major-sins",
    title: "Zina",
    summary: "Unlawful sexual relations — a destructive sin against soul and society.",
    importance: "foundational",
    body: [
      "Zina (fornication and adultery) is forbidden and warned against with severe language. It damages families, trust, and spiritual purity.",
      "Islam commands lowering the gaze, modest dress, and marriage as protection. The believer builds boundaries before temptation arises.",
      "Sincere tawbah, leaving the sin, and never returning are essential. Marriage is encouraged where lawful and possible.",
    ],
    quran: [
      {
        surah: 17,
        ayahFrom: 32,
        label: "Qur'an 17:32",
        excerpt:
          "Do not approach unlawful sexual intercourse. Indeed, it is immoral and an evil way.",
      },
      {
        surah: 24,
        ayahFrom: 2,
        label: "Qur'an 24:2",
        excerpt: "The fornicator and the fornicatress — lash each of them a hundred stripes.",
      },
    ],
    actions: [
      "Guard the eyes and social media consumption.",
      "Make dua for a righteous spouse if unmarried.",
    ],
    appLinks: [{ label: "Repentance", route: "/jahannam/repentance" }],
  },
  {
    id: "riba",
    section: "major-sins",
    title: "Riba",
    summary: "Interest and usury — war declared against its practitioners in the Qur'an.",
    importance: "foundational",
    body: [
      "Riba (interest/usury) is among the sins Allah linked to war from Him and His Messenger. It exploits the needy and corrupts economies.",
      "Many Muslims today struggle with interest-based systems. Seek halal alternatives, consult scholars for complex situations, and repent from what you can change.",
      "Leaving riba may require difficult financial decisions — but the soul's safety is worth more than temporary gain.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 278,
        ayahTo: 279,
        label: "Qur'an 2:278–279",
        excerpt:
          "Fear Allah and give up what remains of riba… if you do not, then take notice of war from Allah and His Messenger.",
      },
    ],
    actions: [
      "Audit finances for interest-based products.",
      "Consult a qualified scholar for mortgages and debts.",
    ],
    appLinks: [{ label: "Zakat guide", route: "/zakat" }],
  },
  {
    id: "false-testimony",
    section: "major-sins",
    title: "False Testimony",
    summary: "Lying under oath or bearing false witness — destroys justice.",
    importance: "foundational",
    body: [
      "False testimony perverts justice and can destroy innocent lives. The Prophet ﷺ listed it among the gravest major sins.",
      "This includes lying in court, fabricating accusations, and withholding testimony when justice requires it.",
      "The tongue's sins are easy to commit; guard speech and fear a Day when tongues will testify.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 72,
        label: "Qur'an 25:72",
        excerpt:
          "They do not testify to falsehood, and when they pass near ill speech, they pass with dignity.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5977",
        grade: "sahih",
        excerpt: "The greatest major sins include false testimony.",
      },
    ],
    appLinks: [{ label: "Sins of the tongue", route: "/jahannam/sins-of-tongue" }],
  },
  {
    id: "sorcery",
    section: "major-sins",
    title: "Sorcery",
    summary: "Magic, seeking magicians, and occult practices — kufr in major forms.",
    importance: "foundational",
    body: [
      "Practising sihr (magic) or seeking it from others is a major sin. The two angels at Babylon — Harut and Marut — taught magic only as a test, warning not to disbelieve (2:102).",
      "Fortune-telling, astrology as certainty about the unseen, and amulets containing shirk are also warned against in the Sunnah.",
      "Repentance requires abandoning the practice, destroying forbidden items, and renewing tawheed.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 102,
        label: "Qur'an 2:102",
        excerpt:
          "They followed what the devils recited during the reign of Solomon… and they learn what harms them and does not benefit them.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5765",
        grade: "sahih",
        excerpt:
          "Whoever goes to a fortune-teller and believes in what he says has disbelieved in what was revealed to Muhammad.",
      },
    ],
    appLinks: [{ label: "Aqeedah — tawheed", route: "/aqeedah/tawheed-explained" }],
  },
  {
    id: "orphan-wealth",
    section: "major-sins",
    title: "Consuming Orphan Wealth",
    summary: "Taking or wasting the property of orphans unjustly.",
    importance: "foundational",
    body: [
      "The Qur'an warns severely against consuming orphan wealth unjustly. Guardianship is a trust (amanah), not ownership.",
      "Mixing orphan property with one's own, delaying its return, or investing it without permission are forms of oppression.",
      "Fear a Day when no wealth or children will avail except with a sound heart.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 10,
        label: "Qur'an 4:10",
        excerpt:
          "Those who consume the wealth of orphans unjustly — they consume only fire into their bellies.",
      },
      {
        surah: 4,
        ayahFrom: 2,
        label: "Qur'an 4:2",
        excerpt:
          "Give the orphans their property and do not exchange the bad for the good, and do not consume their wealth with your wealth.",
      },
    ],
    appLinks: [{ label: "Sins against others", route: "/jahannam/sins-against-others" }],
  },
  {
    id: "disobeying-parents",
    section: "major-sins",
    title: "Disobeying Parents",
    summary: "Uquq — among the major sins after shirk.",
    importance: "foundational",
    body: [
      "Kindness to parents is second only to worship of Allah in many verses. Severe disobedience and cruelty toward them is a major sin.",
      "This does not mean obeying them in sin — but it does mean patience, respect, and care even when difficult.",
      "If you have fallen short, seek their forgiveness and serve them while you can.",
    ],
    quran: [
      {
        surah: 17,
        ayahFrom: 23,
        label: "Qur'an 17:23",
        excerpt: "Do not say to them 'uff' and do not repel them, but speak to them a noble word.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5977",
        grade: "sahih",
        excerpt: "The greatest major sins include disobedience to parents.",
      },
    ],
    actions: ["Call or visit parents this week with a kind word."],
    appLinks: [{ label: "Sins against others", route: "/jahannam/sins-against-others" }],
  },
  {
    id: "theft",
    section: "major-sins",
    title: "Theft",
    summary: "Taking others' property unlawfully — violates trust and invites punishment.",
    importance: "foundational",
    body: [
      "Theft and embezzlement are forbidden. The hand of the thief is a prescribed punishment in Islamic law for qualifying cases — showing its gravity.",
      "Digital theft, plagiarism, and unpaid work also violate the trust Islam demands.",
      "Return what was taken and repent sincerely. Hidden theft is known to Allah.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 38,
        label: "Qur'an 5:38",
        excerpt:
          "The thief, male and female — cut off their hands as recompense for what they earned.",
      },
    ],
    actions: ["Return stolen items or their value; seek forgiveness from those wronged."],
    appLinks: [{ label: "Repentance", route: "/jahannam/repentance" }],
  },
  {
    id: "intoxicants",
    section: "major-sins",
    title: "Intoxicants",
    summary: "Wine and intoxicants — forbidden progressively and decisively in the Qur'an.",
    importance: "foundational",
    body: [
      "Khamr and every intoxicant that clouds the mind are forbidden. The Prophet ﷺ said every intoxicant is khamr.",
      "Intoxicants harm worship, health, families, and judgment. They open doors to further sin.",
      "Those struggling with addiction deserve compassion and support while pursuing repentance and treatment.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 90,
        label: "Qur'an 5:90",
        excerpt:
          "O you who believe, indeed wine, gambling, idols, and divining arrows are defilement from the work of Satan — avoid them.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2003",
        grade: "sahih",
        excerpt: "Every intoxicant is khamr, and every khamr is forbidden.",
      },
    ],
    actions: ["Seek help if needed; replace the habit with dhikr and good company."],
    appLinks: [{ label: "Daily adhkar", route: "/zikr" }],
  },
];
