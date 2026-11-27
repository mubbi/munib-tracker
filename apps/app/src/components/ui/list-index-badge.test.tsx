import { screen } from "@testing-library/react-native";

import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { type ThemeTokens, useThemeTokens } from "@/hooks/use-theme-tokens";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

let seen: ThemeTokens;
function Probe() {
  seen = useThemeTokens().tokens;
  return null;
}

describe("ListIndexBadge", () => {
  it("renders the ordinal for an open item", async () => {
    const { toJSON } = await renderWithTheme(<ListIndexBadge index={4} />);
    expect(JSON.stringify(toJSON())).toContain("4");
  });

  it("renders the ordinal when today's target is already met", async () => {
    const { toJSON } = await renderWithTheme(<ListIndexBadge index={4} completed />);
    expect(JSON.stringify(toJSON())).toContain("4");
  });
});

describe("ListIndexBadge colours and size", () => {
  it("uses minHeight (no fixed height) and onSoft text when completed", async () => {
    await renderWithTheme(
      <>
        <Probe />
        <ListIndexBadge index={7} completed />
      </>,
    );
    const text = flattenStyle(screen.getByText("7", { hidden: true }).props.style);
    expect(text.color).toBe(seen.status.success.onSoft);
    const box = flattenStyle(parentOf(screen.getByText("7", { hidden: true })).props.style);
    expect(box.minHeight).toBeGreaterThan(0);
    expect(box.height).toBeUndefined();
  });
});
