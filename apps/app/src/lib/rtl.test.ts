import type { AppLocale } from "@munib-tracker/shared/types";
import { renderHook } from "@testing-library/react-native";
import { I18nManager } from "react-native";

import i18n from "@/i18n";
import {
  arabicTextAlign,
  arrowForward,
  chevronBackward,
  containsArabicScript,
  filterValueTextStyle,
  horizontalSafeAreaInsets,
  horizontalSafeAreaPadding,
  isRTL,
  ltrControlStyle,
  ltrControlViewProps,
  mushafPageBackward,
  mushafPageForward,
  skipNextIcon,
  skipPreviousIcon,
  uiTextAlign,
  useArrowForward,
  useChevronBack,
  useChevronBackward,
  useChevronForward,
  useIsRTL,
  useSkipNextIcon,
  useSkipPreviousIcon,
  useUiTextStyle,
} from "@/lib/rtl";
import { preferencesStore } from "@/stores/preferences-store";
import { usePlatform } from "@/test-support/platform";

const initialPrefs = preferencesStore.getState().prefs;

/** Arrange the saved locale and the i18n language (`resolved` defaults to `language`). */
function setup({
  locale = "en",
  language = "en",
  resolved = language,
  initialized = true,
  nativeRtl = false,
}: {
  locale?: AppLocale;
  language?: string | undefined;
  resolved?: string | undefined;
  initialized?: boolean;
  nativeRtl?: boolean;
} = {}) {
  preferencesStore.setState({ prefs: { ...initialPrefs, locale } });
  jest.replaceProperty(i18n, "language", language as string);
  jest.replaceProperty(i18n, "resolvedLanguage", resolved);
  jest.replaceProperty(i18n, "isInitialized", initialized);
  jest.replaceProperty(I18nManager, "isRTL", nativeRtl);
}

afterEach(() => {
  jest.restoreAllMocks();
  preferencesStore.setState({ prefs: initialPrefs });
});

describe("isRTL on native", () => {
  it.each([true, false])("follows I18nManager.isRTL (%p)", (nativeRtl) => {
    setup({ locale: "ar", nativeRtl });
    expect(isRTL()).toBe(nativeRtl);
  });

  it.each([true, false])("useIsRTL follows I18nManager.isRTL (%p)", async (nativeRtl) => {
    setup({ language: "ur", nativeRtl });
    const { result } = await renderHook(() => useIsRTL());
    expect(result.current).toBe(nativeRtl);
  });
});

describe("isRTL on web", () => {
  usePlatform({ OS: "web" });

  it.each([
    ["an RTL saved locale", { locale: "ur" as AppLocale }, true],
    ["an RTL i18n language with a region", { language: "ar-SA" }, true],
    ["an RTL language only in resolvedLanguage", { language: "en", resolved: "fa" }, true],
    ["an LTR i18n language", { language: "fr" }, false],
  ])("is %p for %s", (_label, arrange, expected) => {
    setup(arrange);
    expect(isRTL()).toBe(expected);
  });

  it.each(["rtl", "ltr"])("falls back to document dir=%s before i18n is ready", (dir) => {
    setup({ initialized: false });
    const g = globalThis as Record<string, unknown>;
    const previous = Object.getOwnPropertyDescriptor(g, "document");
    g.document = { documentElement: { dir } };
    try {
      expect(isRTL()).toBe(dir === "rtl");
    } finally {
      if (previous) Object.defineProperty(g, "document", previous);
      else delete g.document;
    }
  });

  it("is LTR without i18n or a document", () => {
    setup({ initialized: false });
    expect(isRTL()).toBe(false);
  });

  it("is LTR when i18n has no language yet", () => {
    setup({ language: undefined, resolved: undefined });
    expect(isRTL()).toBe(false);
  });

  it.each([
    ["an RTL saved locale", { locale: "ar" as AppLocale }, true],
    ["an RTL resolved language", { resolved: "ps-AF" }, true],
    ["an LTR language", { language: "de" }, false],
    ["no language", { language: undefined, resolved: undefined }, false],
  ])("useIsRTL is %p for %s", async (_label, arrange, expected) => {
    setup(arrange);
    const { result } = await renderHook(() => useIsRTL());
    expect(result.current).toBe(expected);
  });
});

describe("text alignment", () => {
  it.each([
    [false, "left", "right"],
    [true, "left", "left"],
  ])("native rtl=%p → ui %s, arabic %s", (rtl, ui, arabic) => {
    expect(uiTextAlign(rtl)).toBe(ui);
    expect(arabicTextAlign(rtl)).toBe(arabic);
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it.each([
      [false, "left"],
      [true, "right"],
    ])("rtl=%p → ui %s, arabic always right", (rtl, ui) => {
      expect(uiTextAlign(rtl)).toBe(ui);
      expect(arabicTextAlign(rtl)).toBe("right");
    });

    it("defaults to the current direction", () => {
      setup({ locale: "ar" });
      expect(uiTextAlign()).toBe("right");
      expect(arabicTextAlign()).toBe("right");
    });

    it("useUiTextStyle reflects the reactive direction", async () => {
      setup({ locale: "ur" });
      const { result } = await renderHook(() => useUiTextStyle());
      expect(result.current).toEqual({ writingDirection: "rtl", textAlign: "right" });
    });

    it("filterValueTextStyle keeps Latin values LTR inside an RTL UI", () => {
      setup({ locale: "ur" });
      expect(filterValueTextStyle("Alafasy")).toEqual({
        writingDirection: "ltr",
        textAlign: "right",
      });
    });

    it("ltrControlViewProps adds dir=ltr", () => {
      expect(ltrControlViewProps()).toEqual({ style: ltrControlStyle, dir: "ltr" });
    });
  });

  it("filterValueTextStyle uses RTL writing for Arabic script values", () => {
    setup();
    expect(filterValueTextStyle("مشاري")).toEqual({ writingDirection: "rtl", textAlign: "left" });
  });

  it("ltrControlViewProps omits dir on native", () => {
    expect(ltrControlViewProps()).toEqual({ style: ltrControlStyle });
  });
});

describe("direction-encoding icons", () => {
  const LEFT = { ios: "chevron.left", android: "chevron_left", web: "chevron_left" };
  const RIGHT = { ios: "chevron.right", android: "chevron_right", web: "chevron_right" };

  it.each([
    [false, "forward.fill", "backward.fill", "arrow.right", LEFT],
    [true, "backward.fill", "forward.fill", "arrow.left", RIGHT],
  ])("rtl=%p → next %s, previous %s, arrow %s", (nativeRtl, next, previous, arrow, backward) => {
    setup({ nativeRtl });
    expect(skipNextIcon()).toMatchObject({ ios: next });
    expect(skipPreviousIcon()).toMatchObject({ ios: previous });
    expect(arrowForward()).toMatchObject({ ios: arrow });
    expect(chevronBackward()).toEqual(backward);
  });

  it("reactive icon hooks mirror under RTL", async () => {
    setup({ nativeRtl: true });
    const { result } = await renderHook(() => ({
      next: useSkipNextIcon(),
      previous: useSkipPreviousIcon(),
      forward: useChevronForward(),
      back: useChevronBack(),
      arrow: useArrowForward(),
      backward: useChevronBackward(),
    }));
    expect(result.current).toEqual({
      next: { ios: "backward.fill", android: "skip_previous", web: "skip_previous" },
      previous: { ios: "forward.fill", android: "skip_next", web: "skip_next" },
      forward: LEFT,
      back: { ios: "chevron.right", android: "arrow_forward", web: "arrow_forward" },
      arrow: { ios: "arrow.left", android: "arrow_back", web: "arrow_back" },
      backward: RIGHT,
    });
  });

  it("mushaf page turns never mirror", () => {
    expect(mushafPageForward()).toEqual(LEFT);
    expect(mushafPageBackward()).toEqual(RIGHT);
  });
});

describe("containsArabicScript", () => {
  it.each([
    ["بسم الله", true],
    ["Bismillah", false],
    ["", false],
  ])("%p → %p", (text, expected) => {
    expect(containsArabicScript(text)).toBe(expected);
  });
});

describe("horizontalSafeAreaPadding", () => {
  it.each([
    [false, { paddingStart: 10, paddingEnd: 20 }],
    [true, { paddingStart: 20, paddingEnd: 10 }],
  ])("rtl=%p maps physical insets to logical sides", (rtl, expected) => {
    expect(horizontalSafeAreaPadding({ left: 10, right: 20 }, rtl)).toEqual(expected);
  });

  it("defaults to the native layout direction", () => {
    setup({ nativeRtl: true });
    expect(horizontalSafeAreaPadding({ left: 1, right: 2 })).toEqual({
      paddingStart: 2,
      paddingEnd: 1,
    });
  });
});

describe("horizontalSafeAreaInsets", () => {
  it.each([
    [false, { start: 0, end: 24 }],
    [true, { start: 24, end: 0 }],
  ])("rtl=%p puts a right-edge rail on the logical side it lands on", (rtl, expected) => {
    expect(horizontalSafeAreaInsets({ left: 0, right: 24 }, rtl)).toEqual(expected);
  });

  it("defaults to the native layout direction", () => {
    setup({ nativeRtl: true });
    expect(horizontalSafeAreaInsets({ left: 1, right: 2 })).toEqual({ start: 2, end: 1 });
  });
});
