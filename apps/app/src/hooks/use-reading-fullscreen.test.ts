import { act, cleanup, renderHook } from "@testing-library/react-native";

import { useReadingFullscreen, useWebFullscreen } from "@/hooks/use-reading-fullscreen";
import { getReadingFullscreenActive, setReadingFullscreenActive } from "@/lib/reading-fullscreen";
import { usePlatform } from "@/test-support/platform";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

async function setup(options?: { exitOnBlur?: boolean }) {
  return renderHook(() => useReadingFullscreen(options));
}

beforeEach(() => {
  setReadingFullscreenActive(false);
});

describe.each(["ios", "android"] as const)("useReadingFullscreen on %s", (OS) => {
  usePlatform({ OS });

  it("is supported and starts inactive", async () => {
    const { result } = await setup();
    expect(result.current.supported).toBe(true);
    expect(result.current.active).toBe(false);
  });

  it("toggles immersive mode on and off", async () => {
    const { result } = await setup();
    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.active).toBe(true);
    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.active).toBe(false);
  });

  it("exits immersive mode", async () => {
    const { result } = await setup();
    await act(async () => {
      await result.current.toggle();
      await result.current.exit();
    });
    expect(result.current.active).toBe(false);
  });

  it("exits on blur when exitOnBlur is set", async () => {
    const { result, unmount } = await setup({ exitOnBlur: true });
    await act(async () => {
      await result.current.toggle();
    });
    await unmount();
    expect(getReadingFullscreenActive()).toBe(false);
  });

  it("stays immersive on blur by default", async () => {
    const { result, unmount } = await setup();
    await act(async () => {
      await result.current.toggle();
    });
    await unmount();
    expect(getReadingFullscreenActive()).toBe(true);
  });
});

describe("useReadingFullscreen on TV", () => {
  usePlatform({ OS: "android", isTV: true });

  it("is unsupported and ignores toggle/exit", async () => {
    const { result } = await setup();
    expect(result.current.supported).toBe(false);
    await act(async () => {
      await result.current.toggle();
      await result.current.exit();
    });
    expect(result.current.active).toBe(false);
  });
});

describe("useReadingFullscreen on web", () => {
  usePlatform({ OS: "web" });

  type FakeDocument = {
    fullscreenEnabled?: boolean;
    fullscreenElement?: object | null;
    webkitFullscreenElement?: object | null;
    documentElement: { requestFullscreen?: jest.Mock; webkitRequestFullscreen?: jest.Mock };
    exitFullscreen?: jest.Mock;
    webkitExitFullscreen?: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  function installDocument(overrides: Partial<FakeDocument> = {}): FakeDocument {
    const doc: FakeDocument = {
      fullscreenEnabled: true,
      fullscreenElement: null,
      documentElement: { requestFullscreen: jest.fn(async () => undefined) },
      exitFullscreen: jest.fn(async () => undefined),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      ...overrides,
    };
    Object.defineProperty(globalThis, "document", { configurable: true, value: doc });
    return doc;
  }

  /** Simulates the browser entering/leaving fullscreen and firing `fullscreenchange`. */
  async function fireChange(doc: FakeDocument, element: object | null) {
    doc.fullscreenElement = element;
    const listener = doc.addEventListener.mock.calls.find(
      ([type]) => type === "fullscreenchange",
    )?.[1];
    await act(async () => listener?.());
  }

  afterEach(async () => {
    // Unmount while the fake document still exists (the hook removes listeners).
    await cleanup();
    delete (globalThis as { document?: unknown }).document;
  });

  it("is unsupported without a document", async () => {
    const { result } = await setup();
    expect(result.current.supported).toBe(false);
  });

  it("is unsupported when the Fullscreen API is missing", async () => {
    installDocument({ fullscreenEnabled: false, documentElement: {} });
    const { result } = await setup();
    expect(result.current.supported).toBe(false);
  });

  it("syncs state from the browser and unsubscribes on unmount", async () => {
    const doc = installDocument({ fullscreenElement: {} });
    const { result, unmount } = await setup();
    expect(result.current.active).toBe(true);
    await fireChange(doc, null);
    expect(result.current.active).toBe(false);
    await unmount();
    expect(doc.removeEventListener).toHaveBeenCalledWith("fullscreenchange", expect.any(Function));
    expect(doc.removeEventListener).toHaveBeenCalledWith(
      "webkitfullscreenchange",
      expect.any(Function),
    );
  });

  it("requests fullscreen when not already fullscreen", async () => {
    const doc = installDocument();
    const { result } = await setup();
    await act(async () => {
      await result.current.toggle();
    });
    expect(doc.documentElement.requestFullscreen).toHaveBeenCalled();
  });

  it("falls back to the webkit request API", async () => {
    const webkitRequestFullscreen = jest.fn();
    installDocument({ fullscreenEnabled: false, documentElement: { webkitRequestFullscreen } });
    const { result } = await setup();
    expect(result.current.supported).toBe(true);
    await act(async () => {
      await result.current.toggle();
    });
    expect(webkitRequestFullscreen).toHaveBeenCalled();
  });

  it("exits fullscreen from toggle when fullscreen", async () => {
    const doc = installDocument({ fullscreenElement: {} });
    const { result } = await setup();
    await act(async () => {
      await result.current.toggle();
    });
    expect(doc.exitFullscreen).toHaveBeenCalled();
  });

  it("swallows a blocked fullscreen request", async () => {
    const doc = installDocument();
    doc.documentElement.requestFullscreen?.mockRejectedValueOnce(new Error("denied"));
    const { result } = await setup();
    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.active).toBe(false);
  });

  it("exit clears stale state when the browser is not fullscreen", async () => {
    const doc = installDocument();
    const { result } = await setup();
    await act(async () => setReadingFullscreenActive(true));
    await act(async () => {
      await result.current.exit();
    });
    expect(result.current.active).toBe(false);
    expect(doc.exitFullscreen).not.toHaveBeenCalled();
  });

  it("exit uses the webkit API for webkit fullscreen", async () => {
    const webkitExitFullscreen = jest.fn();
    installDocument({
      fullscreenElement: undefined,
      webkitFullscreenElement: {},
      exitFullscreen: undefined,
      webkitExitFullscreen,
    });
    const { result } = await setup();
    await act(async () => {
      await result.current.exit();
    });
    expect(webkitExitFullscreen).toHaveBeenCalled();
  });

  it("swallows a blocked exit", async () => {
    const doc = installDocument({ fullscreenElement: {} });
    doc.exitFullscreen?.mockRejectedValueOnce(new Error("blocked"));
    const { result } = await setup();
    await act(async () => {
      await result.current.exit();
    });
    expect(result.current.active).toBe(true);
  });
});

describe("useWebFullscreen", () => {
  usePlatform({ OS: "ios" });

  it("is the reading fullscreen hook without blur handling", async () => {
    const { result } = await renderHook(() => useWebFullscreen());
    expect(result.current.supported).toBe(true);
  });
});
