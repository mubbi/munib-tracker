import type { ProphetsTopic } from "../types/prophets";

/**
 * Individual biography topics for all twenty-five prophets named in the Qur'an.
 * Each biography is written as a self-contained mini-lesson: the prophet's call
 * to tawheed, their people, the key trial or miracle, the timeless lesson, and
 * cross-references into the Qur'an. Grounded strictly in the Qur'an and authentic
 * Sunnah; unverified narrations (Isra'iliyyat) are avoided or flagged as uncertain.
 */
export const PROPHETS_BIO_TOPICS: ProphetsTopic[] = [
  {
    id: "adam",
    section: "prophets",
    title: "Adam (AS)",
    summary:
      "The first human and the first prophet, honored with knowledge and tested with obedience.",
    body: [
      "Adam (peace be upon him) is where human history and prophethood begin. Allah created him with His own hands from clay, breathed into him from His spirit, and taught him the names of all things. When the angels were commanded to prostrate to Adam in honor, they obeyed — but Iblis refused out of arrogance, and from that moment his enmity toward Adam and his descendants was declared. This opening scene sets up the central drama of every human life: the choice between humble obedience and proud rebellion (Qur'an 2:30–39).",
      "Allah placed Adam and his wife Hawwa in the Garden and permitted them everything but one tree. Whispered to by Shaytan, they ate from it. But notice the difference between them and Iblis: Iblis justified his sin, while Adam and Hawwa immediately felt regret and turned back to Allah with the words He taught them — 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers' (Qur'an 7:23). Allah accepted their repentance and sent them to earth with the promise of guidance for all who would follow.",
      "The lesson of Adam is the lesson of hope: a human being is honored and dignified, yet is tested and will slip. What defines the believer is not being sinless — only Allah is perfect — but returning quickly and sincerely in tawbah. Adam's story also teaches that Shaytan is a declared, open enemy whose only weapon is whispering; the answer is remembering Allah and seeking His forgiveness. From Adam onward, the descent to earth is not a punishment but the stage for humanity's real test.",
    ],
    profile: {
      nation: "Early humanity",
      location: "Jannah then earth",
      era: "Beginning of human history",
      mission: "Teach tawheed and obedience to Allah to the first people.",
      challenges: [
        "Iblis's enmity",
        "Life after descent to earth",
        "Guiding the first human family",
      ],
      miracles: [
        "Creation by Allah's command without parents",
        "Being taught the names of all things",
      ],
      majorEvents: [
        "Creation of Adam and the teaching of the names",
        "The angels' prostration and Iblis's refusal",
        "The slip in the Garden, sincere repentance, and descent to earth",
      ],
      lessons: [
        "Human honor comes joined with responsibility",
        "Sincere repentance reopens the door after any mistake",
        "Shaytan is a clear, permanent enemy",
      ],
      facts: [
        "Adam is the first human being and the first prophet",
        "His repentance is the Qur'an's first model of tawbah",
      ],
    },
    quran: [
      {
        surah: 2,
        ayahFrom: 30,
        ayahTo: 39,
        label: "Qur'an 2:30–39",
        excerpt:
          "And [mention] when your Lord said to the angels: I will make upon the earth a successive authority... Then Adam received from his Lord words, and He accepted his repentance.",
      },
      {
        surah: 7,
        ayahFrom: 11,
        ayahTo: 27,
        label: "Qur'an 7:11–27",
        excerpt:
          "They said: Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "7510",
        grade: "sahih",
        excerpt:
          "On the Day of Resurrection the people will come to Adam and say: You are the father of mankind; intercede for us with your Lord.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "3409",
        grade: "sahih",
        excerpt:
          "Adam and Musa argued. Musa said: You are the one whom Allah created with His hand. Adam said: Do you blame me for a matter Allah decreed for me before He created me? So Adam prevailed over Musa in the argument.",
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
    summary: "A truthful prophet praised for patience and raised by Allah to a high station.",
    body: [
      "Idris (peace be upon him) is mentioned only briefly in the Qur'an, but every word about him is praise. Allah calls him 'a man of truth, a prophet' (Qur'an 19:56) and lists him among the patient and the righteous alongside Ismail and Dhul-Kifl (Qur'an 21:85–86). His story shows that in the sight of Allah, a person's character — truthfulness, patience, steadfast worship — matters more than the length of their biography.",
      "Allah says of him, 'And We raised him to a high station' (Qur'an 19:57). Scholars have understood this to refer to his elevated rank with Allah. Beyond what the Qur'an and authentic reports affirm, the popular tales attached to Idris (such as being the first to write with the pen or specific worldly professions) are not established through sound evidence, so a careful believer keeps to what revelation confirms rather than embellishing.",
      "The lesson of Idris is that closeness to Allah is not measured by fame or a long story, but by sincerity and consistency. A quiet, truthful, steadfast servant can hold a station with Allah higher than many whose names history remembers loudly.",
    ],
    profile: {
      era: "Early generations after Adam",
      mission: "Call people to worship Allah with truthfulness and righteousness.",
      lessons: [
        "Truthfulness raises a servant's rank",
        "Not every prophet's story is detailed — and that is by design",
        "Steady, faithful consistency is beloved to Allah",
      ],
      facts: [
        "Named in the Qur'an as truthful and a prophet",
        "Described as being raised to a high station by Allah",
      ],
    },
    quran: [
      {
        surah: 19,
        ayahFrom: 56,
        ayahTo: 57,
        label: "Qur'an 19:56–57",
        excerpt:
          "And mention in the Book Idris. Indeed, he was a man of truth and a prophet. And We raised him to a high station.",
      },
      {
        surah: 21,
        ayahFrom: 85,
        ayahTo: 86,
        label: "Qur'an 21:85–86",
        excerpt:
          "And Ismail and Idris and Dhul-Kifl — all were of the patient. And We admitted them into Our mercy; indeed, they were of the righteous.",
      },
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
    summary:
      "A messenger of extraordinary patience who called his people for centuries before the flood.",
    body: [
      "Nuh (peace be upon him) was sent to a people who had abandoned tawheed and taken to worshipping idols. His single, unwavering message was: 'O my people, worship Allah; you have no deity other than Him' (Qur'an 7:59). The Qur'an preserves his own account of the mission in Surah Nuh: he called them night and day, in public and in secret, offering both encouragement and warning — reminding them that turning back to Allah brings rain, wealth, children, and gardens. Yet generation after generation, most turned away, put their fingers in their ears, and grew only more arrogant (Qur'an 71:1–28).",
      "The Qur'an emphasizes the sheer length of his patience: he remained among them 'a thousand years less fifty' (Qur'an 29:14), and still only a few believed. When it became clear no more would accept faith, Allah commanded him to build the ark under divine instruction while the disbelievers mocked. Then the floodwaters came as judgment. Nuh's own son refused to board, trusting a mountain over his father's warning, and was among those drowned — a piercing reminder that blood ties cannot substitute for faith (Qur'an 11:42–46).",
      "Nuh's story is the Qur'an's masterclass in da'wah: the caller's duty is sincere, patient, clear delivery — results belong to Allah alone. It also teaches that guidance is a matter of the heart, not lineage: a prophet's son can be lost, while strangers can be saved. The believers who boarded the ark became the seed of a renewed humanity, and Nuh is honored as one of the five greatest messengers of firm resolve (ulul-'azm).",
    ],
    profile: {
      nation: "His people before the flood",
      location: "Ancient Mesopotamian region (broadly cited)",
      era: "Very early antiquity",
      mission: "Call his people to tawheed and repentance.",
      challenges: [
        "Mockery from the leaders and elite",
        "Centuries of rejection with few believers",
        "The disbelief and drowning of his own son",
      ],
      miracles: [
        "The ark built by divine instruction",
        "Salvation of the believers through the flood",
      ],
      majorEvents: [
        "A call to tawheed lasting nearly a thousand years",
        "Construction of the ark by Allah's command",
        "The flood and a new beginning for the believers",
      ],
      lessons: [
        "Persistence in da'wah, leaving the results to Allah",
        "Family ties cannot replace faith",
        "Allah always saves the sincere",
      ],
      facts: [
        "One of the five messengers of firm resolve (ulul-'azm)",
        "His story appears across many surahs, including one named after him",
      ],
    },
    quran: [
      {
        surah: 11,
        ayahFrom: 25,
        ayahTo: 49,
        label: "Qur'an 11:25–49",
        excerpt:
          "And it was revealed to Nuh that none of your people will believe except those who have already believed, so do not be distressed by what they have been doing.",
      },
      {
        surah: 71,
        ayahFrom: 1,
        ayahTo: 28,
        label: "Qur'an 71:1–28",
        excerpt:
          "He said: My Lord, indeed I invited my people night and day, but my invitation increased them only in flight.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "4712",
        grade: "sahih",
        excerpt:
          "The people will come to Nuh and say: O Nuh, you are the first of the messengers to the people of the earth, and Allah named you a grateful servant; intercede for us.",
      },
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
    summary:
      "Sent to 'Ad, a mighty and towering people who let their strength turn into arrogance.",
    body: [
      "Hud (peace be upon him) was sent to the people of 'Ad, a civilization the Qur'an describes as physically powerful and famous for building tall, elaborate structures 'the like of which had never been created in the land' (Qur'an 89:6–8). To this proud people Hud brought the same message as every prophet: 'O my people, worship Allah; you have no deity other than Him. Will you not fear Him?' (Qur'an 7:65). He was one of their own, asking no reward, only calling them to gratitude and away from oppression.",
      "Their leaders answered with mockery, accusing him of foolishness and lying, clinging to the idols of their forefathers. They challenged him to bring on the punishment he warned of, confident that no force could match their strength (Qur'an 46:21–25). Hud warned them plainly that worldly power and grand civilization protect no one who denies Allah's signs and grows arrogant on the earth.",
      "The judgment came as a furious, howling wind that Allah 'imposed upon them for seven nights and eight days in succession' (Qur'an 69:6–7), leaving the once-mighty people fallen like hollow trunks — while Hud and the believers were saved by Allah's mercy. The story of 'Ad is repeated throughout the Qur'an as a standing warning: strength, wealth, and achievement are gifts to be met with humility and gratitude, not pride. A nation is accountable to Allah no matter how advanced it becomes.",
    ],
    profile: {
      nation: "People of 'Ad",
      location: "Al-Ahqaf region (southern Arabian area in classical tafsir)",
      era: "After Nuh",
      mission: "Restore tawheed, gratitude, and justice among 'Ad.",
      challenges: [
        "Collective arrogance built on strength and wealth",
        "Mockery of revelation and the prophet",
        "A defiant demand for immediate punishment",
      ],
      miracles: ["The protection of the believers during the punishment"],
      majorEvents: [
        "The call to repentance and gratitude",
        "The warning of a severe wind",
        "The destruction of 'Ad over seven nights and eight days",
      ],
      lessons: [
        "Strength without humility leads to ruin",
        "Nations and civilizations are accountable to Allah",
        "Prophetic warnings are a mercy sent before judgment",
      ],
      facts: ["The story of 'Ad recurs across the Qur'an as a warning to later communities"],
    },
    quran: [
      {
        surah: 7,
        ayahFrom: 65,
        ayahTo: 72,
        label: "Qur'an 7:65–72",
        excerpt:
          "And to 'Ad [We sent] their brother Hud. He said: O my people, worship Allah; you have no deity other than Him. Will you not fear Him?",
      },
      {
        surah: 46,
        ayahFrom: 21,
        ayahTo: 26,
        label: "Qur'an 46:21–26",
        excerpt:
          "So when they saw it as a cloud approaching their valleys, they said: This is a cloud bringing us rain! Rather, it is that for which you were impatient: a wind within it a painful punishment.",
      },
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
    summary:
      "Sent to Thamud, who were given the miracle of the she-camel and destroyed the sign they demanded.",
    body: [
      "Salih (peace be upon him) was sent to Thamud, a people who succeeded 'Ad and were renowned for carving grand homes into the mountains and living in ease (Qur'an 7:74). He called them, as their own brother, to worship Allah alone and abandon the corruption of their leaders. When they demanded a sign to prove his truthfulness, Allah granted a clear and public one: a she-camel, with a fixed arrangement that it would drink on one appointed day and they on another (Qur'an 26:155–156).",
      "Salih warned them explicitly: 'Do not touch her with harm, lest you be seized by a near punishment' (Qur'an 26:156). The sign was a test of restraint — could they honor a limit set by Allah? But the most defiant among them hamstrung and killed the she-camel in open rebellion, then challenged Salih to bring the promised punishment (Qur'an 7:77). The killing of the camel is named as the act of the wretched few, yet the whole people shared in the crime by consenting to it.",
      "The punishment struck within three days: a mighty blast and earthquake seized them in their homes, and Thamud lay lifeless — while Allah rescued Salih and those who believed (Qur'an 7:78–79; 91:14). The lesson is sharp: miracles do not soften a stubborn heart; they only raise the stakes of accountability. A sign asked for and then defied becomes an argument against those who demanded it. And silence before evil is not neutrality — a whole nation was held responsible for the deed of a few.",
    ],
    profile: {
      nation: "People of Thamud",
      location: "Al-Hijr / northwestern Arabia",
      era: "After 'Ad",
      mission: "Call Thamud from idolatry and corruption to tawheed.",
      challenges: [
        "A demand for a miracle, then rejection of it",
        "Open defiance after the clear sign was given",
        "Threats against Salih and the believers",
      ],
      miracles: ["The she-camel sent as a visible sign from Allah"],
      majorEvents: [
        "The appearance of the she-camel and the shared water",
        "The hamstringing and killing of the she-camel",
        "The blast that destroyed the rejecters",
      ],
      lessons: [
        "Miracles do not benefit a stubborn heart",
        "Breaking a limit set by Allah carries real consequences",
        "Consenting to evil shares in its guilt",
      ],
      facts: ["Thamud were known for carving elaborate homes into the mountains"],
    },
    quran: [
      {
        surah: 7,
        ayahFrom: 73,
        ayahTo: 79,
        label: "Qur'an 7:73–79",
        excerpt:
          "This is the she-camel of Allah as a sign for you, so leave her to eat in Allah's land and do not touch her with harm, lest a painful punishment seize you.",
      },
      {
        surah: 91,
        ayahFrom: 11,
        ayahTo: 15,
        label: "Qur'an 91:11–15",
        excerpt:
          "Thamud denied by reason of their transgression, when the most wretched of them was sent forth... So their Lord brought down upon them destruction for their sin and leveled them.",
      },
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
    summary:
      "Khalilullah, the friend of Allah and the model of pure tawheed, tested and triumphant in every trial.",
    body: [
      "Ibrahim (peace be upon him) is the Qur'an's supreme example of pure monotheism reached through reflection and courage. As a young man in a society drowning in idol worship, he reasoned openly with his people, his father, and even the king: the sun, moon, and stars all set and fade, so how could they be gods? (Qur'an 6:75–79). To expose the idols' powerlessness, he broke them all but the largest and told his people to ask the idols themselves what happened — forcing them to admit their gods could neither speak nor defend themselves (Qur'an 21:57–67).",
      "For this stand he was thrown into a blazing fire, but Allah commanded, 'O fire, be coolness and safety upon Ibrahim' (Qur'an 21:69), and he emerged unharmed. His life became a chain of trials met with total surrender: he left his homeland for the sake of Allah, prayed for righteous offspring in old age and was granted Ismail and Ishaq, was tested with the command to sacrifice his beloved son — which both father and son accepted in submission before Allah ransomed the boy — and raised the foundations of the Ka'bah in Makkah with Ismail, praying for a nation of believers and for a messenger to be sent among them (Qur'an 2:124–129; 37:100–107).",
      "Because of this unmatched devotion, Allah took Ibrahim as a khalil — an intimate friend (Qur'an 4:125) — and made him an imam, a leader for all humanity (Qur'an 2:124). His legacy runs through the prophets who came from his line, through the rites of Hajj, and through the very identity of the Muslim, who is commanded to follow 'the religion of Ibrahim, inclining toward truth' (Qur'an 3:95). His story teaches tawakkul in the hardest tests, that true leadership is built on sacrifice, and that sincere faith can reshape entire generations.",
    ],
    profile: {
      nation: "Mesopotamian and Levantine communities",
      location: "Iraq, the Levant, and Makkah",
      era: "Middle antiquity",
      mission: "Revive pure tawheed and establish a lasting legacy of submission.",
      challenges: [
        "Confronting idolaters, his own father, and a tyrant king",
        "Migration away from his homeland for Allah",
        "The trial of sacrificing his beloved son",
      ],
      miracles: [
        "The fire made cool and safe by Allah's command",
        "Righteous offspring granted in old age",
      ],
      majorEvents: [
        "Debating and breaking the idols",
        "Being cast into the fire and delivered",
        "Building the Ka'bah with Ismail and the great trial of sacrifice",
      ],
      lessons: [
        "Tawakkul (reliance on Allah) in the severest tests",
        "True leadership requires sacrifice",
        "Sincere faith can reshape generations",
      ],
      facts: [
        "Known as Khalilullah, the intimate friend of Allah",
        "Forefather of the prophets through Ismail and Ishaq",
      ],
    },
    quran: [
      {
        surah: 2,
        ayahFrom: 124,
        ayahTo: 129,
        label: "Qur'an 2:124–129",
        excerpt:
          "And [mention] when Ibrahim was tried by his Lord with commands and he fulfilled them. He said: Indeed, I will make you a leader for the people.",
      },
      {
        surah: 21,
        ayahFrom: 51,
        ayahTo: 70,
        label: "Qur'an 21:51–70",
        excerpt:
          "We said: O fire, be coolness and safety upon Ibrahim. And they intended for him harm, but We made them the greatest losers.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3349",
        grade: "sahih",
        excerpt:
          "You will be gathered barefoot, naked, and uncircumcised. The first to be clothed on the Day of Resurrection will be Ibrahim.",
      },
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
    summary:
      "A prophet who warned his people against a grave immorality no nation had committed before them.",
    body: [
      "Lut (peace be upon him) was a contemporary and relative of Ibrahim who migrated with him and was then sent to the people of Sodom and the nearby towns. Alongside the call to worship Allah alone, his people were guilty of a shameless immorality the Qur'an says 'no one in all the worlds had committed before' — approaching men instead of women, and openly practicing indecency in their gatherings (Qur'an 7:80–81; 29:28–29). Lut called them, with sincerity, to purity and to the natural bounds Allah set.",
      "They met his reform not with argument but with hostility, threatening to expel him and mocking his call to decency: 'Drive them out of your town; they are people who keep themselves pure!' (Qur'an 7:82). Even within his own household the trial was severe — his wife sided with the corrupt and did not believe, proving again that guidance is granted by Allah and not inherited through marriage or blood (Qur'an 66:10).",
      "When the decree came, Allah sent angels in the form of guests. The people rushed to harm even them, and Lut felt powerless until the angels revealed their identity and told him to leave with the believers by night. At dawn the towns were overturned and pelted with stones (Qur'an 11:77–83). Lut's story is a clear warning that moral truth does not change because a society approves of sin and normalizes it publicly — and that Allah always rescues the sincere, however few they may be.",
    ],
    profile: {
      nation: "People of Sodom and the neighboring towns",
      location: "Region of the Dead Sea (broadly cited)",
      era: "Time of Ibrahim",
      mission: "Call his people from open indecency and disbelief to tawheed and purity.",
      challenges: [
        "Entrenched public immorality",
        "Mockery and threats of expulsion",
        "The disbelief of his own wife",
      ],
      majorEvents: [
        "Persistent warnings against indecency",
        "The visit of the angels disguised as guests",
        "The overturning of the towns",
      ],
      lessons: [
        "Moral truth does not change with social approval",
        "The believers may be very few",
        "Allah rescues the sincere from collective ruin",
      ],
      facts: ["A relative of Ibrahim who migrated with him and was sent to Sodom"],
    },
    quran: [
      {
        surah: 26,
        ayahFrom: 160,
        ayahTo: 175,
        label: "Qur'an 26:160–175",
        excerpt:
          "Do you approach males among the worlds and leave what your Lord has created for you as mates? Rather, you are a transgressing people.",
      },
      {
        surah: 11,
        ayahFrom: 77,
        ayahTo: 83,
        label: "Qur'an 11:77–83",
        excerpt:
          "So when Our command came, We made the highest part of the cities their lowest and rained upon them stones of layered hard clay.",
      },
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
    summary:
      "A prophet true to his word, patient in trial, and builder of the Ka'bah with his father Ibrahim.",
    body: [
      "Ismail (peace be upon him) was the firstborn son of Ibrahim, granted in old age. His life began with a staggering test of trust: by Allah's command, Ibrahim left the infant Ismail and his mother Hajar in the barren valley of Makkah, where no crops grew and no water flowed. It was there, as Hajar ran in search of water between the hills of Safa and Marwah, that Allah caused the spring of Zamzam to gush forth — an act of provision that Hajar's descendants and every pilgrim reenact in the sa'i of Hajj and Umrah to this day.",
      "As a young man, Ismail met the greatest test alongside his father: when Ibrahim told him of the vision to sacrifice him, Ismail answered with breathtaking submission, 'O my father, do as you are commanded; you will find me, if Allah wills, of the steadfast' (Qur'an 37:102). Both surrendered fully, and Allah ransomed Ismail with a great sacrifice, honoring their obedience forever. Father and son then raised the foundations of the Ka'bah together, praying, 'Our Lord, accept this from us; indeed You are the Hearing, the Knowing' (Qur'an 2:127).",
      "The Qur'an sums up his character in a line worth memorizing: 'He was true to his promise, and he was a messenger and a prophet. He used to command his family to prayer and zakah, and he was pleasing to his Lord' (Qur'an 19:54–55). Ismail's life teaches the beauty of keeping one's word, of steadfast worship, and of a family cooperating in obedience to Allah. Through him, the Arabian prophetic line eventually reached the final Prophet, Muhammad ﷺ.",
    ],
    profile: {
      nation: "The early people of the Makkah region",
      location: "Makkah",
      era: "After Ibrahim's migration",
      mission: "Uphold tawheed and worship, and command his family to prayer and zakah.",
      challenges: [
        "The harsh beginnings of life in a barren valley",
        "The trial of the sacrifice",
        "Maintaining a worship-centered life and sacred trust",
      ],
      miracles: [
        "The spring of Zamzam provided in the desert",
        "Ransomed from the sacrifice by Allah",
      ],
      majorEvents: [
        "Left with his mother Hajar in the valley of Makkah",
        "The trial of the sacrifice, met with full submission",
        "Building the Ka'bah with Ibrahim",
      ],
      lessons: [
        "Keep your promises faithfully",
        "A family can cooperate in worship and obedience",
        "A sacred legacy demands strong character",
      ],
      facts: [
        "Described in the Qur'an as true to his promise",
        "Forefather of the Arab tribes and the final prophetic line",
      ],
    },
    quran: [
      {
        surah: 19,
        ayahFrom: 54,
        ayahTo: 55,
        label: "Qur'an 19:54–55",
        excerpt:
          "And mention in the Book Ismail. Indeed, he was true to his promise, and he was a messenger and a prophet. He used to command his family to prayer and zakah, and he was pleasing to his Lord.",
      },
      {
        surah: 2,
        ayahFrom: 127,
        ayahTo: 129,
        label: "Qur'an 2:127–129",
        excerpt:
          "And when Ibrahim was raising the foundations of the House and Ismail, [they prayed]: Our Lord, accept this from us. Indeed, You are the Hearing, the Knowing.",
      },
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
    summary: "A blessed prophet given as glad tidings to Ibrahim, and father of Ya'qub.",
    body: [
      "Ishaq (peace be upon him) was born to Ibrahim and his wife Sarah in their old age — a birth announced by the angels as glad tidings when Sarah, past the age of childbearing, laughed in astonishment. The Qur'an records the moment: 'We gave her good tidings of Ishaq and, after Ishaq, Ya'qub' (Qur'an 11:71). His very birth was a sign that Allah's power and mercy are not bound by ordinary human limits, and a comfort to every believer waiting on a difficult hope.",
      "The Qur'an consistently names Ishaq among the righteous, chosen, and noble prophets, describing him and Ya'qub as having been given 'strength in worship and vision' (Qur'an 38:45–47). Through Ishaq came Ya'qub (Isra'il), and from Ya'qub descended a long chain of prophets sent to Bani Isra'il — so that Ishaq stands as a father of prophecy, a link in the continuity of guidance across the generations.",
      "His story, though told briefly, carries two lasting lessons: gratitude for the gifts Allah grants beyond our expectations, and awareness that righteous lineage is a trust — faith must be passed on, not merely inherited. The blessing placed in Ibrahim's household was preserved because it was carried by servants devoted to Allah.",
    ],
    profile: {
      nation: "Levantine communities",
      location: "The Levant (Sham)",
      era: "After Ibrahim",
      mission: "Continue prophetic guidance in Ibrahim's blessed family line.",
      miracles: ["A birth announced to aged parents as glad tidings"],
      majorEvents: [
        "The glad tidings given to Ibrahim and Sarah",
        "The continuation of the prophetic lineage through Ya'qub",
      ],
      lessons: [
        "Allah grants far beyond human expectation",
        "Righteous lineage is a trust to be preserved",
        "Faithful succession keeps guidance alive",
      ],
      facts: ["Father of Ya'qub", "Named alongside Ibrahim and Ya'qub as a chosen family"],
    },
    quran: [
      {
        surah: 11,
        ayahFrom: 71,
        ayahTo: 73,
        label: "Qur'an 11:71–73",
        excerpt:
          "And his wife was standing, and she laughed. Then We gave her good tidings of Ishaq and, after Ishaq, Ya'qub.",
      },
      {
        surah: 38,
        ayahFrom: 45,
        ayahTo: 47,
        label: "Qur'an 38:45–47",
        excerpt:
          "And remember Our servants Ibrahim, Ishaq, and Ya'qub, those of strength and vision. Indeed, We chose them for an exclusive quality: remembrance of the Home.",
      },
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
    summary:
      "Also called Isra'il, a prophet whose beautiful patience through grief models unshaken trust in Allah.",
    body: [
      "Ya'qub (peace be upon him), also called Isra'il, was the son of Ishaq and the father of the twelve who became the tribes of Bani Isra'il — including Yusuf. He raised his children on tawheed, and the Qur'an preserves the covenant he took from them on his deathbed: 'What will you worship after me?' They answered, 'We will worship your God and the God of your fathers... one God, and to Him we submit' (Qur'an 2:132–133). His deepest concern, to the very end, was the faith of the next generation.",
      "His great trial unfolds within the story of Yusuf. When his sons returned with Yusuf's shirt and a false claim that a wolf had devoured him, Ya'qub saw through the deception and responded not with rage but with restraint: 'So patience is most fitting, and Allah is the one whose help is sought against what you describe' (Qur'an 12:18). For long years of separation he grieved until, as the Qur'an poignantly says, his eyes turned white from sorrow — yet he suppressed his grief and never despaired (Qur'an 12:84).",
      "The heart of Ya'qub's example is one sentence: 'Do not despair of the mercy of Allah; indeed, no one despairs of Allah's mercy except the disbelieving people' (Qur'an 12:87). His is the model of sabr jamil — beautiful patience — which is not passive resignation but active, hopeful trust that Allah's wisdom will unfold in its time. When Yusuf was finally restored to him and his sight returned, that patience was vindicated. Ya'qub teaches every grieving believer to hold both sorrow and certainty in the same heart.",
    ],
    profile: {
      nation: "The origins of Bani Isra'il",
      location: "The Levant, with migration to Egypt",
      era: "The generation of Yusuf",
      mission: "Guide his household and descendants in tawheed.",
      challenges: [
        "Tensions and jealousy among his sons",
        "The long separation from Yusuf",
        "Enduring deep grief without losing hope",
      ],
      majorEvents: [
        "His counsel and covenant of tawheed to his sons",
        "Long years of patient grief over Yusuf",
        "The joyful reunion with Yusuf in Egypt",
      ],
      lessons: [
        "Beautiful patience (sabr jamil) is active, hopeful faith",
        "Parents shape the faith legacy of their children",
        "Never despair of the mercy of Allah",
      ],
      facts: ["Also called Isra'il", "Father of Yusuf and the tribes of Bani Isra'il"],
    },
    quran: [
      {
        surah: 12,
        ayahFrom: 83,
        ayahTo: 87,
        label: "Qur'an 12:83–87",
        excerpt:
          "He said: Rather, your souls have enticed you to something. So patience is most fitting. Perhaps Allah will bring them to me all together.",
      },
      {
        surah: 2,
        ayahFrom: 132,
        ayahTo: 133,
        label: "Qur'an 2:132–133",
        excerpt:
          "They said: We will worship your God and the God of your fathers, Ibrahim, Ismail, and Ishaq — one God, and to Him we are submitting.",
      },
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
    summary:
      "A prophet whose journey from a well to the throne of Egypt teaches purity, patience, and forgiveness.",
    body: [
      "Yusuf (peace be upon him) is the subject of the Qur'an's most complete single narrative — Surah Yusuf, which Allah calls 'the best of stories' (Qur'an 12:3). As a boy he saw a true dream of eleven stars, the sun, and the moon prostrating to him. His envious brothers threw him into a well and sold him into slavery in Egypt, where he was bought into the house of a powerful official. Through every reversal, Yusuf guarded his faith and his integrity.",
      "His purity was tested when the wife of his master tried to seduce him. He refused, saying, 'I seek the refuge of Allah,' and preferred prison to sin: 'Prison is more beloved to me than that to which they invite me' (Qur'an 12:33). Though innocent, he was imprisoned for years — and even there he called his fellow prisoners to tawheed and interpreted their dreams. When the king's own dream about seven years of famine baffled the court, Yusuf's God-given gift of interpretation brought him before the king, who placed him in charge of Egypt's treasuries. He managed the nation through famine with wisdom and justice.",
      "The story's climax is not power but forgiveness. When his brothers, driven by hunger, stood before him not recognizing him, Yusuf revealed himself and said, 'No blame will there be upon you today. Allah will forgive you, and He is the most merciful of the merciful' (Qur'an 12:92). He credited Allah for every good, saying his Lord had been kind when He brought him out of prison and reunited the family. Yusuf teaches that chastity and taqwa protect the believer, that Allah's plan quietly overrides every human plot, and that forgiveness — not revenge — is the mark of the noble.",
    ],
    profile: {
      nation: "The family line of Bani Isra'il in Egypt",
      location: "Canaan and Egypt",
      era: "Before Musa",
      mission: "Uphold tawheed, purity, and justice while serving society.",
      challenges: [
        "Betrayal by his brothers",
        "Temptation and false slander",
        "Long imprisonment despite innocence",
      ],
      miracles: ["The God-given gift of true dream interpretation"],
      majorEvents: [
        "The well and separation from his father",
        "The years of imprisonment",
        "Rise to authority in Egypt and reunion with his family",
      ],
      lessons: [
        "Chastity and integrity protect faith",
        "Forgiveness heals families",
        "Allah's plan surpasses every human plot",
      ],
      facts: ["The entire Surah Yusuf, called the best of stories, centers on his life"],
    },
    quran: [
      {
        surah: 12,
        ayahFrom: 1,
        ayahTo: 111,
        label: "Qur'an 12:1–111",
        excerpt:
          "He said: No blame will there be upon you today. May Allah forgive you; and He is the most merciful of the merciful.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3390",
        grade: "sahih",
        excerpt:
          "The noble, son of the noble, son of the noble, son of the noble: Yusuf, son of Ya'qub, son of Ishaq, son of Ibrahim.",
      },
    ],
    appLinks: [
      { label: "Read Surah Yusuf", route: "/quran/12" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
  {
    id: "shuayb",
    section: "prophets",
    title: "Shu'ayb (AS)",
    summary:
      "A prophet who tied faith to honesty in trade and warned Madyan against fraud and injustice.",
    body: [
      "Shu'ayb (peace be upon him) was sent to the people of Madyan, a trading community that had corrupted its economy through cheating: giving short measure and weight, defrauding people of their goods, and spreading injustice in the land. His message united the two halves of faith that people often try to separate — worship and ethics: 'O my people, worship Allah; you have no deity other than Him. And give full measure and weight in justice, and do not deprive people of their due' (Qur'an 11:84–85).",
      "His people resisted, sarcastically asking whether his prayers required them to abandon the fraudulent customs of their fathers and do as they pleased with their own wealth (Qur'an 11:87). They mocked him, threatened him and the believers with expulsion, and even blocked the roads. Shu'ayb persisted with compassion and clear reminders, insisting he only sought reform as far as he was able, and that his success was from Allah alone: 'And my success is not but through Allah. Upon Him I have relied, and to Him I return' (Qur'an 11:88). He is remembered for his eloquence in calling his people.",
      "When they persisted in rejection, the punishment came and seized the wrongdoers, while Allah saved Shu'ayb and the believers (Qur'an 7:91–93). His biography delivers a lesson often overlooked: economic honesty is not separate from religion — it is part of it. Cheating in the marketplace, exploiting the vulnerable, and manipulating measures are matters of faith, and a society that legalizes injustice invites the judgment of Allah.",
    ],
    profile: {
      nation: "The people of Madyan",
      location: "Northwestern Arabian / Levantine trade region",
      era: "After the generations of Ibrahim",
      mission: "Call to tawheed and to honesty and justice in trade.",
      challenges: [
        "Entrenched market corruption",
        "Mockery from the elite",
        "Threats of expulsion",
      ],
      majorEvents: [
        "The call to full measure and fair dealing",
        "Public opposition and threats",
        "The punishment of the persistent rejecters",
      ],
      lessons: [
        "Faith demands honesty in business",
        "Public injustice invites divine judgment",
        "Prophets address social and economic ethics, not ritual alone",
      ],
      facts: ["Known for emphasizing just weights and measures"],
    },
    quran: [
      {
        surah: 7,
        ayahFrom: 85,
        ayahTo: 93,
        label: "Qur'an 7:85–93",
        excerpt:
          "O my people, worship Allah; you have no deity other than Him. Give full measure and weight and do not deprive people of their due, and cause not corruption upon the earth.",
      },
      {
        surah: 11,
        ayahFrom: 84,
        ayahTo: 95,
        label: "Qur'an 11:84–95",
        excerpt:
          "And my success is not but through Allah. Upon Him I have relied, and to Him I return.",
      },
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
    summary:
      "The Qur'an's model of patience: unshaken in devotion through prolonged illness and loss.",
    body: [
      "Ayyub (peace be upon him) — Job — is the enduring symbol of sabr in the Qur'an. He was a prophet blessed with health, wealth, and family, and then tested by losing them, and by a long, painful illness. Through it all he never turned bitter or accused his Lord of injustice; he held fast to gratitude and remembrance. The Qur'an praises him with words that capture his whole story: 'Indeed, We found him patient, an excellent servant. Indeed, he was one repeatedly turning back to Allah' (Qur'an 38:44).",
      "When at last the hardship became overwhelming, notice the perfect manners (adab) of his dua. He did not demand or complain against Allah's decree; he simply and humbly laid his state before his Lord: 'Indeed, adversity has touched me, and You are the most merciful of the merciful' (Qur'an 21:83). He affirmed Allah's mercy in the very moment of asking. Allah answered him, saying, 'Strike the ground with your foot; this is a cool bath and a drink,' and He removed the affliction and restored his family and more, as a mercy from Him and a reminder for the worshippers (Qur'an 21:84; 38:41–43).",
      "Ayyub teaches that patience is not a passive endurance but an active form of worship — a continuous turning back to Allah while under trial. His example also refines how we make dua: with humility, without complaint against the decree, and with certainty in Allah's mercy. And his ending reassures every tested believer that trials, borne with faith, can raise a servant's rank and are always followed by relief in Allah's timing.",
    ],
    profile: {
      era: "Post-Ibrahimic prophetic era (broad context)",
      mission: "Guide his people while embodying patience and worship in hardship.",
      challenges: [
        "A long and painful illness",
        "The loss of wealth and family",
        "Endurance under a prolonged test",
      ],
      miracles: [
        "Healing and relief by Allah's command",
        "Restoration of family and blessing after trial",
      ],
      majorEvents: [
        "His humble supplication in hardship",
        "Divine relief, healing, and restoration",
      ],
      lessons: [
        "Patience is an active form of worship",
        "Dua is most beautiful when humble and free of complaint",
        "Trials borne with faith can elevate one's rank",
      ],
      facts: ["Cited throughout Islamic tradition as the model of sabr"],
    },
    quran: [
      {
        surah: 21,
        ayahFrom: 83,
        ayahTo: 84,
        label: "Qur'an 21:83–84",
        excerpt:
          "And Ayyub, when he called to his Lord: Indeed, adversity has touched me, and You are the most merciful of the merciful.",
      },
      {
        surah: 38,
        ayahFrom: 41,
        ayahTo: 44,
        label: "Qur'an 38:41–44",
        excerpt:
          "Indeed, We found him patient, an excellent servant. Indeed, he was one repeatedly turning back to Allah.",
      },
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
    summary: "A righteous prophet counted among the patient, honored though his story is brief.",
    body: [
      "Dhul-Kifl (peace be upon him) is named twice in the Qur'an, both times in the company of honored prophets. Allah lists him with Ismail and Idris — 'all were of the patient. And We admitted them into Our mercy; indeed, they were of the righteous' (Qur'an 21:85–86) — and again mentions him among the excellent alongside Ismail and Al-Yasa' (Qur'an 38:48). Every mention is praise, even though no detailed narrative is given.",
      "Because the Qur'an and authentic Sunnah do not expand on his life, classical scholars differ over even the basic details — some considered whether he was a prophet or a righteous man, though he is counted among the prophets in mainstream Muslim lists. A careful believer resists filling the silence with unverified tales and holds instead to what Allah affirms: he was patient and righteous, and that is honor enough.",
      "His inclusion carries a quiet lesson: not every servant beloved to Allah leaves behind a famous story. Consistent, faithful service — the kind that is never recorded by history but is fully known to Allah — is precisely the kind that earns His mercy. Hidden steadfastness is not lesser; it is the substance of a righteous life.",
    ],
    profile: {
      era: "Later pre-Isa prophetic periods (broadly placed)",
      mission: "Call his people to obedience and righteousness.",
      lessons: [
        "Patience is at the core of prophetic character",
        "Limited detail still carries strong guidance",
        "Faithful, unseen service is beloved to Allah",
      ],
      facts: [
        "Named with Ismail and Idris among the patient",
        "Counted among the prophets in mainstream Muslim lists",
      ],
    },
    quran: [
      {
        surah: 21,
        ayahFrom: 85,
        ayahTo: 86,
        label: "Qur'an 21:85–86",
        excerpt:
          "And Ismail and Idris and Dhul-Kifl — all were of the patient. And We admitted them into Our mercy; indeed, they were of the righteous.",
      },
      {
        surah: 38,
        ayahFrom: 48,
        ayahTo: 48,
        label: "Qur'an 38:48",
        excerpt: "And remember Ismail, Al-Yasa', and Dhul-Kifl, and all are among the outstanding.",
      },
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
    summary:
      "The great messenger to Bani Isra'il who confronted Pharaoh's tyranny and received the Torah.",
    body: [
      "Musa (peace be upon him) is the most frequently mentioned prophet in the Qur'an, and his story is told in rich detail. Born under Pharaoh's decree to kill the sons of Bani Isra'il, he was placed as an infant in a basket on the Nile by his mother — on Allah's inspiration — and, by Allah's plan, raised in Pharaoh's own palace (Qur'an 28:7–13). Years later, after leaving Egypt and marrying in Madyan, he was called by Allah at the sacred valley of Tuwa, where Allah spoke to him directly, showed him the sign of the staff and the hand, and sent him with his brother Harun to the tyrant Pharaoh (Qur'an 20:9–36).",
      "His mission was to deliver two things: the call to worship Allah alone, and the demand to free the oppressed children of Isra'il. Pharaoh, who claimed to be a god, met him with defiance, and even after a series of clear signs — the staff that became a serpent and swallowed the magicians' tricks, and the plagues — he refused to submit. When Musa led Bani Isra'il out, Pharaoh pursued them to the sea. There Allah commanded, 'Strike the sea with your staff,' and it parted so the believers crossed on dry land while Pharaoh and his army were drowned (Qur'an 26:63–66).",
      "But liberation was only the beginning. Musa then bore the harder, longer trial of leading a difficult and often ungrateful people: he received the Torah at the mount, only to return and find them worshipping a golden calf; he faced their complaints, their demands, and their disobedience with patient, firm leadership. Musa's life joins two great themes — the courage to stand against injustice and tyranny, and the endurance required to guide people toward obedience once they are free. As one of the ulul-'azm, he is a model of both the reformer and the shepherd of a community.",
    ],
    profile: {
      nation: "Bani Isra'il (with the call directed to Pharaoh's people)",
      location: "Egypt and Sinai",
      era: "Before Dawud and Sulayman",
      mission: "Call to tawheed, confront Pharaoh's oppression, and deliver the Torah.",
      challenges: [
        "Confronting Pharaoh, who claimed divinity",
        "Leading a resistant and ungrateful people",
        "Sustained leadership under constant pressure",
      ],
      miracles: [
        "The staff that turned into a serpent",
        "The parting of the sea by Allah's command",
        "The many signs shown before Pharaoh",
      ],
      majorEvents: [
        "Allah speaking to him at the sacred valley",
        "The confrontation with Pharaoh and the magicians",
        "The Exodus and the revelation of the Torah",
      ],
      lessons: [
        "Stand courageously against tyranny",
        "Leadership over people requires great patience",
        "Freedom must be joined to obedience to Allah",
      ],
      facts: [
        "One of the five messengers of firm resolve (ulul-'azm)",
        "Called Kalimullah — the one to whom Allah spoke directly",
      ],
    },
    quran: [
      {
        surah: 20,
        ayahFrom: 9,
        ayahTo: 98,
        label: "Qur'an 20:9–98",
        excerpt:
          "And I have chosen you, so listen to what is revealed. Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.",
      },
      {
        surah: 28,
        ayahFrom: 3,
        ayahTo: 46,
        label: "Qur'an 28:3–46",
        excerpt:
          "And We inspired the mother of Musa: Suckle him, but when you fear for him, cast him into the river and do not fear or grieve. Indeed, We will return him to you.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3407",
        grade: "sahih",
        excerpt:
          "The angel of death was sent to Musa. When he came to him, Musa struck him, and Allah restored his eye and gave him a choice regarding the time of his death.",
      },
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
    summary: "The eloquent brother of Musa, appointed as his supporting prophet before Pharaoh.",
    body: [
      "Harun (peace be upon him) was the elder brother of Musa and a prophet in his own right. When Allah sent Musa to Pharaoh, Musa asked for support: 'And appoint for me a minister from my family — Harun, my brother. Increase through him my strength and let him share my task' (Qur'an 20:29–32). Allah granted the request, and the Qur'an records His answer: 'We will strengthen your arm through your brother' (Qur'an 28:35). Harun, described as more eloquent in speech, stood beside Musa as they delivered Allah's message to the tyrant.",
      "His most testing moment came in Musa's absence. When Musa went to receive the Torah at the mount, Bani Isra'il fell into worshipping a golden calf. Harun tried to hold them back, warning, 'O my people, you are only being tested by it, and indeed your Lord is the Most Merciful, so follow me and obey my order' — but they overpowered his authority and nearly harmed him (Qur'an 20:90–94). When Musa returned in anger, Harun explained that he had feared that acting more forcefully would split the community into warring factions before Musa could return (Qur'an 7:150).",
      "Harun's biography highlights the value of teamwork in the service of Allah — a mission carried by two is stronger than one — and the delicate wisdom of preserving unity without ever compromising the truth. Sometimes faithful leadership means holding a fracturing community together and restraining harm until matters can be set right. Harun is honored in the Qur'an among the guided, and Allah left for him and Musa lasting praise among later generations (Qur'an 37:119–122).",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Egypt and Sinai",
      era: "The era of Musa",
      mission: "Support Musa in calling to tawheed and guiding Bani Isra'il.",
      challenges: [
        "Confronting Pharaoh's regime",
        "Managing the community during Musa's absence",
        "Preventing a greater split among the people",
      ],
      majorEvents: [
        "Appointment as minister and support to Musa",
        "The mission before Pharaoh",
        "The trial of the golden calf",
      ],
      lessons: [
        "Teamwork strengthens the call to Allah",
        "Leadership sometimes means holding people together in a crisis",
        "Preserve unity without ever compromising the truth",
      ],
      facts: ["The elder brother of Musa", "Praised in the Qur'an for his eloquence"],
    },
    quran: [
      {
        surah: 20,
        ayahFrom: 29,
        ayahTo: 36,
        label: "Qur'an 20:29–36",
        excerpt:
          "And appoint for me a minister from my family — Harun, my brother. Increase through him my strength and let him share my task.",
      },
      {
        surah: 7,
        ayahFrom: 142,
        ayahTo: 151,
        label: "Qur'an 7:142–151",
        excerpt:
          "He said: Son of my mother, indeed the people overpowered me and were about to kill me, so let not the enemies rejoice over me.",
      },
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
    summary:
      "A prophet-king given wisdom, justice, and the Zabur, and a model of worship-centered leadership.",
    body: [
      "Dawud (peace be upon him) — David — began as a young man in the army of Talut (Saul) against the tyrant Jalut (Goliath). It was Dawud who struck down Jalut, and 'Allah gave him sovereignty and wisdom and taught him from that which He willed' (Qur'an 2:251). Allah then granted him kingship, prophethood, and a revealed scripture, the Zabur (Psalms), making him a rare example of a ruler who was also a devoted worshipper.",
      "Allah gave him remarkable gifts: the mountains and birds would join him in glorifying Allah, and iron was made soft in his hands so he could fashion armor (Qur'an 21:79; 34:10–11). Yet with all this power, Dawud remained deeply humble and devoted. His worship was so intense that the Prophet ﷺ described the fasting of Dawud — fasting every other day — as the most beloved fasting to Allah, and his night prayer as the most beloved prayer. The Qur'an also presents an episode of judgment in which Dawud, gently corrected, immediately fell in prostration, sought forgiveness, and turned back to his Lord (Qur'an 38:24) — his strength never placing him above accountability.",
      "Dawud's life teaches that authority is a trust, not a privilege. Allah addresses him directly: 'O Dawud, We have made you a successor upon the earth, so judge between the people in truth and do not follow desire' (Qur'an 38:26). Justice, constant remembrance of Allah, quick repentance, and a disciplined life of worship are what sustain righteous leadership. Power is safest in the hands of one who bows the most.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Jerusalem region",
      era: "Before Sulayman's rule",
      mission: "Lead with justice, judge in truth, and call his people to Allah.",
      challenges: [
        "The weight of judicial responsibility",
        "Balancing power with humility",
        "Public accountability in leadership",
      ],
      miracles: [
        "The mountains and birds glorifying Allah with him",
        "Iron made soft in his hands by Allah's permission",
      ],
      majorEvents: [
        "The defeat of Jalut in his youth",
        "Kingship, prophethood, and the revelation of the Zabur",
        "The legacy passed to his son Sulayman",
      ],
      lessons: [
        "Justice is central to righteous rule",
        "Repent quickly after any mistake",
        "A disciplined life of worship strengthens leadership",
      ],
      facts: ["Recipient of the Zabur (Psalms)", "Defeated Jalut (Goliath) as a young man"],
    },
    quran: [
      {
        surah: 38,
        ayahFrom: 17,
        ayahTo: 26,
        label: "Qur'an 38:17–26",
        excerpt:
          "O Dawud, indeed We have made you a successor upon the earth, so judge between the people in truth and do not follow desire, as it will lead you astray from the way of Allah.",
      },
      {
        surah: 21,
        ayahFrom: 78,
        ayahTo: 80,
        label: "Qur'an 21:78–80",
        excerpt:
          "And We subjected the mountains to glorify with Dawud, and the birds as well... And We taught him the fashioning of coats of armor to protect you from your enemy.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1131",
        grade: "sahih",
        excerpt:
          "The most beloved prayer to Allah is the prayer of Dawud, and the most beloved fasting to Allah is the fasting of Dawud: he would fast one day and break his fast the next.",
      },
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
    summary: "A prophet-king given unmatched authority yet grounded in gratitude and wisdom.",
    body: [
      "Sulayman (peace be upon him) — Solomon — inherited both kingship and prophethood from his father Dawud, and the Qur'an praises him as 'an excellent servant, indeed one repeatedly turning back to Allah' (Qur'an 38:30). He prayed for a kingdom unlike any that would follow, and Allah granted him extraordinary means: command over the wind, which ran by his order; the service of jinn who built and dove for him by Allah's permission; and understanding of the speech of birds and other creatures (Qur'an 21:81–82; 34:12–13; 27:16).",
      "Two scenes capture his character. When an ant warned its colony to take cover lest Sulayman's army crush them unknowingly, Sulayman smiled and thanked Allah for the favor of understanding, praying to be made grateful and righteous (Qur'an 27:18–19) — power made him more humble, not less. And when he heard of the Queen of Sheba (Saba') and her people worshipping the sun, he did not conquer them by force but invited them to submit to Allah, ultimately winning her to faith through wisdom and a display of what Allah had given him (Qur'an 27:22–44). Even his vast blessings he framed as a test: 'This is from the favor of my Lord to test me whether I will be grateful or ungrateful' (Qur'an 27:40).",
      "Sulayman teaches that power is one of the hardest tests, and that gratitude (shukr) is its cure. A believer given wealth, ability, or authority is meant to use it for justice and to call others to Allah, never for pride. His entire kingdom, with all its wonders, points back to the One who granted it — and that is the difference between a blessing that elevates and one that corrupts.",
    ],
    profile: {
      nation: "Bani Isra'il and the surrounding kingdoms",
      location: "Jerusalem and the wider region",
      era: "After Dawud",
      mission: "Rule with justice and call nations to the worship of Allah.",
      challenges: [
        "Managing a vast kingdom",
        "Maintaining gratitude amid immense power",
        "Directing diverse forces responsibly",
      ],
      miracles: [
        "Command over the wind by Allah's leave",
        "The service of the jinn in building and diving",
        "Understanding the speech of birds and ants",
      ],
      majorEvents: [
        "Inheriting Dawud's kingship and prophethood",
        "The episode of the ant and his gratitude",
        "The correspondence with the Queen of Sheba and her belief",
      ],
      lessons: [
        "Power is a profound test",
        "Gratitude protects against arrogance",
        "Wisdom and invitation can turn hearts better than force",
      ],
      facts: ["Among the most fully described prophet-kings in the Qur'an"],
    },
    quran: [
      {
        surah: 27,
        ayahFrom: 15,
        ayahTo: 44,
        label: "Qur'an 27:15–44",
        excerpt:
          "He smiled, amused at her speech, and said: My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents, and to do righteousness of which You approve.",
      },
      {
        surah: 34,
        ayahFrom: 12,
        ayahTo: 14,
        label: "Qur'an 34:12–14",
        excerpt:
          "And to Sulayman [We subjected] the wind — its morning course a month's journey and its afternoon course a month's journey.",
      },
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
    summary:
      "A prophet who confronted the worship of the idol Ba'l and called his people back to Allah.",
    body: [
      "Ilyas (peace be upon him) — Elijah — was sent to a community of Bani Isra'il that had fallen into idolatry, chief among their idols being Ba'l. The Qur'an records his direct challenge: 'Will you not fear Allah? Do you call upon Ba'l and leave the best of creators — Allah, your Lord and the Lord of your first forefathers?' (Qur'an 37:124–126). His call was the eternal prophetic call: strip away the false gods and return worship to the Creator alone.",
      "The Qur'an summarizes his mission with the familiar prophetic pattern — a clear invitation, rejection by the majority, and honor preserved for the sincere. 'They denied him, so indeed, they will be brought [for punishment], except the chosen servants of Allah' (Qur'an 37:127–128). Allah names him among the righteous and leaves lasting peace and praise upon him: 'Peace be upon Ilyas' (Qur'an 37:129–130), and lists him alongside Zakariyya, Yahya, and Isa among the guided (Qur'an 6:85).",
      "The lesson of Ilyas is that genuine reform begins with correcting worship. A society cannot be set right while it directs devotion to false objects — whether literal idols or the modern idols of desire, wealth, and status. Tawheed is the foundation on which all lasting moral renewal is built, and even when a faithful group is small and outnumbered, Allah honors those who hold to the truth.",
    ],
    profile: {
      nation: "A community among Bani Isra'il",
      location: "The Levant region",
      era: "Later Israelite prophetic periods",
      mission: "Call his people from the worship of Ba'l to tawheed.",
      challenges: ["Deeply entrenched idol worship", "Resistance from the leadership"],
      majorEvents: [
        "The public call against the worship of Ba'l",
        "Rejection by the majority and the preservation of the believers",
      ],
      lessons: [
        "Tawheed is the foundation of all reform",
        "A small faithful group still matters to Allah",
        "Prophets speak against popular error, not with it",
      ],
      facts: ["Named among the righteous", "Confronted the worship of the idol Ba'l"],
    },
    quran: [
      {
        surah: 37,
        ayahFrom: 123,
        ayahTo: 132,
        label: "Qur'an 37:123–132",
        excerpt:
          "When he said to his people: Will you not fear Allah? Do you call upon Ba'l and leave the best of creators?",
      },
      {
        surah: 6,
        ayahFrom: 85,
        ayahTo: 85,
        label: "Qur'an 6:85",
        excerpt: "And Zakariyya and Yahya and Isa and Ilyas — and all were of the righteous.",
      },
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
    summary:
      "A righteous prophet of the Israelite line, named in the Qur'an among the outstanding.",
    body: [
      "Al-Yasa' (peace be upon him) — Elisha — is named among the prophets in two places in the Qur'an, and in both he is praised. He appears among the guided along with Ismail, Yunus, and Lut, whom Allah 'preferred above the worlds' (Qur'an 6:86–87), and again among the outstanding alongside Ismail and Dhul-Kifl (Qur'an 38:48). The text elevates his rank rather than recounting a detailed narrative.",
      "Because revelation is deliberately brief about him, Muslims affirm exactly what is certain — that he was a true prophet who upheld the call to worship Allah alone among his people — and avoid attaching to him tales that lack sound support. This restraint is itself part of sound belief: we honor a prophet by keeping to the truth about him, not by inventing stories around him.",
      "His mention is a reminder that Allah sent many messengers, and that a prophet's worth is not measured by how long his story is preserved but by his faithfulness to the mission. As the Qur'an says elsewhere, there were messengers 'whose stories We have related to you and messengers whose stories We have not related' (Qur'an 40:78) — and belief in all of them, known and unknown, is part of a Muslim's faith.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "The Levant region",
      era: "Later Israelite prophetic periods",
      mission: "Continue the call to tawheed among his people.",
      lessons: [
        "Honor all prophets equally in belief",
        "A brief Qur'anic mention still conveys real guidance",
        "Righteous continuity preserves faith communities",
      ],
      facts: ["Named directly in the Qur'an among the outstanding and chosen"],
    },
    quran: [
      {
        surah: 6,
        ayahFrom: 86,
        ayahTo: 86,
        label: "Qur'an 6:86",
        excerpt:
          "And Ismail and Al-Yasa' and Yunus and Lut — and all We preferred over the worlds.",
      },
      {
        surah: 38,
        ayahFrom: 48,
        ayahTo: 48,
        label: "Qur'an 38:48",
        excerpt: "And remember Ismail, Al-Yasa', and Dhul-Kifl, and all are among the outstanding.",
      },
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
    summary:
      "The prophet of the whale, whose repentance in the darkness became a timeless lesson in hope.",
    body: [
      "Yunus (peace be upon him) — Jonah — was sent to the people of Nineveh, but when they persistently rejected his call, he left them in anger before Allah had given him leave to depart. The Qur'an describes what followed: 'And [mention] the man of the fish, when he went off in anger and thought that We would not decree upon him [any hardship]' (Qur'an 21:87). Boarding a ship, he was cast into the sea and swallowed by a great fish, plunged into layers of darkness — the darkness of night, of the sea, and of the fish's belly.",
      "In that overwhelming darkness Yunus called out with words that became one of the most beloved supplications in Islam: 'There is no deity except You; glory be to You. Indeed, I have been of the wrongdoers' (Qur'an 21:87). He did not despair; he affirmed Allah's perfection and confessed his own fault. Allah answered: 'So We responded to him and saved him from the distress. And thus do We save the believers' (Qur'an 21:88). The fish cast him out onto the shore, and Allah caused a plant to grow to shelter his weakened body.",
      "Then came the remarkable ending: Yunus returned to his people, and unlike almost every other nation in the Qur'an, they believed and were spared — 'so We gave them enjoyment for a time' (Qur'an 37:147–148; 10:98). His story delivers two lessons woven together: never despair of Allah's mercy, no matter how deep the darkness, for sincere repentance restores what was lost; and the dua of Yunus is a lifeline for every believer in distress. The Prophet ﷺ taught that no Muslim ever supplicates with it except that Allah answers him.",
    ],
    profile: {
      nation: "The people of Nineveh",
      location: "The Mesopotamian region",
      era: "Pre-Isa prophetic period",
      mission: "Call his people to tawheed and repentance.",
      challenges: [
        "The strain of persistent rejection in da'wah",
        "The personal trial in the darkness of the sea",
        "Returning to the mission after being corrected",
      ],
      miracles: [
        "Rescue from within the fish",
        "A sheltering plant grown over him",
        "The belief of his whole people",
      ],
      majorEvents: [
        "Leaving his people and the sea trial",
        "The supplication in the threefold darkness",
        "The return and the belief of Nineveh",
      ],
      lessons: [
        "Never despair of the mercy of Allah",
        "Sincere repentance restores the mission",
        "Dua in hardship is transformative",
      ],
      facts: ["Also called Dhun-Nun (the man of the fish) in the Qur'an"],
    },
    quran: [
      {
        surah: 21,
        ayahFrom: 87,
        ayahTo: 88,
        label: "Qur'an 21:87–88",
        excerpt:
          "And he called out within the darknesses: There is no deity except You; glory be to You. Indeed, I have been of the wrongdoers.",
      },
      {
        surah: 10,
        ayahFrom: 98,
        ayahTo: 98,
        label: "Qur'an 10:98",
        excerpt:
          "Then has there not been a city that believed so its faith benefited it except the people of Yunus? When they believed, We removed from them the punishment of disgrace.",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "3505",
        grade: "sahih",
        excerpt:
          "The supplication of Dhun-Nun when he called upon Allah from within the belly of the fish was: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. No Muslim ever supplicates with it for anything except that Allah answers him.",
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
    summary:
      "A devoted prophet who prayed for a righteous heir in old age and was answered with Yahya.",
    body: [
      "Zakariyya (peace be upon him) — Zechariah — was a devout prophet of Bani Isra'il and the guardian of Maryam. Whenever he entered upon her in her prayer chamber, he found provision with her and asked how it came, and she would answer, 'It is from Allah. Indeed, Allah provides for whom He wills without account' (Qur'an 3:37). Witnessing Allah's provision to Maryam rekindled his hope that Allah could grant what seemed humanly impossible.",
      "Though he had grown old and his wife was barren, Zakariyya turned to Allah in a quiet, intimate prayer: 'My Lord, indeed my bones have weakened and my head has filled with white, and never have I been unhappy in my supplication to You' (Qur'an 19:4). He asked not for wealth or worldly gain but for a righteous heir who would carry on the prophetic mission and preserve the worship of Allah. Allah answered with glad tidings of a son, Yahya — a name, Allah said, no one had been given before (Qur'an 19:7). As a sign, Zakariyya was to refrain from speaking to people for three days except by gesture, devoting his tongue to Allah's remembrance (Qur'an 19:10–11).",
      "Zakariyya's life teaches the believer never to stop making dua, however unlikely the answer may seem, and to ask Allah especially for the gift of a righteous family and the continuity of faith. His greatest concern was not himself but who would carry the truth after him. His story also honors quiet service in the places of worship as a noble and beloved deed.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "Jerusalem region",
      era: "Before Isa",
      mission: "Guide his people and preserve prophetic worship.",
      challenges: [
        "Reaching old age without a child",
        "Concern for the succession of faith",
        "Maintaining worship in a strained society",
      ],
      miracles: [
        "The glad tidings of Yahya in old age",
        "The sign of withholding speech for three days",
      ],
      majorEvents: [
        "Guardianship of Maryam and witnessing her provision",
        "The heartfelt supplication for an heir",
        "The answered dua and the birth of Yahya",
      ],
      lessons: [
        "Never lose hope in dua",
        "Ask Allah for a righteous family and lineage",
        "Devoted service in worship is honorable",
      ],
      facts: ["Guardian of Maryam", "Father of Yahya, whose birth answered his prayer"],
    },
    quran: [
      {
        surah: 3,
        ayahFrom: 37,
        ayahTo: 41,
        label: "Qur'an 3:37–41",
        excerpt:
          "There, Zakariyya called upon his Lord, saying: My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.",
      },
      {
        surah: 19,
        ayahFrom: 2,
        ayahTo: 11,
        label: "Qur'an 19:2–11",
        excerpt:
          "He said: My Lord, indeed my bones have weakened, and my head has filled with white, and never have I been unhappy in my supplication to You, my Lord.",
      },
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
    summary: "A pure, wise prophet given righteousness from youth and honored with peace by Allah.",
    body: [
      "Yahya (peace be upon him) — John — was the answer to his father Zakariyya's prayer, named by Allah before his birth. Allah addressed him directly: 'O Yahya, take the Scripture with determination.' And He 'gave him wisdom while yet a child' (Qur'an 19:12) — a rare description that marks his early spiritual maturity. From his youth he was devoted to Allah with a seriousness beyond his years.",
      "The Qur'an praises his character in a beautiful sequence: Allah granted him 'tenderness from Us and purity, and he was conscious of Allah, and dutiful to his parents, and he was not a tyrant, disobedient' (Qur'an 19:13–14). He was chaste and devout, remembered among the righteous. He called his people to obedience and truth and preceded Isa, confirming the word from Allah and preparing hearts for guidance (Qur'an 3:39).",
      "Allah honored Yahya with peace at the three most vulnerable moments of any life: 'Peace be upon him the day he was born, the day he dies, and the day he is raised alive' (Qur'an 19:15). His biography is a message to the young and old alike: nearness to Allah is not postponed until later years. Purity of heart, seriousness in worship, and kindness to one's parents can flower in a person while still young — and such a life is beloved to Allah.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "The Levant region",
      era: "Contemporary with Zakariyya and near the era of Isa",
      mission: "Call to righteousness and prepare hearts for guidance.",
      challenges: [
        "Public reform in a morally strained environment",
        "Upholding purity and principle",
      ],
      majorEvents: [
        "His birth as an answered supplication",
        "Being given wisdom in his youth",
        "Recognition for his purity and devotion",
      ],
      lessons: [
        "The young can lead in righteousness",
        "Purity of heart is real strength",
        "Kindness to parents is part of piety",
      ],
      facts: [
        "Named by Allah before his birth",
        "Honored with peace at birth, death, and resurrection",
      ],
    },
    quran: [
      {
        surah: 19,
        ayahFrom: 12,
        ayahTo: 15,
        label: "Qur'an 19:12–15",
        excerpt:
          "O Yahya, take the Scripture with determination. And We gave him wisdom while yet a child, and tenderness from Us and purity, and he was conscious of Allah.",
      },
      {
        surah: 3,
        ayahFrom: 39,
        ayahTo: 39,
        label: "Qur'an 3:39",
        excerpt:
          "Allah gives you good tidings of Yahya, confirming a word from Allah — honorable, abstaining, and a prophet from among the righteous.",
      },
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
    summary:
      "A mighty messenger born miraculously to Maryam, calling to Allah with clear signs — a servant, not divine.",
    body: [
      "Isa (peace be upon him) — Jesus — was born to Maryam without a father, by the command of Allah, as a sign of His absolute power: 'Indeed, the example of Isa with Allah is like that of Adam. He created him from dust, then said to him, Be, and he was' (Qur'an 3:59). When Maryam brought the newborn to her people, who accused her, the infant Isa spoke from the cradle in her defense: 'Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet' (Qur'an 19:30). This first declaration set the tone of his entire mission — that he was a servant of Allah.",
      "Isa was sent to Bani Isra'il to confirm the Torah before him and to bring the Injil (Gospel). Allah supported him with clear miracles by His permission: he healed the blind and the leper, gave life to the dead, and formed a bird from clay that flew by Allah's leave (Qur'an 3:49). His message called people to worship 'Allah, my Lord and your Lord' (Qur'an 3:51), and to sincerity and righteousness. His close disciples, the Hawariyyun, believed and supported him.",
      "The Qur'an corrects two extremes about Isa. Against those who rejected and plotted to kill him, it declares he was neither killed nor crucified; rather it only appeared so, and Allah raised him to Himself (Qur'an 4:157–158). Against those who exaggerated, it insists he is a noble prophet and messenger, not God or the son of God — 'The Messiah, son of Maryam, was not but a messenger' (Qur'an 5:75). In Sunni belief he will return before the Last Day. His story teaches that Allah's power transcends all natural causes, that prophets are honored servants and never divine, and that truth must be protected from both denial and exaggeration.",
    ],
    profile: {
      nation: "Bani Isra'il",
      location: "The Levant",
      era: "1st century CE",
      mission: "Renew tawheed, confirm the Torah, and call to righteousness.",
      challenges: [
        "Opposition and plotting by those who rejected him",
        "The later exaggeration of his status",
        "Defending pure monotheism",
      ],
      miracles: [
        "Birth without a father",
        "Speaking in the cradle",
        "Healing and giving life by Allah's permission",
      ],
      majorEvents: [
        "His miraculous birth and defense of his mother",
        "The public call with clear signs",
        "Being raised to Allah, not killed",
      ],
      lessons: [
        "Allah's power transcends ordinary causes",
        "Prophets are honored servants of Allah, never divine",
        "Truth must be guarded from both denial and exaggeration",
      ],
      facts: ["Given the Injil (Gospel)", "Will return before the Last Day in Sunni belief"],
    },
    quran: [
      {
        surah: 3,
        ayahFrom: 45,
        ayahTo: 55,
        label: "Qur'an 3:45–55",
        excerpt:
          "[Isa said]: Indeed, Allah is my Lord and your Lord, so worship Him. That is a straight path.",
      },
      {
        surah: 4,
        ayahFrom: 157,
        ayahTo: 159,
        label: "Qur'an 4:157–159",
        excerpt:
          "And they did not kill him, nor did they crucify him; but it was made to appear so to them... Rather, Allah raised him to Himself.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "3443",
        grade: "sahih",
        excerpt:
          "I am the nearest of all people to Isa, son of Maryam. The prophets are brothers of different mothers, but their religion is one, and there was no prophet between us.",
      },
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
    summary: "The final messenger, sent as a mercy to all the worlds and the seal of prophethood.",
    body: [
      "Muhammad ﷺ is the last of the prophets, sent not to a single people but to all humanity, with the Qur'an as the final and preserved revelation. Allah describes his mission in a single verse: 'And We have not sent you except as a mercy to the worlds' (Qur'an 21:107). Born in Makkah, he received the first revelation at the age of forty in the cave of Hira, and for the next twenty-three years he called people to worship Allah alone, purify their hearts, and live with justice and mercy — completing and confirming the message of every prophet before him.",
      "His path was one of sustained sacrifice. In Makkah he and the early believers endured mockery, torture, and a years-long boycott. Then came the Hijrah, the migration to Madinah, where he built the first Muslim community — establishing prayer, brotherhood between migrants and helpers, treaties, and a society rooted in tawheed. Through years of hardship and eventual triumph, his character never wavered; the Qur'an testifies, 'Indeed, you are of a great moral character' (Qur'an 68:4), and he himself said he was sent to perfect noble character.",
      "Allah declares him 'the Messenger of Allah and the seal of the prophets' (Qur'an 33:40) — after him there is no prophet. His greatest miracle is the Qur'an itself, an enduring sign that still guides billions, and he was honored with the Isra and Mi'raj, the night journey and ascension. For the believer, he is the uswah hasanah — the beautiful example (Qur'an 33:21) — whose Sunnah is the practical path of faith. Loving him, following his guidance, and sending blessings upon him lie at the heart of Muslim life.",
    ],
    profile: {
      nation: "All humanity",
      location: "Makkah and Madinah",
      era: "7th century CE",
      mission: "Convey the final revelation and complete the prophetic message for all peoples.",
      challenges: [
        "Persecution and the boycott in Makkah",
        "Conflict and building a just community",
        "Conveying a universal message across tribes and nations",
      ],
      miracles: [
        "The Qur'an as an enduring miracle",
        "The Isra and Mi'raj (night journey and ascension)",
        "Many signs granted by Allah's permission",
      ],
      majorEvents: [
        "The beginning of revelation in Makkah",
        "The Hijrah to Madinah",
        "The completion of the message and the Farewell Sermon",
      ],
      lessons: [
        "Mercy and noble character in leadership",
        "Steadfastness under pressure",
        "Follow revelation and the Sunnah together",
      ],
      facts: ["The seal of the prophets", "The best example (uswah hasanah) for the believers"],
    },
    quran: [
      {
        surah: 33,
        ayahFrom: 40,
        ayahTo: 40,
        label: "Qur'an 33:40",
        excerpt:
          "Muhammad is not the father of any of your men, but he is the Messenger of Allah and the seal of the prophets.",
      },
      {
        surah: 21,
        ayahFrom: 107,
        ayahTo: 107,
        label: "Qur'an 21:107",
        excerpt: "And We have not sent you except as a mercy to the worlds.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "2286",
        grade: "sahih",
        excerpt:
          "My example and the example of the prophets before me is that of a man who built a house beautifully and completely, except for the place of one brick. I am that brick, and I am the seal of the prophets.",
      },
    ],
    appLinks: [
      { label: "Learn from Seerah", route: "/seerah" },
      { label: "Read Surah Al-Ahzab", route: "/quran/33" },
      { label: "View prophets timeline", route: "/prophets/timeline" },
    ],
  },
];
