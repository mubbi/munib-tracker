import { ApiError, getApiBaseUrl } from "@munib-tracker/api-client";

import { appendUploadFile } from "@/lib/attachments/multipart-file-part";
import {
  customAdhkarMediaIds,
  deleteUserMedia,
  deleteUserMediaMany,
  isGuestUserMediaError,
  purgeCustomAdhkarAttachments,
  type UserMediaDto,
  uploadUserMedia,
  userMediaContentUrl,
} from "@/lib/user-media-api";
import { mockApiFetch } from "@/test-support/mocks/api-client";

jest.mock(
  "@munib-tracker/api-client",
  () => require("@/test-support/mocks/api-client").apiClientMock,
);
jest.mock("@/lib/attachments/multipart-file-part", () => ({
  appendUploadFile: jest.fn(async () => undefined),
}));

const TOKEN = "access-token";

const file = (name: string) => ({ uri: `file:///${name}`, mimeType: "image/jpeg", filename: name });

function buildMedia(id: string): UserMediaDto {
  return {
    id,
    mimeType: "image/jpeg",
    filename: `${id}.jpg`,
    sizeBytes: 10,
    contentPath: `/user-media/${id}/content`,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

/** Requests whose method is DELETE, as `url` strings. */
const deletedUrls = () =>
  mockApiFetch.mock.calls
    .map(([request]) => request as { url: string; method: string })
    .filter((request) => request.method === "DELETE")
    .map((request) => request.url);

beforeEach(() => {
  mockApiFetch.mockReset().mockResolvedValue({});
  jest.mocked(appendUploadFile).mockClear();
});

describe("customAdhkarMediaIds", () => {
  it("returns unique media ids", () => {
    expect(
      customAdhkarMediaIds([
        { mediaId: "a" },
        { mediaId: "b" },
        { mediaId: "a" },
        {},
        { mediaId: "" },
      ]),
    ).toEqual(["a", "b"]);
  });

  it.each([undefined, null, []])("returns no ids for %p", (images) => {
    expect(customAdhkarMediaIds(images)).toEqual([]);
  });
});

describe("userMediaContentUrl", () => {
  it("encodes the media id under the API base URL", () => {
    expect(userMediaContentUrl("a/b")).toBe(`${getApiBaseUrl()}/user-media/a%2Fb/content`);
  });
});

describe("uploadUserMedia", () => {
  it("uploads one file per request and returns every item", async () => {
    mockApiFetch
      .mockResolvedValueOnce({ items: [buildMedia("m1")] })
      .mockResolvedValueOnce({ items: [buildMedia("m2")] });
    const uploaded = await uploadUserMedia(TOKEN, [file("a.jpg"), file("b.jpg")]);
    expect(uploaded.map((item) => item.id)).toEqual(["m1", "m2"]);
    expect(appendUploadFile).toHaveBeenCalledTimes(2);
    expect(mockApiFetch).toHaveBeenCalledWith(
      { url: "/user-media", method: "POST", body: expect.any(FormData) },
      { accessToken: TOKEN },
    );
  });

  it("deletes already-uploaded files and rethrows when a later upload fails", async () => {
    const failure = new ApiError("too big", 413);
    mockApiFetch
      .mockResolvedValueOnce({ items: [buildMedia("m1")] })
      .mockRejectedValueOnce(failure)
      .mockResolvedValue({});
    await expect(uploadUserMedia(TOKEN, [file("a.jpg"), file("b.jpg")])).rejects.toBe(failure);
    expect(deletedUrls()).toEqual(["/user-media/m1"]);
  });
});

describe("deleteUserMedia", () => {
  it("sends an encoded DELETE without auth for guests", async () => {
    await deleteUserMedia(undefined, "a b");
    expect(mockApiFetch).toHaveBeenCalledWith({ url: "/user-media/a%20b", method: "DELETE" }, {});
  });
});

describe("deleteUserMediaMany", () => {
  it("deletes each unique, non-empty id once", async () => {
    await deleteUserMediaMany(TOKEN, ["a", "", "b", "a"]);
    expect(deletedUrls().sort()).toEqual(["/user-media/a", "/user-media/b"]);
  });

  it("does nothing for an empty list", async () => {
    await deleteUserMediaMany(TOKEN, ["", ""]);
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it.each([
    ["404 (already gone)", new ApiError("missing", 404)],
    ["other failures", new Error("offline")],
  ])("keeps deleting the rest after %s", async (_label, error) => {
    mockApiFetch.mockRejectedValueOnce(error);
    await expect(deleteUserMediaMany(TOKEN, ["a", "b"])).resolves.toBeUndefined();
    expect(deletedUrls()).toHaveLength(2);
  });
});

describe("purgeCustomAdhkarAttachments", () => {
  it("deletes the attached media ids", async () => {
    await purgeCustomAdhkarAttachments(TOKEN, [{ mediaId: "x" }, {}]);
    expect(deletedUrls()).toEqual(["/user-media/x"]);
  });

  it("is a no-op without attachments", async () => {
    await purgeCustomAdhkarAttachments(TOKEN, null);
    expect(mockApiFetch).not.toHaveBeenCalled();
  });
});

describe("isGuestUserMediaError", () => {
  it.each([
    ["a guest 403", new ApiError("no", 403, { code: "GUEST_NOT_ALLOWED" }), true],
    ["another 403 code", new ApiError("no", 403, { code: "QUOTA" }), false],
    ["a 403 without a body", new ApiError("no", 403), false],
    ["a 403 with a string body", new ApiError("no", 403, "GUEST_NOT_ALLOWED"), false],
    ["a 403 body without a code", new ApiError("no", 403, {}), false],
    ["a different status", new ApiError("no", 401, { code: "GUEST_NOT_ALLOWED" }), false],
    ["a plain error", new Error("GUEST_NOT_ALLOWED"), false],
  ])("is %p for %s", (_label, error, expected) => {
    expect(isGuestUserMediaError(error)).toBe(expected);
  });
});
