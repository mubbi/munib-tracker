import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_REGISTRY } from "@munib-tracker/shared/i18n";

const FLAGS_DIR = join(__dirname, "..", "..", "assets", "flags");

/**
 * `JSON.parse` silently keeps the last value of a duplicate key, so a merge
 * conflict or a careless translation pass can leave two `"foo": …` entries in
 * the same object without anything ever failing — the second one just wins
 * silently. This walks the raw source text (not the parsed object) with a
 * minimal string-aware tokenizer so duplicate keys inside the same object are
 * actually caught.
 */
type Frame = { type: "object"; keys: Set<string>; awaitingKey: boolean } | { type: "array" };

function findDuplicateKeys(text: string): string[] {
  const offenders: string[] = [];
  const stack: Frame[] = [];
  let i = 0;
  const n = text.length;

  function readString(): string {
    let out = "";
    i += 1; // skip opening quote
    while (i < n) {
      const ch = text[i];
      if (ch === "\\") {
        out += ch + (text[i + 1] ?? "");
        i += 2;
        continue;
      }
      if (ch === '"') {
        i += 1; // skip closing quote
        return out;
      }
      out += ch;
      i += 1;
    }
    return out;
  }

  while (i < n) {
    const ch = text[i];
    if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
      i += 1;
      continue;
    }
    const top = stack[stack.length - 1];

    if (ch === "{") {
      stack.push({ type: "object", keys: new Set(), awaitingKey: true });
      i += 1;
      continue;
    }
    if (ch === "[") {
      stack.push({ type: "array" });
      i += 1;
      continue;
    }
    if (ch === "}" || ch === "]") {
      stack.pop();
      i += 1;
      continue;
    }
    if (ch === ",") {
      if (top?.type === "object") top.awaitingKey = true;
      i += 1;
      continue;
    }
    if (ch === ":") {
      i += 1;
      continue;
    }
    if (ch === '"') {
      if (top?.type === "object" && top.awaitingKey) {
        const key = readString();
        if (top.keys.has(key)) {
          offenders.push(key);
        } else {
          top.keys.add(key);
        }
        top.awaitingKey = false;
        continue;
      }
      readString();
      continue;
    }
    i += 1;
  }

  return offenders;
}

const I18N_DIR = __dirname;

describe("i18n catalog files", () => {
  for (const entry of LOCALE_REGISTRY) {
    describe(entry.code, () => {
      const path = join(I18N_DIR, `${entry.code}.json`);

      it("has a catalog file", () => {
        expect(existsSync(path)).toBe(true);
      });

      it("is valid JSON with no duplicate keys", () => {
        const text = readFileSync(path, "utf8");
        expect(() => JSON.parse(text)).not.toThrow();
        expect(findDuplicateKeys(text)).toEqual([]);
      });

      it("has a flag SVG asset for its region code", () => {
        const flagPath = join(FLAGS_DIR, `${entry.regionCode}.svg`);
        expect(existsSync(flagPath)).toBe(true);
      });
    });
  }
});
