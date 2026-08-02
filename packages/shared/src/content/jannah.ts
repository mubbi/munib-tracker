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
export const JANNAH_CONTENT_VERSION = 3;

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
      "Jannah (Paradise) is the everlasting home of reward that Allah has prepared for those who believe in Him and do righteous deeds. The word literally means a lush, shaded garden — but the Qur'an uses it for a reality far greater than any garden on earth: a realm of rivers, fruit, mansions, and companionship where the believer lives forever in the pleasure of his Lord. It is the goal every prophet called people toward and the destination this whole journey is about.",
      "Life in Jannah is unlike anything in this world because it is free of every flaw that spoils earthly happiness. There is no death, no illness, no ageing, no fear, no grief, and no fatigue. Its people never argue, never tire, and never lose what they love. Whatever the heart desires is granted, and Allah adds even more from His generosity — 'They will have whatever they wish therein, and with Us is more' (Qur'an 50:35).",
      "The delights of Paradise are beyond human imagination. In a hadith qudsi, Allah says He has prepared for His righteous servants what no eye has ever seen, no ear has ever heard, and no heart has ever conceived. This is why the Qur'an describes Paradise in familiar images — gardens, rivers, and shade — while reminding us that the reality is greater than any description. The very greatest reward of all is not the gardens themselves but the pleasure of Allah and, for the highest ranks, the honour of gazing upon His noble Face.",
      "A believer should hold two truths together. First, Paradise is real, near, and worth every effort — the Qur'an tells us to 'race' toward it (Qur'an 3:133). Second, no one earns Paradise by deeds alone; entry is ultimately by Allah's mercy, with sincere faith and good deeds being the means He has chosen to accept. This balance keeps hope alive without breeding arrogance: we strive our utmost, then throw ourselves upon His mercy.",
      "Practically, let the reality of Jannah shape your daily choices. When worship feels heavy or a temptation feels strong, remember what is waiting and what is at stake. Ask Allah for Paradise often, work for it consistently in small sustainable ways, and let longing for it soften your heart in this fleeting life.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 133,
        label: "Qur'an 3:133",
        excerpt:
          "Race toward forgiveness from your Lord and a Garden whose width is that of the heavens and the earth, prepared for the righteous.",
      },
      {
        surah: 9,
        ayahFrom: 72,
        label: "Qur'an 9:72",
        excerpt:
          "Allah has promised the believing men and women Gardens beneath which rivers flow, wherein they abide eternally, and pleasant dwellings in Gardens of everlasting residence — but the pleasure of Allah is greater.",
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
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3244",
        grade: "sahih",
        excerpt:
          "Allah said: I have prepared for My righteous servants what no eye has seen, no ear has heard, and no heart has conceived.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2824",
        grade: "sahih",
        excerpt:
          "Allah, the Exalted, said: I have prepared for My righteous servants what no eye has seen, no ear has heard, and no human heart has ever perceived.",
      },
    ],
  },
  {
    id: "ranks",
    hub: "ranks",
    title: "Ranks in Paradise",
    summary: "Paradise has many degrees — not a fixed ladder of seven.",
    body: [
      "Paradise is not a single flat place; it has many degrees, called darajat, and believers are raised within it according to their faith and deeds. A very common misconception is that Jannah has exactly seven levels. This confuses two different things: the Qur'an speaks of seven heavens (samawat) — the created skies above us — not seven fixed levels of Paradise. The texts never limit Jannah to seven ranks.",
      "What the authentic sources do tell us is that the ranks are numerous and vast. The Prophet ﷺ said Paradise has one hundred levels prepared for those who strive in Allah's cause, and that the distance between one level and the next is like the distance between the heavens and the earth. Even this number points to immensity rather than a rigid ladder we can climb by ticking boxes.",
      "Allah raises each believer according to the strength of their faith, the sincerity of their intention, and the weight of their deeds — 'For all there will be degrees according to what they did' (Qur'an 6:132). The exact rank each person reaches is known to Allah alone. Revelation deliberately does not give us a mechanical checklist of 'do deed X to reach level N,' because worship is meant to be driven by love and sincerity, not by rank-counting.",
      "The wisdom in this is beautiful. If we knew our exact placement, some would grow complacent and others would despair. Instead, we are taught to keep our eyes on Allah, keep striving, and keep hoping. The believer competes in good — 'for this let the competitors compete' — while leaving the final grading to the Most Just.",
      "So rather than aiming at a numbered level, aim at the highest and let Allah place you where He wills. The Prophet ﷺ taught the companions not to settle for a modest request but to ask specifically for Al-Firdaws, the very peak of Paradise.",
    ],
    quran: [
      {
        surah: 6,
        ayahFrom: 132,
        label: "Qur'an 6:132",
        excerpt: "For all there will be degrees according to what they did.",
      },
      {
        surah: 17,
        ayahFrom: 21,
        label: "Qur'an 17:21",
        excerpt:
          "See how We have favoured some of them over others — and the Hereafter is greater in degrees and greater in distinction.",
      },
      {
        surah: 4,
        ayahFrom: 69,
        label: "Qur'an 4:69",
        excerpt:
          "Whoever obeys Allah and the Messenger — they will be with those upon whom Allah has bestowed favour: the prophets, the truthful, the martyrs, and the righteous. What excellent companions they are!",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "2790",
        grade: "sahih",
        excerpt:
          "Paradise has one hundred levels which Allah has prepared for those who fight in His cause. The distance between each two levels is like the distance between the heavens and the earth. So when you ask Allah, ask Him for Al-Firdaws, for it is the best and highest part of Paradise.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "7423",
        grade: "sahih",
        excerpt:
          "When you ask Allah, ask Him for Al-Firdaws, for it is the highest part of Paradise and the middle of Paradise, and from it the rivers of Paradise flow, and above it is the Throne of the Most Merciful.",
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
      "Al-Firdaws is the highest and most excellent level of Paradise named in the authentic Sunnah. The Prophet ﷺ described it as the best of Paradise and its middle — its very heart — from which the rivers of Paradise originate, and above it is the Throne of the Most Merciful. To reach Al-Firdaws is to be as near to Allah as any created being can be.",
      "What makes this topic so practical is a piece of prophetic guidance: when we make dua for Paradise, we should not aim low. The Prophet ﷺ taught the companions that when they ask Allah for Paradise, they should ask specifically for Al-Firdaws rather than settling for a lesser request. Allah's generosity is limitless, so it is a kind of shortcoming to ask Him only for the minimum. This teaches us ambition in worship: aim for the summit and let Allah, in His mercy, decide where to place you.",
      "How does a servant become a candidate for such a rank? The means are the same means that lead to Paradise itself, pursued with excellence: sound belief (tawheed) held sincerely, careful fulfilment of the obligations Allah has commanded, and then a growing life of voluntary worship on top of them — night prayer, extra fasting, remembrance, charity, and good character. In a famous hadith qudsi, Allah describes how the servant keeps drawing near through voluntary deeds until Allah loves him.",
      "Yet the final and decisive gift is always Allah's mercy. In the same breath that we aim for the highest, we remember the Prophet's ﷺ own words: no one enters Paradise by his deeds alone — not even the Prophet ﷺ himself — except that Allah envelops him in His mercy. This is the perfect balance the believer strikes: soaring hope and ambition on one side, sincere humility on the other.",
      "So make Al-Firdaws a regular part of your supplication — in prostration, in the last third of the night, and before sleep — while you quietly do your best each day and lean entirely on your Lord's mercy for the rest.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7423",
        grade: "sahih",
        excerpt:
          "When you ask Allah, ask Him for Al-Firdaws, for it is the highest part of Paradise and the middle of Paradise, and from it the rivers of Paradise flow, and above it is the Throne of the Most Merciful.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2816",
        grade: "sahih",
        excerpt:
          "None of you will enter Paradise by his deeds alone. They said: Not even you, O Messenger of Allah? He said: Not even me, unless Allah covers me with mercy from Him.",
      },
    ],
    actions: [
      "Ask Allah for Al-Firdaws in your dua, especially in sujud and before sleep.",
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
      "This section is not meant to frighten you into despair — quite the opposite. Allah forgives all sins for the one who turns back to Him sincerely, and He announces this in the strongest terms: 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins' (Qur'an 39:53). The purpose here is simply to know what the texts warn against, so that we recognise danger and hurry back to Him before it is too late.",
      "There is one sin that stands apart from all others: shirk — associating partners with Allah in worship. This is the single sin Allah will not forgive if a person dies upon it without repenting, as He states plainly in Qur'an 4:48. Everything else falls under 'He forgives what is less than that for whom He wills.' This is why correct tawheed is the foundation beneath every accepted deed: a house built on a cracked foundation cannot stand.",
      "After shirk, the texts give special weight to abandoning the prayer. Neglecting the five daily prayers, persistently and without valid excuse, is among the gravest warnings in the Sunnah — the Prophet ﷺ called prayer the covenant that distinguishes the believer, so much so that abandoning it approaches disbelief. Other major sins — unjust killing, unlawful relationships, consuming interest (riba), devouring an orphan's wealth, and severe oppression — are serious matters that require sincere repentance and may bring punishment if Allah does not forgive.",
      "The so-called 'lesser' sins matter too, and should never be taken lightly. Backbiting, lying, arrogance, breaking family ties, and heedlessness slowly erode the heart and character. The Prophet ﷺ warned that small sins piled up can destroy a person just as small sticks gathered together can cook a whole meal. Each of them needs its own turning back to Allah.",
      "The takeaway is hope in action: never let the size of a sin convince you that repentance is pointless. Return to Allah the moment you slip, follow a bad deed with a good one to wipe it out, and keep the door of istighfar open every single day. His mercy is always larger than your mistake.",
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
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
      },
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "2621",
        grade: "sahih",
        excerpt:
          "The covenant between us and them is the prayer; whoever abandons it has committed disbelief.",
      },
    ],
    appLinks: [
      { label: "Prayer tracker", route: "/tracker" },
      { label: "Qaza & making up missed worship", route: "/qaza" },
    ],
    disclaimer:
      "Lists of major sins in fiqh vary by scholar, and rulings on individuals belong to qualified people. This is a general reminder to repent — not a personal verdict. Consult a trustworthy scholar for your situation.",
  },
  {
    id: "promised",
    hub: "promised",
    title: "Those honoured in the texts",
    summary: "People and groups the Prophet ﷺ named regarding Paradise.",
    body: [
      "The Qur'an and Sunnah single out certain individuals, categories of believers, and deeds tied to glad tidings of Paradise. It is important to read these correctly: they are honest reports about those specific people or descriptions — they are not a transferable guarantee for anyone who merely hears their names or admires them. The glad tiding rested on their faith and their deeds, and the same door is open to us through the same means.",
      "The most famous group is the Ten Promised Paradise (al-Asharah al-Mubashsharah), named together by the Prophet ﷺ in a single narration: Abu Bakr, Umar, Uthman, Ali, Talhah, Zubayr, Abd al-Rahman ibn Awf, Sa'd ibn Abi Waqqas, Sa'id ibn Zayd, and Abu Ubaydah ibn al-Jarrah (may Allah be pleased with them all). These were the closest and most sacrificing of the Prophet's ﷺ companions, and Ahl al-Sunnah love and honour them all without going to excess or disparaging any of them.",
      "Beyond named individuals, the texts describe categories given glad tidings: the truthful and the patient, those who die as genuine martyrs in Allah's cause according to Islamic law, and those whose final words in this life are the testimony of faith, la ilaha illallah. Each description points to an inner reality — sincerity, sacrifice, or a heart attached to Allah at the last breath — not merely an outward label.",
      "The lesson for us is not to feel secure by association, nor to claim these ranks for ourselves, but to be inspired. Let their example pull us upward: love what they loved, strive as they strove, and turn that admiration into dua and action, asking Allah above all for husn al-khatimah — a good ending.",
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "3747",
        grade: "sahih",
        excerpt:
          "Abu Bakr is in Paradise, Umar is in Paradise, Uthman is in Paradise, Ali is in Paradise, Talhah is in Paradise, Zubayr is in Paradise, Abd al-Rahman ibn Awf is in Paradise, Sa'd is in Paradise, Sa'id ibn Zayd is in Paradise, and Abu Ubaydah ibn al-Jarrah is in Paradise.",
      },
      {
        collection: "Sunan Abu Dawud",
        citation: "3116",
        grade: "sahih",
        excerpt: "Whoever's last words are 'There is no god but Allah' will enter Paradise.",
      },
    ],
    disclaimer:
      "Glad tidings in hadith refer to those named or to the categories described. They do not replace the need for one's own faith, deeds, and a good ending. Allah knows best.",
  },
  {
    id: "tawheed",
    hub: "paths",
    title: "Tawheed — correct belief",
    summary: "No deed is accepted without sincere monotheism.",
    importance: "foundational",
    body: [
      "Tawheed means singling out Allah alone for worship — believing that He alone is the Lord and Creator, that He alone deserves to be worshipped, and that He is unique in His names and attributes. It is the very message every prophet was sent with and the first thing a person enters Islam upon. Because it concerns the One we are worshipping, it is the foundation on which the entire building of the religion stands.",
      "Its importance is impossible to overstate: Allah does not accept any deed from a person who associates partners with Him. 'If you associate others with Allah, your deeds will surely come to nothing' (Qur'an 39:65). A mountain of good works built on shirk weighs nothing on the Day of Judgement, while the smallest deed built on pure tawheed can be immensely heavy. This is why guarding one's belief is even more urgent than multiplying one's actions.",
      "Tawheed also demands sincerity, called ikhlas — that we worship Allah 'being sincere to Him in religion' (Qur'an 98:5). The subtle danger here is riya, doing acts of worship to be seen and praised by people. The Prophet ﷺ warned that even hidden showing-off can quietly spoil a deed. The remedy is to keep renewing the intention: for whom am I really doing this? Sincerity is what turns an ordinary act into a treasured act of devotion.",
      "The wisdom of making tawheed the foundation is that it frees the heart. The person who worships Allah alone is liberated from fear of creation, from chasing everyone's approval, and from the exhaustion of serving many masters. His life gains a single, clear direction: pleasing the One who made him.",
      "Practically, learn correct belief from trustworthy scholars, purify your worship of shirk and hypocrisy, and check your intention before you act. This first step is not optional or advanced — it is where every path to Paradise begins.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 65,
        label: "Qur'an 39:65",
        excerpt:
          "It has been revealed to you and to those before you: If you associate others with Allah, your deeds will surely come to nothing, and you will surely be among the losers.",
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
        excerpt:
          "Actions are but by intentions, and every person will have only what they intended.",
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
      "Salah — the five daily prayers — is the second pillar of Islam and the central act of daily worship. The Prophet ﷺ described prayer as the pillar of the religion: whoever establishes it establishes the religion, and whoever neglects it has torn down much of what holds it up. It is the believer's five daily appointments with his Lord, standing, bowing, and prostrating in direct connection with Allah.",
      "Its rank is unmatched among the practical deeds because of what the Prophet ﷺ said about the Day of Judgement: the very first matter a servant will be brought to account for is the prayer. If it is sound, the rest of the deeds will be sound; if it is deficient, the rest is in danger. In this life, too, prayer is a means of purification — the Prophet ﷺ compared the five prayers to a flowing river at one's door: whoever bathes in it five times a day is left with no dirt, and so the prayers wash away minor sins.",
      "But prayer is meant to be more than physical motions. The Qur'an praises 'those who are humble in their prayer' (Qur'an 23:1–2) and honours 'those who are constant in their prayer' (Qur'an 70:22–23). Two qualities matter most: khushu — a present, humble heart that knows it is standing before Allah — and consistency, guarding every prayer at its proper time. Praying in congregation, for those able, multiplies the reward many times over.",
      "The deeper wisdom of salah is transformation. Prayer, done properly, restrains a person from indecency and wrongdoing; it is a repeated reset that pulls the heart back to Allah throughout a busy day. Missing prayers without valid excuse is therefore a grave matter that requires sincere repentance and making them up (qaza). Nafl and rawatib — the regular sunnah prayers before and after the obligatory ones — add further light and raise one's rank.",
      "Practically: protect the five daily prayers at their times as your absolute priority, make up any you have missed, and add the sunnah prayers you can sustain. If your prayer improves, everything else in your worship tends to improve with it.",
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
        collection: "Sunan al-Tirmidhi",
        citation: "413",
        grade: "sahih",
        excerpt:
          "The first matter for which the servant will be brought to account on the Day of Resurrection is his prayer. If it is sound, he has succeeded; if it is defective, he has failed and lost.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "528",
        grade: "sahih",
        excerpt:
          "If there were a river at the door of one of you in which he bathed five times a day, would any dirt remain on him? They said: No. He said: That is the likeness of the five prayers — by them Allah wipes away sins.",
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
      "Tawbah is turning back to Allah after sin. Sincere repentance (tawbah nasuh) has clear pillars: genuine regret in the heart for what was done, immediately stopping the sin, and a firm resolve never to return to it — and if the sin involved wronging another person, restoring their right or seeking their pardon. It is not a single event but a lifelong return, a door Allah keeps open for every believer.",
      "Its importance is that no human being is free of sin, so repentance is not for a sinful few but for everyone. The Prophet ﷺ said that every child of Adam sins, and the best of those who sin are those who repent. Allah accepts a servant's repentance right up until the moment the soul reaches the throat at death, and even the sun rising from the west is the deadline for the world — until then, the invitation stands.",
      "Astonishingly, Allah does not merely tolerate the returning servant — He rejoices. The Prophet ﷺ described Allah as being more delighted at the repentance of His servant than a man who, lost in a barren desert, despairs of life after his camel wanders off with all his food and water, then suddenly finds it again. That image of overwhelming joy tells us how beloved the repenting servant is to his Lord.",
      "The wisdom is profound: sin need not be the end of a person's story. 'Allah will replace their evil deeds with good' (Qur'an 25:70) — sincere repentance can transform a record of failure into one of success, and can turn a fall into a fresh start that draws a person closer to Allah than before. Despair after sin is itself a trap of the Shaytan; hope in Allah's mercy is the believer's response.",
      "Practically: do not postpone repentance for a single day — return the moment you slip. Follow every bad deed with a good deed to erase it, and keep istighfar flowing on your tongue throughout the day, just as the Prophet ﷺ sought forgiveness many times daily despite being forgiven.",
    ],
    quran: [
      {
        surah: 66,
        ayahFrom: 8,
        label: "Qur'an 66:8",
        excerpt:
          "O you who believe, turn to Allah in sincere repentance — perhaps your Lord will remove from you your misdeeds and admit you to Gardens beneath which rivers flow.",
      },
      {
        surah: 25,
        ayahFrom: 70,
        label: "Qur'an 25:70",
        excerpt:
          "Except for those who repent, believe, and do righteous deeds — for them Allah will replace their evil deeds with good, and Allah is Forgiving and Merciful.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6309",
        grade: "sahih",
        excerpt:
          "Allah is more pleased with the repentance of His servant than one of you who, having lost his camel in a barren land, suddenly finds it again.",
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
      "The Qur'an is the literal speech of Allah, revealed as guidance, mercy, and healing for the hearts. Building a relationship with it — reciting it, pondering its meanings, acting on its commands, and teaching it to others — is among the greatest and most rewarding acts of worship a believer can devote a lifetime to. It is the rope of Allah extended to us; whoever holds fast to it is guided to a straight path.",
      "The rewards attached to it are extraordinary. The Prophet ﷺ taught that Allah gives those who recite His Book and establish prayer a great reward that never perishes (Qur'an 35:29–30), and that for every single letter recited there is a reward multiplied tenfold. Even the one who struggles and stumbles over the words, so long as he keeps trying, has a double reward — one for the recitation and one for the effort.",
      "The Qur'an also elevates a person's rank in the next life in a direct and vivid way. The Prophet ﷺ said that the companion of the Qur'an will be told on the Day of Resurrection: 'Recite and ascend, and recite as you used to recite in the world, for your rank will be at the last verse you recite.' In other words, one's standing in Paradise rises in step with one's portion of the Book — a striking encouragement to keep memorising and reviewing.",
      "The deeper purpose, though, is not recitation for its own sake but transformation. Allah commands us to 'recite the Qur'an with measured recitation' (Qur'an 73:4) precisely so the meanings sink in and reshape how we think, feel, and behave. The Qur'an was sent to be lived, not merely recited; the companions would learn ten verses and not move on until they had understood and acted upon them.",
      "Practically: read a portion every day, even just a few verses, but read them with reflection. Memorise new surahs or maintain what you already know, and — most importantly — act on what you learn before rushing ahead to learn more.",
    ],
    quran: [
      {
        surah: 35,
        ayahFrom: 29,
        ayahTo: 30,
        label: "Qur'an 35:29–30",
        excerpt:
          "Those who recite the Book of Allah, establish prayer, and spend from what We have provided — they hope for a trade that will never perish, that He may give them their rewards in full and increase them from His bounty.",
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
        grade: "sahih",
        excerpt:
          "It will be said to the companion of the Qur'an: Recite and ascend, and recite as you used to recite in the world, for your rank will be at the last verse you recite.",
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
    title: "Zikr — remembrance",
    summary: "Light on the tongue, heavy on the scale.",
    importance: "highly-recommended",
    body: [
      "Zikr means the remembrance of Allah — keeping Him present in the heart and on the tongue through words of glorification (SubhanAllah), praise (Alhamdulillah), magnification (Allahu Akbar), affirmation of His oneness (La ilaha illallah), and seeking forgiveness (istighfar). Of all the paths to Paradise, zikr is among the easiest to perform yet among the greatest in reward, because it can be done anywhere, in any state, at any moment.",
      "Allah Himself commands it generously — 'O you who believe, remember Allah with much remembrance' (Qur'an 33:41–42) — and promises a unique fruit for it: tranquillity of heart. 'Verily, in the remembrance of Allah do hearts find rest' (Qur'an 13:28). In a restless, anxious world, this is one of zikr's greatest gifts. The Prophet ﷺ also weighed its reward, saying that two words light on the tongue yet heavy on the Scale, and beloved to the Most Merciful, are SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      "A special category is the morning and evening adhkar — the authentic supplications the Prophet ﷺ taught for the two boundaries of the day. These act as a spiritual fortress, guarding the believer from harm and drawing down Allah's protection and pleasure. Just a few minutes at the start and end of each day, said with presence, quietly reshape the heart over time.",
      "The wisdom of zikr is that it keeps the relationship with Allah alive between the formal acts of worship. A tongue that is moist with remembrance and, more importantly, a heart that recalls Allah in its daily choices — pausing before anger, before a purchase, before a decision — is the true goal. Zikr is not meant to stay on the lips; it is meant to steer the life.",
      "Practically: make the morning and evening adhkar a daily habit, keep a simple portion of tasbeeh, istighfar, or salawat flowing during idle moments, and remember Allah especially before sleep and upon waking. Consistency in a little is better than bursts of a lot.",
    ],
    quran: [
      {
        surah: 13,
        ayahFrom: 28,
        label: "Qur'an 13:28",
        excerpt:
          "Those who believe and whose hearts find rest in the remembrance of Allah — verily, in the remembrance of Allah do hearts find rest.",
      },
      {
        surah: 33,
        ayahFrom: 41,
        ayahTo: 42,
        label: "Qur'an 33:41–42",
        excerpt:
          "O you who believe, remember Allah with much remembrance, and glorify Him morning and evening.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6406",
        grade: "sahih",
        excerpt:
          "Two words are light on the tongue, heavy on the Scale, and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
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
      "Islam commands the believer to give from the wealth Allah has entrusted to him, both obligatorily and voluntarily. Zakah is the obligatory annual charge on qualifying wealth — one of the five pillars of Islam — and it is due, not optional, for those who meet its conditions. Beyond it stands sadaqah: voluntary giving of any amount, at any time, for the sake of Allah.",
      "The rewards of spending in Allah's cause are multiplied beyond ordinary arithmetic. Allah compares the one who spends in His way to a single grain that grows seven ears, each ear bearing a hundred grains — 'and Allah multiplies for whom He wills' (Qur'an 2:261). Far from decreasing wealth, charity purifies it and increases it in barakah, while extinguishing sins as water extinguishes fire.",
      "Two forms of charity deserve special mention. The first is hidden charity, given so discreetly that, as the Prophet ﷺ described, the left hand does not know what the right hand has given — this sincerity is especially beloved to Allah and shades a person on the Day of Judgement. The second is sadaqah jariyah, ongoing charity whose benefit continues after death. The Prophet ﷺ said that when a person dies his deeds end except for three: an ongoing charity, knowledge that benefits others, and a righteous child who prays for him.",
      "The wisdom of charity is that it works on the giver as much as the receiver. It loosens the grip of greed on the heart, builds compassion, strengthens the bonds of the community, and reminds the wealthy that they are trustees, not true owners. And Islam widens the definition of charity so no one is excluded: the Prophet ﷺ taught that a smile to your brother, a helpful word, and even removing a harmful object from the road are all forms of sadaqah.",
      "Practically: if you are liable for zakah, calculate and pay it accurately; give some regular sadaqah, however small, so that giving becomes a habit rather than an event; and look for a lasting sadaqah jariyah — sponsoring a student, funding a well, or supporting a masjid — that keeps rewarding you long after you are gone.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 261,
        label: "Qur'an 2:261",
        excerpt:
          "The example of those who spend their wealth in the way of Allah is like a grain that grows seven ears, in each ear a hundred grains. And Allah multiplies for whom He wills.",
      },
      {
        surah: 63,
        ayahFrom: 10,
        label: "Qur'an 63:10",
        excerpt:
          "Spend from what We have provided you before death comes to one of you, and he says: My Lord, if only You would delay me for a little while so I could give charity and be among the righteous.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "1631",
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
      "Good character (husn al-khuluq) is not mere politeness or a smile. It is the way a believer consistently behaves with Allah, with other people, and with himself: truthfulness, patience, humility, mercy, generosity, gentleness, keeping promises, and restraining anger. Allah praised His Messenger ﷺ: 'And indeed, you are of a great moral character' (Qur'an 68:4).",
      "Its rank on the Last Day is stated plainly. The Prophet ﷺ said that nothing is heavier on the believer's Scale than good character (Jami' at-Tirmidhi 2002, hasan). He summarised righteousness itself as good character (Sahih Muslim 2553), and taught that the most beloved of his companions to him — and the closest to him on the Day of Resurrection — are those with the best character (Jami' at-Tirmidhi 2018, hasan).",
      "Many acts of worship primarily benefit the worshipper; good character touches everyone around you. Truthful speech, patience when harmed, fairness toward someone you dislike, and kindness to parents and neighbours fill a record through countless daily moments. That is why the Scale language around husn al-khuluq is so strong.",
      "Practically: work on one trait at a time — hold your tongue when provoked, forgive when you could retaliate, mend a broken relationship, and keep promises even when they cost you. Use the mosaic below for traits the texts praise, and the contrast list for qualities that destroy character.",
    ],
    characterTraits: [
      {
        id: "truthfulness",
        title: "Truthfulness",
        summary: "Be with the truthful — honesty is the foundation of trust.",
        iconKey: "truthfulness",
        quran: {
          surah: 9,
          ayahFrom: 119,
          label: "Qur'an 9:119",
          excerpt: "O you who have believed, fear Allah and be with those who are true.",
        },
      },
      {
        id: "patience",
        title: "Patience",
        summary: "Seek help through patience and Salah.",
        iconKey: "patience",
        quran: {
          surah: 2,
          ayahFrom: 153,
          label: "Qur'an 2:153",
          excerpt: "O you who have believed, seek help through patience and prayer.",
        },
      },
      {
        id: "anger",
        title: "Restraining anger",
        summary: "Those who restrain anger and pardon people — Allah loves the doers of good.",
        iconKey: "anger",
        quran: {
          surah: 3,
          ayahFrom: 134,
          label: "Qur'an 3:134",
          excerpt:
            "Those who spend in ease and hardship, who restrain anger and pardon people — and Allah loves the doers of good.",
        },
      },
      {
        id: "forgiveness",
        title: "Forgiving others",
        summary: "Let them pardon and overlook — would you not love that Allah should forgive you?",
        iconKey: "forgiveness",
        quran: {
          surah: 24,
          ayahFrom: 22,
          label: "Qur'an 24:22",
          excerpt:
            "Let them pardon and overlook. Would you not love that Allah should forgive you? And Allah is Forgiving and Merciful.",
        },
      },
      {
        id: "humility",
        title: "Humility",
        summary: "The servants of the Most Merciful walk upon the earth humbly.",
        iconKey: "humility",
        quran: {
          surah: 25,
          ayahFrom: 63,
          label: "Qur'an 25:63",
          excerpt:
            "And the servants of the Most Merciful are those who walk upon the earth easily, and when the ignorant address them [harshly], they say [words of] peace.",
        },
      },
      {
        id: "trustworthiness",
        title: "Trustworthiness",
        summary: "Allah commands you to render trusts to whom they are due.",
        iconKey: "trustworthiness",
        quran: {
          surah: 4,
          ayahFrom: 58,
          label: "Qur'an 4:58",
          excerpt:
            "Indeed, Allah commands you to render trusts to whom they are due and when you judge between people to judge with justice.",
        },
      },
      {
        id: "parents",
        title: "Kindness to parents",
        summary: "Worship Allah and be good to parents — their right follows His.",
        iconKey: "parents",
        quran: {
          surah: 17,
          ayahFrom: 23,
          label: "Qur'an 17:23",
          excerpt:
            "Your Lord has decreed that you not worship except Him, and to parents, good treatment.",
        },
      },
      {
        id: "speech",
        title: "Speak good or remain silent",
        summary: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
        iconKey: "speech",
        hadith: {
          collection: "Sahih al-Bukhari",
          citation: "6018",
          grade: "sahih",
          excerpt:
            "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
        },
      },
      {
        id: "smiling",
        title: "A sincere smile",
        summary: "Your smiling in the face of your brother is charity.",
        iconKey: "smiling",
        hadith: {
          collection: "Jami' at-Tirmidhi",
          citation: "1956",
          grade: "hasan",
          excerpt: "Your smiling in the face of your brother is charity.",
        },
      },
      {
        id: "justice",
        title: "Justice",
        summary: "Be just — that is nearer to righteousness.",
        iconKey: "justice",
        quran: {
          surah: 5,
          ayahFrom: 8,
          label: "Qur'an 5:8",
          excerpt:
            "O you who have believed, be persistently standing firm for Allah, witnesses in justice.",
        },
      },
    ],
    characterDestroyers: [
      { id: "lying", title: "Lying", route: "/jahannam/sins-of-tongue" },
      { id: "backbiting", title: "Backbiting (ghibah)", route: "/jahannam/sins-of-tongue" },
      { id: "slander", title: "Slander (buhtan)", route: "/jahannam/sins-of-tongue" },
      { id: "arrogance", title: "Arrogance", route: "/jahannam/destructive-sins" },
      { id: "oppression", title: "Oppression (zulm)", route: "/jahannam/sins-against-others" },
      { id: "breaking-promises", title: "Breaking promises", route: "/jahannam/hypocrisy" },
      { id: "mockery", title: "Mocking believers", route: "/jahannam/sins-of-tongue" },
      { id: "harshness", title: "Unjust harshness", route: "/jahannam/sins-against-others" },
    ],
    quran: [
      {
        surah: 68,
        ayahFrom: 4,
        label: "Qur'an 68:4",
        excerpt: "And indeed, you are of a great and noble character.",
      },
      {
        surah: 3,
        ayahFrom: 134,
        label: "Qur'an 3:134",
        excerpt:
          "Those who spend in ease and hardship, who restrain their anger and pardon people — and Allah loves the doers of good.",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2002",
        grade: "hasan",
        excerpt:
          "Nothing is heavier on the Scale of a believer on the Day of Resurrection than good character.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2553",
        grade: "sahih",
        excerpt: "Righteousness is good character, and sin is what wavers in your chest.",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "2018",
        grade: "hasan",
        excerpt:
          "The most beloved of you to me and the closest to me on the Day of Resurrection are those with the best character.",
      },
      {
        collection: "Jami' at-Tirmidhi",
        citation: "1162",
        grade: "hasan",
        excerpt:
          "The most complete of the believers in faith are those with the best character, and the best of you are those who are best to their wives.",
      },
      {
        collection: "Sahih Muslim",
        citation: "91",
        grade: "sahih",
        excerpt: "No one who has an atom's weight of arrogance in his heart will enter Paradise.",
      },
    ],
    actions: [
      "Practice patience when provoked.",
      "Forgive others and mend broken relationships.",
      "Speak good or remain silent — guard the tongue daily.",
      "Reflect on your character after salah in a daily journal.",
    ],
    appLinks: [
      { label: "Khushu & character journal", route: "/journal" },
      { label: "Heavy on the Scale", route: "/last-day/heavy-on-the-scale" },
      { label: "Sins of the tongue", route: "/jahannam/sins-of-tongue" },
      { label: "Sins against others", route: "/jahannam/sins-against-others" },
    ],
  },
  {
    id: "knowledge",
    hub: "paths",
    title: "Seeking knowledge",
    summary: "Allah makes the path to Paradise easy for the one who seeks knowledge.",
    importance: "recommended",
    body: [
      "Seeking beneficial knowledge — learning what Allah and His Messenger ﷺ taught, then acting upon it and passing it on — is a form of worship and, in its essentials, an obligation on every Muslim. This is the sacred knowledge that clarifies belief, purifies worship, and distinguishes right from wrong; it is not knowledge for showing off, but light that guides action.",
      "The Prophet ﷺ tied this pursuit directly to the goal of this whole journey: 'Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.' The 'path' is both literal and figurative — Allah eases the seeker's way in this life and eases his way to Jannah in the next. He also taught that the angels lower their wings in approval for the seeker of knowledge, and that everything in the heavens and earth, even the fish in the sea, seek forgiveness for the one who teaches good.",
      "Knowledge is also one of the rare deeds that keeps rewarding a person after death. The Prophet ﷺ named beneficial knowledge among the three things whose reward continues in the grave, alongside ongoing charity and a righteous child. So teaching a single beneficial matter — helping someone learn to pray correctly, sharing an authentic hadith, or guiding a person to the truth — can become a stream of reward flowing for years, even generations.",
      "The wisdom is that action without knowledge is blind and knowledge without action is fruitless. Correct knowledge protects a person from innovation and misguidance, deepens sincerity, and gives him the ability to benefit others rather than merely benefiting himself. The scholars of Islam always warned against the two dangers: acting ignorantly, and knowing without acting.",
      "Practically: commit to learning something beneficial regularly — a verse, a hadith, a ruling you need for your daily worship. Start with the essentials of belief, prayer, purification, and the major prohibitions, then deepen gradually. Share what you learn humbly, and always apply it to yourself first.",
    ],
    quran: [
      {
        surah: 39,
        ayahFrom: 9,
        label: "Qur'an 39:9",
        excerpt:
          "Say: Are those who know equal to those who do not know? Only those of understanding take heed.",
      },
      {
        surah: 20,
        ayahFrom: 114,
        label: "Qur'an 20:114",
        excerpt: "And say: My Lord, increase me in knowledge.",
      },
    ],
    hadith: [
      {
        collection: "Sunan al-Tirmidhi",
        citation: "2646",
        grade: "hasan",
        excerpt:
          "Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1631",
        grade: "sahih",
        excerpt:
          "When a person dies, his deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
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
      "Voluntary worship (nafl) refers to the extra acts of devotion a believer offers beyond what Allah has made obligatory — extra prayers, extra fasts, extra charity and remembrance. The obligations come first and are non-negotiable, but once they are being fulfilled, nafl is where a servant expresses love, closeness, and longing that goes past the minimum required.",
      "There is a stunning promise attached to it. In a hadith qudsi, Allah says: 'My servant does not draw near to Me with anything more beloved to Me than what I have made obligatory upon him. And he continues to draw near to Me through voluntary deeds until I love him' — and once Allah loves a servant, his supplications are answered and his affairs are set right. Voluntary worship is therefore the ladder of nearness, climbing from mere obedience toward divine love.",
      "The Sunnah is rich with accessible forms of it: the night prayer (tahajjud) in the last part of the night, the forenoon prayer (duha), the regular sunnah prayers before and after the obligatory ones, and voluntary fasting such as Mondays and Thursdays or the white days of each month. Nafl worship also quietly patches up our shortfalls — the Prophet ﷺ taught that any deficiency in the obligatory prayers will be completed from a person's voluntary prayers on the Day of Judgement.",
      "The wisdom is that nafl keeps faith alive and growing. Obligations maintain the baseline, but voluntary acts are where the heart stretches, where private worship no one sees builds sincerity, and where a person trains himself for the harder tests of life. It is also a mercy that these acts are optional — Allah opens many doors so that each person can walk through the ones that suit him.",
      "Practically, the key is sustainability, not intensity. The Prophet ﷺ taught that the most beloved deeds to Allah are the most consistent, even if small. Choose a few voluntary acts you can genuinely keep — two rakahs of tahajjud, one fast a week, a fixed portion of Qur'an — rather than an ambitious burst that burns out within days.",
    ],
    quran: [
      {
        surah: 32,
        ayahFrom: 16,
        ayahTo: 17,
        label: "Qur'an 32:16–17",
        excerpt:
          "Their sides forsake their beds as they call upon their Lord in fear and hope, and they spend from what We have provided them. No soul knows what comfort is kept hidden for them as reward for what they used to do.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "6502",
        grade: "sahih",
        excerpt:
          "My servant does not draw near to Me with anything more beloved to Me than what I have made obligatory upon him. And My servant continues to draw near to Me through voluntary deeds until I love him.",
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
      "Patience (sabr) and gratitude (shukr) are the two wings by which a believer flies through life. Patience is steadfastness in three arenas: staying firm in obedience to Allah, holding back from disobedience, and bearing life's trials without complaint against His decree. Gratitude is recognising every blessing as coming from Allah and responding with thanks in the heart, on the tongue, and through obedient action. Together they cover the believer's response to both hardship and ease.",
      "Their importance is that they define how a believer meets everything that happens to him. The Prophet ﷺ marvelled that the entire affair of the believer is good: when good reaches him he is grateful and it is good for him, and when hardship strikes he is patient and that too is good for him — a blessing granted to no one but the believer. So whatever comes, the believer has a path to reward.",
      "The reward for patience is uniquely unlimited. While most deeds are rewarded by measured multiples, Allah says: 'The patient will be given their reward without measure' (Qur'an 39:10). And gratitude carries its own promise of increase: 'If you are grateful, I will surely increase you' (Qur'an 14:7). Thankfulness, then, is not only the right response to blessings — it is the very thing that causes them to grow.",
      "The wisdom here reframes suffering entirely. Trials are not automatically punishments; for a believer who responds well, they can be purification that wipes away sins and elevation that raises rank. The Prophet ﷺ taught that no fatigue, illness, worry, or even the prick of a thorn befalls a Muslim without Allah erasing some of his sins through it. This turns the hardest moments of life into opportunities rather than pure loss.",
      "Practically: when calamity strikes, respond with the words Allah taught — 'Inna lillahi wa inna ilayhi raji'un' (Indeed we belong to Allah, and to Him we return) — and hold your tongue from complaint that rejects His decree. In good times, count your blessings aloud and thank Allah for at least a few of them each day; naming them keeps the heart soft and grateful.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 155,
        ayahTo: 157,
        label: "Qur'an 2:155–157",
        excerpt:
          "Give glad tidings to the patient — those who, when disaster strikes, say: Indeed we belong to Allah, and indeed to Him we will return. Upon them are blessings from their Lord and mercy, and it is they who are rightly guided.",
      },
      {
        surah: 14,
        ayahFrom: 7,
        label: "Qur'an 14:7",
        excerpt:
          "If you are grateful, I will surely increase you; but if you deny, indeed My punishment is severe.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2999",
        grade: "sahih",
        excerpt:
          "Wondrous is the affair of the believer, for all his affairs are good. If ease comes he is grateful, and that is good for him; and if hardship comes he is patient, and that is good for him. This is for no one but the believer.",
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
      "Da'wah means inviting others toward Allah — sharing the message of Islam, teaching a person to pray, encouraging good, gently discouraging wrong, or helping a struggling Muslim return to obedience. It was the mission of every prophet and is a shared responsibility of the community, each according to his ability and knowledge. It is not reserved for scholars; anyone who conveys even one beneficial thing is calling to Allah.",
      "Its reward is one of the most generous in all of Islam. The Prophet ﷺ said that whoever guides someone to goodness has a reward like the one who acts upon it — and in another narration, whoever calls to guidance receives the reward of all who follow it, without their own reward being diminished in the slightest. This means the good you set in motion can keep multiplying your reward through every person it touches, long after you have moved on.",
      "But da'wah has an adab — a manner — that must be honoured for it to succeed. Allah commands: 'Invite to the way of your Lord with wisdom and good instruction, and argue with them in the best manner' (Qur'an 16:125). Wisdom means saying the right thing, to the right person, in the right way and time; harshness, arrogance, and point-scoring drive people away and betray the purpose. The caller's job is to convey and to plant, not to force hearts, which belong to Allah alone.",
      "The wisdom of tying such vast reward to guiding others is that it makes every believer a source of ongoing good. It also protects the caller's own faith: to invite others to prayer, honesty, and worship is to be reminded to hold fast to them oneself. And it binds the community together in mutual care rather than mutual neglect.",
      "Practically, start close to home. Improve and teach your own family — a spouse, a child, a sibling — since they are your first and most lasting responsibility. Share beneficial knowledge with kindness, help someone learn to pray or read the Qur'an, and remember that a life of good character and steady worship is often the most persuasive da'wah of all.",
    ],
    quran: [
      {
        surah: 16,
        ayahFrom: 125,
        label: "Qur'an 16:125",
        excerpt:
          "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best.",
      },
      {
        surah: 41,
        ayahFrom: 33,
        label: "Qur'an 41:33",
        excerpt:
          "And who is better in speech than one who invites to Allah, does righteousness, and says: Indeed, I am of the Muslims.",
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
      "Alongside the daily and weekly acts of worship, Islam points the believer toward a handful of major, lifelong deeds — large investments whose reward is immense and, in some cases, never-ending. These are the projects worth planning a life around: the pilgrimage, the raising of a righteous family, and the building of lasting good works.",
      "Foremost among them is Hajj, the fifth pillar of Islam, obligatory once in a lifetime upon every Muslim who is physically and financially able — 'Hajj to the House is a duty owed to Allah by people who are able to find a way' (Qur'an 3:97). Its reward is a complete cleansing: the Prophet ﷺ said that whoever performs Hajj for Allah's sake and avoids obscenity and sin returns free of sin, as pure as the day his mother gave birth to him. An accepted Hajj, he said, has no reward less than Paradise. Umrah, the lesser pilgrimage, also carries great reward and wipes away sins between one Umrah and the next.",
      "The second great investment is sadaqah jariyah — ongoing charity that keeps rewarding a person after death. The Prophet ﷺ named it among the three things that continue benefiting a person in the grave, along with beneficial knowledge and a righteous child who prays for him. Raising children upon faith and good character is perhaps the greatest of these, but so are building or maintaining a masjid, digging a well, sponsoring an orphan, planting a tree, or funding education — each a stream of reward that outlives the giver.",
      "The wisdom of these deeds is that they extend a person's account beyond his lifespan. A believer's active years are short, but a well he dug or a child he raised well can keep earning him reward for centuries. Islam thus encourages long-term vision: to think not only about today's prayer, but about what good will still be flowing from you after you are gone.",
      "Practically: if you are able, plan seriously for Hajj or Umrah rather than endlessly postponing it. Pour real effort into your family's faith and character, since they are your most lasting legacy. And identify at least one enduring charitable project to support — knowledge, water, shelter, or an orphan — so that your good deeds continue after death.",
    ],
    quran: [
      {
        surah: 3,
        ayahFrom: 97,
        label: "Qur'an 3:97",
        excerpt:
          "And Hajj to the House is a duty owed to Allah by those people who are able to find a way to it.",
      },
      {
        surah: 22,
        ayahFrom: 27,
        ayahTo: 28,
        label: "Qur'an 22:27–28",
        excerpt:
          "And proclaim to the people the Hajj; they will come to you on foot and on every lean camel from every distant pass, that they may witness benefits for themselves.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1521",
        grade: "sahih",
        excerpt:
          "Whoever performs Hajj for Allah's sake and does not commit obscenity or transgression returns free of sin, like the day his mother gave birth to him.",
      },
      {
        collection: "Sahih Muslim",
        citation: "1631",
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
      "After all the deeds, all the striving, and all the paths, the believer arrives at a humbling truth that is the final word on this journey: no one enters Paradise because of his deeds alone. The Prophet ﷺ stated it about himself — the most beloved of all creation to Allah — saying that not even he would enter Paradise by his own deeds, except that Allah envelops him in His mercy. If it is so for him, it is certainly so for us.",
      "This must never be misunderstood as a licence to neglect worship. Deeds remain the means Allah has chosen and commanded; He has tied His mercy to faith and righteous action, and abandoning them is not humility but heedlessness. The correct meaning is one of proportion: our deeds, however many, could never repay even a fraction of Allah's blessings upon us, nor purchase an eternity of Paradise. So we offer our deeds as a sign of love and obedience, then rely wholly on His grace to accept them and to admit us.",
      "The scope of that mercy is staggering. The Prophet ﷺ said that Allah divided mercy into one hundred parts; He sent down only a single part to the whole of creation — and it is by that one part that a mother is tender to her child and animals are gentle to their young — while He kept the remaining ninety-nine parts with Himself to bestow upon His servants on the Day of Resurrection. Whatever mercy we have ever witnessed in this world is a fraction of one part of a hundred.",
      "This is why the balanced believer lives between hope and fear, like a bird flying with two wings. He fears Allah's justice enough never to grow complacent or reckless with sin, and he hopes in Allah's mercy enough never to despair, no matter how far he has strayed. Tilting entirely toward fear breeds hopelessness; tilting entirely toward hope breeds arrogance. The Names of Allah — Ar-Rahman (the Most Compassionate), Ar-Raheem (the Most Merciful), Al-Ghafoor (the Most Forgiving) — anchor the wing of hope.",
      "So let this be the spirit in which you close each day: ask Allah for Al-Firdaws, do your honest best, repent for your shortcomings, and then hand your final rank over to the Most Just and Most Merciful — trusting that the One who kept ninety-nine parts of mercy for that Day will not turn away a servant who came to Him striving and hoping.",
    ],
    quran: [
      {
        surah: 7,
        ayahFrom: 156,
        label: "Qur'an 7:156",
        excerpt:
          "And My mercy encompasses all things. So I will decree it for those who are righteous and give zakah, and those who believe in Our verses.",
      },
      {
        surah: 39,
        ayahFrom: 53,
        label: "Qur'an 39:53",
        excerpt:
          "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "5673",
        grade: "sahih",
        excerpt:
          "None of you will enter Paradise by his deeds alone. They said: Not even you, O Messenger of Allah? He said: Not even me, unless Allah envelops me in His mercy.",
      },
      {
        collection: "Sahih Muslim",
        citation: "2752",
        grade: "sahih",
        excerpt:
          "Allah has one hundred parts of mercy. He sent down one part among the jinn, mankind, animals, and insects, by which they are compassionate to one another; and He kept ninety-nine parts with Himself, by which He will show mercy to His servants on the Day of Resurrection.",
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
        citation: "1897",
        grade: "sahih",
        excerpt:
          "Whoever spends a pair of anything in the way of Allah will be called from the gates of Paradise. Whoever was among the people of prayer will be called from the Gate of Prayer.",
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
        citation: "1897",
        grade: "sahih",
        excerpt: "Whoever was among the people of charity will be called from the Gate of Charity.",
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
          "There is a gate in Paradise called Ar-Rayyan, through which only those who fasted will enter on the Day of Resurrection. When the last of them has entered, it will be closed.",
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
        citation: "1897",
        grade: "sahih",
        excerpt: "Whoever was among the people of jihad will be called from the Gate of Jihad.",
      },
    ],
  },
  {
    id: "hajj",
    name: "Reward of Hajj",
    deedSummary: "For those who performed Hajj purely, returning free of sin.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1521",
        grade: "sahih",
        excerpt:
          "Whoever performs Hajj for Allah's sake and does not commit obscenity or transgression returns free of sin, like the day his mother gave birth to him.",
      },
    ],
  },
  {
    id: "multiple",
    name: "Called from every gate",
    deedSummary: "Some, like Abu Bakr, will be called to enter from all the gates.",
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1897",
        grade: "sahih",
        excerpt:
          "Abu Bakr asked: Will anyone be called from all of these gates? He said: Yes, and I hope you will be one of them.",
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
      "Race toward forgiveness from your Lord and a Garden as wide as the heavens and earth, prepared for the righteous.",
  },
  {
    id: "v-9-72",
    theme: "description",
    label: "Qur'an 9:72",
    surah: 9,
    ayahFrom: 72,
    excerpt:
      "Gardens beneath which rivers flow, and pleasant dwellings in Gardens of everlasting residence — but the pleasure of Allah is greater.",
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
    excerpt: "They are degrees with Allah, and Allah is Seeing of what they do.",
  },
  {
    id: "v-2-201",
    theme: "supplication",
    label: "Qur'an 2:201",
    surah: 2,
    ayahFrom: 201,
    excerpt:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
  },
  {
    id: "v-39-53",
    theme: "mercy",
    label: "Qur'an 39:53",
    surah: 39,
    ayahFrom: 53,
    excerpt: "Do not despair of the mercy of Allah — indeed, Allah forgives all sins.",
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
    excerpt: "And the forerunners, the forerunners — those are the ones brought near.",
  },
  {
    id: "v-76-11",
    theme: "reward",
    label: "Qur'an 76:11",
    surah: 76,
    ayahFrom: 11,
    excerpt:
      "So Allah will protect them from the evil of that Day and give them radiance and happiness.",
  },
];

export const JANNAH_DUAS: JannahDuaEntry[] = [
  {
    id: "dua-hasanah",
    context: "The comprehensive dua for good in both worlds and protection from the Fire.",
    duaId: "quranic-hasanah",
  },
  {
    id: "dua-jannah-nar",
    context: "A concise dua after tashahhud: ask for Paradise and refuge from the Fire.",
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
    note: "Named together in a hadith in Sunan al-Tirmidhi (3747, sahih).",
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

/** Al-Firdaws dua text (not in Hisnul bundle) for display on the Al-Firdaws topic. */
export const JANNAH_FIRDAWS_DUA = {
  arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْفِرْدَوْسَ الْأَعْلَىٰ مِنَ الْجَنَّةِ",
  transliteration: "Allahumma inni as'alukal-Firdawsal-a'la min al-jannah",
  translation: "O Allah, I ask You for Al-Firdaws — the highest part of Paradise.",
  reference: "Based on Sahih al-Bukhari 7423 — ask for Al-Firdaws specifically.",
};
