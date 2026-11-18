import { USER_MEDIA_MAX_BYTES } from "@munib-tracker/shared/constants";

import {
  assertAllowedAttachmentMime,
  assertAttachmentSizeBytes,
  attachmentPickErrorFromUnknown,
  inferMimeFromFileName,
  isImageMime,
  isPdfMime,
  resolvePickedAttachmentMime,
  sniffAttachmentMime,
} from "./attachment-mime";
import { attachmentPickFailureFromOutcome } from "./map-attachment-pick-outcome";

describe("attachmentPickErrorFromUnknown", () => {
  it.each(["UNSUPPORTED_MIME", "FILE_TOO_LARGE", "READ_FAILED", "PERMISSION_DENIED"])(
    "keeps the known code %s",
    (code) => {
      expect(attachmentPickErrorFromUnknown(new Error(code))).toBe(code);
    },
  );

  it.each([new Error("boom"), "READ_FAILED?", null])("maps %p to UNKNOWN", (error) => {
    expect(attachmentPickErrorFromUnknown(error)).toBe("UNKNOWN");
  });

  it("accepts a bare string code", () => {
    expect(attachmentPickErrorFromUnknown("READ_FAILED")).toBe("READ_FAILED");
  });
});

describe("mime helpers", () => {
  it.each([
    ["a.JPG", "image/jpeg"],
    ["a.jpeg", "image/jpeg"],
    ["a.webp", "image/webp"],
    ["a.pdf", "application/pdf"],
    ["a.gif", null],
    ["noext", null],
  ])("infers %s → %p", (name, expected) => {
    expect(inferMimeFromFileName(name)).toBe(expected);
  });

  it("normalizes allowed mimes and rejects others", () => {
    expect(assertAllowedAttachmentMime("Image/PNG; charset=binary")).toBe("image/png");
    expect(() => assertAllowedAttachmentMime("image/gif")).toThrow("UNSUPPORTED_MIME");
  });

  it("prefers a valid picker mime, then the extension", () => {
    expect(resolvePickedAttachmentMime("image/png", "x.pdf")).toBe("image/png");
    expect(resolvePickedAttachmentMime("application/octet-stream", "x.pdf")).toBe(
      "application/pdf",
    );
    expect(resolvePickedAttachmentMime(undefined, "x.jpg")).toBe("image/jpeg");
    expect(() => resolvePickedAttachmentMime(undefined, "x.gif")).toThrow("UNSUPPORTED_MIME");
  });

  it.each([0, Number.NaN, USER_MEDIA_MAX_BYTES + 1])("rejects size %p", (size) => {
    expect(() => assertAttachmentSizeBytes(size)).toThrow("FILE_TOO_LARGE");
  });

  it("accepts sizes within the cap", () => {
    expect(() => assertAttachmentSizeBytes(1)).not.toThrow();
  });

  it("sniffs PDFs and classifies kinds", () => {
    expect(sniffAttachmentMime(new TextEncoder().encode("%PDF-1.7"))).toBe("application/pdf");
    expect(isImageMime("image/webp")).toBe(true);
    expect(isPdfMime("application/pdf")).toBe(true);
    expect(isPdfMime("image/png")).toBe(false);
  });
});

describe("attachmentPickFailureFromOutcome", () => {
  it.each([
    [{ kind: "picked", attachment: {} }, null],
    [{ kind: "canceled" }, { ok: false, canceled: true }],
    [
      { kind: "permission_denied", canAskAgain: false },
      { ok: false, permissionDenied: true, canAskAgain: false, error: "PERMISSION_DENIED" },
    ],
    [{ kind: "mystery" }, { ok: false }],
  ])("maps %o", (outcome, expected) => {
    expect(attachmentPickFailureFromOutcome(outcome as never)).toEqual(expected);
  });
});
