import { PracticeError } from "../error-codes";
import type { LoadedModelAssets } from "../model/types";
import type { EngineId } from "../types";
import type { RecitationEngine } from "./types";

/**
 * Fallback for platforms with no runtime (TV, tests). Metro resolves
 * `tilawa.native.ts` / `tilawa.web.ts` on phones and the web.
 */
export async function createPlatformEngine(
  _engine: EngineId,
  _assets: LoadedModelAssets,
): Promise<RecitationEngine> {
  throw new PracticeError("runtime-unsupported");
}

export function isEngineRuntimeSupported(): boolean {
  return false;
}
