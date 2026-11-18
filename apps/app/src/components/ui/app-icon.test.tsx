import { screen } from "@testing-library/react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { NAMES_OF_ALLAH_GLYPH, NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

describe("AppIcon", () => {
  it("renders the Allah glyph scaled to the icon size", async () => {
    await renderWithTheme(<AppIcon icon={NAMES_OF_ALLAH_ICON} size={20} tintColor="#abcdef" />);

    expect(flattenStyle(screen.getByText(NAMES_OF_ALLAH_GLYPH).props.style)).toMatchObject({
      color: "#abcdef",
      fontSize: 18,
    });
  });

  it("renders a platform symbol for ordinary icons", async () => {
    await renderWithTheme(<AppIcon icon="star" tintColor="#010101" />);

    expect(screen.queryByText(NAMES_OF_ALLAH_GLYPH)).toBeNull();
    expect(
      screen.container.queryAll((node) => node.props.tintColor === "#010101"),
    ).not.toHaveLength(0);
  });
});
