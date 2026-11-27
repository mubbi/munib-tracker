import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ACTIONS_DIR = import.meta.dirname;

function actionSources(): { file: string; source: string }[] {
  return readdirSync(ACTIONS_DIR)
    .filter((file) => file.endsWith(".ts") && !/\.(test|spec)\.ts$/.test(file))
    .map((file) => ({ file, source: readFileSync(path.join(ACTIONS_DIR, file), "utf8") }));
}

/** True when the first statement (after leading comments) is the "use server" directive. */
function isUseServerModule(source: string): boolean {
  // Skip comments with indexOf rather than a repeated-group regex, which can
  // backtrack exponentially on inputs like "/*" + "*//*".repeat(n).
  let rest = source.trimStart();
  while (rest.startsWith("//") || rest.startsWith("/*")) {
    const lineComment = rest.startsWith("//");
    const end = lineComment ? rest.indexOf("\n") : rest.indexOf("*/", 2);
    if (end === -1) return false;
    rest = rest.slice(end + (lineComment ? 1 : 2)).trimStart();
  }
  return /^["']use server["']/.test(rest);
}

describe("lib/actions server-action boundary", () => {
  it("never exposes a caller-supplied ActionContext as a server action", () => {
    // Every export of a "use server" module is POSTable by any client that learns its
    // action id, so such modules must resolve the session themselves
    // (getActionContext) instead of trusting a ctx/role argument.
    const offenders = actionSources()
      .filter(({ source }) => isUseServerModule(source))
      .filter(({ source }) => /\bctx\s*:\s*ActionContext\b/.test(source))
      .map(({ file }) => file);
    expect(offenders).toEqual([]);
  });

  it("resolves the session inside every exported function of a 'use server' module", () => {
    for (const { file, source } of actionSources()) {
      if (!isUseServerModule(source)) continue;
      const exported = [...source.matchAll(/export async function (\w+)\(/g)].map((m) => m[1]);
      for (const name of exported) {
        const start = source.indexOf(`export async function ${name}(`);
        const next = source.indexOf("\nexport ", start + 1);
        const body = source.slice(start, next === -1 ? undefined : next);
        expect(body, `${file}#${name}`).toContain("await getActionContext()");
      }
    }
  });

  it("marks ctx-trusting helper modules server-only", () => {
    for (const { file, source } of actionSources()) {
      if (isUseServerModule(source)) continue;
      expect(source, file).toContain('import "server-only";');
    }
  });
});
