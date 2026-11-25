import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const I3 = "islam360";

export const vsIslam360Ar: ComparePage = {
  slug: "munib-tracker-vs-islam360",
  kind: "versus",
  title: "Munib Tracker أم Islam360؟",
  seoTitle: "مقارنة Munib Tracker و Islam360: القرآن والحديث والمتابعة",
  seoDescription:
    "يتميّز Islam360 بالبحث في القرآن والحديث مع تفاسير بالأردية. ويركّز Munib Tracker على متابعة الصلاة والقضاء والذكر بلا إعلانات، مع التدرّب على التلاوة.",
  description:
    "Islam360 تطبيق متعمّق للبحث في القرآن والحديث. أما Munib Tracker فأداة مجانية بلا إعلانات لمتابعة العبادة، مع قارئ للقرآن والتدرّب على التلاوة.",
  keywords: ["مقارنة Munib Tracker و Islam360", "بديل Islam360", "Islam360 بدون إعلانات"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "مقارنة",
  intro: [
    "يصف Islam360 نفسه بأنه «أول تطبيق في العالم للبحث في القرآن والحديث». وهو منتشر خصوصًا في جنوب آسيا، ويقدّم ترجمات بالأردية والهندية والأردية بالحروف اللاتينية، وتفاسير لعلماء معروفين، ومكتبة حديث كبيرة.",
    "أما Munib Tracker فينطلق من زاوية مختلفة: بُني أولًا لمساعدتك على المحافظة على عبادتك اليومية (الصلاة والقضاء والذكر)، ومعه قارئ للقرآن، والتدرّب على التلاوة، ومكتبة للتعلّم. نقارن بينهما هنا اعتمادًا على موقعيهما الرسميين وصفحاتهما في المتاجر.",
  ],
  apps: [
    MUNIB,
    {
      id: I3,
      name: "Islam360",
      developer: "Islam360 Foundation Trust",
      url: "https://www.theislam360.com/",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "اختر Islam360 إذا…",
      text: "كانت أولويتك دراسة القرآن والحديث دراسة متعمّقة بالأردية: ترجمات أردية كثيرة وتفاسير لعلماء مسمَّين، وتفسير صوتي، وسبعة من كتب الحديث الكبرى مع درجات الأحاديث.",
    },
    {
      title: "اختر Munib Tracker إذا…",
      text: "كنت تريد متابعة صلاتك وقضاء ما فاتك منها وفق خطة، والمواظبة على الأذكار اليومية، والتدرّب على التلاوة، بلا إعلانات ولا اشتراك.",
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
            [I3]: cell.text(
              "مجاني مع إعلانات؛ واشتراك لإزالة الإعلانات (9.99$ شهريًا أو 49.99$ سنويًا في الولايات المتحدة)",
            ),
          },
        },
        {
          feature: "إعلانات في النسخة المجانية",
          cells: { munib: M.ads, [I3]: cell.text("نعم (على Google Play: «Contains ads»)") },
        },
        {
          feature: "خانة «Data Used to Track You» على App Store",
          cells: {
            munib: cell.text("بلا حِزم إعلانية؛ وبيانات وضع الضيف تبقى على الجهاز"),
            [I3]: cell.text("المعرّفات"),
          },
        },
      ],
    },
    {
      group: "الصلاة",
      rows: [
        { feature: "مواقيت الصلاة والأذان", cells: { munib: M.times, [I3]: cell.yes() } },
        { feature: "القبلة", cells: { munib: M.qibla, [I3]: cell.yes() } },
        {
          feature: "تسجيل الصلاة عند أدائها",
          cells: {
            munib: M.salahLog,
            [I3]: cell.unverified("يذكر الموقع «Salah Tracker»؛ ولا تصف صفحات المتاجر التسجيل"),
          },
        },
        {
          feature: "صلوات السنة والرواتب",
          cells: {
            munib: cell.yes("متابعة الرواتب (10 أو 12)، إضافة إلى التهجد والإشراق والضحى وغيرها"),
            [I3]: cell.unverified(),
          },
        },
        { feature: "متابعة القضاء", cells: { munib: M.qaza, [I3]: cell.unverified() } },
        { feature: "البحث عن المساجد", cells: { munib: P.masjidFinder, [I3]: cell.unverified() } },
      ],
    },
    {
      group: "الذكر والأدعية",
      rows: [
        { feature: "عدّاد التسبيح", cells: { munib: M.tasbeeh, [I3]: cell.yes() } },
        {
          feature: "الأذكار والأدعية مع مراجعها",
          cells: { munib: M.zikr, [I3]: cell.yes("مع مراجع الأحاديث") },
        },
        {
          feature: "أذكارك الخاصة",
          cells: { munib: cell.yes("مع تحويل الكلام إلى نص"), [I3]: cell.unverified() },
        },
      ],
    },
    {
      group: "القرآن",
      rows: [
        {
          feature: "الترجمات",
          cells: {
            munib: M.translations,
            [I3]: cell.yes("أكثر من 21، منها الأردية والهندية والأردية بالحروف اللاتينية"),
          },
        },
        {
          feature: "التفسير",
          cells: { munib: M.tafsir, [I3]: cell.yes("أكثر من 16 لعلماء مسمَّين") },
        },
        { feature: "التفسير الصوتي", cells: { munib: M.tafsirAudio, [I3]: cell.yes() } },
        {
          feature: "كلمة بكلمة",
          cells: { munib: M.wordByWord, [I3]: cell.yes("من العربية إلى الأردية") },
        },
        {
          feature: "القرّاء",
          cells: {
            munib: cell.yes("عدة قرّاء، مع التنزيل للاستماع دون اتصال"),
            [I3]: cell.yes("أكثر من 12"),
          },
        },
        {
          feature: "البحث بجذر الكلمة",
          cells: {
            munib: P.rootSearch,
            [I3]: cell.yes("البحث بالجذر والموضوع والترجمة"),
          },
        },
        {
          feature: "التعرّف على الآية بالصوت",
          cells: {
            munib: M.verseDetector,
            [I3]: cell.yes("بحث صوتي في القرآن والحديث"),
          },
        },
        {
          feature: "ملاحظات شخصية على الآيات",
          cells: { munib: P.ayahNotes, [I3]: cell.yes("ملاحظات") },
        },
        { feature: "خطة قراءة للختم", cells: { munib: M.khatm, [I3]: cell.unverified() } },
        { feature: "القرآن دون اتصال", cells: { munib: M.quranOffline, [I3]: cell.unverified() } },
      ],
    },
    {
      group: "التعلّم والتلاوة",
      rows: [
        {
          feature: "دروس القاعدة والتجويد",
          cells: { munib: M.quranLearning, [I3]: cell.yes("27 درسًا في القاعدة مع الصوت") },
        },
        {
          feature: "التدرّب على التلاوة بالميكروفون",
          cells: { munib: M.recitation, [I3]: cell.unverified("البحث الصوتي فقط") },
        },
        {
          feature: "ملاحظات على النطق كلمة بكلمة",
          cells: { munib: P.pronunciation, [I3]: cell.unverified() },
        },
        {
          feature: "مكتبة منظّمة للتعلّم الإسلامي",
          cells: { munib: M.learning, [I3]: cell.partial("دورات و«Fahm-ul-Quran»") },
        },
      ],
    },
    {
      group: "الحديث",
      rows: [
        {
          feature: "كتب الحديث",
          cells: { munib: M.hadith, [I3]: cell.yes("الكتب السبعة الأساسية وغيرها") },
        },
        {
          feature: "درجات الأحاديث وشرحها",
          cells: { munib: M.hadithDepth, [I3]: cell.yes("درجات الأحاديث والتخريج") },
        },
      ],
    },
    {
      group: "الأدوات",
      rows: [
        { feature: "حاسبة الزكاة", cells: { munib: M.zakat, [I3]: cell.unverified() } },
        {
          feature: "حاسبة المواريث",
          cells: { munib: P.mirath, [I3]: cell.unverified() },
        },
        {
          feature: "الإحصاءات والسلاسل",
          cells: { munib: M.statistics, [I3]: cell.unverified() },
        },
      ],
    },
    devicesGroupAr(
      {
        [I3]: {
          ios: cell.yes("iPhone وiPad"),
          android: cell.yes("ومتوفر أيضًا على Huawei AppGallery"),
          appleWatch: NOT_ON_APP_STORE_AR,
          appleTv: NOT_ON_APP_STORE_AR,
          widgets: cell.yes("أدوات لمواقيت الصلاة والمتابعة والتسبيح والآيات على iPhone"),
        },
      },
      [
        {
          feature: "الحاسوب",
          cells: { munib: M.webApp, [I3]: cell.text("Mac (بمعالجات Apple silicon)") },
        },
      ],
    ),
  ],
  strengths: {
    munib: [
      "متابعة مفصّلة للصلاة والقضاء مع خطة للقضاء",
      "جلسات أذكار موجَّهة مع الحديث المصدر",
      "التدرّب على التلاوة على الجهاز مع مراجعة متباعدة",
      "بلا إعلانات ولا اشتراك ولا حساب",
      "أدوات للشاشة، وتطبيق مرافق على Apple Watch، ومربّعات على Wear OS",
      "ملاحظات على الآيات، والبحث بجذور الكلمات العربية",
    ],
    [I3]: [
      "بحث متعمّق في القرآن بالكلمة العربية والجذر والموضوع والترجمة",
      "ترجمات أردية كثيرة وتفاسير لعلماء مسمَّين",
      "مكتبة حديث كبيرة مع درجات الأحاديث والتخريج",
      "دروس في القاعدة مع الصوت",
      "قاعدة مستخدمين كبيرة وراسخة (أكثر من 10 ملايين تنزيل على Google Play)",
    ],
  },
  bestFor: {
    munib: "لمن يريد بناء عادات العبادة اليومية ومتابعتها، مع قراءة القرآن والتدرّب عليه.",
    [I3]: "للطلاب والقرّاء، ولا سيما الناطقين بالأردية، ممن يريدون أدوات متعمّقة لبحث القرآن والحديث.",
  },
  body: [
    { type: "h2", text: "منطلقان مختلفان" },
    {
      type: "p",
      text: "Islam360 أداة للبحث والدراسة أولًا. أما Munib Tracker فأداة للمتابعة أولًا: يسجّل صلاتك وقضاءك وأذكارك كل يوم ويعرض تقدّمك. ومن المعقول أن يستخدم كثيرون التطبيقين معًا: Islam360 للبحث، وMunib Tracker لوِردهم اليومي.",
    },
    { type: "h2", text: "العمق في القرآن والحديث" },
    {
      type: "p",
      text: "في تنوّع الترجمات والتفاسير الأردية، يقدّم Islam360 أكثر مما يقدّمه Munib Tracker. ويضم [قارئ القرآن](/features/quran) في Munib Tracker 25 ترجمة، وتفسيرًا عند الطلب، وعرضًا كلمة بكلمة، مع تركيز على القراءة دون اتصال وخطة للختم.",
    },
  ],
  sources: [
    { label: "Islam360 — الموقع الرسمي", url: "https://www.theislam360.com/" },
    { label: "Islam360 — الميزات", url: "https://www.theislam360.com/features" },
    { label: "Islam360 — تعلّم القرآن", url: "https://www.theislam360.com/learn-quran" },
    {
      label: "Islam360 — صفحة Google Play",
      url: "https://play.google.com/store/apps/details?id=com.islam360",
    },
    {
      label: "Islam360 — صفحة App Store",
      url: "https://apps.apple.com/us/app/islam360-quran-hadith-qibla/id1006098149",
    },
  ],
  faqs: [
    {
      question: "هل يدعم Munib Tracker اللغة الأردية؟",
      answer:
        "نعم. واجهة التطبيق متاحة بالأردية (مع تخطيط من اليمين إلى اليسار)، ويتضمن القرآن ترجمة أردية. ويقدّم Islam360 عددًا أكبر من الترجمات والتفاسير الأردية.",
    },
    {
      question: "أيهما أفضل للحديث؟",
      answer:
        "مكتبة الحديث في Islam360 أعمق، مع درجات الأحاديث والتخريج. أما Munib Tracker فيضم مجموعتين مضمَّنتين، وينزّل ست مجموعات أخرى عند الطلب.",
    },
  ],
  related: ["/compare/munib-tracker-vs-muslim-pro", "/features/quran", "/features/salah-tracker"],
};
