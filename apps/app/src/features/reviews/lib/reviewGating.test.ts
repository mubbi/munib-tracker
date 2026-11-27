import {
  REVIEW_AFTER_WRITE_REVIEW_DAYS,
  REVIEW_ERROR_COOLDOWN_DAYS,
  REVIEW_MIN_INSTALL_HOURS,
  REVIEW_MIN_MEANINGFUL_INTERACTIONS,
  REVIEW_MIN_SESSIONS,
  REVIEW_PROMPT_COOLDOWN_DAYS,
  REVIEW_PROMPT_LIFETIME_CAP,
  REVIEW_SESSION_IDLE_MINUTES,
} from "@munib-tracker/shared/reviews";
import {
  canRequestAutomaticReview,
  type ReviewPromptRuntime,
  recordAutomaticReviewRequested,
  recordFeedbackSent,
  recordForegroundHeartbeat,
  recordMeaningfulInteraction,
  recordReviewError,
  recordSessionForeground,
  recordWriteReviewOpened,
} from "@/features/reviews/lib/reviewGating";
import { EMPTY_REVIEW_GATING, type ReviewGatingState } from "@/features/reviews/lib/reviewStorage";

const NOW = new Date("2026-11-25T12:00:00.000Z");
const DAY_MS = 24 * 60 * 60 * 1000;
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
const daysAgo = (days: number) => ago(days * DAY_MS);

/** A state that passes every engagement rule. */
const ENGAGED: ReviewGatingState = {
  ...EMPTY_REVIEW_GATING,
  firstOpenAt: daysAgo(10),
  sessionCount: REVIEW_MIN_SESSIONS,
  meaningfulInteractionCount: REVIEW_MIN_MEANINGFUL_INTERACTIONS,
};

const RUNTIME: ReviewPromptRuntime = {
  isSyncing: false,
  prayersLogged: 10,
  currentStreak: 0,
  achievementsUnlocked: 0,
  hasCompletedOnboarding: true,
  appVersion: "2.4.0",
};

function gate(state: Partial<ReviewGatingState> = {}, runtime: Partial<ReviewPromptRuntime> = {}) {
  return canRequestAutomaticReview({ ...ENGAGED, ...state }, { ...RUNTIME, ...runtime }, NOW);
}

describe("canRequestAutomaticReview", () => {
  it("allows an engaged person with no prior asks", () => {
    expect(gate()).toEqual({ allowed: true });
  });

  it.each<[string, Partial<ReviewGatingState>, Partial<ReviewPromptRuntime>, string]>([
    ["onboarding unfinished", {}, { hasCompletedOnboarding: false }, "setup_incomplete"],
    ["a sync in flight", {}, { isSyncing: true }, "sync_pending"],
    ["too few sessions", { sessionCount: REVIEW_MIN_SESSIONS - 1 }, {}, "min_sessions"],
    ["no first-open date", { firstOpenAt: null }, {}, "install_age"],
    [
      "a fresh install",
      { firstOpenAt: ago((REVIEW_MIN_INSTALL_HOURS - 1) * 60 * 60 * 1000) },
      {},
      "install_age",
    ],
    [
      "too few interactions",
      { meaningfulInteractionCount: REVIEW_MIN_MEANINGFUL_INTERACTIONS - 1 },
      {},
      "min_interactions",
    ],
    [
      "no real usage",
      {},
      { prayersLogged: 4, currentStreak: 2, achievementsUnlocked: 0 },
      "insufficient_usage",
    ],
    [
      "a recent crash",
      { lastErrorAt: daysAgo(REVIEW_ERROR_COOLDOWN_DAYS - 1) },
      {},
      "recent_error",
    ],
    ["an error this session", { sessionErrorAt: ago(60_000) }, {}, "session_error"],
    [
      "a recent write-review visit",
      { lastWriteReviewOpenedAt: daysAgo(REVIEW_AFTER_WRITE_REVIEW_DAYS - 1) },
      {},
      "recently_reviewed",
    ],
    ["the lifetime cap", { promptCountLifetime: REVIEW_PROMPT_LIFETIME_CAP }, {}, "lifetime_cap"],
    [
      "the cooldown",
      { lastPromptedAt: daysAgo(REVIEW_PROMPT_COOLDOWN_DAYS - 1), lastPromptedVersion: "1.0.0" },
      {},
      "prompt_cooldown",
    ],
    [
      "the same app version",
      { lastPromptedAt: daysAgo(REVIEW_PROMPT_COOLDOWN_DAYS + 1), lastPromptedVersion: "2.4.0" },
      {},
      "same_version",
    ],
  ])("blocks on %s", (_label, state, runtime, reason) => {
    expect(gate(state, runtime)).toEqual({ allowed: false, reason });
  });

  it.each<[string, Partial<ReviewPromptRuntime>]>([
    ["a streak", { prayersLogged: 0, currentStreak: 3 }],
    ["an achievement", { prayersLogged: 0, achievementsUnlocked: 1 }],
  ])("counts %s as usage", (_label, runtime) => {
    expect(gate({}, runtime)).toEqual({ allowed: true });
  });

  it("asks again on a new version once every window has passed", () => {
    expect(
      gate({
        promptCountLifetime: 1,
        lastPromptedAt: daysAgo(REVIEW_PROMPT_COOLDOWN_DAYS + 1),
        lastPromptedVersion: "2.3.0",
        lastErrorAt: daysAgo(REVIEW_ERROR_COOLDOWN_DAYS + 1),
        lastWriteReviewOpenedAt: daysAgo(REVIEW_AFTER_WRITE_REVIEW_DAYS + 1),
      }),
    ).toEqual({ allowed: true });
  });

  it("treats a future timestamp (clock skew) as just now", () => {
    expect(gate({ lastPromptedAt: new Date(NOW.getTime() + DAY_MS).toISOString() })).toEqual({
      allowed: false,
      reason: "prompt_cooldown",
    });
  });

  it("ignores an unparseable timestamp", () => {
    expect(gate({ lastErrorAt: "not-a-date" })).toEqual({ allowed: true });
  });
});

describe("recordSessionForeground", () => {
  const idleMs = REVIEW_SESSION_IDLE_MINUTES * 60 * 1000;

  it("starts the first session and stamps the first open", () => {
    const next = recordSessionForeground(EMPTY_REVIEW_GATING, NOW);
    expect(next).toMatchObject({
      sessionCount: 1,
      firstOpenAt: NOW.toISOString(),
      currentSessionStartedAt: NOW.toISOString(),
    });
  });

  it("keeps the session when the app returns within the idle window", () => {
    const state = { ...ENGAGED, lastForegroundAt: ago(idleMs - 1000) };
    expect(recordSessionForeground(state, NOW).sessionCount).toBe(ENGAGED.sessionCount);
  });

  it("starts a new session after the idle window and resets session-scoped state", () => {
    const state: ReviewGatingState = {
      ...ENGAGED,
      lastForegroundAt: ago(idleMs + 1000),
      sessionErrorAt: ago(idleMs + 2000),
      sessionInteractionKinds: ["mark_prayer"],
    };
    const next = recordSessionForeground(state, NOW);
    expect(next).toMatchObject({
      sessionCount: ENGAGED.sessionCount + 1,
      sessionErrorAt: null,
      sessionInteractionKinds: [],
      firstOpenAt: ENGAGED.firstOpenAt,
    });
  });

  it("measures idle time from the last background heartbeat", () => {
    const longSession = { ...ENGAGED, lastForegroundAt: ago(3 * idleMs) };
    const backgrounded = recordForegroundHeartbeat(longSession, new Date(NOW.getTime() - 60_000));
    expect(recordSessionForeground(backgrounded, NOW).sessionCount).toBe(ENGAGED.sessionCount);
  });
});

describe("recordMeaningfulInteraction", () => {
  it("counts each kind once per session", () => {
    const once = recordMeaningfulInteraction(EMPTY_REVIEW_GATING, "mark_prayer");
    const twice = recordMeaningfulInteraction(once, "mark_prayer");
    const other = recordMeaningfulInteraction(twice, "mark_zikr");
    expect(twice).toBe(once);
    expect(other.meaningfulInteractionCount).toBe(2);
    expect(other.sessionInteractionKinds).toEqual(["mark_prayer", "mark_zikr"]);
  });
});

describe("recordReviewError", () => {
  it("a crash blocks for the cooldown and the session", () => {
    expect(recordReviewError(EMPTY_REVIEW_GATING, "crash", NOW)).toMatchObject({
      lastErrorAt: NOW.toISOString(),
      sessionErrorAt: NOW.toISOString(),
    });
  });

  it("a session error (e.g. offline sync) leaves the cooldown alone", () => {
    const next = recordReviewError(EMPTY_REVIEW_GATING, "session", NOW);
    expect(next.lastErrorAt).toBeNull();
    expect(next.sessionErrorAt).toBe(NOW.toISOString());
  });
});

describe("bookkeeping", () => {
  it("records an automatic request with its version", () => {
    expect(recordAutomaticReviewRequested(ENGAGED, "2.4.0", NOW)).toMatchObject({
      lastPromptedAt: NOW.toISOString(),
      lastPromptedVersion: "2.4.0",
      promptCountLifetime: 1,
    });
  });

  it("records write-review visits and feedback without touching the prompt counters", () => {
    const next = recordFeedbackSent(recordWriteReviewOpened(ENGAGED, NOW), NOW);
    expect(next).toMatchObject({
      lastWriteReviewOpenedAt: NOW.toISOString(),
      lastFeedbackSentAt: NOW.toISOString(),
      promptCountLifetime: 0,
      lastPromptedAt: null,
    });
  });
});
