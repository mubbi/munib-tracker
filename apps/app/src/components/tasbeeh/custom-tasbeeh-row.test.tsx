import { fireEvent, screen } from "@testing-library/react-native";

import { CustomTasbeehRow } from "@/components/tasbeeh/custom-tasbeeh-row";
import { TvLayout } from "@/constants/tv-layout";
import type { CustomTasbeeh } from "@/stores/custom-tasbeeh-store";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// Imported transitively (reading typography → audio provider); never played here.
jest.mock("expo-audio", () => ({ __esModule: true }));

// The first render warms the theme + i18n graph, which is slow on a busy machine.

function buildCustomTasbeeh(overrides: Partial<CustomTasbeeh> = {}): CustomTasbeeh {
  return {
    id: "c1",
    title: "Durood",
    description: "",
    target: 100,
    count: 12,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

async function renderRow(overrides: Partial<CustomTasbeeh> = {}, onPress = jest.fn()) {
  await renderWithTheme(
    <CustomTasbeehRow item={buildCustomTasbeeh(overrides)} onPress={onPress} />,
  );
  return { onPress };
}

describe("CustomTasbeehRow", () => {
  it("opens the counter on press", async () => {
    const { onPress } = await renderRow();
    await fireEvent.press(screen.getByRole("button", { name: "Durood" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each([
    { label: "a target", item: {}, summary: "Target: 100", progress: "12 / 100" },
    {
      label: "no target",
      item: { target: 0, count: 7 },
      summary: "Unlimited count",
      progress: "7",
    },
    {
      label: "a description",
      item: { description: "After salah" },
      summary: "After salah",
      progress: "12 / 100",
    },
    {
      label: "a completed target",
      item: { count: 100 },
      summary: "Target: 100",
      progress: "100 / 100",
    },
  ])("summarises a counter with $label", async ({ item, summary, progress }) => {
    await renderRow(item);
    expect(screen.getByText(summary)).toBeTruthy();
    expect(screen.getByText(progress)).toBeTruthy();
  });

  it("prefers the description over the target summary", async () => {
    await renderRow({ description: "After salah" });
    expect(screen.queryByText("Target: 100")).toBeNull();
  });

  it.each([
    { tv: false, minHeight: undefined },
    { tv: true, minHeight: TvLayout.minFocusTarget },
  ])("sizes the row for focus on TV (tv=$tv)", async ({ tv, minHeight }) => {
    const restore = setPlatform({ isTV: tv });
    try {
      await renderRow();
      expect(
        flattenStyle(screen.getByRole("button", { name: "Durood" }).props.style).minHeight,
      ).toBe(minHeight);
    } finally {
      restore();
    }
  });
});
