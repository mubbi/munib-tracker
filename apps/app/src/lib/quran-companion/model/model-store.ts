import { PracticeError } from "../error-codes";
import type { RecitationModelStore } from "./types";

/**
 * Fallback model store (TV and tests). Metro resolves `model-store.native.ts` /
 * `model-store.web.ts` on real platforms. Never downloads anything.
 */
export function createRecitationModelStore(): RecitationModelStore {
  return {
    async sizeOnDisk() {
      return 0;
    },
    async isPresent() {
      return false;
    },
    async download() {
      throw new PracticeError("runtime-unsupported");
    },
    canResume() {
      return false;
    },
    async deleteAll() {},
    async cleanupOrphans() {},
    async freeBytes() {
      return null;
    },
    async load() {
      throw new PracticeError("model-missing");
    },
  };
}

export async function deleteRecitationModelFiles(): Promise<void> {}

export async function recitationModelBytesOnDisk(): Promise<number> {
  return 0;
}
