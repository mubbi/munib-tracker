import type { Article } from "@/content/types";

export const article: Article = {
  slug: "how-to-calculate-zakat",
  category: "zakat-hajj",
  title: "How to Calculate Zakat: A Step-by-Step Guide",
  seoTitle: "How to Calculate Zakat: Nisab, 2.5% and What Counts",
  seoDescription:
    "How to calculate zakat step by step: the nisab in gold and silver, the lunar year, which wealth counts, debts, and where the four schools differ.",
  description:
    "A plain walkthrough of the zakat calculation: nisab, the lunar year, what counts, what to deduct, and the points on which the schools differ.",
  keywords: [
    "how to calculate zakat",
    "zakat calculation",
    "nisab for zakat",
    "zakat on gold and savings",
    "how much zakat do I pay",
  ],
  cluster: "tools",
  published: "2026-11-27",
  updated: "2026-11-27",
  takeaways: [
    "Zakat on money, gold, silver and trade goods is 2.5% (one-fortieth) of your net zakatable wealth.",
    "It is due once that wealth has stayed at or above the nisab for one lunar year.",
    "The nisab is a weight of gold or silver, so its value in your currency changes every day.",
    "The schools differ on which metal sets the nisab for cash, on worn jewellery, and on long-term debts.",
    "Any figure you work out is an estimate, not a fatwa. Ask a qualified scholar about your own wealth.",
  ],
  body: [
    {
      type: "p",
      text: "Zakat is the third pillar of Islam: a fixed share of qualifying wealth, given each year to the people the Qur'an names. The sum itself is simple. It is 2.5% of what you own once that wealth has stayed above a threshold for a lunar year. The questions come from the details: which threshold, which assets, and which debts.",
    },
    {
      type: "p",
      text: "This guide walks through the calculation in order and shows where the four Sunni schools of law differ. It does not give rulings, and a figure you work out from it is an estimate, not a fatwa. For your own wealth, especially a business, a pension or a mortgage, ask a qualified scholar.",
    },
    { type: "h2", text: "What zakat is and when it is due" },
    {
      type: "p",
      text: "The word zakat carries the meanings of purification and growth. The Qur'an describes it in exactly those terms:",
    },
    {
      type: "evidence",
      kind: "quran",
      arabic: "خُذۡ مِنۡ أَمۡوَٰلِهِمۡ صَدَقَةٗ تُطَهِّرُهُمۡ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيۡهِمۡۖ إِنَّ صَلَوٰتَكَ سَكَنٞ لَّهُمۡۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ",
      translation:
        "Take, [O Muḥammad], from their wealth a charity by which you purify them and cause them increase, and invoke [Allāh's blessings] upon them. Indeed, your invocations are reassurance for them. And Allāh is Hearing and Knowing.",
      reference: "Qur'an 9:103",
      href: "https://my.munibtracker.app/quran/9?ayah=103",
      note: "Translation: Saheeh International",
    },
    {
      type: "p",
      text: "When the Prophet Muhammad ﷺ sent Mu'adh ibn Jabal to Yemen, he described zakat as something taken from the wealthy of a community and given to its poor.",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic:
        "ادْعُهُمْ إِلَى شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ، وَأَنِّي رَسُولُ اللَّهِ، فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَأَعْلِمْهُمْ أَنَّ اللَّهَ قَدِ افْتَرَضَ عَلَيْهِمْ خَمْسَ صَلَوَاتٍ فِي كُلِّ يَوْمٍ وَلَيْلَةٍ، فَإِنْ هُمْ أَطَاعُوا لِذَلِكَ فَأَعْلِمْهُمْ أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ صَدَقَةً فِي أَمْوَالِهِمْ، تُؤْخَذُ مِنْ أَغْنِيَائِهِمْ وَتُرَدُّ عَلَى فُقَرَائِهِمْ",
      translation:
        'The Prophet (ﷺ) sent Mu`adh to Yemen and said, "Invite the people to testify that none has the right to be worshipped but Allah and I am Allah\'s Messenger (ﷺ), and if they obey you to do so, then teach them that Allah has enjoined on them five prayers in every day and night (in twenty-four hours), and if they obey you to do so, then teach them that Allah has made it obligatory for them to pay the Zakat from their property and it is to be taken from the wealthy among them and given to the poor."',
      reference: "Sahih al-Bukhari 1395",
      href: "https://my.munibtracker.app/hadith/bukhari?q=1395",
      note: "Narrated by Ibn Abbas. English text from the open hadith-api dataset (fawazahmed0).",
    },
    {
      type: "p",
      text: "Zakat is not the same as sadaqah. Sadaqah is voluntary charity in any amount, at any time. Zakat is an obligation with a set rate, on set kinds of wealth, paid to set groups of people. On money, gold, silver and trade goods it becomes due when two conditions meet: the wealth reaches the **nisab**, the minimum threshold, and it stays at or above that threshold for one full lunar (Hijri) year, called the **hawl**.",
    },
    { type: "h2", text: "Nisab: the threshold in gold and silver" },
    {
      type: "p",
      text: "Someone whose net wealth stays below the nisab all year owes no zakat. The thresholds were set in the currency of the Prophet's ﷺ time: 20 gold dinars or 200 silver dirhams. The silver figure appears in this hadith as five awaq, which scholars count as 200 dirhams.",
    },
    {
      type: "evidence",
      kind: "hadith",
      arabic:
        "لَيْسَ فِيمَا دُونَ خَمْسِ ذَوْدٍ صَدَقَةٌ مِنَ الإِبِلِ، وَلَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ، وَلَيْسَ فِيمَا دُونَ خَمْسَةِ أَوْسُقٍ صَدَقَةٌ",
      translation:
        'Allah\'s Messenger (ﷺ) said, "There is no Zakat on less than five camels and also there is no Zakat on less than five Awaq (of silver). […] And there is no Zakat on less than five Awsuq."',
      reference: "Sahih al-Bukhari 1447",
      href: "https://my.munibtracker.app/hadith/bukhari?q=1447",
      note: "Narrated by Abu Sa'id al-Khudri. English text from the open hadith-api dataset (fawazahmed0); the translator's bracketed notes on old coin values are left out where marked.",
    },
    {
      type: "p",
      text: "In weight, scholars convert 20 dinars to roughly 85 to 87.5 g of gold, and 200 dirhams to roughly 595 to 612 g of silver. The small range comes from different conversions of the old coins. Munib Tracker's calculator uses 87.48 g of gold (7.5 tola) and 612.36 g of silver (52.5 tola), figures widely cited in Hanafi texts.",
    },
    {
      type: "p",
      text: "You will not find a money figure for the nisab in this article, on purpose. The nisab in your currency is the weight multiplied by today's price per gram, so it changes every day. Check it on the day you calculate. Because gold and silver no longer trade at the ratio they once did, the two thresholds now give very different values, and the silver nisab is far lower. Which one applies to cash is one of the differences covered below.",
    },
    { type: "h2", text: "How to calculate zakat, step by step" },
    {
      type: "steps",
      items: [
        {
          title: "Fix your zakat date",
          text: "Note the Hijri date your wealth first reached the nisab. That date is your zakat anniversary each year. You do not track every coin: you assess everything you own on that one day.",
        },
        {
          title: "Add up your zakatable wealth",
          text: "List cash, bank balances, gold, silver, investments, business stock and money owed to you. Value each at today's market price, not what you paid for it.",
        },
        {
          title: "Subtract the debts you owe now",
          text: "Take off debts that are due now, such as an unpaid personal loan, bills already owed, or a credit card balance. Long-term debts are treated with more care (see below).",
        },
        {
          title: "Compare the result with the nisab",
          text: "Work out the nisab from today's gold or silver price per gram. If your net wealth is below it, no zakat is due this year.",
        },
        {
          title: "Take 2.5%",
          text: "If you are at or above the nisab, zakat is one-fortieth of the whole net amount, not only the part above the threshold. Divide by 40.",
        },
        {
          title: "Pay it with the intention of zakat",
          text: "Zakat is an act of worship, so intend it as zakat when you pay, and give it to people who are eligible to receive it.",
        },
      ],
    },
    {
      type: "p",
      text: "For example, if your net zakatable wealth on your zakat date is 40,000 in your own currency and that is above the nisab, the zakat is 1,000. The lunar year is about eleven days shorter than the solar year, so a Hijri anniversary moves earlier on the ordinary calendar each year.",
    },
    { type: "h2", text: "What counts and what does not" },
    {
      type: "p",
      text: "Zakat falls on wealth that is held as money or can grow, not on the things you live with and use. A useful question for any asset is: is this a store of value that I could sell or cash in?",
    },
    {
      type: "table",
      caption: "Common assets and how they are generally treated",
      head: ["Usually counted", "Usually not counted"],
      rows: [
        ["Cash in hand and in bank accounts", "The home you live in"],
        ["Gold and silver: bullion, coins, stored jewellery", "Your personal car"],
        ["Stocks, shares and funds at market value", "Clothing, furniture and appliances"],
        ["Business stock and trade goods at resale price", "Tools and equipment of your trade"],
        [
          "Money owed to you that you expect to collect",
          "Money owed to you that is unlikely to be repaid",
        ],
        ["Saved rental or business income", "Pension funds you cannot access yet"],
      ],
    },
    {
      type: "p",
      text: "Many scholars also count cryptocurrency and retirement savings you can access, treating them like cash or investments. Locked pension funds are a point on which scholars differ.",
    },
    {
      type: "p",
      text: "The 2.5% rate covers money and trade wealth only. Crops are assessed at harvest, at 10% for land watered naturally and 5% for land irrigated at a cost. Grazing livestock have their own scales from the Sunnah. Zakat al-fitr, the small charity due before the Eid prayer at the end of Ramadan, is a separate duty again. Our guide to [preparing for Ramadan](/resources/ramadan-fasting/how-to-prepare-for-ramadan) covers that month.",
    },
    { type: "h2", text: "Debts and deductions" },
    {
      type: "p",
      text: "Zakat is worked out on net wealth, so real debts can reduce it. The clearest case is a debt that is due now, and most scholars allow it to be subtracted before the 2.5% is applied.",
    },
    {
      type: "p",
      text: "Long-term debts, such as a mortgage or a multi-year instalment plan, are handled differently. A common contemporary approach is to deduct only the payments that fall due within the coming year, not the whole balance. Schools and scholars differ here, so choose one method under guidance and keep to it. Two cautions apply either way: future or possible expenses are not debts, and last year's unpaid zakat is not a deduction. It is still owed and should simply be paid.",
    },
    { type: "h2", text: "Where the four schools differ" },
    {
      type: "p",
      text: "Three differences change the result of a calculation. They are set out here without choosing between them.",
    },
    {
      type: "table",
      caption: "Positions of the four Sunni schools",
      head: ["Question", "Hanafi", "Shafi'i", "Maliki", "Hanbali"],
      rows: [
        [
          "Which nisab applies to cash and trade goods?",
          "Whichever is more beneficial to the poor, in practice the lower",
          "Not settled for modern currency; contemporary scholars differ between gold and silver",
          "Not settled for modern currency; contemporary scholars differ between gold and silver",
          "Whichever is more beneficial to the poor, in practice the lower",
        ],
        [
          "Are gold and silver added together to reach the nisab?",
          "Yes, by value",
          "No",
          "Yes, by each one's share of its own nisab",
          "Yes, by each one's share of its own nisab",
        ],
        [
          "Is a woman's jewellery in normal use zakatable?",
          "Yes",
          "No, if it is permissible and in normal use",
          "No, if it is permissible and in normal use",
          "No, if it is permissible and in normal use",
        ],
      ],
    },
    {
      type: "note",
      tone: "scholar",
      title: "An estimate is not a fatwa",
      text: "These are summaries of the well-known position in each school, not a ruling on your case. Jewellery, pensions, cryptocurrency, mortgages and business stock all have detailed rulings. Take your figures to a qualified scholar you trust, and follow one consistent method from year to year.",
    },
    { type: "h2", text: "Who receives zakat" },
    {
      type: "p",
      text: "Zakat is one of the few acts of worship where the recipients are named in the Qur'an itself:",
    },
    {
      type: "evidence",
      kind: "quran",
      arabic:
        "إِنَّمَا ٱلصَّدَقَٰتُ لِلۡفُقَرَآءِ وَٱلۡمَسَٰكِينِ وَٱلۡعَٰمِلِينَ عَلَيۡهَا وَٱلۡمُؤَلَّفَةِ قُلُوبُهُمۡ وَفِي ٱلرِّقَابِ وَٱلۡغَٰرِمِينَ وَفِي سَبِيلِ ٱللَّهِ وَٱبۡنِ ٱلسَّبِيلِۖ فَرِيضَةٗ مِّنَ ٱللَّهِۗ وَٱللَّهُ عَلِيمٌ حَكِيمٞ",
      translation:
        "Zakāh expenditures are only for the poor and for the needy and for those employed for it and for bringing hearts together [for Islām] and for freeing captives [or slaves] and for those in debt and for the cause of Allāh and for the [stranded] traveler - an obligation [imposed] by Allāh. And Allāh is Knowing and Wise.",
      reference: "Qur'an 9:60",
      href: "https://my.munibtracker.app/quran/9?ayah=60",
      note: "Translation: Saheeh International",
    },
    {
      type: "p",
      text: "You do not have to divide your zakat across all eight groups. Giving it to one eligible group fulfils the duty, and the poor and the needy are the most common choice. It is not given to the wealthy, or to those you are already obliged to support: your parents, your children and your spouse. Scholars differ on whether institutions and public projects qualify, so ask before giving zakat that way.",
    },
    {
      type: "note",
      tone: "app",
      title: "Doing the sum",
      text: "The [zakat calculator](/features/zakat-calculator) in Munib Tracker works out the nisab from gold and silver prices, which you can also type in yourself, and applies the 2.5%. If you choose a school under [My madhhab](/features/my-madhhab), it follows that school on the nisab and on jewellery; otherwise it shows each view. The result is labelled an educational estimate. The full zakat lessons are free on the [web app](https://my.munibtracker.app/zakat).",
    },
    {
      type: "p",
      text: "If this is your first time, do not wait for a perfect spreadsheet. Pick your date, list what you own, and take the list to someone knowledgeable. A careful estimate paid on time is better than a perfect one that never gets paid, and you can refine your method next year.",
    },
  ],
  sources: [
    {
      label: "Qur'an 9:103 (Saheeh International) — Munib Tracker",
      url: "https://my.munibtracker.app/quran/9?ayah=103",
    },
    {
      label: "Qur'an 9:60 (Saheeh International) — Munib Tracker",
      url: "https://my.munibtracker.app/quran/9?ayah=60",
    },
    {
      label: "Sahih al-Bukhari 1395 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=1395",
    },
    {
      label: "Sahih al-Bukhari 1447 — Munib Tracker",
      url: "https://my.munibtracker.app/hadith/bukhari?q=1447",
    },
    {
      label: "hadith-api (fawazahmed0), open hadith dataset used for the hadith text",
      url: "https://github.com/fawazahmed0/hadith-api",
    },
  ],
  faqs: [
    {
      question: "How much zakat do I pay on my savings?",
      answer:
        "Zakat on savings is 2.5%, one-fortieth, of your net zakatable wealth. It is due only if that wealth has stayed at or above the nisab for a full lunar year, and it is taken on the whole amount, not just the part above the nisab.",
    },
    {
      question: "What is the nisab for zakat today?",
      answer:
        "The nisab is the value of about 87.48 g of gold or 612.36 g of silver, so its amount in money changes daily with metal prices. Multiply the weight by today's price per gram in your currency. Scholars differ on whether cash is measured against the gold or the silver nisab.",
    },
    {
      question: "Do I pay zakat on gold jewellery that I wear?",
      answer:
        "It depends on the school you follow. The Hanafi school counts a woman's worn gold and silver jewellery as zakatable. The Shafi'i, Maliki and Hanbali schools do not, as long as it is permissible and in normal use. Stored gold and bullion are counted by all.",
    },
    {
      question: "Can I deduct my mortgage or loans before calculating zakat?",
      answer:
        "Debts that are due now are commonly deducted. For long-term debts such as a mortgage, a common contemporary approach is to deduct only the payments due in the coming year. Scholars differ, so ask one about your situation.",
    },
  ],
  appTieIn: {
    feature: "zakat-calculator",
    text: "Munib Tracker includes a free zakat calculator that works out the nisab from gold and silver prices and shows the result as an estimate to check with a scholar.",
  },
  related: [
    "/features/zakat-calculator",
    "/features/my-madhhab",
    "/resources/zakat-hajj/how-to-perform-umrah-step-by-step",
    "/resources/ramadan-fasting/how-to-prepare-for-ramadan",
  ],
};
