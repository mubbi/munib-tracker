import type { Article } from "@/content/types";

export const article: Article = {
  slug: "how-to-memorize-the-quran",
  category: "quran-learning",
  title: "How to Memorize the Qur'an: A Practical Method for Hifz",
  seoTitle: "How to Memorize the Quran: Practical Hifz Tips",
  seoDescription:
    "A practical hifz method: one mushaf, a small new portion daily, recent and older review, spaced revision, reciting to someone, and revising in your Salah.",
  description:
    "A step-by-step approach to memorising the Qur'an that balances new portions with steady revision, so what you learn stays with you.",
  keywords: [
    "how to memorize the quran",
    "quran memorization tips",
    "hifz method",
    "sabaq sabqi manzil",
  ],
  cluster: "quran-practice",
  published: "2026-11-23",
  updated: "2026-11-23",
  takeaways: [
    "Memorise from one mushaf so the page layout becomes part of your memory.",
    "Each day has three parts: a small new portion (sabaq), recent review (sabqi) and older review (manzil).",
    "Space your revision out over growing gaps so older portions come back before they fade.",
    "Recite from memory to someone who can correct you, and learn the meaning of what you memorise.",
    "Steady daily progress beats speed. Revision is the work, not a break from it.",
  ],
  body: [
    {
      type: "p",
      text: "Memorising the Qur'an is one of the most rewarding things a Muslim can do, and it is open to people of every age. You do not need to aim for the whole Qur'an to begin. Many people start with the short surahs of Juz 'Amma, or a surah they love, and grow from there.",
    },
    {
      type: "evidence",
      kind: "quran",
      arabic: "وَلَقَدۡ يَسَّرۡنَا ٱلۡقُرۡءَانَ لِلذِّكۡرِ فَهَلۡ مِن مُّدَّكِرٖ",
      translation:
        "And We have certainly made the Qur’ān easy for remembrance, so is there any who will remember?",
      reference: "Qur'an 54:17",
      href: "https://quran.com/54/17",
      note: "Translation: Saheeh International",
    },
    {
      type: "p",
      text: "What separates people who keep what they memorise from those who lose it is rarely talent. It is usually a clear daily structure and a serious commitment to revision. This guide sets out both.",
    },
    { type: "h2", text: "Before you start: intention, a teacher and one mushaf" },
    {
      type: "p",
      text: "Begin by renewing your intention: you are memorising for the sake of Allah, to carry His words with you. Then look for someone who can hear you recite, whether a teacher at your local Masjid, a hifz class, or a qualified teacher online. Memorising with mistakes in pronunciation means memorising the mistakes too, so it helps to get your recitation checked early. Our guide to [improving your Qur'an recitation](/resources/quran-learning/how-to-improve-quran-recitation) covers the basics.",
    },
    {
      type: "p",
      text: "Finally, **pick one mushaf and stick to it.** Your memory stores where an ayah sits on the page: top or bottom, left or right, which ayah begins the next page. Switching between prints with different layouts can make this harder. Many people memorise from a 15-line mushaf, but any print works as long as you keep to the same one.",
    },
    {
      type: "p",
      text: "It also helps to choose a fixed time for new memorisation. Many people find the time after Fajr works well, before the day fills with noise and tasks. Others memorise after Isha and recite the portion again in the morning. Whatever you choose, keep it the same each day, and protect it the way you would protect an appointment.",
    },
    {
      type: "p",
      text: "Begin where you are. If you already know the last few surahs, start by firming those up before adding new ones. If you are starting from nothing, begin with the shortest surahs at the end of the Qur'an, which you will also use in every Salah.",
    },
    { type: "h2", text: "The daily structure: sabaq, sabqi and manzil" },
    {
      type: "p",
      text: "Many hifz classes divide each day into three parts. The names below are common in South Asian madrasas; other places use different names for the same idea.",
    },
    {
      type: "table",
      caption: "A three-part daily hifz routine",
      head: ["Part", "What it is", "Example amount"],
      rows: [
        ["Sabaq", "Your new portion for the day", "A few lines to half a page for most beginners"],
        [
          "Sabqi",
          "Review of what you memorised recently",
          "The last few days or weeks of new portions",
        ],
        [
          "Manzil",
          "Review of older portions, in rotation",
          "A fixed slice of everything before that, so the whole is covered regularly",
        ],
      ],
    },
    {
      type: "p",
      text: "As your memorisation grows, the review parts grow with it. That is expected. When review starts to take most of your time, it is a sign the system is working, not that you are falling behind. If you are short on time on a given day, keep the review and pause the new portion.",
    },
    { type: "h2", text: "How to memorise a new portion" },
    {
      type: "steps",
      items: [
        {
          title: "Listen first",
          text: "Play the portion from a skilled reciter several times while following the words in your mushaf.",
        },
        {
          title: "Read it correctly from the page",
          text: "Recite it aloud, looking, until you can read it smoothly with no mistakes.",
        },
        {
          title: "Work in small pieces",
          text: "Take one ayah, or part of a long ayah. Repeat it looking, then without looking, until it is firm.",
        },
        {
          title: "Link as you go",
          text: "Join each new ayah to the one before it and recite them together, so you learn the transitions and not only the pieces.",
        },
        {
          title: "Recite the whole portion from memory",
          text: "Recite the full portion a few times without looking. Mark any place you hesitate and go back to it.",
        },
        {
          title: "Revisit it later the same day",
          text: "Recite it again before sleep or in a Salah. A second pass after some hours shows you whether it has really settled.",
        },
      ],
    },
    { type: "h2", text: "Space out your revision" },
    {
      type: "p",
      text: "Most people find that a new portion slips quickly at first and holds a little longer each time it is revised. That is the idea behind **spaced revision**: review a portion soon after you learn it, then again after a longer gap, then a longer one still. Each successful review lets you wait a little longer before the next.",
    },
    {
      type: "p",
      text: "In practice, this means new portions are revised often, while well-established surahs come up less frequently but never disappear from the rotation. If a review goes badly, shorten the gap again. Whether you plan this in a notebook or on a calendar, the point is that every portion has a next review date.",
    },
    {
      type: "note",
      tone: "app",
      text: "Munib Tracker's [Qur'an practice](/features/quran-practice) revision queue spaces reviews at 1, 3, 7, 14 and then 30 days, with an optional reminder, and its listener can follow along on your device as you recite from memory.",
    },
    { type: "h2", text: "Recite to someone and learn the meaning" },
    {
      type: "p",
      text: "Reciting from memory to another person is the strongest check you have. A teacher, a parent, a friend who is also memorising, or even someone following along in the mushaf can catch the small slips you do not notice, such as a skipped word or two similar ayahs mixed together.",
    },
    {
      type: "p",
      text: "Learning the meaning also makes memorisation firmer. Before you start a new portion, read its translation and, if you can, a short tafsir. When you know what an ayah says and how it connects to the next, the order of the words makes sense and is easier to hold. It also turns your hifz into something you live with, not only something you store.",
    },
    { type: "h2", text: "Consistency over speed" },
    {
      type: "evidence",
      kind: "hadith",
      translation:
        "Commit yourself to the Qur'an, for by Him in whose Hand is my soul, it is surely more prone to break away than a camel in its bind.",
      reference: "Sahih al-Bukhari 5033; Sahih Muslim 791",
      href: "https://sunnah.com/bukhari:5033",
    },
    {
      type: "p",
      text: "The Prophet Muhammad ﷺ compared the Qur'an in memory to a tied camel that slips away if it is not watched. Revision is not optional extra work; it is how memorisation lasts.",
    },
    {
      type: "p",
      text: "So set a pace you can keep for years, not weeks. A few lines a day with full revision will carry you further than a page a day that you cannot maintain. If you take a break for illness, travel or exams, keep at least your manzil going, then return to new portions when you are ready. Missed days are not a reason to stop; simply begin again from where you are.",
    },
    { type: "h2", text: "Revise in your Salah" },
    {
      type: "p",
      text: "Your Salah is the most natural place to revise. Recite your recent portions in your Sunnah and Nafl prayers, and older ones in Tahajjud if you pray it. Reciting in Salah tests your memory without the mushaf in front of you, and it brings more of the Qur'an into your prayer.",
    },
    {
      type: "p",
      text: "Start with portions that are already firm, so you can focus on your prayer rather than worrying about forgetting. Over time, you may find that each Salah of the day becomes part of your revision. For help building the daily reading habit that supports hifz, see [how to read the Qur'an every day](/resources/quran-learning/how-to-practice-quran-reading-every-day).",
    },
  ],
  sources: [
    { label: "Qur'an 54:17 (Saheeh International) — Quran.com", url: "https://quran.com/54/17" },
    { label: "Sahih al-Bukhari 5033 — Sunnah.com", url: "https://sunnah.com/bukhari:5033" },
    { label: "Sahih Muslim 791 — Sunnah.com", url: "https://sunnah.com/muslim:791" },
  ],
  faqs: [
    {
      question: "How much should I memorise each day?",
      answer:
        "Start with an amount you can memorise well and still revise, such as a few lines. It is better to memorise less and keep it than to memorise more and lose it. Increase slowly once your revision is steady.",
    },
    {
      question: "Is it too late to memorise the Qur'an as an adult?",
      answer:
        "No. Adults memorise the Qur'an too, often with the advantage of understanding the meaning. Choose a pace that fits your responsibilities and give revision as much attention as new portions.",
    },
    {
      question: "What should I do if I forget what I memorised?",
      answer:
        "Go back to the mushaf, relearn the portion and add it back into your revision with shorter gaps. Forgetting is a sign that a portion needs more frequent review, not that you have failed.",
    },
  ],
  appTieIn: {
    feature: "quran",
    text: "Munib Tracker includes a hifz tracker for what you have memorised, alongside the full offline Qur'an with a 604-page mushaf view and several reciters to listen to.",
  },
  related: [
    "/resources/quran-learning/how-to-improve-quran-recitation",
    "/resources/quran-learning/how-to-practice-quran-reading-every-day",
    "/features/quran-practice",
    "/features/learn-quran",
    "/for/quran-learners",
  ],
};
