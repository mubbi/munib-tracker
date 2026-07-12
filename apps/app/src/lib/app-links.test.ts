import {
  APP_HTTPS_ORIGIN,
  APP_SCHEME,
  appLink,
  buildAppUrl,
  buildHttpsAppUrl,
  DEEP_LINK_PATHS,
  formatAppLink,
  normalizeAppPath,
  resolveAppLink,
} from "@/lib/app-links";
import { QUICK_ACTION_ROUTES } from "@/lib/quick-actions";

describe("normalizeAppPath", () => {
  it("adds a leading slash and strips trailing slashes", () => {
    expect(normalizeAppPath("tracker")).toBe("/tracker");
    expect(normalizeAppPath("/tracker/")).toBe("/tracker");
    expect(normalizeAppPath("/")).toBe("/");
    expect(normalizeAppPath("")).toBe("/");
  });

  it("preserves query strings", () => {
    expect(normalizeAppPath("quran/2?ayah=255")).toBe("/quran/2?ayah=255");
    expect(normalizeAppPath("/quran/2/?ayah=255")).toBe("/quran/2?ayah=255");
  });
});

describe("buildAppUrl / buildHttpsAppUrl", () => {
  it("builds scheme URLs without a leading slash after ://", () => {
    expect(buildAppUrl("/tracker")).toBe(`${APP_SCHEME}://tracker`);
    expect(buildAppUrl("tracker")).toBe(`${APP_SCHEME}://tracker`);
    expect(buildAppUrl("/")).toBe(`${APP_SCHEME}://`);
  });

  it("builds https URLs against the product origin", () => {
    expect(buildHttpsAppUrl("/tracker")).toBe(`${APP_HTTPS_ORIGIN}/tracker`);
    expect(buildHttpsAppUrl("/")).toBe(`${APP_HTTPS_ORIGIN}/`);
    expect(buildHttpsAppUrl("quran/2?ayah=1")).toBe(`${APP_HTTPS_ORIGIN}/quran/2?ayah=1`);
  });

  it("resolveAppLink returns path + both formats", () => {
    expect(resolveAppLink("/qibla")).toEqual({
      path: "/qibla",
      schemeUrl: `${APP_SCHEME}://qibla`,
      httpsUrl: `${APP_HTTPS_ORIGIN}/qibla`,
    });
  });

  it("formatAppLink switches scheme vs https", () => {
    expect(formatAppLink("/tasbeeh/free", "scheme")).toBe(`${APP_SCHEME}://tasbeeh/free`);
    expect(formatAppLink("/tasbeeh/free", "https")).toBe(`${APP_HTTPS_ORIGIN}/tasbeeh/free`);
  });
});

describe("appLink builders", () => {
  it("builds static hubs", () => {
    expect(appLink.tracker()).toEqual(resolveAppLink("/tracker"));
    expect(appLink.qibla().schemeUrl).toBe(`${APP_SCHEME}://qibla`);
    expect(appLink.tasbeeh().path).toBe("/tasbeeh/free");
  });

  it("builds quran surah with optional ayah", () => {
    expect(appLink.quranSurah(2).path).toBe("/quran/2");
    expect(appLink.quranSurah(2, { ayah: 255 }).path).toBe("/quran/2?ayah=255");
    expect(appLink.quranSurah(2, { ayah: 255 }).schemeUrl).toBe(`${APP_SCHEME}://quran/2?ayah=255`);
  });

  it("builds mushaf page and content detail paths", () => {
    expect(appLink.quranPage(255).path).toBe("/quran/page/255");
    expect(appLink.duaDetail("morning-1").path).toBe("/dua/detail/morning-1");
    expect(appLink.zikrCategory("after_prayer").path).toBe("/zikr/after_prayer");
    expect(appLink.calendarDate("2026-07-12").path).toBe("/calendar/2026-07-12");
  });

  it("builds hadith collection with optional search seed", () => {
    expect(appLink.hadithCollection("riyad").path).toBe("/hadith/riyad");
    expect(appLink.hadithCollection("bukhari", { q: "Bukhari 1" }).path).toBe(
      "/hadith/bukhari?q=Bukhari+1",
    );
  });

  it("builds special action bridges", () => {
    expect(appLink.markCurrent().path).toBe("/mark-current");
    expect(appLink.openReview().path).toBe("/open-review");
    expect(appLink.openReview("manual").path).toBe("/open-review?triggerId=manual");
  });
});

describe("DEEP_LINK_PATHS catalog", () => {
  it("includes every quick-action route", () => {
    const missing = Object.values(QUICK_ACTION_ROUTES)
      .map((route) => normalizeAppPath(String(route)))
      .filter((path) => !DEEP_LINK_PATHS.includes(path));
    expect(missing).toEqual([]);
  });

  it("includes special action bridges", () => {
    expect(DEEP_LINK_PATHS).toContain("/mark-current");
    expect(DEEP_LINK_PATHS).toContain("/open-review");
  });

  it("includes Qur'an / qaza / hadith extras from the catalog expansion", () => {
    expect(DEEP_LINK_PATHS).toEqual(
      expect.arrayContaining([
        "/quran/juz",
        "/quran/pages",
        "/quran/khatm",
        "/quran/hifz",
        "/qaza/history",
        "/hadith/daily",
      ]),
    );
  });
});
