import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, screen } from "@testing-library/react-native";

import AqeedahGlossaryScreen from "@/app/aqeedah/glossary";
import BattlesGlossaryScreen from "@/app/battles/glossary";
import JahannamHadithScreen from "@/app/jahannam/hadith";
import JahannamVersesScreen from "@/app/jahannam/verses";
import JannahGatesScreen from "@/app/jannah/gates";
import JannahVersesScreen from "@/app/jannah/verses";
import LastDayHadithScreen from "@/app/last-day/hadith";
import LastDayPreparationScreen from "@/app/last-day/preparation";
import LastDayVersesScreen from "@/app/last-day/verses";
import i18n from "@/i18n";
import { getAqeedahGlossary } from "@/lib/aqeedah";
import { getJahannamHadith, getJahannamVerses } from "@/lib/jahannam";
import { getJannahGates, getJannahVerses } from "@/lib/jannah";
import { getLastDayHadith, getLastDayVerses } from "@/lib/last-day";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);

beforeEach(resetExpoRouterMock);

const quotes = () => screen.queryAllByTestId("learn-hadith-quote");

describe("one hadith quote block (G-30, G-49)", () => {
  it("Jannah gates render every hadith through the shared quote", async () => {
    await renderWithProviders(<JannahGatesScreen />);
    const expected = getJannahGates().reduce((n, gate) => n + gate.hadith.length, 0);
    expect(expected).toBeGreaterThan(0);
    expect(quotes()).toHaveLength(expected);
  });

  it("Jahannam hadith list renders every entry through the shared quote", async () => {
    await renderWithProviders(<JahannamHadithScreen />);
    expect(quotes()).toHaveLength(getJahannamHadith().length);
  });

  it("Last Day hadith has no card-in-card or repeated Hadith header", async () => {
    await renderWithProviders(<LastDayHadithScreen />);
    expect(quotes()).toHaveLength(getLastDayHadith().length);
    expect(screen.queryAllByText(i18n.t("jannah.hadithTitle")).length).toBeLessThanOrEqual(1);
  });
});

describe("journey rows are shared (G-45)", () => {
  const source = (route: string) =>
    readFileSync(join(__dirname, "..", "app", route, "journey.tsx"), "utf8");

  it("Jannah and Jahannam journeys import the same row components", () => {
    const shared = 'from "@/components/learn-mizan/journey-rows"';
    expect(source("jannah")).toContain(shared);
    expect(source("jahannam")).toContain(shared);
    expect(source("jannah")).not.toMatch(/<PressableScale/);
    expect(source("jahannam")).not.toMatch(/<PressableScale/);
  });
});

describe("verse rows (G-28, G-39, G-48)", () => {
  it.each([
    ["jannah", JannahVersesScreen, () => getJannahVerses()],
    ["jahannam", JahannamVersesScreen, () => getJahannamVerses()],
    ["last-day", LastDayVersesScreen, () => getLastDayVerses()],
  ] as const)(
    "%s: the row's spoken name is never the English source excerpt",
    async (_name, Screen, verses) => {
      await renderWithProviders(<Screen />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
      const excerpts = verses()
        .map((verse) => verse.excerpt)
        .filter(Boolean);
      for (const link of links) {
        const label = String(link.props.accessibilityLabel ?? "");
        for (const excerpt of excerpts) expect(label).not.toContain(excerpt);
      }
    },
  );
});

describe("Last Day preparation (G-50)", () => {
  it("separates tracker links from in-place intentions", async () => {
    await renderWithProviders(<LastDayPreparationScreen />);
    expect(screen.getByText(i18n.t("lastDay.preparationIntentionsTitle"))).toBeTruthy();
    const checks = screen.getAllByRole("checkbox");
    expect(checks).toHaveLength(2);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });
});

describe("glossaries (G-44)", () => {
  it.each([
    ["aqeedah", AqeedahGlossaryScreen],
    ["battles", BattlesGlossaryScreen],
  ] as const)("%s shows No matches for a nonsense query", async (_name, Screen) => {
    await renderWithProviders(<Screen />);
    const field = screen.getByPlaceholderText(i18n.t("learnKit.glossarySearchPlaceholder"));
    await fireEvent.changeText(field, "zzqxjvwk");
    expect(screen.getByText(i18n.t("search.noResultsTitle"))).toBeTruthy();
    // The field's own clear button shares the label; press the empty state's action.
    const clearButtons = screen.getAllByRole("button", {
      name: i18n.t("learnKit.glossaryClearSearch"),
    });
    const emptyStateClear = clearButtons[clearButtons.length - 1];
    if (!emptyStateClear) throw new Error("no clear-search action");
    await fireEvent.press(emptyStateClear);
    expect(screen.queryByText(i18n.t("search.noResultsTitle"))).toBeNull();
  });

  it("lists Aqeedah terms alphabetically", async () => {
    await renderWithProviders(<AqeedahGlossaryScreen />);
    const terms = getAqeedahGlossary().map((term) => term.term);
    const sorted = [...terms].sort((a, b) =>
      a.localeCompare(b, i18n.language, { sensitivity: "base" }),
    );
    const rendered = screen
      .getAllByText(
        new RegExp(`^(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$`),
      )
      .map((node) => node.props.children as string);
    // A term can repeat as another entry's transliteration line — compare first appearances.
    expect([...new Set(rendered)]).toEqual(sorted);
  });
});
