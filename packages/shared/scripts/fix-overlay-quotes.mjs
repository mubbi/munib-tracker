#!/usr/bin/env node
import { execSync } from "node:child_process";
/**
 * Fix overlay TS files where double-quoted strings contain unescaped interior ".
 * Re-wrap those values with JSON.stringify (same as chooseQuote for complex strings).
 */
import fs from "node:fs";
import path from "node:path";
import { I18N_DIR } from "./overlay-i18n-utils.mjs";

const VALUE_LINE = /^(\s+(?:[a-zA-Z_$][\w$]*: )?|(?:\s+))"(.+)"(,?\s*)$/;

function unescapeTsDoubleQuoted(s) {
  return s.replace(/\\(.)/g, (_, ch) => {
    if (ch === "n") return "\n";
    if (ch === "t") return "\t";
    if (ch === "r") return "\r";
    return ch;
  });
}

function fixLine(line) {
  const m = line.match(VALUE_LINE);
  if (!m) return line;
  const [, prefix, inner, suffix] = m;
  if (!inner.includes('"')) return line;
  const text = unescapeTsDoubleQuoted(inner);
  return `${prefix.replace(/"$/, "")}${JSON.stringify(text)}${suffix}`;
}

function fixContent(text) {
  return text
    .split("\n")
    .map((line) => fixLine(line))
    .join("\n");
}

function parses(filePath) {
  try {
    execSync(`npx esbuild "${filePath}" --bundle --log-level=error`, {
      stdio: "pipe",
      cwd: path.resolve(I18N_DIR, ".."),
    });
    return true;
  } catch {
    return false;
  }
}

const files = fs
  .readdirSync(I18N_DIR)
  .filter((f) => /^[a-z-]+\.[a-z]{2}\.ts$/.test(f) && f !== "overlay-locale.ts");

let fixed = 0;
const stillBroken = [];

for (const file of files) {
  const p = path.join(I18N_DIR, file);
  const before = fs.readFileSync(p, "utf8");
  const after = fixContent(before);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    fixed++;
  }
}

for (const file of files) {
  const p = path.join(I18N_DIR, file);
  if (!parses(p)) stillBroken.push(file);
}

console.log(`Re-wrapped interior quotes in ${fixed} files`);
if (stillBroken.length) {
  console.log(`Still broken (${stillBroken.length}): ${stillBroken.slice(0, 20).join(", ")}`);
  process.exitCode = 1;
} else {
  console.log("All overlay files parse");
}
