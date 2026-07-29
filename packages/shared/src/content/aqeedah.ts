import type { AqeedahTopic } from "../types/aqeedah";

export { AQEDAH_GLOSSARY } from "./aqeedah-glossary";

/**
 * Learn Aqeedah — the core creed of Ahl al-Sunnah wa'l-Jama'ah, drawn from clear
 * Qur'an and authentic Sunnah as understood by the Companions and early scholars.
 * Deliberately non-polemical: it teaches shared Sunni essentials and notes the
 * recognised theological schools' differences respectfully rather than taking
 * sides. Citations are verified against the standard editions (sunnah.com).
 * Bump the version when content changes.
 */
export const AQEDAH_CONTENT_VERSION = 2;

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
      "The word aqeedah (عقيدة) comes from a root meaning to tie or bind firmly — it is the set of beliefs a Muslim holds with such certainty that the heart is bound to them, undisturbed by doubt. In the famous Hadith of Jibril, the Prophet ﷺ summarised it as six beliefs: in Allah, His angels, His books, His messengers, the Last Day, and the divine decree (qadr), its good and its bitter.",
      "For Ahl al-Sunnah wa'l-Jama'ah — the mainstream body of Sunni Muslims — creed is taken first from the Qur'an, then the authentic Sunnah, understood in the way of the Prophet's Companions and the early generations (the salaf). Where the intellect is used, it serves revelation rather than overruling it.",
      "Aqeedah is not an abstract seminar topic; it is the root from which all worship and character grow. A person's beliefs about who Allah is, why they were created, and where they are heading quietly govern how they pray, how they treat others, and how they meet hardship and death.",
      "Correct belief keeps the heart balanced between the great states of worship — love and awe, hope and fear, reliance and effort, gratitude and repentance — so that a believer neither despairs of Allah's mercy nor feels secure from His accountability.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 177,
        label: "Qur'an 2:177",
        excerpt:
          "Righteousness is that one believes in Allah, the Last Day, the angels, the Book, and the prophets…",
      },
      {
        surah: 4,
        ayahFrom: 136,
        label: "Qur'an 4:136",
        excerpt:
          "O you who believe, believe in Allah, His Messenger, the Book He sent down upon His Messenger, and the Scripture He sent down before.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt:
          "Iman is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in the divine decree, its good and its bitter. (Hadith of Jibril, narrated by 'Umar)",
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
    summary: "Aqeedah is not a philosophy class; it is lived belief rooted in revelation.",
    body: [
      "Aqeedah is what the heart affirms with certainty and what then shows in worship and conduct — not merely a theory memorised for debate. The Qur'an describes the firmly-grounded believers as those who say of revelation, 'We believe in it; all of it is from our Lord' (3:7): they submit to what is clear and entrust the unseen details to Allah.",
      "The early scholars wrote concise creed texts (such as al-'Aqidah al-Tahawiyya) precisely to preserve this clarity — to protect ordinary believers from two dangers: exaggeration that adds to the religion, and denial that strips away what Allah affirmed.",
      "Within Ahl al-Sunnah there are recognised schools of theology — most notably the Athari, Ash'ari, and Maturidi approaches — which agree completely on the essentials of faith while differing in some technical methods of expressing certain matters, especially the divine attributes. Their shared foundation is one and firm: Allah's absolute oneness, the truthfulness of His revelation, and real accountability in the Hereafter.",
      "So aqeedah is best learned as living belief: every point of creed connects to a way of worshipping, a way of behaving, and a source of comfort.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 7,
        label: "Qur'an 3:7",
        excerpt: "And those firm in knowledge say, 'We believe in it. All of it is from our Lord.'",
      },
    ],
    actions: [
      "Learn aqeedah from reliable scholars and primary texts, not from social-media debates.",
      "For every belief you study, ask: how does this change how I worship and live?",
    ],
  },
  {
    id: "why-aqeedah-matters",
    section: "intro",
    title: "Why Aqeedah Matters",
    summary: "Sound creed gives spiritual stability and protects from extremes.",
    body: [
      "When belief is sound and settled, deeds become sincere and steady; when belief is shaky, worship tends to become unstable, purely emotional, or easily shaken by desire and doubt. Allah promises that He 'keeps firm those who believe with the firm word' — in this life and at the terrifying moment of the grave and the Hereafter.",
      "Correct creed is also what carries a believer through the full range of life: it teaches patient trust in Allah's decree during hardship, humble gratitude in blessing, and calm certainty in the face of uncertainty and death. A person who truly believes in qadr and the Hereafter does not collapse when tested.",
      "Finally, sound aqeedah teaches adab — good conduct — in disagreement: holding firmly to the clear fundamentals while showing respect and restraint in the secondary matters where sincere scholars have long differed. Knowledge of creed should increase humility and mercy, never arrogance.",
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
          "Be eager for what benefits you, seek help from Allah, and do not be helpless… (Abu Hurayrah)",
      },
    ],
  },

  // ── Six Articles ────────────────────────────────────────────────────────────
  {
    id: "six-articles",
    section: "articles",
    title: "The Six Articles of Iman",
    summary: "The Prophet ﷺ summarised iman in six foundational beliefs.",
    importance: "foundational",
    body: [
      "The six articles come from the Hadith of Jibril, one of the most important hadiths in Islam. The angel Jibril came in the form of a man and questioned the Prophet ﷺ before the Companions about Islam, iman, and ihsan. When he asked about iman, the Prophet ﷺ answered with these six beliefs — and Jibril confirmed him, then departed, having come to teach the people their religion.",
      "The six are: belief in Allah; in His angels; in His revealed books; in His messengers; in the Last Day; and in the divine decree (qadr), its good and its bitter. To reject any one of them is to fall outside true iman, for they are a single fabric.",
      "They are also deeply interconnected. Belief in the books and the messengers leads to knowledge of the Last Day and the reckoning; belief in the Last Day gives weight to every deed; and belief in qadr teaches trust in Allah and humility before His wisdom. Learning them in order builds a clear and balanced worldview.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt:
          "…That you believe in Allah, His angels, His books, His messengers, the Last Day, and that you believe in the decree, its good and its bitter. (Hadith of Jibril)",
      },
    ],
    appLinks: [{ label: "Aqeedah glossary", route: "/aqeedah/glossary" }],
  },
  {
    id: "belief-allah",
    section: "articles",
    title: "Belief in Allah",
    summary:
      "Belief in Allah spans His lordship, His sole right to worship, and His names and attributes.",
    importance: "foundational",
    body: [
      "Belief in Allah is the greatest of all beliefs and the root of the rest. It begins with certainty that He alone is the Creator, Owner, and Sustainer of everything — the one true God, with no partner, no equal, and no need of any of His creation.",
      "It follows that He alone deserves worship in every form: prayer, supplication, hope, fear, reliance, love in its highest sense, sacrifice, and vows are all rights of Allah that may not be directed to anyone besides Him. This is the meaning of the testimony 'there is no god but Allah.'",
      "Ahl al-Sunnah affirm the beautiful names and lofty attributes that Allah affirmed for Himself, and that His Messenger ﷺ affirmed for Him, in a way that befits His majesty — without likening Him to His creation (tamthil) and without denying or emptying His attributes of meaning (ta'til). The guiding verse is: 'There is nothing like unto Him, and He is the All-Hearing, the All-Seeing' (42:11) — which both denies resemblance and affirms His hearing and seeing.",
      "Knowing Allah by His names — the Most Merciful, the All-Knowing, the Ever-Living, the King, the Forgiving — is the food of the heart: the more you know Him, the more you love, fear, and turn to Him.",
    ],
    quran: [
      {
        surah: 112,
        ayahFrom: 1,
        ayahTo: 4,
        label: "Qur'an 112:1–4",
        excerpt:
          "Say: He is Allah, the One… He neither begets nor is born, and there is none comparable to Him.",
      },
      {
        surah: 7,
        ayahFrom: 180,
        label: "Qur'an 7:180",
        excerpt: "And to Allah belong the most beautiful names, so call upon Him by them.",
      },
    ],
    appLinks: [{ label: "Explore the Names of Allah", route: "/names-of-allah" }],
  },
  {
    id: "belief-angels",
    section: "articles",
    title: "Belief in Angels",
    summary: "Angels are honoured, unseen servants of Allah who never disobey Him.",
    body: [
      "Angels (mala'ikah) are a vast creation made from light. They have no free will to disobey: they worship Allah continuously and carry out His every command perfectly, 'not disobeying Allah in what He commands them, and doing what they are commanded.'",
      "To believe in them is to believe that the unseen world is real and active around us. Angels bring revelation, guard human beings, record every word and deed, take the souls at death, and manage affairs of the earth and heavens by Allah's permission — so a believer is never truly alone or unobserved.",
      "Several are named in the texts with specific roles: Jibril, the angel of revelation; Mika'il, entrusted with rain and provision; Israfil, who will blow the Trumpet; Malak al-Mawt, the angel of death; and the noble scribes (Kiraman Katibin) who record each person's deeds. Munkar and Nakir question the deceased in the grave.",
    ],
    quran: [
      {
        surah: 66,
        ayahFrom: 6,
        label: "Qur'an 66:6",
        excerpt:
          "Over it are angels, harsh and severe, who do not disobey Allah in what He commands and do what they are commanded.",
      },
      {
        surah: 2,
        ayahFrom: 97,
        label: "Qur'an 2:97",
        excerpt:
          "Say: whoever is an enemy to Jibril — it is he who brought it down upon your heart, by Allah's permission.",
      },
    ],
    actions: ["Live with the awareness that the recording angels never miss a word or deed."],
  },
  {
    id: "belief-books",
    section: "articles",
    title: "Belief in the Divine Books",
    summary:
      "Allah sent scriptures as guidance; the Qur'an confirms them and stands as the final criterion.",
    body: [
      "Muslims believe that Allah revealed scriptures to His messengers as guidance and mercy. The Qur'an names several: the Suhuf of Ibrahim and Musa, the Tawrah given to Musa, the Zabur to Dawud, the Injil to 'Isa, and finally the Qur'an to Muhammad ﷺ — believed in as a whole, in their original revealed form.",
      "The Qur'an holds a unique rank. It is the final revelation, sent 'confirming what came before it and as a criterion over it' (5:48) — meaning it judges and corrects, since the earlier scriptures did not remain in their original state but were altered (tahrif) and lost over generations.",
      "Uniquely among all scriptures, the Qur'an is divinely protected from corruption: 'Indeed, We sent down the Reminder, and indeed, We are its Guardian' (15:9). Believing in the books therefore means honouring revelation, reciting the Qur'an with reflection, and submitting to its guidance in life.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 48,
        label: "Qur'an 5:48",
        excerpt:
          "And We revealed to you the Book in truth, confirming what preceded it of the Scripture and as a criterion over it.",
      },
      {
        surah: 15,
        ayahFrom: 9,
        label: "Qur'an 15:9",
        excerpt:
          "Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian.",
      },
    ],
    appLinks: [{ label: "Read the Qur'an", route: "/quran" }],
  },
  {
    id: "belief-prophets",
    section: "articles",
    title: "Belief in the Prophets",
    summary: "All prophets conveyed the same core truth; Muhammad ﷺ is the final messenger.",
    body: [
      "A Muslim believes in all the prophets and messengers Allah sent, rejecting none of them. From Adam through Nuh, Ibrahim, Musa, and 'Isa to Muhammad ﷺ, they all called to the same essential message: worship Allah alone, and live uprightly. Twenty-five are named in the Qur'an; their total number is known only to Allah.",
      "The prophets are the best of creation in truthfulness and trustworthiness, protected by Allah from lying about the message and from major sin — yet they remain human beings, not divine, and are never to be worshipped. Five are singled out as the 'resolute' messengers (ulu al-'azm): Nuh, Ibrahim, Musa, 'Isa, and Muhammad ﷺ.",
      "Muhammad ﷺ is the Seal of the Prophets (khatam an-nabiyyin): no prophet comes after him, and his message is universal — sent to all of humanity until the Day of Judgment. Believing in him includes loving him, obeying his commands, believing his reports, and worshipping only in the way he taught.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 285,
        label: "Qur'an 2:285",
        excerpt: "…We make no distinction between any of His messengers…",
      },
      {
        surah: 33,
        ayahFrom: 40,
        label: "Qur'an 33:40",
        excerpt:
          "Muhammad is not the father of any of your men, but the Messenger of Allah and the seal of the prophets.",
      },
    ],
    appLinks: [{ label: "Stories of the Prophets", route: "/prophets" }],
  },
  {
    id: "belief-last-day",
    section: "articles",
    title: "Belief in the Last Day",
    summary: "Life leads to a final meeting with Allah, perfect justice, and eternal outcomes.",
    body: [
      "Belief in the Last Day is belief in everything that follows death: the questioning and life of the grave (barzakh), the blowing of the Trumpet, the resurrection of all people, the great gathering, the reckoning, the weighing of deeds on the Scale, the crossing of the Bridge, and the two eternal abodes — Paradise and Hell.",
      "This belief gives moral weight to every moment. Because Allah sees the hidden and records the smallest deed, nothing good is ever wasted and nothing evil is ever overlooked: 'Whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.'",
      "Ahl al-Sunnah affirm all of these realities with certainty, believing them exactly as they were reported, while acknowledging that scholars differ in interpreting some of the finer details of specific events and signs. The point of the belief is not speculation but preparation.",
    ],
    quran: [
      {
        surah: 99,
        ayahFrom: 6,
        ayahTo: 8,
        label: "Qur'an 99:6–8",
        excerpt:
          "…So whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.",
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
    summary:
      "Allah's knowledge and decree are complete — yet humans truly choose and are accountable.",
    body: [
      "Belief in qadr is often summarised in four levels: that Allah eternally knows all things; that He wrote them all in the Preserved Tablet fifty thousand years before creation; that nothing occurs except by His will; and that He is the Creator of all that exists, including the actions of His servants.",
      "At the same time, human beings have a real will and genuine choice within what Allah permits — which is exactly why commands and prohibitions, reward and punishment, are just and meaningful. A person chooses to pray or to lie, and is rightly held responsible; Allah's prior knowledge of the choice does not force it.",
      "Ahl al-Sunnah steer between two errors: the denial of the decree (as if events escape Allah's knowledge and will), and fatalism (using the decree to cancel human responsibility and excuse sin). The believer takes the means with excellence, then entrusts the outcome to Allah.",
      "Practically, qadr is the great source of peace: after doing your part, you rest in the knowledge that whatever reaches you could never have missed you, and whatever missed you could never have reached you.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2664",
        grade: "sahih",
        excerpt:
          "…If something befalls you, do not say 'if only I had done such', but say 'Allah decreed, and what He willed He did' — for 'if only' opens the door to Satan. (Abu Hurayrah)",
      },
    ],
    quran: [
      {
        surah: 54,
        ayahFrom: 49,
        label: "Qur'an 54:49",
        excerpt: "Indeed, We created everything according to a measure (qadar).",
      },
      {
        surah: 13,
        ayahFrom: 11,
        label: "Qur'an 13:11",
        excerpt:
          "Indeed, Allah does not change the condition of a people until they change what is in themselves.",
      },
    ],
    misconceptions: [
      "Misconception: If everything is decreed, effort is pointless. Correction: Islam commands effort, planning, prayer, and repentance — taking the means is itself part of the decree.",
      "Misconception: Qadr means Allah is to blame for my sin. Correction: The servant chooses and is accountable; the decree is never an excuse for disobedience.",
      "Misconception: Hardship proves Allah is displeased with me. Correction: Trials may be purification, elevation in rank, a warning, or a call to return — often a sign of care, not anger.",
    ],
    actions: [
      "Take the means with excellence, then place your trust in Allah's decree.",
      "Replace 'if only…' regret loops with 'Qaddar Allah' and a constructive next step.",
    ],
  },

  // ── Tawheed & Heart Work ───────────────────────────────────────────────────
  {
    id: "tawheed-explained",
    section: "tawheed",
    title: "Tawheed Explained",
    summary:
      "Tawheed unites Allah's lordship, His sole right to worship, and His names and attributes.",
    importance: "foundational",
    body: [
      "Tawheed (توحيد) — the absolute oneness of Allah — is the heart of Islam and the message of every prophet. It means to single out Allah alone in everything that is uniquely His, and to affirm His perfection exactly as He described Himself.",
      "Scholars commonly teach tawheed through three connected aspects to make it easy to understand and protect. Tawheed al-Rububiyyah: that Allah alone creates, owns, and controls all things. Tawheed al-Uluhiyyah: that Allah alone deserves all worship — this is the aspect the messengers most emphasised and the disbelievers most resisted. Tawheed al-Asma' wa'l-Sifat: affirming Allah's names and attributes as revealed, without distortion, denial, or likeness.",
      "This three-part framework is a teaching tool, not a source of division; its purpose is to help a believer guard sincerity and recognise where oneness can be compromised. The whole of it is captured in the opening dua of every Muslim's prayer: 'You alone we worship, and You alone we ask for help.'",
      "A crucial insight: acknowledging that Allah is the Creator (rububiyyah) is not enough on its own. Many who denied the prophets still admitted Allah created the heavens and earth — what they refused was to worship Him alone (uluhiyyah). Real tawheed is proven in worship, not merely in belief about origins.",
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
      "Misconception: Tawheed is just saying one sentence. Correction: It is a belief of the heart, a statement of the tongue, and a reality lived in worship.",
      "Misconception: Believing Allah is the Creator is the whole of tawheed. Correction: Even many disbelievers affirmed that — the test is worshipping Allah alone.",
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
    summary: "Shirk is directing any exclusive right of Allah to something other than Him.",
    importance: "foundational",
    body: [
      "Shirk (شرك) — associating partners with Allah — is the opposite of tawheed and the one sin the Qur'an singles out as unforgivable if a person dies upon it without repentance: 'Allah does not forgive that partners be associated with Him, but forgives anything less than that for whom He wills.'",
      "Major shirk (al-shirk al-akbar) is to direct an act of worship to other than Allah — invoking the dead or absent for what only Allah can give, sacrificing or making vows to created beings, or loving and obeying something as one should love and obey Allah. It takes a person outside Islam if they die upon it unrepentant.",
      "Minor shirk (al-shirk al-asghar) does not expel from Islam but is gravely dangerous and can nullify the reward of deeds. Its clearest form is riya — performing worship to be seen and praised by people — which the Prophet ﷺ called the thing he feared most for his community. Swearing by other than Allah in a way that exalts it falls here too.",
      "Ahl al-Sunnah are careful with language and judgment: warning against shirk in general is essential and clear, but declaring a specific individual to be a mushrik or disbeliever (takfir) is a weighty matter that requires knowledge, valid evidence, and the removal of excuses — it belongs to qualified scholars, not to ordinary people or online argument.",
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
          "O my son, do not associate partners with Allah. Indeed, association is a great injustice (zulm).",
      },
    ],
    hadith: [
      {
        collection: "Musnad Ahmad",
        citation: "23630",
        grade: "sahih",
        excerpt:
          "The thing I fear most for you is minor shirk. Asked what it was, he ﷺ said: showing off (riya). (Mahmud ibn Labid)",
      },
    ],
    misconceptions: [
      "Misconception: Every slip of the tongue is major shirk. Correction: Scholars distinguish major from minor and judge each case carefully with evidence.",
      "Misconception: Warning against shirk requires harshness toward people. Correction: The prophetic way pairs clarity of truth with mercy and patient teaching.",
    ],
  },
  {
    id: "sincerity",
    section: "tawheed",
    title: "Sincerity (Ikhlas)",
    summary: "Deeds are accepted only when done purely for Allah.",
    body: [
      "Ikhlas (إخلاص) is to seek only Allah's pleasure through an act — not status, praise, wealth, or influence over people. It is the inner condition on which the acceptance of every deed depends: the Prophet ﷺ taught that 'actions are but by intentions, and every person will have only what he intended.'",
      "Because reward hinges on intention, a small, quiet deed done sincerely for Allah can outweigh a large, public deed performed for reputation. The same outward act — giving charity, praying, teaching — can be worship or emptiness depending on the heart behind it.",
      "Sincerity is not achieved once but renewed continually, because the self is prone to seeking attention. Believers therefore repeatedly purify their intention and ask Allah to protect them from the hidden shirk of riya and from self-deception.",
    ],
    quran: [
      {
        surah: 98,
        ayahFrom: 5,
        label: "Qur'an 98:5",
        excerpt: "And they were not commanded except to worship Allah, sincere to Him in religion.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1",
        grade: "sahih",
        excerpt:
          "Actions are but by intentions, and every person will have only what he intended. ('Umar ibn al-Khattab)",
      },
    ],
    appLinks: [{ label: "Learn dua and intentions", route: "/learn-dua" }],
  },
  {
    id: "love-fear-allah",
    section: "tawheed",
    title: "Love and Fear of Allah",
    summary: "A sound heart worships Allah on the wings of love, hope, and reverent fear.",
    body: [
      "The worship of the heart rests on three great states: love (mahabbah), hope (raja'), and reverent fear (khawf). Love of Allah is the foundation and driving force of all worship — the believers are 'stronger in love for Allah' than anything else — while fear of displeasing Him restrains the soul from sin and heedlessness.",
      "Ahl al-Sunnah teach that these must stay in balance, like a bird flying with two wings and a head. Love and hope without fear can drift into carelessness and taking Allah's mercy for granted; fear without hope can collapse into despair. The Qur'an joins them: 'Call upon Him in fear and hope.'",
      "This balance is not merely a feeling; it appears in action — in guarding the prayer, hastening to repent, serving others, restraining anger, and remaining patient in hardship out of love for the One who decreed it.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 165,
        label: "Qur'an 2:165",
        excerpt: "…But those who believe are stronger in love for Allah.",
      },
      {
        surah: 7,
        ayahFrom: 56,
        label: "Qur'an 7:56",
        excerpt:
          "…And call upon Him in fear and hope. Indeed, the mercy of Allah is near to the doers of good.",
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
    summary: "No sin is too great for sincere repentance and hope in Allah's vast mercy.",
    body: [
      "A defining belief of Ahl al-Sunnah is that a person should never despair of Allah's mercy, however great their sins, and never feel secure from His accountability, however many their good deeds. Both hope and self-correction run continuously through a believer's life.",
      "Allah's invitation is breathtakingly generous: 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.' The door of repentance (tawbah) stays open until the sun rises from the west or the individual's own death approaches.",
      "Sincere repentance has clear conditions: leaving the sin immediately, feeling genuine regret for it, and firmly resolving never to return — and, where the sin involved the rights of another person, restoring those rights or seeking their pardon. When these are met, Allah's response is not mere acceptance but joy: He is 'more delighted with the repentance of His servant' than a man who recovers his lost mount and provisions in a barren desert.",
    ],
    quran: [
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
        excerpt: "O you who believe, turn to Allah in sincere repentance.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2744",
        grade: "sahih",
        excerpt:
          "Allah is more delighted with the repentance of His servant than a man who loses his mount, carrying his food and drink, in a barren land — then finds it again. (Ibn Mas'ud)",
      },
    ],
    appLinks: [{ label: "Daily duas", route: "/learn-dua" }],
  },

  // ── Afterlife ───────────────────────────────────────────────────────────────
  {
    id: "paradise",
    section: "afterlife",
    title: "Paradise (Jannah)",
    summary: "Jannah is the eternal reward Allah prepared for the believers by His mercy.",
    body: [
      "Paradise is real, everlasting, and beyond anything the human mind can picture. The Prophet ﷺ conveyed Allah's words: 'I have prepared for My righteous servants what no eye has seen, no ear has heard, and no heart has conceived.' Its highest reward of all is the pleasure of Allah and the vision of His Face.",
      "Entry into Paradise is ultimately by Allah's mercy — no one's deeds alone can earn eternal bliss — yet sincere faith and righteous action are the means Allah has appointed and accepts. The two are not in conflict: mercy is the cause, and faith and deeds are the path He opened to it.",
      "Belief in Paradise reshapes how a person lives now: it fuels patience through hardship, generosity with wealth, and perseverance in worship, because the believer is trading a fleeting world for an eternal home. The Qur'an calls us to 'race' toward it.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 133,
        label: "Qur'an 3:133",
        excerpt:
          "And hasten to forgiveness from your Lord and a Garden as wide as the heavens and earth, prepared for the righteous.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3244",
        grade: "sahih",
        excerpt:
          "Allah said: I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has conceived. (Abu Hurayrah; also Sahih Muslim 2824)",
      },
    ],
    appLinks: [{ label: "Journey to Jannah", route: "/jannah" }],
  },
  {
    id: "hell",
    section: "afterlife",
    title: "Hell (Jahannam)",
    summary:
      "Jahannam is a true warning, meant to turn hearts back to Allah before it is too late.",
    body: [
      "Belief in Hell (Jahannam) is part of believing in the unseen and in Allah's perfect justice. It is a real abode of punishment, described in vivid terms in the Qur'an and Sunnah so that people take the danger seriously.",
      "The warnings serve a merciful purpose: they exist to protect people from the very outcome they describe — to check arrogance, oppression, and the persistent, knowing rejection of truth, and to move the heedless to repent while the door is open.",
      "Ahl al-Sunnah hold the warnings and the mercy together. The threats are grave and real, yet Allah's mercy remains vast for whoever turns back to Him — and among the people of tawheed, sinners who enter the Fire will not remain there forever but will ultimately be brought out by Allah's mercy and the intercession He permits.",
    ],
    quran: [
      {
        surah: 66,
        ayahFrom: 6,
        label: "Qur'an 66:6",
        excerpt:
          "O you who believe, protect yourselves and your families from a Fire whose fuel is people and stones.",
      },
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt: "…Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
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
    summary: "After death, all people will be raised bodily to stand before Allah.",
    body: [
      "The resurrection (al-ba'th) is bodily and real, not a symbol or a metaphor. Allah answers those who doubt that decayed bones can live again with the simplest logic: the One who created them from nothing the first time can surely restore them — and re-creating is, to our understanding, easier than originating.",
      "Between death and resurrection lies the barzakh — the intermediate life of the grave, with its questioning and its ease or hardship. Then the Trumpet is blown, and all creation is raised and gathered before Allah for the reckoning.",
      "This belief is what gives human life its moral seriousness: without resurrection, the oppressor who dies comfortably and the oppressed who dies wronged would meet the same end. With it, every wrong is answered and every good rewarded, giving meaning to patience and to justice.",
    ],
    quran: [
      {
        surah: 36,
        ayahFrom: 78,
        ayahTo: 79,
        label: "Qur'an 36:78–79",
        excerpt:
          "He says, 'Who will give life to bones while they are decayed?' Say, 'He will give them life who produced them the first time…'",
      },
      {
        surah: 22,
        ayahFrom: 7,
        label: "Qur'an 22:7",
        excerpt:
          "And indeed, the Hour is coming — no doubt about it — and Allah will resurrect those in the graves.",
      },
    ],
  },
  {
    id: "judgment-day",
    section: "afterlife",
    title: "The Day of Judgment",
    summary: "Every soul stands before Allah; His justice is perfect and complete.",
    body: [
      "On the Day of Judgment, every person is held to account — for deeds and intentions, for the rights of Allah and the rights of other people — with a justice so precise that 'no soul will be wronged at all,' even by an atom's weight.",
      "On that Day, no lineage, wealth, class, nationality, or worldly rank will benefit anyone; only sincere faith and righteous action, accepted by Allah, will avail. Records are distributed, deeds are weighed, and even wrongs done between people are settled by transferring good deeds and bad deeds.",
      "This certainty is meant to transform character now: it calls the believer to honesty, trustworthiness, guarding the rights of others, and repairing wrongs and returning what is owed before the Day when debts are paid in deeds rather than money.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 47,
        label: "Qur'an 21:47",
        excerpt:
          "And We place the scales of justice for the Day of Resurrection, so no soul will be treated unjustly at all.",
      },
    ],
    appLinks: [{ label: "The Day of Judgment — full guide", route: "/last-day" }],
  },
  {
    id: "scale-sirat",
    section: "afterlife",
    title: "The Scale and the Sirat",
    summary: "Deeds are weighed on the Mizan, and people cross the Sirat by their faith and deeds.",
    body: [
      "Ahl al-Sunnah affirm the Mizan (the Scale) and the Sirat (the Bridge over Hell) as real events of the Hereafter, believed exactly as reported. On the Scale, deeds and their doers are weighed with perfect fairness: 'as for one whose scales are heavy, he will be in a pleasant life; and as for one whose scales are light, his refuge will be an abyss.'",
      "The Sirat is a bridge stretched over Hell that all must pass. The Qur'an states, 'There is none of you but will pass over it,' then, 'We will save those who were mindful of Allah.' People cross according to their deeds — some as swift as light or the wind, others struggling, and some slipping — by Allah's mercy and justice.",
      "These realities are not told to frighten idly but to cultivate seriousness: about the weight of small deeds, about the sincerity of worship, and about honouring the rights of others, since all of it will be weighed.",
    ],
    quran: [
      {
        surah: 101,
        ayahFrom: 6,
        ayahTo: 9,
        label: "Qur'an 101:6–9",
        excerpt:
          "Then as for one whose scales are heavy, he will be in a pleasant life; but as for one whose scales are light, his refuge will be an abyss.",
      },
      {
        surah: 19,
        ayahFrom: 71,
        ayahTo: 72,
        label: "Qur'an 19:71–72",
        excerpt:
          "And there is none of you except he will pass over it… Then We will save those who feared Allah.",
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
    summary: "Intercession is real — but only by Allah's permission, for those He is pleased with.",
    body: [
      "Intercession (shafa'ah) on the Day of Judgment is firmly affirmed in the Qur'an and Sunnah. The greatest of all is the 'Praised Station' (al-maqam al-mahmud) granted to the Prophet Muhammad ﷺ, when he will intercede for the gathered creation to begin the reckoning — and he will have other intercessions for the people of major sins among his ummah.",
      "But no one intercedes on their own authority. Every valid intercession happens only 'after His permission' and only for those with whom Allah is pleased: 'Who is it that can intercede with Him except by His permission?' This preserves Allah's absolute sovereignty over the outcome.",
      "The scholars describe several affirmed kinds of intercession — for the reckoning to begin, for people to enter Paradise, for sinful believers to be forgiven or removed from the Fire — while agreeing that final judgment always remains Allah's alone.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 255,
        label: "Qur'an 2:255",
        excerpt: "Who is it that can intercede with Him except by His permission?",
      },
      {
        surah: 20,
        ayahFrom: 109,
        label: "Qur'an 20:109",
        excerpt:
          "That Day, intercession will not benefit except one to whom the Most Merciful has given permission and whose word He approves.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7440",
        grade: "sahih",
        excerpt:
          "The people will come to me, and I will prostrate before my Lord; then it will be said: Raise your head, ask and you will be given, intercede and your intercession will be accepted. (Abu Sa'id — the great intercession)",
      },
    ],
    misconceptions: [
      "Misconception: Intercession removes the need for repentance. Correction: It occurs only by Allah's permission and is never a licence to persist in sin.",
      "Misconception: One may call upon the prophets or righteous now to intercede. Correction: Worship and supplication are for Allah alone; intercession in the Hereafter is by His decree, sought through pleasing Him.",
      "Misconception: Intercession contradicts Allah's justice. Correction: It is one expression of His mercy operating within His perfect justice, and only by His leave.",
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
    summary: "The minor and major signs are true; the wise focus on preparation over speculation.",
    body: [
      "The authentic texts describe signs that precede the Hour, grouped into minor signs (many of which have already appeared, such as the sending of the Prophet ﷺ himself, the spread of ignorance, and widespread heedlessness) and major signs that will occur close to the end.",
      "The ten major signs are named together in a hadith of the Prophet ﷺ: among them the appearance of the Dajjal, the descent of 'Isa (son of Maryam), the emergence of Ya'juj and Ma'juj, three great landslides, a smoke, the rising of the sun from the west, and a fire that drives people to their final gathering.",
      "Scholars sometimes differ on the exact sequence of some signs, but they agree on two things: the coming of the Hour is certain, and its precise timing is known to no one but Allah — not even to the Prophet ﷺ when Jibril asked him. The prophetic response to the signs is therefore practical, not speculative: increase faith, repentance, justice, and beneficial deeds rather than endless prediction.",
    ],
    quran: [
      {
        surah: 7,
        ayahFrom: 187,
        label: "Qur'an 7:187",
        excerpt:
          "They ask you about the Hour: when is its arrival? Say: its knowledge is only with my Lord.",
      },
      {
        surah: 47,
        ayahFrom: 18,
        label: "Qur'an 47:18",
        excerpt:
          "Do they await except that the Hour should come upon them suddenly? Its signs have already come.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2901",
        grade: "sahih",
        excerpt:
          "The Hour will not come until you see ten signs: the smoke, the Dajjal, the Beast, the sun rising from the west, the descent of 'Isa, Ya'juj and Ma'juj, and three landslides… (Hudhayfah ibn Usayd)",
      },
    ],
    misconceptions: [
      "Misconception: Every major world event is definitely a final sign. Correction: Such claims require authentic evidence and scholarly caution, not sensationalism.",
      "Misconception: Knowing the signs lets us date the Hour. Correction: The exact time is known to Allah alone; the signs call us to prepare, not to predict.",
    ],
    appLinks: [{ label: "Signs of the Last Day", route: "/last-day/signs-overview" }],
  },

  // ── Reference ───────────────────────────────────────────────────────────────
  {
    id: "faq",
    section: "reference",
    title: "Aqeedah FAQ",
    summary: "Common creed questions answered with balance, evidence, and good adab.",
    body: [
      "Q: Are all Sunnis identical on every point of creed? A: Ahl al-Sunnah share one foundation and agree completely on the essentials; the recognised theological schools (Athari, Ash'ari, Maturidi) differ only in some technical formulations, and this should be approached with respectful learning, not hostility.",
      "Q: Do I need advanced philosophy to have correct aqeedah? A: No. Every Muslim is required to learn the essentials according to their need — the six articles and pure tawheed — while deeper study is beneficial under qualified teachers.",
      "Q: Should knowing aqeedah make me harsh with others? A: No. Sound creed should increase humility, gratitude, mercy, and careful speech. Using creed to belittle Muslims or rush to takfir is itself a serious error.",
      "Q: What is the difference between iman, islam, and ihsan? A: In the Hadith of Jibril, islam is the outward acts of worship, iman is the inner beliefs (the six articles), and ihsan is the perfection of both — to worship Allah as though you see Him.",
    ],
    actions: [
      "Prioritise the clear, agreed fundamentals before disputed technical details.",
      "Consult qualified local scholars when a complex creed issue actually affects your practice.",
    ],
  },
  {
    id: "references",
    section: "reference",
    title: "References and Further Study",
    summary: "Begin with Qur'an and authentic Sunnah, then trusted Sunni creed primers.",
    body: [
      "The primary reference for creed is always the Qur'an and the authentic Sunnah, understood as the Companions and the early scholars of Ahl al-Sunnah understood them — not through later trends read back into the texts.",
      "Beneficial study includes the concise classical creed primers (such as al-'Aqidah al-Tahawiyya and the works of the early scholars) taught with explanation suited to your level by reliable teachers.",
      "When scholars differ on secondary points, learn the evidence with humility and avoid turning technical disagreements into sectarian hostility — the unity of the believers upon the essentials is itself a command of the religion.",
    ],
    disclaimer:
      "This module is educational and non-polemical. For personal rulings or sensitive creed concerns, consult qualified scholars you trust.",
    actions: [
      "Study one creed topic each week with a teacher or a trusted primer.",
      "Memorise the six articles of faith and be able to explain each in your own words.",
    ],
    appLinks: [
      { label: "Qur'an", route: "/quran" },
      { label: "Hadith", route: "/hadith" },
      { label: "Learn Dua", route: "/learn-dua" },
    ],
  },
];
