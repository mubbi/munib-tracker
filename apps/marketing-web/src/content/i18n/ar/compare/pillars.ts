import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const PL = "pillars";

export const vsPillarsAr: ComparePage = {
  slug: "munib-tracker-vs-pillars",
  kind: "versus",
  title: "Munib Tracker أم Pillars؟",
  seoTitle: "مقارنة Munib Tracker و Pillars: تطبيقان للصلاة بلا إعلانات",
  seoDescription:
    "Pillars و Munib Tracker كلاهما بلا إعلانات ولا يتطلبان حسابًا. قارن بينهما في متابعة الصلاة والقضاء والذكر والقرآن ودعم Apple Watch والأسعار.",
  description:
    "كلاهما بلا إعلانات ودون حساب. يركّز Pillars على مواقيت الصلاة وأدوات التركيز، ويضيف Munib Tracker القضاء والذكر والقرآن.",
  keywords: ["بديل تطبيق Pillars", "مقارنة Munib Tracker و Pillars", "تطبيق Pillars للصلاة"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "مقارنة",
  intro: [
    "يصف Pillars نفسه بأنه «تطبيق الصلاة الذي يمكنك الوثوق به». ومثل Munib Tracker، لا يعرض إعلانات ولا يتطلب حسابًا، ويحسب مواقيت الصلاة على الجهاز. وهو يركّز على الصلاة: المواقيت، والأذان، ومتابعة الصلاة، والأدوات على الشاشة الرئيسية، وأدوات Premium مثل حجب التطبيقات ومنبّه الفجر.",
    "يشارك Munib Tracker النهج نفسه القائم على الخصوصية أولًا، لكنه يغطي جوانب أوسع من العبادة اليومية: تخطيط القضاء، والأذكار، والقرآن، والتدرّب على التلاوة، ومكتبة للتعلّم. إليك المقارنة بينهما، اعتمادًا على موقع Pillars الرسمي وصفحاته في المتاجر.",
  ],
  apps: [
    MUNIB,
    {
      id: PL,
      name: "Pillars",
      developer: "The Pillars Group Ltd",
      url: "https://thepillarsapp.com",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "اختر Pillars إذا…",
      text: "كنت تريد تطبيقًا للصلاة مركّزًا وبسيطًا وجميلًا، ويعجبك منبّه الفجر الذكي فيه، ولا تحتاج إلى قارئ للقرآن أو أذكار في التطبيق نفسه.",
    },
    {
      title: "اختر Munib Tracker إذا…",
      text: "كنت تريد أيضًا متابعة القضاء، والأذكار، وقارئًا كاملًا للقرآن، والتدرّب على التلاوة، وقفل التركيز للصلاة في تطبيق واحد، وكل ذلك مجانًا.",
    },
  ],
  table: [
    {
      group: "السعر والخصوصية",
      rows: [
        {
          feature: "السعر",
          cells: {
            munib: M.price,
            [PL]: cell.text(
              "الأساسيات مجانية؛ وPremium يبدأ من 11.99$ شهريًا أو 49.99$ سنويًا في الولايات المتحدة",
            ),
          },
        },
        { feature: "الإعلانات", cells: { munib: M.ads, [PL]: cell.text("بلا إعلانات") } },
        {
          feature: "الحاجة إلى حساب",
          cells: { munib: M.account, [PL]: cell.text("غير مطلوب (بلا تسجيل)") },
        },
        {
          feature: "حساب مواقيت الصلاة على الجهاز",
          cells: { munib: cell.yes(), [PL]: cell.yes() },
        },
      ],
    },
    {
      group: "الصلاة",
      rows: [
        {
          feature: "مواقيت الصلاة والأذان",
          cells: { munib: M.times, [PL]: cell.yes("الأذان الكامل ضمن Premium") },
        },
        { feature: "القبلة", cells: { munib: M.qibla, [PL]: cell.yes() } },
        {
          feature: "تسجيل الصلاة عند أدائها",
          cells: { munib: M.salahLog, [PL]: cell.yes("متابعة مجانية") },
        },
        {
          feature: "أيام العذر (الحيض)",
          cells: { munib: M.excusedDays, [PL]: cell.yes("وضع الحيض يحافظ على السلاسل") },
        },
        {
          feature: "صلوات السنة والرواتب",
          cells: {
            munib: cell.yes("متابعة الرواتب (10 أو 12)، إضافة إلى التهجد والإشراق والضحى وغيرها"),
            [PL]: cell.unverified(),
          },
        },
        {
          feature: "متابعة القضاء",
          cells: {
            munib: M.qaza,
            [PL]: cell.partial("تعليم الصلاة بأنها متأخرة/مقضيّة؛ وعدّاد لقضاء الصيام"),
          },
        },
        {
          feature: "حجب التطبيقات وقت الصلاة",
          cells: { munib: P.focusLock, [PL]: cell.yes("PrayFirst، ضمن Premium") },
        },
        {
          feature: "منبّه فجر ذكي",
          cells: { munib: cell.no("الأذان والتذكيرات فقط"), [PL]: cell.yes("ضمن Premium") },
        },
        {
          feature: "أوقات المسجد",
          cells: {
            munib: cell.yes("البحث عن المساجد، إضافة إلى أوقات إقامة خاصة بك تُدخلها بنفسك"),
            [PL]: cell.partial("أوقات المساجد في مرحلة تجريبية"),
          },
        },
      ],
    },
    {
      group: "الذكر والقرآن",
      rows: [
        {
          feature: "عدّاد التسبيح",
          cells: { munib: M.tasbeeh, [PL]: cell.partial("على Apple Watch فقط، ضمن Premium") },
        },
        { feature: "الأذكار والأدعية", cells: { munib: M.zikr, [PL]: cell.unverified() } },
        {
          feature: "قارئ القرآن",
          cells: { munib: M.quranReader, [PL]: cell.no("بحسب مدوّنة Pillars نفسها") },
        },
        {
          feature: "مخطط الختم",
          cells: { munib: M.khatm, [PL]: cell.no("بحسب مدوّنة Pillars نفسها") },
        },
        {
          feature: "حاسبة الزكاة",
          cells: { munib: M.zakat, [PL]: cell.no("بحسب مدوّنة Pillars نفسها") },
        },
        {
          feature: "التدرّب على التلاوة",
          cells: { munib: M.recitation, [PL]: cell.unverified() },
        },
      ],
    },
    devicesGroupAr({
      [PL]: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: cell.yes("ضمن Premium"),
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes("مجانًا"),
      },
    }),
  ],
  strengths: {
    munib: [
      "حاسبة القضاء ومخططه",
      "الأذكار والأدعية والتسبيح على الهاتف",
      "قارئ كامل للقرآن مع التدرّب على التلاوة",
      "تطبيق مرافق على Apple Watch، ومربّعات Wear OS، وتطبيقات للتلفاز، وكلها مجانية",
      "قفل التركيز للصلاة والبحث عن المساجد دون أي تكلفة",
    ],
    [PL]: [
      "تجربة صلاة نظيفة ومركّزة",
      "بلا إعلانات ودون حساب، مثل Munib Tracker",
      "حجب التطبيقات عبر PrayFirst ومنبّه فجر ذكي (ضمن Premium)",
      "وضع للحيض يحافظ على السلاسل",
      "تقييمات مرتفعة على App Store",
    ],
  },
  bestFor: {
    munib: "لمن يريد تطبيقًا خاصًا واحدًا للصلاة والقضاء والذكر والقرآن.",
    [PL]: "لمن يريد تطبيقًا بسيطًا للصلاة ويقدّر أدوات التركيز مثل حجب التطبيقات.",
  },
  sources: [
    { label: "Pillars — الموقع الرسمي", url: "https://thepillarsapp.com" },
    { label: "Pillars — الميزات والأسعار (/ai)", url: "https://thepillarsapp.com/ai" },
    {
      label: "مدوّنة Pillars — أفضل تطبيقات رمضان",
      url: "https://thepillarsapp.com/blog/best-ramadan-apps",
    },
    { label: "Pillars — صفحته على App Store", url: "https://apps.apple.com/us/app/id1559086853" },
    {
      label: "Pillars — صفحته على Google Play",
      url: "https://play.google.com/store/apps/details?id=com.pillars.pillars",
    },
  ],
  faqs: [
    {
      question: "هل Pillars و Munib Tracker كلاهما بلا إعلانات؟",
      answer:
        "نعم. كلاهما يذكر أنه بلا إعلانات ولا يتطلب حسابًا. يقدّم Pillars ميزات Premium اختيارية، أما Munib Tracker فليست له أي فئة مدفوعة.",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/salah-tracker",
    "/features/zikr-tracker",
  ],
};
