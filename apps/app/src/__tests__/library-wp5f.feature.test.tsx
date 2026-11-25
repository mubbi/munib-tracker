import { fireEvent, screen } from "@testing-library/react-native";

import LibraryScreen from "@/app/(tabs)/library";
import {
  groupLearnEntries,
  LEARN_SUBGROUPS,
  LIBRARY_MENU_META,
  LIBRARY_PRIMARY_IDS,
} from "@/lib/library-menu";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

describe("Library tab (P5-32)", () => {
  beforeEach(() => resetExpoRouterMock());

  it("offers Search everything for a typed query and pushes /search?q=", async () => {
    await renderWithProviders(<LibraryScreen />);
    await fireEvent.changeText(screen.getByPlaceholderText("Search library…"), "Yasin");
    const row = await screen.findByText("Search everything for “Yasin”");
    await fireEvent.press(row);
    expect(mockRouter.push).toHaveBeenCalledWith("/search?q=Yasin");
  });

  it("shows the six primary tiles and collapses Track by default", async () => {
    await renderWithProviders(<LibraryScreen />);
    expect(screen.getAllByLabelText("Hadith").length).toBeGreaterThan(0);
    expect(screen.queryByText("Qaza")).toBeNull();
    await fireEvent.press(screen.getByLabelText("Track"));
    expect(await screen.findByText("Qaza")).toBeTruthy();
  });
});

describe("Library Learn sub-groups", () => {
  const learnIds = LIBRARY_MENU_META.filter((entry) => entry.section === "learn").map((e) => e.id);

  it("claims every Learn destination exactly once", () => {
    const claimed = LEARN_SUBGROUPS.flatMap((group) => group.ids);
    expect([...claimed].sort()).toEqual([...learnIds].sort());
  });

  it("puts an unclaimed destination into a trailing group", () => {
    const groups = groupLearnEntries([{ id: "salahGuide" }, { id: "brandNew" }]);
    expect(groups.at(-1)?.entries).toEqual([{ id: "brandNew" }]);
  });

  it("keeps primary destinations in the menu", () => {
    const ids = new Set(LIBRARY_MENU_META.map((entry) => entry.id));
    for (const id of LIBRARY_PRIMARY_IDS) expect(ids.has(id)).toBe(true);
  });
});
