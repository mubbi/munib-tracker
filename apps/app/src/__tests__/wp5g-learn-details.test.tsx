import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { fireEvent, screen } from "@testing-library/react-native";

import ProphetsTreeScreen from "@/app/prophets/tree";
import SahabaProfileScreen from "@/app/sahaba/[id]";
import SeerahScreen from "@/app/seerah/index";
import i18n from "@/i18n";
import { TEXT_SIZE_BOUNDS } from "@/lib/reading-typography";
import { ensureSahabaContent, getSahabaProfile } from "@/lib/sahaba";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithProviders } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);

beforeEach(resetExpoRouterMock);

describe.each([
  ["phone", "ios"],
  ["web", "web"],
] as const)("Prophets tree on %s", (_label, os) => {
  usePlatform({ OS: os, isTV: false });

  it("offers a list of people as well as the map (G-33)", async () => {
    await renderWithProviders(<ProphetsTreeScreen />);
    expect(screen.queryByTestId("genealogy-node-list")).toBeNull();

    await fireEvent.press(screen.getByRole("radio", { name: i18n.t("prophets.tree.viewList") }));

    const list = screen.getByTestId("genealogy-node-list");
    expect(list).toBeTruthy();
    expect(screen.getAllByLabelText(/^Ibrahim, /).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/^Nuh, /).length).toBeGreaterThan(0);
  });

  it("shows one no-matches state for a search with no hits (G-34)", async () => {
    await renderWithProviders(<ProphetsTreeScreen />);
    await fireEvent.changeText(
      screen.getByPlaceholderText(i18n.t("prophets.tree.searchPlaceholder")),
      "zzzzqqq",
    );

    expect(screen.getByText(i18n.t("search.noResultsTitle"))).toBeTruthy();
    expect(screen.queryByText(i18n.t("prophets.tree.searchResults", { count: 0 }))).toBeNull();
    // The empty state's action (the field's own clear button has the same name).
    const clear = screen.getAllByRole("button", { name: i18n.t("common.clearSearch") }).at(-1);
    if (!clear) throw new Error("no clear-search action");
    await fireEvent.press(clear);
    expect(screen.queryByText(i18n.t("search.noResultsTitle"))).toBeNull();
  });
});

describe("Sahaba profile prose (G-52)", () => {
  afterEach(resetPreferences);

  it("scales the biography line height with the reading size", async () => {
    await ensureSahabaContent();
    const profile = getSahabaProfile("abu-bakr");
    if (!profile) throw new Error("abu-bakr profile missing");
    const [firstParagraph] = profile.body.split("\n\n");
    if (!firstParagraph) throw new Error("abu-bakr profile has no body");

    setMockSearchParams({ id: "abu-bakr" });
    await renderWithProviders(<SahabaProfileScreen />);
    await screen.findByText(firstParagraph);
    // After mount: the app providers hydrate preferences on mount.
    await setPreferences({
      fontPrefs: {
        ...DEFAULT_USER_PREFERENCES.fontPrefs,
        translation: {
          ...DEFAULT_USER_PREFERENCES.fontPrefs.translation,
          size: TEXT_SIZE_BOUNDS.max,
        },
      },
    });

    const style = flattenStyle((await screen.findByText(firstParagraph)).props.style);
    expect(style.fontSize).toBe(TEXT_SIZE_BOUNDS.max);
    expect(style.lineHeight).toBe(Math.round(TEXT_SIZE_BOUNDS.max * 1.5));
    expect(style.lineHeight as number).toBeGreaterThan(22);
  });
});

describe("Seerah (C-37)", () => {
  it("uses the shared timeline and places the quiz after the content", async () => {
    await renderWithProviders(<SeerahScreen />);

    const quiz = await screen.findByRole("button", {
      name: new RegExp(i18n.t("common.learnQuiz.title")),
    });
    const tree = JSON.stringify(screen.toJSON());
    const quizAt = tree.indexOf(i18n.t("common.learnQuiz.title"));
    const firstBadgeAt = tree.indexOf(" CE");
    expect(quiz).toBeTruthy();
    expect(firstBadgeAt).toBeGreaterThan(-1);
    expect(quizAt).toBeGreaterThan(firstBadgeAt);
    // Seerah events have no per-event page: none of them is pressable.
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByText(i18n.t("seerah.disclaimer"))).toBeTruthy();
  });
});
