import { submitOssContentDownloadFailure } from "@/lib/oss-content-failure-api";
import { fakeResponse, mockFetch } from "@/test-support/fetch";

describe("submitOssContentDownloadFailure", () => {
  const payload = { contentKind: "qcf_font", contentKey: "qcf_font:page:1" } as never;

  it("POSTs the failure to the API with bearer auth", async () => {
    const fetchMock = mockFetch(fakeResponse({}, { status: 201 }));
    await submitOssContentDownloadFailure("token", payload);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/oss-content-failures/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual(payload);
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer token");
  });

  it("rejects when the API refuses the report", async () => {
    mockFetch(fakeResponse({ message: "bad" }, { status: 400 }));
    await expect(submitOssContentDownloadFailure("token", payload)).rejects.toThrow("bad");
  });
});
