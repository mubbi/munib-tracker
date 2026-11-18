import { act, renderHook } from "@testing-library/react-native";

import { refreshRegisteredAndroidWidgets } from "@/lib/appSurfaces/widgets/androidTaskHandler";
import {
  buildWidgetSnapshot,
  writeWidgetSnapshot,
} from "@/lib/appSurfaces/widgets/snapshotStorage";
import { ensureDailyHadithPool } from "@/lib/daily-hadith";
import {
  nativePublishAndroidWidgetPreviews,
  nativePushWearSnapshot,
} from "@/lib/external-commands/native-bridge";
import { syncLiveActivity } from "@/lib/live-activity";
import { syncOngoingNotification } from "@/lib/ongoing-notification";
import { buildWidgetSnapshot as buildSnapshotFixture } from "@/test-support/fixtures/widgets";
import { buildCustomTasbeeh } from "@/test-support/fixtures/zikr";
import { setPlatform } from "@/test-support/platform";

import { useWidgetSnapshotSync } from "./use-widget-snapshot-sync";

jest.mock("@/lib/appSurfaces/widgets/androidTaskHandler", () => ({
  refreshRegisteredAndroidWidgets: jest.fn(async () => undefined),
}));
jest.mock("@/lib/appSurfaces/widgets/snapshotStorage", () => ({
  buildWidgetSnapshot: jest.fn(),
  writeWidgetSnapshot: jest.fn(async () => undefined),
}));
jest.mock("@/lib/daily-hadith", () => ({ ensureDailyHadithPool: jest.fn(async () => undefined) }));
jest.mock("@/lib/external-commands/native-bridge", () => ({
  nativePublishAndroidWidgetPreviews: jest.fn(async () => undefined),
  nativePushWearSnapshot: jest.fn(async () => undefined),
}));
jest.mock("@/lib/live-activity", () => ({ syncLiveActivity: jest.fn(async () => undefined) }));
jest.mock("@/lib/ongoing-notification", () => ({
  syncOngoingNotification: jest.fn(async () => undefined),
}));
jest.mock("@/providers/theme-provider", () => ({
  useTheme: () => ({ scheme: "dark", colors: { accent: "#0a0" }, colorMode: "system" }),
}));
jest.mock("@/stores/custom-tasbeeh-store", () => ({
  useEnsureCustomTasbeehLoaded: jest.fn(),
  useTasbeehUpdatedToday: () => mockState.tasbeehToday,
}));
jest.mock("@/stores/friday-checklist-store", () => ({
  useEnsureFridayChecklistLoaded: jest.fn(),
  useFridayChecklistForDate: () => 2,
}));
jest.mock("@/stores/khatm-store", () => ({
  useEnsureKhatmLoaded: jest.fn(),
  useKhatm: () => ({ plan: null, ayahsRead: 10 }),
}));
jest.mock("@/stores/location-store", () => ({
  useLocation: () => mockState.location,
  useLocationStatus: () => mockState.locationStatus,
}));
jest.mock("@/stores/preferences-store", () => ({
  usePreferences: () => mockState.preferences,
}));
jest.mock("@/stores/tracker-store", () => ({
  useDailySummary: () => ({
    salahCompleted: 2,
    salahTotal: 5,
    streakDays: 3,
    qazaRemaining: 10,
    qazaCompletedToday: 1,
    qazaTargetToday: 2,
  }),
  useTodayPrayers: () => ({ status: { fajr: "done" } }),
}));

type Session = { status: string; dismissed?: boolean } | undefined;

let mockState: {
  location: { latitude: number; longitude: number } | null;
  locationStatus: string;
  tasbeehToday: ReturnType<typeof buildCustomTasbeeh> | null;
  preferences: {
    timeFormat: string;
    defaultCalendar: string;
    liveActivityEnabled?: boolean;
    translationLocale?: string;
    salahTrackingSession?: Session;
  };
};

const NOW = new Date("2026-11-18T12:00:00Z").getTime();
const MINUTE = 60_000;

const buildMock = buildWidgetSnapshot as jest.Mock;
const liveActivityMock = syncLiveActivity as jest.Mock;

let restorePlatform: () => void = () => {};

async function setup(enabled?: boolean) {
  return renderHook(() => useWidgetSnapshotSync(enabled));
}

async function advance(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
  await act(async () => {
    await Promise.resolve();
  });
}

/** Builds performed after letting every pending timer (2h) run. */
async function buildsAfterLongWait() {
  await advance(2 * 60 * MINUTE);
  return buildMock.mock.calls.length;
}

/** Debounce (750ms) → idle task (sync in tests) → async native writes. */
async function flushSync() {
  await act(async () => {
    jest.advanceTimersByTime(750);
  });
  await act(async () => {
    await Promise.resolve();
  });
}

function snapshotWithPrayer(targetInMin: number, currentAgoMin: number, locationDenied = false) {
  return buildSnapshotFixture({
    locationDenied,
    nextPrayer: {
      targetTimeMs: NOW + targetInMin * MINUTE,
      currentPrayerAtMs: NOW - currentAgoMin * MINUTE,
    },
  });
}

beforeEach(() => {
  jest.useFakeTimers({ now: NOW });
  jest.clearAllMocks();
  mockState = {
    location: { latitude: 31.5, longitude: 74.3 },
    locationStatus: "granted",
    tasbeehToday: null,
    preferences: { timeFormat: "24h", defaultCalendar: "gregorian" },
  };
  buildMock.mockReturnValue(snapshotWithPrayer(60, 5));
});

afterEach(() => {
  jest.useRealTimers();
  restorePlatform();
  restorePlatform = () => {};
});

describe("useWidgetSnapshotSync", () => {
  it("builds and writes the snapshot to every native surface after the debounce", async () => {
    const { unmount } = await setup();
    expect(buildMock).not.toHaveBeenCalled();
    await flushSync();
    expect(ensureDailyHadithPool).toHaveBeenCalled();
    const input = buildMock.mock.calls[0][0];
    expect(input).toEqual(
      expect.objectContaining({
        location: mockState.location,
        locationDenied: false,
        locale: "en",
        translationLocale: "en",
        calendar: "gregorian",
        timeFormat: "24h",
        theme: { isDark: true, primaryColor: "#0a0", followsSystem: true },
        salahCompleted: 2,
        khatmAyahsRead: 10,
        tasbeehToday: null,
        fridayChecklistDone: 2,
      }),
    );
    const snapshot = buildMock.mock.results[0].value;
    expect(writeWidgetSnapshot).toHaveBeenCalledWith(snapshot);
    expect(nativePushWearSnapshot).toHaveBeenCalledWith(JSON.stringify(snapshot));
    expect(refreshRegisteredAndroidWidgets).toHaveBeenCalled();
    expect(nativePublishAndroidWidgetPreviews).toHaveBeenCalledWith(JSON.stringify(snapshot));
    expect(liveActivityMock).toHaveBeenCalledWith({ snapshot, enabled: false });
    expect(syncOngoingNotification).toHaveBeenCalledWith({
      snapshot,
      enabled: false,
      session: null,
    });
    await unmount();
  });

  it("hides the location when permission is denied and passes today's tasbeeh", async () => {
    mockState.locationStatus = "denied";
    mockState.tasbeehToday = buildCustomTasbeeh({ title: "SubhanAllah", count: 5, target: 33 });
    mockState.preferences.translationLocale = "ur";
    const { unmount } = await setup();
    await flushSync();
    expect(buildMock).toHaveBeenCalledWith(
      expect.objectContaining({
        location: null,
        locationDenied: true,
        translationLocale: "ur",
        tasbeehToday: { title: "SubhanAllah", count: 5, target: 33 },
      }),
    );
    await unmount();
  });

  it("does nothing when disabled", async () => {
    const { unmount } = await setup(false);
    await flushSync();
    expect(buildMock).not.toHaveBeenCalled();
    await unmount();
  });

  it("does nothing on web", async () => {
    restorePlatform = setPlatform({ OS: "web" });
    const { unmount } = await setup();
    await flushSync();
    expect(buildMock).not.toHaveBeenCalled();
    await unmount();
  });

  it("does nothing on TV", async () => {
    restorePlatform = setPlatform({ isTV: true });
    const { unmount } = await setup();
    await flushSync();
    expect(buildMock).not.toHaveBeenCalled();
    await unmount();
  });

  it("refreshes again at the next phase boundary while a live activity runs", async () => {
    mockState.preferences.liveActivityEnabled = true;
    const { unmount } = await setup();
    await flushSync();
    expect(liveActivityMock).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: true }));
    // Synced 750ms in; the current Salah's mark window (15 min) ends 10 min after
    // start, and the refresh lands 1s past it.
    await advance(10 * MINUTE + 1_000 - 750 - 1);
    expect(buildMock).toHaveBeenCalledTimes(1);
    await advance(1);
    expect(buildMock).toHaveBeenCalledTimes(2);
    await unmount();
  });

  it("schedules a boundary refresh for an active, undismissed tracking session", async () => {
    mockState.preferences.salahTrackingSession = { status: "active", dismissed: false };
    const { unmount } = await setup();
    await flushSync();
    expect(syncOngoingNotification).toHaveBeenCalledWith(
      expect.objectContaining({ session: { status: "active", dismissed: false } }),
    );
    await unmount();
    // Unmount cancels the pending boundary refresh.
    expect(await buildsAfterLongWait()).toBe(1);
  });

  it("refreshes at the boundary for an active tracking session", async () => {
    mockState.preferences.salahTrackingSession = { status: "active" };
    const { unmount } = await setup();
    await flushSync();
    expect(await buildsAfterLongWait()).toBeGreaterThan(1);
    await unmount();
  });

  it.each<[string, Session]>([
    ["a dismissed session", { status: "active", dismissed: true }],
    ["an ended session", { status: "ended" }],
  ])("does not schedule a boundary refresh for %s", async (_label, session) => {
    mockState.preferences.salahTrackingSession = session;
    const { unmount } = await setup();
    await flushSync();
    expect(await buildsAfterLongWait()).toBe(1);
    await unmount();
  });

  it("does not schedule a boundary refresh when the location is denied", async () => {
    mockState.preferences.liveActivityEnabled = true;
    buildMock.mockReturnValue(snapshotWithPrayer(60, 5, true));
    const { unmount } = await setup();
    await flushSync();
    expect(await buildsAfterLongWait()).toBe(1);
    await unmount();
  });

  it("does not schedule a boundary refresh when every boundary has passed", async () => {
    mockState.preferences.liveActivityEnabled = true;
    buildMock.mockReturnValue(snapshotWithPrayer(-1, 120));
    const { unmount } = await setup();
    await flushSync();
    expect(await buildsAfterLongWait()).toBe(1);
    await unmount();
  });

  it("replaces a pending boundary refresh on the next sync", async () => {
    mockState.preferences.liveActivityEnabled = true;
    const { rerender, unmount } = await setup();
    await flushSync();
    mockState.preferences = { ...mockState.preferences, timeFormat: "12h" };
    await rerender({});
    await flushSync();
    expect(buildMock).toHaveBeenCalledTimes(2);
    // Only the latest boundary refresh remains.
    await advance(10 * MINUTE + 1_000);
    expect(buildMock).toHaveBeenCalledTimes(3);
    await unmount();
  });

  it("debounces rapid changes into one sync", async () => {
    const { rerender, unmount } = await setup();
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    mockState.preferences = { ...mockState.preferences, timeFormat: "12h" };
    await rerender({});
    await flushSync();
    expect(buildMock).toHaveBeenCalledTimes(1);
    expect(buildMock).toHaveBeenCalledWith(expect.objectContaining({ timeFormat: "12h" }));
    await unmount();
  });
});
