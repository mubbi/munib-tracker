import type { DuaItem } from "@munib-tracker/shared/types";
import { act, fireEvent, screen, within } from "@testing-library/react-native";

import DuaCategoryScreen from "@/app/dua/[category]";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

function mockDua(id: string, title: string): DuaItem {
  return {
    id,
    categoryId: "morning_evening",
    title,
    arabic: "",
    transliteration: "",
    translation: "",
    reference: "Muslim",
  } as DuaItem;
}

const mockDuas = [
  mockDua("d-1", "Waking dua"),
  mockDua("d-2", "Evening dua"),
  mockDua("d-3", "Leaving home"),
];

jest.mock("@/lib/content-loaders", () => {
  const actual = jest.requireActual("@/lib/content-loaders");
  return {
    ...actual,
    DUA_CORPUS: { load: () => Promise.resolve(mockDuas), peek: () => mockDuas },
  };
});

beforeEach(() => {
  resetExpoRouterMock();
  setMockSearchParams({ category: "morning_evening" });
});

describe("Dua category screen (WP3 Issue B)", () => {
  it("puts the search in the scrolling list header and pins a compact search bar after scrolling", async () => {
    await renderWithProviders(<DuaCategoryScreen />);
    expect(await screen.findByText("Waking dua")).toBeTruthy();

    const list = screen.getByTestId("dua-category-list");
    expect(within(list).getByPlaceholderText("Search in this category…")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Search in this category…" })).toBeNull();

    await act(async () => {
      fireEvent(screen.getByTestId("dua-list-header"), "layout", {
        nativeEvent: { layout: { height: 120, width: 360, x: 0, y: 0 } },
      });
      fireEvent.scroll(list, {
        nativeEvent: {
          contentOffset: { x: 0, y: 300 },
          contentSize: { height: 2000, width: 360 },
          layoutMeasurement: { height: 600, width: 360 },
        },
      });
    });
    await fireEvent.press(screen.getByRole("button", { name: "Search in this category…" }));
    const fields = screen.getAllByPlaceholderText("Search in this category…");
    expect(fields).toHaveLength(2);

    await fireEvent.changeText(fields[1] as never, "waking");
    expect(await screen.findByText("Waking dua")).toBeTruthy();
    expect(screen.queryByText("Evening dua")).toBeNull();
  });
});
