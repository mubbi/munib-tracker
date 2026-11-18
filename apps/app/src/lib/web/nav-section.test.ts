import { isChromelessRoute, resolveNavSection } from "@/lib/web/nav-section";

describe("resolveNavSection", () => {
  it.each([
    ["/", "home"],
    ["/tracker", "tracker"],
    ["/qaza/calculator", "tracker"],
    ["/calendar/2026-11-17", "tracker"],
    ["/statistics", "tracker"],
    ["/library", "library"],
    ["/quran/2", "library"],
    ["/hadith/bukhari", "library"],
    ["/learn-quran/tajweed/1", "library"],
    ["/settings", "settings"],
    ["/settings/fonts", "settings"],
    ["/profile", "settings"],
    ["/search", "search"],
    ["/bookmarks", "bookmarks"],
    ["/settings/", "settings"],
    ["/quran/2?ayah=255", "library"],
  ])("%s → %s", (path, section) => {
    expect(resolveNavSection(path)).toBe(section);
  });

  it("does not treat lookalike prefixes as a section", () => {
    expect(resolveNavSection("/trackers-guide")).toBe("library");
    expect(resolveNavSection("/settingsx")).toBe("library");
  });
});

describe("isChromelessRoute", () => {
  it("flags first-run and auth routes", () => {
    expect(isChromelessRoute("/intro")).toBe(true);
    expect(isChromelessRoute("/intro-location")).toBe(true);
    expect(isChromelessRoute("/login")).toBe(true);
    expect(isChromelessRoute("/oauth/apple")).toBe(true);
  });

  it("keeps app routes chromed", () => {
    expect(isChromelessRoute("/")).toBe(false);
    expect(isChromelessRoute("/quran")).toBe(false);
    expect(isChromelessRoute("/introduction-to-islam")).toBe(false);
  });
});
