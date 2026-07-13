import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ms overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
// Scaffolded from English — refine literary quality in follow-up i18n polish.
export const ISLAMIC_FINANCE_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "What Is Islamic Finance?",
    summary:
      "An ethical lens on money, not a separate product category — this guide is education only.",
    body: [
      "Islamic finance is not a brand of investment product; it is the application of Islamic ethics to how money is earned, lent, spent, and given away. At its core are a handful of principles: wealth is a trust from Allah rather than an end in itself, transactions must be free of exploitation and excessive uncertainty, and profit should be tied to real economic activity and shared risk rather than a guaranteed charge on a loan.",
      "This guide introduces those principles at a general, educational level: the prohibition of riba (interest/usury), fair dealing in trade, the obligations of zakah and voluntary sadaqah, and the basic concept of takaful (cooperative insurance). It intentionally does not screen funds, list stocks or ETFs, or recommend any specific product or provider.",
      "Modern financial products (mortgages, credit cards, insurance policies, retirement accounts, and more) are structured in many different ways, and rulings on them can depend on the exact contract terms and your jurisdiction. This guide gives you the underlying principles; for a ruling on your specific situation, speak with a qualified, certified Islamic finance scholar or institution.",
    ],
    disclaimer:
      "Educational content only — not financial advice and not a fatwa. It does not recommend, screen, or rate any specific fund, stock, provider, or financial product.",
  },
  {
    title: "Wealth as a Trust (Amanah)",
    summary: "Everything you own is ultimately Allah's — you are its steward, not its final owner.",
    body: [
      "A recurring Qur'anic theme is that wealth belongs to Allah first; a person is only its trustee (amanah) for a time, accountable for how it was earned and how it is used. This reframes money from a purely personal possession into something you will be asked about — where it came from and where it went.",
      "Two commands anchor how that trust plays out in dealings with other people: fulfilling contracts and agreements in full, and never taking someone else's wealth through injustice, deception, or exploitation, only through fair trade by mutual consent.",
      "Held together, these principles are why Islamic financial ethics keep returning to the same few questions: was this profit earned through real effort, risk, and value creation? Was the other party treated with full honesty? And is any obligation I've made being honoured?",
    ],
    quran: [
      {
        excerpt: "O you who have believed, fulfil [all] contracts...",
      },
      {
        excerpt:
          "Do not consume one another's wealth unjustly but only [in lawful] business by mutual consent.",
      },
    ],
  },
  {
    title: "The Prohibition of Riba",
    summary:
      "Riba (interest/usury) is one of the most strongly condemned transactions in the Qur'an.",
    body: [
      "Riba — commonly translated as interest or usury, broadly any predetermined, guaranteed increase charged on a loan — is prohibited in unusually strong language across five consecutive verses of Surah al-Baqarah (2:275–279), among the most severe warnings on any single topic in the Qur'an.",
      "The passage draws a deliberate contrast: 'Allah has permitted trade and forbidden riba' (2:275). Trade — buying, selling, and investing where both parties share genuine risk and effort — is praised; riba, a fixed charge owed regardless of outcome, is condemned. The chapter goes on to command believers to give up any outstanding riba entirely, warning of serious consequences for those who persist, while promising that whoever repents may keep only their original principal — no more, no less.",
      "This is a foundational teaching to be aware of, not a checklist for auditing every modern financial product yourself. Working out whether a specific contract (a mortgage, a loan, a savings account) involves riba in practice requires reviewing its actual terms with someone qualified in Islamic finance.",
    ],
    quran: [
      {
        excerpt:
          "Those who consume interest cannot stand [on the Day of Resurrection]... But Allah has permitted trade and has forbidden interest... O you who have believed, fear Allah and give up what remains [due to you] of interest... But if you repent, you may have your principal — you do no wrong, nor are you wronged.",
      },
    ],
  },
  {
    title: "Why Trade Differs from Interest",
    summary:
      "Legitimate profit is tied to risk and effort; riba is a guaranteed charge regardless of outcome.",
    body: [
      "A simple way to hold the distinction in mind: in a trade or genuine investment, the person providing capital or goods shares in the outcome — they may profit, but they can also lose, because they are exposed to the real performance of a venture. In a riba-based loan, the lender is guaranteed a fixed return regardless of whether the borrower's venture succeeds, struggles, or fails.",
      "Classical scholarship frames this as a matter of justice: a person in urgent need who borrows money can be trapped into paying back far more than they borrowed, with the risk placed entirely on them and none on the lender — precisely the imbalance the Qur'an condemns in the phrase 'Allah destroys interest and gives increase for charities' (2:276), a direct contrast between wealth built through exploitation and wealth grown through generosity.",
      "This is a general educational contrast, not a ruling on any specific instrument (some modern structures blur trade and lending in complex ways). Where a specific product sits on this spectrum is exactly the kind of question to bring to a qualified Islamic finance scholar or certified advisor rather than deciding from general principles alone.",
    ],
    quran: [
      {
        excerpt: "Allah destroys interest and gives increase for charities.",
      },
    ],
  },
  {
    title: "How Seriously the Sunnah Treats Riba",
    summary: "The Prophet ﷺ warned that everyone involved in a riba transaction shares in its sin.",
    body: [
      "Beyond the Qur'an's own warnings, the Prophet ﷺ made clear that responsibility for riba is not limited to whoever directly charges it. In an authentic hadith, he ﷺ is reported to have cursed the one who consumes riba, the one who pays it, the one who writes the contract, and the two witnesses to it — saying they are all equal in this.",
      "The lesson generally drawn from this is one of collective avoidance rather than individual blame alone: riba is treated as something a whole transaction, and everyone knowingly party to it, should stay away from — not merely a private matter between a lender and a borrower.",
      "As with the Qur'anic verses, this hadith establishes the seriousness of the principle; it does not itself tell you how to classify a specific modern financial product. That judgment call belongs with qualified scholars reviewing the actual contract.",
    ],
    hadith: [
      {
        excerpt:
          "Allah's Messenger ﷺ cursed the one who consumes riba, its payer, the one who records it, and the two witnesses to it, and said: they are all equal [in this]. (Jabir)",
      },
    ],
  },
  {
    title: "Honesty in Trade",
    summary: "The honest, trustworthy merchant is given one of the highest ranks in the Hereafter.",
    body: [
      "In sharp contrast to riba's warnings, honest trade is repeatedly praised. The Prophet Muhammad ﷺ himself worked as a trader before his prophethood and was known in Makkah by the title al-Amin — 'the Trustworthy' — for his integrity in business dealings, long before he was known as a prophet.",
      "He ﷺ later taught that 'the truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs' on the Day of Judgment — an extraordinarily high status attached to something as ordinary as fair dealing in a market.",
      "Practically, fair trade means: describing goods and services accurately, disclosing known defects rather than hiding them, honouring agreed prices and terms, and avoiding deception, false advertising, or exploiting a buyer's or seller's lack of knowledge. These are the same instincts that make for good, sustainable business in any tradition — Islam simply ties them to eternal reward as well.",
    ],
    hadith: [
      {
        excerpt:
          "The truthful, trustworthy merchant is with the prophets, the truthful, and the martyrs. (Abu Sa'id al-Khudri)",
      },
    ],
  },
  {
    title: "Navigating Modern Financial Products",
    summary:
      "Mortgages, cards, and insurance are genuinely complex — this guide stops at principles.",
    body: [
      "Modern financial life involves products the earliest generations of Muslims never encountered in their current form: mortgages, credit cards, retirement accounts, insurance, and investment funds structured in many different ways. Applying centuries-old principles to these products is real, careful scholarly work — not something to reason out alone from a few general verses.",
      "Because of this, contemporary Islamic finance institutions and certified scholars specialise specifically in reviewing modern contracts for compliance with these principles, often producing detailed rulings on particular products or structures. That specialised review is outside the scope of this app.",
      "If you're weighing a real financial decision — a home purchase, a loan, an investment, an insurance policy — the responsible next step is to consult a qualified, certified Islamic finance advisor or scholar who can look at the actual contract terms, not to rely on general educational content like this guide.",
    ],
    disclaimer:
      "This app does not evaluate, screen, or recommend any specific financial product, fund, or provider, and this guide is not a substitute for qualified professional or scholarly advice on your actual finances.",
  },
  {
    title: "Zakah: Worship Through Wealth",
    summary:
      "Zakah is an obligatory act of worship carried out with money rather than words or motion.",
    body: [
      "Zakah — a fixed, obligatory annual charge on qualifying wealth above a minimum threshold (nisab) — is one of the five pillars of Islam, placing giving on the same footing as prayer and fasting rather than treating it as optional generosity.",
      "The Qur'an consistently pairs zakah with prayer as a marker of genuine faith, and promises that those who establish both prayer and zakah 'will have their reward with their Lord, and there will be no fear concerning them, nor will they grieve.' Financially, it functions as a wealth-purification mechanism — redistributing a small, regular share of accumulated wealth to those in need rather than letting it sit idle indefinitely in a few hands.",
      "Because the calculation depends on your specific savings, assets, and local nisab values, this app has a dedicated Zakat guide and calculator — use it directly rather than estimating from general principles here.",
    ],
    quran: [
      {
        excerpt:
          "Indeed, those who believe and do righteous deeds and establish prayer and give zakah will have their reward with their Lord, and there will be no fear concerning them, nor will they grieve.",
      },
    ],
  },
  {
    title: "Sadaqah: Voluntary Giving",
    summary:
      "Beyond the obligatory zakah, any voluntary giving is called sadaqah — and it never truly costs you.",
    body: [
      "Sadaqah is voluntary charity, given in any amount, at any time, for the sake of Allah — beyond the fixed obligation of zakah. It ranges from significant financial gifts to something as small as a kind word or removing a source of harm from someone's path, all counted as forms of charity in the hadith literature.",
      "One of the most reassuring teachings for anyone hesitant to give is the Prophet's ﷺ statement that charity does not decrease wealth — a point the Qur'an supports elsewhere by describing spending in Allah's cause as something Allah replaces and rewards, not merely something that runs out.",
      "Practically, this reframes generosity: giving is not competing against your financial security but is presented as protecting and growing it, in ways not always visible on a balance sheet.",
    ],
    hadith: [
      {
        excerpt: "Charity does not decrease wealth... (Abu Hurayrah)",
      },
    ],
  },
  {
    title: "Takaful: Cooperative Risk-Sharing",
    summary:
      "A high-level look at the concept behind Islamic alternatives to conventional insurance.",
    body: [
      "Takaful (from an Arabic root meaning mutual guarantee) is the general concept behind Islamic approaches to insurance-like protection: a group of participants contribute to a shared fund, and that fund is used to help members who experience a covered loss, with any surplus typically shared among participants or carried forward rather than kept as a separate insurer's guaranteed profit.",
      "The underlying idea is cooperative risk-sharing rather than risk-transfer for a guaranteed premium: participants are seen as mutually helping one another, with the fund's operator typically acting as a manager or agent for a fee rather than the risk-bearing party itself.",
      "This is only a general, conceptual description. Actual takaful products vary widely in structure between providers and countries, and evaluating whether a specific plan is genuinely structured this way requires reviewing its actual terms with a qualified Islamic finance scholar or institution — this app does not recommend or evaluate any specific takaful (or insurance) provider or plan.",
    ],
    disclaimer:
      "General education only. This is not a recommendation of takaful over conventional insurance, or of any specific provider or plan — consult a qualified advisor for your circumstances.",
  },
  {
    title: "Takaful and Conventional Insurance, Compared at a High Level",
    summary: "The two share a purpose — managing risk — but differ in how that risk is structured.",
    body: [
      "Conventional insurance is typically structured as a contract where a policyholder pays a premium and the insurer, as a separate commercial party, bears the risk in exchange for that fee, often investing the premium pool in ways that may include interest-bearing instruments. Some classical scholars raised concerns about this structure touching on riba, gharar (excessive uncertainty about the payout), and the transfer of risk for a fixed fee rather than shared risk.",
      "Takaful was developed, broadly speaking, as an attempt to address those specific concerns through a mutual, cooperative structure instead — though scholars and institutions differ on exactly which structures fully achieve that goal, and takaful providers themselves vary considerably in design.",
      "Because both the concerns and the alternative structures involve real technical detail (and because personal circumstances such as location, coverage needs, and available providers vary enormously), this comparison is offered only as general background — not as a ruling on any specific policy you may be considering.",
    ],
    disclaimer:
      "Educational comparison only, not a fatwa on insurance or takaful in general or on any specific product. Scholars hold a range of views on modern insurance structures; consult a qualified advisor for your situation.",
  },
  {
    title: "FAQ: Is This Financial Advice?",
    summary: "No — this guide teaches principles only, and cannot replace qualified advice.",
    body: [
      "Q: Can I use this guide to decide whether a specific loan, investment, or insurance product is permissible for me? A: No. This guide explains general Islamic principles about money — it does not review contracts, recommend products, or issue rulings. Specific financial decisions should be made with a qualified financial professional and, for questions of permissibility, a qualified Islamic finance scholar.",
      "Q: Does this app rate or list halal stocks, funds, or ETFs? A: No, and it never will as part of this guide — fund screening and investment recommendations are outside its scope and require licensed financial expertise this content does not provide.",
      "Q: Is this guide a fatwa? A: No. A fatwa is a specific religious ruling issued by a qualified scholar in response to a specific question and context. This guide teaches general principles only; for an actual ruling on your situation, seek out a qualified, trusted scholar directly.",
    ],
    disclaimer:
      "This entire guide is educational content, not financial advice and not a fatwa. Always consult qualified financial and religious professionals for decisions about your own money.",
  },
  {
    title: "FAQ: How Do I Find Shariah-Compliant Options?",
    summary:
      "Look for certified expertise, not a list — this app intentionally doesn't provide one.",
    body: [
      "Q: Where can I find a list of halal banks, funds, or investment platforms? A: Not in this app, by design — product lists change constantly, vary drastically by country, and require ongoing compliance monitoring that only specialised institutions can properly maintain. Look instead for institutions with a genuine, named Shariah supervisory board and published compliance methodology.",
      "Q: How do I know if a scholar or certification is legitimate? A: Look for scholars or boards recognised by established Islamic finance standard-setting bodies in your region or internationally, rather than informal online claims. A reputable institution will be transparent about who reviews its products and how.",
      "Q: What should I do if I can't find any Islamic finance options where I live? A: This is a real and common situation. Discuss it with a knowledgeable local imam or scholar — they can help you weigh the available options for your specific circumstances, since guidance here can depend heavily on what alternatives genuinely exist for you.",
    ],
    actions: [
      "Look for institutions with a named, transparent Shariah supervisory board rather than relying on marketing claims.",
    ],
  },
  {
    title: "FAQ: Mortgages, Cards, and Loans",
    summary: "These are exactly the questions that need a qualified scholar, not a general guide.",
    body: [
      "Q: Is a mortgage always riba? A: Structures vary — some conventional mortgages are interest-based loans, while some providers offer alternative structures (such as diminishing partnership or lease-to-own models) intended to avoid interest. Whether a specific product achieves that in practice is a scholarly question about its actual contract, not something to assume either way.",
      "Q: Can I use a credit card if I always pay the full balance and never incur interest? A: Scholars hold different views on this, partly because the underlying agreement may still technically involve an interest clause even if you never trigger it in practice. This is a genuine area of differing qualified opinion — ask a scholar you trust rather than assuming a single universal answer.",
      "Q: What about student loans or other loans that may be unavoidable in some circumstances? A: Necessity and hardship are real considerations scholars weigh carefully, and views differ by circumstance and jurisdiction. If you're facing this decision, bring your specific situation to a qualified scholar rather than trying to resolve it from general reading alone.",
    ],
    disclaimer:
      "These are genuinely differed-upon, contract-specific questions. This FAQ only shows you what kind of question each one is — it does not answer any of them for your situation.",
  },
];
