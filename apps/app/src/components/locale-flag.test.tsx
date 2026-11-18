import { render, screen } from "@testing-library/react-native";

import { LOCALE_FLAG_DISPLAY, LocaleFlag } from "@/components/locale-flag";
import { usePlatform } from "@/test-support/platform";
import { parentOf, queryHostsByType } from "@/test-support/queries";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof LocaleFlag>[0];

const renderFlag = (props: Partial<Props> = {}) => render(<LocaleFlag locale="ar" {...props} />);

const box = () =>
  parentOf(screen.getByText(LOCALE_FLAG_DISPLAY.ar.flag, { includeHiddenElements: true }));

describe("LocaleFlag on native", () => {
  it("renders the regional-indicator emoji at the medium size", async () => {
    await renderFlag();

    expect(flattenStyle(box().props.style)).toMatchObject({
      width: 36,
      backgroundColor: "transparent",
    });
  });

  it("uses the small size and resting colours", async () => {
    await renderFlag({ size: "sm", backgroundColor: "#111111", borderColor: "#222222" });

    expect(flattenStyle(box().props.style)).toMatchObject({
      width: 28,
      backgroundColor: "#111111",
      borderColor: "#222222",
    });
  });

  it.each([
    [{ activeBackgroundColor: "#333333", activeRingColor: "#444444" }, "#333333", "#444444"],
    [{}, "transparent", "transparent"],
  ])("highlights the active locale (%o)", async (colors, backgroundColor, borderColor) => {
    await renderFlag({ active: true, ...colors });

    expect(flattenStyle(box().props.style)).toMatchObject({ backgroundColor, borderColor });
  });
});

describe("LocaleFlag on web", () => {
  usePlatform({ OS: "web" });

  it("renders the SVG flag image instead of an emoji", async () => {
    await renderFlag();

    expect(
      screen.queryByText(LOCALE_FLAG_DISPLAY.ar.flag, { includeHiddenElements: true }),
    ).toBeNull();
    expect(
      queryHostsByType("ViewManagerAdapter_ExpoImage").length +
        queryHostsByType("ExpoImage").length,
    ).toBeGreaterThan(0);
  });
});
