import { act, cleanup, renderHook } from "@testing-library/react-native";
import * as Network from "expo-network";

import { installBrowser } from "@/test-support/browser";
import { setPlatform } from "@/test-support/platform";

import { useIsOnline } from "./use-is-online";

jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(),
  addNetworkStateListener: jest.fn(),
}));

type NetState = { isConnected?: boolean | null; isInternetReachable?: boolean | null };

const getState = Network.getNetworkStateAsync as jest.Mock;
const addListener = Network.addNetworkStateListener as jest.Mock;
const remove = jest.fn();
let networkListener: ((state: NetState) => void) | undefined;

async function setup() {
  const hook = await renderHook(() => useIsOnline());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  getState.mockResolvedValue({ isConnected: true, isInternetReachable: true });
  addListener.mockImplementation((listener: (state: NetState) => void) => {
    networkListener = listener;
    return { remove };
  });
});

describe("useIsOnline (native)", () => {
  it.each<[NetState, boolean]>([
    [{ isConnected: true, isInternetReachable: true }, true],
    [{ isConnected: true, isInternetReachable: null }, true],
    [{ isConnected: false, isInternetReachable: true }, false],
    [{ isConnected: true, isInternetReachable: false }, false],
  ])("maps %j to online=%s", async (state, expected) => {
    getState.mockResolvedValueOnce(state);
    const { result } = await setup();
    expect(result.current).toBe(expected);
  });

  it("assumes online when the state cannot be read", async () => {
    getState.mockRejectedValueOnce(new Error("no module"));
    const { result } = await setup();
    expect(result.current).toBe(true);
  });

  it("follows network changes and unsubscribes on unmount", async () => {
    const { result, unmount } = await setup();
    await act(async () => networkListener?.({ isConnected: false }));
    expect(result.current).toBe(false);
    await unmount();
    expect(remove).toHaveBeenCalled();
  });
});

describe("useIsOnline (web)", () => {
  const windowListeners = new Map<string, () => void>();
  let restore: () => void = () => {};

  function installWeb(onLine: boolean) {
    const restorePlatform = setPlatform({ OS: "web" });
    const restoreBrowser = installBrowser({
      navigator: { onLine },
      window: {
        addEventListener: jest.fn((type: string, cb: () => void) => windowListeners.set(type, cb)),
        removeEventListener: jest.fn((type: string) => windowListeners.delete(type)),
      },
    });
    restore = () => {
      restoreBrowser();
      restorePlatform();
    };
  }

  afterEach(async () => {
    await cleanup(); // unmount while the fake window still exists
    restore();
    windowListeners.clear();
  });

  it("starts from navigator.onLine", async () => {
    installWeb(false);
    const { result } = await setup();
    expect(result.current).toBe(false);
    expect(getState).not.toHaveBeenCalled();
  });

  it("follows online/offline events and removes listeners on unmount", async () => {
    installWeb(true);
    const { result, unmount } = await setup();
    await act(async () => windowListeners.get("offline")?.());
    expect(result.current).toBe(false);
    await act(async () => windowListeners.get("online")?.());
    expect(result.current).toBe(true);
    await unmount();
    expect(windowListeners.size).toBe(0);
  });
});
