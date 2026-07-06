import type { QuranGuideDailyLesson } from "../types/quran-guide";

/**
 * Curated daily lessons — index rotates by day of year. Bump
 * QURAN_GUIDE_DAILY_VERSION on content change.
 */
export const QURAN_GUIDE_DAILY_VERSION = 2;

export const QURAN_GUIDE_DAILY_LESSONS: QuranGuideDailyLesson[] = [
  {
    id: "day-patience",
    surah: 2,
    ayahFrom: 153,
    label: "Qur'an 2:153",
    excerpt: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    translation:
      "O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.",
    context:
      "From Surah al-Baqarah, revealed in Madinah. Allah pairs two sources of strength for the believer facing hardship — patient endurance and turning to prayer — and promises His special companionship to those who hold firm.",
    reflection:
      "What trial am I facing right now where I am reaching for a quick escape instead of the patience and prayer this verse points me to?",
    action:
      "Pray one salah today unhurried, and in your sujood ask Allah by name for patience in the specific test you are living through.",
  },
  {
    id: "day-mercy",
    surah: 7,
    ayahFrom: 156,
    label: "Qur'an 7:156",
    excerpt: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    translation: "My mercy encompasses all things.",
    context:
      "From Surah al-A'raf, spoken in the context of Musa and his people. Allah describes His mercy as embracing all things — a mercy so vast it precedes and outweighs His punishment, which is reserved for those who persist in wrong.",
    reflection:
      "Whose mistake am I refusing to forgive, even while I myself depend entirely on Allah's boundless mercy?",
    action:
      "Choose one person you resent, forgive them sincerely in your heart today, and make a short du'a asking Allah to guide and forgive them too.",
  },
  {
    id: "day-gratitude",
    surah: 14,
    ayahFrom: 7,
    label: "Qur'an 14:7",
    excerpt: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: "If you are grateful, I will surely increase you.",
    context:
      "From Surah Ibrahim, part of Musa's reminder to Bani Isra'il. Allah ties His increase directly to gratitude — thankfulness for a blessing is the very thing that causes it to grow, while ingratitude invites its loss.",
    reflection:
      "Which of Allah's gifts — my health, family, faith, or provision — have I started treating this week as ordinary and owed to me?",
    action:
      "Before you sleep tonight, say 'Alhamdulillah' aloud for three specific blessings, naming each one so gratitude becomes conscious, not automatic.",
  },
  {
    id: "day-speech",
    surah: 17,
    ayahFrom: 53,
    label: "Qur'an 17:53",
    excerpt: "وَقُولُوا لِلنَّاسِ حُسْنًا",
    translation: "And speak to people good words.",
    context:
      "From Surah al-Isra. Amid guidance on how believers should carry themselves, Allah commands that we speak to people — all people — in the best way, since harsh words are one of the doors through which Shaytan sows division.",
    reflection:
      "Looking back over today, did my words mostly build people up or chip away at them — and did I speak 'good words' even to those I find difficult?",
    action:
      "Sincerely encourage or thank one person today with no hidden criticism, and hold back one harsh remark you were tempted to make.",
  },
  {
    id: "day-trust",
    surah: 65,
    ayahFrom: 3,
    label: "Qur'an 65:3",
    excerpt: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "Whoever relies upon Allah — then He is sufficient for him.",
    context:
      "From Surah at-Talaq, set among rulings on divorce and provision — precisely where people feel most financially anxious. There Allah promises that whoever fears Him He will provide from where they never expected, and whoever relies on Him will find Him enough.",
    reflection:
      "Where am I making careful plans but leaving Allah out of them — or leaning on people's help without ever turning to Him in du'a?",
    action:
      "Take one decision that is worrying you, pray two rak'ah of istikhara or make a heartfelt du'a over it, and then trust the outcome to Allah.",
  },
  {
    id: "day-knowledge",
    surah: 20,
    ayahFrom: 114,
    label: "Qur'an 20:114",
    excerpt: "رَّبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
    context:
      "From Surah Ta-Ha. This is the only thing in the Qur'an that Allah instructs the Prophet ﷺ to ask for more of — knowledge — which shows how highly beneficial knowledge is prized and that no one, however learned, is ever finished seeking it.",
    reflection:
      "How much of my free time today went to endless scrolling, and could even a fraction of it go to learning one verse or one hadith instead?",
    action:
      "Memorise this short du'a, 'Rabbi zidni ilma,' and make a habit of saying it after Fajr before you begin your day.",
  },
  {
    id: "day-charity",
    surah: 2,
    ayahFrom: 261,
    label: "Qur'an 2:261",
    excerpt: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ",
    translation:
      "The example of those who spend their wealth in the way of Allah is like a seed that grows seven spikes…",
    context:
      "From Surah al-Baqarah. Allah draws a vivid picture of how charity grows: a single seed sprouting seven ears, each bearing a hundred grains — a seven-hundred-fold return, and He multiplies still more for whom He wills. Wealth given for His sake is never truly lost.",
    reflection:
      "When I give, is it done quietly for Allah's sake, or do I find myself wanting others to notice and praise me for it?",
    action:
      "Give a small sadaqah today, and if you can, give it secretly — so it is purely between you and Allah.",
  },
];
