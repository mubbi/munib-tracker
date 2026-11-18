import * as Sharing from "expo-sharing";
import { Linking, Share } from "react-native";

import {
  mockDownloadToUri,
  mockNativeFileStore,
  resetNativeFileStoreMock,
} from "@/test-support/mocks/native-file-store";
import { usePlatform } from "@/test-support/platform";

import { openAttachmentExternally } from "./open-attachment-externally";

jest.mock(
  "@/lib/native-file-store",
  () => require("@/test-support/mocks/native-file-store").nativeFileStoreMock,
);
jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));

const mockFetchAuthedBlob = jest.fn(async (..._args: unknown[]) => new Blob(["pdf"]));
jest.mock("@/lib/attachments/authed-media", () => ({
  ...jest.requireActual("@/lib/attachments/authed-media"),
  fetchAuthedBlob: (...args: unknown[]) => mockFetchAuthedBlob(...args),
}));

const isAvailable = Sharing.isAvailableAsync as jest.Mock;
const shareAsync = Sharing.shareAsync as jest.Mock;
const BASE = { fileName: "Report.pdf", dialogTitle: "Open", mimeType: "application/pdf" };

/** Runs the open flow, draining the idle wait it starts with. */
async function open(
  options: Partial<Parameters<typeof openAttachmentExternally>[0]> & { uri: string },
) {
  const pending = openAttachmentExternally({ ...BASE, ...options });
  pending.catch(() => {});
  await jest.runAllTimersAsync();
  return pending;
}

beforeEach(() => {
  jest.useFakeTimers();
  resetNativeFileStoreMock();
  isAvailable.mockResolvedValue(true);
  shareAsync.mockClear();
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("on native", () => {
  it("shares a local file with its PDF UTI", async () => {
    await open({ uri: "file:///doc.pdf" });
    expect(shareAsync).toHaveBeenCalledWith("file:///doc.pdf", {
      mimeType: "application/pdf",
      dialogTitle: "Open",
      UTI: "com.adobe.pdf",
    });
  });

  it("downloads remote attachments into a sanitized cache file first", async () => {
    await open({
      uri: "https://api/x",
      fileName: 'a/b:"c".pdf',
      mimeType: undefined,
      headers: { A: "1" },
    });
    const [remote, local, headers] = mockDownloadToUri.mock.calls[0];
    expect(remote).toBe("https://api/x");
    expect(local).toMatch(/^file:\/\/\/cache\/user-media-open\/\d+-a_b__c_\.pdf$/);
    expect(headers).toEqual({ A: "1" });
    expect(shareAsync).toHaveBeenCalledWith(
      local,
      expect.objectContaining({ mimeType: "application/octet-stream", UTI: undefined }),
    );
  });

  it("rejects remote opens without a cache directory", async () => {
    mockNativeFileStore.cacheDir = null;
    await expect(open({ uri: "https://api/x" })).rejects.toThrow("No cache directory available");
  });

  it("falls back to Share.share without expo-sharing", async () => {
    isAvailable.mockResolvedValue(false);
    const share = jest.spyOn(Share, "share").mockResolvedValue({ action: "sharedAction" });
    await open({ uri: "file:///doc.pdf" });
    expect(share).toHaveBeenCalledWith({ url: "file:///doc.pdf", title: "Report.pdf" });
  });

  it.each([
    ["file:///doc.pdf", 1],
    ["content://doc", 0],
  ])("opens %s via Linking when Share fails (%i calls)", async (uri, calls) => {
    isAvailable.mockResolvedValue(false);
    jest.spyOn(Share, "share").mockRejectedValue(new Error("no share"));
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    openURL.mockClear();
    await open({ uri });
    expect(openURL).toHaveBeenCalledTimes(calls);
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });
  const windowOpen = jest.fn();
  const revokeObjectURL = jest.fn();

  beforeEach(() => {
    Object.assign(globalThis, { open: windowOpen });
    Object.assign(URL, { createObjectURL: () => "blob:doc", revokeObjectURL });
    windowOpen.mockClear();
  });
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).open;
  });

  it("opens a local URI in a new tab", async () => {
    await open({ uri: "blob:existing" });
    expect(windowOpen).toHaveBeenCalledWith("blob:existing", "_blank", "noopener,noreferrer");
  });

  it("fetches remote bytes, opens a blob URL and revokes it later", async () => {
    await open({ uri: "https://api/x", headers: { A: "1" } });
    expect(mockFetchAuthedBlob).toHaveBeenCalledWith("https://api/x", { A: "1" });
    expect(windowOpen).toHaveBeenCalledWith("blob:doc", "_blank", "noopener,noreferrer");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:doc");
  });
});
