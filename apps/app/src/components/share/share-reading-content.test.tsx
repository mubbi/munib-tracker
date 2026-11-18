import { screen } from "@testing-library/react-native";

import { ShareReadingContent } from "@/components/share/share-reading-content";
import { renderWithTheme } from "@/test-support/render";

describe("ShareReadingContent", () => {
  it("renders title, text and reference", async () => {
    await renderWithTheme(
      <ShareReadingContent
        item={{
          title: "Dua before sleep",
          arabic: "بِاسْمِكَ",
          transliteration: "Bismika",
          translation: "In Your name",
          reference: "Bukhari 6324",
        }}
        arabicSize={30}
        textSize={18}
      />,
    );
    expect(screen.getByText("Dua before sleep")).toBeTruthy();
    expect(screen.getByText("Bismika")).toBeTruthy();
    expect(screen.getByText("— Bukhari 6324")).toBeTruthy();
  });

  it("omits optional fields", async () => {
    await renderWithTheme(
      <ShareReadingContent item={{ arabic: "بِاسْمِكَ", translation: "In Your name" }} />,
    );
    expect(screen.getByText("In Your name")).toBeTruthy();
    expect(screen.queryByText(/^— /)).toBeNull();
  });
});
