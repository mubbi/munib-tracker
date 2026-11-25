#!/usr/bin/env node
/**
 * Regenerates every native colour file from `packages/theme/src/native-tokens.ts`.
 *   pnpm --filter app generate:native-tokens
 * Plain Node (>= 24): a resolve hook lets the theme package's extensionless TS imports load.
 */
import fs from "node:fs";
import { createRequire, registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const themeSrc = path.resolve(appRoot, "../../packages/theme/src");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !path.extname(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { nativeTokens } = await import(pathToFileURL(path.join(themeSrc, "native-tokens.ts")).href);
const { renderAll } = createRequire(import.meta.url)("./lib/native-tokens-render.cjs");

for (const [rel, content] of Object.entries(renderAll(nativeTokens))) {
  const file = path.join(appRoot, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (prev !== content) fs.writeFileSync(file, content, { encoding: "utf8" });
  console.log(`${prev === content ? "unchanged" : "wrote    "} ${rel}`);
}
