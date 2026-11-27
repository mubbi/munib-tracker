import { screen } from "@testing-library/react-native";

import { Divider } from "@/components/ui/divider";
import { BorderWidth } from "@/constants/theme";
import { type ThemeTokens, useThemeTokens } from "@/hooks/use-theme-tokens";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

let seen: ThemeTokens;
function Probe() {
  seen = useThemeTokens().tokens;
  return null;
}

describe("Divider", () => {
  it("renders tokens.hairline at BorderWidth.hairline with an optional inset", async () => {
    await renderWithTheme(
      <>
        <Probe />
        <Divider inset={20} />
      </>,
    );
    const json = screen.toJSON();
    const node = (Array.isArray(json) ? json[json.length - 1] : json) as {
      props: { style: never };
    };
    const style = flattenStyle(node.props.style);
    expect(style.backgroundColor).toBe(seen.hairline);
    expect(style.height).toBe(BorderWidth.hairline);
    expect(style.marginStart).toBe(20);
  });
});
