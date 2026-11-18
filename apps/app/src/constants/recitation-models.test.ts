import {
  engineDownloadBytes,
  engineDownloadMb,
  RECITATION_MODELS,
  WEB_MODEL_BASE,
  webModelUrl,
} from "./recitation-models";

describe("recitation models", () => {
  it("sums an engine's pinned file sizes", () => {
    const files = RECITATION_MODELS["tilawa-zipformer"].files;
    expect(engineDownloadBytes("tilawa-zipformer")).toBe(files.reduce((s, f) => s + f.bytes, 0));
  });

  it("rounds the download size to whole megabytes", () => {
    expect(engineDownloadMb("tilawa-zipformer")).toBe(
      Math.round(engineDownloadBytes("tilawa-zipformer") / (1024 * 1024)),
    );
  });

  it("versions same-origin web URLs by the file digest", () => {
    const [file] = RECITATION_MODELS["tilawa-fastconformer"].files;
    if (!file) throw new Error("expected a pinned file");
    expect(webModelUrl("tilawa-fastconformer", file)).toBe(
      `${WEB_MODEL_BASE}tilawa-fastconformer/${file.sha256.slice(0, 12)}/${file.fileName}`,
    );
  });
});
