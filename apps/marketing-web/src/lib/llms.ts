import {
  APP_AUTHOR,
  APP_NAME,
  DUA_COUNT,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_URL,
} from "@munib-tracker/shared/constants";
import { AUDIENCE_PAGES, audienceHref } from "@/content/audiences";
import { COMPARE_PAGES, compareHref } from "@/content/compare";
import { FEATURE_PAGES, featureHref } from "@/content/features";
import { MUNIB_FEATURE_INVENTORY } from "@/content/munib-features";
import { ARTICLES, articleHref } from "@/content/resources";
import { categoryHref, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import type {
  Article,
  AudiencePage,
  Block,
  CompareCell,
  ComparePage,
  FaqItem,
  FeaturePage,
} from "@/content/types";
import { LOCALE_META } from "@/i18n/locales";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/routing";
import { FAQ_IDS } from "@/lib/faq";
import { PROJECT_LICENSE_NAME } from "@/lib/open-source";
import { localizedUrl } from "@/lib/seo";
import { GITHUB_REPO_URL, PRODUCT_APP_URL, SITE_PATHS, SITE_URL } from "@/lib/site";
import about from "@/messages/en/about.json";
import audiencesHub from "@/messages/en/audiencesHub.json";
import compareHub from "@/messages/en/compareHub.json";
import contact from "@/messages/en/contact.json";
import contributors from "@/messages/en/contributors.json";
import credits from "@/messages/en/credits.json";
import download from "@/messages/en/download.json";
import faq from "@/messages/en/faq.json";
import featuresHub from "@/messages/en/featuresHub.json";
import howItWorks from "@/messages/en/howItWorks.json";
import learn from "@/messages/en/learn.json";
import openSource from "@/messages/en/openSource.json";
import press from "@/messages/en/press.json";
import privacy from "@/messages/en/privacy.json";
import resourcesHub from "@/messages/en/resourcesHub.json";
import structuredData from "@/messages/en/structuredData.json";
import terms from "@/messages/en/terms.json";
import why from "@/messages/en/why.json";

/**
 * `/llms.txt` and `/llms-full.txt` (https://llmstxt.org): a Markdown map of
 * the site for AI assistants, and the same pages with their full text.
 *
 * Both are built from the content registries and the English catalogs — the
 * same data the pages render — so a new feature page, comparison or guide is
 * listed automatically and the copy can't drift from the site.
 *
 * The format is fixed by the spec: one H1, a blockquote summary, free
 * Markdown without headings, then H2 sections of `- [name](url): notes`
 * links; a section called "Optional" holds what can be skipped. The files are
 * English (the site's default locale); the translated editions are linked.
 */

const SECTION_LABELS = {
  features: "Features",
  audiences: "Who it's for",
  compare: "Comparisons",
  guides: "Guides",
  about: "About the app",
  optional: "Optional",
} as const;

const CELL_LABELS = {
  yes: "Yes",
  no: "No",
  partial: "Partial",
  unverified: "Not verified",
  planned: "Coming soon",
} as const;

/** ICU arguments used by the catalog strings quoted here. */
const ARGS: Readonly<Record<string, string>> = {
  appName: APP_NAME,
  duaCount: String(DUA_COUNT),
  license: PROJECT_LICENSE_NAME,
};

/** Fills simple ICU arguments (`{appName}`, `{duaCount, number}`). */
function fill(text: string): string {
  return text.replace(/\{(\w+)(?:,\s*\w+)?\}/g, (whole, name: string) => ARGS[name] ?? whole);
}

function url(path: string): string {
  return localizedUrl(path, DEFAULT_LOCALE);
}

/** Turns inline `[label](/path)` links into absolute URLs; `**bold**` is already Markdown. */
export function absolutizeLinks(text: string): string {
  return text.replace(/\]\((\/[^)\s]*)\)/g, (_, path: string) => {
    const [pathname = "/", hash] = path.split("#");
    return `](${url(pathname)}${hash ? `#${hash}` : ""})`;
  });
}

const md = (text: string) => absolutizeLinks(fill(text));

/** One link line of an llms.txt file list. */
function link(title: string, path: string, notes: string): string {
  return `- [${fill(title)}](${url(path)}): ${fill(notes)}`;
}

type Meta = { title: string; description: string };

/** Static pages worth an assistant's attention, in reading order. */
const ABOUT_PAGES: readonly (readonly [string, Meta])[] = [
  [SITE_PATHS.howItWorks, howItWorks.meta],
  [SITE_PATHS.why, why.meta],
  [SITE_PATHS.learn, learn.meta],
  [SITE_PATHS.download, download.meta],
  [SITE_PATHS.faq, faq.meta],
  [SITE_PATHS.about, about.meta],
  [SITE_PATHS.privacy, privacy.meta],
];

/** Hubs and housekeeping pages: skippable when context is short. */
const OPTIONAL_PAGES: readonly (readonly [string, Meta])[] = [
  [SITE_PATHS.features, featuresHub.meta],
  [SITE_PATHS.audiences, audiencesHub.meta],
  [SITE_PATHS.compare, compareHub.meta],
  [SITE_PATHS.resources, resourcesHub.meta],
  [SITE_PATHS.credits, credits.meta],
  [SITE_PATHS.openSource, openSource.meta],
  [SITE_PATHS.contributors, contributors.meta],
  [SITE_PATHS.press, press.meta],
  [SITE_PATHS.terms, terms.meta],
  [SITE_PATHS.contact, contact.meta],
];

function summary(): string {
  return fill(structuredData.siteDescription);
}

/** Facts an assistant most often needs, from constants so they can't drift. */
function keyFacts(): string[] {
  const otherLocales = LOCALES.filter((l) => l !== DEFAULT_LOCALE)
    .map((l) => `[${LOCALE_META[l].englishName}](${localizedUrl("/", l)})`)
    .join(" and ");
  return [
    `- Price: free for personal use, with no ads, no subscriptions and no in-app purchases. No account is needed; signing in (Google, Apple or Facebook) is optional and only adds sync and sharing.`,
    `- Platforms: iPhone, iPad, Android phones and tablets, the web (installable as a PWA), Apple TV and Android TV, with Apple Watch and Wear OS companions.`,
    `- Download: [App Store](${OFFICIAL_IOS_APP_STORE_URL}), [Google Play](${OFFICIAL_ANDROID_PLAY_STORE_URL}), [web app](${PRODUCT_APP_URL}).`,
    `- Privacy: personal records stay on the device unless you sign in to sync. Qur'an practice audio is processed on the device and never recorded, stored or uploaded.`,
    `- Content: the Qur'an, hadith, adhkar and ${DUA_COUNT} duas come from credited open datasets, never written by hand or by AI; sources are listed on the [credits page](${url(SITE_PATHS.credits)}).`,
    `- Languages: the app interface has 24 languages. This site is in English, ${otherLocales}.`,
    `- Terms used: Salah (prayer, namaz), Qaza (qada, make-up of missed prayers), Zikr and adhkar (dhikr, remembrance), Tasbeeh (tasbih counter), Adhan (azan), Masjid (mosque).`,
    `- Made by ${APP_AUTHOR}. Source code: [GitHub](${GITHUB_REPO_URL}), under the ${PROJECT_LICENSE_NAME}.`,
    `- Full text of every page below in one file: [llms-full.txt](${SITE_URL}/llms-full.txt). Each feature, audience, comparison and guide page also has a Markdown edition at its URL plus \`.md\` (for example ${markdownUrl("/features/salah-tracker")}).`,
  ];
}

/** `/llms.txt`: the site map for AI assistants. */
export function buildLlmsTxt(): string {
  const section = (title: string, lines: readonly string[]) => [`## ${title}`, "", ...lines, ""];
  const pages = (list: readonly (readonly [string, Meta])[]) =>
    list.map(([path, meta]) => link(meta.title, path, meta.description));

  return [
    `# ${APP_NAME}`,
    "",
    `> ${summary()}`,
    "",
    ...keyFacts(),
    "",
    ...section(
      SECTION_LABELS.features,
      FEATURE_PAGES.map((f) => link(f.title, featureHref(f.slug), f.description)),
    ),
    ...section(
      SECTION_LABELS.audiences,
      AUDIENCE_PAGES.map((a) => link(a.title, audienceHref(a.slug), a.description)),
    ),
    ...section(
      SECTION_LABELS.compare,
      COMPARE_PAGES.map((c) => link(c.title, compareHref(c.slug), c.description)),
    ),
    ...section(
      SECTION_LABELS.guides,
      ARTICLES.map((a) => link(a.title, articleHref(a), a.description)),
    ),
    ...section(SECTION_LABELS.about, pages(ABOUT_PAGES)),
    ...section(SECTION_LABELS.optional, [
      ...pages(OPTIONAL_PAGES),
      ...RESOURCE_CATEGORIES.map((c) => link(c.seoTitle, categoryHref(c.slug), c.description)),
    ]),
  ]
    .join("\n")
    .replace(/\n+$/, "\n");
}

// ── llms-full.txt ────────────────────────────────────────────────────────

function pageHeader(page: { title: string; updated: string }, path: string, lead: string) {
  return [`### ${page.title}`, "", `Source: ${url(path)} (updated ${page.updated})`, "", md(lead)];
}

function bullets(items: readonly string[]): string[] {
  return items.map((item) => `- ${md(item)}`);
}

function titled(items: readonly { title: string; text: string }[]): string[] {
  return items.map((item) => `- **${item.title}:** ${md(item.text)}`);
}

function faqs(items: readonly FaqItem[] | undefined): string[] {
  if (!items?.length) return [];
  return [
    "#### Questions and answers",
    "",
    ...items.flatMap((f) => [`**${md(f.question)}**`, "", md(f.answer), ""]),
  ];
}

function featureText(f: FeaturePage): string[] {
  return [
    ...pageHeader(f, featureHref(f.slug), f.intro),
    "",
    `#### ${f.whatItDoes.title}`,
    "",
    ...(f.whatItDoes.intro ? [md(f.whatItDoes.intro), ""] : []),
    ...f.whatItDoes.groups.flatMap((g) => [`**${g.title}**`, "", ...bullets(g.items), ""]),
    `#### ${f.why.title}`,
    "",
    ...f.why.paragraphs.flatMap((p) => [md(p), ""]),
    `#### ${f.howItWorks.title}`,
    "",
    ...f.howItWorks.steps.map((s, i) => `${i + 1}. **${s.title}:** ${md(s.text)}`),
    "",
    "#### Benefits",
    "",
    ...titled(f.benefits),
    "",
    `#### ${f.examples.title}`,
    "",
    ...titled(f.examples.items),
    "",
    ...(f.notes?.length
      ? [
          "#### Limits and notes",
          "",
          ...f.notes.map((n) => `- ${n.title ? `**${n.title}:** ` : ""}${md(n.text)}`),
          "",
        ]
      : []),
    ...faqs(f.faqs),
  ];
}

function audienceText(a: AudiencePage): string[] {
  return [
    ...pageHeader(a, audienceHref(a.slug), a.intro),
    "",
    `#### ${a.situation.title}`,
    "",
    ...a.situation.paragraphs.flatMap((p) => [md(p), ""]),
    "#### How the app helps",
    "",
    ...titled(a.helps),
    "",
    `#### ${a.plan.title}`,
    "",
    ...a.plan.steps.map((s, i) => `${i + 1}. **${s.title}:** ${md(s.text)}`),
    "",
    ...(a.limits?.length ? ["#### What it does not do", "", ...bullets(a.limits), ""] : []),
    ...faqs(a.faqs),
  ];
}

function cellText(cell: CompareCell | undefined): string {
  if (!cell) return "";
  const text =
    "text" in cell ? cell.text : `${CELL_LABELS[cell.status]}${cell.note ? ` (${cell.note})` : ""}`;
  // A pipe would end the table cell.
  return md(text).replace(/\|/g, "/");
}

function blockText(block: Block): string[] {
  switch (block.type) {
    case "p":
      return [md(block.text), ""];
    case "h2":
      return [`#### ${block.text}`, ""];
    case "h3":
      return [`**${block.text}**`, ""];
    case "ul":
      return [...bullets(block.items), ""];
    case "ol":
      return [...block.items.map((item, i) => `${i + 1}. ${md(item)}`), ""];
    case "steps":
      return [...block.items.map((s, i) => `${i + 1}. **${s.title}:** ${md(s.text)}`), ""];
    case "note":
      return [`> ${block.title ? `**${block.title}:** ` : ""}${md(block.text)}`, ""];
    case "evidence":
      // Scripture is quoted exactly as the page shows it, with its reference.
      return [
        ...(block.arabic ? [`> ${block.arabic}`, ">"] : []),
        ...(block.translation ? [`> ${block.translation}`, ">"] : []),
        `> — ${block.reference}${block.href ? ` (${block.href})` : ""}${block.note ? `. ${block.note}` : ""}`,
        "",
      ];
    case "table":
      return [
        ...(block.caption ? [`**${block.caption}**`, ""] : []),
        `| ${block.head.join(" | ")} |`,
        `| ${block.head.map(() => "---").join(" | ")} |`,
        ...block.rows.map((row) => `| ${row.map((c) => md(c).replace(/\|/g, "/")).join(" | ")} |`),
        "",
      ];
  }
}

function sources(list: readonly { label: string; url: string }[]): string[] {
  if (!list.length) return [];
  return ["#### Sources", "", ...list.map((s) => `- [${s.label}](${s.url})`), ""];
}

function compareText(c: ComparePage): string[] {
  const names = c.apps.map((a) => a.name);
  return [
    ...pageHeader(c, compareHref(c.slug), c.intro.join("\n\n")),
    "",
    `Facts last verified on ${c.verifiedOn} against official websites and store listings.`,
    "",
    "#### Quick answer",
    "",
    ...titled(c.summary),
    "",
    "#### Feature comparison",
    "",
    `| Feature | ${names.join(" | ")} |`,
    `| --- | ${names.map(() => "---").join(" | ")} |`,
    ...c.table.flatMap((group) => [
      `| **${group.group}** | ${names.map(() => "").join(" | ")} |`,
      ...group.rows.map(
        (row) => `| ${row.feature} | ${c.apps.map((a) => cellText(row.cells[a.id])).join(" | ")} |`,
      ),
    ]),
    "",
    ...c.apps.flatMap((a) => [
      `#### ${a.name}`,
      "",
      `Best for: ${md(c.bestFor[a.id] ?? "")}`,
      "",
      ...bullets(c.strengths[a.id] ?? []),
      "",
    ]),
    ...(c.body ?? []).flatMap(blockText),
    ...sources(c.sources),
    ...faqs(c.faqs),
  ];
}

function articleText(a: Article): string[] {
  return [
    ...pageHeader(a, articleHref(a), a.description),
    "",
    "#### Key takeaways",
    "",
    ...bullets(a.takeaways),
    "",
    ...a.body.flatMap(blockText),
    ...sources(a.sources),
    ...faqs(a.faqs),
  ];
}

function inventoryText(): string[] {
  return MUNIB_FEATURE_INVENTORY.flatMap((group) => [
    `### ${group.title}`,
    "",
    ...group.items.map(
      (item) =>
        `- ${item.name}${item.detail ? `: ${item.detail}` : ""}${
          item.status === "planned" ? ` (${CELL_LABELS.planned}, not in the app yet)` : ""
        }`,
    ),
    "",
  ]);
}

function siteFaq(): FaqItem[] {
  const items: Record<string, FaqItem> = faq.items;
  return FAQ_IDS.flatMap((id) => {
    const item = items[id];
    return item ? [item] : [];
  });
}

// ── Per-page Markdown (`/en/<page>.md`) ──────────────────────────────────

/** Unprefixed path → full text of that page, for every page with a Markdown edition. */
const PAGE_TEXT: ReadonlyMap<string, () => string[]> = new Map([
  ...FEATURE_PAGES.map((f) => [featureHref(f.slug), () => featureText(f)] as const),
  ...AUDIENCE_PAGES.map((a) => [audienceHref(a.slug), () => audienceText(a)] as const),
  ...COMPARE_PAGES.map((c) => [compareHref(c.slug), () => compareText(c)] as const),
  ...ARTICLES.map((a) => [articleHref(a), () => articleText(a)] as const),
]);

/** Unprefixed paths of the pages that have a Markdown edition (`<path>.md` in English). */
export function markdownPaths(): string[] {
  return [...PAGE_TEXT.keys()];
}

/** Public URL of a page's Markdown edition (the English page URL plus `.md`). */
export function markdownUrl(path: string): string {
  return `${url(path)}.md`;
}

/**
 * The Markdown edition of one content page (the llmstxt.org `.md`
 * convention): the same text as `llms-full.txt`, with the page title as H1.
 */
export function pageMarkdown(path: string): string | undefined {
  const text = PAGE_TEXT.get(path);
  if (!text) return undefined;
  const lines = text().map((line) =>
    line.startsWith("#### ")
      ? `## ${line.slice(5)}`
      : line.startsWith("### ")
        ? `# ${line.slice(4)}`
        : line,
  );
  return [
    ...lines,
    "",
    `---`,
    "",
    `From ${APP_NAME} (${SITE_URL}). Index of every page: [llms.txt](${SITE_URL}/llms.txt).`,
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n*$/, "\n");
}

/** `/llms-full.txt`: every content page as plain Markdown, in one file. */
export function buildLlmsFullTxt(): string {
  const part = (title: string, pages: readonly string[][]) => [
    `## ${title}`,
    "",
    ...pages.flatMap((lines) => [...lines, ""]),
  ];

  return [
    `# ${APP_NAME}`,
    "",
    `> ${summary()}`,
    "",
    ...keyFacts().slice(0, -1),
    `- Short index of these pages: [llms.txt](${SITE_URL}/llms.txt).`,
    "",
    ...part(SECTION_LABELS.features, FEATURE_PAGES.map(featureText)),
    "## Everything in the app",
    "",
    ...inventoryText(),
    ...part(SECTION_LABELS.audiences, AUDIENCE_PAGES.map(audienceText)),
    ...part(SECTION_LABELS.compare, COMPARE_PAGES.map(compareText)),
    ...part(SECTION_LABELS.guides, ARTICLES.map(articleText)),
    "## Frequently asked questions",
    "",
    `Source: ${url(SITE_PATHS.faq)}`,
    "",
    ...siteFaq().flatMap((f) => [`**${md(f.question)}**`, "", md(f.answer), ""]),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n+$/, "\n");
}

/** Response headers for both files: Markdown, served as plain text so browsers display it. */
export const LLMS_HEADERS = { "Content-Type": "text/plain; charset=utf-8" } as const;
