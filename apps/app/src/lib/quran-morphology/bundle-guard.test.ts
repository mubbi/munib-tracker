/**
 * NF-3.22 bundle check: the Quranic Arabic Corpus data is never shipped, and the
 * root engine stays out of the first-load graph (root layout + tab screens).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const SRC = resolve(__dirname, "../..");
const APP = resolve(SRC, "..");
const EXTENSIONS = [".tsx", ".ts", ".web.tsx", ".web.ts", "/index.tsx", "/index.ts"];
const DATA_HEADER = "LOCATION\tFORM\tTAG\tFEATURES";

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "__fixtures__" || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function resolveImport(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/assets/")) return null;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null;
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTENSIONS) if (existsSync(base + ext)) return base + ext;
  return null;
}

/** Static imports only — `import()` (lazy chunks) is deliberately not followed. */
const STATIC_IMPORT =
  /(?:^|\n)\s*(?:import|export)\s+(?:type\s+)?[^;'"]*?from\s+["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g;

function staticGraph(entries: string[]): Set<string> {
  const seen = new Set<string>();
  const stack = [...entries];
  while (stack.length) {
    const file = stack.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(STATIC_IMPORT)) {
      if (/import\s+type\s/.test(match[0])) continue;
      const next = resolveImport(file, match[1] ?? match[2]);
      if (next && !seen.has(next)) stack.push(next);
    }
  }
  return seen;
}

describe("NF-3.22 bundle guard", () => {
  it("ships no corpus data (assets or source), only the test excerpts", () => {
    const offenders = [...walk(join(APP, "assets")), ...walk(SRC)].filter((file) => {
      if (/morpholog/i.test(file) && !/\.(ts|tsx|md)$/.test(file)) return true;
      if (!/\.(json|txt|ts|tsx|js)$/.test(file) || file.endsWith("bundle-guard.test.ts"))
        return false;
      return readFileSync(file, "utf8").includes(DATA_HEADER);
    });
    expect(offenders.map((f) => relative(APP, f))).toEqual([]);
  });

  it("keeps the root engine out of the first-load graph", () => {
    const entries = [join(SRC, "app/_layout.tsx"), join(SRC, "app/(tabs)/_layout.tsx")];
    const tabs = join(SRC, "app/(tabs)");
    for (const name of readdirSync(tabs)) entries.push(join(tabs, name));
    const graph = staticGraph(entries.filter((f) => existsSync(f) && statSync(f).isFile()));
    // Sanity: the walk really followed the app's imports.
    expect(graph.size).toBeGreaterThan(200);
    const engine = [...graph]
      .map((f) => relative(SRC, f).replace(/\\/g, "/"))
      .filter((f) =>
        /^(lib\/quran-morphology\/(parse|build-index|buckwalter|codec)|lib\/quran-roots|stores\/quran-roots-store|api\/quran-morphology)/.test(
          f,
        ),
      );
    expect(engine).toEqual([]);
  });
});
