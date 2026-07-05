import type { SeerahEvent } from "../types/seerah";

/**
 * Seerah timeline (NF-2.4) — a concise chronology of the major, widely-agreed
 * milestones in the life of the Prophet Muhammad ﷺ. It is an overview for
 * orientation, not a detailed biography; dates are the commonly-cited
 * approximations. Bump the version when the content changes.
 */
export const SEERAH_CONTENT_VERSION = 1;

export const SEERAH_EVENTS: SeerahEvent[] = [
  {
    id: "birth",
    year: 570,
    title: "Birth in Makkah",
    body: "Born in the Year of the Elephant into the clan of Banu Hashim. His father Abdullah had already passed away.",
    location: "Makkah",
  },
  {
    id: "mother-death",
    year: 576,
    title: "Passing of his mother",
    body: "His mother Aminah died when he was about six; he was then raised by his grandfather Abd al-Muttalib and later his uncle Abu Talib.",
  },
  {
    id: "marriage-khadijah",
    year: 595,
    title: "Marriage to Khadijah",
    body: "Married Khadijah bint Khuwaylid (may Allah be pleased with her), a trader known for his honesty as 'al-Amin', the trustworthy.",
    location: "Makkah",
  },
  {
    id: "first-revelation",
    year: 610,
    title: "The first revelation",
    body: "At about forty, in the Cave of Hira, the angel Jibril brought the first verses of Surah al-'Alaq — 'Read in the name of your Lord'.",
    location: "Cave of Hira",
  },
  {
    id: "public-call",
    year: 613,
    title: "The public call to Islam",
    body: "After years of private preaching, he was commanded to proclaim the message openly, facing growing opposition from the Quraysh.",
    location: "Makkah",
  },
  {
    id: "abyssinia",
    year: 615,
    title: "Migration to Abyssinia",
    body: "Persecuted companions migrated to the just Christian king (Negus) of Abyssinia, who gave them refuge.",
    location: "Abyssinia",
  },
  {
    id: "year-of-sorrow",
    year: 619,
    title: "The Year of Sorrow",
    body: "Within a short time both his wife Khadijah and his uncle Abu Talib passed away, deepening the hardship in Makkah.",
    location: "Makkah",
  },
  {
    id: "isra-miraj",
    year: 620,
    title: "Al-Isra wal-Mi'raj",
    body: "The night journey to Jerusalem and ascension through the heavens, during which the five daily prayers were ordained.",
  },
  {
    id: "hijra",
    year: 622,
    ah: 1,
    title: "The Hijra to Madinah",
    body: "Emigration to Madinah, marking the start of the Islamic calendar and the founding of the first Muslim community.",
    location: "Madinah",
  },
  {
    id: "badr",
    year: 624,
    ah: 2,
    title: "The Battle of Badr",
    body: "A decisive early victory for the outnumbered Muslims against the Quraysh of Makkah.",
    location: "Badr",
  },
  {
    id: "uhud",
    year: 625,
    ah: 3,
    title: "The Battle of Uhud",
    body: "A hard-fought battle in which the Muslims suffered losses, including the martyrdom of Hamzah (may Allah be pleased with him).",
    location: "Mount Uhud",
  },
  {
    id: "trench",
    year: 627,
    ah: 5,
    title: "The Battle of the Trench",
    body: "Madinah was defended by digging a trench, and a large confederate siege failed without a full battle.",
    location: "Madinah",
  },
  {
    id: "hudaybiyyah",
    year: 628,
    ah: 6,
    title: "Treaty of Hudaybiyyah",
    body: "A ten-year truce with the Quraysh that opened a period of peace and rapid spread of Islam.",
    location: "Hudaybiyyah",
  },
  {
    id: "conquest-makkah",
    year: 630,
    ah: 8,
    title: "The Conquest of Makkah",
    body: "Makkah was entered peacefully; the Ka'bah was cleansed of idols and a general amnesty was granted.",
    location: "Makkah",
  },
  {
    id: "farewell",
    year: 632,
    ah: 10,
    title: "The Farewell Pilgrimage",
    body: "He performed Hajj and delivered the Farewell Sermon before the largest gathering of companions.",
    location: "Arafah",
  },
  {
    id: "passing",
    year: 632,
    ah: 11,
    title: "His passing",
    body: "The Prophet ﷺ passed away in Madinah after completing the message, leaving the Qur'an and his Sunnah as guidance.",
    location: "Madinah",
  },
];
