import { buildReminder } from "@/test-support/fixtures/notifications";

import { setWebAdhanPlaybackHandler, tryPlayWebAdhanForReminder } from "./web-adhan-playback";
import {
  armWebReminderTimer,
  cancelWebReminderTimers,
  scheduleWebReminderTimers,
  setWebReminderFireHandler,
} from "./web-reminder-scheduler";

const NOW = new Date("2026-07-03T11:00:00.000Z");
const inMinutes = (minutes: number) => new Date(NOW.getTime() + minutes * 60_000);

function setup() {
  const onFire = jest.fn();
  setWebReminderFireHandler(onFire);
  return { onFire };
}

beforeEach(() => jest.useFakeTimers());

afterEach(() => {
  cancelWebReminderTimers();
  setWebReminderFireHandler(null);
  jest.useRealTimers();
});

describe("web reminder timers", () => {
  it("fires each reminder once its instant arrives", () => {
    const { onFire } = setup();
    const reminder = buildReminder({ fireAt: inMinutes(5) });
    scheduleWebReminderTimers([reminder], NOW);
    jest.advanceTimersByTime(4 * 60_000);
    expect(onFire).not.toHaveBeenCalled();
    jest.advanceTimersByTime(60_000);
    expect(onFire).toHaveBeenCalledWith(reminder);
  });

  it.each([
    ["in the past", -1],
    ["beyond the setTimeout limit", 60 * 24 * 30],
  ])("skips reminders %s", (_label, minutes) => {
    const { onFire } = setup();
    scheduleWebReminderTimers([buildReminder({ fireAt: inMinutes(minutes) })], NOW);
    jest.runOnlyPendingTimers();
    expect(onFire).not.toHaveBeenCalled();
  });

  it("does nothing without a fire handler", () => {
    armWebReminderTimer(buildReminder({ fireAt: inMinutes(1) }), NOW);
    expect(jest.getTimerCount()).toBe(0);
  });

  it("re-arming the same id replaces the earlier timer", () => {
    const { onFire } = setup();
    armWebReminderTimer(buildReminder({ fireAt: inMinutes(1) }), NOW);
    armWebReminderTimer(buildReminder({ fireAt: inMinutes(2) }), NOW);
    jest.advanceTimersByTime(60_000);
    expect(onFire).not.toHaveBeenCalled();
    jest.advanceTimersByTime(60_000);
    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it("rescheduling keeps snoozes but drops other timers", () => {
    const { onFire } = setup();
    armWebReminderTimer(buildReminder({ id: "snooze:1", fireAt: inMinutes(1) }), NOW);
    armWebReminderTimer(buildReminder({ id: "daily", fireAt: inMinutes(1) }), NOW);
    scheduleWebReminderTimers([], NOW);
    jest.advanceTimersByTime(60_000);
    expect(onFire.mock.calls.map(([r]) => r.id)).toEqual(["snooze:1"]);
  });

  it("cancel without options clears snoozes too", () => {
    const { onFire } = setup();
    armWebReminderTimer(buildReminder({ id: "snooze:1", fireAt: inMinutes(1) }), NOW);
    cancelWebReminderTimers();
    jest.advanceTimersByTime(60_000);
    expect(onFire).not.toHaveBeenCalled();
  });
});

describe("web adhan playback", () => {
  afterEach(() => setWebAdhanPlaybackHandler(null));

  it("plays the adhan for obligatory-prayer adhan reminders", () => {
    const play = jest.fn();
    setWebAdhanPlaybackHandler(play);
    tryPlayWebAdhanForReminder(buildReminder({ channelId: "prayerAdhan" }));
    expect(play).toHaveBeenCalled();
  });

  it("ignores other channels", () => {
    const play = jest.fn();
    setWebAdhanPlaybackHandler(play);
    tryPlayWebAdhanForReminder(buildReminder({ channelId: "zikr" }));
    expect(play).not.toHaveBeenCalled();
  });

  it("is safe without a handler", () => {
    expect(() =>
      tryPlayWebAdhanForReminder(buildReminder({ channelId: "prayerAdhan" })),
    ).not.toThrow();
  });
});
