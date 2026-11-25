import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Every `<Sheet>` renders `role="dialog"` — without `title` or `accessibilityLabel`
 * it is an unnamed dialog (WCAG 4.1.2). Source scan of `apps/app/src`.
 */
const SRC = join(__dirname, "..");

/** Files allowed to skip the check (keep empty — every sheet must be named). */
const PENDING_OWNER_ALLOWLIST: RegExp[] = [];

function listTsx(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) listTsx(abs, out);
    else if (/\.tsx$/.test(entry.name) && !/\.test\./.test(entry.name)) out.push(abs);
  }
  return out;
}

/** Source of the opening `<Sheet ...>` tag starting at `start` (brace-depth aware). */
function openingTag(text: string, start: number): string {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0 && text[i - 1] !== "=") return text.slice(start, i);
  }
  return text.slice(start);
}

describe("Sheet accessible name", () => {
  it("every <Sheet> passes title or accessibilityLabel", () => {
    const offenders: string[] = [];
    for (const abs of listTsx(SRC)) {
      const rel = relative(SRC, abs).split(sep).join("/");
      if (rel === "components/ui/sheet.tsx") continue;
      if (PENDING_OWNER_ALLOWLIST.some((re) => re.test(rel))) continue;
      const text = readFileSync(abs, "utf8");
      for (const m of text.matchAll(/<Sheet\b/g)) {
        const tag = openingTag(text, m.index ?? 0);
        if (!/\b(title|accessibilityLabel)=|\{\.\.\./.test(tag)) {
          const line = text.slice(0, m.index).split("\n").length;
          offenders.push(`${rel}:${line}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
