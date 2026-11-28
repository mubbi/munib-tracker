import type { Article } from "@/content/types";

export const article: Article = {
  slug: "how-to-pray-tahajjud",
  category: "salah",
  title: "How to Pray Tahajjud: Time, Rakahs and Simple Steps",
  seoTitle: "How to Pray Tahajjud: Time, Rakahs and Steps",
  seoDescription:
    "How to pray Tahajjud step by step: when the night prayer starts, how to work out the last third of the night, how many rakahs to pray and where Witr fits.",
  description:
    "A sourced, practical guide to Tahajjud: what it is, the best time to pray it, how many rakahs, a simple step-by-step method, and how to keep it up.",
  keywords: [
    "how to pray tahajjud",
    "tahajjud prayer time",
    "how many rakahs is tahajjud",
    "last third of the night",
    "night prayer in islam",
  ],
  cluster: "salah",
  published: "2026-11-27",
  updated: "2026-11-27",
  takeaways: [
    "Tahajjud is a voluntary (Nafl) Salah prayed at night after Isha and before Fajr. It is not obligatory, and it is described as the best Salah after the obligatory ones.",
    "Any part of the night counts, but the last third of the night is the most hoped-for time.",
    "It is prayed in units of two rakahs. Two rakahs are enough to begin with, and there is no fixed required number.",
    "Witr closes the night's Salah. If you are not sure you will wake up, pray Witr before you sleep.",
    "A small amount kept up regularly is better than a long night you cannot repeat.",
  ],
  body: [
    {
      type: "p",
      text: "Tahajjud is the Salah you pray in the quiet of the night, when most people are asleep and nobody is watching. It is not complicated. If you already know how to pray two rakahs, you already know how to pray Tahajjud. What people usually need is a clear answer to three questions: when exactly is it, how many rakahs, and what about Witr. This guide answers those with sources you can check.",
    },
    { type: "h2", text: "What Tahajjud is" },
    {
      type: "p",
      text: "Tahajjud is a voluntary Salah offered at night. It is also called qiyam al-layl, standing in the night. The Qur'an mentions it by name:",
    },
    {
      type: "evidence",
      kind: "quran",
      arabic: "وَمِنَ ٱلَّيۡلِ فَتَهَجَّدۡ بِهِۦ نَافِلَةٗ لَّكَ عَسَىٰٓ أَن يَبۡعَثَكَ رَبُّكَ مَقَامٗا مَّحۡمُودٗا",
      translation:
        "And from [part of] the night, pray with it [i.e., recitation of the Qur’ān] as additional [worship] for you; it is expected that your Lord will resurrect you to a praised station.",
      reference: "Qur'an 17:79",
      href: "https://my.munibtracker.app/quran/17?ayah=79",
      note: "Translation: Saheeh International",
    },
    {
      type: "p",
      text: "The Prophet Muhammad ﷺ placed it above every other voluntary Salah:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic: "أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ وَأَفْضَلُ الصَّلاَةِ بَعْدَ الْفَرِيضَةِ صَلاَةُ اللَّيْلِ",
      translation:
        "Abu Haraira (Allah be pleased with him) reported Allah's Messenger (ﷺ) as saying: The most excellent fast after Ramadan is God's month. al-Muharram, and the most excellent prayer after what is prescribed is prayer during the night.",
      reference: "Sahih Muslim 1163",
      href: "https://my.munibtracker.app/hadith/muslim?q=2755",
    },
    {
      type: "note",
      tone: "scholar",
      title: "Tahajjud and qiyam al-layl",
      text: "Scholars use these words in slightly different ways. Many reserve “Tahajjud” for Salah prayed after waking from sleep, and use “qiyam al-layl” for any voluntary Salah between Isha and Fajr. Others use the two names for the same thing. Either way, voluntary Salah at night is rewarded whether or not you slept first. For a detailed answer, ask a qualified scholar you trust.",
    },
    { type: "h2", text: "When to pray Tahajjud" },
    {
      type: "p",
      text: "The time for the night Salah begins after Isha and ends when Fajr begins. Within that window, the last third of the night is the time most often singled out:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic:
        "يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ يَقُولُ مَنْ يَدْعُونِي فَأَسْتَجِيبَ لَهُ مَنْ يَسْأَلُنِي فَأُعْطِيَهُ مَنْ يَسْتَغْفِرُنِي فَأَغْفِرَ لَهُ",
      translation:
        'Narrated Abu Huraira: Allah\'s Messenger (ﷺ) (p.b.u.h) said, "Our Lord, the Blessed, the Superior, comes every night down on the nearest Heaven to us when the last third of the night remains, saying: "Is there anyone to invoke Me, so that I may respond to invocation? Is there anyone to ask Me, so that I may grant him his request? Is there anyone seeking My forgiveness, so that I may forgive him?"',
      reference: "Sahih al-Bukhari 1145",
      href: "https://my.munibtracker.app/hadith/bukhari?q=1145",
    },
    {
      type: "p",
      text: "To find the last third, the night is commonly counted from Maghrib to Fajr. Divide that length by three and subtract one third from the time of Fajr.",
    },
    {
      type: "table",
      caption: "Example: working out the last third of the night",
      head: ["Step", "Example"],
      rows: [
        ["Maghrib", "6:00 pm"],
        ["Fajr", "5:00 am"],
        ["Length of the night", "11 hours"],
        ["One third of the night", "3 hours 40 minutes"],
        ["Last third begins", "1:20 am"],
      ],
    },
    {
      type: "p",
      text: "These times move every day and differ by city, so use your own local Maghrib and Fajr times. If the last third is too hard for now, praying after Isha before you sleep, or waking twenty minutes before Fajr, still counts as Salah at night. The Prophet ﷺ also described the Salah of Dawud (peace be upon him) as the most beloved to Allah: he slept half the night, stood for a third of it, then slept the last sixth ([Sahih al-Bukhari 1131](https://my.munibtracker.app/hadith/bukhari?q=1131)).",
    },
    { type: "h2", text: "How many rakahs is Tahajjud?" },
    {
      type: "p",
      text: "There is no fixed number that you must pray. The night Salah is prayed two rakahs at a time, with a salam after each pair:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic: "صَلاَةُ اللَّيْلِ مَثْنَى مَثْنَى، فَإِذَا خَشِيَ أَحَدُكُمُ الصُّبْحَ صَلَّى رَكْعَةً وَاحِدَةً، تُوتِرُ لَهُ مَا قَدْ صَلَّى",
      translation:
        "Narrated Ibn `Umar: Once a person asked Allah's Messenger (ﷺ) (ﷺ) about the night prayer. Allah's Apostle (ﷺ) replied, \"The night prayer is offered as two Rak`at followed by two Rak`at and so on and if anyone is afraid of the approaching dawn (Fajr prayer) he should pray one Rak`ah and this will be a Witr for all the Rak`at which he has prayed before.\"",
      reference: "Sahih al-Bukhari 990",
      href: "https://my.munibtracker.app/hadith/bukhari?q=990",
    },
    {
      type: "p",
      text: "Aishah (may Allah be pleased with her) reported that the Prophet ﷺ did not go beyond eleven rakahs at night, in Ramadan or outside it, and she described how long and beautiful they were ([Sahih al-Bukhari 1147](https://my.munibtracker.app/hadith/bukhari?q=1147)). Scholars discuss whether that number is a limit or simply his usual practice. For someone starting out, two unhurried rakahs are a complete Tahajjud. You can add another two when it feels natural.",
    },
    { type: "h2", text: "How to pray Tahajjud step by step" },
    {
      type: "steps",
      items: [
        {
          title: "Decide before you sleep",
          text: "Make the intention to get up, set an alarm, and sleep a little earlier. If you fear you will not wake, pray two rakahs after Isha before going to bed.",
        },
        {
          title: "Wake up and make Wudu",
          text: "Remember Allah when you wake, then make Wudu. If you need a refresher, see [how to make Wudu](/resources/salah/how-to-make-wudu).",
        },
        {
          title: "Pray two rakahs",
          text: "Intend the voluntary night Salah in your heart and pray two rakahs as you would any Nafl Salah: Surah al-Fatihah and a passage of Qur'an in each rakah, then ruku, sujud, tashahhud and salam. The full sequence is in [how to pray Salah step by step](/resources/salah/how-to-pray-salah-step-by-step).",
        },
        {
          title: "Recite what you know",
          text: "There are no set surahs. The Qur'an tells those who stand at night to “recite what is easy” of it ([Qur'an 73:20](https://my.munibtracker.app/quran/73?ayah=20)). Short surahs you know well are fine. Recite calmly, aloud or quietly.",
        },
        {
          title: "Add more pairs if you wish",
          text: "Pray two more, and two more again, for as long as you can keep your attention. A few calm, attentive rakahs are worth more to you than a high count prayed in a hurry.",
        },
        {
          title: "Make Dua",
          text: "Ask Allah in your sujud and after you finish. This is one of the best times to ask. See [how to make Dua](/resources/zikr/how-to-make-dua).",
        },
        {
          title: "Close with Witr",
          text: "If you have not prayed Witr yet, make it the last Salah of your night.",
        },
      ],
    },
    { type: "h2", text: "Where Witr fits" },
    {
      type: "p",
      text: "Witr is the Salah with an odd number of rakahs that ends the night. When to pray it depends on how confident you are that you will wake:",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic:
        "مَنْ خَافَ أَنْ لاَ يَقُومَ مِنْ آخِرِ اللَّيْلِ فَلْيُوتِرْ أَوَّلَهُ وَمَنْ طَمِعَ أَنْ يَقُومَ آخِرَهُ فَلْيُوتِرْ آخِرَ اللَّيْلِ فَإِنَّ صَلاَةَ آخِرِ اللَّيْلِ مَشْهُودَةٌ وَذَلِكَ أَفْضَلُ",
      translation:
        "Jabir reported Allah's Messenger (ﷺ) as saying: If anyone is afraid that he may not get up in the latter part of the night, he should observe Witr in the first part of it; and if anyone is eager to get up in the last part of it, he should observe Witr at the end of the night, for prayer at the end of the night is witnessed (by the angels) and that is preferable.",
      reference: "Sahih Muslim 755",
      href: "https://my.munibtracker.app/hadith/muslim?q=1766",
    },
    {
      type: "p",
      text: "If you already prayed Witr after Isha and then wake up, a widely held view is that you may still pray Tahajjud in pairs of two and do not pray Witr a second time, based on the report that there are no two Witrs in one night ([Sunan Abi Dawud 1439](https://my.munibtracker.app/hadith/abudawud?q=1439), graded Sahih by al-Albani).",
    },
    {
      type: "note",
      tone: "scholar",
      title: "The schools differ on Witr",
      text: "In the Hanafi school Witr is wajib (necessary) and is prayed as three rakahs with one salam. In the Shafi'i, Maliki and Hanbali schools it is a strongly emphasised Sunnah, with a minimum of one rakah; the Maliki school prays that one rakah after a separate pair. Follow the school you learned, and ask a qualified scholar about your own situation.",
    },
    { type: "h2", text: "Building a Tahajjud habit that lasts" },
    {
      type: "p",
      text: "The Prophet ﷺ taught that the deeds most beloved to Allah are those done regularly, even if they are small ([Sahih al-Bukhari 6464](https://my.munibtracker.app/hadith/bukhari?q=6464)). That is the best way to approach Tahajjud.",
    },
    {
      type: "ul",
      items: [
        "Start with one or two nights a week, such as the night before a day off, rather than every night.",
        "Keep it to two rakahs until waking up stops feeling like a struggle.",
        "Sleep earlier. Tahajjud is mostly won at bedtime.",
        "If you miss a night, do not count it as failure. Begin again the next night.",
        "In Ramadan, especially in the last ten nights, you are often awake before Fajr anyway. Use that time. See the [Laylat al-Qadr guide](/resources/ramadan-fasting/laylat-al-qadr-guide).",
      ],
    },
    {
      type: "note",
      tone: "app",
      title: "Tahajjud in Munib Tracker",
      text: "Munib Tracker works out when the last third of tonight begins from your own Maghrib and Fajr times, and shows a countdown to it. You can mark the nights you prayed and see your streak on a four-week calendar. The [Tahajjud page](https://my.munibtracker.app/tahajjud) is open on the web, and Tahajjud is also part of the [Salah tracker](/features/salah-tracker).",
    },
  ],
  sources: [
    {
      label: "Qur'an 17:79 — Munib Tracker (Saheeh International)",
      url: "https://my.munibtracker.app/quran/17?ayah=79",
    },
    {
      label: "Qur'an 73:20 — Munib Tracker (Saheeh International)",
      url: "https://my.munibtracker.app/quran/73?ayah=20",
    },
    {
      label: "Sahih Muslim 1163 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/muslim?q=2755",
    },
    {
      label: "Sahih al-Bukhari 1145 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=1145",
    },
    {
      label: "Sahih al-Bukhari 1131 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=1131",
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
      label: "Sahih Muslim 755 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/muslim?q=1766",
    },
    {
      label: "Sunan Abi Dawud 1439 — Munib Tracker (Sahih, Al-Albani)",
      url: "https://my.munibtracker.app/hadith/abudawud?q=1439",
    },
    {
      label: "Sahih al-Bukhari 6464 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=6464",
    },
  ],
  faqs: [
    {
      question: "What time is Tahajjud?",
      answer:
        "Tahajjud can be prayed any time after Isha until Fajr begins. The best time is the last third of the night, which you find by dividing the time between Maghrib and Fajr into three and taking the final part.",
    },
    {
      question: "How many rakahs is Tahajjud?",
      answer:
        "There is no fixed number. It is prayed two rakahs at a time, so two rakahs are the minimum, and you may add more pairs. The Prophet ﷺ is reported not to have gone beyond eleven rakahs including Witr (Sahih al-Bukhari 1147).",
    },
    {
      question: "Do I have to sleep before praying Tahajjud?",
      answer:
        "Voluntary Salah at night is rewarded whether or not you slept first. Many scholars use the name Tahajjud specifically for Salah prayed after waking from sleep, while others use it for any night Salah, so ask a scholar if the distinction matters to you.",
    },
    {
      question: "Can I pray Tahajjud if I already prayed Witr?",
      answer:
        "A widely held view is yes: pray Tahajjud in pairs of two and do not repeat Witr, because of the report that there are no two Witrs in one night (Sunan Abi Dawud 1439). The schools discuss the details, so check with a scholar you trust.",
    },
  ],
  appTieIn: {
    feature: "salah-tracker",
    text: "Munib Tracker shows when the last third of tonight begins for your location and keeps a simple record of the nights you prayed Tahajjud. It is free, with no ads.",
  },
  related: [
    "/resources/salah/how-to-pray-salah-step-by-step",
    "/resources/salah/how-to-make-wudu",
    "/resources/zikr/how-to-make-dua",
    "/resources/ramadan-fasting/laylat-al-qadr-guide",
    "/features/salah-tracker",
  ],
};
