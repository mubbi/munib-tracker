// Restyle the phone / tablet / TV decks in app-store-screenshots.json with the
// Day Arc template look (scripts/deck-style.mjs) WITHOUT re-seeding: copy,
// screenshots, text elements and the other decks (watch, Wear OS, creative
// assets, feature graphic, TV banner) are left exactly as they are.
//
//   node tools/screenshot-studio/scripts/apply-deck-style.mjs
//
// Close any open studio tab first, or its autosave may overwrite the result.

import fs from "node:fs";
import path from "node:path";
import { styleDeck } from "./deck-style.mjs";
import { studioRoot as root } from "./paths.mjs";

const file = path.join(root, "app-store-screenshots.json");
const state = JSON.parse(fs.readFileSync(file, "utf8"));
let changed = 0;
for (const [device, slides] of Object.entries(state.slidesByDevice ?? {})) {
  const next = styleDeck(device, slides);
  for (let i = 0; i < slides.length; i++) if (next[i] !== slides[i]) changed++;
  state.slidesByDevice[device] = next;
}
fs.writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`);
console.log(`Restyled ${changed} slides in ${file}`);
