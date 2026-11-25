import { screen } from "@testing-library/react-native";
import { useColorScheme } from "react-native";

import { Pill } from "@/components/ui/pill";
import { type ThemeTokens, useThemeTokens } from "@/hooks/use-theme-tokens";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

let seen: ThemeTokens;
function Probe() {
  seen = useThemeTokens().tokens;
  return null;
}

type Props = Parameters<typeof Pill>[0];

const renderPill = (props: Partial<Props> = {}) => renderWithTheme(<Pill label="Tag" {...props} />);

const labelColor = () => flattenStyle(screen.getByText("Tag").props.style).color;

// These expectations are for the dark scheme. Fresh installs follow the OS
// (D-UX2), so pin the OS to dark for this file.
const originalColorScheme = jest.mocked(useColorScheme).getMockImplementation();
beforeEach(() => jest.mocked(useColorScheme).mockImplementation(() => "dark"));
afterEach(() => jest.mocked(useColorScheme).mockImplementation(originalColorScheme));

describe("Pill", () => {
  it("renders the label with an icon on the default soft tint", async () => {
    await renderPill({ icon: "star", compact: true });

    expect(labelColor()).toEqual(expect.any(String));
  });

  it.each([
    ["solid", "#000000", "#123456", true],
    ["opaque 8-digit", "#ff0000ee", "#123456", true],
    ["translucent 8-digit", "#ff000033", "#222222", false],
  ])("on a %s background keeps the caller colour: %s", async (_kind, background, color, kept) => {
    await renderPill({ background, color });

    expect(labelColor() === color).toBe(kept);
  });
});

describe("Pill tone", () => {
  it("warning tone uses status.warning.onSoft for the label", async () => {
    await renderWithTheme(
      <>
        <Probe />
        <Pill label="Tag" tone="warning" />
      </>,
    );
    expect(labelColor()).toBe(seen.status.warning.onSoft);
  });
});
