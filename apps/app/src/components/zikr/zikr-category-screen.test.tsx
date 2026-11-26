import type { ZikrItem } from "@munib-tracker/shared/types";
import { act, fireEvent, screen, within } from "@testing-library/react-native";

import ZikrCategoryScreen from "@/app/zikr/[category]";
import { loadZikrItemsSyncForTests } from "@/lib/search-corpora-test-loader";
import { __setZikrItemsForTests } from "@/lib/zikr";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

function item(overrides: Partial<ZikrItem> & Pick<ZikrItem, "id">): ZikrItem {
  return {
    categoryId: "morning",
    title: overrides.id,
    arabic: "",
    transliteration: "",
    translation: "",
    reference: "Muslim",
    targetCount: 1,
    ...overrides,
  };
}

const ITEMS: ZikrItem[] = [
  item({ id: "m-1", title: "Morning one", audioUri: "https://example.test/m1.mp3" }),
  item({ id: "m-2", title: "Morning two" }),
  item({ id: "m-3", title: "Morning three", targetCount: 3 }),
];

afterAll(() => __setZikrItemsForTests(loadZikrItemsSyncForTests()));

beforeEach(async () => {
  __setZikrItemsForTests(ITEMS);
  resetExpoRouterMock();
  await resetTrackerStore();
  setMockSearchParams({ category: "morning" });
});

describe("Zikr category screen (WP3 Issue B)", () => {
  it("scrolls the session card and search away with the list (list header, no boxed Card)", async () => {
    await renderWithProviders(<ZikrCategoryScreen />);
    expect(await screen.findByText("Morning one")).toBeTruthy();

    const list = screen.getByTestId("zikr-category-list");
    // The chrome is the list's own header — it scrolls away with the rows.
    expect(within(list).getByTestId("zikr-list-header")).toBeTruthy();

    // Search and the session card's Start live inside the scrolling list.
    expect(within(list).getByPlaceholderText("Search in this category…")).toBeTruthy();
    expect(within(list).getByRole("button", { name: "Start" })).toBeTruthy();
  });

  it("keeps the search field mounted while typing", async () => {
    await renderWithProviders(<ZikrCategoryScreen />);
    const field = await screen.findByPlaceholderText("Search in this category…");
    await fireEvent.changeText(field, "tw");
    expect(screen.getByPlaceholderText("Search in this category…")).toBe(field);
    expect(await screen.findByText("Morning two")).toBeTruthy();
    expect(screen.queryByText("Morning three")).toBeNull();
  });

  it("pins a compact bar with Start and an expanding search once the header scrolls away", async () => {
    await renderWithProviders(<ZikrCategoryScreen />);
    expect(await screen.findByText("Morning one")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Search in this category…" })).toBeNull();

    const list = screen.getByTestId("zikr-category-list");
    // Measure the header, then scroll past it.
    await act(async () => {
      fireEvent(screen.getByTestId("zikr-list-header"), "layout", {
        nativeEvent: { layout: { height: 200, width: 360, x: 0, y: 0 } },
      });
      fireEvent.scroll(list, {
        nativeEvent: {
          contentOffset: { x: 0, y: 400 },
          contentSize: { height: 2000, width: 360 },
          layoutMeasurement: { height: 600, width: 360 },
        },
      });
    });

    await fireEvent.press(screen.getAllByRole("button", { name: "Start" }).at(-1) as never);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/zikr/session/[category]",
      params: { category: "morning", start: "m-1" },
    });

    await fireEvent.press(screen.getByRole("button", { name: "Search in this category…" }));
    expect(screen.getAllByPlaceholderText("Search in this category…")).toHaveLength(2);
  });

  it("offers Play only on rows whose zikr has audio", async () => {
    await renderWithProviders(<ZikrCategoryScreen />);
    expect(await screen.findByText("Morning one")).toBeTruthy();
    expect(screen.getByLabelText("Play recitation: Morning one")).toBeTruthy();
    expect(screen.queryByLabelText("Play recitation: Morning two")).toBeNull();
  });
});
