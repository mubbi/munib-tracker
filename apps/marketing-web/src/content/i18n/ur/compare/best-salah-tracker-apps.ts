import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import {
  devicesGroupUr as devicesGroup,
  NOT_ON_APP_STORE_UR as NOT_ON_APP_STORE,
} from "@/content/i18n/ur/compare-devices";
import { MUNIB_CELLS_UR as M, MUNIB_NF_UR as P } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

export const bestSalahTrackerAppsUr: ComparePage = {
  slug: "best-salah-tracker-apps",
  kind: "roundup",
  title: "نماز ٹریکر ایپس کا موازنہ: آپ کے لیے کون سی بہتر ہے؟",
  seoTitle: "بہترین نماز ٹریکر ایپس (2026): نماز اور قضا ٹریکرز کا موازنہ",
  seoDescription:
    "مقبول نماز ٹریکر ایپس کا حوالوں کے ساتھ موازنہ: Munib Tracker، Muslim Pro، Athan، Pillars، FivePrayer، Just Pray اور 5te5۔ ٹریکنگ، قضا، اشتہارات اور قیمت۔",
  description:
    "سات مقبول نماز ٹریکر ایپس آمنے سامنے: نماز کا ریکارڈ، قضا، ذکر، قرآن، اشتہارات، قیمت اور پرائیویسی لیبلز۔",
  keywords: [
    "بہترین نماز ٹریکر ایپس",
    "نماز ٹریکر ایپ",
    "نماز ٹریکر ایپس کا موازنہ",
    "قضا نماز ٹریکر ایپ",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "جائزہ",
  intro: [
    "نماز ٹریکر آپ کو پانچوں وقت کی نماز کا ریکارڈ رکھنے اور وقت کے ساتھ اپنی پابندی دیکھنے میں مدد دیتا ہے۔ کچھ ایپس یہیں تک محدود ہیں؛ کچھ میں قضا نمازوں کا حساب، اذکار، قرآن یا سیکھنے کا مواد بھی ہوتا ہے۔ کاروباری ماڈل بھی مختلف ہیں: کچھ اشتہارات دکھاتی ہیں، کچھ سبسکرپشن لیتی ہیں، اور کچھ مفت ہیں۔",
    'ہم نے سات مقبول ایپس کا موازنہ ہر ایپ کی آفیشل ویب سائٹ اور اس کی App Store اور Google Play لسٹنگز کی بنیاد پر کیا ہے۔ Munib Tracker ہماری اپنی ایپ ہے، اس لیے ہم نے جدول کو صرف حقائق تک رکھا ہے اور یہ بھی بتایا ہے کہ کہاں کوئی دوسری ایپ آپ کے لیے زیادہ موزوں ہے۔ جہاں ہم کسی خصوصیت کی تصدیق آفیشل ذریعے سے نہیں کر سکے، وہاں اندازہ لگانے کے بجائے "تصدیق نہیں ہوئی" لکھا ہے۔',
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
      title: "قضا (چھوٹی ہوئی نمازوں) کے لیے",
      text: "Munib Tracker اور Muslim Pro دونوں چھوٹی ہوئی نمازوں کا حساب رکھتی ہیں۔ Munib Tracker اس کے ساتھ کیلکولیٹر اور روزانہ رفتار کا منصوبہ بھی دیتی ہے۔ 5te5 قضا کی سہولت ایک الگ مفت ایپ میں دیتی ہے۔",
    },
    {
      title: "بغیر اشتہار اور بغیر سبسکرپشن کے لیے",
      text: "Munib Tracker اور 5te5 مفت ہیں اور ان میں کوئی ان-ایپ خریداری نہیں۔ Pillars میں اشتہار نہیں، لیکن وہ Premium پلان فروخت کرتی ہے۔",
    },
    {
      title: "نماز سیکھنے کے لیے",
      text: "Just Pray اور 5te5 میں نماز سیکھنے کی گائیڈز اور ویڈیوز ہیں۔ Munib Tracker کی سیکھنے کی لائبریری میں 24 اسباق پر مشتمل نماز گائیڈ ہے۔",
    },
    {
      title: "توجہ ہٹانے والی چیزیں روکنے کے لیے",
      text: "Munib Tracker کا نماز فوکس لاک مفت ہے۔ Pillars (Premium) اور FivePrayer بھی نماز کے وقت ایپس بلاک یا لاک کر سکتی ہیں۔",
    },
    {
      title: "ہر چیز ایک ہی ایپ میں چاہیں تو",
      text: "Muslim Pro میں سب سے زیادہ سہولیات ہیں، جن میں ویڈیو، کمیونٹی اور حلال مقامات کی تلاش شامل ہے، اشتہارات کے ساتھ یا Premium میں۔",
    },
  ],
  table: [
    {
      group: "ٹریکنگ",
      rows: [
        {
          feature: "ادا کی گئی نماز درج کرنا",
          cells: {
            munib: M.salahLog,
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes("وقت پر یا تاخیر سے، جرنل"),
            "5te5": cell.yes("40 دن کا عادت چیلنج"),
          },
        },
        {
          feature: "قضا (چھوٹی ہوئی نمازوں) کا حساب",
          cells: {
            munib: cell.yes("کیلکولیٹر اور منصوبہ"),
            "muslim-pro": cell.yes(),
            athan: cell.unverified(),
            pillars: cell.partial("ادا شدہ کے طور پر نشان لگانا"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.partial("قضا کے لیے الگ ایپ"),
          },
        },
        {
          feature: "سنت نمازیں اور رواتب",
          cells: {
            munib: cell.yes("رواتب ٹریکر (10 یا 12)، نیز تہجد، اشراق، چاشت اور مزید"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "عذر کے دن (حیض)",
          cells: {
            munib: cell.yes("حیض، بیماری اور سفر"),
            "muslim-pro": cell.unverified(),
            athan: cell.yes("ماہواری موڈ"),
            pillars: cell.yes("ماہواری موڈ"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "اعداد و شمار اور تسلسل",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.yes(),
            fiveprayer: cell.yes(),
            justpray: cell.yes("کیلنڈر"),
            "5te5": cell.unverified(),
          },
        },
      ],
    },
    {
      group: "باقی سب کچھ",
      rows: [
        {
          feature: "نماز کے اوقات",
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
          feature: "ذکر اور تسبیح",
          cells: {
            munib: cell.yes(),
            "muslim-pro": cell.yes(),
            athan: cell.yes(),
            pillars: cell.partial("Apple Watch، Premium"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "قرآن ریڈر",
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
          feature: "نماز سیکھنے کی گائیڈ",
          cells: {
            munib: cell.yes("نماز گائیڈ"),
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.partial("مضامین"),
            justpray: cell.yes(),
            "5te5": cell.yes("ویڈیوز"),
          },
        },
        {
          feature: "قرآن کی تلاوت کی مشق (مائیک)",
          cells: {
            munib: cell.yes("ڈیوائس پر ہی"),
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
      group: "توجہ، مقام اور لوگ",
      rows: [
        {
          feature: "نماز کے وقت ایپس بلاک کرنا",
          cells: {
            munib: P.focusLock,
            "muslim-pro": cell.unverified(),
            athan: cell.unverified(),
            pillars: cell.yes("PrayFirst، Premium"),
            fiveprayer: cell.yes("نماز کے دوران ایپ لاک"),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "مسجد تلاش",
          cells: {
            munib: P.masjidFinder,
            "muslim-pro": cell.yes(),
            athan: cell.unverified(),
            pillars: cell.partial("مسجد کے اوقات بیٹا میں"),
            fiveprayer: cell.unverified(),
            justpray: cell.unverified(),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "دوستوں کے ساتھ نماز",
          cells: {
            munib: P.partner,
            "muslim-pro": cell.partial("کمیونٹی فیچرز"),
            athan: cell.unverified(),
            pillars: cell.unverified(),
            fiveprayer: cell.yes("نماز کے حلقے"),
            justpray: cell.yes("نماز کے حلقے"),
            "5te5": cell.unverified(),
          },
        },
        {
          feature: "خاندان اور بچوں کا موڈ",
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
      group: "قیمت اور پرائیویسی",
      rows: [
        {
          feature: "اشتہارات",
          cells: {
            munib: cell.text("نہیں"),
            "muslim-pro": cell.text("ہاں، مفت ورژن میں"),
            athan: cell.text("ہاں، مفت ورژن میں"),
            pillars: cell.text("نہیں"),
            fiveprayer: cell.text("کوئی اشتہار نہ ہونے کا دعویٰ"),
            justpray: cell.text("Play پر اشتہار نہ ہونے کا لیبل"),
            "5te5": cell.text("نہیں"),
          },
        },
        {
          feature: "پیڈ پلان",
          cells: {
            munib: cell.text("کوئی نہیں"),
            "muslim-pro": cell.text("Premium"),
            athan: cell.text("Premium / اشتہارات ہٹائیں"),
            pillars: cell.text("Premium"),
            fiveprayer: cell.text("Pro"),
            justpray: cell.text("Pro"),
            "5te5": cell.text("کوئی نہیں"),
          },
        },
        {
          feature: 'App Store پر "Data Used to Track You"',
          cells: {
            munib: cell.text("کوئی اشتہاری SDK نہیں"),
            "muslim-pro": cell.text("مقام، شناخت کنندگان (Identifiers)"),
            athan: cell.text("رابطے کی معلومات"),
            pillars: cell.text("کچھ ظاہر نہیں کیا گیا"),
            fiveprayer: cell.text("شناخت کنندگان (Identifiers)"),
            justpray: cell.text("مقام، شناخت کنندگان، استعمال کا ڈیٹا"),
            "5te5": cell.text("کچھ ظاہر نہیں کیا گیا"),
          },
        },
      ],
    },
    devicesGroup({
      "muslim-pro": {
        web: cell.partial("ویب سائٹ پر نماز کے اوقات کے صفحات"),
        ios: cell.yes("iPhone اور iPad"),
        android: cell.yes(),
        appleWatch: cell.yes("App Store پر درج"),
        appleTv: cell.partial("App Store پر درج"),
        widgets: cell.partial("نشان لگانے کے لیے Premium ضروری"),
      },
      athan: {
        ios: cell.partial("iPhone؛ iPad ورژن درج نہیں"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes(),
      },
      pillars: {
        ios: cell.yes("iPhone اور iPad"),
        android: cell.yes(),
        appleWatch: cell.yes("Premium"),
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes(),
      },
      fiveprayer: { ios: cell.yes("App Store پر دستیاب"), android: cell.yes() },
      justpray: { ios: cell.yes("App Store پر دستیاب"), android: cell.yes() },
      "5te5": { ios: cell.yes("App Store پر دستیاب"), android: cell.yes() },
    }),
  ],
  strengths: {
    munib: [
      "قضا کیلکولیٹر اور منصوبہ",
      "تلاوت کی مشق",
      "نہ اشتہارات، نہ پیڈ پلان",
      "ویب، TV، Apple Watch اور Wear OS",
    ],
    "muslim-pro": [
      "سب سے وسیع سہولیات",
      "ویڈیو، کمیونٹی، حلال مقامات کی تلاش",
      "سب سے زیادہ صارفین",
    ],
    athan: ["نماز کے اوقات کی پرانی اور معتبر ایپ", "روزانہ اہداف اور تسلسل", "ماہواری موڈ"],
    pillars: ["نہ اشتہار، نہ اکاؤنٹ", "ایپ بلاکنگ اور فجر الارم (Premium)", "صاف ستھرا ڈیزائن"],
    fiveprayer: ["نماز کے دوران ایپ لاک", "دوستوں کے ساتھ نماز کے حلقے", "قرآن ریڈر"],
    justpray: ["تصویروں کے ساتھ نماز سیکھنے کی گائیڈز", "نماز کے حلقے", "فجر الارم"],
    "5te5": [
      "مکمل طور پر مفت، غیر منافع بخش",
      "نئے سیکھنے والوں کے لیے 40 دن کا چیلنج",
      "کوئی ڈیٹا جمع نہیں کیا جاتا (Play)",
    ],
  },
  bestFor: {
    munib: "نماز، قضا اور ذکر کی مفت اور نجی ٹریکنگ، ساتھ میں قرآن اور سیکھنے کا مواد بھی۔",
    "muslim-pro": "ہر چیز کے لیے ایک ایپ، ویڈیو اور کمیونٹی سمیت۔",
    athan: "سادہ ریکارڈ کے ساتھ نماز کے قابلِ اعتماد اوقات۔",
    pillars: "توجہ کے ٹولز کے ساتھ ایک سادہ نماز ایپ۔",
    fiveprayer: "دوستوں کے ساتھ وقت پر نماز اور ایپ لاک۔",
    justpray: "نئے سیکھنے والے جو تصویروں کے ساتھ رہنمائی چاہتے ہیں۔",
    "5te5": "عادت بنانے والے نئے نمازی، مکمل طور پر مفت۔",
  },
  body: [
    { type: "h2", text: "نماز ٹریکر کیسے منتخب کریں" },
    {
      type: "ul",
      items: [
        "**کیا آپ کی قضا نمازیں باقی ہیں؟** ایسی ایپ چنیں جس میں قضا کا باقاعدہ حساب ہو۔ دیکھیں [قضا نماز کیا ہے](/resources/salah/what-is-qaza-salah)۔",
        '**کیا آپ کو اشتہارات سے فرق پڑتا ہے؟** عبادت کی ایپ میں اشتہارات بہت سے لوگوں کی توجہ بٹاتے ہیں؛ Play Store پر "Contains ads" کا لیبل دیکھ لیں۔',
        '**پرائیویسی لیبل کیا کہتا ہے؟** App Store پر "Data Used to Track You" والا حصہ دیکھیں۔',
        "**کیا آپ کو صرف ٹریکنگ سے زیادہ چاہیے؟** اگر آپ اذکار اور قرآن بھی چاہتے ہیں تو ایک ہی ایپ میں سب کچھ ہونے سے بار بار ایپ بدلنی نہیں پڑتی۔",
        "**کیا آپ اسے استعمال کرتے رہیں گے؟** بہترین ٹریکر وہی ہے جسے آپ روز کھولیں۔ دو ایپس ایک ایک ہفتہ آزما کر دیکھیں۔",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "ہم نے کیسے جانچا",
      text: "ہر معلومات ایپ کی آفیشل ویب سائٹ، App Store لسٹنگ یا Google Play لسٹنگ (امریکی اسٹور) سے لی گئی ہے اور دی گئی تاریخ پر جانچی گئی ہے۔ خصوصیات اکثر بدلتی رہتی ہیں، اس لیے فیصلہ کرنے سے پہلے لسٹنگز ضرور دیکھ لیں۔ کوئی بات پرانی نظر آئے؟ [ہمیں بتائیں](/contact)، ہم درست کر دیں گے۔",
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
    { label: "Pillars — آفیشل ویب سائٹ (/ai)", url: "https://thepillarsapp.com/ai" },
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
      question: "سب سے بہترین نماز ٹریکر ایپ کون سی ہے؟",
      answer:
        "یہ آپ کی ضرورت پر منحصر ہے۔ اگر آپ کی قضا نمازیں باقی ہیں تو ایسی ایپ چنیں جس میں قضا کا باقاعدہ حساب ہو۔ اگر سب کچھ ایک جگہ چاہیے تو Muslim Pro سب سے وسیع ہے۔ اگر نہ اشتہار چاہیے نہ سبسکرپشن، تو Munib Tracker اور 5te5 دونوں مفت ہیں۔",
    },
    {
      question: "کیا بغیر اشتہارات کے کوئی مفت نماز ٹریکر موجود ہے؟",
      answer:
        "جی ہاں۔ Munib Tracker اور 5te5 میں نہ اشتہارات ہیں نہ ان-ایپ خریداری۔ Pillars میں اشتہار نہیں اور ایک اختیاری Premium پلان موجود ہے۔",
    },
  ],
  related: [
    "/features/salah-tracker",
    "/features/qaza-salah-tracker",
    "/compare/islamic-habit-tracker-apps",
  ],
};
