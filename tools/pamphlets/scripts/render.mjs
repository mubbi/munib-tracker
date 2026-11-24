import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "dist");

/** A4 trim in CSS px at 96 dpi (210 × 297 mm), rounded up for the viewport and PNG clip. */
const A4 = { width: 794, height: 1123 };
/** 3× device scale → a crisp ~288 dpi PNG preview. */
const PREVIEW_SCALE = 3;
/** Print preflight limits (see README "Print rules"). */
const PREFLIGHT = { safeMm: 15, minFontPx: 12 /* 9 pt */ };

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

function findChrome() {
  return (
    process.env.CHROME_PATH ||
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (CHROME_CANDIDATES[process.platform] ?? []).find((p) => existsSync(p))
  );
}

/** Concept names from the CLI, else every numbered top-level HTML file (01-*.html, 02-*.html, …). */
async function listConcepts(args) {
  if (args.length) return args.map((n) => n.replace(/\.html$/, ""));
  return (await readdir(root))
    .filter((f) => /^\d{2}-.+\.html$/.test(f))
    .sort()
    .map((f) => f.replace(/\.html$/, ""));
}

/**
 * Runs in the page. Flags text under the 9 pt floor, text / QR codes / badges outside the safe
 * area, and web fonts that failed to load. `.badge` micro-copy ("Download on the") is exempt from
 * the size floor: it mirrors the official badge artwork.
 */
function preflight({ safeMm, minFontPx, width, height }) {
  const safe = (safeMm / 25.4) * 96;
  const outsideSafeArea = (r) =>
    r.left < safe - 0.5 ||
    r.top < safe - 0.5 ||
    r.right > width - safe + 0.5 ||
    r.bottom > height - safe + 0.5;
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
    if (fs < minFontPx - 0.01 && !el.closest(".badge"))
      out.push(`${fs}px text (< 9 pt): "${text.slice(0, 40)}"`);
    if (outsideSafeArea(r)) out.push(`outside safe area: "${text.slice(0, 40)}"`);
  }
  for (const el of document.querySelectorAll(".qr, .badge")) {
    if (outsideSafeArea(el.getBoundingClientRect()))
      out.push(`outside safe area: .${el.className.split(" ")[0]}`);
  }
  return out;
}

/** Renders one concept to dist/<name>.pdf + dist/<name>.png, printing preflight warnings. */
async function renderConcept(browser, name) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ ...A4, deviceScaleFactor: PREVIEW_SCALE });
    await page.goto(pathToFileURL(join(root, `${name}.html`)).href, {
      waitUntil: "networkidle0",
      timeout: 120000,
    });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 300)); // let font swaps settle before measuring

    // Exact trim (793.7 × 1122.5 px) for the safe-area maths.
    const issues = await page.evaluate(preflight, { ...PREFLIGHT, width: 793.7, height: 1122.5 });
    for (const issue of issues) console.warn(`  ! ${name}: ${issue}`);

    await page.pdf({
      path: join(outDir, `${name}.pdf`),
      width: "210mm",
      height: "297mm",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: "1",
    });
    await page.screenshot({ path: join(outDir, `${name}.png`), clip: { x: 0, y: 0, ...A4 } });
    console.log(`rendered ${name} (pdf + png)`);
  } finally {
    await page.close();
  }
}

const chrome = findChrome();
if (!chrome) {
  console.error("Chrome not found. Set CHROME_PATH to your Chrome/Chromium executable.");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const concepts = await listConcepts(process.argv.slice(2));
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "shell",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});
try {
  for (const name of concepts) await renderConcept(browser, name);
} finally {
  await browser.close();
}
