import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const TA = "tarteel";

export const vsTarteelAr: ComparePage = {
  slug: "munib-tracker-vs-tarteel",
  kind: "versus",
  title: "Munib Tracker أم Tarteel للتدرّب على تلاوة القرآن؟",
  seoTitle: "مقارنة Munib Tracker و Tarteel: تلاوة القرآن بالذكاء الاصطناعي",
  seoDescription:
    "Tarteel هو التطبيق الرائد لحفظ القرآن بالذكاء الاصطناعي. ويقدّم Munib Tracker تدرّبًا مجانيًا على التلاوة على الجهاز مع متابعة الصلاة. قارن الميزات والخصوصية.",
  description:
    "يتصدّر Tarteel الحفظ بالذكاء الاصطناعي مع كشف للأخطاء مدفوع. ويقدّم Munib Tracker تدرّبًا مجانيًا على الجهاز ضمن أداة متكاملة لمتابعة العبادة.",
  keywords: [
    "بديل Tarteel",
    "مقارنة Munib Tracker و Tarteel",
    "تطبيق مجاني لتلاوة القرآن بالذكاء الاصطناعي",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "مقارنة",
  intro: [
    "Tarteel هو أشهر تطبيقات القرآن بالذكاء الاصطناعي، وقد تجاوزت تنزيلاته 10 ملايين على Google Play. يتابع تلاوتك، ويقدّم قارئًا مجانيًا سخيًّا للقرآن، وفي خطة Premium يكشف أثناء تلاوتك الكلمات الساقطة أو الخاطئة أو الزائدة وأخطاء التشكيل.",
    "أما التدرّب على القرآن في Munib Tracker فميزة أحدث وأبسط ضمن أداة أوسع لمتابعة العبادة. يعمل المستمع فيه على جهازك، وهو مجاني، ويعلِّم الكلمات التي تحتاج إلى إعادة. وإليك نظرة صادقة على أوجه الاختلاف بينهما.",
  ],
  apps: [MUNIB, { id: TA, name: "Tarteel", developer: "Tarteel Inc.", url: "https://tarteel.ai" }],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "اختر Tarteel إذا…",
      text: "كان الحفظ هدفك الأساسي وتريد أكثر ملاحظات الذكاء الاصطناعي تطورًا، بما فيها كشف الأخطاء مباشرة والتحليلات، ولا تمانع الاشتراك.",
    },
    {
      title: "اختر Munib Tracker إذا…",
      text: "كنت تريد تدرّبًا مجانيًا على التلاوة يُبقي صوتك على جهازك، إلى جانب متابعة الصلاة والقضاء والذكر في تطبيق واحد.",
    },
  ],
  table: [
    {
      group: "التدرّب على التلاوة",
      rows: [
        {
          feature: "يتابع تلاوتك",
          cells: { munib: cell.yes("مجاني"), [TA]: cell.yes("مجاني") },
        },
        {
          feature: "كشف الأخطاء",
          cells: {
            munib: M.mistakeMarks,
            [TA]: cell.yes("ضمن Premium: الكلمات الساقطة والخاطئة والزائدة وأخطاء التشكيل"),
          },
        },
        {
          feature: "ملاحظات على النطق كلمة بكلمة",
          cells: {
            munib: P.pronunciation,
            [TA]: cell.partial("أخطاء التشكيل ضمن كشف الأخطاء في Premium"),
          },
        },
        {
          feature: "ملاحظات على التجويد",
          cells: {
            munib: cell.partial(
              "لا يكشف أخطاء التجويد هو الآخر؛ ويقترح تدريب التجويد أصواتًا للتمرين، مع تدريبات وشروح",
            ),
            [TA]: cell.no("«لا يكشف أخطاء التجويد بعد»"),
          },
        },
        {
          feature: "إخفاء الكلمات / الآيات المخفية",
          cells: { munib: cell.yes("مجاني"), [TA]: cell.yes("Premium") },
        },
        {
          feature: "المراجعة المتباعدة",
          cells: {
            munib: M.memorization,
            [TA]: cell.partial("تخطيط الأهداف والسجل، ضمن Premium"),
          },
        },
        {
          feature: "أين يُعالَج الصوت",
          cells: {
            munib: cell.text("على جهازك؛ لا يُسجَّل ولا يُرفع أبدًا"),
            [TA]: cell.text(
              "يحتاج إلى اتصال ثابت بالإنترنت؛ ويذكر ملصق App Store جمع بيانات صوتية",
            ),
          },
        },
        {
          feature: "يعمل دون اتصال",
          cells: {
            munib: cell.yes("بعد تنزيل لمرة واحدة"),
            [TA]: cell.unverified("ميزات الصوت تحتاج إلى الإنترنت"),
          },
        },
      ],
    },
    {
      group: "قارئ القرآن",
      rows: [
        {
          feature: "الترجمات",
          cells: { munib: M.translations, [TA]: cell.yes("152 ترجمة بـ76 لغة") },
        },
        { feature: "التفسير", cells: { munib: M.tafsir, [TA]: cell.yes("45 تفسيرًا") } },
        {
          feature: "القرّاء",
          cells: {
            munib: cell.yes("عدة قرّاء، مع التنزيل للاستماع دون اتصال"),
            [TA]: cell.yes("16 تلاوة، مع التنزيل للاستماع دون اتصال"),
          },
        },
        { feature: "ألوان التجويد", cells: { munib: M.tajweedColours, [TA]: cell.yes() } },
        {
          feature: "التعرّف على الآية بالصوت",
          cells: { munib: M.verseDetector, [TA]: cell.yes("بحث صوتي") },
        },
        {
          feature: "أهداف القراءة",
          cells: { munib: M.khatm, [TA]: cell.yes("تخطيط الأهداف، ضمن Premium") },
        },
        {
          feature: "ملاحظات شخصية على الآيات",
          cells: { munib: P.ayahNotes, [TA]: cell.unverified() },
        },
        {
          feature: "البحث بجذور الكلمات العربية",
          cells: { munib: P.rootSearch, [TA]: cell.unverified() },
        },
        {
          feature: "ختمة جماعية مع الآخرين",
          cells: { munib: P.groupKhatm, [TA]: cell.unverified() },
        },
      ],
    },
    {
      group: "ما وراء القرآن",
      rows: [
        {
          feature: "تعلّم القراءة (الحروف ودروس التجويد)",
          cells: {
            munib: M.quranLearning,
            [TA]: cell.unverified("لم نجد دروسًا في التجويد أو القاعدة"),
          },
        },
        { feature: "متابعة الصلاة", cells: { munib: M.salahLog, [TA]: cell.unverified() } },
        { feature: "متابعة القضاء", cells: { munib: M.qaza, [TA]: cell.unverified() } },
        { feature: "الذكر والأدعية", cells: { munib: M.zikr, [TA]: cell.unverified() } },
        {
          feature: "مواقيت الصلاة والقبلة",
          cells: { munib: cell.yes(), [TA]: cell.unverified() },
        },
        { feature: "كتب الحديث", cells: { munib: M.hadith, [TA]: cell.unverified() } },
      ],
    },
    {
      group: "السعر",
      rows: [
        {
          feature: "السعر",
          cells: {
            munib: M.price,
            [TA]: cell.text(
              "الأساسيات مجانية؛ واشتراك Premium (يبدأ من 12.99$ شهريًا على App Store الأمريكي)",
            ),
          },
        },
        { feature: "الإعلانات", cells: { munib: M.ads, [TA]: cell.text("بلا إعلانات") } },
      ],
    },
    devicesGroupAr({
      [TA]: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
      },
    }),
  ],
  strengths: {
    munib: [
      "التدرّب على التلاوة مجاني، مع أوضاع الإخفاء والمراجعة المتباعدة",
      "يبقى الصوت على الجهاز",
      "جزء من أداة متكاملة لمتابعة العبادة: الصلاة والقضاء والذكر والتعلّم",
      "بلا اشتراك",
      "تدريب مجاني على التجويد وفحص أساسي للنطق، على الجهاز",
    ],
    [TA]: [
      "أكثر ملاحظات الحفظ بالذكاء الاصطناعي تطورًا، بما فيها أخطاء التشكيل",
      "بحث صوتي للعثور على أي آية",
      "مكتبة قرآنية مجانية كبيرة جدًا: ترجمات وتفاسير وقرّاء",
      "مُجرَّب على نطاق واسع (أكثر من 10 ملايين تنزيل)",
    ],
  },
  bestFor: {
    munib: "لمن يريد تدرّبًا خاصًا ومجانيًا على التلاوة ضمن وِرده اليومي من العبادة.",
    [TA]: "للحفّاظ المتفرّغين الذين يريدون أدق ملاحظات الذكاء الاصطناعي ولا يمانعون الاشتراك.",
  },
  body: [
    { type: "h2", text: "ماذا تعني «التلاوة بالذكاء الاصطناعي» في كل تطبيق" },
    {
      type: "p",
      text: "يستمع التطبيقان إليك ويتابعان تلاوتك. وكشف الأخطاء في Tarteel Premium هو الأكثر تفصيلًا بينهما: إذ ينبّه مباشرةً إلى الكلمات الساقطة والخاطئة والزائدة وأخطاء التشكيل. أما المستمع في Munib Tracker فيعرض الكلمات التي تحتاج إلى إعادة بعد كل آية، أو أثناء التلاوة إن فضّلت ذلك، ويخبرك حين لا يكون متأكدًا. وفحص النطق فيه أبسط من كشف الأخطاء في Tarteel: فهو يعلِّم الكلمات التي يبدو أنها سقطت أو لم تتضح، ويفوته كثير من الأخطاء بين الحروف المتقاربة في النطق. ثم يقترح تدريب التجويد أصواتًا تجويدية للتمرين من الآيات التي تعمل عليها. ولا يكشف أيٌّ من التطبيقين أخطاء التجويد ولا يمنح درجة في التجويد.",
    },
    {
      type: "p",
      text: "ولا يغني أيٌّ منهما عن التلاوة على معلّم مؤهَّل. اطّلع على دليلنا حول [كيفية تحسين تلاوة القرآن](/resources/quran-learning/how-to-improve-quran-recitation).",
    },
  ],
  sources: [
    { label: "Tarteel — الموقع الرسمي", url: "https://tarteel.ai" },
    {
      label: "مساعدة Tarteel — هل يمكنني استخدام Tarteel مجانًا؟",
      url: "https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free",
    },
    {
      label: "مساعدة Tarteel — أخطاء التجويد",
      url: "https://support.tarteel.ai/en/articles/12414457-tarteel-is-not-recognising-my-tajweed-mistakes",
    },
    {
      label: "مدونة Tarteel — إطلاق كشف الأخطاء",
      url: "https://tarteel.ai/blog/introducing-mistake-detection/",
    },
    { label: "Tarteel — صفحة App Store", url: "https://apps.apple.com/us/app/id1391009396" },
    {
      label: "Tarteel — صفحة Google Play",
      url: "https://play.google.com/store/apps/details?id=com.mmmoussa.iqra",
    },
  ],
  faqs: [
    {
      question: "هل يوجد بديل مجاني لكشف الأخطاء في Tarteel؟",
      answer:
        "التدرّب على القرآن في Munib Tracker مجاني، ويعلِّم الكلمات التي تحتاج إلى إعادة بعد كل آية. وهو أبسط من كشف الأخطاء في Tarteel Premium، ولا يكشف أخطاء التشكيل. وفيه أيضًا فحص أساسي للنطق يعلِّم الكلمات التي يبدو أنها سقطت أو لم تتضح، وتدريب على التجويد يقترح أصواتًا للتمرين، وكلاهما على الجهاز ودون درجات.",
    },
    {
      question: "هل يرفع Munib Tracker تلاوتي؟",
      answer: "لا. يعمل المستمع على جهازك؛ ولا يُسجَّل الصوت ولا يُخزَّن ولا يُرفع أبدًا.",
    },
  ],
  related: [
    "/features/quran-practice",
    "/resources/quran-learning/how-to-memorize-the-quran",
    "/compare",
  ],
};
