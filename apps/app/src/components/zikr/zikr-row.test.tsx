import { fireEvent, screen } from "@testing-library/react-native";

import { ZikrRow } from "@/components/zikr/zikr-row";
import { buildZikrItem } from "@/test-support/fixtures/zikr";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof ZikrRow>[0];

async function renderRow(overrides: Partial<Props> = {}) {
  const onPress = jest.fn();
  await renderWithTheme(<ZikrRow item={buildZikrItem()} onPress={onPress} {...overrides} />);
  return onPress;
}

describe("ZikrRow", () => {
  it("includes remaining recitations in the accessibility label and opens the zikr", async () => {
    const onPress = await renderRow({ index: 1, progressLabel: "1/3" });
    await fireEvent.press(screen.getByLabelText("1. Bismillah, 1/3"));
    expect(onPress).toHaveBeenCalledWith("morning-bismillah");
    expect(screen.getByText("1/3")).toBeTruthy();
  });

  it("announces Done when today's target is met", async () => {
    await renderRow({ index: 2, completed: true });
    expect(screen.getByLabelText("2. Bismillah, Done")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("shows the target count and category without progress", async () => {
    await renderRow({ categoryLabel: "Morning" });
    expect(screen.getByLabelText("Bismillah, Repeat ×3")).toBeTruthy();
    expect(screen.getByText("×3")).toBeTruthy();
    expect(screen.getByText("Morning")).toBeTruthy();
  });

  it("treats a missing target as a single recitation", async () => {
    await renderRow({ item: buildZikrItem({ targetCount: 0, transliteration: "" }) });
    expect(screen.queryByText("×3")).toBeNull();
    expect(screen.getByText("Once")).toBeTruthy();
  });

  it.each([
    [false, "Favorite"],
    [true, "Remove favorite"],
  ])("toggles favorite (isFavorite=%s)", async (isFavorite, label) => {
    const onToggleFavorite = jest.fn();
    await renderRow({ isFavorite, onToggleFavorite });
    await fireEvent.press(screen.getByLabelText(label));
    expect(onToggleFavorite).toHaveBeenCalledWith("morning-bismillah");
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("puts the favorite beside the row", async () => {
      const onToggleFavorite = jest.fn();
      await renderRow({ onToggleFavorite, preferredFocus: true });
      await fireEvent.press(screen.getByLabelText("Favorite"));
      expect(onToggleFavorite).toHaveBeenCalled();
    });
  });
});
