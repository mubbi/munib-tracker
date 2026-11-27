import { resolveTheme } from "@munib-tracker/theme/resolve";
import type { AccentColorId } from "@munib-tracker/theme/types";
import { fireEvent, screen } from "@testing-library/react-native";

import { SuspenseFallback } from "@/components/navigation/route-suspense-fallback";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
} from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByType } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

let mockScheme: "light" | "dark" = "light";
let mockAccent: { accentColorId: AccentColorId; customAccent: string | null } = {
  accentColorId: "forest",
  customAccent: null,
};

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/resolved-theme-scheme", () => ({
  ...jest.requireActual("@/lib/resolved-theme-scheme"),
  useResolvedThemeScheme: () => mockScheme,
}));
jest.mock("@/lib/boot/resolved-accent", () => ({
  ...jest.requireActual("@/lib/boot/resolved-accent"),
  useResolvedAccent: () => mockAccent,
}));

/** The loading spinner's tint (the single host ActivityIndicator). */
function spinnerColor() {
  const [spinner] = queryHostsByType("ActivityIndicator");
  return spinner?.props.color;
}

async function renderFallback(route: string) {
  await renderWithTheme(<SuspenseFallback route={route} params={{}} />);
}

describe("SuspenseFallback", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    mockRouterCanDismiss.mockReturnValue(true);
    mockScheme = "light";
    mockAccent = { accentColorId: "forest", customAccent: null };
  });

  it.each(["light", "dark"] as const)(
    "wears the persisted rose accent in %s mode",
    async (scheme) => {
      mockScheme = scheme;
      mockAccent = { accentColorId: "rose", customAccent: null };
      await renderFallback("./quran/[surah].tsx");
      expect(spinnerColor()).toBe(resolveTheme(scheme, scheme, "rose").accent);
    },
  );

  it("applies a persisted custom accent", async () => {
    mockAccent = { accentColorId: "forest", customAccent: "#3366cc" };
    await renderFallback("./(tabs)/library.tsx");
    const color = spinnerColor();
    expect(color).not.toBe(resolveTheme("light", "light", "forest").accent);
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("announces the loading route", async () => {
    await renderFallback("./quran/[surah].tsx");
    expect(screen.getByLabelText("Preparing…")).toBeTruthy();
    expect(screen.getByText("Preparing…")).toBeTruthy();
  });

  it("offers a back button on nested routes", async () => {
    mockScheme = "dark";
    await renderFallback("./quran/[surah].tsx");
    await fireEvent.press(screen.getByLabelText("Go back"));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it.each([
    "./(tabs)/library.tsx",
    "(auth)/login",
    "(onboarding)/intro",
    "oauth/callback",
    "+not-found",
    "_sitemap",
  ])("omits back on %s", async (route) => {
    await renderFallback(route);
    expect(screen.queryByLabelText("Go back")).toBeNull();
  });

  it("omits back when nothing can be dismissed", async () => {
    mockRouterCanDismiss.mockReturnValue(false);
    await renderFallback("./quran/[surah].tsx");
    expect(screen.queryByLabelText("Go back")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("leaves back to the remote", async () => {
      await renderFallback("./quran/[surah].tsx");
      expect(screen.queryByLabelText("Go back")).toBeNull();
    });
  });
});
