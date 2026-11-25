import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import {
  devicesGroupUr as devicesGroup,
  NOT_ON_APP_STORE_UR as NOT_ON_APP_STORE,
} from "@/content/i18n/ur/compare-devices";
import { MUNIB_CELLS_UR as M, MUNIB_NF_UR as P } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

const TA = "tarteel";

export const vsTarteelUr: ComparePage = {
  slug: "munib-tracker-vs-tarteel",
  kind: "versus",
  title: "قرآن کی تلاوت کی مشق کے لیے Munib Tracker بمقابلہ Tarteel",
  seoTitle: "Munib Tracker بمقابلہ Tarteel: AI کے ساتھ قرآن کی تلاوت کا موازنہ",
  seoDescription:
    "Tarteel قرآن حفظ کرنے کی سب سے نمایاں AI ایپ ہے۔ Munib Tracker ڈیوائس پر مفت تلاوت کی مشق اور نماز ٹریکنگ دیتی ہے۔ خصوصیات اور پرائیویسی کا موازنہ کریں۔",
  description:
    "Tarteel پیڈ غلطیوں کی نشاندہی کے ساتھ AI حفظ میں سب سے آگے ہے۔ Munib Tracker ایک مکمل عبادت ٹریکر کے اندر ڈیوائس پر مفت مشق دیتی ہے۔",
  keywords: ["munib tracker بمقابلہ tarteel", "tarteel کا متبادل", "مفت AI قرآن تلاوت ایپ"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "موازنہ",
  intro: [
    "Tarteel سب سے مشہور AI قرآن ایپ ہے، جسے Google Play پر 10 ملین سے زیادہ بار ڈاؤن لوڈ کیا جا چکا ہے۔ یہ آپ کی تلاوت کے ساتھ ساتھ چلتی ہے، ایک فراخ دل مفت قرآن ریڈر دیتی ہے، اور اپنے Premium پلان میں تلاوت کے دوران چھوٹے ہوئے، غلط یا زائد الفاظ اور اعراب (تشکیل) کی غلطیاں پکڑتی ہے۔",
    "Munib Tracker کی قرآن کی مشق ایک وسیع عبادت ٹریکر کے اندر ایک نئی اور سادہ سہولت ہے۔ اس کا سامع آپ کی ڈیوائس پر چلتا ہے، مفت ہے، اور دوبارہ پڑھنے کے لیے الفاظ نشان زد کرتا ہے۔ یہاں دیانت داری سے دیکھا گیا ہے کہ دونوں میں کیا فرق ہے۔",
  ],
  apps: [MUNIB, { id: TA, name: "Tarteel", developer: "Tarteel Inc.", url: "https://tarteel.ai" }],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Tarteel چنیں اگر…",
      text: "حفظ آپ کا اصل مقصد ہے اور آپ سب سے زیادہ ترقی یافتہ AI رائے چاہتے ہیں، جس میں تلاوت کے دوران غلطیوں کی نشاندہی اور تجزیات شامل ہوں، اور آپ سبسکرپشن لینے کو تیار ہیں۔",
    },
    {
      title: "Munib Tracker چنیں اگر…",
      text: "آپ ایسی مفت تلاوت کی مشق چاہتے ہیں جس میں آپ کی آواز آپ کی ڈیوائس پر ہی رہے، اور ساتھ ہی ایک ہی ایپ میں نماز، قضا اور ذکر کی ٹریکنگ بھی ہو۔",
    },
  ],
  table: [
    {
      group: "تلاوت کی مشق",
      rows: [
        {
          feature: "آپ کی تلاوت کے ساتھ چلتی ہے",
          cells: { munib: cell.yes("مفت"), [TA]: cell.yes("مفت") },
        },
        {
          feature: "غلطیوں کی نشاندہی",
          cells: {
            munib: M.mistakeMarks,
            [TA]: cell.yes("Premium: چھوٹے ہوئے، غلط، زائد الفاظ اور اعراب کی غلطیاں"),
          },
        },
        {
          feature: "لفظ بہ لفظ تلفظ پر رائے",
          cells: {
            munib: P.pronunciation,
            [TA]: cell.partial("Premium غلطی کی نشاندہی میں اعراب کی غلطیاں"),
          },
        },
        {
          feature: "تجوید پر رائے",
          cells: {
            munib: cell.partial(
              "تجوید کی غلطیاں یہ بھی نہیں پکڑتی؛ تجوید کی رہنمائی مشق کے لیے آوازیں تجویز کرتی ہے، ڈرلز اور وضاحتوں کے ساتھ",
            ),
            [TA]: cell.no('"ابھی تجوید کی غلطیاں نہیں پکڑتی"'),
          },
        },
        {
          feature: "الفاظ / آیات چھپانا",
          cells: { munib: cell.yes("مفت"), [TA]: cell.yes("Premium") },
        },
        {
          feature: "وقفے وقفے سے دہرائی",
          cells: {
            munib: M.memorization,
            [TA]: cell.partial("اہداف کی منصوبہ بندی اور ریکارڈ، Premium"),
          },
        },
        {
          feature: "آواز کہاں پروسیس ہوتی ہے",
          cells: {
            munib: cell.text("آپ کی ڈیوائس پر؛ نہ کبھی ریکارڈ ہوتی ہے نہ اپ لوڈ"),
            [TA]: cell.text(
              "مستحکم انٹرنیٹ کنکشن ضروری؛ App Store لیبل کے مطابق آڈیو ڈیٹا جمع کیا جاتا ہے",
            ),
          },
        },
        {
          feature: "آف لائن کام کرتی ہے",
          cells: {
            munib: cell.yes("ایک بار ڈاؤن لوڈ کے بعد"),
            [TA]: cell.unverified("آواز والی سہولیات کے لیے انٹرنیٹ ضروری"),
          },
        },
      ],
    },
    {
      group: "قرآن ریڈر",
      rows: [
        {
          feature: "تراجم",
          cells: { munib: M.translations, [TA]: cell.yes("76 زبانوں میں 152 تراجم") },
        },
        { feature: "تفسیر", cells: { munib: M.tafsir, [TA]: cell.yes("45 تفاسیر") } },
        {
          feature: "قاری",
          cells: {
            munib: cell.yes("کئی قاری، آف لائن ڈاؤن لوڈ کے ساتھ"),
            [TA]: cell.yes("16 تلاوتیں، آف لائن ڈاؤن لوڈ"),
          },
        },
        { feature: "تجوید کے رنگ", cells: { munib: M.tajweedColours, [TA]: cell.yes() } },
        {
          feature: "آواز سے آیت کی شناخت",
          cells: { munib: M.verseDetector, [TA]: cell.yes("آواز سے تلاش") },
        },
        {
          feature: "پڑھنے کے اہداف",
          cells: { munib: M.khatm, [TA]: cell.yes("اہداف کی منصوبہ بندی، Premium") },
        },
        { feature: "آیات پر ذاتی نوٹس", cells: { munib: P.ayahNotes, [TA]: cell.unverified() } },
        {
          feature: "عربی مادّے سے تلاش",
          cells: { munib: P.rootSearch, [TA]: cell.unverified() },
        },
        {
          feature: "دوسروں کے ساتھ اجتماعی ختم",
          cells: { munib: P.groupKhatm, [TA]: cell.unverified() },
        },
      ],
    },
    {
      group: "قرآن سے آگے",
      rows: [
        {
          feature: "پڑھنا سیکھیں (حروف، تجوید کے اسباق)",
          cells: {
            munib: M.quranLearning,
            [TA]: cell.unverified("تجوید کے اسباق یا قاعدہ نہیں ملا"),
          },
        },
        { feature: "نماز کی ٹریکنگ", cells: { munib: M.salahLog, [TA]: cell.unverified() } },
        { feature: "قضا کا حساب", cells: { munib: M.qaza, [TA]: cell.unverified() } },
        { feature: "ذکر اور دعائیں", cells: { munib: M.zikr, [TA]: cell.unverified() } },
        {
          feature: "نماز کے اوقات اور قبلہ",
          cells: { munib: cell.yes(), [TA]: cell.unverified() },
        },
        { feature: "حدیث کے مجموعے", cells: { munib: M.hadith, [TA]: cell.unverified() } },
      ],
    },
    {
      group: "قیمت",
      rows: [
        {
          feature: "قیمت",
          cells: {
            munib: M.price,
            [TA]: cell.text(
              "بنیادی سہولیات مفت؛ Premium سبسکرپشن (امریکی App Store پر $12.99 ماہانہ سے شروع)",
            ),
          },
        },
        { feature: "اشتہارات", cells: { munib: M.ads, [TA]: cell.text("کوئی اشتہار نہیں") } },
      ],
    },
    devicesGroup({
      [TA]: {
        ios: cell.yes("iPhone اور iPad"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
    }),
  ],
  strengths: {
    munib: [
      "تلاوت کی مشق مفت ہے، چھپانے کے موڈز اور وقفے وقفے سے دہرائی کے ساتھ",
      "آواز ڈیوائس پر ہی رہتی ہے",
      "ایک مکمل عبادت ٹریکر کا حصہ: نماز، قضا، ذکر، سیکھنا",
      "کوئی سبسکرپشن نہیں",
      "ڈیوائس پر مفت تجوید کی رہنمائی اور تلفظ کی بنیادی جانچ",
    ],
    [TA]: [
      "حفظ کے لیے سب سے ترقی یافتہ AI رائے، اعراب کی غلطیوں سمیت",
      "کوئی بھی آیت ڈھونڈنے کے لیے آواز سے تلاش",
      "بہت بڑی مفت قرآن لائبریری: تراجم، تفاسیر، قاری",
      "بڑے پیمانے پر آزمودہ (10M+ ڈاؤن لوڈز)",
    ],
  },
  bestFor: {
    munib:
      "وہ لوگ جو اپنے روزانہ عبادتی معمول کے حصے کے طور پر نجی اور مفت تلاوت کی مشق چاہتے ہیں۔",
    [TA]: "سنجیدہ حفاظ جو سب سے تفصیلی AI رائے چاہتے ہیں اور سبسکرپشن لینے پر راضی ہیں۔",
  },
  body: [
    { type: "h2", text: 'ہر ایپ میں "AI تلاوت" کا مطلب کیا ہے' },
    {
      type: "p",
      text: "دونوں ایپس سنتی ہیں اور ساتھ ساتھ چلتی ہیں۔ Tarteel کی Premium غلطی کی نشاندہی دونوں میں زیادہ تفصیلی ہے: یہ تلاوت کے دوران ہی چھوٹے ہوئے، غلط اور زائد الفاظ اور اعراب کی غلطیاں دکھاتی ہے۔ Munib Tracker کا سامع ہر آیت کے بعد، یا اگر آپ چاہیں تو تلاوت کے دوران، دوبارہ پڑھنے کے الفاظ دکھاتا ہے، اور جب اسے یقین نہ ہو تو یہ بتا دیتا ہے۔ اس کی تلفظ کی جانچ Tarteel کی غلطی کی نشاندہی سے زیادہ بنیادی ہے: یہ ان الفاظ کو نشان زد کرتی ہے جو چھوٹے ہوئے یا غیر واضح لگیں، اور ملتی جلتی آواز والے حروف کی بہت سی غلطیاں نہیں پکڑ پاتی۔ پھر تجوید کی رہنمائی ان آیات سے، جن پر آپ کام کر رہے ہیں، مشق کے لیے تجوید کی آوازیں تجویز کرتی ہے۔ دونوں میں سے کوئی ایپ تجوید کی غلطیاں نہیں پکڑتی اور نہ تجوید کا اسکور دیتی ہے۔",
    },
    {
      type: "p",
      text: "کوئی بھی ایپ کسی مستند استاد کو سنانے کا متبادل نہیں۔ ہماری گائیڈ دیکھیں: [قرآن کی تلاوت کیسے بہتر کریں](/resources/quran-learning/how-to-improve-quran-recitation)۔",
    },
  ],
  sources: [
    { label: "Tarteel — آفیشل ویب سائٹ", url: "https://tarteel.ai" },
    {
      label: "Tarteel ہیلپ — کیا Tarteel مفت استعمال ہو سکتی ہے؟",
      url: "https://support.tarteel.ai/en/articles/12267535-can-i-use-tarteel-for-free",
    },
    {
      label: "Tarteel ہیلپ — تجوید کی غلطیاں",
      url: "https://support.tarteel.ai/en/articles/12414457-tarteel-is-not-recognising-my-tajweed-mistakes",
    },
    {
      label: "Tarteel بلاگ — غلطی کی نشاندہی کا تعارف",
      url: "https://tarteel.ai/blog/introducing-mistake-detection/",
    },
    { label: "Tarteel — App Store لسٹنگ", url: "https://apps.apple.com/us/app/id1391009396" },
    {
      label: "Tarteel — Google Play لسٹنگ",
      url: "https://play.google.com/store/apps/details?id=com.mmmoussa.iqra",
    },
  ],
  faqs: [
    {
      question: "کیا Tarteel کی غلطی کی نشاندہی کا کوئی مفت متبادل ہے؟",
      answer:
        "Munib Tracker کی قرآن کی مشق مفت ہے اور ہر آیت کے بعد دوبارہ پڑھنے کے لیے الفاظ نشان زد کرتی ہے۔ یہ Tarteel کی Premium غلطی کی نشاندہی سے سادہ ہے اور اعراب کی غلطیاں نہیں پکڑتی۔ اس میں تلفظ کی ایک بنیادی جانچ بھی ہے جو چھوٹے ہوئے یا غیر واضح لگنے والے الفاظ نشان زد کرتی ہے، اور تجوید کی رہنمائی بھی جو مشق کے لیے آوازیں تجویز کرتی ہے، دونوں ڈیوائس پر اور بغیر اسکور کے۔",
    },
    {
      question: "کیا Munib Tracker میری تلاوت اپ لوڈ کرتی ہے؟",
      answer:
        "نہیں۔ سامع آپ کی ڈیوائس پر چلتا ہے؛ آڈیو نہ کبھی ریکارڈ ہوتی ہے، نہ محفوظ کی جاتی ہے، نہ اپ لوڈ۔",
    },
  ],
  related: [
    "/features/quran-practice",
    "/resources/quran-learning/how-to-memorize-the-quran",
    "/compare",
  ],
};
