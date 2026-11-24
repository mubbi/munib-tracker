import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "dist");
await mkdir(outDir, { recursive: true });

/**
 * Chrome / Chromium for puppeteer-core: CHROME_PATH (or PUPPETEER_EXECUTABLE_PATH) wins, else common
 * install paths. Microsoft Edge (Chromium) is the last fallback on Windows, where it ships with the OS.
 */
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
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
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

// Every concept is a numbered top-level HTML file (01-*.html, 02-*.html, …).
const concepts = process.argv.slice(2).length
  ? process.argv.slice(2).map((n) => n.replace(/\.html$/, ""))
  : (await readdir(root))
      .filter((f) => /^\d{2}-.+\.html$/.test(f))
      .sort()
      .map((f) => f.replace(/\.html$/, ""));

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

    // Print preflight: text smaller than 9 pt, or text/QR/badges outside the 15 mm safe area.
    // `.badge` micro-copy ("Download on the") is exempt: it mirrors the official badge artwork.
    const issues = await page.evaluate(() => {
      const SAFE = (15 / 25.4) * 96; // 15 mm in CSS px
      const MIN_PX = 12; // 9 pt
      const W = 793.7;
      const H = 1122.5;
      const out = [];
      const fontsMissing = [...document.fonts].filter((f) => f.status === "error").length;
      if (fontsMissing) out.push(`${fontsMissing} web font face(s) failed to load`);
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.textContent.trim();
        const el = n.parentElement;
        if (!text || !el || el.closest("svg, [aria-hidden='true']")) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        const r = range.getBoundingClientRect();
        if (!r.width) continue;
        const fs = Number.parseFloat(getComputedStyle(el).fontSize);
        if (fs < MIN_PX - 0.01 && !el.closest(".badge"))
          out.push(`${fs}px text (< 9 pt): "${text.slice(0, 40)}"`);
        if (
          r.left < SAFE - 0.5 ||
          r.top < SAFE - 0.5 ||
          r.right > W - SAFE + 0.5 ||
          r.bottom > H - SAFE + 0.5
        )
          out.push(`outside safe area: "${text.slice(0, 40)}"`);
      }
      for (const el of document.querySelectorAll(".qr, .badge")) {
        const r = el.getBoundingClientRect();
        if (
          r.left < SAFE - 0.5 ||
          r.top < SAFE - 0.5 ||
          r.right > W - SAFE + 0.5 ||
          r.bottom > H - SAFE + 0.5
        )
          out.push(`outside safe area: .${el.className.split(" ")[0]}`);
      }
      return out;
    });
    for (const issue of issues) console.warn(`  ! ${name}: ${issue}`);

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
