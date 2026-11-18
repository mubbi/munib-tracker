import { ApiError } from "@munib-tracker/api-client";
import type { CreateContentReportPayload } from "@munib-tracker/shared/types/content-report";

import { appendUploadFile } from "@/lib/attachments/multipart-file-part";
import {
  getContentReport,
  isGuestReportError,
  isOfflineReportError,
  listContentReports,
  submitContentReport,
} from "@/lib/content-report-api";
import { mockApiFetch } from "@/test-support/mocks/api-client";

jest.mock(
  "@munib-tracker/api-client",
  () => require("@/test-support/mocks/api-client").apiClientMock,
);
jest.mock("@/lib/attachments/multipart-file-part", () => ({
  appendUploadFile: jest.fn(async () => undefined),
}));

const TOKEN = "access-token";
const JSON_GET = { method: "GET", headers: { Accept: "application/json" } };

beforeEach(() => {
  mockApiFetch.mockReset().mockResolvedValue({ id: "r1" });
  jest.mocked(appendUploadFile).mockClear();
});

describe("submitContentReport", () => {
  const payload = {
    contentKind: "dua",
    contentRef: "dua:1",
  } as unknown as CreateContentReportPayload;

  it("posts the JSON payload as multipart form data", async () => {
    await expect(submitContentReport(TOKEN, payload)).resolves.toEqual({ id: "r1" });
    const [request, auth] = mockApiFetch.mock.calls[0];
    expect(request).toMatchObject({ url: "/content-reports", method: "POST" });
    expect((request.body as FormData).get("payload")).toBe(JSON.stringify(payload));
    expect(auth).toEqual({ accessToken: TOKEN });
    expect(appendUploadFile).not.toHaveBeenCalled();
  });

  it("appends each attachment", async () => {
    const files = [
      { uri: "file:///a.jpg", mimeType: "image/jpeg", filename: "a.jpg" },
      { uri: "file:///b.png", mimeType: "image/png", filename: "b.png" },
    ];
    await submitContentReport(TOKEN, payload, files);
    expect(
      jest.mocked(appendUploadFile).mock.calls.map(([, field, file]) => [field, file]),
    ).toEqual(files.map((file) => ["attachments", file]));
  });
});

describe("reading reports", () => {
  it("lists reports with default paging", async () => {
    await listContentReports(TOKEN);
    expect(mockApiFetch).toHaveBeenCalledWith(
      { url: "/content-reports?page=1&limit=20", ...JSON_GET },
      { accessToken: TOKEN },
    );
  });

  it("lists a specific page", async () => {
    await listContentReports(TOKEN, 3, 5);
    expect(mockApiFetch.mock.calls[0][0].url).toBe("/content-reports?page=3&limit=5");
  });

  it("fetches one report by encoded id", async () => {
    await getContentReport(TOKEN, "a/b");
    expect(mockApiFetch).toHaveBeenCalledWith(
      { url: "/content-reports/a%2Fb", ...JSON_GET },
      { accessToken: TOKEN },
    );
  });
});

describe("error classification", () => {
  it.each([
    [new ApiError("no", 403, { code: "GUEST_NOT_ALLOWED" }), true],
    [new ApiError("no", 403, { code: "OTHER" }), false],
    [new ApiError("no", 403, null), false],
    [new ApiError("no", 403, "GUEST_NOT_ALLOWED"), false],
    [new ApiError("no", 403, {}), false],
    [new ApiError("no", 500, { code: "GUEST_NOT_ALLOWED" }), false],
    [new Error("GUEST_NOT_ALLOWED"), false],
  ])("isGuestReportError(%p) → %p", (error, expected) => {
    expect(isGuestReportError(error)).toBe(expected);
  });

  it.each([
    [new TypeError("Network request failed"), true],
    [new ApiError("offline", 0), true],
    [new ApiError("server", 503), false],
    [new Error("other"), false],
  ])("isOfflineReportError(%p) → %p", (error, expected) => {
    expect(isOfflineReportError(error)).toBe(expected);
  });
});
