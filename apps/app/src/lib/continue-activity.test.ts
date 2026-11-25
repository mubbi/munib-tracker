import { describe, expect, it, jest } from "@jest/globals";
import type { DuaItem, HadithItem, ZikrItem } from "@munib-tracker/shared/types";

import {
  buildAudioActivity,
  buildDuaActivity,
  buildDuroodActivity,
  buildHadithActivity,
  buildHadithCollectionActivity,
  buildNamesActivity,
  buildPracticeActivity,
  buildQuranActivity,
  buildZikrActivity,
  isContinueContentHref,
  navigateToContinue,
} from "./continue-activity";
import { zikrQuranHref } from "./zikr-quran";

describe("isContinueContentHref", () => {
  it("matches content routes", () => {
    expect(isContinueContentHref("/quran/2")).toBe(true);
    expect(isContinueContentHref("/hadith/nawawi40")).toBe(true);
    expect(isContinueContentHref("/dua/detail/foo")).toBe(true);
    expect(isContinueContentHref("/zikr/detail/bar")).toBe(true);
    expect(isContinueContentHref("/duroods")).toBe(true);
    expect(isContinueContentHref("/names-of-allah")).toBe(true);
  });

  it("rejects non-content routes", () => {
    expect(isContinueContentHref("/tracker")).toBe(false);
    expect(isContinueContentHref(null)).toBe(false);
    expect(isContinueContentHref(undefined)).toBe(false);
  });
});

describe("buildQuranActivity", () => {
  it("builds ayah href for surah 2 ayah 255", () => {
    const activity = buildQuranActivity(2, 255);
    expect(activity.kind).toBe("quran");
    expect(activity.href).toBe("/quran/2?ayah=255");
    expect(activity.title).toBe("Al-Baqarah");
    expect(activity.subtitle).toContain("2:255");
  });

  it("omits ayah param for ayah 1", () => {
    expect(buildQuranActivity(1, 1).href).toBe("/quran/1");
  });

  it("uses page layout when requested", () => {
    const activity = buildQuranActivity(2, 255, { page: 42, layout: "page" });
    expect(activity.href).toContain("/quran/page/42");
    expect(activity.subtitle).toContain("Page 42");
  });
});

describe("buildHadithActivity", () => {
  const item: HadithItem = {
    id: "nawawi40:1",
    collection: "nawawi40",
    reference: "Hadith 1",
    arabic: "بسم الله",
    english: "Actions are judged by intentions.",
    narrator: "Umar",
  };

  it("builds a searchable hadith href", () => {
    const activity = buildHadithActivity(item, "Nawawi 40");
    expect(activity.kind).toBe("hadith");
    expect(activity.href).toBe("/hadith/nawawi40?q=Hadith%201");
    expect(activity.subtitle).toBe("Nawawi 40");
    expect(activity.preview).toContain("بسم");
  });
});

describe("buildHadithCollectionActivity", () => {
  it("points at the collection index", () => {
    const activity = buildHadithCollectionActivity("nawawi40", "Nawawi 40");
    expect(activity.href).toBe("/hadith/nawawi40");
    expect(activity.title).toBe("Nawawi 40");
  });
});

describe("buildDuaActivity", () => {
  const item: DuaItem = {
    id: "morning-1",
    title: "Morning dua",
    arabic: "اللهم",
    english: "O Allah",
    category: "morning",
    tags: [],
  };

  it("builds a dua detail href", () => {
    const activity = buildDuaActivity(item);
    expect(activity.kind).toBe("dua");
    expect(activity.href).toBe("/dua/detail/morning-1");
    expect(activity.title).toBe("Morning dua");
  });
});

describe("buildZikrActivity", () => {
  it("routes full-surah zikr to quran", () => {
    const item: ZikrItem = {
      id: "before_sleep-mulk",
      title: "Surah Al-Mulk",
      arabic: "تَبَارَكَ",
      english: "Blessed is He",
      category: "before_sleep",
      count: 1,
      tags: [],
    };
    const activity = buildZikrActivity(item);
    expect(activity.kind).toBe("quran");
    expect(activity.href).toBe("/quran/67");
  });

  it("routes regular zikr to zikr detail", () => {
    const item: ZikrItem = {
      id: "subhanallah",
      title: "SubhanAllah",
      arabic: "سبحان الله",
      english: "Glory be to Allah",
      category: "tasbeeh",
      count: 33,
      tags: [],
    };
    const activity = buildZikrActivity(item);
    expect(activity.kind).toBe("zikr");
    expect(activity.href).toBe("/zikr/detail/subhanallah");
  });
});

describe("buildDuroodActivity", () => {
  it("defaults title to Durood", () => {
    const activity = buildDuroodActivity({ arabic: "اللهم صل" });
    expect(activity.kind).toBe("durood");
    expect(activity.href).toBe("/duroods");
    expect(activity.title).toBe("Durood");
  });
});

describe("buildNamesActivity", () => {
  it("builds a names-of-allah activity", () => {
    const activity = buildNamesActivity({
      id: "ar-rahman",
      transliteration: "Ar-Rahman",
      meaning: "The Most Merciful",
      arabic: "الرَّحْمَن",
    });
    expect(activity.kind).toBe("names");
    expect(activity.href).toBe("/names-of-allah");
    expect(activity.subtitle).toBe("The Most Merciful");
  });
});

describe("buildAudioActivity", () => {
  it("returns null for non-content hrefs", () => {
    expect(buildAudioActivity("/settings", { title: "Track" })).toBeNull();
  });

  it("marks audio and infers kind from href", () => {
    const activity = buildAudioActivity("/quran/2?ayah=255", {
      title: "Ayat al-Kursi",
      subtitle: "2:255",
    });
    expect(activity?.kind).toBe("quran");
    expect(activity?.isAudio).toBe(true);
  });
});

describe("navigateToContinue", () => {
  it("pushes typed quran routes", () => {
    const push = jest.fn();
    navigateToContinue(
      { push },
      {
        kind: "quran",
        href: "/quran/2?ayah=255",
        title: "Al-Baqarah",
        updatedAt: "2026-01-01",
      },
    );
    expect(push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "2", ayah: "255" },
    });
  });

  it("pushes hadith collection routes with query", () => {
    const push = jest.fn();
    navigateToContinue(
      { push },
      {
        kind: "hadith",
        href: "/hadith/nawawi40?q=Hadith%201",
        title: "Hadith 1",
        updatedAt: "2026-01-01",
      },
    );
    expect(push).toHaveBeenCalledWith({
      pathname: "/hadith/[collection]",
      params: { collection: "nawawi40", q: "Hadith 1" },
    });
  });
});

describe("continue-activity edge cases", () => {
  const activity = (href: string) => ({
    kind: "quran" as const,
    href,
    title: "x",
    updatedAt: "2026-01-01",
  });

  it("falls back for unknown surahs and keeps ayah mode when page has no layout", () => {
    const unknown = buildQuranActivity(999, 3);
    expect(unknown.title).toBe("Surah 999");
    expect(unknown.subtitle).toBe("Ayah 3");
    expect(unknown.preview).toBeUndefined();
    const noLayout = buildQuranActivity(2, 5, { page: 3, isAudio: true });
    expect(noLayout.href).toBe("/quran/2?ayah=5");
    expect(noLayout.isAudio).toBe(true);
    const mushaf = buildQuranActivity(2, 5, { page: 3, layout: "mushaf" });
    expect(mushaf.href).toBe("/quran/page/3?surah=2&ayah=5");
  });

  it("uses narrator and English when there is no collection name or Arabic", () => {
    const longEnglish = "word ".repeat(60);
    const h = buildHadithActivity(
      {
        id: "x:1",
        collection: "x",
        reference: "Ref 1",
        arabic: "",
        english: longEnglish,
        narrator: "Abu Hurairah",
      } as HadithItem,
      undefined,
      { isAudio: true },
    );
    expect(h.subtitle).toBe("Abu Hurairah");
    expect(h.preview?.endsWith("…")).toBe(true);
    expect(h.preview?.length).toBeLessThanOrEqual(120);
    expect(h.isAudio).toBe(true);
  });

  it("keeps an explicit durood title", () => {
    expect(buildDuroodActivity({ title: "Ibrahimi", arabic: "ص" }).title).toBe("Ibrahimi");
  });

  it.each([
    ["/hadith/bukhari", "hadith"],
    ["/dua/detail/x", "dua"],
    ["/zikr/detail/y", "zikr"],
    ["/duroods", "durood"],
    ["/names-of-allah", "names"],
  ])("infers %s audio as %s", (href, kind) => {
    expect(buildAudioActivity(href, { title: "t" })?.kind).toBe(kind);
  });

  it("navigates a quran href without an ayah", () => {
    const push = jest.fn();
    navigateToContinue({ push }, activity("/quran/18"));
    expect(push).toHaveBeenCalledWith({ pathname: "/quran/[surah]", params: { surah: "18" } });
  });

  it("navigates a hadith collection without a query", () => {
    const push = jest.fn();
    navigateToContinue({ push }, activity("/hadith/sahih%20muslim"));
    expect(push).toHaveBeenCalledWith({
      pathname: "/hadith/[collection]",
      params: { collection: "sahih muslim" },
    });
  });

  it("navigates dua and zikr detail routes", () => {
    const push = jest.fn();
    navigateToContinue({ push }, activity("/dua/detail/morning-1"));
    expect(push).toHaveBeenLastCalledWith({
      pathname: "/dua/detail/[id]",
      params: { id: "morning-1" },
    });
    navigateToContinue({ push }, activity("/zikr/detail/subhanallah"));
    expect(push).toHaveBeenLastCalledWith({
      pathname: "/zikr/detail/[id]",
      params: { id: "subhanallah" },
    });
  });

  it("sends Qur'an-backed zikr detail links to the reader", () => {
    const push = jest.fn();
    navigateToContinue({ push }, activity("/zikr/detail/before_sleep-mulk"));
    expect(push).toHaveBeenCalledWith(zikrQuranHref("before_sleep-mulk"));
  });

  it("pushes any other href verbatim", () => {
    const push = jest.fn();
    navigateToContinue({ push }, activity("/names-of-allah"));
    expect(push).toHaveBeenCalledWith("/names-of-allah");
  });
});

describe("buildPracticeActivity (D68)", () => {
  it("resumes the same passage and mode", () => {
    const activity = buildPracticeActivity({ surah: 67, ayahStart: 1, ayahEnd: 10 }, "follow");
    expect(activity.kind).toBe("practice");
    expect(activity.href).toBe("/quran/practice/session?surah=67&from=1&to=10&mode=follow");
    expect(activity.subtitle).toContain("67:1–10");
    expect(isContinueContentHref(activity.href)).toBe(true);
  });

  it("resumes the revision queue for a revision sitting", () => {
    const activity = buildPracticeActivity({ surah: 2, ayahStart: 255, ayahEnd: 255 }, "revision");
    expect(activity.href).toBe("/quran/revision");
    expect(activity.subtitle).toContain("2:255");
  });

  it("navigates straight to the practice route", () => {
    const push = jest.fn();
    navigateToContinue(
      { push },
      {
        ...buildPracticeActivity({ surah: 112, ayahStart: 1, ayahEnd: 4 }, "check"),
        updatedAt: "2026-11-25T00:00:00.000Z",
      },
    );
    expect(push).toHaveBeenCalledWith("/quran/practice/session?surah=112&from=1&to=4&mode=check");
  });
});
