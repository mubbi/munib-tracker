import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, writeJSON } from "@/db/store";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { reportPracticeError } from "@/lib/quran-companion/error-codes";
import { createPronunciationClient } from "@/lib/quran-companion/pronunciation/client";
import { type DrillHeadId, reliableHeads } from "@/lib/quran-companion/pronunciation/judge";
import {
  type PronunciationModelInfo,
  type QuranLabErrorCode,
  type QuranLabNeeds,
  quranLabNeeds,
  type SharingState,
  toQuranLabCode,
} from "@/lib/quran-companion/pronunciation/types";

import { createStore, useStore } from "./create-store";
import { quranCompanionPrefsStore } from "./quran-companion-prefs-store";

/**
 * Phase 6 pronunciation listener (Quran Lab TajweedFormer SDK 4 — D66). Nothing
 * contacts Quran Lab before the person agrees on the consent sheet
 * (`pronunciationConsentAt`), which discloses SDK 4's always-on anonymous
 * analytics + error reports and its own sharing ask. Never runs at the same time
 * as the Tilawa listener.
 */

export type PronunciationStatus =
  | "unavailable"
  | "needs-consent"
  | "not-downloaded"
  | "downloading"
  | "ready"
  | "failed";

type CachedModel = { version: string; context: string; reliable: DrillHeadId[] };

interface PronunciationState {
  status: PronunciationStatus;
  isReady: boolean;
  bytesDone: number;
  bytesTotal: number;
  error: QuranLabErrorCode | null;
  /** SDK 4 `errorCause.needs` for `needs_connection`: download the model vs renew its lease. */
  errorNeeds: QuranLabNeeds | null;
  model: PronunciationModelInfo | null;
  /** Last known validated heads (cached so lessons know before the model opens). */
  cached: CachedModel | null;
  sharing: SharingState;
  load: () => Promise<void>;
  /** Agree on the consent sheet, then download. */
  consentAndDownload: () => Promise<void>;
  download: () => Promise<void>;
  open: () => Promise<PronunciationModelInfo | null>;
  remove: () => Promise<void>;
  refreshSharing: () => Promise<void>;
  setSharingOn: (on: boolean) => Promise<void>;
  deleteShared: () => Promise<boolean>;
  /** Quran Lab's own support report (`client.diagnose()`), configuring the client if needed. */
  diagnose: () => Promise<string | null>;
}

export const pronunciationClient = createPronunciationClient();

/**
 * D66: SDK 4 sends anonymous analytics + error reports and asks about sharing by
 * itself. A consent given before the consent sheet said so (3.x terms) is asked
 * again; ISO timestamps compare correctly as strings.
 */
export const SDK4_CONSENT_FROM = "2026-11-25T00:00:00.000Z";

export function hasCurrentPronunciationConsent(consentAt: string | null | undefined): boolean {
  return !!consentAt && consentAt >= SDK4_CONSENT_FROM;
}

const NO_SHARING: SharingState = { isAvailable: false, isOn: false, recoveryCode: null };

export const quranPronunciationStore = createStore<PronunciationState>((set, get) => ({
  status: "unavailable",
  isReady: false,
  bytesDone: 0,
  bytesTotal: 0,
  error: null,
  errorNeeds: null,
  model: null,
  cached: null,
  sharing: NO_SHARING,

  async load() {
    if (!isPracticeAvailable() || !pronunciationClient.available) {
      set({ status: "unavailable", isReady: true });
      return;
    }
    const cached = await readJSON<CachedModel | null>(DB_KEYS.quranPronunciationModel, null);
    const consented = hasCurrentPronunciationConsent(
      quranCompanionPrefsStore.getState().prefs.pronunciationConsentAt,
    );
    if (!consented) {
      set({ status: "needs-consent", cached, isReady: true });
      return;
    }
    if (get().status === "downloading") return;
    set({ status: cached ? "ready" : "not-downloaded", cached, isReady: true });
    if (cached) void get().refreshSharing();
  },

  async consentAndDownload() {
    await quranCompanionPrefsStore
      .getState()
      .update({ pronunciationConsentAt: new Date().toISOString() });
    await get().download();
  },

  async download() {
    if (get().status === "downloading") return;
    set({ status: "downloading", error: null, errorNeeds: null, bytesDone: 0, bytesTotal: 0 });
    try {
      await pronunciationClient.prefetch((done, total) =>
        set({ bytesDone: done, bytesTotal: total }),
      );
      const info = await get().open();
      set({ status: info ? "ready" : "failed" });
      void get().refreshSharing();
    } catch (error) {
      const code = toQuranLabCode(error);
      // Connectivity and "update the app" are user states, not bugs (Quran Lab gets its own report).
      if (code !== "needs_connection" && code !== "sdk_too_old")
        reportPracticeError(error, "download-failed", "pronunciation-download");
      // A refused key/app removes the model on the SDK side; drop our cache too.
      if (code === "invalid_key" || code === "server_rejected") {
        await removeKey(DB_KEYS.quranPronunciationModel);
        set({ cached: null });
      }
      set({ status: "failed", error: code, errorNeeds: quranLabNeeds(error) });
    }
  },

  async open() {
    try {
      const info = await pronunciationClient.openModel();
      const reliable = reliableHeads(info.calibration, info.defaultContext);
      const cached: CachedModel = { version: info.version, context: info.defaultContext, reliable };
      await writeJSON(DB_KEYS.quranPronunciationModel, cached);
      set({ model: info, cached });
      return info;
    } catch (error) {
      const code = toQuranLabCode(error);
      if (code === "invalid_key" || code === "server_rejected") {
        await removeKey(DB_KEYS.quranPronunciationModel);
        set({ cached: null, model: null, status: "failed", error: code, errorNeeds: null });
      } else {
        set({ error: code, errorNeeds: quranLabNeeds(error) });
      }
      return null;
    }
  },

  async remove() {
    try {
      await pronunciationClient.removeModels();
    } catch {
      // best effort
    }
    await removeKey(DB_KEYS.quranPronunciationModel);
    set({ model: null, cached: null, status: "not-downloaded", bytesDone: 0, bytesTotal: 0 });
  },

  async refreshSharing() {
    try {
      set({ sharing: await pronunciationClient.sharingState() });
    } catch {
      set({ sharing: NO_SHARING });
    }
  },

  async setSharingOn(on) {
    await pronunciationClient.setSharingOn(on);
    await get().refreshSharing();
  },

  async deleteShared() {
    const ok = await pronunciationClient.deleteShared();
    await get().refreshSharing();
    return ok;
  },

  async diagnose() {
    try {
      await pronunciationClient.configure();
    } catch {
      // A client that can't configure still has nothing to report.
    }
    return pronunciationClient.diagnose();
  },
}));

export function useEnsurePronunciationLoaded(): void {
  useEffect(() => {
    if (!quranPronunciationStore.getState().isReady) void quranPronunciationStore.getState().load();
  }, []);
}

export function usePronunciationState() {
  return useStore(quranPronunciationStore, (s) => s);
}

/** Wipe helper: remove the SDK's model files and our cache. Never touches sharing consent. */
export async function wipePronunciationModels(): Promise<void> {
  try {
    if (pronunciationClient.available) await pronunciationClient.removeModels();
  } catch {
    // best effort
  }
  quranPronunciationStore.setState({
    model: null,
    cached: null,
    status: "unavailable",
    isReady: false,
  });
}
