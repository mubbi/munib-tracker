import type { LastDayTopic } from "../types/last-day";

export { LAST_DAY_HADITH } from "./last-day-hadith";
export { LAST_DAY_QUIZ } from "./last-day-quiz";
export { LAST_DAY_REFERENCES } from "./last-day-references";
export { LAST_DAY_TIMELINE } from "./last-day-timeline";
export { LAST_DAY_VERSES } from "./last-day-verses";

/**
 * The Day of Judgment — from death through eternal life according to Qur'an
 * and authentic Sunnah. Mainstream Sunni; where scholars differ on the
 * sequence or interpretation of details this is noted respectfully, and
 * weak or fabricated "end times" material is deliberately excluded.
 * Bump version on change.
 */
export const LAST_DAY_CONTENT_VERSION = 2;

export const LAST_DAY_SECTION_ORDER = [
  "intro",
  "journey",
  "signs",
  "events",
  "outcomes",
  "practice",
] as const;

export const LAST_DAY_TOPICS: LastDayTopic[] = [
  // ── Introduction ───────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "intro",
    title: "Introduction",
    summary: "What is the Last Day, and why does it change how we live today?",
    importance: "foundational",
    body: [
      "Yawm al-Qiyamah — the Day of Standing, Resurrection and Judgment — is the day every soul returns to Allah to be shown its deeds and given its final abode. It is not a distant legend or a poetic image. The Qur'an mentions it on almost every page, and the earliest Meccan surahs are dominated by it precisely because belief in it reorders a person's whole life. When you truly expect to stand before Allah, honesty, prayer, kindness and restraint stop being optional decorations and become the substance of who you are.",
      "This module walks the journey stage by stage: death and the soul's departure, the interval of barzakh in the grave, the minor and major signs that precede the Hour, the blowing of the Trumpet, the resurrection of bodies, the gathering on one vast plain, the handing out of the records, the Scale, the reckoning, the Prophet's Pond and intercession, the crossing of the Bridge, and finally the two eternal homes — Paradise and Hell. Each stage is drawn from the Qur'an and authentic hadith.",
      "Two principles govern everything here. First, the reality of these events is certain and is a matter of creed (aqeedah); to deny resurrection or accountability is to deny the religion itself. Second, the exact timing of the Hour is known to Allah alone — no scholar, calendar or calculation can predict it, and every claim to a date is false. The Prophet ﷺ never gave his companions a countdown; he gave them a way to live. So the aim of studying the Last Day is preparation, not prediction: to soften the heart, correct priorities, and race toward good before the appointed moment arrives.",
      "A note on sources: popular 'signs of the end times' talks are full of weak and even fabricated narrations. This module includes only what is authentic, and where sincere Sunni scholars genuinely differ — for example on the order of some major signs — that difference is presented as a difference, not smoothed over or exaggerated.",
    ],
    quran: [
      {
        surah: 99,
        ayahFrom: 1,
        ayahTo: 8,
        label: "Qur'an 99:1–8",
        excerpt:
          "When the earth is shaken with its final earthquake, and it throws out its burdens, and man cries: What is with it? — that Day it will report its news, because your Lord has inspired it. That Day people will depart in separate groups to be shown their deeds; so whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.",
      },
      {
        surah: 40,
        ayahFrom: 15,
        ayahTo: 16,
        label: "Qur'an 40:15–16",
        excerpt:
          "He places the inspiration of His command upon whom He wills of His servants to warn of the Day of Meeting — the Day they come forth, nothing concerning them concealed from Allah. To whom belongs sovereignty this Day? To Allah, the One, the Prevailing.",
      },
    ],
    appLinks: [
      { label: "Timeline of the Hereafter", route: "/last-day/timeline" },
      { label: "Learn Aqeedah", route: "/aqeedah" },
    ],
  },
  {
    id: "why-believe",
    section: "intro",
    title: "Why believe in the Last Day?",
    summary: "One of the six articles of faith — motivation, hope, and ultimate justice.",
    importance: "foundational",
    body: [
      "Belief in the Last Day is one of the six articles of Iman that the Prophet ﷺ named when the angel Jibril came to teach the religion: to believe in Allah, His angels, His books, His messengers, the Last Day, and in the divine decree, its good and its harm (Sahih Muslim 8). Without this belief the whole structure of accountability collapses — for if there is no return to Allah, then the tyrant and the saint end the same, and every act of worship becomes a habit with no ultimate meaning.",
      "The Qur'an argues for the Last Day both morally and rationally. Morally: it is the answer to injustice, for a world in which oppressors die comfortably in their beds and the oppressed die unavenged cannot be the end of the story if Allah is truly just. Rationally: the One who created you from nothing the first time is not incapable of restoring you a second time (Qur'an 36:78–79). Resurrection is easier, not harder, than the original creation.",
      "This belief also disciplines the two engines of the heart — fear and hope — and keeps them in balance. The warnings are real, so the believer does not grow arrogant or heedless; yet Allah's mercy is vast and the door of repentance stays open until death, so the believer never despairs. A heart that lives between fear and hope is a heart that keeps striving without breaking.",
      "Practically, the Last Day gives dignity to the powerless and restraint to the powerful. It tells the wronged that no injury is forgotten by Allah, and it tells the strong that no wealth, status or influence will shield them at the reckoning. Belief in it is therefore not a private comfort but a source of justice, patience and integrity in this world.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 177,
        label: "Qur'an 2:177",
        excerpt:
          "Righteousness is not that you turn your faces toward the east or the west, but righteous is the one who believes in Allah, the Last Day, the angels, the Book and the prophets, and gives wealth, despite love for it, to relatives, orphans, the needy, the traveller and those who ask.",
      },
      {
        surah: 14,
        ayahFrom: 42,
        label: "Qur'an 14:42",
        excerpt:
          "Never think that Allah is unaware of what the wrongdoers do. He only delays them for a Day when eyes will stare in horror.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt:
          "Iman is that you believe in Allah, His angels, His books, His messengers, the Last Day, and that you believe in the divine decree, its good and its harm. — from the hadith of Jibril, when he came to teach the religion.",
      },
    ],
    actions: [
      "Renew your intention each day: my deeds are for Allah and for the Day I will meet Him.",
      "When injustice pains you and no earthly court answers, entrust it to the Court of the Last Day.",
      "Keep fear and hope together — let neither fear crush you into despair nor hope lull you into neglect.",
    ],
    appLinks: [{ label: "Six articles of faith", route: "/aqeedah/six-articles" }],
  },

  // ── Journey: Death & Barzakh ──────────────────────────────────────────────
  {
    id: "death",
    section: "journey",
    title: "Death",
    summary: "Every soul will taste death — husn al-khatimah and what benefits the deceased.",
    body: [
      "Death is the one appointment no one misses. The Qur'an states it plainly: every soul will taste death, and full recompense is given only on the Day of Resurrection (Qur'an 3:185). Death is not annihilation but a transfer — the soul leaves the body and moves to the next stage of its journey. The Angel of Death, entrusted by Allah, takes the soul, and then to your Lord you are returned (Qur'an 32:11).",
      "Because the manner of death matters, the believer works toward a good ending — husn al-khatimah — through sincere repentance, steady prayer, and good character, hoping to die in a state Allah is pleased with. A bad ending — su' al-khatimah — is feared for a person who persists in sin and turns away without repenting. Yet the mercy in this is immense: the door of tawbah stays open until the death-rattle reaches the throat, so no one should ever conclude that it is too late while breath remains.",
      "The Prophet ﷺ taught frequent remembrance of death — 'Remember often the destroyer of pleasures,' meaning death (Jami' at-Tirmidhi 2307, hasan) — not to make us morbid but to keep us awake. Remembering death shrinks the grip of this world, dissolves grudges, and reorders what actually matters. Details of the soul's departure that appear only in weak reports are best left aside; the authentic material is enough to instil awe and readiness.",
      "Death also closes the ledger of deeds — with three exceptions. The Prophet ﷺ said that when a person dies his deeds are cut off except for three: ongoing charity (sadaqah jariyah), knowledge that continues to benefit, and a righteous child who prays for him (Sahih Muslim 1631). This is deeply practical: it means that what you build, teach, and raise while alive can keep earning for you long after you are gone.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 185,
        label: "Qur'an 3:185",
        excerpt:
          "Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection. So whoever is drawn away from the Fire and admitted to Paradise has succeeded. And the life of this world is only the enjoyment of delusion.",
      },
      {
        surah: 32,
        ayahFrom: 11,
        label: "Qur'an 32:11",
        excerpt:
          "Say: The Angel of Death, who has been entrusted with you, will take you; then to your Lord you will be returned.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1631",
        grade: "sahih",
        excerpt:
          "When a person dies, his deeds come to an end except for three: ongoing charity, knowledge from which benefit is gained, or a righteous child who supplicates for him.",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2307",
        grade: "hasan",
        excerpt: "Remember often the destroyer of pleasures — meaning death.",
      },
    ],
    actions: [
      "Increase istighfar and pray on time — especially while you are healthy and busy, not only when ill.",
      "Repent today for anything specific you are delaying; do not gamble on tomorrow.",
      "Invest in the three lasting deeds: build ongoing charity, spread beneficial knowledge, and raise children upon tawheed and good character.",
    ],
    appLinks: [
      { label: "Learn Dua — supplications", route: "/learn-dua" },
      { label: "Zakat & charity", route: "/zakat" },
    ],
  },
  {
    id: "barzakh",
    section: "journey",
    title: "Barzakh (life in the grave)",
    summary: "The interval after death until resurrection — questioning and its consequences.",
    body: [
      "Barzakh means a barrier, and it is the name for the entire interval between a person's death and the Day of Resurrection. The Qur'an uses the word when the dead wrongdoer begs to be sent back: 'Behind them is a barrier (barzakh) until the Day they are resurrected' (Qur'an 23:100) — a firm wall through which there is no return to this life. Whether a body is buried, burned, drowned or lost, the soul enters barzakh; the grave is simply its most common form, and the first stage of the Hereafter for every human being.",
      "Authentic reports describe a questioning after burial. Two angels come and ask the deceased three questions: Who is your Lord? What is your religion? Who is this man who was sent to you? The believer whom Allah keeps firm answers: My Lord is Allah, my religion is Islam, and this is Muhammad ﷺ; the grave is then widened and lit for him. The one who was heedless says, 'Ah, I do not know,' and meets constriction (Jami' at-Tirmidhi 1071, hasan, where the two angels are named Munkar and Nakir). This is why the Qur'an praises Allah for keeping the believers firm 'with the firm word in the worldly life and in the Hereafter' (Qur'an 14:27).",
      "Bliss or punishment then follows in the grave, affirmed in authentic texts: 'The grave is either a garden from the gardens of Paradise or a pit from the pits of the Fire' (Jami' at-Tirmidhi 2460, hasan sahih). The Qur'an alludes to the punishment of Pharaoh's people being exposed to the Fire 'morning and evening' before the Hour even arrives (Qur'an 40:46). Ahl al-Sunnah affirm the reality of grave reward and punishment while leaving its exact nature to Allah, since it belongs to the unseen and cannot be perceived by the living.",
      "There is agreement that grave questioning and the grave's bliss or torment are real; scholars discuss finer points — such as whether it touches the body, the soul, or both, and how it reaches those with no ordinary grave — without letting those questions distract from the point. Barzakh is the great motivator: it turns the grave from a hole in the ground into a mirror of one's own deeds, and it makes clear that what you send ahead is what will greet you there.",
    ],
    quran: [
      {
        surah: 23,
        ayahFrom: 99,
        ayahTo: 100,
        label: "Qur'an 23:99–100",
        excerpt:
          "Until, when death comes to one of them, he says: My Lord, send me back, that I might do righteousness in that which I left behind. No! It is only a word he is saying; and behind them is a barrier until the Day they are resurrected.",
      },
      {
        surah: 40,
        ayahFrom: 46,
        label: "Qur'an 40:46",
        excerpt:
          "The Fire — they are exposed to it morning and evening. And the Day the Hour appears it will be said: Admit the people of Pharaoh to the severest punishment.",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2460",
        grade: "hasan",
        excerpt:
          "The grave is either a garden from the gardens of Paradise or a pit from the pits of the Fire.",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "1071",
        grade: "hasan",
        excerpt:
          "When the deceased is buried, two angels come to him and ask him: Who is your Lord? What is your religion? Who is your prophet? The believer answers with certainty and his grave is expanded and lit for him.",
      },
    ],
    misconceptions: [
      "Misconception: Grave punishment is a folk belief with no basis. Correction: The reality of questioning and of grave bliss or torment is established in authentic hadith and alluded to in the Qur'an; it is a settled point of Sunni creed.",
      "Misconception: We should argue over the exact appearance and names of the angels. Correction: The naming of Munkar and Nakir comes in a hasan report; the core belief is the questioning itself. Preparing to answer it truthfully matters far more than debating its details.",
    ],
    actions: [
      "Hold fast to tawheed and the Sunnah now — the grave's answers are not memorised there but lived here.",
      "Guard the morning and evening adhkar, which the Prophet ﷺ taught as protection and steadfastness.",
    ],
    appLinks: [{ label: "Morning & evening adhkar", route: "/zikr" }],
  },

  // ── Signs ──────────────────────────────────────────────────────────────────
  {
    id: "signs-overview",
    section: "signs",
    title: "Signs of the Last Day",
    summary: "Minor and major signs — certainty of the Hour, unknown timing.",
    body: [
      "The arrival of the Hour is certain, but its timing is a secret Allah has kept to Himself. When even the Prophet ﷺ was asked when it would come, the answer given was that the one asked knows no more than the one asking — its knowledge is with Allah alone (Qur'an 7:187). So the very first thing to settle before studying any 'sign' is this: signs are given to prepare us, never to let us calculate a date. Anyone who names a year for the Hour has contradicted the Qur'an.",
      "Scholars group the portents into two kinds. The minor signs (al-'alamat al-sughra) are gradual social, moral and worldly changes that build up over the long centuries before the end. The major signs (al-'alamat al-kubra) are a cluster of extraordinary, unmistakable events that come close together near the very end. The Qur'an notes that 'some of its signs have already come' (Qur'an 47:18) — a reference understood to include the coming of the Prophet ﷺ himself and the splitting of the moon.",
      "The anchor text for the major signs is the hadith of Hudhayfah ibn Usayd, in which the Prophet ﷺ listed ten: the smoke (Dukhan), the Dajjal, the Beast of the earth (Dabbat al-Ard), the rising of the sun from its place of setting (the west), the descent of 'Isa ibn Maryam, Ya'juj and Ma'juj (Gog and Magog), and three great landslides — one in the east, one in the west, and one in the Arabian Peninsula — sealed by a fire that drives people to their place of gathering (Sahih Muslim 2901). Al-Mahdi and the Dajjal come in other authentic reports and are placed before the descent of 'Isa.",
      "The honest scholarly position is that while each sign is affirmed, their exact order is not fully fixed by the texts, and reputable Sunni scholars differ over the precise sequence. That difference is a normal part of the tradition and no cause for dispute. The prophetic response to all of it is not fear-mongering or endless speculation about current events, but increased iman, repentance, and beneficial action.",
    ],
    quran: [
      {
        surah: 7,
        ayahFrom: 187,
        label: "Qur'an 7:187",
        excerpt:
          "They ask you about the Hour: when is its arrival? Say: Its knowledge is only with my Lord. None will reveal its time except Him. It lies heavy in the heavens and the earth. It will not come upon you except unexpectedly.",
      },
      {
        surah: 47,
        ayahFrom: 18,
        label: "Qur'an 47:18",
        excerpt:
          "Do they await except that the Hour should come upon them suddenly? Some of its signs have already come. But how, when it has come upon them, will they be reminded?",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2901",
        grade: "sahih",
        excerpt:
          "The Hour will not come until you see ten signs before it: the smoke, the Dajjal, the Beast, the rising of the sun from the west, the descent of 'Isa son of Maryam, Ya'juj and Ma'juj, three landslides — one in the east, one in the west and one in the Arabian Peninsula — and the last of them a fire that drives the people to their gathering.",
      },
    ],
    appLinks: [
      { label: "Minor signs", route: "/last-day/minor-signs" },
      { label: "Major signs", route: "/last-day/major-signs" },
    ],
  },
  {
    id: "minor-signs",
    section: "signs",
    title: "Minor signs",
    summary: "Gradual changes the Prophet ﷺ described — preparation over panic.",
    body: [
      "The minor signs are the slow, cumulative shifts in society, morality and the state of knowledge that the Prophet ﷺ described as increasing the closer the Hour draws. They are many, and by their nature they unfold over long stretches of time rather than in a single dramatic moment. The greatest minor sign of all, in fact, has already occurred: the sending of the Prophet Muhammad ﷺ himself, who said, 'I and the Hour were sent like these two,' joining his two fingers — meaning the final messenger and the final age had begun.",
      "Among the signs stated in authentic hadith: the loss of trustworthiness, so that affairs are handed to those unfit for them — 'When trust is lost, then await the Hour,' and this happens 'when authority is given to those who do not deserve it' (Sahih al-Bukhari 6496). In the famous hadith of Jibril, the Prophet ﷺ named two vivid signs: 'that the slave-girl will give birth to her mistress, and that you will see barefoot, naked, destitute shepherds competing in constructing tall buildings' (Sahih Muslim 8).",
      "Others include a general acceleration in the feel of time, the increase of earthquakes and killing, and the disappearance of knowledge. On knowledge, the Prophet ﷺ was precise about the mechanism: 'The Hour will not be established until knowledge is taken away, earthquakes increase, time passes quickly, tribulations appear, and killing increases' (Sahih al-Bukhari 1036). And he explained how knowledge departs: 'Allah does not remove knowledge by snatching it from people, but by taking away the scholars, until none is left, and people take the ignorant as leaders who are asked and give verdicts without knowledge, so they go astray and lead others astray' (Sahih al-Bukhari 100). So 'loss of knowledge' is not a shortage of information — an age can be drowning in data — but the loss of sound scholars and lived practice.",
      "A crucial discipline here: it is interpretive, not certain, to declare that a specific modern event 'is' a particular hadith fulfilled. Skyscraper competitions or rising crime may echo the Prophet's words, but assigning revelation to headlines with confidence is not the way of careful scholars. The correct response to every minor sign is inward: read it as a summons to return to Allah, to learn and act upon the religion, and to hold fast to trustworthiness and truthfulness — not as material for anxiety or spectacle.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6496",
        grade: "sahih",
        excerpt:
          "When trust is lost, await the Hour. It was asked: How will it be lost, O Messenger of Allah? He said: When authority is given to those who do not deserve it, await the Hour.",
      },
      {
        collection: "Sahih Muslim",
        citation: "8",
        grade: "sahih",
        excerpt:
          "Among the signs of the Hour: that the slave-girl will give birth to her mistress, and that you will see barefoot, naked, destitute shepherds competing in the construction of tall buildings. — from the hadith of Jibril.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "100",
        grade: "sahih",
        excerpt:
          "Allah does not remove knowledge by snatching it away, but He removes it by taking the scholars, until none remains and people take the ignorant as leaders who give verdicts without knowledge, so they stray and lead others astray.",
      },
    ],
    disclaimer:
      "Applying specific minor signs to particular current events is interpretive, not certain. This module presents the authentic hadith without asserting which modern phenomena definitively fulfil them.",
    actions: [
      "Seek beneficial knowledge from qualified teachers, act on it, and pass it on — this directly resists the sign of vanishing knowledge.",
      "Guard trustworthiness and truthfulness in your speech, work and dealings.",
      "Read every sign inwardly as a call to repentance, not as fuel for panic or online speculation.",
    ],
  },
  {
    id: "major-signs",
    section: "signs",
    title: "Major signs",
    summary: "The ten major signs in Sahih Muslim — Mahdi, Dajjal, 'Isa, and more.",
    body: [
      "The major signs are the great, unmistakable events that cluster near the very end of time. Their charter is the hadith of Hudhayfah ibn Usayd: the Prophet ﷺ looked out on his companions discussing the Hour and said it would not come until they saw ten signs — the smoke (Dukhan), the Dajjal, the Beast of the earth (Dabbat al-Ard), the rising of the sun from the west, the descent of 'Isa ibn Maryam, Ya'juj and Ma'juj, three landslides (east, west and in Arabia), and finally a fire that drives people to their place of gathering (Sahih Muslim 2901). Unlike the minor signs, once these begin they follow one another closely.",
      "Al-Mahdi comes in authentic reports as a just leader from the Prophet's ﷺ household who will fill the earth with justice as it had been filled with oppression (Sunan Abi Dawud 4282, hasan). He is not a lawgiver or a new prophet — he revives, he does not invent — and belief in him is affirmed by Ahl al-Sunnah while extra details in weak narrations are set aside.",
      "The Dajjal (the false messiah) is the single greatest worldly trial. The Prophet ﷺ described him at length in the long hadith of al-Nawwas ibn Sam'an (Sahih Muslim 2937): a one-eyed deceiver with 'Kafir' written between his eyes, granted power to test faith, whom every prophet warned his people about. His fitnah is defeated not by argument but by firm belief, and the Prophet ﷺ taught memorising the opening verses of Surat al-Kahf as protection.",
      "'Isa ibn Maryam (peace be upon him) will then descend — a firm point of Sunni creed. The Prophet ﷺ said: 'By the One in whose Hand is my soul, the son of Maryam will soon descend among you as a just ruler; he will break the cross, kill the swine, and abolish the jizyah, and wealth will overflow until no one accepts it' (Sahih al-Bukhari 3448). He descends as a follower of Muhammad ﷺ, prays behind the ummah's imam (Sahih al-Bukhari 3439), kills the Dajjal, and rules by the Sharia of Muhammad ﷺ. Ya'juj and Ma'juj are then released, and the remaining signs unfold until the fire that gathers mankind.",
      "Two points of honesty. First, scholars agree on the reality of every sign in the ten-signs hadith but differ on their precise order, and that difference is legitimate and old. Second, the Dukhan and the Beast are part of this sahih hadith itself; some other narrations detailing them individually vary in strength, so this module rests the belief on the strong ten-signs report rather than on the weaker add-ons.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2901",
        grade: "sahih",
        excerpt:
          "The Hour will not come until you see ten signs: the smoke, the Dajjal, the Beast, the rising of the sun from the west, the descent of 'Isa son of Maryam, Ya'juj and Ma'juj, and three landslides — one in the east, one in the west and one in the Arabian Peninsula — the last of them a fire that drives the people to their gathering.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "3448",
        grade: "sahih",
        excerpt:
          "By the One in whose Hand is my soul, the son of Maryam will soon descend among you as a just ruler. He will break the cross, kill the swine, and abolish the jizyah, and wealth will become so abundant that no one will accept it.",
      },
      {
        collection: "Sunan Abi Dawud",
        citation: "4282",
        grade: "hasan",
        excerpt:
          "If only one day of this world remained, Allah would lengthen that day until He raised in it a man from my family (the Mahdi) who will fill the earth with justice as it had been filled with injustice and oppression.",
      },
    ],
    disclaimer:
      "The reality of the major signs is affirmed, but their exact sequence and timing are not fully agreed upon by scholars. Avoid date-setting and avoid claiming any present-day figure is the Mahdi, the Dajjal, or 'Isa.",
    appLinks: [{ label: "Learn Aqeedah — signs", route: "/aqeedah/signs-last-day" }],
  },

  // ── Events of the Last Day ─────────────────────────────────────────────────
  {
    id: "trumpet",
    section: "events",
    title: "The Trumpet",
    summary: "Israfil — first blast, second blast, and resurrection.",
    body: [
      "When Allah decrees the end, the angel entrusted with the Trumpet (the Sur) will blow it. Naming him Israfil comes through the scholarly tradition; what the Qur'an fixes firmly is the event itself and its terror. The Prophet ﷺ conveyed how imminent it always is: 'How can I be at ease when the bearer of the Trumpet has placed it to his mouth, bent his forehead, and is waiting for the command to blow?' — and when this distressed the companions he taught them to say, 'Allah is sufficient for us, and He is the best Disposer of affairs' (Jami' at-Tirmidhi 2431, hasan).",
      "There are two blasts, and the Qur'an distinguishes them. At the first, 'the Trumpet will be blown, and whoever is in the heavens and the earth will fall dead, except whom Allah wills' (Qur'an 39:68) — the blast of terror and death that ends the created order. Then comes the second: 'then it will be blown again, and at once they will be standing, looking on' (the same verse continues) — the blast of resurrection, at which all creation rises from the dead.",
      "Many scholars, from the same verse and supporting reports, speak of an exception — those 'whom Allah wills' who are not struck down — and of an interval between the two blasts, though its length and details rest on reports of varying strength and are left to Allah. The certainty is the pair of blasts: an ending, then a raising. This is called 'the Day of Warning' (Qur'an 50:20) because it is the last summons, sounded when there is no longer any time to prepare — which is precisely why the summons must be answered now.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 68,
        label: "Qur'an 39:68",
        excerpt:
          "And the Trumpet will be blown, and whoever is in the heavens and whoever is on the earth will fall dead, except whom Allah wills. Then it will be blown again, and at once they will be standing, looking on.",
      },
      {
        surah: 50,
        ayahFrom: 20,
        label: "Qur'an 50:20",
        excerpt: "And the Trumpet will be blown. That is the Day of Warning.",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2431",
        grade: "hasan",
        excerpt:
          "How can I be at ease when the bearer of the Trumpet has placed it to his mouth and bent his forehead, waiting for the command to blow? The companions were distressed, so he told them to say: Allah is sufficient for us, and He is the best Disposer of affairs.",
      },
    ],
  },
  {
    id: "resurrection",
    section: "events",
    title: "Resurrection",
    summary: "Bodies restored — universality of standing before Allah.",
    body: [
      "At the second blast the dead are raised, body and soul, and the resurrection is real and physical, not merely spiritual. The Qur'an meets the doubter's sneer head-on: a man holds up a crumbling bone and asks who could give it life; the reply is, 'Say: He will give it life who produced it the first time, and He is Knowing of all creation' (Qur'an 36:78–79). If bringing you into being from nothing was within Allah's power, restoring you is no harder.",
      "The resurrection is universal — every human from the first to the last, of every nation, is raised. The Prophet ﷺ described the state in which people rise: 'People will be gathered barefoot, naked and uncircumcised.' When Aisha asked in dismay whether men and women would look at one another, he said the matter of that Day would be too grave for that to concern anyone (Sahih al-Bukhari 6527). He also said, 'You will be gathered barefoot, naked and uncircumcised — and the first to be clothed on the Day of Resurrection will be Ibrahim' (Sahih al-Bukhari 3349).",
      "The point of the doctrine is not the spectacle but the responsibility it enforces. Because the return to Allah is certain, no deed is truly private and no death is truly an escape. 'The Hour is coming — there is no doubt about it — and Allah will resurrect those in the graves' (Qur'an 22:7). Belief in bodily resurrection is what makes the moral weight of this life real rather than provisional.",
    ],
    quran: [
      {
        surah: 36,
        ayahFrom: 78,
        ayahTo: 79,
        label: "Qur'an 36:78–79",
        excerpt:
          "And he presents for Us an example and forgets his own creation, saying: Who will give life to bones while they are decayed? Say: He will give them life who produced them the first time, and He is Knowing of all creation.",
      },
      {
        surah: 22,
        ayahFrom: 7,
        label: "Qur'an 22:7",
        excerpt:
          "And that the Hour is coming — there is no doubt about it — and that Allah will resurrect those who are in the graves.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3349",
        grade: "sahih",
        excerpt:
          "You will be gathered barefoot, naked and uncircumcised. Then he recited: As We began the first creation, We will repeat it. And the first to be clothed on the Day of Resurrection will be Ibrahim.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "6527",
        grade: "sahih",
        excerpt:
          "People will be gathered barefoot, naked and uncircumcised. Aisha said: Will the men and women look at one another? He said: The matter will be too grave for that.",
      },
    ],
  },
  {
    id: "gathering",
    section: "events",
    title: "The Gathering (Mahshar)",
    summary: "Standing before Allah — sun near, sweat, and the states of people.",
    body: [
      "After resurrection, all creation is driven onto one vast, level plain — the Mahshar — to await judgment. The earth itself is transformed: 'The Day the earth will be replaced by another earth, and the heavens as well, and they will come out before Allah, the One, the Prevailing' (Qur'an 14:48). There are no landmarks, no crowds to hide in, no status to lean on — only every soul, exposed and waiting.",
      "The conditions of that standing are severe. The Prophet ﷺ said, 'On the Day of Resurrection the sun will be brought so near to people that it will be a mile away, and they will sink in their sweat according to their deeds — some to their ankles, some to their knees, some to their waists, and some the sweat will bridle' (Sahih Muslim 2864). Yet the same reports describe mercy distributed by deeds: a category the Prophet ﷺ named will be shaded in the shade of Allah's Throne on a day when there is no shade but His — among them the just leader, the youth raised in worship, and one who gave charity so secretly his left hand did not know what his right hand spent.",
      "The waiting is long — the Qur'an speaks of 'a Day whose measure is fifty thousand years' (Qur'an 70:4) — but its length is not the same for all. Authentic reports say it will be made light for the believer, as brief as the time between two prayers, while it presses heavily on others. So the Mahshar is where the private ledger of a life becomes public reality: the same sun, the same plain, and utterly different experiences, drawn entirely from what each person sent ahead.",
    ],
    quran: [
      {
        surah: 14,
        ayahFrom: 48,
        label: "Qur'an 14:48",
        excerpt:
          "The Day the earth will be replaced by another earth, and the heavens as well, and they will come out before Allah, the One, the Prevailing.",
      },
      {
        surah: 70,
        ayahFrom: 4,
        label: "Qur'an 70:4",
        excerpt:
          "The angels and the Spirit ascend to Him in a Day whose measure is fifty thousand years.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2864",
        grade: "sahih",
        excerpt:
          "The sun will be brought near to the people on the Day of Resurrection until it is about a mile away, and they will sink in sweat according to their deeds — some to their ankles, some to their knees, some to their waists, and some the sweat will bridle.",
      },
    ],
  },
  {
    id: "intercession",
    section: "events",
    title: "Intercession (Shafa'ah)",
    summary: "By Allah's permission only — types and the greatest intercession.",
    body: [
      "Shafa'ah is intercession — one party speaking to Allah on behalf of another. It is real and it is a mercy, but it is never independent: no one intercedes except by Allah's prior permission and only for whom He is pleased with. The Qur'an states the rule twice over: 'Who is it that can intercede with Him except by His permission?' (Qur'an 2:255), and 'Intercession does not benefit with Him except for one whom He permits' (Qur'an 34:23). This single condition is what separates the Islamic doctrine of intercession from every corruption of it.",
      "The greatest of all is al-Shafa'ah al-'Udhma, unique to Prophet Muhammad ﷺ. On the Mahshar, crushed by the long standing, mankind will go from prophet to prophet — Adam, Ibrahim, Musa, 'Isa — each excusing himself, until they come to Muhammad ﷺ. He will prostrate beneath the Throne and be told, 'Raise your head, ask and you will be given, intercede and your intercession will be accepted' (Sahih al-Bukhari 7440; the full chain of prophets is in Sahih Muslim 195). By it he asks Allah to begin the reckoning and relieve the standing — a station of praise promised to him alone.",
      "Other authentic forms follow: intercession that some believers enter Paradise without reckoning; intercession that raises ranks; and above all the intercession for grave sinners among the believers, so that people are brought out of the Fire through the intercession of the Prophet ﷺ, other prophets, the angels, the believers, and finally the mercy of Allah, who is the Most Merciful of the merciful. Prophets, martyrs, the righteous, and even children who died young may intercede by permission, though the strength of individual reports varies.",
      "The essential caution: intercession in the Hereafter never licenses calling upon the dead or the absent for help now. To invoke a prophet or a saint in the grave, asking them to relieve distress or grant needs, is directing worship to other than Allah — that is shirk, and it is the opposite of the shafa'ah described here, which is a favour Allah grants on that Day to whom He wills. Nor does it replace the need for faith and repentance in this life; it is Allah's mercy toward those who lived and died upon tawheed.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 255,
        label: "Qur'an 2:255",
        excerpt:
          "Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass nothing of His knowledge except what He wills.",
      },
      {
        surah: 34,
        ayahFrom: 23,
        label: "Qur'an 34:23",
        excerpt: "And intercession does not benefit with Him except for one whom He permits.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7440",
        grade: "sahih",
        excerpt:
          "The people will come to me and I will fall in prostration before Allah, and it will be said: O Muhammad, raise your head; ask and you will be given, intercede and your intercession will be accepted.",
      },
      {
        collection: "Sahih Muslim",
        citation: "195",
        grade: "sahih",
        excerpt:
          "Mankind will go to Adam, then to Ibrahim, then to Musa, then to 'Isa, and each will excuse himself, until they come to Muhammad ﷺ, and to him is given the greatest intercession.",
      },
    ],
    misconceptions: [
      "Misconception: Seeking intercession means the Prophet ﷺ or the righteous are worshipped. Correction: Worship belongs to Allah alone; shafa'ah on the Last Day is a mercy Allah grants by His permission, and it does not justify calling upon the dead in this life.",
    ],
  },
  {
    id: "record-of-deeds",
    section: "events",
    title: "The Record of Deeds",
    summary: "Recording angels — right hand, left hand, nothing omitted.",
    body: [
      "Every human being has two noble scribes assigned to record their deeds: 'When the two receivers receive, seated on the right and on the left, not a word does he utter but there is with him an observer ready to record' (Qur'an 50:17–18). On the Last Day these records are handed out, and the manner of receiving one's book is itself the first verdict — in the right hand for the successful, in the left hand or from behind the back for the ruined (Qur'an 84:7–12; 69:19–37).",
      "Nothing is omitted from these records — not the smallest act, not the fleeting thought that became a deed. The wrongdoers will be stunned by the completeness of it: 'They will say: O woe to us! What is this book that leaves nothing small or great except that it has recorded it? And they will find whatever they did present before them, and your Lord does not wrong anyone' (Qur'an 18:49). By Allah's mercy, good intentions and abandoned sins are also recorded in the believer's favour.",
      "Because the tongue and the limbs are what fill the pages, guarding them is guarding the record. The Prophet ﷺ made the tongue central to salvation: 'Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Paradise' (Sahih al-Bukhari 6474) — that is, whoever protects his speech and his chastity. A daily habit of honest self-review — asking what today added to the book — is one of the most sobering and useful practices a believer can keep.",
    ],
    quran: [
      {
        surah: 18,
        ayahFrom: 49,
        label: "Qur'an 18:49",
        excerpt:
          "And the record will be placed, and you will see the criminals fearful of what is within it, saying: O woe to us! What is this book that leaves nothing small or great except that it has recorded it? And they will find whatever they did present, and your Lord does not wrong anyone.",
      },
      {
        surah: 69,
        ayahFrom: 19,
        ayahTo: 26,
        label: "Qur'an 69:19–26",
        excerpt:
          "As for one who is given his record in his right hand, he will say: Here, read my record! I was certain I would meet my account. So he will be in a pleasant life. But one who is given his record in his left hand will say: I wish I had not been given my record.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6474",
        grade: "sahih",
        excerpt:
          "Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Paradise — meaning his tongue and his chastity.",
      },
    ],
    actions: [
      "Guard the tongue above almost all else — most of what fills a record for good or ill passes across it.",
      "Review your day before sleep: ask what you would want, and what you would dread, to see written in your book.",
    ],
    appLinks: [{ label: "Prayer journal", route: "/journal" }],
  },
  {
    id: "scale",
    section: "events",
    title: "The Scale (Mizan)",
    summary: "Deeds weighed — sincerity, character, and zikr make scales heavy.",
    body: [
      "The Mizan is the Scale on which deeds are weighed with absolute justice: 'We place the scales of justice for the Day of Resurrection, so no soul will be wronged at all; even if it be the weight of a mustard seed, We will bring it forth, and sufficient are We as accountants' (Qur'an 21:47). Ahl al-Sunnah affirm it as a real balance, not a mere metaphor — deeds, or the records of them, are genuinely weighed. A person's fate turns on which pan sinks: 'As for one whose scales are heavy, he will be in a pleasing life; but as for one whose scales are light, his refuge will be an abyss' (Qur'an 101:6–9).",
      "What makes a scale heavy is not the sheer volume of activity but its weight before Allah — and weight comes from sincerity. The Prophet ﷺ pointed to deeds that are effortless yet immense: 'Two words light on the tongue, heavy on the Scale, beloved to the Most Merciful: SubhanAllahi wa bihamdih, SubhanAllahil-'Azim' (Sahih al-Bukhari 6406). He also said, 'Nothing is heavier on the believer's Scale on the Day of Resurrection than good character' (Jami' at-Tirmidhi 2002, sahih). So a simple remembrance repeated sincerely, or patient good manners, can outweigh mountains of showy activity.",
      "The reverse is the danger of hollow deeds. Actions done to be seen by people (riya') or corrupted by hypocrisy can arrive on the Scale weightless — outwardly large, inwardly empty. This is why sincerity (ikhlas) is not one virtue among many but the very thing that gives every other deed its weight. The lesson is to build the day around small, sincere, consistent acts, and to purify the intention behind the visible ones.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 47,
        label: "Qur'an 21:47",
        excerpt:
          "And We place the scales of justice for the Day of Resurrection, so no soul will be wronged at all. And if there is the weight of a mustard seed, We will bring it forth, and sufficient are We as accountants.",
      },
      {
        surah: 101,
        ayahFrom: 6,
        ayahTo: 9,
        label: "Qur'an 101:6–9",
        excerpt:
          "As for one whose scales are heavy, he will be in a pleasing life. But as for one whose scales are light, his refuge will be an abyss.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6406",
        grade: "sahih",
        excerpt:
          "Two words light on the tongue, heavy on the Scale, beloved to the Most Merciful: SubhanAllahi wa bihamdih, SubhanAllahil-'Azim.",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2002",
        grade: "hasan",
        excerpt:
          "Nothing is heavier on the believer's Scale on the Day of Resurrection than good character. Indeed, the one of good character reaches by it the rank of the one who fasts and prays.",
      },
    ],
    appLinks: [
      { label: "Tasbeeh", route: "/tasbeeh/free" },
      { label: "Adhkar", route: "/zikr" },
    ],
  },
  {
    id: "accountability",
    section: "events",
    title: "Accountability (Hisab)",
    summary: "Easy reckoning, detailed reckoning, and rights owed to others.",
    body: [
      "The Hisab is the reckoning, when each person is called to account for their life. The Qur'an describes two very different experiences of it: 'As for one who is given his record in his right hand, he will be judged with an easy account and return to his people in happiness; but one given his record behind his back will call for destruction' (Qur'an 84:7–11). The 'easy account' is a mercy, not an absence of examination — the Prophet ﷺ warned that intensity of questioning is itself a kind of punishment.",
      "The Prophet's ﷺ own wife narrates the key distinction. Aisha reported him saying, 'Whoever is called to account will be destroyed.' She said: But does Allah not say, 'He will be judged with an easy account'? He replied, 'That is only the presenting of deeds; but whoever is interrogated over the account will be destroyed' (Sahih al-Bukhari 6537). So the believer's hope is not to escape all scrutiny but to be shown his deeds, have his sins covered, and be forgiven — rather than cross-examined item by item.",
      "There is a category of debt that even Allah's forgiveness does not simply erase: the rights of other people (huquq al-'ibad). The Prophet ﷺ asked, 'Do you know who is bankrupt?' They said: One with no money. He said, 'The bankrupt of my ummah is one who comes on the Day of Resurrection with prayer, fasting and charity, but who insulted this one, slandered that one, took the wealth of another, and shed the blood of another — so his good deeds are handed over to them, and when his good deeds run out their sins are loaded onto him, and he is thrown into the Fire' (Sahih Muslim 2581). Worship does not cancel injustice; only settling the injustice does.",
      "The practical conclusion is urgent and specific: unpaid debts, stolen wealth, slander, and broken trusts must be put right in this life — through repentance to Allah and restitution and apology to people — because it is far cheaper to settle in a currency of money and humility now than in the currency of good deeds then. And through it all, Allah's justice is perfect and His mercy encompasses everyone who strove sincerely and repented.",
    ],
    quran: [
      {
        surah: 84,
        ayahFrom: 7,
        ayahTo: 12,
        label: "Qur'an 84:7–12",
        excerpt:
          "As for one who is given his record in his right hand, he will be judged with an easy account and return to his people in happiness. But one who is given his record behind his back will cry for destruction and enter a Blaze.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6537",
        grade: "sahih",
        excerpt:
          "Whoever is called to account will be destroyed. Aisha said: Does Allah not say, He will be judged with an easy account? He said: That is only the presenting of deeds; but whoever is interrogated over his account will be destroyed.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2581",
        grade: "sahih",
        excerpt:
          "Do you know who is bankrupt? He is the one who comes on the Day of Resurrection with prayer, fasting and charity, but who had insulted, slandered, and wronged others — so his good deeds are given to them, and when they run out their sins are placed on him and he is cast into the Fire.",
      },
    ],
    actions: [
      "Settle debts and return anything taken unjustly, however small, before the appointed day arrives.",
      "Seek out and apologise to anyone you have wronged in word, wealth or dignity — restitution now is far cheaper than restitution then.",
      "Repent to Allah for rights owed to Him, and keep the two ledgers — the divine and the human — both clear.",
    ],
    appLinks: [{ label: "Qaza & debts", route: "/qaza" }],
  },
  {
    id: "hawd",
    section: "events",
    title: "The Pond (Hawd)",
    summary: "The Prophet's ﷺ basin — who drinks and who is turned away.",
    body: [
      "The Hawd is the great basin granted to the Prophet Muhammad ﷺ on the Day of Resurrection, a mercy for his thirsty ummah on that scorching, exhausting Day. Its descriptions are numerous and authentic: 'My Hawd is a month's journey across; its water is whiter than milk, its fragrance sweeter than musk, and its cups are like the stars of the sky. Whoever drinks from it will never thirst again' (Sahih al-Bukhari 6579). Belief in the Hawd is part of Sunni creed, established by mass-transmitted reports.",
      "The Prophet ﷺ will himself receive his followers there: 'I will reach the Hawd before you, and I will be watching for those of you who come to me' (Sahih Muslim 2292). He recognises his ummah by the light on their faces, hands and feet from the traces of wudu. To reach it is to be quenched forever; it is fed, in the sound understanding, by al-Kawthar, the river Allah gave His Prophet ﷺ in Paradise.",
      "Yet some will be driven away from the Hawd. The Prophet ﷺ described being told of certain people, 'They are not of you; they changed and altered the religion after you,' or turned back on their heels after him. Scholars are careful with this: it refers to specific categories in the hadith — such as apostasy and grave, deliberate innovation in the religion after clear guidance — and it is emphatically not a licence for ordinary Muslims to hurl the charge at one another. The safe path to the Hawd is to hold to the Sunnah, guard the wudu and the prayer, and keep the unity of the believers.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6579",
        grade: "sahih",
        excerpt:
          "My Hawd is a month's journey across. Its water is whiter than milk, its fragrance sweeter than musk, and its cups are as numerous as the stars of the sky. Whoever drinks from it will never thirst again.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2292",
        grade: "sahih",
        excerpt:
          "I will reach the Hawd before you, and I will be watching for those of you who come to me. Some men will be taken away from me, and I will say: My Lord, my companions! It will be said: You do not know what they innovated after you.",
      },
    ],
    disclaimer:
      "The reports about those turned away from the Hawd refer to specific categories named in the hadith, chiefly apostasy and grave innovation in the religion. They are not a licence for Muslims to declare one another astray.",
  },
  {
    id: "sirat",
    section: "events",
    title: "The Bridge (Sirat)",
    summary: "Crossing over Hell — speed according to deeds and mercy.",
    body: [
      "The Sirat is a bridge stretched over the top of Hell, and every single person must pass over it — believer and disbeliever alike. The Qur'an affirms the crossing without exception: 'There is none of you except that he will come to it. That is upon your Lord an inevitability decreed. Then We will save those who were mindful of Allah, and leave the wrongdoers in it, on their knees' (Qur'an 19:71–72). Passage is universal; safe arrival on the far side is the whole matter, and it is granted by Allah to those He protects.",
      "The manner of crossing is set by the deeds one brings. The Prophet ﷺ described it: 'The bridge will be placed over Hell… and the first of you will pass like lightning, then like the wind, then like birds, then like a running man — according to their deeds — while your Prophet stands on the bridge saying: O Lord, keep them safe, keep them safe. Some are saved unscathed, some are scratched and let go, and some are cast into the Fire' (Sahih al-Bukhari 6573). Beside the bridge, in the same report, stand trustworthiness (amanah) and the ties of kinship — a striking image that faithfulness in trusts and family bonds actually accompanies a person across.",
      "Light and speed on the Sirat are earned in this life. Prayer performed on time, charity given regularly, honesty in dealings, and good character become, in effect, the footing and the light by which one crosses. The Prophet ﷺ will intercede for the believers there, and it is by Allah's mercy that anyone reaches the other side at all.",
      "As with the other unseen stations, the wise course is not to speculate about the physical dimensions of the bridge — how thin, how sharp, how long — beyond what revelation states, but to focus entirely on the deeds that make the crossing light. What you cannot picture, you can still prepare for.",
    ],
    quran: [
      {
        surah: 19,
        ayahFrom: 71,
        ayahTo: 72,
        label: "Qur'an 19:71–72",
        excerpt:
          "And there is none of you except that he will come to it. That is upon your Lord an inevitability decreed. Then We will save those who were mindful of Allah, and leave the wrongdoers within it, on their knees.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6573",
        grade: "sahih",
        excerpt:
          "The bridge will be set over Hell, and I will be the first to cross. The people will pass over it according to their deeds — like lightning, like the wind, like birds, like a running man — while I say: O Lord, keep them safe, keep them safe. Some are saved, some are scratched and released, and some fall into the Fire.",
      },
    ],
    actions: [
      "Pray the five prayers on time — the prayer is the light that leads across the bridge.",
      "Give charity regularly, even in small amounts.",
      "Keep the ties of kinship and guard your trusts — in the hadith they stand beside the Sirat itself.",
    ],
  },

  // ── Outcomes ───────────────────────────────────────────────────────────────
  {
    id: "paradise",
    section: "outcomes",
    title: "Paradise",
    summary: "The eternal reward — its bliss and, above all, seeing Allah.",
    body: [
      "Jannah is the eternal home Allah has prepared for the believers, a reality beyond the reach of imagination. In a sacred hadith the Prophet ﷺ related that Allah says of it: 'I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has ever conceived' (Sahih al-Bukhari 3244). Its rivers, gardens, mansions and companionship are described in the Qur'an to draw the heart, but the descriptions are pointers to a joy that fully exceeds them.",
      "The greatest of all its rewards is not any garden or river but the pleasure of Allah and the vision of His Face. 'On that Day faces will be radiant, looking toward their Lord' (Qur'an 75:22–23) — understood by Ahl al-Sunnah as the believers beholding Allah in the Hereafter, the crowning bliss of Paradise, granted in a manner befitting His majesty and without likeness to creation. Allah promises: 'For those who did good is the best reward, and more' (Qur'an 10:26) — and the 'more' is explained in authentic hadith as this vision of His noble Face.",
      "Entry into Paradise is by Allah's mercy, embraced through faith and righteous deeds — the two are never opposed: mercy is the cause, and deeds are the sign and the means Allah has tied to it. The Last Day ends, for the people of Paradise, in a bliss that never fades and never ends. This module keeps its treatment of Paradise brief on purpose; the full Journey to Jannah guide covers its gates, ranks, the deeds that lead to it, and the supplications for it in depth.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 133,
        label: "Qur'an 3:133",
        excerpt:
          "And hasten to forgiveness from your Lord and a Garden as wide as the heavens and the earth, prepared for the righteous.",
      },
      {
        surah: 75,
        ayahFrom: 22,
        ayahTo: 23,
        label: "Qur'an 75:22–23",
        excerpt: "That Day, faces will be radiant, looking toward their Lord.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3244",
        grade: "sahih",
        excerpt:
          "Allah says: I have prepared for My righteous servants what no eye has seen, no ear has heard, and what no human heart has ever conceived.",
      },
    ],
    appLinks: [
      { label: "Journey to Jannah", route: "/jannah" },
      { label: "Learn Aqeedah — Paradise", route: "/aqeedah/paradise" },
    ],
  },
  {
    id: "hell",
    section: "outcomes",
    title: "Hell",
    summary: "The true warning — real punishment, and the door of escape while alive.",
    body: [
      "Jahannam is a real abode of punishment, not a symbol or a metaphor for a bad state of mind. Belief in it is part of believing in the unseen and in Allah's justice. The Qur'an warns with sober clarity: 'For those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination' (Qur'an 67:6). Its severity is described to awaken, not to satisfy curiosity: 'a Fire whose fuel is people and stones' (Qur'an 2:24), guarded by stern angels who do not disobey Allah in what He commands.",
      "The purpose of these warnings is mercy in disguise. They exist to break arrogance, to stop persistent rejection of the truth, and to turn a person back before it is too late. That is why the warnings in the Qur'an are almost always paired with the open door of repentance — the point of describing the Fire is precisely so that people avoid it while they still can. Its punishment is just: no one enters it except through their own persistent choice against clear guidance, and Allah wrongs no one.",
      "For believers who carry sins, the sound Sunni belief is a balance between fear and hope: a sinner is under Allah's will — He may forgive, or may purify in the Fire and then, by the intercession and mercy described earlier, bring out of it everyone who had even an atom of faith. This module gives Hell a deliberately brief and measured treatment. The fuller study of its warnings, the major sins, and the vast doors of repentance and mercy is found in the Understanding Jahannam module and related aqeedah topics — approached always with hope, never despair.",
    ],
    quran: [
      {
        surah: 67,
        ayahFrom: 6,
        label: "Qur'an 67:6",
        excerpt:
          "And for those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination.",
      },
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.",
      },
    ],
    appLinks: [
      { label: "Understanding Jahannam", route: "/jahannam" },
      { label: "Learn Aqeedah — Hell", route: "/aqeedah/hell" },
    ],
  },
  {
    id: "without-reckoning",
    section: "outcomes",
    title: "Who enters without reckoning?",
    summary: "Authentic hadith on those who bypass detailed hisab — scholarly discussion.",
    body: [
      "Among the mercies of the Last Day is that a group of this ummah enters Paradise with no reckoning at all. The Prophet ﷺ said, 'Seventy thousand of my ummah will enter Paradise without reckoning,' and in another wording, 'with each thousand seventy thousand more.' When the companions wondered who they were, he described them: 'They are those who do not seek ruqyah from others, do not believe in evil omens, do not use cauterisation, and who place their trust in their Lord' (Sahih al-Bukhari 6541).",
      "The heart of that description is tawakkul — deep, active reliance on Allah — together with freedom from superstition and from anxious dependence on causes. It does not condemn seeking permitted medical treatment; ruqyah recited over oneself and lawful medicine are both established in the Sunnah. What is praised is the person whose reliance is so wholly upon Allah that they do not go around begging others for spiritual charms or clinging to omens.",
      "Scholars discuss the number itself: some hold the seventy thousand is literal, others that it is multiplied greatly by the additional reports, and others still that it signals an unquantifiable abundance of Allah's grace rather than a fixed headcount. What they agree on is the underlying truth — that Allah's mercy far exceeds what human bookkeeping would expect, and that ultimate salvation is by that mercy.",
      "This is a station of hope, not a loophole for laziness. It inspires the believer toward genuine reliance on Allah and away from superstition, while still striving in worship. No one earns it by neglecting deeds; one is drawn toward it by sincerity, trust, and a heart attached to Allah rather than to charms and fears.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6541",
        grade: "sahih",
        excerpt:
          "Seventy thousand of my ummah will enter Paradise without reckoning: they are those who do not seek ruqyah from others, do not believe in evil omens, do not cauterise, and who put their trust in their Lord.",
      },
    ],
    disclaimer:
      "Scholars differ over whether 'without reckoning' means a fixed seventy thousand or a far greater, unquantifiable number. All agree that ultimate salvation is by Allah's mercy, and that this is a cause for hope, not for neglecting deeds.",
  },

  // ── Practice ───────────────────────────────────────────────────────────────
  {
    id: "preparing",
    section: "practice",
    title: "Preparing for the Last Day",
    summary: "Practical worship — connect every habit to your meeting with Allah.",
    importance: "foundational",
    body: [
      "After walking the whole journey — death, the grave, the signs, the Trumpet, the gathering, the records, the Scale, the reckoning, the Bridge, and the two homes — the only sane response is to prepare. But preparation is not panic. The Prophet ﷺ never left his companions frightened and paralysed; he left them working. The foundation of all of it is tawheed and sincerity (ikhlas): a deed is accepted only when it is done for Allah alone and in accordance with the Sunnah, so before adding more deeds, purify the intention behind the ones you already have.",
      "Build the day on the pillars the texts made heavy on the Scale. Salah on time is the anchor and the light of the Sirat. The Qur'an — recited, heard, and reflected on, even a few verses daily — keeps the heart alive. Tawbah clears the record: 'O believers, turn to Allah in sincere repentance' (Qur'an 66:8). Charity purifies wealth and outlives you as sadaqah jariyah. Zikr keeps the tongue heavy on the Scale with words light on the tongue. And good character, the Prophet ﷺ said, is the heaviest thing placed on the Scale.",
      "Guard the two things the Prophet ﷺ tied directly to Paradise — the tongue and the chastity (Sahih al-Bukhari 6474) — because these, more than dramatic sins, are what quietly fill or bankrupt a record. And settle the rights of people while you still can: pay debts, return what was taken, apologise for harm, and be fair in every dealing, so that you never arrive as the 'bankrupt' whose prayers are eaten up by the claims of those he wronged.",
      "Everything rests on one intention, stated in the first hadith of Sahih al-Bukhari: 'Actions are but by intentions.' Use Munib's trackers not as a score to compete over but as gentle scaffolding for these habits — prayer, Qur'an, zikr, charity, repentance — each one quietly pointing your day toward the meeting with Allah. That is the whole aim: to live now as someone who truly expects to stand before Him.",
    ],
    quran: [
      {
        surah: 51,
        ayahFrom: 56,
        label: "Qur'an 51:56",
        excerpt: "And I did not create the jinn and mankind except to worship Me.",
      },
      {
        surah: 66,
        ayahFrom: 8,
        label: "Qur'an 66:8",
        excerpt:
          "O you who have believed, turn to Allah in sincere repentance. Perhaps your Lord will remove from you your misdeeds and admit you into gardens beneath which rivers flow.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1",
        grade: "sahih",
        excerpt: "Actions are but by intentions, and every person will have only what he intended.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "6474",
        grade: "sahih",
        excerpt:
          "Whoever guarantees me what is between his jaws and what is between his legs — his tongue and his chastity — I guarantee him Paradise.",
      },
    ],
    actions: [
      "Pray the five daily prayers on time.",
      "Read or listen to the Qur'an daily — even a few verses.",
      "Keep the morning and evening adhkar.",
      "Give charity regularly, even small amounts.",
      "Repent daily and seek forgiveness with sincerity.",
      "Guard the tongue and chastity, and keep every promise and trust.",
      "Fulfil the rights owed to family, neighbours, and creditors.",
      "Reflect in your prayer journal on khushu and sincerity of intention.",
    ],
    appLinks: [
      { label: "My Preparation dashboard", route: "/last-day/preparation" },
      { label: "Learn Salah", route: "/salah-guide" },
      { label: "Learn Qur'an", route: "/learn-quran" },
      { label: "Learn Dua", route: "/learn-dua" },
      { label: "Learn Aqeedah", route: "/aqeedah" },
      { label: "Prayer tracker", route: "/tracker" },
    ],
  },
];
