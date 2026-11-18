import { act, render } from "@testing-library/react-native";
import { AppState, BackHandler } from "react-native";

import { TvRemoteBridge } from "@/components/tv/tv-remote-bridge";
import type { TvHwEvent } from "@/hooks/use-tv-event-handler";
import { registerTvRailBackHandler, setTvRailExpanded } from "@/lib/tv/tv-rail-back";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
} from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";

const mockSetMenuKey = jest.fn();
let mockRemoteHandler: ((event: TvHwEvent) => void) | null = null;
const mockAudio = {
  current: { id: "track" } as object | null,
  queue: [1, 2] as unknown[],
  isPlaying: true,
  toggle: jest.fn(),
  next: jest.fn(),
  previous: jest.fn(),
};

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/providers/audio-player-provider", () => ({
  useAudioPlayerContext: () => mockAudio,
}));
jest.mock("@/hooks/use-tv-event-handler", () => ({
  ...jest.requireActual("@/hooks/use-tv-event-handler"),
  setTvMenuKeyEnabled: (enabled: boolean) => mockSetMenuKey(enabled),
  useTvEventHandler: (handler: (event: TvHwEvent) => void) => {
    mockRemoteHandler = handler;
  },
}));

let backHandler: (() => boolean) | null = null;
let appStateHandler: ((state: string) => void) | null = null;

async function renderBridge() {
  return render(<TvRemoteBridge />);
}

async function remote(eventType: string, eventKeyAction?: number) {
  await act(async () => {
    mockRemoteHandler?.({ eventType, eventKeyAction } as TvHwEvent);
  });
}

describe("TvRemoteBridge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetExpoRouterMock();
    mockRouterCanDismiss.mockReturnValue(false);
    Object.assign(mockAudio, { current: { id: "track" }, queue: [1, 2], isPlaying: true });
    mockRemoteHandler = null;
    backHandler = null;
    appStateHandler = null;
    setTvRailExpanded(false);
    registerTvRailBackHandler(null);
    jest.spyOn(BackHandler, "addEventListener").mockImplementation((_event, handler) => {
      backHandler = handler as () => boolean;
      return { remove: jest.fn() };
    });
    jest.spyOn(AppState, "addEventListener").mockImplementation((_event, handler) => {
      appStateHandler = handler as (state: string) => void;
      return { remove: jest.fn() } as unknown as ReturnType<typeof AppState.addEventListener>;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("off TV", () => {
    it("registers no back or app-state listeners", async () => {
      await renderBridge();
      expect(BackHandler.addEventListener).not.toHaveBeenCalled();
      expect(AppState.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe("on Apple TV", () => {
    usePlatform({ OS: "ios", isTV: true });

    it.each([
      ["playpause", "toggle"],
      ["fastforward", "next"],
      ["rewind", "previous"],
    ] as const)("maps the %s key to %s", async (eventType, action) => {
      await renderBridge();
      await remote(eventType);
      expect(mockAudio[action]).toHaveBeenCalled();
    });

    it("ignores key-up events", async () => {
      await renderBridge();
      await remote("playpause", 0);
      expect(mockAudio.toggle).not.toHaveBeenCalled();
    });

    it("ignores media keys with nothing loaded", async () => {
      mockAudio.current = null;
      await renderBridge();
      await remote("playpause");
      await remote("next");
      await remote("previous");
      expect(mockAudio.toggle).not.toHaveBeenCalled();
      expect(mockAudio.next).not.toHaveBeenCalled();
      expect(mockAudio.previous).not.toHaveBeenCalled();
    });

    it("leaves menu events to the back handler", async () => {
      await renderBridge();
      await remote("menu");
      expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it("captures the Menu key while back has an in-app meaning", async () => {
      await renderBridge();
      expect(mockSetMenuKey).toHaveBeenLastCalledWith(true);
    });

    it("releases the Menu key when the rail is expanded at a tab root", async () => {
      await renderBridge();
      await act(async () => setTvRailExpanded(true));
      expect(mockSetMenuKey).toHaveBeenLastCalledWith(false);
    });

    it("releases the Menu key on unmount", async () => {
      const utils = await renderBridge();
      mockSetMenuKey.mockClear();
      await utils.unmount();
      expect(mockSetMenuKey).toHaveBeenCalledWith(false);
    });

    it("pops a nested stack on back and debounces repeats", async () => {
      mockRouterCanDismiss.mockReturnValue(true);
      await renderBridge();
      expect(backHandler?.()).toBe(true);
      expect(backHandler?.()).toBe(true);
      expect(mockRouter.back).toHaveBeenCalledTimes(1);
    });

    it("expands the side rail when content has focus", async () => {
      const expand = jest.fn(() => true);
      registerTvRailBackHandler(expand);
      await renderBridge();
      expect(backHandler?.()).toBe(true);
      expect(expand).toHaveBeenCalled();
    });

    it("hands back to the system at a tab root", async () => {
      await renderBridge();
      expect(backHandler?.()).toBe(false);
    });

    it("pauses playback when the app leaves the foreground", async () => {
      await renderBridge();
      appStateHandler?.("background");
      expect(mockAudio.toggle).toHaveBeenCalledTimes(1);
    });

    it("keeps playing while active", async () => {
      await renderBridge();
      appStateHandler?.("active");
      expect(mockAudio.toggle).not.toHaveBeenCalled();
    });
  });

  describe("on Android TV", () => {
    usePlatform({ OS: "android", isTV: true });

    it("never toggles the tvOS Menu key", async () => {
      await renderBridge();
      expect(mockSetMenuKey).not.toHaveBeenCalled();
    });

    it("skips queue navigation for a single track", async () => {
      mockAudio.queue = [1];
      await renderBridge();
      await remote("next");
      await remote("previous");
      expect(mockAudio.next).not.toHaveBeenCalled();
      expect(mockAudio.previous).not.toHaveBeenCalled();
    });
  });
});
