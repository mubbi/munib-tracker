import type { Article } from "@/content/types";

export const article: Article = {
  slug: "how-to-pray-witr",
  category: "salah",
  title: "How to Pray Witr: Time, Rakahs, Qunut and a Missed Witr",
  seoTitle: "How to Pray Witr: Time, Rakahs and Dua Qunut",
  seoDescription:
    "How to pray Witr step by step: its time after Isha until Fajr, one or three rakahs, Dua al-Qunut, what to do if you miss it, and how the four schools differ.",
  description:
    "A sourced guide to Witr: what it is, when to pray it, how many rakahs, how to pray three rakahs, the Qunut, and what to do about a missed Witr, with the school differences labelled.",
  keywords: [
    "how to pray witr",
    "witr prayer time",
    "how many rakahs is witr",
    "dua qunut in witr",
    "missed witr prayer",
  ],
  cluster: "salah",
  published: "2026-11-27",
  updated: "2026-11-27",
  takeaways: [
    "Witr is the Salah with an odd number of rakahs that closes the night. Its time begins after Isha and ends when Fajr begins.",
    "It is not one of the five fard Salah. The Hanafi school holds it is wajib (necessary); the Shafi'i, Maliki and Hanbali schools hold it is a strongly emphasised Sunnah.",
    "Three rakahs is the most common way to pray it. One rakah is valid in the Shafi'i and Hanbali schools, and the Maliki school prays one rakah after a separate pair.",
    "Many pray a Qunut, a Dua said standing in the last rakah. Where and when it is said depends on your school.",
    "If you miss Witr, pray it when you remember. Whether making it up is required or recommended is a difference between the schools.",
  ],
  body: [
    {
      type: "p",
      text: "Witr is short, it is easy to learn, and it is the last thing many Muslims do before they sleep. It is also the Salah people have the most questions about: is it one rakah or three, is it compulsory, where does the Qunut go, and what happens if you fall asleep and miss it. The answers depend partly on the school of fiqh you follow, so this guide gives you the shared basics with their sources, then labels each point where the schools differ.",
    },
    { type: "h2", text: "What Witr is" },
    {
      type: "p",
      text: "Witr means “odd”. It is the Salah with an odd number of rakahs, one, three or more, that seals the Salah of the night. The Prophet Muhammad ﷺ told his companions to make it the last Salah they pray at night:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic: "اجْعَلُوا آخِرَ صَلاَتِكُمْ بِاللَّيْلِ وِتْرًا",
      translation:
        'Narrated `Abdullah bin `Umar: The Prophet (ﷺ) said, "Make witr as your last prayer at night."',
      reference: "Sahih al-Bukhari 998",
      href: "https://my.munibtracker.app/hadith/bukhari?q=998",
    },
    {
      type: "p",
      text: "Witr is not one of the five fard Salah, and it is not part of the Sunnah prayed straight after Isha either. It has its own place, and scholars keep it in a category of its own because they disagree about how strong its ruling is.",
    },
    {
      type: "note",
      tone: "scholar",
      title: "Is Witr wajib or Sunnah?",
      text: "In the Hanafi school Witr is wajib: below fard, above Sunnah. The school cites the hadith “The witr is a duty for every Muslim” ([Sunan Abi Dawud 1422](https://my.munibtracker.app/hadith/abudawud?q=1422)). The Shafi'i, Maliki and Hanbali schools hold that it is a Sunnah mu'akkadah, a strongly emphasised Sunnah. They cite the man who asked whether anything was due beyond the five Salah and was told “No, but if you want to offer the Nawafil prayers (you can)” ([Sahih al-Bukhari 46](https://my.munibtracker.app/hadith/bukhari?q=46)). Either way, many authentic hadith encourage Witr, and it is not something to leave lightly. Follow the school you learned, and ask a qualified scholar about your own situation.",
    },
    { type: "h2", text: "When to pray Witr" },
    {
      type: "p",
      text: "The time for Witr starts once you have prayed Isha and lasts until Fajr begins. Aishah (may Allah be pleased with her) described how the Prophet ﷺ prayed it at different points of the night:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic: "كُلَّ اللَّيْلِ أَوْتَرَ رَسُولُ اللَّهِ صلى الله عليه وسلم وَانْتَهَى وِتْرُهُ إِلَى السَّحَرِ",
      translation:
        "Narrated `Aisha: Allah's Messenger (ﷺ) offered witr prayer at different nights at various hours extending (from the `Isha' prayer) up to the last hour of the night",
      reference: "Sahih al-Bukhari 996",
      href: "https://my.munibtracker.app/hadith/bukhari?q=996",
    },
    {
      type: "p",
      text: "So you have two good choices. If you are not confident you will wake up, pray Witr after Isha, before you go to bed. If you expect to wake for the night prayer, you can leave Witr until the end of your night, which the Prophet ﷺ described as better for someone who will get up ([Sahih Muslim 755](https://my.munibtracker.app/hadith/muslim?q=1766)). If you prayed Witr early and then wake up, a widely held view is that you may pray more in pairs but do not repeat Witr, based on the report that there are no two Witrs in one night ([Sunan Abi Dawud 1439](https://my.munibtracker.app/hadith/abudawud?q=1439), graded Sahih by al-Albani).",
    },
    {
      type: "p",
      text: "Witr is not dropped on a journey. If you combine Maghrib and Isha while travelling, you still pray Witr after Isha. The guide to [praying while travelling](/resources/salah/how-to-pray-while-travelling) covers shortening and combining.",
    },
    { type: "h2", text: "How many rakahs is Witr?" },
    {
      type: "p",
      text: "There is more than one valid number. One hadith gives the choice directly:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic:
        "الْوِتْرُ حَقٌّ عَلَى كُلِّ مُسْلِمٍ فَمَنْ أَحَبَّ أَنْ يُوتِرَ بِخَمْسٍ فَلْيَفْعَلْ وَمَنْ أَحَبَّ أَنْ يُوتِرَ بِثَلاَثٍ فَلْيَفْعَلْ وَمَنْ أَحَبَّ أَنْ يُوتِرَ بِوَاحِدَةٍ فَلْيَفْعَلْ",
      translation:
        "Narrated AbuAyyub al-Ansari: The Prophet (ﷺ) said: The witr is a duty for every Muslim so if anyone wishes to observe it with five rak'ahs, he may do so; if anyone wishes to observe it with three, he may do so, and if anyone wishes to observe it with one, he may do so",
      reference: "Sunan Abi Dawud 1422",
      href: "https://my.munibtracker.app/hadith/abudawud?q=1422",
      note: "Graded Sahih by al-Albani",
    },
    {
      type: "p",
      text: "The Prophet ﷺ also taught that the night prayer is two rakahs at a time, and that a single rakah at the end makes the whole of it odd ([Sahih al-Bukhari 990](https://my.munibtracker.app/hadith/bukhari?q=990)). Aishah reported that his night prayer did not go beyond eleven rakahs ([Sahih al-Bukhari 1147](https://my.munibtracker.app/hadith/bukhari?q=1147)). In practice most people pray Witr as three rakahs. The four schools describe it like this:",
    },
    {
      type: "table",
      caption: "How the four schools pray Witr",
      head: ["School", "Ruling", "Rakahs", "Qunut"],
      rows: [
        [
          "Hanafi",
          "Wajib",
          "Three rakahs with one salam",
          "Before ruku in the third rakah, all year",
        ],
        [
          "Shafi'i",
          "Sunnah mu'akkadah",
          "At least one, commonly three (two, then one), at most eleven",
          "After ruku, in the second half of Ramadan",
        ],
        [
          "Maliki",
          "Sunnah mu'akkadah",
          "One rakah after a separate two-rakah shaf'",
          "No Qunut in Witr",
        ],
        [
          "Hanbali",
          "Sunnah mu'akkadah",
          "At least one, commonly three, at most eleven",
          "After ruku, all year (before ruku is also allowed)",
        ],
      ],
    },
    {
      type: "note",
      tone: "scholar",
      title: "Where the table comes from",
      text: "These positions follow the standard texts of each school: al-Hidayah (Hanafi), Minhaj al-Talibin (Shafi'i), Mukhtasar Khalil (Maliki) and Zad al-Mustaqni' (Hanbali). Each school has further detail and some internal views, so if you are unsure which applies to you, ask a qualified scholar.",
    },
    { type: "h2", text: "How to pray three rakahs of Witr" },
    {
      type: "p",
      text: "Witr is prayed like any other Salah: the same standing, recitation, ruku, sujud, tashahhud and salam. If you need the full sequence, see [how to pray Salah step by step](/resources/salah/how-to-pray-salah-step-by-step). These steps cover what is particular to Witr.",
    },
    {
      type: "steps",
      items: [
        {
          title: "Pray Isha first",
          text: "Witr comes after Isha, and after the two Sunnah rakahs of Isha if you pray them. You need Wudu as for any Salah.",
        },
        {
          title: "Make the intention",
          text: "Intend Witr in your heart. You do not need to say it aloud.",
        },
        {
          title: "Choose the form your school teaches",
          text: "Either pray two rakahs and end them with a salam, then stand and pray one rakah on its own, or pray all three rakahs together and end with a single salam. The Hanafi school prays the three together; the Maliki school prays the single rakah after a separate pair; the Shafi'i and Hanbali schools allow both, and the Shafi'i school prefers separating them.",
        },
        {
          title: "Recite in each rakah",
          text: "Recite Surah al-Fatihah and some Qur'an in each rakah. Short surahs you know well are fine.",
        },
        {
          title: "Say the Qunut in the last rakah",
          text: "If your school says the Qunut, raise your hands and make the Dua in the last rakah, before or after ruku as your school teaches (see the table above).",
        },
        {
          title: "Finish with tashahhud and salam",
          text: "Complete the rakah, sit for the tashahhud and end with the salam. After Witr, a short Dua or Zikr before sleep is a good way to close the day.",
        },
      ],
    },
    { type: "h2", text: "Dua al-Qunut in Witr" },
    {
      type: "p",
      text: "Qunut here means a Dua said standing in the last rakah of Witr. Al-Hasan ibn Ali (may Allah be pleased with him) reported that the Prophet ﷺ taught him these words to say in Witr:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic:
        "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ إِنَّكَ تَقْضِي وَلاَ يُقْضَى عَلَيْكَ وَإِنَّهُ لاَ يَذِلُّ مَنْ وَالَيْتَ وَلاَ يَعِزُّ مَنْ عَادَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
      translation:
        'Narrated Al-Hasan ibn Ali: The Messenger of Allah (ﷺ) taught me some words that I say during the witr. (The version of Ibn Jawwas has: I say them in the supplication of the witr.) They were: "O Allah, guide me among those Thou hast guided, grant me security among those Thou hast granted security, take me into Thy charge among those Thou hast taken into Thy charge, bless me in what Thou hast given, guard me from the evil of what Thou hast decreed, for Thou dost decree, and nothing is decreed for Thee. He whom Thou befriendest is not humbled. Blessed and Exalted art Thou, our Lord."',
      reference: "Sunan Abi Dawud 1425",
      href: "https://my.munibtracker.app/hadith/abudawud?q=1425",
      note: "Graded Sahih by al-Albani",
    },
    {
      type: "p",
      text: "Another wording is also widely recited in Witr. It begins “Allahumma inna nasta'inuka” and is reported from 'Umar ibn al-Khattab in the collection of al-Bayhaqi. Learn whichever wording your teacher or Masjid uses, and learn its meaning as well as its words: the Qunut is a real request, not only a recitation. For general guidance on asking Allah, see [how to make Dua](/resources/zikr/how-to-make-dua).",
    },
    { type: "h2", text: "What if you miss Witr?" },
    {
      type: "p",
      text: "Everyone oversleeps sometimes. The guidance for that moment is simple:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic: "مَنْ نَامَ عَنْ وِتْرِهِ أَوْ نَسِيَهُ فَلْيُصَلِّهِ إِذَا ذَكَرَهُ",
      translation:
        "Narrated AbuSa'id al-Khudri: The Prophet (ﷺ) said: If anyone oversleeps and misses the witr, or forgets it, he should pray when he remembers",
      reference: "Sunan Abi Dawud 1431",
      href: "https://my.munibtracker.app/hadith/abudawud?q=1431",
      note: "Graded Sahih by al-Albani. Al-Tirmidhi judged a mursal version of this report to be more authentic.",
    },
    {
      type: "p",
      text: "Whether making it up is required depends on how the school rates Witr in the first place. Because the Hanafi school counts Witr as wajib, a missed Witr is made up as Qaza. The Shafi'i and Hanbali schools say it is recommended to make it up. In the Maliki school, Witr is not made up once the Fajr Salah has been prayed. If missed Salah is a wider worry for you, the guide to [what Qaza Salah is](/resources/salah/what-is-qaza-salah) explains how making up works.",
    },
    {
      type: "note",
      tone: "scholar",
      title: "Making up Witr",
      text: "Hanafi: required, as Qaza. Shafi'i and Hanbali: recommended. Maliki: not made up after the Fajr Salah has been prayed. These are the schools' own positions; for your circumstances, ask a qualified scholar.",
    },
    {
      type: "p",
      text: "A missed night is not a reason to give up. Pray Witr earlier the next night, straight after Isha, until waking up at the end of the night feels manageable.",
    },
    {
      type: "note",
      tone: "app",
      title: "Witr in Munib Tracker",
      text: "Munib Tracker gives Witr its own row on the Salah tracker, separate from the five fard Salah. Its label follows the school you choose in [My madhhab](/features/my-madhhab) (wajib in the Hanafi school, Sunnah mu'akkadah in the others, or both views), and counting a missed Witr toward Qaza is on by default only for the Hanafi school. You can switch it either way. The [Types of Salah lesson](https://my.munibtracker.app/salah-guide/prayer-types) is open on the web.",
    },
  ],
  sources: [
    {
      label: "Sahih al-Bukhari 998 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=998",
    },
    {
      label: "Sahih al-Bukhari 996 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=996",
    },
    {
      label: "Sahih al-Bukhari 990 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=990",
    },
    {
      label: "Sahih al-Bukhari 1147 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=1147",
    },
    {
      label: "Sahih al-Bukhari 46 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=46",
    },
    {
      label: "Sahih Muslim 755 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/muslim?q=1766",
    },
    {
      label: "Sunan Abi Dawud 1422 — Munib Tracker (Sahih, Al-Albani)",
      url: "https://my.munibtracker.app/hadith/abudawud?q=1422",
    },
    {
      label: "Sunan Abi Dawud 1425 — Munib Tracker (Sahih, Al-Albani)",
      url: "https://my.munibtracker.app/hadith/abudawud?q=1425",
    },
    {
      label: "Sunan Abi Dawud 1431 — Munib Tracker (Sahih, Al-Albani)",
      url: "https://my.munibtracker.app/hadith/abudawud?q=1431",
    },
    {
      label: "Sunan Abi Dawud 1439 — Munib Tracker (Sahih, Al-Albani)",
      url: "https://my.munibtracker.app/hadith/abudawud?q=1439",
    },
  ],
  faqs: [
    {
      question: "How many rakahs is Witr?",
      answer:
        "Witr is an odd number of rakahs, and three is the most common. The Hanafi school prays three with one salam; the Shafi'i and Hanbali schools allow one to eleven; the Maliki school prays one rakah after a separate pair. A hadith in Sunan Abi Dawud (1422) mentions five, three or one.",
    },
    {
      question: "What time does Witr end?",
      answer:
        "Witr can be prayed any time after Isha until Fajr begins. If you will not wake before Fajr, pray it before you sleep. In the Maliki school a Witr that was not prayed in time may still be prayed until the Fajr Salah, but it is not made up after that.",
    },
    {
      question: "Is Witr compulsory?",
      answer:
        "Witr is not one of the five fard Salah. The Hanafi school holds that it is wajib, a level below fard, while the Shafi'i, Maliki and Hanbali schools hold that it is a strongly emphasised Sunnah. Either way, it is strongly encouraged.",
    },
    {
      question: "Can I pray Witr with one rakah?",
      answer:
        "Yes, in the Shafi'i and Hanbali schools one rakah is the minimum Witr, and the Maliki school prays one rakah after a separate pair. The Hanafi school prays Witr as three rakahs. Follow the school you learned.",
    },
  ],
  appTieIn: {
    feature: "salah-tracker",
    text: "Munib Tracker logs Witr separately from the five fard Salah and labels it according to your madhhab, so your record matches what you were taught. It is free, with no ads.",
  },
  related: [
    "/resources/salah/how-to-pray-salah-step-by-step",
    "/resources/salah/what-is-qaza-salah",
    "/resources/salah/how-to-pray-while-travelling",
    "/features/salah-tracker",
    "/features/my-madhhab",
  ],
};
