import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "qr");
await mkdir(outDir, { recursive: true });

// Real URLs from packages/shared/src/constants/site.ts — do not invent.
const targets = [
  { name: "appstore", url: "https://apps.apple.com/app/id6787222180" },
  {
    name: "play",
    url: "https://play.google.com/store/apps/details?id=app.munibtracker",
  },
  { name: "web", url: "https://munibtracker.app" },
];

// Ink variants so QRs sit correctly on light or dark panels.
const inks = [
  { suffix: "ink", dark: "#152921", light: "#00000000" },
  { suffix: "black", dark: "#000000", light: "#ffffff" },
];

for (const t of targets) {
  for (const ink of inks) {
    const svg = await QRCode.toString(t.url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 0,
      color: { dark: ink.dark, light: ink.light },
    });
    await writeFile(join(outDir, `${t.name}-${ink.suffix}.svg`), svg);
  }
  console.log(`QR: ${t.name} -> ${t.url}`);
}
