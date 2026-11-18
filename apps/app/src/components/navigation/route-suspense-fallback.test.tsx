import { fireEvent, screen } from "@testing-library/react-native";

import { SuspenseFallback } from "@/components/navigation/route-suspense-fallback";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
} from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockScheme: "light" | "dark" = "light";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/resolved-theme-scheme", () => ({
  ...jest.requireActual("@/lib/resolved-theme-scheme"),
  useResolvedThemeScheme: () => mockScheme,
}));

async function renderFallback(route: string) {
  await renderWithTheme(<SuspenseFallback route={route} params={{}} />);
}

describe("SuspenseFallback", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    mockRouterCanDismiss.mockReturnValue(true);
    mockScheme = "light";
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
