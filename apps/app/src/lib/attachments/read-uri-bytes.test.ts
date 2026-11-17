import { Platform } from "react-native";

const mockFileBytes = jest.fn();

jest.mock("expo-file-system", () => ({
  File: jest.fn().mockImplementation(() => ({ bytes: mockFileBytes })),
}));

import { readUriAsBytes } from "./read-uri-bytes";

const BYTES = new Uint8Array([1, 2, 3, 4]);

describe("readUriAsBytes", () => {
  const originalOS = Platform.OS;
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    Platform.OS = originalOS;
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("reads native files through expo-file-system, not fetch", async () => {
    Platform.OS = "android";
    mockFileBytes.mockResolvedValue(BYTES);
    const fetchMock = jest.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(readUriAsBytes("file:///cache/photo.jpg")).resolves.toEqual(BYTES);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falls back to fetch when the file system cannot read the URI", async () => {
    Platform.OS = "ios";
    mockFileBytes.mockRejectedValue(new Error("unsupported scheme"));
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      arrayBuffer: async () => BYTES.buffer,
    })) as unknown as typeof fetch;

    await expect(readUriAsBytes("ph://asset")).resolves.toEqual(BYTES);
  });

  it("uses fetch for blob: URLs on web", async () => {
    Platform.OS = "web";
    const fetchMock = jest.fn(async () => ({ ok: true, arrayBuffer: async () => BYTES.buffer }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(readUriAsBytes("blob:http://localhost/abc")).resolves.toEqual(BYTES);
    expect(mockFileBytes).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith("blob:http://localhost/abc");
  });

  it("decodes data: URIs without touching the network", async () => {
    Platform.OS = "web";
    const fetchMock = jest.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(readUriAsBytes("data:image/png;base64,AQIDBA==")).resolves.toEqual(BYTES);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws READ_FAILED when nothing can read the file", async () => {
    Platform.OS = "android";
    mockFileBytes.mockRejectedValue(new Error("gone"));
    globalThis.fetch = jest.fn(async () => ({ ok: false })) as unknown as typeof fetch;

    await expect(readUriAsBytes("file:///missing.jpg")).rejects.toThrow("READ_FAILED");
  });
});
