import {
  effectiveAnnouncements,
  INITIAL_VOICE_SESSION,
  isStuck,
  reduceVoiceSession,
  STUCK_HINT_MS,
  type VoiceSessionEvent,
  type VoiceSessionState,
} from "./session";

function run(events: VoiceSessionEvent[], from: VoiceSessionState = INITIAL_VOICE_SESSION) {
  let state = from;
  let counts = 0;
  for (const event of events) {
    const result = reduceVoiceSession(state, event);
    state = result.state;
    if (result.count) counts += 1;
  }
  return { state, counts };
}

const listening = run([
  { type: "prepare", at: 0 },
  { type: "listening", at: 100 },
]).state;

describe("voice session state machine", () => {
  it("starts: idle → preparing → listening", () => {
    expect(listening.status).toBe("listening");
  });

  it("counts one per hit while listening, never while preparing", () => {
    const preparing = run([
      { type: "prepare", at: 0 },
      { type: "hit", at: 1, atLimit: false },
    ]);
    expect(preparing.counts).toBe(0);
    const { state, counts } = run(
      [
        { type: "hit", at: 200, atLimit: false },
        { type: "hit", at: 900, atLimit: false },
      ],
      listening,
    );
    expect(counts).toBe(2);
    expect(state.counted).toBe(2);
  });

  it("stops at the target instead of counting past it", () => {
    const { state, counts } = run([{ type: "hit", at: 200, atLimit: true }], listening);
    expect(counts).toBe(0);
    expect(state).toMatchObject({ status: "stopped", stopReason: "target" });
  });

  it("auto-stops after the chosen silence", () => {
    expect(run([{ type: "tick", at: 30_099, silenceStopSec: 30 }], listening).state.status).toBe(
      "listening",
    );
    expect(run([{ type: "tick", at: 30_100, silenceStopSec: 30 }], listening).state).toMatchObject({
      status: "stopped",
      stopReason: "silence",
    });
  });

  it("keeps listening while speech is heard", () => {
    const { state } = run(
      [
        { type: "speech", at: 50_000 },
        { type: "tick", at: 100_000, silenceStopSec: 60 },
      ],
      listening,
    );
    expect(state.status).toBe("listening");
  });

  it.each(["background", "interrupted", "left", "user"] as const)("stops on %s", (reason) => {
    expect(run([{ type: "stop", at: 10, reason }], listening).state).toMatchObject({
      status: "stopped",
      stopReason: reason,
    });
  });

  it("records the error code when stopping on an error", () => {
    expect(
      run([{ type: "stop", at: 10, reason: "error", errorCode: "engine-runtime" }], listening).state
        .errorCode,
    ).toBe("engine-runtime");
  });

  it("ignores hits during a screen-reader announcement", () => {
    const { counts } = run(
      [
        { type: "mute", at: 1000, durationMs: 1500 },
        { type: "hit", at: 2000, atLimit: false },
        { type: "hit", at: 2600, atLimit: false },
      ],
      listening,
    );
    expect(counts).toBe(1);
  });

  it("shows the stuck hint after 10 s of speech without a count", () => {
    const { state } = run([{ type: "speech", at: 1000 }], listening);
    expect(isStuck(state, 1000 + STUCK_HINT_MS - 1)).toBe(false);
    expect(isStuck(state, 1000 + STUCK_HINT_MS)).toBe(true);
    const counted = run([{ type: "hit", at: 5000, atLimit: false }], state).state;
    expect(isStuck(counted, 1000 + STUCK_HINT_MS)).toBe(false);
  });

  it("caps announcements at milestones while listening", () => {
    expect(effectiveAnnouncements("every", true)).toBe("milestones");
    expect(effectiveAnnouncements("every", false)).toBe("every");
    expect(effectiveAnnouncements("off", true)).toBe("off");
  });

  it("can start again after stopping", () => {
    const stopped = run([{ type: "stop", at: 10, reason: "silence" }], listening).state;
    expect(run([{ type: "prepare", at: 20 }], stopped).state).toMatchObject({
      status: "preparing",
      stopReason: null,
      counted: 0,
    });
  });
});
