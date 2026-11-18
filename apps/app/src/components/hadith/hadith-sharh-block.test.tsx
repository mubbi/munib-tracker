import { fireEvent, screen } from "@testing-library/react-native";

import { HadithSharhBlock } from "@/components/hadith/hadith-sharh-block";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const SHARH = "شرح الحديث";

describe("HadithSharhBlock", () => {
  it("renders nothing for a blank sharh", async () => {
    await renderWithTheme(<HadithSharhBlock sharhArabic="   " />);
    expect(screen.queryByLabelText("Explanation")).toBeNull();
  });

  it("starts collapsed and expands with an Arabic-only note", async () => {
    await renderWithTheme(<HadithSharhBlock sharhArabic={SHARH} />);
    expect(screen.getByText("Show")).toBeTruthy();
    expect(screen.queryByText(SHARH)).toBeNull();
    await fireEvent.press(screen.getByLabelText("Explanation"));
    expect(screen.getByText(SHARH)).toBeTruthy();
    expect(screen.getByText("Explanation is available in Arabic only.")).toBeTruthy();
  });

  it("collapses again", async () => {
    await renderWithTheme(<HadithSharhBlock sharhArabic={SHARH} defaultExpanded arabicSize={20} />);
    await fireEvent.press(screen.getByLabelText("Explanation"));
    expect(screen.queryByText(SHARH)).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("makes the expanded pane focusable", async () => {
      await renderWithTheme(<HadithSharhBlock sharhArabic={SHARH} defaultExpanded />);
      expect(screen.getByText(SHARH)).toBeTruthy();
    });
  });
});
