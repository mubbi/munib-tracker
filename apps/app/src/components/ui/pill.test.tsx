import { screen } from "@testing-library/react-native";

import { Pill } from "@/components/ui/pill";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof Pill>[0];

const renderPill = (props: Partial<Props> = {}) => renderWithTheme(<Pill label="Tag" {...props} />);

const labelColor = () => flattenStyle(screen.getByText("Tag").props.style).color;

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
