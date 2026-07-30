import type { LastDayHadithEntry } from "../types/last-day";

/**
 * Authentic hadith about death, the grave, and Judgment Day. Every citation
 * (collection, number and grade) has been verified. Grades: sahih | hasan.
 * Bump LAST_DAY_HADITH_VERSION on change.
 */
export const LAST_DAY_HADITH_VERSION = 3;

export const LAST_DAY_HADITH: LastDayHadithEntry[] = [
  {
    id: "death-reminder",
    theme: "death",
    hadith: {
      collection: "Jami' at-Tirmidhi",
      citation: "2307",
      grade: "hasan",
      excerpt: "Remember often the destroyer of pleasures — meaning death.",
    },
    context:
      "Regular remembrance of death softens the heart, dissolves grudges, and corrects priorities without breeding despair.",
  },
  {
    id: "husn-khatimah",
    theme: "death",
    hadith: {
      collection: "Sahih Muslim",
      citation: "2877",
      grade: "sahih",
      excerpt:
        "None of you should die except while assuming the best about Allah — thinking well of his Lord's mercy.",
    },
    context:
      "A good ending (husn al-khatimah) is hoped for through sincere faith, repentance, and good expectation of Allah.",
  },
  {
    id: "grave-questioning",
    theme: "grave",
    hadith: {
      collection: "Jami' at-Tirmidhi",
      citation: "2460",
      grade: "hasan",
      excerpt:
        "The grave is either a garden from the gardens of Paradise or a pit from the pits of the Fire.",
    },
    context:
      "Barzakh includes reward or punishment in the grave, by Allah's wisdom — the grave mirrors a person's own deeds.",
  },
  {
    id: "munkar-nakir",
    theme: "grave",
    hadith: {
      collection: "Jami' at-Tirmidhi",
      citation: "1071",
      grade: "hasan",
      excerpt:
        "When the deceased is buried, two angels come and question him about his Lord, his religion, and his prophet.",
    },
    context:
      "Questioning in the grave is affirmed in authentic reports; in this narration the two angels are named Munkar and Nakir.",
  },
  {
    id: "benefit-deceased",
    theme: "death",
    hadith: {
      collection: "Sahih Muslim",
      citation: "1631",
      grade: "sahih",
      excerpt:
        "When a person dies, his deeds come to an end except for three: ongoing charity, knowledge from which benefit is gained, or a righteous child who supplicates for him.",
    },
    context: "What continues to benefit the deceased — established in sahih hadith.",
  },
  {
    id: "resurrection-barefoot",
    theme: "resurrection",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "3349",
      grade: "sahih",
      excerpt:
        "You will be gathered barefoot, naked and uncircumcised — and the first to be clothed on the Day of Resurrection will be Ibrahim.",
    },
    context: "Humility on the Day of Gathering; Allah honours whom He wills, as He wills.",
  },
  {
    id: "sun-near",
    theme: "resurrection",
    hadith: {
      collection: "Sahih Muslim",
      citation: "2864",
      grade: "sahih",
      excerpt:
        "The sun will be brought near to the people on the Day of Resurrection until it is about a mile away, and they will sink in their sweat according to their deeds.",
    },
    context: "Conditions on the Mahshar — severity varies by deeds in authentic narrations.",
  },
  {
    id: "greatest-intercession",
    theme: "intercession",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "7440",
      grade: "sahih",
      excerpt:
        "The people will come to me and I will fall in prostration before Allah, and it will be said: Raise your head; ask and you will be given, intercede and your intercession will be accepted.",
    },
    context: "The greatest intercession — al-Shafa'ah al-'Udhma, unique to the Prophet ﷺ.",
  },
  {
    id: "record-right-hand",
    theme: "reckoning",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6537",
      grade: "sahih",
      excerpt:
        "Whoever is called to account will be destroyed. Aisha asked: Does Allah not say, He will be judged with an easy account? He said: That is only the presenting of deeds; but whoever is interrogated over his account will be destroyed.",
    },
    context:
      "An 'easy account' is a mercy — being shown one's deeds and forgiven, not cross-examined item by item.",
  },
  {
    id: "bankrupt",
    theme: "reckoning",
    hadith: {
      collection: "Sahih Muslim",
      citation: "2581",
      grade: "sahih",
      excerpt:
        "The bankrupt of my ummah is one who comes with prayer, fasting and charity, but had insulted, slandered and wronged others — so his good deeds are given to them, and their sins are loaded onto him.",
    },
    context:
      "The rights of people (huquq al-'ibad) are not simply cancelled by worship; they must be settled or paid for on the Day.",
  },
  {
    id: "without-reckoning",
    theme: "reckoning",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6541",
      grade: "sahih",
      excerpt:
        "Seventy thousand of my ummah will enter Paradise without reckoning: those who do not seek ruqyah from others, do not believe in evil omens, do not cauterise, and who put their trust in their Lord.",
    },
    context:
      "Scholars differ on whether the number is literal or signifies a far greater, unquantifiable abundance of Allah's mercy.",
  },
  {
    id: "hawd-description",
    theme: "paradise",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6579",
      grade: "sahih",
      excerpt:
        "My Hawd is a month's journey across. Its water is whiter than milk, its fragrance sweeter than musk, and its cups are as numerous as the stars of the sky. Whoever drinks from it will never thirst again.",
    },
    context: "The Pond — a mercy for the ummah of Muhammad ﷺ on the Day of thirst.",
  },
  {
    id: "sirat-speeds",
    theme: "reckoning",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6573",
      grade: "sahih",
      excerpt:
        "The bridge is set over Hell. The people cross it according to their deeds — like lightning, like the wind, like birds, like a running man — and some are scratched and saved, while some fall.",
    },
    context: "Crossing speed reflects faith and deeds; Allah's mercy is vast.",
  },
  {
    id: "major-signs-ten",
    theme: "resurrection",
    hadith: {
      collection: "Sahih Muslim",
      citation: "2901",
      grade: "sahih",
      excerpt:
        "The Hour will not come until you see ten signs: the smoke, the Dajjal, the Beast, the rising of the sun from the west, the descent of 'Isa son of Maryam, Ya'juj and Ma'juj, three landslides, and a fire that drives people to their gathering.",
    },
    context:
      "The ten major signs, from Hudhayfah ibn Usayd. Scholars affirm each sign but differ on the exact sequence.",
  },
  {
    id: "descent-of-isa",
    theme: "resurrection",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "3448",
      grade: "sahih",
      excerpt:
        "By the One in whose Hand is my soul, the son of Maryam will soon descend among you as a just ruler; he will break the cross, kill the swine, and abolish the jizyah, and wealth will overflow until no one accepts it.",
    },
    context:
      "The descent of 'Isa is a firm point of Sunni creed; he rules by the Sharia of Muhammad ﷺ.",
  },
  {
    id: "minor-signs-dishonesty",
    theme: "resurrection",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6496",
      grade: "sahih",
      excerpt:
        "When trust is lost, await the Hour. It was asked: How will it be lost? He said: When authority is given to those who do not deserve it.",
    },
    context:
      "A well-known minor sign — the loss of trustworthiness. Focus on preparation, not panic.",
  },
  {
    id: "minor-signs-knowledge",
    theme: "resurrection",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "100",
      grade: "sahih",
      excerpt:
        "Allah does not remove knowledge by snatching it away, but by taking the scholars, until none remains and people take the ignorant as leaders who give verdicts without knowledge, so they stray and lead others astray.",
    },
    context:
      "'Loss of knowledge' means the loss of sound scholars and lived practice — not a shortage of information.",
  },
  {
    id: "two-words-heavy",
    theme: "reckoning",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6406",
      grade: "sahih",
      excerpt:
        "Two words light on the tongue, heavy on the Scale, beloved to the Most Merciful: SubhanAllahi wa bihamdih, SubhanAllahil-'Azim.",
    },
    context:
      "Scale language for zikr — effortless on the tongue, weighty when sincere. See also the lesson Heavy on the Scale.",
  },
  {
    id: "character-heaviest",
    theme: "reckoning",
    hadith: {
      collection: "Jami' at-Tirmidhi",
      citation: "2002",
      grade: "hasan",
      excerpt:
        "Nothing is heavier on the believer's Scale on the Day of Resurrection than good character.",
    },
    context:
      "Hasan report naming good character as heaviest on the Scale — paired with the Jannah character lesson.",
  },
  {
    id: "alhamdulillah-fills",
    theme: "reckoning",
    hadith: {
      collection: "Sahih Muslim",
      citation: "223",
      grade: "sahih",
      excerpt:
        "Alhamdulillah fills the Scale, and SubhanAllah and Alhamdulillah fill what is between the heavens and the earth.",
    },
    context:
      "Praise of Allah described as filling the Scale — another authentic Scale-language deed, not a complete ranking of all deeds.",
  },
];
