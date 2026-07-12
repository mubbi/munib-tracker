import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Platform } from "react-native";

import i18n from "@/i18n";
import {
  arrowForwardIcon,
  backChevronIcon,
  backwardChevronIcon,
  chevronBack,
  chevronForward,
  forwardChevronIcon,
  isRTL,
  skipNextIconFor,
  skipPreviousIconFor,
  uiTextStyle,
} from "@/lib/rtl";
import { preferencesStore } from "@/stores/preferences-store";

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: jest.fn(),
  },
}));

const getState = preferencesStore.getState as jest.MockedFunction<typeof preferencesStore.getState>;

describe("isRTL on web", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = "web";
    void i18n.changeLanguage("en");
    getState.mockReturnValue({
      prefs: { locale: "en" },
    } as ReturnType<typeof preferencesStore.getState>);
  });

  afterEach(() => {
    Platform.OS = originalOS;
    void i18n.changeLanguage("en");
  });

  it("uses the saved locale when it is RTL", () => {
    getState.mockReturnValue({
      prefs: { locale: "ur" },
    } as ReturnType<typeof preferencesStore.getState>);

    expect(isRTL()).toBe(true);
  });

  it("falls back to i18n.language when the saved locale is LTR", async () => {
    await i18n.changeLanguage("ar");

    expect(isRTL()).toBe(true);
  });
});

describe("uiTextStyle", () => {
  it("aligns UI chrome to the start edge of the reading direction", () => {
    expect(uiTextStyle(false)).toEqual({
      writingDirection: "ltr",
      textAlign: "left",
    });
    expect(uiTextStyle(true)).toEqual({
      writingDirection: "rtl",
      textAlign: "right",
    });
  });
});

describe("forwardChevronIcon / backChevronIcon", () => {
  it("points toward reading direction for forward, against it for back", () => {
    expect(forwardChevronIcon(false)).toEqual({
      ios: "chevron.right",
      android: "chevron_right",
      web: "chevron_right",
    });
    expect(forwardChevronIcon(true)).toEqual({
      ios: "chevron.left",
      android: "chevron_left",
      web: "chevron_left",
    });
    expect(backChevronIcon(false)).toEqual({
      ios: "chevron.left",
      android: "arrow_back",
      web: "arrow_back",
    });
    expect(backChevronIcon(true)).toEqual({
      ios: "chevron.right",
      android: "arrow_forward",
      web: "arrow_forward",
    });
    expect(arrowForwardIcon(false)).toEqual({
      ios: "arrow.right",
      android: "arrow_forward",
      web: "arrow_forward",
    });
    expect(arrowForwardIcon(true)).toEqual({
      ios: "arrow.left",
      android: "arrow_back",
      web: "arrow_back",
    });
    expect(backwardChevronIcon(true)).toEqual({
      ios: "chevron.right",
      android: "chevron_right",
      web: "chevron_right",
    });
    expect(skipPreviousIconFor(true)).toEqual({
      ios: "forward.fill",
      android: "skip_next",
      web: "skip_next",
    });
    expect(skipNextIconFor(false)).toEqual({
      ios: "forward.fill",
      android: "skip_next",
      web: "skip_next",
    });
  });
});

describe("chevronForward", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = "web";
    void i18n.changeLanguage("en");
    getState.mockReturnValue({
      prefs: { locale: "en" },
    } as ReturnType<typeof preferencesStore.getState>);
  });

  afterEach(() => {
    Platform.OS = originalOS;
    void i18n.changeLanguage("en");
  });

  it("points right in LTR locales", () => {
    expect(chevronForward()).toEqual({
      ios: "chevron.right",
      android: "chevron_right",
      web: "chevron_right",
    });
  });

  it("points left in RTL locales", () => {
    getState.mockReturnValue({
      prefs: { locale: "ur" },
    } as ReturnType<typeof preferencesStore.getState>);

    expect(chevronForward()).toEqual({
      ios: "chevron.left",
      android: "chevron_left",
      web: "chevron_left",
    });
  });
});

describe("chevronBack", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = "web";
    void i18n.changeLanguage("en");
    getState.mockReturnValue({
      prefs: { locale: "en" },
    } as ReturnType<typeof preferencesStore.getState>);
  });

  afterEach(() => {
    Platform.OS = originalOS;
    void i18n.changeLanguage("en");
  });

  it("points left in LTR locales", () => {
    expect(chevronBack()).toEqual({
      ios: "chevron.left",
      android: "arrow_back",
      web: "arrow_back",
    });
  });

  it("points right in RTL locales", () => {
    getState.mockReturnValue({
      prefs: { locale: "ur" },
    } as ReturnType<typeof preferencesStore.getState>);

    expect(chevronBack()).toEqual({
      ios: "chevron.right",
      android: "arrow_forward",
      web: "arrow_forward",
    });
  });
});
