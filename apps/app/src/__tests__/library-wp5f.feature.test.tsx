import { act, fireEvent, screen } from "@testing-library/react-native";

import LibraryScreen from "@/app/(tabs)/library";
import i18n from "@/i18n";
import {
  groupLearnEntries,
  LEARN_SUBGROUPS,
  LIBRARY_MENU_META,
  LIBRARY_PRIMARY_IDS,
  LIBRARY_SECTION_PREVIEW,
} from "@/lib/library-menu";
import { continueStore } from "@/stores/continue-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const labelOf = (id: string) => {
  const entry = LIBRARY_MENU_META.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`unknown library id ${id}`);
  return i18n.t(entry.labelKey);
};

const trackIds = LIBRARY_MENU_META.filter((entry) => entry.section === "track").map((e) => e.id);

describe("Library tab (P5-32)", () => {
  beforeEach(() => resetExpoRouterMock());

  it("offers Search everything first, then flat matches, and pushes /search?q=", async () => {
    await renderWithProviders(<LibraryScreen />);
    await fireEvent.changeText(screen.getByPlaceholderText("Search library…"), "Yasin");
    const row = await screen.findByText("Search everything for “Yasin”");
    // Flat results: no section cards (and no primary tiles) while searching.
    expect(screen.queryByRole("header", { name: "Track" })).toBeNull();
    await fireEvent.press(row);
    expect(mockRouter.push).toHaveBeenCalledWith("/search?q=Yasin");
  });

  it("labels flat search matches with their section", async () => {
    await renderWithProviders(<LibraryScreen />);
    await fireEvent.changeText(screen.getByPlaceholderText("Search library…"), labelOf("qaza"));
    expect(await screen.findByLabelText(new RegExp(`^${labelOf("qaza")}, Track`))).toBeTruthy();
  });

  it("shows the six primary tiles and previews every section with See all", async () => {
    await renderWithProviders(<LibraryScreen />);
    for (const id of LIBRARY_PRIMARY_IDS) {
      expect(screen.getAllByLabelText(labelOf(id)).length).toBeGreaterThan(0);
    }
    // Track is not collapsed any more: its first rows are visible at once.
    expect(screen.getByText(labelOf(trackIds[0] as string))).toBeTruthy();
    const hidden = labelOf(trackIds[LIBRARY_SECTION_PREVIEW] as string);
    expect(screen.queryByText(hidden)).toBeNull();

    await fireEvent.press(screen.getByLabelText(`See all ${trackIds.length} in Track`));
    expect(await screen.findByText(hidden)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Show fewer in Track"));
    expect(screen.queryByText(hidden)).toBeNull();
  });

  it("switches Learn sub-groups with chips", async () => {
    await renderWithProviders(<LibraryScreen />);
    const worshipFirst = labelOf(LEARN_SUBGROUPS[0]?.ids[0] as string);
    const historyGroup = LEARN_SUBGROUPS.find((group) => group.id === "history");
    const historyFirst = labelOf(historyGroup?.ids[0] as string);
    expect(screen.getByText(worshipFirst)).toBeTruthy();
    expect(screen.queryByText(historyFirst)).toBeNull();

    const chip = screen.getByRole("radio", { name: "History & people" });
    await fireEvent.press(chip);
    expect(await screen.findByText(historyFirst)).toBeTruthy();
    expect(screen.queryByText(worshipFirst)).toBeNull();
  });

  it("shows a slim Continue row only when there is something to continue", async () => {
    await act(async () => {
      continueStore.setState({ activity: null } as never);
    });
    await renderWithProviders(<LibraryScreen />);
    expect(screen.queryByLabelText("Dismiss and clear continue history")).toBeNull();

    await act(async () => {
      continueStore.setState({
        activity: {
          kind: "quran",
          href: "/quran/36",
          title: "Ya-Sin",
          updatedAt: new Date().toISOString(),
        },
      } as never);
    });
    expect(screen.getByText("Ya-Sin")).toBeTruthy();
    expect(screen.getByLabelText(/^Continue where you left off\. Ya-Sin/)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Dismiss and clear continue history"));
    expect(screen.queryByText("Ya-Sin")).toBeNull();
  });
});

describe("Library tab on TV", () => {
  usePlatform({ isTV: true });
  beforeEach(() => resetExpoRouterMock());

  it("focuses the first primary tile and lists every row (no See all)", async () => {
    await renderWithProviders(<LibraryScreen />);
    const first = screen.getByRole("button", { name: labelOf(LIBRARY_PRIMARY_IDS[0]) });
    expect(first.props.hasTVPreferredFocus).toBe(true);
    expect(screen.queryByLabelText(/^See all \d+ in /)).toBeNull();
    expect(screen.getByText(labelOf(trackIds[trackIds.length - 1] as string))).toBeTruthy();
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
