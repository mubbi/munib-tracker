import type { QuranReadingDay } from "@/lib/quran-reading-log";
import {
  QuranReadingSession,
  READING_FLUSH_INTERVAL_MS,
  READING_IDLE_LIMIT_MS,
  READING_MAX_AYAHS_PER_VIEW,
  READING_MIN_ACTIVE_SECONDS,
} from "@/lib/quran-reading-session";

const START = new Date(2026, 10, 24, 9, 0, 0).getTime();

function setup() {
  let now = START;
  const commits: { date: string; delta: QuranReadingDay }[] = [];
  const session = new QuranReadingSession(
    (date, delta) => commits.push({ date, delta }),
    () => now,
  );
  const advance = (ms: number) => {
    now += ms;
  };
  return { session, commits, advance };
}

describe("QuranReadingSession (D40 recorder)", () => {
  it("records nothing for a short visit", () => {
    const { session, commits, advance } = setup();
    session.resume();
    session.noteAyahRange(2, 1, 5);
    advance((READING_MIN_ACTIVE_SECONDS - 5) * 1000);
    session.pause();
    expect(commits).toEqual([]);
    expect(session.qualified).toBe(false);
  });

  it("once qualified, commits time plus the ayahs seen before qualifying", () => {
    const { session, commits, advance } = setup();
    session.resume();
    session.noteAyahRange(2, 1, 5);
    advance(20_000);
    session.noteAyahRange(2, 3, 8); // 3–5 already seen → +3
    advance(20_000);
    session.pause();
    expect(commits).toEqual([{ date: "2026-11-24", delta: { seconds: 40, ayahs: 8, pages: 0 } }]);
  });

  it("debounces writes to the flush interval while reading", () => {
    const { session, commits, advance } = setup();
    session.resume();
    for (let page = 1; page <= 12; page += 1) {
      advance(10_000);
      session.notePage(page);
    }
    // 120 s of reading → qualified at 30 s, then at most one write per interval.
    expect(commits.length).toBeLessThanOrEqual(Math.ceil(120_000 / READING_FLUSH_INTERVAL_MS));
    session.pause();
    const total = commits.reduce(
      (acc, c) => ({ seconds: acc.seconds + c.delta.seconds, pages: acc.pages + c.delta.pages }),
      { seconds: 0, pages: 0 },
    );
    expect(total).toEqual({ seconds: 120, pages: 12 });
  });

  it("stops counting time after the idle limit (reader left open)", () => {
    const { session, commits, advance } = setup();
    session.resume();
    session.notePage(5);
    advance(60 * 60_000); // an hour with no interaction
    session.tick();
    session.pause();
    expect(commits).toHaveLength(1);
    expect(commits[0]?.delta).toEqual({
      seconds: READING_IDLE_LIMIT_MS / 1000,
      ayahs: 0,
      pages: 1,
    });
  });

  it("doesn't count time while paused (backgrounded / blurred)", () => {
    const { session, commits, advance } = setup();
    session.resume();
    advance(10_000);
    session.notePage(1);
    session.pause();
    advance(10 * 60_000);
    session.resume();
    advance(25_000);
    session.notePage(2);
    session.pause();
    expect(commits).toEqual([{ date: "2026-11-24", delta: { seconds: 35, ayahs: 0, pages: 2 } }]);
  });

  it("caps one viewport's ayahs and ignores invalid ranges", () => {
    const { session, commits, advance } = setup();
    session.resume();
    session.noteAyahRange(2, 1, 286);
    session.noteAyahRange(2, 0, 3);
    session.noteAyahRange(2, 9, 3);
    session.notePage(Number.NaN);
    advance(READING_MIN_ACTIVE_SECONDS * 1000);
    session.pause();
    expect(commits[0]?.delta.ayahs).toBe(READING_MAX_AYAHS_PER_VIEW);
    expect(commits[0]?.delta.pages).toBe(0);
  });
});
