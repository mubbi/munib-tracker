import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const AT = "athan";

export const vsAthanAr: ComparePage = {
  slug: "munib-tracker-vs-athan",
  kind: "versus",
  title: "Munib Tracker أم Athan (IslamicFinder)؟",
  seoTitle: "مقارنة Munib Tracker وتطبيق Athan: متابعة الصلاة والقضاء",
  seoDescription:
    "قارن بين Munib Tracker وتطبيق Athan من IslamicFinder: مواقيت الصلاة، وتسجيلها، والقضاء، والذكر، والقرآن، والتدرّب على التلاوة، والإعلانات، والخصوصية.",
  description:
    "Athan تطبيق شائع لمواقيت الصلاة مع تسجيلها وسلاسل الالتزام. ويضيف Munib Tracker تخطيط القضاء والتدرّب على التلاوة، بلا إعلانات.",
  keywords: ["بديل تطبيق Athan", "مقارنة Munib Tracker و Athan", "بديل Athan من IslamicFinder"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "مقارنة",
  intro: [
    "يُعد Athan من IslamicFinder من أشهر تطبيقات مواقيت الصلاة، بتقييم 4.8 على Google Play من أكثر من 300,000 تقييم. وإلى جانب المواقيت والأذان، يسجّل صلواتك الخمس اليومية مع السلاسل والأهداف اليومية، ويتضمن وضعًا للحيض، وأدعية، وقارئًا للقرآن.",
    "يتقاطع Munib Tracker معه في مواقيت الصلاة وتسجيلها، ويضيف تخطيط القضاء، والأذكار الموجَّهة، والتدرّب على التلاوة، ومكتبة للتعلّم، بلا إعلانات. إليك مقارنة جنبًا إلى جنب مبنية على الصفحات الرسمية.",
  ],
  apps: [
    MUNIB,
    {
      id: AT,
      name: "Athan",
      developer: "IslamicFinder",
      url: "https://www.islamicfinder.org/athan/",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "اختر Athan إذا…",
      text: "كنت تريد تطبيقًا عريقًا لمواقيت الصلاة والأذان، مع تسجيل بسيط للصلاة، ومتابعة للدورة الشهرية، وقصص مرئية قصيرة.",
    },
    {
      title: "اختر Munib Tracker إذا…",
      text: "كنت تريد أيضًا تخطيط القضاء ومتابعته، واتباع جلسات أذكار موجَّهة، والتدرّب على تلاوة القرآن، واستخدام تطبيق مرافق على Apple Watch أو Wear OS، بلا إعلانات.",
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
            [AT]: cell.text(
              "مجاني مع إعلانات؛ وAthan Premium (1.99$ شهريًا أو 11.99$ سنويًا في الولايات المتحدة) أو إزالة الإعلانات بدفعة واحدة",
            ),
          },
        },
        {
          feature: "إعلانات في النسخة المجانية",
          cells: { munib: M.ads, [AT]: cell.text("نعم (على Google Play: «Contains ads»)") },
        },
        {
          feature: "خانة «Data Used to Track You» على App Store",
          cells: {
            munib: cell.text("بلا حِزم إعلانية؛ وبيانات وضع الضيف تبقى على الجهاز"),
            [AT]: cell.text("معلومات الاتصال"),
          },
        },
      ],
    },
    {
      group: "الصلاة",
      rows: [
        { feature: "مواقيت الصلاة والأذان", cells: { munib: M.times, [AT]: cell.yes() } },
        { feature: "القبلة", cells: { munib: M.qibla, [AT]: cell.yes() } },
        {
          feature: "تسجيل الصلاة عند أدائها",
          cells: { munib: M.salahLog, [AT]: cell.yes("سجل يومي وسلاسل") },
        },
        {
          feature: "الأهداف اليومية",
          cells: { munib: M.goals, [AT]: cell.yes("الأهداف اليومية (Daily Goals)") },
        },
        {
          feature: "أيام العذر (الحيض)",
          cells: { munib: M.excusedDays, [AT]: cell.yes("وضع الحيض مع متابعة الدورة") },
        },
        {
          feature: "صلوات السنة والرواتب",
          cells: {
            munib: cell.yes("متابعة الرواتب (10 أو 12)، إضافة إلى التهجد والإشراق والضحى وغيرها"),
            [AT]: cell.unverified(),
          },
        },
        {
          feature: "متابعة القضاء",
          cells: { munib: M.qaza, [AT]: cell.unverified("غير مذكورة في صفحات المتاجر") },
        },
        { feature: "يومية الصلاة", cells: { munib: M.journal, [AT]: cell.unverified() } },
        {
          feature: "البحث عن المساجد",
          cells: { munib: P.masjidFinder, [AT]: cell.unverified() },
        },
      ],
    },
    {
      group: "الصيام والمواسم",
      rows: [
        {
          feature: "متابعة الصيام",
          cells: { munib: M.fastingTracking, [AT]: cell.unverified() },
        },
        {
          feature: "مخطط صيام التطوع",
          cells: { munib: P.voluntaryFasting, [AT]: cell.unverified() },
        },
        { feature: "وضع ذي الحجة", cells: { munib: P.dhulHijjah, [AT]: cell.unverified() } },
        {
          feature: "أدلة الحج والعمرة",
          cells: { munib: M.hajjUmrah, [AT]: cell.yes("أدلة الحج والعمرة") },
        },
        {
          feature: "مرافق مباشر لأداء العمرة",
          cells: { munib: P.umrahMode, [AT]: cell.unverified() },
        },
        {
          feature: "التقويم الهجري",
          cells: { munib: M.hijriCalendar, [AT]: cell.yes("التقويم الهجري وتقويم أم القرى") },
        },
      ],
    },
    {
      group: "الذكر والقرآن",
      rows: [
        {
          feature: "التسبيح والأذكار",
          cells: { munib: M.zikr, [AT]: cell.yes("عدّاد تسبيح، وأذكار مع الصوت") },
        },
        {
          feature: "ترجمات القرآن",
          cells: { munib: M.translations, [AT]: cell.yes("أكثر من 45 لغة") },
        },
        {
          feature: "التفسير والترجمة كلمة بكلمة",
          cells: { munib: cell.yes(), [AT]: cell.unverified() },
        },
        {
          feature: "التعرّف على الآية بالصوت أو النص",
          cells: { munib: M.verseDetector, [AT]: cell.unverified() },
        },
        {
          feature: "تعلّم القرآن",
          cells: { munib: M.quranLearning, [AT]: cell.unverified("تطبيق Athan Academy منفصل") },
        },
        {
          feature: "التدرّب على التلاوة عبر الميكروفون",
          cells: { munib: M.recitation, [AT]: cell.unverified() },
        },
        {
          feature: "مجموعات الحديث",
          cells: {
            munib: M.hadith,
            [AT]: cell.unverified("قسم للحديث على موقع IslamicFinder"),
          },
        },
      ],
    },
    {
      group: "إضافات",
      rows: [
        {
          feature: "قصص مرئية قصيرة",
          cells: { munib: cell.no(), [AT]: cell.yes("Athan Stories") },
        },
      ],
    },
    devicesGroupAr({
      [AT]: {
        web: cell.partial("موقع IslamicFinder"),
        ios: cell.partial("iPhone؛ ولا نسخة لـiPad في صفحته على App Store"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes(),
      },
    }),
  ],
  strengths: {
    munib: [
      "حاسبة القضاء ومخطط بوتيرة يومية",
      "جلسات أذكار موجَّهة مع الحديث المصدر",
      "التدرّب على التلاوة على الجهاز",
      "تطبيق مرافق على Apple Watch، ومربّعات Wear OS، وتطبيقات للتلفاز",
      "بلا إعلانات ولا اشتراك",
      "البحث عن المساجد، ووضع العمرة، ومخطط لصيام التطوع",
    ],
    [AT]: [
      "تطبيق عريق لمواقيت الصلاة بتقييمات مرتفعة",
      "أهداف يومية وسلاسل للصلاة",
      "وضع للحيض مع متابعة الدورة",
      "أدلة للحج والعمرة وعدة تقاويم هجرية",
      "خيار Premium منخفض التكلفة",
    ],
  },
  bestFor: {
    munib: "لمن يريد متابعة تشمل القضاء، إضافة إلى التدرّب على القرآن والتعلّم، بلا إعلانات.",
    [AT]: "لمن يريد في الأساس مواقيت صلاة موثوقة وتسجيلًا يوميًا بسيطًا.",
  },
  sources: [
    { label: "Athan — موقع IslamicFinder", url: "https://www.islamicfinder.org/athan/" },
    {
      label: "Athan — صفحته على Google Play",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — صفحته على App Store",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
  ],
  faqs: [
    {
      question: "هل يتابع تطبيق Athan صلوات القضاء؟",
      answer:
        "لم نجد ذكرًا لمتابعة القضاء في صفحات Athan الرسمية أو موقعه حتى آخر مراجعة لنا. ويضم Munib Tracker [أداة مخصصة لمتابعة القضاء](/features/qaza-salah-tracker).",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/prayer-times-qibla",
    "/features/qaza-salah-tracker",
  ],
};
