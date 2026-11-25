import { act, renderHook } from "@testing-library/react-native";

import { NO_VOICE, type VoiceTasbeeh } from "@/hooks/use-voice-tasbeeh";
import type { VoiceStopReason } from "@/lib/tasbeeh-voice/session";
import type { VoiceZikr } from "@/lib/tasbeeh-voice/voice-zikr";

import { useVoiceTasbeehSteps } from "./use-voice-tasbeeh-steps";

let mockVoice: VoiceTasbeeh;
let mockAutoStop: ((reason: VoiceStopReason, code: string | null) => void) | undefined;
let mockHookZikr: VoiceZikr | null = null;
jest.mock("@/hooks/use-voice-tasbeeh", () => {
  const actual = jest.requireActual("@/hooks/use-voice-tasbeeh");
  return {
    ...actual,
    useVoiceTasbeeh: (options: {
      zikr: VoiceZikr | null;
      onAutoStop?: (reason: VoiceStopReason, code: string | null) => void;
    }) => {
      mockAutoStop = options.onAutoStop;
      mockHookZikr = options.zikr;
      return mockVoice;
    },
  };
});

const TASBIH: VoiceZikr = {
  key: "zikr:after_prayer-tasbih",
  label: "SubhanAllah",
  entry: null,
  phrase: "subhanallah",
};
const TAHMID: VoiceZikr = {
  key: "zikr:after_prayer-tahmid",
  label: "Alhamdulillah",
  entry: null,
  phrase: "alhamdulillah",
};

function voice(overrides: Partial<VoiceTasbeeh> = {}): VoiceTasbeeh {
  return {
    ...NO_VOICE,
    platformAvailable: true,
    available: true,
    zikr: TASBIH,
    taught: true,
    permission: "granted",
    start: jest.fn(async () => "started" as const),
    stop: jest.fn(),
    startTeaching: jest.fn(async () => "started" as const),
    cancelTeaching: jest.fn(),
    ...overrides,
  };
}

type Props = { zikr: VoiceZikr | null; count: number; active: boolean; eligible: boolean };
const base: Props = { zikr: TASBIH, count: 0, active: true, eligible: true };

function renderSteps(initial: Props = base) {
  return renderHook(
    (props: Props) => useVoiceTasbeehSteps({ ...props, target: 33, onVoiceCount: jest.fn() }),
    { initialProps: initial },
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  mockVoice = voice();
  mockAutoStop = undefined;
  mockHookZikr = null;
});

afterEach(() => {
  jest.useRealTimers();
});

describe("hands-free across a run of zikr (D69)", () => {
  it("starts listening for a taught zikr once switched on", async () => {
    const { result } = await renderSteps();
    expect(result.current.offered).toBe(true);
    expect(mockVoice.start).not.toHaveBeenCalled();
    await act(async () => result.current.toggle());
    await act(async () => jest.advanceTimersByTime(400));
    expect(mockVoice.start).toHaveBeenCalledWith(undefined);
  });

  it("asks to teach or skip for an untaught zikr, then counts pauses after skipping (D50)", async () => {
    mockVoice = voice({ taught: false });
    const { result } = await renderSteps();
    await act(async () => result.current.toggle());
    expect(result.current.needsChoice).toBe(true);
    await act(async () => jest.advanceTimersByTime(400));
    expect(mockVoice.start).not.toHaveBeenCalled();
    await act(async () => result.current.skipTeaching());
    await act(async () => jest.advanceTimersByTime(400));
    expect(mockVoice.start).toHaveBeenCalledWith({ skipTeaching: true });
  });

  it("teaches inline from the choice", async () => {
    mockVoice = voice({ taught: false });
    const { result } = await renderSteps();
    await act(async () => result.current.toggle());
    await act(async () => result.current.teach());
    expect(mockVoice.startTeaching).toHaveBeenCalledTimes(1);
  });

  it("opens the first-use sheet when the microphone is not allowed yet", async () => {
    mockVoice = voice({ permission: "undetermined" });
    const { result } = await renderSteps();
    await act(async () => result.current.toggle());
    expect(result.current.sheetOpen).toBe(true);
    await act(async () => jest.advanceTimersByTime(400));
    expect(mockVoice.start).not.toHaveBeenCalled();
    // "Not now": nothing started, so hands-free switches back off.
    await act(async () => result.current.closeSheet());
    expect(result.current.on).toBe(false);
  });

  it("closes the microphone when the step stops being a counting step", async () => {
    const { result, rerender } = await renderSteps();
    await act(async () => result.current.toggle());
    mockVoice = voice({ listening: true, countingMode: "template" });
    await act(async () => rerender(base));
    // Listening for this step: nothing to do.
    expect(mockVoice.stop).not.toHaveBeenCalled();
    await act(async () => rerender({ ...base, active: false }));
    expect(mockVoice.stop).toHaveBeenCalledWith("user");
  });

  it("restarts for the next zikr when the step changes under an open microphone", async () => {
    const { result, rerender } = await renderSteps();
    await act(async () => result.current.toggle());
    mockVoice = voice({ listening: true, countingMode: "template" });
    await act(async () => rerender(base));
    expect(mockVoice.stop).not.toHaveBeenCalled();
    await act(async () => rerender({ ...base, zikr: TAHMID }));
    expect(mockHookZikr?.key).toBe(TAHMID.key);
    expect(mockVoice.stop).toHaveBeenCalledWith("user");
    // The old session ends; the next zikr starts after the short pause.
    mockVoice = voice({ zikr: TAHMID });
    await act(async () => rerender({ ...base, zikr: TAHMID }));
    await act(async () => jest.advanceTimersByTime(400));
    expect(mockVoice.start).toHaveBeenCalledTimes(1);
  });

  it("does not listen on steps that are not offered hands-free (long or single recitations)", async () => {
    const { result } = await renderSteps({ ...base, eligible: false });
    await act(async () => result.current.toggle());
    await act(async () => jest.advanceTimersByTime(400));
    expect(mockHookZikr).toBeNull();
    expect(mockVoice.start).not.toHaveBeenCalled();
  });

  it("keeps going after a target stop, but switches off when listening stops on its own", async () => {
    const { result } = await renderSteps();
    await act(async () => result.current.toggle());
    await act(async () => mockAutoStop?.("target", null));
    expect(result.current.on).toBe(true);
    await act(async () => mockAutoStop?.("silence", null));
    expect(result.current.on).toBe(false);
    expect(result.current.stopNotice).toBe("silence");
  });

  it("never offers hands-free where the platform cannot listen", async () => {
    mockVoice = voice({ platformAvailable: false, available: false });
    const { result } = await renderSteps();
    expect(result.current.offered).toBe(false);
  });
});
