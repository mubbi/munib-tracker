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
import { SETTINGS_ROUTE_PATHS } from "@/lib/settings/routes";

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

  it("includes every wave-3 hub and its sub-screens", () => {
    expect(DEEP_LINK_PATHS).toEqual(
      expect.arrayContaining([
        "/debts",
        "/wasiyyah",
        "/wasiyyah/edit",
        "/fasting",
        "/habits",
        "/muhasabah",
        "/family-ties",
        "/rawatib",
        "/dhul-hijjah",
        "/dhul-hijjah/udhiyah",
        "/quran/notes",
      ]),
    );
  });

  it("builds a madhhab difference link", () => {
    expect(appLink.fiqhDifference("witr-status").path).toBe("/fiqh/witr-status");
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
        "/fidyah",
        "/janazah",
        "/sadaqah",
        "/prophets/tree",
      ]),
    );
  });

  it("includes the five Qur'an practice routes", () => {
    expect(DEEP_LINK_PATHS).toEqual(
      expect.arrayContaining([
        "/quran/practice",
        "/quran/practice/session",
        "/quran/practice/summary",
        "/quran/revision",
        "/settings/quran-practice",
      ]),
    );
  });
});

describe("Qur'an practice links", () => {
  it("builds a practice session link with its passage", () => {
    expect(appLink.quranPracticeSession(1, 2, 4).path).toBe(
      "/quran/practice/session?surah=1&from=2&to=4",
    );
    expect(appLink.quranRevision().path).toBe("/quran/revision");
  });
});

describe("every static appLink builder", () => {
  const PARAMETERISED = new Set([
    "tvPair",
    "quranPracticeSession",
    "quranSurah",
    "quranPage",
    "hadithCollection",
    "duaCategory",
    "duaDetail",
    "zikrCategory",
    "zikrDetail",
    "tasbeehZikr",
    "tasbeehDurood",
    "tasbeehCustom",
    "calendarDate",
    "tour",
    "openReview",
    "settingsGroup",
    "setting",
    "fiqhDifference",
    "circleJoin",
    "kidsLink",
  ]);
  const staticBuilders = Object.entries(appLink).filter(([name]) => !PARAMETERISED.has(name));

  it.each(staticBuilders)("%s resolves to a catalogued deep-link path", (_name, build) => {
    const urls = (build as () => ReturnType<typeof resolveAppLink>)();
    expect(DEEP_LINK_PATHS).toContain(urls.path);
    expect(urls).toEqual(resolveAppLink(urls.path));
  });
});

describe("circle deep links (NF-3.16, D36)", () => {
  it("builds the invite and child-device links", () => {
    expect(appLink.circleJoin("abcde-fgh23").path).toBe("/circle/join/ABCDEFGH23");
    expect(appLink.circleJoin("ABCDEFGH23").httpsUrl).toMatch(/\/circle\/join\/ABCDEFGH23$/);
    expect(appLink.kidsLink("mtl_abc").path).toBe("/kids/link?token=mtl_abc");
  });
});

describe("parameterised appLink builders", () => {
  it("tvPair encodes an optional pairing code", () => {
    expect(appLink.tvPair().path).toBe("/tv-pair");
    expect(appLink.tvPair("AB 12").path).toBe("/tv-pair?code=AB%2012");
  });

  it("quranPracticeSession defaults `to` and carries the mode", () => {
    expect(appLink.quranPracticeSession(2, 5).path).toBe(
      "/quran/practice/session?surah=2&from=5&to=5",
    );
    expect(appLink.quranPracticeSession(2, 5, 7, "hifz").path).toBe(
      "/quran/practice/session?surah=2&from=5&to=7&mode=hifz",
    );
  });

  it("hadithCollection drops an empty search seed", () => {
    expect(appLink.hadithCollection("muslim", { q: "" }).path).toBe("/hadith/muslim");
  });

  it("builds tasbeeh, dua and zikr detail paths", () => {
    expect(appLink.duaCategory("travel").path).toBe("/dua/travel");
    expect(appLink.tasbeehZikr("z1").path).toBe("/tasbeeh/z1");
    expect(appLink.tasbeehDurood("d1").path).toBe("/tasbeeh/durood/d1");
    expect(appLink.tasbeehCustom("c1").path).toBe("/tasbeeh/custom/c1");
    expect(appLink.zikrDetail("not-a-quran-zikr").path).toBe("/zikr/detail/not-a-quran-zikr");
  });

  it("tour adds the tour id only when given", () => {
    expect(appLink.tour().path).toBe("/tour");
    expect(appLink.tour("home").path).toBe("/tour?tour=home");
  });

  it("formatAppLink defaults to the custom scheme", () => {
    expect(formatAppLink("/qibla")).toBe(`${APP_SCHEME}://qibla`);
  });

  it("normalizeAppPath keeps extra `?` inside the query and collapses bare slashes", () => {
    expect(normalizeAppPath("  /a?b=1?c=2 ")).toBe("/a?b=1?c=2");
    expect(normalizeAppPath("///")).toBe("/");
  });
});

describe("APP_HTTPS_ORIGIN", () => {
  const original = process.env.EXPO_PUBLIC_APP_URL;
  afterEach(() => {
    if (original === undefined) delete process.env.EXPO_PUBLIC_APP_URL;
    else process.env.EXPO_PUBLIC_APP_URL = original;
  });

  it("reads EXPO_PUBLIC_APP_URL and trims trailing slashes", () => {
    process.env.EXPO_PUBLIC_APP_URL = "https://staging.example.test///";
    jest.isolateModules(() => {
      const mod = require("@/lib/app-links") as typeof import("@/lib/app-links");
      expect(mod.APP_HTTPS_ORIGIN).toBe("https://staging.example.test");
      expect(mod.buildHttpsAppUrl("/")).toBe("https://staging.example.test/");
    });
  });

  it("falls back to the production origin", () => {
    delete process.env.EXPO_PUBLIC_APP_URL;
    jest.isolateModules(() => {
      const mod = require("@/lib/app-links") as typeof import("@/lib/app-links");
      expect(mod.APP_HTTPS_ORIGIN).toBe("https://my.munibtracker.app");
    });
  });
});

describe("settings deep links (NF-3.0b, B7)", () => {
  it("advertises every settings route from the registry routes", () => {
    for (const path of SETTINGS_ROUTE_PATHS) expect(DEEP_LINK_PATHS).toContain(path);
  });

  it("includes the routes B7 found missing", () => {
    for (const path of [
      "/settings/time-format",
      "/settings/default-calendar",
      "/settings/bedtime",
      "/settings/weather",
      "/settings/import",
      "/settings/my-reports",
    ]) {
      expect(DEEP_LINK_PATHS).toContain(path);
    }
  });

  it("builds group and focused-setting links", () => {
    expect(appLink.settingsGroup("quran").path).toBe("/settings/quran");
    expect(appLink.setting("language.timeFormat").path).toBe(
      "/settings/language?focus=language.timeFormat",
    );
  });
});
