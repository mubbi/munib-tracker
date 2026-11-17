import fs from "node:fs";
import path from "node:path";

import { buildRouteMetadata, resolveRoutePath, routeMetadata } from "./route-metadata";

const APP_DIR = path.join(__dirname, "../../app");

function routeFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) routeFiles(full, out);
    else if (/\.(tsx|ts)$/.test(entry.name) && !/^[_+]/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("route metadata", () => {
  it("every route file exports generateMetadata (static web <head>, Expo SDK 58)", () => {
    const missing = routeFiles(APP_DIR)
      .filter(
        (file) =>
          !/export const generateMetadata = routeMetadata\(/.test(fs.readFileSync(file, "utf8")),
      )
      .map((file) => path.relative(APP_DIR, file));
    expect(missing).toEqual([]);
  });

  it("resolves route templates with params and route groups", () => {
    expect(resolveRoutePath("/(tabs)")).toBe("/");
    expect(resolveRoutePath("/(tabs)/tracker")).toBe("/tracker");
    expect(resolveRoutePath("/quran/[surah]", { surah: "2" })).toBe("/quran/2");
    expect(resolveRoutePath("/a/[...rest]", { rest: ["b", "c"] })).toBe("/a/b/c");
    expect(resolveRoutePath("/quran/[surah]", {})).toBeNull();
  });

  it("builds registry metadata and returns null for unregistered routes", () => {
    const home = buildRouteMetadata("/");
    expect(home?.title).toBeTruthy();
    expect(home?.alternates?.canonical).toMatch(/^https?:\/\//);
    // Top-level directives too, not only googleBot (matches the pre-58 <Seo> robots tag).
    expect(home?.robots).toMatchObject({
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    });

    expect(buildRouteMetadata("/achievements")?.robots).toMatchObject({ index: false });
    expect(buildRouteMetadata("/definitely-not-a-route")).toBeNull();
  });

  it("generateMetadata resolves the concrete path from params", async () => {
    const generate = routeMetadata("/(tabs)/tracker");
    const fromRegistry = buildRouteMetadata("/tracker");
    await expect(Promise.resolve(generate(undefined, {}))).resolves.toEqual(fromRegistry);
  });
});
