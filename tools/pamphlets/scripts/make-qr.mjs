import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "qr");
await mkdir(outDir, { recursive: true });

// Official URLs are read from packages/shared/src/constants/site.ts so the QR codes can't drift
// from the app and marketing site. This tool lives outside the pnpm workspace, so the constants
// are parsed from source rather than imported.
const siteTs = await readFile(
  join(root, "..", "..", "packages", "shared", "src", "constants", "site.ts"),
  "utf8",
);
function constant(name) {
  const m = siteTs.match(new RegExp(`export const ${name} = "([^"]+)"`));
  if (!m) throw new Error(`site.ts: ${name} not found — update scripts/make-qr.mjs`);
  return m[1];
}
const SITE = constant("OFFICIAL_SITE_ORIGIN");
const IOS_ID = constant("OFFICIAL_IOS_APP_STORE_ID");
const ANDROID_PACKAGE = constant("OFFICIAL_ANDROID_PACKAGE");

// Same templates as OFFICIAL_IOS_APP_STORE_URL / OFFICIAL_ANDROID_PLAY_STORE_URL in site.ts.
const targets = [
  { name: "appstore", url: `https://apps.apple.com/app/id${IOS_ID}` },
  { name: "play", url: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}` },
  { name: "web", url: SITE },
];

// Brand ink on a transparent background; the pamphlets give each QR a white quiet-zone panel.
const inks = [{ suffix: "ink", dark: "#152921", light: "#00000000" }];

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
