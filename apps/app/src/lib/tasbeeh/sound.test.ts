import { act, renderHook } from "@testing-library/react-native";

import { PLAYBACK_AUDIO_MODE } from "@/lib/audio-session-mode";

import {
  applyTasbeehAudioMode,
  CLICK_SPACING_MS,
  createTasbeehSoundEngine,
  MAX_QUEUED_CLICKS,
  POOL_SIZES,
  TASBEEH_AUDIO_MODE,
  type TasbeehAudioDeps,
} from "./sound";
import { TASBEEH_SOUND_PACKS } from "./sound-packs";
import { useTasbeehSound } from "./use-tasbeeh-sound";

function fakeDeps() {
  const players: {
    source: number;
    volume: number;
    seekTo: jest.Mock;
    play: jest.Mock;
    remove: jest.Mock;
  }[] = [];
  const files = Object.fromEntries(
    TASBEEH_SOUND_PACKS.map((pack, i) => [
      pack,
      { bead: i * 10 + 1, spacer: i * 10 + 2, complete: i * 10 + 3 },
    ]),
  ) as TasbeehAudioDeps["files"];
  const deps: TasbeehAudioDeps = {
    createAudioPlayer: (source) => {
      const player = {
        source,
        volume: 1,
        seekTo: jest.fn().mockResolvedValue(undefined),
        play: jest.fn(),
        remove: jest.fn(),
      };
      players.push(player);
      return player;
    },
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    files,
  };
  return { deps, players };
}

describe("tasbeeh sound engine", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("preloads a round-robin pool; a fresh player plays at once from position 0", () => {
    const { deps, players } = fakeDeps();
    const engine = createTasbeehSoundEngine(deps, "stone", 0.5);
    const total = POOL_SIZES.bead + POOL_SIZES.spacer + POOL_SIZES.complete;
    expect(POOL_SIZES.bead).toBeGreaterThanOrEqual(6);
    expect(players).toHaveLength(total);
    expect(players.every((p) => p.volume === 0.5)).toBe(true);

    expect(engine.play("bead", 0)).toBe(true);
    expect(engine.play("bead", 100)).toBe(true);
    const beads = players.filter((p) => p.source === deps.files.stone.bead);
    expect(beads[0].play).toHaveBeenCalledTimes(1);
    expect(beads[1].play).toHaveBeenCalledTimes(1);
    // Never played yet: no seek needed before the first click.
    expect(beads[0].seekTo).not.toHaveBeenCalled();
  });

  it("replays a used player only after its seek to 0 has resolved", async () => {
    const { deps, players } = fakeDeps();
    const engine = createTasbeehSoundEngine(deps, "stone", 0.5);
    const beads = players.filter((p) => p.source === deps.files.stone.bead);
    let resolveSeek: () => void = () => {};
    beads[0].seekTo.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSeek = resolve;
        }),
    );
    // Wrap the pool: the next bead click reuses player 0.
    for (let i = 0; i < POOL_SIZES.bead; i++) engine.play("bead", i * 100);
    expect(beads[0].play).toHaveBeenCalledTimes(1);
    expect(engine.play("bead", 10_000)).toBe(true);
    expect(beads[0].seekTo).toHaveBeenCalledWith(0);
    expect(beads[0].play).toHaveBeenCalledTimes(1);
    await act(async () => resolveSeek());
    expect(beads[0].play).toHaveBeenCalledTimes(2);
  });

  it("re-arms a player when its click finishes, so the next use starts at once", async () => {
    const { deps, players } = fakeDeps();
    const listeners = new Map<object, (status: { didJustFinish?: boolean }) => void>();
    const create = deps.createAudioPlayer;
    deps.createAudioPlayer = (source) => {
      const player = create(source);
      player.addListener = (_event, listener) => {
        listeners.set(player, listener);
        return { remove: jest.fn() };
      };
      return player;
    };
    const engine = createTasbeehSoundEngine(deps, "stone", 0.5);
    const beads = players.filter((p) => p.source === deps.files.stone.bead);
    for (let i = 0; i < POOL_SIZES.bead; i++) engine.play("bead", i * 100);
    await act(async () => listeners.get(beads[0])?.({ didJustFinish: true }));
    expect(beads[0].seekTo).toHaveBeenCalledWith(0);
    engine.play("bead", 10_000);
    // Already rewound: plays synchronously.
    expect(beads[0].play).toHaveBeenCalledTimes(2);
  });

  it("never drops a click for a real count: same-instant counts are spaced", () => {
    jest.useFakeTimers();
    const { deps, players } = fakeDeps();
    const engine = createTasbeehSoundEngine(deps, "stone", 0.5);
    const beads = players.filter((p) => p.source === deps.files.stone.bead);
    const played = () => beads.reduce((n, p) => n + p.play.mock.calls.length, 0);
    // A fast swipe: four counts in the same millisecond.
    for (let i = 0; i < 4; i++) expect(engine.play("bead", 1000)).toBe(true);
    expect(played()).toBe(1);
    jest.advanceTimersByTime(CLICK_SPACING_MS);
    expect(played()).toBe(2);
    jest.advanceTimersByTime(CLICK_SPACING_MS * 2);
    expect(played()).toBe(4);
    // Ordinary fast taps (well over the spacing apart) play straight away.
    expect(engine.play("bead", 5000)).toBe(true);
    expect(engine.play("bead", 5060)).toBe(true);
    expect(played()).toBe(6);
  });

  it("trims only a runaway backlog, and release cancels pending clicks", () => {
    jest.useFakeTimers();
    const { deps, players } = fakeDeps();
    const engine = createTasbeehSoundEngine(deps, "stone", 0.5);
    const beads = players.filter((p) => p.source === deps.files.stone.bead);
    const results = Array.from({ length: MAX_QUEUED_CLICKS + 3 }, () => engine.play("bead", 0));
    expect(results.filter(Boolean)).toHaveLength(MAX_QUEUED_CLICKS + 1);
    engine.release();
    jest.runAllTimers();
    expect(beads.reduce((n, p) => n + p.play.mock.calls.length, 0)).toBe(1);
  });

  it("never skips the completion cue, even right after the final click", () => {
    const { deps, players } = fakeDeps();
    const engine = createTasbeehSoundEngine(deps, "woodSoft", 0.6);
    expect(engine.play("bead", 1000)).toBe(true);
    expect(engine.play("complete", 1001)).toBe(true);
    const complete = players.find((p) => p.source === deps.files.woodSoft.complete);
    expect(complete?.play).toHaveBeenCalledTimes(1);
  });

  it("changes volume and releases every player once", () => {
    const { deps, players } = fakeDeps();
    const engine = createTasbeehSoundEngine(deps, "glass", 0.5);
    engine.setVolume(0.2);
    expect(players.every((p) => p.volume === 0.2)).toBe(true);
    engine.release();
    engine.release();
    expect(players.every((p) => p.remove.mock.calls.length === 1)).toBe(true);
    expect(engine.play("bead", 10_000)).toBe(false);
  });

  it("mixes with other audio and respects the silent switch while counting", async () => {
    const { deps } = fakeDeps();
    await applyTasbeehAudioMode(deps, true);
    expect(deps.setAudioModeAsync).toHaveBeenLastCalledWith(TASBEEH_AUDIO_MODE);
    expect(TASBEEH_AUDIO_MODE).toMatchObject({
      playsInSilentMode: false,
      interruptionMode: "mixWithOthers",
    });
    await applyTasbeehAudioMode(deps, false);
    expect(deps.setAudioModeAsync).toHaveBeenLastCalledWith(PLAYBACK_AUDIO_MODE);
  });
});

describe("useTasbeehSound", () => {
  it("loads nothing while sound is off", async () => {
    const loadDeps = jest.fn();
    const { result } = await renderHook(() =>
      useTasbeehSound({
        enabled: false,
        pack: "woodSoft",
        volume: 0.6,
        sharedPlaying: false,
        loadDeps,
      }),
    );
    result.current("bead");
    expect(loadDeps).not.toHaveBeenCalled();
  });

  it("plays once loaded, leaves an active recitation's session alone and cleans up", async () => {
    const { deps, players } = fakeDeps();
    const loadDeps = jest.fn().mockResolvedValue(deps);
    const view = await renderHook(
      ({ sharedPlaying }: { sharedPlaying: boolean }) =>
        useTasbeehSound({ enabled: true, pack: "woodSoft", volume: 0.6, sharedPlaying, loadDeps }),
      { initialProps: { sharedPlaying: true } },
    );
    await act(async () => {});
    view.result.current("bead");
    expect(players.some((p) => p.play.mock.calls.length === 1)).toBe(true);
    expect(deps.setAudioModeAsync).not.toHaveBeenCalled();

    await view.rerender({ sharedPlaying: false });
    await act(async () => {});
    expect(deps.setAudioModeAsync).toHaveBeenCalledWith(TASBEEH_AUDIO_MODE);

    await view.unmount();
    expect(players.every((p) => p.remove.mock.calls.length === 1)).toBe(true);
    expect(deps.setAudioModeAsync).toHaveBeenLastCalledWith(PLAYBACK_AUDIO_MODE);
  });
});
