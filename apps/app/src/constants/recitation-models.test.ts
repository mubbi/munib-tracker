import {
  engineDownloadBytes,
  engineDownloadMb,
  RECITATION_MODELS,
  WEB_MODEL_BASE,
  webModelUrl,
  webSourceUrl,
} from "./recitation-models";

const HF_MIRROR =
  "https://huggingface.co/acibZ/tilawa-quran-onnx/resolve/0cd79471524bc9cfa1c9296055242a935a1873e4/";

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

  it("serves FastConformer on the web from the pinned Hugging Face mirror (D18)", () => {
    const spec = RECITATION_MODELS["tilawa-fastconformer"];
    expect(spec.webHosted).toBe(true);
    for (const file of spec.files) {
      expect(file.webUrl).toBe(`${HF_MIRROR}${file.fileName}`);
      expect(webSourceUrl("tilawa-fastconformer", file)).toBe(file.webUrl);
    }
  });

  it("keeps Zipformer on the same-origin copy", () => {
    for (const file of RECITATION_MODELS["tilawa-zipformer"].files) {
      expect(file.webUrl).toBeUndefined();
      expect(webSourceUrl("tilawa-zipformer", file)).toBe(webModelUrl("tilawa-zipformer", file));
    }
  });
});
