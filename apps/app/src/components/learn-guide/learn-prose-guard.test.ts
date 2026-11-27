/**
 * P5-41 / G-52 guard: no fixed `lineHeight` is passed to `LearnProseText`.
 *
 * `LearnProseText` applies its scaled prose style first and the caller's style
 * second, so a fixed `lineHeight` from the caller wins and lines overlap once
 * the reader raises the Learn text size (or the OS text size).
 *
 * Heuristic (regex-level, documented on purpose): for every `<LearnProseText …>`
 * opening tag in the Learn beliefs & history paths we
 *  1. flag an inline `lineHeight` inside the tag, and
 *  2. flag any `styles.<name>` the tag references whose `StyleSheet.create`
 *     entry (`<name>: { … }`, single level) declares `lineHeight`.
 * Dynamic styles built elsewhere are not followed — keep prose styles in the
 * file's StyleSheet so this check can see them.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = join(__dirname, "..", "..");

const ROOTS = [
  ...[
    "aqeedah",
    "prophets",
    "jannah",
    "jahannam",
    "last-day",
    "learn-dua",
    "sahaba",
    "seerah",
    "battles",
    "history",
    "events",
  ].map((dir) => join(SRC, "app", dir)),
  ...[
    "jannah",
    "jahannam",
    "aqeedah",
    "prophets",
    "last-day",
    "learn-dua",
    "learn-guide",
    "battles",
  ].map((dir) => join(SRC, "components", dir)),
];

function tsxFiles(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return tsxFiles(full);
    return name.endsWith(".tsx") && !name.endsWith(".test.tsx") ? [full] : [];
  });
}

/** `lineHeight` violations in one file's source, as `file:tag` descriptions. */
function findProseLineHeights(source: string): string[] {
  const hits: string[] = [];
  const tags = source.match(/<LearnProseText\b[^>]*>/g) ?? [];
  for (const tag of tags) {
    if (/lineHeight\s*:/.test(tag)) hits.push(`inline lineHeight in ${tag.slice(0, 60)}`);
    for (const [, name] of tag.matchAll(/styles\.(\w+)/g)) {
      const entry = source.match(new RegExp(`\\n\\s*${name}\\s*:\\s*\\{([^{}]*)\\}`));
      if (entry?.[1] && /lineHeight\s*:/.test(entry[1])) {
        hits.push(`styles.${name} sets lineHeight`);
      }
    }
  }
  return hits;
}

describe("Learn prose line-height guard (G-52)", () => {
  it("detects inline and StyleSheet line heights passed to LearnProseText", () => {
    const sample = `
      <LearnProseText style={styles.paragraph}>a</LearnProseText>
      <LearnProseText style={{ lineHeight: 22 }}>b</LearnProseText>
      <LearnProseText style={styles.ok}>c</LearnProseText>
      const styles = StyleSheet.create({
        paragraph: { lineHeight: 22 },
        ok: { marginTop: 4 },
      });`;
    expect(findProseLineHeights(sample)).toHaveLength(2);
  });

  it("finds no fixed lineHeight passed to LearnProseText in the Learn paths", () => {
    const violations = ROOTS.flatMap(tsxFiles).flatMap((file) =>
      findProseLineHeights(readFileSync(file, "utf8")).map(
        (hit) => `${relative(SRC, file).replace(/\\/g, "/")}: ${hit}`,
      ),
    );
    expect(violations).toEqual([]);
  });
});
