// Shared locations for the studio scripts (this tool lives outside the pnpm
// workspace, so the store-screenshot spec is read from source, not imported).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** tools/screenshot-studio */
export const studioRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
/** Monorepo root. */
export const repoRoot = path.resolve(studioRoot, "..", "..");

/** `packages/store-screenshots/spec.json`: locales, capture names, slide scenes. */
export function readSpec() {
  const specPath = path.join(repoRoot, "packages", "store-screenshots", "spec.json");
  return JSON.parse(fs.readFileSync(specPath, "utf8"));
}
