import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { ZAKAT_GUIDE_SECTIONS } from "@munib-tracker/shared/content/zakat-guide";
import type { FontPreferences } from "@munib-tracker/shared/types";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import type { ComponentType, ReactElement } from "react";

import FidyahTopicScreen from "@/app/fidyah/[topic]";
import FinanceTopicScreen from "@/app/finance/[topic]";
import JahannamTopicScreen from "@/app/jahannam/[topic]";
import LastDayTopicScreen from "@/app/last-day/[topic]";
import ZakatTopicScreen from "@/app/zakat/[topic]";
import ZakatChecklistScreen from "@/app/zakat/checklist";
import ZakatEvidenceScreen from "@/app/zakat/evidence";
import { ContentReportContext } from "@/components/content-report/content-report-context";
import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import i18n from "@/i18n";
import { getFidyahGuideTopics } from "@/lib/fidyah-guide";
import { getIslamicFinanceTopics } from "@/lib/islamic-finance";
import { getJahannamTopics } from "@/lib/jahannam";
import { getJanazahGuideTopics, janazahGuideConfig } from "@/lib/janazah-guide";
import { getLastDayTopics } from "@/lib/last-day";
import { preferencesStore } from "@/stores/preferences-store";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/components/guide-topic-footer",
  () => require("@/test-support/mocks/guide-topic-footer").guideTopicFooterMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);
jest.mock("@/hooks/use-guide-content-report-ref", () => {
  const actual = jest.requireActual("@/hooks/use-guide-content-report-ref");
  return { ...actual, useGuideContentReportRef: jest.fn(actual.useGuideContentReportRef) };
});

const reportRefHook = jest.mocked(useGuideContentReportRef);
/** The root layout mounts the real provider; the disclaimers only need `openReport`. */
const REPORT_CONTEXT = { openReport: jest.fn() };
type ReadingOverrides = NonNullable<FontPreferences["readingOverrides"]>;

/**
 * Distinct A−/A+ deltas per surface: the bar shows "+4" only when a screen reads
 * the finance surface and "-2" when it still borrows "jannah".
 */
const BOTH_OVERRIDES: ReadingOverrides = {
  finance: { arabicDelta: 4, textDelta: 4 },
  jannah: { arabicDelta: -2, textDelta: -2 },
};

/**
 * Renders inside the real providers, waits for the preferences store to hydrate
 * (it would overwrite earlier seeding), then applies `readingOverrides`.
 */
const renderScreen = (ui: ReactElement) =>
  renderWithProviders(
    <ContentReportContext.Provider value={REPORT_CONTEXT}>{ui}</ContentReportContext.Provider>,
  );

async function renderWithOverrides(ui: ReactElement, readingOverrides: ReadingOverrides) {
  await renderScreen(ui);
  await waitFor(() => expect(preferencesStore.getState().isReady).toBe(true));
  await setPreferences({
    fontPrefs: { ...DEFAULT_USER_PREFERENCES.fontPrefs, readingOverrides },
  });
}

const firstId = (topics: Array<{ id: string }>) => {
  const [first] = topics;
  if (!first) throw new Error("empty corpus");
  return first.id;
};

beforeEach(async () => {
  resetExpoRouterMock();
  reportRefHook.mockClear();
});
afterEach(resetPreferences);

describe("finance reading surface (G-72)", () => {
  it.each<[string, ComponentType, () => string | undefined]>([
    ["/finance/[topic]", FinanceTopicScreen, () => firstId(getIslamicFinanceTopics())],
    ["/fidyah/[topic]", FidyahTopicScreen, () => firstId(getFidyahGuideTopics())],
    ["/zakat/[topic]", ZakatTopicScreen, () => ZAKAT_GUIDE_SECTIONS[0]],
    ["/zakat/checklist", ZakatChecklistScreen, () => undefined],
    ["/zakat/evidence", ZakatEvidenceScreen, () => undefined],
  ])("%s sizes text with the finance surface", async (_route, Screen, topic) => {
    const id = topic();
    if (id) setMockSearchParams({ topic: id });
    await renderWithOverrides(<Screen />, BOTH_OVERRIDES);

    expect(await screen.findByText("+4")).toBeTruthy();
    expect(screen.queryByText("-2")).toBeNull();
  });

  it("keeps the shared Learn surface as LearnGuideTopicScreen's default", async () => {
    setMockSearchParams({ topic: firstId(getJanazahGuideTopics()) });
    await renderWithOverrides(
      <LearnGuideTopicScreen config={janazahGuideConfig} />,
      BOTH_OVERRIDES,
    );

    expect(await screen.findByText("-2")).toBeTruthy();
    expect(screen.queryByText("+4")).toBeNull();
  });

  it("falls back to the global size when stored prefs have no finance entry", async () => {
    setMockSearchParams({ topic: firstId(getIslamicFinanceTopics()) });
    await renderWithOverrides(<FinanceTopicScreen />, {
      jannah: { arabicDelta: -2, textDelta: -2 },
    });

    expect(await screen.findByLabelText("Reset text size")).toBeTruthy();
    expect(screen.queryByText("-2")).toBeNull();
    expect(screen.getAllByText("Default").length).toBeGreaterThan(0);
  });
});

describe("dedicated report kinds", () => {
  it.each<[string, ComponentType, string, string]>([
    ["/jahannam/[topic]", JahannamTopicScreen, firstId(getJahannamTopics()), "jahannam"],
    ["/last-day/[topic]", LastDayTopicScreen, firstId(getLastDayTopics()), "last_day"],
  ])("%s reports with its own kind", async (_route, Screen, topicId, kind) => {
    setMockSearchParams({ topic: topicId });
    await renderScreen(<Screen />);

    expect(reportRefHook).toHaveBeenCalled();
    for (const [calledKind] of reportRefHook.mock.calls) expect(calledKind).toBe(kind);
    // The article's disclaimer link opens the report sheet with that kind.
    await fireEvent.press(await screen.findByLabelText(i18n.t("contentReport.reportIssue")));
    expect(REPORT_CONTEXT.openReport).toHaveBeenLastCalledWith(
      expect.objectContaining({ kind, contentId: topicId }),
    );
  });
});
