import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import {
  engineDownloadBytes,
  engineDownloadMb,
  ORT_WEB_BASE,
  ORT_WEB_VERSION,
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

  describe("ONNX Runtime Web pin", () => {
    /** Same lookup as scripts/copy-ort-wasm.mjs (hoisted node_modules). */
    function ortWebPackageDir(): string | null {
      let dir = join(__dirname, "..", "..");
      for (let i = 0; i < 6; i++) {
        const candidate = join(dir, "node_modules", "onnxruntime-web", "package.json");
        if (existsSync(candidate)) return dirname(candidate);
        const parent = dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
      return null;
    }

    it("matches the installed onnxruntime-web, which still ships the files the web loader needs", () => {
      const pkgDir = ortWebPackageDir();
      if (!pkgDir) throw new Error("onnxruntime-web is not installed");
      const { version } = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
      expect(ORT_WEB_VERSION).toBe(version);
      for (const name of [
        "ort.wasm.min.js",
        "ort-wasm-simd-threaded.mjs",
        "ort-wasm-simd-threaded.wasm",
      ]) {
        expect(existsSync(join(pkgDir, "dist", name))).toBe(true);
      }
    });

    it("serves the runtime from a version folder that the copy script writes", () => {
      // /ort/* is cached as immutable (vercel.json), so the URL must change with the version.
      expect(ORT_WEB_BASE).toBe(`/ort/${ORT_WEB_VERSION}/`);
      const script = readFileSync(
        join(__dirname, "..", "..", "scripts", "copy-ort-wasm.mjs"),
        "utf8",
      );
      expect(script).toContain("recitation-models.json");
      expect(script).toContain(".ortWebVersion");
      expect(script).toMatch(/join\(base, version\)/);
    });
  });
});
