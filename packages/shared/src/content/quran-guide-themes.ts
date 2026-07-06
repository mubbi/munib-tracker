import type { QuranGuideTheme } from "../types/quran-guide";

/**
 * Major themes of the Qur'an with verses, hadith, and practical lessons. Bump
 * QURAN_GUIDE_THEMES_VERSION on content change.
 */
export const QURAN_GUIDE_THEMES_VERSION = 2;

export const QURAN_GUIDE_THEMES: QuranGuideTheme[] = [
  {
    id: "faith",
    title: "Faith (Iman)",
    summary: "Belief in Allah, His angels, books, messengers, the Last Day, and divine decree.",
    lessons: [
      "Iman rests on six articles the Qur'an gathers in one place: belief in Allah, His angels, His revealed books, His messengers, the Last Day, and divine decree — the good of it and the bad.",
      "Iman is not a fixed, one-time affirmation. In mainstream Sunni belief it increases with obedience and remembrance and decreases with sin and heedlessness, so faith is something you actively grow.",
      "The Prophet ﷺ taught that faith has over seventy branches, ranging from the greatest — the testimony that there is no god but Allah — down to removing harm from the road, showing that even small good deeds are part of faith.",
      "True iman is a matter of the heart before the tongue: to truly know Allah, to love Him above all, to fear His displeasure, and to rely wholly upon Him.",
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
        citation: "Hadith 35",
        grade: "sahih",
        excerpt:
          "Faith has over seventy branches; the highest is saying 'There is no god but Allah,' and the lowest is removing something harmful from the road — and modesty is a branch of faith.",
      },
    ],
    actions: [
      "Renew your shahada today with full attention to what it means, not as a routine phrase.",
      "Learn one of Allah's names, understand it, and call on Him by it in your du'a.",
    ],
  },
  {
    id: "prayer",
    title: "Prayer (Salah)",
    summary:
      "The first deed asked about on the Day of Judgment — the pillar that connects servant to Lord.",
    lessons: [
      "Salah is the second pillar of Islam and the first deed a servant will be questioned about on the Day of Judgment — if it is sound, the rest of the record tends to follow.",
      "The Qur'an says prayer, performed with real presence of heart, restrains a person from immorality and wrongdoing; it is not just a ritual but a recurring reset of the soul five times a day.",
      "Unlike other obligations revealed on earth, salah was prescribed for the ummah during the Prophet's ﷺ ascension (al-Isra wal-Mi'raj), marking it out as a special gift and the believer's own means of ascent to Allah.",
      "Because it is repeated five times daily, salah is the steady rhythm that keeps faith alive between one act of worship and the next.",
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
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "Hadith 413",
        grade: "hasan",
        excerpt:
          "The first of a servant's deeds to be judged on the Day of Resurrection will be his prayer; if it is sound he has succeeded, and if it is defective he has failed and lost.",
      },
    ],
    actions: [
      "Pray one salah today slowly, understanding the words of al-Fatiha as you recite them.",
      "Open Munib's Learn Salah guide to strengthen one part of your prayer.",
    ],
  },
  {
    id: "parents",
    title: "Parents",
    summary:
      "Kindness to parents is paired with worship of Allah — after shirk, ingratitude to them is warned against.",
    lessons: [
      "Allah joins kindness to parents directly to His own worship in the same verse — a sign of how weighty their right is in Islam.",
      "The Qur'an forbids even the smallest sign of irritation: not so much as saying 'uff' to them, nor speaking harshly, but addressing them with gentle, honourable words.",
      "The command peaks in old age, when parents most need patience: care for them as they once cared for you, and lower to them the wing of humility out of mercy.",
      "Devotion does not end at death — continuing to make du'a for parents, giving charity on their behalf, and honouring their friends and promises are ongoing acts of loyalty.",
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
      "Scholars describe sabr in three forms: patience in obeying Allah, patience in staying away from sin, and patience in accepting His decree when trials strike.",
      "Sabr is not passive despair or gritting your teeth in isolation — the Qur'an pairs it with prayer as a source of help, so patience is active and turns you toward Allah, not away.",
      "Allah declares Himself to be 'with the patient,' and promises the patient their reward without measure — an honour attached to almost no other quality.",
      "The prophets were the most severely tested of people, and the Qur'an holds up their steadfastness — Ayyub in illness, Yaqub in grief, Yusuf through betrayal and prison — as the model to imitate.",
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
    actions: [
      "When irritation rises today, pause, breathe, and say 'Inna lillahi wa inna ilayhi raji'un' before you react.",
      "Turn one moment of hardship this week into two rak'ah of prayer instead of a complaint.",
    ],
  },
  {
    id: "charity",
    title: "Charity (Sadaqah & Zakat)",
    summary: "Purifying wealth and feeding the needy — a sign of true faith.",
    lessons: [
      "Zakat — the annual purifying charity on qualifying wealth — is the third pillar of Islam and an obligation, while sadaqah is voluntary giving with no upper limit and endless forms.",
      "The Qur'an promises that wealth spent for Allah's sake is not lost but multiplied: like a single seed that grows seven ears, each bearing a hundred grains, and Allah multiplies further for whom He wills.",
      "Charity is not only money. The Prophet ﷺ taught that even meeting your brother with a smiling face is charity, so no one is too poor to give.",
      "Giving purifies both the wealth and the giver, loosening the grip of greed and building compassion — which is why the word zakat itself means purification and growth.",
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
      "Give something today — money, your time, or a genuinely kind word — even if small and unseen.",
      "Review your zakat obligations in Munib and note when the next payment is due.",
    ],
  },
  {
    id: "repentance",
    title: "Repentance (Tawbah)",
    summary: "Allah loves those who repent — the door is open until the soul reaches the throat.",
    lessons: [
      "Sincere tawbah has clear conditions: genuine regret for the sin, immediately stopping it, and a firm resolve never to return — and if the sin wronged another person, restoring their right as well.",
      "Allah does not merely permit repentance — He loves those who turn back to Him repeatedly, so returning after a slip is itself beloved to Him, not a mark against you.",
      "The door of mercy is astonishingly wide: Allah tells even those who have wronged themselves greatly not to despair, for He forgives all sins for the one who repents sincerely.",
      "Repentance is not reserved for major sins or dramatic moments — istighfar (seeking forgiveness) throughout the day keeps the heart soft and the account clean.",
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
    actions: [
      "Say 'Astaghfirullah' 100 times today, meaning it, and feel the weight lift.",
      "Name one habit you know displeases Allah and take the first concrete step to leave it.",
    ],
  },
  {
    id: "heaven",
    title: "Paradise (Jannah)",
    summary: "Eternal reward prepared for the muttaqin — described in vivid, motivating detail.",
    lessons: [
      "The Qur'an describes Jannah in vivid, motivating detail — gardens beneath which rivers flow, everlasting ease, and reunion with the righteous — precisely to make the believer yearn for it and strive.",
      "Entry into Paradise is ultimately by Allah's mercy, not by deeds alone; faith and sincere effort are the means, but no one's works could earn eternal reward without His grace.",
      "The Qur'an urges believers to compete and hasten toward forgiveness and a Garden 'as wide as the heavens and earth' — it is meant to be actively pursued, not passively hoped for.",
      "The greatest reward of all is not the gardens or rivers but seeing the Face of Allah — the ultimate joy the people of Paradise are promised.",
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
      "Jahannam is a real warning, not a metaphor — the Qur'an describes it plainly so that people take the danger seriously and change course while they still can.",
      "Fear of the Fire is meant to work alongside hope in Allah's mercy: the believer walks between khawf (fear) and raja (hope), so neither despair nor false security takes over.",
      "The one sin the Qur'an singles out as unforgivable if a person dies upon it is shirk — associating partners with Allah; everything less than that He may forgive for whom He wills.",
      "Allah warns in order to bring people back to Him, not to crush the one who repents — every warning is paired in the Qur'an with an open invitation to return.",
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
    actions: [
      "After each salah today, ask Allah sincerely to protect you from the Fire.",
      "Renew your tawhid: reflect on worshipping Allah alone, the surest protection from Jahannam.",
    ],
  },
  {
    id: "justice",
    title: "Justice",
    summary: "Stand firm for justice even against yourselves or your kin.",
    lessons: [
      "Justice in the Qur'an is uncompromising: stand firm for it even when the truth counts against yourself, your parents, or your closest kin.",
      "Allah commands that hatred of a people must never push you into injustice — 'be just; that is nearer to righteousness (taqwa)' — so fairness is owed even to enemies.",
      "Oppression (dhulm) is gravely warned against; the Prophet ﷺ taught that wrongdoing will appear as darkness upon the wrongdoer on the Day of Resurrection.",
      "Justice is not only for judges and rulers — it lives in honest speech, fair dealing, keeping your word, and giving every person their due right.",
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
    actions: [
      "Give someone their due right today — a fair wage, an honest answer, or credit you owe them.",
      "Catch one moment where bias tempts you to be unfair, and choose justice instead.",
    ],
  },
  {
    id: "knowledge",
    title: "Knowledge",
    summary: "Read, reflect, and say 'My Lord, increase me in knowledge.'",
    lessons: [
      "The very first word revealed of the Qur'an was 'Read' — Islam opened not with a ritual but with a command to learn, honouring both the literacy of the mind and the knowledge of the heart.",
      "Allah told even His Prophet ﷺ to keep asking for more: 'My Lord, increase me in knowledge' — the only thing the Qur'an instructs him to seek increase in.",
      "Beneficial knowledge is meant to be acted upon and passed on; the Prophet ﷺ taught that the scholars are the heirs of the prophets, inheriting not wealth but knowledge.",
      "Seeking sacred knowledge is itself worship, and the Qur'an distinguishes plainly between those who know and those who do not — 'are they equal?'",
    ],
    quran: [
      {
        surah: 20,
        ayahFrom: 114,
        label: "Qur'an 20:114",
        excerpt: "And say: My Lord, increase me in knowledge.",
      },
    ],
    actions: [
      "Learn one new thing from the Qur'an today — a verse, a word, or a ruling — and teach it to someone.",
      "Memorise the du'a 'Rabbi zidni ilma' and say it before you study.",
    ],
  },
  {
    id: "prophets",
    title: "Prophets",
    summary: "Stories of guidance, trial, and divine support — not entertainment but instruction.",
    lessons: [
      "The Qur'an teaches that no nation was left without guidance: 'there is no community except that a warner passed among them' — the same message of tawhid was sent everywhere.",
      "All the prophets brought one core call — worship Allah alone — and their stories are recounted not as history for its own sake but as instruction for 'those of understanding'.",
      "Muhammad ﷺ is the Seal of the Prophets, the last messenger, and a Muslim must believe in all the prophets before him — Nuh, Ibrahim, Musa, Isa, and the rest — making no distinction among them.",
      "The prophets were human beings and servants of Allah, not divine; the Qur'an honours them yet keeps them firmly on the side of creation, never worshipped alongside the Creator.",
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
      "The Qur'an teaches the spiritual equality of men and women before Allah: the same faith, the same deeds, and the same reward are promised to 'the believing men and the believing women' alike.",
      "Women and men are described as partners and protectors of one another in faith, not as possessions — the fourth surah, an-Nisa ('The Women'), devotes itself largely to safeguarding their rights, dignity, inheritance, and treatment.",
      "The Qur'an holds up Maryam, the mother of Isa, as a model for all believers, and honours mothers so highly that the well-known teaching places Paradise at their feet.",
      "Both sexes trace back to a single origin — 'created you from one soul' — establishing a shared humanity and dignity from the very first verse of Surah an-Nisa.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 1,
        label: "Qur'an 4:1",
        excerpt: "Fear your Lord, who created you from one soul and created from it its mate…",
      },
    ],
    actions: [
      "Honour a woman in your life today — a mother, wife, sister, or daughter — with a specific right or kindness she is owed.",
    ],
  },
  {
    id: "children",
    title: "Children",
    summary: "A trust (amana) — to be raised upon tawheed and kindness.",
    lessons: [
      "Children are an amana — a trust from Allah — and the Qur'an makes parents responsible for their upbringing: 'protect yourselves and your families from a Fire' begins with teaching them tawhid and good character.",
      "The Prophet ﷺ counted teaching and learning the Qur'an among the best of deeds, so guiding a child to recite even a little of it plants a lasting good whose reward keeps returning to the parent.",
      "A widely repeated piece of parenting wisdom advises meeting children at their stage — playing with them in the early years, then teaching and gently disciplining them, then befriending them as they mature.",
      "Raising a righteous child is an investment beyond this life: a righteous descendant who prays for a parent continues to benefit them long after death.",
    ],
    quran: [
      {
        surah: 66,
        ayahFrom: 6,
        label: "Qur'an 66:6",
        excerpt: "O you who believe, protect yourselves and your families from a Fire…",
      },
    ],
    actions: [
      "Teach a child one short verse or a single good manner today, patiently and with encouragement.",
      "Make du'a for your children (or the children in your care) by name to be upright and beloved to Allah.",
    ],
  },
];
