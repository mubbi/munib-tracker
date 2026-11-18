import { screen } from "@testing-library/react-native";

import { ShareHadithContent } from "@/components/share/share-hadith-content";
import { renderWithTheme } from "@/test-support/render";

describe("ShareHadithContent", () => {
  it.each([
    [undefined, undefined],
    [30, 20],
  ])("renders the hadith (arabicSize=%s, textSize=%s)", async (arabicSize, textSize) => {
    await renderWithTheme(
      <ShareHadithContent
        arabic="إِنَّمَا الْأَعْمَالُ"
        english="Actions are by intentions"
        reference="Bukhari 1"
        arabicSize={arabicSize}
        textSize={textSize}
      />,
    );
    expect(screen.getByText("Actions are by intentions")).toBeTruthy();
    expect(screen.getByText("— Bukhari 1")).toBeTruthy();
  });
});
