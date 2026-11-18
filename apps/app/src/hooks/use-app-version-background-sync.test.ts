import { APP_VERSION_BACKGROUND_POLL_MS, fetchAppVersionMeta } from "@munib-tracker/api-client";
import { act, renderHook } from "@testing-library/react-native";

import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";
import { buildAppVersionMeta } from "@/test-support/fixtures/app-version";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { setPlatform } from "@/test-support/platform";

import { useAppVersionBackgroundSync } from "./use-app-version-background-sync";

jest.mock("@munib-tracker/api-client", () => ({
  APP_VERSION_BACKGROUND_POLL_MS: 30 * 60 * 1000,
  fetchAppVersionMeta: jest.fn(),
}));
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => mockOnline.current }));

const mockOnline = { current: true };
const fetchMock = fetchAppVersionMeta as jest.Mock;
const META = buildAppVersionMeta();
const MINUTE = 60_000;

const appState = captureAppStateListener();
let restorePlatform: () => void = () => {};

async function setup(enabled?: boolean) {
  const onMeta = jest.fn();
  const hook = await renderHook(() => useAppVersionBackgroundSync(onMeta, enabled));
  await flush();
  return { ...hook, onMeta };
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function advance(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
  await flush();
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  resetAuthMock();
  mockOnline.current = true;
  fetchMock.mockResolvedValue(META);
});

afterEach(() => {
  jest.useRealTimers();
  restorePlatform();
  restorePlatform = () => {};
});

describe("useAppVersionBackgroundSync", () => {
  it("checks the version on launch and reports the metadata", async () => {
    const { onMeta } = await setup();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onMeta).toHaveBeenCalledWith(META);
  });

  it("skips empty metadata", async () => {
    fetchMock.mockResolvedValueOnce(null);
    const { onMeta } = await setup();
    expect(onMeta).not.toHaveBeenCalled();
  });

  it("does nothing when disabled", async () => {
    await setup(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-checks on foreground only after the minimum interval", async () => {
    await setup();
    await act(async () => appState.emit("active"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    jest.setSystemTime(Date.now() + 5 * MINUTE);
    await act(async () => appState.emit("background"));
    await act(async () => appState.emit("active"));
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not overlap a check that is still in flight", async () => {
    const check = deferred<typeof META>();
    fetchMock.mockReturnValueOnce(check.promise);
    await setup();
    jest.setSystemTime(Date.now() + 10 * MINUTE);
    await act(async () => appState.emit("active"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => check.resolve(META));
  });

  it("polls on an interval when logged out and stops on unmount", async () => {
    const { unmount } = await setup();
    await advance(APP_VERSION_BACKGROUND_POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await unmount();
    expect(appState.spy.mock.results.at(-1)?.value.remove).toHaveBeenCalled();
    await advance(APP_VERSION_BACKGROUND_POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("polls while logged in but offline", async () => {
    setMockAuth({ isAuthenticated: true });
    mockOnline.current = false;
    await setup();
    await advance(APP_VERSION_BACKGROUND_POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not poll when logged in and online", async () => {
    setMockAuth({ isAuthenticated: true });
    const { unmount } = await setup();
    await advance(APP_VERSION_BACKGROUND_POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await unmount();
  });
});

describe("useAppVersionBackgroundSync — web", () => {
  type Doc = {
    visibilityState: string;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };
  let doc: Doc;

  beforeEach(() => {
    restorePlatform = setPlatform({ OS: "web" });
    doc = {
      visibilityState: "visible",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    Object.defineProperty(globalThis, "document", { configurable: true, value: doc });
  });

  afterEach(() => {
    delete (globalThis as { document?: unknown }).document;
  });

  it("re-checks when the tab becomes visible and cleans up", async () => {
    const { unmount } = await setup();
    const onVisibility = doc.addEventListener.mock.calls[0][1] as () => void;
    jest.setSystemTime(Date.now() + 10 * MINUTE);
    doc.visibilityState = "hidden";
    await act(async () => onVisibility());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    doc.visibilityState = "visible";
    await act(async () => onVisibility());
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await unmount();
    expect(doc.removeEventListener).toHaveBeenCalledWith("visibilitychange", onVisibility);
  });

  it("clears the poll interval on unmount", async () => {
    const { unmount } = await setup();
    await unmount();
    await advance(APP_VERSION_BACKGROUND_POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not need an interval when logged in and online", async () => {
    setMockAuth({ isAuthenticated: true });
    const { unmount } = await setup();
    await unmount();
    expect(doc.removeEventListener).toHaveBeenCalled();
  });
});
