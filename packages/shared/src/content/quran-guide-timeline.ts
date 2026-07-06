import type { QuranGuideTimelineEvent } from "../types/quran-guide";

/**
 * How the Qur'an was revealed — from Cave of Hira through preservation. Bump
 * QURAN_GUIDE_TIMELINE_VERSION on content change.
 */
export const QURAN_GUIDE_TIMELINE_VERSION = 2;

export const QURAN_GUIDE_TIMELINE: QuranGuideTimelineEvent[] = [
  {
    id: "pre-revelation",
    year: 610,
    title: "Life before revelation",
    body: "In the years before prophethood, Muhammad ﷺ would withdraw to the Cave of Hira for days of solitude and contemplation, troubled by the idolatry and injustice of Makkan society. Though the world around him worshipped idols, he never did, and his people trusted him so completely that they called him al-Amin — the trustworthy — long before he ever claimed to be a prophet.",
    location: "Makkah",
  },
  {
    id: "cave-hira",
    year: 610,
    title: "Cave of Hira",
    body: "During the month of Ramadan, when he was about forty, the angel Jibreel came to him in the cave with a single command: 'Read!' The Prophet ﷺ, who could not read or write, answered that he was unable. The angel embraced him firmly three times and then conveyed the first words of Surah al-Alaq — 'Read in the name of your Lord who created.' Shaken, he hurried home to his wife Khadijah, who wrapped him in a cloak and reassured him.",
    location: "Jabal an-Nur, Makkah",
    topicId: "revelation",
  },
  {
    id: "first-revelation",
    year: 610,
    title: "First revelation — Surah al-Alaq",
    body: "The command to read marked the beginning of prophethood and of the Qur'an's descent. Khadijah took him to her learned relative Waraqah ibn Nawfal, who recognised the angel as the same messenger that had come to Musa and foretold that the Prophet's ﷺ people would drive him out. The earliest Makkan revelations that followed focused on the oneness of Allah, the certainty of the Hereafter, and a sweeping call to moral reform.",
    topicId: "revelation",
  },
  {
    id: "early-makkah",
    year: 610,
    ah: 0,
    title: "Early Makkan period",
    body: "For the first years the call was private, then public. As it grew, the Quraysh turned to persecution — torturing the weak and enslaved among the believers — and eventually imposed a harsh three-year boycott on the Prophet's ﷺ clan, Banu Hashim. To escape the cruelty, a group of Muslims migrated to Abyssinia, where a just Christian king gave them refuge. The surahs of this era typically speak in short, powerful, rhythmic verses.",
    location: "Makkah",
    topicId: "revelation",
  },
  {
    id: "hijra",
    year: 622,
    ah: 1,
    title: "Hijra to Madinah",
    body: "After years of persecution, and following the 'year of sorrow' in which he lost both Khadijah and his uncle Abu Talib, the Prophet ﷺ and his companions migrated to Madinah. This Hijra was so pivotal that it later became the start of the Islamic calendar. In Madinah the Muslims were no longer a hunted minority but a community establishing a society, and revelation now began to address law, family, economy, and relations with the People of the Book.",
    location: "Madinah",
    topicId: "revelation",
  },
  {
    id: "madinan-period",
    year: 622,
    ah: 1,
    title: "Madinan period",
    body: "The Madinan surahs are generally longer and more detailed, laying down the legislation a settled community needs: the specifics of salah, zakat, fasting, marriage and divorce, inheritance, contracts, and treaties. This period also saw the major battles — Badr, Uhud, and the Confederates — and the Qur'an addressed the believers' trials and the schemes of the hypocrites (munafiqun) with striking clarity.",
    location: "Madinah",
    topicId: "revelation",
  },
  {
    id: "final-sermon",
    year: 632,
    ah: 10,
    title: "Farewell Pilgrimage",
    body: "In the tenth year after Hijra the Prophet ﷺ performed his only Hajj and delivered the Farewell Sermon before a vast gathering at Arafat, reminding the ummah of the sanctity of life and property, the rights of women, the equality of all people regardless of race, and the duty to hold fast to the Qur'an and Sunnah. It was here that the verse was revealed: 'This day I have perfected for you your religion.'",
    location: "Arafat / Mina",
    topicId: "revelation",
  },
  {
    id: "compilation",
    year: 633,
    ah: 11,
    title: "Compilation under Abu Bakr",
    body: "Not long after the Prophet's ﷺ passing, many companions who had memorised the entire Qur'an were killed in the Battle of Yamama. Fearing the loss of huffaz, Umar urged the caliph Abu Bakr to have the Qur'an gathered into one place. Abu Bakr appointed the trusted scribe Zayd ibn Thabit, who carefully collected the written revelation — verified against the memories of the companions — into a single set of sheets (suhuf).",
    topicId: "revelation",
  },
  {
    id: "uthmanic-mushaf",
    year: 650,
    ah: 30,
    title: "Standardised mushaf — Uthman",
    body: "As Islam spread across many lands, differences in recitation among new Muslims began to cause disputes. To unite the ummah on one written text, the caliph Uthman had authoritative copies made from Abu Bakr's suhuf in the dialect of the Quraysh and sent them to the major cities, asking that other personal copies be set aside. This Uthmanic mushaf is the standard the entire Muslim world has followed ever since.",
    topicId: "revelation",
  },
  {
    id: "preservation",
    year: 632,
    title: "Preservation until today",
    body: "Fourteen centuries on, the Qur'an remains unchanged, guarded by three interlocking means: mass memorisation (hifz) in every generation, faithful written transmission, and unbroken teacher-to-student chains of recitation (qira'at) reaching back to the Prophet ﷺ. This fulfils Allah's own promise: 'Indeed, We sent down the Reminder, and indeed We will preserve it.'",
    topicId: "revelation",
  },
];
