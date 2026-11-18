import * as Sharing from "expo-sharing";
import { Share, type ViewInstance } from "react-native";
import { captureRef } from "react-native-view-shot";

import { setPlatform } from "@/test-support/platform";

import { shareViewSnapshot, toLocalFileUri, waitForViewRef } from "./shareViewSnapshot";

jest.mock("react-native-view-shot", () => ({
  captureRef: jest.fn(async () => "/tmp/capture.png"),
}));
jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));

const mockShareOnWeb = jest.fn(async (..._args: unknown[]) => ({ status: "shared" }));
jest.mock("@/lib/share/shareViewSnapshotWeb", () => ({
  shareSnapshotOnWeb: (...args: unknown[]) => mockShareOnWeb(...args),
}));

const capture = captureRef as jest.Mock;
const isAvailable = Sharing.isAvailableAsync as jest.Mock;
const shareAsync = Sharing.shareAsync as jest.Mock;
const OPTIONS = { filename: "proof.png", dialogTitle: "Share" };

let restorePlatform: () => void = () => {};
let shareSpy: jest.SpyInstance;

/** Runs `shareViewSnapshot`, draining the idle/paint timers it waits on. */
async function share(
  view: unknown = {},
  options: Parameters<typeof shareViewSnapshot>[1] = OPTIONS,
) {
  const ref = { current: view as ViewInstance | null };
  const pending = shareViewSnapshot(ref, options);
  pending.catch(() => {});
  await jest.runAllTimersAsync();
  return pending;
}

beforeEach(() => {
  jest.useFakeTimers();
  capture.mockClear();
  isAvailable.mockResolvedValue(true);
  shareAsync.mockClear();
  mockShareOnWeb.mockClear();
  shareSpy = jest.spyOn(Share, "share").mockResolvedValue({ action: "sharedAction" });
});

afterEach(() => {
  restorePlatform();
  restorePlatform = () => {};
  shareSpy.mockRestore();
  jest.useRealTimers();
});

describe("toLocalFileUri", () => {
  it.each([
    ["file:///a.png", "file:///a.png"],
    ["/tmp/a.png", "file:///tmp/a.png"],
    ["tmp/a.png", "file:///tmp/a.png"],
  ])("maps %s to %s", (input, expected) => {
    expect(toLocalFileUri(input)).toBe(expected);
  });
});

describe("waitForViewRef", () => {
  it("resolves true once the ref attaches", async () => {
    const ref = { current: null as ViewInstance | null };
    const pending = waitForViewRef(ref);
    await jest.advanceTimersByTimeAsync(50);
    ref.current = {} as ViewInstance;
    await jest.runAllTimersAsync();
    await expect(pending).resolves.toBe(true);
  });

  it("gives up after the frame budget", async () => {
    const pending = waitForViewRef({ current: null });
    await jest.runAllTimersAsync();
    await expect(pending).resolves.toBe(false);
  });
});

describe("shareViewSnapshot on iOS", () => {
  it("rejects when the view is not mounted", async () => {
    await expect(share(null)).rejects.toThrow("SHARE_SNAPSHOT_NO_VIEW");
  });

  it("captures a PNG tmpfile and opens expo-sharing", async () => {
    const beforeCapture = jest.fn(async () => undefined);
    const afterCapture = jest.fn();
    await share({}, { ...OPTIONS, beforeCapture, afterCapture });
    expect(beforeCapture).toHaveBeenCalled();
    expect(afterCapture).toHaveBeenCalled();
    expect(capture).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        format: "png",
        result: "tmpfile",
        snapshotContentContainer: false,
      }),
    );
    expect(shareAsync).toHaveBeenCalledWith(
      "file:///cache/share-snapshots/proof.png",
      expect.objectContaining({ mimeType: "image/png", dialogTitle: "Share" }),
    );
  });

  it("shares text + image through Share.share when there is a message", async () => {
    await share({}, { ...OPTIONS, message: "Alhamdulillah" });
    expect(shareSpy).toHaveBeenCalledWith({
      message: "Alhamdulillah",
      url: "file:///cache/share-snapshots/proof.png",
    });
    expect(shareAsync).not.toHaveBeenCalled();
  });

  it("falls back to sharing the file URL when expo-sharing is unavailable", async () => {
    isAvailable.mockResolvedValue(false);
    await share();
    expect(shareSpy).toHaveBeenCalledWith({
      url: expect.stringContaining("proof.png"),
      title: "Share",
    });
  });
});

describe("shareViewSnapshot on Android", () => {
  beforeEach(() => {
    restorePlatform = setPlatform({ OS: "android" });
  });

  it("uses expo-sharing even with a message", async () => {
    await share({}, { ...OPTIONS, message: "text" });
    expect(shareAsync).toHaveBeenCalled();
  });

  it("shares only the text when expo-sharing is unavailable", async () => {
    isAvailable.mockResolvedValue(false);
    await share({}, { ...OPTIONS, message: "text" });
    expect(shareSpy).toHaveBeenCalledWith({ message: "text", title: "Share" });
  });
});

describe("shareViewSnapshot on web", () => {
  class FakeHTMLElement {}
  const g = globalThis as Record<string, unknown>;

  beforeEach(() => {
    restorePlatform = setPlatform({ OS: "web" });
    g.HTMLElement = FakeHTMLElement;
  });
  afterEach(() => {
    delete g.HTMLElement;
  });

  it("captures the DOM host as a data URI and hands it to the web share flow", async () => {
    const host = new FakeHTMLElement();
    capture.mockResolvedValueOnce("data:image/png;base64,AA==");
    expect(await share({ getScrollableNode: () => host })).toEqual({ web: { status: "shared" } });
    expect(capture).toHaveBeenCalledWith(host, expect.objectContaining({ result: "data-uri" }));
    expect(mockShareOnWeb).toHaveBeenCalledWith("data:image/png;base64,AA==", OPTIONS);
  });

  it("restores console.debug after capturing", async () => {
    const debug = console.debug;
    await share(new FakeHTMLElement());
    expect(console.debug).toBe(debug);
  });

  it("rejects when the ref has no DOM host", async () => {
    await expect(share({})).rejects.toThrow("SHARE_SNAPSHOT_NO_VIEW");
  });
});
