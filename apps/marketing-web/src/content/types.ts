/**
 * Structured content model for the marketing site.
 *
 * Every long-form page (feature, comparison, audience, article) is plain typed
 * data rendered by a shared template, so adding a page means adding one file —
 * not building a new page component.
 *
 * Inline text in any `string` rendered through `<RichText>` supports a tiny
 * markup subset:
 *   - `[label](/internal-path)` or `[label](https://external.example)` links
 *   - `**bold**`
 * Nothing else is parsed (no HTML), so content can never inject markup.
 */

/** ISO date (YYYY-MM-DD). */
export type IsoDate = `${number}-${number}-${number}`;

export type FaqItem = {
  question: string;
  answer: string;
};

export type SourceLink = {
  label: string;
  url: string;
};

/** Keys of real app screenshots in `src/lib/screenshots.ts`. */
export type ScreenshotKey =
  | "home"
  | "tracker"
  | "qaza"
  | "zikr"
  | "tasbeeh"
  | "quran"
  | "qibla"
  | "names"
  | "home-light"
  | "tracker-light"
  | "quran-light"
  | "zikr-light"
  | "watch-schedule"
  | "wear-salah-tile"
  | "wear-tasbeeh-tile"
  | "tv-home"
  | "offline-data";

/** Keyword clusters — one primary URL per cluster to avoid cannibalization. */
export type TopicCluster =
  | "islamic-app"
  | "salah"
  | "qaza"
  | "zikr"
  | "quran-reading"
  | "quran-practice"
  | "quran-learning"
  | "habits"
  | "progress"
  | "prayer-times"
  | "devices"
  | "audience"
  | "comparison";

/** Shared SEO + editorial fields for every content page. */
export type PageMeta = {
  slug: string;
  /** Visible H1. */
  title: string;
  /** `<title>` (brand suffix is added by the root template unless it already contains it). */
  seoTitle: string;
  /** Meta description, 140–160 characters. */
  seoDescription: string;
  /** Short summary used on cards and hub pages. */
  description: string;
  /** Primary keyword first; used for planning and the keyword map, not a meta tag. */
  keywords: readonly string[];
  cluster: TopicCluster;
  published: IsoDate;
  updated: IsoDate;
};

// ── Long-form body blocks ────────────────────────────────────────────────

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: readonly string[] }
  | { type: "ol"; items: readonly string[] }
  | {
      /** A cited Qur'an ayah or hadith. Arabic must be copied verbatim from a verified source. */
      type: "evidence";
      kind: "quran" | "hadith";
      arabic?: string;
      /**
       * Meaning in the page's language, from an open-source translation (never
       * AI-written). English pages always have one; Arabic pages omit it and
       * show `arabic` alone; Urdu pages use Jalandhry (Qur'an) / fawazahmed0
       * `urd-*` (hadith), or keep the English meaning when none exists.
       */
      translation?: string;
      /** BCP 47 language of `translation` when it differs from the page (English fallback). */
      translationLang?: string;
      /** e.g. "Qur'an 2:286" or "Sahih al-Bukhari 6464; Sahih Muslim 783". */
      reference: string;
      /** Link to the source (quran.com / sunnah.com). */
      href?: string;
      /** Translator / grading note, e.g. "Translation: Saheeh International". */
      note?: string;
    }
  | {
      type: "note";
      /** info = practical tip · scholar = consult-a-scholar / difference of opinion · app = how Munib Tracker helps. */
      tone: "info" | "scholar" | "app";
      title?: string;
      text: string;
    }
  | { type: "steps"; items: readonly { title: string; text: string }[] }
  | {
      type: "table";
      caption?: string;
      head: readonly string[];
      rows: readonly (readonly string[])[];
    };

// ── Feature landing pages ────────────────────────────────────────────────

export type FeatureSlug =
  | "salah-tracker"
  | "qaza-salah-tracker"
  | "zikr-tracker"
  | "quran"
  | "quran-practice"
  | "learn-quran"
  | "daily-islamic-habits"
  | "worship-progress"
  | "prayer-times-qibla"
  | "widgets-and-devices"
  | "masjid-finder"
  | "salah-focus-lock"
  | "family-and-friends"
  | "islamic-will-and-inheritance"
  | "hadith"
  | "my-madhhab"
  | "fasting-tracker"
  | "umrah-mode"
  | "private-reflection";

export type FeatureIconKey =
  | "salah"
  | "qaza"
  | "zikr"
  | "quran"
  | "practice"
  | "learn"
  | "habits"
  | "progress"
  | "times"
  | "devices"
  | "masjid"
  | "focus"
  | "family"
  | "will"
  | "hadith"
  | "madhhab"
  | "fasting"
  | "umrah"
  | "reflection";

export type ScreenshotSlot = {
  key: ScreenshotKey;
  /** Caption shown under the device; also used as alt text when it describes the screen. */
  caption: string;
};

export type FeaturePage = PageMeta & {
  slug: FeatureSlug;
  icon: FeatureIconKey;
  /** Short label for navigation (e.g. "Salah tracker"). */
  navLabel: string;
  /** One-line navigation hint. */
  navHint: string;
  group: "track" | "quran" | "everyday" | "life";
  eyebrow: string;
  intro: string;
  /** Hero screenshot (real) — or `null` when an illustration is shown instead. */
  hero: ScreenshotSlot | null;
  /** 1. What it does — the capability list, grouped. */
  whatItDoes: {
    title: string;
    intro?: string;
    groups: readonly { title: string; items: readonly string[] }[];
  };
  /** 2. Why you need it — the problem, in the reader's words. */
  why: { title: string; paragraphs: readonly string[] };
  /** 3. How it works — 3–5 steps. */
  howItWorks: { title: string; steps: readonly { title: string; text: string }[] };
  /** 4. Benefits. */
  benefits: readonly { title: string; text: string }[];
  /** 5. Extra real screenshots. */
  gallery?: readonly ScreenshotSlot[];
  /** 6. Practical usage examples. */
  examples: { title: string; items: readonly { title: string; text: string }[] };
  /** Honest limits, platform notes, or scholarly caveats. */
  notes?: readonly { tone: "info" | "scholar" | "app"; title?: string; text: string }[];
  /** 7. FAQs (rendered as visible Q&A; no FAQPage markup on feature pages). */
  faqs: readonly FaqItem[];
  /** 8. Related features. */
  related: readonly FeatureSlug[];
  /** Related guides (article hrefs). */
  guides?: readonly string[];
  /** 9. Download CTA copy. */
  cta: { title: string; text: string };
};

// ── Comparison pages ─────────────────────────────────────────────────────

/** `planned` = on Munib Tracker's public roadmap, not in the app yet ("Coming soon"). */
export type CellStatus = "yes" | "no" | "partial" | "unverified" | "planned";

/** A table cell: a status, optionally with a short qualifier. */
export type CompareCell = { status: CellStatus; note?: string } | { text: string };

export type CompareApp = {
  id: string;
  name: string;
  developer?: string;
  url?: string;
};

export type ComparePage = PageMeta & {
  kind: "versus" | "roundup";
  eyebrow: string;
  intro: readonly string[];
  /** First app is always Munib Tracker. */
  apps: readonly CompareApp[];
  verifiedOn: IsoDate;
  /** Quick verdict shown above the table. */
  summary: readonly { title: string; text: string }[];
  table: readonly {
    group: string;
    rows: readonly { feature: string; cells: Readonly<Record<string, CompareCell>> }[];
  }[];
  /** Strengths per app id. */
  strengths: Readonly<Record<string, readonly string[]>>;
  /** Who each app suits, per app id. */
  bestFor: Readonly<Record<string, string>>;
  body?: readonly Block[];
  sources: readonly SourceLink[];
  faqs: readonly FaqItem[];
  related: readonly string[];
};

// ── Audience / use-case pages ────────────────────────────────────────────

export type AudiencePage = PageMeta & {
  eyebrow: string;
  navLabel: string;
  navHint: string;
  intro: string;
  hero: ScreenshotSlot | null;
  /** The situation this reader is in. */
  situation: { title: string; paragraphs: readonly string[] };
  /** How the app helps — each item links to the feature that does it. */
  helps: readonly { title: string; text: string; feature?: FeatureSlug; href?: string }[];
  /** A suggested first week / routine. */
  plan: { title: string; steps: readonly { title: string; text: string }[] };
  /** What the app does NOT do for this audience (honesty). */
  limits?: readonly string[];
  faqs: readonly FaqItem[];
  guides: readonly string[];
  cta: { title: string; text: string };
};

// ── Articles (resources hub) ─────────────────────────────────────────────

export type ResourceCategorySlug = "salah" | "zikr" | "quran-learning" | "islamic-habits";

export type ResourceCategory = {
  slug: ResourceCategorySlug;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  /** The feature page this topic relates to (for contextual CTAs). */
  feature: FeatureSlug;
};

export type Article = PageMeta & {
  category: ResourceCategorySlug;
  /** 3–5 key takeaways shown at the top. */
  takeaways: readonly string[];
  body: readonly Block[];
  /** Where the reader can verify every citation. */
  sources: readonly SourceLink[];
  faqs?: readonly FaqItem[];
  /** Contextual, low-key product tie-in shown once near the end. */
  appTieIn: { feature: FeatureSlug; text: string };
  /** Related hrefs (other articles, feature pages). */
  related: readonly string[];
};
