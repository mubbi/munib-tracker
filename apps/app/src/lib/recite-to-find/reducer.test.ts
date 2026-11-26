import events from "@/lib/quran-companion/__fixtures__/tilawa-events.json";
import { mapTilawaEvent, type TilawaMessage } from "@/lib/quran-companion/map-tilawa-event";
import type { CompanionEvent } from "@/lib/quran-companion/types";

import {
  createReciteState,
  hasConfirmedMatch,
  MAX_CANDIDATES,
  type ReciteState,
  rankCandidates,
  reciteReducer,
  strengthOf,
} from "./reducer";

const FREE = { confirmedMismatchEnabled: false, verseEvents: true };

function listening(): ReciteState {
  return reciteReducer(createReciteState(), { type: "start" });
}

function feed(state: ReciteState, list: CompanionEvent[]): ReciteState {
  return list.reduce((s, event) => reciteReducer(s, { type: "event", event }), state);
}

function recorded(name: keyof typeof events): CompanionEvent[] {
  const list = events[name] as unknown as TilawaMessage[];
  return list.map((m) => mapTilawaEvent(m, FREE)).filter((e): e is CompanionEvent => e != null);
}

const pos = (surah: number, ayah: number, matched: number[], total: number): CompanionEvent => ({
  type: "position",
  surah,
  ayah,
  engineWord: Math.max(0, ...matched),
  totalWords: total,
  matched,
});

describe("reciteReducer — states", () => {
  it("starts idle, listens on start, and says nothing yet until evidence arrives", () => {
    expect(createReciteState().status).toBe("idle");
    const s = listening();
    expect(s.status).toBe("listening");
    expect(s.candidates).toEqual([]);
  });

  it("finishes as nothing when no ayah was heard", () => {
    const s = reciteReducer(listening(), { type: "finish" });
    expect(s.status).toBe("nothing");
  });

  it("the engine's completed event finishes the take", () => {
    let s = feed(listening(), [pos(112, 1, [0, 1, 2], 4)]);
    s = reciteReducer(s, { type: "event", event: { type: "completed" } });
    expect(s.status).toBe("found");
  });

  it("an engine failure is an error with its code", () => {
    const s = feed(listening(), [{ type: "failed", code: "engine-runtime" }]);
    expect(s).toMatchObject({ status: "error", error: "engine-runtime" });
  });

  it("a start failure (mic denied) is an error", () => {
    const s = reciteReducer(createReciteState(), { type: "fail", code: "mic-denied" });
    expect(s).toMatchObject({ status: "error", error: "mic-denied" });
  });

  it("ignores events outside a take and clears results on reset / new start", () => {
    const idle = createReciteState();
    expect(feed(idle, [pos(1, 1, [0], 4)])).toBe(idle);
    // A cursor with no heard word is not evidence.
    const empty = listening();
    expect(feed(empty, [pos(1, 3, [], 2)])).toBe(empty);
    const found = reciteReducer(feed(listening(), [pos(1, 1, [0, 1], 4)]), { type: "finish" });
    expect(feed(found, [pos(2, 255, [0], 50)])).toBe(found);
    // Reset keeps the take counter, so a late event of the cleared take still drops.
    expect(reciteReducer(found, { type: "reset" })).toEqual({
      ...createReciteState(),
      take: found.take,
    });
    expect(reciteReducer(found, { type: "start" }).candidates).toEqual([]);
  });

  it("numbers takes and drops events tagged with another take", () => {
    const first = listening();
    expect(first.take).toBe(1);
    const second = reciteReducer(reciteReducer(first, { type: "finish" }), { type: "start" });
    expect(second.take).toBe(2);
    const stale = reciteReducer(second, { type: "event", event: pos(1, 1, [0, 1], 4), take: 1 });
    expect(stale).toBe(second);
    const staleDone = reciteReducer(second, {
      type: "event",
      event: { type: "completed" },
      take: 1,
    });
    expect(staleDone.status).toBe("listening");
    const current = reciteReducer(second, { type: "event", event: pos(1, 1, [0, 1], 4), take: 2 });
    expect(current.candidates).toHaveLength(1);
    expect(reciteReducer(second, { type: "start", take: 9 }).take).toBe(9);
  });

  it("tracks the latest heard position for live feedback", () => {
    let s = feed(listening(), [pos(2, 255, [2, 0, 2], 50)]);
    expect(s.live).toEqual({ surah: 2, ayah: 255, matched: [0, 2], totalWords: 50 });
    // A cursor with nothing heard keeps the last heard position.
    s = feed(s, [pos(2, 256, [], 20)]);
    expect(s.live?.ayah).toBe(255);
    s = feed(s, [pos(2, 256, [0], 20)]);
    expect(s.live).toEqual({ surah: 2, ayah: 256, matched: [0], totalWords: 20 });
    expect(reciteReducer(s, { type: "start" }).live).toBeNull();
  });

  it("returns the same state when an event adds nothing new", () => {
    const s = feed(listening(), [pos(1, 2, [0, 1], 4)]);
    expect(feed(s, [pos(1, 2, [0, 1], 4)])).toBe(s);
    expect(feed(s, [{ type: "started" }])).toBe(s);
  });
});

describe("reciteReducer — recorded engine output", () => {
  it("correct Al-Fatihah becomes one strong, confirmed 1:1–7 passage", () => {
    let s = feed(listening(), recorded("fatihaCorrect"));
    s = reciteReducer(s, { type: "finish" });
    expect(s.status).toBe("found");
    expect(s.candidates[0]).toMatchObject({
      surah: 1,
      ayah: 1,
      ayahEnd: 7,
      strength: "strong",
      confirmed: true,
    });
    expect(s.candidates).toHaveLength(1);
    expect(hasConfirmedMatch(s)).toBe(true);
  });

  it("Ayat al-Kursi is found as 2:255", () => {
    const s = feed(listening(), recorded("ayatAlKursiCorrect"));
    expect(s.candidates[0]).toMatchObject({ surah: 2, ayah: 255, ayahEnd: 255 });
  });

  it("a skipped ayah splits the passage instead of bridging it", () => {
    const s = feed(listening(), recorded("skippedAyah3"));
    const fatiha = s.candidates.filter((c) => c.surah === 1);
    expect(fatiha.some((c) => c.ayah === 1 && c.ayahEnd === 2)).toBe(true);
    expect(fatiha.some((c) => c.ayah === 5)).toBe(true);
    // The tracker passed 1:3 without hearing a word of it: no bridge, no guess.
    expect(fatiha.some((c) => c.ayah <= 3 && c.ayahEnd >= 3)).toBe(false);
  });

  it("while listening, live word progress alone already shows the ayah", () => {
    const live = recorded("fatihaCorrect").filter((e) => e.type === "position");
    const s = feed(listening(), live.slice(0, 10));
    expect(s.status).toBe("listening");
    expect(s.candidates[0]).toMatchObject({ surah: 1, ayah: 1, confirmed: false });
  });
});

describe("rankCandidates", () => {
  it("ranks a confirmed match above an earlier discovery guess, then keeps first-heard order", () => {
    const s = feed(listening(), [
      {
        type: "verseCandidates",
        candidates: [
          { surah: 7, ayah: 23, confidence: 0.5 },
          { surah: 2, ayah: 201, confidence: 0.45 },
        ],
        stable: false,
        final: false,
      },
      { type: "verseMatch", surah: 2, ayah: 201, confidence: 0.9 },
    ]);
    expect(s.candidates.map((c) => c.key)).toEqual(["2:201", "7:23"]);
    expect(s.candidates[0].strength).toBe("strong");
    expect(s.candidates[1].strength).toBe("possible");
  });

  it("de-duplicates repeated evidence for the same ayah and keeps the best score", () => {
    const s = feed(listening(), [
      pos(112, 1, [0], 4),
      pos(112, 1, [0, 1, 2, 3], 4),
      pos(112, 1, [0, 1], 4),
    ]);
    expect(s.candidates).toHaveLength(1);
    expect(s.candidates[0].score).toBeCloseTo(0.85);
  });

  it("drops guesses below the floor and caps the list", () => {
    const weak = feed(listening(), [
      {
        type: "verseCandidates",
        candidates: [{ surah: 3, ayah: 1, confidence: 0.2 }],
        stable: false,
        final: false,
      },
    ]);
    expect(weak.candidates).toEqual([]);

    const many = feed(
      listening(),
      Array.from({ length: 9 }, (_, i) => pos(10 + i * 2, 1, [0], 2)),
    );
    expect(many.candidates).toHaveLength(MAX_CANDIDATES);
    // Same band → first heard first.
    expect(many.candidates.map((c) => c.surah)).toEqual([10, 12, 14, 16, 18]);
  });

  it("spreads a multi-ayah guess over its range", () => {
    const s = feed(listening(), [
      {
        type: "verseCandidates",
        candidates: [{ surah: 1, ayah: 1, ayahEnd: 3, confidence: 0.9 }],
        stable: true,
        final: false,
      },
    ]);
    expect(s.candidates[0]).toMatchObject({ surah: 1, ayah: 1, ayahEnd: 3 });
  });

  it("does not merge a weak neighbour into a passage", () => {
    const out = rankCandidates({
      "1:1": { surah: 1, ayah: 1, score: 0.9, confirmed: true, firstSeen: 0 },
      "1:2": { surah: 1, ayah: 2, score: 0.35, confirmed: false, firstSeen: 1 },
    });
    expect(out.map((c) => [c.ayah, c.ayahEnd])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it("maps scores to strength bands", () => {
    expect(strengthOf(0.9)).toBe("strong");
    expect(strengthOf(0.6)).toBe("likely");
    expect(strengthOf(0.4)).toBe("possible");
  });
});
