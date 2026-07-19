import type { BattlesTopic } from "../types/battles";

export { BATTLES_FIGURES } from "./battles-figures";
export { BATTLES_GLOSSARY } from "./battles-glossary";
export { BATTLES_LESSON_CARDS } from "./battles-lessons";
export { BATTLES_TIMELINE } from "./battles-timeline";
export { BATTLES_VERSES } from "./battles-verses";

/**
 * Battles in Islam — authentic history, ethics, and lessons from the military
 * campaigns of the Prophetﷺ era. Scholar-neutral, mainstream Sunni; claims cite
 * Qur'an or graded hadith verified against the collections. Every engagement is
 * presented for its ethical and spiritual lessons — trust in Allah, patience,
 * consultation (shura), mercy in victory, and the tests of faith — never as
 * triumphalism. Where historians differ on numbers or dates, that is noted.
 * Bump version on change.
 */
export const BATTLES_CONTENT_VERSION = 2;

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
      'For the first thirteen years of revelation in Makkah, Muslims were commanded to endure persecution with patience — no permission to fight was given. When companions asked to defend themselves, the answer was: "Restrain your hands, establish prayer, and give zakah" (Qur\'an 4:77). The early community answered oppression with steadfastness, migration, and prayer, not armed rebellion.',
      "The Hijra to Madinah (622 CE / 1 AH) changed the community's situation, not its principles. In Yathrib the Muslims became a settled society bound by the Constitution of Madinah — a written covenant of mutual defence and coexistence with the city's Jewish tribes. The Prophet ﷺ was now the head of a polity that could be attacked and therefore could lawfully defend itself.",
      'Only then, after years of oppression, did the first permission to fight descend — and its stated reason was that the believers had been wronged and driven from their homes for saying "Our Lord is Allah" (Qur\'an 22:39–40). The permission was for defence and the protection of religious freedom — the same verse names the safety of "monasteries, churches, synagogues, and mosques" as what such fighting preserves — not for conquest, forced conversion, or plunder.',
      "The Qur'an fixed a permanent limit around this permission: \"Fight in the way of Allah those who fight you, but do not transgress\" (Qur'an 2:190). Fighting was tied to aggression against the community, and it was never to exceed the bounds of justice.",
      "These campaigns are history: they occurred in a specific seventh-century Arabian context of tribal warfare, broken treaties, and siege. The general Islamic teachings on peace, justice, mercy, and neighbourliness are the frame; the particulars of these battles must be read inside that frame, not collapsed into slogans torn from it.",
    ],
    quran: [
      {
        surah: 22,
        ayahFrom: 39,
        ayahTo: 40,
        label: "Qur'an 22:39–40",
        excerpt:
          "Permission is given to those who fight because they have been wronged — and Allah is indeed able to give them victory — those who have been driven from their homes without right, only because they said: Our Lord is Allah. Had Allah not repelled some people by means of others, monasteries, churches, synagogues, and mosques — in which the name of Allah is much mentioned — would surely have been demolished.",
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
      "The context and cause of these battles was a sustained campaign of hostility, not a Muslim appetite for war. In Makkah, Quraysh had tortured the weak, boycotted the whole clan to the edge of starvation, seized the property left behind by emigrants, and even plotted to assassinate the Prophet ﷺ. Migration to Madinah did not end the threat; it relocated it.",
      "Badr (2 AH) grew out of that unresolved conflict. When word came that a large Quraysh caravan — carrying wealth taken from the emigrants — was returning from Syria, the Prophet ﷺ set out to intercept it. The caravan escaped, but Quraysh had already mustered an army of about a thousand and marched anyway, determined to crush the young community by force. The pitched battle at the wells of Badr was the result.",
      "In Madinah, survival depended on treaties, and treaties were repeatedly broken. Factions that had pledged mutual defence under the city's covenant instead conspired with the enemy — the Confederates who besieged Madinah at the Trench (5 AH) were assembled precisely to eliminate the Muslims entirely.",
      "Treaty violations remained decisive to the end. It was Quraysh's allies attacking the Muslims' allies, the Banu Khuza'ah, that voided the Treaty of Hudaybiyyah and led — remarkably — to the almost bloodless opening of Makkah rather than to a massacre.",
      "Across all of this, the objectives were consistent: to defend life and religion, to protect the vulnerable, and to establish enough security that tawhid could be practised without persecution. The aim was never endless expansion for its own sake, and the sources record the Prophet ﷺ preferring truce and treaty whenever the enemy inclined toward peace.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "25",
        grade: "sahih",
        excerpt:
          'I have been ordered to fight the people until they testify that there is no god but Allah and that Muhammad is the Messenger of Allah, establish prayer, and give zakah. If they do so, their lives and property are protected from me except by the right of Islam, and their reckoning is with Allah. — Classical scholars read "the people" as the specific idolaters of Arabia then waging war on Islam after the message had reached them; it is a statement about those hostile combatants, not a licence to attack peaceful non-Muslims or to compel belief, which Qur\'an 2:256 forbids outright.',
      },
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 256,
        label: "Qur'an 2:256",
        excerpt:
          "There is no compulsion in religion. The right course has become distinct from error.",
      },
    ],
    disclaimer:
      "The hadith above is often quoted stripped of its setting. Classical scholars placed it within the specific hostilities of its time and alongside the Qur'anic ban on compulsion in religion (2:256) and the limit that fighting is only against those who fight you (2:190).",
    appLinks: [{ label: "Ethics of warfare", route: "/battles/ethics-of-warfare" }],
  },
  {
    id: "ethics-of-warfare",
    section: "context",
    title: "Ethics of warfare in Islam",
    summary:
      "No aggression, strict protection of civilians, and humane conduct — grounded in Qur'an and Sunnah.",
    importance: "foundational",
    body: [
      "The Islamic law of war (siyar) grew directly out of Qur'anic limits and the Prophet's practice. Its foundation is a single rule that governs everything else: \"Fight those who fight you, but do not transgress\" (Qur'an 2:190). Fighting is a response to aggression, bounded by justice, and it must stop the moment the enemy stops.",
      "Non-combatants are strictly protected. When a slain woman was found after one expedition, the Prophet ﷺ forbade the killing of women and children outright. Jurists extended this to the elderly, to monks and worshippers secluded in their cells, to farm labourers and hired workers, and to anyone who takes no part in fighting. Killing them is not a permitted excess — it is forbidden.",
      "Even against active combatants, the point was invitation before the sword. When the Prophet ﷺ appointed a commander he instructed him to first call the other side to Islam, then — if refused — to a peace settlement, and only to fight if both were rejected, and never to break faith, mutilate a body, or kill a child (Sahih Muslim 1731).",
      'Treachery is categorically forbidden: treaties must be honoured to their term, and the enemy must be given fair warning rather than betrayed. The battlefield permission that "war is deceit" refers only to tactical stratagem — feints, surprise, misdirection — never to breaking a covenant or lying to a protected party.',
      "Property and the earth itself are protected. General guidance prohibited the wanton felling of fruit trees, the burning of crops, and the slaughter of livestock beyond need. Prisoners were to be fed as the captors ate and clothed as they clothed themselves; the Qur'an praises those who feed the captive for the love of Allah (76:8), and many were freed by ransom, exchange, or simple mercy — some at Badr in exchange for teaching Muslims to read.",
      "These are the normative teachings of the religion. Individual Muslims across history who violated them were violating Islam, not defining it — just as violations by the followers of any faith do not rewrite what that faith commands.",
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
        excerpt:
          "And if they incline to peace, then incline to it also, and rely upon Allah. Indeed, it is He who is the Hearing, the Knowing.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1744b",
        grade: "sahih",
        excerpt:
          "Ibn Umar reported that a woman was found slain in one of the expeditions of the Messenger of Allah ﷺ, so he forbade the killing of women and children.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1731",
        grade: "sahih",
        excerpt:
          "When the Prophet ﷺ appointed a commander over an army he charged him: Fight in the name of Allah… do not embezzle the spoils, do not break your pledge, do not mutilate, and do not kill a child. When you meet the enemy, first invite them to Islam; if they refuse, offer them peace; only if they refuse both, then fight.",
      },
      {
        collection: "Sunan Abi Dawud",
        citation: "2614",
        grade: "daif",
        excerpt:
          "Do not kill a decrepit old man, nor a young child, nor a woman. — Some chains of this exact wording are graded weak, but the ruling it states is confirmed by the sahih narration above and by the consensus of the jurists.",
      },
    ],
    actions: [
      "Distinguish clearly between what Islam commands and what any army in history actually did.",
      "Read this ethics section before any battle narrative — history without its governing principles invites misunderstanding.",
      "When a source records an act that seems to contradict these rules, ask about its context and authenticity before drawing conclusions.",
    ],
    appLinks: [{ label: "Qur'an verses", route: "/battles/verses" }],
  },

  // ── Battles during the Prophet ﷺ ──────────────────────────────────────────
  {
    id: "badr",
    section: "battles",
    title: "Battle of Badr",
    summary: "17 Ramadan 2 AH — the first major battle, the Day of Criterion.",
    importance: "foundational",
    body: [
      "Context and cause: After the Hijra, Quraysh had seized the homes and wealth the emigrants left in Makkah and kept up their threats. When news reached Madinah that Abu Sufyan was leading a rich caravan back from Syria, the Prophet ﷺ set out with a light force — roughly 313 men — expecting to intercept property, not to fight a war.",
      "What happened: Abu Sufyan slipped past along the coast, but he had already sent to Makkah for help, and Quraysh marched out with about a thousand fighters, cavalry, and provisions, resolved to make an example of the Muslims. Battle became unavoidable at the wells of Badr, where — on the advice of al-Hubab ibn al-Mundhir — the Muslims seized the water first, denying it to the enemy.",
      "That night the Prophet ﷺ stood in prayer until dawn. Facing an army three times his own, he raised his hands and implored his Lord so earnestly that his cloak slipped from his shoulders, saying: \"O Allah, if this band of believers is destroyed, You will not be worshipped on earth.\" The Qur'an records that Allah answered with reinforcement by angels and cast tranquillity into the believers' hearts.",
      "After single combat between three champions from each side, the armies clashed. Quraysh broke. About seventy of their leaders were killed — among them Abu Jahl, the community's fiercest persecutor — and about seventy were taken captive; fourteen Muslims were martyred. The captives were treated with dignity, and some purchased their freedom by teaching Muslim children to read and write.",
      "Key figures: alongside the Prophet ﷺ stood Abu Bakr, Umar, Ali, and his uncle Hamza; the counsel of al-Hubab on the wells and of Sa'd ibn Mu'adh on strategy shows leadership through consultation even when victory was promised.",
      "The Qur'an calls this day yawm al-furqan — the Day of Criterion — because it distinguished truth from falsehood before the whole peninsula. Its enduring lesson is that sincere effort and full preparation must be joined to total reliance on Allah: the believers arranged their ranks, chose their ground, and made dua, and the victory was credited to Allah, not to their numbers.",
    ],
    battleDetails: {
      location: "The wells of Badr, southwest of Madinah",
      modernLocation: "Near modern Badr, Saudi Arabia",
      hijriDate: "17 Ramadan 2 AH",
      gregorianYear: 624,
      muslimForces: "~313 fighters, with few horses and camels (reports vary slightly)",
      opposingForces: "~1,000 Quraysh, better armed and mounted",
      muslimCommander: "Prophet Muhammad ﷺ",
      opposingCommander: "Amr ibn Hisham (Abu Jahl), killed in battle",
      weather:
        "Rain the night before firmed the sand for the Muslims; access to water was decisive",
      outcome: "Decisive Muslim victory",
      keyEvents: [
        "Al-Hubab ibn al-Mundhir advised camping at the wells first, controlling the water.",
        "The Prophet ﷺ prayed through the night, imploring Allah for the outnumbered believers.",
        "Three Quraysh champions were met by Hamza, Ali, and Ubaydah in single combat.",
        "Allah reinforced the believers with angels (Qur'an 8:9) and cast down key Quraysh leaders.",
        "About 70 of the enemy were killed and 70 captured; captives were treated humanely.",
      ],
      leadershipLesson:
        "Prepare thoroughly, consult those with knowledge, then rely wholly on Allah.",
      spiritualLesson:
        "A small sincere group with divine support can overturn worldly odds — victory is from Allah.",
      facts: [
        "Badr is named and described in the Qur'an more than any other single engagement (Surah al-Anfal).",
        "Some captives were freed in exchange for teaching literacy to the children of Madinah.",
      ],
    },
    quran: [
      {
        surah: 8,
        ayahFrom: 9,
        label: "Qur'an 8:9",
        excerpt:
          "When you were asking help of your Lord and He answered you: I will reinforce you with a thousand angels, following one another.",
      },
      {
        surah: 3,
        ayahFrom: 13,
        label: "Qur'an 3:13",
        excerpt:
          "There was already a sign for you in the two armies that met — one fighting in the cause of Allah and another of disbelievers.",
      },
      {
        surah: 8,
        ayahFrom: 17,
        label: "Qur'an 8:17",
        excerpt:
          "You did not kill them, but it was Allah who killed them. And you threw not when you threw, but it was Allah who threw.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1763",
        grade: "sahih",
        excerpt:
          "Umar reported that on the day of Badr the Prophet ﷺ looked at the enemy of a thousand while his own companions were a little over three hundred, then turned to the qibla, stretched out his hands, and implored his Lord: O Allah, fulfil what You promised me. O Allah, if this band of believers is destroyed, You will not be worshipped on earth. He kept imploring until his cloak fell from his shoulders, and Abu Bakr replaced it and said: Enough, O Prophet of Allah — Allah will fulfil what He promised you.",
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
    summary: "Shawwal 3 AH — a costly lesson in obedience, discipline, and steadfastness.",
    body: [
      "Context and cause: A year after Badr, Quraysh returned to avenge their dead, mustering about 3,000 fighters — with cavalry led by Khalid ibn al-Walid, then still an enemy, and women urging the men on with drums and elegies. The Muslims, about 700 after some withdrew, took position with Mount Uhud at their backs.",
      'What happened: The Prophet ﷺ stationed fifty archers on a hill guarding the army\'s exposed rear and gave them an order he repeated for emphasis: "Do not leave this position even if you see us being snatched away by birds, until I send for you." At first the plan worked perfectly — the Muslims drove Quraysh back and the enemy began to flee.',
      "Seeing the enemy scatter and the spoils lying open, most of the archers abandoned the hill against the order, sure the battle was won. Khalid ibn al-Walid seized the moment, wheeled his cavalry through the undefended gap, and struck the Muslims from behind. Order collapsed into chaos.",
      'Key figures and cost: Hamza ibn Abd al-Muttalib, the "Lion of Allah," was martyred, along with some seventy companions. The Prophet ﷺ himself was wounded — his tooth broken and his face cut — and a rumour swept the field that he had been killed. When the believers saw he was alive, they rallied to him on the mountain slope, and Quraysh, unable to finish them, withdrew.',
      "The Qur'an addresses this day at length in Surah Al Imran, laying the responsibility on the disobedience of some, not on any failure of faith or of Allah's promise: \"Allah had certainly fulfilled His promise to you… until you lost courage, disputed over the order, and disobeyed after He had shown you what you love\" (3:152). Yet the same passage consoles the wounded community and forbids despair.",
      "Uhud is therefore not a defeat of Islam but a preserved lesson: victory previously granted was withdrawn the moment discipline broke, clear commands matter as much as courage, and trials refine a community — for those who repent and hold firm, setback becomes the seedbed of growth.",
    ],
    battleDetails: {
      location: "The slopes of Mount Uhud, north of Madinah",
      modernLocation: "Uhud, Madinah region, Saudi Arabia",
      hijriDate: "Shawwal 3 AH",
      gregorianYear: 625,
      muslimForces: "~700 (after some withdrew before battle)",
      opposingForces: "~3,000 Quraysh and allies, with cavalry",
      muslimCommander: "Prophet Muhammad ﷺ",
      opposingCommander: "Abu Sufyan ibn Harb; Khalid ibn al-Walid led the flanking cavalry",
      outcome: "Quraysh tactical field advantage; the Muslim community survives intact",
      keyEvents: [
        "The Prophet ﷺ stationed 50 archers on a hill with strict orders never to leave it.",
        "The Muslims broke the enemy line, but most archers left their post to gather spoils.",
        "Khalid ibn al-Walid's cavalry exploited the gap and struck from behind.",
        "Hamza and about 70 companions were martyred; the Prophet ﷺ was wounded.",
        "A false rumour of the Prophet's death spread; the believers rallied when they saw him alive.",
      ],
      leadershipLesson:
        "Clear orders and disciplined execution matter as much as bravery; abandoning your post can undo a victory.",
      spiritualLesson:
        "Trials refine the believers; setback met with repentance and steadfastness leads to growth.",
    },
    quran: [
      {
        surah: 3,
        ayahFrom: 152,
        label: "Qur'an 3:152",
        excerpt:
          "Allah had certainly fulfilled His promise to you when you were killing them by His permission — until you lost courage, disputed over the order, and disobeyed after He had shown you that which you love.",
      },
      {
        surah: 3,
        ayahFrom: 139,
        label: "Qur'an 3:139",
        excerpt:
          "So do not weaken and do not grieve, for you will be superior if you are true believers.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3039",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ appointed Abdullah ibn Jubayr over the fifty archers on the day of Uhud and said: Hold your position; even if you see us being snatched away by birds, do not leave it until I send for you — and even if you see us defeat them, do not leave until I send for you. When the enemy was routed and the archers saw the spoils, they said, The booty! and left their post — so seventy of us were killed.",
      },
    ],
    appLinks: [
      { label: "Leadership lessons", route: "/battles/lessons" },
      { label: "Key companions", route: "/battles/figures" },
    ],
  },
  {
    id: "trench",
    section: "battles",
    title: "Battle of the Trench",
    summary: "Shawwal 5 AH — the Confederates besiege Madinah; a trench and a wind break them.",
    body: [
      "Context and cause: Also called Ghazwat al-Ahzab (the Battle of the Confederates), this was the enemy's largest effort to destroy Islam once and for all. Chiefs of Banu Nadir, expelled earlier for treachery, rode to Makkah and to Ghatafan and assembled a coalition — Quraysh, Ghatafan, and other tribes — estimated between 10,000 and 24,000 men. The Muslims numbered about 3,000, and the danger was existential.",
      "What happened: Facing a siege no Arab city could withstand in open battle, the Prophet ﷺ consulted his companions. Salman al-Farisi proposed a Persian tactic unknown to Arabian warfare — digging a deep trench across the exposed northern approach, the only side not shielded by lava fields, orchards, or fortified houses. The believers dug for days in bitter cold and hunger, the Prophet ﷺ carrying earth on his own back and tying a stone to his stomach against the pangs of fasting.",
      "The trench worked. When the vast host arrived it found itself unable to cross; a few horsemen who leapt it were driven back. The siege settled into roughly two to four weeks of cold, tension, and skirmishing rather than a pitched battle.",
      "The community was tested to its core. Hypocrites made excuses and sought to slip away; the tribe of Banu Qurayzah inside the city wavered toward the enemy; the Qur'an describes hearts reaching the throats. Yet the believers held, and Nu'aym ibn Mas'ud — newly Muslim in secret — sowed distrust between the confederate factions until they turned on one another.",
      "Then relief came from Allah, not from swords. A fierce, freezing wind tore through the enemy camp, overturning cooking fires and tents, and unseen armies filled them with terror. The coalition, already fractured and low on supplies, broke up and withdrew in the night. The Prophet ﷺ said afterward that Allah alone had defeated the Confederates.",
      "Enduring lessons: sound counsel is to be adopted wherever it comes from — here from a Persian convert; means must be taken to their limit — the trench dug, the ranks held; and then the outcome is entrusted to Allah, who can turn back an army with a wind. Surah al-Ahzab preserves the whole trial and its relief.",
    ],
    battleDetails: {
      location: "The northern approaches to Madinah",
      modernLocation: "Madinah, Saudi Arabia",
      hijriDate: "Shawwal 5 AH",
      gregorianYear: 627,
      muslimForces: "~3,000",
      opposingForces: "Confederate coalition (~10,000–24,000; figures differ in the sources)",
      muslimCommander: "Prophet Muhammad ﷺ",
      opposingCommander: "Abu Sufyan leading the Quraysh; allied chiefs of Ghatafan and others",
      weather: "Bitter cold during the digging; a violent divine wind ended the siege",
      outcome: "Muslim victory without a pitched battle; the coalition disperses",
      keyEvents: [
        "Salman al-Farisi proposed digging a trench across the vulnerable northern corridor.",
        "The Prophet ﷺ shared the labour, carrying earth and binding a stone against hunger.",
        "The trench halted the vast host, forcing a siege instead of open battle.",
        "Nu'aym ibn Mas'ud sowed discord that split the confederate allies.",
        "A freezing wind and unseen armies (Qur'an 33:9) shattered the enemy camp; they withdrew.",
      ],
      leadershipLesson:
        "Consult widely and adopt good ideas regardless of their origin; share the community's hardship yourself.",
      spiritualLesson:
        "Hold firm under siege and entrust the result to Allah, who can turn back an army with a wind.",
    },
    quran: [
      {
        surah: 33,
        ayahFrom: 9,
        ayahTo: 11,
        label: "Qur'an 33:9–11",
        excerpt:
          "O you who believe, remember the favour of Allah upon you when armies came to you and We sent against them a wind and armies you did not see… There the believers were tested and shaken with a severe shaking.",
      },
      {
        surah: 33,
        ayahFrom: 22,
        label: "Qur'an 33:22",
        excerpt:
          "And when the believers saw the Confederates, they said: This is what Allah and His Messenger promised us — and it only increased them in faith and submission.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "2933",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ supplicated against the Confederates on the day of al-Ahzab, saying: O Allah, Revealer of the Book, Swift in reckoning — defeat the Confederates. O Allah, defeat them and shake them.",
      },
    ],
    appLinks: [{ label: "Salman al-Farisi", route: "/battles/figures" }],
  },
  {
    id: "banu-qurayzah",
    section: "battles",
    title: "Banu Qurayzah",
    summary: "5 AH — a treaty betrayed during the siege; judgement by an agreed arbiter.",
    body: [
      "Context and cause: The Banu Qurayzah were a Jewish tribe of Madinah bound to the Muslims by the city's covenant of mutual defence. At the height of the Trench, when the Confederates ringed Madinah and the community's survival hung by a thread, the chief of Banu Nadir persuaded Qurayzah's leaders to tear up that covenant and open a second front from within the city. Coming at that moment, this was not a private dispute but treason during a siege that could have destroyed everyone in Madinah.",
      "What happened: After the Confederates withdrew, the Prophet ﷺ moved against Banu Qurayzah, who shut themselves in their fortresses. The siege lasted about twenty-five days until they agreed to surrender — but they asked that their fate be decided not by the Prophet ﷺ directly but by an arbiter they themselves chose: Sa'd ibn Mu'adh, chief of the Aws, their own long-standing allies.",
      "The judgement: Sa'd — himself dying of a wound taken at the Trench — ruled that the fighting men who had committed the betrayal be executed and the women and children taken as captives, a verdict severe by any standard yet in keeping with the war-law of that time and place for treason under siege. The Prophet ﷺ said Sa'd had judged in accordance with the judgement of Allah.",
      "How to read it carefully: This was a punishment for a specific act of wartime treachery by combatants who broke a defence pact at the community's most vulnerable hour — not a ruling against a people for their faith, and emphatically not a template for how Muslims are to treat Jews or any religious community. The Qur'an and Sunnah command justice and good treatment toward peaceful non-Muslims (Qur'an 60:8), and the other Jewish tribes and individuals of Madinah who kept faith were never harmed. Mainstream scholarship treats this as a bounded historical episode of treason law, and some later scholars even questioned details of the transmitted numbers.",
      "The Qur'an refers to the episode soberly in Surah al-Ahzab as a consequence of the Confederate war, without triumph. The lasting lesson is the gravity of breaking a covenant — betrayal of trust in a moment of shared danger carries the heaviest weight — set beside the principle that even an enemy is entitled to judgement by an agreed and impartial arbiter rather than to unchecked vengeance.",
    ],
    battleDetails: {
      location: "The fortresses of Banu Qurayzah, on the edge of Madinah",
      modernLocation: "Madinah, Saudi Arabia",
      hijriDate: "Dhul-Qa'dah 5 AH (soon after the Trench)",
      gregorianYear: 627,
      muslimForces: "The Madinan army, immediately after the siege of the Trench",
      opposingForces: "Banu Qurayzah, fortified within their strongholds",
      muslimCommander: "Prophet Muhammad ﷺ",
      outcome: "Surrender after siege; judgement rendered by the tribe's own chosen arbiter",
      keyEvents: [
        "Banu Qurayzah broke the covenant of Madinah during the Confederate siege.",
        "After the Confederates withdrew, the Muslims besieged their forts for about 25 days.",
        "The tribe asked to be judged by Sa'd ibn Mu'adh, chief of their long-time allies the Aws.",
        "Sa'd ruled by the war-law of the age for treason under siege; the Prophet ﷺ affirmed the verdict.",
      ],
      leadershipLesson:
        "Even against an enemy, allow judgement by an agreed, impartial arbiter rather than unchecked vengeance.",
      spiritualLesson:
        "Breaking a covenant of mutual protection in a moment of shared danger is among the gravest of betrayals.",
    },
    quran: [
      {
        surah: 33,
        ayahFrom: 26,
        ayahTo: 27,
        label: "Qur'an 33:26–27",
        excerpt:
          "And He brought down those of the People of the Scripture who supported them from their fortresses and cast terror into their hearts — a party you killed, and a party you took captive. And He caused you to inherit their land and their homes.",
      },
      {
        surah: 60,
        ayahFrom: 8,
        label: "Qur'an 60:8",
        excerpt:
          "Allah does not forbid you from those who do not fight you because of religion and do not expel you from your homes — from being righteous toward them and acting justly toward them. Indeed, Allah loves those who act justly.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3804",
        grade: "sahih",
        excerpt:
          "When Banu Qurayzah agreed to accept the judgement of Sa'd ibn Mu'adh, the Prophet ﷺ sent for him. He came, and the Prophet ﷺ said: Stand for your chief. Sa'd judged that their fighting men be killed and their women and children taken captive. The Prophet ﷺ said: You have judged by the judgement of Allah — or he said, by the judgement of the King.",
      },
    ],
    disclaimer:
      "This was punishment for a specific act of wartime treason by combatants, judged by an arbiter the tribe itself chose. It is not a ruling against any people for their religion and is not a model for relations with Jews or any faith community, whom Islam commands be treated with justice and kindness (Qur'an 60:8). Some later scholars questioned details of the transmitted numbers.",
  },
  {
    id: "hudaybiyyah",
    section: "battles",
    title: "Treaty of Hudaybiyyah",
    summary: "6 AH — a truce that looked like a setback and became a clear victory.",
    importance: "foundational",
    body: [
      "Context and cause: In 6 AH the Prophet ﷺ set out with about 1,400 companions — unarmed but for travellers' swords — intending only to perform the lesser pilgrimage (umrah) to the Ka'bah, not to fight. Quraysh, unwilling to be seen letting the Muslims into Makkah, blocked the road at a place called Hudaybiyyah on the sacred boundary.",
      "The Pledge of Ridwan: When a rumour reached the camp that Quraysh had killed the Prophet's envoy Uthman ibn Affan, the Prophet ﷺ called the companions to pledge under an acacia tree that they would not flee. About fourteen hundred gave that pledge — the Bay'at al-Ridwan, the Pledge of Divine Pleasure — and the Qur'an later declared: \"Allah was well pleased with the believers when they pledged allegiance to you under the tree\" (48:18). Uthman proved to be alive, and Quraysh, alarmed by the resolve on display, sent to negotiate.",
      "What happened: The terms of the truce seemed humiliating. The Muslims would turn back this year without umrah and could return only the next. There would be a ten-year peace. Anyone fleeing from Quraysh to the Muslims would be returned, but not the reverse — a clause that stung. When a Muslim in chains, Abu Jandal, was dragged back before their eyes under this very clause, the companions were near breaking; Umar questioned it openly and was gently reminded to trust the Messenger of Allah.",
      'Why it was a victory: For the first time Quraysh dealt with the Muslims as an equal power in a written treaty. The ten-year peace opened the roads; Islam spread rapidly and peacefully during the truce — more entered Islam in those two years than in all the years before. Freed from the Quraysh front, the Prophet ﷺ could turn to Khaybar and send letters inviting kings and tribes to Islam. On the return journey Surah al-Fath was revealed, opening with: "Indeed, We have given you a manifest victory."',
      "Enduring lessons: This is the supreme example of patience over impulse and of trusting Allah and His Messenger when the wisdom of a decision is not yet visible. What the companions first felt as a defeat, the Qur'an named a clear victory — and within two years it opened the road to Makkah itself. The willingness to accept a hard peace, honour a treaty, and wait is shown here to be a form of strength, not weakness.",
    ],
    battleDetails: {
      location: "Hudaybiyyah, on the sacred boundary near Makkah",
      modernLocation: "Al-Shumaisi, near Makkah, Saudi Arabia",
      hijriDate: "Dhul-Qa'dah 6 AH",
      gregorianYear: 628,
      muslimForces: "~1,400 pilgrims, not equipped for war",
      opposingForces: "Quraysh, blocking the road to Makkah",
      muslimCommander: "Prophet Muhammad ﷺ",
      outcome: "A ten-year truce; no fighting; later called a manifest victory in the Qur'an",
      keyEvents: [
        "The Muslims set out for umrah, not for battle, and were stopped at Hudaybiyyah.",
        "On a false report of Uthman's death, ~1,400 gave the Pledge of Ridwan under the tree.",
        "A ten-year truce was signed on terms the companions found bitter (the return clause, Abu Jandal).",
        "Islam spread rapidly during the peace; Surah al-Fath called the treaty a manifest victory.",
      ],
      leadershipLesson:
        "Accept a hard peace and honour it; a wise concession today can open a greater door tomorrow.",
      spiritualLesson:
        "Trust Allah and His Messenger when a decision's wisdom is hidden — patience can be the truest victory.",
    },
    quran: [
      {
        surah: 48,
        ayahFrom: 1,
        ayahTo: 3,
        label: "Qur'an 48:1–3",
        excerpt:
          "Indeed, We have given you a manifest victory, that Allah may forgive you what preceded of your sin and what will follow, complete His favour upon you, and guide you to a straight path.",
      },
      {
        surah: 48,
        ayahFrom: 18,
        label: "Qur'an 48:18",
        excerpt:
          "Certainly was Allah pleased with the believers when they pledged allegiance to you under the tree, and He knew what was in their hearts, so He sent down tranquillity upon them and rewarded them with an imminent conquest.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "4154",
        grade: "sahih",
        excerpt:
          "Jabir ibn Abdullah said: On the day of al-Hudaybiyyah we were fourteen hundred. We pledged allegiance to the Prophet ﷺ under the tree, and he was the best of people.",
      },
    ],
    appLinks: [
      { label: "Lesson: patience before victory", route: "/battles/lessons" },
      { label: "Qur'an verses", route: "/battles/verses" },
    ],
  },
  {
    id: "khaybar",
    section: "battles",
    title: "Expedition of Khaybar",
    summary: "7 AH — fortified strongholds that had backed the Confederates are subdued.",
    body: [
      "Context and cause: Khaybar was a chain of fertile oasis fortresses north of Madinah, home to the tribes expelled earlier for treachery — including the chiefs of Banu Nadir who had organised the Confederate coalition at the Trench. From there they continued to rally enemies against Madinah. With the Quraysh front frozen by Hudaybiyyah, the Prophet ﷺ moved to neutralise this remaining base of hostility.",
      'What happened: The Muslims — about 1,600 — advanced on the forts one by one. The campaign was hard and drawn out over several weeks. On one difficult day the Prophet ﷺ said, "Tomorrow I will give the banner to a man who loves Allah and His Messenger, and whom Allah and His Messenger love, through whose hands Allah will grant victory." The next morning he called for Ali ibn Abi Talib — who was suffering from sore eyes — prayed over him until he was healed, and gave him the banner; the key fortress fell.',
      "The settlement: When the strongholds were taken, the inhabitants were not expelled. They asked to remain and continue farming the land, giving the Muslims a share of the produce, and the Prophet ﷺ agreed. This arrangement — conquered farmers kept on their land under a produce-sharing pact — became an early precedent studied in later Islamic law of treaties and taxation.",
      "Key figures: the campaign is remembered above all for Ali's role and for the ethic embodied in the banner hadith — that leadership is entrusted on the basis of sincerity and love of Allah, not merely rank or strength.",
      "A note on care: Khaybar is sometimes dragged into much later political controversies. Here it is described strictly as the seventh-century expedition recorded in the classical seerah — a response to an active hostile base, concluded not with mass expulsion but with a negotiated settlement.",
    ],
    battleDetails: {
      location: "The Khaybar oasis, north of Madinah",
      modernLocation: "Khaybar, Saudi Arabia",
      hijriDate: "Muharram–Safar 7 AH",
      gregorianYear: 628,
      muslimForces: "About 1,600",
      opposingForces: "Fortified garrisons across several forts",
      muslimCommander: "Prophet Muhammad ﷺ; Ali ibn Abi Talib led the decisive assault",
      outcome: "Muslim control of the fortresses; a negotiated produce-sharing settlement",
      keyEvents: [
        "The forts were reduced one by one over several weeks of siege.",
        "The banner was given to Ali, whose eyes the Prophet ﷺ had healed by his prayer.",
        "The champion Marhab was overcome and the key fortress fell.",
        "The residents remained on their land as cultivators under a produce-sharing pact.",
      ],
      leadershipLesson:
        "Entrust responsibility to those best suited — and to those whose hearts are sincere with Allah.",
      spiritualLesson:
        "Persistence through prolonged hardship, joined to sincerity, brings the help of Allah.",
    },
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "4210",
        grade: "sahih",
        excerpt:
          "On the day of Khaybar the Prophet ﷺ said: Tomorrow I will give this banner to a man who loves Allah and His Messenger, and whom Allah and His Messenger love, and through whose hands Allah will grant victory. The next day he called for Ali, who had sore eyes; he spat in his eyes and prayed for him, and Ali was cured as though he had never been ill, and he was given the banner.",
      },
    ],
    appLinks: [{ label: "Ali ibn Abi Talib", route: "/battles/figures" }],
  },
  {
    id: "mutah",
    section: "battles",
    title: "Battle of Mu'tah",
    summary:
      "Jumada al-Ula 8 AH — a frontier expedition where three commanders are martyred in turn.",
    body: [
      "Context and cause: The Prophet ﷺ had sent an envoy toward the Byzantine-aligned north, and the envoy was killed — a grave breach, since envoys were protected by the law of nations. In response he dispatched an army of about 3,000 toward Mu'tah, near the Roman frontier east of the Jordan.",
      "The chain of command: Before they set out, the Prophet ﷺ named a line of succession — Zayd ibn Harithah to lead, and if he fell, Ja'far ibn Abi Talib, and if he fell, Abdullah ibn Rawahah — a striking act of foresight that would prove decisive.",
      "What happened: At Mu'tah the Muslims met a vastly larger force of Byzantines and allied Arab tribes — the sources speak of tens of thousands, though the figures are uncertain and likely exaggerated. Zayd fell, then Ja'far — who is remembered for holding the banner until both his arms were severed — then Abdullah ibn Rawahah, exactly in the order the Prophet ﷺ had set.",
      'The withdrawal: With all three appointed commanders martyred, the companions gave the banner to Khalid ibn al-Walid, newly Muslim after Hudaybiyyah. By a series of manoeuvres and redeployments he disengaged the outnumbered army and brought it home largely intact — a feat the Prophet ﷺ honoured, later calling Khalid a "sword among the swords of Allah." In Madinah the Prophet ﷺ wept for Zayd, Ja\'far, and Ibn Rawahah and gave word of their martyrdom before any messenger arrived.',
      "Enduring lessons: naming successors before danger — leadership continuity — literally saved an army; and a disciplined withdrawal that preserves lives is not disgrace but wisdom. Martyrdom in Allah's cause is honour, not political failure, and the battle also introduced the Muslims to Khalid's gifts, soon turned wholly to the service of the faith.",
    ],
    battleDetails: {
      location: "Mu'tah, east of the Jordan River",
      modernLocation: "Near Karak, Jordan",
      hijriDate: "Jumada al-Ula 8 AH",
      gregorianYear: 629,
      muslimForces: "~3,000",
      opposingForces:
        "Byzantine and allied Arab forces (far larger; numbers uncertain in the sources)",
      muslimCommander: "Zayd ibn Harithah, then Ja'far, then Ibn Rawahah, then Khalid ibn al-Walid",
      outcome: "Orderly Muslim withdrawal; heavy martyrdom but the army preserved",
      keyEvents: [
        "The Prophet ﷺ named three commanders in order of succession before departure.",
        "All three fell in turn at Mu'tah, exactly as foretold.",
        "Khalid ibn al-Walid took command and manoeuvred the army to safety.",
        "The Prophet ﷺ wept in Madinah and announced the martyrs before news arrived.",
      ],
      leadershipLesson:
        "Name successors before danger strikes — clear leadership continuity saves lives.",
      spiritualLesson:
        "Martyrdom in Allah's cause is an honour; a wise withdrawal that saves an army is not defeat.",
    },
    appLinks: [{ label: "Khalid ibn al-Walid", route: "/battles/figures" }],
  },
  {
    id: "conquest-makkah",
    section: "battles",
    title: "Conquest of Makkah",
    summary: "Ramadan 8 AH — the near-bloodless opening of Makkah under a general amnesty.",
    importance: "foundational",
    body: [
      "Context and cause: The Treaty of Hudaybiyyah held until Quraysh's allies, the Banu Bakr, attacked the Muslims' allies, the Banu Khuza'ah — killing some even within the sacred precinct — with Quraysh secretly supplying arms. This shattered the truce. When Quraysh's own attempt to patch it up failed, the way to Makkah lay open.",
      "What happened: The Prophet ﷺ marched with about 10,000 companions, moving so swiftly and secretly that Quraysh had no time to organise resistance. Abu Sufyan, the old Quraysh commander, came out and accepted Islam on the eve of entry. The army entered Makkah from several directions with almost no fighting — only one column met brief armed resistance; the Prophet ﷺ had explicitly ordered his commanders not to fight except against those who fought them.",
      'The amnesty: This is the moment that defines the conquest. Standing at the Ka\'bah with the city that had tortured, boycotted, and expelled him now at his mercy, the Prophet ﷺ asked the Quraysh what they expected of him, then declared — echoing the words of Prophet Yusuf to the brothers who had wronged him — "No blame upon you today. Go, for you are free." A general amnesty covered the population; only a small handful were excepted for specific crimes, and even most of those were pardoned when they came to him.',
      'The purification: The Prophet ﷺ then cleansed the Ka\'bah of its 360 idols, reciting, "Truth has come and falsehood has vanished" (Qur\'an 17:81). Bilal ibn Rabah, once tortured as a slave in that very city, climbed atop the Ka\'bah and called the adhan over Makkah. Surah an-Nasr — "When the victory of Allah has come and the conquest" — marks this opening and its multitudes entering the faith.',
      "Enduring lessons: this is among the greatest demonstrations of prophetic character exercised in power. Magnanimity in victory won more hearts than any punishment could have; the goal throughout had been guidance, not revenge, and power was made to serve the message rather than the self. It is fittingly called Fath Makkah — the Opening — not a sacking.",
    ],
    battleDetails: {
      location: "Makkah",
      modernLocation: "Makkah, Saudi Arabia",
      hijriDate: "Ramadan 8 AH",
      gregorianYear: 630,
      muslimForces: "~10,000",
      opposingForces: "Quraysh (surrendered almost without fighting)",
      muslimCommander: "Prophet Muhammad ﷺ",
      outcome: "Makkah opened almost without bloodshed; a general amnesty declared",
      keyEvents: [
        "The truce broke when Quraysh backed an attack on the Muslims' allies, the Khuza'ah.",
        "Abu Sufyan accepted Islam before the army entered; his house was declared a place of safety.",
        "The Prophet ﷺ granted a general amnesty: No blame upon you today — go, you are free.",
        "The Ka'bah was cleansed of its idols; Bilal called the adhan from atop it.",
        "Former enemies embraced Islam in large numbers.",
      ],
      leadershipLesson:
        "Magnanimity in victory wins hearts far more lastingly than fear or vengeance.",
      spiritualLesson:
        "The goal was guidance, not revenge — power is made to serve the message, not the self.",
    },
    quran: [
      {
        surah: 110,
        ayahFrom: 1,
        ayahTo: 3,
        label: "Qur'an 110:1–3",
        excerpt:
          "When the victory of Allah has come and the conquest, and you see the people entering the religion of Allah in multitudes, then exalt with praise of your Lord and ask His forgiveness. Indeed, He is ever Accepting of repentance.",
      },
      {
        surah: 12,
        ayahFrom: 92,
        label: "Qur'an 12:92",
        excerpt:
          "He said: No blame upon you today. May Allah forgive you, and He is the most merciful of the merciful. — the words of Prophet Yusuf that the Prophet ﷺ echoed to the Quraysh on the day of the conquest.",
      },
    ],
    appLinks: [{ label: "Lesson: mercy after victory", route: "/battles/lessons" }],
  },
  {
    id: "hunayn",
    section: "battles",
    title: "Battle of Hunayn",
    summary: "Shawwal 8 AH — an ambush after Makkah; confidence tested, then victory granted.",
    body: [
      "Context and cause: Barely a fortnight after the opening of Makkah, the powerful tribes of Hawazin and Thaqif gathered to strike the Muslims before their new dominance could settle. The Prophet ﷺ marched out with a large army — some 12,000, including many recent Makkan converts — the largest Muslim force yet assembled. In its size, some of the men felt an unfamiliar confidence, and it is reported that someone remarked they could not be defeated for want of numbers.",
      "What happened: The enemy had laid an ambush in the narrow valley of Hunayn. As the Muslims descended in the half-light of dawn, a storm of arrows fell on them from the heights and the vanguard broke. Panic spread and much of the great army turned and fled — the numbers that had bred confidence now carried the rout.",
      'The turning point: In the chaos the Prophet ﷺ did not flee. He pressed his mule forward toward the enemy, calling aloud, "I am the Prophet, this is no lie; I am the son of Abd al-Muttalib." A core of Muhajirun and Ansar — with Abbas calling the companions back by name — rallied around him. The Muslims re-formed, turned on the ambushers, and routed them; captives and large spoils were taken.',
      "The aftermath: The campaign continued to a siege of Ta'if, which did not fall at once. Later, when the Hawazin came seeking their people, the Prophet ﷺ returned the captives — choosing reconciliation and the softening of hearts over the keeping of spoils, and generously favouring the new Makkan converts to bind them to the faith.",
      "The Qur'an addresses this day directly, naming the danger of relying on numbers: \"and on the day of Hunayn, when your great numbers pleased you but availed you nothing… then Allah sent down His tranquillity\" (9:25–26). The enduring lesson is plain — never lean on numbers, wealth, or recent success; victory is Allah's gift alone — and the twin virtue of a leader standing firm and visible when his followers panic.",
    ],
    battleDetails: {
      location: "The valley of Hunayn, between Makkah and Ta'if",
      modernLocation: "Near Ta'if, Saudi Arabia",
      hijriDate: "Shawwal 8 AH",
      gregorianYear: 630,
      muslimForces: "~12,000 (including many new Makkan converts)",
      opposingForces: "Hawazin and Thaqif",
      muslimCommander: "Prophet Muhammad ﷺ",
      outcome: "Muslim victory after an initial rout",
      keyEvents: [
        "The largest Muslim army yet bred confidence in its numbers before battle.",
        "A dawn ambush in the valley scattered the vanguard and caused a wide panic.",
        "The Prophet ﷺ stood firm and called the believers back; a core rallied around him.",
        "The Muslims re-formed and routed the enemy; a siege of Ta'if followed.",
        "The captives were later returned as a gesture of reconciliation.",
      ],
      leadershipLesson:
        "A leader must be visible and steady when followers panic — presence rallies the ranks.",
      spiritualLesson:
        "Never rely on numbers or recent success; victory and tranquillity come only from Allah.",
    },
    quran: [
      {
        surah: 9,
        ayahFrom: 25,
        ayahTo: 26,
        label: "Qur'an 9:25–26",
        excerpt:
          "Allah has already given you victory in many regions — and on the day of Hunayn, when your great numbers pleased you but availed you nothing, and the earth, for all its vastness, closed in on you, and you turned back in retreat. Then Allah sent down His tranquillity upon His Messenger and upon the believers.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "4316",
        grade: "sahih",
        excerpt:
          "Al-Bara ibn Azib was asked whether they had fled on the day of Hunayn. He said: But the Messenger of Allah ﷺ did not flee. The people turned back, and the Prophet ﷺ was on his white mule, and he was saying: I am the Prophet, this is no lie; I am the son of Abd al-Muttalib.",
      },
    ],
    appLinks: [{ label: "Lesson: humility in strength", route: "/battles/lessons" }],
  },
  {
    id: "tabuk",
    section: "battles",
    title: "Expedition of Tabuk",
    summary: "Rajab 9 AH — the hardest march, in summer heat, testing faith without a battle.",
    body: [
      'Context and cause: Reports reached Madinah of a large Byzantine mobilisation on the northern frontier. The Prophet ﷺ called for a campaign to Tabuk — and, unusually, named the destination openly rather than concealing it, because the march would be so long and so hard that everyone needed to prepare honestly. It fell in the fierce heat of high summer, at harvest time, when travel and expense were most burdensome — it became known as the "expedition of hardship."',
      "The test of sacrifice: The call laid the community's hearts bare. Uthman equipped a large part of the army from his own wealth; Abu Bakr gave everything he owned; Umar gave half his. The poorest companions who had nothing to give wept because they could not take part — the Qur'an records their tears (9:92). Against them stood the hypocrites, who invented excuses to stay behind and whom Surah at-Tawbah exposes at length.",
      "What happened: The army — the largest the Prophet ﷺ ever led, perhaps 30,000 — reached Tabuk after a grueling march. No Byzantine force appeared to give battle. Rather than an empty result, the expedition secured treaties with the frontier tribes and rulers of the north, extended the community's security, and demonstrated a readiness that itself deterred aggression.",
      "The three who stayed behind: Among those who remained were three sincere believers — Ka'b ibn Malik, Hilal ibn Umayyah, and Murarah ibn Rabi' — who had no valid excuse and, crucially, refused to lie about it. They were boycotted for fifty days, the earth \"vast as it was\" closing in on them, until their repentance was accepted and the Qur'an announced their forgiveness (9:118). Their honesty under trial is one of the most moving episodes in the seerah.",
      "Enduring lessons: readiness to defend the community is itself an act of faith even when no sword is drawn; sacrifice with no immediate, visible reward is among the highest of tests; and truthfulness — Ka'b's refusal to save himself with a lie — is dearer to Allah than a comfortable falsehood. Surah at-Tawbah frames the whole expedition around these themes.",
    ],
    battleDetails: {
      location: "Tabuk, on the road toward the Byzantine frontier",
      modernLocation: "Tabuk, Saudi Arabia",
      hijriDate: "Rajab 9 AH",
      gregorianYear: 630,
      muslimForces: "~30,000 (the largest army the Prophet ﷺ led)",
      opposingForces: "A Byzantine force was reported but did not appear for battle",
      muslimCommander: "Prophet Muhammad ﷺ",
      weather: "Extreme summer heat, at harvest time",
      outcome: "No battle; northern treaties secured; the community tested and sifted",
      keyEvents: [
        "The Prophet ﷺ named the distant destination openly because of the hardship of the march.",
        "Uthman, Abu Bakr, Umar, and others gave generously; the poorest wept at having nothing to give.",
        "Hypocrites made excuses to stay behind and were exposed in Surah at-Tawbah.",
        "No enemy engaged; treaties were secured with the northern tribes and rulers.",
        "Three truthful believers were boycotted 50 days until their repentance was accepted (Qur'an 9:118).",
      ],
      leadershipLesson:
        "Be honest about hardship and its cost; transparency builds trust and readies the willing.",
      spiritualLesson:
        "Sacrifice without visible reward, and truthfulness under trial, are among the highest tests of faith.",
    },
    quran: [
      {
        surah: 9,
        ayahFrom: 81,
        ayahTo: 82,
        label: "Qur'an 9:81–82",
        excerpt:
          "Those who remained behind rejoiced in their staying behind the Messenger of Allah and disliked to strive with their wealth and their lives in the cause of Allah, and said: Do not go forth in the heat. Say: The fire of Hell is more intense in heat, if only they could understand.",
      },
      {
        surah: 9,
        ayahFrom: 118,
        label: "Qur'an 9:118",
        excerpt:
          "And He forgave the three who were left behind, until the earth, vast as it was, closed in on them, and their own souls closed in on them, and they were certain there is no refuge from Allah except in Him. Then He turned to them in mercy that they might repent.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "4418",
        grade: "sahih",
        excerpt:
          "Ka'b ibn Malik related how he stayed behind from Tabuk without excuse and would not lie about it; the Prophet ﷺ ordered the believers not to speak to him and his two companions for fifty nights, until the earth became narrow for them — then the revelation of their forgiveness came, and it was among the happiest days of his life.",
      },
    ],
    appLinks: [{ label: "Lesson: sacrifice and sincerity", route: "/battles/lessons" }],
  },

  // ── Expeditions ───────────────────────────────────────────────────────────
  {
    id: "ghazawat-and-saraya",
    section: "expeditions",
    title: "Ghazawat and Saraya",
    summary: "The difference between major campaigns and smaller detachments.",
    body: [
      "A ghazwah is an expedition in which the Prophet ﷺ personally took part — scholars count about twenty-seven, including Badr, Uhud, the Trench, Hudaybiyyah, Khaybar, the conquest of Makkah, Hunayn, and Tabuk.",
      "A sariyyah (plural saraya) is a detachment sent under a named commander without the Prophet ﷺ joining — roughly fifty such missions are recorded, for reconnaissance, responding to raids, escorting, or inviting tribes to Islam.",
      "Many saraya involved no fighting at all — they were diplomacy, patrol, or a show of strength that made fighting unnecessary. Others, like the expedition to Mu'tah, involved serious combat and heavy loss.",
      "Understanding this distinction guards against exaggerating the number of 'battles' in early Islam. Across roughly a decade, actual pitched battles were few; most marches were preventive, diplomatic, or bloodless, and the sources measure the whole prophetic period as remarkably light in loss of life for its era.",
    ],
    actions: [
      "Browse the timeline to see which events were pitched battles, which were sieges, and which were marches with no fighting.",
      "Read the glossary entries for ghazwah and sariyyah to keep the categories clear.",
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
      "After the Prophet ﷺ passed away in 11 AH (632 CE), the community was led by the Caliphs Abu Bakr, Umar, Uthman, and Ali (may Allah be pleased with them) through the Ridda (apostasy) wars, expansion into Sasanian Persia and Byzantine Syria, and eventually internal fitna.",
      "These events belong to Islamic history, but they are not Sunnah in the way the Prophet's own actions are. They should be studied with the tools of history and with the awareness that Muslim scholars themselves debate their details, motives, and lessons.",
      "Battle of al-Qadisiyyah (c. 636 CE): Sa'd ibn Abi Waqqas led the Muslim forces against the Sasanian army in Iraq — a turning point that opened Persia.",
      "Battle of Yarmouk (636 CE): commanders including Khalid ibn al-Walid met the Byzantines in Syria in a decisive campaign that ended major Byzantine field power in the Levant — studied as military history, not as prophetic Sunnah.",
      "Battle of Nahavand (c. 642 CE): remembered in Arabic sources as the 'Victory of Victories,' it broke the remaining Sasanian resistance. Dates and troop figures vary between historians.",
    ],
    actions: [
      "Study the prophetic battles first — they are the primary moral and legal reference.",
      "Approach the later conquests with nuance; neither glorify war nor flatten a complex history into slogans.",
    ],
    disclaimer:
      "Numbers, motives, and moral evaluations of the post-prophetic conquests are debated among historians. This overview is for orientation, not polemic.",
  },

  // ── Wisdom ────────────────────────────────────────────────────────────────
  {
    id: "leadership-lessons",
    section: "wisdom",
    title: "Leadership lessons",
    summary: "Patience, shura, mercy, and trust in Allah — not mere tactics.",
    body: [
      "The prophetic model of leadership in conflict places character above cleverness. Major decisions were taken through consultation (shura) — the wells at Badr, the trench at the Confederate siege, the terms at Hudaybiyyah — even where revelation would later confirm the outcome. Leadership listened before it acted.",
      'Patience shaped the arc of every victory. The hard peace of Hudaybiyyah led, within two years, to the Opening of Makkah. Mercy at Makkah — "Go, you are free" — won over the very people who had persecuted the community. The bitter discipline learned at Uhud prevented the repeat of that disaster.',
      "Courage was shown as much off the sword as on it: standing firm and visible when the army fled at Hunayn; carrying earth in the trench alongside the diggers; and — hardest of all — forgiving in the hour of total power those who had once driven you from your home.",
      "Trust in Allah (tawakkul) never meant neglecting the means. Scouts were sent, ground was chosen, armour was worn, trenches were dug, successors were named, and treaties were honoured. The believers did everything within their power and then entrusted the result to Allah — that union of full effort and full reliance is the heart of the model.",
    ],
    actions: [
      "Before a hard decision, ask: have I truly consulted those with knowledge?",
      "After a success, ask: am I showing mercy, or has it turned to pride?",
      "In a setback, ask: is there a disobedience to correct, or a lesson Allah means for me to learn?",
    ],
    appLinks: [{ label: "Lesson cards", route: "/battles/lessons" }],
  },

  // ── Evidence ──────────────────────────────────────────────────────────────
  {
    id: "hadith-on-battles",
    section: "evidence",
    title: "Authentic hadith on battles",
    summary: "Selected narrations with grading — on conduct, patience, and key events.",
    body: [
      "Hadith about the expeditions must be checked for authenticity before being relied upon. The narrations below are drawn from the Sahih collections and concern the conduct and spirit of these campaigns; each carries its grade.",
      "For narrations tied to a specific engagement, see that battle's own topic. Use Munib's hadith browser to read full chains and grading in context.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "2966",
        grade: "sahih",
        excerpt:
          "Do not wish to meet the enemy, and ask Allah for safety. But when you meet them, be patient, and know that Paradise lies under the shade of the swords.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "3030",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ said: War is deceit. — Scholars explain this as permission for tactical stratagem in battle (feints, surprise, misdirection), never as licence to break a treaty or betray a protected party.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1731",
        grade: "sahih",
        excerpt:
          "When appointing a commander the Prophet ﷺ charged him to fear Allah, to invite the enemy to Islam before fighting, not to break a pledge, not to mutilate, and not to kill a child.",
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
      "The primary seerah sources include Ibn Ishaq's Sirah (preserved through Ibn Hisham), al-Waqidi's Kitab al-Maghazi, Ibn Sa'd's Tabaqat, and Ibn Kathir's al-Bidayah wan-Nihayah. Each has its strengths and its scholarly caveats.",
      "Ibn Ishaq (via Ibn Hisham) is the foundational narrative; al-Waqidi gives rich battle detail but some of his reports are disputed by hadith critics; Ibn Kathir synthesises history with hadith criticism and is careful with grading.",
      "The Qur'anic passages on these events are the most authoritative texts of all. For questions of conduct, law, and ethics, the sahih hadith of al-Bukhari and Muslim take precedence over unverified seerah reports.",
      "Where the historians differ — over exact army sizes, some dates, and the moral evaluation of certain post-prophetic campaigns — this module notes the uncertainty rather than inventing precision. Every hadith cited here was checked against the collections for its number and grade.",
    ],
    actions: [
      "Cross-check any battle detail against the Qur'an first, then the sahih hadith, then the seerah.",
      "For any question of fatwa or contemporary application, consult qualified scholars — this module is educational, not a ruling.",
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
