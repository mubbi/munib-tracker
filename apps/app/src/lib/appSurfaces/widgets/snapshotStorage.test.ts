import AsyncStorage from "@react-native-async-storage/async-storage";

import { WIDGET_SNAPSHOT_KEY } from "@/lib/appSurfaces/config";
import {
  emptyWidgetSnapshot,
  readWidgetSnapshot,
  writeWidgetSnapshot,
} from "@/lib/appSurfaces/widgets/snapshotStorage";
import { setPlatform } from "@/test-support/platform";

const getItem = AsyncStorage.getItem as jest.Mock;

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("readWidgetSnapshot", () => {
  it("returns the empty snapshot when nothing is stored", async () => {
    expect(await readWidgetSnapshot()).toEqual(emptyWidgetSnapshot());
  });

  it.each([
    ["an unknown version", JSON.stringify({ version: 2, nextPrayer: { prayerName: "Asr" } })],
    ["corrupt JSON", "{not json"],
  ])("returns the empty snapshot for %s", async (_label, raw) => {
    await AsyncStorage.setItem(WIDGET_SNAPSHOT_KEY, raw);
    expect(await readWidgetSnapshot()).toEqual(emptyWidgetSnapshot());
  });

  it("returns the empty snapshot when storage fails", async () => {
    getItem.mockRejectedValueOnce(new Error("io"));
    expect(await readWidgetSnapshot()).toEqual(emptyWidgetSnapshot());
  });

  it("fills fields that older snapshots did not write", async () => {
    await AsyncStorage.setItem(
      WIDGET_SNAPSHOT_KEY,
      JSON.stringify({
        version: 1,
        theme: { primary: "#112233" },
        nextPrayer: { prayerName: "Asr" },
        schedule: { rows: [{ id: "fajr", name: "Fajr", time: "5", status: "completed" }] },
        progress: { progressLabel: "1/5" },
        streak: { streakLabel: "4" },
        qaza: { remaining: 3 },
        ramadan: { isRamadan: true },
        khatm: { hasPlan: true },
        dailyHadith: { meaning: "m" },
        hijriDate: { weekday: "Mon" },
        qibla: { bearingLabel: "N" },
      }),
    );
    const snapshot = await readWidgetSnapshot();
    const empty = emptyWidgetSnapshot();
    expect(snapshot.locale).toBe("en");
    expect(snapshot.isRtl).toBe(false);
    expect(snapshot.theme).toEqual({ ...empty.theme, primary: "#112233", followsSystem: true });
    expect(snapshot.nextPrayer).toMatchObject({
      prayerName: "Asr",
      followingName: "",
      followingTime: "",
      markLabel: empty.nextPrayer.markLabel,
      accessibilityLabel: empty.nextPrayer.accessibilityLabel,
    });
    expect(snapshot.schedule.rows[0].statusLabel).toBe("completed");
    expect(snapshot.progress.progressLabel).toBe("1/5");
    expect(snapshot.qaza.remaining).toBe(3);
    expect(snapshot.qibla.accessibilityLabel).toBe(empty.qibla.accessibilityLabel);
  });

  it("keeps fields newer snapshots wrote", async () => {
    const full = {
      ...emptyWidgetSnapshot(),
      locale: "ar",
      isRtl: true,
      theme: { ...emptyWidgetSnapshot().theme, followsSystem: false },
      nextPrayer: {
        ...emptyWidgetSnapshot().nextPrayer,
        followingName: "Maghrib",
        followingTime: "19:00",
        markLabel: "Mark",
        accessibilityLabel: "a11y",
      },
      schedule: {
        ...emptyWidgetSnapshot().schedule,
        accessibilityLabel: "sched",
        rows: [{ id: "a", name: "A", time: "1", status: "active", statusLabel: "Now" }],
      },
    };
    await AsyncStorage.setItem(WIDGET_SNAPSHOT_KEY, JSON.stringify(full));
    const snapshot = await readWidgetSnapshot();
    expect(snapshot.locale).toBe("ar");
    expect(snapshot.isRtl).toBe(true);
    expect(snapshot.theme.followsSystem).toBe(false);
    expect(snapshot.nextPrayer.followingName).toBe("Maghrib");
    expect(snapshot.nextPrayer.accessibilityLabel).toBe("a11y");
    expect(snapshot.schedule.rows[0].statusLabel).toBe("Now");
    expect(snapshot.schedule.accessibilityLabel).toBe("sched");
  });
});

describe("writeWidgetSnapshot", () => {
  it("persists the snapshot JSON and survives missing iOS extension modules", async () => {
    const snapshot = emptyWidgetSnapshot();
    await writeWidgetSnapshot(snapshot);
    expect(JSON.parse((await AsyncStorage.getItem(WIDGET_SNAPSHOT_KEY)) as string)).toEqual(
      snapshot,
    );
  });

  it("skips the iOS extension bridge on Android", async () => {
    const restore = setPlatform({ OS: "android" });
    try {
      await writeWidgetSnapshot(emptyWidgetSnapshot());
      expect(await AsyncStorage.getItem(WIDGET_SNAPSHOT_KEY)).toEqual(expect.any(String));
    } finally {
      restore();
    }
  });
});
