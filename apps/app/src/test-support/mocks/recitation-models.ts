/**
 * Tiny stand-in for `@/constants/recitation-models`: three small listener files
 * (model / json / text) whose bytes, SHA-256 and MD5 are real, so model-store
 * tests can verify downloads without 70 MB fixtures. Zipformer is web-hosted;
 * FastConformer is not.
 *
 *   jest.mock("@/constants/recitation-models", () =>
 *     require("@/test-support/mocks/recitation-models").recitationModelsMock);
 */
import { createHash } from "node:crypto";

const encoder = new TextEncoder();

/** Raw bytes of each fixture file, keyed by file name. */
export const RECITATION_FIXTURE_BYTES = {
  "m.onnx": new Uint8Array([1, 2, 3, 4, 5, 6]),
  "c.json": encoder.encode('{"a":1}'),
  "l.txt": encoder.encode("licence"),
} as const;

export type RecitationFixtureName = keyof typeof RECITATION_FIXTURE_BYTES;

const digest = (algorithm: "sha256" | "md5", bytes: Uint8Array) =>
  createHash(algorithm).update(bytes).digest("hex");

const KINDS: Record<RecitationFixtureName, "model" | "json" | "text"> = {
  "m.onnx": "model",
  "c.json": "json",
  "l.txt": "text",
};

export const RECITATION_FIXTURE_FILES = (Object.keys(KINDS) as RecitationFixtureName[]).map(
  (fileName) => {
    const bytes = RECITATION_FIXTURE_BYTES[fileName];
    return {
      fileName,
      url: `https://example.test/${fileName}`,
      bytes: bytes.length,
      sha256: digest("sha256", bytes),
      md5: digest("md5", bytes),
      kind: KINDS[fileName],
    };
  },
);

export const recitationModelsMock = {
  RECITATION_MODELS: {
    "tilawa-zipformer": {
      engine: "tilawa-zipformer",
      version: "v1",
      files: RECITATION_FIXTURE_FILES,
      webHosted: true,
      confirmedMismatchEnabled: true,
      supportsCorrection: true,
    },
    "tilawa-fastconformer": {
      engine: "tilawa-fastconformer",
      version: "v2",
      files: RECITATION_FIXTURE_FILES,
      webHosted: false,
      confirmedMismatchEnabled: false,
      supportsCorrection: false,
    },
  },
  webModelUrl: (engine: string, file: { fileName: string }) => `/models/${engine}/${file.fileName}`,
  ORT_WEB_VERSION: "test",
};
