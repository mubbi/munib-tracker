import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupAr, NOT_ON_APP_STORE_AR } from "@/content/i18n/ar/compare-devices";
import { MUNIB_CELLS_AR as M, MUNIB_NF_AR as P } from "@/content/i18n/ar/compare-shared";
import type { ComparePage } from "@/content/types";

const MP = "muslim-pro";
const PL = "pillars";
const AT = "athan";
const I3 = "islam360";
const TA = "tarteel";
const F5 = "5te5";

export const muslimProAlternativesAr: ComparePage = {
  slug: "muslim-pro-alternatives",
  kind: "roundup",
  title: "بدائل Muslim Pro: مقارنة بين ستة تطبيقات",
  seoTitle: "بدائل Muslim Pro (2026): مقارنة 6 تطبيقات في الإعلانات والخصوصية",
  seoDescription:
    "تبحث عن بديل لـMuslim Pro؟ مقارنة بين Munib Tracker و Pillars و Athan و Islam360 و Tarteel و 5te5 في الإعلانات والسعر وملصقات الخصوصية والصلاة والقرآن.",
  description:
    "ستة بدائل لـMuslim Pro جنبًا إلى جنب، مع Muslim Pro مرجعًا للمقارنة: السعر، والإعلانات، والحساب، وملصقات الخصوصية، والصلاة، والقضاء، والقرآن، والذكر، والأجهزة.",
  keywords: [
    "بدائل Muslim Pro",
    "تطبيقات مثل Muslim Pro",
    "بديل Muslim Pro بلا إعلانات",
    "بديل مجاني لـMuslim Pro",
  ],
  cluster: "comparison",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "جولة مقارنة",
  intro: [
    "يُعد Muslim Pro من شركة Bitsmedia من أشهر التطبيقات الإسلامية، إذ تجاوزت تنزيلاته 100 مليون على Google Play. ومن يبحث عن بديل له يذكر في الغالب أحد ثلاثة أسباب: الإعلانات في النسخة المجانية، أو اشتراك Premium، أو الخصوصية.",
    'تقارن هذه الصفحة بين ستة بدائل مع جعل Muslim Pro عمودًا مرجعيًا، اعتمادًا على الموقع الرسمي لكل تطبيق وصفحاته على App Store و Google Play. Munib Tracker هو تطبيقنا، لذلك حرصنا على أن يبقى الجدول واقعيًا، وقلنا بوضوح متى يكون Muslim Pro أو تطبيق آخر هو الخيار الأفضل. وحيث لم نتمكن من التأكد من أمر ما من مصدر رسمي، نكتب "لم يُتحقَّق منه" بدلًا من التخمين.',
  ],
  apps: [
    MUNIB,
    {
      id: MP,
      name: "Muslim Pro",
      developer: "Bitsmedia Pte Ltd",
      url: "https://www.muslimpro.com/",
    },
    {
      id: PL,
      name: "Pillars",
      developer: "The Pillars Group Ltd",
      url: "https://thepillarsapp.com",
    },
    {
      id: AT,
      name: "Athan",
      developer: "IslamicFinder",
      url: "https://www.islamicfinder.org/athan/",
    },
    {
      id: I3,
      name: "Islam360",
      developer: "Islam360 Foundation Trust",
      url: "https://www.theislam360.com/",
    },
    { id: TA, name: "Tarteel", developer: "Tarteel Inc.", url: "https://tarteel.ai" },
    { id: F5, name: "5te5", url: "https://apps.apple.com/us/app/id1602490524" },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "بلا إعلانات ولا اشتراك",
      text: "Munib Tracker و 5te5 مجانيان، بلا إعلانات ولا مشتريات داخل التطبيق. و Pillars و Tarteel بلا إعلانات كذلك، لكن كلًّا منهما يبيع خطة Premium.",
    },
    {
      title: "للخصوصية",
      text: "لا يصرّح Pillars ولا 5te5 بشيء في خانة «Data Used to Track You» على App Store، ولا يحتاج Pillars إلى تسجيل. أما Munib Tracker فبلا حِزم إعلانية، ويعمل في وضع الضيف دون حساب.",
    },
    {
      title: "لمتابعة الصلاة والقضاء",
      text: "يسجّل Munib Tracker كل صلاة ويضيف حاسبة للقضاء ومخططًا بوتيرة يومية. ويقدّم Pillars و Athan تسجيلًا أبسط، أما 5te5 فمصمَّم للمبتدئين الذين يبنون العادة.",
    },
    {
      title: "للقرآن",
      text: "Tarteel هو الخيار الأقوى للحفظ مع ملاحظات الذكاء الاصطناعي. و Islam360 هو الأعمق في الترجمات الأردية والتفسير والحديث. ويضم Munib Tracker قارئًا كاملًا مع تدرّب مجاني على التلاوة على الجهاز.",
    },
    {
      title: "متى يبقى Muslim Pro الخيار الأفضل",
      text: "إن كنت تستخدم مقاطع Qalbox أو المساعد AiDeen أو أداة البحث عن الأماكن الحلال أو مجتمعه، فلا بديل هنا يعوّض ذلك كله في تطبيق واحد.",
    },
  ],
  table: [
    {
      group: "السعر والإعلانات والخصوصية",
      rows: [
        {
          feature: "السعر",
          cells: {
            munib: M.price,
            [MP]: cell.text(
              "مجاني مع إعلانات؛ واشتراك Premium (12.99$ شهريًا أو 34.99$ سنويًا في الولايات المتحدة)",
            ),
            [PL]: cell.text(
              "الأساسيات مجانية؛ وPremium يبدأ من 11.99$ شهريًا أو 49.99$ سنويًا في الولايات المتحدة",
            ),
            [AT]: cell.text(
              "مجاني مع إعلانات؛ وAthan Premium (1.99$ شهريًا أو 11.99$ سنويًا في الولايات المتحدة) أو إزالة الإعلانات بدفعة واحدة",
            ),
            [I3]: cell.text(
              "مجاني مع إعلانات؛ واشتراك لإزالة الإعلانات (9.99$ شهريًا أو 49.99$ سنويًا في الولايات المتحدة)",
            ),
            [TA]: cell.text(
              "الأساسيات مجانية؛ واشتراك Premium (يبدأ من 12.99$ شهريًا على App Store الأمريكي)",
            ),
            [F5]: cell.text("مجاني؛ بلا مشتريات داخل التطبيق"),
          },
        },
        {
          feature: "إعلانات في النسخة المجانية",
          cells: {
            munib: M.ads,
            [MP]: cell.text("نعم (على Google Play: «Contains ads»)"),
            [PL]: cell.text("بلا إعلانات"),
            [AT]: cell.text("نعم (على Google Play: «Contains ads»)"),
            [I3]: cell.text("نعم (على Google Play: «Contains ads»)"),
            [TA]: cell.text("بلا إعلانات"),
            [F5]: cell.text("بلا إعلانات"),
          },
        },
        {
          feature: "الحاجة إلى حساب للاستخدام الأساسي",
          cells: {
            munib: M.account,
            [MP]: cell.unverified(),
            [PL]: cell.text("غير مطلوب (بلا تسجيل)"),
            [AT]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "خانة «Data Used to Track You» على App Store",
          cells: {
            munib: cell.text("بلا حِزم إعلانية؛ وبيانات وضع الضيف تبقى على الجهاز"),
            [MP]: cell.text("الموقع، والمعرّفات"),
            [PL]: cell.text("لم يُصرَّح بشيء"),
            [AT]: cell.text("معلومات الاتصال"),
            [I3]: cell.text("المعرّفات"),
            [TA]: cell.unverified(),
            [F5]: cell.text("لم يُصرَّح بشيء"),
          },
        },
      ],
    },
    {
      group: "الصلاة",
      rows: [
        {
          feature: "مواقيت الصلاة",
          cells: {
            munib: M.times,
            [MP]: cell.yes(),
            [PL]: cell.yes("الأذان الكامل ضمن Premium"),
            [AT]: cell.yes(),
            [I3]: cell.yes(),
            [TA]: cell.unverified(),
            [F5]: cell.yes(),
          },
        },
        {
          feature: "تسجيل الصلاة عند أدائها",
          cells: {
            munib: M.salahLog,
            [MP]: cell.yes("متابعة الصلاة والصيام مع السلاسل"),
            [PL]: cell.yes("متابعة مجانية"),
            [AT]: cell.yes("سجل يومي وسلاسل"),
            [I3]: cell.unverified("يذكر الموقع «Salah Tracker»؛ ولا تصف صفحات المتاجر التسجيل"),
            [TA]: cell.unverified(),
            [F5]: cell.yes("تحدٍّ لبناء العادة في 40 يومًا"),
          },
        },
        {
          feature: "متابعة القضاء (الصلوات الفائتة)",
          cells: {
            munib: M.qaza,
            [MP]: cell.yes("متابعة العبادات تسجّل الصلوات والصيام الفائت"),
            [PL]: cell.partial("تعليم الصلاة بأنها متأخرة/مقضيّة؛ وعدّاد لقضاء الصيام"),
            [AT]: cell.unverified("غير مذكورة في صفحات المتاجر"),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.partial("تطبيق قضاء منفصل"),
          },
        },
        {
          feature: "أيام العذر (الحيض)",
          cells: {
            munib: M.excusedDays,
            [MP]: cell.unverified(),
            [PL]: cell.yes("وضع الحيض يحافظ على السلاسل"),
            [AT]: cell.yes("وضع الحيض مع متابعة الدورة"),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "حجب التطبيقات وقت الصلاة",
          cells: {
            munib: P.focusLock,
            [MP]: cell.unverified(),
            [PL]: cell.yes("PrayFirst، ضمن Premium"),
            [AT]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "البحث عن المساجد",
          cells: {
            munib: P.masjidFinder,
            [MP]: cell.yes("المساجد والأماكن الحلال"),
            [PL]: cell.partial("أوقات المساجد في مرحلة تجريبية"),
            [AT]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "القرآن",
      rows: [
        {
          feature: "قارئ القرآن",
          cells: {
            munib: M.quranReader,
            [MP]: cell.yes(),
            [PL]: cell.no("بحسب مدوّنة Pillars نفسها"),
            [AT]: cell.yes("ترجمات بأكثر من 45 لغة"),
            [I3]: cell.yes("أكثر من 21 ترجمة وأكثر من 16 تفسيرًا"),
            [TA]: cell.yes("152 ترجمة و45 تفسيرًا"),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "التدرّب على التلاوة بالميكروفون",
          cells: {
            munib: M.recitation,
            [MP]: cell.unverified("غير مذكور في الصفحات الرسمية"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [I3]: cell.unverified("البحث الصوتي فقط"),
            [TA]: cell.yes("يتابع تلاوتك مجانًا؛ وكشف الأخطاء ضمن Premium"),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "تعلّم القرآن (الحروف ودروس التجويد)",
          cells: {
            munib: M.quranLearning,
            [MP]: cell.partial("أداة للحفظ؛ ودروس وحصص مباشرة ضمن Premium"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified("تطبيق Athan Academy منفصل"),
            [I3]: cell.yes("27 درسًا في القاعدة مع الصوت"),
            [TA]: cell.unverified("لم نجد دروسًا في التجويد أو القاعدة"),
            [F5]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "الذكر والأدعية والتعلّم",
      rows: [
        {
          feature: "عدّاد التسبيح",
          cells: {
            munib: M.tasbeeh,
            [MP]: cell.yes(),
            [PL]: cell.partial("على Apple Watch فقط، ضمن Premium"),
            [AT]: cell.yes(),
            [I3]: cell.yes(),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "الأذكار والأدعية",
          cells: {
            munib: M.zikr,
            [MP]: cell.yes("مكتبة أدعية"),
            [PL]: cell.unverified(),
            [AT]: cell.yes("أذكار مع الصوت"),
            [I3]: cell.yes("مع مراجع الأحاديث"),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "كتب الحديث",
          cells: {
            munib: M.hadith,
            [MP]: cell.partial("عبر AiDeen ومقاطع Qalbox"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified("قسم للحديث على موقع IslamicFinder"),
            [I3]: cell.yes("الكتب السبعة الأساسية وغيرها"),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "مكتبة منظّمة للتعلّم الإسلامي",
          cells: {
            munib: M.learning,
            [MP]: cell.partial("سلاسل مرئية في Qalbox؛ ودروس Premium"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [I3]: cell.partial("دورات و«Fahm-ul-Quran»"),
            [TA]: cell.unverified(),
            [F5]: cell.partial("مقاطع مرئية لتعلّم الصلاة"),
          },
        },
      ],
    },
    {
      group: "ما يضيفه Muslim Pro",
      rows: [
        {
          feature: "محتوى مرئي",
          cells: {
            munib: cell.no(),
            [MP]: cell.yes("Qalbox"),
            [PL]: cell.unverified(),
            [AT]: cell.yes("Athan Stories"),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.partial("مقاطع مرئية لتعلّم الصلاة"),
          },
        },
        {
          feature: "مساعد للأسئلة الإسلامية بالذكاء الاصطناعي",
          cells: {
            munib: cell.no(),
            [MP]: cell.yes("AiDeen"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
        {
          feature: "ميزات المجتمع والمجموعات",
          cells: {
            munib: P.groupKhatm,
            [MP]: cell.yes("مجتمع Ummah Pro، والتحديات (Quests)"),
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
            [F5]: cell.unverified(),
          },
        },
      ],
    },
    devicesGroupAr({
      [MP]: {
        web: cell.partial("صفحات مواقيت الصلاة على الموقع"),
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: cell.yes("مذكور في صفحته على App Store"),
        appleTv: cell.partial("مذكور في صفحته على App Store"),
        widgets: cell.partial("التسجيل يتطلب Premium"),
      },
      [PL]: {
        ios: cell.yes("iPhone وiPad"),
        android: cell.yes(),
        appleWatch: cell.yes("ضمن Premium"),
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes(),
      },
      [AT]: {
        web: cell.partial("موقع IslamicFinder"),
        ios: cell.partial("iPhone؛ ولا نسخة مذكورة لـiPad"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE_AR,
        appleTv: NOT_ON_APP_STORE_AR,
        widgets: cell.yes(),
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
      [F5]: { ios: cell.yes("على App Store"), android: cell.yes() },
    }),
  ],
  strengths: {
    munib: [
      "بلا إعلانات ولا اشتراكات ولا حساب",
      "حاسبة للقضاء ومخطط بوتيرة يومية",
      "قارئ كامل للقرآن مع تدرّب مجاني على التلاوة على الجهاز",
      "أذكار مع الحديث المصدر، وأدعية، ومكتبة للتعلّم",
      "الويب والتلفاز و Apple Watch و Wear OS",
    ],
    [MP]: [
      "مجموعة ميزات واسعة جدًا في تطبيق واحد",
      "قاعدة مستخدمين ضخمة وراسخة (أكثر من 100 مليون تنزيل على Google Play)",
      "مكتبة الفيديو Qalbox والمساعد الذكي AiDeen",
      "البحث عن المطاعم الحلال والمساجد، وميزات المجتمع",
    ],
    [PL]: [
      "بلا إعلانات ودون حساب",
      "حجب التطبيقات عبر PrayFirst ومنبّه فجر ذكي (ضمن Premium)",
      "وضع للحيض يحافظ على السلاسل",
      "تجربة صلاة نظيفة ومركّزة",
    ],
    [AT]: [
      "تطبيق عريق لمواقيت الصلاة",
      "أهداف يومية وسلاسل للصلاة",
      "وضع للحيض مع متابعة الدورة",
      "خيار Premium منخفض التكلفة",
    ],
    [I3]: [
      "بحث متعمّق في القرآن بالكلمة العربية والجذر والموضوع والترجمة",
      "ترجمات أردية كثيرة وتفاسير لعلماء مسمَّين",
      "مكتبة حديث كبيرة مع درجات الأحاديث والتخريج",
      "دروس في القاعدة مع الصوت",
    ],
    [TA]: [
      "أكثر ملاحظات الحفظ بالذكاء الاصطناعي تطورًا، بما فيها أخطاء التشكيل",
      "بحث صوتي للعثور على أي آية",
      "مكتبة قرآنية مجانية كبيرة جدًا: ترجمات وتفاسير وقرّاء",
      "بلا إعلانات",
    ],
    [F5]: [
      "مجاني تمامًا وغير ربحي",
      "تحدٍّ للمبتدئين في 40 يومًا",
      "لا يجمع أي بيانات (بحسب Google Play)",
    ],
  },
  bestFor: {
    munib:
      "لمن يترك Muslim Pro بحثًا عن تطبيق بلا إعلانات ولا اشتراك يغطي مع ذلك الصلاة والقضاء والذكر والقرآن والتعلّم.",
    [MP]: "لمن يريد تطبيقًا واحدًا لمواقيت الصلاة والقرآن والفيديو والمجتمع والخدمات المحلية.",
    [PL]: "لمن يريد تطبيقًا بسيطًا للصلاة ويقدّر أدوات التركيز مثل حجب التطبيقات.",
    [AT]: "لمن يريد في الأساس مواقيت صلاة موثوقة وتسجيلًا يوميًا بسيطًا.",
    [I3]: "للطلاب والقرّاء، ولا سيما الناطقين بالأردية، ممن يريدون أدوات متعمّقة لبحث القرآن والحديث.",
    [TA]: "للحفّاظ المتفرّغين الذين يريدون أدق ملاحظات الذكاء الاصطناعي ولا يمانعون الاشتراك.",
    [F5]: "المبتدئون الذين يبنون العادة، مجانًا تمامًا.",
  },
  body: [
    { type: "h2", text: "لماذا يبحث الناس عن بديل لـMuslim Pro" },
    {
      type: "ul",
      items: [
        "**الإعلانات.** تحمل صفحة Muslim Pro على Google Play وسم «Contains ads». ومن التطبيقات المذكورة هنا، Munib Tracker و Pillars و Tarteel و 5te5 بلا إعلانات؛ أما Athan و Islam360 فيعرضان إعلانات في نسختيهما المجانيتين.",
        "**الاشتراك.** اشتراك Muslim Pro Premium مُدرَج بسعر 12.99$ شهريًا أو 34.99$ سنويًا في الولايات المتحدة. وليس في Munib Tracker ولا 5te5 أي فئة مدفوعة. و Athan Premium هو الأقل سعرًا بين الاشتراكات في هذه القائمة.",
        "**الخصوصية.** تُفصح صفحة Muslim Pro على App Store عن الموقع والمعرّفات ضمن خانة «Data Used to Track You».",
      ],
    },
    { type: "h2", text: "ما الذي تتخلى عنه عند الانتقال" },
    {
      type: "p",
      text: "يغطي Muslim Pro مساحة أوسع من أي بديل منفرد هنا: مقاطع Qalbox، والمساعد AiDeen، وأداة البحث عن الأماكن الحلال، ومجتمعًا كبيرًا، وتطبيقات لـApple Watch و Apple TV. فإن كانت هذه هي ما تفتحه من أجله، فإن Premium يزيل الإعلانات وقد يكون الحل الأبسط. وتعرض صفحة [Munib Tracker أم Muslim Pro](/compare/munib-tracker-vs-muslim-pro) التطبيقين صفًّا بصف.",
    },
    { type: "h2", text: "اختر بحسب ما كنت تستخدم Muslim Pro لأجله" },
    {
      type: "ul",
      items: [
        "**مواقيت الصلاة ومتابعتها:** Munib Tracker أو Pillars أو Athan. وإن كانت عليك صلوات فائتة تريد قضاءها، ففي [متتبّع القضاء](/features/qaza-salah-tracker) في Munib Tracker حاسبة ومخطط.",
        "**قراءة القرآن:** Munib Tracker أو Tarteel أو Islam360. وللحفظ مع ملاحظات الذكاء الاصطناعي، اقرأ [مقارنة Munib Tracker و Tarteel](/compare/munib-tracker-vs-tarteel).",
        "**الأدعية والأذكار:** يتضمنها Munib Tracker و Athan و Islam360 جميعًا؛ أما Pillars فيركّز على الصلاة.",
        "**لمن بدأ الصلاة للتو:** 5te5 مبني على تحدٍّ لبناء العادة في 40 يومًا مع مقاطع مرئية لتعلّم الصلاة.",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "كيف تحقّقنا",
      text: "كل قيمة مأخوذة من الموقع الرسمي للتطبيق أو صفحته على App Store أو Google Play (المتاجر الأمريكية)، وقد راجعناها في التاريخ المذكور. تتغيّر الأسعار والميزات كثيرًا، فراجع صفحات المتاجر قبل أن تقرّر. أما طريقة تعامل Munib Tracker مع بياناتك فمشروحة في [سياسة الخصوصية](/privacy).",
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
      label: "مساعدة Muslim Pro — الحفظ",
      url: "https://support.muslimpro.com/hc/en-us/articles/29158808395289-Quran-Learn-Memorisation",
    },
    { label: "Muslim Pro — AiDeen", url: "https://www.muslimpro.com/app/askaideen" },
    { label: "Pillars — الموقع الرسمي", url: "https://thepillarsapp.com" },
    { label: "Pillars — الميزات والأسعار (/ai)", url: "https://thepillarsapp.com/ai" },
    {
      label: "مدوّنة Pillars — أفضل تطبيقات رمضان",
      url: "https://thepillarsapp.com/blog/best-ramadan-apps",
    },
    { label: "Pillars — صفحة App Store", url: "https://apps.apple.com/us/app/id1559086853" },
    {
      label: "Pillars — صفحة Google Play",
      url: "https://play.google.com/store/apps/details?id=com.pillars.pillars",
    },
    { label: "Athan — موقع IslamicFinder", url: "https://www.islamicfinder.org/athan/" },
    {
      label: "Athan — صفحة Google Play",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — صفحة App Store",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
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
    { label: "Tarteel — الموقع الرسمي", url: "https://tarteel.ai" },
    {
      label: "مساعدة Tarteel — هل يمكنني استخدام Tarteel مجانًا؟",
      url: "https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free",
    },
    {
      label: "مدوّنة Tarteel — تقديم كشف الأخطاء",
      url: "https://tarteel.ai/blog/introducing-mistake-detection/",
    },
    { label: "Tarteel — صفحة App Store", url: "https://apps.apple.com/us/app/id1391009396" },
    {
      label: "Tarteel — صفحة Google Play",
      url: "https://play.google.com/store/apps/details?id=com.mmmoussa.iqra",
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
      question: "ما أفضل بديل لـMuslim Pro؟",
      answer:
        "يعتمد ذلك على سبب انتقالك. إن أردت تطبيقًا بلا إعلانات ولا اشتراك يجمع الصلاة والقضاء والذكر والقرآن، فـMunib Tracker مجاني. ولتطبيق صلاة بسيط انظر إلى Pillars؛ ولحفظ القرآن Tarteel؛ وللتفسير بالأردية والحديث Islam360.",
    },
    {
      question: "هل يوجد بديل مجاني لـMuslim Pro بلا إعلانات؟",
      answer:
        "نعم. Munib Tracker و 5te5 بلا إعلانات ولا مشتريات داخل التطبيق. و Pillars و Tarteel بلا إعلانات كذلك، مع خطط Premium اختيارية لميزات إضافية.",
    },
    {
      question: "أي بدائل Muslim Pro أفضل للخصوصية؟",
      answer:
        "راجع ملصق الخصوصية لكل تطبيق على App Store. لا يصرّح Pillars ولا 5te5 بشيء في خانة «Data Used to Track You»، ولا يحتاج Pillars إلى تسجيل. و Munib Tracker بلا حِزم إعلانية ويُبقي بيانات وضع الضيف على جهازك؛ راجع [سياسة الخصوصية](/privacy).",
    },
    {
      question: "ماذا سأفقد إذا انتقلت من Muslim Pro؟",
      answer:
        "ستفقد أساسًا إضافاته: مقاطع Qalbox، والمساعد الذكي AiDeen، وأداة البحث عن الأماكن الحلال، وميزات المجتمع. ولا يقدّم أي بديل في هذه الصفحة ذلك كله مجتمعًا، فيبقى Muslim Pro الخيار الأفضل إن كنت تعتمد عليها.",
    },
    {
      question: "هل يمكنني نقل سجل صلاتي من Muslim Pro إلى تطبيق آخر؟",
      answer:
        "يستطيع Munib Tracker استيراد سجلات الصلاة السابقة من جدول بيانات (CSV) أو من ملف JSON. أما إمكانية التصدير من Muslim Pro بهذه الصيغة فتعود إلى Muslim Pro.",
    },
  ],
  related: [
    "/compare/munib-tracker-vs-muslim-pro",
    "/compare/best-salah-tracker-apps",
    "/features/salah-tracker",
    "/features/qaza-salah-tracker",
    "/download",
  ],
};
