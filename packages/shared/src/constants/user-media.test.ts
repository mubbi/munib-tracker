import { describe, expect, it } from "vitest";
import {
  normalizeUserMediaMime,
  sniffUserMediaMime,
  USER_MEDIA_ALLOWED_MIME_TYPES,
  USER_MEDIA_MAX_BYTES,
  USER_MEDIA_MAX_PER_ENTITY,
} from "./user-media";
import {
  normalizeUserMediaMime as normalizeViaLegacyPath,
  sniffUserMediaMime as sniffViaLegacyPath,
} from "./user-media-mime";

const JPEG = [0xff, 0xd8, 0xff, 0xe0];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00];
// RIFF....WEBP — bytes 4-7 are the chunk size and are ignored.
const WEBP = [0x52, 0x49, 0x46, 0x46, 0x01, 0x02, 0x03, 0x04, 0x57, 0x45, 0x42, 0x50, 0x00];
const PDF = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31];

const SIGNATURES = [
  ["image/jpeg", JPEG, [0, 1, 2], 3],
  ["image/png", PNG, [0, 1, 2, 3, 4, 5, 6, 7], 8],
  ["image/webp", WEBP, [0, 1, 2, 3, 8, 9, 10, 11], 12],
  ["application/pdf", PDF, [0, 1, 2, 3, 4], 5],
] as const;

describe("user media limits", () => {
  it("exposes upload limits", () => {
    expect(USER_MEDIA_MAX_PER_ENTITY).toBe(5);
    expect(USER_MEDIA_MAX_BYTES).toBe(1_048_576);
    expect(USER_MEDIA_ALLOWED_MIME_TYPES).toContain("application/pdf");
  });
});

const TAMPERED_BYTES = SIGNATURES.flatMap(([mime, bytes, significant]) =>
  significant.map((index) => [mime, index, bytes] as const),
);

describe("sniffUserMediaMime", () => {
  it.each(SIGNATURES)("detects %s from magic bytes", (mime, bytes) => {
    expect(sniffUserMediaMime(Uint8Array.from(bytes))).toBe(mime);
  });

  it.each(TAMPERED_BYTES)("rejects %s when byte %i differs", (mime, index, bytes) => {
    const tampered = Uint8Array.from(bytes);
    tampered[index] = (tampered[index] ?? 0) ^ 0xff;

    expect(sniffUserMediaMime(tampered)).not.toBe(mime);
  });

  it.each(SIGNATURES)(
    "rejects %s when the buffer is shorter than its signature",
    (mime, bytes, _significant, minLength) => {
      expect(sniffUserMediaMime(Uint8Array.from(bytes.slice(0, minLength - 1)))).not.toBe(mime);
    },
  );

  it.each([
    ["an empty buffer", []],
    ["a GIF header", [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  ])("returns null for %s", (_label, bytes) => {
    expect(sniffUserMediaMime(Uint8Array.from(bytes))).toBeNull();
  });

  it("is re-exported from the legacy module path", () => {
    expect(sniffViaLegacyPath(Uint8Array.from(PDF))).toBe("application/pdf");
  });
});

describe("normalizeUserMediaMime", () => {
  it.each([
    [" IMAGE/PNG ", "image/png"],
    ["application/pdf; charset=binary", "application/pdf"],
    ["image/gif", null],
    ["", null],
    [";", null],
  ])("%j -> %j", (mime, expected) => {
    expect(normalizeUserMediaMime(mime)).toBe(expected);
  });

  it("is re-exported from the legacy module path", () => {
    expect(normalizeViaLegacyPath("image/webp")).toBe("image/webp");
  });
});
