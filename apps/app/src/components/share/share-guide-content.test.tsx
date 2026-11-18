import { screen } from "@testing-library/react-native";

import { ShareGuideContent } from "@/components/share/share-guide-content";
import { renderWithTheme } from "@/test-support/render";

describe("ShareGuideContent", () => {
  it("renders title, summary, excerpt and link", async () => {
    await renderWithTheme(
      <ShareGuideContent
        title="Wudu"
        summary="Ablution"
        excerpt="Wash in order"
        url="https://x/wudu"
      />,
    );
    expect(screen.getByText("Ablution")).toBeTruthy();
    expect(screen.getByText("Wash in order")).toBeTruthy();
    expect(screen.getByText("https://x/wudu")).toBeTruthy();
  });

  it("omits an empty summary and missing excerpt", async () => {
    await renderWithTheme(<ShareGuideContent title="Wudu" summary="" url="https://x/wudu" />);
    expect(screen.getByText("Wudu")).toBeTruthy();
    expect(screen.queryByText("Wash in order")).toBeNull();
  });
});
