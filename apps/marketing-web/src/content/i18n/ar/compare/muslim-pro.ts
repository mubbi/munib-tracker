import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupAr } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const MP = "muslim-pro";

export const vsMuslimProAr: ComparePage = {
  slug: "munib-tracker-vs-muslim-pro",
  kind: "versus",
  title: "Munib Tracker أم Muslim Pro؟",
  seoTitle: "مقارنة Munib Tracker و Muslim Pro: الميزات والإعلانات والخصوصية",
  seoDescription:
    "مقارنة موثَّقة بين Munib Tracker و Muslim Pro: متابعة الصلاة والقضاء، والقرآن، والذكر، والتدرّب على التلاوة، والأسعار، والإعلانات، وملصقات الخصوصية.",
  description:
    "Muslim Pro هو أوسع تطبيق إسلامي شامل لأسلوب الحياة. أما Munib Tracker فتطبيق مجاني بلا إعلانات لمتابعة العبادة ومرافقة القرآن. إليك أوجه الاختلاف بينهما.",
  keywords: ["بديل Muslim Pro", "مقارنة Munib Tracker و Muslim Pro", "Muslim Pro بدون إعلانات"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "مقارنة",
  intro: [
    "يُعد Muslim Pro من شركة Bitsmedia من أشهر التطبيقات الإسلامية، إذ تجاوزت تنزيلاته 100 مليون على Google Play. ويغطي مواقيت الصلاة، والقرآن، والأدعية، ومتابعة الصلاة والصيام، وخدمة فيديو باسم Qalbox، وأداة للبحث عن الأماكن الحلال، وغير ذلك الكثير.",
    "أما Munib Tracker فتطبيق أصغر ومجاني يركّز على متابعة عبادتك (الصلاة والقضاء والذكر)، والقرآن، والتعلّم، بلا إعلانات ودون الحاجة إلى حساب. تقارن هذه الصفحة بين التطبيقين اعتمادًا على الموقع الرسمي لكل منهما وصفحاته في المتاجر.",
  ],
  apps: [
    MUNIB,
    {
      id: MP,
      name: "Muslim Pro",
      developer: "Bitsmedia Pte Ltd",
      url: "https://www.muslimpro.com/",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "اختر Muslim Pro إذا…",
      text: "كنت تريد تطبيقًا واحدًا لكل شيء تقريبًا، بما في ذلك المحاضرات المرئية، وأداة للبحث عن المطاعم الحلال، ومجتمعًا كبيرًا، ومساعدًا للأسئلة والأجوبة بالذكاء الاصطناعي، ولا تمانع الإعلانات أو اشتراك Premium.",
    },
    {
      title: "اختر Munib Tracker إذا…",
      text: "كان همّك الأساسي متابعة الصلاة والقضاء والذكر، وقراءة القرآن والتدرّب على تلاوته، والتعلّم، في تطبيق بلا إعلانات ولا اشتراك ولا حساب.",
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
            [MP]: cell.text(
              "مجاني مع إعلانات؛ واشتراك Premium (12.99$ شهريًا أو 34.99$ سنويًا في الولايات المتحدة)",
            ),
          },
        },
        {
          feature: "إعلانات في النسخة المجانية",
          cells: { munib: M.ads, [MP]: cell.text("نعم (على Google Play: «Contains ads»)") },
        },
        {
          feature: "خانة «Data Used to Track You» على App Store",
          cells: {
            munib: cell.text("بلا حِزم إعلانية؛ وبيانات وضع الضيف تبقى على الجهاز"),
            [MP]: cell.text("الموقع، والمعرّفات"),
          },
        },
        {
          feature: "الحاجة إلى حساب للاستخدام الأساسي",
          cells: { munib: M.account, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "الصلاة",
      rows: [
        { feature: "مواقيت الصلاة والأذان", cells: { munib: M.times, [MP]: cell.yes() } },
        { feature: "القبلة", cells: { munib: M.qibla, [MP]: cell.yes() } },
        {
          feature: "تسجيل الصلاة عند أدائها",
          cells: { munib: M.salahLog, [MP]: cell.yes("متابعة الصلاة والصيام مع السلاسل") },
        },
        {
          feature: "صلوات السنة والنافلة",
          cells: { munib: M.sunnahSalah, [MP]: cell.unverified() },
        },
        { feature: "متابعة السنن الرواتب", cells: { munib: P.rawatib, [MP]: cell.unverified() } },
        {
          feature: "أيام العذر (الحيض والمرض والسفر)",
          cells: { munib: M.excusedDays, [MP]: cell.unverified() },
        },
        {
          feature: "متابعة القضاء (الصلوات الفائتة)",
          cells: {
            munib: M.qaza,
            [MP]: cell.yes("متابعة العبادات تسجّل الصلوات والصيام الفائت"),
          },
        },
        { feature: "يومية الصلاة", cells: { munib: M.journal, [MP]: cell.yes("يومية") } },
        {
          feature: "البحث عن المساجد",
          cells: { munib: P.masjidFinder, [MP]: cell.yes("المساجد والأماكن الحلال") },
        },
        {
          feature: "حجب التطبيقات وقت الصلاة",
          cells: { munib: P.focusLock, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "الصيام",
      rows: [
        {
          feature: "متابعة الصيام",
          cells: { munib: M.fastingTracking, [MP]: cell.yes("متابعة الصلاة والصيام") },
        },
        {
          feature: "تخطيط صيام التطوع",
          cells: { munib: P.voluntaryFasting, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "الذكر والأدعية",
      rows: [
        { feature: "عدّاد التسبيح", cells: { munib: M.tasbeeh, [MP]: cell.yes() } },
        { feature: "الأذكار والأدعية", cells: { munib: M.zikr, [MP]: cell.yes("مكتبة أدعية") } },
        {
          feature: "أذكارك الخاصة",
          cells: { munib: cell.yes("مع تحويل الكلام إلى نص"), [MP]: cell.unverified() },
        },
        {
          feature: "تسبيح بدون لمس (بالصوت)",
          cells: { munib: P.handsFreeTasbeeh, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "القرآن",
      rows: [
        { feature: "الترجمات", cells: { munib: M.translations, [MP]: cell.yes() } },
        { feature: "تلوين أحكام التجويد", cells: { munib: M.tajweedColours, [MP]: cell.yes() } },
        { feature: "كلمة بكلمة", cells: { munib: M.wordByWord, [MP]: cell.unverified() } },
        {
          feature: "التفسير",
          cells: { munib: M.tafsir, [MP]: cell.partial("على شكل مقاطع Qalbox") },
        },
        {
          feature: "القرآن دون اتصال",
          cells: { munib: M.quranOffline, [MP]: cell.partial("Premium") },
        },
        { feature: "خطة قراءة للختم", cells: { munib: M.khatm, [MP]: cell.unverified() } },
        {
          feature: "التعرّف على الآية بالصوت أو النص",
          cells: { munib: M.verseDetector, [MP]: cell.unverified() },
        },
        {
          feature: "ملاحظات شخصية على الآيات",
          cells: { munib: P.ayahNotes, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "التعلّم والتلاوة",
      rows: [
        {
          feature: "تعلّم القرآن",
          cells: {
            munib: M.quranLearning,
            [MP]: cell.partial("أداة للحفظ؛ ودروس وحصص مباشرة ضمن Premium"),
          },
        },
        {
          feature: "التدرّب على التلاوة بالميكروفون",
          cells: {
            munib: M.recitation,
            [MP]: cell.unverified("غير مذكور في الصفحات الرسمية"),
          },
        },
        {
          feature: "ملاحظات على النطق كلمة بكلمة",
          cells: { munib: P.pronunciation, [MP]: cell.unverified() },
        },
        {
          feature: "كتب الحديث",
          cells: { munib: M.hadith, [MP]: cell.partial("عبر AiDeen ومقاطع Qalbox") },
        },
        {
          feature: "مكتبة منظّمة للتعلّم الإسلامي",
          cells: { munib: M.learning, [MP]: cell.partial("سلاسل مرئية في Qalbox؛ ودروس Premium") },
        },
        { feature: "حاسبة الزكاة", cells: { munib: M.zakat, [MP]: cell.unverified() } },
        {
          feature: "حاسبة المواريث",
          cells: { munib: P.mirath, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "المجتمع والإضافات",
      rows: [
        {
          feature: "مساعد للأسئلة الإسلامية بالذكاء الاصطناعي",
          cells: { munib: cell.no(), [MP]: cell.yes("AiDeen") },
        },
        { feature: "محتوى مرئي", cells: { munib: cell.no(), [MP]: cell.yes("Qalbox") } },
        {
          feature: "ميزات المجتمع والمجموعات",
          cells: { munib: P.groupKhatm, [MP]: cell.yes("مجتمع Ummah Pro، والتحديات (Quests)") },
        },
        { feature: "العائلة ووضع الأطفال", cells: { munib: P.family, [MP]: cell.unverified() } },
        {
          feature: "الإحصاءات والإنجازات",
          cells: { munib: M.achievements, [MP]: cell.yes("السلاسل والتحديات بأسلوب الألعاب") },
        },
      ],
    },
    devicesGroupAr(
      {
        [MP]: {
          web: cell.partial("صفحات لمواقيت الصلاة على الموقع"),
          ios: cell.yes("iPhone وiPad؛ وكذلك Mac وVision Pro"),
          android: cell.yes(),
          appleWatch: cell.yes("مذكور على App Store"),
          appleTv: cell.partial("Apple TV مذكور على App Store"),
          widgets: cell.partial("التسجيل من الأداة يتطلب Premium"),
        },
      },
      [
        {
          feature: "اختصارات المساعد الصوتي",
          cells: { munib: cell.yes("Siri ومساعد Google"), [MP]: cell.yes("Siri") },
        },
      ],
    ),
  ],
  strengths: {
    munib: [
      "بلا إعلانات ولا اشتراكات ولا حساب، أبدًا",
      "حاسبة مخصّصة للقضاء ومخطط بوتيرة يومية",
      "التدرّب على تلاوة القرآن على الجهاز مع مراجعة متباعدة",
      "كل ذكر يُعرض مع الحديث المصدر",
      "البحث عن المساجد، والعائلة ووضع الأطفال، والختمة الجماعية، بلا إعلانات",
      "الشيفرة المصدرية منشورة على GitHub",
    ],
    [MP]: [
      "مجموعة ميزات واسعة جدًا في تطبيق واحد",
      "قاعدة مستخدمين ضخمة وراسخة (أكثر من 100 مليون تنزيل على Google Play)",
      "مكتبة الفيديو Qalbox والمساعد الذكي AiDeen",
      "البحث عن المطاعم الحلال والمساجد، وميزات المجتمع",
      "متوفر على Apple Watch وiPad وMac وApple TV وVision Pro",
    ],
  },
  bestFor: {
    munib: "لمن يريد أداة هادئة وخاصة لمتابعة العبادة ومرافقة القرآن، بلا إعلانات ولا محتوى مدفوع.",
    [MP]: "لمن يريد تطبيقًا واحدًا لمواقيت الصلاة والقرآن والفيديو والمجتمع والخدمات المحلية.",
  },
  body: [
    { type: "h2", text: "الخصوصية: ماذا تقول ملصقات المتاجر" },
    {
      type: "p",
      text: "تطلب Apple من المطوّرين الإفصاح عن استخدام البيانات. وتُفصح صفحة Muslim Pro على App Store عن الموقع والمعرّفات ضمن خانة «Data Used to Track You». وفي نوفمبر 2020 نشر موقع Motherboard التابع لـVice تقريرًا يفيد بأن بيانات الموقع من Muslim Pro وصلت إلى وسيط بيانات مرتبط بالجيش الأمريكي؛ ووصفت Muslim Pro التقرير بأنه غير صحيح، وقالت إنها أنهت علاقاتها مع شركائها في البيانات ([تقرير Middle East Eye](https://www.middleeasteye.net/news/us-military-data-muslim-pro-apps-ties-severed)).",
    },
    {
      type: "p",
      text: "لا يحتوي Munib Tracker على إعلانات ولا على حِزم برمجية إعلانية. وفي وضع الضيف تبقى بيانات عبادتك على جهازك؛ وإذا سجّلت الدخول للمزامنة، فلا يُخزَّن إلا ما تحتاجه المزامنة. التفاصيل في [سياسة الخصوصية](/privacy).",
    },
    { type: "h2", text: "متابعة القضاء والصلاة" },
    {
      type: "p",
      text: "يتيح لك التطبيقان تسجيل الصلاة ومتابعة الصلوات الفائتة. ويضيف [متتبّع القضاء](/features/qaza-salah-tracker) في Munib Tracker حاسبة للعمر كله، وإعدادات جاهزة للوتيرة، وتاريخًا تقديريًا للانتهاء، وتنتقل إليه الصلوات الفائتة من المتابعة اليومية تلقائيًا.",
    },
    { type: "h2", text: "التدرّب على القرآن" },
    {
      type: "p",
      text: "لم نجد في الصفحات الرسمية لـMuslim Pro أي تدريب على التلاوة يعتمد على الميكروفون؛ فأداة الحفظ فيه تعتمد على تشغيل الصوت والتقييم الذاتي. أما [التدرّب على القرآن](/features/quran-practice) في Munib Tracker فيستمع إليك على جهازك ويعلِّم الكلمات التي تحتاج إلى إعادة، مجانًا.",
    },
  ],
  sources: [
    { label: "Muslim Pro — الموقع الرسمي", url: "https://www.muslimpro.com/" },
    {
      label: "Muslim Pro — صفحة Google Play",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — صفحة App Store",
      url: "https://apps.apple.com/us/app/muslim-pro-quran-athan/id388389451",
    },
    {
      label: "مساعدة Muslim Pro — اليومية / المتابعة",
      url: "https://support.muslimpro.com/help/en/articles/journal",
    },
    {
      label: "مساعدة Muslim Pro — قراءة القرآن",
      url: "https://support.muslimpro.com/hc/en-us/articles/29167995711769-Quran-Read",
    },
    {
      label: "مساعدة Muslim Pro — الحفظ",
      url: "https://support.muslimpro.com/hc/en-us/articles/29158808395289-Quran-Learn-Memorisation",
    },
    { label: "Muslim Pro — AiDeen", url: "https://www.muslimpro.com/app/askaideen" },
    {
      label: "Middle East Eye — تقرير البيانات لعام 2020",
      url: "https://www.middleeasteye.net/news/us-military-data-muslim-pro-apps-ties-severed",
    },
  ],
  faqs: [
    {
      question: "هل Munib Tracker بديل جيد لـMuslim Pro بلا إعلانات؟",
      answer:
        "إذا كنت تستخدم Muslim Pro أساسًا لمواقيت الصلاة والمتابعة والقرآن والأدعية، فإن Munib Tracker يغطي ذلك بلا إعلانات ولا اشتراك. لا يقدّم محتوى مرئيًا ولا مساعدًا بالذكاء الاصطناعي ولا أداة للبحث عن المطاعم الحلال، لكنه يتضمن البحث عن المساجد ووضع العائلة والختمة الجماعية.",
    },
    {
      question: "هل يمكنني نقل بياناتي من Muslim Pro؟",
      answer:
        "يستطيع Munib Tracker استيراد سجلات الصلاة السابقة من جدول بيانات (CSV) أو من ملف JSON. أما إمكانية التصدير من Muslim Pro بهذه الصيغة فتعود إلى Muslim Pro.",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/qaza-salah-tracker",
    "/features/quran-practice",
  ],
};
