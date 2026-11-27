import { cell, MUNIB, VERIFIED_ON } from "@/content/compare/shared";
import {
  devicesGroupUr as devicesGroup,
  NOT_ON_APP_STORE_UR as NOT_ON_APP_STORE,
} from "@/content/i18n/ur/compare-devices";
import { MUNIB_CELLS_UR as M, MUNIB_NF_UR as P } from "@/content/i18n/ur/compare-shared";
import type { ComparePage } from "@/content/types";

const AT = "athan";

export const vsAthanUr: ComparePage = {
  slug: "munib-tracker-vs-athan",
  kind: "versus",
  title: "Munib Tracker بمقابلہ Athan (IslamicFinder)",
  seoTitle: "Munib Tracker بمقابلہ Athan ایپ: نماز ٹریکنگ اور قضا کا موازنہ",
  seoDescription:
    "Munib Tracker اور IslamicFinder کی Athan ایپ کا موازنہ: نماز کے اوقات، نماز کا ریکارڈ، قضا، ذکر، قرآن، تلاوت کی مشق، اشتہارات اور پرائیویسی لیبلز۔",
  description:
    "Athan نماز کے اوقات کی مقبول ایپ ہے جس میں نماز کا ریکارڈ اور تسلسل موجود ہے۔ Munib Tracker اس پر قضا کی منصوبہ بندی اور تلاوت کی مشق کا اضافہ کرتی ہے، بغیر اشتہارات کے۔",
  keywords: ["munib tracker بمقابلہ athan", "athan ایپ کا متبادل", "islamicfinder athan کا متبادل"],
  cluster: "comparison",
  published: "2026-11-23",
  updated: "2026-11-23",
  eyebrow: "موازنہ",
  intro: [
    "IslamicFinder کی Athan نماز کے اوقات کی سب سے مقبول ایپس میں سے ایک ہے، جسے Google Play پر 300,000 سے زیادہ ریٹنگز سے 4.8 کی درجہ بندی ملی ہے۔ اوقات اور اذان کے علاوہ یہ تسلسل اور روزانہ اہداف کے ساتھ آپ کی پانچوں نمازوں کا ریکارڈ رکھتی ہے، اور اس میں ماہواری موڈ، دعائیں اور قرآن ریڈر بھی شامل ہیں۔",
    "Munib Tracker نماز کے اوقات اور نماز کے ریکارڈ میں اس سے ملتی جلتی ہے، اور اس کے ساتھ قضا کی منصوبہ بندی، رہنمائی والے اذکار، تلاوت کی مشق اور سیکھنے کی لائبریری بھی دیتی ہے، بغیر اشتہارات کے۔ آفیشل لسٹنگز کی بنیاد پر دونوں کا آمنے سامنے جائزہ یہ ہے۔",
  ],
  apps: [
    MUNIB,
    {
      id: AT,
      name: "Athan",
      developer: "IslamicFinder",
      url: "https://www.islamicfinder.org/athan/",
    },
  ],
  verifiedOn: VERIFIED_ON,
  summary: [
    {
      title: "Athan چنیں اگر…",
      text: "آپ نماز کے اوقات اور اذان کی ایک پرانی اور معتبر ایپ چاہتے ہیں جس میں نماز کا سادہ ریکارڈ، ماہواری ٹریکر اور مختصر ویڈیو کہانیاں ہوں۔",
    },
    {
      title: "Munib Tracker چنیں اگر…",
      text: "آپ قضا کی منصوبہ بندی اور حساب بھی چاہتے ہیں، رہنمائی والے اذکار کے سیشن کرنا، قرآن کی تلاوت کی مشق کرنا اور Apple Watch یا Wear OS کی ساتھی ایپ استعمال کرنا چاہتے ہیں، بغیر اشتہارات کے۔",
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
            [AT]: cell.text(
              "اشتہارات کے ساتھ مفت؛ Athan Premium (امریکا میں $1.99 ماہانہ یا $11.99 سالانہ) یا ایک بار کی ادائیگی سے اشتہارات ہٹائیں",
            ),
          },
        },
        {
          feature: "مفت ورژن میں اشتہارات",
          cells: { munib: M.ads, [AT]: cell.text('ہاں (Google Play: "Contains ads")') },
        },
        {
          feature: 'App Store پر "Data Used to Track You"',
          cells: {
            munib: cell.text("کوئی اشتہاری SDK نہیں؛ مہمان کا ڈیٹا ڈیوائس پر ہی رہتا ہے"),
            [AT]: cell.text("رابطے کی معلومات"),
          },
        },
      ],
    },
    {
      group: "نماز",
      rows: [
        { feature: "نماز کے اوقات اور اذان", cells: { munib: M.times, [AT]: cell.yes() } },
        { feature: "قبلہ", cells: { munib: M.qibla, [AT]: cell.yes() } },
        {
          feature: "ادا کی گئی نماز درج کرنا",
          cells: { munib: M.salahLog, [AT]: cell.yes("روزانہ ریکارڈ اور تسلسل") },
        },
        { feature: "روزانہ اہداف", cells: { munib: M.goals, [AT]: cell.yes("Daily Goals") } },
        {
          feature: "عذر کے دن (حیض)",
          cells: { munib: M.excusedDays, [AT]: cell.yes("ماہواری ٹریکر کے ساتھ ماہواری موڈ") },
        },
        {
          feature: "سنت نمازیں اور رواتب",
          cells: {
            munib: cell.yes("رواتب ٹریکر (10 یا 12)، نیز تہجد، اشراق، چاشت اور مزید"),
            [AT]: cell.unverified(),
          },
        },
        {
          feature: "قضا کا حساب",
          cells: { munib: M.qaza, [AT]: cell.unverified("لسٹنگز میں ذکر نہیں") },
        },
        { feature: "نماز جرنل", cells: { munib: M.journal, [AT]: cell.unverified() } },
        { feature: "مسجد تلاش", cells: { munib: P.masjidFinder, [AT]: cell.unverified() } },
      ],
    },
    {
      group: "روزے اور مواسم",
      rows: [
        {
          feature: "روزوں کی ٹریکنگ",
          cells: { munib: M.fastingTracking, [AT]: cell.unverified() },
        },
        {
          feature: "نفلی روزوں کا منصوبہ",
          cells: { munib: P.voluntaryFasting, [AT]: cell.unverified() },
        },
        { feature: "ذوالحجہ موڈ", cells: { munib: P.dhulHijjah, [AT]: cell.unverified() } },
        {
          feature: "حج اور عمرہ کی گائیڈز",
          cells: { munib: M.hajjUmrah, [AT]: cell.yes("حج اور عمرہ کی گائیڈز") },
        },
        { feature: "عمرہ کی لائیو ساتھی", cells: { munib: P.umrahMode, [AT]: cell.unverified() } },
        {
          feature: "ہجری کیلنڈر",
          cells: { munib: M.hijriCalendar, [AT]: cell.yes("ہجری اور ام القریٰ کیلنڈر") },
        },
      ],
    },
    {
      group: "ذکر اور قرآن",
      rows: [
        {
          feature: "تسبیح اور اذکار",
          cells: { munib: M.zikr, [AT]: cell.yes("تسبیح کاؤنٹر، آڈیو کے ساتھ اذکار") },
        },
        {
          feature: "قرآن کے تراجم",
          cells: { munib: M.translations, [AT]: cell.yes("45+ زبانیں") },
        },
        {
          feature: "تفسیر اور لفظ بہ لفظ",
          cells: { munib: cell.yes(), [AT]: cell.unverified() },
        },
        {
          feature: "آواز یا متن سے آیت کی شناخت",
          cells: { munib: M.verseDetector, [AT]: cell.unverified() },
        },
        {
          feature: "قرآن سیکھنا",
          cells: { munib: M.quranLearning, [AT]: cell.unverified("الگ Athan Academy ایپ") },
        },
        {
          feature: "مائیک کے ذریعے تلاوت کی مشق",
          cells: { munib: M.recitation, [AT]: cell.unverified() },
        },
        {
          feature: "حدیث کے مجموعے",
          cells: {
            munib: M.hadith,
            [AT]: cell.unverified("IslamicFinder ویب سائٹ پر حدیث کا حصہ"),
          },
        },
      ],
    },
    {
      group: "اضافی سہولیات",
      rows: [
        {
          feature: "مختصر ویڈیو کہانیاں",
          cells: { munib: cell.no(), [AT]: cell.yes("Athan Stories") },
        },
      ],
    },
    devicesGroup({
      [AT]: {
        web: cell.partial("IslamicFinder ویب سائٹ"),
        ios: cell.partial("iPhone؛ اس کی App Store لسٹنگ پر iPad ورژن نہیں"),
        android: cell.yes(),
        appleWatch: NOT_ON_APP_STORE,
        appleTv: NOT_ON_APP_STORE,
        widgets: cell.yes(),
      },
    }),
  ],
  strengths: {
    munib: [
      "قضا کیلکولیٹر اور روزانہ رفتار کا منصوبہ",
      "ماخذ حدیث کے ساتھ رہنمائی والے اذکار کے سیشن",
      "ڈیوائس پر تلاوت کی مشق",
      "Apple Watch کی ساتھی ایپ، Wear OS ٹائلز اور TV ایپس",
      "نہ اشتہارات، نہ سبسکرپشن",
      "مسجد تلاش، عمرہ موڈ اور نفلی روزوں کا منصوبہ",
    ],
    [AT]: [
      "نماز کے اوقات کی پرانی اور بہت اچھی ریٹنگ والی ایپ",
      "روزانہ اہداف اور نماز کا تسلسل",
      "ماہواری ٹریکر کے ساتھ ماہواری موڈ",
      "حج اور عمرہ کی گائیڈز اور متعدد ہجری کیلنڈر",
      "کم قیمت Premium کا انتخاب",
    ],
  },
  bestFor: {
    munib:
      "وہ لوگ جو قضا سمیت ٹریکنگ، ساتھ میں قرآن کی مشق اور سیکھنا چاہتے ہیں، بغیر اشتہارات کے۔",
    [AT]: "وہ لوگ جو بنیادی طور پر نماز کے قابلِ اعتماد اوقات اور سادہ روزانہ ریکارڈ چاہتے ہیں۔",
  },
  sources: [
    { label: "Athan — IslamicFinder ویب سائٹ", url: "https://www.islamicfinder.org/athan/" },
    {
      label: "Athan — Google Play لسٹنگ",
      url: "https://play.google.com/store/apps/details?id=com.athan",
    },
    {
      label: "Athan — App Store لسٹنگ",
      url: "https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403",
    },
  ],
  faqs: [
    {
      question: "کیا Athan قضا نمازوں کا حساب رکھتی ہے؟",
      answer:
        "ہماری آخری جانچ تک ہمیں Athan کی آفیشل لسٹنگز یا ویب سائٹ میں قضا ٹریکنگ کا ذکر نہیں ملا۔ Munib Tracker میں ایک مخصوص [قضا ٹریکر](/features/qaza-salah-tracker) موجود ہے۔",
    },
  ],
  related: [
    "/compare/best-salah-tracker-apps",
    "/features/prayer-times-qibla",
    "/features/qaza-salah-tracker",
  ],
};
