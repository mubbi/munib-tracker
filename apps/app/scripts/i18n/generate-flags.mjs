#!/usr/bin/env node
/** Minimal representative flag SVGs for locale picker (web). */
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FLAGS_DIR = join(__dirname, "../../assets/flags");

const FLAGS = {
  id: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#E70011" d="M0 0h513v171H0z"/><path fill="#FFF" d="M0 171h513v171H0z"/></svg>`,
  tr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#E30A17" d="M0 0h513v342H0z"/><circle fill="#FFF" cx="205" cy="171" r="68"/><circle fill="#E30A17" cx="222" cy="171" r="55"/><polygon fill="#FFF" points="290,171 310,178 300,158 300,184 310,164"/></svg>`,
  bd: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#006A4E" d="M0 0h513v342H0z"/><circle fill="#F42A41" cx="205" cy="171" r="95"/></svg>`,
  my: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#CC0001" d="M0 0h513v27H0z"/><path fill="#FFF" d="M0 27h513v27H0z"/><path fill="#CC0001" d="M0 54h513v27H0z"/><path fill="#FFF" d="M0 81h513v27H0z"/><path fill="#CC0001" d="M0 108h513v27H0z"/><path fill="#FFF" d="M0 135h513v27H0z"/><path fill="#CC0001" d="M0 162h513v27H0z"/><path fill="#FFF" d="M0 189h513v27H0z"/><path fill="#CC0001" d="M0 216h513v27H0z"/><path fill="#FFF" d="M0 243h513v27H0z"/><path fill="#CC0001" d="M0 270h513v27H0z"/><path fill="#FFF" d="M0 297h513v45H0z"/><path fill="#010066" d="M0 0h256v171H0z"/><circle fill="#FFCC00" cx="115" cy="85" r="45"/></svg>`,
  ir: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#239F40" d="M0 0h513v114H0z"/><path fill="#FFF" d="M0 114h513v114H0z"/><path fill="#DA0000" d="M0 228h513v114H0z"/></svg>`,
  fr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#002395" d="M0 0h171v342H0z"/><path fill="#FFF" d="M171 0h171v342H171z"/><path fill="#ED2939" d="M342 0h171v342H342z"/></svg>`,
  ng: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#008751" d="M0 0h513v114H0z"/><path fill="#FFF" d="M0 114h513v114H0z"/><path fill="#008751" d="M0 228h513v114H0z"/></svg>`,
  tz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#1EB53A" d="M0 0L513 342H0z"/><path fill="#00A3DD" d="M0 0h513v342H0z" opacity=".35"/><path fill="#FCD116" d="M0 0L513 342H0z" opacity=".5"/><path fill="#000" d="M0 114h513v114H0z"/></svg>`,
  ru: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#FFF" d="M0 0h513v114H0z"/><path fill="#0039A6" d="M0 114h513v114H0z"/><path fill="#D52B1E" d="M0 228h513v114H0z"/></svg>`,
  az: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#3F9C35" d="M0 228h513v114H0z"/><path fill="#ED2939" d="M0 114h513v114H0z"/><path fill="#00B9E4" d="M0 0h513v114H0z"/><circle fill="#FFF" cx="230" cy="171" r="38"/><circle fill="#ED2939" cx="242" cy="171" r="32"/><polygon fill="#FFF" points="278,171 292,176 285,165 285,177 292,166"/></svg>`,
  af: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#000" d="M0 0h171v342H0z"/><path fill="#D32011" d="M171 0h171v342H171z"/><path fill="#007A36" d="M342 0h171v342H342z"/></svg>`,
  so: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#4189DD" d="M0 0h513v342H0z"/><polygon fill="#FFF" points="256,95 268,130 305,130 275,152 287,187 256,165 225,187 237,152 207,130 244,130"/></svg>`,
  uz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#1EB53A" d="M0 228h513v114H0z"/><path fill="#FFF" d="M0 114h513v114H0z"/><path fill="#0099B5" d="M0 0h513v114H0z"/><circle fill="#FFF" cx="85" cy="57" r="22"/><circle fill="#0099B5" cx="92" cy="57" r="18"/></svg>`,
  kz: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#00AFCA" d="M0 0h513v342H0z"/><circle fill="#FEC50C" cx="256" cy="171" r="55"/><circle fill="#00AFCA" cx="256" cy="171" r="42"/></svg>`,
  ku: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#E31837" d="M0 0h513v114H0z"/><path fill="#FFF" d="M0 114h513v114H0z"/><path fill="#00843D" d="M0 228h513v114H0z"/><circle fill="#FDB913" cx="256" cy="171" r="45"/></svg>`,
  ba: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#002395" d="M0 0h513v342H0z"/><polygon fill="#FECB00" points="128,0 513,171 128,342"/></svg>`,
  al: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#E41E20" d="M0 0h513v342H0z"/><path fill="#000" d="M200 120h113v102H200z" opacity=".85"/></svg>`,
  kg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#E8112D" d="M0 0h513v342H0z"/><circle fill="#FFEF00" cx="256" cy="171" r="55"/></svg>`,
  tj: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#006600" d="M0 228h513v114H0z"/><path fill="#FFF" d="M0 114h513v114H0z"/><path fill="#CC0000" d="M0 0h513v114H0z"/></svg>`,
  tm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342"><path fill="#00843D" d="M0 0h513v342H0z"/><path fill="#FFF" d="M0 0h513v68H0z"/><path fill="#E30A17" d="M0 68h513v68H0z"/><path fill="#FFF" d="M0 136h513v68H0z"/><path fill="#E30A17" d="M0 204h513v68H0z"/><path fill="#FFF" d="M0 272h513v70H0z"/></svg>`,
};

for (const [code, svg] of Object.entries(FLAGS)) {
  const path = join(FLAGS_DIR, `${code}.svg`);
  if (!existsSync(path)) {
    writeFileSync(path, svg.trim());
    console.log(`Created ${code}.svg`);
  }
}

const indexPath = join(FLAGS_DIR, "index.ts");
const requires = ["pk", "sa", "us", ...Object.keys(FLAGS).sort()]
  .map((c) => `  ${c}: require("./${c}.svg"),`)
  .join("\n");

writeFileSync(
  indexPath,
  `import type { ImageSourcePropType } from "react-native";

/** Self-hosted locale flags (SVG). Used on web; native falls back to emoji in LocaleFlag. */
export const FLAG_ASSETS: Record<string, ImageSourcePropType> = {
${requires}
};
`,
);

console.log("Updated index.ts");
