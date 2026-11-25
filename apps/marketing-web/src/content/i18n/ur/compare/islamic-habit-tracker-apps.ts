import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import { MUNIB_CELLS_UR as M, MUNIB_NF_UR as P } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

export const islamicHabitTrackerAppsUr: ComparePage = {
  slug: "islamic-habit-tracker-apps",
  kind: "roundup",
  title: "اسلامی عادات ٹریکر ایپس کا موازنہ",
  seoTitle: "اسلامی عادات ٹریکر ایپس کا موازنہ (2026)",
  seoDescription:
    "اسلامی عادات ٹریکر ایپس کا موازنہ: Munib Tracker، Islamic Habit Tracker، Muslim Tracker اور Dawaam۔ نماز، ذکر، قرآن، اپنی عادات، اشتہارات اور ڈیٹا۔",
  description:
    "عبادت پر مرکوز عادات ٹریکرز آمنے سامنے: وہ کیا ٹریک کرتے ہیں، اپنی مرضی کی عادات، اشتہارات، قیمت اور ڈیٹا کے طریقے۔",
  keywords: [
    "اسلامی عادات ٹریکر ایپس",
    "بہترین مسلم عادات ٹریکر ایپ",
    "اسلامی عادات ٹریکر کا موازنہ",
  ],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "جائزہ",
  intro: [
    "اسلامی عادات ٹریکرز نماز، ذکر، قرآن پڑھنے اور روزوں کے گرد معمولات بنانے میں مدد دیتے ہیں۔ کچھ اسلامی تھیم والی عام عادات ایپس ہیں، جن میں ہر عادت آپ کو خود بنانی پڑتی ہے؛ کچھ عبادت کے گرد بنی ہیں اور آپ کے نماز کے اوقات اور ہجری کیلنڈر سے واقف ہوتی ہیں۔",
    "اس زمرے کی زیادہ تر ایپس چھوٹی ہیں اور صرف Android پر ہیں، اس لیے ہم نے ہر ایک کی Google Play لسٹنگ (اور جہاں موجود ہو App Store لسٹنگ) دیکھی۔ Munib Tracker ہماری اپنی ایپ ہے؛ ہم نے یہ بھی بتایا ہے کہ دوسری ایپس کہاں وہ کرتی ہیں جو یہ نہیں کرتی۔",
  ],
  apps: [
    MUNIB,
    {
      id: "mortys",
      name: "Islamic Habit Tracker (Mortys)",
      url: "https://play.google.com/store/apps/details?id=com.prayertimesqiblaazan.muslim",
    },
    {
      id: "june",
      name: "Islamic Habit Tracker App (June Afternoon)",
      url: "https://play.google.com/store/apps/details?id=islamic.habit.tracker.app",
    },
    {
      id: "deen",
      name: "Muslim Tracker (Deen IndieTech)",
      url: "https://play.google.com/store/apps/details?id=com.deenindietech.sunnahtracker",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "مکمل طور پر اپنی مرضی کی عادات چاہییں؟",
      text: "June Afternoon کی Islamic Habit Tracker میں آپ اپنی عادات خود طے کر سکتے ہیں۔ Munib Tracker کا مرکز عبادت ہے اور اس میں ہر قسم کی من چاہی عادت بنانے کی سہولت نہیں۔",
    },
    {
      title: "پہلے سے تیار عبادت چاہیے؟",
      text: "Munib Tracker میں نماز، قضا، اذکار، قرآن اور موسمی ٹریکرز استعمال کے لیے تیار ملتے ہیں، جو آپ کے نماز کے اوقات سے جڑے ہوتے ہیں۔",
    },
  ],
  table: [
    {
      group: "آپ کیا ٹریک کر سکتے ہیں",
      rows: [
        {
          feature: "نماز",
          cells: {
            munib: M.salahLog,
            mortys: cell.partial("عام عادت کے طور پر"),
            june: cell.yes("اپنی بنائی ہوئی عادت کے طور پر"),
            deen: cell.yes("مسجد میں، وقت پر، چھوٹی ہوئی"),
          },
        },
        {
          feature: "قضا",
          cells: {
            munib: M.qaza,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "ذکر / تسبیح",
          cells: {
            munib: M.zikr,
            mortys: cell.yes("کاؤنٹر"),
            june: cell.yes("ڈیجیٹل تسبیح"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "قرآن",
          cells: {
            munib: cell.yes("مکمل ریڈر، ختم کا منصوبہ، مشق"),
            mortys: cell.yes("ریڈر"),
            june: cell.partial("صفحات یا وقت ٹریک کرتی ہے؛ ریڈر نہیں"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "روزے",
          cells: {
            munib: cell.yes("رمضان، ایامِ بیض، چھوٹے ہوئے روزے"),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.yes("روزوں کی کئی اقسام"),
          },
        },
        {
          feature: "اپنی مرضی کی عادات",
          cells: {
            munib: cell.partial("اپنے بنائے ہوئے اذکار اور سنت عادات کی چیک لسٹ"),
            mortys: cell.yes(),
            june: cell.yes(),
            deen: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "عادت بنانا",
      rows: [
        {
          feature: "تمام عبادات پر مشتمل روزانہ ہدف",
          cells: {
            munib: cell.yes("آج کا ہدف: نماز، ذکر، قضا، ختم"),
            mortys: cell.unverified(),
            june: cell.yes("اپنی عادات کی فہرست"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "روزانہ سنت عادات کی چیک لسٹ",
          cells: {
            munib: P.sunnahHabits,
            mortys: cell.partial("عام عادات"),
            june: cell.partial("اپنی بنائی ہوئی عادات کے طور پر"),
            deen: cell.unverified(),
          },
        },
        {
          feature: "نفلی روزوں کا منصوبہ",
          cells: {
            munib: cell.yes(
              "پیر اور جمعرات، شوال، عرفہ، عاشورا، ایامِ بیض اور مزید، ممنوعہ دنوں کی تنبیہ کے ساتھ",
            ),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.yes("روزوں کی کئی اقسام"),
          },
        },
        {
          feature: "ہفتہ وار جائزہ اور بصیرت",
          cells: {
            munib: cell.yes("ہفتہ وار رپورٹ اور ڈیوائس پر ایک نرم رہنما"),
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "رات کا محاسبۂ نفس",
          cells: {
            munib: P.muhasabah,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "صلہ رحمی کی یاد دہانیاں",
          cells: {
            munib: P.familyTies,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
        {
          feature: "احتساب کا ساتھی",
          cells: {
            munib: P.partner,
            mortys: cell.unverified(),
            june: cell.unverified(),
            deen: cell.unverified(),
          },
        },
      ],
    },
    {
      group: "پلیٹ فارمز، قیمت اور ڈیٹا",
      rows: [
        {
          feature: "پلیٹ فارمز",
          cells: {
            munib: M.platforms,
            mortys: cell.text("Android"),
            june: cell.text("Android"),
            deen: cell.text("Android"),
          },
        },
        {
          feature: "اشتہارات",
          cells: {
            munib: cell.text("نہیں"),
            mortys: cell.text('ہاں ("Contains ads")'),
            june: cell.text("اشتہار نہ ہونے کا لیبل"),
            deen: cell.text("اشتہار نہ ہونے کا لیبل"),
          },
        },
        {
          feature: "ان-ایپ خریداری",
          cells: {
            munib: cell.text("کوئی نہیں"),
            mortys: cell.text("ہاں"),
            june: cell.text("ہاں"),
            deen: cell.text("ہاں"),
          },
        },
        {
          feature: "Google Play پر ڈیٹا سیفٹی",
          cells: {
            munib: cell.text("مہمان کا ڈیٹا ڈیوائس پر رہتا ہے؛ کوئی اشتہاری SDK نہیں"),
            mortys: cell.text("مقام، ایپ کی سرگرمی اور مزید شیئر کرتی ہے"),
            june: cell.text("کوئی ڈیٹا جمع یا شیئر نہیں ہوتا"),
            deen: cell.text("مالی معلومات شیئر کرتی ہے"),
          },
        },
      ],
    },
  ],
  strengths: {
    munib: [
      "عبادت کی ٹریکنگ پہلے دن سے تیار",
      "قضا کی منصوبہ بندی",
      "قرآن ریڈر اور مشق",
      "ہر پلیٹ فارم پر",
    ],
    mortys: ["انسٹالز کی بڑی تعداد (1M+)", "وسیع آل اِن ون سہولیات"],
    june: ["لچک دار، اپنی مرضی کی عادات", "Play لسٹنگ کے مطابق کوئی ڈیٹا جمع نہیں ہوتا"],
    deen: ["نماز کی تفصیلی کیفیت (مسجد، وقت پر، چھوٹی ہوئی)", "روزوں کی کئی اقسام"],
  },
  bestFor: {
    munib: "ہر وہ شخص جو پہلے سے تیار عبادتی عادات چاہتا ہے، قضا اور قرآن سمیت۔",
    mortys: "Android صارفین جو وسیع ایپ چاہتے ہیں اور اشتہارات سے انہیں فرق نہیں پڑتا۔",
    june: "وہ لوگ جو اپنی عادات کی فہرست خود ترتیب دینا چاہتے ہیں۔",
    deen: "Android پر نماز اور روزوں کا تفصیلی ریکارڈ۔",
  },
  body: [
    { type: "h2", text: "یہ بھی دیکھنے کے لائق ہیں" },
    {
      type: "p",
      text: '[Dawaam](https://play.google.com/store/apps/details?id=dawaam.app) نماز، اذکار اور عادات کے تسلسل کو دوستوں کے ساتھ مل کر کرنے کے لیے "squads" کے ساتھ جوڑتی ہے، iOS اور Android دونوں پر۔ ہم نے اسے جدول میں شامل نہیں کیا کیونکہ ہم آفیشل لسٹنگز سے اس کی کافی خصوصیات کی تصدیق نہیں کر سکے۔',
    },
    {
      type: "p",
      text: "دیرپا معمولات بنانے کے لیے خیالات چاہییں تو پڑھیں: [بہتر اسلامی عادات کیسے بنائیں](/resources/islamic-habits/how-to-build-better-islamic-habits)۔",
    },
  ],
  sources: [
    {
      label: "Islamic Habit Tracker (Mortys) — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.prayertimesqiblaazan.muslim",
    },
    {
      label: "Islamic Habit Tracker App (June Afternoon) — Google Play",
      url: "https://play.google.com/store/apps/details?id=islamic.habit.tracker.app",
    },
    {
      label: "Muslim Tracker (Deen IndieTech) — Google Play",
      url: "https://play.google.com/store/apps/details?id=com.deenindietech.sunnahtracker",
    },
    {
      label: "Dawaam — Google Play",
      url: "https://play.google.com/store/apps/details?id=dawaam.app",
    },
  ],
  faqs: [
    {
      question: "اسلامی عادات ٹریکر میں کیا ہونا چاہیے؟",
      answer:
        "کم از کم: پانچوں وقت کی نماز، ذکر کی کسی قسم کی ٹریکنگ اور قرآن پڑھنا۔ مفید اضافی سہولیات میں قضا کا حساب، نماز کے اوقات سے جڑی یاد دہانیاں، اور رمضان اور نفلی روزوں کے ٹریکرز شامل ہیں۔",
    },
  ],
  related: [
    "/features/daily-islamic-habits",
    "/compare/best-salah-tracker-apps",
    "/resources/islamic-habits/how-to-build-better-islamic-habits",
  ],
};
