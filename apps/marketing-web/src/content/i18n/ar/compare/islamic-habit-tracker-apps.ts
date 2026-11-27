import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

export const islamicHabitTrackerAppsAr: ComparePage = {
  slug: "islamic-habit-tracker-apps",
  kind: "roundup",
  title: "مقارنة تطبيقات متابعة العادات الإسلامية",
  seoTitle: "مقارنة تطبيقات متابعة العادات الإسلامية (2026)",
  seoDescription:
    "مقارنة بين تطبيقات متابعة العادات الإسلامية: Munib Tracker و Islamic Habit Tracker و Muslim Tracker و Dawaam. الصلاة والذكر والقرآن والعادات المخصصة والإعلانات.",
  description:
    "تطبيقات متابعة العادات المرتكزة على العبادة جنبًا إلى جنب: ما الذي تتابعه، والعادات المخصصة، والإعلانات، والسعر، وممارسات البيانات.",
  keywords: [
    "تطبيقات متابعة العادات الإسلامية",
    "أفضل تطبيق لمتابعة العادات للمسلم",
    "مقارنة تطبيقات العادات الإسلامية",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "جولة مقارنة",
  intro: [
    "تساعدك تطبيقات متابعة العادات الإسلامية على بناء روتين حول الصلاة والذكر وقراءة القرآن والصيام. بعضها تطبيقات عادات عامة بطابع إسلامي، تُنشئ فيها كل عادة بنفسك؛ وبعضها مبني حول العبادة ويعرف مواقيت صلاتك والتقويم الهجري.",
    "معظم تطبيقات هذه الفئة صغيرة ومتاحة على Android فقط، لذلك راجعنا صفحة كل منها على Google Play (وصفحته على App Store إن وُجدت). Munib Tracker هو تطبيقنا، وقد أشرنا إلى ما تقدّمه التطبيقات الأخرى ولا يقدّمه هو.",
  ],
  apps: [
    MUNIB,
    {
      id: "mortys",
      name: "Islamic Habit Tracker (Mortys)",
      url: "https://play.google.com/store/apps/details?id=com.prayertimesqiblaazan.muslim",
    },
    {
      id: "june",
      name: "Islamic Habit Tracker App (June Afternoon)",
      url: "https://play.google.com/store/apps/details?id=islamic.habit.tracker.app",
    },
    {
      id: "deen",
      name: "Muslim Tracker (Deen IndieTech)",
      url: "https://play.google.com/store/apps/details?id=com.deenindietech.sunnahtracker",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "تريد عادات مخصصة بالكامل؟",
      text: "يتيح لك Islamic Habit Tracker من June Afternoon تحديد عاداتك بنفسك. أما Munib Tracker فيركّز على العبادة ولا يدعم إنشاء عادات مخصصة من أي نوع.",
    },
    {
      title: "تريد عبادة مُعدَّة مسبقًا؟",
      text: "يأتي Munib Tracker بمتابعة جاهزة للصلاة والقضاء والأذكار والقرآن والمواسم، مرتبطة بمواقيت صلاتك.",
    },
  ],
  table: [
    {
      group: "ما الذي يمكنك متابعته",
      rows: [
        {
          feature: "الصلاة",
          cells: {
            munib: M.salahLog,
            mortys: cell.partial("كعادة عامة"),
            june: cell.yes("كعادة مخصصة"),
            deen: cell.yes("في المسجد، في الوقت، فائتة"),
          },
        },
        {
          feature: "القضاء",
          cells: {
            munib: M.qaza,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "الذكر / التسبيح",
          cells: {
            munib: M.zikr,
            mortys: cell.yes("عدّاد"),
            june: cell.yes("مسبحة رقمية"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "القرآن",
          cells: {
            munib: cell.yes("قارئ كامل، وخطة ختم، وتدرّب على التلاوة"),
            mortys: cell.yes("قارئ"),
            june: cell.partial("يتابع الصفحات أو الوقت؛ بلا قارئ"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "الصيام",
          cells: {
            munib: cell.yes("رمضان، والأيام البيض، والصيام الفائت"),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.yes("عدة أنواع من الصيام"),
          },
        },
        {
          feature: "عادات مخصصة",
          cells: {
            munib: cell.partial("أذكار مخصصة وقائمة للسنن اليومية"),
            mortys: cell.yes(),
            june: cell.yes(),
            deen: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "بناء العادة",
      rows: [
        {
          feature: "هدف يومي يشمل العبادات",
          cells: {
            munib: cell.yes("هدف اليوم: الصلاة، والذكر، والقضاء، والختم"),
            mortys: cell.unverified(),
            june: cell.yes("قائمة عادات مخصصة"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "قائمة السنن اليومية",
          cells: {
            munib: P.sunnahHabits,
            mortys: cell.partial("عادات عامة"),
            june: cell.partial("كعادات مخصصة"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "مخطط صيام التطوع",
          cells: {
            munib: cell.yes(
              "الاثنين والخميس، وست من شوال، وعرفة، وعاشوراء، والأيام البيض وغيرها، مع تنبيهات للأيام المنهي عن صيامها",
            ),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.yes("عدة أنواع من الصيام"),
          },
        },
        {
          feature: "مراجعة أسبوعية وملاحظات",
          cells: {
            munib: cell.yes("تقرير أسبوعي ومرشد لطيف يعمل على الجهاز"),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "مراجعة ليلية للنفس (المحاسبة)",
          cells: {
            munib: P.muhasabah,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "تذكيرات صلة الرحم",
          cells: {
            munib: P.familyTies,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "رفيق المتابعة",
          cells: {
            munib: P.partner,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "المنصات والسعر والبيانات",
      rows: [
        {
          feature: "المنصات",
          cells: {
            munib: M.platforms,
            mortys: cell.text("Android"),
            june: cell.text("Android"),
            deen: cell.text("Android"),
          },
        },
        {
          feature: "الإعلانات",
          cells: {
            munib: cell.text("لا"),
            mortys: cell.text("نعم («Contains ads»)"),
            june: cell.text("لا يحمل وسم الإعلانات"),
            deen: cell.text("لا يحمل وسم الإعلانات"),
          },
        },
        {
          feature: "المشتريات داخل التطبيق",
          cells: {
            munib: cell.text("لا يوجد"),
            mortys: cell.text("نعم"),
            june: cell.text("نعم"),
            deen: cell.text("نعم"),
          },
        },
        {
          feature: "أمان البيانات على Google Play",
          cells: {
            munib: cell.text("بيانات وضع الضيف تبقى على الجهاز؛ بلا حِزم إعلانية"),
            mortys: cell.text("يشارك الموقع ونشاط التطبيق وغير ذلك"),
            june: cell.text("لا يجمع بيانات ولا يشاركها"),
            deen: cell.text("يشارك المعلومات المالية"),
          },
        },
      ],
    },
  ],
  strengths: {
    munib: [
      "متابعة العبادة جاهزة من أول استخدام",
      "تخطيط القضاء",
      "قارئ القرآن والتدرّب على التلاوة",
      "متاح على كل المنصات",
    ],
    mortys: ["قاعدة تثبيت كبيرة (أكثر من مليون)", "مجموعة ميزات شاملة وواسعة"],
    june: ["عادات مخصصة مرنة", "لا يجمع بيانات بحسب صفحته على Google Play"],
    deen: ["حالة مفصّلة للصلاة (في المسجد، في الوقت، فائتة)", "عدة أنواع من الصيام"],
  },
  bestFor: {
    munib: "كل من يريد عادات عبادة مُعدَّة مسبقًا، مع القضاء والقرآن.",
    mortys: "مستخدمو Android الذين يريدون تطبيقًا واسعًا ولا تزعجهم الإعلانات.",
    june: "من يريد تصميم قائمة عاداته بنفسه.",
    deen: "تسجيل مفصّل للصلاة والصيام على Android.",
  },
  body: [
    { type: "h2", text: "تطبيقات أخرى تستحق النظر" },
    {
      type: "p",
      text: "يجمع [Dawaam](https://play.google.com/store/apps/details?id=dawaam.app) بين الصلاة والأذكار وسلاسل العادات مع «فِرَق» (squads) لأدائها مع الأصدقاء، على iOS و Android. لم ندرجه في الجدول لأننا لم نتمكن من التحقق من عدد كافٍ من ميزاته في الصفحات الرسمية.",
    },
    {
      type: "p",
      text: "للاطلاع على أفكار لبناء روتين يدوم، اقرأ [كيف تبني عادات إسلامية أفضل](/resources/islamic-habits/how-to-build-better-islamic-habits).",
    },
  ],
  sources: [
    {
      label: "Islamic Habit Tracker (Mortys) — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.prayertimesqiblaazan.muslim",
    },
    {
      label: "Islamic Habit Tracker App (June Afternoon) — Google Play",
      url: "https://play.google.com/store/apps/details?id=islamic.habit.tracker.app",
    },
    {
      label: "Muslim Tracker (Deen IndieTech) — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.deenindietech.sunnahtracker",
    },
    {
      label: "Dawaam — Google Play",
      url: "https://play.google.com/store/apps/details?id=dawaam.app",
    },
  ],
  faqs: [
    {
      question: "ماذا ينبغي أن يتضمن تطبيق متابعة العادات الإسلامية؟",
      answer:
        "على الأقل: الصلوات الخمس اليومية، وشكلًا من أشكال متابعة الذكر، وقراءة القرآن. ومن الإضافات المفيدة: متابعة القضاء، وتذكيرات مرتبطة بمواقيت الصلاة، ومتابعة الصيام في رمضان وصيام التطوع.",
    },
  ],
  related: [
    "/features/daily-islamic-habits",
    "/compare/best-salah-tracker-apps",
    "/resources/islamic-habits/how-to-build-better-islamic-habits",
  ],
};
