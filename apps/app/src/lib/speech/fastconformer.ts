import { RECITATION_MODELS } from "@/constants/recitation-models";
import { enginePlatform, isEngineRuntimeSupported } from "@/lib/quran-companion/engine/tilawa";
import { PracticeError } from "@/lib/quran-companion/error-codes";
import type { LoadedModelAssets, RecitationModelManifest } from "@/lib/quran-companion/model/types";

import { createFastConformerRunner, type FastConformerRunner } from "./fastconformer-runner";

/**
 * Platform entry for the shared FastConformer runner. The ORT runtime and the
 * session come from the same per-platform loader Qur'an practice uses
 * (`engine/tilawa.{native,web}.ts` → `enginePlatform`), and the model files from
 * the same pinned, hash-checked store (`model/model-store.*`), so a user who
 * already downloaded FastConformer for practice downloads nothing new.
 *
 * The session is created lazily by the caller (when listening starts) and must be
 * released when it stops (`runner.release()`).
 */

export const FASTCONFORMER_ENGINE = "tilawa-fastconformer" as const;

/** The pinned model version — phrase / ayah token files are locked to it. */
export const FASTCONFORMER_VERSION: string = RECITATION_MODELS[FASTCONFORMER_ENGINE].version;

/** True when this platform can run ORT at all (false on TV and in tests). */
export function isFastConformerRuntimeSupported(): boolean {
  return isEngineRuntimeSupported();
}

/** True when the installed manifest is the pinned FastConformer build. */
export function isFastConformerManifest(manifest: RecitationModelManifest | null | undefined) {
  return manifest?.engine === FASTCONFORMER_ENGINE && manifest.version === FASTCONFORMER_VERSION;
}

/** Create an ORT session over the installed FastConformer files. Throws a `PracticeError`. */
export async function openFastConformerRunner(
  assets: LoadedModelAssets,
): Promise<FastConformerRunner> {
  if (!isFastConformerRuntimeSupported()) throw new PracticeError("runtime-unsupported");
  const ort = await enginePlatform.loadOrt();
  const session = await enginePlatform.createSession(ort, assets);
  return createFastConformerRunner(ort, session);
}
