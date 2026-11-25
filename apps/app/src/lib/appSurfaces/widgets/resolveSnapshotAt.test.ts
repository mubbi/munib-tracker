import {
  resolveSnapshotAt,
  widgetRefreshBoundaries,
} from "@/lib/appSurfaces/widgets/resolveSnapshotAt";
import type { WidgetScheduleRow } from "@/lib/appSurfaces/widgets/types";
import { buildWidgetSnapshot } from "@/test-support/fixtures/widgets";

const at = (hhmm: string, date = "2026-07-03") => new Date(`${date}T${hhmm}:00`);

function row(
  id: string,
  hhmm: string,
  status: WidgetScheduleRow["status"] = "pending",
  date = "2026-07-03",
): WidgetScheduleRow {
  return {
    id,
    name: id[0].toUpperCase() + id.slice(1),
    time: hhmm,
    status,
    statusLabel: status,
    atMs: at(hhmm, date).getTime(),
  };
}

const TODAY = [
  row("fajr", "04:00", "completed"),
  row("dhuhr", "13:00", "completed"),
  row("asr", "16:30", "active"),
  row("maghrib", "20:00"),
  row("isha", "21:30"),
];
const TOMORROW = [
  row("fajr", "04:01", "pending", "2026-07-04"),
  row("dhuhr", "13:00", "pending", "2026-07-04"),
  row("asr", "16:30", "pending", "2026-07-04"),
  row("maghrib", "20:00", "pending", "2026-07-04"),
  row("isha", "21:30", "pending", "2026-07-04"),
];

/** Snapshot written at 15:00 (Asr next). */
function snapshot() {
  return buildWidgetSnapshot({
    date: "2026-07-03",
    nextPrayer: {
      prayerId: "asr",
      prayerName: "Asr",
      prayerTime: "16:30",
      targetTimeMs: at("16:30").getTime(),
      minutesUntil: 90,
      countdownLabel: "in 1h 30m",
      displayDate: "Fri 3 Jul",
    },
    schedule: {
      rows: TODAY,
      tomorrowDate: "2026-07-04",
      tomorrowRows: TOMORROW,
    },
    progress: { completed: 2, total: 5, progressLabel: "2/5", resetDetail: "0 of 5 today" },
    hijriDate: {
      hijriDate: "17 Muharram",
      tomorrow: {
        summary: "18 Muharram",
        lockScreenLine: "18 Muharram",
        lockScreenDetail: "4 July",
        accessibilityLabel: "Saturday",
        hijriDate: "18 Muharram",
        gregorianDate: "4 July",
        weekday: "Saturday",
      },
    },
  });
}

const t = (_key: string, fallback: string, options?: Record<string, unknown>) =>
  fallback.replace(/\{\{(\w+)\}\}/g, (_, name) => String(options?.[name] ?? ""));

describe("resolveSnapshotAt", () => {
  it("only moves the countdown while the synced next Salah is still ahead", () => {
    const resolved = resolveSnapshotAt(snapshot(), at("16:00"), { t });
    expect(resolved.nextPrayer.prayerId).toBe("asr");
    expect(resolved.nextPrayer.minutesUntil).toBe(30);
    expect(resolved.nextPrayer.countdownLabel).toBe("in 30m");
  });

  it("moves to the following Salah once the Adhan has passed", () => {
    const resolved = resolveSnapshotAt(snapshot(), at("16:31"), { t });
    expect(resolved.nextPrayer.prayerId).toBe("maghrib");
    expect(resolved.nextPrayer.targetTimeMs).toBe(at("20:00").getTime());
    expect(resolved.nextPrayer.followingName).toBe("Isha");
    expect(resolved.nextPrayer.currentPrayerId).toBe("asr");
    expect(resolved.schedule.rows.find((r) => r.id === "maghrib")?.status).toBe("active");
    expect(resolved.schedule.rows.find((r) => r.id === "asr")?.status).toBe("pending");
  });

  it("points at tomorrow's Fajr after Isha", () => {
    const resolved = resolveSnapshotAt(snapshot(), at("22:00"), { t });
    expect(resolved.nextPrayer.prayerId).toBe("fajr");
    expect(resolved.nextPrayer.targetTimeMs).toBe(TOMORROW[0].atMs);
  });

  it("never marks today's unmarked Fajr as next when tomorrow's Fajr is next", () => {
    const base = snapshot();
    const unprayedFajr = {
      ...base,
      schedule: {
        ...base.schedule,
        rows: base.schedule.rows.map((r) =>
          r.id === "fajr" ? { ...r, status: "pending" as const } : r,
        ),
      },
    };
    const resolved = resolveSnapshotAt(unprayedFajr, at("22:00"), { t });
    expect(resolved.schedule.rows.find((r) => r.id === "fajr")?.status).toBe("pending");
    expect(resolved.schedule.rows.some((r) => r.status === "active")).toBe(false);
  });

  it("clears the running Salah on a days-old snapshot so no Mark is offered", () => {
    const resolved = resolveSnapshotAt(snapshot(), at("17:00", "2026-07-06"));
    expect(resolved.nextPrayer.currentPrayerId).toBe("");
  });

  it("rolls over to tomorrow's times and a fresh 0/5 after midnight", () => {
    const resolved = resolveSnapshotAt(snapshot(), at("00:30", "2026-07-04"));
    expect(resolved.schedule.rows.map((r) => r.atMs)).toEqual(TOMORROW.map((r) => r.atMs));
    expect(resolved.schedule.rows.every((r) => r.status !== "completed")).toBe(true);
    expect(resolved.progress.progressLabel).toBe("0/5");
    expect(resolved.progress.lockScreenDetail).toBe("0 of 5 today");
    expect(resolved.hijriDate.hijriDate).toBe("18 Muharram");
    expect(resolved.nextPrayer.prayerId).toBe("fajr");
  });

  it("leaves a snapshot two or more days old alone", () => {
    const stale = snapshot();
    const resolved = resolveSnapshotAt(stale, at("12:00", "2026-07-06"));
    expect(resolved.schedule.rows).toBe(stale.schedule.rows);
  });

  it("shows queued marks as done straight away", () => {
    const named = resolveSnapshotAt(snapshot(), at("17:00"), {
      pending: [{ type: "mark-prayer", prayerId: "asr", date: "2026-07-03" }],
      t,
    });
    expect(named.schedule.rows.find((r) => r.id === "asr")?.status).toBe("completed");
    expect(named.progress.progressLabel).toBe("3/5");

    const current = resolveSnapshotAt(snapshot(), at("17:00"), {
      pending: [{ type: "mark-current-obligatory" }],
    });
    expect(current.schedule.rows.find((r) => r.id === "asr")?.status).toBe("completed");
    // The next Salah is never marked by "mark current".
    expect(current.schedule.rows.find((r) => r.id === "maghrib")?.status).toBe("active");
  });

  it("ignores a named mark for another day", () => {
    const resolved = resolveSnapshotAt(snapshot(), at("17:00"), {
      pending: [{ type: "mark-prayer", prayerId: "asr", date: "2026-07-02" }],
    });
    expect(resolved.progress.progressLabel).toBe("2/5");
  });
});

describe("widgetRefreshBoundaries", () => {
  it("lists upcoming Adhan instants and midnight, soonest first", () => {
    const boundaries = widgetRefreshBoundaries(snapshot(), at("19:00"), 4);
    expect(boundaries).toEqual([
      at("20:00").getTime(),
      at("21:30").getTime(),
      new Date("2026-07-04T00:00:30").getTime(),
      TOMORROW[0].atMs,
    ]);
  });
});
