import { DUA_COUNT } from "@munib-tracker/shared/constants";
import type { InventoryGroup } from "@/content/munib-features";

/**
 * Arabic translations (inventory). Each entry mirrors its English source
 * field for field (same ids, statuses, NF ids and hrefs) with translated
 * prose — see `content/localized.ts` and `content/i18n/README.md`. Plain
 * literals on purpose: `munib-features.ts` imports this file.
 */
export const TRANSLATIONS: readonly InventoryGroup[] = [
  {
    id: "salah",
    title: "الصلاة",
    items: [
      {
        name: "مواقيت الصلاة",
        detail:
          "بتحديد الموقع (GPS) أو باختيار المدينة، و13 طريقة حساب، وعصر حنفي أو شافعي، وضبط لكل صلاة، وقواعد خطوط العرض العليا",
        status: "shipped",
        href: "/features/prayer-times-qibla",
      },
      {
        name: "الأذان والتذكيرات",
        detail: "خمسة أنماط للأذان، وتذكيرات قبل كل صلاة أو بعدها، وتوقيت دقيق على Android",
        status: "shipped",
      },
      {
        name: "متابعة الصلاة",
        detail:
          "مؤدّاة أو مؤجَّلة أو فائتة أو قضاء لكل صلاة؛ والوتر؛ والجماعة؛ وملاحظات خاصة؛ والسلاسل والتقويم",
        status: "shipped",
        href: "/features/salah-tracker",
      },
      {
        name: "صلوات السنة والنافلة",
        detail: "التهجد والإشراق والضحى وتحية المسجد والحاجة والاستخارة",
        status: "shipped",
      },
      {
        name: "جدول اليوم",
        detail: "الصلوات المفروضة وأوقات السنن والأعمال المرنة لهذا اليوم",
        status: "shipped",
      },
      {
        name: "أيام العذر",
        detail: "الحيض والمرض والسفر توقف المتابعة دون أن تنقطع سلسلتك، مع أدلة إرشادية",
        status: "shipped",
      },
      {
        name: "يومية الخشوع في الصلاة",
        detail: "دوِّن مدى حضور قلبك في كل صلاة",
        status: "shipped",
      },
      {
        name: "سجل التهجد",
        detail: "مع حساب الثلث الأخير من الليل حسب موقعك",
        status: "shipped",
      },
      {
        name: "بوصلة القبلة",
        detail: "الاتجاه والمسافة إلى مكة، مع اهتزاز عند المحاذاة",
        status: "shipped",
        href: "/features/prayer-times-qibla",
      },
      {
        name: "استيراد سجل الصلاة",
        detail: "من جدول بيانات (CSV) أو ملف JSON، مع إضافة الفوائت إلى القضاء",
        status: "shipped",
      },
      {
        name: "متابعة السنن الرواتب",
        detail: "ركعات السنن المؤكدة: 12 عند الحنفية و10 عند المذاهب الأخرى، وقابلة للتعديل",
        status: "shipped",
        nf: "NF-3.1",
        href: "/features/salah-tracker",
      },
      {
        name: "قفل التركيز للصلاة",
        detail: "احجب التطبيقات التي تختارها عند كل صلاة حتى تصلي، على iPhone وAndroid",
        status: "shipped",
        nf: "NF-3.13",
        href: "/features/salah-focus-lock",
      },
      {
        name: "البحث عن المساجد",
        detail:
          "المساجد القريبة من OpenStreetMap في قائمة أو خريطة اختيارية، ومسجدك الأساسي مع أوقات إقامة خاصة بك، وعدّ تنازلي للإقامة، وخيار «صليت في المسجد»",
        status: "shipped",
        nf: "NF-3.11",
        href: "/features/masjid-finder",
      },
      {
        name: "تصوير جدول الأوقات",
        detail: "صوِّر جدول أوقات مسجدك لاستيراد أوقات الإقامة، يُقرأ على الجهاز وتراجعه بنفسك",
        status: "shipped",
        nf: "NF-3.12",
        href: "/features/masjid-finder",
      },
      {
        name: "تذكيرات الوقت المفضَّل",
        detail: "اختيارية، للمذاهب التي تفضِّل تأخير الفجر أو العصر أو العشاء",
        status: "shipped",
        href: "/features/my-madhhab",
      },
      {
        name: "إعداد مذهبي",
        detail:
          "الحنفي أو الشافعي أو المالكي أو الحنبلي أو جميع الأقوال؛ مع بيان مواضع الاختلاف في الأدلة والحاسبات",
        status: "shipped",
        nf: "NF-3.0a",
        href: "/features/my-madhhab",
      },
      {
        name: "ضبط التاريخ الهجري",
        detail: "إزاحة بمقدار ±2 يوم مع تصحيحات لكل شهر لتوافق رؤية الهلال في بلدك",
        status: "shipped",
        nf: "NF-3.0b",
        href: "/features/my-madhhab",
      },
    ],
  },
  {
    id: "qaza",
    title: "القضاء والصيام",
    items: [
      {
        name: "عدّادات القضاء",
        detail: "عدّاد لكل صلاة، بما فيها الوتر، يُغذّى من الصلوات الفائتة",
        status: "shipped",
        href: "/features/qaza-salah-tracker",
      },
      {
        name: "حاسبة القضاء مدى العمر",
        detail: "قدِّر ما عليك من السنوات التي لم تصلِّ فيها",
        status: "shipped",
      },
      {
        name: "مخطط الوتيرة اليومية",
        detail: "إعدادات من الهادئ إلى المكثَّف مع تاريخ متوقَّع للانتهاء",
        status: "shipped",
      },
      {
        name: "سجل القضاء",
        detail: "كل صلاة قضاء مسجَّلة",
        status: "shipped",
      },
      {
        name: "متابعة الصيام الفائت",
        detail: "تابِع الأيام التي أفطرتها واقضِها",
        status: "shipped",
      },
      {
        name: "أدوات الفدية والكفارة",
        detail: "تقديرات للتخطيط مع إرشادات",
        status: "shipped",
      },
      {
        name: "متابعة رمضان",
        detail: "أوقات الصيام وسجل للصيام",
        status: "shipped",
      },
      {
        name: "صيام الأيام البيض",
        detail: "صفحة خاصة وقائمة تحقق وتذكير للأيام 13 إلى 15 من كل شهر هجري",
        status: "shipped",
      },
      {
        name: "متابعة صيام التطوع",
        detail: "خطِّط للصيام المستحب وذكِّر به وسجِّله؛ مع بيان الأيام المكروهة ومنع الأيام المحرَّمة",
        status: "shipped",
        nf: "NF-3.2",
        href: "/features/fasting-tracker",
      },
      {
        name: "وضع ذي الحجة",
        detail: "أعمال يومية، ويوم عرفة، وتكبير التشريق حسب المذهب، ومخطط للأضحية",
        status: "shipped",
        nf: "NF-3.3",
        href: "/features/fasting-tracker",
      },
    ],
  },
  {
    id: "zikr",
    title: "الذكر والأدعية",
    items: [
      {
        name: "60 ذكرًا مع مصادرها",
        detail: "سبع فئات، ولكل ذكر الحديث الذي ورد فيه",
        status: "shipped",
        href: "/features/zikr-tracker",
      },
      {
        name: "جلسات أذكار موجَّهة",
        detail: "أذكار الصباح والمساء والنوم وما بعد كل صلاة",
        status: "shipped",
      },
      {
        name: "عدّاد التسبيح",
        detail: "أهداف 33 أو 99 أو 100 أو بلا حد أو مخصصة؛ ومربّع على Wear OS",
        status: "shipped",
      },
      {
        name: "تسلسل تسبيح ما بعد الصلاة",
        detail: "33 و33 و34 في عدّاد واحد ينتقل وحده، بالضغط أو دون لمس",
        status: "shipped",
        href: "/features/zikr-tracker",
      },
      {
        name: "منشئ الأذكار المخصصة",
        detail: "أذكارك الخاصة، مع تحويل الكلام إلى نص",
        status: "shipped",
      },
      {
        name: `${DUA_COUNT} دعاءً`,
        detail: "حصن المسلم كاملًا في 16 فئة",
        status: "shipped",
      },
      {
        name: "الصلوات على النبي ﷺ وأسماء الله الحسنى",
        detail: "تسع صيغ للصلاة على النبي ﷺ، وأسماء الله الحسنى مع معانيها وتلاوتها الصوتية",
        status: "shipped",
      },
      {
        name: "السنن اليومية",
        detail: "قائمة قصيرة بالسنن اليومية المدعومة بالأدلة",
        status: "shipped",
        nf: "NF-3.5",
        href: "/features/daily-islamic-habits",
      },
      {
        name: "تصاميم عدّاد التسبيح",
        detail:
          "ثمانية تصاميم، من الحلقة (الافتراضي) والخرز المنزلق إلى نوى التمر والعدّ بالأصابع، مع صوت واهتزاز اختياريين",
        status: "shipped",
        nf: "NF-3.19",
        href: "/features/zikr-tracker",
      },
      {
        name: "التسبيح بدون لمس",
        detail:
          "علِّم التطبيق أي ذكر بنطقه، ثم لا يُحتسب إلا تكراره، على الجهاز؛ والمس لتصحيح أي خطأ في العدّ",
        status: "shipped",
        nf: "NF-3.20",
        href: "/features/zikr-tracker",
      },
    ],
  },
  {
    id: "quran",
    title: "القرآن",
    items: [
      {
        name: "القرآن كاملًا دون اتصال",
        detail: "بالسورة والجزء، ومصحف من 604 صفحات، وصفحتان متقابلتان على الشاشات العريضة",
        status: "shipped",
        href: "/features/quran",
      },
      {
        name: "كلمة بكلمة وألوان التجويد",
        status: "shipped",
      },
      {
        name: "25 ترجمة",
        detail: "اثنتان مضمَّنتان والباقي عند الطلب، جنبًا إلى جنب",
        status: "shipped",
      },
      {
        name: "التفسير عند الطلب",
        status: "shipped",
      },
      {
        name: "التلاوات الصوتية",
        detail: "عدة قرّاء، وتشغيل بالآية أو بالسورة، وتنزيلات للاستماع دون اتصال",
        status: "shipped",
      },
      {
        name: "خطة الختم ومتابعة الحفظ",
        detail: "هدف قراءة يومي والآيات التي حفظتها",
        status: "shipped",
      },
      {
        name: "كاشف الآيات",
        detail: "اعرف السورة والآية من نص عربي أو إنجليزي مكتوب، أو من بضع كلمات تتلوها",
        status: "shipped",
      },
      {
        name: "البحث والإشارات المرجعية",
        detail: "البحث في الآيات، والبحث الشامل، ومركز واحد للإشارات المرجعية",
        status: "shipped",
      },
      {
        name: "ملاحظات الآيات والتظليل",
        detail: "تأملاتك الخاصة وألوانك ووسومك على أي آية",
        status: "shipped",
        nf: "NF-3.21",
        href: "/features/quran",
      },
      {
        name: "البحث بجذور الكلمات العربية",
        detail:
          "كل كلمة من جذر واحد، من Quranic Arabic Corpus (تنزيل اختياري بحجم 6 ميغابايت تقريبًا)",
        status: "shipped",
        nf: "NF-3.22",
        href: "/features/quran",
      },
    ],
  },
  {
    id: "recitation",
    title: "التلاوة وتعلّم القرآن",
    items: [
      {
        name: "مستمع التلاوة على الجهاز",
        detail: "أوضاع المتابعة والفحص وإخفاء الكلمات وإخفاء الآيات؛ وصوتك لا يغادر جهازك أبدًا",
        status: "shipped",
        href: "/features/quran-practice",
      },
      {
        name: "المراجعة المتباعدة",
        detail: "تعود الآيات للمراجعة بعد 1 و3 و7 و14 و30 يومًا",
        status: "shipped",
      },
      {
        name: "اتلُ لتجد والقراءة مع المستمع",
        detail:
          "اعثر على آية بتلاوتها، واقرأ مع المستمع من شاشات دليل الصلاة والجمعة والأذكار والختمة",
        status: "shipped",
        href: "/features/quran-practice",
      },
      {
        name: "تدريبات النطق",
        detail: "اختيارية، لدروس تجويد مختارة",
        status: "shipped",
      },
      {
        name: "تعلّم القرآن",
        detail: "الحروف العربية، وتعلّم القراءة، والتجويد، والمفردات، والموضوعات، والقصص، والتدبّر",
        status: "shipped",
        href: "/features/learn-quran",
      },
      {
        name: "فحص النطق",
        detail: "بعد أن تتلو آية، يعلِّم الكلمات التي يبدو أنها سقطت أو لم تتضح، على الجهاز",
        status: "shipped",
        nf: "NF-3.24",
        href: "/features/quran-practice",
      },
      {
        name: "تدريب التجويد",
        detail: "أصوات تجويد للتمرّن عليها من الآيات التي تعمل عليها، مع شروح وتدريبات",
        status: "shipped",
        nf: "NF-3.15",
        href: "/features/quran-practice",
      },
    ],
  },
  {
    id: "knowledge",
    title: "الحديث والتعلّم",
    items: [
      {
        name: "مكتبة الحديث",
        detail: "الأربعون النووية ورياض الصالحين مضمَّنتان؛ وست مجموعات كبرى عند الطلب",
        status: "shipped",
        href: "/features/hadith",
      },
      {
        name: "شرح الحديث وإسناده",
        detail: "الشرح وسلاسل الرواة كاملة",
        status: "shipped",
      },
      {
        name: "حديث اليوم",
        status: "shipped",
      },
      {
        name: "مكتبة التعلّم",
        detail:
          "العقيدة، والأنبياء مع شجرة نسبهم، والسيرة، والغزوات، والصحابة، والتاريخ الإسلامي المبكر، واليوم الآخر",
        status: "shipped",
        href: "/learn",
      },
      {
        name: "أدلة العبادات",
        detail:
          "دليل الصلاة، والطهارة، ويوم الجمعة، وليلة القدر، والعيد، والجنازة، والرقية، والمعاملات المالية الإسلامية",
        status: "shipped",
      },
      {
        name: "دليل المسلم الجديد",
        detail: "18 موضوعًا للخطوات الأولى",
        status: "shipped",
        href: "/for/new-muslims",
      },
      {
        name: "البطاقات التعليمية",
        detail: "راجِع القرآن والحديث وأسماء الله الحسنى وكل الأدلة",
        status: "shipped",
      },
    ],
  },
  {
    id: "tools",
    title: "الحاسبات والتخطيط",
    items: [
      {
        name: "حاسبة الزكاة",
        detail: "مع النصاب وقائمة تحقق وإرشادات",
        status: "shipped",
      },
      {
        name: "الحج والعمرة",
        detail: "دليل تعليمي وقوائم تحقق منفصلة للمناسك",
        status: "shipped",
      },
      {
        name: "أهداف الصدقة",
        detail: "نية للعطاء وسجل له",
        status: "shipped",
      },
      {
        name: "تقويم المناسبات الإسلامية ومحوّل التاريخ",
        detail: "الهجري والميلادي",
        status: "shipped",
      },
      {
        name: "وضع العمرة",
        detail: "رفيق مباشر خطوة بخطوة مع عدّادات للطواف والسعي",
        status: "shipped",
        nf: "NF-3.4",
        href: "/features/umrah-mode",
      },
      {
        name: "حاسبة المواريث",
        detail: "على المذاهب الأربعة، مع شرح كل نصيب",
        status: "shipped",
        nf: "NF-3.10",
        href: "/features/islamic-will-and-inheritance",
      },
      {
        name: "منشئ الوصية الإسلامية",
        detail: "بإرشاد خطوة بخطوة، في حدود الثلث، وتُصدَّر ملف PDF للطباعة والإشهاد",
        status: "shipped",
        nf: "NF-3.9",
        href: "/features/islamic-will-and-inheritance",
      },
      {
        name: "سجل الديون والأمانات",
        detail: "ما عليك وما لك، مع صورة اختيارية للمستند، محفوظ بخصوصية ومشفَّر",
        status: "shipped",
        nf: "NF-3.8",
        href: "/features/islamic-will-and-inheritance",
      },
    ],
  },
  {
    id: "progress",
    title: "التقدّم والمحاسبة",
    items: [
      {
        name: "هدف اليوم",
        detail: "الصلاة والذكر والقضاء والختم في قائمة يومية واحدة",
        status: "shipped",
        href: "/features/daily-islamic-habits",
      },
      {
        name: "الإحصاءات والتقرير الأسبوعي",
        detail: "عرض أسبوعي وشهري وسنوي",
        status: "shipped",
        href: "/features/worship-progress",
      },
      {
        name: "الإنجازات ومستويات النور",
        detail: "تشجيع لا يتوقف عند حد",
        status: "shipped",
      },
      {
        name: "محاسبة النفس الليلية",
        detail: "مراجعة خاصة للنفس في دقيقة واحدة كل ليلة، مشفَّرة",
        status: "shipped",
        nf: "NF-3.6",
        href: "/features/private-reflection",
      },
      {
        name: "مرشد أسبوعي لطيف",
        detail:
          "اقتراحات لطيفة وعملية مستخلصة من أسبوعك، بقواعد بسيطة على الجهاز (دون ذكاء اصطناعي)",
        status: "shipped",
        nf: "NF-3.14",
        href: "/features/private-reflection",
      },
      {
        name: "سجل قراءة القرآن اليومي",
        detail: "يسجِّل الأيام التي قرأت فيها، ليحتسبها المرشد الأسبوعي بدقة",
        status: "shipped",
        href: "/features/quran",
      },
      {
        name: "تذكيرات صلة الرحم",
        detail: "تذكيرات لطيفة بالتواصل مع الأقارب، محفوظة في خزنتك المشفَّرة",
        status: "shipped",
        nf: "NF-3.7",
        href: "/features/private-reflection",
      },
    ],
  },
  {
    id: "together",
    title: "العائلة والمجتمع",
    items: [
      {
        name: "العائلة ووضع الأطفال",
        detail:
          "ملفات يديرها الوالدان للأطفال دون 13 عامًا، ومسار صلاة للأطفال وقصص الأنبياء؛ ولا يرى الوالدان إلا حالة الصلوات المفروضة",
        status: "shipped",
        nf: "NF-3.16",
        href: "/features/family-and-friends",
      },
      {
        name: "رفيق المتابعة",
        detail: "شارِك «تمّ» يوميًا فقط، دون هدفك أو تفاصيلك أبدًا",
        status: "shipped",
        nf: "NF-3.17",
        href: "/features/family-and-friends",
      },
      {
        name: "الختمة الجماعية",
        detail: "قسِّم ختمة بالأجزاء أو الأحزاب أو السور مع العائلة أو الأصدقاء",
        status: "shipped",
        nf: "NF-3.18",
        href: "/features/family-and-friends",
      },
      {
        name: "الانضمام بالجوار",
        detail:
          "أضف شخصًا بجانبك عبر Bluetooth برمز من 4 أرقام توافق عليه؛ مع رمز QR ورموز الدعوة أيضًا",
        status: "shipped",
        href: "/features/family-and-friends",
      },
    ],
  },
  {
    id: "devices",
    title: "الأجهزة",
    items: [
      {
        name: "iPhone وiPad وAndroid",
        status: "shipped",
        href: "/features/widgets-and-devices",
      },
      {
        name: "تطبيق الويب",
        detail: "يعمل في أي متصفح ويُثبَّت كتطبيق PWA",
        status: "shipped",
      },
      {
        name: "Apple TV وAndroid TV",
        status: "shipped",
      },
      {
        name: "الأدوات والأنشطة المباشرة",
        detail: "الشاشة الرئيسية وشاشة القفل، وDynamic Island، والتحديثات المباشرة على Android",
        status: "shipped",
      },
      {
        name: "Apple Watch وWear OS",
        detail: "الجدول، وتسجيل الصلاة، والتسبيح على المعصم، وإضافات واجهة الساعة، والمربّعات",
        status: "shipped",
      },
      {
        name: "اختصارات Siri وGoogle Assistant",
        detail: "إضافة إلى الإجراءات السريعة من أيقونة التطبيق",
        status: "shipped",
      },
    ],
  },
  {
    id: "privacy",
    title: "الخصوصية والتخصيص",
    items: [
      {
        name: "بلا إعلانات ولا اشتراكات",
        detail: "مجاني للاستخدام الشخصي",
        status: "shipped",
      },
      {
        name: "لا حاجة إلى حساب",
        detail: "تسجيل دخول اختياري عبر Google أو Apple أو Facebook للمزامنة",
        status: "shipped",
      },
      {
        name: "النسخ الاحتياطي والاستعادة",
        detail: "ملف تحتفظ به أنت، ومدير للتنزيلات دون اتصال",
        status: "shipped",
      },
      {
        name: "مراجعة تعارضات المزامنة",
        detail: "اختر النسخة التي تُبقيها عندما يختلف جهازان",
        status: "shipped",
      },
      {
        name: "صندوق الإشعارات",
        detail: "الإعلانات والتذكيرات في مكان واحد داخل التطبيق",
        status: "shipped",
      },
      {
        name: "قفل التطبيق",
        detail: "رمز PIN أو البصمة/الوجه",
        status: "shipped",
      },
      {
        name: "24 لغة",
        detail: "تخطيطات من اليمين إلى اليسار للعربية والأردية والفارسية والبشتو والكردية",
        status: "shipped",
      },
      {
        name: "السمات والأيقونات والخطوط",
        detail: "فاتح وداكن، و12 لونًا مميِّزًا، وسمات وأيقونات تطبيق موسمية، وخطوط عربية",
        status: "shipped",
      },
      {
        name: "شاشة رئيسية قابلة للتخصيص",
        detail: "اختر وحدات الشاشة الرئيسية والإجراءات السريعة",
        status: "shipped",
      },
      {
        name: "الشيفرة المصدرية على GitHub",
        detail: "ترخيص غير تجاري",
        status: "shipped",
        href: "/open-source",
      },
      {
        name: "خزنة خاصة مشفَّرة",
        detail:
          "المحاسبة والوصية والديون وجهات اتصال العائلة مشفَّرة على الجهاز؛ ومزامنة اختيارية بتشفير تام بين الطرفين",
        status: "shipped",
        nf: "NF-3.0",
        href: "/features/private-reflection",
      },
      {
        name: "إعدادات قابلة للبحث",
        detail: "إعدادات أُعيد تصميمها ومجمَّعة حسب الموضوع، مع البحث",
        status: "shipped",
        nf: "NF-3.0b",
      },
    ],
  },
];
