import { RECITATION_MODELS } from "@/constants/recitation-models";
import {
  downloadPercent,
  initialListenerState,
  isListenerUsable,
  listenerReducer,
} from "./download-job";
import type { RecitationModelManifest } from "./types";

const spec = RECITATION_MODELS["tilawa-zipformer"];
const manifest: RecitationModelManifest = {
  engine: "tilawa-zipformer",
  version: spec.version,
  files: spec.files.map(({ fileName, bytes, sha256, md5 }) => ({ fileName, bytes, sha256, md5 })),
  downloadedAt: "2026-11-17T00:00:00.000Z",
};

describe("listener state machine (§9.5 Card 1)", () => {
  const start = initialListenerState("tilawa-zipformer");

  it("downloads, verifies, and becomes ready", () => {
    let s = listenerReducer(start, { type: "start", engine: "tilawa-zipformer", bytesTotal: 100 });
    s = listenerReducer(s, { type: "progress", bytesDone: 40, bytesTotal: 100 });
    expect(downloadPercent(s)).toBe(40);
    s = listenerReducer(s, { type: "verifying" });
    expect(s.status).toBe("verifying");
    s = listenerReducer(s, { type: "done", manifest });
    expect(s.status).toBe("ready");
    expect(isListenerUsable(s)).toBe(true);
  });

  it("cancel returns to not downloaded", () => {
    let s = listenerReducer(start, { type: "start", engine: "tilawa-zipformer", bytesTotal: 100 });
    s = listenerReducer(s, { type: "cancelled" });
    expect(s.status).toBe("not-downloaded");
  });

  it("a checksum mismatch needs another try", () => {
    let s = listenerReducer(start, { type: "start", engine: "tilawa-zipformer", bytesTotal: 100 });
    s = listenerReducer(s, { type: "failed", code: "checksum-mismatch" });
    expect(s).toMatchObject({ status: "failed", error: "checksum-mismatch" });
  });

  it("a failed update keeps the old file usable", () => {
    let s = listenerReducer(start, {
      type: "loaded",
      manifest: { ...manifest, version: "old" },
      present: true,
      engine: "tilawa-zipformer",
    });
    expect(s.status).toBe("update-available");
    s = listenerReducer(s, { type: "start", engine: "tilawa-zipformer", bytesTotal: 100 });
    s = listenerReducer(s, { type: "failed", code: "no-connection" });
    expect(s.status).toBe("update-available");
    expect(isListenerUsable(s)).toBe(true);
  });

  it("an evicted file (manifest without files) reads as not downloaded, without an error", () => {
    const s = listenerReducer(start, {
      type: "loaded",
      manifest,
      present: false,
      engine: "tilawa-zipformer",
    });
    expect(s).toMatchObject({ status: "not-downloaded", error: null });
  });

  it("pins every file to a release tag with checksums", () => {
    for (const engine of Object.values(RECITATION_MODELS)) {
      for (const f of engine.files) {
        expect(f.url).toMatch(
          /^https:\/\/github\.com\/yazinsai\/tilawa\/releases\/download\/[^/]+\//,
        );
        expect(f.url).not.toMatch(/latest/);
        expect(f.sha256).toMatch(/^[0-9a-f]{64}$/);
        expect(f.md5).toMatch(/^[0-9a-f]{32}$/);
      }
    }
  });
});
