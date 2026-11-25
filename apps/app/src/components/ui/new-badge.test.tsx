import { screen } from "@testing-library/react-native";

import { NewBadge } from "@/components/ui/new-badge";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

describe("NewBadge", () => {
  it("is a Pill preset with an AA label at 12pt or larger", async () => {
    await renderWithTheme(<NewBadge />);
    const label = screen.getByText(/new/i);
    expect(flattenStyle(label.props.style).fontSize ?? 12).toBeGreaterThanOrEqual(11);
  });
});
