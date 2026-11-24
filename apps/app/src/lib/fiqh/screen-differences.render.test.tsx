import { TRAVEL_SECTIONS } from "@munib-tracker/shared/content/travel-guide";
import type { FiqhDifferenceId } from "@munib-tracker/shared/fiqh";
import { createUmrahSession } from "@munib-tracker/shared/utils";
import { fireEvent, screen } from "@testing-library/react-native";
import type { ReactElement } from "react";

import { ExcusedGuideContent } from "@/components/excused/excused-guide-content";
import { FidyahFiqhPanel } from "@/components/fidyah/fidyah-fiqh-panel";
import { PrayerCombinePicker } from "@/components/prayer-combine-picker";
import { RamadanFiqhCard } from "@/components/ramadan/ramadan-fiqh-card";
import { QasrCalculatorCard } from "@/components/travel/qasr-calculator";
import { TravelGuideContent } from "@/components/travel/travel-guide-content";
import { UmrahStepPanel } from "@/components/umrah/umrah-step-panel";
import { WitrQazaInfo } from "@/components/witr-qaza-info";
import { ZakatCalculator } from "@/components/zakat/zakat-calculator";
import i18n from "@/i18n";
import { SCREEN_DIFFERENCES, screenDifferences } from "@/lib/fiqh/screen-differences";
import { buildZakatCalculatorState } from "@/test-support/fixtures/zakat";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

/**
 * NF-3.0a §4.1.2 coverage, render side: for each registered screen anchor whose
 * component can be rendered in isolation, every id in `SCREEN_DIFFERENCES`
 * really shows up as a `<MadhhabNote>`. Notes are stubbed to a marker and
 * collapsible sections are rendered open so the check doesn't depend on taps.
 */
jest.mock("@/components/fiqh/madhhab-note", () => {
  const { Text } = require("react-native");
  return {
    MadhhabNote: ({ id }: { id: string }) => <Text testID={`madhhab-note:${id}`}>{id}</Text>,
  };
});
jest.mock("@/components/ui/collapsible-section", () => {
  const { View } = require("react-native");
  return {
    CollapsibleSection: ({ children }: { children: ReactElement }) => <View>{children}</View>,
  };
});
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/stores/tracker-store", () =>
  require("@/test-support/mocks/tracker-store").trackerStoreExcusedMock(),
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);
jest.mock("@/components/hadith/hadith-excerpt-card", () => ({
  HadithExcerptCard: () => null,
}));
jest.mock("@/components/umrah/dua-by-ref", () => ({ DuaByRef: () => null }));

afterEach(resetPreferences);

function expectNotes(ids: readonly FiqhDifferenceId[]) {
  expect(ids.length).toBeGreaterThan(0);
  for (const id of ids)
    expect(screen.queryAllByTestId(`madhhab-note:${id}`).length).toBeGreaterThan(0);
}

describe("SCREEN_DIFFERENCES anchors render their notes", () => {
  it("/ramadan — RamadanFiqhCard", async () => {
    await renderWithTheme(<RamadanFiqhCard />);
    expectNotes(SCREEN_DIFFERENCES["/ramadan"]);
  });

  it("/fidyah — FidyahFiqhPanel", async () => {
    await renderWithTheme(<FidyahFiqhPanel scenario="fidyah" people={1} />);
    expectNotes(SCREEN_DIFFERENCES["/fidyah"]);
  });

  it("/qaza — WitrQazaInfo", async () => {
    await renderWithTheme(<WitrQazaInfo />);
    expectNotes(SCREEN_DIFFERENCES["/qaza"]);
  });

  it("/travel#calculator — QasrCalculatorCard", async () => {
    await renderWithTheme(<QasrCalculatorCard />);
    expectNotes(SCREEN_DIFFERENCES["/travel#calculator"]);
  });

  it("/travel#<section> — every travel guide section", async () => {
    await renderWithTheme(<TravelGuideContent />);
    const ids = TRAVEL_SECTIONS.flatMap((section) => screenDifferences(`/travel#${section}`));
    expectNotes(ids);
  });

  it("/hayd — ExcusedGuideContent (hayd)", async () => {
    await renderWithTheme(<ExcusedGuideContent reason="hayd" />);
    expectNotes(SCREEN_DIFFERENCES["/hayd"]);
  });

  it("/zakat and /zakat#calculator — ZakatCalculator", async () => {
    const state = buildZakatCalculatorState();
    await renderWithTheme(<ZakatCalculator {...state} />);
    expectNotes(SCREEN_DIFFERENCES["/zakat"]);
    expectNotes(SCREEN_DIFFERENCES["/zakat#calculator"]);
  });

  it("/(tabs)/tracker#combined — PrayerCombinePicker (all views)", async () => {
    await renderWithTheme(
      <PrayerCombinePicker prayerId="asr" combined={null} onChange={jest.fn()} />,
    );
    await setPreferences({ madhhab: null });
    await fireEvent.press(screen.getByText(i18n.t("tracker.combined.compareViews")));
    expectNotes(SCREEN_DIFFERENCES["/(tabs)/tracker#combined"]);
  });

  it.each(["tawaf", "halq_taqsir"] as const)("/umrah#%s — UmrahStepPanel", async (step) => {
    const session = { ...createUmrahSession("s1", "2026-11-24T08:00:00.000Z"), step };
    await renderWithTheme(<UmrahStepPanel session={session} excusedReason={null} readOnly />);
    expectNotes(SCREEN_DIFFERENCES[`/umrah#${step}`]);
  });
});
