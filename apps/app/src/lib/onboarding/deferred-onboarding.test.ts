import {
  defersOnboarding,
  isOnboardingPath,
  isSetupNoticePath,
  normalizeAppPath,
  resolveOnboardingAccess,
} from "@/lib/onboarding/deferred-onboarding";

describe("normalizeAppPath", () => {
  it.each([
    ["", "/"],
    ["/", "/"],
    ["/(tabs)", "/"],
    ["/quran/2/", "/quran/2"],
    ["/circle/join/AB12?ref=share#top", "/circle/join/AB12"],
    ["/(onboarding)/setup", "/setup"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeAppPath(input)).toBe(expected);
  });
});

describe("defersOnboarding", () => {
  it.each(["/", "/(tabs)", "", "/intro", "/intro-location", "/intro-madhhab", "/setup"])(
    "keeps onboarding for %s",
    (path) => {
      expect(defersOnboarding(path)).toBe(false);
    },
  );

  it.each([
    "/circle/join/AB12",
    "/khatm-groups/123",
    "/family",
    "/quran/2",
    "/hadith/bukhari/1",
    "/zakat",
    "/library",
    "/login",
  ])("defers onboarding for a deep link to %s", (path) => {
    expect(defersOnboarding(path)).toBe(true);
  });
});

describe("isSetupNoticePath", () => {
  it("allows regular pages", () => {
    expect(isSetupNoticePath("/circle/join/AB12")).toBe(true);
    expect(isSetupNoticePath("/quran/2")).toBe(true);
  });

  it.each(["/", "/setup", "/login", "/oauth/google", "/oauth2redirect", "/tv-pair"])(
    "stays quiet on %s",
    (path) => {
      expect(isSetupNoticePath(path)).toBe(false);
    },
  );
});

describe("isOnboardingPath", () => {
  it("matches the welcome slides and setup wizard only", () => {
    expect(isOnboardingPath("/intro")).toBe(true);
    expect(isOnboardingPath("/(onboarding)/setup")).toBe(true);
    expect(isOnboardingPath("/")).toBe(false);
    expect(isOnboardingPath("/quran")).toBe(false);
  });
});

describe("resolveOnboardingAccess", () => {
  const base = { completed: false, bot: false, deferred: false, pathname: "/" };

  it("sends a first-time user landing on Home to onboarding", () => {
    expect(resolveOnboardingAccess(base)).toEqual({
      showApp: false,
      deferred: false,
      pending: true,
    });
  });

  it("opens a deep link for a first-time user and defers onboarding", () => {
    expect(resolveOnboardingAccess({ ...base, pathname: "/circle/join/AB12" })).toEqual({
      showApp: true,
      deferred: true,
      pending: true,
    });
  });

  it("keeps the app open on Home once a deep link deferred onboarding this session", () => {
    expect(resolveOnboardingAccess({ ...base, deferred: true })).toEqual({
      showApp: true,
      deferred: true,
      pending: true,
    });
  });

  it("stays on the onboarding screens when nothing was deferred", () => {
    expect(resolveOnboardingAccess({ ...base, pathname: "/intro" }).showApp).toBe(false);
  });

  it("opens everything for onboarded users with nothing pending", () => {
    expect(
      resolveOnboardingAccess({ ...base, completed: true, pathname: "/quran", deferred: true }),
    ).toEqual({ showApp: true, deferred: false, pending: false });
  });

  it("lets crawlers see any page without a pending notice", () => {
    expect(resolveOnboardingAccess({ ...base, bot: true })).toEqual({
      showApp: true,
      deferred: false,
      pending: false,
    });
  });
});
