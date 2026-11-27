import { cell, MUNIB } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const QC = "quran-com";
const PL = "pillars";
const AT = "athan";
const MP = "muslim-pro";
const I3 = "islam360";
const TA = "tarteel";

/** The Quran.com app is a Qur'an reader; its listings describe nothing else. */
const NOT_IN_LISTINGS = cell.unverified("غير مذكور في صفحاته على المتاجر");

export const bestFreeIslamicAppsAr: ComparePage = {
  slug: "best-free-islamic-apps",
  kind: "roundup",
  title: "أفضل التطبيقات الإسلامية المجانية: ماذا تعني «مجاني» في كل تطبيق؟",
  seoTitle: "أفضل التطبيقات الإسلامية المجانية (2026): بلا إعلانات ولا اشتراك",
  seoDescription:
    "مقارنة موثَّقة بين تطبيقات إسلامية مجانية: Munib Tracker و Quran.com و Pillars و Athan و Muslim Pro و Islam360 و Tarteel. الإعلانات والاشتراكات والحسابات والخصوصية.",
  description:
    "سبعة تطبيقات إسلامية يمكنك تنزيلها مجانًا، وما الذي تشمله كلمة «مجاني» في كل منها: الإعلانات، والفئات المدفوعة، والحسابات، وملصقات الخصوصية، والميزات.",
  keywords: [
    "أفضل التطبيقات الإسلامية المجانية",
    "تطبيق إسلامي مجاني بدون إعلانات",
    "تطبيقات إسلامية بدون اشتراك",
    "تطبيقات إسلامية بلا مشتريات داخل التطبيق",
  ],
  cluster: "comparison",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "جولة مقارنة",
  intro: [
    "تكاد كل التطبيقات الإسلامية تكون مجانية التنزيل، لكن كلمة «مجاني» تحمل معاني مختلفة جدًا. فبعض التطبيقات مجاني وليس فيه ما يُشترى. وبعضها بلا إعلانات لكنه يُبقي ميزات معيّنة لفئة مدفوعة. وبعضها مجاني لأنه يعرض إعلانات، مع اشتراك لإزالتها.",
    'قارنّا بين سبعة تطبيقات معروفة اعتمادًا على الموقع الرسمي لكل تطبيق وصفحاته على App Store و Google Play. Munib Tracker هو تطبيقنا، لذلك حرصنا على أن يبقى الجدول واقعيًا، وذكرنا بوضوح الحالات التي يكون فيها تطبيق آخر هو الخيار المجاني الأفضل. وحيث لم نتمكن من التأكد من أمر ما من مصدر رسمي، نكتب "لم يُتحقَّق منه" بدلًا من التخمين.',
  ],
  apps: [
    MUNIB,
    {
      id: QC,
      name: "Quran (by Quran.com)",
      developer: "Quran Foundation, Inc",
      url: "https://quran.com/apps",
    },
    { id: PL, name: "Pillars", url: "https://thepillarsapp.com" },
    { id: AT, name: "Athan", url: "https://www.islamicfinder.org/athan/" },
    { id: MP, name: "Muslim Pro", url: "https://www.muslimpro.com/" },
    { id: I3, name: "Islam360", url: "https://www.theislam360.com/" },
    { id: TA, name: "Tarteel", url: "https://tarteel.ai" },
  ],
  verifiedOn: "2026-11-27",
  summary: [
    {
      title: "مجاني وليس فيه ما يُشترى",
      text: "Munib Tracker وتطبيق Quran.com بلا إعلانات ولا مشتريات داخل التطبيق. يشمل Munib Tracker الصلاة والقضاء والذكر والقرآن والتعلّم؛ أما تطبيق Quran.com فقارئ للقرآن.",
    },
    {
      title: "إن كنت تريد قراءة القرآن فقط",
      text: "تطبيق Quran.com هو الخيار المجاني الأبسط: مصحف مركَّز بلا إعلانات من جهة غير ربحية، وشيفرته مفتوحة المصدر.",
    },
    {
      title: "بلا إعلانات، مع فئة مدفوعة",
      text: "لا يعرض Pillars ولا Tarteel إعلانات. وكلاهما يُبقي بعض الميزات ضمن Premium: الأذان الكامل وحجب التطبيقات وتطبيق Apple Watch في Pillars؛ وكشف الأخطاء في Tarteel.",
    },
    {
      title: "مجاني مع إعلانات",
      text: "Athan و Muslim Pro و Islam360 مجانية مع إعلانات وتبيع اشتراكًا. واشتراك Premium في Athan هو الأقل سعرًا معلنًا بين الثلاثة.",
    },
    {
      title: "للحديث والتفسير بالأردية",
      text: "Islam360 هو الخيار المجاني الأفضل لدراسة القرآن والحديث بعمق باللغة الأردية، إن لم تزعجك الإعلانات.",
    },
  ],
  table: [
    {
      group: "ما الذي تشمله كلمة «مجاني»",
      rows: [
        {
          feature: "السعر والمشتريات داخل التطبيق",
          cells: {
            munib: M.price,
            [QC]: cell.text("مجاني؛ ولا مشتريات داخل التطبيق في صفحته على App Store"),
            [PL]: cell.text(
              "الأساسيات مجانية؛ وPremium يبدأ من 11.99$ شهريًا أو 49.99$ سنويًا في الولايات المتحدة",
            ),
            [AT]: cell.text(
              "مجاني مع إعلانات؛ وAthan Premium (1.99$ شهريًا أو 11.99$ سنويًا في الولايات المتحدة) أو إزالة الإعلانات بدفعة واحدة",
            ),
            [MP]: cell.text(
              "مجاني مع إعلانات؛ واشتراك Premium (12.99$ شهريًا أو 34.99$ سنويًا في الولايات المتحدة)",
            ),
            [I3]: cell.text(
              "مجاني مع إعلانات؛ واشتراك لإزالة الإعلانات (9.99$ شهريًا أو 49.99$ سنويًا في الولايات المتحدة)",
            ),
            [TA]: cell.text(
              "الأساسيات مجانية؛ واشتراك Premium (يبدأ من 12.99$ شهريًا على App Store الأمريكي)",
            ),
          },
        },
        {
          feature: "الإعلانات",
          cells: {
            munib: M.ads,
            [QC]: cell.text("بلا إعلانات (تصفه صفحته بأنه «ad-free»)"),
            [PL]: cell.text("بلا إعلانات"),
            [AT]: cell.text("نعم (على Google Play: «Contains ads»)"),
            [MP]: cell.text("نعم (على Google Play: «Contains ads»)"),
            [I3]: cell.text("نعم (على Google Play: «Contains ads»)"),
            [TA]: cell.text("بلا إعلانات"),
          },
        },
        {
          feature: "الحاجة إلى حساب",
          cells: {
            munib: M.account,
            [QC]: cell.unverified(),
            [PL]: cell.text("غير مطلوب (بلا تسجيل)"),
            [AT]: cell.unverified(),
            [MP]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "خانة «Data Used to Track You» على App Store",
          cells: {
            munib: cell.text("بلا حِزم إعلانية؛ وبيانات وضع الضيف تبقى على الجهاز"),
            [QC]: cell.text("لم يُصرَّح بشيء"),
            [PL]: cell.text("لم يُصرَّح بشيء"),
            [AT]: cell.text("معلومات الاتصال"),
            [MP]: cell.text("الموقع، والمعرّفات"),
            [I3]: cell.text("المعرّفات"),
            [TA]: cell.text("لم يُصرَّح بشيء"),
          },
        },
        {
          feature: "الشيفرة المصدرية متاحة للعموم",
          cells: {
            munib: M.openSource,
            [QC]: cell.yes("مفتوح المصدر على GitHub؛ وتطبيق Android بترخيص GPL-3.0"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [MP]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "الميزات الأساسية",
      rows: [
        {
          feature: "مواقيت الصلاة والأذان",
          cells: {
            munib: M.times,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes("الأذان الكامل ضمن Premium"),
            [AT]: cell.yes(),
            [MP]: cell.yes(),
            [I3]: cell.yes(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "القبلة",
          cells: {
            munib: M.qibla,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes(),
            [AT]: cell.yes(),
            [MP]: cell.yes(),
            [I3]: cell.yes(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "متابعة الصلاة",
          cells: {
            munib: M.salahLog,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes("متابعة مجانية"),
            [AT]: cell.yes("سجل يومي وسلاسل"),
            [MP]: cell.yes("متابعة الصلاة والصيام مع السلاسل"),
            [I3]: cell.unverified("يذكر الموقع «Salah Tracker»؛ ولا تصف صفحات المتاجر التسجيل"),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "متابعة القضاء (الصلوات الفائتة)",
          cells: {
            munib: M.qaza,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.partial("تعليم الصلاة بأنها متأخرة/مقضيّة؛ وعدّاد لقضاء الصيام"),
            [AT]: cell.unverified("غير مذكورة في صفحات المتاجر"),
            [MP]: cell.yes("متابعة العبادات تسجّل الصلوات والصيام الفائت"),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "قارئ القرآن",
          cells: {
            munib: M.quranReader,
            [QC]: cell.yes("صفحات المصحف، وقرّاء، وترجمات قابلة للتنزيل"),
            [PL]: cell.no("بحسب مدوّنة Pillars نفسها"),
            [AT]: cell.yes("ترجمات بأكثر من 45 لغة"),
            [MP]: cell.yes("القرآن دون اتصال يتطلب Premium"),
            [I3]: cell.yes("أكثر من 21 ترجمة، وأكثر من 16 تفسيرًا"),
            [TA]: cell.yes("152 ترجمة بـ76 لغة"),
          },
        },
        {
          feature: "التدرّب على تلاوة القرآن (عبر الميكروفون)",
          cells: {
            munib: M.recitation,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [MP]: cell.unverified("غير مذكور في الصفحات الرسمية"),
            [I3]: cell.unverified("البحث الصوتي فقط"),
            [TA]: cell.yes("يتابع تلاوتك مجانًا؛ وكشف الأخطاء يتطلب Premium"),
          },
        },
        {
          feature: "الذكر والأدعية",
          cells: {
            munib: M.zikr,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.partial("التسبيح على Apple Watch فقط، ضمن Premium"),
            [AT]: cell.yes("عدّاد تسبيح، وأذكار مع الصوت"),
            [MP]: cell.yes("عدّاد تسبيح ومكتبة أدعية"),
            [I3]: cell.yes("مع مراجع الأحاديث"),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "مجموعات الحديث",
          cells: {
            munib: M.hadith,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified("قسم للحديث على موقع IslamicFinder"),
            [MP]: cell.partial("عبر AiDeen ومقاطع Qalbox"),
            [I3]: cell.yes("الكتب السبعة الأساسية وغيرها"),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "مكتبة للتعلّم الإسلامي",
          cells: {
            munib: M.learning,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified("تطبيق Athan Academy منفصل"),
            [MP]: cell.partial("سلاسل مرئية في Qalbox؛ ودروس Premium"),
            [I3]: cell.partial("دورات و«Fahm-ul-Quran»"),
            [TA]: cell.unverified("لم نجد دروسًا في التجويد أو القاعدة"),
          },
        },
      ],
    },
    devicesGroupAr({
      [QC]: {
        web: cell.partial("موقع Quran.com"),
        ios: cell.yes("iPhone وiPad؛ وكذلك Mac وVision Pro"),
        android: cell.yes("Quran for Android"),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
      },
      [PL]: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: cell.yes("ضمن Premium"),
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes("مجانًا"),
      },
      [AT]: {
        web: cell.partial("موقع IslamicFinder"),
        ios: cell.partial("iPhone؛ ولا نسخة لـiPad في صفحته على App Store"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes(),
      },
      [MP]: {
        web: cell.partial("صفحات لمواقيت الصلاة على الموقع"),
        ios: cell.yes("iPhone وiPad؛ وكذلك Mac وVision Pro"),
        android: cell.yes(),
        appleWatch: cell.yes("مذكور على App Store"),
        appleTv: cell.partial("Apple TV مذكور على App Store"),
        widgets: cell.partial("التسجيل من الأداة يتطلب Premium"),
      },
      [I3]: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes("ومتوفر أيضًا على Huawei AppGallery"),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes("أدوات لمواقيت الصلاة والمتابعة والتسبيح والآيات على iPhone"),
      },
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
      "مجاني، بلا إعلانات ولا اشتراكات ولا مشتريات داخل التطبيق",
      "لا حاجة إلى حساب (وضع الضيف)",
      "الصلاة والقضاء والذكر والقرآن والحديث والتعلّم في تطبيق واحد",
      "الويب والتلفاز و Apple Watch و Wear OS",
      "الشيفرة المصدرية متاحة على GitHub (ترخيص غير تجاري)",
    ],
    [QC]: [
      "مجاني وبلا إعلانات، ولا مشتريات مذكورة داخل التطبيق",
      "شيفرة مفتوحة المصدر، وتديره جهة غير ربحية",
      "مصحف مركَّز مع قرّاء وترجمات",
    ],
    [PL]: [
      "بلا إعلانات ودون حساب",
      "متابعة مجانية للصلاة وأدوات للشاشة الرئيسية",
      "حجب التطبيقات ومنبّه ذكي للفجر (ضمن Premium)",
    ],
    [AT]: ["مواقيت صلاة وأذان عريقة", "سجل يومي وأهداف وسلاسل", "خيار Premium منخفض التكلفة"],
    [MP]: [
      "مجموعة واسعة جدًا من الميزات في تطبيق واحد",
      "يتابع الصلوات والصيام الفائت",
      "مكتبة Qalbox المرئية ومساعد AiDeen الذكي",
    ],
    [I3]: [
      "مكتبة حديث كبيرة مع درجات الأحاديث والتخريج",
      "ترجمات وتفاسير أردية كثيرة لعلماء مسمَّين",
      "دروس في القاعدة مع الصوت",
    ],
    [TA]: [
      "يتابع تلاوتك مجانًا",
      "مكتبة قرآنية مجانية كبيرة جدًا: ترجمات وتفاسير وقرّاء",
      "بلا إعلانات",
    ],
  },
  bestFor: {
    munib: "تطبيق مجاني واحد للصلاة والقضاء والذكر والقرآن والتعلّم، وليس فيه ما يُشترى.",
    [QC]: "قراءة القرآن والاستماع إليه في تطبيق مركَّز بلا إعلانات ومفتوح المصدر.",
    [PL]: "تطبيق صلاة بسيط بلا إعلانات، إن كانت الأساسيات المجانية تكفيك.",
    [AT]: "مواقيت صلاة موثوقة مع تسجيل بسيط، إن لم تزعجك الإعلانات.",
    [MP]: "تطبيق واحد لكل شيء تقريبًا، مع إعلانات أو اشتراك Premium.",
    [I3]: "دراسة القرآن والحديث بعمق باللغة الأردية، مع إعلانات أو اشتراك.",
    [TA]: "الحفّاظ الذين يريدون ذكاءً اصطناعيًا يتابع تلاوتهم وقد يشتركون لاحقًا.",
  },
  body: [
    { type: "h2", text: "أربعة أنواع من «المجاني»" },
    {
      type: "ul",
      items: [
        "**مجاني وليس فيه ما يُشترى.** بلا إعلانات ولا اشتراك ولا مشتريات داخل التطبيق. هكذا يعمل Munib Tracker وتطبيق Quran.com.",
        "**أساسيات مجانية وإضافات مدفوعة.** بلا إعلانات، لكن بعض الميزات تتطلب فئة مدفوعة. هكذا يعمل Pillars و Tarteel.",
        "**مجاني مع إعلانات.** يُموَّل التطبيق بالإعلانات، ويزيلها اشتراك أو دفعة واحدة. هكذا يعمل Athan و Muslim Pro و Islam360.",
        "**مجاني، لكن مقابل حساب أو بيانات.** تحقّق هل يلزمك التسجيل، واقرأ ملصق الخصوصية على App Store قبل التثبيت.",
      ],
    },
    { type: "h2", text: "كيف تتحقّق من أي تطبيق بنفسك" },
    {
      type: "ul",
      items: [
        "**الإعلانات:** على Google Play، ابحث عن وسم «Contains ads» تحت اسم التطبيق.",
        "**المشتريات:** على App Store، افتح قسم «In-App Purchases» لترى ما يُباع وبأي سعر.",
        "**التتبّع:** على App Store، ابحث عن خانة «Data Used to Track You» في قسم App Privacy.",
        "**الشيفرة المصدرية:** التطبيق الذي شيفرته متاحة للعموم يستطيع أي شخص فحصه. [الشيفرة المصدرية لـMunib Tracker متاحة للعموم](/open-source) بترخيص غير تجاري، وتوضّح [سياسة الخصوصية](/privacy) ما الذي يبقى على جهازك.",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "كيف تحقّقنا",
      text: "كل قيمة مأخوذة من الموقع الرسمي للتطبيق أو صفحته على App Store أو Google Play (المتاجر الأمريكية)، وقد راجعناها في التاريخ المذكور. تتغيّر الأسعار والميزات كثيرًا، فراجع صفحات المتاجر قبل أن تقرّر. هل لاحظت معلومة قديمة؟ [أخبرنا](/contact) وسنصحّحها.",
    },
  ],
  sources: [
    {
      label: "Quran (by Quran.com) — App Store",
      url: "https://apps.apple.com/us/app/quran-by-quran-com-%D9%82%D8%B1%D8%A2%D9%86/id1118663303",
    },
    {
      label: "Quran for Android — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.quran.labs.androidquran",
    },
    { label: "Quran.com — التطبيقات", url: "https://quran.com/apps" },
    { label: "Quran.com — من نحن", url: "https://quran.com/about-us" },
    {
      label: "Quran for Android — الشيفرة المصدرية",
      url: "https://github.com/quran/quran_android",
    },
    { label: "Quran for iOS — الشيفرة المصدرية", url: "https://github.com/quran/quran-ios" },
    { label: "Pillars — الموقع الرسمي (/ai)", url: "https://thepillarsapp.com/ai" },
    {
      label: "مدوّنة Pillars — أفضل تطبيقات رمضان",
      url: "https://thepillarsapp.com/blog/best-ramadan-apps",
    },
    { label: "Pillars — App Store", url: "https://apps.apple.com/us/app/id1559086853" },
    {
      label: "Pillars — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.pillars.pillars",
    },
    { label: "Athan — موقع IslamicFinder", url: "https://www.islamicfinder.org/athan/" },
    {
      label: "Athan — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — App Store",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
    { label: "Muslim Pro — الموقع الرسمي", url: "https://www.muslimpro.com/" },
    {
      label: "Muslim Pro — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — App Store",
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
    { label: "Muslim Pro — AiDeen", url: "https://www.muslimpro.com/app/askaideen" },
    { label: "Islam360 — الموقع الرسمي", url: "https://www.theislam360.com/" },
    { label: "Islam360 — الميزات", url: "https://www.theislam360.com/features" },
    { label: "Islam360 — تعلّم القرآن", url: "https://www.theislam360.com/learn-quran" },
    {
      label: "Islam360 — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.islam360",
    },
    {
      label: "Islam360 — App Store",
      url: "https://apps.apple.com/us/app/islam360-quran-hadith-qibla/id1006098149",
    },
    { label: "Tarteel — الموقع الرسمي", url: "https://tarteel.ai" },
    {
      label: "مساعدة Tarteel — هل يمكنني استخدام Tarteel مجانًا؟",
      url: "https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free",
    },
    { label: "Tarteel — App Store", url: "https://apps.apple.com/us/app/id1391009396" },
    {
      label: "Tarteel — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.mmmoussa.iqra",
    },
  ],
  faqs: [
    {
      question: "ما التطبيق الإسلامي الذي لا يعرض إعلانات؟",
      answer:
        "لا يعرض Munib Tracker ولا تطبيق Quran.com ولا Pillars ولا Tarteel إعلانات. ومن بينها، Munib Tracker وتطبيق Quran.com بلا مشتريات داخل التطبيق أيضًا، أما Pillars و Tarteel فيبيعان فئة Premium. ويعرض Athan و Muslim Pro و Islam360 إعلانات في نسخها المجانية.",
    },
    {
      question: "ما التطبيقات الإسلامية المجانية تمامًا بلا اشتراك؟",
      answer:
        "Munib Tracker وتطبيق Quran.com مجانيان بلا اشتراك ولا مشتريات داخل التطبيق. يشمل Munib Tracker الصلاة والقضاء والذكر والقرآن والحديث والتعلّم؛ أما تطبيق Quran.com فقارئ للقرآن. والتطبيقات الخمسة الأخرى في هذه المقارنة مجانية التنزيل وتبيع فئة مدفوعة.",
    },
    {
      question: "هل Muslim Pro مجاني؟",
      answer:
        "نعم، Muslim Pro مجاني التنزيل والاستخدام مع إعلانات. ويبيع أيضًا اشتراك Premium بسعر معلن قدره 12.99$ شهريًا أو 34.99$ سنويًا في الولايات المتحدة، وبعض الميزات مثل القرآن دون اتصال تتطلب Premium. راجع [Munib Tracker أم Muslim Pro](/compare/munib-tracker-vs-muslim-pro) للمقارنة الكاملة.",
    },
    {
      question: "هل يوجد تطبيق إسلامي مجاني يعمل بلا حساب؟",
      answer:
        "نعم. يعمل Munib Tracker في وضع الضيف بلا حساب، وتسجيل الدخول اختياري إن أردت المزامنة. ويذكر Pillars كذلك أنه لا يتطلب تسجيلًا. ولم نتمكن من التأكد من المصادر الرسمية هل تتطلب التطبيقات الأخرى هنا حسابًا للاستخدام الأساسي.",
    },
    {
      question: "ما التطبيقات الإسلامية المجانية المفتوحة المصدر؟",
      answer:
        "تطبيقات Quran.com مفتوحة المصدر: شيفرتها على GitHub، وتطبيق Android بترخيص GPL-3.0. أما [الشيفرة المصدرية لـMunib Tracker فمتاحة للعموم على GitHub](/open-source) بترخيص PolyForm Noncommercial، الذي يتيح لأي شخص قراءتها لكنه لا يسمح بالاستخدام التجاري. ولم نتمكن من التأكد من وجود شيفرة مصدرية متاحة للعموم للتطبيقات الأخرى.",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/compare/islamic-habit-tracker-apps",
    "/why-munib-tracker",
    "/open-source",
    "/download",
  ],
};
