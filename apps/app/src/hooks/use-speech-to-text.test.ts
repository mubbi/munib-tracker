import { act, renderHook } from "@testing-library/react-native";

import { claimMicrophone, microphoneOwner, releaseMicrophone } from "@/lib/speech/mic-owner";
import { captureAppStateListener } from "@/test-support/app-state";
import { isolateWithSharedReact } from "@/test-support/isolate";
import { setPlatform } from "@/test-support/platform";

import { type UseSpeechToTextOptions, useSpeechToText } from "./use-speech-to-text";

type Handler = (event?: unknown) => void;

/** Latest event handlers per mounted hook instance (keyed by a per-instance symbol). */
const mockHandlers = new Map<symbol, Record<string, Handler>>();

jest.mock("expo-speech-recognition", () => {
  const { useRef } = require("react");
  return {
    useSpeechRecognitionEvent: (name: string, handler: Handler) => {
      const key = useRef(Symbol("instance")).current as symbol;
      const handlers = mockHandlers.get(key) ?? {};
      handlers[name] = handler;
      mockHandlers.set(key, handlers);
    },
  };
});

/** Shared across the isolated (web) module registry too, so delegate lazily. */
const mockStt = {
  abortStt: jest.fn(),
  isSttAvailable: jest.fn(() => true),
  requestSttPermissions: jest.fn(async () => ({ granted: true })),
  startStt: jest.fn(),
  stopStt: jest.fn(),
  sttLangCandidates: jest.fn(() => ["ur-PK", "ur-IN", "ar-SA"]),
};

jest.mock("@/lib/stt", () => ({
  ...jest.requireActual("@/lib/stt"),
  abortStt: () => mockStt.abortStt(),
  isSttAvailable: () => mockStt.isSttAvailable(),
  requestSttPermissions: () => mockStt.requestSttPermissions(),
  startStt: (options: unknown) => mockStt.startStt(options),
  stopStt: () => mockStt.stopStt(),
  sttLangCandidates: () => mockStt.sttLangCandidates(),
}));

const { abortStt, stopStt } = mockStt;
const appState = captureAppStateListener();
const startSttMock = mockStt.startStt as jest.Mock;
const permissionsMock = mockStt.requestSttPermissions as jest.Mock;
const availableMock = mockStt.isSttAvailable;

/** Broadcasts a recognizer event to every mounted instance, like the native module. */
async function emit(name: string, event?: unknown) {
  await act(async () => {
    for (const handlers of mockHandlers.values()) handlers[name]?.(event);
  });
}

async function setup(
  overrides: Partial<UseSpeechToTextOptions> = {},
  useHook: typeof useSpeechToText = useSpeechToText,
) {
  const options = { onTranscript: jest.fn(), onError: jest.fn(), uiLocale: "ur", ...overrides };
  const hook = await renderHook(() => useHook(options));
  return { ...hook, options };
}

type Setup = Awaited<ReturnType<typeof setup>>;

async function startListening(hook: Setup, base = "", field = "note") {
  let started: boolean | undefined;
  await act(async () => {
    started = await hook.result.current.start(field, base, "other");
  });
  await emit("start");
  return started;
}

let restorePlatform: () => void = () => {};

beforeEach(() => {
  jest.clearAllMocks();
  mockHandlers.clear();
  availableMock.mockReturnValue(true);
  permissionsMock.mockResolvedValue({ granted: true });
  startSttMock.mockImplementation(() => {});
});

afterEach(() => {
  restorePlatform();
  restorePlatform = () => {};
});

describe("useSpeechToText — availability", () => {
  it("is available when the recognizer exists", async () => {
    const { result, unmount } = await setup();
    expect(result.current.available).toBe(true);
    expect(result.current.listening).toBe(false);
    await unmount();
  });

  it("is unavailable on TV and refuses to start", async () => {
    restorePlatform = setPlatform({ isTV: true });
    const hook = await setup();
    expect(hook.result.current.available).toBe(false);
    expect(await startListening(hook)).toBe(false);
    expect(hook.options.onError).toHaveBeenCalledWith("unavailable");
    expect(startSttMock).not.toHaveBeenCalled();
    await hook.unmount();
  });
});

describe("useSpeechToText — sessions", () => {
  it("starts with the first language candidate and tracks the active field", async () => {
    const hook = await setup();
    expect(await startListening(hook, "", "title")).toBe(true);
    expect(startSttMock).toHaveBeenCalledWith({
      lang: "ur-PK",
      interimResults: true,
      continuous: true,
      volumeMetering: true,
    });
    expect(hook.result.current.listening).toBe(true);
    expect(hook.result.current.activeField).toBe("title");
    await hook.unmount();
    expect(abortStt).toHaveBeenCalled();
  });

  it("falls back to en-US when there are no candidates", async () => {
    mockStt.sttLangCandidates.mockReturnValueOnce([]);
    const hook = await setup();
    await startListening(hook);
    expect(startSttMock).toHaveBeenCalledWith(expect.objectContaining({ lang: "en-US" }));
    await hook.unmount();
  });

  it("reports a denied permission", async () => {
    permissionsMock.mockResolvedValueOnce({ granted: false });
    const hook = await setup();
    expect(await startListening(hook)).toBe(false);
    expect(hook.options.onError).toHaveBeenCalledWith("permission");
    expect(hook.result.current.activeField).toBeNull();
    await hook.unmount();
  });

  it("reports a recognizer that fails to launch", async () => {
    startSttMock.mockImplementationOnce(() => {
      throw new Error("busy");
    });
    const hook = await setup();
    expect(await startListening(hook)).toBe(false);
    expect(hook.options.onError).toHaveBeenCalledWith("unavailable");
    expect(hook.result.current.activeField).toBeNull();
    await hook.unmount();
  });

  it("merges interim and final results onto the existing value", async () => {
    const hook = await setup();
    await startListening(hook, "Bismillah");
    await emit("result", { isFinal: false, results: [{ transcript: "ar" }] });
    expect(hook.result.current.transcript).toBe("ar");
    expect(hook.options.onTranscript).toHaveBeenLastCalledWith("Bismillah ar");
    await emit("result", { isFinal: true, results: [{ transcript: "ar-Rahman" }] });
    expect(hook.result.current.transcript).toBe("ar-Rahman");
    expect(hook.options.onTranscript).toHaveBeenLastCalledWith("Bismillah ar-Rahman");
    await emit("result", { isFinal: false, results: [] });
    expect(hook.options.onTranscript).toHaveBeenLastCalledWith("Bismillah ar-Rahman");
    await hook.unmount();
  });

  it("drives the level from volume events", async () => {
    const hook = await setup();
    await startListening(hook);
    await emit("volumechange", { value: 10 });
    expect(hook.result.current.level.value).toBe(1);
    await emit("volumechange", undefined);
    expect(hook.result.current.level.value).toBe(0);
    await hook.unmount();
  });

  it("ignores the web-only speech start/end pulses on native", async () => {
    const hook = await setup();
    await startListening(hook);
    await emit("speechstart");
    expect(hook.result.current.level.value).toBe(0);
    await emit("speechend");
    await hook.unmount();
  });

  it("finishes on end and resets state", async () => {
    const hook = await setup();
    await startListening(hook);
    await emit("end");
    expect(hook.result.current.listening).toBe(false);
    expect(hook.result.current.activeField).toBeNull();
    // Released ownership: events no longer reach this instance.
    await emit("result", { isFinal: true, results: [{ transcript: "x" }] });
    expect(hook.options.onTranscript).not.toHaveBeenCalled();
    await hook.unmount();
    expect(abortStt).not.toHaveBeenCalled();
  });

  it("stops only its own session", async () => {
    const hook = await setup();
    await act(async () => {
      hook.result.current.stop();
    });
    expect(stopStt).not.toHaveBeenCalled();
    await startListening(hook);
    await act(async () => {
      hook.result.current.stop();
    });
    expect(stopStt).toHaveBeenCalled();
    await hook.unmount();
  });

  it("aborts its session and clears the transcript", async () => {
    const hook = await setup();
    await act(async () => {
      hook.result.current.abort();
    });
    expect(abortStt).not.toHaveBeenCalled();
    await startListening(hook);
    await emit("result", { isFinal: false, results: [{ transcript: "abc" }] });
    await act(async () => {
      hook.result.current.abort();
    });
    expect(abortStt).toHaveBeenCalled();
    expect(hook.result.current.transcript).toBe("");
    expect(hook.result.current.listening).toBe(false);
    await hook.unmount();
  });

  it("aborts before listening started without clearing state", async () => {
    const hook = await setup();
    await act(async () => {
      await hook.result.current.start("note", "", "other");
    });
    await act(async () => {
      hook.result.current.abort();
    });
    expect(abortStt).toHaveBeenCalledTimes(1);
    expect(hook.result.current.activeField).toBeNull();
    await hook.unmount();
  });

  it("restarting its own session suppresses the resulting abort error", async () => {
    const hook = await setup();
    await startListening(hook);
    await startListening(hook);
    expect(abortStt).toHaveBeenCalledTimes(1);
    await emit("error", { error: "aborted" });
    expect(hook.options.onError).not.toHaveBeenCalled();
    await hook.unmount();
  });
});

describe("useSpeechToText — errors", () => {
  it("ignores user aborts", async () => {
    const hook = await setup();
    await startListening(hook);
    await emit("error", { error: "aborted" });
    expect(hook.options.onError).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it.each(["no-speech", "speech-timeout"])("ignores %s while listening", async (error) => {
    const hook = await setup();
    await startListening(hook);
    await emit("error", { error });
    expect(hook.options.onError).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("reports no-speech before listening started", async () => {
    const hook = await setup();
    await act(async () => {
      await hook.result.current.start("note", "", "other");
    });
    await emit("error", { error: "no-speech" });
    expect(hook.options.onError).toHaveBeenCalledWith("noSpeech");
    await hook.unmount();
  });

  it("classifies other errors", async () => {
    const hook = await setup();
    await startListening(hook);
    await emit("error", { error: "not-allowed" });
    expect(hook.options.onError).toHaveBeenCalledWith("permission");
    await hook.unmount();
  });

  it("retries the next language when one is not supported", async () => {
    const hook = await setup();
    await startListening(hook);
    await emit("error", { error: "language-not-supported" });
    expect(hook.options.onError).not.toHaveBeenCalled();
    await emit("end");
    expect(startSttMock).toHaveBeenLastCalledWith(expect.objectContaining({ lang: "ur-IN" }));
    expect(hook.result.current.listening).toBe(true);
    await hook.unmount();
  });

  it("reports unavailable when the language retry cannot launch", async () => {
    const hook = await setup();
    await startListening(hook);
    await emit("error", { error: "language-not-supported" });
    startSttMock.mockImplementationOnce(() => {
      throw new Error("nope");
    });
    await emit("end");
    expect(hook.options.onError).toHaveBeenCalledWith("unavailable");
    expect(hook.result.current.listening).toBe(false);
    await hook.unmount();
  });

  it("reports unsupported language once fallbacks run out", async () => {
    mockStt.sttLangCandidates.mockReturnValueOnce(["ur-PK"]);
    const hook = await setup();
    await startListening(hook);
    await emit("error", { error: "language-not-supported" });
    expect(hook.options.onError).toHaveBeenCalledWith("unavailable");
    await hook.unmount();
  });
});

describe("useSpeechToText — multiple screens", () => {
  it("lets only the owning instance react and hands over on start", async () => {
    const first = await setup();
    const second = await setup();
    await startListening(first);
    await emit("result", { isFinal: true, results: [{ transcript: "one" }] });
    expect(first.options.onTranscript).toHaveBeenCalledWith("one");
    expect(second.options.onTranscript).not.toHaveBeenCalled();

    // Another screen takes over the singleton recognizer.
    await startListening(second);
    expect(abortStt).toHaveBeenCalledTimes(1);
    await emit("error", { error: "network" });
    expect(second.options.onError).toHaveBeenCalledWith("generic");
    expect(first.options.onError).not.toHaveBeenCalled();
    await emit("volumechange", { value: 10 });
    expect(first.result.current.level.value).toBe(0);
    await emit("start");
    await emit("speechstart");
    await emit("speechend");

    // Unmounting a non-owner leaves the session alone.
    await first.unmount();
    expect(abortStt).toHaveBeenCalledTimes(1);
    await second.unmount();
    expect(abortStt).toHaveBeenCalledTimes(2);
  });
});

describe("useSpeechToText — microphone ownership", () => {
  it("owns the mic while dictating and gives it back on end", async () => {
    const hook = await setup();
    await startListening(hook);
    expect(microphoneOwner()).toBe("dictation");
    await emit("end");
    expect(microphoneOwner()).toBeNull();
    await hook.unmount();
  });

  it("stops when another listener claims the mic", async () => {
    const hook = await setup();
    await startListening(hook);
    const other = () => {};
    await act(async () => {
      await claimMicrophone("pronunciation", other);
    });
    expect(abortStt).toHaveBeenCalledTimes(1);
    expect(hook.result.current.listening).toBe(false);
    expect(hook.result.current.activeField).toBeNull();
    expect(microphoneOwner()).toBe("pronunciation");
    releaseMicrophone(other);
    await hook.unmount();
  });

  it("drops the dictation when the app leaves the foreground", async () => {
    const hook = await setup();
    await startListening(hook);
    expect(appState.isArmed()).toBe(true);
    await act(async () => appState.emit("background"));
    expect(abortStt).toHaveBeenCalledTimes(1);
    expect(hook.result.current.listening).toBe(false);
    expect(microphoneOwner()).toBeNull();
    expect(appState.isArmed()).toBe(false);
    await hook.unmount();
  });

  it("gives the mic back when the permission is denied", async () => {
    permissionsMock.mockResolvedValueOnce({ granted: false });
    const hook = await setup();
    await startListening(hook);
    expect(microphoneOwner()).toBeNull();
    await hook.unmount();
  });
});

describe("useSpeechToText — web", () => {
  /**
   * `IS_WEB` is read at import time, so load the hook in an isolated registry
   * (sharing this file's React so `renderHook` can drive it).
   */
  function loadWebHook(): typeof useSpeechToText {
    return isolateWithSharedReact(() => {
      // The isolated registry has its own react-native `Platform`.
      const isolated =
        require("@/test-support/platform") as typeof import("@/test-support/platform");
      restorePlatform = isolated.setPlatform({ OS: "web" });
      return (require("./use-speech-to-text") as typeof import("./use-speech-to-text"))
        .useSpeechToText;
    });
  }

  async function setupWeb() {
    const useWebSpeechToText = loadWebHook();
    return setup({}, useWebSpeechToText);
  }

  it("pulses the level while speech is heard", async () => {
    const web = await setupWeb();
    await startListening(web);
    await emit("speechstart");
    expect(web.result.current.level.value).toBe(0.55);
    await emit("speechend");
    expect(web.result.current.level.value).toBe(0);
    await web.unmount();
  });

  it("refuses to start in browsers without the Web Speech API", async () => {
    availableMock.mockReturnValue(false);
    const web = await setupWeb();
    expect(web.result.current.available).toBe(false);
    expect(await startListening(web)).toBe(false);
    expect(web.options.onError).toHaveBeenCalledWith("unavailable");
    expect(startSttMock).not.toHaveBeenCalled();
    await web.unmount();
  });
});
