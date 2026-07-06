import type { QuranGuideStory } from "../types/quran-guide";

/**
 * Stories of prophets in the Qur'an — summaries with lessons and references.
 * Bump QURAN_GUIDE_STORIES_VERSION on content change.
 */
export const QURAN_GUIDE_STORIES_VERSION = 2;

export const QURAN_GUIDE_STORIES: QuranGuideStory[] = [
  {
    id: "adam",
    prophetName: "Adam",
    title: "Adam — first prophet and father of humanity",
    summary: "Creation, the angels' prostration, the test of the tree, repentance accepted.",
    body: [
      "Allah created Adam, the first human being, with His own hands from clay, breathed into him of His spirit, and gave him a gift no other creature received: He taught Adam the names of all things. When Allah displayed this knowledge, the angels admitted their own limits and Adam's honour became clear — knowledge itself was part of what set humanity apart.",
      "Allah then commanded the angels to prostrate to Adam in honour, and they all obeyed — except Iblis, who was among the jinn. He refused out of arrogance, arguing that he was made of fire and Adam of clay, and so considered himself superior. That pride, not ignorance, was his downfall, and he vowed to lead Adam's descendants astray.",
      "Adam and his wife Hawwa were placed in the Garden and told they could enjoy everything freely but must not approach one particular tree. Shaytan whispered to them persistently until they ate from it. At once their nakedness became apparent to them, and they felt their mistake. But rather than despair or make excuses, they turned humbly to Allah: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.'",
      "Allah accepted their repentance and sent them down to earth — not as an arbitrary punishment, but as the beginning of the human test, accompanied by the promise of guidance: 'Whoever follows My guidance will neither go astray nor fall into misery.' The story of Adam is thus the story of every human being: created with honour, tested, capable of error, and always able to return.",
    ],
    lessons: [
      "The door of repentance is always open — Adam's tawbah, offered without excuse or delay, is the model for every sinner.",
      "Arrogance is the root of ruin: Iblis knew the truth yet refused it out of pride, showing that knowledge without humility destroys.",
      "Shaytan's method is persistent whispering, not force — recognising his suggestions is half of resisting them.",
      "Human worth is tied to knowledge and to turning back to Allah, not to being sinless — it is the response to error that defines us.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 30,
        ayahTo: 39,
        label: "Qur'an 2:30–39",
        excerpt: "Creation of Adam and the angels' prostration.",
      },
      {
        surah: 7,
        ayahFrom: 19,
        ayahTo: 25,
        label: "Qur'an 7:19–25",
        excerpt: "The test, fall, and repentance.",
      },
    ],
    location: "Jannah, then earth",
  },
  {
    id: "nuh",
    prophetName: "Nuh",
    title: "Nuh — patience through centuries of rejection",
    summary: "950 years of da'wah, the Ark, and the flood as divine judgment.",
    body: [
      "Nuh was sent to a people who had fallen into idol-worship, and he called them to worship Allah alone for an astonishing length of time — the Qur'an mentions he stayed among them a thousand years less fifty. He called them day and night, in public and in private, offering them every reason: forgiveness, rain, wealth, children, and gardens. Yet generation after generation turned away, mocked him, and stopped their ears.",
      "When it became clear that no more would believe, Allah commanded Nuh to build the Ark. His people ridiculed him as he built a great ship far from any sea, but he answered that a day was coming when they would understand. The sign came when the oven gushed forth water; Nuh took aboard the believers — only a few — and pairs of every kind of animal.",
      "The flood rose and drowned the rejecters. In one of the story's most piercing moments, Nuh's own son refused to board, insisting he would climb a mountain to escape the water, and he was among the drowned — a father's grief could not override a son's disbelief. When Nuh pleaded for him, Allah taught that the boy's wrongdoing had severed the tie of faith between them.",
      "When the command came, the waters receded and the Ark came to rest on Mount Judi. The Qur'an preserves the whole account as 'a sign' for everyone who reflects on how Allah rescues the faithful and how patience is finally vindicated.",
    ],
    lessons: [
      "A long, difficult mission with few followers is not failure — Nuh preached for centuries, and his sincerity, not his numbers, is what pleased Allah.",
      "No family bond saves a person without faith: Nuh's own son drowned, proving that guidance is not inherited.",
      "Perseverance in calling to Allah, even against constant mockery, is itself a form of worship.",
      "Allah's rescue comes at the appointed time — the believer builds the 'ark' of obedience before the flood, trusting the promise.",
    ],
    quran: [
      {
        surah: 11,
        ayahFrom: 25,
        ayahTo: 49,
        label: "Surah Hud",
        excerpt: "Nuh's story in detail.",
      },
      { surah: 71, ayahFrom: 1, label: "Surah Nuh", excerpt: "Nuh's plea to his people." },
    ],
    location: "Ancient Mesopotamia (scholarly estimates)",
  },
  {
    id: "ibrahim",
    prophetName: "Ibrahim",
    title: "Ibrahim — the friend of Allah (Khalilullah)",
    summary: "Breaking idols, the fire made cool, sacrifice of Ismail, building the Ka'bah.",
    body: [
      "Even as a young man, Ibrahim reasoned his way to tawhid, rejecting the idols his people and his own father carved and worshipped. He argued with them, then acted: while they were away at a festival, he broke all their idols but the largest, and when they demanded an explanation he told them to ask the big idol itself — exposing the helplessness of what they worshipped. Enraged, they built a great fire and threw him in, but Allah commanded, 'O fire, be coolness and safety upon Ibrahim,' and he walked out unharmed.",
      "By Allah's command Ibrahim left his wife Hajar and their infant son Ismail in the barren valley of Makkah. When their water ran out, Hajar ran in desperation between the hills of Safa and Marwah searching for help — a search Muslims re-enact in the sa'i of Hajj — until the spring of Zamzam burst forth at the baby's feet. Years later, Ibrahim saw in a dream that he was to sacrifice his beloved son. Father and son both submitted to Allah's will; and just as Ibrahim was about to carry it out, Allah ransomed Ismail with a magnificent ram, commemorated every year at Eid al-Adha.",
      "Together, Ibrahim and the grown Ismail raised the foundations of the Ka'bah in Makkah, praying as they built: 'Our Lord, accept this from us.' Ibrahim also prayed for a messenger to be raised from among their descendants — a supplication answered centuries later in the Prophet Muhammad ﷺ. For his unwavering devotion, Allah honoured Ibrahim with a unique title: Khalilullah, the intimate friend of Allah.",
    ],
    lessons: [
      "Tawhid demands breaking false attachments, even when idolatry is the popular, inherited norm and standing against it is dangerous.",
      "Complete trust in Allah shines brightest when His command is hardest — Ibrahim submitted even to sacrificing his son, and Allah replaced the trial with mercy.",
      "Reliance on Allah does not mean passivity: Hajar ran and searched, and Zamzam came — effort and tawakkul work together.",
      "Sincere acts of devotion echo through generations; the rites of Hajj and the honour of the Ka'bah trace back to Ibrahim's obedience.",
    ],
    quran: [
      {
        surah: 37,
        ayahFrom: 83,
        ayahTo: 113,
        label: "Qur'an 37:83–113",
        excerpt: "Ibrahim, Ismail, and the sacrifice.",
      },
      {
        surah: 2,
        ayahFrom: 124,
        ayahTo: 141,
        label: "Qur'an 2:124–141",
        excerpt: "Covenant and legacy.",
      },
    ],
    location: "Iraq, Levant, Makkah",
  },
  {
    id: "yusuf",
    prophetName: "Yusuf",
    title: "Yusuf — beauty of patience (sabr jameel)",
    summary: "Betrayal, slavery, prison, rise to authority — trust through every trial.",
    body: [
      "As a boy, Yusuf saw a dream of eleven stars, the sun, and the moon prostrating to him — a sign of a great future. His father Yaqub, himself a prophet, told him to keep it hidden from his jealous brothers. Their envy overpowered them: they threw Yusuf into the bottom of a well and told their father a wolf had devoured him. A passing caravan found the boy and sold him in Egypt.",
      "In the house of a nobleman he grew into a man of striking beauty and integrity. When the nobleman's wife tried to seduce him, Yusuf refused, saying, 'I seek refuge in Allah,' and chose prison over sin when she threatened him. Though innocent, he was jailed for years. There he called his fellow prisoners to tawhid and interpreted their dreams by Allah's leave.",
      "When the king was disturbed by a dream of seven fat cows devoured by seven lean ones, Yusuf interpreted it as seven years of plenty followed by seven of famine, and advised storing grain. Recognised at last for his wisdom and trustworthiness, he was placed in charge of Egypt's storehouses.",
      "The famine eventually drove his brothers to Egypt seeking food, not recognising the powerful minister before them. After testing them, Yusuf revealed himself and — instead of revenge — forgave them completely: 'No blame will there be upon you today. May Allah forgive you.' The family was reunited, his parents were honoured, and the childhood dream came true.",
    ],
    lessons: [
      "Sabr jameel — beautiful patience — means enduring hardship without bitterness or complaint to people, taking your grief only to Allah as Yaqub did.",
      "Chastity is worth any cost: Yusuf chose prison over sin, and Allah raised his rank because of it.",
      "Allah's plan often hides behind years of apparent misfortune — the well, slavery, and prison were all steps toward Yusuf's honour.",
      "The strong show their strength through forgiveness: at the height of his power, Yusuf pardoned those who wronged him.",
    ],
    quran: [
      {
        surah: 12,
        ayahFrom: 1,
        label: "Surah Yusuf",
        excerpt: "The best of stories — told in one surah.",
      },
    ],
    location: "Canaan, Egypt",
  },
  {
    id: "musa",
    prophetName: "Musa",
    title: "Musa — spoke to Allah and faced Pharaoh",
    summary: "Burning bush, signs against Pharaoh, Exodus, Torah, and the wandering nation.",
    body: [
      "Musa grew up, by Allah's design, inside Pharaoh's own palace after his mother placed him in the river to save him from Pharaoh's slaughter of the Israelite boys. As a young man he fled Egypt after a killing, and years later, returning through the desert, he saw a fire on Mount Tur. There Allah spoke to him directly — an honour that earned Musa the title Kalimullah, the one who spoke with Allah — saying, 'Indeed, I am your Lord.' He was sent, with his brother Harun as support, back to the tyrant Pharaoh with the demand: let the Children of Israel go.",
      "Pharaoh claimed to be a god and refused. Allah gave Musa clear signs — his staff turning into a living serpent and his hand shining radiant white. Pharaoh summoned his most skilled magicians to discredit him, but when Musa's staff swallowed their illusions, the magicians recognised real truth from mere trickery and fell in prostration, declaring belief in the Lord of Musa and Harun — even as Pharaoh threatened them with death. A succession of plagues followed, yet Pharaoh only hardened.",
      "At last Allah commanded Musa to lead his people out by night. Pharaoh pursued them to the sea; Musa struck it with his staff and the water parted, letting the believers cross on dry land. When Pharaoh and his army followed, the sea closed over them and they drowned. Musa then received the Torah, but Bani Isra'il proved stubborn — worshipping a golden calf in his absence and refusing to enter the promised land — and wandered for forty years as a consequence.",
    ],
    lessons: [
      "Speak truth to tyranny while relying entirely on Allah — Musa faced the most powerful man of his age armed only with faith.",
      "Even sincere believers can waver: the magicians who had opposed Musa became, in a single moment of clarity, more steadfast than a whole nation that had seen miracles.",
      "Witnessing wonders does not by itself produce faith — guidance is a gift Allah grants to the humble heart, not the stubborn one.",
      "Allah rescues the oppressed and holds the arrogant to account, however mighty they seem.",
    ],
    quran: [
      {
        surah: 20,
        ayahFrom: 9,
        ayahTo: 98,
        label: "Qur'an 20:9–98",
        excerpt: "Musa at Tur and before Pharaoh.",
      },
      { surah: 28, ayahFrom: 3, label: "Surah al-Qasas", excerpt: "Birth and upbringing." },
    ],
    location: "Egypt, Sinai",
  },
  {
    id: "isa",
    prophetName: "Isa",
    title: "Isa ibn Maryam — word and spirit from Allah",
    summary: "Miraculous birth, signs, raised to Allah — not killed nor crucified per Qur'an.",
    body: [
      "Maryam, a chaste and devout woman singled out by Allah as the best of the women of her time, withdrew from her family to a place in the east. There the angel Jibreel appeared to her in the form of a man and announced that Allah would grant her a pure son, though no man had touched her. She conceived by Allah's word 'Be,' and Isa was created — the Qur'an compares his creation to that of Adam, made without a father, showing that Allah creates however He wills.",
      "When she returned carrying the infant, her people accused her. In her defence, the baby Isa spoke from the cradle, declaring himself a servant of Allah given the Book and made a prophet — clearing his mother's honour with a miracle. As a prophet to the Children of Israel, Isa was given clear signs by Allah's permission: he healed the blind and the leper, gave life to the dead, and formed a bird from clay that flew — always stressing that these were 'by the permission of Allah,' never by his own power.",
      "The Qur'an is explicit that Isa was neither killed nor crucified; rather, it was made to appear so to his enemies, and Allah raised him up to Himself. Mainstream Sunni belief holds that he will return before the Last Day. Crucially, the Qur'an insists that Isa was a human prophet and servant of Allah, not divine and not a son of God — a message he himself proclaimed from the cradle to the end.",
    ],
    lessons: [
      "Allah creates as He wills — Isa's birth without a father, like Adam's creation from dust, shows His power is bound by no worldly cause.",
      "Every miracle Isa performed was explicitly 'by Allah's permission,' teaching that prophets channel Allah's power, they do not possess it.",
      "Prophets are honoured human servants of Allah, never to be worshipped — the Qur'an guards Isa's true status against exaggeration.",
      "Maryam's chastity, patience, and trust make her a model of faith for all believers, women and men alike.",
    ],
    quran: [
      {
        surah: 19,
        ayahFrom: 16,
        ayahTo: 36,
        label: "Surah Maryam",
        excerpt: "Birth and cradle speech.",
      },
      {
        surah: 4,
        ayahFrom: 157,
        ayahTo: 158,
        label: "Qur'an 4:157–158",
        excerpt: "Not killed nor crucified; raised.",
      },
    ],
    location: "Palestine",
  },
  {
    id: "muhammad",
    prophetName: "Muhammad ﷺ",
    title: "Muhammad ﷺ — seal of the prophets",
    summary: "Final messenger; Qur'an revealed across 23 years; mercy to the worlds.",
    body: [
      "Muhammad ﷺ was born in Makkah around 570 CE into the tribe of Quraysh. Orphaned young — his father died before his birth and his mother when he was six — he was raised first by his grandfather and then his uncle Abu Talib. Long before prophethood he was so trusted for his honesty that his people called him al-Amin, 'the trustworthy.' At the age of forty, while reflecting in Cave Hira, he received the first revelation of the Qur'an through the angel Jibreel.",
      "For thirteen years in Makkah he called people to worship Allah alone and faced fierce persecution: mockery, torture of the weak among his followers, and a crippling social and economic boycott of his clan. In a single 'year of sorrow' he lost both his beloved wife Khadijah and his protector Abu Talib, and when he sought support in nearby Ta'if he was driven out and pelted with stones — yet he prayed for their guidance rather than their destruction.",
      "After migrating to Madinah he built a community and led it through the trials of Badr, Uhud, and the Confederates. When he finally returned to conquer Makkah with overwhelming strength, he did not take revenge on those who had tortured and expelled him; he forgave them and declared, 'Go, for you are free.' The Qur'an sums up his mission in a single phrase — 'a mercy to the worlds' — and makes clear his duty was to convey the message plainly, not to force anyone to believe.",
    ],
    lessons: [
      "The finest character a person can have is the Prophet's ﷺ character — study his seerah closely and strive to embody it in daily life.",
      "Mercy and forgiveness are strength, not weakness: at the peak of his power he pardoned his worst enemies.",
      "A caller to Allah conveys the message with sincerity and patience but leaves the outcome to Allah — guidance is His to give.",
      "Trials are the path of the prophets; enduring hardship for the sake of Allah, as he did, is the mark of true faith.",
    ],
    quran: [
      {
        surah: 21,
        ayahFrom: 107,
        label: "Qur'an 21:107",
        excerpt: "We have not sent you except as a mercy to the worlds.",
      },
      {
        surah: 48,
        ayahFrom: 29,
        label: "Qur'an 48:29",
        excerpt: "Merciful among themselves, firm against disbelievers.",
      },
    ],
    appLinks: [{ label: "Seerah timeline", route: "/seerah" }],
  },
];
