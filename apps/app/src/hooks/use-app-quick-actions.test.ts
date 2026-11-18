import { act, renderHook } from "@testing-library/react-native";
import type { Action } from "expo-quick-actions";

import { syncAppQuickActions } from "@/lib/appSurfaces/quickActions/syncQuickActions";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { setPlatform } from "@/test-support/platform";

import {
  __resetQuickActionInitialDedupeForTests,
  useAppQuickActions,
} from "./use-app-quick-actions";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-quick-actions", () => ({
  __esModule: true,
  get initial() {
    return mockQuickActions.initial;
  },
  addListener: (listener: (action: Action) => void) => {
    mockQuickActions.listener = listener;
    return { remove: mockQuickActions.remove };
  },
}));
jest.mock("@/lib/appSurfaces/quickActions/syncQuickActions", () => ({
  resolveQuickActionHref: (action: Action) =>
    typeof action.params?.href === "string" ? action.params.href : null,
  syncAppQuickActions: jest.fn(async () => undefined),
}));

const mockQuickActions: {
  initial: Action | undefined;
  listener?: (action: Action) => void;
  remove: jest.Mock;
} = { initial: undefined, remove: jest.fn() };

const MARK: Action = { id: "mark", title: "Mark", params: { href: "/mark-current" } };

let restorePlatform: () => void = () => {};

async function setup(enabled?: boolean) {
  return renderHook(() => useAppQuickActions(enabled));
}

async function runTimers() {
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  resetExpoRouterMock();
  __resetQuickActionInitialDedupeForTests();
  mockQuickActions.initial = undefined;
  mockQuickActions.listener = undefined;
});

afterEach(() => {
  jest.useRealTimers();
  restorePlatform();
  restorePlatform = () => {};
});

describe("useAppQuickActions", () => {
  it("registers the quick actions with translated titles", async () => {
    await setup();
    expect(syncAppQuickActions).toHaveBeenCalledWith(expect.any(Function));
  });

  it("navigates to the cold-start action once", async () => {
    mockQuickActions.initial = MARK;
    const first = await setup();
    await runTimers();
    expect(mockRouter.navigate).toHaveBeenCalledWith("/mark-current", { withAnchor: true });
    await first.unmount();
    await setup();
    await runTimers();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
  });

  it("navigates to an initial action without an id", async () => {
    mockQuickActions.initial = {
      id: undefined,
      title: "x",
      params: { href: "/x" },
    } as unknown as Action;
    await setup();
    await runTimers();
    expect(mockRouter.navigate).toHaveBeenCalledWith("/x", { withAnchor: true });
  });

  it("navigates for each live quick action", async () => {
    await setup();
    await act(async () => {
      mockQuickActions.listener?.(MARK);
      mockQuickActions.listener?.(MARK);
    });
    await runTimers();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
  });

  it("ignores actions without a route", async () => {
    await setup();
    await act(async () => {
      mockQuickActions.listener?.({ id: "x", title: "x" });
    });
    await runTimers();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("drops actions after unmount", async () => {
    const { unmount } = await setup();
    const listener = mockQuickActions.listener;
    await act(async () => listener?.(MARK));
    await unmount();
    expect(mockQuickActions.remove).toHaveBeenCalled();
    await runTimers();
    await act(async () => listener?.(MARK));
    await runTimers();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it("does nothing when disabled", async () => {
    mockQuickActions.initial = MARK;
    await setup(false);
    await runTimers();
    expect(mockQuickActions.listener).toBeUndefined();
    expect(syncAppQuickActions).not.toHaveBeenCalled();
  });

  it("does nothing on web", async () => {
    restorePlatform = setPlatform({ OS: "web" });
    await setup();
    expect(mockQuickActions.listener).toBeUndefined();
    expect(syncAppQuickActions).not.toHaveBeenCalled();
  });
});
