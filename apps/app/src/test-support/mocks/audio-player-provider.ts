/**
 * Shared `@/providers/audio-player-provider` mock: an idle player whose controls
 * are stable `jest.fn()`s. Also keeps `expo-audio` (native, throws under Jest)
 * out of the module graph for anything that only needs the context.
 *
 *   jest.mock("@/providers/audio-player-provider", () =>
 *     require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock);
 *   import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
 *   beforeEach(resetAudioPlayerMock);
 *   expect(mockAudioPlayer.play).toHaveBeenCalled();
 *
 * Mutate state fields (e.g. `mockAudioPlayer.current = track`) per test.
 */
import type { ReactNode } from "react";

const idleState = () => ({
  current: null as { id: string; [key: string]: unknown } | null,
  queue: [] as unknown[],
  index: 0,
  trackDurations: {} as Record<string, number>,
  isPlaying: false,
  isBuffering: false,
  isTransitioning: false,
  isLoaded: false,
  duration: 0,
  queueDuration: 0,
  isQueueFinished: false,
  rate: 1,
  volume: 1,
  loopMode: "off",
  repeatPlan: { kind: "off" },
  translationAudio: "off",
  isSpeakingTranslation: false,
  sourceHref: null as string | null,
});

const controls = {
  play: jest.fn(),
  toggle: jest.fn(),
  seekTo: jest.fn(),
  seekToQueuePosition: jest.fn(),
  next: jest.fn(),
  previous: jest.fn(),
  jumpTo: jest.fn(),
  replay: jest.fn(),
  setRate: jest.fn(),
  setVolume: jest.fn(),
  setTtsVoice: jest.fn(),
  cycleLoopMode: jest.fn(),
  setRepeatPlan: jest.fn(),
  setTranslationAudio: jest.fn(),
  stop: jest.fn(),
  readPlaybackSeconds: jest.fn(() => 0),
};

export const mockAudioPlayer = { ...idleState(), ...controls };

export const mockAudioProgress = { position: 0, queuePosition: 0, queueProgress: 0 };

/** Back to an idle player with cleared call history. Use in `beforeEach`. */
export function resetAudioPlayerMock(): void {
  Object.assign(mockAudioPlayer, idleState());
  for (const fn of Object.values(controls)) fn.mockClear();
  Object.assign(mockAudioProgress, { position: 0, queuePosition: 0, queueProgress: 0 });
}

export const audioPlayerProviderMock = {
  __esModule: true,
  AudioPlayerProvider: ({ children }: { children: ReactNode }) => children,
  useAudioPlayerContext: () => mockAudioPlayer,
  useAudioProgressContext: () => mockAudioProgress,
};
