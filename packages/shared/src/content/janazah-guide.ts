import type { LearnGuideTopic } from "../types/learn-guide";

/**



 * Practical Janazah (funeral) guide. Scholar-neutral, mainstream Sunni teaching



 * drawn from the Qur'an and authentic hadith (sunnah.com numbering). Funeral



 * duas are linked by bundled Hisnul Muslim ids (`duaId`) — never invented.



 * Hisnul entries ship in masculine form; the guide explains how to adapt



 * pronouns for women and girls (same prophetic wording, grammatical gender).



 * Washing, shrouding, and burial details differ by madhhab; notes flag that.



 * Bump the version when content changes.



 */

export const JANAZAH_GUIDE_CONTENT_VERSION = 2;

export const JANAZAH_GUIDE_SECTION_ORDER = [
  "obligation",

  "prepare",

  "salah",

  "burial",

  "duas",

  "reminders",
] as const;

export const JANAZAH_GUIDE_TOPICS: LearnGuideTopic[] = [
  {
    id: "fard-kifayah",

    section: "obligation",

    title: "A communal obligation",

    summary: "Janazah is fard kifayah — the community must fulfill it.",

    body: [
      "The funeral prayer (Salat al-Janazah) is a communal obligation (fard kifayah): if some of the community perform it, the duty is lifted from the rest; if none do, all share the blame. It is prayed standing, without ruku or sujud — a distinctive form among the prayers.",

      "Abu Hurayrah reported that the Messenger of Allah ﷺ said: 'Whoever attends the funeral until the prayer is offered will have a qirat (of reward), and whoever attends until the burial will have two qirats.' He was asked what a qirat was, and he said: 'Like two great mountains' (Sahih al-Bukhari 1325; Sahih Muslim 945).",

      "Following the funeral, helping with washing and burial according to one's capacity, and making dua for the deceased are among the rights of a Muslim over another. Treat the body with dignity and avoid extravagance or practices without evidence.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1325",

        grade: "sahih",

        excerpt:
          "Whoever attends the funeral until he offers the funeral prayer will have one qirat, and whoever attends until burial will have two qirats — each like a great mountain.",
      },

      {
        collection: "Sahih Muslim",

        citation: "945",

        grade: "sahih",

        excerpt:
          "Whoever follows the funeral of a Muslim out of faith and seeking reward, and stays until the prayer is offered and the burial is finished, will return with two qirats...",
      },
    ],

    actions: [
      "Respond quickly when a funeral is announced in your community.",

      "Intend the prayer and attendance for Allah's sake, not social display.",

      "Help with practical needs of the family when you can do so respectfully.",
    ],

    appLinks: [{ label: "Learn Salah — Janazah mention", route: "/salah-guide" }],
  },

  {
    id: "washing-and-shroud",

    section: "prepare",

    title: "Washing and shrouding",

    summary: "Ghusl of the deceased and a simple kafan — dignity without extravagance.",

    body: [
      "Muslims who die (other than battlefield martyrs in the classical ruling) are washed with a purifying wash, then shrouded in clean white cloth. Umm Atiyyah reported that the Prophet ﷺ said regarding his daughter's washing: 'Wash her three or five times, or more if you see fit, with water and sidr, and put camphor — or some camphor — in the last' (Sahih al-Bukhari 1253). Washers should be trustworthy people of the same gender as the deceased when possible; spouses washing one another is allowed in many scholarly opinions — confirm with a local guide.",

      "Aisha reported that the Messenger of Allah ﷺ was shrouded in three white Yemeni cotton garments, among which was neither a shirt nor a turban (Sahih al-Bukhari 1264; Sahih Muslim 941). Simplicity is the sunnah; costly displays contradict the prophetic example. Cloth counts for men and women differ by school (often odd numbers; women may have more pieces in some madhhabs).",

      "Who washes whom, perfume placement, and related details have madhhab differences. Families should follow a knowledgeable local guide or funeral service that knows the school's practice — this overview is not a wash manual.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1253",

        grade: "sahih",

        excerpt:
          "Wash her three times, or five, or more if you see that as necessary, with water and sidr, and put camphor or some camphor in the last washing.",
      },

      {
        collection: "Sahih al-Bukhari",

        citation: "1264",

        grade: "sahih",

        excerpt:
          "The Messenger of Allah ﷺ was shrouded in three white Yemeni cotton garments; neither a shirt nor a turban was among them.",
      },
    ],

    madhhabNote:
      "Schools differ on exact cloth counts, perfume placement, spouse washing, and whether certain categories (e.g. miscarriage stages) receive full washing. Follow your local funeral committee or scholar for hands-on steps.",

    actions: [
      "Appoint trustworthy people of the same gender as the deceased when possible.",

      "Keep the shroud simple and clean — white cloth is the prophetic model.",

      "Avoid photographing or exposing the body without need.",
    ],
  },

  {
    id: "closing-eyes-dua",

    section: "prepare",

    title: "When closing the eyes of the deceased",

    summary: "A prophetic dua at the moment of death.",

    body: [
      "Umm Salamah reported that the Messenger of Allah ﷺ came to Abu Salamah when his eyes had become fixed. He closed them and said: 'When the soul is taken, the sight follows it,' and the people of his household wept. He then taught them to say only what is good, for the angels say amin to what they say, and he made dua for Abu Salamah (Sahih Muslim 920).",

      "The bundled Hisnul Muslim entry below preserves the wording used at closing the eyes. Replace the placeholder name and adapt pronouns if the deceased is female (see the topic on men, women, and children). Speak gently, avoid wailing that the Prophet ﷺ forbade, and occupy the tongue with good words and seeking forgiveness.",
    ],

    hadith: [
      {
        collection: "Sahih Muslim",

        citation: "920",

        grade: "sahih",

        excerpt:
          "When Abu Salamah's eyes became fixed, the Prophet ﷺ closed them and said that when the soul is taken the sight follows it, then taught the household to speak only what is good.",
      },
    ],

    duaId: "hisn-155",

    actions: [
      "Close the eyes gently and make the authentic dua.",

      "Remind the family to speak good.",
    ],
  },

  {
    id: "how-to-pray-janazah",

    section: "salah",

    title: "How to pray Janazah",

    summary: "Standing prayer with four takbirs — no ruku or sujud.",

    body: [
      "The funeral prayer is performed standing. There is no ruku, no sujud, and no adhan or iqamah. The imam stands at the head of a male deceased or at the middle of a female deceased according to reports from Anas and Samurah (Abu Dawud 3194 and related narrations), and the congregation forms rows behind. Women may offer Janazah; Aisha (may Allah be pleased with her) and other female Companions prayed funeral prayers — follow local practice for rows and attendance.",

      "The prayer consists of four takbirs. After the first, Surat al-Fatihah is recited (Bukhari 1335). After later takbirs, salawat upon the Prophet ﷺ and dua for the deceased are made. The prayer ends with taslim. Jabir reported that the Prophet ﷺ offered the funeral prayer for Negus (the Abyssinian king) and said four takbirs (Sahih al-Bukhari 1334).",

      "Latecomers who miss a takbir should follow the imam and complete what they missed according to their school's rule for catching up — ask the imam or a local teacher if unsure. See the takbir-by-takbir checklist later in this guide.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1334",

        grade: "sahih",

        excerpt: "The Prophet ﷺ offered the funeral prayer for Negus and said four takbirs.",
      },

      {
        collection: "Sahih al-Bukhari",

        citation: "1335",

        grade: "sahih",

        excerpt:
          "Ibn Abbas offered a funeral prayer and recited the Fatihah, saying it was from the sunnah.",
      },
    ],

    madhhabNote:
      "Raising the hands with each takbir, silent vs audible Fatihah, and the exact placement of salawat and dua vary slightly by school. Follow the imam leading the prayer.",

    actions: [
      "Stand in rows; do not bow or prostrate.",

      "Say four takbirs with the imam.",

      "Make sincere dua for the deceased after the appropriate takbir.",
    ],

    appLinks: [{ label: "Learn Salah hub", route: "/salah-guide" }],
  },

  {
    id: "janazah-duas-adult",

    section: "duas",

    title: "Duas in the funeral prayer (adult)",

    summary: "Authentic Hisnul Muslim wordings for the deceased.",

    body: [
      "After the takbirs, the heart of Janazah is dua for the deceased — asking Allah to forgive them, show them mercy, and grant them Paradise. Several authentic wordings are preserved in Hisnul Muslim from the Prophet ﷺ. The bundled texts use masculine pronouns as the standard Arabic form.",

      "When the deceased is a woman, adapt the same wording with feminine pronouns (e.g. لَهُ → لَهَا). See the dedicated topic on men, women, and children. Open the linked dua below to recite with Arabic, transliteration, and meaning. You may learn more than one authentic wording; sincerity matters more than length.",
    ],

    duaId: "hisn-156",

    actions: [
      "Memorize at least one authentic Janazah dua.",

      "Adapt pronouns for a female deceased when you pray.",

      "Make general dua for all Muslim deceased when you attend.",
    ],

    appLinks: [{ label: "All illness & funeral duas", route: "/dua" }],
  },

  {
    id: "janazah-duas-more",

    section: "duas",

    title: "More funeral prayer duas",

    summary: "Additional authentic wordings from Hisnul Muslim.",

    body: [
      "Hisnul Muslim preserves further funeral-prayer wordings taught from the Prophet ﷺ. Use them in rotation or learn the one your community knows best. This wording explicitly asks forgiveness for 'our males and our females' and for young and old — a collective dua that fits any funeral.",

      "For a deceased child, specific duas ask Allah to make the child a forerunner and stored reward for the parents — see the child topics. For pronoun changes on adult-specific wordings, see the gender-forms topic.",
    ],

    duaId: "hisn-157",
  },

  {
    id: "janazah-dua-three",

    section: "duas",

    title: "Funeral prayer dua #3",

    summary: "Another authentic wording for the adult deceased.",

    body: [
      "A further Hisnul Muslim wording for the funeral prayer. Recite it after the appropriate takbir as your imam's practice allows. The Arabic uses a masculine name pattern ('so-and-so son of so-and-so'); for a woman say the equivalent feminine lineage wording, and change لَهُ / عَنْهُ to feminine forms.",
    ],

    duaId: "hisn-158",
  },

  {
    id: "janazah-dua-four",

    section: "duas",

    title: "Funeral prayer dua #4",

    summary: "A fourth authentic wording from the sunnah corpus.",

    body: [
      "Hisnul Muslim includes this additional funeral-prayer dua. The wording 'Your servant and the son of Your maidservant' becomes, for a woman, 'Your maidservant and the daughter of Your maidservant' (أَمَتُكَ وَابْنَةُ أَمَتِكَ) with matching feminine verbs — same prophetic meaning, adapted grammar. Choose authenticity and presence of heart over collecting every wording at once.",
    ],

    duaId: "hisn-159",
  },

  {
    id: "janazah-child-duas",

    section: "duas",

    title: "Duas for a deceased child",

    summary: "Specific prophetic duas when the deceased is a child.",

    body: [
      "When the deceased is a child (not yet accountable), authentic duas ask Allah to make the child a stored treasure, a forerunner, and an answered intercessor for the parents — rather than focusing only on personal forgiveness of deeds. The Hisnul Muslim entries preserve those wordings. A related report encourages praying over a miscarriage and seeking mercy and forgiveness for the parents (Abu Dawud 3180 — graded hasan by many later scholars).",

      "Comfort the family with hope in Allah's mercy while avoiding invented rituals. The same four-takbir Janazah structure applies; the dua content is what changes. For a girl, use feminine pronouns (اجْعَلْهَا، شَفِيعَةً مُجَابَةً, and so on) — see the gender-forms topic.",
    ],

    duaId: "hisn-160",

    actions: [
      "Use the child-specific duas when appropriate.",

      "Adapt pronouns for a deceased girl.",

      "Support grieving parents with presence and halal help.",
    ],
  },

  {
    id: "janazah-child-dua-two",

    section: "duas",

    title: "Child funeral dua #2",

    summary: "Second Hisnul Muslim wording for a deceased child.",

    body: [
      "Another authentic wording for the funeral prayer of a child, preserved in Hisnul Muslim: asking Allah to make the child a preceding reward, a prepayment, and a recompense. For a girl, change اجْعَلْهُ to اجْعَلْهَا.",
    ],

    duaId: "hisn-161",
  },

  {
    id: "burial-and-grave",

    section: "burial",

    title: "Burial and the grave",

    summary: "Lowering the body, facing the qibla, and dua after burial.",

    body: [
      "The deceased is buried in the earth facing the qibla, with dignity and without delay beyond what preparation requires. The Prophet ﷺ said: 'Be prompt with the funeral...' (Sahih al-Bukhari 1315 — hastening the funeral).",

      "When placing the deceased in the grave, an authentic dua is preserved in Hisnul Muslim. After burial, the Prophet ﷺ would stand at the grave and say: 'Ask forgiveness for your brother, and ask that he be made steadfast, for he is now being questioned' (Sunan Abi Dawud 3221 — graded sahih by many later scholars including al-Albani). For a sister, say 'your sister' and feminine pronouns in your own tongue or Arabic.",

      "Building ornate structures over graves, plastering them for decoration, or writing that encourages exaggeration is warned against in authentic reports. Keep the mark simple where the law and local custom allow identification.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1315",

        grade: "sahih",

        excerpt:
          "Be prompt with the funeral: if it was righteous, you are hastening it to good; if otherwise, you are laying evil off your necks.",
      },

      {
        collection: "Sunan Abi Dawud",

        citation: "3221",

        grade: "sahih",

        excerpt:
          "Ask forgiveness for your brother and ask that he be made steadfast, for he is now being questioned.",
      },
    ],

    duaId: "hisn-163",

    madhhabNote:
      "Lahd vs shiqq grave styles, depth, and whether women attend the burial differ by school and culture within Islamic bounds. Follow local scholarly guidance.",
  },

  {
    id: "after-burial-dua",

    section: "burial",

    title: "After burying the deceased",

    summary: "Dua for steadfastness at the grave.",

    body: [
      "Standing briefly after burial to seek forgiveness and steadfastness for the deceased is established from the Prophet ﷺ (Abu Dawud 3221). The Hisnul Muslim wording below is for after burial; adapt pronouns for a female deceased.",

      "Ongoing charity, dua, and fulfilling the deceased's legitimate wills benefit them by Allah's permission — without inventing annual ceremonies that lack evidence.",
    ],

    duaId: "hisn-164",

    actions: [
      "Make dua at the grave after burial.",

      "Continue private dua and sadaqah for the deceased.",
    ],

    appLinks: [{ label: "Sadaqah goals", route: "/sadaqah" }],
  },

  {
    id: "visiting-graves",

    section: "burial",

    title: "Visiting the graves",

    summary: "The prophetic greeting when visiting the graves.",

    body: [
      "Visiting graves reminds the living of the Hereafter. Buraidah reported that the Messenger of Allah ﷺ used to teach them to say when they went out to the graveyard: a greeting of peace upon the inhabitants of the dwellings among the believers and Muslims, affirming that we will — Allah willing — join them, and asking well-being for us and them (Sahih Muslim 975; wording also in Ibn Majah).",

      "The Hisnul Muslim entry below preserves that greeting. Keep visits free of wailing, seeking help from the dead, or rituals without evidence.",
    ],

    hadith: [
      {
        collection: "Sahih Muslim",

        citation: "975",

        grade: "sahih",

        excerpt:
          "Peace be upon you, O inhabitants of the dwellings among the believers and Muslims. We will — Allah willing — join you. We ask Allah for well-being for us and for you.",
      },
    ],

    duaId: "hisn-165",

    actions: [
      "Greet the inhabitants of the graves with the authentic wording.",

      "Reflect on death and renew righteous deeds.",
    ],
  },

  {
    id: "common-mistakes",

    section: "reminders",

    title: "Reminders and common mistakes",

    summary: "Avoid wailing, delay for show, and baseless rituals.",

    body: [
      "The Prophet ﷺ forbade wailing over the dead while allowing tearful grief. Abdullah ibn Umar reported that Sa'd ibn Ubadah wept at a funeral and the Prophet ﷺ explained that Allah does not punish for tear of the eye or grief of the heart, but for this — and he pointed to his tongue (Sahih al-Bukhari 1304).",

      "Do not delay burial for prestige gatherings, nor spend lavishly on the shroud and feast while neglecting the poor. Do not recite or practice innovations attributed to funerals without authentic basis. Condolence, quiet dua, and practical help for the family are the sunnah path.",

      "Women's attendance at the prayer and burial is treated with nuance across schools and eras; follow trustworthy local guidance that respects both compassion and prophetic limits.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1304",

        grade: "sahih",

        excerpt:
          "Allah does not punish for the tear of the eye or the grief of the heart, but He punishes or shows mercy for this — and he pointed to his tongue.",
      },
    ],

    actions: [
      "Grieve without wailing or forbidden speech.",

      "Hasten a dignified burial.",

      "Help the family with food and affairs without burdening them with extravagance.",
    ],

    disclaimer:
      "Educational overview — not a funeral director's manual or a fatwa. Local school practice for washing, shrouding, and cemetery rules must be confirmed with qualified people.",
  },

  // --- Topics appended in v2 (index-aligned overlays must append matching entries) ---

  {
    id: "takbir-steps",

    section: "salah",

    title: "Takbir by takbir — the prayer steps",

    summary: "A practical checklist of the four takbirs and what comes between them.",

    body: [
      "First takbir: raise the hands (per your school), say Allahu Akbar, then recite Surat al-Fatihah. Ibn Abbas recited al-Fatihah in a funeral prayer and said it was from the sunnah (Sahih al-Bukhari 1335).",

      "Second takbir: send salawat upon the Prophet ﷺ — the same Ibrahimic salawat used in tashahhud is widely taught for this step. Third takbir: make sincere dua for the deceased (Hisnul Muslim wordings in this guide). Fourth takbir: many scholars then make a brief general dua, then end with taslim to the right (and left, per school).",

      "There is no ruku, sujud, or sitting. Stand throughout. If several funerals are present, one Janazah with intention for all is practiced in many communities — follow the imam. Placement of salawat vs dua can shift slightly by madhhab; the four-takbir frame is shared.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1335",

        grade: "sahih",

        excerpt:
          "Ibn Abbas offered a funeral prayer and recited the Fatihah, saying it was from the sunnah.",
      },
    ],

    actions: [
      "Learn the four-takbir sequence before you need it.",

      "Memorize Fatihah, salawat, and at least one funeral dua.",
    ],

    madhhabNote:
      "Hanafi, Maliki, Shafi'i, and Hanbali manuals differ on whether hands are raised each takbir and exactly when dua is said. Follow the imam in front of you.",
  },

  {
    id: "dua-for-men-women",

    section: "duas",

    title: "Duas for men, women, and children",

    summary: "Same prophetic wordings — adapt Arabic pronouns to the deceased.",

    body: [
      "Hisnul Muslim (and the classic hadith collections) record Janazah duas primarily in the masculine form. That does not mean a separate 'invented' dua for women. Mainstream scholars teach that you may keep the masculine wording with the intention for the person, or — preferably and commonly — change the grammar to match the deceased: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; and for a girl child اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",

      "For a deceased woman, some scholars advise care with the phrase 'a spouse better than her spouse' (زَوْجًا خَيْرًا مِنْ زَوْجِهَا), noting she may be reunited with her husband in Paradise — you may omit that clause or keep a general wording. For children, use the child-specific Hisnul entries (hisn-160, hisn-161) rather than adult forgiveness-focused texts alone.",

      "The collective wording 'forgive our males and our females' (hisn-157) already covers both genders without change. We do not invent new Arabic beyond grammatical adaptation of authentic texts — open the linked adult dua as a base and apply the pronoun map above.",
    ],

    actions: [
      "Practice feminine pronoun swaps for the dua you memorize.",

      "Use child-specific duas for those who have not reached puberty.",

      "Prefer authenticity over lengthy unauthenticated booklets.",
    ],

    appLinks: [{ label: "Adult funeral dua #1", route: "/dua/detail/hisn-156" }],

    duaId: "hisn-156",

    madhhabNote:
      "Both keeping masculine forms with intention and adapting feminine forms are accepted among mainstream scholars. When unsure, use hisn-157 (males and females) or ask the imam.",
  },

  {
    id: "martyrs-and-stillborn",

    section: "prepare",

    title: "Martyrs, miscarriage, and special cases",

    summary: "When washing or Janazah rulings differ from the usual case.",

    body: [
      "Battlefield martyrs who die in combat are, in the classical ruling drawn from Uhud, buried in their clothes without the usual ghusl; the Prophet ﷺ ordered the martyrs of Uhud to be buried with their blood and without washing (Sahih al-Bukhari 1346). Other categories called 'martyrs' in reward (e.g. plague, drowning) normally receive washing and Janazah — ask a scholar for edge cases.",

      "For a miscarriage or stillborn, schools differ on when a funeral prayer and full washing apply (often tied to whether a recognizable form or soul-blowing stage is judged to have occurred). A hadith encourages praying over a miscarriage and seeking forgiveness and mercy for the parents (Abu Dawud 3180). Follow your madhhab's funeral committee rather than guessing.",

      "Non-Muslim relatives are not given the Muslim Janazah prayer; kindness, lawful burial help where applicable, and personal grief are separate from the ritual prayer for believers. Always confirm special cases with qualified local guidance.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1346",

        grade: "sahih",

        excerpt:
          "The Prophet ﷺ ordered that the martyrs of Uhud be buried with their blood, and they were not washed.",
      },

      {
        collection: "Sunan Abi Dawud",

        citation: "3180",

        grade: "hasan",

        excerpt:
          "The funeral prayer is offered over the miscarriage, and the parents are prayed for with forgiveness and mercy.",
      },
    ],

    actions: [
      "Do not wash a battlefield martyr contrary to scholarly instruction.",

      "Ask the funeral committee about miscarriage or stillbirth cases.",
    ],

    madhhabNote:
      "Definitions of battlefield martyrdom, miscarriage stages, and prayer over the stillborn vary by school. This topic flags the issues — it is not a fatwa.",

    disclaimer:
      "Special rulings are sensitive. Confirm with a qualified scholar or your community's funeral service before acting.",
  },

  {
    id: "absentia-janazah",

    section: "salah",

    title: "Janazah in absentia",

    summary: "The Prophet ﷺ prayed for Negus when the body was far away.",

    body: [
      "Jabir reported that the Prophet ﷺ came out to his Companions, lined them up, and prayed four takbirs for Negus (al-Najashi), the Abyssinian king who had died abroad (Sahih al-Bukhari 1334; Sahih Muslim 952). This is the main evidence for Salat al-Janazah in absentia (alā al-ghā'ib).",

      "Schools differ on how widely to apply that precedent: some limit it to cases like Negus (no local Muslim prayer), others allow it more broadly when the body is distant. Do not skip a local Janazah when the body is present and the community can pray. Follow a trusted local scholar for when absentia prayer is appropriate in your school.",

      "The form is the same four-takbir prayer; the intention is for the absent deceased. Use the same authentic duas, adapting gender as needed.",
    ],

    hadith: [
      {
        collection: "Sahih al-Bukhari",

        citation: "1334",

        grade: "sahih",

        excerpt: "The Prophet ﷺ offered the funeral prayer for Negus and said four takbirs.",
      },

      {
        collection: "Sahih Muslim",

        citation: "952",

        grade: "sahih",

        excerpt:
          "The Messenger of Allah ﷺ lined up the Companions and prayed for Negus, saying four takbirs.",
      },
    ],

    actions: [
      "Pray locally whenever the body is present.",

      "Ask before organizing an absentia Janazah as a public event.",
    ],

    madhhabNote:
      "Scope of absentia Janazah is a known point of difference. Prefer the practice of qualified imams in your community.",
  },

  {
    id: "deathbed-talqin",

    section: "prepare",

    title: "At the deathbed — last words",

    summary: "Prompt the dying to say la ilaha illallah with gentleness.",

    body: [
      "The Prophet ﷺ said: 'Prompt your dying ones to say la ilaha illallah' (Sahih Muslim 916; Abu Dawud 3117). Hisnul Muslim preserves the instruction that whoever's last words are 'None has the right to be worshipped except Allah' will enter Paradise (hisn-153, from Abu Dawud 3116).",

      "Prompt gently and without harshness; do not force or argue. Those near death may also be comforted with authentic words of hope preserved in Hisnul Muslim (hisn-150–152). Close the eyes when the soul is taken and use the closing-eyes dua (previous topic).",

      "Avoid loud wailing and speech that angers Allah. The household should say what is good, for the angels say amin to their words (Sahih Muslim 920).",
    ],

    hadith: [
      {
        collection: "Sahih Muslim",

        citation: "916",

        grade: "sahih",

        excerpt: "Prompt your dying ones to say: la ilaha illallah.",
      },

      {
        collection: "Sunan Abi Dawud",

        citation: "3116",

        grade: "sahih",

        excerpt:
          "He whose last words are 'None has the right to be worshipped except Allah' will enter Paradise.",
      },
    ],

    actions: [
      "Gently remind the dying of the shahadah.",

      "Keep the room calm and occupied with good speech.",
    ],

    appLinks: [
      { label: "Hope-of-life duas", route: "/dua" },

      { label: "Closing the eyes", route: "/janazah/closing-eyes-dua" },
    ],

    duaId: "hisn-153",
  },

  {
    id: "bereaved-condolence",

    section: "reminders",

    title: "Condolence and the bereaved",

    summary: "Comfort the living with the prophetic calamity dua.",

    body: [
      "Umm Salamah reported that the Messenger of Allah ﷺ said: 'There is no Muslim who is afflicted with a calamity and then says what Allah has commanded — \"To Allah we belong and to Him we return. O Allah, reward me in my calamity and replace it for me with something better\" — but Allah will replace it for them with something better' (Sahih Muslim 918). Hisnul Muslim preserves this wording (hisn-154).",

      "Offer condolences with brief, truthful words; prepare food for the family of the deceased rather than burdening them with hosting (Abu Dawud 3132 — the report concerning Ja'far's family). Avoid fixed-day innovation ceremonies that lack evidence while continuing private dua, sadaqah, and kindness.",

      "Tearful grief is permitted; wailing, striking the cheeks, and tearing clothes were forbidden. Support widows, orphans, and dependents with lawful help after the burial.",
    ],

    hadith: [
      {
        collection: "Sahih Muslim",

        citation: "918",

        grade: "sahih",

        excerpt:
          "No Muslim is afflicted with a calamity and says the commanded words of return to Allah and asks replacement with better, but Allah replaces it with something better.",
      },
    ],

    actions: [
      "Teach the bereaved the calamity dua.",

      "Help with food and errands instead of expecting a feast.",

      "Continue quiet dua and sadaqah for the deceased.",
    ],

    appLinks: [{ label: "Sadaqah goals", route: "/sadaqah" }],

    duaId: "hisn-154",
  },
];
