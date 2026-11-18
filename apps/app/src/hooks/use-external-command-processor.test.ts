import { act, renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { handleExternalCommand } from "@/lib/external-commands";
import {
  nativeActivateWatchSession,
  nativeDrainCommands,
  subscribeNativeCommands,
} from "@/lib/external-commands/native-bridge";
import type { ExternalCommand } from "@/lib/external-commands/types";
import * as sentry from "@/lib/sentry";
import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { setPlatform } from "@/test-support/platform";

import { useExternalCommandProcessor } from "./use-external-command-processor";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/features/pin-lock", () => ({
  usePinLock: () => ({ deferActionsUntilPinUnlock: mockPinLocked.current }),
}));
jest.mock("@/lib/external-commands", () => ({ handleExternalCommand: jest.fn() }));
jest.mock("@/lib/external-commands/native-bridge", () => ({
  nativeActivateWatchSession: jest.fn(async () => undefined),
  nativeDrainCommands: jest.fn(async () => []),
  subscribeNativeCommands: jest.fn(() => mockUnsubscribe),
}));

const mockPinLocked = { current: false };
const mockUnsubscribe = jest.fn();

const handleMock = handleExternalCommand as jest.Mock;
const drainMock = nativeDrainCommands as jest.Mock;

const MARK: ExternalCommand = { type: "mark-current-obligatory", source: "siri" };

let restorePlatform: () => void = () => {};
const appState = captureAppStateListener();

async function setup() {
  const hook = await renderHook(() => useExternalCommandProcessor());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

/** Mounts with the given native commands waiting in the queue. */
async function drainWith(commands: ExternalCommand[]) {
  drainMock.mockResolvedValueOnce(commands);
  return setup();
}

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  mockPinLocked.current = false;
});

afterEach(() => {
  restorePlatform();
  restorePlatform = () => {};
});

describe("useExternalCommandProcessor", () => {
  it("activates the watch session and drains on mount", async () => {
    const { unmount } = await setup();
    expect(nativeActivateWatchSession).toHaveBeenCalled();
    expect(drainMock).toHaveBeenCalledTimes(1);
    await unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
    expect(appState.spy.mock.results.at(-1)?.value.remove).toHaveBeenCalled();
  });

  it.each([
    ["web", { OS: "web" as const }],
    ["TV", { isTV: true }],
  ])("does nothing on %s", async (_label, platform) => {
    restorePlatform = setPlatform(platform);
    await setup();
    expect(nativeActivateWatchSession).not.toHaveBeenCalled();
    expect(drainMock).not.toHaveBeenCalled();
  });

  it("opens routes from commands", async () => {
    await drainWith([{ type: "open-route", href: "/qaza" }]);
    expect(mockRouter.push).toHaveBeenCalledWith("/qaza");
    expect(handleMock).not.toHaveBeenCalled();
  });

  it.each([
    [{ ok: true }, "success", "externalCommands.marked"],
    [{ ok: true, alreadyCompleted: true }, "success", "externalCommands.alreadyDone"],
    [{ ok: false, reason: "excused" }, "info", "externalCommands.excused"],
    [{ ok: false, reason: "already_done" }, "info", "externalCommands.allDone"],
    [{ ok: false, reason: "locked" }, "info", "externalCommands.locked"],
    [{ ok: false, reason: "no_prayer" }, "info", "externalCommands.failed"],
  ] as const)("toasts the result %j", async (result, kind, key) => {
    handleMock.mockResolvedValueOnce(result);
    await drainWith([MARK]);
    expect(handleMock).toHaveBeenCalledWith(MARK, { defer: false });
    expect(mockToast[kind]).toHaveBeenCalledWith(i18n.t(key));
  });

  it("drains again when native commands arrive or the app returns", async () => {
    await setup();
    const onCommands = (subscribeNativeCommands as jest.Mock).mock.calls[0][0] as () => void;
    await act(async () => {
      onCommands();
    });
    await act(async () => {
      appState.emit("background");
    });
    expect(drainMock).toHaveBeenCalledTimes(2);
    await act(async () => {
      appState.emit("active");
    });
    expect(drainMock).toHaveBeenCalledTimes(3);
  });

  it("skips a drain while one is already running", async () => {
    const drain = deferred<ExternalCommand[]>();
    drainMock.mockReturnValueOnce(drain.promise);
    await setup();
    await act(async () => {
      appState.emit("active");
    });
    expect(drainMock).toHaveBeenCalledTimes(1);
    await act(async () => drain.resolve([]));
  });

  it("queues deferred commands and replays them once the pin unlocks", async () => {
    mockPinLocked.current = true;
    handleMock.mockResolvedValueOnce("deferred");
    const hook = await drainWith([MARK]);
    expect(handleMock).toHaveBeenCalledWith(MARK, { defer: true });
    expect(mockToast.success).not.toHaveBeenCalled();

    mockPinLocked.current = false;
    handleMock.mockResolvedValueOnce({ ok: true });
    await hook.rerender({});
    await act(async () => {
      await Promise.resolve();
    });
    expect(handleMock).toHaveBeenLastCalledWith(MARK, { defer: false });
    expect(mockToast.success).toHaveBeenCalled();
  });

  describe("failures", () => {
    const captureSpy = jest.spyOn(sentry, "captureAppException").mockImplementation(() => {});
    const unhandled = jest.fn();
    beforeAll(() => process.on("unhandledRejection", unhandled));
    afterAll(() => {
      process.off("unhandledRejection", unhandled);
      captureSpy.mockRestore();
    });
    beforeEach(() => unhandled.mockClear());

    const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    it("keeps processing the batch when one command throws", async () => {
      handleMock.mockRejectedValueOnce(new Error("store offline"));
      await drainWith([MARK, { type: "open-route", href: "/qaza" }]);
      await settle();
      expect(mockRouter.push).toHaveBeenCalledWith("/qaza");
      expect(mockToast.info).toHaveBeenCalledWith(i18n.t("externalCommands.failed"));
      expect(captureSpy).toHaveBeenCalledWith(expect.any(Error), {
        tags: { external_command: MARK.type },
      });
      expect(unhandled).not.toHaveBeenCalled();
    });

    it("reports an unreadable native queue instead of rejecting", async () => {
      drainMock.mockRejectedValueOnce(new Error("bridge gone"));
      await setup();
      await settle();
      expect(captureSpy).toHaveBeenCalledWith(expect.any(Error), {
        tags: { external_command: "drain" },
      });
      expect(unhandled).not.toHaveBeenCalled();
    });
  });
});
