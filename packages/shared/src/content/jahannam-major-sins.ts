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
      "Definition: Shirk is to associate a partner with Allah — to direct any act that belongs to Him alone (worship, ultimate love, fear, hope, reliance, or the right to legislate) to something or someone besides Him. It is the exact opposite of tawheed, and it strikes at the very purpose for which creation exists: to worship Allah alone.",
      "Why it is the gravest of all sins: every other sin is a wrong done while acknowledging the true Lord, but shirk is a wrong done against Him directly — mistaking the creation for the Creator. This is why the Qur'an calls it 'great wrongdoing' (31:13). It is the one sin that, if a person dies upon it without repenting, is not forgiven: 'Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills' (4:48). The mercy hidden even in this severity is that everything short of shirk remains under Allah's forgiveness.",
      "Its forms: scholars distinguish major shirk — worshipping idols, the dead, saints, or created things; calling upon other than Allah for what only He can give; and directing sacrifice or vows to other than Him — which takes a person outside Islam if unrepented. There is also lesser and hidden shirk, such as showing off in worship (riya'), swearing by other than Allah, or relying on omens and charms, which is a serious sin but does not by itself expel from the religion.",
      "The path away from it: guard and strengthen tawheed by learning it, worshipping Allah alone, and purifying intention so that deeds are for Him and not for people's eyes. Whoever has fallen into shirk repents by sincerely renouncing it and returning to worship of Allah alone — and that door of return stays open for as long as one lives.",
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
        citation: "6871",
        grade: "sahih",
        excerpt:
          "The greatest of the major sins are: associating partners with Allah, killing a soul, disobedience to parents, and giving false testimony.",
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
      "Definition: Murder here means the unlawful, deliberate taking of a life that Allah has made sacred. Islam does recognise lawful cases — such as lawful qisas (legal retribution) carried out by proper authority — but the killing of an innocent soul outside of just cause is among the very gravest crimes.",
      "Why it is so grave: the Qur'an weighs a single unjust killing on the scale of all humanity: 'Whoever kills a soul... it is as if he had killed all mankind' (5:32), for to destroy one life is to violate the sanctity that protects every life. Murder was the first sin committed between the children of Adam, and revelation returns to it again and again as a destroyer of the Hereafter.",
      "A double wrong: murder is at once a sin against Allah, whose right over the sacredness of life is trampled, and a sin against people — the victim and those they leave behind. This is why its repentance is heavier than most: turning to Allah is necessary, but the rights of the wronged also stand, and where the law of the land or Islamic law prescribes blood money (diyah) or other consequences, these must be met through proper channels and qualified scholars.",
      "The path away from it: hold every life sacred, defuse anger and enmity before they harden, and settle disputes through patience and justice rather than violence. And even this greatest of crimes against people is not beyond Allah's mercy for the one who repents sincerely, discharges the rights involved as far as possible, and never returns to such a path.",
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
        surah: 4,
        ayahFrom: 93,
        label: "Qur'an 4:93",
        excerpt:
          "Whoever kills a believer intentionally — his recompense is Hell, wherein he will abide eternally.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6871",
        grade: "sahih",
        excerpt:
          "The greatest of the major sins are: associating partners with Allah, killing a soul, disobedience to parents, and giving false testimony.",
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
      "Definition: Zina is any unlawful sexual relation outside a valid marriage, covering both fornication (between the unmarried) and adultery (involving a married person). Islam treats it not as a private matter but as a violation with wide harm.",
      "Why it is grave: zina corrodes the things a healthy society is built on — lineage, trust between spouses, the security of children, and the chastity that dignifies a person. The Qur'an's wording is itself instructive: it does not merely forbid the act but says 'do not even approach' it (17:32), warning against the glances, privacy, and steps that lead toward it. That prohibition of the approach is a mercy, because it protects a person before temptation becomes overwhelming.",
      "The wisdom in the barriers: rather than leaving people to fight desire at its peak, Islam surrounds them with earlier protections — lowering the gaze, modesty in dress and conduct, avoiding seclusion with the opposite sex, and encouraging marriage as the lawful, honoured channel for these needs. Building these boundaries in advance is far easier than resisting at the edge.",
      "The path back: for anyone who has fallen, the way out is sincere tawbah — leaving the sin completely, regretting it, resolving never to return, and covering rather than publicising one's past. Zina is a major sin, but it is emphatically among those Allah forgives for the one who turns to Him; despair has no place, and a new beginning is always available.",
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
        surah: 25,
        ayahFrom: 68,
        ayahTo: 70,
        label: "Qur'an 25:68–70",
        excerpt:
          "And those who do not commit unlawful sexual intercourse... except one who repents, believes, and does righteous work — for them Allah will replace their evil deeds with good.",
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
      "Definition: Riba is the unlawful increase in certain financial dealings — most familiarly the interest charged or paid on loans, but also including specific unequal or deferred exchanges of like commodities. Its essence is gaining wealth without genuine value or risk, at another's expense.",
      "Why it is exceptionally grave: riba is unique among financial sins in the language the Qur'an uses against it. Allah declares war from Himself and His Messenger ﷺ upon those who persist in it (2:279) — a phrase used for no other sin — because riba exploits need, concentrates wealth in the hands of a few, and hollows out the compassion an economy is meant to carry. The Prophet ﷺ warned severely against dealing in it in any capacity.",
      "The wisdom and the mercy: the prohibition redirects people toward real trade, shared risk, and charity, and it protects the vulnerable from being crushed by debt. Even here, though, Allah's mercy is present: when the command came, He did not demand that past interest already taken be clawed back, but told believers simply to abandon what remained — 'you shall have your principal' (2:279) — an ease for those turning away from it.",
      "The path away from it: audit your finances for interest-based products, seek halal alternatives, and consult qualified scholars for genuinely difficult cases such as mortgages in non-Muslim lands. Leaving riba can mean hard financial choices, but the safety of the soul outweighs any temporary gain — and Allah promises to provide for the one who fears Him from where he does not expect.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 278,
        ayahTo: 279,
        label: "Qur'an 2:278–279",
        excerpt:
          "O you who believe, fear Allah and give up what remains of riba, if you are believers. If you do not, then be informed of a war from Allah and His Messenger. But if you repent, you may have your principal — you do no wrong, nor are you wronged.",
      },
      {
        surah: 2,
        ayahFrom: 276,
        label: "Qur'an 2:276",
        excerpt: "Allah destroys interest and gives increase for charities.",
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
      "Definition: False testimony (shahadat al-zur) is bearing witness to something untrue — and more broadly, lying under oath, fabricating accusations, or withholding truthful testimony when justice depends on it.",
      "Why it is grave: it corrupts the very instrument by which justice is done. A single false witness can send an innocent person to ruin, strip a rightful owner of their property, or free an oppressor — so the lie is never contained to the liar; it wounds real people and the whole order of fairness. The Prophet ﷺ counted it among the greatest of major sins, and in one narration he grew so insistent in repeating the warning against it that his Companions wished he would stop, out of concern for him.",
      "Its link to the tongue: false testimony is the sharpest edge of the wider sins of speech. Because words are cheap to utter, this sin is dangerously easy to fall into — a signature, an exaggeration, a convenient silence — and yet its weight on the Day of Judgment is immense, when the very limbs and tongues of people will testify truthfully against them.",
      "The path away from it: hold to truth even when it is costly or against one's own interest, refuse to lend one's word to any falsehood, and speak up with just testimony when it is needed. One who has borne false witness repents by retracting the lie where possible, striving to undo the harm and restore the rights of anyone wronged, and turning to Allah with sincere regret.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 72,
        label: "Qur'an 25:72",
        excerpt:
          "And those who do not testify to falsehood, and when they pass near ill speech, they pass by with dignity.",
      },
      {
        surah: 22,
        ayahFrom: 30,
        label: "Qur'an 22:30",
        excerpt: "So avoid the uncleanliness of idols and avoid false statement.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5976",
        grade: "sahih",
        excerpt:
          "Shall I not inform you of the greatest of major sins? Associating partners with Allah, disobedience to parents — and giving false testimony, and giving false testimony.",
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
      "Definition: Sihr (sorcery or magic) is the use of forbidden means — often involving reliance on devils or a claim to power over the unseen — to affect people or events. Practising it, learning it, seeking it from others, and believing those who claim it all fall under this sin.",
      "Why it is so grave: much of sihr cannot be performed without acts of disbelief, such as drawing near to devils or degrading the Qur'an, which is why the Qur'an ties its knowledge to kufr. Speaking of the magic learned in the time of Sulayman, Allah says the devils and those two angels taught it only as a trial, warning 'do not disbelieve' (2:102). Beyond the creedal danger, sihr harms real people — sowing division between spouses, spreading fear, and exploiting the desperate.",
      "Related practices: the same warning extends to fortune-telling, to treating astrology as certain knowledge of the unseen, and to amulets and charms that carry shirk. Claiming knowledge of the hidden future belongs to Allah alone, and turning to those who claim it undermines tawheed at its root.",
      "The path away from it: for one entangled in these practices, repentance means abandoning them entirely, destroying any forbidden items, cutting ties with those who deal in them, and renewing sincere tawheed and reliance on Allah alone. Protection is found in faith, in the daily adhkar, and in seeking refuge in Allah — and His forgiveness is open to whoever truly returns.",
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
        collection: "Sunan Abi Dawud",
        citation: "3904",
        grade: "sahih",
        excerpt:
          "Whoever comes to a fortune-teller and believes in what he says has disbelieved in what was revealed to Muhammad.",
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
      "Definition: This sin is the taking, wasting, or misusing of the property of orphans — children who have lost a father and cannot protect their own interests. A guardian holds their wealth as a trust (amanah), never as an owner.",
      "Why it is grave: it combines two wrongs — betrayal of a sacred trust and oppression of the most defenceless. The Qur'an's imagery is severe: those who consume orphans' wealth unjustly 'consume only fire into their bellies' (4:10), turning a moment of greed into a self-inflicted punishment. To exploit one who has no one to speak for them is among the ugliest forms of injustice, which is why the warning is so sharp — and, being sharp, so merciful in steering guardians away from it.",
      "What it includes: not only outright theft, but subtler forms — mixing an orphan's property with one's own to blur the line, delaying its return once the orphan comes of age, or investing or spending it without right. Allah commands the opposite: 'Give the orphans their property, and do not exchange the bad for the good' (4:2).",
      "The path away from it: guard orphans' wealth scrupulously, keep it separate and accounted for, hand it over in full when they mature, and — for one who has fallen short — repent by returning what is owed with any due increase and seeking the pardon of those wronged. On the Day when no wealth or lineage will help except a sound heart, restoring such a trust is itself a treasured deed.",
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
      "Definition: 'Uquq al-walidayn is grave disobedience and mistreatment of one's parents — harming them, treating them with contempt, neglecting them in need, or wounding them by word or deed. It is the opposite of birr al-walidayn, the dutiful kindness Islam commands.",
      "Why it is so grave: in verse after verse Allah pairs the command to worship Him with the command to be good to parents, as in 'Worship Allah... and to parents do good' (4:36) — placing their right immediately after His own. Parents are, after Allah, the nearest source of a person's very being and upbringing, so ingratitude toward them is a kind of ingratitude that runs deep. The Prophet ﷺ listed their mistreatment among the greatest of major sins, second only to shirk.",
      "An important balance: dutifulness does not mean obeying parents in disobedience to Allah — no creature is obeyed in sin against the Creator. But even where one must decline, it is done with gentleness, respect, and continued kindness. The Qur'an forbids even the smallest word of exasperation: 'do not say to them uff' (17:23).",
      "The path of return: the mercy here is that parents are usually still within reach. For one who has fallen short, repentance is largely practical — resume kindness, seek their pardon, serve them, and make du'a for them, especially while they are alive. And if a parent has passed, dutifulness continues through praying for them, giving charity on their behalf, and honouring their ties and friends.",
    ],
    quran: [
      {
        surah: 17,
        ayahFrom: 23,
        label: "Qur'an 17:23",
        excerpt:
          "Your Lord has decreed that you worship none but Him, and to parents good treatment. Do not say to them 'uff' nor repel them, but speak to them a noble word.",
      },
      {
        surah: 4,
        ayahFrom: 36,
        label: "Qur'an 4:36",
        excerpt: "Worship Allah and associate nothing with Him, and to parents do good.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5976",
        grade: "sahih",
        excerpt:
          "Shall I not inform you of the greatest of major sins? Associating partners with Allah, and disobedience to parents.",
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
      "Definition: Theft (sariqah) is taking the wealth or property of others without right — whether by stealth, embezzlement, fraud, or any covert seizure of what one has no claim to.",
      "Why it is grave: it violates both a right of people and the trust on which communal life depends. Its seriousness is underlined by the prescribed penalty the Qur'an mentions for qualifying cases (5:38) — a penalty hedged by strict conditions and high evidentiary standards, so that its very severity serves mainly as a powerful deterrent that keeps people's property secure. Islam's aim is a society in which people feel safe with their belongings.",
      "Its modern faces: theft is not limited to breaking into a house. It includes taking from an employer, cheating in business, withholding workers' wages, digital piracy, plagiarism, and benefiting from what is not lawfully one's own. What is hidden from other people is never hidden from Allah, who sees every private taking.",
      "The path of return: because a human right is involved, repentance requires more than remorse before Allah. One must return the stolen item itself, or its value, to its rightful owner, and seek their pardon where possible; if the owner cannot be found, scholars advise giving the amount in charity on their behalf. Discharged in this way, even theft is fully forgiven by the One who loves the returning servant.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 38,
        label: "Qur'an 5:38",
        excerpt:
          "As for the thief, the male and the female, cut off their hands in recompense for what they earned — a deterrent from Allah.",
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
      "Definition: Khamr is anything that intoxicates and clouds the intellect — wine and all alcohol, and by the Prophet's ﷺ own principle, every intoxicating substance whatever its form or name. 'Every intoxicant is khamr, and every khamr is forbidden.'",
      "Why it is grave: the mind is the faculty by which a person knows Allah, discerns right from wrong, and guards every other responsibility. Intoxicants dismantle exactly that, which is why the Qur'an brackets them with idols and gambling as 'defilement from the work of Satan' and commands, 'avoid them' (5:90). Beyond the individual, they wreck health, families, and safety, and open the door to sins a sober person would never approach.",
      "The wisdom of how it was forbidden: Allah did not ban khamr in a single abrupt stroke but prohibited it in stages, weaning the early community off a deep-rooted habit gently. That gradualness is itself a lesson in mercy — and a model of hope for anyone struggling to leave it today.",
      "The path of return, with compassion: those caught in addiction are not to be despised but supported. Repentance means resolving to leave the substance, removing it and its triggers from one's life, seeking help and treatment without shame, and filling the void with good company, dhikr, and worship. Allah's door is wide open, and every sincere step away from intoxicants is a step He welcomes.",
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
