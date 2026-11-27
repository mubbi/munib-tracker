import { RAWATIB_PRAYERS } from "@munib-tracker/shared/constants";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { PrayerRepository, QazaRepository } from "@/db";
import { resetTrackerStore } from "@/test-support/store";

import { trackerStore } from "./tracker-store";

beforeEach(resetTrackerStore);

describe("trackerStore rawatib (NF-3.1)", () => {
  it("logs a rawatib row with rakahs / late and clears it back to pending", async () => {
    await trackerStore.getState().setRawatib("dhuhr_before", true, { rakahs: 2, late: false });
    const date = getLocalDateString();
    expect(await PrayerRepository.getLog("dhuhr_before", date)).toMatchObject({
      status: "completed",
      rakahs: 2,
      late: false,
    });
    expect(trackerStore.getState().prayerStatus.dhuhr_before).toBe("completed");
    expect(trackerStore.getState().prayerRakahs.dhuhr_before).toBe(2);

    await trackerStore.getState().setRawatib("dhuhr_before", false);
    expect(await PrayerRepository.getLog("dhuhr_before", date)).toMatchObject({
      status: "pending",
      rakahs: 2,
    });
  });

  it("never changes qaza debt, the streak, fard totals or achievements", async () => {
    const before = trackerStore.getState();
    for (const id of RAWATIB_PRAYERS) await trackerStore.getState().setRawatib(id, true);
    for (const id of RAWATIB_PRAYERS) await trackerStore.getState().setRawatib(id, false);
    for (const id of RAWATIB_PRAYERS) await trackerStore.getState().setRawatib(id, true);
    const after = trackerStore.getState();
    expect(after.streakDays).toBe(before.streakDays);
    expect(after.summary.salahCompleted).toBe(0);
    expect(after.achievementStats.prayersCompleted).toBe(0);
    expect(after.achievementStats.perfectDays).toBe(0);
    const counters = await QazaRepository.getCounters();
    expect(counters.every((counter) => counter.remaining === 0)).toBe(true);
  });

  it("keeps rakahs when a fard-style status write or flag touches the same log", async () => {
    const date = getLocalDateString();
    await trackerStore.getState().setRawatib("isha_before", true, { rakahs: 4 });
    await PrayerRepository.setNotes("isha_before", date, "note");
    expect((await PrayerRepository.getLog("isha_before", date))?.rakahs).toBe(4);
  });
});
