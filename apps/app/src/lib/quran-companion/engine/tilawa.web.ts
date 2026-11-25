import { ORT_WEB_BASE, ORT_WEB_VERSION } from "@/constants/recitation-models";
import { acquireSpeechSession, speechSessionKey } from "@/lib/speech/session-cache";
import { warmUpSpeechSession } from "@/lib/speech/warm-up";

import { PracticeError } from "../error-codes";
import type { LoadedModelAssets } from "../model/types";
import type { EngineId } from "../types";
import { createTilawaEngine } from "./tilawa-adapter";
import type { EnginePlatform, OrtNamespace, RecitationEngine } from "./types";

/**
 * Web: `onnxruntime-web`, loaded at run time from our own origin
 * (`/ort/<version>/`), not bundled by Metro and not from a public CDN (§7 Web
 * runtime files). The files are copied from `node_modules/onnxruntime-web/dist`
 * by `scripts/copy-ort-wasm.mjs` before `build:web`; the folder is versioned
 * because `/ort/*` is served as immutable. The site is not cross-origin isolated
 * (no COOP/COEP, D3), so wasm runs single-threaded.
 *
 * Sessions are shared and kept warm by `lib/speech/session-cache` and get one
 * warm-up inference when created (`lib/speech/warm-up`).
 *
 * `ort.env.wasm.proxy` (inference in a worker) is deliberately off: with the UMD
 * build the proxy worker is spawned from this script's URL and needs its own
 * browser QA (worker start-up, transfer of the 69–88 MB model, Tilawa's state
 * tensors crossing the worker boundary every chunk). Backlog item.
 */

export const ORT_BASE = ORT_WEB_BASE;
const ORT_SCRIPT = `${ORT_BASE}ort.wasm.min.js`;

/**
 * onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html — wasm EP
 * only (no WebGPU/WebNN: needs per-browser measurement), full graph
 * optimisation (also ORT web's default; stated so both platforms match).
 */
export const WEB_SESSION_OPTIONS = {
  executionProviders: ["wasm"],
  graphOptimizationLevel: "all",
} as const;

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

/** Per-platform ORT loader, shared with the FastConformer runner (`lib/speech`). */
export const enginePlatform: EnginePlatform = {
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
    const bytes = assets.modelBytes;
    const key = speechSessionKey(assets);
    if (!bytes || !key) throw new PracticeError("model-missing");
    return acquireSpeechSession(key, async () => {
      const session = await ort.InferenceSession.create(new Uint8Array(bytes), {
        ...WEB_SESSION_OPTIONS,
      });
      await warmUpSpeechSession(ort, session);
      return session;
    });
  },
};

export function createPlatformEngine(
  engine: EngineId,
  assets: LoadedModelAssets,
): Promise<RecitationEngine> {
  return createTilawaEngine(engine, assets, enginePlatform);
}
