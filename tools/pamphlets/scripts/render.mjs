import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "dist");
await mkdir(outDir, { recursive: true });

/** Chrome / Chromium for puppeteer-core: CHROME_PATH (or PUPPETEER_EXECUTABLE_PATH) wins, else common install paths. */
const CHROME_CANDIDATES = {
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ],
  linux: [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ],
  win32: [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  ],
};
const CHROME =
  process.env.CHROME_PATH ||
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (CHROME_CANDIDATES[process.platform] ?? []).find((p) => existsSync(p));
if (!CHROME) {
  console.error("Chrome not found. Set CHROME_PATH to your Chrome/Chromium executable.");
  process.exit(1);
}

const concepts = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "01-the-return",
      "02-one-prayer-at-a-time",
      "03-never-lose-count",
      "04-deen-in-your-pocket",
      "05-never-too-late",
    ];

// A4 @ 96dpi CSS pixels: 210mm = 793.7px, 297mm = 1122.5px
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "shell",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});

try {
  for (const name of concepts) {
    const page = await browser.newPage();
    // 3x device scale for a crisp ~288dpi PNG preview
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 3 });
    const url = pathToFileURL(join(root, `${name}.html`)).href;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 300));

    await page.pdf({
      path: join(outDir, `${name}.pdf`),
      width: "210mm",
      height: "297mm",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: "1",
    });
    await page.screenshot({
      path: join(outDir, `${name}.png`),
      clip: { x: 0, y: 0, width: 794, height: 1123 },
    });
    console.log(`rendered ${name} (pdf + png)`);
    await page.close();
  }
} finally {
  await browser.close();
}
