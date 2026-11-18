import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { usePlatformSwitch } from "@/test-support/platform";

const mockFileBytes = jest.fn();

jest.mock("expo-file-system", () => ({
  File: jest.fn().mockImplementation(() => ({ bytes: mockFileBytes })),
}));

import { readUriAsBytes } from "./read-uri-bytes";

const BYTES = new Uint8Array([1, 2, 3, 4]);
/** A fetch reply whose body is `BYTES`. */
const bytesResponse = () => ({ ...fakeResponse(), arrayBuffer: async () => BYTES.buffer });

describe("readUriAsBytes", () => {
  const onPlatform = usePlatformSwitch();

  afterEach(() => jest.clearAllMocks());

  it("reads native files through expo-file-system, not fetch", async () => {
    onPlatform({ OS: "android" });
    mockFileBytes.mockResolvedValue(BYTES);
    const fetchMock = mockFetch();

    await expect(readUriAsBytes("file:///cache/photo.jpg")).resolves.toEqual(BYTES);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falls back to fetch when the file system cannot read the URI", async () => {
    onPlatform({ OS: "ios" });
    mockFileBytes.mockRejectedValue(new Error("unsupported scheme"));
    mockFetch(bytesResponse());

    await expect(readUriAsBytes("ph://asset")).resolves.toEqual(BYTES);
  });

  it("uses fetch for blob: URLs on web", async () => {
    onPlatform({ OS: "web" });
    const fetchMock = mockFetch(bytesResponse());

    await expect(readUriAsBytes("blob:http://localhost/abc")).resolves.toEqual(BYTES);
    expect(mockFileBytes).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith("blob:http://localhost/abc");
  });

  it("decodes data: URIs without touching the network", async () => {
    onPlatform({ OS: "web" });
    const fetchMock = mockFetch();

    await expect(readUriAsBytes("data:image/png;base64,AQIDBA==")).resolves.toEqual(BYTES);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws READ_FAILED when nothing can read the file", async () => {
    onPlatform({ OS: "android" });
    mockFileBytes.mockRejectedValue(new Error("gone"));
    mockFetch(fakeResponse({}, { status: 500 }));

    await expect(readUriAsBytes("file:///missing.jpg")).rejects.toThrow("READ_FAILED");
  });
});
