import type { ProphetsTopic } from "../types/prophets";

/**
 * Individual biography topics for all twenty-five prophets named in the Qur'an.
 * Scholar-neutral and Qur'an-grounded; details not stated explicitly in revelation
 * are phrased as broad historical context.
 */
export const PROPHETS_BIO_TOPICS: ProphetsTopic[] = [
  {
    id: "adam",
    section: "prophets",
    title: "Adam (AS)",
    summary: "The first human and the first prophet entrusted with guidance on earth.",
    body: [
      "Allah created Adam from clay, taught him the names, and honored him before the angels. His story begins human history with knowledge, responsibility, and dependence on revelation.",
      "After Adam and Hawwa slipped by eating from the forbidden tree, they turned back in sincere repentance. Allah accepted their tawbah and sent them to earth with guidance for their descendants.",
      "Adam's life teaches that human beings are dignified yet tested. Sin does not end the path of faith when repentance, humility, and obedience follow.",
    ],
    profile: {
      nation: "Early humanity",
      location: "Jannah then earth",
      era: "Beginning of human history",
      mission: "Teach tawheed and obedience to Allah to the first people.",
      challenges: ["Iblis's enmity", "Life after descent to earth", "Guiding early human family"],
      miracles: ["Creation by Allah's command without parents", "Teaching of the names"],
      majorEvents: [
        "Creation of Adam",
        "Prostration command to angels",
        "Descent to earth after repentance",
      ],
      lessons: [
        "Human honor comes with responsibility",
        "Repentance opens the door after mistakes",
        "Satan is a clear enemy",
      ],
      facts: ["Adam is the first prophet", "His story frames humanity's test in this world"],
    },
    quran: [
      { surah: 2, ayahFrom: 30, ayahTo: 39, label: "Qur'an 2:30–39" },
      { surah: 7, ayahFrom: 11, ayahTo: 27, label: "Qur'an 7:11–27" },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7510",
        grade: "sahih",
        excerpt:
          "People will go to Adam on the Day of Judgment and say: You are the father of mankind.",
      },
    ],
    appLinks: [
      { label: "Read Al-Baqarah passages", route: "/quran/2" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "idris",
    section: "prophets",
    title: "Idris (AS)",
    summary: "A truthful prophet remembered for steadfastness and elevated rank.",
    body: [
      "The Qur'an describes Idris as truthful and a prophet. This concise mention highlights character before biography: truthfulness, devotion, and reliability.",
      "Allah states that He raised Idris to a high station. The exact worldly details are not expanded in the Qur'an, so Muslims keep his account within what revelation affirms.",
      "His legacy reminds believers that even short Qur'anic mentions carry deep moral weight: sincerity and truth are pathways to closeness with Allah.",
    ],
    profile: {
      era: "Early generations after Adam",
      mission: "Call people to worship Allah with truthfulness and righteousness.",
      lessons: [
        "Truthfulness elevates a servant",
        "Not every prophet's story is detailed in the Qur'an",
        "Faithful consistency matters",
      ],
      facts: ["Named in the Qur'an as truthful and a prophet", "Raised to a high station by Allah"],
    },
    quran: [
      { surah: 19, ayahFrom: 56, ayahTo: 57, label: "Qur'an 19:56–57" },
      { surah: 21, ayahFrom: 85, ayahTo: 86, label: "Qur'an 21:85–86" },
    ],
    appLinks: [
      { label: "Read Surah Maryam", route: "/quran/19" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "nuh",
    section: "prophets",
    title: "Nuh (AS)",
    summary: "A prophet of extraordinary patience who called his people for centuries.",
    body: [
      "Nuh called his people day and night to worship Allah alone. He used public and private reminders, mercy and warning, but most rejected his message.",
      "When disbelief persisted, Allah commanded Nuh to build the ark. The flood came as judgment, while believers were saved as a sign for later generations.",
      "Nuh's account teaches long-term sabr in da'wah. Results belong to Allah; the prophet's duty is clear delivery with sincerity.",
    ],
    profile: {
      nation: "His people before the flood",
      location: "Ancient Mesopotamian region (broadly cited)",
      era: "Very early antiquity",
      mission: "Call his people to tawheed and repentance.",
      challenges: [
        "Mockery from leaders",
        "Centuries of rejection",
        "Pain over disbelieving family members",
      ],
      miracles: ["Ark built by divine command", "Salvation of believers through the flood"],
      majorEvents: [
        "Long call to tawheed",
        "Construction of the ark",
        "Flood and new beginning for believers",
      ],
      lessons: [
        "Persistence in da'wah",
        "Family ties do not replace faith",
        "Allah saves the sincere",
      ],
      facts: ["One of the great messengers of resolve", "His story appears across several surahs"],
    },
    quran: [
      { surah: 11, ayahFrom: 25, ayahTo: 49, label: "Qur'an 11:25–49" },
      { surah: 71, ayahFrom: 1, ayahTo: 28, label: "Qur'an 71:1–28" },
    ],
    appLinks: [
      { label: "Read Surah Nuh", route: "/quran/71" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "hud",
    section: "prophets",
    title: "Hud (AS)",
    summary: "Sent to 'Ad, a mighty people who became arrogant and rejected guidance.",
    body: [
      "Hud was sent to the people of 'Ad, known for strength and grand structures. He called them to worship Allah alone and abandon pride and oppression.",
      "The leaders mocked him and demanded punishment if he was truthful. Hud warned that power and civilization cannot protect a people who deny Allah's signs.",
      "A devastating wind destroyed the rejecters while Hud and believers were saved. His story warns against arrogance rooted in worldly success.",
    ],
    profile: {
      nation: "People of 'Ad",
      location: "Al-Ahqaf region (southern Arabian area in classical tafsir)",
      era: "After Nuh",
      mission: "Restore tawheed and justice among 'Ad.",
      challenges: [
        "Collective arrogance",
        "Mockery of revelation",
        "Demand for immediate punishment",
      ],
      miracles: ["Protection of believers during punishment"],
      majorEvents: ["Call to repentance", "Warning of severe wind", "Destruction of 'Ad"],
      lessons: [
        "Strength without humility leads to ruin",
        "Nations are accountable",
        "Prophetic warnings are mercy before judgment",
      ],
      facts: ["His story appears repeatedly as a warning to later communities"],
    },
    quran: [
      { surah: 7, ayahFrom: 65, ayahTo: 72, label: "Qur'an 7:65–72" },
      { surah: 46, ayahFrom: 21, ayahTo: 26, label: "Qur'an 46:21–26" },
    ],
    appLinks: [
      { label: "Read Surah Al-Ahqaf", route: "/quran/46" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "salih",
    section: "prophets",
    title: "Salih (AS)",
    summary: "Sent to Thamud, who were tested by the sign of the she-camel.",
    body: [
      "Salih called Thamud to worship Allah and leave corruption. They asked for a clear sign, and Allah gave them the she-camel as a visible test.",
      "Salih instructed them not to harm the she-camel and to let it drink on its allotted day. Instead, they hamstrung it in rebellion and planned further harm.",
      "A sudden punishment overtook the rejecters, while Salih and the believers were saved. His story shows that signs increase responsibility, not excuses.",
    ],
    profile: {
      nation: "People of Thamud",
      location: "Al-Hijr / northwestern Arabia",
      era: "After 'Ad",
      mission: "Call Thamud from idolatry to tawheed.",
      challenges: [
        "Demand for miracle then rejection",
        "Open defiance after clear sign",
        "Threats against believers",
      ],
      miracles: ["The she-camel as a sign from Allah"],
      majorEvents: [
        "Appearance of the she-camel",
        "Killing of the she-camel",
        "Destruction of rejecters",
      ],
      lessons: [
        "Miracles do not benefit stubborn hearts",
        "Breaking divine limits has consequences",
        "Believers are rescued by Allah",
      ],
      facts: ["Thamud were known for carving homes into mountains"],
    },
    quran: [
      { surah: 7, ayahFrom: 73, ayahTo: 79, label: "Qur'an 7:73–79" },
      { surah: 91, ayahFrom: 11, ayahTo: 15, label: "Qur'an 91:11–15" },
    ],
    appLinks: [
      { label: "Read Surah Ash-Shams", route: "/quran/91" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "ibrahim",
    section: "prophets",
    title: "Ibrahim (AS)",
    summary: "Khalilullah, model of pure tawheed and leadership in submission.",
    body: [
      "Ibrahim challenged idol worship with reason, courage, and trust in Allah. He broke false gods to expose their powerlessness and invited his people to worship the Creator.",
      "He faced severe trials: rejection by family and society, being cast into fire, migration for faith, and the command concerning sacrifice. In every test, he responded with surrender.",
      "Allah made Ibrahim an imam for humanity and connected his legacy to Makkah and the Ka'bah. His story anchors Muslim identity in tawheed and obedience.",
    ],
    profile: {
      nation: "Mesopotamian and Levant communities",
      location: "Iraq, Levant, and Makkah",
      era: "Middle antiquity",
      mission: "Revive tawheed and establish a legacy of submission.",
      challenges: [
        "Conflict with idolaters and rulers",
        "Migration away from homeland",
        "Family trials tied to prophetic mission",
      ],
      miracles: ["Fire made cool and safe by Allah", "Gift of righteous offspring in old age"],
      majorEvents: [
        "Debate with idolaters",
        "Migration for Allah",
        "Building the Ka'bah with Ismail",
      ],
      lessons: [
        "Tawakkul in severe tests",
        "Leadership requires sacrifice",
        "Faith can reshape generations",
      ],
      facts: ["Known as Khalilullah (friend of Allah)", "Forefather of many prophets"],
    },
    quran: [
      { surah: 2, ayahFrom: 124, ayahTo: 129, label: "Qur'an 2:124–129" },
      { surah: 21, ayahFrom: 51, ayahTo: 70, label: "Qur'an 21:51–70" },
    ],
    appLinks: [
      { label: "Read Surah Al-Baqarah", route: "/quran/2" },
      { label: "Learn from Seerah", route: "/seerah" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "lut",
    section: "prophets",
    title: "Lut (AS)",
    summary: "A prophet who warned his people against grave immorality and corruption.",
    body: [
      "Lut called his people to purity, faith, and moral limits set by Allah. Their society normalized acts of indecency and mocked the call to reform.",
      "He persevered despite social pressure and threats. Even within his household, not everyone accepted faith, showing that guidance is ultimately from Allah.",
      "When the decree came, believers were saved and the corrupt cities were overturned. Lut's story is a warning against public normalization of major sin.",
    ],
    profile: {
      nation: "People of Sodom and nearby towns",
      location: "Region of the Dead Sea (broadly cited)",
      era: "Time of Ibrahim",
      mission: "Call people from indecency and disbelief to tawheed.",
      challenges: ["Hostile public immorality", "Mockery and threats", "Family disbelief"],
      majorEvents: ["Persistent warnings", "Visit of angels", "Punishment of the towns"],
      lessons: [
        "Moral truth does not change by social approval",
        "Believers may be few",
        "Allah rescues the sincere",
      ],
      facts: ["Nephew or contemporary relative to Ibrahim in classical reports"],
    },
    quran: [
      { surah: 26, ayahFrom: 160, ayahTo: 175, label: "Qur'an 26:160–175" },
      { surah: 11, ayahFrom: 77, ayahTo: 83, label: "Qur'an 11:77–83" },
    ],
    appLinks: [
      { label: "Read Surah Ash-Shu'ara", route: "/quran/26" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "ismail",
    section: "prophets",
    title: "Ismail (AS)",
    summary: "A prophet of truth and patience, linked to Makkah and the Ka'bah.",
    body: [
      "Ismail grew in the sacred valley where Ibrahim left him and his mother by Allah's command. His life is tied to trust in Allah and the beginnings of Makkah's sacred history.",
      "The Qur'an describes him as true to his promise and steadfast in prayer and zakah. He worked with Ibrahim to raise the foundations of the Ka'bah in devotion.",
      "His biography teaches reliability, worship, and family cooperation in serving Allah. Through him, the Arabian prophetic line leads to Muhammad ﷺ.",
    ],
    profile: {
      nation: "Early Arabs in Makkah region",
      location: "Makkah",
      era: "After Ibrahim's migration",
      mission: "Teach tawheed and worship among his people.",
      challenges: [
        "Harsh valley beginnings",
        "Responsibility of sacred lineage",
        "Maintaining worship-centered life",
      ],
      majorEvents: ["Life in Makkah", "Building the Ka'bah with Ibrahim"],
      lessons: [
        "Honor your promises",
        "Family can cooperate in worship",
        "Sacred legacy requires character",
      ],
      facts: ["Forefather of Arab tribes and final prophetic lineage"],
    },
    quran: [
      { surah: 19, ayahFrom: 54, ayahTo: 55, label: "Qur'an 19:54–55" },
      { surah: 2, ayahFrom: 127, ayahTo: 129, label: "Qur'an 2:127–129" },
    ],
    appLinks: [
      { label: "Read Surah Maryam", route: "/quran/19" },
      { label: "Learn from Seerah", route: "/seerah" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "ishaq",
    section: "prophets",
    title: "Ishaq (AS)",
    summary: "A blessed prophet from Ibrahim's family and father of Ya'qub.",
    body: [
      "Ishaq was granted to Ibrahim and Sarah as glad tidings in old age. His birth represented Allah's power and mercy beyond ordinary expectations.",
      "The Qur'an names him among righteous prophets and links him to a lineage of revelation. Through Ishaq came Ya'qub and many prophets among Bani Isra'il.",
      "His account emphasizes gratitude for divine gifts and continuity of guidance across generations.",
    ],
    profile: {
      nation: "Levant communities",
      location: "Levant (Sham)",
      era: "After Ibrahim",
      mission: "Continue prophetic guidance in Ibrahim's family line.",
      miracles: ["Birth announced in old age"],
      majorEvents: ["Glad tidings to Ibrahim", "Continuation of prophetic lineage through Ya'qub"],
      lessons: [
        "Allah grants beyond human expectation",
        "Lineage is a trust of faith",
        "Righteous succession matters",
      ],
      facts: ["Father of Ya'qub", "Mentioned with Ibrahim and Ya'qub as chosen family"],
    },
    quran: [
      { surah: 11, ayahFrom: 71, ayahTo: 73, label: "Qur'an 11:71–73" },
      { surah: 38, ayahFrom: 45, ayahTo: 47, label: "Qur'an 38:45–47" },
    ],
    appLinks: [
      { label: "Read Surah Hud", route: "/quran/11" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "yaqub",
    section: "prophets",
    title: "Ya'qub (AS)",
    summary: "Also called Isra'il, a prophet known for patient trust in Allah.",
    body: [
      "Ya'qub guided his children with firm belief and concern for their faith. His fatherly care appears vividly in the story surrounding Yusuf.",
      "During years of separation from Yusuf, Ya'qub endured deep grief while refusing despair. He repeatedly turned to Allah and kept hope alive.",
      "His life models sabr jamil, beautiful patience anchored in certainty that Allah's wisdom unfolds in time.",
    ],
    profile: {
      nation: "Bani Isra'il origins",
      location: "Levant and Egypt-related migration context",
      era: "Generation of Yusuf",
      mission: "Guide his household and people in tawheed.",
      challenges: [
        "Family tensions among sons",
        "Long separation from Yusuf",
        "Emotional hardship with perseverance",
      ],
      majorEvents: ["Counsel to sons", "Years of patience", "Reunion with Yusuf in Egypt"],
      lessons: [
        "Beautiful patience is active faith",
        "Parents shape faith legacy",
        "Never despair of Allah's mercy",
      ],
      facts: ["Also called Isra'il", "Father of Yusuf and his brothers"],
    },
    quran: [
      { surah: 12, ayahFrom: 83, ayahTo: 87, label: "Qur'an 12:83–87" },
      { surah: 2, ayahFrom: 132, ayahTo: 133, label: "Qur'an 2:132–133" },
    ],
    appLinks: [
      { label: "Read Surah Yusuf", route: "/quran/12" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "yusuf",
    section: "prophets",
    title: "Yusuf (AS)",
    summary: "A prophet whose story teaches purity, forgiveness, and trust through trials.",
    body: [
      "Yusuf was betrayed by his brothers, sold into slavery, and later imprisoned despite innocence. Through each stage he guarded faith, dignity, and moral integrity.",
      "Allah transformed hardship into leadership when Yusuf interpreted visions and was entrusted with authority in Egypt. His wisdom served society during famine.",
      "At reunion, Yusuf forgave those who wronged him and attributed success to Allah. His story shows that patience and taqwa can turn harm into healing.",
    ],
    profile: {
      nation: "Bani Isra'il family line in Egypt context",
      location: "Egypt",
      era: "Before Musa",
      mission: "Uphold tawheed and justice while serving society.",
      challenges: ["Sibling betrayal", "Temptation and slander", "Imprisonment despite innocence"],
      miracles: ["Gift of true dream interpretation"],
      majorEvents: ["Well and separation", "Prison years", "Rise to authority and family reunion"],
      lessons: [
        "Chastity and integrity protect faith",
        "Forgiveness heals families",
        "Allah's plan surpasses human plots",
      ],
      facts: ["Entire Surah Yusuf centers his narrative"],
    },
    quran: [{ surah: 12, ayahFrom: 1, ayahTo: 111, label: "Qur'an 12:1–111" }],
    appLinks: [
      { label: "Read Surah Yusuf", route: "/quran/12" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "shuayb",
    section: "prophets",
    title: "Shu'ayb (AS)",
    summary: "A prophet who warned against fraud, injustice, and economic corruption.",
    body: [
      "Shu'ayb was sent to Madyan and nearby communities known for cheating in trade and abusing measures. He linked worship of Allah to honesty in public dealings.",
      "His people resisted moral reform and accused him of weakness. Shu'ayb kept calling them with compassion and clear reminders of accountability.",
      "When rejection persisted, punishment came while believers were saved. His biography shows that economic ethics are part of faith, not separate from it.",
    ],
    profile: {
      nation: "Madyan",
      location: "Northwestern Arabian / Levant trade region",
      era: "After Ibrahim's generations",
      mission: "Call to tawheed and fairness in trade.",
      challenges: ["Entrenched market corruption", "Mockery from elites", "Threat of expulsion"],
      majorEvents: ["Call to fair measures", "Public opposition", "Punishment of rejecters"],
      lessons: [
        "Faith demands commercial honesty",
        "Public injustice invites judgment",
        "Prophets address social ethics",
      ],
      facts: ["Known for emphasis on weights and measures"],
    },
    quran: [
      { surah: 7, ayahFrom: 85, ayahTo: 93, label: "Qur'an 7:85–93" },
      { surah: 11, ayahFrom: 84, ayahTo: 95, label: "Qur'an 11:84–95" },
    ],
    appLinks: [
      { label: "Read Surah Hud", route: "/quran/11" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "ayyub",
    section: "prophets",
    title: "Ayyub (AS)",
    summary: "A model of patience in prolonged hardship and unwavering devotion.",
    body: [
      "Ayyub endured severe personal trials affecting health, wealth, and family conditions. Despite this, he remained steadfast and remembered Allah.",
      "His supplication in the Qur'an is brief and humble: he states his suffering and affirms Allah as Most Merciful. This adab in du'a reflects deep trust.",
      "Allah removed his hardship and restored blessing. Ayyub's story teaches endurance without complaint against divine decree.",
    ],
    profile: {
      era: "Post-Ibrahimic prophetic era (broad context)",
      mission: "Guide his people in worship and patience.",
      challenges: [
        "Long illness and hardship",
        "Loss of worldly comfort",
        "Endurance under prolonged test",
      ],
      miracles: ["Healing by Allah's command", "Restoration after trial"],
      majorEvents: ["Supplication in hardship", "Divine relief and restoration"],
      lessons: [
        "Patience is active worship",
        "Du'a with humility is powerful",
        "Trials can elevate rank",
      ],
      facts: ["Frequently cited as a model of sabr"],
    },
    quran: [
      { surah: 21, ayahFrom: 83, ayahTo: 84, label: "Qur'an 21:83–84" },
      { surah: 38, ayahFrom: 41, ayahTo: 44, label: "Qur'an 38:41–44" },
    ],
    appLinks: [
      { label: "Read Surah Al-Anbiya", route: "/quran/21" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "dhul-kifl",
    section: "prophets",
    title: "Dhul-Kifl (AS)",
    summary: "A righteous prophet remembered for patience and steadfast responsibility.",
    body: [
      "Dhul-Kifl is mentioned in the Qur'an among the patient and righteous. While fewer details are provided, his inclusion carries clear praise from Allah.",
      "Classical scholarship differs on biographical specifics, so a cautious approach keeps focus on what revelation confirms: perseverance and reliability in duty.",
      "His memory teaches that hidden consistency and faithful service are beloved to Allah even without extensive narrative detail.",
    ],
    profile: {
      era: "Later pre-Isa prophetic periods (broadly placed)",
      mission: "Call to obedience and righteousness.",
      lessons: [
        "Patience defines prophetic character",
        "Limited details still carry strong guidance",
        "Reliability in duty matters",
      ],
      facts: [
        "Named with Ismail and Idris among the patient",
        "Counted among prophets in mainstream Muslim lists",
      ],
    },
    quran: [
      { surah: 21, ayahFrom: 85, ayahTo: 86, label: "Qur'an 21:85–86" },
      { surah: 38, ayahFrom: 48, ayahTo: 48, label: "Qur'an 38:48" },
    ],
    appLinks: [
      { label: "Read Surah Al-Anbiya", route: "/quran/21" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "musa",
    section: "prophets",
    title: "Musa (AS)",
    summary: "A major messenger to Bani Isra'il, confronting Pharaoh with clear signs.",
    body: [
      "Musa's story is the most repeated prophetic narrative in the Qur'an. Allah chose him, spoke to him, and sent him with Harun to Pharaoh's tyranny.",
      "He led Bani Isra'il out of oppression through Allah's signs, including the parted sea. After rescue came further tests of gratitude, law, and discipline.",
      "Musa's life combines courage against injustice with patient leadership over a difficult community. His mission highlights law, liberation, and covenant.",
    ],
    profile: {
      nation: "Bani Isra'il (and call to Pharaoh's people)",
      location: "Egypt and Sinai",
      era: "Before Dawud and Sulayman",
      mission: "Call to tawheed, confront oppression, deliver revelation.",
      challenges: [
        "Confronting Pharaoh",
        "Managing Bani Isra'il's resistance",
        "Sustained leadership under pressure",
      ],
      miracles: [
        "Staff turning into a sign",
        "Split sea by Allah's command",
        "Many signs against Pharaoh",
      ],
      majorEvents: [
        "Call at Mount Tur",
        "Confrontation with Pharaoh",
        "Exodus and revelation of Torah",
      ],
      lessons: [
        "Stand against tyranny",
        "Leadership requires patience",
        "Freedom must be joined to obedience",
      ],
      facts: ["One of the greatest messengers (ulul-'azm)"],
    },
    quran: [
      { surah: 20, ayahFrom: 9, ayahTo: 98, label: "Qur'an 20:9–98" },
      { surah: 28, ayahFrom: 3, ayahTo: 46, label: "Qur'an 28:3–46" },
    ],
    appLinks: [
      { label: "Read Surah Taha", route: "/quran/20" },
      { label: "Read Surah Al-Qasas", route: "/quran/28" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "harun",
    section: "prophets",
    title: "Harun (AS)",
    summary: "Brother and supporting prophet to Musa in the mission to Pharaoh.",
    body: [
      "Harun was appointed as Musa's helper due to his eloquence and strength in communication. Together they delivered Allah's message to Pharaoh.",
      "He supported guidance among Bani Isra'il and tried to restrain them when they deviated toward calf worship during Musa's absence.",
      "His biography highlights teamwork in prophetic service and the responsibility to preserve unity and truth under community pressure.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Egypt and Sinai",
      era: "Era of Musa",
      mission: "Support Musa in calling to tawheed and guiding Bani Isra'il.",
      challenges: [
        "Confronting Pharaoh's regime",
        "Managing community turmoil",
        "Preventing greater division",
      ],
      majorEvents: [
        "Appointment as minister to Musa",
        "Mission before Pharaoh",
        "Trial of calf worship",
      ],
      lessons: [
        "Teamwork serves da'wah",
        "Leadership sometimes means damage control",
        "Maintain unity without compromising truth",
      ],
      facts: ["Older brother of Musa"],
    },
    quran: [
      { surah: 20, ayahFrom: 29, ayahTo: 36, label: "Qur'an 20:29–36" },
      { surah: 7, ayahFrom: 142, ayahTo: 151, label: "Qur'an 7:142–151" },
    ],
    appLinks: [
      { label: "Read Surah Taha", route: "/quran/20" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "dawud",
    section: "prophets",
    title: "Dawud (AS)",
    summary: "Prophet-king granted wisdom, justice, and the Zabur.",
    body: [
      "Allah granted Dawud kingship, wisdom, and scripture. He combined governance with deep worship and repentance, making him a model of balanced leadership.",
      "The Qur'an presents episodes highlighting judgment, humility, and immediate return to Allah when corrected. His strength did not remove accountability.",
      "Dawud's life teaches that political authority is a trust. Justice, remembrance, and moral vigilance sustain leadership.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Jerusalem region",
      era: "Before Sulayman's rule",
      mission: "Lead with justice and call to Allah.",
      challenges: [
        "Judicial responsibility",
        "Balancing power and humility",
        "Public leadership accountability",
      ],
      miracles: [
        "Mountains and birds glorified with him",
        "Softened iron for him by Allah's permission",
      ],
      majorEvents: [
        "Defeat of Jalut in youth",
        "Kingship and revelation",
        "Legacy passed to Sulayman",
      ],
      lessons: [
        "Justice is central to prophetic rule",
        "Repent quickly after mistakes",
        "Worship strengthens leadership",
      ],
      facts: ["Recipient of Zabur (Psalms)"],
    },
    quran: [
      { surah: 38, ayahFrom: 17, ayahTo: 26, label: "Qur'an 38:17–26" },
      { surah: 21, ayahFrom: 78, ayahTo: 80, label: "Qur'an 21:78–80" },
    ],
    appLinks: [
      { label: "Read Surah Sad", route: "/quran/38" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "sulayman",
    section: "prophets",
    title: "Sulayman (AS)",
    summary: "A prophet-king given extraordinary authority yet grounded in gratitude.",
    body: [
      "Sulayman inherited leadership from Dawud and asked Allah for a unique kingdom. He was granted remarkable means, including control over winds and service of jinn by Allah's permission.",
      "Despite vast authority, Sulayman constantly attributed success to Allah. His interactions with the Queen of Sheba show wisdom, diplomacy, and invitation to faith.",
      "His biography teaches that power should produce shukr, justice, and da'wah, not pride.",
    ],
    profile: {
      nation: "Bani Isra'il and surrounding kingdoms",
      location: "Jerusalem and wider region",
      era: "After Dawud",
      mission: "Rule justly and call nations to worship Allah.",
      challenges: [
        "Managing vast kingdom",
        "Maintaining gratitude amid power",
        "Directing diverse forces responsibly",
      ],
      miracles: [
        "Control of wind by Allah's leave",
        "Jinn service and construction",
        "Understanding speech of birds/ants",
      ],
      majorEvents: [
        "Inherited Dawud's mission",
        "Correspondence with Queen of Sheba",
        "Model kingdom of gratitude",
      ],
      lessons: [
        "Power is a test",
        "Gratitude protects from arrogance",
        "Wisdom and invitation can transform rulers",
      ],
      facts: ["Among most detailed prophet-kings in Qur'anic narrative"],
    },
    quran: [
      { surah: 27, ayahFrom: 15, ayahTo: 44, label: "Qur'an 27:15–44" },
      { surah: 34, ayahFrom: 12, ayahTo: 14, label: "Qur'an 34:12–14" },
    ],
    appLinks: [
      { label: "Read Surah An-Naml", route: "/quran/27" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "ilyas",
    section: "prophets",
    title: "Ilyas (AS)",
    summary: "A prophet who confronted idolatry and called his people back to Allah.",
    body: [
      "Ilyas addressed a community that had turned toward idol worship, including veneration of Ba'l. He called them to fear Allah and abandon false gods.",
      "The Qur'an summarizes his mission with a pattern common to prophets: clear invitation, rejection by many, and honor for sincere believers.",
      "His story highlights that reform often begins by restoring pure worship before social renewal can endure.",
    ],
    profile: {
      nation: "A community among Bani Isra'il",
      location: "Levant region",
      era: "Later Israelite prophetic periods",
      mission: "Call his people from idolatry to tawheed.",
      challenges: ["Entrenched idol practices", "Resistance from leadership circles"],
      majorEvents: ["Public call against Ba'l worship", "Preservation of believing followers"],
      lessons: [
        "Tawheed is foundation of reform",
        "Small faithful groups still matter",
        "Prophets speak against popular error",
      ],
      facts: ["Named among righteous prophets"],
    },
    quran: [
      { surah: 37, ayahFrom: 123, ayahTo: 132, label: "Qur'an 37:123–132" },
      { surah: 6, ayahFrom: 85, ayahTo: 85, label: "Qur'an 6:85" },
    ],
    appLinks: [
      { label: "Read Surah As-Saffat", route: "/quran/37" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "al-yasa",
    section: "prophets",
    title: "Al-Yasa' (AS)",
    summary: "A righteous prophet in the Israelite line, mentioned with honor.",
    body: [
      "Al-Yasa' is mentioned in the Qur'an among chosen and righteous prophets. The text emphasizes his rank rather than an extended narrative.",
      "Because detailed chronology is limited in revelation, Muslims affirm what is certain: he was a prophet who upheld guidance among his people.",
      "His mention reminds us that Allah's mercy sent many messengers, not only those with long stories, and each carried the same call to worship Allah alone.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Levant region",
      era: "Later Israelite prophetic periods",
      mission: "Continue prophetic guidance among his people.",
      lessons: [
        "Honor all prophets equally in belief",
        "Brief Qur'anic mentions still convey guidance",
        "Righteous continuity preserves faith communities",
      ],
      facts: ["Named directly in the Qur'an as among the excellent/chosen"],
    },
    quran: [
      { surah: 6, ayahFrom: 86, ayahTo: 86, label: "Qur'an 6:86" },
      { surah: 38, ayahFrom: 48, ayahTo: 48, label: "Qur'an 38:48" },
    ],
    appLinks: [
      { label: "Read Surah Al-An'am", route: "/quran/6" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "yunus",
    section: "prophets",
    title: "Yunus (AS)",
    summary: "A prophet whose repentance and return became a timeless lesson.",
    body: [
      "Yunus left his people before receiving final divine permission, then was swallowed by a great fish in the darkness of sea and night. In that moment he made a famous repentance.",
      "His supplication, affirming Allah's perfection and confessing his own wrong, is preserved in the Qur'an as a model for believers in distress.",
      "Allah rescued Yunus and his people later believed, making his story one of accountability, mercy, and renewed mission.",
    ],
    profile: {
      nation: "People of Nineveh (commonly cited)",
      location: "Mesopotamian region",
      era: "Pre-Isa prophetic period",
      mission: "Call his people to tawheed and repentance.",
      challenges: [
        "Emotional strain in da'wah",
        "Personal trial in the sea",
        "Returning to mission after correction",
      ],
      miracles: ["Rescue from the fish", "Restoration and renewed acceptance"],
      majorEvents: [
        "Departure and sea trial",
        "Supplication in darkness",
        "Return and belief of people",
      ],
      lessons: [
        "Never despair from Allah's mercy",
        "Repentance restores mission",
        "Du'a in hardship is transformative",
      ],
      facts: ["Also called Dhun-Nun in Qur'anic language"],
    },
    quran: [
      { surah: 21, ayahFrom: 87, ayahTo: 88, label: "Qur'an 21:87–88" },
      { surah: 10, ayahFrom: 98, ayahTo: 98, label: "Qur'an 10:98" },
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "3505",
        grade: "sahih",
        excerpt:
          "The supplication of Dhun-Nun: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin.",
      },
    ],
    appLinks: [
      { label: "Read Surah Al-Anbiya", route: "/quran/21" },
      { label: "Read Surah Yunus", route: "/quran/10" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "zakariyya",
    section: "prophets",
    title: "Zakariyya (AS)",
    summary: "A devoted prophet who prayed for righteous offspring in old age.",
    body: [
      "Zakariyya served with devotion and cared for Maryam's sanctuary, witnessing Allah's blessings upon her. This deepened his hope in Allah's ability to grant what seems impossible.",
      "Though elderly, he asked for an heir who would continue prophetic service and preserve guidance. Allah answered with glad tidings of Yahya.",
      "His life teaches believers to keep making du'a, especially for righteous family legacy and continuity of faith.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Jerusalem region",
      era: "Before Isa",
      mission: "Guide his people and preserve prophetic worship.",
      challenges: [
        "Old age without child",
        "Concern for faith succession",
        "Maintaining worship under social strain",
      ],
      miracles: ["Glad tidings of Yahya in old age", "Sign regarding temporary silence"],
      majorEvents: ["Supplication for an heir", "Acceptance of du'a", "Birth of Yahya"],
      lessons: [
        "Never lose hope in du'a",
        "Ask for righteous lineage",
        "Service in worship spaces is honorable",
      ],
      facts: ["Closely linked to story of Maryam and Yahya"],
    },
    quran: [
      { surah: 3, ayahFrom: 37, ayahTo: 41, label: "Qur'an 3:37–41" },
      { surah: 19, ayahFrom: 2, ayahTo: 11, label: "Qur'an 19:2–11" },
    ],
    appLinks: [
      { label: "Read Surah Aal 'Imran", route: "/quran/3" },
      { label: "Read Surah Maryam", route: "/quran/19" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "yahya",
    section: "prophets",
    title: "Yahya (AS)",
    summary: "A pure and wise prophet granted righteousness from youth.",
    body: [
      "Yahya was given wisdom while still young and described with exceptional purity, compassion, and dutifulness to his parents. His life reflects early spiritual maturity.",
      "He called people to obedience and moral reform with sincerity. The Qur'an remembers him as chaste and devout, among the righteous.",
      "Yahya's biography reminds youth and adults alike that nearness to Allah is not delayed by age when sincerity and discipline are present.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Levant region",
      era: "Contemporary with Zakariyya and near era of Isa",
      mission: "Call to righteousness and prepare hearts for guidance.",
      challenges: [
        "Public reform in morally strained environment",
        "Upholding purity and principle",
      ],
      majorEvents: [
        "Birth as answered du'a",
        "Given wisdom in youth",
        "Recognized for purity and devotion",
      ],
      lessons: [
        "Youth can lead in righteousness",
        "Purity of heart is strength",
        "Family piety shapes generations",
      ],
      facts: ["Named by Allah before birth in Zakariyya's glad tidings"],
    },
    quran: [
      { surah: 19, ayahFrom: 12, ayahTo: 15, label: "Qur'an 19:12–15" },
      { surah: 3, ayahFrom: 39, ayahTo: 39, label: "Qur'an 3:39" },
    ],
    appLinks: [
      { label: "Read Surah Maryam", route: "/quran/19" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "isa",
    section: "prophets",
    title: "Isa ibn Maryam (AS)",
    summary: "A mighty messenger born miraculously, calling to Allah with clear signs.",
    body: [
      "Isa was born to Maryam without a father by Allah's command, a sign of divine power. He spoke in infancy and defended his mother by Allah's permission.",
      "He confirmed prior revelation, called Bani Isra'il to worship Allah, and was supported with miracles by Allah's leave. His message centered on sincerity and obedience.",
      "The Qur'an teaches that Isa was neither killed nor crucified as final defeat; rather Allah raised him. He is honored as prophet and messenger, not divine.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Levant",
      era: "1st century CE",
      mission: "Renew tawheed, confirm Torah, and call to righteousness.",
      challenges: [
        "Opposition and plotting by rejecters",
        "Misrepresentation of his status after him",
        "Defense of pure monotheism",
      ],
      miracles: ["Virgin birth", "Speech in cradle", "Healing and reviving by Allah's permission"],
      majorEvents: ["Miraculous birth", "Public call with signs", "Raised by Allah"],
      lessons: [
        "Allah's power transcends causes",
        "Prophets are servants of Allah",
        "Truth must be protected from exaggeration",
      ],
      facts: ["Given Injil", "Will return before the Last Day in Sunni belief"],
    },
    quran: [
      { surah: 3, ayahFrom: 45, ayahTo: 55, label: "Qur'an 3:45–55" },
      { surah: 4, ayahFrom: 157, ayahTo: 159, label: "Qur'an 4:157–159" },
    ],
    appLinks: [
      { label: "Read Surah Aal 'Imran", route: "/quran/3" },
      { label: "Read Surah An-Nisa", route: "/quran/4" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "muhammad",
    section: "prophets",
    title: "Muhammad ﷺ",
    summary: "The final messenger sent as mercy to all worlds and seal of prophethood.",
    body: [
      "Muhammad ﷺ was sent to all humanity with the Qur'an, confirming earlier prophetic truth and completing divine guidance. His mission unified belief, worship, ethics, and law.",
      "He endured persecution in Makkah, migration to Madinah, and years of sacrifice to establish a faithful community rooted in tawheed, justice, and mercy.",
      "As the seal of the prophets, no prophet comes after him. Loving and following his Sunnah is central to Muslim life and spiritual growth.",
    ],
    profile: {
      nation: "All humanity",
      location: "Makkah and Madinah",
      era: "7th century CE",
      mission: "Convey final revelation and complete prophetic message for all peoples.",
      challenges: [
        "Persecution and boycott",
        "Conflict and state-building",
        "Conveying universal message across tribes and nations",
      ],
      miracles: [
        "Qur'an as enduring miracle",
        "Isra and Mi'raj",
        "Many signs by Allah's permission",
      ],
      majorEvents: [
        "Beginning of revelation",
        "Hijrah to Madinah",
        "Completion of message in final sermon era",
      ],
      lessons: [
        "Mercy and character in leadership",
        "Steadfastness under pressure",
        "Follow revelation and Sunnah holistically",
      ],
      facts: ["Seal of the prophets", "Best example (uswah hasanah) for believers"],
    },
    quran: [
      { surah: 33, ayahFrom: 40, ayahTo: 40, label: "Qur'an 33:40" },
      { surah: 21, ayahFrom: 107, ayahTo: 107, label: "Qur'an 21:107" },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2286",
        grade: "sahih",
        excerpt:
          "The example of me and the prophets before me is that of a building completed except for one brick; I am that brick and I am the seal of the prophets.",
      },
    ],
    appLinks: [
      { label: "Learn from Seerah", route: "/seerah" },
      { label: "Read Surah Al-Ahzab", route: "/quran/33" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
];
