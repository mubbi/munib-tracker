import type { TaharahTopic } from "../types/taharah";

export { TAHARAH_CHECKLIST } from "./taharah-checklist";

/**
 * Learn Purification (Taharah) — a complete course on ritual purity for worship.
 * Every claim is grounded in the Qur'an or an authentic (sahih/hasan) hadith,
 * with collection and number verified against the standard printed editions
 * (sunnah.com). Where the four Sunni schools differ, the difference is noted
 * respectfully rather than presented as a single ruling. Bump version on change.
 */
export const TAHARAH_CONTENT_VERSION = 2;

export const TAHARAH_SECTION_ORDER = [
  "intro",
  "water",
  "wudu",
  "ghusl",
  "tayammum",
  "najasah",
  "exceptions",
  "reference",
] as const;

export const TAHARAH_TOPICS: TaharahTopic[] = [
  // ── Intro ────────────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "intro",
    title: "Introduction to Taharah",
    summary: "Purification is the doorway to prayer and half of a believer's faith.",
    importance: "foundational",
    body: [
      "Taharah (طهارة) means purification — freeing the body, clothing, and place of prayer from ritual and physical impurity so that a Muslim may stand before Allah in a state He accepts. It is the very first thing a student of worship learns, because without it no prayer is valid: the Prophet ﷺ said, 'The key to prayer is purification.'",
      "Purification in Islam has two dimensions. The outward is tangible cleanliness — washing, removing filth, keeping clean. The inward is the humility, mindfulness, and readiness of heart that the washing is meant to awaken. The Prophet ﷺ tied the two together when he called purification 'half of faith,' pairing physical cleanliness with the purification of the soul from sin.",
      "This module walks through the whole subject in order: the water you purify with, wudu (minor ablution), ghusl (the full ritual bath), tayammum (dry purification when water cannot be used), najasah (removing physical filth), and the special cases and concessions. Learn it once and prayer becomes something you can enter with confidence rather than doubt.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "O you who believe, when you rise to pray, wash your faces and your forearms to the elbows, wipe your heads, and wash your feet to the ankles.",
      },
      {
        surah: 2,
        ayahFrom: 222,
        label: "Qur'an 2:222",
        excerpt:
          "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.",
      },
    ],
    hadith: [
      {
        collection: "Sunan Abi Dawud",
        citation: "61",
        grade: "sahih",
        excerpt:
          "The key to prayer is purification; its start is the takbir and its end is the taslim. (Ali; also Jami' at-Tirmidhi 3)",
      },
    ],
    actions: [
      "Treat purification as preparation for meeting Allah, not a rushed routine.",
      "Study one taharah topic each day until the whole flow feels natural.",
    ],
    appLinks: [{ label: "Learn Salah hub", route: "/salah-guide" }],
  },
  {
    id: "importance-of-purity",
    section: "intro",
    title: "Importance of Purity",
    summary: "Purity is a strict condition for salah and a mark of the believer.",
    importance: "obligatory",
    body: [
      "Purification is not one option among many — it is a condition for the validity of prayer. Allah does not accept the prayer of a person who is in a state of ritual impurity until they purify. This is why a prayer performed without valid wudu or ghusl must be repeated, however sincere it was.",
      "The Prophet ﷺ elevated purification to a defining trait of the believer, calling it 'half of faith.' Regular purification disciplines a person, keeps them in a near-constant state of readiness to worship, and — the hadith teaches — literally washes minor sins away with the water.",
      "Because it guards the prayer, taharah also guards the believer from the sin of praying invalidly out of carelessness. Learning its rulings well is therefore an act of protecting one of the greatest deeds in Islam.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "223",
        grade: "sahih",
        excerpt: "Purification is half of faith. (Abu Malik al-Ash'ari)",
      },
      {
        collection: "Sahih Muslim",
        citation: "224",
        grade: "sahih",
        excerpt:
          "Allah does not accept a prayer without purification, nor charity from what is stolen. (Ibn 'Umar)",
      },
    ],
    actions: [
      "Before each prayer, confirm your state of purity before you begin.",
      "Keep a simple mental checklist: body, clothing, place, and wudu.",
    ],
  },
  {
    id: "types-of-purity",
    section: "intro",
    title: "Types of Purity",
    summary: "Three states to know: minor impurity, major impurity, and physical najasah.",
    body: [
      "Islamic law distinguishes three things you may need to purify from, and each has its own remedy. Knowing which situation you are in is the key to choosing the right method.",
      "Minor ritual impurity (hadath asghar) results from ordinary events like using the toilet, passing wind, or deep sleep. It is lifted by wudu, or by tayammum when water cannot be used.",
      "Major ritual impurity (hadath akbar, also called janabah) results from intimacy, sexual discharge, and the ending of menstruation or postnatal bleeding. It is lifted by ghusl, the full-body ritual bath — with tayammum again substituting when water is unavailable or harmful.",
      "Physical filth (najasah) — such as urine, excrement, or flowing blood — is a separate matter: it must be physically removed from the body, clothes, and prayer place regardless of your ritual state. The four Sunni schools agree on these three categories, differing only in some details of what nullifies purity or what trace amounts are excused.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "And if you are in a state of janabah, then purify yourselves. But if you are ill or on a journey… and find no water, then perform tayammum with clean earth.",
      },
    ],
    actions: [
      "Identify your state first (minor, major, or filth), then apply the correct method.",
      "When unsure about details, follow one qualified teacher from a recognised school consistently.",
    ],
  },

  // ── Water ────────────────────────────────────────────────────────────────
  {
    id: "water-in-islam",
    section: "water",
    title: "Water in Islam",
    summary: "Pure water is the primary purifier — used thoroughly, but never wasted.",
    importance: "foundational",
    body: [
      "The default means of purification is water. Allah describes rain as sent down 'pure' (tahur) — able both to cleanse and to be used for worship. Any naturally clean water — rain, river, sea, spring, well, or tap — is purifying so long as its colour, taste, or smell has not been changed by an impurity mixing into it.",
      "The jurists categorise water in detail (pure and purifying, pure but not purifying, and impure), but the practical rule for daily life is simple: water remains fit for wudu and ghusl unless a najasah has clearly altered it. When in genuine doubt with an available clean alternative, use the alternative.",
      "Islam teaches thoroughness without extravagance. The Prophet ﷺ washed completely yet used remarkably little water — about a mudd (two cupped handfuls) for wudu and a sa' (roughly four) for a full ghusl. Wasting water is discouraged even when it is plentiful, because moderation is itself part of the etiquette of worship.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 48,
        label: "Qur'an 25:48",
        excerpt: "And We send down from the sky pure water.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "201",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ used to perform wudu with a mudd of water and ghusl with a sa' up to five mudd. (Anas; also Sahih Muslim 325 — the sunnah of moderation)",
      },
    ],
    actions: [
      "Use enough water to wash thoroughly, but turn the tap down and avoid excess.",
      "If a water source looks or smells altered by filth, seek the nearest clearly clean source.",
    ],
    disclaimer:
      "The much-quoted 'do not waste water even at a flowing river' report (Ibn Majah 425) is graded weak (da'if) by most scholars; the sunnah of moderation is established instead by the mudd/sa' hadith above.",
  },

  // ── Wudu ─────────────────────────────────────────────────────────────────
  {
    id: "what-is-wudu",
    section: "wudu",
    title: "What is Wudu?",
    summary: "The ritual ablution that lifts minor impurity before worship.",
    importance: "obligatory",
    body: [
      "Wudu (وضوء) is the ritual washing of specific limbs, in a specific order, that lifts minor ritual impurity. Its four obligatory washes are named directly in the Qur'an (5:6): the face, the forearms to the elbows, wiping the head, and the feet to the ankles.",
      "It is required before every salah — unless you remain in a valid state from a previous prayer — and, according to the majority of scholars, before performing tawaf around the Ka'bah and before touching the physical text (mushaf) of the Qur'an.",
      "Wudu is an act of worship in its own right, not merely a preliminary. The Prophet ﷺ warned that 'Allah does not accept the prayer of any of you who breaks his wudu until he performs wudu again' — so guarding it is guarding the prayer itself.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "135",
        grade: "sahih",
        excerpt:
          "Allah does not accept the prayer of one of you who breaks his wudu until he performs wudu. (Abu Hurayrah)",
      },
    ],
    appLinks: [{ label: "Wudu in the Salah guide", route: "/salah-guide/wudu" }],
  },
  {
    id: "wudu-conditions",
    section: "wudu",
    title: "Conditions for Valid Wudu",
    summary: "Intention, pure water, and unobstructed skin — the prerequisites of a sound wudu.",
    importance: "obligatory",
    body: [
      "Certain conditions (shurut) must be in place for wudu to count. The person must be a Muslim of sound mind, intending purification for worship (niyyah). Some schools classify intention as a pillar of the act and others as a condition, but all agree it is required for the reward and, for most, for validity.",
      "The water used must be pure and purifying. Crucially, it must actually reach the skin — so anything forming a waterproof barrier over a limb (thick paint, nail polish, wax, glue) must be removed first, or the wash beneath it is not valid. Ordinary dirt or henna stain that does not block water is not a problem.",
      "The Shafi'i and Hanbali schools also require that the washes be done in the Qur'anic order and without a long interruption (muwalat) that lets limbs dry. The Hanafi and Maliki positions on strict sequence and continuity are more lenient in some situations. Follow one school's method for consistency.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "Wash your faces and your forearms to the elbows, wipe your heads, and wash your feet to the ankles.",
      },
    ],
    actions: [
      "Remove nail polish, rings that trap water, and anything that seals the skin before wudu.",
      "Perform wudu calmly in one flow so no limb is missed or left to dry.",
    ],
  },
  {
    id: "wudu-obligatory",
    section: "wudu",
    title: "Obligatory Acts of Wudu",
    summary: "The Qur'anic pillars (faraid) without which wudu is invalid.",
    importance: "obligatory",
    body: [
      "The obligatory acts of wudu (its faraid) are the parts Allah named in the verse: washing the whole face; washing both arms up to and including the elbows; wiping the head; and washing both feet up to and including the ankles. Miss any of these and the wudu is incomplete.",
      "To these, the schools add further obligations from the Sunnah and juristic reasoning. Intention is obligatory in most schools (the Hanafis classify it as a strongly emphasised sunnah for lifting minor impurity). Order (tartib) and continuity (muwalat) are obligatory for the Shafi'is and Hanbalis. The Malikis add rubbing the limbs (dalk) as an obligation.",
      "Everything beyond these — rinsing the mouth and nose, washing the hands first, washing three times — is recommended (sunnah) rather than obligatory. Knowing the difference means you can tell when a wudu is merely imperfect versus actually invalid.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "Wash your faces and your forearms to the elbows, wipe your heads, and wash your feet to the ankles.",
      },
    ],
    disclaimer:
      "The exact list of faraid (e.g. whether intention, order, and rubbing are obligatory) differs among the four schools. Learn and apply one reliable school consistently.",
  },
  {
    id: "wudu-sunnah",
    section: "wudu",
    title: "Sunnah Acts of Wudu",
    summary: "The recommended acts that perfect and multiply the reward of wudu.",
    importance: "recommended",
    body: [
      "Around the obligatory core, the Prophet ﷺ practised many recommended acts (sunan) that complete and beautify wudu. Leaving one does not invalidate the wudu, but including them earns extra reward and follows his example more fully.",
      "The established sunnah acts include: saying 'Bismillah' at the start; washing the hands three times before beginning; rinsing the mouth (madmadah) and nose (istinshaq); running wet fingers through a thick beard and between the fingers and toes (takhlil); beginning each pair of limbs with the right; and repeating each wash up to three times.",
      "Two sunnahs deserve special mention: using the miswak (siwak) beforehand — which the Prophet ﷺ nearly made obligatory — and reciting the testimony of faith after finishing, which opens the eight gates of Paradise for the one who says it.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "234",
        grade: "sahih",
        excerpt:
          "Whoever performs wudu well, then says 'I bear witness that there is no god but Allah… and that Muhammad is His slave and Messenger,' the eight gates of Paradise are opened for him. ('Umar ibn al-Khattab)",
      },
    ],
    actions: [
      "Practise the full sunnah sequence until it becomes your natural routine.",
      "Recite the post-wudu shahadah every time.",
    ],
    appLinks: [{ label: "Duas after wudu", route: "/dua/prayer" }],
  },
  {
    id: "wudu-steps",
    section: "wudu",
    title: "Step-by-Step Wudu",
    summary: "The complete prophetic sequence from intention to closing supplication.",
    importance: "obligatory",
    body: [
      "The Prophet ﷺ taught wudu as a flowing sequence that weaves the obligations together with the sunnah acts. This is the method 'Uthman ibn 'Affan demonstrated to the people, saying afterward that he had seen the Prophet ﷺ perform wudu exactly so — and that whoever does likewise and prays two rak'ahs with full presence has his past sins forgiven.",
      "Perform each step unhurriedly, making sure the water reaches every required area. The washed limbs (face, arms, feet) are washed; the head is only wiped.",
    ],
    steps: [
      {
        title: "Intend purification and say Bismillah",
        body: "Settle the intention for wudu in your heart and begin with the name of Allah.",
        transliteration: "Bismillah",
        tip: "The intention is inward — no spoken formula is required.",
      },
      {
        title: "Wash both hands three times",
        body: "Wash to the wrists, passing water between the fingers.",
      },
      {
        title: "Rinse the mouth three times",
        body: "Take water into the mouth, swirl it, and expel it.",
      },
      {
        title: "Rinse the nose three times",
        body: "Draw water gently into the nostrils and blow it out.",
      },
      {
        title: "Wash the face three times (fard)",
        body: "From the hairline to under the chin and from ear to ear.",
      },
      {
        title: "Wash the right arm, then the left (fard)",
        body: "Each from the fingertips to and including the elbow, up to three times.",
      },
      {
        title: "Wipe the head once (fard)",
        body: "With wet hands, wipe from the front to the back and return, then wipe the ears with the same wetness.",
      },
      {
        title: "Wash the right foot, then the left (fard)",
        body: "Each to and including the ankle, passing fingers between the toes.",
        tip: "Pay attention to the heels and ankles — the most commonly missed spots.",
      },
      {
        title: "Recite the closing supplication",
        body: "Say the testimony of faith to open the gates of Paradise.",
        transliteration:
          "Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
        tip: "A short but heavily rewarded sunnah.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "159",
        grade: "sahih",
        excerpt:
          "'Uthman washed each limb three times as he had seen the Prophet ﷺ do, then said: whoever performs wudu like this and prays two rak'ahs with full focus, his past sins are forgiven. (Humran, from 'Uthman)",
      },
    ],
    appLinks: [
      { label: "Wudu in Salah guide", route: "/salah-guide/wudu" },
      { label: "Wudu dua", route: "/learn-dua/wudu-prayer" },
    ],
  },
  {
    id: "wudu-duas",
    section: "wudu",
    title: "Duas Related to Wudu",
    summary: "The authentically-reported supplications before and after wudu.",
    importance: "highly-recommended",
    body: [
      "The strongest narrated remembrances around wudu are two: saying 'Bismillah' at the beginning, and the testimony of faith after completing it. To the closing shahadah, an authentic addition asks Allah, 'Make me among those who repent and make me among those who purify themselves.'",
      "It is important to know that the detailed 'dua for each limb' (a specific supplication while washing the hands, face, arms, and so on) that circulates in some booklets is not established with sound authenticity from the Prophet ﷺ. Scholars advise not attributing these to him as sunnah, while there is no harm in general remembrance of Allah during wudu.",
      "The heart of the matter is presence: wash with awareness that each limb's sins are falling away, and end with the shahadah that reconnects the act to its purpose — faith in Allah alone.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "234",
        grade: "sahih",
        excerpt:
          "Whoever performs wudu well and then recites the testimony of faith, the eight gates of Paradise are opened for him to enter by whichever he wishes. ('Umar)",
      },
    ],
    actions: [
      "Memorise the post-wudu shahadah if you have not already.",
      "Avoid reciting unverified per-limb formulas as though they were established sunnah.",
    ],
    appLinks: [
      { label: "Prayer duas", route: "/dua/prayer" },
      { label: "Learn wudu dua", route: "/learn-dua/wudu-prayer" },
    ],
  },
  {
    id: "wudu-breakers",
    section: "wudu",
    title: "What Breaks Wudu?",
    summary: "The nullifiers of wudu — and the rule of certainty when in doubt.",
    importance: "obligatory",
    body: [
      "By scholarly agreement, wudu is broken by anything that exits the two private passages — urine, stool, wind, or other discharge — as well as by deep sleep that removes one's awareness, and by loss of consciousness through fainting or intoxication.",
      "Other matters are subject to respectful difference between the schools: touching the private parts directly, and skin-to-skin contact with a non-mahram of the opposite sex, are nullifiers in some schools but not others, based on differing readings of the same texts.",
      "A vital governing principle protects you from constant anxiety (waswas): certainty is not removed by doubt. If you had wudu and are merely unsure whether you broke it, you are still considered to have wudu until you are certain a nullifier occurred. The Prophet ﷺ told a man troubled by this feeling not to leave his prayer 'until he hears a sound or finds a smell.'",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "137",
        grade: "sahih",
        excerpt:
          "He should not leave (his prayer) until he hears a sound or finds a smell. (Abbad ibn Tamim, from his uncle)",
      },
    ],
    disclaimer:
      "Whether touching the opposite sex or one's private parts breaks wudu differs among the schools. Follow a qualified local teacher and one school's method.",
  },
  {
    id: "wudu-mistakes",
    section: "wudu",
    title: "Common Wudu Mistakes",
    summary: "The frequent errors that reduce reward — or invalidate the wudu entirely.",
    body: [
      "Most wudu faults come from haste. Rushing so that water does not reach a whole limb — a dry patch on the heel, ankle, elbow, or between the fingers and toes — can leave the wudu invalid, because the Qur'anic wash was not completed there.",
      "The Prophet ﷺ once saw people whose heels were left dry as the water had not reached them, and warned sharply, 'Woe to the heels from the Fire!' The heels, ankles, and the corners of the face are the most commonly neglected spots.",
      "The opposite error is excess: washing far more than three times, or using water wastefully, which contradicts the sunnah of moderation. Others fall into waswas (obsessive doubt), repeating wudu again and again — this too is a mistake, since certainty is not overturned by suspicion.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "241",
        grade: "sahih",
        excerpt:
          "Woe to the heels from the Fire! — said when he saw heels left dry in wudu. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Slow down and consciously confirm full coverage of each washed limb, especially heels and elbows.",
      "Use moderate water; do not let obsessive doubt push you into needless repetition.",
    ],
  },
  {
    id: "virtues-of-wudu",
    section: "wudu",
    title: "Virtues of Wudu",
    summary: "Wudu erases sins, raises ranks, and will make the believers shine on Judgment Day.",
    importance: "highly-recommended",
    body: [
      "Wudu is a repeated washing away of sins. The Prophet ﷺ taught that as a believer washes each limb, the wrong actions committed by that limb fall away with the water — with the eyes, the hands, the feet — until the person emerges cleansed of sin. A prayer preceded by wudu is thus preceded by a fresh forgiveness.",
      "It is also a distinguishing honour in the next life. On the Day of Resurrection the Prophet ﷺ will recognise his followers by the radiance on their faces, hands, and feet from the traces of wudu — a light unique to this ummah, called al-ghurr al-muhajjalun.",
      "Because of these virtues, staying in a state of wudu is a recommended habit: renewing it for each prayer, and sleeping upon wudu, are among the protective routines of the believer.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "246",
        grade: "sahih",
        excerpt:
          "My ummah will be called on the Day of Resurrection with bright faces, hands, and feet from the traces of wudu. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Renew wudu for each prayer window where you can.",
      "Make sleeping upon wudu a nightly sunnah.",
    ],
    appLinks: [{ label: "Track your salah", route: "/salah-guide" }],
  },

  // ── Ghusl ────────────────────────────────────────────────────────────────
  {
    id: "what-is-ghusl",
    section: "ghusl",
    title: "What is Ghusl?",
    summary: "The full-body ritual bath that lifts major impurity (janabah).",
    importance: "obligatory",
    body: [
      "Ghusl (غسل) is the ritual washing of the entire body, with intention, to lift major ritual impurity (janabah). Where wudu addresses minor impurity, ghusl addresses the greater state that follows intimacy, sexual discharge, and the ending of menstruation or postnatal bleeding.",
      "Its essence is that water reaches every part of the outer body — no dry spot may remain, including the roots of the hair, the skin folds, behind the ears, the navel, and between the toes. Rinsing the mouth and nose is included in the ghusl by many scholars.",
      "A single ghusl performed with the intention to lift janabah also removes minor impurity, so a person who has completed ghusl may pray without a separate wudu (though performing wudu within the ghusl is the sunnah).",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt: "And if you are in a state of janabah, then purify yourselves.",
      },
    ],
    appLinks: [{ label: "Salah preparation overview", route: "/salah-guide" }],
  },
  {
    id: "ghusl-when",
    section: "ghusl",
    title: "When Ghusl is Required",
    summary: "The situations that make the full ritual bath obligatory or recommended.",
    importance: "obligatory",
    body: [
      "Ghusl becomes obligatory (fard) in several defined cases: the emission of sexual fluid with desire (whether awake or through a wet dream); sexual intercourse itself, even without ejaculation — the Prophet ﷺ said that once the two are joined, ghusl is due; and the ending of menstruation (hayd) or postnatal bleeding (nifas). Death also obligates ghusl of the deceased upon the living.",
      "Other ghusls are recommended (mustahabb) rather than obligatory: the ghusl for Friday before Jumu'ah, which is so strongly urged that the Prophet ﷺ called it 'a duty upon every one who has reached puberty'; the ghusl for the two Eids; and the ghusl of ihram before Hajj or Umrah.",
      "A new Muslim is instructed to perform ghusl upon entering Islam — held obligatory by some scholars and strongly recommended by others.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "291",
        grade: "sahih",
        excerpt:
          "When a man sits between the four limbs of his wife and has intercourse with her, ghusl becomes obligatory. (Abu Hurayrah; also Sahih Muslim 348)",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "858",
        grade: "sahih",
        excerpt:
          "Ghusl on Friday is a duty upon every one who has reached the age of puberty. (Abu Sa'id al-Khudri; also Sahih Muslim 846)",
      },
    ],
    disclaimer:
      "Whether the Friday and convert ghusls are obligatory or strongly recommended differs by school and circumstance.",
    appLinks: [{ label: "Menstruation (Hayd) guide", route: "/hayd" }],
  },
  {
    id: "ghusl-steps",
    section: "ghusl",
    title: "Step-by-Step Ghusl",
    summary: "The prophetic method — minimum obligation plus the complete sunnah.",
    importance: "obligatory",
    body: [
      "'Aishah described the Prophet's ﷺ ghusl in detail, and from it the scholars derive both the minimum valid ghusl and the fuller sunnah method. The minimum is simply: intention plus water reaching the entire body (with rinsing the mouth and nose for many). The complete method below is how the Prophet ﷺ himself did it.",
      "Perform it unhurriedly, rubbing the water across the skin so nothing is left dry.",
    ],
    steps: [
      {
        title: "Form the intention",
        body: "Intend in your heart to lift major ritual impurity (janabah).",
      },
      {
        title: "Say Bismillah and wash the hands",
        body: "Begin in the name of Allah and wash both hands.",
      },
      {
        title: "Wash the private area",
        body: "Remove any impurity from the private parts with the left hand.",
      },
      {
        title: "Perform a full wudu",
        body: "Perform wudu as for prayer. You may delay washing the feet until the end if standing in gathered water.",
      },
      {
        title: "Pour water over the head three times",
        body: "Work the water to the scalp and the roots of the hair.",
      },
      {
        title: "Wash the right side, then the left",
        body: "Pour and rub water over the whole body, starting with the right.",
      },
      {
        title: "Ensure complete coverage",
        body: "Leave no dry spot — underarms, navel, behind the knees and ears, and between the toes.",
        tip: "Women need not undo braided hair, provided water reaches the scalp.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "248",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ, when he bathed from janabah, washed his hands, performed wudu as for prayer, ran his fingers through his hair, then poured water over his head three times and over the rest of his body. ('Aishah)",
      },
    ],
  },
  {
    id: "ghusl-mistakes",
    section: "ghusl",
    title: "Common Ghusl Mistakes",
    summary: "Avoid dry areas, a missing intention, and mistaking a shower for a ghusl.",
    body: [
      "The most fundamental mistake is treating an ordinary shower as a ghusl. A ghusl requires the intention to lift major impurity; without it, however long you wash, the ritual state is not lifted. Form the intention before you begin.",
      "The second common error is leaving dry spots. The obligation is that water touch the whole outer body, so neglecting the scalp roots, the ears, the navel, the small of the back, or between the toes leaves the ghusl incomplete. Rub the water over these areas to be sure.",
      "For hair: a woman with braided hair is not required to undo the braids, so long as water reaches the roots of the scalp — the Prophet ﷺ told Umm Salamah that pouring three handfuls over the head suffices. A man's hair, being usually loose, should be worked through so water reaches the roots.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "330",
        grade: "sahih",
        excerpt:
          "It is enough for you to pour three handfuls of water over your head, then pour water over yourself and you are purified — you need not undo your braids. (Umm Salamah)",
      },
    ],
    actions: [
      "Say the intention before the first pour, so the wash counts as a ghusl.",
      "Rub water over easily-missed areas; when uncertain, rewash a section rather than finish in doubt.",
    ],
  },

  // ── Tayammum ─────────────────────────────────────────────────────────────
  {
    id: "what-is-tayammum",
    section: "tayammum",
    title: "What is Tayammum?",
    summary: "The dry purification with clean earth when water cannot be used.",
    importance: "obligatory",
    body: [
      "Tayammum (تيمم) is the merciful substitute for wudu or ghusl when water is genuinely unavailable or cannot be used. Instead of washing, one strikes clean earth with the palms and wipes the face and hands — and this fully takes the place of water purification, allowing valid prayer.",
      "Tayammum is a gift to this ummah in particular: the Prophet ﷺ said, 'The earth has been made for me a place of prayer and a means of purification,' listing it among the special privileges given to him and not to earlier prophets. It embodies a central principle of the religion — the obligation remains, but the hardship is lifted.",
      "It is a temporary measure: once water becomes available and usable, ordinary purification with water resumes. A person may need to renew tayammum for each prayer according to some schools.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "335",
        grade: "sahih",
        excerpt:
          "The earth has been made for me a place of prayer and a means of purification. (Jabir — among the five things given uniquely to the Prophet ﷺ)",
      },
    ],
  },
  {
    id: "tayammum-when",
    section: "tayammum",
    title: "When Tayammum is Allowed",
    summary: "Permitted when water is absent, harmful, or urgently needed for survival.",
    body: [
      "Tayammum is permitted in three broad situations. First, when no water can be found after a reasonable search — the traveller in the desert, or anyone genuinely without access. Second, when using water would cause harm: for the sick whose wounds or illness would worsen, or in severe cold with no means to warm the water and a real risk of harm.",
      "Third, when the little water available is needed for a more pressing necessity — such as drinking, to preserve life, whether one's own or another's or an animal's. In each case the shari'ah weighs preservation of life and health above the preferred method of purification.",
      "The jurists differ over the finer thresholds — how far one must search for water, how much fear of harm is enough — but they are unanimous on the underlying mercy: worship is never dropped, only made easier.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "344",
        grade: "sahih",
        excerpt:
          "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
      },
    ],
    actions: [
      "Search reasonably for water before resorting to tayammum.",
      "If a doctor advises keeping a wound or illness dry, act on that and perform tayammum.",
    ],
  },
  {
    id: "tayammum-steps",
    section: "tayammum",
    title: "Step-by-Step Tayammum",
    summary: "The short, simple sequence for a valid dry purification.",
    importance: "obligatory",
    body: [
      "Tayammum is deliberately brief — a reflection of its purpose as a concession in hardship. It is performed with a clean, natural earthy surface: soil, sand, stone, or dust. Its essence, from the Prophet's ﷺ own demonstration to 'Ammar ibn Yasir, is a single strike of the palms on clean earth, then wiping the face and the hands.",
      "This is lighter than wudu by design, so do not add complications to it.",
    ],
    steps: [
      { title: "Form the intention", body: "Intend to lift ritual impurity in order to worship." },
      { title: "Say Bismillah", body: "Begin in the name of Allah." },
      {
        title: "Strike the clean earth once with both palms",
        body: "Place the palms lightly on a clean, dusty, natural surface.",
      },
      { title: "Wipe the face", body: "Wipe the whole face once with both hands." },
      {
        title: "Wipe the hands",
        body: "Wipe the backs of the hands — to the wrists by most scholars.",
        tip: "Follow one school's method (wrists vs. forearms) consistently.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "338",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ struck the earth with his palms, then wiped his face and his hands — teaching 'Ammar that this sufficed. ('Ammar ibn Yasir)",
      },
    ],
  },
  {
    id: "tayammum-breakers",
    section: "tayammum",
    title: "What Breaks Tayammum?",
    summary: "Nullified by the usual wudu-breakers — and by the return of usable water.",
    body: [
      "A tayammum performed in place of wudu is nullified by everything that breaks wudu: relieving oneself, passing wind, deep sleep, and so on. A tayammum in place of ghusl is additionally nullified by anything that causes major impurity.",
      "Uniquely, tayammum is also ended by the return of its cause being removed — namely, gaining access to usable water. Once water is found and can be used, the concession lapses and one returns to wudu or ghusl.",
      "A practical point of mercy: if you validly prayed with tayammum and only found water afterwards, the majority hold that the completed prayer need not be repeated — it was performed correctly under the ruling that applied at the time. But if water appears before the prayer, you must use it.",
    ],
    actions: [
      "Re-check for available water at the start of each prayer time.",
      "As soon as water can be used, return to purification with water without delay.",
    ],
    disclaimer:
      "Some details — such as whether a prayer is repeated after water is found within its time — differ by school.",
  },

  // ── Najasah ──────────────────────────────────────────────────────────────
  {
    id: "impurities-najasah",
    section: "najasah",
    title: "Impurities (Najasah)",
    summary: "Physical filth that must be removed from body, clothing, and place of prayer.",
    importance: "obligatory",
    body: [
      "Najasah (نجاسة) is tangible ritual filth, distinct from the ritual states of hadath. The clear examples agreed upon include human urine and excrement, flowing blood, the flesh and discharge of the pig, and the saliva of a dog (which requires a specific washing). Removing najasah from the body, the clothing worn, and the spot of prayer is a condition for valid salah.",
      "The removal is by water where the filth is tangible, washing until the substance and its trace are gone. Islam also treats the sources of najasah seriously: the Prophet ﷺ warned that much of the punishment of the grave comes from carelessness with urine — being splashed by it and not cleaning properly.",
      "The schools differ over classifying some substances (for instance, whether small amounts of certain fluids are excused) and over what trace amounts are tolerated. The workable principle for daily life: clean thoroughly, and do not manufacture doubt about purity where there is no evidence of filth.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "216",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ passed two graves and said their occupants were being punished — one for spreading slander, and the other because he did not shield himself from his urine. (Ibn 'Abbas; also Sahih Muslim 292)",
      },
    ],
  },
  {
    id: "cleaning-clothes",
    section: "najasah",
    title: "Cleaning Clothes from Impurity",
    summary: "How to wash a garment so that praying in it is valid.",
    body: [
      "When najasah gets onto clothing, wash the affected area with water until the substance itself and its visible trace are removed. The Prophet ﷺ instructed a woman whose garment was stained with menstrual blood to scrape it, then rub it with water, then wash it, and to pray in it.",
      "If, after a sincere and thorough effort, a faint colour stain or slight smell remains that will not come out, the majority of scholars excuse what is genuinely difficult to remove — the obligation is to remove the substance, not to guarantee a spotless dye.",
      "Some cases have their own well-known details, such as the urine of a breastfed infant boy (sprinkled rather than fully washed, in a reported concession) — so learn the practical rulings of your school for the situations you actually face.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "291",
        grade: "sahih",
        excerpt:
          "Regarding menstrual blood on a garment: scrape it, then rub it with water, then wash it, and pray in it. (Asma bint Abi Bakr)",
      },
    ],
    actions: [
      "Keep at least one clean garment set aside for prayer.",
      "If filth touches your clothes away from home, rinse what you can and change when possible.",
    ],
  },
  {
    id: "cleaning-body",
    section: "najasah",
    title: "Cleaning the Body",
    summary: "Removing filth from the body, and the etiquette of istinja and hygiene.",
    body: [
      "Filth on the body must be washed off before salah, within one's ability. The most frequent case is cleaning oneself after using the toilet — istinja — which is done with water, or with a suitable dry material, until the area is clean. The Prophet ﷺ taught careful cleaning after relieving oneself and forbade using the right hand for it.",
      "Beyond removing filth, Islam encourages a baseline of natural hygiene (fitrah) that keeps the body clean and ready for worship: trimming the nails, removing underarm and pubic hair, and the like, on a regular basis.",
      "These practices are not merely cultural niceties — they are part of the dignity and cleanliness with which a believer presents themselves before Allah in prayer.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "154",
        grade: "sahih",
        excerpt: "The Prophet ﷺ used to clean himself with water after relieving himself. (Anas)",
      },
    ],
    actions: [
      "Always complete istinja before wudu after using the toilet.",
      "Carry tissues and, where you can, a means of water while travelling.",
    ],
  },
  {
    id: "cleaning-prayer-places",
    section: "najasah",
    title: "Cleaning Prayer Places",
    summary: "The prayer spot must be free of known filth — without baseless doubt.",
    body: [
      "The place of prayer must be free of known najasah. The Prophet ﷺ taught this vividly: when a Bedouin urinated in the corner of the mosque, he stopped the Companions from rebuking him harshly, let him finish, and then ordered a bucket of water poured over the spot — teaching both cleanliness and gentleness.",
      "The governing rule is certainty. The earth was made generally a place of prayer, so a surface is presumed clean unless you have real evidence of filth. If you know impurity is present, remove it or move to a clean spot; if you merely imagine it might be there, ignore the whisper and continue.",
      "This balance guards worship from two extremes: praying carelessly on obviously soiled ground, and being paralysed by unfounded suspicion about every surface.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "220",
        grade: "sahih",
        excerpt:
          "When a Bedouin urinated in the mosque, the Prophet ﷺ ordered a bucket of water to be poured over it. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Glance over your mat and the floor before salah.",
      "Without real evidence of filth, dismiss baseless misgivings and pray.",
    ],
  },

  // ── Exceptions ───────────────────────────────────────────────────────────
  {
    id: "hayd-purity",
    section: "exceptions",
    title: "Hayd and Purity",
    summary: "Menstruation and postnatal bleeding carry their own purification rulings.",
    importance: "obligatory",
    body: [
      "During menstruation (hayd) and postnatal bleeding (nifas), a woman does not pray, and — by a mercy of the religion — the prayers missed in that time are not made up afterward. This is settled: when 'Aishah was asked why the menstruating woman makes up her fasts but not her prayers, she affirmed that this is what they were commanded.",
      "Fasting is different: fasts missed in Ramadan due to menstruation are made up later, while the prayers are simply lifted. When the bleeding ends and a sign of purity appears, the woman performs ghusl and resumes prayer and fasting.",
      "The exact minimum and maximum durations of hayd and nifas, and how to read borderline signs of purity, are matters where the schools differ in detail. Women benefit from learning the practical rulings of one reliable school with a qualified teacher.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "321",
        grade: "sahih",
        excerpt:
          "Asked why a menstruating woman makes up fasts but not prayers, 'Aishah said: we were ordered to make up the fasts and were not ordered to make up the prayers. (Mu'adhah, from 'Aishah; also Sahih Muslim 335)",
      },
    ],
    appLinks: [{ label: "Menstruation (Hayd) module", route: "/hayd" }],
  },
  {
    id: "faq",
    section: "exceptions",
    title: "Frequently Asked Questions",
    summary: "Short answers to the most common purification concerns and doubts.",
    body: [
      "Does doubt break my wudu? No. If you had wudu and are simply unsure whether you broke it, your wudu stands until you are certain of a nullifier. Acting on certainty over suspicion is a prophetic principle that protects you from obsessive doubt (waswas).",
      "What about casts, bandages, and wounds? There are concessions. Where washing a covered limb is harmful, you may wipe over the dressing (mash 'ala al-jabirah) in its place, and tayammum covers what cannot be reached — the details vary by school and situation.",
      "What if I cannot use water at all? Tayammum with clean earth remains fully valid until the ability to use water returns.",
      "What about chronic conditions — continuous bleeding (istihadah) or incontinence? The person is treated as one with a constant excuse (ma'dhur): they clean themselves and make wudu for each prayer's time, then pray even if the discharge continues, and it does not invalidate that prayer.",
    ],
    actions: [
      "Do not let constant doubt block your worship — follow certainty, not suspicion.",
      "For chronic conditions or complex cases, get a personalised ruling from a qualified scholar.",
    ],
    appLinks: [
      { label: "Salah guide", route: "/salah-guide" },
      { label: "Purification and women", route: "/hayd" },
    ],
    disclaimer:
      "These FAQ answers are educational summaries, not a personal fatwa. Complex or chronic cases should be reviewed with a local scholar.",
  },

  // ── Reference ────────────────────────────────────────────────────────────
  {
    id: "references",
    section: "reference",
    title: "References and Further Study",
    summary: "The core Qur'anic verses and hadith chapters on purification.",
    importance: "foundational",
    body: [
      "The foundational Qur'anic text for purification is the ablution verse, Surah al-Ma'idah 5:6, which lays out wudu, ghusl, and tayammum together; alongside it, 2:222 ('Allah loves those who purify themselves') and verses on the purity of water (25:48) anchor the subject.",
      "In the Sunnah, the primary sources are the Books of Purification (Kitab al-Taharah / al-Wudu / al-Ghusl / al-Hayd) that open Sahih al-Bukhari and Sahih Muslim, followed by the same chapters in the four Sunan (Abu Dawud, at-Tirmidhi, an-Nasa'i, Ibn Majah), which gather the finer rulings with grading.",
      "For applied rulings, the classical fiqh manuals of the four Sunni schools give the detailed positions — and their differences are a legitimate part of the tradition, not a defect. Use this module for a structured overview, then deepen your study with a qualified teacher and the primary texts.",
    ],
    quran: [
      { surah: 5, ayahFrom: 6, label: "Qur'an 5:6" },
      { surah: 2, ayahFrom: 222, label: "Qur'an 2:222" },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Kitab al-Wudu (Book 4)",
        grade: "sahih",
        excerpt:
          "The comprehensive chapters on wudu, ghusl, tayammum, and hayd that open the collection.",
      },
      {
        collection: "Sahih Muslim",
        citation: "Kitab al-Taharah (Book 2)",
        grade: "sahih",
        excerpt:
          "The Book of Purification — authentic reports on taharah rulings, etiquette, and principles.",
      },
    ],
    actions: [
      "Follow one trusted curriculum to avoid confusion from scattered rulings.",
      "Revisit these topics periodically until practical confidence is steady.",
    ],
    appLinks: [
      { label: "Salah learning path", route: "/salah-guide" },
      { label: "Prayer duas", route: "/dua/prayer" },
    ],
  },
];
