import { getLocalDateString } from "@munib-tracker/shared/utils";

import type { QuranReadingDay } from "@/lib/quran-reading-log";

/**
 * D40: decides when a Qur'an reader visit counts as READING and turns it into
 * debounced deltas for the daily reading log. Pure state machine with an
 * injected clock; `useQuranReadingRecorder` wires it to focus + AppState.
 *
 * - Time only accrues while the screen is focused AND the app is in the
 *   foreground (`resume` / `pause`), and only up to
 *   {@link READING_IDLE_LIMIT_MS} after the last sign of reading (an ayah range
 *   settling on screen, a page turn) — a reader left open on the table stops
 *   counting.
 * - Nothing is written until the visit reaches {@link READING_MIN_ACTIVE_SECONDS}
 *   of active time; the ayahs/pages seen before that are then included.
 * - After that it flushes at most every {@link READING_FLUSH_INTERVAL_MS} (and
 *   on pause), so storage sees a write every ~30 s at worst.
 * - Ayahs and pages are de-duplicated per visit (scrolling back and forth over
 *   the same ayahs doesn't inflate the count).
 */

export const READING_MIN_ACTIVE_SECONDS = 30;
/** One mushaf page can take a couple of minutes to read without touching the screen. */
export const READING_IDLE_LIMIT_MS = 3 * 60_000;
export const READING_FLUSH_INTERVAL_MS = 30_000;
/** Most ayahs a single settled viewport can contribute (guards huge ranges on tablets/web). */
export const READING_MAX_AYAHS_PER_VIEW = 40;

export type ReadingCommit = (date: string, delta: QuranReadingDay) => void;

export class QuranReadingSession {
  private active = false;
  private lastTick = 0;
  private lastActivity = 0;
  private lastFlush = 0;
  private activeMs = 0;
  private pendingMs = 0;
  private pendingAyahs = 0;
  private pendingPages = 0;
  private readonly seenAyahs = new Set<string>();
  private readonly seenPages = new Set<number>();

  constructor(
    private readonly commit: ReadingCommit,
    private readonly clock: () => number = Date.now,
  ) {}

  /** True once this visit has enough active time to count as reading. */
  get qualified(): boolean {
    return this.activeMs >= READING_MIN_ACTIVE_SECONDS * 1000;
  }

  /** Screen focused and app in the foreground. */
  resume(): void {
    if (this.active) return;
    const now = this.clock();
    this.active = true;
    this.lastTick = now;
    this.lastActivity = now;
  }

  /** Blur / background / unmount: stop the clock and flush what qualifies. */
  pause(): void {
    if (!this.active) return;
    this.accrue();
    this.active = false;
    this.flush();
  }

  /** Periodic heartbeat while open (accrues time, flushes on the interval). */
  tick(): void {
    this.accrue();
    this.maybeFlush();
  }

  /** Ayahs `from..to` of `surah` settled on screen. */
  noteAyahRange(surah: number, from: number, to: number): void {
    if (!Number.isFinite(from) || !Number.isFinite(to) || from < 1 || to < from) return;
    this.noteActivity();
    const last = Math.min(to, from + READING_MAX_AYAHS_PER_VIEW - 1);
    for (let ayah = from; ayah <= last; ayah += 1) {
      const key = `${surah}:${ayah}`;
      if (this.seenAyahs.has(key)) continue;
      this.seenAyahs.add(key);
      this.pendingAyahs += 1;
    }
    this.maybeFlush();
  }

  /** A mushaf page is on screen. */
  notePage(page: number): void {
    if (!Number.isFinite(page) || page < 1) return;
    this.noteActivity();
    if (!this.seenPages.has(page)) {
      this.seenPages.add(page);
      this.pendingPages += 1;
    }
    this.maybeFlush();
  }

  private noteActivity(): void {
    this.accrue();
    this.lastActivity = this.clock();
  }

  private accrue(): void {
    if (!this.active) return;
    const now = this.clock();
    const until = Math.min(now, this.lastActivity + READING_IDLE_LIMIT_MS);
    if (until > this.lastTick) {
      const ms = until - this.lastTick;
      this.activeMs += ms;
      this.pendingMs += ms;
    }
    this.lastTick = now;
  }

  private maybeFlush(): void {
    if (this.clock() - this.lastFlush >= READING_FLUSH_INTERVAL_MS) this.flush();
  }

  private flush(): void {
    if (!this.qualified) return;
    const seconds = Math.floor(this.pendingMs / 1000);
    if (seconds === 0 && this.pendingAyahs === 0 && this.pendingPages === 0) return;
    const now = this.clock();
    this.commit(getLocalDateString(new Date(now)), {
      seconds,
      ayahs: this.pendingAyahs,
      pages: this.pendingPages,
    });
    this.pendingMs -= seconds * 1000;
    this.pendingAyahs = 0;
    this.pendingPages = 0;
    this.lastFlush = now;
  }
}
