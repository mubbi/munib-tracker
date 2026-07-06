import type { BattlesTopic } from "../types/battles";

export { BATTLES_FIGURES } from "./battles-figures";
export { BATTLES_GLOSSARY } from "./battles-glossary";
export { BATTLES_LESSON_CARDS } from "./battles-lessons";
export { BATTLES_TIMELINE } from "./battles-timeline";
export { BATTLES_VERSES } from "./battles-verses";

/**
 * Battles in Islam — authentic history, ethics, and lessons from early Islamic
 * military history. Scholar-neutral; claims cite Qur'an or graded hadith. Where
 * historians differ on numbers or dates, that is noted. Bump version on change.
 */
export const BATTLES_CONTENT_VERSION = 1;

export const BATTLES_SECTION_ORDER = [
  "context",
  "battles",
  "expeditions",
  "later",
  "wisdom",
  "evidence",
] as const;

export const BATTLES_TOPICS: BattlesTopic[] = [
  // ── Context ───────────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "context",
    title: "Introduction",
    summary: "Historical background, persecution, Hijra, and when fighting was permitted.",
    importance: "foundational",
    body: [
      "For the first twelve years of revelation in Makkah, Muslims were commanded to endure persecution with patience — no permission to fight was given. The early community responded with migration, boycott endurance, and prayer, not armed rebellion.",
      "The Hijra to Madinah (622 CE / 1 AH) established a Muslim polity that could defend itself. Jewish tribes and the Ansar entered treaties; the Prophet ﷺ became head of state as well as messenger.",
      "Permission to fight came after years of oppression — not for conquest, but for self-defence and the protection of religious freedom. The Qur'an distinguishes between fighting those who fight you and transgression beyond that limit.",
      "These events are historical: they occurred in a specific Arabian context. General Islamic teachings on peace, justice, and neighbourliness must not be collapsed into or confused with the particulars of seventh-century Arabia.",
    ],
    quran: [
      {
        surah: 22,
        ayahFrom: 39,
        ayahTo: 40,
        label: "Qur'an 22:39–40",
        excerpt:
          "Permission is given to those who fight because they have been wronged… Had Allah not checked one set of people by means of another, monasteries, churches, synagogues, and mosques would have been destroyed.",
      },
      {
        surah: 2,
        ayahFrom: 190,
        label: "Qur'an 2:190",
        excerpt:
          "Fight in the way of Allah those who fight you, but do not transgress. Indeed, Allah does not like transgressors.",
      },
    ],
    appLinks: [
      { label: "Seerah timeline", route: "/seerah" },
      { label: "Battles timeline", route: "/battles/timeline" },
    ],
  },
  {
    id: "why-battles",
    section: "context",
    title: "Why battles occurred",
    summary: "Persecution, treaty violations, and defence of the community — not aggression.",
    importance: "foundational",
    body: [
      "Before any battle, Quraysh had tortured Muslims, confiscated property, and pursued emigrants. The Battle of Badr began when a Muslim scouting party intercepted a Quraysh trade caravan returning from Syria — after Quraysh had mobilised for war.",
      "In Madinah, hostile tribes and Jewish factions that broke treaties posed existential threats. The Battle of the Trench followed a confederate army assembled to eliminate the Muslim community.",
      "Treaty violations mattered: Quraysh's allies attacking allies of the Muslims voided the Treaty of Hudaybiyyah and led to the peaceful opening of Makkah.",
      "The objectives were defence of life and religion, protection of the weak, and establishing security so that monotheism could be practised without persecution — not endless expansion for its own sake.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 3016",
        grade: "sahih",
        excerpt:
          "I have been commanded to fight people until they testify that there is no god but Allah… — scholars explain this in context of Arabian hostility to Islam after invitation and evidence; it is not a blank licence for aggression.",
      },
    ],
    disclaimer:
      "The hadith above is often quoted without context. Classical scholars placed it within the specific conditions of its time and alongside verses limiting fighting to those who fight you.",
    appLinks: [{ label: "Ethics of warfare", route: "/battles/ethics-of-warfare" }],
  },
  {
    id: "ethics-of-warfare",
    section: "context",
    title: "Ethics of warfare in Islam",
    summary:
      "No aggression, protection of civilians, and humane conduct — grounded in Qur'an and Sunnah.",
    importance: "foundational",
    body: [
      "Islamic law of war (siyar) developed from Qur'anic limits and prophetic practice. The foundational rule: fight those who fight you, but do not transgress (Qur'an 2:190).",
      "Non-combatants are protected: women, children, the elderly, monks in their cells, and those who do not take part in fighting. The Prophet ﷺ forbade killing women and children.",
      "Treachery is forbidden — treaties must be honoured. Destruction of crops and fruit trees was prohibited in general guidance; the specific incident at Khaybar's fortresses concerned active military strongholds, and scholars discuss its scope carefully.",
      "Prisoners were to be treated well — fed as captors ate, clothed, and often freed through ransom or mercy. The Conquest of Makkah demonstrated general amnesty rather than massacre.",
      "These principles are normative Islamic teachings. Individual violations by Muslims in history do not redefine what the religion teaches any more than violations by followers of other faiths redefine theirs.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 190,
        label: "Qur'an 2:190",
        excerpt: "Fight in the way of Allah those who fight you, but do not transgress.",
      },
      {
        surah: 8,
        ayahFrom: 61,
        label: "Qur'an 8:61",
        excerpt: "If they incline to peace, then incline to it and rely upon Allah.",
      },
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "Hadith 2614",
        grade: "sahih",
        excerpt: "Do not kill a child, nor a woman, nor an old man, nor one who offers no fight.",
      },
      {
        collection: "Sahih Muslim",
        citation: "Hadith 1744",
        grade: "sahih",
        excerpt:
          "Do not kill the monks in monasteries — reported in contexts of limiting harm to non-combatants.",
      },
    ],
    actions: [
      "Distinguish between what Islam teaches and what any army in history actually did.",
      "Read the ethics section before any battle narrative — context without principles leads to misunderstanding.",
    ],
  },

  // ── Battles during the Prophet ﷺ ──────────────────────────────────────────
  {
    id: "badr",
    section: "battles",
    title: "Battle of Badr",
    summary: "17 Ramadan 2 AH — the first major victory of the Muslim community.",
    importance: "foundational",
    body: [
      "After the Hijra, Quraysh seized Muslim property in Makkah and continued threats. When news came that Abu Sufyan's caravan was returning from Syria with wealth that had belonged to emigrants, the Prophet ﷺ set out to intercept it.",
      "Abu Sufyan escaped, but Quraysh sent an army to defend their trade prestige. About 313 Muslims faced roughly 1,000 Quraysh near the wells of Badr — severely outnumbered and underequipped.",
      "The Muslims arranged ranks, made du'a, and fought with discipline. The Qur'an records divine aid and the moral significance of this day. Seventy Quraysh were killed and seventy taken captive; fourteen Muslims were martyred.",
      "Badr is called yawm al-furqan — the Day of Criterion — because truth and falsehood were distinguished in a way the whole peninsula noticed.",
    ],
    battleDetails: {
      location: "Badr, southwest of Madinah",
      modernLocation: "Near modern Badr, Saudi Arabia",
      hijriDate: "17 Ramadan 2 AH",
      gregorianYear: 624,
      muslimForces: "~313 fighters (reports vary slightly)",
      opposingForces: "~1,000 Quraysh with better equipment",
      muslimCommander: "Prophet Muhammad ﷺ",
      opposingCommander: "Abu Jahl (killed in battle)",
      weather: "Clear; access to water was strategically vital",
      outcome: "Decisive Muslim victory",
      keyEvents: [
        "Muslims camped at the wells of Badr first, controlling water.",
        "Three Quraysh champions were defeated in single combat.",
        "Angels were sent to aid the believers per Qur'an 8:9.",
        "Key Quraysh leaders including Abu Jahl were killed.",
      ],
      leadershipLesson: "Prepare thoroughly, consult companions, then rely on Allah.",
      spiritualLesson: "A small sincere group with divine support can overcome worldly odds.",
      facts: [
        "The battle is named in the Qur'an more than any other single engagement.",
        "Prisoners were treated with dignity; many were freed on teaching literacy or ransom.",
      ],
    },
    quran: [
      {
        surah: 8,
        ayahFrom: 9,
        label: "Qur'an 8:9",
        excerpt: "I will reinforce you with a thousand angels, rank upon rank.",
      },
      {
        surah: 3,
        ayahFrom: 13,
        label: "Qur'an 3:13",
        excerpt: "A sign in the two armies that met — one fighting in the way of Allah.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 3983",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ pointed on the day of Badr and said: This is where so-and-so will fall — naming Quraysh leaders before the battle.",
      },
    ],
    appLinks: [
      { label: "Qur'an verses on Badr", route: "/battles/verses" },
      { label: "Key companions", route: "/battles/figures" },
    ],
  },
  {
    id: "uhud",
    section: "battles",
    title: "Battle of Uhud",
    summary: "3 AH — a painful lesson in obedience and discipline.",
    body: [
      "A year after Badr, Quraysh assembled about 3,000 men to avenge their losses, including women chanting for vengeance. The Muslims mustered about 700, initially camped with Mount Uhud at their back.",
      "The Prophet ﷺ placed fifty archers on a hill with strict orders: do not leave your post whether we win or lose. The Muslims initially pushed Quraysh back, but archers who descended for spoils allowed Khalid ibn al-Walid (then of Quraysh) to flank them.",
      "Hamza ibn Abd al-Muttalib was martyred. The Prophet ﷺ was injured and rumours spread that he had been killed. The Muslims regrouped on the mountain; Quraysh withdrew after failing to finish them.",
      "The Qur'an addresses this day directly — disobedience, not lack of faith, turned success into setback. Uhud is not a defeat of Islam but a lesson preserved in revelation.",
    ],
    battleDetails: {
      location: "Mount Uhud, north of Madinah",
      modernLocation: "Uhud, Madinah region, Saudi Arabia",
      hijriDate: "Shawwal 3 AH",
      gregorianYear: 625,
      muslimForces: "~700",
      opposingForces: "~3,000 Quraysh and allies",
      muslimCommander: "Prophet Muhammad ﷺ",
      opposingCommander: "Abu Sufyan ibn Harb",
      outcome: "Quraysh tactical field victory; Muslims strategic survival",
      keyEvents: [
        "Archers left their assigned hill against orders.",
        "Hamza and other companions were martyred.",
        "The Prophet ﷺ was injured; his tooth was broken.",
        "Muslims rallied when they saw him alive.",
      ],
      leadershipLesson: "Clear orders and disciplined execution matter as much as courage.",
      spiritualLesson: "Trials refine the community; setbacks with repentance lead to growth.",
    },
    quran: [
      {
        surah: 3,
        ayahFrom: 121,
        ayahTo: 175,
        label: "Qur'an 3:121–175",
        excerpt:
          "Remember when you left your family at dawn… and when you disobeyed after He had shown you what you love.",
      },
    ],
    appLinks: [{ label: "Leadership lessons", route: "/battles/lessons" }],
  },
  {
    id: "trench",
    section: "battles",
    title: "Battle of the Trench",
    summary: "5 AH — the Confederates besiege Madinah; a trench breaks the siege.",
    body: [
      "Jewish tribes that had broken treaties joined Quraysh and Ghatafan in the largest coalition yet — estimates range from 10,000 to 24,000, though exact numbers are uncertain. The Muslims were about 3,000.",
      "Salman al-Farisi suggested digging a trench on the vulnerable northern approach — unfamiliar to Arabian warfare. The believers dug in cold weather while fasting, with the Prophet ﷺ sharing the labour.",
      "The siege lasted roughly two weeks. Hypocrites wavered; believers held firm. Allah sent a bitter wind and unseen aid; the coalition fragmented over disputes and withdrew.",
      "Also called Ghazwat al-Ahzab (Battle of the Confederates), it is detailed in Surah al-Ahzab. No pitched battle occurred — strategy and patience won the day.",
    ],
    battleDetails: {
      location: "Northern approaches to Madinah",
      modernLocation: "Madinah, Saudi Arabia",
      hijriDate: "Shawwal 5 AH",
      gregorianYear: 627,
      muslimForces: "~3,000",
      opposingForces: "Confederate coalition (large; numbers differ in sources)",
      muslimCommander: "Prophet Muhammad ﷺ",
      opposingCommander: "Abu Sufyan leading the coalition",
      weather: "Cold winds during digging; divine wind during siege",
      outcome: "Muslim victory without pitched battle",
      keyEvents: [
        "Trench dug across the northern corridor.",
        "Nu'aym ibn Mas'ud sowed discord among allies.",
        "Wind and angels mentioned in Qur'an 33:9.",
        "Coalition withdrew in disarray.",
      ],
      leadershipLesson: "Consult experts and adopt good ideas regardless of their origin.",
      spiritualLesson: "Unity under trial and trust in Allah when odds seem impossible.",
    },
    quran: [
      {
        surah: 33,
        ayahFrom: 9,
        ayahTo: 27,
        label: "Qur'an 33:9–27",
        excerpt:
          "When armies came to you and We sent against them a wind and armies you did not see.",
      },
    ],
  },
  {
    id: "khaybar",
    section: "battles",
    title: "Expedition of Khaybar",
    summary: "7 AH — fortified settlements that harboured hostility are subdued.",
    body: [
      "After Hudaybiyyah, the Muslims marched to Khaybar — a series of Jewish fortresses that had supported enemies of the community. The campaign aimed to neutralise a base that threatened Madinah.",
      "The Prophet ﷺ gave the banner first to Abu Bakr, then Umar; the fortresses held. Ali ibn Abi Talib was then appointed and led the capture of the key fort of Qamus.",
      "The terms allowed the inhabitants to remain and farm while paying a portion of produce — not mass expulsion. This became a model for dhimmi agreements in later fiqh.",
      "Khaybar is sometimes conflated with later political conflicts; here we describe the seventh-century expedition as recorded in classical seerah.",
    ],
    battleDetails: {
      location: "Khaybar oasis, north of Madinah",
      modernLocation: "Khaybar, Saudi Arabia",
      hijriDate: "Muharram–Safar 7 AH",
      gregorianYear: 629,
      muslimForces: "About 1,600",
      opposingForces: "Fortified garrisons in multiple forts",
      muslimCommander: "Prophet Muhammad ﷺ; Ali led the decisive assault",
      outcome: "Muslim control of the fortresses; negotiated settlement",
      keyEvents: [
        "Series of fort sieges over several weeks.",
        "Ali given the banner after earlier attempts stalled.",
        "Marhab the champion was defeated.",
        "Treaty allowed residents to stay as cultivators.",
      ],
      leadershipLesson: "Assign responsibility to those best suited for the task.",
      spiritualLesson: "Persistence through prolonged difficulty brings results.",
    },
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 4210",
        grade: "sahih",
        excerpt:
          "I will give the banner tomorrow to a man who loves Allah and His Messenger… — Ali was given it.",
      },
    ],
  },
  {
    id: "mutah",
    section: "battles",
    title: "Battle of Mu'tah",
    summary: "8 AH — a frontier expedition where three commanders are martyred.",
    body: [
      "The Prophet ﷺ sent an army of about 3,000 toward the Roman frontier in response to the killing of his envoy. Zayd ibn Harithah commanded, with Jafar ibn Abi Talib and Abdullah ibn Rawahah named as successors if he fell.",
      "They faced a vastly larger Byzantine force — reports suggest tens of thousands, though numbers vary. All three appointed commanders were martyred in succession.",
      "Khalid ibn al-Walid, newly Muslim, reorganised a strategic withdrawal that preserved the army. The Prophet ﷺ wept when news came and said Zayd, Jafar, and Ibn Rawahah are among the best of martyrs.",
      "Mu'tah showed that confronting a superpower required preparation; it also introduced Khalid's military genius to the Muslim community.",
    ],
    battleDetails: {
      location: "Mu'tah, modern Jordan",
      modernLocation: "Near Karak, Jordan",
      hijriDate: "Jumada al-Ula 8 AH",
      gregorianYear: 629,
      muslimForces: "~3,000",
      opposingForces: "Byzantine/Roman army (much larger in reports)",
      muslimCommander: "Zayd, then Jafar, then Ibn Rawahah, then Khalid",
      outcome: "Muslim withdrawal; heavy martyrdom but army preserved",
      keyEvents: [
        "Three successive commanders martyred.",
        "Khalid used tactical manoeuvres to retreat safely.",
        "The Prophet ﷺ informed Muslims in Madinah of the martyrs.",
      ],
      leadershipLesson: "Name successors before danger — leadership continuity saves lives.",
      spiritualLesson: "Martyrdom in Allah's cause is honour, not political failure.",
    },
    appLinks: [{ label: "Khalid ibn al-Walid", route: "/battles/figures" }],
  },
  {
    id: "conquest-makkah",
    section: "battles",
    title: "Conquest of Makkah",
    summary: "8 AH — the peaceful opening of Makkah with general amnesty.",
    importance: "foundational",
    body: [
      "Quraysh's allies, the Banu Bakr, attacked the Banu Khuza'ah — allies of the Muslims — killing some in the sacred months. Quraysh supplied weapons, voiding the Treaty of Hudaybiyyah.",
      "The Prophet ﷺ marched with about 10,000 companions. Abu Sufyan accepted Islam before entry. The army entered Makkah with minimal resistance — only a few pockets fought.",
      "The Prophet ﷺ declared general amnesty: 'Go — you are free.' Only a handful wanted for specific crimes were excluded. Idols around the Ka'bah were destroyed and the city was cleansed for tawhid.",
      "This is called Fath Makkah — the Opening — emphasising mercy over vengeance. It is among the greatest demonstrations of prophetic character in power.",
    ],
    battleDetails: {
      location: "Makkah",
      modernLocation: "Makkah, Saudi Arabia",
      hijriDate: "Ramadan 8 AH",
      gregorianYear: 630,
      muslimForces: "~10,000",
      opposingForces: "Quraysh (largely surrendered without fighting)",
      muslimCommander: "Prophet Muhammad ﷺ",
      outcome: "Makkah opened peacefully; general amnesty",
      keyEvents: [
        "Abu Sufyan's house declared a safe haven.",
        "Ka'bah cleansed of idols.",
        "Bilal called the adhan from atop the Ka'bah.",
        "Former enemies accepted Islam in waves.",
      ],
      leadershipLesson: "Magnanimity in victory wins hearts more than fear.",
      spiritualLesson: "The goal was guidance, not revenge — power serves the message.",
    },
    quran: [
      {
        surah: 110,
        ayahFrom: 1,
        ayahTo: 3,
        label: "Qur'an 110:1–3",
        excerpt:
          "When the victory of Allah has come and the conquest, and you see the people entering Allah's religion in multitudes.",
      },
    ],
    appLinks: [{ label: "Lesson: mercy after victory", route: "/battles/lessons" }],
  },
  {
    id: "hunayn",
    section: "battles",
    title: "Battle of Hunayn",
    summary: "8 AH — ambush after Makkah; pride tested, then victory granted.",
    body: [
      "After Makkah, Hawazin and Thaqif gathered to fight the Muslims before their power consolidated. The Muslim army was large — many new converts from Makkah — and some boasted in their numbers.",
      "The enemy ambushed at dawn in the valley of Hunayn. Muslims initially fled in panic — even the large army scattered. The Prophet ﷺ called out: 'I am the Prophet, no lie; I am the son of Abd al-Muttalib!'",
      "A core of Muhajirun and Ansar rallied to him. The Muslims regrouped, pursued the enemy, and took spoils including captives. Later the Prophet ﷺ returned captives to soften hearts toward Islam.",
      "The Qur'an notes that victory is Allah's gift, not a result of boasting in numbers — a direct lesson from this battle.",
    ],
    battleDetails: {
      location: "Hunayn valley, near Ta'if",
      modernLocation: "Near Ta'if, Saudi Arabia",
      hijriDate: "Shawwal 8 AH",
      gregorianYear: 630,
      muslimForces: "12,000 (including new Makkan converts)",
      opposingForces: "Hawazin and Thaqif",
      muslimCommander: "Prophet Muhammad ﷺ",
      outcome: "Muslim victory after initial rout",
      keyEvents: [
        "Surprise ambush at dawn caused panic.",
        "Prophet ﷺ stood firm and called believers back.",
        "Siege of Ta'if followed; not immediately captured.",
        "Captives later returned as a gesture of reconciliation.",
      ],
      leadershipLesson: "Leaders must be visible and steady when followers panic.",
      spiritualLesson: "Never rely on numbers or recent success — rely on Allah.",
    },
    quran: [
      {
        surah: 9,
        ayahFrom: 25,
        ayahTo: 26,
        label: "Qur'an 9:25–26",
        excerpt:
          "Allah has already given you victory in many regions… Then He sent down His tranquillity.",
      },
    ],
  },
  {
    id: "tabuk",
    section: "battles",
    title: "Expedition of Tabuk",
    summary: "9 AH — a hard march in summer heat; faith tested without battle.",
    body: [
      "Reports of a Roman army gathering in the north led the Prophet ﷺ to call for a summer expedition — the most difficult march of his life. The distance, heat, and harvest season strained resources.",
      "Wealthy companions gave generously; poorer ones who had nothing wept because they could not contribute. Hypocrites sought excuses; three sincere believers were briefly boycotted for staying behind without valid reason.",
      "The army reached Tabuk; no enemy engaged. The expedition exposed hypocrisy, strengthened the sincere, and secured treaties with northern tribes.",
      "Surah at-Tawbah addresses those who stayed behind and praises those who sacrificed. Tabuk shows that readiness for defence is itself an act of faith even when no battle occurs.",
    ],
    battleDetails: {
      location: "Tabuk, northern Arabia",
      modernLocation: "Tabuk, Saudi Arabia",
      hijriDate: "Rajab 9 AH",
      gregorianYear: 631,
      muslimForces: "~30,000 (largest Muslim army to date)",
      opposingForces: "Roman/Byzantine forces did not appear for battle",
      muslimCommander: "Prophet Muhammad ﷺ",
      weather: "Extreme summer heat",
      outcome: "No battle; treaties secured; community tested",
      keyEvents: [
        "Difficult march in scorching heat.",
        "Generous donations from Abu Bakr, Uthman, and others.",
        "Boycott of Ka'b, Hilal, and Murarah until their repentance accepted.",
        "Northern tribes sent delegations to make peace.",
      ],
      leadershipLesson: "Transparency about hardship builds trust; do not hide the cost of duty.",
      spiritualLesson: "Sacrifice without immediate reward is among the highest tests.",
    },
    quran: [
      {
        surah: 9,
        ayahFrom: 81,
        ayahTo: 82,
        label: "Qur'an 9:81–82",
        excerpt:
          "Those who remained behind rejoiced in staying behind… Allah has prepared for them a painful punishment.",
      },
    ],
  },

  // ── Expeditions ───────────────────────────────────────────────────────────
  {
    id: "ghazawat-and-saraya",
    section: "expeditions",
    title: "Ghazawat and Saraya",
    summary: "The difference between major campaigns and smaller detachments.",
    body: [
      "A ghazwah is an expedition in which the Prophet ﷺ personally took part — about 27 are counted by scholars, including Badr, Uhud, and Tabuk.",
      "A sariyyah is a detachment sent under a named commander without the Prophet ﷺ joining — roughly 50 such missions for reconnaissance, response to raids, or inviting tribes to Islam.",
      "Many saraya involved no fighting — only diplomacy or demonstration of strength. Others, like the expedition to Mu'tah, involved serious combat.",
      "Understanding this distinction prevents exaggerating the number of 'battles' in early Islam. Not every march was a war; many were preventive or diplomatic.",
    ],
    actions: [
      "Browse the timeline to see which events were pitched battles versus sieges or marches.",
      "Read the glossary entries for ghazwah and sariyyah.",
    ],
    appLinks: [
      { label: "Glossary", route: "/battles/glossary" },
      { label: "Timeline", route: "/battles/timeline" },
    ],
  },

  // ── After the Prophet ﷺ ───────────────────────────────────────────────────
  {
    id: "battles-after-prophet",
    section: "later",
    title: "Battles after the Prophet ﷺ",
    summary:
      "Major engagements under the Rightly-Guided Caliphs — distinct from the prophetic era.",
    body: [
      "After the Prophet ﷺ passed away in 11 AH (632 CE), the Caliphs Abu Bakr, Umar, Uthman, and Ali (may Allah be pleased with them) led the community through Ridda (apostasy) wars, expansion into Persia and Byzantium, and internal fitna.",
      "These events belong to Islamic history but are not Sunnah in the same sense as the Prophet's own actions. They should be studied with historical methods and awareness that Muslim scholars themselves debate details and lessons.",
      "Battle of al-Qadisiyyah (636 CE): Sa'd ibn Abi Waqqas led Muslim forces against the Sasanian army in Iraq — a turning point that opened Persia.",
      "Battle of Yarmouk (636 CE): Muslim commanders including Khalid ibn al-Walid faced the Byzantines in Syria — a decisive campaign studied as history, not prophetic Sunnah.",
      "Battle of Nahavand (642 CE): Often called the 'Victory of Victories' — it broke remaining Sasanian resistance. Dates and troop figures vary between historians.",
    ],
    actions: [
      "Study prophetic battles first — they are the primary moral reference.",
      "Approach later conquests with nuance; avoid glorifying war or dismissing complex history.",
    ],
    disclaimer:
      "Numbers, motives, and moral evaluations of post-prophetic conquests are debated among historians. This overview is for orientation, not polemic.",
  },

  // ── Wisdom ────────────────────────────────────────────────────────────────
  {
    id: "leadership-lessons",
    section: "wisdom",
    title: "Leadership lessons",
    summary: "Patience, shura, mercy, and trust in Allah — not mere tactics.",
    body: [
      "The prophetic model of leadership in conflict emphasises character over cleverness. Decisions were made through consultation (shura), even when revelation would later confirm the outcome.",
      "Patience at Hudaybiyyah led to the Opening of Makkah. Mercy at Makkah won former enemies. Discipline at Uhud — when learned — prevented repeat disasters.",
      "Courage was shown not only in fighting but in standing firm when others fled (Hunayn), in digging trenches alongside soldiers (the Trench), and in forgiving those who once persecuted you (Makkah).",
      "Trust in Allah (tawakkul) never meant neglecting means: scouting, armour, trenches, and training were all part of preparation.",
    ],
    actions: [
      "Before a difficult decision, ask: have I consulted those with knowledge?",
      "After success, ask: am I showing mercy or pride?",
      "In setback, ask: is there disobedience or a lesson Allah wants me to learn?",
    ],
    appLinks: [{ label: "Lesson cards", route: "/battles/lessons" }],
  },

  // ── Evidence ──────────────────────────────────────────────────────────────
  {
    id: "hadith-on-battles",
    section: "evidence",
    title: "Authentic hadith on battles",
    summary: "Selected narrations with grading — categorised by theme.",
    body: [
      "Hadith on military expeditions must be verified for authenticity. Below are widely cited narrations from Sahih collections regarding conduct and key events.",
      "For battle-specific narrations, see each battle topic. Use Munib's hadith browser to read full chains and grading in context.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 2946",
        grade: "sahih",
        excerpt: "Do not wish to meet the enemy, but when you meet them, be patient.",
      },
      {
        collection: "Sahih Muslim",
        citation: "Hadith 1745",
        grade: "sahih",
        excerpt:
          "War is deceit — understood by scholars as tactical stratagem in battle, not treachery against treaties.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 4020",
        grade: "sahih",
        excerpt: "On the day of Badr, the Prophet ﷺ walked among the ranks arranging them.",
      },
    ],
    appLinks: [{ label: "Browse hadith", route: "/hadith" }],
  },
  {
    id: "references",
    section: "evidence",
    title: "References and sources",
    summary: "Classical seerah works and how to read them critically.",
    body: [
      "Primary seerah sources include Ibn Ishaq's Sirah (preserved through Ibn Hisham), al-Waqidi's Maghazi, and Ibn Kathir's al-Bidayah wan-Nihayah. Each has strengths and scholarly caveats.",
      "Ibn Ishaq / Ibn Hisham is the foundational narrative; al-Waqidi gives detailed battle accounts but some narrations are disputed; Ibn Kathir synthesises with tarikh and hadith criticism.",
      "Qur'anic passages on battles are the most authoritative texts. Hadith in Sahih al-Bukhari and Sahih Muslim on conduct are preferred for legal and ethical norms.",
      "Where historians differ — exact army sizes, some dates, and the morality of specific post-prophetic campaigns — this app notes uncertainty rather than inventing precision.",
    ],
    actions: [
      "Cross-check any battle detail with Qur'an first, then sahih hadith, then seerah.",
      "Consult qualified scholars for fatwa or political application — this module is educational.",
    ],
    appLinks: [
      { label: "Seerah timeline", route: "/seerah" },
      { label: "Qur'an verses", route: "/battles/verses" },
    ],
  },
];

// Post-prophetic battle details as a supplemental export for the later topic UI
export const BATTLES_AFTER_PROPHET = [
  {
    id: "qadisiyyah",
    title: "Battle of al-Qadisiyyah",
    year: 636,
    body: "Sa'd ibn Abi Waqqas led Muslim forces against the Sasanian army in Iraq. The victory opened Persia to Islam; exact troop numbers and the role of individual commanders are discussed in classical histories.",
    location: "Near al-Qadisiyyah, Iraq",
  },
  {
    id: "yarmouk",
    title: "Battle of Yarmouk",
    year: 636,
    body: "Khalid ibn al-Walid and other commanders faced the Byzantine army in Syria. A decisive Muslim victory that ended major Byzantine field power in the Levant — studied as a military campaign, not as prophetic Sunnah.",
    location: "Yarmouk River, Jordan/Syria",
  },
  {
    id: "nahavand",
    title: "Battle of Nahavand",
    year: 642,
    body: "Called the 'Victory of Victories' in Arabic sources — it broke remaining Sasanian resistance. Marks the effective end of the Persian Empire; dates and details vary slightly between historians.",
    location: "Nahavand, Iran",
  },
] as const;
