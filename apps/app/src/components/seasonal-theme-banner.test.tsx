import { fireEvent, screen } from "@testing-library/react-native";

import { SeasonalThemeBanner } from "@/components/seasonal-theme-banner";
import { currentSeasonalTheme, SEASONAL_THEMES, seasonalBannerHref } from "@/lib/seasonal-themes";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/seasonal-themes", () => ({
  ...jest.requireActual("@/lib/seasonal-themes"),
  currentSeasonalTheme: jest.fn(() => null),
}));

const RAMADAN = SEASONAL_THEMES.find((season) => season.id === "ramadan")!;

const inSeason = () => jest.mocked(currentSeasonalTheme).mockReturnValue(RAMADAN);

beforeEach(resetExpoRouterMock);
afterEach(() => jest.mocked(currentSeasonalTheme).mockReturnValue(null));

describe("SeasonalThemeBanner", () => {
  it("is hidden outside any season", async () => {
    await renderWithTheme(<SeasonalThemeBanner />);

    expect(screen.toJSON()).toBeNull();
  });

  it("opens the season's destination", async () => {
    inSeason();
    await renderWithTheme(<SeasonalThemeBanner />);

    await fireEvent.press(screen.getByRole("button"));

    expect(mockRouter.push).toHaveBeenCalledWith(seasonalBannerHref(RAMADAN));
  });

  it("titles the banner for the season", async () => {
    inSeason();
    await renderWithTheme(<SeasonalThemeBanner />);

    expect(screen.getByRole("button", { name: "Ramadan Mubarak" })).toBeTruthy();
    expect(
      screen.getByText("Dates are calculated estimates — local moon-sighting may differ."),
    ).toBeTruthy();
  });
});

describe("SeasonalThemeBanner on TV", () => {
  usePlatform({ isTV: true });

  it("keeps the banner copy inside the focusable banner", async () => {
    inSeason();
    await renderWithTheme(<SeasonalThemeBanner />);

    expect(screen.getByRole("button", { name: "Ramadan Mubarak" })).toBeTruthy();
  });
});
