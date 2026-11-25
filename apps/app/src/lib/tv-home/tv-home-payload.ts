import type { WidgetScheduleRow, WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";

/**
 * Data for the TV home surfaces — the Android TV channel row ("Munib Tracker" on
 * the launcher) and the tvOS Top Shelf. Built from the same localized widget
 * snapshot the phone widgets use, so no TV-only copy is needed.
 *
 * Items can carry a validity window. Both native sides show only the entries that
 * are valid "now", which keeps time-sensitive rows (next Salah, adhkar, today's
 * progress) correct while the app is closed: Android re-publishes at the next
 * boundary, the Top Shelf extension re-evaluates on load and expires items.
 */
export type TvHomeArt = "salah" | "tracker" | "quran" | "hadith" | "adhkar" | "ramadan" | "friday";

export type TvHomeItem = {
  /** Stable per logical item (variants of the next-Salah row share one id). */
  id: string;
  title: string;
  description: string;
  /** Short label for surfaces that only show one line (tvOS Top Shelf). */
  shortTitle: string;
  /** `munib-tracker://…` — never https (TVs must not open a browser). */
  deepLink: string;
  art: TvHomeArt;
  /** Epoch ms; shown from this instant (inclusive). */
  validFromMs?: number;
  /** Epoch ms; hidden from this instant. */
  validUntilMs?: number;
};

export type TvHomeSection = {
  id: "today" | "read";
  title: string;
  items: TvHomeItem[];
};

export type TvHomePayload = {
  version: 1;
  updatedAt: string;
  /** Launcher channel name (the app name). */
  channelName: string;
  /** Opened when the channel itself (not a card) is selected. */
  appLink: string;
  sections: TvHomeSection[];
};

export type TvHomeLabels = {
  channelName: string;
  appLink: string;
  todayTitle: string;
  readTitle: string;
};

const DESCRIPTION_MAX = 160;

function clip(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

/** Local midnight after `now` — day-scoped items (progress, daily hadith) expire there. */
export function nextLocalMidnightMs(now: Date): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime();
}

/**
 * One "Next Salah" variant per upcoming Adhan (today + tomorrow). Variant `i` is
 * valid from the previous Adhan until its own, so whichever surface reads the
 * payload later still names the right Salah.
 */
export function nextSalahVariants(snapshot: WidgetSnapshot, nowMs: number): TvHomeItem[] {
  const section = snapshot.nextPrayer;
  if (snapshot.locationDenied) return [];
  const rows: WidgetScheduleRow[] = [...snapshot.schedule.rows, ...snapshot.schedule.tomorrowRows]
    .filter((row) => row.atMs > 0)
    .sort((a, b) => a.atMs - b.atMs);
  const variants: TvHomeItem[] = [];
  let previousAt: number | undefined;
  for (const row of rows) {
    if (row.atMs > nowMs) {
      const when = section.location ? `${row.time} · ${section.location}` : row.time;
      variants.push({
        id: "next-salah",
        title: section.title,
        description: clip(`${row.name} · ${when}`),
        shortTitle: clip(`${row.name} · ${row.time}`, 48),
        deepLink: section.deepLink,
        art: "salah",
        ...(previousAt !== undefined && previousAt > nowMs ? { validFromMs: previousAt } : {}),
        validUntilMs: row.atMs,
      });
    }
    previousAt = row.atMs;
  }
  return variants;
}

export function buildTvHomePayload(
  snapshot: WidgetSnapshot,
  labels: TvHomeLabels,
  now: Date = new Date(),
): TvHomePayload {
  const nowMs = now.getTime();
  const midnight = nextLocalMidnightMs(now);
  const nextAdhanMs =
    snapshot.nextPrayer.targetTimeMs > nowMs ? snapshot.nextPrayer.targetTimeMs : undefined;

  const today: TvHomeItem[] = [...nextSalahVariants(snapshot, nowMs)];

  if (snapshot.ramadan.isRamadan) {
    today.push({
      id: "ramadan",
      title: snapshot.ramadan.title,
      description: clip(snapshot.ramadan.summary),
      shortTitle: clip(snapshot.ramadan.title, 48),
      deepLink: snapshot.ramadan.deepLink,
      art: "ramadan",
      validUntilMs:
        snapshot.ramadan.targetTimeMs > nowMs ? snapshot.ramadan.targetTimeMs : midnight,
    });
  }

  today.push({
    id: "progress",
    title: snapshot.progress.title,
    description: clip(snapshot.progress.summary),
    shortTitle: clip(snapshot.progress.summary, 48),
    deepLink: snapshot.progress.deepLink,
    art: "tracker",
    validUntilMs: midnight,
  });

  // The due adhkar set changes around Fajr / Asr / Maghrib — refresh at the next Adhan.
  today.push({
    id: "adhkar",
    title: snapshot.adhkar.title,
    description: clip(snapshot.adhkar.summary),
    shortTitle: clip(snapshot.adhkar.title, 48),
    deepLink: snapshot.adhkar.deepLink,
    art: "adhkar",
    validUntilMs: nextAdhanMs ?? midnight,
  });

  if (snapshot.friday.isFriday) {
    today.push({
      id: "friday",
      title: snapshot.friday.title,
      description: clip(snapshot.friday.summary),
      shortTitle: clip(snapshot.friday.title, 48),
      deepLink: snapshot.friday.deepLink,
      art: "friday",
      validUntilMs: midnight,
    });
  }

  const read: TvHomeItem[] = [];
  if (snapshot.khatm.hasPlan) {
    read.push({
      id: "khatm",
      title: snapshot.khatm.title,
      description: clip(snapshot.khatm.summary),
      shortTitle: clip(snapshot.khatm.title, 48),
      deepLink: snapshot.khatm.deepLink,
      art: "quran",
    });
  }
  if (snapshot.dailyHadith.meaning) {
    read.push({
      id: "daily-hadith",
      title: snapshot.dailyHadith.title,
      description: clip(snapshot.dailyHadith.meaning),
      shortTitle: clip(snapshot.dailyHadith.title, 48),
      deepLink: snapshot.dailyHadith.deepLink,
      art: "hadith",
      validUntilMs: midnight,
    });
  }

  const sections: TvHomeSection[] = [{ id: "today", title: labels.todayTitle, items: today }];
  if (read.length > 0) sections.push({ id: "read", title: labels.readTitle, items: read });

  return {
    version: 1,
    updatedAt: now.toISOString(),
    channelName: labels.channelName,
    appLink: labels.appLink,
    sections,
  };
}

/** Items valid at `nowMs`, first variant per id — mirrors the native filters. */
export function visibleTvHomeItems(section: TvHomeSection, nowMs: number): TvHomeItem[] {
  const seen = new Set<string>();
  const out: TvHomeItem[] = [];
  for (const item of section.items) {
    if (seen.has(item.id)) continue;
    if (item.validFromMs !== undefined && nowMs < item.validFromMs) continue;
    if (item.validUntilMs !== undefined && nowMs >= item.validUntilMs) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}
