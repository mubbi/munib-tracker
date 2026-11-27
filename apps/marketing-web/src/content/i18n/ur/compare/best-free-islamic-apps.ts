import { cell, MUNIB } from "@/content/compare/shared";
import {
  devicesGroupUr as devicesGroup,
  NOT_ON_APP_STORE_UR as NOT_ON_APP_STORE,
} from "@/content/i18n/ur/compare-devices";
import { MUNIB_CELLS_UR as M } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

const QC = "quran-com";
const PL = "pillars";
const AT = "athan";
const MP = "muslim-pro";
const I3 = "islam360";
const TA = "tarteel";

/** The Quran.com app is a Qur'an reader; its listings describe nothing else. */
const NOT_IN_LISTINGS = cell.unverified("اس کی لسٹنگز میں ذکر نہیں");

export const bestFreeIslamicAppsUr: ComparePage = {
  slug: "best-free-islamic-apps",
  kind: "roundup",
  title: "بہترین مفت اسلامی ایپس: ہر ایپ میں «مفت» کا اصل مطلب کیا ہے؟",
  seoTitle: "بہترین مفت اسلامی ایپس (2026): نہ اشتہارات، نہ سبسکرپشن",
  seoDescription:
    "مفت اسلامی ایپس کا حوالوں کے ساتھ موازنہ: Munib Tracker، Quran.com، Pillars، Athan، Muslim Pro، Islam360 اور Tarteel۔ اشتہارات، پیڈ پلان، اکاؤنٹ اور پرائیویسی لیبلز۔",
  description:
    "سات اسلامی ایپس جو آپ مفت ڈاؤن لوڈ کر سکتے ہیں، اور ہر ایک میں «مفت» میں کیا شامل ہے: اشتہارات، پیڈ پلان، اکاؤنٹ، پرائیویسی لیبلز اور خصوصیات۔",
  keywords: [
    "بہترین مفت اسلامی ایپس",
    "بغیر اشتہارات کے مفت اسلامی ایپ",
    "بغیر سبسکرپشن کے مفت اسلامی ایپس",
    "بغیر ان-ایپ خریداری کے اسلامی ایپس",
  ],
  cluster: "comparison",
  published: "2026-11-27",
  updated: "2026-11-27",
  eyebrow: "جائزہ",
  intro: [
    "تقریباً ہر اسلامی ایپ ڈاؤن لوڈ کرنے کے لیے مفت ہے، لیکن «مفت» کا مطلب ہر جگہ ایک جیسا نہیں۔ کچھ ایپس مفت ہیں اور ان میں خریدنے کو کچھ نہیں۔ کچھ میں اشتہارات نہیں، مگر بعض خصوصیات پیڈ پلان کے لیے رکھی گئی ہیں۔ اور کچھ اس لیے مفت ہیں کہ وہ اشتہارات دکھاتی ہیں، جنہیں ہٹانے کے لیے سبسکرپشن ہے۔",
    'ہم نے سات معروف ایپس کا موازنہ ہر ایپ کی آفیشل ویب سائٹ اور اس کی App Store اور Google Play لسٹنگز کی بنیاد پر کیا ہے۔ Munib Tracker ہماری اپنی ایپ ہے، اس لیے ہم نے جدول کو صرف حقائق تک رکھا ہے اور صاف بتایا ہے کہ کہاں کوئی دوسری ایپ بہتر مفت انتخاب ہے۔ جہاں ہم کسی بات کی تصدیق آفیشل ذریعے سے نہیں کر سکے، وہاں اندازہ لگانے کے بجائے "تصدیق نہیں ہوئی" لکھا ہے۔',
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
      title: "مفت، اور خریدنے کو کچھ نہیں",
      text: "Munib Tracker اور Quran.com ایپ میں نہ اشتہارات ہیں نہ ان-ایپ خریداری۔ Munib Tracker میں نماز، قضا، ذکر، قرآن اور سیکھنے کا مواد ہے؛ Quran.com ایپ قرآن ریڈر ہے۔",
    },
    {
      title: "اگر آپ صرف قرآن پڑھنا چاہتے ہیں",
      text: "Quran.com ایپ زیادہ سادہ مفت انتخاب ہے: ایک غیر منافع بخش ادارے کا یکسو، اشتہارات سے پاک مصحف، جس کا کوڈ اوپن سورس ہے۔",
    },
    {
      title: "اشتہارات نہیں، مگر پیڈ پلان ہے",
      text: "Pillars اور Tarteel اشتہارات نہیں دکھاتیں۔ دونوں نے کچھ خصوصیات Premium کے لیے رکھی ہیں: Pillars نے مکمل اذان، ایپ بلاکنگ اور Apple Watch ایپ؛ Tarteel نے غلطی کی نشاندہی۔",
    },
    {
      title: "اشتہارات کے ساتھ مفت",
      text: "Athan، Muslim Pro اور Islam360 اشتہارات کے ساتھ مفت ہیں اور سبسکرپشن فروخت کرتی ہیں۔ تینوں میں Athan کے Premium کی درج قیمت سب سے کم ہے۔",
    },
    {
      title: "حدیث اور اردو تفسیر کے لیے",
      text: "اگر اشتہارات سے فرق نہیں پڑتا تو اردو میں قرآن اور حدیث کے گہرے مطالعے کے لیے Islam360 بہتر مفت انتخاب ہے۔",
    },
  ],
  table: [
    {
      group: "«مفت» میں کیا شامل ہے",
      rows: [
        {
          feature: "قیمت اور ان-ایپ خریداری",
          cells: {
            munib: M.price,
            [QC]: cell.text("مفت؛ اس کی App Store لسٹنگ پر کوئی ان-ایپ خریداری نہیں"),
            [PL]: cell.text(
              "بنیادی سہولیات مفت؛ Premium امریکا میں $11.99 ماہانہ یا $49.99 سالانہ سے",
            ),
            [AT]: cell.text(
              "اشتہارات کے ساتھ مفت؛ Athan Premium (امریکا میں $1.99 ماہانہ یا $11.99 سالانہ) یا ایک بار کی ادائیگی سے اشتہارات ہٹائیں",
            ),
            [MP]: cell.text(
              "اشتہارات کے ساتھ مفت؛ Premium سبسکرپشن (امریکا میں $12.99 ماہانہ یا $34.99 سالانہ)",
            ),
            [I3]: cell.text(
              "اشتہارات کے ساتھ مفت؛ اشتہارات ہٹانے کے لیے سبسکرپشن (امریکا میں $9.99 ماہانہ یا $49.99 سالانہ)",
            ),
            [TA]: cell.text(
              "بنیادی سہولیات مفت؛ Premium سبسکرپشن (امریکی App Store پر $12.99 ماہانہ سے شروع)",
            ),
          },
        },
        {
          feature: "اشتہارات",
          cells: {
            munib: M.ads,
            [QC]: cell.text('کوئی اشتہار نہیں (لسٹنگ میں "ad-free" لکھا ہے)'),
            [PL]: cell.text("کوئی اشتہار نہیں"),
            [AT]: cell.text('ہاں (Google Play: "Contains ads")'),
            [MP]: cell.text('ہاں (Google Play: "Contains ads")'),
            [I3]: cell.text('ہاں (Google Play: "Contains ads")'),
            [TA]: cell.text("کوئی اشتہار نہیں"),
          },
        },
        {
          feature: "اکاؤنٹ ضروری",
          cells: {
            munib: M.account,
            [QC]: cell.unverified(),
            [PL]: cell.text("ضروری نہیں (سائن اَپ نہیں)"),
            [AT]: cell.unverified(),
            [MP]: cell.unverified(),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: 'App Store پر "Data Used to Track You"',
          cells: {
            munib: cell.text("کوئی اشتہاری SDK نہیں؛ مہمان کا ڈیٹا ڈیوائس پر ہی رہتا ہے"),
            [QC]: cell.text("کچھ ظاہر نہیں کیا گیا"),
            [PL]: cell.text("کچھ ظاہر نہیں کیا گیا"),
            [AT]: cell.text("رابطے کی معلومات"),
            [MP]: cell.text("مقام، شناخت کنندگان (Identifiers)"),
            [I3]: cell.text("شناخت کنندگان (Identifiers)"),
            [TA]: cell.text("کچھ ظاہر نہیں کیا گیا"),
          },
        },
        {
          feature: "سورس کوڈ سب کے لیے دستیاب",
          cells: {
            munib: M.openSource,
            [QC]: cell.yes("GitHub پر اوپن سورس؛ Android ایپ GPL-3.0 لائسنس کے تحت"),
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
      group: "بنیادی خصوصیات",
      rows: [
        {
          feature: "نماز کے اوقات اور اذان",
          cells: {
            munib: M.times,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes("مکمل اذان Premium میں"),
            [AT]: cell.yes(),
            [MP]: cell.yes(),
            [I3]: cell.yes(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "قبلہ",
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
          feature: "نماز کی ٹریکنگ",
          cells: {
            munib: M.salahLog,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.yes("مفت ٹریکر"),
            [AT]: cell.yes("روزانہ ریکارڈ اور تسلسل"),
            [MP]: cell.yes("تسلسل کے ساتھ نماز اور روزہ ٹریکر"),
            [I3]: cell.unverified(
              'ویب سائٹ پر "Salah Tracker" کا ذکر ہے؛ اسٹور لسٹنگز میں نماز درج کرنے کی وضاحت نہیں',
            ),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "قضا (چھوٹی ہوئی نمازوں) کا حساب",
          cells: {
            munib: M.qaza,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.partial(
              "نماز کو تاخیر سے/ادا شدہ کے طور پر نشان لگانا؛ قضا روزوں کا کاؤنٹر",
            ),
            [AT]: cell.unverified("لسٹنگز میں ذکر نہیں"),
            [MP]: cell.yes("عبادت ٹریکر چھوٹی ہوئی نمازیں اور روزے درج کرتا ہے"),
            [I3]: cell.unverified(),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "قرآن ریڈر",
          cells: {
            munib: M.quranReader,
            [QC]: cell.yes("مصحف کے صفحات، قاری اور ڈاؤن لوڈ ہونے والے تراجم"),
            [PL]: cell.no("Pillars کے اپنے بلاگ کے مطابق"),
            [AT]: cell.yes("45+ زبانوں میں تراجم"),
            [MP]: cell.yes("آف لائن قرآن کے لیے Premium ضروری"),
            [I3]: cell.yes("21+ تراجم، 16+ تفاسیر"),
            [TA]: cell.yes("76 زبانوں میں 152 تراجم"),
          },
        },
        {
          feature: "قرآن کی تلاوت کی مشق (مائیک)",
          cells: {
            munib: M.recitation,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified(),
            [MP]: cell.unverified("آفیشل لسٹنگز میں اس کا ذکر نہیں"),
            [I3]: cell.unverified("صرف آواز سے تلاش"),
            [TA]: cell.yes("آپ کی تلاوت مفت فالو کرتی ہے؛ غلطی کی نشاندہی کے لیے Premium ضروری"),
          },
        },
        {
          feature: "ذکر اور دعائیں",
          cells: {
            munib: M.zikr,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.partial("تسبیح صرف Apple Watch پر، Premium"),
            [AT]: cell.yes("تسبیح کاؤنٹر، آڈیو کے ساتھ اذکار"),
            [MP]: cell.yes("تسبیح کاؤنٹر اور دعاؤں کی لائبریری"),
            [I3]: cell.yes("حدیث کے حوالوں کے ساتھ"),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "حدیث کے مجموعے",
          cells: {
            munib: M.hadith,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified("IslamicFinder ویب سائٹ پر حدیث کا حصہ"),
            [MP]: cell.partial("AiDeen اور Qalbox ویڈیو کے ذریعے"),
            [I3]: cell.yes("سات بنیادی کتابیں اور مزید"),
            [TA]: cell.unverified(),
          },
        },
        {
          feature: "اسلامی تعلیم کی لائبریری",
          cells: {
            munib: M.learning,
            [QC]: NOT_IN_LISTINGS,
            [PL]: cell.unverified(),
            [AT]: cell.unverified("الگ Athan Academy ایپ"),
            [MP]: cell.partial("Qalbox ویڈیو سیریز؛ Premium اسباق"),
            [I3]: cell.partial("کورسز اور فہم القرآن"),
            [TA]: cell.unverified("تجوید کے اسباق یا قاعدہ نہیں ملا"),
          },
        },
      ],
    },
    devicesGroup({
      [QC]: {
        web: cell.partial("Quran.com ویب سائٹ"),
        ios: cell.yes("iPhone اور iPad؛ نیز Mac اور Vision Pro"),
        android: cell.yes("Quran for Android"),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
      },
      [PL]: {
        ios: cell.yes("iPhone اور iPad"),
        android: cell.yes(),
        appleWatch: cell.yes("Premium"),
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes("مفت"),
      },
      [AT]: {
        web: cell.partial("IslamicFinder ویب سائٹ"),
        ios: cell.partial("iPhone؛ اس کی App Store لسٹنگ پر iPad ورژن نہیں"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes(),
      },
      [MP]: {
        web: cell.partial("ویب سائٹ پر نماز کے اوقات کے صفحات"),
        ios: cell.yes("iPhone اور iPad؛ نیز Mac اور Vision Pro"),
        android: cell.yes(),
        appleWatch: cell.yes("App Store پر درج"),
        appleTv: cell.partial("Apple TV، App Store پر درج"),
        widgets: cell.partial("وجیٹ سے نشان لگانے کے لیے Premium ضروری"),
      },
      [I3]: {
        ios: cell.yes("iPhone اور iPad"),
        android: cell.yes("Huawei AppGallery پر بھی"),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes("iPhone پر نماز کے اوقات، ٹریکر، تسبیح اور آیت کے وجیٹس"),
      },
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
      "مفت، نہ اشتہارات، نہ سبسکرپشن، نہ ان-ایپ خریداری",
      "اکاؤنٹ کی ضرورت نہیں (مہمان موڈ)",
      "نماز، قضا، ذکر، قرآن، حدیث اور سیکھنے کا مواد ایک ہی ایپ میں",
      "ویب، TV، Apple Watch اور Wear OS",
      "سورس کوڈ GitHub پر دستیاب (غیر تجارتی لائسنس)",
    ],
    [QC]: [
      "مفت اور اشتہارات سے پاک، کوئی ان-ایپ خریداری درج نہیں",
      "اوپن سورس کوڈ، غیر منافع بخش ادارے کے زیرِ انتظام",
      "قاریوں اور تراجم کے ساتھ یکسو مصحف",
    ],
    [PL]: [
      "نہ اشتہار، نہ اکاؤنٹ",
      "مفت نماز ٹریکر اور وجیٹس",
      "ایپ بلاکنگ اور اسمارٹ فجر الارم (Premium)",
    ],
    [AT]: [
      "نماز کے اوقات اور اذان کی پرانی اور معتبر ایپ",
      "روزانہ ریکارڈ، اہداف اور تسلسل",
      "کم قیمت Premium کا انتخاب",
    ],
    [MP]: [
      "ایک ہی ایپ میں بہت وسیع سہولیات",
      "چھوٹی ہوئی نمازوں اور روزوں کا حساب",
      "Qalbox ویڈیو لائبریری اور AiDeen AI اسسٹنٹ",
    ],
    [I3]: [
      "درجۂ حدیث اور تخریج کے ساتھ حدیث کی بڑی لائبریری",
      "بہت سے اردو تراجم اور نامور علماء کی تفاسیر",
      "آڈیو کے ساتھ قاعدے کے اسباق",
    ],
    [TA]: [
      "آپ کی تلاوت مفت فالو کرتی ہے",
      "بہت بڑی مفت قرآن لائبریری: تراجم، تفاسیر، قاری",
      "کوئی اشتہار نہیں",
    ],
  },
  bestFor: {
    munib: "نماز، قضا، ذکر، قرآن اور سیکھنے کے لیے ایک مفت ایپ، جس میں خریدنے کو کچھ نہیں۔",
    [QC]: "ایک یکسو، اشتہارات سے پاک، اوپن سورس ایپ میں قرآن پڑھنا اور سننا۔",
    [PL]: "ایک سادہ، اشتہارات سے پاک نماز ایپ، اگر مفت بنیادی سہولیات آپ کے لیے کافی ہیں۔",
    [AT]: "سادہ ریکارڈ کے ساتھ نماز کے قابلِ اعتماد اوقات، اگر اشتہارات سے فرق نہیں پڑتا۔",
    [MP]: "تقریباً ہر چیز کے لیے ایک ایپ، اشتہارات کے ساتھ یا Premium سبسکرپشن میں۔",
    [I3]: "اردو میں قرآن اور حدیث کا گہرا مطالعہ، اشتہارات کے ساتھ یا سبسکرپشن میں۔",
    [TA]: "حفظ کرنے والے جو چاہتے ہیں کہ AI ان کی تلاوت فالو کرے اور جو بعد میں سبسکرائب کر سکتے ہیں۔",
  },
  body: [
    { type: "h2", text: "«مفت» کی چار قسمیں" },
    {
      type: "ul",
      items: [
        "**مفت، اور خریدنے کو کچھ نہیں۔** نہ اشتہارات، نہ سبسکرپشن، نہ ان-ایپ خریداری۔ Munib Tracker اور Quran.com ایپ اسی طرح کام کرتی ہیں۔",
        "**بنیادی سہولیات مفت، اضافی سہولیات پیڈ۔** اشتہارات نہیں، مگر کچھ خصوصیات کے لیے پیڈ پلان ضروری ہے۔ Pillars اور Tarteel اسی طرح کام کرتی ہیں۔",
        "**اشتہارات کے ساتھ مفت۔** ایپ کا خرچ اشتہارات سے چلتا ہے، اور سبسکرپشن یا ایک بار کی ادائیگی سے اشتہارات ہٹ جاتے ہیں۔ Athan، Muslim Pro اور Islam360 اسی طرح کام کرتی ہیں۔",
        "**مفت، مگر اکاؤنٹ یا ڈیٹا کی قیمت پر۔** دیکھ لیں کہ سائن اَپ ضروری ہے یا نہیں، اور انسٹال کرنے سے پہلے App Store کا پرائیویسی لیبل پڑھ لیں۔",
      ],
    },
    { type: "h2", text: "کسی بھی ایپ کو خود کیسے جانچیں" },
    {
      type: "ul",
      items: [
        '**اشتہارات:** Google Play پر ایپ کے نام کے نیچے "Contains ads" کا لیبل دیکھیں۔',
        '**خریداری:** App Store پر "In-App Purchases" کھول کر دیکھیں کہ کیا فروخت ہوتا ہے اور کس قیمت پر۔',
        '**ٹریکنگ:** App Store پر App Privacy کے حصے میں "Data Used to Track You" دیکھیں۔',
        "**سورس کوڈ:** جس ایپ کا کوڈ سب کے لیے دستیاب ہو اسے کوئی بھی جانچ سکتا ہے۔ [Munib Tracker کا سورس کوڈ سب کے لیے دستیاب ہے](/open-source)، غیر تجارتی لائسنس کے تحت، اور ہماری [پرائیویسی پالیسی](/privacy) بتاتی ہے کہ آپ کی ڈیوائس پر کیا رہتا ہے۔",
      ],
    },
    {
      type: "note",
      tone: "info",
      title: "ہم نے کیسے جانچا",
      text: "ہر معلومات ایپ کی آفیشل ویب سائٹ، App Store لسٹنگ یا Google Play لسٹنگ (امریکی اسٹور) سے لی گئی ہے اور دی گئی تاریخ پر جانچی گئی ہے۔ قیمتیں اور خصوصیات اکثر بدلتی رہتی ہیں، اس لیے فیصلہ کرنے سے پہلے لسٹنگز ضرور دیکھ لیں۔ کوئی بات پرانی نظر آئے؟ [ہمیں بتائیں](/contact)، ہم درست کر دیں گے۔",
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
    { label: "Quran.com — ایپس", url: "https://quran.com/apps" },
    { label: "Quran.com — تعارف", url: "https://quran.com/about-us" },
    { label: "Quran for Android — سورس کوڈ", url: "https://github.com/quran/quran_android" },
    { label: "Quran for iOS — سورس کوڈ", url: "https://github.com/quran/quran-ios" },
    { label: "Pillars — آفیشل ویب سائٹ (/ai)", url: "https://thepillarsapp.com/ai" },
    {
      label: "Pillars بلاگ — رمضان کی بہترین ایپس",
      url: "https://thepillarsapp.com/blog/best-ramadan-apps",
    },
    { label: "Pillars — App Store", url: "https://apps.apple.com/us/app/id1559086853" },
    {
      label: "Pillars — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.pillars.pillars",
    },
    { label: "Athan — IslamicFinder ویب سائٹ", url: "https://www.islamicfinder.org/athan/" },
    {
      label: "Athan — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — App Store",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
    { label: "Muslim Pro — آفیشل ویب سائٹ", url: "https://www.muslimpro.com/" },
    {
      label: "Muslim Pro — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    },
    {
      label: "Muslim Pro — App Store",
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
    { label: "Muslim Pro — AiDeen", url: "https://www.muslimpro.com/app/askaideen" },
    { label: "Islam360 — آفیشل ویب سائٹ", url: "https://www.theislam360.com/" },
    { label: "Islam360 — خصوصیات", url: "https://www.theislam360.com/features" },
    { label: "Islam360 — قرآن سیکھیں", url: "https://www.theislam360.com/learn-quran" },
    {
      label: "Islam360 — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.islam360",
    },
    {
      label: "Islam360 — App Store",
      url: "https://apps.apple.com/us/app/islam360-quran-hadith-qibla/id1006098149",
    },
    { label: "Tarteel — آفیشل ویب سائٹ", url: "https://tarteel.ai" },
    {
      label: "Tarteel ہیلپ — کیا Tarteel مفت استعمال ہو سکتی ہے؟",
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
      question: "کس اسلامی ایپ میں اشتہارات نہیں ہیں؟",
      answer:
        "Munib Tracker، Quran.com ایپ، Pillars اور Tarteel اشتہارات نہیں دکھاتیں۔ ان میں سے Munib Tracker اور Quran.com ایپ میں ان-ایپ خریداری بھی نہیں، جبکہ Pillars اور Tarteel Premium پلان فروخت کرتی ہیں۔ Athan، Muslim Pro اور Islam360 اپنے مفت ورژن میں اشتہارات دکھاتی ہیں۔",
    },
    {
      question: "کون سی اسلامی ایپس بغیر سبسکرپشن کے مکمل طور پر مفت ہیں؟",
      answer:
        "Munib Tracker اور Quran.com ایپ مفت ہیں، نہ سبسکرپشن ہے نہ ان-ایپ خریداری۔ Munib Tracker میں نماز، قضا، ذکر، قرآن، حدیث اور سیکھنے کا مواد ہے؛ Quran.com ایپ قرآن ریڈر ہے۔ اس موازنے کی باقی پانچ ایپس ڈاؤن لوڈ کے لیے مفت ہیں اور پیڈ پلان فروخت کرتی ہیں۔",
    },
    {
      question: "کیا Muslim Pro مفت ہے؟",
      answer:
        "جی ہاں، Muslim Pro اشتہارات کے ساتھ ڈاؤن لوڈ اور استعمال کے لیے مفت ہے۔ یہ Premium سبسکرپشن بھی فروخت کرتی ہے، جس کی درج قیمت امریکا میں $12.99 ماہانہ یا $34.99 سالانہ ہے، اور کچھ خصوصیات جیسے آف لائن قرآن کے لیے Premium ضروری ہے۔ مکمل موازنے کے لیے [Munib Tracker بمقابلہ Muslim Pro](/compare/munib-tracker-vs-muslim-pro) دیکھیں۔",
    },
    {
      question: "کیا کوئی مفت اسلامی ایپ بغیر اکاؤنٹ کے چلتی ہے؟",
      answer:
        "جی ہاں۔ Munib Tracker مہمان موڈ میں بغیر اکاؤنٹ کے چلتی ہے، اور سنک کرنا چاہیں تو سائن اِن اختیاری ہے۔ Pillars بھی کہتی ہے کہ اسے سائن اَپ کی ضرورت نہیں۔ باقی ایپس کو بنیادی استعمال کے لیے اکاؤنٹ چاہیے یا نہیں، اس کی تصدیق ہم آفیشل ذرائع سے نہیں کر سکے۔",
    },
    {
      question: "کون سی مفت اسلامی ایپس اوپن سورس ہیں؟",
      answer:
        "Quran.com کی ایپس اوپن سورس ہیں: ان کا کوڈ GitHub پر ہے، اور Android ایپ GPL-3.0 لائسنس کے تحت ہے۔ [Munib Tracker کا سورس کوڈ GitHub پر سب کے لیے دستیاب ہے](/open-source)، PolyForm Noncommercial لائسنس کے تحت، جو ہر کسی کو اسے پڑھنے دیتا ہے مگر تجارتی استعمال کی اجازت نہیں دیتا۔ باقی ایپس کے لیے ہم عوامی سورس کوڈ کی تصدیق نہیں کر سکے۔",
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
