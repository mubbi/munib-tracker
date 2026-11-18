import type { AppVersionMeta } from "@munib-tracker/api-client";
import { act, render, renderHook, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";

import {
  AppVersionProvider,
  useAppVersion,
  useAppVersionOptional,
} from "@/providers/app-version-provider";
import { buildAppVersionMeta } from "@/test-support/fixtures/app-version";
import { usePlatform } from "@/test-support/platform";

let mockVersionMetaCallback: ((meta: AppVersionMeta) => void) | null = null;
const mockSetAppVersionInfo = jest.fn();
/** Returns a merged meta to force, or `undefined` to use the real merge. */
const mockMergeOverride = jest.fn<
  AppVersionMeta | undefined,
  [AppVersionMeta | null, AppVersionMeta]
>();

jest.mock("@munib-tracker/api-client", () => {
  const actual = jest.requireActual("@munib-tracker/api-client");
  return {
    ...actual,
    setAppVersionInfo: (...args: unknown[]) => mockSetAppVersionInfo(...args),
    setVersionMetaCallback: (cb: ((meta: AppVersionMeta) => void) | null) => {
      mockVersionMetaCallback = cb;
    },
    mergeAppVersionMeta: (prev: AppVersionMeta | null, incoming: AppVersionMeta) =>
      mockMergeOverride(prev, incoming) ?? actual.mergeAppVersionMeta(prev, incoming),
  };
});

const mockBackgroundSync = jest.fn();
jest.mock("@/hooks/use-app-version-background-sync", () => ({
  useAppVersionBackgroundSync: (...args: unknown[]) => mockBackgroundSync(...args),
}));

const mockDismissSoftUpdate = jest.fn(async (_v: string) => undefined);
const mockIsSoftUpdateDismissed = jest.fn(async (_v: string) => false);
const mockIsSoftUpdateDismissedSync = jest.fn((_v: string) => false);
jest.mock("@/lib/app/app-update-dismiss", () => ({
  dismissSoftUpdate: (v: string) => mockDismissSoftUpdate(v),
  isSoftUpdateDismissed: (v: string) => mockIsSoftUpdateDismissed(v),
  isSoftUpdateDismissedSync: (v: string) => mockIsSoftUpdateDismissedSync(v),
}));

jest.mock("@/lib/app/resolve-app-platform", () => ({ resolveAppPlatform: () => "ios" }));
jest.mock("@/lib/app/resolve-app-version", () => ({ resolveAppVersion: () => "1.0.0" }));

const soft = buildAppVersionMeta();
const hard = buildAppVersionMeta({
  updateRequired: "hard",
  latestVersion: "2.0.0",
  minSoftVersion: "1.5.0",
  minHardVersion: "1.5.0",
});
const none = buildAppVersionMeta({ updateRequired: "none" });

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppVersionProvider>{children}</AppVersionProvider>
);

/** Renders the provider and optionally ingests server version metadata. */
async function setup(meta?: AppVersionMeta) {
  const utils = await renderHook(() => useAppVersion(), { wrapper });
  if (meta) await ingest(meta);
  return utils;
}

async function ingest(meta: AppVersionMeta) {
  await act(async () => {
    mockVersionMetaCallback?.(meta);
  });
}

function OptionalProbe() {
  return <Text testID="optional">{String(useAppVersionOptional())}</Text>;
}

function AppVersionThrower() {
  useAppVersion();
  return null;
}

beforeEach(() => {
  mockVersionMetaCallback = null;
  mockSetAppVersionInfo.mockClear();
  mockMergeOverride.mockReset().mockReturnValue(undefined);
  mockBackgroundSync.mockClear();
  mockDismissSoftUpdate.mockClear();
  mockIsSoftUpdateDismissed.mockClear();
  mockIsSoftUpdateDismissedSync.mockReset().mockReturnValue(false);
});

describe("AppVersionProvider without server metadata", () => {
  it("exposes an idle state for the resolved client version", async () => {
    const { result } = await setup();
    expect(result.current).toMatchObject({
      clientVersion: "1.0.0",
      versionMeta: null,
      updateRequired: "none",
      hasPendingUpdate: false,
      updatePromptDismissed: false,
      showUpdateModal: false,
      isHardUpdateBlocking: false,
      showSettingsBadge: false,
    });
  });

  it("registers the client version info", async () => {
    await setup();
    expect(mockSetAppVersionInfo).toHaveBeenCalledWith("1.0.0", "ios");
  });

  it("starts background sync once auth is ready", async () => {
    await setup();
    expect(mockBackgroundSync).toHaveBeenCalledWith(expect.any(Function), true);
  });

  it("unregisters the version meta callback on unmount", async () => {
    const { unmount } = await setup();
    await unmount();
    expect(mockVersionMetaCallback).toBeNull();
  });
});

describe("AppVersionProvider soft update", () => {
  it("shows the update modal without a settings badge", async () => {
    const { result } = await setup(soft);
    expect(result.current).toMatchObject({
      versionMeta: soft,
      updateRequired: "soft",
      hasPendingUpdate: true,
      showUpdateModal: true,
      showSettingsBadge: false,
    });
  });

  it("warms the persisted dismissal for the target version", async () => {
    await setup(soft);
    expect(mockIsSoftUpdateDismissed).toHaveBeenCalledWith("1.2.0");
  });

  it("persists a dismissal and moves the prompt to a settings badge", async () => {
    const { result } = await setup(soft);
    await act(async () => result.current.dismissUpdatePrompt());
    expect(mockDismissSoftUpdate).toHaveBeenCalledWith("1.2.0");
    expect(result.current).toMatchObject({
      updatePromptDismissed: true,
      showUpdateModal: false,
      showSettingsBadge: true,
    });
  });

  it("reopens the modal on demand after dismissal", async () => {
    const { result } = await setup(soft);
    await act(async () => result.current.dismissUpdatePrompt());
    await act(async () => result.current.openUpdatePrompt());
    expect(result.current.showUpdateModal).toBe(true);
  });

  it("honours a dismissal persisted in a previous session", async () => {
    mockIsSoftUpdateDismissedSync.mockReturnValue(true);
    const { result } = await setup(soft);
    expect(result.current.updatePromptDismissed).toBe(true);
    expect(result.current.showUpdateModal).toBe(false);
  });

  it("does not track dismissal when the server sends no target version", async () => {
    mockMergeOverride.mockReturnValueOnce(buildAppVersionMeta({ latestVersion: "" }));
    const { result } = await setup(soft);
    await act(async () => result.current.dismissUpdatePrompt());
    expect(result.current.updatePromptDismissed).toBe(false);
    expect(mockIsSoftUpdateDismissed).not.toHaveBeenCalled();
    expect(mockDismissSoftUpdate).not.toHaveBeenCalled();
  });
});

describe("AppVersionProvider hard update", () => {
  it("blocks the app", async () => {
    const { result } = await setup(hard);
    expect(result.current).toMatchObject({
      updateRequired: "hard",
      showUpdateModal: true,
      isHardUpdateBlocking: true,
    });
  });

  it("cannot be dismissed", async () => {
    const { result } = await setup(hard);
    await act(async () => result.current.dismissUpdatePrompt());
    expect(mockDismissSoftUpdate).not.toHaveBeenCalled();
    expect(result.current.isHardUpdateBlocking).toBe(true);
  });
});

describe("AppVersionProvider clearing metadata", () => {
  it.each([
    ["the server reports none", none, undefined],
    ["the merged result is none", soft, none],
    [
      "the client already satisfies the update",
      buildAppVersionMeta({ latestVersion: "1.0.0", minSoftVersion: "0.9.0" }),
      undefined,
    ],
  ])("drops pending metadata when %s", async (_label, incoming, merged) => {
    const { result } = await setup(soft);
    mockMergeOverride.mockReturnValueOnce(merged);
    await ingest(incoming);
    expect(result.current.versionMeta).toBeNull();
  });
});

describe("AppVersionProvider on TV", () => {
  usePlatform({ isTV: true });

  it("ignores phone version policy", async () => {
    const { result } = await setup(hard);
    expect(result.current.versionMeta).toBeNull();
  });
});

describe("app version hooks outside the provider", () => {
  it("useAppVersionOptional returns null", async () => {
    await render(<OptionalProbe />);
    expect(screen.getByTestId("optional").props.children).toBe("null");
  });

  it("useAppVersion throws", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(render(<AppVersionThrower />)).rejects.toThrow(
      "useAppVersion must be used within AppVersionProvider",
    );
    spy.mockRestore();
  });
});
