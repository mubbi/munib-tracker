import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WidgetRepresentation } from "react-native-android-widget";
import { buildWidgetTree } from "react-native-android-widget/src/api/build-widget-tree";

import { WIDGET_SNAPSHOT_KEY } from "@/lib/appSurfaces/config";
import { APP_WIDGET_REGISTRY, getAppWidgetByName } from "@/lib/appSurfaces/widgets/registry";
import {
  renderAdhkarWidget,
  renderDailyHadithWidget,
  renderHijriDateWidget,
  renderIslamicEventsWidget,
  renderJumuahWidget,
  renderKhatmProgressWidget,
  renderNextPrayerWidget,
  renderPrayerProgressWidget,
  renderPrayerScheduleWidget,
  renderQazaDebtWidget,
  renderQiblaBearingWidget,
  renderRamadanWidget,
  renderSalahStreakWidget,
  renderTasbeehGlanceWidget,
} from "@/lib/appSurfaces/widgets/renderers/allWidgets";
import { emptyWidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import { buildWidgetInfo, buildWidgetSnapshot } from "@/test-support/fixtures/widgets";

const INLINE = buildWidgetInfo({ width: 300, height: 50 });
const STRIP = buildWidgetInfo({ width: 300, height: 90 });
const SMALL = buildWidgetInfo({ width: 250, height: 120 });
const MEDIUM = buildWidgetInfo({ width: 300, height: 160 });
const LARGE = buildWidgetInfo({ width: 300, height: 220 });

async function seed(overrides: Parameters<typeof buildWidgetSnapshot>[0] = {}) {
  await AsyncStorage.setItem(WIDGET_SNAPSHOT_KEY, JSON.stringify(buildWidgetSnapshot(overrides)));
}

function tree(rep: WidgetRepresentation, slot: "light" | "dark" = "light"): string {
  const element =
    "light" in rep ? (rep as { light: React.ReactElement; dark: React.ReactElement })[slot] : rep;
  return JSON.stringify(buildWidgetTree(element as never));
}

const MIN = 60_000;
const ago = (minutes: number) => Date.now() - minutes * MIN;

/** Today's rows: Fajr/Dhuhr prayed, Asr's time running and unmarked, Maghrib/Isha ahead. */
function liveRows() {
  return [
    {
      id: "fajr",
      name: "Fajr",
      time: "05:00",
      status: "completed",
      statusLabel: "Done",
      atMs: ago(600),
    },
    {
      id: "dhuhr",
      name: "Dhuhr",
      time: "13:00",
      status: "completed",
      statusLabel: "Done",
      atMs: ago(300),
    },
    {
      id: "asr",
      name: "Asr",
      time: "16:00",
      status: "pending",
      statusLabel: "Later",
      atMs: ago(10),
    },
    {
      id: "maghrib",
      name: "Maghrib",
      time: "19:00",
      status: "active",
      statusLabel: "Next",
      atMs: ago(-120),
    },
    {
      id: "isha",
      name: "Isha",
      time: "20:30",
      status: "pending",
      statusLabel: "Later",
      atMs: ago(-240),
    },
  ] as const;
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("compact lock-screen surfaces", () => {
  it("renders an inline single line for very short slots", async () => {
    await seed({
      streak: { lockScreenLine: "7 days", lockScreenDetail: "keep going", title: "Streak" },
    });
    const json = tree(await renderSalahStreakWidget(INLINE));
    expect(json).toContain("7 days");
    expect(json).not.toContain("keep going");
  });

  it("renders a two-line strip for taller compact slots", async () => {
    await seed({ streak: { lockScreenLine: "7 days", lockScreenDetail: "keep going" } });
    const json = tree(await renderSalahStreakWidget(STRIP));
    expect(json).toContain("7 days");
    expect(json).toContain("keep going");
  });
});

describe("renderNextPrayerWidget", () => {
  const nextPrayer = {
    prayerName: "Asr",
    prayerTime: "15:30",
    countdownLabel: "in 1h",
    displayDate: "Fri 1 May",
    followingName: "Maghrib",
    followingTime: "18:40",
    location: "London",
    markLabel: "Mark Asr",
    // Still ahead, so the resolver keeps the synced next Salah.
    targetTimeMs: Date.now() + 3_600_000,
  };

  it("shows the following Salah, location and mark control on medium cells", async () => {
    await seed({ nextPrayer, schedule: { rows: [...liveRows()] } });
    const json = tree(await renderNextPrayerWidget(MEDIUM));
    expect(json).toContain("Asr");
    expect(json).toContain("Maghrib · 18:40");
    expect(json).toContain("London");
    expect(json).toContain("Mark Asr · Asr");
    expect(json).toContain("MARK_CURRENT");
    expect(json).toContain("Fri 1 May");
  });

  it("hides Mark once the running Salah is already prayed", async () => {
    const rows = liveRows().map((row) =>
      row.id === "asr" ? { ...row, status: "completed" as const } : row,
    );
    await seed({ nextPrayer, schedule: { rows } });
    expect(tree(await renderNextPrayerWidget(MEDIUM))).not.toContain("MARK_CURRENT");
  });

  it("hides chrome, following Salah and location on small cells", async () => {
    await seed({ nextPrayer });
    const json = tree(await renderNextPrayerWidget(SMALL));
    expect(json).toContain("15:30");
    expect(json).not.toContain("Maghrib");
    expect(json).not.toContain("London");
    expect(json).not.toContain("Mark Asr");
    expect(json).not.toContain("Fri 1 May");
  });

  it("drops the mark control when location is denied and skips empty optional rows", async () => {
    await seed({
      nextPrayer: { ...nextPrayer, followingName: "", location: "" },
      locationDenied: true,
    });
    const json = tree(await renderNextPrayerWidget(LARGE));
    expect(json).not.toContain("Mark Asr");
    expect(json).not.toContain("London");
  });
});

describe("renderPrayerScheduleWidget", () => {
  const rows = liveRows();

  it("marks the Salah whose time is running (not the next one) and shows updated-ago", async () => {
    await seed({
      schedule: { rows: [...rows], summary: "2/5", markLabel: "Mark" },
      updatedAt: new Date().toISOString(),
    });
    const json = tree(await renderPrayerScheduleWidget(LARGE));
    // Statuses are re-derived for "now": Maghrib is next, Asr stays unmarked.
    expect(json).toContain("Isha · Pending");
    expect(json).toContain("Maghrib · Next");
    expect(json).toContain("MARK_PRAYER");
    expect(json).toContain('"prayerId":"asr"');
    expect(json).not.toContain('"prayerId":"maghrib"');
    expect(json).toMatch(/Updated/i);
  });

  it("omits updated-ago when the snapshot timestamp is in the future", async () => {
    await seed({
      schedule: { rows: [], summary: "S" },
      updatedAt: new Date(Date.now() + 3_600_000).toISOString(),
    });
    expect(tree(await renderPrayerScheduleWidget(LARGE))).not.toMatch(/Updated/i);
  });

  it("caps small cells at the compact row budget without the mark control", async () => {
    await seed({ schedule: { rows: [...rows], markLabel: "Mark" } });
    const json = tree(await renderPrayerScheduleWidget(SMALL));
    expect(json).toContain("Asr · Pending");
    // Row budget: only 3 visible rows (the card's TalkBack label still lists all five).
    expect(json).not.toContain("Maghrib · ");
    expect(json).not.toContain("MARK_PRAYER");
  });

  it("falls back to the summary when there are no rows and hides mark without an active row", async () => {
    await seed({
      schedule: { rows: [], summary: "Open the app", markLabel: "Mark" },
      updatedAt: new Date(0).toISOString(),
    });
    const json = tree(await renderPrayerScheduleWidget(MEDIUM));
    expect(json).toContain("Open the app");
    expect(json).not.toContain("MARK_PRAYER");
  });
});

describe("progress, streak and qaza widgets", () => {
  it("marks in the background (no app launch) on medium cells only", async () => {
    await seed({
      progress: {
        progressLabel: "2/5",
        completed: 2,
        total: 5,
        progressPercent: 40,
        markLabel: "Mark now",
      },
      schedule: { rows: [...liveRows()] },
    });
    const medium = tree(await renderPrayerProgressWidget(MEDIUM));
    expect(medium).toContain("2/5");
    expect(medium).toContain("Mark now · Asr");
    expect(medium).toContain("MARK_CURRENT");
    expect(medium).not.toContain("mark-current");
    const small = tree(await renderPrayerProgressWidget(SMALL));
    expect(small).toContain("2/5");
    expect(small).not.toContain("Mark now");
  });

  it("renders the streak label and summary", async () => {
    await seed({
      streak: { streakLabel: "12", summary: "days in a row", lockScreenDetail: "best 20" },
    });
    const medium = tree(await renderSalahStreakWidget(MEDIUM));
    expect(medium).toContain("days in a row");
    expect(medium).toContain("best 20");
    expect(tree(await renderSalahStreakWidget(SMALL))).not.toContain("best 20");
  });

  it("shows the qaza progress bar only when there is a daily target", async () => {
    await seed({
      qaza: { remaining: 42, remainingLabel: "Left", todayTarget: 2, todayLabel: "1/2 today" },
    });
    const withTarget = tree(await renderQazaDebtWidget(MEDIUM));
    expect(withTarget).toContain("42");
    expect(withTarget).toContain("1/2 today");
    await seed({ qaza: { remaining: 42, remainingLabel: "Left", todayTarget: 0 } });
    const without = tree(await renderQazaDebtWidget(SMALL));
    expect(without).toContain("42");
    expect(without.length).toBeLessThan(withTarget.length);
  });
});

describe("ramadan, khatm, hadith, hijri, qibla", () => {
  it("renders ramadan stat pills", async () => {
    await seed({
      ramadan: {
        suhoorTime: "04:10",
        iftarTime: "19:55",
        countdownLabel: "Iftar in 2h",
        dayLabel: "Day 5",
      },
    });
    const json = tree(await renderRamadanWidget(MEDIUM));
    expect(json).toContain("04:10");
    expect(json).toContain("19:55");
    expect(json).toContain("Day 5");
    expect(tree(await renderRamadanWidget(SMALL))).not.toContain("Day 5");
  });

  it("renders khatm progress with and without a plan", async () => {
    await seed({
      khatm: { hasPlan: true, progressLabel: "40%", progressPercent: 40, paceLabel: "On pace" },
    });
    const plan = tree(await renderKhatmProgressWidget(MEDIUM));
    expect(plan).toContain("40%");
    expect(plan).toContain("On pace");
    await seed({ khatm: { hasPlan: false, progressLabel: "40%" } });
    const none = tree(await renderKhatmProgressWidget(SMALL));
    expect(none).toContain("—");
    expect(none).not.toContain("40%");
  });

  it("renders hadith arabic on bigger cells and aligns meaning by direction", async () => {
    await seed({
      dailyHadith: {
        arabic: "إنما الأعمال",
        meaning: "Actions are by intentions",
        reference: "Bukhari 1",
      },
      isRtl: true,
    });
    const large = tree(await renderDailyHadithWidget(LARGE));
    expect(large).toContain("إنما الأعمال");
    expect(large).toContain("Bukhari 1");
    expect(large).toMatch(/"text":"Actions are by intentions"[^}]*"textAlign":"right"/);
    const medium = tree(await renderDailyHadithWidget(MEDIUM));
    expect(medium).toContain("إنما الأعمال");
    await seed({ dailyHadith: { arabic: "إنما الأعمال", meaning: "Actions" }, isRtl: false });
    const small = tree(await renderDailyHadithWidget(SMALL));
    expect(small).not.toContain("إنما الأعمال");
    expect(small).toMatch(/"text":"Actions"[^}]*"textAlign":"left"[^}]*"maxLines":2/);
  });

  it("renders hijri and gregorian dates", async () => {
    await seed({
      hijriDate: {
        hijriDate: "1 Ramadan 1447",
        gregorianDate: "18 Feb 2026",
        weekday: "Wednesday",
      },
    });
    const json = tree(await renderHijriDateWidget(MEDIUM));
    expect(json).toContain("1 Ramadan 1447");
    expect(json).toContain("Wednesday");
    expect(tree(await renderHijriDateWidget(SMALL))).not.toContain("Wednesday");
  });

  it("renders the qibla bearing", async () => {
    await seed({
      qibla: { bearingLabel: "118° SE", location: "London", lockScreenDetail: "from north" },
    });
    const json = tree(await renderQiblaBearingWidget(MEDIUM));
    expect(json).toContain("118° SE");
    expect(json).toContain("London");
    expect(tree(await renderQiblaBearingWidget(SMALL))).not.toContain("London");
  });
});

describe("tasbeeh and jumuah", () => {
  it("shows tasbeeh count + progress when active, placeholder otherwise", async () => {
    await seed({
      tasbeeh: {
        hasActivity: true,
        target: 33,
        countLabel: "21/33",
        dhikrTitle: "SubhanAllah",
        progressPercent: 63,
      },
    });
    const active = tree(await renderTasbeehGlanceWidget(MEDIUM));
    expect(active).toContain("21/33");
    expect(active).toContain("SubhanAllah");
    await seed({ tasbeeh: { hasActivity: false, summary: "No count today", countLabel: "21/33" } });
    const idle = tree(await renderTasbeehGlanceWidget(SMALL));
    expect(idle).toContain("—");
    expect(idle).toContain("No count today");
    expect(idle).not.toContain("21/33");
  });

  it("shows completion on Friday and days-until otherwise", async () => {
    await seed({
      friday: {
        isFriday: true,
        completed: 2,
        total: 4,
        progressPercent: 50,
        summary: "Sunnahs",
        lockScreenDetail: "Jumu'ah today",
      },
    });
    const friday = tree(await renderJumuahWidget(MEDIUM));
    expect(friday).toContain("2/4");
    expect(friday).toContain("Jumu'ah today");
    await seed({ friday: { isFriday: false, daysUntil: 3, total: 4 } });
    const other = tree(await renderJumuahWidget(SMALL));
    expect(other).toContain('"text":"3"');
  });
});

describe("theme slots", () => {
  it("emits distinct light/dark trees when following the system theme", async () => {
    await seed({ theme: { ...emptyWidgetSnapshot().theme, followsSystem: true } });
    const rep = await renderHijriDateWidget(MEDIUM);
    expect(tree(rep, "light")).not.toEqual(tree(rep, "dark"));
  });

  it("uses the forced theme for both slots", async () => {
    await seed({ theme: { ...emptyWidgetSnapshot().theme, followsSystem: false, isDark: true } });
    const rep = await renderHijriDateWidget(MEDIUM);
    expect(tree(rep, "light")).toEqual(tree(rep, "dark"));
  });
});

describe("widget registry", () => {
  it("maps every widget name to its renderer", async () => {
    expect(APP_WIDGET_REGISTRY).toHaveLength(14);
    expect(getAppWidgetByName("QiblaBearingWidget")?.render).toBe(renderQiblaBearingWidget);
    expect(getAppWidgetByName("Nope")).toBeUndefined();
    for (const widget of APP_WIDGET_REGISTRY) {
      const rep = await widget.render(MEDIUM);
      expect(() => tree(rep)).not.toThrow();
    }
  });
});

describe("renderAdhkarWidget", () => {
  const set = (
    key: string,
    title: string,
    startMin: number,
    endMin: number,
    completed: number,
  ) => ({
    key,
    title,
    completed,
    total: 4,
    progressLabel: `${completed}/4 done`,
    startMs: ago(startMin),
    endMs: ago(endMin),
    nextLabel: `Next: ${title} at 17:00`,
    deepLink: `munib-tracker://zikr/session/${key}`,
  });

  it("leads with the open set and links straight into its session", async () => {
    await seed({
      adhkar: {
        title: "Adhkar",
        sets: [
          set("morning", "Morning Adhkar", 300, 60, 4),
          set("after_prayer:asr", "After Asr", 10, -60, 1),
          set("evening", "Evening Adhkar", -30, -200, 0),
        ],
      },
    });
    const json = tree(await renderAdhkarWidget(MEDIUM));
    expect(json).toContain("After Asr");
    expect(json).toContain("1/4 done");
    expect(json).toContain("zikr/session/after_prayer:asr");
    expect(json).not.toContain("Morning Adhkar");
  });

  it("shows the next set when nothing is due", async () => {
    await seed({
      adhkar: {
        title: "Adhkar",
        sets: [
          set("morning", "Morning Adhkar", 300, 60, 4),
          set("evening", "Evening Adhkar", -30, -200, 0),
        ],
      },
    });
    const json = tree(await renderAdhkarWidget(MEDIUM));
    expect(json).toContain("Evening Adhkar");
    expect(json).toContain("Next: Evening Adhkar at 17:00");
  });
});

describe("renderIslamicEventsWidget", () => {
  const day = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  };
  const items = [
    {
      id: "arafah",
      name: "Day of Arafah",
      date: day(3),
      dateLabel: "Arafah date",
      relativeLabel: "in 3 days",
      daysUntil: 3,
    },
    {
      id: "eidAdha",
      name: "Eid al-Adha",
      date: day(4),
      dateLabel: "Eid date",
      relativeLabel: "in 4 days",
      daysUntil: 4,
    },
  ];

  it("uses relative labels on the day they were written", async () => {
    await seed({ date: day(0), events: { title: "Islamic events", items } });
    const json = tree(await renderIslamicEventsWidget(MEDIUM));
    expect(json).toContain("Day of Arafah");
    expect(json).toContain("in 3 days");
    expect(json).toContain("Eid al-Adha");
  });

  it("falls back to absolute dates when the snapshot is from an earlier day", async () => {
    await seed({ date: day(-2), events: { title: "Islamic events", items } });
    const json = tree(await renderIslamicEventsWidget(MEDIUM));
    expect(json).toContain("Arafah date");
    expect(json).not.toContain("in 3 days");
  });
});
