import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../types/jannah";

/**
 * Journey to Jannah — educational content about Paradise, its ranks, gates, and
 * the deeds that elevate a believer. Scholar-neutral; every claim cites Qur'an
 * or authentic hadith. Does not map deeds to numbered levels (that is not in the
 * texts). Bump the version when content changes.
 */
export const JANNAH_CONTENT_VERSION = 1;

export const JANNAH_PATH_TOPIC_IDS = [
  "tawheed",
  "salah",
  "tawbah",
  "quran",
  "dhikr",
  "charity",
  "character",
  "knowledge",
  "voluntary-worship",
  "patience-gratitude",
  "dawah",
  "major-deeds",
  "mercy",
] as const;

export const JANNAH_TOPICS: JannahTopic[] = [
  {
    id: "about",
    hub: "about",
    title: "What is Jannah?",
    summary: "The eternal Garden Allah prepared for the righteous.",
    body: [
      "Jannah (Paradise) is the abode of reward Allah has prepared for those who believe and do righteous deeds. Life there is eternal — no death, no illness, no grief, and no fatigue.",
      "Its pleasures are beyond what any eye has seen, any ear has heard, or any heart has imagined. The greatest reward is the pleasure of Allah and, for the highest ranks, the honour of seeing Him.",
      "Entry and rank in Paradise are ultimately by Allah's mercy. Good deeds are the means He accepts, but no one earns Paradise by deeds alone.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 133,
        label: "Qur'an 3:133",
        excerpt:
          "Race toward forgiveness from your Lord and a Garden whose width is that of the heavens and the earth.",
      },
      {
        surah: 9,
        ayahFrom: 72,
        label: "Qur'an 9:72",
        excerpt:
          "Allah has promised the believing men and women Gardens beneath which rivers flow.",
      },
      {
        surah: 32,
        ayahFrom: 17,
        label: "Qur'an 32:17",
        excerpt:
          "No soul knows what has been hidden for them of comfort as reward for what they used to do.",
      },
      {
        surah: 50,
        ayahFrom: 35,
        label: "Qur'an 50:35",
        excerpt: "They will have whatever they wish therein, and with Us is more.",
      },
      {
        surah: 18,
        ayahFrom: 107,
        label: "Qur'an 18:107",
        excerpt:
          "Those who believe and do righteous deeds — for them are the Gardens of Refuge as hospitality.",
      },
    ],
  },
  {
    id: "ranks",
    hub: "ranks",
    title: "Ranks in Paradise",
    summary: "Paradise has many degrees — not a fixed ladder of seven.",
    body: [
      "A common misconception is that Paradise has exactly seven levels. The Qur'an speaks of seven heavens (samawat), not seven levels of Jannah.",
      "Authentic hadith teach that Paradise has many darajat (ranks or degrees). One narration mentions one hundred levels prepared for those who strive in Allah's cause.",
      "Allah raises each believer according to faith, sincerity, and deeds. The exact rank belongs only to Him — revelation does not give a complete checklist of 'do X to reach level N.'",
      "Rather than aiming at a numbered level, the Prophet ﷺ taught us to ask Allah for the highest: Al-Firdaws.",
    ],
    quran: [
      {
        surah: 6,
        ayahFrom: 132,
        label: "Qur'an 6:132",
        excerpt: "For all there will be degrees according to what they did.",
      },
      {
        surah: 3,
        ayahFrom: 163,
        label: "Qur'an 3:163",
        excerpt: "They are degrees with Allah.",
      },
      {
        surah: 4,
        ayahFrom: 69,
        label: "Qur'an 4:69",
        excerpt:
          "Whoever obeys Allah and the Messenger — they will be with those upon whom Allah has bestowed favour.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "2790",
        grade: "sahih",
        excerpt:
          "Paradise has one hundred levels which Allah has prepared for those who fight in His cause. The distance between each two levels is like the distance between the heavens and the earth.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "7312",
        grade: "sahih",
        excerpt:
          "When you ask Allah for Paradise, ask Him for Al-Firdaws, for it is the highest part of Paradise and the middle of Paradise, and from it the rivers of Paradise flow.",
      },
    ],
    appLinks: [{ label: "Ask for Al-Firdaws", route: "/jannah/al-firdaws" }],
  },
  {
    id: "al-firdaws",
    hub: "ranks",
    title: "Al-Firdaws — the highest",
    summary: "The peak of Paradise, closest to the Throne.",
    body: [
      "Al-Firdaws is the highest level of Paradise mentioned in authentic hadith. The Prophet ﷺ said it is the best of Paradise, its middle, and from it the rivers of Paradise originate.",
      "When making du'a, he taught the companions to ask specifically for Al-Firdaws rather than settling for a lesser request.",
      "Striving with sincere faith, fulfilling obligations, and increasing voluntary worship are among the means by which Allah may elevate a servant — but the final gift is His mercy.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7312",
        grade: "sahih",
        excerpt:
          "When you ask Allah for Paradise, ask Him for Al-Firdaws, for it is the highest part of Paradise and the middle of Paradise, and from it the rivers of Paradise flow.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2831",
        grade: "sahih",
        excerpt:
          "None of you will enter Paradise because of his deeds alone. They said: Not even you, O Messenger of Allah? He said: Not even me, unless Allah covers me with His mercy.",
      },
    ],
    actions: [
      "Ask Allah for Al-Firdaws in your du'a, especially in sujud and before sleep.",
      "Perfect what is obligatory upon you, then increase voluntary worship.",
      "Renew repentance often and rely on Allah's mercy, not on your deeds alone.",
    ],
    appLinks: [
      { label: "Duas for Paradise", route: "/jannah/duas" },
      { label: "Morning & evening adhkar", route: "/zikr" },
    ],
  },
  {
    id: "warnings",
    hub: "warnings",
    title: "What endangers the Hereafter",
    summary: "Major sins require sincere repentance; Allah's forgiveness is vast.",
    body: [
      "This section is not to despair you — Allah forgives all sins for whoever repents sincerely. It is a reminder of what the texts warn against so you may turn back to Him.",
      "Shirk (associating partners with Allah) is the one sin Allah does not forgive if a person dies upon it without repenting. Correct tawheed is the foundation of every accepted deed.",
      "Persistently neglecting the five daily prayers without valid excuse is among the gravest warnings in hadith. Other major sins — such as unjust killing, unlawful relations, riba, and severe oppression — require tawbah and may lead to punishment if Allah does not forgive.",
      "Lesser sins also matter: backbiting, lying, arrogance, and cutting family ties erode character and require repentance. Return to Allah as often as you slip.",
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
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6443",
        grade: "sahih",
        excerpt:
          "The covenant between us and them is the prayer; whoever abandons it has committed kufr.",
      },
    ],
    appLinks: [
      { label: "Prayer tracker", route: "/tracker" },
      { label: "Qaza & making up missed worship", route: "/qaza" },
    ],
    disclaimer:
      "Lists of major sins in fiqh vary by scholar. This is a general reminder to repent — not a personal ruling. Consult a qualified scholar for your situation.",
  },
  {
    id: "promised",
    hub: "promised",
    title: "Those honoured in the texts",
    summary: "People and groups the Prophet ﷺ named regarding Paradise.",
    body: [
      "The Qur'an and Sunnah name certain companions, categories of believers, and deeds associated with glad tidings of Paradise. These are reports about them — not a guarantee for anyone else who merely hears their names.",
      "The Ten Promised Paradise (Asharah Mubashsharah) were named by the Prophet ﷺ in a single narration: Abu Bakr, Umar, Uthman, Ali, Talhah, Zubayr, Abd al-Rahman ibn Awf, Sa'd ibn Abi Waqqas, Sa'id ibn Zayd, and Abu Ubaydah ibn al-Jarrah (may Allah be pleased with them all).",
      "Other categories given glad tidings include the truthful and patient, those who die as martyrs in Allah's cause according to Islamic law, and those whose last words are la ilaha illallah.",
      "Their virtue was their faith and sacrifice — let their example inspire your striving, while you ask Allah for a good ending.",
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "3747",
        grade: "hasan",
        excerpt:
          "Abu Bakr is in Paradise, Umar is in Paradise, Uthman is in Paradise, Ali is in Paradise… (naming ten companions).",
      },
      {
        collection: "Sunan Abu Dawud",
        citation: "3116",
        grade: "sahih",
        excerpt:
          "He whose last words are 'None has the right to be worshipped except Allah' will enter Paradise.",
      },
    ],
    disclaimer:
      "Glad tidings in hadith refer to those named or to categories described. They do not replace the need for one's own faith, deeds, and a good ending. Allah knows best.",
  },
  {
    id: "tawheed",
    hub: "paths",
    title: "Tawheed — correct belief",
    summary: "No deed is accepted without sincere monotheism.",
    importance: "foundational",
    body: [
      "Tawheed — worshipping Allah alone — is the foundation of Islam. Allah does not accept deeds from someone who associates partners with Him.",
      "Avoid shirk, hypocrisy, and showing off in worship. Sincerity (ikhlas) turns ordinary acts into acts of devotion.",
      "Learning correct belief and living by it is the first step on every path to Paradise.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 65,
        label: "Qur'an 39:65",
        excerpt:
          "It has been revealed to you and to those before you: If you associate others with Allah, your deeds will surely come to nothing.",
      },
      {
        surah: 98,
        ayahFrom: 5,
        label: "Qur'an 98:5",
        excerpt:
          "They were not commanded except to worship Allah, being sincere to Him in religion.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1",
        grade: "sahih",
        excerpt: "Actions are judged by intentions, and every person will have what they intended.",
      },
    ],
    actions: [
      "Learn the basics of tawheed from trustworthy scholars.",
      "Renew your intention before acts of worship.",
      "Seek forgiveness for hidden showing off (riya).",
    ],
  },
  {
    id: "salah",
    hub: "paths",
    title: "Salah — the pillar",
    summary: "Preserving the five daily prayers is among the greatest deeds.",
    importance: "obligatory",
    body: [
      "The Prophet ﷺ described prayer as the pillar of religion. Whoever establishes it establishes religion; whoever neglects it has neglected much.",
      "Prayer on time, with humility (khushu), and in congregation when able, carries immense reward. Missing prayers without valid excuse is a grave matter requiring repentance and qada.",
      "Beyond the fard, regular sunnah and rawatib prayers add light and rank.",
    ],
    quran: [
      {
        surah: 23,
        ayahFrom: 1,
        ayahTo: 2,
        label: "Qur'an 23:1–2",
        excerpt: "Successful indeed are the believers — those who are humble in their prayer.",
      },
      {
        surah: 70,
        ayahFrom: 22,
        ayahTo: 23,
        label: "Qur'an 70:22–23",
        excerpt: "Except those who pray — those who are constant in their prayer.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "528",
        grade: "sahih",
        excerpt:
          "The first matter that the servant will be brought to account for on the Day of Judgment is the prayer.",
      },
    ],
    actions: [
      "Guard the five daily prayers at their times.",
      "Make up missed prayers (qaza) sincerely.",
      "Add sunnah prayers before and after fard where you can.",
    ],
    appLinks: [
      { label: "Prayer checklist", route: "/tracker" },
      { label: "Prayer schedule", route: "/schedule" },
      { label: "Salah guide", route: "/salah-guide" },
      { label: "Khushu journal", route: "/journal" },
    ],
  },
  {
    id: "tawbah",
    hub: "paths",
    title: "Sincere repentance",
    summary: "Allah loves those who constantly return to Him.",
    importance: "foundational",
    body: [
      "Tawbah is turning back to Allah with regret for sin, abandoning the sin, and resolving not to return. Allah accepts repentance until the soul reaches the throat at death.",
      "Every believer sins; the best of sinners are those who repent. Do not delay tawbah — return immediately after slipping.",
      "Repentance wipes sins and can transform a person from failure to success in the Hereafter.",
    ],
    quran: [
      {
        surah: 66,
        ayahFrom: 8,
        label: "Qur'an 66:8",
        excerpt:
          "Turn to Allah in sincere repentance — perhaps your Lord will remove from you your misdeeds.",
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
        citation: "6308",
        grade: "sahih",
        excerpt:
          "Allah is more pleased with the repentance of His servant than a man who finds his lost camel in a barren land.",
      },
    ],
    actions: [
      "Repent immediately when you sin — do not postpone.",
      "Follow sin with a good deed to erase it.",
      "Say istighfar throughout the day.",
    ],
    appLinks: [
      { label: "Morning & evening adhkar", route: "/zikr" },
      { label: "Qaza tracker", route: "/qaza" },
    ],
  },
  {
    id: "quran",
    hub: "paths",
    title: "The Qur'an",
    summary: "Recite, memorise, and live by the Book of Allah.",
    importance: "highly-recommended",
    body: [
      "The Qur'an is guidance and healing. Reciting it, understanding it, acting upon it, and teaching it are among the greatest acts of worship.",
      "The Prophet ﷺ said the companion of the Qur'an will be told on the Day of Resurrection: 'Recite and rise' — ascending in rank according to the last verse recited.",
      "Even a few verses daily, with consistency, build a lifelong relationship with Allah's words.",
    ],
    quran: [
      {
        surah: 35,
        ayahFrom: 29,
        label: "Qur'an 35:29",
        excerpt:
          "Those who recite the Book of Allah and establish prayer — Allah will give them a great reward.",
      },
      {
        surah: 73,
        ayahFrom: 4,
        label: "Qur'an 73:4",
        excerpt: "And recite the Qur'an with measured recitation.",
      },
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "2914",
        grade: "hasan",
        excerpt:
          "It will be said to the companion of the Qur'an: Recite and ascend, and recite as you used to recite in the world.",
      },
    ],
    actions: [
      "Read daily — even a few verses with reflection.",
      "Memorise new surahs or maintain what you know.",
      "Act on what you learn before seeking more.",
    ],
    appLinks: [
      { label: "Qur'an reader", route: "/quran" },
      { label: "Khatm planner", route: "/quran/khatm" },
      { label: "Hifz tracker", route: "/quran/hifz" },
    ],
  },
  {
    id: "dhikr",
    hub: "paths",
    title: "Dhikr — remembrance",
    summary: "Light on the tongue, heavy on the scale.",
    importance: "highly-recommended",
    body: [
      "Remembering Allah with tasbeeh, tahmeed, takbeer, and istighfar is among the easiest deeds with immense reward.",
      "Morning and evening adhkar protect the believer and draw Allah's pleasure. A few minutes at each boundary of the day reshape the heart.",
      "Dhikr is not only on the tongue — a heart that remembers Allah in daily choices is the goal.",
    ],
    quran: [
      {
        surah: 13,
        ayahFrom: 28,
        label: "Qur'an 13:28",
        excerpt: "Verily, in the remembrance of Allah do hearts find rest.",
      },
      {
        surah: 33,
        ayahFrom: 41,
        ayahTo: 42,
        label: "Qur'an 33:41–42",
        excerpt:
          "O you who believe, remember Allah with much remembrance — and glorify Him morning and afternoon.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6405",
        grade: "sahih",
        excerpt:
          "Two words are light on the tongue, heavy on the Scale, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      },
    ],
    actions: [
      "Complete morning and evening adhkar daily.",
      "Use a tasbeeh counter for istighfar or salawat.",
      "Remember Allah before sleep and after waking.",
    ],
    appLinks: [
      { label: "Adhkar library", route: "/zikr" },
      { label: "Tasbeeh counter", route: "/tasbeeh/free" },
    ],
  },
  {
    id: "charity",
    hub: "paths",
    title: "Charity & zakah",
    summary: "Spend from what Allah gave you — secretly and openly.",
    importance: "obligatory",
    body: [
      "Zakah is an obligation on eligible wealth. Beyond it, voluntary sadaqah — even small amounts — extinguishes sins and raises rank.",
      "Hidden charity that no one sees except Allah is especially beloved. Continuous charity (sadaqah jariyah) — such as beneficial knowledge, a well, or a masjid — continues rewarding after death.",
      "A smile, helping someone in need, and removing harm from the road are all charity.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 261,
        label: "Qur'an 2:261",
        excerpt:
          "The example of those who spend in the way of Allah is like a grain that grows seven spikes.",
      },
      {
        surah: 64,
        ayahFrom: 16,
        label: "Qur'an 64:16",
        excerpt:
          "So fear Allah as much as you are able… and spend from what We have provided you before death comes.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1413",
        grade: "sahih",
        excerpt:
          "When a person dies, his deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
      },
    ],
    actions: [
      "Calculate and pay zakah if you are liable.",
      "Give regular charity, even if small.",
      "Look for sadaqah jariyah opportunities.",
    ],
    appLinks: [{ label: "Zakat calculator", route: "/zakat" }],
  },
  {
    id: "character",
    hub: "paths",
    title: "Good character",
    summary: "The heaviest thing on the Scale may be excellent manners.",
    importance: "highly-recommended",
    body: [
      "Good character — truthfulness, patience, humility, mercy, and keeping promises — is half of faith in meaning and among the heaviest deeds on the Day of Judgment.",
      "The Prophet ﷺ was sent to perfect noble character. How you treat family, neighbours, and strangers is as much worship as ritual acts.",
      "Avoid backbiting, lying, arrogance, and breaking ties. Replace each habit with its opposite virtue.",
    ],
    quran: [
      {
        surah: 68,
        ayahFrom: 4,
        label: "Qur'an 68:4",
        excerpt: "And indeed, you are of a great moral character.",
      },
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "2002",
        grade: "hasan",
        excerpt:
          "Nothing is heavier on the Scale of a believer on the Day of Resurrection than good character.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "6018",
        grade: "sahih",
        excerpt: "The most complete of believers in faith are those with the best character.",
      },
    ],
    actions: [
      "Practice patience when provoked.",
      "Forgive others and mend broken relationships.",
      "Reflect on your character after salah in a daily journal.",
    ],
    appLinks: [{ label: "Khushu & character journal", route: "/journal" }],
  },
  {
    id: "knowledge",
    hub: "paths",
    title: "Seeking knowledge",
    summary: "Allah makes the path to Paradise easy for the one who seeks knowledge.",
    importance: "recommended",
    body: [
      "Learning what Allah and His Messenger taught — then acting upon it and sharing it — is a lifelong obligation.",
      "Knowledge leads to better worship, stronger conviction, and the ability to benefit others. Even learning one beneficial fact and passing it on can be sadaqah jariyah.",
      "Start with essentials: belief, prayer, fasting, and the major prohibitions — then deepen gradually.",
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "2641",
        grade: "hasan",
        excerpt:
          "Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2699",
        grade: "sahih",
        excerpt:
          "When a person dies, his deeds end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
      },
    ],
    actions: [
      "Learn something beneficial each week.",
      "Share knowledge without arrogance.",
      "Apply what you learn before collecting more.",
    ],
    appLinks: [
      { label: "Hadith library", route: "/hadith" },
      { label: "Salah guide", route: "/salah-guide" },
      { label: "Daily hadith", route: "/hadith/daily" },
    ],
  },
  {
    id: "voluntary-worship",
    hub: "paths",
    title: "Voluntary worship",
    summary: "Draw near to Allah through nafl beyond the obligatory.",
    importance: "highly-recommended",
    body: [
      "Allah says in a hadith qudsi that His servant continues drawing near through voluntary deeds until He loves him.",
      "Night prayer (tahajjud), duha, sunnah rawatib, voluntary fasting on Mondays and Thursdays, and fasting in Ramadan with extra days — all elevate rank.",
      "Choose a few voluntary acts you can sustain rather than burning out on many.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6502",
        grade: "sahih",
        excerpt:
          "My servant does not draw near to Me with anything more beloved to Me than what I have made obligatory upon him. And he continues to draw near through voluntary deeds until I love him.",
      },
    ],
    actions: [
      "Pray tahajjud even if only two rakahs.",
      "Fast voluntary days when able.",
      "Add consistent sunnah prayers before/after fard.",
    ],
    appLinks: [
      { label: "Tahajjud tracker", route: "/tahajjud" },
      { label: "Ramadan & fasting", route: "/ramadan" },
      { label: "Prayer checklist", route: "/tracker" },
    ],
  },
  {
    id: "patience-gratitude",
    hub: "paths",
    title: "Patience & gratitude",
    summary: "Allah loves the patient and the grateful.",
    importance: "highly-recommended",
    body: [
      "Patience (sabr) in hardship and restraint from sin, and gratitude (shukr) in ease, are marks of the successful in the Hereafter.",
      "Allah promises those who are patient reward without measure. Gratitude increases blessings and draws nearness to Him.",
      "Trials are not punishments by default — they may be purification and elevation for the believer who responds well.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 155,
        ayahTo: 157,
        label: "Qur'an 2:155–157",
        excerpt:
          "Give glad tidings to the patient — those who, when disaster strikes, say: Indeed we belong to Allah, and indeed to Him we will return.",
      },
      {
        surah: 14,
        ayahFrom: 7,
        label: "Qur'an 14:7",
        excerpt: "If you are grateful, I will surely increase you.",
      },
    ],
    actions: [
      "Say 'inna lillahi wa inna ilayhi raji'un' when tested.",
      "Thank Allah aloud for three blessings daily.",
      "Do not complain in a way that rejects Allah's decree.",
    ],
  },
  {
    id: "dawah",
    hub: "paths",
    title: "Calling to Allah",
    summary: "Whoever guides another receives reward like the one who follows it.",
    importance: "recommended",
    body: [
      "Sharing Islam with wisdom, teaching someone to pray, or helping a Muslim return to obedience — all are forms of dawah.",
      "The reward for guiding one person can be like the reward of the one who acts upon that guidance — without diminishing their reward.",
      "Start with your family and close circle. Good example is often the most effective dawah.",
    ],
    quran: [
      {
        surah: 16,
        ayahFrom: 125,
        label: "Qur'an 16:125",
        excerpt: "Invite to the way of your Lord with wisdom and good instruction.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1893",
        grade: "sahih",
        excerpt: "Whoever guides someone to goodness will have a reward like the one who does it.",
      },
    ],
    actions: [
      "Share beneficial knowledge with kindness.",
      "Help someone learn to pray or read Qur'an.",
      "Be an example of good character in public.",
    ],
  },
  {
    id: "major-deeds",
    hub: "paths",
    title: "Major lifelong deeds",
    summary: "Hajj, family, and lasting charity.",
    importance: "recommended",
    body: [
      "Hajj — for those able — is a pillar of Islam and an immense purification. Umrah also carries great reward.",
      "Raising righteous children, supporting a spouse, building or maintaining a masjid, digging a well, sponsoring an orphan, and planting trees can all be sadaqah jariyah.",
      "Plan long-term good deeds alongside your daily worship — they outlive you.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 97,
        label: "Qur'an 3:97",
        excerpt: "Hajj to the House is a duty owed to Allah by people who are able to find a way.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1413",
        grade: "sahih",
        excerpt:
          "When a person dies, his deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
      },
    ],
    actions: [
      "Plan Hajj or Umrah if you are able.",
      "Invest in your family's faith and character.",
      "Support a lasting charitable project.",
    ],
    appLinks: [
      { label: "Hajj & Umrah guide", route: "/hajj" },
      { label: "Zakat & charity", route: "/zakat" },
    ],
  },
  {
    id: "mercy",
    hub: "paths",
    title: "Allah's mercy — the final word",
    summary: "Deeds are means; entry is by His mercy.",
    importance: "foundational",
    body: [
      "No one enters Paradise because of deeds alone — not even the Prophet ﷺ, except that Allah covers him with mercy.",
      "This is not permission to neglect worship. It is humility: strive your utmost, then hope in Allah's vast mercy and fear His justice.",
      "The believer combines hope and fear — working hard while trusting that Allah is Ar-Rahman, Ar-Raheem, Al-Ghafoor.",
      "Ask for Al-Firdaws, do your best each day, and leave your final rank to the Most Just, Most Merciful.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5673",
        grade: "sahih",
        excerpt:
          "None of you will enter Paradise by his deeds alone. They said: Not even you? He said: Not even me, unless Allah envelops me in mercy.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2816",
        grade: "sahih",
        excerpt:
          "Allah has one hundred mercies — He sent down a single mercy among jinn, mankind, and animals, by which they are compassionate to one another. He kept ninety-nine mercies for the Day of Resurrection.",
      },
    ],
    actions: [
      "Balance fear of Allah with hope in His mercy.",
      "Never despair after sin — repent and continue striving.",
      "Ask Allah for Al-Firdaws and a good ending (husn al-khatimah).",
    ],
    appLinks: [
      { label: "Duas for Paradise", route: "/jannah/duas" },
      { label: "My Journey dashboard", route: "/jannah/journey" },
    ],
  },
];

export const JANNAH_GATES: JannahGate[] = [
  {
    id: "salah",
    name: "Gate of Prayer",
    deedSummary: "For those who guarded and established the five daily prayers.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1891",
        grade: "sahih",
        excerpt:
          "Whoever performs ablution well, comes to the prayer with eagerness, and prays as much as was written for him — a gate of Paradise will be opened for him: the Gate of Prayer.",
      },
    ],
  },
  {
    id: "charity",
    name: "Gate of Charity",
    deedSummary: "For those who gave charity sincerely for Allah's sake.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1891",
        grade: "sahih",
        excerpt: "…a gate of Paradise will be opened for him: the Gate of Charity.",
      },
    ],
  },
  {
    id: "rayyan",
    name: "Gate of Ar-Rayyan",
    deedSummary: "Reserved for those who fasted — a gate only they enter.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1896",
        grade: "sahih",
        excerpt:
          "There is a gate in Paradise called Ar-Rayyan, through which only those who fasted will enter.",
      },
    ],
  },
  {
    id: "jihad",
    name: "Gate of Jihad",
    deedSummary: "For those who strove in Allah's cause with sincerity.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1891",
        grade: "sahih",
        excerpt: "…a gate of Paradise will be opened for him: the Gate of Jihad.",
      },
    ],
  },
  {
    id: "hajj",
    name: "Gate of Hajj",
    deedSummary: "For those who performed Hajj and Umrah with acceptance.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1773",
        grade: "sahih",
        excerpt:
          "Whoever performs Hajj and does not commit obscenity or transgression returns like the day his mother bore him.",
      },
    ],
  },
  {
    id: "multiple",
    name: "Multiple gates",
    deedSummary: "Some will be called to enter through more than one gate.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1891",
        grade: "sahih",
        excerpt:
          "Whoever is from the people of these deeds, a gate will be opened for him. He may enter from whichever he wishes — and whoever enters from them will taste its coolness and drink.",
      },
    ],
  },
];

export const JANNAH_VERSES: JannahVerseEntry[] = [
  {
    id: "v-3-133",
    theme: "description",
    label: "Qur'an 3:133",
    surah: 3,
    ayahFrom: 133,
    excerpt:
      "Race toward forgiveness from your Lord and a Garden as wide as the heavens and earth.",
  },
  {
    id: "v-9-72",
    theme: "description",
    label: "Qur'an 9:72",
    surah: 9,
    ayahFrom: 72,
    excerpt: "Gardens beneath which rivers flow — prepared for the believers.",
  },
  {
    id: "v-18-107",
    theme: "description",
    label: "Qur'an 18:107",
    surah: 18,
    ayahFrom: 107,
    excerpt: "Gardens of Refuge as hospitality for those who believe and do righteous deeds.",
  },
  {
    id: "v-32-17",
    theme: "reward",
    label: "Qur'an 32:17",
    surah: 32,
    ayahFrom: 17,
    excerpt: "No soul knows what comfort is hidden for them as reward for what they used to do.",
  },
  {
    id: "v-50-35",
    theme: "reward",
    label: "Qur'an 50:35",
    surah: 50,
    ayahFrom: 35,
    excerpt: "They will have whatever they wish therein, and with Us is more.",
  },
  {
    id: "v-6-132",
    theme: "ranks",
    label: "Qur'an 6:132",
    surah: 6,
    ayahFrom: 132,
    excerpt: "For all there will be degrees according to what they did.",
  },
  {
    id: "v-3-163",
    theme: "ranks",
    label: "Qur'an 3:163",
    surah: 3,
    ayahFrom: 163,
    excerpt: "They are degrees with Allah.",
  },
  {
    id: "v-2-201",
    theme: "supplication",
    label: "Qur'an 2:201",
    surah: 2,
    ayahFrom: 201,
    excerpt:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire.",
  },
  {
    id: "v-39-53",
    theme: "mercy",
    label: "Qur'an 39:53",
    surah: 39,
    ayahFrom: 53,
    excerpt: "Do not despair of the mercy of Allah — He forgives all sins.",
  },
  {
    id: "v-43-68",
    theme: "reward",
    label: "Qur'an 43:68",
    surah: 43,
    ayahFrom: 68,
    excerpt: "My servants — no fear will there be concerning you this Day, nor will you grieve.",
  },
  {
    id: "v-56-10",
    theme: "ranks",
    label: "Qur'an 56:10–11",
    surah: 56,
    ayahFrom: 10,
    ayahTo: 11,
    excerpt: "The forerunners — those are the ones brought near.",
  },
  {
    id: "v-76-11",
    theme: "reward",
    label: "Qur'an 76:11",
    surah: 76,
    ayahFrom: 11,
    excerpt:
      "Allah will protect them from the evil of that Day and give them radiance and happiness.",
  },
];

export const JANNAH_DUAS: JannahDuaEntry[] = [
  {
    id: "dua-hasanah",
    context: "The comprehensive du'a for good in both worlds and protection from the Fire.",
    duaId: "quranic-hasanah",
  },
  {
    id: "dua-jannah-nar",
    context: "A concise du'a after tashahhud: ask for Paradise and refuge from the Fire.",
    duaId: "hisn-61",
  },
  {
    id: "dua-jannah-names",
    context: "Ask for Paradise using Allah's beautiful Names after tashahhud.",
    duaId: "hisn-64",
  },
  {
    id: "dua-meeting-allah",
    context: "Ask for the sweetness of seeing Allah and longing to meet Him.",
    duaId: "hisn-62",
  },
];

export const JANNAH_PROMISED: JannahPromisedEntry[] = [
  {
    id: "ten",
    name: "The Ten Promised Paradise",
    summary:
      "Abu Bakr, Umar, Uthman, Ali, Talhah, Zubayr, Abd al-Rahman ibn Awf, Sa'd, Sa'id ibn Zayd, and Abu Ubaydah (may Allah be pleased with them).",
    note: "Named together in a hadith in Sunan al-Tirmidhi (3747, hasan).",
  },
  {
    id: "truthful-patient",
    name: "The truthful and patient",
    summary: "Allah praises those who are truthful in faith and patient in obedience and trials.",
    note: "See Qur'an 4:69 and many verses on as-sadiqeen and as-sabireen.",
  },
  {
    id: "martyrs",
    name: "Martyrs in Allah's cause",
    summary:
      "Those who die defending Islam according to Islamic law are given glad tidings of Paradise.",
    note: "Scholars define shahadah precisely; not every death in battle qualifies automatically.",
  },
  {
    id: "last-words",
    name: "Those whose last words are tawheed",
    summary: "Whoever's last words are 'La ilaha illallah' will enter Paradise.",
    note: "Sunan Abu Dawud 3116 (sahih). A good ending is a lifelong pursuit.",
  },
  {
    id: "prophets",
    name: "The prophets",
    summary: "Every prophet is in the highest ranks of Paradise by Allah's decree.",
    note: "Their station is not reached by ordinary deeds — they are chosen and protected.",
  },
];

/** Al-Firdaws du'a text (not in Hisnul bundle) for display on the Al-Firdaws topic. */
export const JANNAH_FIRDAWS_DUA = {
  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْفِرْدَوْسَ الْأَعْلَىٰ مِنَ الْجَنَّةِ",
  transliteration: "Allahumma inni as'alukal-Firdawsal-a'la min al-jannah",
  translation: "O Allah, I ask You for Al-Firdaws — the highest part of Paradise.",
  reference: "Based on Sahih al-Bukhari 7312 — ask for Al-Firdaws specifically.",
};
