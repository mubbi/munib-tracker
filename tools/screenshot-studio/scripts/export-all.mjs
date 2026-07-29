/**
 * Headless export of all screenshot-studio device decks via Playwright.
 * Requires `pnpm dev:screenshot-studio` (or next on :3010) already running.
 *
 * Usage:
 *   node tools/screenshot-studio/scripts/export-all.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.STUDIO_URL || "http://localhost:3010";

/** @type {{ platform: "ios"|"android", device: string, label: string, orientations?: string[] }[]} */
const ALL_DECKS = [
  { platform: "ios", device: "iphone", label: "iPhone" },
  { platform: "ios", device: "ipad", label: "iPad" },
  { platform: "android", device: "android", label: "Android Phone" },
  {
    platform: "android",
    device: "android-7",
    label: 'Android 7" Tablet',
    orientations: ["portrait", "landscape"],
  },
  {
    platform: "android",
    device: "android-10",
    label: 'Android 10" Tablet',
    orientations: ["portrait", "landscape"],
  },
  { platform: "android", device: "feature-graphic", label: "Feature Graphic" },
];

const platformFilter = (process.env.EXPORT_PLATFORMS || "all")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const DECKS =
  platformFilter.includes("all") || platformFilter.length === 0
    ? ALL_DECKS
    : ALL_DECKS.filter((d) => platformFilter.includes(d.platform));

async function selectDevice(page, { platform, label }) {
  // Platform tabs
  await page.getByRole("tab", { name: platform === "ios" ? "iOS" : "Android" }).click();
  await page.waitForTimeout(300);

  // Device select (Radix)
  const triggers = page.locator('button[role="combobox"]');
  // First combobox after platform tabs is the device picker (w-44)
  const deviceTrigger = triggers.filter({ hasText: /iPhone|iPad|Android|Feature/ }).first();
  await deviceTrigger.click();
  await page.getByRole("option", { name: label, exact: true }).click();
  await page.waitForTimeout(500);
}

async function selectOrientation(page, orientation) {
  const triggers = page.locator('button[role="combobox"]');
  const orientTrigger = triggers.filter({ hasText: /Portrait|Landscape/ }).first();
  if ((await orientTrigger.count()) === 0) return;
  await orientTrigger.click();
  await page
    .getByRole("option", {
      name: orientation === "landscape" ? "Landscape" : "Portrait",
      exact: true,
    })
    .click();
  await page.waitForTimeout(400);
}

async function exportBundle(page) {
  const btn = page.getByRole("button", { name: /Export bundle/i });
  await btn.click();
  // Wait until button returns to idle (not "Exporting …")
  await page.waitForFunction(
    () => {
      const el = [...document.querySelectorAll("button")].find((b) =>
        /Export bundle|Exporting/i.test(b.textContent || ""),
      );
      return el && /Export bundle/i.test(el.textContent || "") && !el.disabled;
    },
    { timeout: 15 * 60_000 },
  );
  await page.waitForTimeout(800);
}

async function main() {
  console.log(`Opening ${BASE}…`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(60_000);
  await page.goto(BASE, { waitUntil: "networkidle" });
  // Wait for editor chrome
  await page.getByRole("button", { name: /Export bundle/i }).waitFor({ state: "visible" });

  for (const deck of DECKS) {
    const orients = deck.orientations ?? ["portrait"];
    for (const orientation of orients) {
      console.log(`Exporting ${deck.device} (${orientation})…`);
      await selectDevice(page, deck);
      if (deck.orientations) await selectOrientation(page, orientation);
      await exportBundle(page);
      console.log(`  ✓ ${deck.device} ${orientation}`);
    }
  }

  await browser.close();
  console.log("All decks exported.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
