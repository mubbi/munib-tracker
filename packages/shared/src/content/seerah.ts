import type { SeerahEvent } from "../types/seerah";

/**
 * Seerah timeline (NF-2.4) — a chronology of the major, widely-agreed milestones
 * in the life of the Prophet Muhammad ﷺ, written so each entry reads as a short
 * educational lesson rather than a bare line. Each event sets its historical
 * context, tells what happened and who the key figures were, draws out the wisdom
 * for a believer today, and cross-references related events on this timeline.
 *
 * Sourcing: dates follow the commonly-cited approximations in the classical seerah
 * (Ibn Ishaq via Ibn Hisham, al-Tabari, Ibn Kathir) with CE/AH conversions rounded.
 * Where a claim rests on a specific narration, the hadith is cited by collection and
 * number (Sahih al-Bukhari / Muslim) and every such citation was verified before
 * inclusion; Qur'anic references are given as surah:ayah. Firmly-established events
 * are preferred over weaker popular stories, and the account stays mainstream Sunni.
 * Bump SEERAH_CONTENT_VERSION when the content changes.
 */
export const SEERAH_CONTENT_VERSION = 3;

export const SEERAH_EVENTS: SeerahEvent[] = [
  {
    id: "pre-islamic-arabia",
    year: 569,
    title: "Arabia before Islam (the Jahiliyyah)",
    body: "To understand the Prophet ﷺ you first have to picture the world he was sent into. Sixth-century Arabia was a land of scattered tribes with no central state, bound together by lineage, honour, and the sanctuary of the Ka'bah in Makkah — a shrine built by Ibrahim and Isma'il for the worship of the one God, but by now surrounded by some three hundred and sixty idols.\n\nThis era is called the Jahiliyyah, the \"age of ignorance\" — not because the Arabs lacked intelligence (their poetry and memory were extraordinary) but because they lacked guidance. Tribal feuds could run for generations, the strong preyed on the weak, and daughters were sometimes buried alive out of shame or fear of poverty — a practice the Qur'an would later condemn directly (Qur'an 81:8–9). Alongside the idolatry a few \"hunafa\" still sought the pure monotheism of Ibrahim, and small Jewish and Christian communities lived across the peninsula.\n\nThe lesson: revelation did not descend into a vacuum but into a real society with deep wounds, and the first thing it healed was the relationship between the human being and his Creator. Keep this backdrop in mind as the timeline unfolds — almost every reform of the Prophet ﷺ is a direct answer to an injustice of the Jahiliyyah.",
    location: "Arabia",
  },
  {
    id: "birth",
    year: 570,
    title: "Birth in Makkah",
    body: 'The Prophet ﷺ was born in Makkah in the Year of the Elephant (Am al-Fil), so named because that year Abraha, the Abyssinian governor of Yemen, marched an army with elephants to destroy the Ka\'bah and was miraculously turned back — an event the Qur\'an recalls in Surah al-Fil (Qur\'an 105). Into this charged year a child was born to the tribe of Quraysh and its most honoured clan, Banu Hashim.\n\nHe was already an orphan at birth: his father Abdullah had died months earlier while away trading. His mother, Aminah bint Wahb, named him Muhammad — "the much-praised one" — a name almost unknown among the Arabs. In keeping with Makkan custom he was sent to be nursed and raised in the open desert air among the Banu Sa\'d, in the care of Halimah as-Sa\'diyyah.\n\nThe lesson for a believer: greatness in Allah\'s sight has nothing to do with worldly security. The final Messenger began life fatherless and would soon be motherless, yet Allah Himself was his guardian — "Did He not find you an orphan and give you refuge?" (Qur\'an 93:6). See also "Passing of his mother" and "Guardianship of Abu Talib" that follow.',
    location: "Makkah",
  },
  {
    id: "mother-death",
    year: 576,
    title: "Passing of his mother",
    body: "When he was about six, Aminah took her son to visit his relatives in Yathrib (later Madinah) and to see the grave of his father. On the return journey she fell ill and died at a place called Abwa', between Makkah and Madinah, and was buried there. The young Muhammad ﷺ had now lost both parents.\n\nHe was brought back to Makkah by Umm Ayman, the family's freed servant, and placed in the care of his grandfather Abd al-Muttalib, the respected chief of Quraysh, who loved him deeply and used to seat him beside himself at the Ka'bah.\n\nThe lesson: the Prophet ﷺ tasted, early and repeatedly, the grief that so many human beings carry — bereavement, displacement, dependence on others. This was part of his preparation. A heart that has known loss is a heart that can feel for the orphan, the widow, and the stranger, and his community would later be built on exactly that mercy. This thread continues in \"The Year of Sorrow.\"",
    location: "Abwa'",
  },
  {
    id: "grandfather-death",
    year: 578,
    title: "Guardianship of Abu Talib",
    body: "Two years after his mother, his grandfather Abd al-Muttalib also died, when the boy was about eight. On his deathbed he entrusted his beloved grandson to his son Abu Talib, the Prophet's paternal uncle. Though Abu Talib was not wealthy, he took the child into his own household and treated him as one of his dearest children.\n\nAbu Talib would remain his protector for more than forty years, right through the hardest years of persecution in Makkah. It was he who took the young Muhammad ﷺ on trading journeys to Syria, where — according to the well-known account — the monk Bahira noticed signs of prophethood in him (a report the seerah preserves, though its details are transmitted with varying strength).\n\nThe lesson: Allah placed loyal, honourable people around His Prophet ﷺ at every stage. Abu Talib's decades of protection were a mercy — a reminder that supporting truth and kinship is a noble station even for those who have not yet believed, and that we should honour those who shelter us. His loss later, in the Year of Sorrow, would change everything.",
    location: "Makkah",
  },
  {
    id: "marriage-khadijah",
    year: 595,
    title: "Marriage to Khadijah",
    body: "As a young man Muhammad ﷺ earned a reputation across Makkah that no wealth could buy: al-Sadiq, the truthful, and al-Amin, the trustworthy. People deposited their valuables with him for safekeeping and trusted his word absolutely, even those who worshipped different gods.\n\nKhadijah bint Khuwaylid (may Allah be pleased with her), a noble and successful merchant of Quraysh, hired him to lead her caravan to Syria. Impressed by his honesty and character, she sent a proposal of marriage through her friend Khawlah bint Hakim. He was about twenty-five and she about forty; theirs became a marriage of deep love and partnership. She bore him his children and remained his only wife for some twenty-five years, until her death.\n\nThe lesson: character is the foundation of everything that followed. Long before he was called a prophet, Makkah already knew him as the most honest man among them — which is why, at the first revelation, Khadijah's instant confidence in him was so decisive (see \"The first revelation\"). A believer's integrity in ordinary dealings is itself a form of da'wah.",
    location: "Makkah",
  },
  {
    id: "hilf-fudul",
    year: 605,
    title: "Hilf al-Fudul and the Black Stone",
    body: "Two incidents from his pre-prophetic life show the values he would later build a nation upon. First, the Hilf al-Fudul: a solemn pact sworn by several clans of Quraysh to stand with any oppressed person in Makkah, local or foreigner, until their rights were restored. The Prophet ﷺ took part and later said he would still answer such a pact even in Islam — because it defended justice.\n\nSecond, the rebuilding of the Ka'bah after a flood. When the clans nearly came to blows over the honour of lifting the sacred Black Stone (al-Hajar al-Aswad) back into place, they agreed to accept the judgement of the next man to enter — and it was Muhammad ﷺ. His solution was famous for its wisdom: he laid the stone on a cloth and had a chief of each clan lift a corner, then set it in place with his own hands, so that all shared the honour and none was slighted.\n\nThe lesson: justice and conflict-resolution were his instinct before revelation confirmed them. A believer is one who defends the wronged and finds ways to unite rather than divide — the Hilf al-Fudul foreshadows the just community he would establish after the Hijrah.",
    location: "Makkah",
  },
  {
    id: "first-revelation",
    year: 610,
    title: "The first revelation",
    body: 'In his late thirties the Prophet ﷺ increasingly withdrew to worship and reflect in the Cave of Hira on the mountain of Jabal an-Nur outside Makkah. There, at about the age of forty during the month of Ramadan, the angel Jibril appeared and commanded him: "Read!" He answered that he could not read; the angel embraced him firmly three times and revealed the opening verses of Surah al-\'Alaq — "Read in the name of your Lord who created…" (Qur\'an 96:1–5), the very first words of the Qur\'an.\n\nHe returned home shaking, and Khadijah wrapped him and reassured him with words that reveal her faith and his character: Allah would never disgrace him, for he kept ties of kinship, bore others\' burdens, and helped the deserving. She took him to her cousin Waraqah ibn Nawfal, an aged man learned in earlier scripture, who recognised the visitor as the same "Namus" (angel) who had come to Musa and told him this was the promised prophethood. This entire episode is recorded in Sahih al-Bukhari 3.\n\nThe lesson: revelation began not with a claim to power but with the word "Read" — a religion founded on knowledge and humility. And note who believed first: a wife and an honest household. The truth is recognised by those who already live sincerely.',
    location: "Cave of Hira",
  },
  {
    id: "private-dawah",
    year: 611,
    title: "Years of private preaching",
    body: "After the first revelations there followed a pause (fatrah), then Allah commanded the Prophet ﷺ to begin calling people to the worship of Him alone. For roughly the first three years this call was quiet and personal — extended to close family and trusted friends rather than proclaimed in the streets.\n\nThe earliest believers, the \"as-Sabiqun al-Awwalun\" (the foremost), came from every part of society: Khadijah his wife; his young cousin Ali ibn Abi Talib; his freed servant and adopted son Zayd ibn Harithah; and his loyal friend Abu Bakr as-Siddiq (may Allah be pleased with them all). Abu Bakr in turn brought many others to Islam. They met and prayed discreetly, often at the house of al-Arqam near the Ka'bah.\n\nThe lesson: Islam grew first through trust and relationship, not spectacle. Notice the breadth of those first hearts — a wealthy woman, a child, a freed slave, a merchant — a foretaste of a faith that would erase distinctions of race and rank. Da'wah begins close to home, with sincerity and patience.",
    location: "Makkah",
  },
  {
    id: "public-call",
    year: 613,
    title: "The public call to Islam",
    body: "When Allah revealed \"And warn your nearest kindred\" (Qur'an 26:214), the Prophet ﷺ climbed Mount Safa beside the Ka'bah and called out to the clans of Quraysh. He first asked whether they would believe him if he said an army lay hidden behind the hill; they answered that they had never known him to lie. Then he warned them of a punishment to come and called them to the worship of Allah alone.\n\nThis open message struck at the heart of Makkah's order. The idols were not only religion but livelihood and prestige — the city's status as guardian of the shrine drew pilgrims and trade. To say the idols were powerless was to challenge Quraysh's economy, ancestry, and pride at once. From here persecution intensified sharply, falling hardest on the weak and the enslaved among the believers, such as Bilal ibn Rabah and the family of Yasir.\n\nThe lesson: truth spoken plainly will unsettle entrenched interests. The Prophet ﷺ appealed first to their own testimony that he was honest — reason and integrity before threat — and then held firm. Standing for tawhid may cost worldly comfort, as the Makkan believers learned. This hardship leads directly to \"Migration to Abyssinia.\"",
    location: "Mount Safa",
  },
  {
    id: "abyssinia",
    year: 615,
    title: "Migration to Abyssinia",
    body: "As persecution grew unbearable, the Prophet ﷺ told a group of his companions to seek refuge with the Negus (an-Najashi), the just Christian king of Abyssinia (modern Ethiopia), saying that in his land no one was wronged. A first group crossed the Red Sea, followed by a larger second migration — the first hijrah in Islam.\n\nWhen Quraysh sent envoys demanding the refugees be handed back, the Negus summoned them. Jafar ibn Abi Talib (may Allah be pleased with him) spoke for the Muslims, describing how they had come out of ignorance into a faith of truth, mercy, and good character, and then recited verses from Surah Maryam about Jesus and his mother. The Christian king wept, drew a line on the ground, and said the difference between their faith and his was no wider than it — and he refused to surrender them.\n\nThe lesson: this is a landmark of religious tolerance and of building bridges with sincere People of the Book. It also teaches that seeking safety from oppression under a just non-Muslim authority is entirely legitimate. Notice too that the argument that won the day was beautiful character and the recited word of Allah — not force.",
    location: "Abyssinia",
  },
  {
    id: "boycott",
    year: 616,
    title: "The boycott of Banu Hashim",
    body: "Unable to stop the spread of Islam or to reach the Prophet ﷺ while his clan protected him, the leaders of Quraysh resorted to collective punishment. They wrote a pact and hung it in the Ka'bah, pledging to boycott the whole clan of Banu Hashim (and their allies Banu al-Muttalib): no marriage with them, no trade, no social dealing, until they surrendered Muhammad ﷺ.\n\nFor roughly three years the clan — believers and non-believers of Hashim alike — was confined to the mountain valley of Shi'b Abi Talib, enduring hunger so severe that the cries of children were heard and people ate leaves. The boycott finally collapsed when several fair-minded Qurayshi men publicly repudiated it and the parchment was found to have been eaten away, save the words in which Allah's name appeared.\n\nThe lesson: falsehood over-reaches. The cruelty of the boycott only exposed the injustice of the persecutors and hardened the believers' resolve. It also shows the honour of a few just individuals within a hostile society who broke ranks to end an atrocity — a reminder that conscience can survive even in the fiercest opposition.",
    location: "Shi'b Abi Talib",
  },
  {
    id: "year-of-sorrow",
    year: 619,
    title: "The Year of Sorrow",
    body: "Soon after the boycott ended, the Prophet ﷺ suffered two devastating losses within a short span, and the year became known as Am al-Huzn, the Year of Sorrow. First his uncle and lifelong protector Abu Talib died — the man whose standing had shielded him from Quraysh for decades. Then Khadijah (may Allah be pleased with her), his wife of some twenty-five years, his first believer and closest support, also passed away.\n\nWith his social protection and his emotional anchor both gone, Quraysh grew bolder in their abuse. It was in this period that he travelled to the town of Ta'if hoping its people might accept the message; instead they drove him out and set children to pelt him with stones until his feet bled. Even then, when offered the destruction of the town, he prayed for their descendants to one day worship Allah — a mercy that defines him.\n\nThe lesson: even prophets are tested with grief and rejection back to back, and the answer is patience without bitterness. Human loss does not mean divine abandonment; relief followed close behind, in the night journey that comes next. See \"Al-Isra wal-Mi'raj.\"",
    location: "Makkah",
  },
  {
    id: "isra-miraj",
    year: 621,
    title: "Al-Isra wal-Mi'raj",
    body: "After the Year of Sorrow came a night of extraordinary honour. In the Isra, the Prophet ﷺ was carried in a single night from the Sacred Mosque in Makkah to al-Masjid al-Aqsa in Jerusalem — an event the Qur'an opens Surah al-Isra with (Qur'an 17:1). There he led the earlier prophets in prayer. Then, in the Mi'raj, he was raised through the seven heavens, meeting prophets including Adam, Musa, and Ibrahim, and reached a station nearer to his Lord than any created being.\n\nThe central gift of that night was the five daily prayers. As recorded in Sahih al-Bukhari 3887, they were first enjoined as fifty; on the advice of Musa the Prophet ﷺ returned again and again to ask for relief until they were reduced to five in practice while carrying the reward of fifty. Scholars differ on the exact date, most placing it in the years just before the Hijrah.\n\nThe lesson: the gift given to console a grieving Prophet ﷺ was salah — our own nightly ascent to Allah. The five daily prayers were not sent down by an angel to earth but taken up to the heavens to receive, a sign of their weight in the life of a believer.",
    location: "Jerusalem",
  },
  {
    id: "first-pledge-aqabah",
    year: 621,
    title: "The First Pledge of al-Aqabah",
    body: "Every year pilgrims gathered at Makkah, and the Prophet ﷺ would present Islam to the visiting tribes. At a place called al-Aqabah near Mina, a small group of men from Yathrib (Madinah) — a city long torn by feuds between its tribes of Aws and Khazraj, and familiar with monotheism through its Jewish community — listened, believed, and carried the message home.\n\nThe following season twelve of them returned and gave the First Pledge of al-Aqabah: to worship Allah alone, to steal not, commit no unlawful sexual relations, kill no child, and obey the Prophet ﷺ in what is right. He then sent the young companion Mus'ab ibn Umayr (may Allah be pleased with him) back with them as Islam's first teacher and ambassador, and through him faith spread rapidly through the households of Yathrib.\n\nThe lesson: the door that had seemed shut in Makkah opened in Madinah. Notice how the community was built — by teaching. One devoted young teacher, sent with the Qur'an, prepared an entire city to become the cradle of Islam. This directly sets up the Second Pledge and the Hijrah.",
    location: "Mina",
  },
  {
    id: "second-pledge-aqabah",
    year: 622,
    title: "The Second Pledge of al-Aqabah",
    body: 'A year after the first pledge, a much larger delegation from Yathrib — seventy-three men and two women — came secretly to the Prophet ﷺ at al-Aqabah during the pilgrimage. This time the commitment went further: they pledged to protect him exactly as they would protect their own wives and children, and to receive the persecuted Muslims of Makkah into their city.\n\nThis was a turning point. For the first time the fledgling community had a homeland and a body of people sworn to defend it. Understanding the danger, the Prophet ﷺ quietly instructed his companions in Makkah to begin emigrating to Yathrib in small groups so as not to alarm Quraysh.\n\nThe lesson: sincere commitment carries responsibility. The Ansar (the "Helpers" of Madinah) pledged their lives and homes before they had gained anything, purely for the sake of the faith. Their generosity would become the model of Islamic brotherhood — remembered in "The Hijra to Madinah" that follows, where they welcomed the emigrants as family.',
    location: "Mina",
  },
  {
    id: "hijra",
    year: 622,
    ah: 1,
    title: "The Hijra to Madinah",
    body: "When Quraysh plotted to assassinate the Prophet ﷺ, Allah permitted him to emigrate. He set out with his closest friend Abu Bakr (may Allah be pleased with him), leaving Ali in his bed to return people's deposits. The two hid for three nights in the Cave of Thawr as pursuers came so close that Abu Bakr feared for them — and the Prophet ﷺ reassured him, \"What do you think of two, the third of whom is Allah?\" This moment is recorded in Sahih al-Bukhari 3653 and echoed in the Qur'an: \"…the second of two, when they were in the cave, when he said to his companion, 'Do not grieve; indeed Allah is with us'\" (Qur'an 9:40).\n\nThey reached Quba, where the first mosque was built, then entered Yathrib — thereafter al-Madinah al-Munawwarah, \"the Radiant City.\" The Prophet ﷺ paired each emigrant (Muhajir) with a Helper (Ansari) in bonds of brotherhood; the generosity was so complete that Sa'd ibn al-Rabi' offered to share half his wealth with Abdur-Rahman ibn Awf, who instead asked only to be shown the marketplace (Sahih al-Bukhari 3780/3906).\n\nThe Hijra was so pivotal that Umar later made it the start of the Islamic calendar — year 1 AH. The lesson: sometimes faith requires leaving everything behind for Allah, trusting that He is with the sincere, and rebuilding on brotherhood rather than blood.",
    location: "Madinah",
  },
  {
    id: "constitution-madinah",
    year: 623,
    ah: 1,
    title: "The Constitution of Madinah",
    body: 'Arriving in a city that had been shattered by tribal war, the Prophet ﷺ did not simply lead the Muslims — he founded a community. He drew up a written agreement, preserved in the seerah of Ibn Ishaq and known as the Sahifah or Constitution of Madinah, binding together the Muhajirun, the Ansar, and the Jewish tribes of the city into a single mutual-defence compact.\n\nIts terms were remarkable for their time: the parties formed "one community (ummah)" for the purposes of the treaty, each group kept its own religion, disputes were to be referred to the Prophet ﷺ, aggression and injustice were forbidden, and all pledged to defend the city against external attack. It effectively made Madinah a city-state with agreed rights and duties rather than endless blood-feud.\n\nThe lesson: Islam is not only private worship but the just ordering of a society. The Prophet ﷺ modelled pluralistic coexistence, the rule of agreed law over tribal vendetta, and honouring covenants — principles that would be tested in the years of conflict to come. It complements the brotherhood of "The Hijra to Madinah" by extending fairness to the whole city.',
    location: "Madinah",
  },
  {
    id: "badr",
    year: 624,
    ah: 2,
    title: "The Battle of Badr",
    body: "By the second year after the Hijra, permission to fight in self-defence had been given (Qur'an 22:39). On 17 Ramadan 2 AH, a Muslim force of about 313 men — poorly armed, with only a handful of horses — met a Quraysh army roughly a thousand strong at the wells of Badr, southwest of Madinah. It was the first major battle of Islam.\n\nAgainst the odds the Muslims won decisively, and several of the arch-persecutors of Quraysh were killed. The Qur'an frames the victory as a sign, not merely a military feat: \"Allah had already given you victory at Badr while you were weak, so fear Allah that you may be grateful\" (Qur'an 3:123), and describes the aid of angels (Qur'an 3:124–125). Badr established the young community as a real power in Arabia.\n\nThe lesson: outcomes belong to Allah, not to numbers or equipment. Badr is remembered as \"the day of criterion\" (yawm al-furqan), the day truth and falsehood were distinguished — a proof that sincere reliance on Allah with sincere effort is what counts. The reversal at Uhud the next year would teach the complementary lesson.",
    location: "Badr",
  },
  {
    id: "uhud",
    year: 625,
    ah: 3,
    title: "The Battle of Uhud",
    body: "A year after Badr, Quraysh returned for revenge with a far larger army, and the two sides met at the foot of Mount Uhud near Madinah. The Prophet ﷺ posted fifty archers on a hill with strict orders never to leave their position, whatever happened. Early in the battle the Muslims had the upper hand; but seeing the enemy flee, most of the archers left their post to gather spoils. The Quraysh cavalry under Khalid ibn al-Walid (not yet a Muslim) swept around the exposed flank, and the tide turned into a costly, painful day.\n\nMany companions were martyred, among them the Prophet's beloved uncle Hamzah (may Allah be pleased with him), \"the Lion of Allah.\" The Prophet ﷺ himself was wounded, his tooth broken and face bloodied. Afterwards the Qur'an addressed the setback frankly, explaining that it was a test and a consequence of disobeying the command and coveting the world (Qur'an 3:152, 3:165–166).\n\nThe lesson: Uhud is the great lesson in discipline and obedience. A single act of indiscipline, however small it seemed, undid a near-victory. Yet Allah did not abandon them — He taught, forgave, and rallied them. Defeat, faced honestly, can be more instructive than victory.",
    location: "Mount Uhud",
  },
  {
    id: "trench",
    year: 627,
    ah: 5,
    title: "The Battle of the Trench",
    body: "In the fifth year, an alliance of Quraysh, other Arab tribes, and hostile factions — the \"Confederates\" (al-Ahzab) — assembled the largest force yet seen in Arabia, perhaps ten thousand strong, to destroy Madinah once and for all. Facing an enemy far too large to meet in open battle, the Prophet ﷺ accepted the advice of the Persian companion Salman al-Farisi (may Allah be pleased with him) to dig a wide trench across the exposed northern approaches to the city — a tactic the Arabs had never encountered.\n\nThe trench stalled the siege. Weeks of cold, hunger, and fear followed, and the Qur'an vividly describes the believers' trial in Surah al-Ahzab: \"…when eyes shifted in fear and hearts reached the throats\" (Qur'an 33:10). At last a fierce wind and internal discord scattered the confederate army, and they withdrew without a pitched battle. The Qur'an credits the deliverance to Allah, who \"sent upon them a wind and armies you did not see\" (Qur'an 33:9).\n\nThe lesson: wise consultation (shura) and openness to good ideas from anyone — here, a foreigner's engineering — are part of faith. And when human effort has been given fully, deliverance still comes from Allah. This broken siege effectively ended Quraysh's ability to take the offensive.",
    location: "Madinah",
  },
  {
    id: "hudaybiyyah",
    year: 628,
    ah: 6,
    title: "Treaty of Hudaybiyyah",
    body: "In the sixth year the Prophet ﷺ set out with some 1,400 companions to perform Umrah, not to fight, entering the state of ihram to make the peaceful intent clear. Quraysh barred them at a place called Hudaybiyyah, on the edge of the sanctuary. After tense negotiation a ten-year truce was agreed on terms that looked, to many companions, humiliating: the Muslims would turn back that year and come the next; anyone fleeing Quraysh to the Muslims would be returned, but not the reverse.\n\nYet Allah revealed on the return that this very treaty was \"a clear victory\" (Qur'an 48:1, Surah al-Fath). Companions later said they never saw a greater victory — because in the peace that followed, people mixed freely, heard the message calmly, and entered Islam in far greater numbers than in all the years of fighting; Al-Bara' ibn Azib's report to this effect is recorded in Sahih al-Bukhari 4606. The truce also implicitly recognised the Muslims as an equal power.\n\nThe lesson: what looks like a setback can be the greatest opening. The Prophet ﷺ chose apparent short-term loss for long-term good, and honoured a hard bargain even when it stung. Patience, restraint, and keeping one's word can achieve what confrontation cannot.",
    location: "Hudaybiyyah",
  },
  {
    id: "khaybar",
    year: 628,
    ah: 7,
    title: "The expedition to Khaybar",
    body: "Not long after Hudaybiyyah, the Prophet ﷺ turned to Khaybar, a wealthy oasis of fortified strongholds north of Madinah. Khaybar had become a base of hostility — home to tribes that had helped organise the Confederates' siege of Madinah and continued to plot against the Muslim community. The campaign was aimed at ending that threat.\n\nThe fortresses fell one after another after hard fighting; the banner on the decisive day was given to Ali ibn Abi Talib (may Allah be pleased with him). Afterwards the Prophet ﷺ allowed the inhabitants to remain and continue farming the land in exchange for a share of its produce — an arrangement that secured food and stability for Madinah rather than expelling everyone. It was here, too, that a woman attempted to poison him with a sheep, which he was warned of.\n\nThe lesson: security and treaty-keeping went hand in hand. The action was against a proven hostile power, yet it ended in a workable settlement that let the defeated keep their livelihoods. Strength in Islam is meant to establish safety and justice, not to annihilate.",
    location: "Khaybar",
  },
  {
    id: "conquest-makkah",
    year: 630,
    ah: 8,
    title: "The Conquest of Makkah",
    body: 'When Quraysh\'s allies broke the terms of Hudaybiyyah by attacking a tribe allied to the Muslims, the truce was voided. In Ramadan of the eighth year the Prophet ﷺ marched on Makkah with an army of ten thousand — the largest force yet — and the city that had persecuted, boycotted, and warred against him for twenty years surrendered with almost no bloodshed.\n\nStanding at last as victor over the people who had driven him out, he asked the Makkans what they expected of him. They hoped for the mercy of a noble brother, and he answered with the words of Yusuf to his brothers: "No blame upon you today" — and declared, "Go, for you are free." He entered the Ka\'bah and cleared it of its 360 idols, reciting "Truth has come and falsehood has vanished" (Qur\'an 17:81), restoring the shrine of Ibrahim to the pure worship of Allah. Surah an-Nasr (Qur\'an 110) speaks of this moment when people "enter the religion of Allah in multitudes."\n\nThe lesson: this is the summit of prophetic mercy and forgiveness. With absolute power to take revenge, he pardoned. The believer learns that the strong are those who forgive when able to punish, and that the goal was never vengeance but guidance.',
    location: "Makkah",
  },
  {
    id: "tabuk",
    year: 631,
    ah: 9,
    title: "The expedition to Tabuk",
    body: "In the ninth year, reports reached Madinah of a possible Byzantine (Roman) mobilisation on the northern frontier. In the fierce heat of high summer, when the harvest was ripe and the journey was long and hard, the Prophet ﷺ called for the largest army he ever led — perhaps thirty thousand — to march north to Tabuk. This was \"the hour of difficulty\" (Qur'an 9:117), and it tested sincerity like nothing before.\n\nNo battle took place; the show of resolve was enough, and several northern chiefs made treaties with Madinah. But the campaign is remembered above all for what it revealed about people's hearts. The Qur'an devotes much of Surah at-Tawbah to it — praising those who gave everything (Abu Bakr reportedly gave all his wealth), exposing the hypocrites who invented excuses to stay, and telling the moving story of the three sincere believers, including Ka'b ibn Malik, who honestly admitted they had no excuse and were forgiven after a hard trial (Qur'an 9:118).\n\nThe lesson: obedience is easy when it is comfortable; its truth shows when it is costly. Tabuk separated the sincere from the excuse-makers and marked the effective end of organised idolatry's resistance in Arabia. Honesty — even the honesty of admitting one's failure — is the path back to Allah.",
    location: "Tabuk",
  },
  {
    id: "farewell",
    year: 632,
    ah: 10,
    title: "The Farewell Pilgrimage",
    body: "In the tenth year the Prophet ﷺ performed his only complete Hajj, joined by well over a hundred thousand companions, teaching them the rites in person. Standing on the plain of Arafah, he delivered the Farewell Sermon (Khutbat al-Wada'), a summary of everything Islam had come to establish.\n\nHe declared the sanctity of every person's life, property, and honour — \"your blood and your property are as sacred as this day, this month, this land\" (Sahih al-Bukhari 1741). He abolished the blood-feuds and the interest (riba) of the Jahiliyyah, enjoined the good treatment of women as a trust from Allah, reminded them that no Arab is superior to a non-Arab except in piety, and told them to hold fast to the Qur'an. It was during this pilgrimage, on the Day of Arafah which fell on a Friday, that Allah revealed \"This day I have perfected for you your religion…\" (Qur'an 5:3) — a verse Umar recalled and dated precisely (Sahih al-Bukhari 45).\n\nThe lesson: the Farewell Sermon is Islam's charter of human dignity, justice, and equality, sealed by the announcement that the religion was now complete. The believer's task from here is not to add to it but to live it.",
    location: "Arafah",
  },
  {
    id: "passing",
    year: 632,
    ah: 11,
    title: "His passing",
    body: "A few months after the Farewell Hajj, the Prophet ﷺ fell ill with a fever. In his final days he asked his wives' leave to be nursed in the room of Aisha (may Allah be pleased with her), and he appointed Abu Bakr to lead the prayers. On his last morning he drew back the curtain to see the ranks of believers praying and smiled, joyful at his community, then let it fall. He passed away on a Monday, 12 Rabi al-Awwal 11 AH, his head resting between the chest and chin of Aisha — as she herself narrated in Sahih al-Bukhari 4449/4451.\n\nThe grief in Madinah was overwhelming, and even Umar refused at first to accept it. Then Abu Bakr rose, kissed the Prophet's face, and addressed the people with words that steadied the entire community and are recorded in Sahih al-Bukhari 1241/1242: \"Whoever used to worship Muhammad, then Muhammad has died; but whoever worships Allah, then Allah is Ever-Living and never dies.\" He recited \"Muhammad is but a messenger; messengers have passed away before him…\" (Qur'an 3:144).\n\nThe lesson: the message was complete and now belonged to the ummah. The Prophet ﷺ was mortal, but what he brought — the Qur'an and his Sunnah — is not. Abu Bakr's response is the enduring answer to grief: our attachment is to Allah, who never dies, and the way to love the Prophet ﷺ is to live his guidance.",
    location: "Madinah",
  },
];
