import type { PrayerRakatSummary, SalahGuideTopic } from "../types/salah-guide";

export { SALAH_GUIDE_PHRASES } from "./salah-guide-phrases";

/**
 * Learn Salah — a complete beginner-to-consistency course on the prayer.
 * Every claim is grounded in the Qur'an or an authentic (sahih/hasan) hadith,
 * with collection and number verified against the standard printed editions
 * (as indexed on sunnah.com). Where the four Sunni schools differ, the
 * difference is noted respectfully rather than presented as one ruling.
 * Bump the version whenever content changes so caches refresh.
 */
export const SALAH_GUIDE_CONTENT_VERSION = 3;

/** Ordered journey phases shown on the hub. */
export const SALAH_GUIDE_JOURNEY_ORDER = [
  "why",
  "prepare",
  "learn",
  "practice",
  "perfect",
  "consistency",
] as const;

export const SALAH_GUIDE_TOPICS: SalahGuideTopic[] = [
  // ── Why Pray ──────────────────────────────────────────────────────────────
  {
    id: "introduction",
    journey: "why",
    title: "What is Salah?",
    summary: "The second pillar of Islam — your appointed daily meeting with Allah.",
    importance: "foundational",
    body: [
      "Salah is the formal worship Allah prescribed for every believer: an ordered sequence of standing (qiyam), bowing (ruku), and prostrating (sujud), joined to fixed words of praise, Qur'an, and supplication, performed at five appointed times each day. The word salah comes from an Arabic root meaning connection and supplication — it is the believer's direct, unmediated line to the Creator, needing no priest and no intercessor.",
      "A single complete unit of prayer — one standing through to the second prostration — is called a rak'ah. Prayers are counted in rak'ahs: Fajr is two, Maghrib three, and Dhuhr, Asr, and Isha four. The obligatory prayers are called fard; the Prophet's ﷺ regularly-prayed extras are sunnah, and freely-offered optional prayers are nafl.",
      "Uniquely among the pillars, salah was not revealed through an angel descending to earth but was enjoined directly upon the Prophet ﷺ when he was raised through the heavens on the Night Journey (al-Isra' wa al-Mi'raj). Fifty prayers were first ordained, then — through the Prophet's ﷺ repeated returns seeking ease for his ummah — reduced to five performed in deed while keeping the reward of fifty.",
      "This is why salah sits at the very centre of Islamic life: repeated five times daily, it interrupts work, rest, and leisure to re-anchor the heart on Allah, and it is the first deed a servant will be called to account for on the Day of Resurrection. If it is found sound, the rest of the record tends to follow.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 3,
        label: "Qur'an 2:3",
        excerpt:
          "Who believe in the unseen, establish prayer, and spend out of what We have provided for them.",
      },
      {
        surah: 29,
        ayahFrom: 45,
        label: "Qur'an 29:45",
        excerpt:
          "Recite what has been revealed to you of the Book and establish prayer. Indeed, prayer restrains from immorality and wrongdoing, and the remembrance of Allah is greater.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "349",
        grade: "sahih",
        excerpt:
          "On the Night Journey Allah enjoined fifty prayers; the Prophet ﷺ kept returning to ask for relief until they were five — 'These are five and these are fifty, for the word with Me does not change.' (also Sahih Muslim 162)",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "413",
        grade: "hasan",
        excerpt:
          "The first thing for which a servant will be brought to account on the Day of Resurrection is his prayer; if it is sound the rest of his deeds are sound. (also Abu Dawud 864, an-Nasa'i 3991)",
      },
    ],
    appLinks: [
      { label: "Journey to Jannah", route: "/jannah/salah" },
      { label: "Prayer tracker", route: "/tracker" },
    ],
  },
  {
    id: "why-salah",
    journey: "why",
    title: "Why Salah?",
    summary: "The spiritual, moral, psychological, and eternal fruits of the five daily prayers.",
    importance: "foundational",
    body: [
      "Salah is a direct conversation with Allah. In its standing you address Him through His own revealed words; in prostration — the posture of utmost humility — you are nearest to Him and most likely to be answered. No other act of worship is repeated so often or so intimately.",
      "Its first fruit is a restrained, disciplined soul. Allah Himself states that prayer, when established properly, 'restrains from immorality and wrongdoing' (29:45): the person who truly stands before Allah five times a day finds sin harder to approach. It is also a repeated purification — the Prophet ﷺ compared the five prayers to a flowing river in which one bathes five times daily, leaving no dirt behind.",
      "Its second fruit is inner peace. The Qur'an promises that hearts find rest in the remembrance of Allah, and the Prophet ﷺ, in moments of worry, would say, 'Give us comfort by it, O Bilal,' calling for the prayer. He described the delight of his eyes as having been placed in salah.",
      "Its social and eternal fruits complete the picture: congregational prayer levels rich and poor into a single row and builds brotherhood, while guarding the prayer is among the surest paths to Allah's forgiveness and to Paradise. The Prophet ﷺ promised Paradise to whoever preserves the two 'cool' prayers of Fajr and Asr.",
    ],
    quran: [
      {
        surah: 20,
        ayahFrom: 14,
        label: "Qur'an 20:14",
        excerpt:
          "Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.",
      },
      {
        surah: 23,
        ayahFrom: 1,
        ayahTo: 2,
        label: "Qur'an 23:1–2",
        excerpt: "Successful indeed are the believers — those who are humble in their prayer.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "528",
        grade: "sahih",
        excerpt:
          "'If there were a river at the door of one of you in which he bathed five times a day, would any dirt remain on him?' They said, 'None.' He ﷺ said, 'That is the likeness of the five prayers — Allah wipes away sins with them.' (also Sahih Muslim 667)",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "574",
        grade: "sahih",
        excerpt: "Whoever prays the two cool prayers — Fajr and Asr — will enter Paradise.",
      },
      {
        collection: "Sunan an-Nasa'i",
        citation: "3939",
        grade: "sahih",
        excerpt:
          "Made beloved to me from your world are women and perfume, and the coolness of my eyes was placed in prayer.",
      },
    ],
    actions: [
      "Pray just one prayer fully on time today — consistency, not perfection, is the first goal.",
      "Read the meaning of Al-Fatihah once before your next salah to feel you are being answered.",
      "Turn on adhan reminders so no prayer window slips past unnoticed.",
    ],
    appLinks: [
      { label: "Prayer reminders", route: "/settings/notifications" },
      { label: "Khushu journal", route: "/journal" },
    ],
  },
  {
    id: "importance",
    journey: "why",
    title: "Its rank in Islam",
    summary: "A pillar of the religion — and the gravest deed to neglect.",
    importance: "obligatory",
    body: [
      "The Prophet ﷺ taught that Islam is built upon five pillars, and salah is the second, immediately after the two testimonies of faith. The testimony admits you into Islam; the prayer is the standing proof that the testimony lives in your heart. This is why the scholars call salah 'the pillar of the religion' — a house without its central pillar collapses.",
      "Its weight is seen in how the texts speak of neglecting it. The Qur'an warns of a generation who 'neglected prayer and pursued desires' and foretells their ruin, and the Prophet ﷺ described the prayer as the very covenant that distinguishes belief from disbelief.",
      "On the ruling for one who abandons salah, there is a well-known and respectful difference among the Sunni scholars. Some hold that deliberately abandoning it altogether — while affirming it is obligatory — amounts to major disbelief that expels a person from Islam; the majority (Hanafi, Maliki, Shafi'i) hold that such a person remains a sinful Muslim guilty of one of the gravest of major sins, provided he does not deny its obligation. All agree that abandoning prayer is a catastrophe and that whoever denies its obligation has left Islam by consensus.",
      "The practical lesson is the same on every view: guarding the five daily prayers is not optional or negotiable for a believer. Voluntary prayers (sunnah and nafl) then act as a safety net, making up shortfalls in the obligatory prayers on the Day of Judgment.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 238,
        label: "Qur'an 2:238",
        excerpt:
          "Maintain with care the prayers and the middle prayer, and stand before Allah, devoutly obedient.",
      },
      {
        surah: 19,
        ayahFrom: 59,
        label: "Qur'an 19:59",
        excerpt:
          "But there came after them successors who neglected prayer and pursued desires; so they are going to meet evil.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "16",
        grade: "sahih",
        excerpt:
          "Islam is built upon five: testifying that there is no god but Allah and that Muhammad is His Messenger, establishing the prayer, giving zakat, Hajj, and fasting Ramadan. (also Sahih al-Bukhari 8)",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2621",
        grade: "sahih",
        excerpt:
          "The covenant between us and them is the prayer; whoever abandons it has committed disbelief. (Buraydah; also an-Nasa'i, Ibn Majah 1079)",
      },
      {
        collection: "Sahih Muslim",
        citation: "82",
        grade: "sahih",
        excerpt:
          "Between a man and disbelief and idolatry stands the abandonment of prayer. (Jabir)",
      },
    ],
    disclaimer:
      "Scholars differ on the exact ruling for one who abandons prayer out of laziness (major sin for the majority; disbelief for others) versus one who denies its obligation (disbelief by consensus). This app does not issue a verdict on any individual — consult a qualified scholar for personal cases.",
  },
  {
    id: "who-must-pray",
    journey: "why",
    title: "Who must pray?",
    summary: "Every sane, adult Muslim — with clearly defined exemptions and concessions.",
    body: [
      "Salah becomes obligatory on every Muslim who is sane and has reached puberty (bulugh). Three groups are lifted from accountability entirely by an authentic principle: the sleeper until he wakes, the child until he matures, and the mentally incapacitated until sound reason returns.",
      "Children are not yet obligated, but they are trained gradually. The Prophet ﷺ instructed that children be commanded to pray from the age of seven and disciplined gently for neglecting it at ten — so that by puberty prayer is already a settled habit, not a sudden burden.",
      "Women in menstruation (hayd) or postnatal bleeding (nifas) do not pray during that time; the missed obligatory prayers are not made up afterwards — a mercy and a ruling agreed upon by the scholars. (Missed fasts, unlike prayers, are made up.) A woman resumes prayer once bleeding ends and she has purified with ghusl.",
      "Genuine inability brings concession, never cancellation: severe illness, unconsciousness, and overwhelming fear may excuse a person for a time, and the sick pray according to their ability — sitting, lying, or even by gestures. Travel does not remove prayer but eases it through shortening (qasr) and combining (jam'), covered in the Travel guide.",
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "495",
        grade: "hasan",
        excerpt:
          "Command your children to pray when they are seven, and discipline them for it at ten, and separate their sleeping places. ('Amr ibn Shu'ayb from his father from his grandfather)",
      },
    ],
    quran: [
      {
        surah: 20,
        ayahFrom: 132,
        label: "Qur'an 20:132",
        excerpt: "And enjoin prayer upon your family, and be steadfast therein.",
      },
    ],
    appLinks: [
      { label: "Menstruation (Hayd) guide", route: "/hayd" },
      { label: "Prayer when sick", route: "/sick" },
      { label: "Travel prayer", route: "/travel" },
    ],
  },

  // ── Prepare ─────────────────────────────────────────────────────────────────
  {
    id: "conditions",
    journey: "prepare",
    title: "Conditions before salah",
    summary: "The nine prerequisites (shurut) that must be in place for prayer to be valid.",
    importance: "obligatory",
    body: [
      "Before a prayer is even valid, certain conditions (shurut al-salah) must be met. A condition differs from a pillar: conditions are prerequisites that come before you begin and continue throughout, whereas pillars (arkan) are parts of the prayer itself. If a required condition is missing, the prayer is not accepted no matter how well it is performed.",
      "Think of these nine as a pre-flight checklist. Most connect to a fuller lesson elsewhere in this guide — tap through to learn each in depth. Two of them (facing the qiblah and correct time) can be excused in genuine inability; the rest are firmly required whenever one is able.",
    ],
    steps: [
      {
        title: "Islam",
        body: "Prayer is an act of a Muslim; it is not valid from — nor obligatory upon — a non-Muslim until they enter Islam.",
      },
      {
        title: "Sound mind ('aql)",
        body: "The person must be of sound reason. One who has lost their sanity is not held accountable while in that state.",
      },
      {
        title: "Discernment (tamyiz)",
        body: "The capacity to distinguish, reached around age seven — the age from which children are told to pray.",
      },
      {
        title: "Removing minor & major impurity (taharah from hadath)",
        body: "A valid state of wudu, or ghusl after major impurity, or tayammum when water cannot be used.",
      },
      {
        title: "Removing filth (najasah)",
        body: "The body, clothing, and place of prayer must be free of ritual filth such as urine, blood in quantity, and other listed substances.",
      },
      {
        title: "Covering the awrah",
        body: "The parts that must be covered are covered with clean, opaque clothing — see the Clothing & awrah lesson.",
      },
      {
        title: "The prayer time has entered",
        body: "Each salah has a defined window; praying before its time begins is invalid. Use your schedule and reminders.",
      },
      {
        title: "Facing the qiblah",
        body: "Turning toward the Ka'bah as closely as you can determine — excused only in genuine inability.",
      },
      {
        title: "Intention (niyyah)",
        body: "Resolving in the heart which prayer you are about to perform. It is an inner act and is not spoken aloud.",
      },
    ],
    appLinks: [
      { label: "Purification (Taharah)", route: "/taharah" },
      { label: "Qibla compass", route: "/qibla" },
      { label: "Prayer schedule", route: "/schedule" },
    ],
    disclaimer:
      "The schools word and count the conditions slightly differently (some list niyyah among the pillars rather than the conditions). The substance is agreed upon.",
  },
  {
    id: "taharah",
    journey: "prepare",
    title: "Purification (Taharah)",
    summary: "Purity of self, clothing, and place — the doorway to every prayer.",
    body: [
      "Taharah means lifting ritual impurity so you may stand before Allah in a state of cleanliness. Allah loves those who purify themselves, and the Prophet ﷺ taught that 'purification is half of faith.' No prayer is accepted without it.",
      "Impurity is of two kinds. Minor impurity (hadath asghar) — caused by things like using the toilet or passing wind — is lifted by wudu. Major impurity (hadath akbar or janabah) — following intimacy, ejaculation, or the end of menstruation and postnatal bleeding — is lifted by a full ritual bath (ghusl).",
      "Separately from these ritual states, tangible filth (najasah) — such as urine, droppings, flowing blood, and the like — must be physically removed from the body, garments, and the spot where you pray. It is possible to have valid wudu yet still need to clean a stain from your clothes before praying.",
      "Water is the primary purifier. When water is genuinely unavailable, or would harm you because of illness or severe cold, Islam permits tayammum — a dry purification using clean earth — as a complete substitute. Purification is never meant to be a hardship; it is a means of drawing near.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "223",
        grade: "sahih",
        excerpt: "Purification is half of faith… (Abu Malik al-Ash'ari)",
      },
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 222,
        label: "Qur'an 2:222",
        excerpt:
          "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.",
      },
    ],
    actions: [
      "Learn wudu step by step before your next prayer so each limb is washed correctly.",
      "Keep a clean garment set aside for prayer if you work in a soiled environment.",
      "Glance over your prayer spot for visible filth before laying the mat.",
    ],
    appLinks: [
      { label: "Full Purification guide", route: "/taharah" },
      { label: "Wudu lesson", route: "/salah-guide/wudu" },
    ],
  },
  {
    id: "wudu",
    journey: "prepare",
    title: "Wudu — ablution",
    summary: "The ordered washing that lifts minor impurity and readies you for prayer.",
    importance: "obligatory",
    body: [
      "Wudu is the ritual washing that lifts minor impurity. It is required before every salah unless you are still in a valid state from a previous one, and — according to the majority of scholars — before touching the physical text of the Qur'an. Its four obligatory washes are named directly in the Qur'an (5:6): the face, the arms to the elbows, wiping the head, and the feet to the ankles.",
      "The Prophet ﷺ performed wudu in a settled order, three times for the washed limbs, thoroughly but without wasting water — he warned against extravagance even at a flowing river. Beyond the four obligatory acts, the rinsing of the mouth and nose, washing the hands first, and using the miswak are established sunnahs that complete and beautify the wudu.",
      "Its reward is immense: the Prophet ﷺ taught that as a believer washes each limb, the sins committed by that limb fall away with the water — even from beneath the nails — so that he emerges cleansed. Wudu is therefore not merely a formality but a small act of forgiveness before every prayer.",
      "Wudu is broken by anything exiting the private passages (urine, stool, wind), by deep sleep that removes awareness, and by loss of consciousness. If it breaks during salah you must stop, renew wudu, and begin the prayer again.",
    ],
    steps: [
      {
        title: "Intention & Bismillah",
        body: "Intend wudu in your heart and begin with 'Bismillah'. The intention is inward and need not be voiced.",
        transliteration: "Bismillah",
        tip: "Use the miswak (siwak) beforehand when you can — a sunnah the Prophet ﷺ loved and nearly made obligatory.",
      },
      {
        title: "Wash the hands",
        body: "Wash both hands to the wrists three times, working water between the fingers.",
      },
      {
        title: "Rinse the mouth",
        body: "Take water into the mouth, swirl it, and expel it — three times.",
      },
      {
        title: "Rinse the nose",
        body: "Draw water into the nostrils with the right hand and expel it with the left — three times.",
      },
      {
        title: "Wash the face (fard)",
        body: "Wash the whole face once to three times, from hairline to chin and from ear to ear; a man runs wet fingers through a thick beard.",
      },
      {
        title: "Wash the arms (fard)",
        body: "Wash the right arm, then the left, from the fingertips up to and including the elbows — three times each.",
      },
      {
        title: "Wipe the head (fard)",
        body: "With wet hands, wipe the head once from front to back and back again, then wipe the inside and back of the ears with the same wetness.",
      },
      {
        title: "Wash the feet (fard)",
        body: "Wash the right foot, then the left, to and including the ankles — three times each, passing fingers between the toes.",
      },
      {
        title: "Testimony of faith",
        body: "Complete with the du'a: 'Ashhadu an la ilaha illallah…' — the eight gates of Paradise are opened for whoever says it after wudu.",
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        transliteration: "Ashhadu an la ilaha illallahu wahdahu la sharika lah…",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "244",
        grade: "sahih",
        excerpt:
          "When a servant washes his face in wudu, every sin he looked at with his eyes leaves with the water… until he emerges cleansed of sin.",
      },
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "O you who believe, when you rise to pray, wash your faces and your forearms to the elbows, wipe your heads, and wash your feet to the ankles.",
      },
    ],
    actions: [
      "Perform wudu slowly once while reading each step aloud, checking the elbows and heels.",
      "Memorise the short du'a after wudu — see Words of Salah.",
    ],
    appLinks: [
      { label: "Wudu & related duas", route: "/dua/prayer" },
      { label: "Words of salah", route: "/salah-guide/phrases" },
    ],
  },
  {
    id: "clothing",
    journey: "prepare",
    title: "Clothing & awrah",
    summary: "Cover what must be covered — cleanly, modestly, and respectfully.",
    body: [
      "Covering the awrah — the parts of the body that must be concealed — is a condition of valid prayer, drawn from Allah's command to 'take your adornment at every place of prayer' (7:31). The clothing must be clean of najasah and opaque enough that skin colour does not show through.",
      "For men, the awrah in prayer is, at minimum, from the navel to the knee. However, praying bare-chested when clothing is available is disliked; the Prophet ﷺ instructed that a man should not pray in a single garment without part of it over his shoulders.",
      "For women, the whole body is awrah in prayer except the face and the hands, according to the majority of scholars; a woman covers her hair, neck, and feet, typically with a loose garment and headscarf. Scholars differ over the feet, some considering them included in what may be shown — praying with them covered is the safer and majority practice.",
      "Two dress rulings apply outside prayer too: silk and gold are forbidden for men to wear (permitted for women), and clothing should not be so tight, sheer, or attention-seeking that it defeats the modesty prayer calls for. As a rule of thumb, pray in what you would wear to meet someone you respect — not nightwear or beachwear.",
    ],
    quran: [
      {
        surah: 7,
        ayahFrom: 31,
        label: "Qur'an 7:31",
        excerpt: "O children of Adam, take your adornment at every place of prayer.",
      },
    ],
    actions: [
      "Set aside one clean, modest outfit or a dedicated prayer garment so you are always ready.",
      "When unsure whether something covers enough, cover more rather than less.",
    ],
    disclaimer:
      "Details of the awrah (especially a woman's feet) are a point of respectful scholarly difference. Follow reliable local scholarship where you differ.",
  },
  {
    id: "prayer-times",
    journey: "prepare",
    title: "Prayer times",
    summary: "Five daily windows — each salah has a beginning, an end, and a preferred moment.",
    importance: "obligatory",
    body: [
      "Allah appointed the prayers 'at fixed times' (4:103), dividing the day and night into five windows tied to the movement of the sun. Praying before a window opens is invalid; delaying a prayer past its window without excuse is a serious sin. Whenever possible, pray early in the window — the Prophet ﷺ named prayer at its first time among the most beloved deeds to Allah.",
      "The five windows are: Fajr, from true dawn until sunrise; Dhuhr, from the sun passing its zenith until an object's shadow equals its own length; Asr, from the end of Dhuhr until sunset (best prayed before the sun yellows); Maghrib, from sunset until the red twilight fades; and Isha, from the fading of twilight until true dawn (best prayed before midnight).",
      "There are three brief periods in which voluntary prayer is forbidden, so that worship is never confused with sun-worship: as the sun is rising until it has fully risen, when it stands exactly at its zenith at midday, and as it is setting until it has fully set. Making up a missed obligatory prayer is excepted from this prohibition.",
      "The exact clock times shift daily with your latitude and season, which is why the Prophet ﷺ tied them to natural signs rather than a fixed hour. The app computes them for your location — but knowing the underlying signs keeps you grounded when technology is unavailable.",
    ],
    steps: [
      {
        title: "Fajr — 2 rak'ah fard",
        body: "True dawn until sunrise. Preceded by a strongly emphasised 2-rak'ah sunnah.",
      },
      {
        title: "Dhuhr — 4 rak'ah fard",
        body: "After the sun passes its zenith until the Asr shadow. Sunnah of 4 before and 2 after.",
      },
      {
        title: "Asr — 4 rak'ah fard",
        body: "From the end of Dhuhr until sunset; pray it before the sun yellows. Often identified with the 'middle prayer' of 2:238.",
      },
      {
        title: "Maghrib — 3 rak'ah fard",
        body: "From sunset until twilight fades; pray promptly. Sunnah of 2 after.",
      },
      {
        title: "Isha — 4 rak'ah fard",
        body: "From the fading of twilight until dawn; best before midnight. Followed by Witr.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "831",
        grade: "sahih",
        excerpt:
          "There are three times at which the Prophet ﷺ forbade us to pray: when the sun is rising until it is up, when it stands at midday, and when it is setting until it has set. (Uqbah ibn 'Amir)",
      },
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 103,
        label: "Qur'an 4:103",
        excerpt: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
      },
      {
        surah: 11,
        ayahFrom: 114,
        label: "Qur'an 11:114",
        excerpt:
          "And establish prayer at the two ends of the day and at the approach of the night. Indeed, good deeds drive away evil deeds.",
      },
    ],
    appLinks: [
      { label: "Prayer schedule", route: "/schedule" },
      { label: "Reminder settings", route: "/settings/notifications" },
    ],
    disclaimer:
      "The start of Asr has two reported opinions (shadow equal to, or twice, an object's length). Both are valid; follow your local calculation and community.",
  },
  {
    id: "qiblah",
    journey: "prepare",
    title: "Facing the qiblah",
    summary: "Turn toward the Sacred House in Makkah — the direction that unites the ummah.",
    body: [
      "The qiblah is the direction of the Ka'bah within Masjid al-Haram in Makkah. Facing it is a condition of valid prayer. Early in Islam the Muslims prayed toward Jerusalem; then Allah revealed the command to turn toward the Sacred Mosque, and a single direction has united the worshippers of the world ever since — a daily, physical expression of one community facing one Lord.",
      "You are required to face the qiblah as accurately as you can reasonably determine — with a compass, a mosque's mihrab, a reliable app, or the sun and stars when travelling. A small, unavoidable deviation is forgiven; what matters is sincere effort toward the correct direction.",
      "If you genuinely cannot determine the direction — lost at sea, in cloud, in an unfamiliar land at night — you strive to work it out and then pray toward your best judgement; the prayer is valid even if it later proves slightly off. On a moving vehicle or aircraft where facing the qiblah for an obligatory prayer is impossible, you face whatever you can, since Allah does not burden a soul beyond its capacity.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 144,
        label: "Qur'an 2:144",
        excerpt:
          "So turn your face toward al-Masjid al-Haram. And wherever you are, turn your faces toward it.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6251",
        grade: "sahih",
        excerpt:
          "When you rise to pray, perform wudu well, then face the qiblah and say the takbir. (from the hadith of the man who prayed badly)",
      },
    ],
    appLinks: [{ label: "Qibla compass", route: "/qibla" }],
  },

  // ── Learn ─────────────────────────────────────────────────────────────────
  {
    id: "adhan",
    journey: "learn",
    title: "Adhan — the call to prayer",
    summary: "The words that summon the ummah, their meaning, and how to answer them.",
    body: [
      "The adhan is the call announcing that a prayer's time has entered. It is a communal sunnah for the five daily prayers (not for Eid or the funeral prayer), given from a raised place so the community is gathered to worship. It is followed, just before the prayer begins, by a second, shorter call — the iqamah.",
      "When you hear the adhan, the sunnah is to repeat each phrase after the mu'adhdhin — except at 'Hayya 'ala as-salah' and 'Hayya 'ala al-falah', where you instead say 'La hawla wa la quwwata illa billah' (there is no power nor strength except with Allah). In the Fajr adhan the caller adds 'As-salatu khayrun min an-nawm' (prayer is better than sleep).",
      "After the adhan finishes, send blessings (salawat) upon the Prophet ﷺ, then recite the established du'a asking Allah to grant him the praised station (al-wasilah) — the Prophet ﷺ promised his intercession to whoever says it. The moment between the adhan and iqamah is a time when supplication is not turned away, so make du'a freely.",
    ],
    steps: [
      {
        title: "Allahu Akbar (×4)",
        body: "Allah is the Greatest — greater than anything that might have distracted you.",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "I bear witness that there is no god except Allah.",
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ",
        transliteration: "Ashhadu an la ilaha illallah",
      },
      {
        title: "Ashhadu anna Muhammadan rasulullah (×2)",
        body: "I bear witness that Muhammad is the Messenger of Allah.",
        arabic: "أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
        transliteration: "Ashhadu anna Muhammadan rasulullah",
      },
      {
        title: "Hayya 'ala as-salah (×2)",
        body: "Come to prayer. Answer with: La hawla wa la quwwata illa billah.",
        arabic: "حَيَّ عَلَى الصَّلَاةِ",
        transliteration: "Hayya 'ala as-salah",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Come to success. Answer with: La hawla wa la quwwata illa billah.",
        arabic: "حَيَّ عَلَى الْفَلَاحِ",
        transliteration: "Hayya 'ala al-falah",
      },
      {
        title: "Allahu Akbar (×2)",
        body: "Allah is the Greatest.",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar",
      },
      {
        title: "La ilaha illallah",
        body: "There is no god except Allah — the call closes on the same word it opened toward.",
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
        transliteration: "La ilaha illallah",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "614",
        grade: "sahih",
        excerpt:
          "Whoever says upon hearing the call, 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the wasilah and the virtue…' — my intercession will be his on the Day of Resurrection. (Jabir)",
      },
    ],
    appLinks: [
      { label: "Listen to the adhan", route: "/salah-guide/adhan" },
      { label: "Adhan & prayer duas", route: "/dua/prayer" },
    ],
  },
  {
    id: "how-to-pray",
    journey: "learn",
    title: "Step-by-step salah",
    summary: "The full sequence of a rak'ah — the heart of this whole guide.",
    importance: "obligatory",
    body: [
      "Every prayer is built from the same core movements: standing and reciting, bowing, rising, prostrating twice, and — at the end — sitting for the tashahhud and giving the salam. Learn one rak'ah well and you can pray any prayer, since the longer prayers simply repeat these units.",
      "A two-rak'ah prayer (like Fajr) sits for the final tashahhud after the second rak'ah and closes with the salam. A three- or four-rak'ah prayer sits for a first, shorter tashahhud after the second rak'ah, stands again for the remaining rak'ah(s) — reciting only Al-Fatihah in them — then sits for the final tashahhud and salam.",
      "The single most important quality throughout is tuma'ninah — stillness, settling completely into each posture before moving to the next. The Prophet ﷺ once told a man who had prayed hastily, three times over, 'Go back and pray, for you have not prayed,' then taught him to be still in each position. Rushing through the postures can invalidate the prayer.",
      "Recite Al-Fatihah in every rak'ah: 'There is no prayer for the one who does not recite the Opening of the Book.' In the first two rak'ahs of every prayer, add a short surah or a few verses after it. Move from posture to posture with the takbir 'Allahu Akbar', keeping your gaze on the place of prostration.",
    ],
    steps: [
      {
        title: "1. Stand & intend (qiyam & niyyah)",
        body: "Face the qiblah, stand upright, and settle your intention in the heart for this specific prayer.",
        tip: "Fix your eyes on the place of sujud and keep them there — do not look around.",
      },
      {
        title: "2. Opening takbir (Takbirat al-Ihram)",
        body: "Raise your hands to the shoulders or earlobes and say 'Allahu Akbar', then place the right hand over the left on the chest. This takbir is a pillar; the prayer has now begun.",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar",
      },
      {
        title: "3. Opening du'a & Al-Fatihah",
        body: "Silently say an opening supplication, seek refuge in Allah, then recite Surah Al-Fatihah. In the first two rak'ahs, follow it with a short surah or verses.",
        tip: "Al-Fatihah is a pillar — the rak'ah is invalid without it.",
      },
      {
        title: "4. Bowing (ruku)",
        body: "Say 'Allahu Akbar' and bow with a flat back, hands gripping the knees, saying 'Subhana Rabbiyal-'Adheem' three or more times.",
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        transliteration: "Subhana Rabbiyal-'Adheem",
      },
      {
        title: "5. Rising from ruku (i'tidal)",
        body: "Rise fully upright saying 'Sami'Allahu liman hamidah', then 'Rabbana wa lakal-hamd'. Stand completely still before descending.",
        transliteration: "Sami'Allahu liman hamidah — Rabbana wa lakal-hamd",
      },
      {
        title: "6. Prostration (sujud)",
        body: "Say 'Allahu Akbar' and prostrate on seven points — forehead with the nose, both palms, both knees, and the toes of both feet — saying 'Subhana Rabbiyal-A'la' three or more times. This is the posture nearest to Allah, so supplicate.",
        arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
        transliteration: "Subhana Rabbiyal-A'la",
        tip: "Keep the elbows raised off the ground and away from the sides, and the belly off the thighs.",
      },
      {
        title: "7. Sitting between the two sujud (jalsah)",
        body: "Rise saying 'Allahu Akbar', sit calmly upright saying 'Rabbi ighfir li' (my Lord, forgive me), then prostrate a second time as before.",
        transliteration: "Rabbi ighfir li",
      },
      {
        title: "8. Stand for the next rak'ah",
        body: "Say 'Allahu Akbar' and rise. Repeat from Al-Fatihah. That completes one rak'ah.",
      },
      {
        title: "9. Tashahhud",
        body: "After the last rak'ah of a sitting, recite At-Tahiyyat, then the salawat upon the Prophet ﷺ (and, in the final sitting, a du'a before the salam).",
        tip: "Raise the right index finger during the tashahhud — a confirmed sunnah of witness and focus.",
      },
      {
        title: "10. Salam",
        body: "Turn the face to the right saying 'As-salamu 'alaykum wa rahmatullah', then to the left with the same words. The prayer is complete.",
        arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
        transliteration: "As-salamu 'alaykum wa rahmatullah",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "631",
        grade: "sahih",
        excerpt: "Pray as you have seen me praying. (Malik ibn al-Huwayrith)",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "757",
        grade: "sahih",
        excerpt:
          "'Go back and pray, for you have not prayed' — repeated three times — then he ﷺ taught: say the takbir, recite what you can of the Qur'an, then bow until you are at ease, rise until you stand straight, prostrate until you are at ease… (the man who prayed badly; also Sahih Muslim 397)",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "756",
        grade: "sahih",
        excerpt:
          "There is no prayer for the one who does not recite the Opening of the Book. (Ubadah ibn as-Samit; also Sahih Muslim 394)",
      },
    ],
    appLinks: [
      { label: "Words & meanings", route: "/salah-guide/phrases" },
      { label: "Practice tracker", route: "/tracker" },
    ],
  },
  {
    id: "positions",
    journey: "learn",
    title: "Every position",
    summary: "How to hold your body correctly in each posture of the prayer.",
    body: [
      "Each posture in salah has a bodily form the Prophet ﷺ demonstrated and his Companions preserved. Learning the correct form protects your prayer from common physical errors and helps the body support the heart's humility rather than distract from it.",
      "The nearness of prostration deserves special care: the Prophet ﷺ said, 'The nearest a servant comes to his Lord is when he is prostrating, so make much supplication then.' A prostration held with stillness and sincerity is among the most powerful moments in a believer's day.",
    ],
    steps: [
      {
        title: "Standing (qiyam)",
        body: "Upright, feet roughly shoulder-width apart, weight balanced, gaze on the place of sujud, right hand over the left on the chest.",
      },
      {
        title: "Raising the hands (raf' al-yadayn)",
        body: "Palms facing the qiblah, level with the shoulders or earlobes — at the opening takbir, and (by the majority) also going into and rising from ruku.",
      },
      {
        title: "Bowing (ruku)",
        body: "Back flat and level, head neither raised nor drooping, fingers spread gripping the knees, arms held away from the sides.",
      },
      {
        title: "Prostration (sujud)",
        body: "Forehead and nose on the ground, palms flat near the shoulders or ears, elbows raised and off the floor, knees down, toes flexed toward the qiblah.",
      },
      {
        title: "Sitting (iftirash)",
        body: "Between the two prostrations and in the first tashahhud: sit on the left foot laid flat with the right foot upright, hands resting on the thighs.",
      },
      {
        title: "Final sitting (tawarruk)",
        body: "In the last tashahhud of a 3- or 4-rak'ah prayer (a sunnah of the Shafi'i and Hanbali schools): pass the left foot under the right leg and sit on the ground.",
      },
      {
        title: "Turning the head for salam (taslim)",
        body: "Turn the face fully to the right, then to the left, with the words of peace — ending the prayer as you greet the angels on each shoulder.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "482",
        grade: "sahih",
        excerpt:
          "The nearest a servant comes to his Lord is when he is prostrating, so make much supplication. (Abu Hurayrah)",
      },
    ],
    disclaimer:
      "Minor differences in hand placement, the manner of sitting, and raising the hands are all rooted in authentic reports; the schools each follow a valid narration. None invalidates another's prayer.",
  },

  // ── Practice ────────────────────────────────────────────────────────────────
  {
    id: "common-mistakes",
    journey: "practice",
    title: "Common mistakes",
    summary: "The errors that quietly weaken a prayer — and how to correct each one.",
    body: [
      "Most faults in prayer are not sins of the heart but habits of haste and inattention. Naming them is the first step to fixing them; the Prophet ﷺ himself corrected a Companion's prayer patiently and directly, which teaches us that these errors are common and fixable.",
      "The gravest is rushing — pecking through ruku and sujud without stillness. Tuma'ninah (settled stillness) is a pillar of the prayer for the majority of scholars, so a hurried prayer is not merely imperfect but can be invalid. Work through the list below one habit at a time.",
    ],
    steps: [
      {
        title: "Praying too fast",
        body: "Barely pausing in ruku or sujud. Remain until your body settles and you can say the dhikr at least three times without hurry.",
      },
      {
        title: "Incomplete wudu",
        body: "Dry patches on the heels, ankles, elbows, or between the fingers. The Prophet ﷺ warned, 'Woe to the heels from the Fire.' Wash slowly and thoroughly.",
      },
      {
        title: "Curved back in ruku, sinking in sujud",
        body: "Bowing with a rounded back, or resting the forehead without the nose, or letting the forearms lie flat on the floor. Keep the back level and the elbows raised.",
      },
      {
        title: "Wandering eyes and heart",
        body: "Looking around, or checking a phone. Keep the gaze on the place of sujud and silence or remove your phone before the takbir.",
      },
      {
        title: "Racing ahead of the imam",
        body: "In congregation, moving into ruku or sujud before the imam. Follow him — never precede him — moving only after he does.",
      },
      {
        title: "Speaking, eating, or laughing",
        body: "Any intentional speech, eating, drinking, or audible laughter breaks the prayer. Salah is a conversation with Allah alone.",
      },
      {
        title: "Reciting Al-Fatihah incorrectly",
        body: "Skipping words, or making errors that change the meaning. Learn it letter-perfect — the whole prayer depends on it.",
      },
    ],
    actions: [
      "Pray one salah today at half your usual speed and notice how different it feels.",
      "Silence your phone or leave it in another room before you say the opening takbir.",
      "Ask someone knowledgeable to watch one of your prayers and correct your postures.",
    ],
    appLinks: [{ label: "Learn to read Al-Fatihah", route: "/learn-quran" }],
  },
  {
    id: "sunnah-practices",
    journey: "practice",
    title: "Sunnah practices",
    summary: "The Prophet's ﷺ recommended acts that beautify and multiply the reward of salah.",
    body: [
      "Beyond the obligatory acts, the Prophet ﷺ modelled many recommended practices (sunan) around the prayer. They are not required, so omitting one does not invalidate salah — but each one draws you nearer to Allah, earns extra reward, and repairs shortfalls in the obligatory prayers.",
      "Chief among them are the regular sunnah prayers (sunan rawatib) offered before and after the fard: two before Fajr (which the Prophet ﷺ prized above the whole world), four before and two after Dhuhr, two after Maghrib, and two after Isha — twelve rak'ahs whose reward is a house built in Paradise.",
    ],
    actions: [
      "Use the miswak (siwak) before wudu and prayer — the Prophet ﷺ nearly made it obligatory.",
      "Walk to the mosque calmly and early — each step raises a rank and erases a sin.",
      "Guard the twelve rak'ahs of sunnah rawatib for a promised house in Paradise.",
      "Enter the mosque with the right foot and leave with the left, each with its du'a.",
      "Recite the established adhkar after every prayer — see After Salah.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "887",
        grade: "sahih",
        excerpt:
          "Were it not that I would burden my ummah, I would have ordered them to use the siwak before every prayer. (Abu Hurayrah; also Sahih Muslim 252)",
      },
      {
        collection: "Sahih Muslim",
        citation: "728",
        grade: "sahih",
        excerpt:
          "Whoever prays twelve rak'ahs of voluntary prayer in a day and night, a house will be built for him in Paradise. (Umm Habibah)",
      },
    ],
    appLinks: [
      { label: "Sunnah & post-salah adhkar", route: "/zikr" },
      { label: "Mosque duas", route: "/dua/prayer" },
    ],
  },

  // ── Perfect ─────────────────────────────────────────────────────────────────
  {
    id: "khushu",
    journey: "perfect",
    title: "Khushu — presence of heart",
    summary: "The goal of the whole journey: to pray as though you see Allah.",
    importance: "highly-recommended",
    body: [
      "Khushu is the humility, focus, and awareness that you are truly standing before Allah. It is what turns the physical movements of prayer into real worship. The Prophet ﷺ defined excellence (ihsan) as 'to worship Allah as though you see Him, for though you do not see Him, He surely sees you' — and nowhere is that more directly practised than in salah.",
      "Allah opened the description of the successful believers with it: 'those who are humble in their prayer' (23:1–2). And He warned sharply against its opposite — 'woe to those who pray, but are heedless of their prayer' — a rebuke aimed at those whose bodies move while their hearts are absent.",
      "Khushu is built, not wished for. Learn the meanings of what you recite so the words move you. Remove distractions before the takbir. Slow down and give each posture its stillness. Reflect on the greatness of the One you address and the reality that this prayer could be your last. Pray each prayer as a farewell prayer, as the Prophet ﷺ advised.",
      "Do not be discouraged by wandering thoughts — even the Companions struggled with them. The struggle to return your focus, again and again, is itself part of the worship. Khushu grows across a lifetime; consistency is what nurtures it.",
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
        surah: 107,
        ayahFrom: 4,
        ayahTo: 5,
        label: "Qur'an 107:4–5",
        excerpt: "So woe to those who pray — those who are heedless of their prayer.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt:
          "Ihsan is to worship Allah as though you see Him, for though you do not see Him, He surely sees you. (Hadith of Jibril, 'Umar)",
      },
    ],
    actions: [
      "Read one phrase's meaning from Words of Salah before each prayer this week.",
      "Pause for three unhurried seconds in each posture before moving on.",
      "Note your level of focus in the journal after salah and watch the pattern change.",
    ],
    appLinks: [
      { label: "Khushu journal", route: "/journal" },
      { label: "Words & meanings", route: "/salah-guide/phrases" },
    ],
  },
  {
    id: "pillars-nullifiers",
    journey: "perfect",
    title: "Pillars & nullifiers",
    summary: "What the prayer cannot exist without — and what cancels it.",
    importance: "obligatory",
    body: [
      "The acts of salah fall into three ranks. Pillars (arkan) are essential parts: omitting one deliberately invalidates the prayer, and omitting one by forgetfulness must be corrected by returning to it. Obligatory acts (wajibat) are required, but if forgotten they are repaired by the prostration of forgetfulness (sujud al-sahw). Sunnah acts complete and beautify the prayer, and leaving them carries no penalty.",
      "Knowing this hierarchy protects you from two extremes: treating a minor omission as ruinous, or treating a genuine pillar as optional. When in doubt about a pillar, the prayer is not sound until it is fulfilled.",
      "Separately, certain things nullify the prayer outright the moment they occur — because they contradict the state of prayer itself. Others nullify the wudu, which in turn ends the prayer. Guard against both so you are never praying in an invalid state without realising it.",
    ],
    steps: [
      {
        title: "Pillars (arkan)",
        body: "Standing when able, the opening takbir, reciting Al-Fatihah, ruku, rising from it, the two prostrations, sitting between them, the final sitting, the tashahhud, the salam, tuma'ninah in each, and keeping the correct order.",
      },
      {
        title: "Obligatory acts (wajibat)",
        body: "Such as the other takbirs, the words of dhikr in ruku and sujud, and the first tashahhud — repaired by sujud al-sahw if forgotten (per the Hanbali detailing; schools differ).",
      },
      {
        title: "Nullifiers of wudu",
        body: "Anything exiting the front or back passages, deep sleep, loss of consciousness — and, by some scholars, directly touching the private parts. Any of these ends the prayer.",
      },
      {
        title: "Nullifiers of the prayer itself",
        body: "Intentional speech, intentional eating or drinking, much continuous unnecessary movement, laughing aloud, deliberately turning the chest from the qiblah, and uncovering the awrah.",
      },
    ],
    appLinks: [{ label: "Prostration of forgetfulness", route: "/salah-guide/sujud-al-sahw" }],
    disclaimer:
      "The four schools classify some acts differently — for example whether the first tashahhud is a wajib or a sunnah, or the exact list of what requires sujud al-sahw. Learn your school's detailing from a qualified teacher.",
  },
  {
    id: "sujud-al-sahw",
    journey: "perfect",
    title: "Sujud al-Sahw — correcting mistakes",
    summary: "The prostration of forgetfulness that mends slips in the prayer.",
    body: [
      "No one is immune to forgetting in prayer — even the Prophet ﷺ forgot, and then taught, 'I am only a human being like you; I forget as you forget, so when I forget, remind me.' From his own example comes a built-in remedy: two extra prostrations, called sujud al-sahw (the prostration of forgetfulness), that patch small errors so the prayer need not be repeated.",
      "It is called for in three broad situations: an addition (praying an extra rak'ah or posture by mistake), an omission (leaving a wajib such as the first tashahhud), or doubt (being unsure how many rak'ahs you have prayed). It is not needed for leaving a sunnah, nor for deliberate mistakes — those have their own rulings.",
      "When you have genuine doubt, the guiding principle is: discard the doubt, build on what you are certain of (the smaller number), complete the prayer, and then make the two prostrations. This turns confusion into a settled, valid prayer rather than an anxious guess.",
      "Practically: make two prostrations exactly like your normal sujud, with the takbir before and after, then the salam. The scholars differ over whether they come before or after the salam depending on the type of error — both are authentically reported, so either is acceptable and neither invalidates the prayer.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "571",
        grade: "sahih",
        excerpt:
          "If one of you is unsure in his prayer and does not know how many he prayed — three or four — let him cast off doubt, build on what he is certain of, then prostrate twice before the salam. (Abu Sa'id al-Khudri)",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "401",
        grade: "sahih",
        excerpt:
          "When one of you doubts in his prayer, let him seek what is correct and complete upon it, then give the salam and prostrate twice. (Ibn Mas'ud; also Sahih Muslim 572)",
      },
    ],
    actions: [
      "Memorise the rule for doubt: build on the lesser number, finish, then prostrate twice.",
      "If you realise mid-prayer you left the first tashahhud, continue and make sujud al-sahw at the end.",
    ],
    appLinks: [{ label: "Pillars & nullifiers", route: "/salah-guide/pillars-nullifiers" }],
    disclaimer:
      "Whether the two prostrations fall before or after the salam depends on the error, and the schools differ. Both are from the sunnah; do not let uncertainty here stop you from praying.",
  },

  // ── Consistency ─────────────────────────────────────────────────────────────
  {
    id: "prayer-types",
    journey: "consistency",
    title: "Types of salah",
    summary: "Fard, sunnah, witr, and the voluntary prayers that enrich a believer's day.",
    body: [
      "Prayers are graded by obligation. The five daily prayers are fard — a strict obligation on every accountable Muslim. Around and beyond them lies a rich world of voluntary prayer through which the Prophet ﷺ drew ever closer to Allah, and through which we can too.",
      "Voluntary prayers matter for two reasons: they are beloved acts that raise a believer's rank — Allah says of extra worship, 'My servant keeps drawing near to Me with voluntary deeds until I love him' — and they repair the obligatory prayers, since any deficiency in the fard is completed from a person's voluntary prayers on the Day of Judgment.",
    ],
    steps: [
      {
        title: "The five daily fard",
        body: "Fajr, Dhuhr, Asr, Maghrib, Isha — the obligatory foundation, never to be abandoned.",
      },
      {
        title: "Sunnah rawatib",
        body: "The regular sunnah rak'ahs before and after the fard — twelve daily earn a house in Paradise.",
      },
      {
        title: "Witr",
        body: "An odd-numbered prayer after Isha, the seal of the night's prayer — sunnah mu'akkadah for the majority, and wajib in the Hanafi school.",
      },
      {
        title: "Tahajjud (qiyam al-layl)",
        body: "Night prayer in the last third of the night — the most virtuous voluntary prayer, and the habit of the righteous.",
      },
      {
        title: "Duha",
        body: "The mid-morning prayer (2–8 rak'ahs) — a charity due for each of the body's joints each day.",
      },
      {
        title: "Tarawih",
        body: "The congregational night prayer of Ramadan — reviving the nights of the blessed month.",
      },
      {
        title: "The two Eids",
        body: "Two rak'ahs of Eid al-Fitr and Eid al-Adha, followed by the sermon.",
      },
      {
        title: "Istikharah",
        body: "A two-rak'ah prayer seeking Allah's guidance before making a decision.",
      },
      {
        title: "Janazah",
        body: "The funeral prayer — a communal obligation (fard kifayah) offered standing, without ruku or sujud.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1163",
        grade: "sahih",
        excerpt: "The best prayer after the obligatory prayers is the night prayer. (Abu Hurayrah)",
      },
    ],
    appLinks: [
      { label: "Tahajjud guide", route: "/tahajjud" },
      { label: "Rakats table", route: "/salah-guide" },
    ],
  },
  {
    id: "jumuah",
    journey: "consistency",
    title: "Jumu'ah — the Friday prayer",
    summary: "The weekly obligation that gathers the community and replaces Dhuhr on Friday.",
    importance: "obligatory",
    body: [
      "Jumu'ah is the congregational prayer held after midday each Friday, and it is a distinct obligation, commanded by name in the Qur'an: 'When the call is made for prayer on Friday, hasten to the remembrance of Allah and leave off trade.' It consists of a sermon (khutbah) in two parts followed by two rak'ahs prayed aloud behind the imam, and it takes the place of Dhuhr for those who attend.",
      "It is a personal obligation (fard 'ayn) upon every free, adult, resident, able Muslim man. The Prophet ﷺ specified that it is 'a duty upon every Muslim in congregation, except four: a slave, a woman, a child, or one who is ill.' Women, travellers, and the sick are excused and pray Dhuhr instead, though they may attend if they wish.",
      "Its neglect is a grave danger: the Prophet ﷺ warned that whoever abandons three Jumu'ahs out of heedlessness, Allah seals his heart. Yet its rewards are equally great — Friday is the best day on which the sun rises, and it holds an hour in which du'a is answered.",
      "Prepare for it as the Prophet ﷺ did: perform ghusl, wear your best clean clothes, apply fragrance, go early, and listen attentively to the khutbah in silence (idle talk during it wastes the reward). Reciting Surah al-Kahf on Friday brings a light between the two Fridays.",
    ],
    quran: [
      {
        surah: 62,
        ayahFrom: 9,
        label: "Qur'an 62:9",
        excerpt:
          "O you who believe, when the call is made for prayer on Friday, hasten to the remembrance of Allah and leave off trade. That is better for you, if you only knew.",
      },
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "1067",
        grade: "hasan",
        excerpt:
          "The Friday prayer in congregation is a binding duty upon every Muslim, except four: a slave, a woman, a child, or one who is ill. (Tariq ibn Shihab)",
      },
      {
        collection: "Sunan an-Nasa'i",
        citation: "1369",
        grade: "hasan",
        excerpt:
          "Whoever abandons three Friday prayers out of heedlessness, Allah will place a seal over his heart. (Abu al-Ja'd; also Abu Dawud 1052, at-Tirmidhi 500)",
      },
      {
        collection: "Sahih Muslim",
        citation: "846",
        grade: "sahih",
        excerpt:
          "Ghusl on Friday is obligatory upon every one who has reached puberty. (Abu Sa'id al-Khudri)",
      },
    ],
    actions: [
      "Make ghusl, wear clean clothes and fragrance, and arrive early — the earliest attendees earn the greatest reward.",
      "Read Surah al-Kahf sometime on Friday for a light between the two Fridays.",
      "Stay fully silent and attentive during the khutbah; keep the phone away.",
    ],
    appLinks: [{ label: "Read Surah al-Kahf", route: "/quran" }],
    disclaimer:
      "The minimum number of attendees, and whether ghusl is obligatory or a strong sunnah, are points of scholarly difference. Follow your local community's reliable practice.",
  },
  {
    id: "congregational",
    journey: "consistency",
    title: "Congregational prayer",
    summary: "Praying behind an imam — reward multiplied twenty-seven times.",
    body: [
      "Praying the five daily prayers in congregation (jama'ah) is strongly emphasised, especially for men, and is a hallmark of a living Muslim community. The Prophet ﷺ taught that the prayer in congregation is twenty-seven times greater in reward than the prayer prayed alone — a multiplier no individual effort can match.",
      "The congregation stands in straight, gap-free rows, shoulder to shoulder, following the imam precisely: you begin each movement only after he does, never before him, and never at the exact same instant. Straightening the rows is itself part of completing the prayer.",
      "If you arrive after the imam has begun (a latecomer is called masbuq), join immediately in whatever posture you find him — that portion still counts as praying with him. When he gives the final salam, stand and complete the rak'ahs you missed on your own, then finish.",
      "The congregation is not only in the mosque: two people praying together form a jama'ah, so a father with his child, or two friends travelling, can attain its reward. Women may pray in congregation and attend the mosque where suitable facilities exist, though their prayer at home is also richly rewarded.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "645",
        grade: "sahih",
        excerpt:
          "The prayer in congregation is twenty-seven degrees more meritorious than the prayer offered alone. (Ibn 'Umar; also Sahih Muslim 650)",
      },
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 43,
        label: "Qur'an 2:43",
        excerpt: "And establish prayer and give zakat and bow with those who bow.",
      },
    ],
    actions: [
      "Pray at least one prayer in the mosque today, or gather your household into a row at home.",
      "Learn what to do as a latecomer: join at once, then complete your missed rak'ahs after the imam's salam.",
    ],
  },
  {
    id: "qada",
    journey: "consistency",
    title: "Missed (qada) prayers",
    summary: "Making up what was missed — the door of Allah's mercy stays open.",
    importance: "obligatory",
    body: [
      "If a fard prayer is missed — through oversleeping, forgetfulness, or (may Allah protect us) negligence — the obligation does not simply vanish. It must be made up (qada), and the Prophet ﷺ made the ruling clear: 'Whoever forgets a prayer or sleeps through it, its expiation is to pray it when he remembers.' There is no other ransom for it but to pray it.",
      "A made-up prayer is offered in the same form as the original: a missed four-rak'ah Dhuhr is prayed as four rak'ahs even if you make it up at night or while travelling. One who missed prayers due to a genuine excuse (like deep sleep) bears no sin for the delay; one who abandoned them deliberately must make them up alongside sincere, urgent repentance.",
      "The scholars encourage making up missed prayers immediately and in order where possible, without letting them pile up — because the burden grows heavier with time and delay. If a large number were missed over years, approach it with a realistic daily plan rather than despair; Allah's door of return is always open.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "597",
        grade: "sahih",
        excerpt:
          "Whoever forgets a prayer or sleeps through it, its expiation is to pray it when he remembers it. (Anas; also Sahih Muslim 684)",
      },
    ],
    actions: [
      "Estimate honestly how many prayers you owe and set a realistic daily make-up target.",
      "Pair each obligatory prayer with one make-up prayer until the backlog clears.",
      "Never delay a currently-due prayer to make up an old one — keep today's prayers on time.",
    ],
    appLinks: [
      { label: "Qaza tracker", route: "/qaza" },
      { label: "Qaza history", route: "/qaza/history" },
    ],
  },
  {
    id: "after-salah",
    journey: "consistency",
    title: "After salah",
    summary: "The adhkar and supplications that seal the reward of every prayer.",
    body: [
      "The Prophet ﷺ never rose abruptly from prayer. He would remain seated, seeking Allah's forgiveness and engaging in remembrance — and he taught that the moment right after an obligatory prayer is among the times when du'a is most readily answered. Leaving immediately forfeits some of the prayer's greatest fruit.",
      "The established post-prayer routine is simple and weighty: say 'Astaghfirullah' three times; then the words of tawhid and praise; then 'SubhanAllah', 'Alhamdulillah', and 'Allahu Akbar' thirty-three times each, sealing the hundredth with 'La ilaha illallah…' — whoever does so has their sins forgiven though they be like the foam of the sea.",
      "Reciting Ayat al-Kursi after each obligatory prayer removes only death from between a person and Paradise, as the Prophet ﷺ promised. Follow it with the three Quls (Al-Ikhlas, Al-Falaq, An-Nas), and add the morning adhkar after Fajr and the evening adhkar after Asr or Maghrib where they apply.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "597",
        grade: "sahih",
        excerpt:
          "Whoever glorifies, praises, and magnifies Allah thirty-three times each after every prayer… and completes the hundred with the words of tawhid, his sins are forgiven though they be like the foam of the sea. (Abu Hurayrah)",
      },
      {
        collection: "an-Nasa'i (al-Sunan al-Kubra)",
        citation: "9928",
        grade: "sahih",
        excerpt:
          "Whoever recites Ayat al-Kursi after every prescribed prayer, nothing stands between him and entering Paradise except death. (Abu Umamah; graded sahih by al-Albani)",
      },
    ],
    actions: [
      "Memorise the post-salah tasbih (33 / 33 / 33 + tahlil) this week.",
      "Recite Ayat al-Kursi and the three Quls before you stand up.",
      "Stay seated for one minute of personal du'a after each fard prayer.",
    ],
    appLinks: [
      { label: "Post-salah adhkar", route: "/zikr" },
      { label: "Tasbih counter", route: "/tasbeeh/free" },
    ],
  },
];

/** Fard + common sunnah rakats per prayer, aligned with the app's tracked prayers. */
export const PRAYER_RAKATS: PrayerRakatSummary[] = [
  { prayerId: "fajr", fard: 2, sunnahBefore: 2, sunnahAfter: 0 },
  { prayerId: "dhuhr", fard: 4, sunnahBefore: 4, sunnahAfter: 2 },
  { prayerId: "asr", fard: 4, sunnahBefore: 0, sunnahAfter: 0 },
  { prayerId: "maghrib", fard: 3, sunnahBefore: 0, sunnahAfter: 2 },
  { prayerId: "isha", fard: 4, sunnahBefore: 0, sunnahAfter: 2 },
  {
    prayerId: "witr",
    fard: 0,
    sunnahBefore: 0,
    sunnahAfter: 0,
    note: "Prayed after Isha — sunnah mu'akkadah (wajib in the Hanafi school).",
  },
];
