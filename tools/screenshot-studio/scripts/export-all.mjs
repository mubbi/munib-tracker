/**
 * Headless export of all screenshot-studio device decks via Playwright.
 * Requires `pnpm dev:screenshot-studio` (or next on :3010) already running.
 *
 * Usage:
 *   node tools/screenshot-studio/scripts/export-all.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.STUDIO_URL || "http://localhost:3010";

// `label` must match DEVICE_LABEL in src/lib/constants.ts (the dropdown option text).
/** @type {{ platform: "ios"|"android", device: string, label: string, orientations?: string[] }[]} */
const ALL_DECKS = [
  { platform: "ios", device: "iphone", label: "iPhone" },
  {
    platform: "ios",
    device: "iphone-duo",
    label: "iPhone Duo",
    orientations: ["portrait", "landscape"],
  },
  { platform: "ios", device: "ipad", label: "iPad" },
  { platform: "ios", device: "apple-watch", label: "Apple Watch Ultra" },
  { platform: "ios", device: "apple-tv", label: "Apple TV" },
  { platform: "ios", device: "ios-header", label: "Product Page Header" },
  { platform: "ios", device: "ios-header-wide", label: "Product Page Header (Wide)" },
  { platform: "ios", device: "ios-search", label: "Search Results" },
  { platform: "ios", device: "ios-search-3x2", label: "Search Results (3:2)" },
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
  { platform: "android", device: "wear-os", label: "Wear OS" },
  { platform: "android", device: "android-tv", label: "Android TV" },
  { platform: "android", device: "tv-banner", label: "Android TV Banner" },
  { platform: "android", device: "feature-graphic", label: "Feature Graphic" },
];

const csv = (v) =>
  (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
// EXPORT_PLATFORMS=ios|android|all, EXPORT_DEVICES=iphone,apple-tv,… (studio device ids)
const platformFilter = csv(process.env.EXPORT_PLATFORMS || "all");
const deviceFilter = csv(process.env.EXPORT_DEVICES);
const DECKS = ALL_DECKS.filter(
  (d) =>
    (platformFilter.includes("all") ||
      platformFilter.length === 0 ||
      platformFilter.includes(d.platform)) &&
    (deviceFilter.length === 0 || deviceFilter.includes(d.device)),
);

async function selectDevice(page, { platform, label }) {
  // Platform tabs
  await page.getByRole("tab", { name: platform === "ios" ? "iOS" : "Android" }).click();
  await page.waitForTimeout(300);

  // Device select (Radix) — trigger carries aria-label="Device" in toolbar.tsx
  await page.getByRole("combobox", { name: "Device" }).click();
  await page.getByRole("option", { name: label, exact: true }).click();
  await page.waitForTimeout(500);
}

async function selectOrientation(page, orientation) {
  const orientTrigger = page.getByRole("combobox", { name: "Orientation" });
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
  // The editor preloads images before flipping to "Exporting …", so first wait
  // for the export to actually start — otherwise the idle check below passes
  // immediately and the next deck (or browser close) cuts this export short.
  await page
    .waitForFunction(
      () =>
        [...document.querySelectorAll("button")].some((b) =>
          /Exporting/i.test(b.textContent || ""),
        ),
      { timeout: 120_000 },
    )
    .catch(() => {});
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
