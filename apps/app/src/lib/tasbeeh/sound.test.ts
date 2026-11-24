import { act, renderHook } from "@testing-library/react-native";

import { PLAYBACK_AUDIO_MODE } from "@/lib/audio-session-mode";

import {
  applyTasbeehAudioMode,
  createTasbeehSoundEngine,
  MIN_SOUND_GAP_MS,
  POOL_SIZES,
  shouldPlaySound,
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
  it("skips clicks under 40 ms apart (the count is never skipped)", () => {
    expect(shouldPlaySound(1000, null)).toBe(true);
    expect(shouldPlaySound(1000 + MIN_SOUND_GAP_MS - 1, 1000)).toBe(false);
    expect(shouldPlaySound(1000 + MIN_SOUND_GAP_MS, 1000)).toBe(true);
  });

  it("preloads a round-robin pool and plays from position 0", () => {
    const { deps, players } = fakeDeps();
    const engine = createTasbeehSoundEngine(deps, "stone", 0.5);
    const total = POOL_SIZES.bead + POOL_SIZES.spacer + POOL_SIZES.complete;
    expect(players).toHaveLength(total);
    expect(players.every((p) => p.volume === 0.5)).toBe(true);

    expect(engine.play("bead", 0)).toBe(true);
    expect(engine.play("bead", 100)).toBe(true);
    const beads = players.filter((p) => p.source === deps.files.stone.bead);
    expect(beads[0].play).toHaveBeenCalledTimes(1);
    expect(beads[1].play).toHaveBeenCalledTimes(1);
    expect(beads[0].seekTo).toHaveBeenCalledWith(0);
    expect(engine.play("bead", 120)).toBe(false);
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
