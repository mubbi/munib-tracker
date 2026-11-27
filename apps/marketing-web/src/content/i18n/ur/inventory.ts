import { DUA_COUNT } from "@munib-tracker/shared/constants";
import type { InventoryGroup } from "@/content/munib-features";

/**
 * Urdu translations (inventory). Each entry mirrors its English source
 * field for field (same ids, statuses, NF ids and hrefs) with translated
 * `title`/`name`/`detail` — see `content/localized.ts` and
 * `content/i18n/README.md`. Plain literals on purpose: `munib-features.ts`
 * imports this file, so importing its helpers here would be a cycle.
 */
export const TRANSLATIONS: readonly InventoryGroup[] = [
  {
    id: "salah",
    title: "نماز",
    items: [
      {
        name: "نماز کے اوقات",
        status: "shipped",
        detail:
          "GPS یا شہر، حساب کے 13 طریقے، حنفی یا شافعی عصر، ہر نماز کی الگ ترتیب، بلند عرض بلد کے قواعد",
        href: "/features/prayer-times-qibla",
      },
      {
        name: "اذان اور یاد دہانیاں",
        status: "shipped",
        detail: "اذان کے پانچ انداز، ہر نماز سے پہلے یا بعد یاد دہانیاں، Android پر بالکل درست وقت",
      },
      {
        name: "نماز ٹریکر",
        status: "shipped",
        detail:
          "ہر نماز کے لیے ادا، تاخیر سے، چھوٹی ہوئی یا قضا؛ وتر؛ جماعت؛ نجی نوٹس؛ تسلسل اور کیلنڈر",
        href: "/features/salah-tracker",
      },
      {
        name: "سنت اور نفل نمازیں",
        status: "shipped",
        detail: "تہجد، اشراق، چاشت، تحیۃ المسجد، صلاۃ الحاجت اور استخارہ",
      },
      {
        name: "آج کا شیڈول",
        status: "shipped",
        detail: "دن بھر کی فرض نمازیں، سنتوں کے اوقات اور لچک دار اعمال",
      },
      {
        name: "عذر کے دن",
        status: "shipped",
        detail: "حیض، بیماری اور سفر میں ٹریکنگ رک جاتی ہے اور تسلسل نہیں ٹوٹتا، رہنمائی کے ساتھ",
      },
      {
        name: "خشوع کا نماز جرنل",
        status: "shipped",
        detail: "لکھیں کہ ہر نماز میں آپ کتنے حاضر دل تھے",
      },
      {
        name: "تہجد کا ریکارڈ",
        status: "shipped",
        detail: "آپ کے مقام کے مطابق رات کے آخری تہائی حصے کے حساب کے ساتھ",
      },
      {
        name: "قبلہ کمپاس",
        status: "shipped",
        detail: "مکہ کی سمت اور فاصلہ، درست رخ پر ہلکی وائبریشن کے ساتھ",
        href: "/features/prayer-times-qibla",
      },
      {
        name: "نمازوں کے پرانے ریکارڈ کی درآمد",
        status: "shipped",
        detail: "اسپریڈشیٹ (CSV) یا JSON سے، چھوٹی ہوئی نمازیں قضا میں شامل ہو جاتی ہیں",
      },
      {
        name: "سنتِ رواتب کا ٹریکر",
        detail: "سنتِ مؤکدہ کی رکعتیں: احناف کے لیے 12، دیگر مسالک کے لیے 10، اور ان میں ترمیم ممکن",
        status: "shipped",
        nf: "NF-3.1",
        href: "/features/salah-tracker",
      },
      {
        name: "نماز فوکس لاک",
        detail:
          "ہر نماز کے وقت منتخب ایپس بلاک کریں جب تک آپ نماز نہ پڑھ لیں، iPhone اور Android پر",
        status: "shipped",
        nf: "NF-3.13",
        href: "/features/salah-focus-lock",
      },
      {
        name: "مسجد تلاش",
        detail:
          'OpenStreetMap سے قریبی مساجد فہرست یا اختیاری نقشے میں، اقامت کے نجی اوقات کے ساتھ اپنی مستقل مسجد، اقامت کا کاؤنٹ ڈاؤن اور "مسجد میں ادا کی"',
        status: "shipped",
        nf: "NF-3.11",
        href: "/features/masjid-finder",
      },
      {
        name: "نظام الاوقات اسکین",
        detail:
          "اقامت کے اوقات درآمد کرنے کے لیے اپنی مسجد کے نظام الاوقات کی تصویر لیں، ڈیوائس پر ہی پڑھا جاتا ہے اور آپ خود جانچتے ہیں",
        status: "shipped",
        nf: "NF-3.12",
        href: "/features/masjid-finder",
      },
      {
        name: "پسندیدہ وقت کی یاد دہانیاں",
        status: "shipped",
        detail: "اختیاری، ان مسالک کے لیے جو فجر، عصر یا عشاء میں تاخیر کو بہتر سمجھتے ہیں",
        href: "/features/my-madhhab",
      },
      {
        name: "میرے مسلک کی ترتیب",
        detail:
          "حنفی، شافعی، مالکی، حنبلی یا تمام آراء؛ گائیڈز اور کیلکولیٹرز میں اختلافات کی نشاندہی",
        status: "shipped",
        nf: "NF-3.0a",
        href: "/features/my-madhhab",
      },
      {
        name: "ہجری تاریخ کی درستی",
        detail: "آپ کی مقامی رؤیتِ ہلال سے ملانے کے لیے ±2 دن کا فرق اور ہر مہینے کی الگ اصلاح",
        status: "shipped",
        nf: "NF-3.0b",
        href: "/features/my-madhhab",
      },
    ],
  },
  {
    id: "qaza",
    title: "قضا اور روزے",
    items: [
      {
        name: "قضا کاؤنٹرز",
        status: "shipped",
        detail: "ہر نماز کا الگ، وتر سمیت، چھوٹی ہوئی نمازوں سے خود بخود بھرتے ہیں",
        href: "/features/qaza-salah-tracker",
      },
      {
        name: "عمر بھر کی قضا کا کیلکولیٹر",
        status: "shipped",
        detail: "جن برسوں میں نماز نہیں پڑھی، ان سے باقی نمازوں کا اندازہ لگائیں",
      },
      {
        name: "روزانہ رفتار کا منصوبہ",
        status: "shipped",
        detail: "ہلکی سے بھرپور رفتار تک تیار انتخاب، تکمیل کی متوقع تاریخ کے ساتھ",
      },
      { name: "قضا کا ریکارڈ", status: "shipped", detail: "ادا کی گئی ہر قضا نماز درج" },
      {
        name: "چھوٹے ہوئے روزوں کا ٹریکر",
        status: "shipped",
        detail: "چھوٹے ہوئے روزوں کا حساب رکھیں اور انہیں پورا کریں",
      },
      {
        name: "فدیہ اور کفارہ کے معاون",
        status: "shipped",
        detail: "رہنمائی کے ساتھ منصوبہ بندی کے تخمینے",
      },
      { name: "رمضان ٹریکر", status: "shipped", detail: "روزے کے اوقات اور روزوں کا ریکارڈ" },
      {
        name: "ایامِ بیض کے روزے",
        status: "shipped",
        detail: "ہر ہجری مہینے کی 13 سے 15 تاریخ کے لیے مرکز، چیک لسٹ اور یاد دہانی",
      },
      {
        name: "نفلی روزوں کا ٹریکر",
        detail:
          "مستحب روزوں کی منصوبہ بندی، یاد دہانی اور ریکارڈ؛ مکروہ دنوں کی نشاندہی، ممنوعہ دن بند",
        status: "shipped",
        nf: "NF-3.2",
        href: "/features/fasting-tracker",
      },
      {
        name: "ذوالحجہ موڈ",
        detail: "روزانہ کے اعمال، یومِ عرفہ، مسلک کے مطابق تکبیرِ تشریق اور قربانی کا منصوبہ",
        status: "shipped",
        nf: "NF-3.3",
        href: "/features/fasting-tracker",
      },
    ],
  },
  {
    id: "zikr",
    title: "ذکر اور دعائیں",
    items: [
      {
        name: "حوالوں کے ساتھ 60 اذکار",
        status: "shipped",
        detail: "سات زمرے، ہر ذکر اپنی ماخذ حدیث کے ساتھ",
        href: "/features/zikr-tracker",
      },
      {
        name: "رہنمائی والے اذکار کے سیشن",
        status: "shipped",
        detail: "صبح، شام، سونے سے پہلے اور ہر نماز کے بعد",
      },
      {
        name: "تسبیح کاؤنٹر",
        status: "shipped",
        detail: "33، 99، 100، لامحدود یا اپنی مرضی کے اہداف؛ Wear OS ٹائل",
      },
      {
        name: "نماز کے بعد کی تسبیح کی ترتیب",
        status: "shipped",
        detail: "ایک ہی کاؤنٹر میں 33، 33 اور 34 جو خود آگے بڑھتا ہے، ٹیپ سے یا بغیر ہاتھ لگائے",
        href: "/features/zikr-tracker",
      },
      {
        name: "اپنے اذکار بنانے کا ٹول",
        status: "shipped",
        detail: "اپنا ذکر، آواز سے متن (speech-to-text) کے ساتھ",
      },
      { name: `${DUA_COUNT} دعائیں`, status: "shipped", detail: "مکمل حصن مسلم، 16 زمروں میں" },
      {
        name: "درود اور اسمائے حسنیٰ (99 نام)",
        status: "shipped",
        detail: "نو درود، اور اللہ کے نام معانی اور آڈیو کے ساتھ",
      },
      {
        name: "روزانہ سنت عادات",
        detail: "روزمرہ سنتوں کی ایک مختصر، دلائل پر مبنی چیک لسٹ",
        status: "shipped",
        nf: "NF-3.5",
        href: "/features/daily-islamic-habits",
      },
      {
        name: "تسبیح کاؤنٹر کے ڈیزائن",
        detail:
          "آٹھ ڈیزائن، رِنگ (ڈیفالٹ) اور سرکنے والے دانوں سے لے کر کھجور کی گٹھلیوں اور انگلیوں پر گنتی تک، اختیاری آواز اور وائبریشن کے ساتھ",
        status: "shipped",
        nf: "NF-3.19",
        href: "/features/zikr-tracker",
      },
      {
        name: "بغیر ہاتھ لگائے تسبیح",
        detail:
          "کوئی بھی ذکر ایک بار پڑھ کر سکھائیں، پھر صرف اسی کی تکرار گنی جاتی ہے، ڈیوائس پر ہی؛ کسی بھی غلط گنتی کو ٹیپ سے درست کریں",
        status: "shipped",
        nf: "NF-3.20",
        href: "/features/zikr-tracker",
      },
    ],
  },
  {
    id: "quran",
    title: "قرآن",
    items: [
      {
        name: "مکمل قرآن آف لائن",
        status: "shipped",
        detail: "سورت، پارہ اور 604 صفحات کا مصحف، چوڑی اسکرین پر آمنے سامنے دو صفحات",
        href: "/features/quran",
      },
      { name: "لفظ بہ لفظ ترجمہ اور تجوید کے رنگ", status: "shipped" },
      {
        name: "25 تراجم",
        status: "shipped",
        detail: "دو ایپ میں شامل، باقی ضرورت کے وقت، ساتھ ساتھ",
      },
      { name: "ضرورت کے وقت تفسیر", status: "shipped" },
      {
        name: "تلاوت کی آڈیو",
        status: "shipped",
        detail: "کئی قاری، آیت یا سورت کی تلاوت، آف لائن ڈاؤن لوڈ",
      },
      {
        name: "ختم کا منصوبہ اور حفظ ٹریکر",
        status: "shipped",
        detail: "روزانہ پڑھنے کا ہدف اور حفظ کی گئی آیات",
      },
      {
        name: "آیت کی شناخت (Verse Detector)",
        status: "shipped",
        detail:
          "ٹائپ کی گئی عربی یا انگریزی سے، یا تلاوت کیے گئے چند الفاظ سے سورت اور آیت تلاش کریں",
      },
      {
        name: "تلاش اور بُک مارکس",
        status: "shipped",
        detail: "آیات میں تلاش، ہمہ گیر تلاش اور ایک ہی جگہ تمام بُک مارکس",
      },
      {
        name: "آیات پر نوٹس اور ہائی لائٹس",
        detail: "کسی بھی آیت پر اپنے تاثرات، رنگ اور ٹیگز",
        status: "shipped",
        nf: "NF-3.21",
        href: "/features/quran",
      },
      {
        name: "عربی مادّے سے تلاش",
        detail:
          "ایک مادّے سے نکلنے والا ہر لفظ، Quranic Arabic Corpus سے (تقریباً 6 MB کا اختیاری ڈاؤن لوڈ)",
        status: "shipped",
        nf: "NF-3.22",
        href: "/features/quran",
      },
    ],
  },
  {
    id: "recitation",
    title: "تلاوت اور قرآن سیکھنا",
    items: [
      {
        name: "ڈیوائس پر تلاوت سننے والا سامع",
        status: "shipped",
        detail:
          "ساتھ چلیں، جانچ، الفاظ چھپائیں اور آیات چھپائیں کے موڈز؛ آواز کبھی ڈیوائس سے باہر نہیں جاتی",
        href: "/features/quran-practice",
      },
      {
        name: "وقفے وقفے سے دہرائی",
        status: "shipped",
        detail: "آیات 1، 3، 7، 14 اور 30 دن بعد دوبارہ سامنے آتی ہیں",
      },
      {
        name: "تلاوت سے تلاش اور ساتھ ساتھ پڑھنا",
        status: "shipped",
        detail:
          "تلاوت کر کے آیت تلاش کریں، اور نماز گائیڈ، جمعہ، اذکار اور ختم کی اسکرینوں سے ساتھ ساتھ پڑھیں",
        href: "/features/quran-practice",
      },
      {
        name: "تلفظ کی ڈرلز",
        status: "shipped",
        detail: "اختیاری، تجوید کے منتخب اسباق کے لیے",
      },
      {
        name: "قرآن سیکھیں",
        status: "shipped",
        detail: "عربی حروف، پڑھنا سیکھیں، تجوید، ذخیرۂ الفاظ، موضوعات، قصص اور تدبر",
        href: "/features/learn-quran",
      },
      {
        name: "تلفظ کی جانچ",
        detail:
          "آیت پڑھنے کے بعد وہ الفاظ نشان زد کرتی ہے جو چھوٹے ہوئے یا غیر واضح لگیں، ڈیوائس پر ہی",
        status: "shipped",
        nf: "NF-3.24",
        href: "/features/quran-practice",
      },
      {
        name: "تجوید کی رہنمائی",
        detail:
          "جن آیات پر آپ کام کر رہے ہیں ان سے مشق کے لیے تجوید کی آوازیں، وضاحتوں اور ڈرلز کے ساتھ",
        status: "shipped",
        nf: "NF-3.15",
        href: "/features/quran-practice",
      },
    ],
  },
  {
    id: "knowledge",
    title: "حدیث اور سیکھنا",
    items: [
      {
        name: "حدیث لائبریری",
        status: "shipped",
        detail: "اربعین نووی اور ریاض الصالحین ایپ میں شامل؛ چھ بڑے مجموعے ضرورت کے وقت",
        href: "/features/hadith",
      },
      {
        name: "حدیث کی شرح اور سند",
        status: "shipped",
        detail: "شرح اور راویوں کی مکمل سند",
      },
      { name: "روزانہ حدیث", status: "shipped" },
      {
        name: "سیکھنے کی لائبریری",
        status: "shipped",
        detail: "عقیدہ، شجرۂ نسب کے ساتھ انبیاء، سیرت، غزوات، صحابہ، ابتدائی تاریخ، آخرت",
        href: "/learn",
      },
      {
        name: "عبادات کی گائیڈز",
        status: "shipped",
        detail: "نماز گائیڈ، طہارت، جمعہ، لیلۃ القدر، عید، جنازہ، رقیہ، اسلامی مالیات",
      },
      {
        name: "نئے مسلمانوں کی گائیڈ",
        status: "shipped",
        detail: "پہلے قدموں کے لیے 18 موضوعات",
        href: "/for/new-muslims",
      },
      {
        name: "فلیش کارڈز",
        status: "shipped",
        detail: "قرآن، حدیث، اسمائے حسنیٰ اور ہر گائیڈ کی دہرائی",
      },
    ],
  },
  {
    id: "tools",
    title: "کیلکولیٹرز اور منصوبہ بندی",
    items: [
      { name: "زکوٰۃ کیلکولیٹر", status: "shipped", detail: "نصاب، چیک لسٹ اور رہنمائی کے ساتھ" },
      {
        name: "حج اور عمرہ",
        status: "shipped",
        detail: "سیکھنے کی گائیڈ اور مناسک کی الگ الگ چیک لسٹیں",
      },
      { name: "صدقہ کے اہداف", status: "shipped", detail: "صدقے کی نیت اور ریکارڈ" },
      {
        name: "اسلامی واقعات کا کیلنڈر اور تاریخ کنورٹر",
        status: "shipped",
        detail: "ہجری اور عیسوی",
      },
      {
        name: "عمرہ موڈ",
        detail: "طواف اور سعی کے کاؤنٹرز کے ساتھ قدم بہ قدم لائیو ساتھی",
        status: "shipped",
        nf: "NF-3.4",
        href: "/features/umrah-mode",
      },
      {
        name: "وراثت (میراث) کیلکولیٹر",
        detail: "چاروں مسالک، ہر حصے کی وضاحت کے ساتھ",
        status: "shipped",
        nf: "NF-3.10",
        href: "/features/islamic-will-and-inheritance",
      },
      {
        name: "اسلامی وصیت نامہ ساز",
        detail:
          "رہنمائی کے ساتھ، ایک تہائی کی حد کے اندر، PDF کی صورت میں برآمد تاکہ پرنٹ کر کے گواہ بنائے جا سکیں",
        status: "shipped",
        nf: "NF-3.9",
        href: "/features/islamic-will-and-inheritance",
      },
      {
        name: "قرضوں اور امانتوں کا ریکارڈ",
        detail:
          "آپ کے ذمے اور دوسروں کے ذمے واجبات، اختیاری دستاویز کی تصویر کے ساتھ، نجی اور انکرپٹڈ",
        status: "shipped",
        nf: "NF-3.8",
        href: "/features/islamic-will-and-inheritance",
      },
    ],
  },
  {
    id: "progress",
    title: "پیش رفت اور غور و فکر",
    items: [
      {
        name: "آج کا ہدف",
        status: "shipped",
        detail: "نماز، ذکر، قضا اور ختم ایک روزانہ چیک لسٹ میں",
        href: "/features/daily-islamic-habits",
      },
      {
        name: "اعداد و شمار اور ہفتہ وار رپورٹ",
        status: "shipped",
        detail: "ہفتے، مہینے اور سال کے جائزے",
        href: "/features/worship-progress",
      },
      {
        name: "کامیابیاں اور نور کے لیول",
        status: "shipped",
        detail: "ایسی حوصلہ افزائی جس کی کوئی حد نہیں",
      },
      {
        name: "رات کا محاسبہ",
        detail: "ہر رات ایک منٹ کا نجی محاسبۂ نفس، انکرپٹڈ",
        status: "shipped",
        nf: "NF-3.6",
        href: "/features/private-reflection",
      },
      {
        name: "ہفتہ وار نرم رہنما",
        detail:
          "آپ کے ہفتے کی بنیاد پر مہربان، عملی تجاویز، ڈیوائس پر سادہ قواعد سے (کوئی AI نہیں)",
        status: "shipped",
        nf: "NF-3.14",
        href: "/features/private-reflection",
      },
      {
        name: "روزانہ تلاوتِ قرآن کا ریکارڈ",
        status: "shipped",
        detail: "جن دنوں آپ نے پڑھا وہ درج ہوتے ہیں، تاکہ ہفتہ وار رہنما انہیں درست گنے",
        href: "/features/quran",
      },
      {
        name: "صلہ رحمی کی یاد دہانیاں",
        detail: "رشتہ داروں سے رابطہ رکھنے کی نرم یاد دہانیاں، آپ کے انکرپٹڈ والٹ میں محفوظ",
        status: "shipped",
        nf: "NF-3.7",
        href: "/features/private-reflection",
      },
    ],
  },
  {
    id: "together",
    title: "خاندان اور کمیونٹی",
    items: [
      {
        name: "خاندان اور بچوں کا موڈ",
        detail:
          "13 سال سے کم عمر بچوں کے لیے والدین کے زیرِ انتظام پروفائلز، بچوں کا نماز کا راستہ اور انبیاء کے قصے؛ والدین صرف فرض نماز کی کیفیت دیکھتے ہیں",
        status: "shipped",
        nf: "NF-3.16",
        href: "/features/family-and-friends",
      },
      {
        name: "احتساب کا ساتھی",
        detail: 'صرف روزانہ کا "ہو گیا" شیئر کریں، کبھی اپنا ہدف یا تفصیلات نہیں',
        status: "shipped",
        nf: "NF-3.17",
        href: "/features/family-and-friends",
      },
      {
        name: "اجتماعی ختم",
        detail: "خاندان یا دوستوں کے ساتھ پارہ، حزب یا سورت کے لحاظ سے ختم بانٹیں",
        status: "shipped",
        nf: "NF-3.18",
        href: "/features/family-and-friends",
      },
      {
        name: "آس پاس شامل ہوں",
        detail:
          "اپنے پاس موجود کسی شخص کو بلوٹوتھ کے ذریعے 4 ہندسوں کے کوڈ سے شامل کریں جس کی منظوری آپ دیتے ہیں؛ QR اور دعوتی کوڈز بھی",
        status: "shipped",
        href: "/features/family-and-friends",
      },
    ],
  },
  {
    id: "devices",
    title: "ڈیوائسز",
    items: [
      {
        name: "iPhone، iPad اور Android",
        status: "shipped",
        href: "/features/widgets-and-devices",
      },
      {
        name: "ویب ایپ",
        status: "shipped",
        detail: "کسی بھی براؤزر میں چلتی ہے اور PWA کے طور پر انسٹال ہوتی ہے",
      },
      { name: "Apple TV اور Android TV", status: "shipped" },
      {
        name: "وجیٹس اور Live Activities",
        status: "shipped",
        detail: "ہوم اور لاک اسکرین، Dynamic Island، Android Live Updates",
      },
      {
        name: "Apple Watch اور Wear OS",
        status: "shipped",
        detail: "شیڈول، نماز درج کرنا، کلائی پر تسبیح، کمپلیکیشنز اور ٹائلز",
      },
      {
        name: "Siri اور Google Assistant شارٹ کٹس",
        status: "shipped",
        detail: "ساتھ میں ایپ آئیکن کے فوری ایکشنز",
      },
    ],
  },
  {
    id: "privacy",
    title: "پرائیویسی اور ذاتی ترتیبات",
    items: [
      {
        name: "نہ اشتہارات، نہ سبسکرپشن",
        status: "shipped",
        detail: "ذاتی استعمال کے لیے مفت",
      },
      {
        name: "اکاؤنٹ کی ضرورت نہیں",
        status: "shipped",
        detail: "سنک کے لیے Google، Apple یا Facebook سے اختیاری سائن اِن",
      },
      {
        name: "بیک اپ اور بحالی",
        status: "shipped",
        detail: "ایک فائل جو آپ کے پاس رہتی ہے، نیز آف لائن ڈاؤن لوڈ مینیجر",
      },
      {
        name: "سنک تضاد کا جائزہ",
        status: "shipped",
        detail: "جب دو ڈیوائسز میں فرق ہو تو چنیں کہ کون سا ورژن رکھنا ہے",
      },
      {
        name: "نوٹیفکیشن اِن باکس",
        status: "shipped",
        detail: "اعلانات اور یاد دہانیاں ایپ میں ایک ہی جگہ",
      },
      { name: "ایپ لاک", status: "shipped", detail: "PIN یا بایومیٹرکس" },
      {
        name: "24 زبانیں",
        status: "shipped",
        detail: "عربی، اردو، فارسی، پشتو اور کردی کے لیے دائیں سے بائیں لے آؤٹس",
      },
      {
        name: "تھیمز، آئیکن اور فونٹس",
        status: "shipped",
        detail: "لائٹ اور ڈارک، 12 لہجہ رنگ، موسمی تھیمز اور ایپ آئیکن، عربی فونٹس",
      },
      {
        name: "حسبِ منشا ہوم اسکرین",
        status: "shipped",
        detail: "ہوم ماڈیولز اور فوری ایکشنز خود چنیں",
      },
      {
        name: "GitHub پر سورس کوڈ",
        status: "shipped",
        detail: "غیر تجارتی لائسنس",
        href: "/open-source",
      },
      {
        name: "انکرپٹڈ نجی والٹ",
        detail:
          "محاسبہ، وصیت، قرضے اور خاندانی رابطے ڈیوائس پر انکرپٹڈ؛ اختیاری اینڈ ٹو اینڈ انکرپٹڈ سنک",
        status: "shipped",
        nf: "NF-3.0",
        href: "/features/private-reflection",
      },
      {
        name: "قابلِ تلاش ترتیبات",
        detail: "موضوع کے لحاظ سے گروپ کی گئی نئی ترتیبات، تلاش کے ساتھ",
        status: "shipped",
        nf: "NF-3.0b",
      },
    ],
  },
];
