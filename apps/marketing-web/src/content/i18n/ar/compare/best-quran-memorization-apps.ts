import { cell, MUNIB } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const TA = "tarteel";
const QC = "quran-com";
const MQ = "memorize-quran";
const HA = "haafidh";

export const bestQuranMemorizationAppsAr: ComparePage = {
  slug: "best-quran-memorization-apps",
  kind: "roundup",
  title: "مقارنة تطبيقات حفظ القرآن: الحفظ والمراجعة والتدرّب على التلاوة",
  seoTitle: "أفضل تطبيقات حفظ القرآن (2026): مقارنة الحفظ والمراجعة",
  seoDescription:
    "مقارنة موثَّقة بين تطبيقات حفظ القرآن: Munib Tracker و Tarteel و Quran by Quran.com و Memorize Quran و Haafidh. السعر والإعلانات والميزات.",
  description:
    "خمسة تطبيقات لحفظ القرآن ومراجعته جنبًا إلى جنب: الاستماع إلى التلاوة، وأوضاع الإخفاء، والمراجعة المتباعدة، والقرّاء، والسعر، والإعلانات.",
  keywords: [
    "أفضل تطبيقات حفظ القرآن",
    "تطبيق حفظ القرآن",
    "تطبيق مراجعة القرآن",
    "برنامج لحفظ القرآن الكريم",
    "مقارنة تطبيقات تحفيظ القرآن",
  ],
  cluster: "comparison",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "جولة مقارنة",
  intro: [
    "تساعد التطبيقات على حفظ القرآن بطرق مختلفة. فبعضها يستمع إليك وأنت تتلو وينبّهك إلى الأخطاء. وبعضها يكرّر تلاوة القارئ حتى تثبت الآية في ذهنك. وبعضها يخفي النص لتختبر نفسك، أو يضع جدولًا يعيد إليك ما حفظته لتراجعه قبل أن يتفلّت.",
    'قارنّا بين خمسة تطبيقات اعتمادًا على صفحة كل تطبيق على App Store و Google Play وموقعه الرسمي. Munib Tracker هو تطبيقنا، لذلك حرصنا على أن يبقى الجدول واقعيًا، وذكرنا بوضوح المواضع التي يتفوّق فيها تطبيق آخر. وحيث لم نتمكن من التأكد من ميزة ما من مصدر رسمي، نكتب "لم يُتحقَّق منه" بدلًا من التخمين. ولا يغني أي تطبيق عن التلاوة على معلّم مؤهَّل.',
  ],
  apps: [
    MUNIB,
    { id: TA, name: "Tarteel", developer: "Tarteel Inc.", url: "https://tarteel.ai" },
    {
      id: QC,
      name: "Quran by Quran.com",
      developer: "Quran Foundation, Inc",
      url: "https://apps.apple.com/us/app/id1118663303",
    },
    {
      id: MQ,
      name: "Memorize Quran",
      developer: "Shoaib Khan",
      url: "https://apps.apple.com/us/app/memorize-quran/id1326501581",
    },
    {
      id: HA,
      name: "Haafidh",
      developer: "Vaan Corporation",
      url: "https://apps.apple.com/us/app/haafidh/id1571078630",
    },
  ],
  verifiedOn: "2026-11-27",
  summary: [
    {
      title: "لأدقّ كشف للأخطاء",
      text: "Tarteel. فكشف الأخطاء هو منتجه الأساسي: تنبّه خطة Premium فيه إلى الكلمات الساقطة والخاطئة والزائدة وأخطاء التشكيل أثناء تلاوتك.",
    },
    {
      title: "لتدرّب مجاني يبقى على جهازك",
      text: "يتابع Munib Tracker تلاوتك على الجهاز ويعلِّم الكلمات التي تحتاج إلى إعادة، مع أوضاع الإخفاء والمراجعة المتباعدة. وهو أبسط من Tarteel، ولا يمنح درجات ولا يقيّم التجويد.",
    },
    {
      title: "لمصحف مجاني بلا إعلانات مع تكرار الصوت",
      text: "Quran by Quran.com تطبيق قراءة مجاني بلا إعلانات، فيه أكثر من 15 تلاوة وتكرار للصوت قابل للتخصيص لمن يحفظ بالاستماع.",
    },
    {
      title: "لجدول مراجعة فقط",
      text: "يتابع Haafidh المقاطع التي حفظتها ويذكّرك بمراجعتها على فترات متباعدة. وهو مجاني بلا إعلانات، ومصمَّم ليُستخدم إلى جانب مصحفك أو تطبيق آخر.",
    },
    {
      title: "للحفظ بالتكرار",
      text: "يؤتمت Memorize Quran التكرار بوضع IntelliJ Mode (باشتراك بعد تجربة مدتها 15 يومًا).",
    },
  ],
  table: [
    {
      group: "التلاوة والملاحظات",
      rows: [
        {
          feature: "يستمع إلى تلاوتك (عبر الميكروفون)",
          cells: {
            munib: M.recitation,
            [TA]: cell.yes("مجاني"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified("تصفه صفحته بأنه متتبّع للمراجعة"),
          },
        },
        {
          feature: "كشف الأخطاء",
          cells: {
            munib: M.mistakeMarks,
            [TA]: cell.yes("ضمن Premium: الكلمات الساقطة والخاطئة والزائدة وأخطاء التشكيل"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "ملاحظات على النطق كلمة بكلمة",
          cells: {
            munib: P.pronunciation,
            [TA]: cell.partial("أخطاء التشكيل ضمن كشف الأخطاء في Premium"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "ملاحظات على التجويد في تلاوتك",
          cells: {
            munib: P.tajweedCoaching,
            [TA]: cell.no("«لا يكشف أخطاء التجويد بعد»"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "أين يُعالَج الصوت",
          cells: {
            munib: cell.text("على جهازك؛ لا يُسجَّل ولا يُرفع أبدًا"),
            [TA]: cell.text(
              "يحتاج إلى اتصال ثابت بالإنترنت؛ ويذكر ملصق App Store جمع بيانات صوتية",
            ),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "الحفظ والمراجعة",
      rows: [
        {
          feature: "إخفاء الكلمات أو الآيات لتختبر نفسك",
          cells: {
            munib: cell.yes("مجاني"),
            [TA]: cell.yes("Premium"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "المراجعة المتباعدة",
          cells: {
            munib: M.memorization,
            [TA]: cell.partial("تخطيط الأهداف والسجل، ضمن Premium"),
            [QC]: cell.unverified(),
            [MQ]: cell.partial("لوحة للمراجعة؛ ولا وصف لجدولها"),
            [HA]: cell.yes("تذكيرات على فترات متباعدة، مع جدول للمراجعة"),
          },
        },
        {
          feature: "متابعة التقدّم في الحفظ",
          cells: {
            munib: cell.yes("متتبّع للحفظ للآيات التي حفظتها أو تحتاج إلى مراجعتها"),
            [TA]: cell.yes("تخطيط الأهداف والسجل، ضمن Premium"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.yes("خط زمني للتقدّم"),
          },
        },
        {
          feature: "القرّاء وتكرار الصوت",
          cells: {
            munib: cell.yes("عدة قرّاء، مع التنزيل للاستماع دون اتصال"),
            [TA]: cell.yes("16 تلاوة، مع التنزيل للاستماع دون اتصال"),
            [QC]: cell.yes("أكثر من 15 تلاوة، وتكرار للصوت قابل للتخصيص"),
            [MQ]: cell.yes("أكثر من 20 قارئًا (صوت Premium)، مع تكرار تلقائي"),
            [HA]: cell.partial("قارئ واحد؛ ويتكرّر المقطع 7 مرات"),
          },
        },
        {
          feature: "ألوان التجويد في النص",
          cells: {
            munib: M.tajweedColours,
            [TA]: cell.yes(),
            [QC]: cell.yes("طبعة مصحف التجويد (صفحة App Store)"),
            [MQ]: cell.yes("مصحف تجويد ملوَّن"),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "تعلّم القراءة (الحروف ودروس التجويد)",
          cells: {
            munib: M.quranLearning,
            [TA]: cell.unverified("لم نجد دروسًا في التجويد أو القاعدة"),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "وضع الأطفال",
          cells: {
            munib: P.family,
            [TA]: cell.unverified(),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "السعر والإعلانات والحساب",
      rows: [
        {
          feature: "السعر",
          cells: {
            munib: M.price,
            [TA]: cell.text(
              "الأساسيات مجانية؛ واشتراك Premium (يبدأ من 12.99$ شهريًا على App Store الأمريكي)",
            ),
            [QC]: cell.text("مجاني؛ ولا مشتريات داخل التطبيق مذكورة"),
            [MQ]: cell.text(
              "تجربة مجانية 15 يومًا، ثم اشتراك (App Store الأمريكي: من 1.99$ شهريًا إلى 49.99$ مدى الحياة)",
            ),
            [HA]: cell.text("مجاني؛ مع مشتريات دعم اختيارية"),
          },
        },
        {
          feature: "ما الذي يتطلب الدفع",
          cells: {
            munib: cell.text("لا اشتراك ولا حاجز دفع على علامات الأخطاء"),
            [TA]: cell.text("كشف الأخطاء، والآيات المخفية، وتخطيط الأهداف والسجل"),
            [QC]: cell.text("لا شيء مذكور"),
            [MQ]: cell.text(
              "تتطلب الميزات اشتراكًا بعد التجربة؛ والمصحف والقبلة ومواقيت الصلاة مذكورة على أنها مجانية",
            ),
            [HA]: cell.text("لا شيء؛ المشتريات دعم اختياري"),
          },
        },
        {
          feature: "الإعلانات",
          cells: {
            munib: M.ads,
            [TA]: cell.text("بلا إعلانات"),
            [QC]: cell.text("بلا إعلانات"),
            [MQ]: cell.unverified(),
            [HA]: cell.text("بلا إعلانات"),
          },
        },
        {
          feature: "الحساب",
          cells: {
            munib: M.account,
            [TA]: cell.unverified(),
            [QC]: cell.unverified(),
            [MQ]: cell.unverified(),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "يعمل دون اتصال",
          cells: {
            munib: cell.yes("بعد تنزيل لمرة واحدة"),
            [TA]: cell.unverified("ميزات الصوت تحتاج إلى الإنترنت"),
            [QC]: cell.unverified("تذكر صفحته تنزيل الصوت والترجمات والصفحات"),
            [MQ]: cell.unverified("تذكر صفحته التنزيلات"),
            [HA]: cell.unverified(),
          },
        },
        {
          feature: "خانة «Data Used to Track You» على App Store",
          cells: {
            munib: cell.text("بلا حِزم إعلانية"),
            [TA]: cell.unverified(),
            [QC]: cell.text("لم يُصرَّح بشيء"),
            [MQ]: cell.text("لم يُصرَّح بشيء"),
            [HA]: cell.text("لم يُصرَّح بشيء"),
          },
        },
      ],
    },
    devicesGroupAr({
      [TA]: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
      },
      [QC]: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes("Quran for Android"),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
      },
      [MQ]: {
        ios: cell.yes("iPhone وiPad"),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
      },
      [HA]: {
        ios: cell.yes("iPhone وiPad"),
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
      "بلا إعلانات ولا اشتراك",
    ],
    [TA]: [
      "أكثر ملاحظات الحفظ بالذكاء الاصطناعي تطورًا، بما فيها أخطاء التشكيل",
      "بحث صوتي للعثور على أي آية",
      "مكتبة قرآنية مجانية كبيرة جدًا: ترجمات وتفاسير وقرّاء",
    ],
    [QC]: [
      "مجاني، بلا إعلانات ولا مشتريات داخل التطبيق مذكورة",
      "أكثر من 15 تلاوة مع تكرار للصوت قابل للتخصيص",
      "ترجمات وتفاسير بأكثر من 20 لغة (صفحة Google Play)",
    ],
    [MQ]: [
      "وضع IntelliJ Mode يبني مجموعات الآيات ويكرّرها تلقائيًا",
      "أكثر من 20 قارئًا ومصحف تجويد ملوَّن",
      "لوحة للمراجعة",
    ],
    [HA]: [
      "تذكيرات بالمراجعة على فترات متباعدة",
      "مجاني، بلا إعلانات",
      "يُستخدم إلى جانب المصحف الورقي أو أي تطبيق آخر",
    ],
  },
  bestFor: {
    munib: "لمن يريد تدرّبًا مجانيًا وخاصًا على التلاوة والمراجعة داخل تطبيق عبادته اليومي.",
    [TA]: "للحفّاظ المتفرّغين الذين يريدون أدق ملاحظات الذكاء الاصطناعي ولا يمانعون الاشتراك.",
    [QC]: "للقرّاء الذين يحفظون بالاستماع ويريدون مصحفًا مجانيًا بلا إعلانات.",
    [MQ]: "للمتعلّمين الذين يحفظون بالتكرار ولا يمانعون الاشتراك بعد التجربة.",
    [HA]: "لمن يحفظ بوسيلة أخرى ولا يحتاج إلا إلى جدول للمراجعة.",
  },
  body: [
    { type: "h2", text: "كيف تختار تطبيقًا لحفظ القرآن" },
    {
      type: "ul",
      items: [
        "**هل تريد أن يستمع التطبيق إليك؟** لدى Tarteel أدقّ كشف للأخطاء. أما [التدرّب على القرآن](/features/quran-practice) في Munib Tracker فمجاني وأبسط: يتابع تلاوتك ويعلِّم الكلمات التي تحتاج إلى إعادة.",
        "**هل تحفظ بالسماع؟** ابحث عن قارئ تحبه وعن تكرار الصوت. ومعظم التطبيقات هنا تجمع الأمرين.",
        "**كيف ستراجع؟** الحفظ الجديد يتفلّت بلا مراجعة. والجدول الذي يعيد إليك الآيات أهم من أي ميزة منفردة. اقرأ [كيف تحفظ القرآن](/resources/quran-learning/how-to-memorize-the-quran).",
        "**كم يكلّف على مدى سنة؟** تحقّق من الميزات التي تقع خلف الاشتراك قبل أن تبني وِردك عليها.",
        "**أين يذهب صوتك؟** إن كان التطبيق يستمع، فتحقّق هل يذكر أن الصوت يُعالَج على الجهاز أم يحتاج إلى اتصال.",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "ما يفعله المستمع في Munib Tracker وما لا يفعله",
      text: "يتابع تلاوتك كلمة بكلمة على جهازك ويعلِّم الكلمات التي تحتاج إلى إعادة، ويعلِّم فحص النطق فيه الكلمات التي يبدو أنها سقطت أو لم تتضح. ولا يقيّم التجويد ولا يصحّحه، ولا يمنح درجات، وتفوته بعض الأخطاء، ولا يغني عن التلاوة على معلّم مؤهَّل. اطّلع على [كيفية تحسين تلاوة القرآن](/resources/quran-learning/how-to-improve-quran-recitation).",
    },
    {
      type: "note",
      tone: "info",
      title: "كيف تحقّقنا",
      text: "كل قيمة مأخوذة من الموقع الرسمي للتطبيق أو صفحته على App Store أو Google Play (المتاجر الأمريكية)، وقد راجعناها في التاريخ المذكور. أما Memorize Quran و Haafidh فلم نجد لهما صفحة على Google Play نستطيع التأكد من أنها للتطبيق نفسه، ولذلك تظهر خانات Android فيهما بعبارة لم يُتحقَّق منه. تتغيّر الميزات كثيرًا، فراجع صفحات المتاجر قبل أن تقرّر.",
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
    {
      label: "Quran by Quran.com — صفحة App Store",
      url: "https://apps.apple.com/us/app/id1118663303",
    },
    {
      label: "Quran for Android (Quran.com) — صفحة Google Play",
      url: "https://play.google.com/store/apps/details?id=com.quran.labs.androidquran",
    },
    {
      label: "Memorize Quran — صفحة App Store",
      url: "https://apps.apple.com/us/app/memorize-quran/id1326501581",
    },
    {
      label: "Haafidh — صفحة App Store",
      url: "https://apps.apple.com/us/app/haafidh/id1571078630",
    },
  ],
  faqs: [
    {
      question: "ما أفضل تطبيق لحفظ القرآن؟",
      answer:
        "يعتمد ذلك على طريقتك في الحفظ. لدى Tarteel أدقّ كشف للأخطاء، ضمن خطة Premium المدفوعة. ويقدّم Munib Tracker تدرّبًا مجانيًا على التلاوة على جهازك مع أوضاع الإخفاء والمراجعة المتباعدة. ويناسب Quran by Quran.com من يحفظ بالاستماع، أما Haafidh فأداة بسيطة لجدولة المراجعة.",
    },
    {
      question: "هل يوجد تطبيق مجاني لحفظ القرآن بلا إعلانات؟",
      answer:
        "نعم. Munib Tracker مجاني بلا إعلانات ولا اشتراكات ولا مشتريات داخل التطبيق. و Quran by Quran.com مجاني وبلا إعلانات، و Haafidh مجاني بلا إعلانات مع مشتريات دعم اختيارية. أما Tarteel فبلا إعلانات وأساسياته مجانية، وكشف الأخطاء فيه ضمن Premium.",
    },
    {
      question: "أي تطبيق للقرآن يكشف الأخطاء أثناء التلاوة؟",
      answer:
        "يكشف Tarteel الكلمات الساقطة والخاطئة والزائدة وأخطاء التشكيل ضمن خطة Premium. أما المستمع المجاني في Munib Tracker فأبسط: يعلِّم الكلمات التي تحتاج إلى إعادة والكلمات التي يبدو أنها سقطت أو لم تتضح، دون درجات. ولا يكشف أيٌّ من التطبيقين أخطاء التجويد.",
    },
    {
      question: "هل يغني التطبيق عن معلّم القرآن في الحفظ؟",
      answer:
        "لا. يستطيع التطبيق أن يعينك على التكرار واختبار نفسك والمراجعة بين الدروس، لكنه لا يغني عن التلاوة على معلّم مؤهَّل يسمع تجويدك ويصحّحه. اطّلع على صفحتنا [لمتعلّمي القرآن](/for/quran-learners).",
    },
    {
      question: "أي تطبيق لحفظ القرآن يُبقي صوتي على جهازي؟",
      answer:
        "يعالج Munib Tracker صوتك على جهازك؛ فلا يُسجَّل ولا يُخزَّن ولا يُرفع أبدًا. أما ميزات الصوت في Tarteel فتحتاج إلى اتصال ثابت بالإنترنت. ولا تذكر المصادر الرسمية للتطبيقات الأخرى في هذه المقارنة أين يُعالَج صوت التلاوة.",
    },
  ],
  related: [
    "/compare/munib-tracker-vs-tarteel",
    "/features/quran-practice",
    "/resources/quran-learning/how-to-memorize-the-quran",
    "/for/quran-learners",
  ],
};
