import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof MushafPageFrame>[0];

async function renderFrame(overrides: Partial<Props> = {}) {
  await renderWithTheme(
    <MushafPageFrame {...overrides}>
      <Text>leaf content</Text>
    </MushafPageFrame>,
  );
}

describe("MushafPageFrame", () => {
  it("frames its children", async () => {
    await renderFrame();
    expect(screen.getByText("leaf content")).toBeTruthy();
  });

  it("renders an overlay above the content", async () => {
    await renderFrame({ overlay: <Text>overlay</Text>, fill: true });
    expect(screen.getByText("overlay")).toBeTruthy();
  });

  it.each([
    [42, true],
    [undefined, false],
  ])("shows the page medallion for page %p: %p", async (page, shown) => {
    await renderFrame({ page });
    expect(screen.queryByText("42") !== null).toBe(shown);
  });
});
