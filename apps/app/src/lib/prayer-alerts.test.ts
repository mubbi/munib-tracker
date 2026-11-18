import {
  ALERTABLE_PRAYERS,
  isPrayerAlertEnabled,
  SUNNAH_ALERTABLE_PRAYERS,
} from "@/lib/prayer-alerts";
import {
  buildNotificationPreferences,
  buildUserPreferences,
} from "@/test-support/fixtures/preferences";

describe("ALERTABLE_PRAYERS", () => {
  it("covers the fard prayers, Witr and the timed Sunnah prayers", () => {
    expect(ALERTABLE_PRAYERS).toEqual(
      expect.arrayContaining(["fajr", "isha", "witr", ...SUNNAH_ALERTABLE_PRAYERS]),
    );
    expect(ALERTABLE_PRAYERS).not.toContain("tahiyyatul_masjid");
  });
});

describe("isPrayerAlertEnabled", () => {
  const prefs = (prayer: boolean, sunnahPrayer: boolean, prayerAlerts = {}) =>
    buildUserPreferences({
      notificationPrefs: buildNotificationPreferences({ prayer, sunnahPrayer }),
      prayerAlerts,
    });

  it.each([
    ["fajr", prefs(true, false), true],
    ["fajr", prefs(false, true), false],
    ["tahajjud", prefs(false, true), true],
    ["tahajjud", prefs(true, false), false],
  ] as const)("%s follows its category toggle", (prayerId, preferences, expected) => {
    expect(isPrayerAlertEnabled(preferences, prayerId)).toBe(expected);
  });

  it.each([
    ["fajr", prefs(true, true, { fajr: false }), false],
    ["duha", prefs(false, false, { duha: true }), true],
  ] as const)("a per-prayer override wins for %s", (prayerId, preferences, expected) => {
    expect(isPrayerAlertEnabled(preferences, prayerId)).toBe(expected);
  });

  it("treats missing per-prayer overrides as unset", () => {
    expect(isPrayerAlertEnabled(prefs(true, true, undefined), "asr")).toBe(true);
  });
});
