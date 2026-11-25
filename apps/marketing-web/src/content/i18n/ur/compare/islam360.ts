import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import {
  devicesGroupUr as devicesGroup,
  NOT_ON_APP_STORE_UR as NOT_ON_APP_STORE,
} from "@/content/i18n/ur/compare-devices";
import { MUNIB_CELLS_UR as M, MUNIB_NF_UR as P } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

const I3 = "islam360";

export const vsIslam360Ur: ComparePage = {
  slug: "munib-tracker-vs-islam360",
  kind: "versus",
  title: "Munib Tracker بمقابلہ Islam360",
  seoTitle: "Munib Tracker بمقابلہ Islam360: قرآن، حدیث اور ٹریکنگ کا موازنہ",
  seoDescription:
    "Islam360 اردو تفسیر کے ساتھ قرآن و حدیث کی تلاش میں نمایاں ہے۔ Munib Tracker بغیر اشتہارات کے نماز، قضا اور ذکر کی ٹریکنگ اور تلاوت کی مشق پر مرکوز ہے۔",
  description:
    "Islam360 قرآن اور حدیث میں گہری تلاش کی ایپ ہے۔ Munib Tracker ایک مفت، اشتہارات سے پاک عبادت ٹریکر ہے جس میں قرآن ریڈر اور تلاوت کی مشق بھی شامل ہے۔",
  keywords: ["munib tracker بمقابلہ islam360", "islam360 کا متبادل", "بغیر اشتہارات کے islam360"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "موازنہ",
  intro: [
    'Islam360 خود کو "دنیا کی پہلی قرآن اور حدیث کی قابلِ تلاش ایپلی کیشن" کہتی ہے۔ یہ خاص طور پر جنوبی ایشیا میں مقبول ہے، جہاں اس کے اردو، ہندی اور رومن اردو تراجم، معروف علماء کی تفاسیر اور حدیث کی بڑی لائبریری پسند کی جاتی ہے۔',
    "Munib Tracker کا زاویہ مختلف ہے: یہ سب سے پہلے آپ کی روزانہ عبادت (نماز، قضا اور ذکر) کی پابندی میں مدد کے لیے بنائی گئی ہے، اور ساتھ میں قرآن ریڈر، تلاوت کی مشق اور سیکھنے کی لائبریری بھی ہے۔ یہاں دونوں کا موازنہ ان کی آفیشل ویب سائٹس اور اسٹور لسٹنگز کی بنیاد پر کیا گیا ہے۔",
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
      title: "Islam360 چنیں اگر…",
      text: "آپ کی ترجیح اردو میں قرآن اور حدیث کا گہرا مطالعہ ہے: بہت سے اردو تراجم، نامور علماء کی تفاسیر، آڈیو تفسیر، اور درجۂ حدیث کے ساتھ حدیث کی سات بڑی کتابیں۔",
    },
    {
      title: "Munib Tracker چنیں اگر…",
      text: "آپ نماز ٹریک کرنا، چھوٹی ہوئی نمازیں ایک منصوبے کے ساتھ ادا کرنا، روزانہ کے اذکار کرنا اور تلاوت کی مشق کرنا چاہتے ہیں، بغیر اشتہارات یا سبسکرپشن کے۔",
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
            [I3]: cell.text(
              "اشتہارات کے ساتھ مفت؛ اشتہارات ہٹانے کے لیے سبسکرپشن (امریکا میں $9.99 ماہانہ یا $49.99 سالانہ)",
            ),
          },
        },
        {
          feature: "مفت ورژن میں اشتہارات",
          cells: { munib: M.ads, [I3]: cell.text('ہاں (Google Play: "Contains ads")') },
        },
        {
          feature: 'App Store پر "Data Used to Track You"',
          cells: {
            munib: cell.text("کوئی اشتہاری SDK نہیں؛ مہمان کا ڈیٹا ڈیوائس پر ہی رہتا ہے"),
            [I3]: cell.text("شناخت کنندگان (Identifiers)"),
          },
        },
      ],
    },
    {
      group: "نماز",
      rows: [
        { feature: "نماز کے اوقات اور اذان", cells: { munib: M.times, [I3]: cell.yes() } },
        { feature: "قبلہ", cells: { munib: M.qibla, [I3]: cell.yes() } },
        {
          feature: "ادا کی گئی نماز درج کرنا",
          cells: {
            munib: M.salahLog,
            [I3]: cell.unverified(
              'ویب سائٹ پر "Salah Tracker" کا ذکر ہے؛ اسٹور لسٹنگز میں نماز درج کرنے کی وضاحت نہیں',
            ),
          },
        },
        {
          feature: "سنت نمازیں اور رواتب",
          cells: {
            munib: cell.yes("رواتب ٹریکر (10 یا 12)، نیز تہجد، اشراق، چاشت اور مزید"),
            [I3]: cell.unverified(),
          },
        },
        { feature: "قضا کا حساب", cells: { munib: M.qaza, [I3]: cell.unverified() } },
        { feature: "مسجد تلاش", cells: { munib: P.masjidFinder, [I3]: cell.unverified() } },
      ],
    },
    {
      group: "ذکر اور دعائیں",
      rows: [
        { feature: "تسبیح کاؤنٹر", cells: { munib: M.tasbeeh, [I3]: cell.yes() } },
        {
          feature: "حوالوں کے ساتھ اذکار اور دعائیں",
          cells: { munib: M.zikr, [I3]: cell.yes("حدیث کے حوالوں کے ساتھ") },
        },
        {
          feature: "اپنے بنائے ہوئے اذکار",
          cells: {
            munib: cell.yes("آواز سے متن (speech-to-text) کے ساتھ"),
            [I3]: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "قرآن",
      rows: [
        {
          feature: "تراجم",
          cells: { munib: M.translations, [I3]: cell.yes("21+، بشمول اردو، ہندی، رومن اردو") },
        },
        {
          feature: "تفسیر",
          cells: { munib: M.tafsir, [I3]: cell.yes("نامور علماء کی 16+ تفاسیر") },
        },
        { feature: "آڈیو تفسیر", cells: { munib: M.tafsirAudio, [I3]: cell.yes() } },
        {
          feature: "لفظ بہ لفظ",
          cells: { munib: M.wordByWord, [I3]: cell.yes("عربی سے اردو") },
        },
        {
          feature: "قاری",
          cells: { munib: cell.yes("کئی قاری، آف لائن ڈاؤن لوڈ کے ساتھ"), [I3]: cell.yes("12+") },
        },
        {
          feature: "مادّے (روٹ) سے تلاش",
          cells: { munib: P.rootSearch, [I3]: cell.yes("مادّہ، موضوع اور ترجمے سے تلاش") },
        },
        {
          feature: "آواز سے آیت کی شناخت",
          cells: {
            munib: M.verseDetector,
            [I3]: cell.yes("قرآن اور حدیث میں آواز سے تلاش"),
          },
        },
        { feature: "آیات پر ذاتی نوٹس", cells: { munib: P.ayahNotes, [I3]: cell.yes("نوٹس") } },
        { feature: "ختم کا منصوبہ", cells: { munib: M.khatm, [I3]: cell.unverified() } },
        { feature: "آف لائن قرآن", cells: { munib: M.quranOffline, [I3]: cell.unverified() } },
      ],
    },
    {
      group: "سیکھنا اور تلاوت",
      rows: [
        {
          feature: "قاعدہ اور تجوید کے اسباق",
          cells: { munib: M.quranLearning, [I3]: cell.yes("آڈیو کے ساتھ قاعدے کے 27 اسباق") },
        },
        {
          feature: "مائیک کے ذریعے تلاوت کی مشق",
          cells: { munib: M.recitation, [I3]: cell.unverified("صرف آواز سے تلاش") },
        },
        {
          feature: "لفظ بہ لفظ تلفظ پر رائے",
          cells: { munib: P.pronunciation, [I3]: cell.unverified() },
        },
        {
          feature: "منظم اسلامی تعلیمی لائبریری",
          cells: { munib: M.learning, [I3]: cell.partial("کورسز اور فہم القرآن") },
        },
      ],
    },
    {
      group: "حدیث",
      rows: [
        {
          feature: "حدیث کے مجموعے",
          cells: { munib: M.hadith, [I3]: cell.yes("سات بنیادی کتابیں اور مزید") },
        },
        {
          feature: "درجۂ حدیث اور تشریح",
          cells: { munib: M.hadithDepth, [I3]: cell.yes("درجۂ حدیث اور تخریج") },
        },
      ],
    },
    {
      group: "ٹولز",
      rows: [
        { feature: "زکوٰۃ کیلکولیٹر", cells: { munib: M.zakat, [I3]: cell.unverified() } },
        {
          feature: "وراثت (میراث) کیلکولیٹر",
          cells: { munib: P.mirath, [I3]: cell.unverified() },
        },
        {
          feature: "اعداد و شمار اور تسلسل",
          cells: { munib: M.statistics, [I3]: cell.unverified() },
        },
      ],
    },
    devicesGroup(
      {
        [I3]: {
          ios: cell.yes("iPhone اور iPad"),
          android: cell.yes("Huawei AppGallery پر بھی"),
          appleWatch: NOT_ON_APP_STORE,
          appleTv: NOT_ON_APP_STORE,
          widgets: cell.yes("iPhone پر نماز کے اوقات، ٹریکر، تسبیح اور آیت کے وجیٹس"),
        },
      },
      [
        {
          feature: "کمپیوٹر",
          cells: { munib: M.webApp, [I3]: cell.text("Mac (Apple silicon)") },
        },
      ],
    ),
  ],
  strengths: {
    munib: [
      "نماز اور قضا کی تفصیلی ٹریکنگ، ادائیگی کے منصوبے کے ساتھ",
      "ماخذ حدیث کے ساتھ رہنمائی والے اذکار کے سیشن",
      "ڈیوائس پر تلاوت کی مشق اور وقفے وقفے سے دہرائی",
      "نہ اشتہارات، نہ سبسکرپشن، نہ اکاؤنٹ",
      "وجیٹس، Apple Watch کی ساتھی ایپ اور Wear OS ٹائلز",
      "آیات پر نوٹس اور عربی مادّے سے تلاش",
    ],
    [I3]: [
      "عربی لفظ، مادّے، موضوع اور ترجمے سے قرآن میں گہری تلاش",
      "بہت سے اردو تراجم اور نامور علماء کی تفاسیر",
      "درجۂ حدیث اور تخریج کے ساتھ حدیث کی بڑی لائبریری",
      "آڈیو کے ساتھ قاعدے کے اسباق",
      "بڑی اور پرانی صارف برادری (Google Play پر 10M+ ڈاؤن لوڈز)",
    ],
  },
  bestFor: {
    munib:
      "وہ لوگ جو روزانہ عبادت کی عادات بنانا اور ٹریک کرنا چاہتے ہیں، ساتھ میں قرآن پڑھنا اور اس کی مشق بھی۔",
    [I3]: "طلبہ اور قارئین، خاص طور پر اردو بولنے والے، جو قرآن اور حدیث کی گہری تحقیق کے ٹولز چاہتے ہیں۔",
  },
  body: [
    { type: "h2", text: "شروعات کے مختلف نکتے" },
    {
      type: "p",
      text: "Islam360 بنیادی طور پر تلاش اور مطالعے کا ٹول ہے۔ Munib Tracker بنیادی طور پر ایک ٹریکر ہے: یہ روزانہ آپ کی نماز، قضا اور اذکار کا ریکارڈ رکھتی ہے اور آپ کی پیش رفت دکھاتی ہے۔ بہت سے لوگ بجا طور پر دونوں استعمال کر سکتے ہیں: تحقیق کے لیے Islam360 اور روزمرہ معمول کے لیے Munib Tracker۔",
    },
    { type: "h2", text: "قرآن اور حدیث میں گہرائی" },
    {
      type: "p",
      text: "اردو ترجمے اور تفسیر کے انتخاب میں Islam360، Munib Tracker سے زیادہ دیتی ہے۔ Munib Tracker کے [قرآن ریڈر](/features/quran) میں 25 تراجم، ضرورت کے وقت تفسیر اور لفظ بہ لفظ ترجمہ ہے، اور اس کا زور آف لائن پڑھنے اور ختم کے منصوبے پر ہے۔",
    },
  ],
  sources: [
    { label: "Islam360 — آفیشل ویب سائٹ", url: "https://www.theislam360.com/" },
    { label: "Islam360 — خصوصیات", url: "https://www.theislam360.com/features" },
    { label: "Islam360 — قرآن سیکھیں", url: "https://www.theislam360.com/learn-quran" },
    {
      label: "Islam360 — Google Play لسٹنگ",
      url: "https://play.google.com/store/apps/details?id=com.islam360",
    },
    {
      label: "Islam360 — App Store لسٹنگ",
      url: "https://apps.apple.com/us/app/islam360-quran-hadith-qibla/id1006098149",
    },
  ],
  faqs: [
    {
      question: "کیا Munib Tracker اردو میں دستیاب ہے؟",
      answer:
        "جی ہاں۔ ایپ کا انٹرفیس اردو میں (دائیں سے بائیں لے آؤٹ کے ساتھ) دستیاب ہے، اور قرآن کے ساتھ اردو ترجمہ بھی شامل ہے۔ Islam360 میں اردو تراجم اور تفاسیر زیادہ ہیں۔",
    },
    {
      question: "حدیث کے لیے کون سی ایپ بہتر ہے؟",
      answer:
        "Islam360 کی حدیث لائبریری زیادہ گہری ہے، جس میں درجۂ حدیث اور تخریج شامل ہیں۔ Munib Tracker میں دو مجموعے شامل ہیں اور چھ مزید ضرورت کے وقت ڈاؤن لوڈ ہوتے ہیں۔",
    },
  ],
  related: ["/compare/munib-tracker-vs-muslim-pro", "/features/quran", "/features/salah-tracker"],
};
