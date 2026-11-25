import type { ResourceCategory } from "@/content/types";

/**
 * Urdu translations (categories). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly ResourceCategory[] = [
  {
    slug: "salah",
    title: "نماز",
    seoTitle: "نماز کی گائیڈز — پابندی، قضا اور چھوٹی ہوئی نمازیں",
    seoDescription:
      "نماز کی پابند عادت بنانے، قضا نماز کو سمجھنے، اور چھوٹی ہوئی نمازوں کا حساب رکھنے اور انہیں ادا کرنے پر حوالوں کے ساتھ عملی گائیڈز۔",
    description:
      "نماز کی پابند عادت بنائیں، قضا کو سمجھیں، اور چھوٹی ہوئی نمازوں کے لیے ایک قابلِ عمل منصوبہ بنائیں۔",
    feature: "salah-tracker",
  },
  {
    slug: "zikr",
    title: "ذکر اور اذکار",
    seoTitle: "ذکر کی گائیڈز — روزانہ معمول اور صبح و شام کے اذکار",
    seoDescription:
      "ذکر کا روزانہ معمول کیسے بنائیں اور صبح و شام کے اذکار کی پابندی کیسے کریں، ہر ذکر کے مستند حوالوں کے ساتھ عملی رہنمائی۔",
    description: "اللہ کے ذکر کو روزانہ کا معمول بنائیں، مستند اذکار اور ان کے حوالوں کے ساتھ۔",
    feature: "zikr-tracker",
  },
  {
    slug: "quran-learning",
    title: "قرآن سیکھنا",
    seoTitle: "قرآن سیکھنے کی گائیڈز — ناظرہ، تلاوت اور حفظ",
    seoDescription:
      "قرآن پڑھنا سیکھنے، تلاوت بہتر بنانے، روزانہ تلاوت کرنے، حفظ کرنے، اور بچوں کو قرآن سکھانے میں مدد کے لیے عملی گائیڈز۔",
    description:
      "پڑھنا سیکھیں، اپنی تلاوت بہتر بنائیں، روز پڑھیں، حفظ کریں، اور بچوں کو سیکھنے میں مدد دیں۔",
    feature: "learn-quran",
  },
  {
    slug: "islamic-habits",
    title: "اسلامی عادات",
    seoTitle: "اسلامی عادات — روزانہ عبادت میں پابندی",
    seoDescription:
      "چھوٹے اعمال، اچھے سہاروں اور نرم ٹریکنگ کے ذریعے دیرپا اسلامی عادات کیسے بنائیں اور روزانہ عبادت میں پابندی کیسے برقرار رکھیں۔",
    description: "دیرپا عادات بنائیں اور روزانہ عبادت میں پابند رہیں، تھکے ہارے بغیر۔",
    feature: "daily-islamic-habits",
  },
];
