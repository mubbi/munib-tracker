import type { WidgetScheduleRow } from "@/lib/appSurfaces/widgets/types";
import {
  buildTvHomePayload,
  nextLocalMidnightMs,
  nextSalahVariants,
  visibleTvHomeItems,
} from "@/lib/tv-home/tv-home-payload";
import { buildWidgetSnapshot } from "@/test-support/fixtures/widgets";

const LABELS = {
  channelName: "Munib Tracker",
  appLink: "munib-tracker://",
  todayTitle: "Today",
  readTitle: "Library",
};

const NOW = new Date(2026, 10, 25, 14, 0, 0);
const at = (h: number, m = 0, dayOffset = 0) =>
  new Date(2026, 10, 25 + dayOffset, h, m, 0).getTime();

function row(id: string, name: string, time: string, atMs: number): WidgetScheduleRow {
  return { id, name, time, status: "pending", statusLabel: "", atMs };
}

const snapshot = (overrides: Parameters<typeof buildWidgetSnapshot>[0] = {}) =>
  buildWidgetSnapshot({
    nextPrayer: {
      title: "Next Salah",
      deepLink: "munib-tracker://tracker",
      location: "Lahore",
      targetTimeMs: at(15, 45),
    },
    schedule: {
      rows: [
        row("dhuhr", "Dhuhr", "12:30 PM", at(12, 30)),
        row("asr", "Asr", "3:45 PM", at(15, 45)),
        row("maghrib", "Maghrib", "5:20 PM", at(17, 20)),
      ],
      tomorrowRows: [row("fajr", "Fajr", "5:10 AM", at(5, 10, 1))],
    },
    progress: { title: "Today's progress", summary: "2 of 5", deepLink: "munib-tracker://tracker" },
    adhkar: { title: "Evening adhkar", summary: "Due now", deepLink: "munib-tracker://zikr" },
    dailyHadith: {
      title: "Hadith of the day",
      meaning: "Actions are by intentions.",
      deepLink: "munib-tracker://hadith/daily",
    },
    ...overrides,
  });

describe("nextSalahVariants", () => {
  it("emits one window per upcoming Adhan, chained so exactly one is valid at a time", () => {
    const variants = nextSalahVariants(snapshot(), NOW.getTime());

    expect(variants.map((v) => v.shortTitle)).toEqual([
      "Asr · 3:45 PM",
      "Maghrib · 5:20 PM",
      "Fajr · 5:10 AM",
    ]);
    expect(variants[0]).toMatchObject({ id: "next-salah", validUntilMs: at(15, 45) });
    expect(variants[0].validFromMs).toBeUndefined();
    expect(variants[1]).toMatchObject({ validFromMs: at(15, 45), validUntilMs: at(17, 20) });
    expect(variants[0].description).toBe("Asr · 3:45 PM · Lahore");
  });

  it("is empty without a location", () => {
    expect(nextSalahVariants(snapshot({ locationDenied: true }), NOW.getTime())).toEqual([]);
  });
});

describe("buildTvHomePayload", () => {
  it("builds Today and Library sections with app-scheme deep links only", () => {
    const payload = buildTvHomePayload(
      snapshot({ khatm: { hasPlan: true, title: "Khatm" } }),
      LABELS,
      NOW,
    );

    expect(payload.sections.map((s) => s.title)).toEqual(["Today", "Library"]);
    const links = payload.sections.flatMap((s) => s.items.map((i) => i.deepLink));
    expect(links.every((l) => l.startsWith("munib-tracker://"))).toBe(true);
  });

  it("expires day-scoped items at local midnight and adhkar at the next Adhan", () => {
    const payload = buildTvHomePayload(snapshot(), LABELS, NOW);
    const items = payload.sections.flatMap((s) => s.items);

    expect(items.find((i) => i.id === "progress")?.validUntilMs).toBe(nextLocalMidnightMs(NOW));
    expect(items.find((i) => i.id === "adhkar")?.validUntilMs).toBe(at(15, 45));
  });

  it("adds seasonal rows only when they apply", () => {
    const plain = buildTvHomePayload(snapshot(), LABELS, NOW).sections[0].items.map((i) => i.id);
    expect(plain).not.toContain("ramadan");
    expect(plain).not.toContain("friday");

    const seasonal = buildTvHomePayload(
      snapshot({
        ramadan: { isRamadan: true, title: "Ramadan", targetTimeMs: at(17, 20) },
        friday: { isFriday: true, title: "Jumu'ah" },
      }),
      LABELS,
      NOW,
    ).sections[0].items.map((i) => i.id);
    expect(seasonal).toEqual(expect.arrayContaining(["ramadan", "friday"]));
  });

  it("omits the Library section when there is nothing to read", () => {
    const payload = buildTvHomePayload(snapshot({ dailyHadith: { meaning: "" } }), LABELS, NOW);

    expect(payload.sections.map((s) => s.id)).toEqual(["today"]);
  });

  it("clips long descriptions", () => {
    const payload = buildTvHomePayload(
      snapshot({ dailyHadith: { meaning: "word ".repeat(80) } }),
      LABELS,
      NOW,
    );
    const hadith = payload.sections[1].items[0];

    expect(hadith.description.length).toBeLessThanOrEqual(160);
    expect(hadith.description.endsWith("…")).toBe(true);
  });
});

describe("visibleTvHomeItems", () => {
  it("shows the current Next Salah variant and drops expired items", () => {
    const section = buildTvHomePayload(snapshot(), LABELS, NOW).sections[0];

    const afterAsr = visibleTvHomeItems(section, at(16));
    expect(afterAsr.find((i) => i.id === "next-salah")?.shortTitle).toBe("Maghrib · 5:20 PM");
    expect(afterAsr.find((i) => i.id === "adhkar")).toBeUndefined();

    const nextDay = visibleTvHomeItems(section, at(1, 0, 1));
    expect(nextDay.find((i) => i.id === "progress")).toBeUndefined();
    expect(nextDay.find((i) => i.id === "next-salah")?.shortTitle).toBe("Fajr · 5:10 AM");
  });
});
