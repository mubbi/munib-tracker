import type { JahannamTopic } from "../types/jahannam";
import { JAHANNAM_MAJOR_SIN_IDS, JAHANNAM_MAJOR_SIN_TOPICS } from "./jahannam-major-sins";

export * from "./jahannam-collections";
export { JAHANNAM_MAJOR_SIN_IDS, JAHANNAM_MAJOR_SIN_TOPICS };

export const JAHANNAM_CONTENT_VERSION = 3;

export const JAHANNAM_SECTION_ORDER = [
  "intro",
  "understanding",
  "nature",
  "warnings",
  "major-sins",
  "mercy",
] as const;

/**
 * Understanding Jahannam — core lesson topics (excluding individual major sins).
 * Scholar-neutral; every claim cites Qur'an or authentic hadith.
 * Bump the version when content changes.
 */
export const JAHANNAM_CORE_TOPICS: JahannamTopic[] = [
  // ── Introduction ──────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "intro",
    title: "Introduction",
    summary: "Allah informs us about Jahannam for guidance — not despair.",
    importance: "foundational",
    body: [
      "Jahannam — often translated as Hell or the Fire — is the abode of punishment in the Hereafter that Allah describes in the Qur'an and through His Messenger ﷺ. He tells us of it not to crush the heart with dread, but so that hearts may awaken, turn back, and choose the path of mercy while the door is still open.",
      "It helps to understand why a merciful Lord speaks of the Fire at all. A warning is itself a mercy: a person who is told of a cliff ahead in the dark has been given a gift, not a threat. Every verse about Jahannam is Allah, in His kindness, calling His servants back before the time for return has passed.",
      "This is why the warnings are paired throughout revelation with calls to repentance, forgiveness, and hope in Allah's vast mercy. The Qur'an rarely mentions the Fire without, nearby, mentioning the Garden, the open door of tawbah, and Allah's love of those who return. The aim is accountability that leads to righteousness — never despair.",
      "Believing in Jahannam is part of believing in the unseen (al-ghayb), in divine justice, and in the reality of the Last Day. It gives weight to our choices and balances hope in Paradise with seriousness about sin, so that a believer walks between hope and fear — hopeful of Allah's mercy, watchful of his own shortcomings.",
      "A point of comfort central to Sunni belief runs through this whole module: those who die believing in Allah alone, even if burdened by sin, will not remain in the Fire forever. By Allah's mercy and the intercession He permits, sinful believers are ultimately brought out; only those who die rejecting faith remain. So the study of Jahannam is, for the believer, ultimately a study of how to reach mercy.",
      "This module presents what the texts clearly state, notes honestly where scholars have differed, cites only authentic evidence, and consistently directs you toward tawbah, good deeds, and trust in Allah.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 131,
        label: "Qur'an 3:131",
        excerpt:
          "Fear the Fire prepared for the disbelievers — and obey Allah and the Messenger that you may receive mercy.",
      },
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
        excerpt:
          "O you who believe, repent to Allah with sincere repentance — perhaps your Lord will remove from you your misdeeds and admit you into Gardens.",
      },
    ],
    appLinks: [
      { label: "Hope in Allah's mercy", route: "/jahannam/hope-in-mercy" },
      { label: "Journey to Jannah", route: "/jannah" },
    ],
  },

  // ── Understanding ─────────────────────────────────────────────────────────
  {
    id: "why-jahannam",
    section: "understanding",
    title: "Why Allah Created Jahannam",
    summary: "Divine justice, accountability, and the consequences of free choice.",
    importance: "foundational",
    body: [
      "Jahannam exists as a manifestation of Allah's perfect justice ('adl). A universe in which the oppressor and the oppressed, the sincere and the treacherous, all met the same end would not be just. Because Allah is the perfectly Just, there must be a final reckoning where every wrong is answered and every good is honoured.",
      "Central to this is that Allah wrongs no one. Every soul that enters the Fire enters it by its own settled, unrepented choices — never by an arbitrary decree. The Qur'an is emphatic: 'Allah does not wrong the people at all, but the people wrong themselves' (4:40). No one is punished for what they did not do, nor beyond what is deserved.",
      "Human beings were not left in the dark. Allah gave them intellect, sent messengers, and revealed clear guidance, then honoured them with real freedom to accept or reject it: 'Whoever wills — let him believe; and whoever wills — let him disbelieve' (18:29). Persisting in the rejection of truth, in oppression, or in major sin without repentance carries consequences in the Hereafter precisely because the choice was genuinely one's own.",
      "Yet even here mercy frames justice. Allah warns before He judges, delays the reckoning to give room for return, forgives readily when asked, and rewards a single good deed many times over while recording a single sin as one. His justice is never separate from His mercy.",
      "Reflecting on why Jahannam exists should therefore increase taqwa (God-consciousness) and deepen gratitude for every day of life that is still a chance to repent. It is meant to make the heart serious and hopeful at once — never to paralyse it with despair.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 40,
        label: "Qur'an 4:40",
        excerpt: "Indeed, Allah does not wrong the people at all, but the people wrong themselves.",
      },
      {
        surah: 21,
        ayahFrom: 23,
        label: "Qur'an 21:23",
        excerpt: "He is not questioned about what He does, but they will be questioned.",
      },
      {
        surah: 18,
        ayahFrom: 29,
        label: "Qur'an 18:29",
        excerpt:
          "Whoever wills — let him believe; and whoever wills — let him disbelieve. We have prepared for the wrongdoers a Fire.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6467",
        grade: "sahih",
        excerpt:
          "None of you will enter Paradise by his deeds alone. They said: Not even you, O Messenger of Allah? He said: Not even I, unless Allah covers me with His mercy.",
      },
    ],
    appLinks: [{ label: "Learn Aqeedah — divine justice", route: "/aqeedah/belief-qadr" }],
  },
  {
    id: "hereafter-reality",
    section: "understanding",
    title: "Reality of the Hereafter",
    summary: "From death to judgment — every stage is real and linked to aqeedah.",
    body: [
      "To understand Jahannam rightly, it helps to see where it sits in the larger journey. Islam teaches a clear sequence after death: the soul departs the body, then barzakh (the interval life of the grave) begins, then the Resurrection when bodies are raised, the Gathering of all creation, the Judgment where deeds are examined, the weighing of deeds on the Scale (al-Mizan), the crossing of the Bridge (as-Sirat), and finally the settling of each soul in Paradise or the Fire — all by Allah's decree, justice, and mercy.",
      "Each of these stages is affirmed in mainstream Sunni aqeedah on the basis of the Qur'an and authentic Sunnah. This timeline is not a symbol or a story; it is a reality to be believed as part of believing in the Last Day, and denying it knowingly is a matter of creed, not merely of practice.",
      "Seeing the whole road also reframes the Fire. It is one possible destination at the end of a journey every soul is already travelling — which means the choices of today are not abstract. They are steps along that road, and they are still ours to direct.",
      "Knowing this sequence helps a believer prepare rather than fear: to live with a healthy remembrance of death (zikr al-mawt), to repair wrongs before they are carried into the Gathering, and to fill the account of good deeds while the door of action is still open. Death closes that door; nothing can be added after it.",
    ],
    quran: [
      {
        surah: 23,
        ayahFrom: 15,
        ayahTo: 16,
        label: "Qur'an 23:15–16",
        excerpt:
          "Then indeed, after that you are to die. Then indeed you will be resurrected on the Day of Resurrection.",
      },
      {
        surah: 101,
        ayahFrom: 6,
        ayahTo: 9,
        label: "Qur'an 101:6–9",
        excerpt:
          "As for one whose scales are heavy — he will be in a pleasant life. As for one whose scales are light — his refuge will be an abyss.",
      },
    ],
    actions: [
      "Study each stage in Learn Aqeedah and connect belief to daily choices.",
      "Increase remembrance of death (zikr al-mawt) without neglecting hope in mercy.",
    ],
    appLinks: [
      { label: "Aqeedah — the Last Day", route: "/aqeedah/belief-last-day" },
      { label: "Resurrection", route: "/aqeedah/resurrection" },
      { label: "Judgment Day", route: "/aqeedah/judgment-day" },
      { label: "Scale & Sirat", route: "/aqeedah/scale-sirat" },
      { label: "Hell in Aqeedah", route: "/aqeedah/hell" },
      { label: "Paradise in Aqeedah", route: "/aqeedah/paradise" },
    ],
  },

  // ── Nature of Jahannam ────────────────────────────────────────────────────
  {
    id: "names-of-hell",
    section: "nature",
    title: "Names of Hell",
    summary: "Qur'anic names with meanings — scholars differ on whether each is a separate level.",
    body: [
      "The Qur'an refers to Hell by several names, and this is not mere repetition. In Arabic, a name often carries a vivid description within it, so each name teaches something about the reality it points to. Among them are Jahannam, Jaheem, Saqar, Sa'ir, al-Hutamah, al-Hawiyah, and Lazaa.",
      "Each name opens a window onto a different aspect of severity. Jaheem and Sa'ir evoke a fiercely blazing, kindled fire; Saqar, that which scorches and leaves nothing; al-Hutamah, the crusher that breaks whatever is cast into it; al-Hawiyah, a deep abyss into which one falls; and Lazaa, a pure, stripping flame. Reading the names together builds a sober picture the heart cannot easily ignore.",
      "Classical scholars of tafsir — such as Ibn Kathir and al-Tabari — explain these names from their Arabic roots and discuss each in the context of the verse where it appears, rather than treating them as a fixed technical list.",
      "It is worth a word of caution here. Some later writers present each name as a distinct, ranked 'level' of Hell, sometimes with detailed diagrams. That is a scholarly interpretation, not an explicit checklist stated in the Qur'an or in agreed-upon hadith. The balanced approach is to learn the meanings the texts actually give and to avoid presenting speculative maps as certainty.",
      "The purpose of learning the names is not to satisfy curiosity but to soften the heart and move it toward the very mercy this module keeps pointing to. Browse the full names collection for each name's Qur'anic occurrence, context, and tafsir summary.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 206,
        label: "Qur'an 2:206",
        excerpt: "Enough is Hell as a resting place — Jahannam.",
      },
      {
        surah: 104,
        ayahFrom: 4,
        ayahTo: 9,
        label: "Qur'an 104:4–9",
        excerpt: "He will be thrown into al-Hutamah — the crushing Fire.",
      },
    ],
    appLinks: [{ label: "Browse all names", route: "/jahannam/names" }],
  },
  {
    id: "levels-of-hell",
    section: "nature",
    title: "Levels of Hell",
    summary:
      "Different degrees of punishment — the exact structure is not fully detailed in texts.",
    body: [
      "A principle the Qur'an states plainly is that punishment is proportionate: not everyone in the Fire experiences it in the same measure. 'For all there will be degrees according to what they did' (6:132). This is itself an expression of justice — the one who wronged little is not treated like the one who wronged much.",
      "The authentic Sunnah illustrates the same principle. The Prophet ﷺ described the least punished person of the Fire as one under whose feet two embers are placed, from which his brain boils — and yet he is the lightest in torment of all its people (Sahih al-Bukhari 6562). If that is the least, the mind grasps how grave the greater degrees must be, and how much reason there is to turn back today.",
      "At the same time, revelation does not hand believers a complete, numbered map of Hell's structure that they are obliged to memorise. Scholars have discussed levels, depths, and categories drawn from various verses and reports, but much of this remains interpretation rather than agreed, explicit text.",
      "Two things, however, are certain. First, that oppression (dhulm), shirk, and persistent major sin without repentance carry severe warning. Second — and never to be forgotten — that Allah's mercy and forgiveness remain open until the moment of death for anyone who returns to Him sincerely. The point of learning about degrees is to choose the lighter path while choice remains.",
      "Practically, this means treating detailed lists of 'seven levels' or similar schemes as scholarly opinion rather than settled doctrine, and keeping attention on what actually protects: faith, repentance, and righteous deeds.",
    ],
    quran: [
      {
        surah: 6,
        ayahFrom: 132,
        label: "Qur'an 6:132",
        excerpt: "For all there will be degrees according to what they did.",
      },
      {
        surah: 4,
        ayahFrom: 145,
        label: "Qur'an 4:145",
        excerpt:
          "Indeed, the hypocrites will be in the lowest depths of the Fire, and never will you find for them a helper.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6562",
        grade: "sahih",
        excerpt:
          "The least punished of the people of the Fire will be a man under whose feet two embers are placed, from which his brain boils.",
      },
    ],
    disclaimer:
      "Diagrams of Hell's levels found in some books reflect scholarly interpretation, not unanimous agreement.",
  },
  {
    id: "gates-of-hell",
    section: "nature",
    title: "Gates of Hell",
    summary: "Seven gates — what the Qur'an states and where interpretation differs.",
    body: [
      "One detail about Jahannam is stated explicitly and unambiguously in the Qur'an: 'Indeed, Hell has seven gates; for every gate is a designated portion of them' (15:44). Belief in the seven gates therefore rests on clear revelation, not on speculation.",
      "The verse affirms two things: that there are seven gates, and that those who enter are apportioned among them. Classical scholars of tafsir discuss what the apportioning signifies — whether it points to categories of people, to degrees of punishment matched to deeds, or to both. The wisdom behind the division belongs to Allah, whose justice places each soul precisely where it belongs.",
      "It is important to note where certainty ends. Some later works assign each specific gate to a specific sin or group. These particular assignments are not uniformly established in the earliest sources, so they are best presented as the views of individual scholars rather than as prophetic specification.",
      "As with the levels, the lesson of the gates is not architectural but moral: there are many doors that lead toward the Fire, and the way to be safe from all of them is the same — sincere faith, avoidance of major sin, and quick repentance when one slips.",
    ],
    quran: [
      {
        surah: 15,
        ayahFrom: 43,
        ayahTo: 44,
        label: "Qur'an 15:43–44",
        excerpt:
          "And indeed, Hell is the promised place for them all. It has seven gates; for every gate is a portion assigned.",
      },
    ],
    appLinks: [{ label: "Gates in detail", route: "/jahannam/gates" }],
  },
  {
    id: "descriptions",
    section: "nature",
    title: "Descriptions of Jahannam",
    summary: "Fire, heat, chains, regret — presented with reverence, not sensationalism.",
    body: [
      "The Qur'an and authentic Sunnah describe Jahannam with vivid, concrete language, and they do so for a reason: the human heart is moved more by images it can picture than by abstract ideas. The descriptions — intense fire, unbearable heat, restricted food and drink, chains, darkness, and deep regret — are meant to make the danger real enough to steer us away from it.",
      "Among the descriptions are boiling water given to drink, the bitter tree of zaqqum as food, garments cut from fire, and separation from every comfort a person once relied upon. The Prophet ﷺ conveyed how far this heat surpasses anything we know, saying that the fire we kindle in this world is but one part of seventy parts of the Fire of the Hereafter (Sahih al-Bukhari 3265).",
      "These descriptions are real warnings, not mere metaphors that empty the Hereafter of consequence. Sunni scholars affirm their reality while leaving the exact modality of the unseen to Allah's knowledge; the believer's task is to take the warning to heart, not to dissect it.",
      "There is an etiquette (adab) to reading such passages. They are approached with humility, awe of Allah, and an immediate impulse to repent and seek refuge — not with morbid fascination, and never with despair, since the whole purpose of the warning is that we still have time to avoid it.",
      "Perhaps the heaviest theme in these descriptions is regret. 'If only I had…' will be said when the time for action has already closed. The mercy in hearing about that regret now is that we can act on the 'if only' today, while it can still change our end.",
    ],
    quran: [
      {
        surah: 14,
        ayahFrom: 16,
        ayahTo: 17,
        label: "Qur'an 14:16–17",
        excerpt:
          "Before him is Hell, and he will be given foul water to drink. He will gulp it but hardly swallow.",
      },
      {
        surah: 22,
        ayahFrom: 19,
        ayahTo: 22,
        label: "Qur'an 22:19–22",
        excerpt:
          "Garments of fire will be cut for them, and boiling water poured over their heads.",
      },
      {
        surah: 89,
        ayahFrom: 23,
        ayahTo: 26,
        label: "Qur'an 89:23–26",
        excerpt:
          "Hell, on that Day, will be brought forth — on that Day man will remember, but what good to him will be the remembrance?",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3265",
        grade: "sahih",
        excerpt:
          "Your fire is one part of seventy parts of the fire of Hell. It was said: O Messenger of Allah, this fire would have been enough. He said: It has been given the strength of sixty-nine parts more than it, each part being like its heat.",
      },
    ],
    appLinks: [{ label: "Protection from Hell", route: "/jahannam/protection" }],
  },

  // ── Warnings ──────────────────────────────────────────────────────────────
  {
    id: "who-is-warned",
    section: "warnings",
    title: "Who Is Warned?",
    summary: "Categories in the Qur'an and Sunnah — not judgments on individuals.",
    body: [
      "A careful reader of the Qur'an notices that its warnings are aimed at behaviours and attitudes, not at named individuals. It warns those who persist in disbelief after the truth has become clear to them, hypocrites who profess faith outwardly while rejecting it inwardly, oppressors who trample the rights of others, the arrogant who are too proud to submit, and those who die upon major sin without ever repenting.",
      "This focus on categories rather than persons is deliberate and merciful. A door of return stays open for every living person, whatever their past, because no one's file is closed until death. The warning describes the road, so that anyone still walking it can step off.",
      "For this reason, Islam does not permit us to declare the final fate of any specific individual — to say 'this person is in the Fire' — except in the rare cases where Allah or His Messenger ﷺ explicitly stated it in authentic revelation. Judging hearts and endings belongs to Allah alone; our task is our own reckoning.",
      "So the right way to read every warning is to turn it inward: not 'who does this describe?' but 'does any of this describe me, and what will I change today?' Whoever you are, the invitation to return to Allah is open right now — and tomorrow is not promised to anyone.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 145,
        label: "Qur'an 4:145",
        excerpt: "The hypocrites will be in the lowest depth of the Fire.",
      },
      {
        surah: 2,
        ayahFrom: 81,
        label: "Qur'an 2:81",
        excerpt:
          "Whoever earns sin and is engulfed by it — those are the companions of the Fire, abiding eternally.",
      },
      {
        surah: 14,
        ayahFrom: 42,
        label: "Qur'an 14:42",
        excerpt:
          "Do not think Allah is unaware of what the wrongdoers do. He only delays them for a Day when eyes will stare.",
      },
    ],
    appLinks: [{ label: "Major sins", route: "/jahannam/major-sins" }],
  },
  {
    id: "major-sins",
    section: "warnings",
    title: "Major Sins",
    summary: "Kabair — grave sins that require sincere tawbah.",
    body: [
      "Scholars divide sins into two categories, and understanding the difference brings both seriousness and relief. Major sins (al-kaba'ir) are those Allah or His Messenger ﷺ attached a specific severe consequence to — a threat of the Fire, a curse, Allah's anger, or a prescribed penalty — such as shirk, murder, and consuming interest. Minor sins (al-sagha'ir) are the smaller slips that fall short of that threshold.",
      "The relief lies in how the two relate. Allah promises that if a believer avoids the major sins, the minor ones are wiped away by ordinary acts of worship: 'If you avoid the major sins you are forbidden, We will remove from you your lesser sins' (4:31). Prayer to prayer, Jumu'ah to Jumu'ah, and Ramadan to Ramadan expiate what lies between them, so long as the great sins are shunned.",
      "This is why the major sins deserve focused attention: they are the ones that are not simply washed away in the flow of daily worship but call for deliberate, sincere repentance (tawbah). Persisted in without turning back, they endanger the soul; abandoned and repented from, they are forgiven.",
      "And here is the horizon over all of it: with the single exception of dying upon shirk, every sin — major or minor — falls under Allah's forgiveness if He wills. 'Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills' (4:48). No believer should ever conclude that their major sins place them beyond mercy.",
      "Each major sin topic in this module gives its definition, its evidence, why it is grave, and the concrete path of repentance and avoidance — always ending at that same open door. For the Prophet's ﷺ list of seven destructive sins (al-mūbiqāt) and the graded 'greatest sin' answers, see Destructive Sins.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 31,
        label: "Qur'an 4:31",
        excerpt:
          "If you avoid the major sins which you are forbidden, We will remove from you your lesser sins and admit you to a noble entrance.",
      },
      {
        surah: 4,
        ayahFrom: 48,
        label: "Qur'an 4:48",
        excerpt:
          "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills.",
      },
      {
        surah: 53,
        ayahFrom: 32,
        label: "Qur'an 53:32",
        excerpt:
          "Those who avoid major sins and immoralities, only [committing] slight ones — indeed, your Lord is vast in forgiveness.",
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
    appLinks: [
      { label: "Browse major sins", route: "/jahannam/major-sins" },
      { label: "Destructive sins", route: "/jahannam/destructive-sins" },
      { label: "Repentance", route: "/jahannam/repentance" },
    ],
  },
  {
    id: "sins-of-tongue",
    section: "warnings",
    title: "Sins of the Tongue",
    summary: "Backbiting, lying, mockery — sins that are easy to commit and hard to undo.",
    body: [
      "The tongue is small but its consequences are vast; with a few words a person can build trust or destroy a reputation, comfort a heart or wound it deeply. This is why the Qur'an and Sunnah return so often to the sins of speech: backbiting (ghibah), slander (buhtan), tale-carrying (namimah), lying, mockery, and false oaths.",
      "Backbiting means mentioning about your brother or sister something they would dislike, even if it is true — for if it were false, it would be the worse sin of slander. The Qur'an gives it one of its most striking images: it likens it to eating the flesh of one's dead sibling (49:12). Framed that way, the sin loses its casualness.",
      "What makes these sins so dangerous is precisely how easy and habitual they are. People slip into them in ordinary conversation without a second thought, which is why the Prophet ﷺ tied faith itself to guarding speech: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.' A simple pause before speaking is a genuine act of worship.",
      "Repentance from a sin of the tongue follows the usual conditions — stop, regret, resolve not to return — with an added dimension when another person's right is involved. Where clearing their name or seeking their pardon can be done without causing greater harm, that is part of the repentance; where informing them would only deepen the injury, scholars advise instead to speak well of them, defend them in their absence, and pray for their forgiveness.",
    ],
    quran: [
      {
        surah: 49,
        ayahFrom: 12,
        label: "Qur'an 49:12",
        excerpt:
          "Do not backbite one another. Would one of you like to eat the flesh of his dead brother?",
      },
      {
        surah: 104,
        ayahFrom: 1,
        label: "Qur'an 104:1",
        excerpt: "Woe to every scorner and mocker.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6018",
        grade: "sahih",
        excerpt: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
      },
    ],
    actions: [
      "Before speaking, ask: Is it true? Is it necessary? Is it kind?",
      "If you backbit someone, make dua for them and seek their forgiveness where possible.",
    ],
    appLinks: [
      { label: "Daily reflection", route: "/jahannam/reflection" },
      { label: "Jannah — good character", route: "/jannah/character" },
      { label: "Destructive sins", route: "/jahannam/destructive-sins" },
      { label: "Repentance", route: "/jahannam/repentance" },
    ],
  },
  {
    id: "sins-against-others",
    section: "warnings",
    title: "Sins Against Others",
    summary: "Rights of people require restitution — not only repentance to Allah.",
    body: [
      "Islam divides the rights we owe into two kinds: the rights of Allah (huquq Allah) and the rights of people (huquq al-'ibad). Oppression (dhulm), injustice, breaking trusts, cheating in trade, withholding wages, unpaid debts, and severing family ties all fall under the rights of people — and these carry a particular seriousness in the Hereafter.",
      "The reason is shown in a sobering hadith. The Prophet ﷺ described the truly bankrupt person as one who arrives on the Day of Judgment with prayers, fasting, and charity — yet had insulted, slandered, wrongfully taken wealth, and shed blood. His victims are paid from his good deeds until they run out, and then their sins are loaded onto him and he is cast into the Fire (Sahih Muslim 2581). A person can be rich in worship and still be ruined by how he treated others.",
      "This teaches a crucial lesson about repentance: turning to Allah is necessary, but when a human right has been violated, it is not by itself sufficient. The claim of the wronged person remains until it is settled or forgiven. So repentance here has a fourth condition beyond stopping, regretting, and resolving — returning what is owed.",
      "In practice that means giving back what was taken or its value, paying off debts even gradually, restoring reputations one has damaged, and reaching out to reconcile with relatives one has cut off. And there is mercy in this too: every step of restitution is itself a good deed, and Allah eases the sincere heart that sets out to repair what it broke.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 279,
        label: "Qur'an 2:279",
        excerpt:
          "If you do not desist from riba, then take notice of war from Allah and His Messenger.",
      },
      {
        surah: 13,
        ayahFrom: 25,
        label: "Qur'an 13:25",
        excerpt: "Those who break the covenant of Allah and sever what He ordered joined.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2581",
        grade: "sahih",
        excerpt:
          "Do you know who the bankrupt one is? The one who comes with prayer, fasting, and charity, but he insulted, slandered, consumed wealth unlawfully, and shed blood — so his good deeds are given to others.",
      },
    ],
    actions: [
      "List anyone you may have wronged and take a step toward repair this week.",
      "Pay outstanding debts even in small instalments if that is all you can manage.",
    ],
    appLinks: [
      { label: "My Journey", route: "/jahannam/journey" },
      { label: "Repentance", route: "/jahannam/repentance" },
      { label: "Destructive sins", route: "/jahannam/destructive-sins" },
      { label: "Accountability (Last Day)", route: "/last-day/accountability" },
    ],
  },
  {
    id: "hypocrisy",
    section: "warnings",
    title: "Hypocrisy",
    summary: "Major hypocrisy in belief — and traits of hypocrisy in behaviour.",
    body: [
      "Scholars distinguish two kinds of hypocrisy, and keeping them apart prevents both false comfort and false panic. The first is major hypocrisy of belief (nifaq i'tiqadi): to display Islam outwardly while inwardly rejecting faith. This is the hypocrisy the Qur'an warns of most gravely, placing such people 'in the lowest depths of the Fire' (4:145), for in reality they died as disbelievers behind a mask.",
      "The second is lesser, behavioural hypocrisy (nifaq 'amali): traits that resemble the conduct of hypocrites even in a person whose faith is real. The Prophet ﷺ named the well-known signs — 'when he speaks he lies, when he promises he breaks it, and when he is entrusted he betrays' — and in another narration added foulness in dispute. A believer can fall into these and still be a believer, but they are a serious warning to guard against.",
      "This distinction matters greatly for how we use the topic. The behavioural signs are given as a mirror for oneself, not as a label to pin on others. The Prophet ﷺ and his Companions feared hypocrisy in themselves precisely because the heart is hidden and can change.",
      "So the healthy response is inward: to check one's own honesty, faithfulness to promises, and trustworthiness, and to ask Allah for sincerity (ikhlas). Only Allah knows what lies within a person, and accusing specific individuals of hypocrisy is itself a grave transgression against them.",
    ],
    quran: [
      {
        surah: 4,
        ayahFrom: 145,
        label: "Qur'an 4:145",
        excerpt: "The hypocrites will be in the lowest depth of the Fire.",
      },
      {
        surah: 63,
        ayahFrom: 1,
        label: "Qur'an 63:1",
        excerpt:
          "When the hypocrites come to you, they say: We bear witness that you are the Messenger of Allah — and Allah knows they are liars.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "33",
        grade: "sahih",
        excerpt:
          "The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks it, and when he is entrusted he betrays.",
      },
    ],
    disclaimer:
      "Do not accuse individuals of nifaq. The texts warn the community; purification begins with oneself.",
  },
  {
    id: "punishments",
    section: "warnings",
    title: "Punishments Mentioned",
    summary: "What the texts describe — read with fear of Allah and hope in His mercy.",
    body: [
      "The Qur'an and Sunnah do name specific consequences for specific wrongs — for those who devour riba, who slander chaste women, who hoard wealth and withhold its due, who neglect prayer, and who persist in major sin. The specificity is a form of clarity: it leaves no one able to say they were not warned about the very thing they were doing.",
      "Some of these consequences are described in the grave (adhab al-qabr) and others in Jahannam itself. Mainstream Sunni aqeedah affirms the reality of both, while entrusting the exact 'how' of these unseen matters to Allah's knowledge rather than to human imagination.",
      "How a believer engages with all this is what matters. The aim is never to dwell on graphic detail or to let the heart sink; it is to receive the warning, repent from whatever applies, and then turn energy toward the deeds that actually protect. That is why this module deliberately gives more space to protection, repentance, and mercy than to punishment.",
      "In short, the right takeaway from any punishment mentioned is a question, not a fear: 'Am I doing this — and if so, how do I stop and make it right?' Answered honestly today, the warning has already done its merciful work.",
    ],
    quran: [
      {
        surah: 24,
        ayahFrom: 4,
        label: "Qur'an 24:4",
        excerpt:
          "Those who accuse chaste women and do not produce four witnesses — flog them with eighty stripes.",
      },
      {
        surah: 9,
        ayahFrom: 34,
        ayahTo: 35,
        label: "Qur'an 9:34–35",
        excerpt:
          "Those who hoard gold and silver and do not spend them in Allah's cause — give them tidings of a painful punishment.",
      },
    ],
    appLinks: [
      { label: "Protection from Hell", route: "/jahannam/protection" },
      { label: "Hope in mercy", route: "/jahannam/hope-in-mercy" },
    ],
  },

  // ── Mercy & action ────────────────────────────────────────────────────────
  {
    id: "protection",
    section: "mercy",
    title: "Protection from Hell",
    summary: "Tawheed, salah, tawbah, charity, Qur'an, and dua — the heart of this module.",
    importance: "foundational",
    body: [
      "After all the warnings, this is the heart of the matter: Jahannam is something a person is meant to be protected from, and Islam is full of the means of that protection. The greatest of them is sound tawheed — worshipping Allah alone, with nothing beside Him. Every other deed is accepted and weighed only upon this foundation, which is why guarding one's belief comes before everything else.",
      "Upon that foundation, the practical shields are many and within reach: establishing the five daily prayers, sincere repentance, giving charity — which the Prophet ﷺ said extinguishes sin as water extinguishes fire — fasting, reciting the Qur'an and acting on it, good character, mercy toward others, regular remembrance (zikr), and constant seeking of forgiveness. None of these requires great wealth or knowledge; they are open to everyone.",
      "The Prophet ﷺ also taught direct supplications for refuge from the Fire, and encouraged us to ask often. He said that whoever asks Allah for Paradise three times, Paradise itself prays for his admission, and whoever seeks refuge from the Fire three times, the Fire itself prays that he be spared it (Jami' at-Tirmidhi 2572). These du'as have a special place before the salam in prayer and in the morning and evening adhkar.",
      "Notice the balance the Sharia strikes. The means of protection are more numerous, more emphasised, and more attainable than the causes of ruin — and this itself is a sign of Allah's mercy. It is far easier to be saved than to be lost.",
      "This section is intentionally the largest in the module, because that is how Islam itself weighs the matter: warning always paired with hope, and never separated from concrete action a person can begin today.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 16,
        label: "Qur'an 3:16",
        excerpt:
          "Those who say: Our Lord, we have believed, so forgive us our sins and protect us from the punishment of the Fire.",
      },
      {
        surah: 2,
        ayahFrom: 201,
        label: "Qur'an 2:201",
        excerpt:
          "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2572",
        grade: "sahih",
        excerpt:
          "Whoever asks Allah for Paradise three times, Paradise says: O Allah, admit him into Paradise. Whoever seeks refuge from the Fire three times, the Fire says: O Allah, protect him from the Fire.",
      },
    ],
    actions: [
      "Memorise the dua seeking refuge from Jahannam before salam in prayer.",
      "Pray the five daily prayers on time — among the strongest shields.",
      "Give charity regularly, even small amounts.",
    ],
    appLinks: [
      { label: "Duas for protection", route: "/jahannam/duas" },
      { label: "Journey to Jannah", route: "/jannah" },
      { label: "Morning & evening adhkar", route: "/zikr" },
      { label: "Learn Dua", route: "/learn-dua" },
    ],
  },
  {
    id: "repentance",
    section: "mercy",
    title: "Repentance (Tawbah)",
    summary: "Allah accepts sincere repentance — no sin is too great before death.",
    importance: "foundational",
    body: [
      "Tawbah — repentance — is the mechanism Allah has built into the religion so that no sin need be permanent. At its core it is a turning of the heart back toward Allah, and the scholars derive its conditions from the Qur'an and Sunnah: sincerely stop the sin, feel genuine regret for it, and firmly resolve never to return. When the sin involved a right of another person, a fourth condition is added — restoring that right or seeking their pardon.",
      "What makes tawbah so hopeful is the way Allah receives it. He does not merely tolerate the returning servant; He rejoices. The Prophet ﷺ said Allah is more joyful at His servant's repentance than a man who, having lost his mount with all his provisions in a barren desert and given up hope, suddenly finds it standing before him (Sahih al-Bukhari 6309). That is the welcome awaiting anyone who turns back.",
      "His door, moreover, never closes during a lifetime. The Prophet ﷺ said Allah stretches out His hand by night to accept the repentance of the sinner of the day, and stretches out His hand by day to accept the repentance of the sinner of the night (Sahih Muslim 2759). Repentance is accepted for the individual until the soul reaches the throat at death, and for humanity until the sun rises from the west — so there is never a reason to delay it.",
      "This is true even for one who has fallen and repented many times over. As long as the return is sincere each time, Allah keeps accepting; despair is from Shaytan, not from the religion. The one thing that must be settled before death is shirk, since a person who dies upon it dies without the faith that repentance requires — which is exactly why turning fully to Allah alone is the most urgent return of all.",
      "The practical takeaway is simple: repent now, repent often, and never let the size of a sin, or the number of past falls, argue you out of coming back. The invitation is always open.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins. He is the Forgiving, the Merciful.",
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
        citation: "6309",
        grade: "sahih",
        excerpt:
          "Allah is more pleased with the repentance of His servant than one of you who finds his lost mount in a barren land.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2759",
        grade: "sahih",
        excerpt:
          "Allah extends His hand by night to accept the repentance of the sinner of the day, and extends His hand by day to accept the repentance of the sinner of the night, until the sun rises from its west.",
      },
    ],
    actions: [
      "Say Astaghfirullah throughout the day — aim for consistency, not only after major slips.",
      "Learn Sayyid al-Istighfar and recite it morning and evening.",
    ],
    appLinks: [
      { label: "Daily adhkar & istighfar", route: "/zikr" },
      { label: "Learn Dua — forgiveness", route: "/learn-dua/forgiveness-guidance" },
      { label: "Hope in Allah's mercy", route: "/jahannam/hope-in-mercy" },
      { label: "My Journey", route: "/jahannam/journey" },
    ],
  },
  {
    id: "hope-in-mercy",
    section: "mercy",
    title: "Hope in Allah's Mercy",
    summary: "Never despair — good deeds erase sins; consistency matters.",
    importance: "foundational",
    body: [
      "Everything in this module points here. Allah is ar-Rahman ar-Raheem — the Most Merciful — and He has told us that His mercy outweighs His wrath and 'encompasses all things' (7:156). The believer is meant to live between hope and fear, like the two wings of a bird: fearful enough of sin to stay alert, hopeful enough in forgiveness never to give up.",
      "Because of this, despair is itself out of place. However far a person feels they have strayed, the door back is open, and it is Shaytan — not Allah — who whispers that it is too late. To despair of mercy is to think too little of the Most Merciful; the sincere heart's job is simply to return.",
      "Here lies the great comfort of Sunni belief about the Fire. For those who die upon disbelief, Jahannam is a lasting abode. But a believer who dies affirming Allah alone, even if weighed down by major sins, will not remain in it forever. The Prophet ﷺ taught that people will be brought out of the Fire through intercession and then through Allah's own mercy — cast into the River of Life at the edge of Paradise, where they are restored and enter it (Sahih al-Bukhari 7439). He said none will remain in the Fire who has even a mustard-seed's weight of faith in the heart (Sahih Muslim 183). For the monotheist, therefore, the Fire — if it is entered at all — is never the end of the story.",
      "In the meantime, mercy is built into daily life: good deeds wipe away bad ones (11:114), and small, consistent worship — one prayer prayed on time, one quiet act of charity, one moment of patience held for Allah's sake — steadily draws a person nearer to Him and further from harm. Consistency matters more than intensity.",
      "So let this be the conclusion of your study: take the warning seriously, but let hope be louder than fear. Know the danger, choose the path of mercy, and walk it — a step at a time — every day until you meet Allah.",
    ],
    quran: [
      {
        surah: 7,
        ayahFrom: 156,
        label: "Qur'an 7:156",
        excerpt: "My mercy encompasses all things.",
      },
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
      },
      {
        surah: 11,
        ayahFrom: 114,
        label: "Qur'an 11:114",
        excerpt: "Indeed, good deeds remove evil deeds. That is a reminder for those who remember.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7439",
        grade: "sahih",
        excerpt:
          "Allah will say: The angels have interceded, the prophets have interceded, and the believers have interceded, and none remains but the Most Merciful of the merciful. He will take a handful from the Fire and bring out people who never did any good.",
      },
      {
        collection: "Sahih Muslim",
        citation: "183",
        grade: "sahih",
        excerpt:
          "Whoever has in his heart faith the weight of a mustard seed will be taken out of the Fire.",
      },
    ],
    actions: [
      "End each day with istighfar and gratitude for every blessing.",
      "Pair this module with Journey to Jannah — warning and hope together.",
    ],
    appLinks: [
      { label: "Journey to Jannah", route: "/jannah" },
      { label: "Aqeedah — hope & repentance", route: "/aqeedah/hope-repentance" },
      { label: "My Journey", route: "/jahannam/journey" },
    ],
  },
  {
    id: "destructive-sins",
    section: "warnings",
    title: "Destructive Sins",
    summary: "The seven mūbiqāt, the greatest-sin chain, and sins that consume good deeds.",
    importance: "foundational",
    body: [
      "The Qur'an and Sunnah rarely say 'this sin is the heaviest on the Scale.' They warn with other language: the gravest of major sins, the destructive sins (al-mūbiqāt), 'which sin is greatest?', curses, and severe threats. That is a hierarchy of warning — not a Mizan leaderboard. Understanding it helps you prioritise repentance without despair.",
      "The Prophet ﷺ said, 'Avoid the seven destructive sins.' When asked what they were, he listed: associating partners with Allah, magic, killing a soul Allah has forbidden except by right, consuming riba, consuming an orphan's wealth, fleeing the battlefield, and slandering chaste believing women (Sahih al-Bukhari 2766; Sahih Muslim 89). Major sins are not limited to these seven; these are singled out for their extreme ruin.",
      "When a man asked which sin is greatest, the Prophet ﷺ answered in order: setting up a rival to Allah while He created you; killing your child for fear that he will eat with you; then committing adultery with your neighbour's wife (Sahih Muslim 86; Sahih al-Bukhari 4761). The sequence teaches gravity — it does not mean other kabāʾir are light.",
      "Some sins do not only add weight against you — they transfer your good deeds to those you wronged. The bankrupt of the ummah comes with prayer, fasting, and charity, yet had insulted, slandered, taken wealth, and shed blood — so his good deeds are given away, and when they run out others' sins are loaded onto him (Sahih Muslim 2581). Worship does not cancel injustice; settling rights does.",
      "Alongside every warning is hope. Allah says: 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins' (Qur'an 39:53). Dying upon shirk without repentance is the exception the texts make clear (Qur'an 4:48); every other door of tawbah remains open until death.",
    ],
    destructiveItems: [
      {
        id: "shirk",
        order: 1,
        kind: "mubiqah",
        title: "Shirk — associating partners with Allah",
        summary: "The first of the seven destructive sins and the gravest sin.",
        route: "/jahannam/shirk",
      },
      {
        id: "sorcery",
        order: 2,
        kind: "mubiqah",
        title: "Magic (sihr)",
        summary: "Practising sorcery — counted among the seven mūbiqāt.",
        route: "/jahannam/sorcery",
      },
      {
        id: "murder",
        order: 3,
        kind: "mubiqah",
        title: "Killing a soul without right",
        summary: "Taking a life Allah has forbidden except by just cause.",
        route: "/jahannam/murder",
      },
      {
        id: "riba",
        order: 4,
        kind: "mubiqah",
        title: "Consuming riba",
        summary: "Usury and interest — declared a destructive sin.",
        route: "/jahannam/riba",
      },
      {
        id: "orphan-wealth",
        order: 5,
        kind: "mubiqah",
        title: "Consuming an orphan's wealth",
        summary: "Devouring the property of the orphan unjustly.",
        route: "/jahannam/orphan-wealth",
      },
      {
        id: "fleeing-battle",
        order: 6,
        kind: "mubiqah",
        title: "Fleeing the battlefield",
        summary: "Turning back when the army advances — one of the seven.",
        route: "/jahannam/major-sins",
      },
      {
        id: "slander-chaste",
        order: 7,
        kind: "mubiqah",
        title: "Slandering chaste believing women",
        summary: "Accusing chaste, unaware believing women of zina.",
        route: "/jahannam/sins-of-tongue",
      },
      {
        id: "bankrupt",
        order: 8,
        kind: "bankrupt",
        title: "The bankrupt person",
        summary:
          "Prayer, fasting, and charity can be taken away to settle rights of those you wronged.",
        route: "/last-day/accountability",
      },
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Most Forgiving, the Most Merciful.",
      },
      {
        surah: 4,
        ayahFrom: 48,
        label: "Qur'an 4:48",
        excerpt:
          "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills.",
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
        citation: "2766",
        grade: "sahih",
        excerpt:
          "Avoid the seven destructive sins: shirk, magic, killing a soul without right, consuming riba, consuming an orphan's wealth, fleeing the battlefield, and slandering chaste believing women.",
      },
      {
        collection: "Sahih Muslim",
        citation: "89",
        grade: "sahih",
        excerpt:
          "Avoid the seven noxious things — shirk, magic, killing without right, consuming an orphan's property, consuming usury, turning back when the army advances, and slandering chaste believing women.",
      },
      {
        collection: "Sahih Muslim",
        citation: "86",
        grade: "sahih",
        excerpt:
          "Which sin is greatest? That you set up a rival to Allah while He created you; then that you kill your child for fear he will eat with you; then that you commit adultery with your neighbour's wife.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "4761",
        grade: "sahih",
        excerpt:
          "Which is the biggest sin? That you set up a rival to Allah though He Alone created you — then kill your son fearing he may share your meals — then commit illegal intercourse with the wife of your neighbour.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2581",
        grade: "sahih",
        excerpt:
          "The bankrupt of my ummah comes with prayer, fasting and charity, but insulted, slandered, and wronged others — so his good deeds are given to them, and when they run out their sins are placed on him.",
      },
    ],
    actions: [
      "Review the seven destructive sins and repent from any you have approached.",
      "Settle rights of people — debts, wealth, and reputation — before the Day of Reckoning.",
      "Pair warning with hope: recite Qur'an 39:53 and renew tawbah daily.",
    ],
    appLinks: [
      { label: "Major sins overview", route: "/jahannam/major-sins" },
      { label: "Sins against others", route: "/jahannam/sins-against-others" },
      { label: "Accountability (Last Day)", route: "/last-day/accountability" },
      { label: "Repentance", route: "/jahannam/repentance" },
    ],
  },
];

export const JAHANNAM_TOPICS: JahannamTopic[] = [
  ...JAHANNAM_CORE_TOPICS,
  ...JAHANNAM_MAJOR_SIN_TOPICS,
];
