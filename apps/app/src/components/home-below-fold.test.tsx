import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { useAcceptanceHourActive } from "@/components/acceptance-hour-goal-reminder";
import { HomeBelowFold, type HomeBelowFoldProps } from "@/components/home-below-fold";
import { PrayerScheduleCard } from "@/components/prayer-schedule-card";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { isFriday } from "@/lib/friday";
import { getRamadanInfo } from "@/lib/ramadan";
import { currentSeasonalBanner } from "@/lib/seasonal-themes";
import { isWhiteDay } from "@/lib/white-days";
import { continueStore } from "@/stores/continue-store";
import { locationStore } from "@/stores/location-store";
import { __resetSeasonalBannerStore, seasonalBannerStore } from "@/stores/seasonal-banner-store";
import { defined } from "@/test-support/assert";
import { buildContinueActivity } from "@/test-support/fixtures/continue";
import { buildKhatmPlan } from "@/test-support/fixtures/khatm";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { buildQazaCounter } from "@/test-support/fixtures/qaza";
import { seedKhatm } from "@/test-support/khatm-store";
import { lastProps } from "@/test-support/mock-calls";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("@/components/acceptance-hour-goal-reminder", () => ({
  AcceptanceHourGoalReminder: () => null,
  useAcceptanceHourActive: jest.fn(() => false),
}));
jest.mock("@/components/continue-card", () => ({
  ContinueCard: require("@/test-support/mocks/stub-component").stubComponent("continue-card"),
}));
jest.mock("@/components/default-location-banner", () => ({
  DefaultLocationBanner: require("@/test-support/mocks/stub-component").stubComponent(
    "location-banner",
  ),
}));
jest.mock("@/components/devotion-achievement-summary", () => ({
  DevotionAchievementSummary: () => null,
}));
jest.mock("@/components/excused-day-picker", () => ({ ExcusedDayPicker: () => null }));
jest.mock("@/components/friday-goal-reminder", () => ({ FridayGoalReminder: () => null }));
jest.mock("@/components/white-days-goal-reminder", () => ({ WhiteDaysGoalReminder: () => null }));
jest.mock("@/components/khatm-goal-reminder", () => ({ KhatmGoalReminder: () => null }));
jest.mock("@/components/khatm-card", () => ({
  KhatmCard: require("@/test-support/mocks/stub-component").stubComponent("khatm-card"),
}));
jest.mock("@/components/knowledge-flash-card", () => ({
  KnowledgeFlashCard: require("@/test-support/mocks/stub-component").stubComponent(
    "knowledge-card",
  ),
}));
jest.mock("@/components/pwa/ios-pwa-install-banner", () => ({ IosPwaInstallBanner: () => null }));
jest.mock("@/components/qaza-summary-card", () => ({
  QazaSummaryCard: require("@/test-support/mocks/stub-component").stubComponent("qaza-card"),
}));
jest.mock("@/components/ramadan-card", () => ({
  RamadanCard: require("@/test-support/mocks/stub-component").stubComponent("ramadan-card"),
}));
jest.mock("@/components/seasonal-theme-banner", () => ({
  SeasonalThemeBanner: require("@/test-support/mocks/stub-component").stubComponent(
    "seasonal-banner",
  ),
}));
jest.mock("@/components/prayer-schedule-card", () => ({ PrayerScheduleCard: jest.fn(() => null) }));
jest.mock("@/hooks/use-weekly-report", () => ({ useWeeklyReport: jest.fn() }));
jest.mock("@/features/reviews/hooks/useReviewRouteTrigger", () => ({
  useReviewRouteTrigger: jest.fn(),
}));
jest.mock("@/features/reviews/hooks/useReviewStreakTrigger", () => ({
  useReviewStreakTrigger: jest.fn(),
}));
jest.mock("@/stores/new-features-store", () => ({
  useEnsureNewFeaturesLoaded: jest.fn(),
  useNewFeatureIds: () => new Set(["tasbeeh"]),
}));
jest.mock("@/hooks/use-share-content-card", () => ({
  ...jest.requireActual("@/hooks/use-share-content-card"),
  useShareContentCard: jest.fn(),
}));
jest.mock("@/lib/friday", () => ({
  ...jest.requireActual("@/lib/friday"),
  isFriday: jest.fn(() => false),
}));
jest.mock("@/lib/white-days", () => ({
  ...jest.requireActual("@/lib/white-days"),
  isWhiteDay: jest.fn(() => false),
}));
jest.mock("@/lib/ramadan", () => ({
  ...jest.requireActual("@/lib/ramadan"),
  getRamadanInfo: jest.fn(() => ({ isRamadan: false })),
}));
jest.mock("@/lib/seasonal-themes", () => ({
  ...jest.requireActual("@/lib/seasonal-themes"),
  currentSeasonalBanner: jest.fn(() => null),
}));

const IN_SEASON = { season: {} as never, dismissKey: "ramadan:1448" };

const share = jest.fn(async () => {});
const initialLocation = locationStore.getState().location;

const PROPS: HomeBelowFoldProps = {
  schedule: [],
  nextIn: "in 1h",
  nextScheduleId: "asr",
  scheduleDateLabel: "Monday 6 July",
  scheduleLocationLabel: "London",
};

const summary = (overrides: Record<string, number> = {}) =>
  seedTrackerStore({
    summary: {
      date: "2026-07-06",
      salahCompleted: 0,
      salahTotal: 5,
      zikrCompleted: 0,
      zikrTotal: 3,
      qazaRemaining: 0,
      qazaTargetToday: 0,
      qazaCompletedToday: 0,
      streakDays: 0,
      ...overrides,
    },
  });

const renderFold = (props: Partial<HomeBelowFoldProps> = {}) =>
  renderWithTheme(<HomeBelowFold {...PROPS} {...props} />);
const scheduleProps = () => lastProps(PrayerScheduleCard);

beforeEach(async () => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  jest.mocked(useShareContentCard).mockReturnValue({
    share,
    isSharing: () => false,
    isGesturePending: () => false,
    SnapshotHost: null,
  } as never);
  locationStore.setState({ location: buildStoredLocation() });
  await seedKhatm({ plan: null });
  continueStore.setState({ activity: null });
  await summary();
});
afterEach(async () => {
  jest.mocked(useAcceptanceHourActive).mockReturnValue(false);
  jest.mocked(isFriday).mockReturnValue(false);
  jest.mocked(isWhiteDay).mockReturnValue(false);
  jest.mocked(getRamadanInfo).mockReturnValue({ isRamadan: false } as never);
  jest.mocked(currentSeasonalBanner).mockReturnValue(null);
  restoreTrackerStore();
  resetMockWindowSize();
  locationStore.setState({ location: initialLocation });
  await setPreferences();
});

describe("HomeBelowFold daily goal", () => {
  it("invites a fresh start when nothing is logged", async () => {
    await renderFold();

    expect(screen.getByText("Log your first act of worship to begin")).toBeTruthy();
    expect(screen.getByText("0 of 8 tasks")).toBeTruthy();
    expect(screen.getByText("Start tracking")).toBeTruthy();
  });

  it("tracks progress with a per-area breakdown", async () => {
    await summary({
      salahCompleted: 5,
      zikrCompleted: 2,
      qazaTargetToday: 2,
      qazaCompletedToday: 0,
    });
    await renderFold();

    expect(screen.getByText("Complete the daily activity checklist")).toBeTruthy();
    expect(screen.getByText("7 of 10 tasks")).toBeTruthy();
    expect(screen.getByText("70%")).toBeTruthy();
    expect(screen.getByText("5/5")).toBeTruthy();
    expect(screen.getByText("0/2")).toBeTruthy();
  });

  it("counts an active khatm plan as one task", async () => {
    await seedKhatm({ plan: buildKhatmPlan(), ayahsRead: 0 });
    await summary({ salahCompleted: 1 });
    await renderFold();

    expect(screen.getByText("1 of 9 tasks")).toBeTruthy();
    expect(screen.getAllByText("Khatm")).toHaveLength(2);
    expect(screen.getByText("khatm-card")).toBeTruthy();
  });

  it("pauses the goal on an excused day", async () => {
    await seedTrackerStore({ excusedReason: "travel" });
    await renderFold();

    expect(screen.getByText("Tracking paused for Travel — your streak is held.")).toBeTruthy();
    expect(screen.getAllByText("Paused").length).toBeGreaterThan(0);
    expect(screen.getByText("Go to Checklist")).toBeTruthy();
  });

  it.each([
    [
      "acceptance hour",
      () => jest.mocked(useAcceptanceHourActive).mockReturnValue(true),
      "Hour of dua",
    ],
    ["Friday", () => jest.mocked(isFriday).mockReturnValue(true), "Friday"],
    ["White Day", () => jest.mocked(isWhiteDay).mockReturnValue(true), "White Days"],
  ])("badges the goal on a %s", async (_case, arrange, badge) => {
    arrange();
    await renderFold();

    expect(screen.getByText(badge)).toBeTruthy();
  });

  it("opens the checklist and achievements", async () => {
    await renderFold();

    await fireEvent.press(screen.getByText("Start tracking"));
    await fireEvent.press(screen.getByLabelText(/^Devotion level/));

    expect(mockRouter.push).toHaveBeenCalledWith("/tracker");
    expect(mockRouter.push).toHaveBeenCalledWith("/achievements");
  });
});

describe("HomeBelowFold cards", () => {
  it("shows optional cards only when relevant", async () => {
    await renderFold();

    for (const label of [
      "location-banner",
      "seasonal-banner",
      "ramadan-card",
      "khatm-card",
      "continue-card",
      "qaza-card",
    ]) {
      expect(screen.queryByText(label)).toBeNull();
    }
    expect(screen.getByText("knowledge-card")).toBeTruthy();
  });

  it("shows banners and progress cards when they apply", async () => {
    locationStore.setState({ location: buildStoredLocation({ source: "default" }) });
    jest.mocked(currentSeasonalBanner).mockReturnValue(IN_SEASON);
    jest.mocked(getRamadanInfo).mockReturnValue({ isRamadan: true } as never);
    continueStore.setState({ activity: buildContinueActivity() });
    await seedTrackerStore({ qazaCounters: [buildQazaCounter({ remaining: 4 })] });
    await renderFold();

    expect(await screen.findByText("seasonal-banner")).toBeTruthy();
    for (const label of ["location-banner", "ramadan-card", "continue-card", "qaza-card"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("hides modules the user turned off", async () => {
    continueStore.setState({ activity: buildContinueActivity() });
    await renderFold();
    // Seed after mount: the theme provider hydrates stored prefs on first render.
    jest.mocked(PrayerScheduleCard).mockClear();
    await setPreferences({
      hiddenHomeModules: ["schedule", "knowledge", "quickActions", "continue"],
    });

    expect(PrayerScheduleCard).not.toHaveBeenCalled();
    expect(screen.queryByText("knowledge-card")).toBeNull();
    expect(screen.queryByText("continue-card")).toBeNull();
    expect(screen.queryByLabelText("Customize home shortcuts")).toBeNull();
  });

  it("shares today's schedule", async () => {
    await renderFold();

    await defined(scheduleProps().onShare, "onShare")();

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        contentLabel: "Monday 6 July · London",
        shareKey: "home-today-schedule",
      }),
    );
  });

  it("shares without a location label", async () => {
    await renderFold({ scheduleLocationLabel: "" });

    await defined(scheduleProps().onShare, "onShare")();

    expect(share).toHaveBeenCalledWith(expect.objectContaining({ contentLabel: "Monday 6 July" }));
  });
});

describe("HomeBelowFold explore shortcuts", () => {
  it("collapses a long shortcut grid and expands it on demand", async () => {
    await renderFold();
    const toggle = () => screen.getByRole("button", { name: /Show more|Show less/ });

    expect(screen.queryByText(/shortcuts shown/)).toBeNull();
    await fireEvent.press(toggle());

    expect(screen.getByText(/shortcuts shown/)).toBeTruthy();
    expect(screen.getByText("Show less")).toBeTruthy();
  });

  it("opens shortcut management", async () => {
    await renderFold();

    await fireEvent.press(screen.getByLabelText("Customize home shortcuts"));

    expect(mockRouter.push).toHaveBeenCalledWith("/settings/home");
  });

  it("respects a saved shortcut order", async () => {
    await renderFold();
    await setPreferences({ quickActionOrder: ["quran", "qibla"] });

    expect(screen.getByText(/2 of \d+ shortcuts shown/)).toBeTruthy();
  });
});

describe("HomeBelowFold dashboard layout", () => {
  it.each([1300, 1700])("puts the hero beside the schedule aside at %ipx", async (width) => {
    setMockWindowSize(width);
    continueStore.setState({ activity: buildContinueActivity() });
    await renderFold({ hero: <Text>hero</Text> });

    expect(screen.getByText("hero")).toBeTruthy();
    expect(screen.getByText("continue-card")).toBeTruthy();
    expect(PrayerScheduleCard).toHaveBeenCalled();
  });

  it("shows the aside cards that apply", async () => {
    setMockWindowSize(1500);
    jest.mocked(getRamadanInfo).mockReturnValue({ isRamadan: true } as never);
    locationStore.setState({ location: buildStoredLocation({ source: "default" }) });
    jest.mocked(currentSeasonalBanner).mockReturnValue(IN_SEASON);
    await seedKhatm({ plan: buildKhatmPlan(), ayahsRead: 6236 });
    await renderFold({ hero: <Text>hero</Text> });

    expect(screen.getByText("ramadan-card")).toBeTruthy();
    expect(screen.getByText("khatm-card")).toBeTruthy();
    expect(screen.getByText("location-banner")).toBeTruthy();
  });
});

describe("HomeBelowFold seasonal banner", () => {
  beforeEach(() => {
    __resetSeasonalBannerStore();
    jest.mocked(currentSeasonalBanner).mockReturnValue(IN_SEASON);
  });

  it("stays hidden once dismissed for this season", async () => {
    await seasonalBannerStore.getState().dismiss(IN_SEASON.dismissKey);
    await renderFold();

    expect(screen.queryByText("seasonal-banner")).toBeNull();
  });

  it("stays hidden when turned off in Customize home", async () => {
    await setPreferences({ hiddenHomeModules: ["seasonal-banner"] });
    await renderFold();

    expect(screen.queryByText("seasonal-banner")).toBeNull();
  });
});

describe("HomeBelowFold on TV", () => {
  usePlatform({ isTV: true });

  it("leads with Continue, skips the knowledge card and sharing", async () => {
    continueStore.setState({ activity: buildContinueActivity() });
    await renderFold();

    expect(screen.getByText("continue-card")).toBeTruthy();
    expect(screen.queryByText("knowledge-card")).toBeNull();
    expect(scheduleProps().onShare).toBeUndefined();
  });
});
