import {
  entryLocaleForPath,
  isAppLocaleCode,
  LOCALE_PATH_BOOT_SCRIPT,
  LOCALE_PATH_DEFAULT,
  localizedUrl,
  MUNIB_ENTRY_LOCALE_GLOBAL,
  MUNIB_LOCALE_BOOT_KEY,
  prependLocalePath,
  stripLocalePrefix,
} from "./locale-path";

describe("locale-path", () => {
  it("leaves default locale paths unprefixed", () => {
    expect(prependLocalePath("/hadith", LOCALE_PATH_DEFAULT)).toBe("/hadith");
    expect(localizedUrl("/hadith", "en", "https://example.com")).toBe("https://example.com/hadith");
  });

  it("prefixes non-default locales", () => {
    expect(prependLocalePath("/hadith", "ar")).toBe("/ar/hadith");
    expect(localizedUrl("/", "ur", "https://example.com")).toBe("https://example.com/ur");
  });

  it("strips locale prefix for router paths", () => {
    expect(stripLocalePrefix("/ar/hadith")).toEqual({ locale: "ar", path: "/hadith" });
    expect(stripLocalePrefix("/hadith")).toEqual({ locale: null, path: "/hadith" });
    expect(stripLocalePrefix("/en/hadith")).toEqual({ locale: null, path: "/en/hadith" });
  });
});

describe("locale-path edge cases", () => {
  it("recognises app locale codes", () => {
    expect(isAppLocaleCode("ar")).toBe(true);
    expect(isAppLocaleCode("zz")).toBe(false);
  });

  it("normalises query, hash and trailing slashes when stripping", () => {
    expect(stripLocalePrefix("/ur/")).toEqual({ locale: "ur", path: "/" });
    expect(stripLocalePrefix("/ur")).toEqual({ locale: "ur", path: "/" });
    expect(stripLocalePrefix("/ar/quran/2/?ayah=3#x")).toEqual({ locale: "ar", path: "/quran/2" });
    expect(stripLocalePrefix("/")).toEqual({ locale: null, path: "/" });
    expect(stripLocalePrefix("")).toEqual({ locale: null, path: "/" });
    expect(stripLocalePrefix("/zz/hadith")).toEqual({ locale: null, path: "/zz/hadith" });
    expect(stripLocalePrefix("/arabic")).toEqual({ locale: null, path: "/arabic" });
  });

  it("prepends locales to relative, root and empty paths", () => {
    expect(prependLocalePath("", "en")).toBe("/");
    expect(prependLocalePath("/", "en")).toBe("/");
    expect(prependLocalePath("", "ar")).toBe("/ar");
    expect(prependLocalePath("hadith", "ar")).toBe("/ar/hadith");
  });

  it("builds localized URLs with and without an origin", () => {
    expect(localizedUrl("hadith", "ar")).toBe("/ar/hadith");
    expect(localizedUrl("/", "en", "https://example.com///")).toBe("https://example.com");
  });

  it("ships a boot script keyed to the session storage key", () => {
    expect(LOCALE_PATH_BOOT_SCRIPT).toContain(MUNIB_LOCALE_BOOT_KEY);
    expect(LOCALE_PATH_BOOT_SCRIPT.startsWith("(function(){")).toBe(true);
  });
  describe("boot script + entryLocaleForPath", () => {
    const g = globalThis as Record<string, unknown>;
    let previousWindow: unknown;
    beforeEach(() => {
      previousWindow = g.window;
    });
    afterEach(() => {
      g.window = previousWindow;
    });

    /** Runs the inline boot script against a fake browser at `pathname`. */
    function boot(pathname: string) {
      const storage = new Map<string, string>();
      const replaceState = jest.fn();
      const win: Record<string, unknown> = {};
      new Function("location", "sessionStorage", "history", "window", LOCALE_PATH_BOOT_SCRIPT)(
        { pathname, search: "", hash: "" },
        { setItem: (k: string, v: string) => storage.set(k, v) },
        { replaceState },
        win,
      );
      g.window = win;
      return { storage, replaceState, win };
    }

    it("strips the locale prefix and remembers the entry locale + app path", () => {
      const { storage, replaceState, win } = boot("/ar/quran/1/");
      expect(storage.get(MUNIB_LOCALE_BOOT_KEY)).toBe("ar");
      expect(replaceState).toHaveBeenCalledWith({ munibLocale: "ar" }, "", "/quran/1");
      expect(win[MUNIB_ENTRY_LOCALE_GLOBAL]).toEqual({ locale: "ar", path: "/quran/1" });
      expect(entryLocaleForPath("/quran/1")).toBe("ar");
      expect(entryLocaleForPath("/quran/2")).toBeNull();
    });

    it("leaves English entry URLs untouched", () => {
      const { replaceState, win } = boot("/quran/1");
      expect(replaceState).not.toHaveBeenCalled();
      expect(win[MUNIB_ENTRY_LOCALE_GLOBAL]).toBeUndefined();
      expect(entryLocaleForPath("/quran/1")).toBeNull();
    });

    it("maps a bare locale root to the app home", () => {
      boot("/ur");
      expect(entryLocaleForPath("/")).toBe("ur");
    });

    it("ignores a malformed global", () => {
      g.window = { [MUNIB_ENTRY_LOCALE_GLOBAL]: { locale: "xx", path: "/" } };
      expect(entryLocaleForPath("/")).toBeNull();
    });
  });
});
