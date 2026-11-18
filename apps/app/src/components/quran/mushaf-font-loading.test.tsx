import { screen } from "@testing-library/react-native";

import { MushafFontLoading } from "@/components/quran/mushaf-font-loading";
import { renderWithTheme } from "@/test-support/render";

describe("MushafFontLoading", () => {
  it("shows the loading caption", async () => {
    await renderWithTheme(<MushafFontLoading />);
    expect(screen.getByText("Loading…")).toBeTruthy();
  });
});
