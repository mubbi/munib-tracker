import { screen } from "@testing-library/react-native";

import { ShareAyahContent } from "@/components/share/share-ayah-content";
import { renderWithTheme } from "@/test-support/render";

describe("ShareAyahContent", () => {
  it("renders the ayah with transliteration and reference", async () => {
    await renderWithTheme(
      <ShareAyahContent
        arabic="اللَّهُ لَا إِلَٰهَ"
        transliteration="Allahu la ilaha"
        translation="Allah — there is no deity"
        reference="Al-Baqarah 2:255"
        arabicSize={32}
        textSize={18}
      />,
    );
    expect(screen.getByText("Allahu la ilaha")).toBeTruthy();
    expect(screen.getByText("— Al-Baqarah 2:255")).toBeTruthy();
  });

  it("omits the transliteration when absent", async () => {
    await renderWithTheme(<ShareAyahContent arabic="اللَّهُ" translation="Allah" reference="2:255" />);
    expect(screen.getByText("Allah")).toBeTruthy();
    expect(screen.queryByText("Allahu la ilaha")).toBeNull();
  });
});
