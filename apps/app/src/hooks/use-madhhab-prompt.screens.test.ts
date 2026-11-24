import fs from "node:fs";
import path from "node:path";

/**
 * §4.1.1 item 4: every fiqh-dependent screen mounts the lazy madhhab prompt
 * (`useMadhhabPrompt` opens it once per session while `madhhab` is undefined).
 * Source scan, so a new screen or a refactor can't silently drop it.
 */
const FIQH_SCREENS = [
  "zakat",
  "fidyah",
  "travel",
  "hayd",
  "rawatib",
  "fasting",
  "dhul-hijjah",
  "mirath",
  "ramadan",
] as const;

const APP = path.resolve(__dirname, "../app");

describe("fiqh screens mount the lazy madhhab prompt", () => {
  it.each(FIQH_SCREENS)("/%s", (route) => {
    const source = fs.readFileSync(path.join(APP, route, "index.tsx"), "utf8");
    expect(source).toMatch(/const (\w+) = useMadhhabPrompt\(\);/);
    const handle = /const (\w+) = useMadhhabPrompt\(\);/.exec(source)?.[1];
    expect(source).toContain(`{${handle}.sheet}`);
  });
});
