import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

export const bestSalahTrackerAppsAr: ComparePage = {
  slug: "best-salah-tracker-apps",
  kind: "roundup",
  title: "مقارنة تطبيقات متابعة الصلاة: أيّها يناسبك؟",
  seoTitle: "أفضل تطبيقات متابعة الصلاة (2026): مقارنة متابعة الصلاة والقضاء",
  seoDescription:
    "مقارنة موثَّقة بين أشهر تطبيقات متابعة الصلاة: Munib Tracker و Muslim Pro و Athan و Pillars و FivePrayer و Just Pray و 5te5. المتابعة والقضاء والإعلانات والسعر.",
  description:
    "سبعة تطبيقات شائعة لمتابعة الصلاة جنبًا إلى جنب: تسجيل الصلاة، والقضاء، والذكر، والقرآن، والإعلانات، والسعر، وملصقات الخصوصية.",
  keywords: [
    "أفضل تطبيق لمتابعة الصلاة",
    "تطبيقات تتبع الصلاة",
    "مقارنة تطبيقات الصلاة",
    "تطبيق قضاء الصلاة",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "جولة مقارنة",
  intro: [
    "يساعدك تطبيق متابعة الصلاة على تسجيل كل صلاة من الصلوات الخمس ورؤية مدى انتظامك مع الوقت. بعض التطبيقات تقف عند هذا الحد، وبعضها يضيف متابعة الصلوات الفائتة (القضاء)، والأذكار، والقرآن، أو محتوى تعليميًا. وتختلف نماذج العمل أيضًا: فبعضها يعرض إعلانات، وبعضها يتطلب اشتراكًا، وبعضها مجاني.",
    'قارنّا بين سبعة خيارات شائعة اعتمادًا على الموقع الرسمي لكل تطبيق وصفحاته على App Store و Google Play. Munib Tracker هو تطبيقنا، لذلك حرصنا على أن يبقى الجدول واقعيًا، وأشرنا إلى الحالات التي يكون فيها تطبيق آخر هو الأنسب. وحيث لم نتمكن من التأكد من ميزة ما من مصدر رسمي، نكتب "لم يُتحقَّق منه" بدلًا من التخمين.',
  ],
  apps: [
    MUNIB,
    { id: "muslim-pro", name: "Muslim Pro", url: "https://www.muslimpro.com/" },
    { id: "athan", name: "Athan", url: "https://www.islamicfinder.org/athan/" },
    { id: "pillars", name: "Pillars", url: "https://thepillarsapp.com" },
    { id: "fiveprayer", name: "FivePrayer", url: "https://apps.apple.com/us/app/id6755536905" },
    { id: "justpray", name: "Just Pray", url: "https://apps.apple.com/us/app/id6747154163" },
    { id: "5te5", name: "5te5", url: "https://apps.apple.com/us/app/id1602490524" },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "للقضاء (الصلوات الفائتة)",
      text: "يتابع كلٌّ من Munib Tracker و Muslim Pro الصلوات الفائتة. ويضيف Munib Tracker حاسبة ومخططًا بوتيرة يومية. أما 5te5 فيقدّم القضاء في تطبيق مجاني منفصل.",
    },
    {
      title: "بلا إعلانات ولا اشتراك",
      text: "Munib Tracker و 5te5 مجانيان بلا مشتريات داخل التطبيق. أما Pillars فبلا إعلانات لكنه يبيع فئة Premium.",
    },
    {
      title: "لتعلّم الصلاة",
      text: "يتضمن Just Pray و 5te5 أدلة ومقاطع مرئية لتعلّم الصلاة. ويضم Munib Tracker دليلًا للصلاة من 24 درسًا في مكتبة التعلّم.",
    },
    {
      title: "لحجب المشتتات",
      text: "قفل التركيز للصلاة في Munib Tracker مجاني. ويستطيع Pillars (ضمن Premium) و FivePrayer أيضًا حجب التطبيقات أو قفلها وقت الصلاة.",
    },
    {
      title: "لتطبيق شامل لأسلوب الحياة",
      text: "Muslim Pro هو الأوسع نطاقًا، إذ يشمل المقاطع المرئية والمجتمع وأداة للبحث عن الحلال، مع إعلانات أو اشتراك Premium.",
    },
  ],
  table: [
    {
      group: "المتابعة",
      rows: [
        {
          feature: "تسجيل الصلاة عند أدائها",
          cells: {
            munib: M.salahLog,
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes("في وقتها أو متأخرة، مع يومية"),
            "5te5": cell.yes("تحدٍّ لبناء العادة في 40 يومًا"),
          },
        },
        {
          feature: "متابعة القضاء (الصلوات الفائتة)",
          cells: {
            munib: cell.yes("حاسبة ومخطط"),
            "muslim-pro": cell.yes(),
            athan: cell.unverified(),
            pillars: cell.partial("تعليمها بأنها مقضيّة"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.partial("تطبيق قضاء منفصل"),
          },
        },
        {
          feature: "صلوات السنة والرواتب",
          cells: {
            munib: cell.yes("متابعة الرواتب (10 أو 12)، إضافة إلى التهجد والإشراق والضحى وغيرها"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "أيام العذر (الحيض)",
          cells: {
            munib: cell.yes("الحيض والمرض والسفر"),
            "muslim-pro": cell.unverified(),
            athan: cell.yes("وضع الحيض"),
            pillars: cell.yes("وضع الحيض"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "الإحصاءات والسلاسل",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes("تقويم"),
            "5te5": cell.unverified(),
          },
        },
      ],
    },
    {
      group: "كل ما عدا ذلك",
      rows: [
        {
          feature: "مواقيت الصلاة",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes(),
            "5te5": cell.yes(),
          },
        },
        {
          feature: "الذكر والتسبيح",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.partial("على Apple Watch، ضمن Premium"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "قارئ القرآن",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.no(),
            fiveprayer: cell.yes(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "دليل لتعلّم الصلاة",
          cells: {
            munib: cell.yes("دليل الصلاة"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.partial("مقالات"),
            justpray: cell.yes(),
            "5te5": cell.yes("مقاطع مرئية"),
          },
        },
        {
          feature: "التدرّب على تلاوة القرآن (عبر الميكروفون)",
          cells: {
            munib: cell.yes("على الجهاز"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
      ],
    },
    {
      group: "التركيز والمكان والناس",
      rows: [
        {
          feature: "حجب التطبيقات وقت الصلاة",
          cells: {
            munib: P.focusLock,
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.yes("PrayFirst، ضمن Premium"),
            fiveprayer: cell.yes("قفل التطبيقات أثناء الصلاة"),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "البحث عن المساجد",
          cells: {
            munib: P.masjidFinder,
            "muslim-pro": cell.yes(),
            athan: cell.unverified(),
            pillars: cell.partial("أوقات المساجد في مرحلة تجريبية"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "الصلاة مع الأصدقاء",
          cells: {
            munib: P.partner,
            "muslim-pro": cell.partial("ميزات مجتمعية"),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.yes("دوائر صلاة"),
            justpray: cell.yes("دوائر صلاة"),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "العائلة ووضع الأطفال",
          cells: {
            munib: P.family,
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
      ],
    },
    {
      group: "السعر والخصوصية",
      rows: [
        {
          feature: "الإعلانات",
          cells: {
            munib: cell.text("لا"),
            "muslim-pro": cell.text("نعم، في النسخة المجانية"),
            athan: cell.text("نعم، في النسخة المجانية"),
            pillars: cell.text("لا"),
            fiveprayer: cell.text("يذكر أنه بلا إعلانات"),
            justpray: cell.text("لا يحمل وسم «Contains ads» على Google Play"),
            "5te5": cell.text("لا"),
          },
        },
        {
          feature: "فئة مدفوعة",
          cells: {
            munib: cell.text("لا يوجد"),
            "muslim-pro": cell.text("Premium"),
            athan: cell.text("Premium / إزالة الإعلانات"),
            pillars: cell.text("Premium"),
            fiveprayer: cell.text("Pro"),
            justpray: cell.text("Pro"),
            "5te5": cell.text("لا يوجد"),
          },
        },
        {
          feature: "خانة «Data Used to Track You» على App Store",
          cells: {
            munib: cell.text("بلا حِزم إعلانية"),
            "muslim-pro": cell.text("الموقع، والمعرّفات"),
            athan: cell.text("معلومات الاتصال"),
            pillars: cell.text("لم يُصرَّح بشيء"),
            fiveprayer: cell.text("المعرّفات"),
            justpray: cell.text("الموقع، والمعرّفات، وبيانات الاستخدام"),
            "5te5": cell.text("لم يُصرَّح بشيء"),
          },
        },
      ],
    },
    devicesGroupAr({
      "muslim-pro": {
        web: cell.partial("صفحات مواقيت الصلاة على الموقع"),
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: cell.yes("مذكور في صفحته على App Store"),
        appleTv: cell.partial("مذكور في صفحته على App Store"),
        widgets: cell.partial("التسجيل يتطلب Premium"),
      },
      athan: {
        ios: cell.partial("iPhone؛ ولا نسخة مذكورة لـiPad"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes(),
      },
      pillars: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: cell.yes("ضمن Premium"),
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes(),
      },
      fiveprayer: { ios: cell.yes("على App Store"), android: cell.yes() },
      justpray: { ios: cell.yes("على App Store"), android: cell.yes() },
      "5te5": { ios: cell.yes("على App Store"), android: cell.yes() },
    }),
  ],
  strengths: {
    munib: [
      "حاسبة القضاء ومخططه",
      "التدرّب على التلاوة",
      "بلا إعلانات ولا فئة مدفوعة",
      "الويب والتلفاز و Apple Watch و Wear OS",
    ],
    "muslim-pro": [
      "أوسع مجموعة من الميزات",
      "مقاطع مرئية، ومجتمع، وأداة للبحث عن الحلال",
      "أكبر قاعدة مستخدمين",
    ],
    athan: ["مواقيت صلاة عريقة", "أهداف يومية وسلاسل", "وضع الحيض"],
    pillars: ["بلا إعلانات ودون حساب", "حجب التطبيقات ومنبّه الفجر (ضمن Premium)", "تصميم نظيف"],
    fiveprayer: ["قفل التطبيقات أثناء الصلاة", "دوائر صلاة مع الأصدقاء", "قارئ للقرآن"],
    justpray: ["أدلة مصوّرة لتعلّم الصلاة", "دوائر صلاة", "منبّه الفجر"],
    "5te5": [
      "مجاني تمامًا وغير ربحي",
      "تحدٍّ للمبتدئين في 40 يومًا",
      "لا يجمع أي بيانات (بحسب Google Play)",
    ],
  },
  bestFor: {
    munib: "متابعة مجانية وخاصة للصلاة والقضاء والذكر، مع القرآن والتعلّم في التطبيق نفسه.",
    "muslim-pro": "تطبيق واحد لكل شيء، بما في ذلك المقاطع المرئية والمجتمع.",
    athan: "مواقيت صلاة موثوقة مع تسجيل بسيط.",
    pillars: "تطبيق صلاة بسيط مع أدوات للتركيز.",
    fiveprayer: "أداء الصلاة في وقتها مع الأصدقاء وقفل التطبيقات.",
    justpray: "المتعلّمون الجدد الذين يريدون إرشادًا مصوّرًا.",
    "5te5": "المبتدئون الذين يبنون العادة، مجانًا تمامًا.",
  },
  body: [
    { type: "h2", text: "كيف تختار تطبيقًا لمتابعة الصلاة" },
    {
      type: "ul",
      items: [
        "**هل عليك صلوات فائتة تريد قضاءها؟** اختر تطبيقًا يتابع القضاء متابعة حقيقية. اقرأ [ما هي صلاة القضاء](/resources/salah/what-is-qaza-salah).",
        "**هل تزعجك الإعلانات؟** الإعلانات في تطبيق للعبادة تشتّت كثيرًا من الناس؛ تحقّق من وسم «Contains ads» على متجر Google Play.",
        "**ماذا يقول ملصق الخصوصية؟** على App Store، ابحث عن خانة «Data Used to Track You».",
        "**هل تريد أكثر من المتابعة؟** إن كنت تريد أيضًا الأذكار والقرآن، فالتطبيق الشامل يغنيك عن التنقل بين التطبيقات.",
        "**هل ستواظب على استخدامه؟** أفضل تطبيق للمتابعة هو الذي تفتحه كل يوم. جرّب تطبيقين، كل واحد منهما لمدة أسبوع.",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "كيف تحقّقنا",
      text: "كل قيمة مأخوذة من الموقع الرسمي للتطبيق أو صفحته على App Store أو Google Play (المتاجر الأمريكية)، وقد راجعناها في التاريخ المذكور. تتغيّر الميزات كثيرًا، فراجع صفحات المتاجر قبل أن تقرّر. هل لاحظت معلومة قديمة؟ [أخبرنا](/contact) وسنصحّحها.",
    },
  ],
  sources: [
    {
      label: "Muslim Pro — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — App Store",
      url: "https://apps.apple.com/us/app/muslim-pro-quran-athan/id388389451",
    },
    {
      label: "Athan — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — App Store",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
    { label: "Pillars — الموقع الرسمي (/ai)", url: "https://thepillarsapp.com/ai" },
    { label: "Pillars — App Store", url: "https://apps.apple.com/us/app/id1559086853" },
    { label: "FivePrayer — App Store", url: "https://apps.apple.com/us/app/id6755536905" },
    {
      label: "FivePrayer — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.fiveprayer.app",
    },
    { label: "Just Pray — App Store", url: "https://apps.apple.com/us/app/id6747154163" },
    {
      label: "Just Pray — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.justprayapp.justpray",
    },
    { label: "5te5 Prayer Tracker — App Store", url: "https://apps.apple.com/us/app/id1602490524" },
    {
      label: "5te5 Prayer Tracker — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.sozlerkosku.beste5v2",
    },
    { label: "5te5 Qadha Tracker — App Store", url: "https://apps.apple.com/us/app/id6751702091" },
  ],
  faqs: [
    {
      question: "ما أفضل تطبيق لمتابعة الصلاة؟",
      answer:
        "يعتمد ذلك على ما تحتاجه. إن كانت عليك صلوات فائتة تريد قضاءها، فاختر تطبيقًا يتابع القضاء متابعة حقيقية. وإن أردت كل شيء في مكان واحد، فـMuslim Pro هو الأوسع. وإن أردت تطبيقًا بلا إعلانات ولا اشتراك، فـMunib Tracker و 5te5 كلاهما مجاني.",
    },
    {
      question: "هل يوجد تطبيق مجاني لمتابعة الصلاة بلا إعلانات؟",
      answer:
        "نعم. Munib Tracker و 5te5 بلا إعلانات ولا مشتريات داخل التطبيق. أما Pillars فبلا إعلانات ويقدّم فئة Premium اختيارية.",
    },
  ],
  related: [
    "/features/salah-tracker",
    "/features/qaza-salah-tracker",
    "/compare/islamic-habit-tracker-apps",
  ],
};
