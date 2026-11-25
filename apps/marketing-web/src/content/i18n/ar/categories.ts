import type { ResourceCategory } from "@/content/types";

/**
 * Arabic translations (categories). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly ResourceCategory[] = [
  {
    slug: "salah",
    title: "الصلاة",
    seoTitle: "أدلة الصلاة — المواظبة وصلاة القضاء والصلوات الفائتة",
    seoDescription:
      "أدلة عملية موثّقة بالمصادر لبناء عادة صلاة منتظمة، وفهم صلاة القضاء وأحكامها العامة، ومتابعة الصلوات الفائتة ووضع خطة لقضائها.",
    description: "ابنِ عادة صلاة منتظمة، وافهم القضاء، وضع خطة واقعية للصلوات الفائتة.",
    feature: "salah-tracker",
  },
  {
    slug: "zikr",
    title: "الذكر والأذكار",
    seoTitle: "أدلة الذكر — ورد يومي وأذكار الصباح والمساء",
    seoDescription:
      "كيف تبني وردًا يوميًا من الذكر وتحافظ على أذكار الصباح والمساء بثبات، مع ذكر المصدر الصحيح من السنة لكل ذكر تقرؤه.",
    description: "اجعل ذكر الله وردًا يوميًا، بأذكار صحيحة مع مصادرها.",
    feature: "zikr-tracker",
  },
  {
    slug: "quran-learning",
    title: "تعلّم القرآن",
    seoTitle: "أدلة تعلّم القرآن — القراءة والتلاوة والحفظ",
    seoDescription:
      "أدلة عملية لتعلّم قراءة القرآن، وتحسين التلاوة، والمواظبة على القراءة اليومية، والحفظ، ومساعدة الأطفال على تعلّم القرآن.",
    description: "تعلّم القراءة، وحسّن تلاوتك، واقرأ كل يوم، واحفظ، وساعد الأطفال على التعلّم.",
    feature: "learn-quran",
  },
  {
    slug: "islamic-habits",
    title: "العادات الإسلامية",
    seoTitle: "العادات الإسلامية — المواظبة على العبادة اليومية",
    seoDescription:
      "كيف تبني عادات إسلامية تدوم وتواظب على العبادة اليومية، من خلال أعمال صغيرة دائمة، وأوقات ثابتة تربطها بها، ومتابعة لطيفة.",
    description: "ابنِ عادات تدوم وواظب على العبادة اليومية دون أن تُنهك نفسك.",
    feature: "daily-islamic-habits",
  },
];
