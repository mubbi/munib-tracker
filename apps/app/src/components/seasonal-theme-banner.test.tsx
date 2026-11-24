import { fireEvent, screen } from "@testing-library/react-native";

import { SeasonalThemeBanner } from "@/components/seasonal-theme-banner";
import {
  type ActiveSeasonalBanner,
  SEASONAL_THEMES,
  seasonalBannerHref,
  seasonalBannerKey,
} from "@/lib/seasonal-themes";
import { defined } from "@/test-support/assert";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const RAMADAN = defined(
  SEASONAL_THEMES.find((season) => season.id === "ramadan"),
  "the Ramadan theme",
);
const BANNER: ActiveSeasonalBanner = {
  season: RAMADAN,
  dismissKey: seasonalBannerKey("ramadan", 1448),
};
const ARAFAH: ActiveSeasonalBanner = {
  season: defined(
    SEASONAL_THEMES.find((season) => season.id === "arafah"),
    "the Arafah theme",
  ),
  dismissKey: seasonalBannerKey("arafah", 1448),
};

beforeEach(resetExpoRouterMock);

describe("SeasonalThemeBanner", () => {
  it("opens the season's destination", async () => {
    await renderWithTheme(<SeasonalThemeBanner banner={BANNER} />);

    await fireEvent.press(screen.getByRole("button", { name: /Ramadan Mubarak/ }));

    expect(mockRouter.push).toHaveBeenCalledWith(seasonalBannerHref(RAMADAN));
  });

  it("titles the banner, explains it and names where it leads", async () => {
    await renderWithTheme(<SeasonalThemeBanner banner={BANNER} />);

    expect(
      screen.getByRole("button", {
        name: "Ramadan Mubarak. The month of the Qur'an — fast, pray, and draw nearer to Allah.",
      }),
    ).toBeTruthy();
    expect(screen.getByText("Open Ramadan")).toBeTruthy();
    expect(
      screen.getByText("Dates are calculated estimates — local moon-sighting may differ."),
    ).toBeTruthy();
  });

  it("uses the destination's own CTA", async () => {
    await renderWithTheme(<SeasonalThemeBanner banner={ARAFAH} />);

    expect(screen.getByText("Open Dhul-Hijjah")).toBeTruthy();
  });

  it("offers a separate 'hide for this season' control", async () => {
    const onDismiss = jest.fn();
    await renderWithTheme(<SeasonalThemeBanner banner={BANNER} onDismiss={onDismiss} />);

    await fireEvent.press(screen.getByRole("button", { name: "Hide until next season" }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("has no close control without a dismiss handler", async () => {
    await renderWithTheme(<SeasonalThemeBanner banner={BANNER} />);

    expect(screen.queryByRole("button", { name: "Hide until next season" })).toBeNull();
  });
});

describe("SeasonalThemeBanner on TV", () => {
  usePlatform({ isTV: true });

  it("keeps the copy inside one focusable banner and drops the close control", async () => {
    await renderWithTheme(<SeasonalThemeBanner banner={BANNER} onDismiss={jest.fn()} />);

    expect(screen.getByRole("button", { name: /Ramadan Mubarak/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Hide until next season" })).toBeNull();
  });
});
