import { describe, expect, it } from "@jest/globals";

import {
  buildScheduleTimelineSegments,
  computeScheduleFocusWindow,
  type ScheduleFocusItem,
} from "@/lib/schedule-ui";

type Item = ScheduleFocusItem & { label: string };

function item(
  id: string,
  status: ScheduleFocusItem["status"],
  active = false,
  atMs: number | null = null,
  label = id,
): Item {
  return { id, status, active, atMs, label };
}

describe("computeScheduleFocusWindow", () => {
  const day: Item[] = [
    item("tahajjud", "past", false, 100),
    item("fajr", "past", false, 200),
    item("sunrise", "past", false, 300),
    item("ishraq", "past", false, 400),
    item("duha", "past", false, 500),
    item("dhuhr", "past", false, 600),
    item("asr", "past", false, 700),
    item("maghrib", "past", false, 800),
    item("isha", "active", true, 900),
    item("witr", "active", true, 950),
    item("flex", "flexible", false, null),
  ];

  it("keeps all active entries, last past, and hides older past", () => {
    const window = computeScheduleFocusWindow(day, null);
    expect(window.focus.map((i) => i.id)).toEqual(["maghrib", "isha", "witr"]);
    expect(window.hiddenPast.map((i) => i.id)).toEqual([
      "tahajjud",
      "fajr",
      "sunrise",
      "ishraq",
      "duha",
      "dhuhr",
      "asr",
    ]);
    expect(window.hiddenFuture).toEqual([]);
    expect(window.flexible.map((i) => i.id)).toEqual(["flex"]);
  });

  it("includes next and up to two upcoming after it by time", () => {
    const morning: Item[] = [
      item("tahajjud", "past", false, 100),
      item("fajr", "past", false, 200),
      item("sunrise", "past", false, 300),
      item("ishraq", "upcoming", false, 400),
      item("duha", "upcoming", false, 500),
      item("dhuhr", "upcoming", false, 600),
      item("asr", "upcoming", false, 700),
    ];

    const window = computeScheduleFocusWindow(morning, "ishraq");
    expect(window.focus.map((i) => i.id)).toEqual(["sunrise", "ishraq", "duha", "dhuhr"]);
    expect(window.hiddenPast.map((i) => i.id)).toEqual(["tahajjud", "fajr"]);
    expect(window.hiddenFuture.map((i) => i.id)).toEqual(["asr"]);
  });

  it("shows the first few upcoming entries when everything is still ahead", () => {
    const early: Item[] = [
      item("tahajjud", "upcoming", false, 100),
      item("fajr", "upcoming", false, 200),
      item("sunrise", "upcoming", false, 300),
      item("ishraq", "upcoming", false, 400),
      item("duha", "upcoming", false, 500),
    ];

    const window = computeScheduleFocusWindow(early, "tahajjud");
    expect(window.focus.map((i) => i.id)).toEqual(["tahajjud", "fajr", "sunrise"]);
    expect(window.hiddenPast).toEqual([]);
    expect(window.hiddenFuture.map((i) => i.id)).toEqual(["ishraq", "duha"]);
  });

  it("separates flexible entries from timed focus logic", () => {
    const window = computeScheduleFocusWindow(
      [item("fajr", "upcoming", false, 200), item("tahiyyatul_masjid", "flexible", false, null)],
      "fajr",
    );
    expect(window.focus.map((i) => i.id)).toEqual(["fajr"]);
    expect(window.flexible.map((i) => i.id)).toEqual(["tahiyyatul_masjid"]);
  });
});

describe("buildScheduleTimelineSegments", () => {
  it("keeps evening focus items in chronological order when tahajjud is next", () => {
    const evening: Item[] = [
      item("tahajjud", "upcoming", false, 1_700),
      item("fajr", "past", false, 200),
      item("sunrise", "past", false, 300),
      item("ishraq", "past", false, 400),
      item("duha", "past", false, 500),
      item("dhuhr", "past", false, 600),
      item("asr", "past", false, 700),
      item("maghrib", "past", false, 800),
      item("isha", "active", true, 900),
      item("witr", "active", true, 950),
    ];

    const window = computeScheduleFocusWindow(evening, "tahajjud");
    const segments = buildScheduleTimelineSegments(evening, window, {
      pastExpanded: false,
      futureExpanded: false,
    });

    expect(segments.map((segment) => segment.type)).toEqual([
      "collapse-past",
      "item",
      "item",
      "item",
      "item",
    ]);
    expect(
      segments
        .filter((segment) => segment.type === "item")
        .map((segment) => (segment.type === "item" ? segment.item.id : null)),
    ).toEqual(["maghrib", "isha", "witr", "tahajjud"]);
  });

  it("expands hidden past in chronological order without duplicate sections", () => {
    const evening: Item[] = [
      item("tahajjud", "upcoming", false, 1_700),
      item("fajr", "past", false, 200),
      item("sunrise", "past", false, 300),
      item("maghrib", "past", false, 800),
      item("isha", "active", true, 900),
      item("witr", "active", true, 950),
    ];

    const window = computeScheduleFocusWindow(evening, "tahajjud");
    const segments = buildScheduleTimelineSegments(evening, window, {
      pastExpanded: true,
      futureExpanded: false,
    });

    expect(segments.map((segment) => segment.type)).toEqual([
      "collapse-past",
      "item",
      "item",
      "item",
      "item",
      "item",
      "item",
    ]);
    expect(
      segments
        .filter((segment) => segment.type === "item")
        .map((segment) => (segment.type === "item" ? segment.item.id : null)),
    ).toEqual(["fajr", "sunrise", "maghrib", "isha", "witr", "tahajjud"]);
  });
});
