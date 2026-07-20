import { Platform } from "react-native";

import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { DEFAULT_LOCATION } from "@/lib/location";

jest.mock("@/lib/external-commands/native-bridge", () => ({
  nativeUpdateOngoingNotification: jest.fn().mockResolvedValue(undefined),
  nativeCancelOngoingNotification: jest.fn().mockResolvedValue(undefined),
}));

import {
  nativeCancelOngoingNotification,
  nativeUpdateOngoingNotification,
} from "@/lib/external-commands/native-bridge";
import { syncOngoingNotification } from "@/lib/ongoing-notification";

const t = (_key: string, fallback: string) => fallback;

function makeSnapshot() {
  return buildWidgetSnapshot({
    location: DEFAULT_LOCATION,
    locationDenied: false,
    locale: "en",
    translationLocale: "en",
    calendar: "hijri",
    timeFormat: "24",
    theme: { isDark: false, primaryColor: "#059669", followsSystem: true },
    salahCompleted: 3,
    salahTotal: 5,
    prayerStatus: { fajr: "completed", dhuhr: "completed", asr: "completed" },
    streakDays: 0,
    qazaRemaining: 0,
    qazaCompletedToday: 0,
    qazaTargetToday: 0,
    khatmPlan: null,
    khatmAyahsRead: 0,
    tasbeehToday: null,
    fridayChecklistDone: {},
    now: new Date("2026-07-06T09:00:00.000Z"),
    t,
  });
}

describe("syncOngoingNotification", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
    jest.clearAllMocks();
  });

  it("no-ops off Android", async () => {
    Platform.OS = "ios";
    await syncOngoingNotification({ snapshot: makeSnapshot(), enabled: true });

    expect(nativeUpdateOngoingNotification).not.toHaveBeenCalled();
    expect(nativeCancelOngoingNotification).not.toHaveBeenCalled();
  });

  it("posts the ongoing notification with the next-prayer state when enabled on Android", async () => {
    Platform.OS = "android";
    const snapshot = makeSnapshot();
    await syncOngoingNotification({ snapshot, enabled: true });

    expect(nativeUpdateOngoingNotification).toHaveBeenCalledTimes(1);
    expect(nativeCancelOngoingNotification).not.toHaveBeenCalled();
    const payload = JSON.parse(
      (nativeUpdateOngoingNotification as jest.Mock).mock.calls[0][0] as string,
    );
    expect(payload.prayerId).toBe(snapshot.nextPrayer.prayerId);
    expect(payload.prayerName).toBe(snapshot.nextPrayer.prayerName);
    expect(payload.prepareLabel).toBeTruthy();
    expect(payload.prepareDeepLink).toContain("before_prayer");
    expect(payload.markLabel).toBeUndefined();
  });

  it("cancels the ongoing notification on Android when the preference is off", async () => {
    Platform.OS = "android";
    await syncOngoingNotification({ snapshot: makeSnapshot(), enabled: false });

    expect(nativeCancelOngoingNotification).toHaveBeenCalledTimes(1);
    expect(nativeUpdateOngoingNotification).not.toHaveBeenCalled();
  });
});
