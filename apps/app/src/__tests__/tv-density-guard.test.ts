import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * TV density guard (P10-04) — source scan of `apps/app/src`, target count 0.
 *
 * 1. Double scaling: `tvDp(` wrapped around a token that is already tvOS-scaled
 *    (`Spacing`, `Radius`, `Control`, `BorderWidth`, scaled `TvLayout` members).
 *    `TvLayout.bodyFontSize` / `titleFontSize` are deliberately unscaled dp, so
 *    `tvDp(TvLayout.bodyFontSize)` (raw `TextInput`s) is correct.
 * 2. Bare numerics: a numeric literal > 4 for a size / spacing / radius prop
 *    inside a `*Tv` style block or an inline `tv && { … }` / `tv ? { … }` object
 *    must go through `tvDp(n)` or a token — on tvOS (2x layout units) it renders
 *    half size otherwise. `fontSize` / `lineHeight` are exempt: `ThemedText`
 *    multiplies them by `TV_DENSITY`; raw `Text` / `TextInput` must use `tvDp`.
 */

const SRC = join(__dirname, "..");
const SKIP = [/\.test\.tsx?$/, /\.d\.ts$/, /(^|\/)__tests__\//, /^test-support\//];

/** `path:line` entries allowed to stay bare, each with a reason. */
const ALLOW_BARE: string[] = [];

const SCALED_TOKEN =
  /\btvDp\([^)]*\b(?:Spacing|Radius|Control|BorderWidth|TvLayout\.(?:minFocusTarget|contentPadding[XY]|overscanY|contentMaxWidth|proseMaxWidth|listDetailMaxWidth|detailPane\w+|sideRailWidth\w+|focusRingWidth|chipMinHeight|gridGap))\b/;

const PROP =
  "(?:width|height|minHeight|minWidth|maxWidth|maxHeight|paddingw*|marginw*|gap|rowGap|columnGap|borderRadius|borderw*Radius|top|left|right|bottom|size)";
const BARE = new RegExp(`\b${PROP}s*:s*(-?d+(?:.d+)?)s*[,}]`, "g");

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name)) {
      const rel = relative(SRC, p).split(sep).join("/");
      if (!SKIP.some((r) => r.test(rel))) out.push(rel);
    }
  }
  return out;
}

function scan() {
  const doubleWrapped: string[] = [];
  const bare: string[] = [];
  for (const rel of walk(SRC)) {
    const lines = readFileSync(join(SRC, rel), "utf8").split(/\r?\n/);
    let inTv = false;
    let depth = 0;
    lines.forEach((l, i) => {
      const at = `${rel}:${i + 1}`;
      if (SCALED_TOKEN.test(l)) doubleWrapped.push(`${at}: ${l.trim()}`);
      if (!inTv && /^\s*\w*Tv\w*\s*:\s*\{/.test(l)) {
        inTv = true;
        depth = 0;
      }
      const inline = /(?:isTV\(\)|\btv\b|isTv)\s*(?:\?|&&)\s*\{/.test(l);
      if (inTv || inline) {
        for (const m of l.matchAll(BARE)) {
          if (Math.abs(Number(m[1])) > 4 && !ALLOW_BARE.includes(at)) {
            bare.push(`${at}: ${l.trim()}`);
          }
        }
      }
      if (inTv) {
        for (const c of l) {
          if (c === "{") depth++;
          else if (c === "}") depth--;
        }
        if (depth <= 0) inTv = false;
      }
    });
  }
  return { doubleWrapped, bare };
}

describe("TV density guard", () => {
  const { doubleWrapped, bare } = scan();

  it("never wraps an already-scaled token in tvDp()", () => {
    expect(doubleWrapped).toEqual([]);
  });

  it("has no bare numeric sizes in TV style branches (use tvDp(n) or a token)", () => {
    expect(bare).toEqual([]);
  });
});
