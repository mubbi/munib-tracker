import { describe, expect, it, jest } from "@jest/globals";
import type { DuaItem, HadithItem, ZikrItem } from "@munib-tracker/shared/types";

import {
  buildAudioActivity,
  buildDuaActivity,
  buildDuroodActivity,
  buildHadithActivity,
  buildHadithCollectionActivity,
  buildNamesActivity,
  buildQuranActivity,
  buildZikrActivity,
  isContinueContentHref,
  navigateToContinue,
} from "./continue-activity";

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
