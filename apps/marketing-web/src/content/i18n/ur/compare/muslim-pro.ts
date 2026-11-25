import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { devicesGroupUr as devicesGroup } from "@/content/i18n/ur/compare-devices";
import { MUNIB_CELLS_UR as M, MUNIB_NF_UR as P } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

const MP = "muslim-pro";

export const vsMuslimProUr: ComparePage = {
  slug: "munib-tracker-vs-muslim-pro",
  kind: "versus",
  title: "Munib Tracker بمقابلہ Muslim Pro",
  seoTitle: "Munib Tracker بمقابلہ Muslim Pro: خصوصیات، اشتہارات اور پرائیویسی",
  seoDescription:
    "Munib Tracker اور Muslim Pro کا شواہد پر مبنی موازنہ: نماز اور قضا کی ٹریکنگ، قرآن، ذکر، تلاوت کی مشق، قیمت، اشتہارات اور پرائیویسی لیبلز۔",
  description:
    "Muslim Pro مسلمانوں کے لیے سب سے وسیع آل اِن ون ایپ ہے۔ Munib Tracker ایک مفت، اشتہارات سے پاک ٹریکر اور قرآن کی ساتھی ایپ ہے۔ دونوں میں فرق یہ ہے۔",
  keywords: [
    "munib tracker بمقابلہ muslim pro",
    "muslim pro کا متبادل",
    "بغیر اشتہارات کے muslim pro",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "موازنہ",
  intro: [
    "Bitsmedia کی Muslim Pro سب سے مشہور مسلم ایپس میں سے ایک ہے، جسے Google Play پر 100 ملین سے زیادہ بار ڈاؤن لوڈ کیا جا چکا ہے۔ اس میں نماز کے اوقات، قرآن، دعائیں، نماز اور روزے کا ٹریکر، Qalbox نامی ویڈیو سروس، حلال مقامات کی تلاش اور بہت کچھ شامل ہے۔",
    "Munib Tracker ایک چھوٹی، مفت ایپ ہے جس کا مرکز آپ کی عبادت (نماز، قضا اور ذکر) کی ٹریکنگ، قرآن اور سیکھنا ہے، نہ کوئی اشتہار اور نہ اکاؤنٹ کی ضرورت۔ اس صفحے پر دونوں کا موازنہ ہر ایپ کی آفیشل ویب سائٹ اور اسٹور لسٹنگز کی بنیاد پر کیا گیا ہے۔",
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
      title: "Muslim Pro چنیں اگر…",
      text: "آپ تقریباً ہر چیز کے لیے ایک ہی ایپ چاہتے ہیں، جس میں ویڈیو لیکچرز، حلال ریسٹورنٹ کی تلاش، بڑی کمیونٹی اور AI سوال و جواب اسسٹنٹ شامل ہوں، اور آپ کو اشتہارات یا Premium سبسکرپشن سے مسئلہ نہیں۔",
    },
    {
      title: "Munib Tracker چنیں اگر…",
      text: "آپ بنیادی طور پر نماز، قضا اور ذکر ٹریک کرنا، قرآن پڑھنا اور اس کی مشق کرنا، اور سیکھنا چاہتے ہیں، ایسی ایپ میں جس میں نہ اشتہار ہو، نہ سبسکرپشن اور نہ اکاؤنٹ۔",
    },
  ],
  table: [
    {
      group: "قیمت اور پرائیویسی",
      rows: [
        {
          feature: "قیمت",
          cells: {
            munib: M.price,
            [MP]: cell.text(
              "اشتہارات کے ساتھ مفت؛ Premium سبسکرپشن (امریکا میں $12.99 ماہانہ یا $34.99 سالانہ)",
            ),
          },
        },
        {
          feature: "مفت ورژن میں اشتہارات",
          cells: { munib: M.ads, [MP]: cell.text('ہاں (Google Play: "Contains ads")') },
        },
        {
          feature: 'App Store پر "Data Used to Track You"',
          cells: {
            munib: cell.text("کوئی اشتہاری SDK نہیں؛ مہمان کا ڈیٹا ڈیوائس پر ہی رہتا ہے"),
            [MP]: cell.text("مقام، شناخت کنندگان (Identifiers)"),
          },
        },
        {
          feature: "بنیادی استعمال کے لیے اکاؤنٹ ضروری",
          cells: { munib: M.account, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "نماز",
      rows: [
        { feature: "نماز کے اوقات اور اذان", cells: { munib: M.times, [MP]: cell.yes() } },
        { feature: "قبلہ", cells: { munib: M.qibla, [MP]: cell.yes() } },
        {
          feature: "ادا کی گئی نماز درج کرنا",
          cells: { munib: M.salahLog, [MP]: cell.yes("تسلسل کے ساتھ نماز اور روزہ ٹریکر") },
        },
        {
          feature: "سنت اور نفل نمازیں",
          cells: { munib: M.sunnahSalah, [MP]: cell.unverified() },
        },
        { feature: "سنتِ رواتب کا ٹریکر", cells: { munib: P.rawatib, [MP]: cell.unverified() } },
        {
          feature: "عذر کے دن (حیض، بیماری، سفر)",
          cells: { munib: M.excusedDays, [MP]: cell.unverified() },
        },
        {
          feature: "قضا (چھوٹی ہوئی نمازوں) کا حساب",
          cells: {
            munib: M.qaza,
            [MP]: cell.yes("عبادت ٹریکر چھوٹی ہوئی نمازیں اور روزے درج کرتا ہے"),
          },
        },
        { feature: "نماز جرنل", cells: { munib: M.journal, [MP]: cell.yes("جرنل") } },
        {
          feature: "مسجد تلاش",
          cells: { munib: P.masjidFinder, [MP]: cell.yes("مساجد اور حلال مقامات") },
        },
        {
          feature: "نماز کے وقت ایپس بلاک کرنا",
          cells: { munib: P.focusLock, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "روزے",
      rows: [
        {
          feature: "روزوں کی ٹریکنگ",
          cells: { munib: M.fastingTracking, [MP]: cell.yes("نماز اور روزہ ٹریکر") },
        },
        {
          feature: "نفلی روزوں کا منصوبہ",
          cells: { munib: P.voluntaryFasting, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "ذکر اور دعائیں",
      rows: [
        { feature: "تسبیح کاؤنٹر", cells: { munib: M.tasbeeh, [MP]: cell.yes() } },
        {
          feature: "اذکار اور دعائیں",
          cells: { munib: M.zikr, [MP]: cell.yes("دعاؤں کی لائبریری") },
        },
        {
          feature: "اپنے بنائے ہوئے اذکار",
          cells: {
            munib: cell.yes("آواز سے متن (speech-to-text) کے ساتھ"),
            [MP]: cell.unverified(),
          },
        },
        {
          feature: "بغیر ہاتھ لگائے (آواز سے) تسبیح",
          cells: { munib: P.handsFreeTasbeeh, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "قرآن",
      rows: [
        { feature: "تراجم", cells: { munib: M.translations, [MP]: cell.yes() } },
        { feature: "تجوید کے رنگ", cells: { munib: M.tajweedColours, [MP]: cell.yes() } },
        { feature: "لفظ بہ لفظ", cells: { munib: M.wordByWord, [MP]: cell.unverified() } },
        {
          feature: "تفسیر",
          cells: { munib: M.tafsir, [MP]: cell.partial("Qalbox ویڈیوز کی صورت میں") },
        },
        {
          feature: "آف لائن قرآن",
          cells: { munib: M.quranOffline, [MP]: cell.partial("Premium") },
        },
        { feature: "ختم کا منصوبہ", cells: { munib: M.khatm, [MP]: cell.unverified() } },
        {
          feature: "آواز یا متن سے آیت کی شناخت",
          cells: { munib: M.verseDetector, [MP]: cell.unverified() },
        },
        { feature: "آیات پر ذاتی نوٹس", cells: { munib: P.ayahNotes, [MP]: cell.unverified() } },
      ],
    },
    {
      group: "سیکھنا اور تلاوت",
      rows: [
        {
          feature: "قرآن سیکھنا",
          cells: {
            munib: M.quranLearning,
            [MP]: cell.partial("حفظ کا ٹول؛ Premium اسباق اور لائیو کلاسز"),
          },
        },
        {
          feature: "مائیک کے ذریعے تلاوت کی مشق",
          cells: {
            munib: M.recitation,
            [MP]: cell.unverified("آفیشل لسٹنگز میں اس کا ذکر نہیں"),
          },
        },
        {
          feature: "لفظ بہ لفظ تلفظ پر رائے",
          cells: { munib: P.pronunciation, [MP]: cell.unverified() },
        },
        {
          feature: "حدیث کے مجموعے",
          cells: { munib: M.hadith, [MP]: cell.partial("AiDeen اور Qalbox ویڈیو کے ذریعے") },
        },
        {
          feature: "منظم اسلامی تعلیمی لائبریری",
          cells: { munib: M.learning, [MP]: cell.partial("Qalbox ویڈیو سیریز؛ Premium اسباق") },
        },
        { feature: "زکوٰۃ کیلکولیٹر", cells: { munib: M.zakat, [MP]: cell.unverified() } },
        {
          feature: "وراثت (میراث) کیلکولیٹر",
          cells: { munib: P.mirath, [MP]: cell.unverified() },
        },
      ],
    },
    {
      group: "کمیونٹی اور اضافی سہولیات",
      rows: [
        {
          feature: "AI اسلامی سوال و جواب اسسٹنٹ",
          cells: { munib: cell.no(), [MP]: cell.yes("AiDeen") },
        },
        { feature: "ویڈیو مواد", cells: { munib: cell.no(), [MP]: cell.yes("Qalbox") } },
        {
          feature: "کمیونٹی اور گروپ فیچرز",
          cells: { munib: P.groupKhatm, [MP]: cell.yes("Ummah Pro کمیونٹی، Quests") },
        },
        { feature: "خاندان اور بچوں کا موڈ", cells: { munib: P.family, [MP]: cell.unverified() } },
        {
          feature: "اعداد و شمار اور کامیابیاں",
          cells: { munib: M.achievements, [MP]: cell.yes("تسلسل اور کھیل جیسے Quests") },
        },
      ],
    },
    devicesGroup(
      {
        [MP]: {
          web: cell.partial("ویب سائٹ پر نماز کے اوقات کے صفحات"),
          ios: cell.yes("iPhone اور iPad؛ نیز Mac اور Vision Pro"),
          android: cell.yes(),
          appleWatch: cell.yes("App Store پر درج"),
          appleTv: cell.partial("Apple TV، App Store پر درج"),
          widgets: cell.partial("وجیٹ سے نشان لگانے کے لیے Premium ضروری"),
        },
      },
      [
        {
          feature: "وائس اسسٹنٹ شارٹ کٹس",
          cells: { munib: cell.yes("Siri اور Google Assistant"), [MP]: cell.yes("Siri") },
        },
      ],
    ),
  ],
  strengths: {
    munib: [
      "کبھی کوئی اشتہار، سبسکرپشن یا اکاؤنٹ نہیں",
      "قضا کے لیے مخصوص کیلکولیٹر اور روزانہ رفتار کا منصوبہ",
      "ڈیوائس پر قرآن کی تلاوت کی مشق، وقفے وقفے سے دہرائی کے ساتھ",
      "ہر ذکر اپنی ماخذ حدیث کے ساتھ",
      "مسجد تلاش، خاندان اور بچوں کا موڈ، اور اجتماعی ختم، بغیر اشتہارات کے",
      "سورس کوڈ GitHub پر عام دستیاب",
    ],
    [MP]: [
      "ایک ہی ایپ میں بہت وسیع سہولیات",
      "بہت بڑی اور پرانی صارف برادری (Google Play پر 100M+ ڈاؤن لوڈز)",
      "Qalbox ویڈیو لائبریری اور AiDeen AI اسسٹنٹ",
      "حلال ریسٹورنٹ اور مسجد کی تلاش، کمیونٹی فیچرز",
      "Apple Watch، iPad، Mac، Apple TV اور Vision Pro پر دستیاب",
    ],
  },
  bestFor: {
    munib:
      "وہ لوگ جو بغیر اشتہارات یا پے وال کے ایک پُرسکون، نجی ٹریکر اور قرآن کی ساتھی ایپ چاہتے ہیں۔",
    [MP]: "وہ لوگ جو نماز کے اوقات، قرآن، ویڈیو، کمیونٹی اور مقامی خدمات کے لیے ایک ہی ایپ چاہتے ہیں۔",
  },
  body: [
    { type: "h2", text: "پرائیویسی: اسٹور لیبلز کیا کہتے ہیں" },
    {
      type: "p",
      text: 'Apple ڈویلپرز سے ڈیٹا کے استعمال کی وضاحت مانگتا ہے۔ Muslim Pro کی App Store لسٹنگ "Data Used to Track You" کے تحت مقام اور شناخت کنندگان (Identifiers) ظاہر کرتی ہے۔ نومبر 2020 میں Vice کے Motherboard نے رپورٹ کیا کہ Muslim Pro کا لوکیشن ڈیٹا ایک ایسے ڈیٹا بروکر تک پہنچا جس کا تعلق امریکی فوج سے تھا؛ Muslim Pro نے اس رپورٹ کو غلط قرار دیا اور کہا کہ اس نے اپنے ڈیٹا پارٹنرز سے تعلق ختم کر دیا ہے ([Middle East Eye کی رپورٹ](https://www.middleeasteye.net/news/us-military-data-muslim-pro-apps-ties-severed))۔',
    },
    {
      type: "p",
      text: "Munib Tracker میں نہ اشتہارات ہیں نہ کوئی اشتہاری SDK۔ مہمان موڈ میں آپ کی عبادت کا ڈیٹا آپ کی ڈیوائس پر ہی رہتا ہے؛ اگر آپ سنک کے لیے سائن اِن کریں تو صرف وہی محفوظ ہوتا ہے جو سنک کے لیے ضروری ہے۔ تفصیل ہماری [پرائیویسی پالیسی](/privacy) میں ہے۔",
    },
    { type: "h2", text: "قضا اور نماز کی ٹریکنگ" },
    {
      type: "p",
      text: "دونوں ایپس میں نماز درج کی جا سکتی ہے اور چھوٹی ہوئی نمازوں کا حساب رکھا جا سکتا ہے۔ Munib Tracker کا [قضا ٹریکر](/features/qaza-salah-tracker) اس کے ساتھ پوری عمر کا کیلکولیٹر، رفتار کے تیار انتخاب اور تکمیل کی متوقع تاریخ بھی دیتا ہے، اور روزانہ ٹریکر میں چھوٹ جانے والی نمازیں خود بخود اس میں شامل ہو جاتی ہیں۔",
    },
    { type: "h2", text: "قرآن کی مشق" },
    {
      type: "p",
      text: "ہمیں Muslim Pro کی آفیشل لسٹنگز میں مائیک پر مبنی تلاوت کی مشق نہیں ملی۔ اس کا حفظ کا ٹول آڈیو سننے اور خود اپنی درجہ بندی کرنے پر مبنی ہے۔ Munib Tracker کی [قرآن کی مشق](/features/quran-practice) آپ کی ڈیوائس پر ہی سنتی ہے اور دوبارہ پڑھنے کے لیے الفاظ نشان زد کرتی ہے، بالکل مفت۔",
    },
  ],
  sources: [
    { label: "Muslim Pro — آفیشل ویب سائٹ", url: "https://www.muslimpro.com/" },
    {
      label: "Muslim Pro — Google Play لسٹنگ",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — App Store لسٹنگ",
      url: "https://apps.apple.com/us/app/muslim-pro-quran-athan/id388389451",
    },
    {
      label: "Muslim Pro ہیلپ — جرنل / ٹریکر",
      url: "https://support.muslimpro.com/help/en/articles/journal",
    },
    {
      label: "Muslim Pro ہیلپ — قرآن پڑھنا",
      url: "https://support.muslimpro.com/hc/en-us/articles/29167995711769-Quran-Read",
    },
    {
      label: "Muslim Pro ہیلپ — حفظ",
      url: "https://support.muslimpro.com/hc/en-us/articles/29158808395289-Quran-Learn-Memorisation",
    },
    { label: "Muslim Pro — AiDeen", url: "https://www.muslimpro.com/app/askaideen" },
    {
      label: "Middle East Eye — 2020 کی ڈیٹا رپورٹ",
      url: "https://www.middleeasteye.net/news/us-military-data-muslim-pro-apps-ties-severed",
    },
  ],
  faqs: [
    {
      question: "کیا Munib Tracker بغیر اشتہارات کے Muslim Pro کا اچھا متبادل ہے؟",
      answer:
        "اگر آپ Muslim Pro زیادہ تر نماز کے اوقات، ٹریکنگ، قرآن اور دعاؤں کے لیے استعمال کرتے ہیں تو Munib Tracker یہ سب بغیر اشتہارات یا سبسکرپشن کے دیتی ہے۔ اس میں ویڈیو مواد، AI اسسٹنٹ یا حلال ریسٹورنٹ کی تلاش نہیں، لیکن مسجد تلاش، خاندان موڈ اور اجتماعی ختم موجود ہیں۔",
    },
    {
      question: "کیا میں اپنا ڈیٹا Muslim Pro سے منتقل کر سکتا ہوں؟",
      answer:
        "Munib Tracker پرانی نمازوں کا ریکارڈ اسپریڈشیٹ (CSV) یا JSON سے درآمد کر سکتی ہے۔ Muslim Pro سے اس فارمیٹ میں ڈیٹا نکالا جا سکتا ہے یا نہیں، یہ Muslim Pro پر منحصر ہے۔",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/qaza-salah-tracker",
    "/features/quran-practice",
  ],
};
