import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

/**
 * Design-system guard (P1-09) — a ratcheting source scan of `apps/app/src`.
 *
 * Counts, per directory, the drift patterns `docs/design-system.md` § "Rules for
 * contributors" bans: raw `fontSize` literals, hex / `rgba()` colour literals,
 * `accent` / `status.X.color` used as text, `Spacing.x ± n` arithmetic,
 * `Alert.alert(` (a no-op on web), a raw `Modal` import from react-native, and
 * physical Left/Right border / margin / padding props (break RTL).
 *
 * The counts must EQUAL `design-system-guard.baseline.json`:
 *   - a count above the baseline fails (new drift — use the token / primitive);
 *   - a count below the baseline also fails (ratchet — lower the baseline in the
 *     same change so the gain is locked in).
 *
 * The baseline is rewritten only at wave gates (WP-3A, then WP-6C): run
 *   UPDATE_DS_GUARD_BASELINE=1 pnpm --filter app exec jest design-system-guard
 * Intentional raw values live in the ALLOW lists below (with the reason), never
 * in the baseline.
 */

type Category =
  | "fontSizeLiteral"
  | "hexLiteral"
  | "rgbaLiteral"
  | "accentOrStatusAsText"
  | "spacingArithmetic"
  | "alertAlert"
  | "rawModalImport"
  | "physicalLeftRight";

type Counts = Record<Category, Record<string, number>>;

const SRC = join(__dirname, "..");
const BASELINE_PATH = join(__dirname, "design-system-guard.baseline.json");

/** Never scanned: tests, fixtures, generated content, another lane's native widgets. */
const EXCLUDE: RegExp[] = [
  /\.test\.tsx?$/,
  /(^|\/)__tests__\//,
  /^test-support\//,
  /\.d\.ts$/,
  /\.generated\./,
  /^lib\/quran-loader\.ts$/,
  /^lib\/appSurfaces\/widgets\//,
];

/** Intentional raw values for every category (reason in the comment). */
const ALLOW_ALL: RegExp[] = [
  // Token / ramp definitions themselves.
  /^constants\//,
  /^styles\//,
  /^lib\/(theme-tokens|color|reading-typography)\.ts$/,
  /^components\/themed-text\.tsx$/,
  // Seasonal art and illustration geometry.
  /^components\/seasonal\//,
  /^components\/seasonal-theme-banner\.tsx$/,
  /^lib\/seasonal-themes\.ts$/,
  /^lib\/tasbeeh\/(materials|pebble-layout)\.ts$/,
  // Qur'an renderers (mushaf page, tajweed colouring, word-by-word, surah banner).
  /^components\/quran\/(page-layout-renderer|tajweed-text|word-by-word|surah-banner)\.tsx$/,
  /mushaf/i,
  // Prayer-times hero (static `Brand` palette, sky, moon, masjid silhouette, weather).
  /^components\/prayer-times-hero\.tsx$/,
  /^components\/(sky-gradient-layer|moon-phase|mosque-silhouette)[\w.-]*\.tsx$/,
  /^components\/weather\//,
  /^lib\/sky\.ts$/,
  // Media viewers (image gallery, PDF) and image processing.
  /^components\/custom-adhkar\/custom-adhkar-image-gallery\.tsx$/,
  /^components\/attachments\/pdf-preview/,
  /^lib\/attachments\//,
  // Brand logos / third-party brand colours (Google, Apple, Facebook, QR card).
  /^components\/auth\/social-login-buttons\.tsx$/,
  /^lib\/share\/brandQr/,
  /^components\/animated-icon/,
  // Charts draw their own marks.
  /^components\/charts\//,
  // Leaflet map HTML string (not React Native styles).
  /^lib\/masjid\/map-html\.ts$/,
  // Renders before/without the theme providers.
  /^components\/error-boundary\.tsx$/,
];

const ALLOW: Partial<Record<Category, RegExp[]>> = {
  // `Sheet` is the one place allowed to own a react-native `Modal`.
  rawModalImport: [/^components\/ui\/sheet\.tsx$/],
  // Timetable OCR pre-processing paints canvases (white backgrounds, threshold
  // fills) — image data, not UI colour.
  hexLiteral: [/^lib\/timetable-ocr\//],
};

const LINE_PATTERNS: Partial<Record<Category, RegExp[]>> = {
  fontSizeLiteral: [/\bfontSize:\s*\d/],
  hexLiteral: [/["'`]#[0-9a-fA-F]{3,8}["'`]/],
  rgbaLiteral: [/\brgba?\(/],
  accentOrStatusAsText: [
    /\bcolor:\s*colors\.accent(?![\w])/,
    /\bcolor:\s*[\w.]*status(\.\w+|\[[^\]]+\])\.color\b/,
    /\b(labelColor|linkColor)=\{\s*(colors\.accent|[\w.]*status\.\w+\.color)\s*\}/,
    // Colour reaching text through a prop / object field named for text (e.g. a
    // schedule row handing `status.info.color` to a "Learn more" caption).
    /\b(textColor|captionColor|nameColor|timeColor|linkColor|labelColor)\s*[:=]\s*\{?\s*[\w.?]*(status\.\w+|tone\??)\.color\b/,
    /\b(textColor|captionColor|labelColor|linkColor)\s*[:=]\s*\{?\s*colors\.accent\s*[,}]/,
  ],
  spacingArithmetic: [/\bSpacing\.\w+\s*[+-]\s*\d/],
  alertAlert: [/\bAlert\.alert\(/],
  physicalLeftRight: [
    /\b(border(Left|Right)(Width|Color)?|margin(Left|Right)|padding(Left|Right))\s*:/,
  ],
};

const CATEGORIES: Category[] = [
  "fontSizeLiteral",
  "hexLiteral",
  "rgbaLiteral",
  "accentOrStatusAsText",
  "spacingArithmetic",
  "alertAlert",
  "rawModalImport",
  "physicalLeftRight",
];

const RN_IMPORT = /import\s*\{([^}]*)\}\s*from\s*["']react-native["']/g;

function listSources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules") listSources(abs, out);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      const rel = relative(SRC, abs).split(sep).join("/");
      if (!EXCLUDE.some((re) => re.test(rel))) out.push(rel);
    }
  }
  return out;
}

/** Bucket = first two path segments of the file's directory (`components/quran`, `app/(tabs)`). */
function bucketOf(rel: string): string {
  const dir = dirname(rel);
  return dir === "." ? "." : dir.split("/").slice(0, 2).join("/");
}

function isAllowed(category: Category, rel: string): boolean {
  return ALLOW_ALL.some((re) => re.test(rel)) || (ALLOW[category] ?? []).some((re) => re.test(rel));
}

function isCommentLine(line: string): boolean {
  const t = line.trimStart();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*");
}

function scanDesignSystemDrift(): Counts {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, {}])) as Counts;
  const bump = (category: Category, rel: string, n: number) => {
    if (n === 0 || isAllowed(category, rel)) return;
    const bucket = bucketOf(rel);
    counts[category][bucket] = (counts[category][bucket] ?? 0) + n;
  };
  for (const rel of listSources(SRC).sort()) {
    const text = readFileSync(join(SRC, rel), "utf8");
    const lines = text.split("\n").filter((line) => !isCommentLine(line));
    for (const [category, patterns] of Object.entries(LINE_PATTERNS) as Array<
      [Category, RegExp[]]
    >) {
      bump(category, rel, lines.filter((line) => patterns.some((re) => re.test(line))).length);
    }
    let modal = 0;
    for (const match of text.matchAll(RN_IMPORT)) {
      if (/(^|[\s,])Modal\b/.test(match[1] ?? "")) modal++;
    }
    bump("rawModalImport", rel, modal);
  }
  for (const category of CATEGORIES) {
    counts[category] = Object.fromEntries(
      Object.entries(counts[category]).sort(([a], [b]) => a.localeCompare(b)),
    );
  }
  return counts;
}

const total = (byDir: Record<string, number>) => Object.values(byDir).reduce((a, b) => a + b, 0);

describe("design-system guard (ratchet)", () => {
  const current = scanDesignSystemDrift();

  if (process.env.UPDATE_DS_GUARD_BASELINE === "1") {
    it("rewrites the baseline", () => {
      writeFileSync(BASELINE_PATH, `${JSON.stringify(current, null, 2)}\n`, "utf8");
      expect(true).toBe(true);
    });
    return;
  }

  const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as Counts;

  it.each(CATEGORIES)("%s stays at its baseline per directory", (category) => {
    const now = current[category];
    const base = baseline[category] ?? {};
    const rose: string[] = [];
    const fell: string[] = [];
    for (const dir of new Set([...Object.keys(now), ...Object.keys(base)])) {
      const n = now[dir] ?? 0;
      const b = base[dir] ?? 0;
      if (n > b) rose.push(`${dir}: ${b} → ${n}`);
      if (n < b) fell.push(`${dir}: ${b} → ${n}`);
    }
    if (rose.length > 0) {
      throw new Error(
        `New "${category}" drift (use the design-system token / primitive — docs/design-system.md § Rules for contributors):\n  ${rose.join("\n  ")}`,
      );
    }
    if (fell.length > 0) {
      throw new Error(
        `"${category}" dropped — lower design-system-guard.baseline.json to lock it in (ratchet):\n  ${fell.join("\n  ")}`,
      );
    }
    expect(total(now)).toBe(total(base));
  });
});
