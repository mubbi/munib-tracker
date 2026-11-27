import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import {
  devicesGroupUr as devicesGroup,
  NOT_ON_APP_STORE_UR as NOT_ON_APP_STORE,
} from "@/content/i18n/ur/compare-devices";
import { MUNIB_CELLS_UR as M, MUNIB_NF_UR as P } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

const PL = "pillars";

export const vsPillarsUr: ComparePage = {
  slug: "munib-tracker-vs-pillars",
  kind: "versus",
  title: "Munib Tracker بمقابلہ Pillars",
  seoTitle: "Munib Tracker بمقابلہ Pillars: اشتہارات سے پاک دو نماز ایپس",
  seoDescription:
    "Pillars اور Munib Tracker دونوں اشتہارات سے پاک ہیں اور اکاؤنٹ نہیں مانگتیں۔ نماز ٹریکنگ، قضا، ذکر، قرآن، Apple Watch سپورٹ اور قیمت کا موازنہ کریں۔",
  description:
    "دونوں اشتہارات اور اکاؤنٹ سے پاک ہیں۔ Pillars کا مرکز نماز کے اوقات اور توجہ کے ٹولز ہیں؛ Munib Tracker قضا، ذکر اور قرآن بھی شامل کرتی ہے۔",
  keywords: ["munib tracker بمقابلہ pillars", "pillars ایپ کا متبادل", "pillars نماز ایپ"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "موازنہ",
  intro: [
    'Pillars خود کو "وہ نماز ایپ جس پر آپ بھروسا کر سکیں" کہتی ہے۔ Munib Tracker کی طرح اس میں بھی کوئی اشتہار نہیں، اکاؤنٹ کی ضرورت نہیں، اور یہ نماز کے اوقات ڈیوائس پر ہی حساب کرتی ہے۔ اس کا مرکز نماز ہے: اوقات، اذان، ٹریکر، وجیٹس، اور Premium ٹولز جیسے ایپ بلاکر اور فجر الارم۔',
    "Munib Tracker بھی پرائیویسی کو اوّلیت دینے والا یہی طریقہ اپناتی ہے، لیکن روزانہ عبادت کا زیادہ حصہ سمیٹتی ہے: قضا کی منصوبہ بندی، اذکار، قرآن، تلاوت کی مشق اور سیکھنے کی لائبریری۔ Pillars کی آفیشل سائٹ اور اسٹور لسٹنگز کی بنیاد پر دونوں کا موازنہ یہ ہے۔",
  ],
  apps: [
    MUNIB,
    {
      id: PL,
      name: "Pillars",
      developer: "The Pillars Group Ltd",
      url: "https://thepillarsapp.com",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Pillars چنیں اگر…",
      text: "آپ ایک مرکوز اور خوبصورتی سے سادہ نماز ایپ چاہتے ہیں، اس کا اسمارٹ فجر الارم آپ کو پسند ہے، اور آپ کو اسی ایپ میں قرآن ریڈر یا اذکار کی ضرورت نہیں۔",
    },
    {
      title: "Munib Tracker چنیں اگر…",
      text: "آپ اسی ایپ میں قضا کی ٹریکنگ، اذکار، مکمل قرآن ریڈر، تلاوت کی مشق اور نماز فوکس لاک بھی چاہتے ہیں، اور سب کچھ مفت۔",
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
            [PL]: cell.text(
              "بنیادی سہولیات مفت؛ Premium امریکا میں $11.99 ماہانہ یا $49.99 سالانہ سے",
            ),
          },
        },
        { feature: "اشتہارات", cells: { munib: M.ads, [PL]: cell.text("کوئی اشتہار نہیں") } },
        {
          feature: "اکاؤنٹ ضروری",
          cells: { munib: M.account, [PL]: cell.text("ضروری نہیں (سائن اَپ نہیں)") },
        },
        {
          feature: "نماز کے اوقات ڈیوائس پر حساب",
          cells: { munib: cell.yes(), [PL]: cell.yes() },
        },
      ],
    },
    {
      group: "نماز",
      rows: [
        {
          feature: "نماز کے اوقات اور اذان",
          cells: { munib: M.times, [PL]: cell.yes("مکمل اذان Premium میں") },
        },
        { feature: "قبلہ", cells: { munib: M.qibla, [PL]: cell.yes() } },
        {
          feature: "ادا کی گئی نماز درج کرنا",
          cells: { munib: M.salahLog, [PL]: cell.yes("مفت ٹریکر") },
        },
        {
          feature: "عذر کے دن (حیض)",
          cells: { munib: M.excusedDays, [PL]: cell.yes("ماہواری موڈ تسلسل برقرار رکھتا ہے") },
        },
        {
          feature: "سنت نمازیں اور رواتب",
          cells: {
            munib: cell.yes("رواتب ٹریکر (10 یا 12)، نیز تہجد، اشراق، چاشت اور مزید"),
            [PL]: cell.unverified(),
          },
        },
        {
          feature: "قضا کا حساب",
          cells: {
            munib: M.qaza,
            [PL]: cell.partial(
              "نماز کو تاخیر سے/ادا شدہ کے طور پر نشان لگانا؛ قضا روزوں کا کاؤنٹر",
            ),
          },
        },
        {
          feature: "نماز کے وقت ایپس بلاک کرنا",
          cells: { munib: P.focusLock, [PL]: cell.yes("PrayFirst، Premium") },
        },
        {
          feature: "اسمارٹ فجر الارم",
          cells: { munib: cell.no("صرف اذان اور یاد دہانیاں"), [PL]: cell.yes("Premium") },
        },
        {
          feature: "مسجد کے اوقات",
          cells: {
            munib: cell.yes("مسجد تلاش، نیز اقامت کے اپنے نجی اوقات، خود درج کیے ہوئے"),
            [PL]: cell.partial("مسجد کے اوقات بیٹا میں"),
          },
        },
      ],
    },
    {
      group: "ذکر اور قرآن",
      rows: [
        {
          feature: "تسبیح کاؤنٹر",
          cells: { munib: M.tasbeeh, [PL]: cell.partial("صرف Apple Watch پر، Premium") },
        },
        { feature: "اذکار اور دعائیں", cells: { munib: M.zikr, [PL]: cell.unverified() } },
        {
          feature: "قرآن ریڈر",
          cells: { munib: M.quranReader, [PL]: cell.no("Pillars کے اپنے بلاگ کے مطابق") },
        },
        {
          feature: "ختم کا منصوبہ",
          cells: { munib: M.khatm, [PL]: cell.no("Pillars کے اپنے بلاگ کے مطابق") },
        },
        {
          feature: "زکوٰۃ کیلکولیٹر",
          cells: { munib: M.zakat, [PL]: cell.no("Pillars کے اپنے بلاگ کے مطابق") },
        },
        { feature: "تلاوت کی مشق", cells: { munib: M.recitation, [PL]: cell.unverified() } },
      ],
    },
    devicesGroup({
      [PL]: {
        ios: cell.yes("iPhone اور iPad"),
        android: cell.yes(),
        appleWatch: cell.yes("Premium"),
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes("مفت"),
      },
    }),
  ],
  strengths: {
    munib: [
      "قضا کیلکولیٹر اور منصوبہ",
      "فون پر اذکار، دعائیں اور تسبیح",
      "تلاوت کی مشق کے ساتھ مکمل قرآن ریڈر",
      "Apple Watch کی ساتھی ایپ، Wear OS ٹائلز اور TV ایپس، سب مفت",
      "نماز فوکس لاک اور مسجد تلاش بغیر کسی قیمت کے",
    ],
    [PL]: [
      "صاف ستھرا، مرکوز نماز کا تجربہ",
      "Munib Tracker کی طرح نہ اشتہار، نہ اکاؤنٹ",
      "PrayFirst ایپ بلاکنگ اور اسمارٹ فجر الارم (Premium)",
      "ماہواری موڈ جو تسلسل برقرار رکھتا ہے",
      "App Store پر بہت اچھی ریٹنگ",
    ],
  },
  bestFor: {
    munib: "وہ لوگ جو نماز، قضا، ذکر اور قرآن کے لیے ایک ہی نجی ایپ چاہتے ہیں۔",
    [PL]: "وہ لوگ جو ایک سادہ نماز ایپ چاہتے ہیں اور ایپ بلاکنگ جیسے توجہ کے ٹولز کو اہمیت دیتے ہیں۔",
  },
  sources: [
    { label: "Pillars — آفیشل ویب سائٹ", url: "https://thepillarsapp.com" },
    { label: "Pillars — خصوصیات اور قیمتیں (/ai)", url: "https://thepillarsapp.com/ai" },
    {
      label: "Pillars بلاگ — رمضان کی بہترین ایپس",
      url: "https://thepillarsapp.com/blog/best-ramadan-apps",
    },
    { label: "Pillars — App Store لسٹنگ", url: "https://apps.apple.com/us/app/id1559086853" },
    {
      label: "Pillars — Google Play لسٹنگ",
      url: "https://play.google.com/store/apps/details?id=com.pillars.pillars",
    },
  ],
  faqs: [
    {
      question: "کیا Pillars اور Munib Tracker دونوں اشتہارات سے پاک ہیں؟",
      answer:
        "جی ہاں۔ دونوں کے مطابق ان میں کوئی اشتہار نہیں اور اکاؤنٹ ضروری نہیں۔ Pillars اختیاری Premium سہولیات دیتی ہے؛ Munib Tracker کا کوئی پیڈ پلان نہیں۔",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/salah-tracker",
    "/features/zikr-tracker",
  ],
};
