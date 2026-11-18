import { setTokenRefresher, WEB_COOKIE_SESSION_TOKEN } from "@munib-tracker/api-client";
import { renderHook, waitFor } from "@testing-library/react-native";

import { deferred } from "@/test-support/async";
import { fakeResponse, mockFetch } from "@/test-support/fetch";
import {
  mockDeletePath,
  mockDownloadToUri,
  mockNativeFileStore,
  mockNativeFiles,
  resetNativeFileStoreMock,
} from "@/test-support/mocks/native-file-store";
import { usePlatform } from "@/test-support/platform";

import {
  downloadAuthedFile,
  fetchAuthedBlob,
  isRemoteUri,
  loadAuthedMedia,
  useAuthedMediaUri,
} from "./authed-media";

jest.mock(
  "@/lib/native-file-store",
  () => require("@/test-support/mocks/native-file-store").nativeFileStoreMock,
);

let uriCounter = 0;
/** A fresh remote URI per test (the module caches resolved URIs for the session). */
const remote = () => `https://api.example/user-media/${++uriCounter}/content`;

const blobResponse = (status = 200) => ({
  ...fakeResponse("bytes", { status }),
  blob: async () => new Blob(["bytes"]),
});

beforeEach(() => {
  resetNativeFileStoreMock();
  setTokenRefresher(null);
});

describe("isRemoteUri", () => {
  it.each([
    ["https://a/b", true],
    ["http://a/b", true],
    ["file:///a", false],
    ["blob:abc", false],
  ])("%s → %p", (uri, expected) => {
    expect(isRemoteUri(uri)).toBe(expected);
  });
});

describe("downloadAuthedFile (native)", () => {
  it("returns the local URI on success", async () => {
    expect(
      await downloadAuthedFile("https://x", "file:///cache/a", { Authorization: "Bearer t" }),
    ).toBe("file:///cache/a");
    expect(mockDownloadToUri).toHaveBeenCalledWith("https://x", "file:///cache/a", {
      Authorization: "Bearer t",
    });
  });

  it("refreshes the session once on 401 and retries with the new Bearer", async () => {
    setTokenRefresher(async () => "fresh");
    mockDownloadToUri.mockResolvedValueOnce({ uri: "file:///cache/a", status: 401 });
    await downloadAuthedFile("https://x", "file:///cache/a");
    expect(mockDownloadToUri).toHaveBeenLastCalledWith("https://x", "file:///cache/a", {
      Authorization: "Bearer fresh",
    });
  });

  it("deletes the partial file and rejects when still unauthorized", async () => {
    mockDownloadToUri.mockResolvedValueOnce({ uri: "file:///cache/a", status: 401 });
    await expect(downloadAuthedFile("https://x", "file:///cache/a")).rejects.toThrow(
      "Failed to load attachment (401)",
    );
    expect(mockDeletePath).toHaveBeenCalledWith("file:///cache/a");
  });

  it("rejects even when cleanup fails", async () => {
    mockDownloadToUri.mockResolvedValueOnce({ uri: "file:///cache/a", status: 500 });
    mockDeletePath.mockImplementationOnce(() => {
      throw new Error("busy");
    });
    await expect(downloadAuthedFile("https://x", "file:///cache/a")).rejects.toThrow("(500)");
  });

  it("does not retry when the refresher signs out", async () => {
    setTokenRefresher(async () => null);
    mockDownloadToUri.mockResolvedValueOnce({ uri: "file:///cache/a", status: 401 });
    await expect(downloadAuthedFile("https://x", "file:///cache/a")).rejects.toThrow("(401)");
    expect(mockDownloadToUri).toHaveBeenCalledTimes(1);
  });
});

describe("loadAuthedMedia (native)", () => {
  it("returns local URIs unchanged", async () => {
    expect(await loadAuthedMedia("file:///a.png")).toBe("file:///a.png");
  });

  it("downloads into the cache once per session", async () => {
    const uri = remote();
    const local = await loadAuthedMedia(uri);
    expect(local).toMatch(/^file:\/\/\/cache\/user-media\//);
    await loadAuthedMedia(uri);
    expect(mockDownloadToUri).toHaveBeenCalledTimes(1);
  });

  it("reuses a cached file already on disk", async () => {
    const uri = remote();
    mockDownloadToUri.mockImplementationOnce(async (_r: string, local: string) => {
      mockNativeFiles.set(local, { size: 1 });
      return { uri: local, status: 500 };
    });
    await expect(loadAuthedMedia(uri)).rejects.toThrow("(500)");
    // A failure is not cached; the next call finds the file on disk.
    const local = await loadAuthedMedia(uri);
    mockNativeFiles.set(local, { size: 10 });
    expect(mockDownloadToUri).toHaveBeenCalledTimes(2);
  });

  it("serves an existing non-empty cache file without downloading", async () => {
    const uri = remote();
    const local = `file:///cache/user-media/${uri.replace(/[^a-z0-9]+/gi, "_").slice(-120)}`;
    mockNativeFiles.set(local, { size: 42 });
    expect(await loadAuthedMedia(uri)).toBe(local);
    expect(mockDownloadToUri).not.toHaveBeenCalled();
  });

  it("rejects without a cache directory", async () => {
    mockNativeFileStore.cacheDir = null;
    await expect(loadAuthedMedia(remote())).rejects.toThrow("No cache directory available");
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });
  const createObjectURL = jest.fn(() => "blob:local");
  beforeEach(() => {
    Object.assign(URL, { createObjectURL });
  });

  it("fetches with cookies + client headers and returns a blob URL", async () => {
    const fetchMock = mockFetch(blobResponse() as never);
    expect(await loadAuthedMedia(remote())).toBe("blob:local");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({ "x-munib-tracker-client": "web" }),
      }),
    );
  });

  it("retries once with the same headers for cookie sessions", async () => {
    setTokenRefresher(async () => WEB_COOKIE_SESSION_TOKEN);
    const fetchMock = mockFetch(blobResponse(401) as never, blobResponse() as never);
    await fetchAuthedBlob("https://x", { "x-extra": "1" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].headers).not.toHaveProperty("Authorization");
  });

  it("rejects non-2xx responses", async () => {
    mockFetch(blobResponse(404) as never);
    await expect(fetchAuthedBlob("https://x")).rejects.toThrow("Failed to load attachment (404)");
  });
});

describe("useAuthedMediaUri", () => {
  it("returns local URIs synchronously", async () => {
    const { result } = await renderHook(() => useAuthedMediaUri("file:///a.png"));
    expect(result.current).toEqual({ uri: "file:///a.png", failed: false });
  });

  it("returns null for a null URI", async () => {
    const { result } = await renderHook(() => useAuthedMediaUri(null));
    expect(result.current).toEqual({ uri: null, failed: false });
  });

  it("resolves a remote URI to its cached file", async () => {
    const uri = remote();
    const { result } = await renderHook(() =>
      useAuthedMediaUri(uri, { Authorization: "Bearer t" }),
    );
    await waitFor(() => expect(result.current.uri).toMatch(/^file:\/\/\/cache\//));
    expect(mockDownloadToUri.mock.calls[0][2]).toEqual({ Authorization: "Bearer t" });
  });

  it("reports failure", async () => {
    mockDownloadToUri.mockResolvedValueOnce({ uri: "x", status: 500 });
    const uri = remote();
    const { result } = await renderHook(() => useAuthedMediaUri(uri));
    await waitFor(() => expect(result.current.failed).toBe(true));
  });

  it("shows nothing for a new URI until it loads", async () => {
    const [first, second] = [remote(), remote()];
    const download = deferred<{ uri: string; status: number }>();
    const { result, rerender } = await renderHook(({ uri }) => useAuthedMediaUri(uri), {
      initialProps: { uri: first },
    });
    await waitFor(() => expect(result.current.uri).not.toBeNull());
    mockDownloadToUri.mockReturnValueOnce(download.promise);
    await rerender({ uri: second });
    expect(result.current).toEqual({ uri: null, failed: false });
    download.resolve({ uri: "file:///cache/second", status: 200 });
    await waitFor(() => expect(result.current.uri).toBe("file:///cache/second"));
  });
});
