/**
 * Lean slug lists for `src/proxy.ts`, which must not import page copy.
 * `content.test.ts` asserts these match the content registries exactly.
 */
export const FEATURE_SLUGS = [
  "salah-tracker",
  "qaza-salah-tracker",
  "zikr-tracker",
  "daily-islamic-habits",
  "worship-progress",
  "quran",
  "quran-practice",
  "learn-quran",
  "prayer-times-qibla",
  "widgets-and-devices",
  "masjid-finder",
  "salah-focus-lock",
  "family-and-friends",
  "islamic-will-and-inheritance",
  "hadith",
  "my-madhhab",
  "fasting-tracker",
  "umrah-mode",
  "private-reflection",
] as const;

export const COMPARE_SLUGS = [
  "best-salah-tracker-apps",
  "munib-tracker-vs-muslim-pro",
  "munib-tracker-vs-islam360",
  "munib-tracker-vs-tarteel",
  "munib-tracker-vs-pillars",
  "munib-tracker-vs-athan",
  "islamic-habit-tracker-apps",
] as const;

export const AUDIENCE_SLUGS = ["new-muslims", "quran-learners", "beginners", "families"] as const;

/** category → article slugs */
export const ARTICLE_SLUGS: Readonly<Record<string, readonly string[]>> = {
  salah: [
    "how-to-build-a-consistent-salah-habit",
    "what-is-qaza-salah",
    "how-to-track-missed-prayers",
  ],
  zikr: ["how-to-build-a-daily-zikr-routine", "morning-and-evening-adhkar"],
  "quran-learning": [
    "how-to-start-learning-the-quran",
    "how-to-improve-quran-recitation",
    "how-to-practice-quran-reading-every-day",
    "how-to-memorize-the-quran",
    "how-to-help-children-learn-the-quran",
  ],
  "islamic-habits": [
    "how-to-stay-consistent-with-daily-worship",
    "how-to-build-better-islamic-habits",
  ],
};

/** Paths under a known page that Next.js serves itself (metadata images). */
const PAGE_SUFFIXES = new Set(["opengraph-image"]);

/** True when `/features/x`, `/compare/x`, `/for/x` or `/resources/...` names a real page. */
export function isKnownContentPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  const [section, a, b] = parts;
  if (parts.length < 2) return true; // hub pages: /features, /compare, /for, /resources
  const tail = (n: number) =>
    parts.length === n || (parts.length === n + 1 && PAGE_SUFFIXES.has(parts[n] ?? ""));
  switch (section) {
    case "features":
      return Boolean(a && (FEATURE_SLUGS as readonly string[]).includes(a) && tail(2));
    case "compare":
      return Boolean(a && (COMPARE_SLUGS as readonly string[]).includes(a) && tail(2));
    case "for":
      return Boolean(a && (AUDIENCE_SLUGS as readonly string[]).includes(a) && tail(2));
    case "resources": {
      const articles = a ? ARTICLE_SLUGS[a] : undefined;
      if (!articles) return false;
      if (parts.length === 2) return true;
      return Boolean(b && articles.includes(b) && tail(3));
    }
    default:
      return true;
  }
}
