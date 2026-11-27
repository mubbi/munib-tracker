import { screen } from "@testing-library/react-native";

import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { renderWithTheme } from "@/test-support/render";

describe("MadhhabBadge", () => {
  it("shows the school name with a descriptive label", async () => {
    await renderWithTheme(<MadhhabBadge school="shafii" />);
    expect(screen.getByText("Shafi'i")).toBeTruthy();
    expect(screen.getByLabelText("Ruling shown for the Shafi'i school")).toBeTruthy();
  });

  it("shows All views when no school applies", async () => {
    await renderWithTheme(<MadhhabBadge school={null} />);
    expect(screen.getByText("All views")).toBeTruthy();
    expect(screen.getByLabelText("Showing the views of all four schools")).toBeTruthy();
  });

  it("adds a Custom chip when a scholar-given value is in effect", async () => {
    await renderWithTheme(<MadhhabBadge school="hanafi" custom />);
    expect(screen.getByText("Custom")).toBeTruthy();
    expect(
      screen.getByLabelText(
        "Ruling shown for the Hanafi school. Custom value advised by your scholar",
      ),
    ).toBeTruthy();
  });
});
