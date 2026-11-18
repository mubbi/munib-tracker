import { ORT_WEB_VERSION } from "@/constants/recitation-models";

import { PracticeError } from "../error-codes";
import type { LoadedModelAssets } from "../model/types";
import type { EngineId } from "../types";
import { createTilawaEngine } from "./tilawa-adapter";
import type { EnginePlatform, OrtNamespace, RecitationEngine } from "./types";

/**
 * Web: `onnxruntime-web`, loaded at run time from our own origin (`/ort/`), not
 * bundled by Metro and not from a public CDN (§7 Web runtime files). The files are
 * copied from `node_modules/onnxruntime-web/dist` by `scripts/copy-ort-wasm.mjs`
 * before `build:web`. The site is not cross-origin isolated (no COOP/COEP, D3), so
 * wasm runs single-threaded.
 */

const ORT_BASE = "/ort/";
const ORT_SCRIPT = `${ORT_BASE}ort.wasm.min.js`;

declare global {
  interface Window {
    ort?: OrtNamespace;
  }
}

let loading: Promise<OrtNamespace> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-munib-ort="${ORT_WEB_VERSION}"]`,
    );
    if (existing && window.ort) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.munibOrt = ORT_WEB_VERSION;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new PracticeError("runtime-unsupported", "ort script failed to load"));
    document.head.appendChild(script);
  });
}

export function isEngineRuntimeSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof WebAssembly === "object" &&
    typeof WebAssembly.instantiate === "function"
  );
}

const platform: EnginePlatform = {
  loadOrt() {
    if (!isEngineRuntimeSupported())
      return Promise.reject(new PracticeError("runtime-unsupported"));
    loading ??= loadScript(ORT_SCRIPT)
      .then(() => {
        const ort = window.ort;
        if (!ort?.InferenceSession) throw new PracticeError("runtime-unsupported");
        if (ort.env?.wasm) {
          ort.env.wasm.wasmPaths = ORT_BASE;
          ort.env.wasm.numThreads = 1;
        }
        return ort;
      })
      .catch((error) => {
        loading = null;
        throw error;
      });
    return loading;
  },
  async createSession(ort, assets: LoadedModelAssets) {
    if (!assets.modelBytes) throw new PracticeError("model-missing");
    return ort.InferenceSession.create(new Uint8Array(assets.modelBytes), {
      executionProviders: ["wasm"],
    });
  },
};

export function createPlatformEngine(
  engine: EngineId,
  assets: LoadedModelAssets,
): Promise<RecitationEngine> {
  return createTilawaEngine(engine, assets, platform);
}
