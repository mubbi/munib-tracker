import type { CompanionEvent, EngineId } from "../types";
import type { RecitationEngine } from "./types";

/**
 * The engine used on TV, when the listener is missing, or after a failed init
 * (§8). It never emits a position, so the session stays listen-only: Hear, manual
 * Reveal, and no match counts.
 */
export function createUnavailableEngine(id: EngineId = "tilawa-zipformer"): RecitationEngine {
  const listeners = new Set<(event: CompanionEvent) => void>();
  return {
    id,
    ready: false,
    confirmsMismatches: false,
    async start() {
      for (const l of listeners) l({ type: "failed", code: "model-missing" });
    },
    feed() {},
    async stop() {},
    async dispose() {
      listeners.clear();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    engineWords() {
      return [];
    },
  };
}
