import { describe, expect, it } from "@jest/globals";

import { PRAYER_SLOT_ICONS } from "@/lib/prayer-times";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import {
  buildScheduleTimelineSegments,
  computeScheduleFocusWindow,
  groupScheduleItems,
  groupScheduleItemsInOrder,
  kindBadgeKey,
  type ScheduleFocusItem,
  scheduleEntryIcon,
  scheduleEntryStatus,
  scheduleGroupFor,
  sortTimedScheduleItems,
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

describe("scheduleGroupFor", () => {
  it.each([
    ["tahajjud", "night"],
    ["duha", "morning"],
    ["asr", "day"],
    ["witr", "evening"],
    ["hajat_istikhara", "flexible"],
  ] as const)("%s → %s", (id, group) => {
    expect(scheduleGroupFor(id)).toBe(group);
  });
});

describe("scheduleEntryIcon", () => {
  it("prefers the Salah icon", () => {
    expect(scheduleEntryIcon("witr")).toBe(PRAYER_ICONS.witr);
  });

  it("uses the prayer-slot icon for markers like sunrise", () => {
    expect(scheduleEntryIcon("sunrise")).toBe(PRAYER_SLOT_ICONS.sunrise);
  });

  it("falls back to a clock", () => {
    expect(scheduleEntryIcon("unknown" as never)).toEqual({
      ios: "clock.fill",
      android: "schedule",
      web: "schedule",
    });
  });
});

describe("scheduleEntryStatus", () => {
  const now = new Date(1_000);

  it.each([
    ["an untimed optional entry", "optional", false, undefined, "flexible"],
    ["an active entry", "obligatory", true, new Date(500), "active"],
    ["an entry at now", "obligatory", false, new Date(1_000), "past"],
    ["a later entry", "obligatory", false, new Date(2_000), "upcoming"],
    ["an untimed marker", "marker", false, undefined, "upcoming"],
  ] as const)("is %s → %s", (_label, kind, active, at, expected) => {
    expect(scheduleEntryStatus(kind, active, at, now)).toBe(expected);
  });
});

describe("grouping", () => {
  const groupFor = (id: string) => scheduleGroupFor(id as never);
  const entries = [{ id: "isha" }, { id: "fajr" }, { id: "tahajjud" }, { id: "dhuhr" }];

  it("groups consecutive runs in input order", () => {
    const groups = groupScheduleItemsInOrder(entries, groupFor);
    expect(groups.map((g) => [g.group, g.items.map((i) => i.id)])).toEqual([
      ["evening", ["isha"]],
      ["night", ["fajr", "tahajjud"]],
      ["day", ["dhuhr"]],
    ]);
  });

  it("returns no groups for an empty list", () => {
    expect(groupScheduleItemsInOrder([], groupFor)).toEqual([]);
  });

  it("groups by canonical section order, skipping empty sections", () => {
    const groups = groupScheduleItems(entries, groupFor);
    expect(groups.map((g) => g.group)).toEqual(["night", "day", "evening"]);
    expect(groups[0].items).toEqual([
      { id: "fajr", group: "night" },
      { id: "tahajjud", group: "night" },
    ]);
  });
});

describe("sortTimedScheduleItems", () => {
  it("drops flexible items and sorts untimed entries last", () => {
    const sorted = sortTimedScheduleItems([
      item("c", "upcoming", false, null),
      item("b", "upcoming", false, 300),
      item("flex", "flexible", false, 1),
      item("d", "upcoming", false, null),
      item("a", "past", false, 100),
    ]);
    expect(sorted.map((i) => i.id)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("kindBadgeKey", () => {
  it.each([
    ["obligatory", "home.scheduleObligatory"],
    ["optional", "home.scheduleOptional"],
    ["marker", null],
  ] as const)("%s → %p", (kind, key) => {
    expect(kindBadgeKey(kind)).toBe(key);
  });
});

describe("computeScheduleFocusWindow options", () => {
  const items = [
    item("a", "past", false, 100),
    item("b", "upcoming", false, 200),
    item("c", "upcoming", false, 300),
    item("d", "upcoming", false, 400),
  ];

  it("can omit the last past entry and cap upcoming entries", () => {
    const window = computeScheduleFocusWindow(items, "b", {
      includeLastPast: false,
      maxUpcomingAfterNext: 1,
    });
    expect(window.focus.map((i) => i.id)).toEqual(["b", "c"]);
    expect(window.hiddenPast.map((i) => i.id)).toEqual(["a"]);
    expect(window.hiddenFuture.map((i) => i.id)).toEqual(["d"]);
  });

  it("ignores an unknown next id", () => {
    const window = computeScheduleFocusWindow(items, "missing", { maxUpcomingAfterNext: 0 });
    expect(window.focus.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("buildScheduleTimelineSegments with collapsed future", () => {
  const items = [
    item("a", "upcoming", false, 100),
    item("b", "upcoming", false, 200),
    item("c", "upcoming", false, 300),
  ];
  const window = computeScheduleFocusWindow(items, "a", { maxUpcomingAfterNext: 0 });

  it.each([
    [false, ["item:a", "collapse-future:2"]],
    [true, ["item:a", "collapse-future:2", "item:b", "item:c"]],
  ])("futureExpanded=%p", (futureExpanded, expected) => {
    const segments = buildScheduleTimelineSegments(items, window, {
      pastExpanded: false,
      futureExpanded,
    });
    expect(
      segments.map((s) => (s.type === "item" ? `item:${s.item.id}` : `${s.type}:${s.count}`)),
    ).toEqual(expected);
  });
});
