import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { reportPracticeError } from "@/lib/quran-companion/error-codes";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import { setPlatform } from "@/test-support/platform";

import { quranCompanionPrefsStore } from "./quran-companion-prefs-store";
import {
  hasCurrentPronunciationConsent,
  pronunciationClient,
  quranPronunciationStore,
  SDK4_CONSENT_FROM,
  useEnsurePronunciationLoaded,
  usePronunciationState,
  wipePronunciationModels,
} from "./quran-pronunciation-store";

jest.mock("@/lib/quran-companion/pronunciation/client", () => ({
  createPronunciationClient: () => ({
    available: true,
    prefetch: jest.fn(),
    openModel: jest.fn(),
    removeModels: jest.fn(),
    sharingState: jest.fn(),
    setSharingOn: jest.fn(),
    deleteShared: jest.fn(),
  }),
}));
jest.mock("@/lib/quran-companion/pronunciation/judge", () => ({
  reliableHeads: jest.fn(() => ["madd"]),
}));
jest.mock("@/lib/quran-companion/error-codes", () => ({
  reportPracticeError: jest.fn(),
}));

type MutableClient = { available: boolean } & Record<
  "prefetch" | "openModel" | "removeModels" | "sharingState" | "setSharingOn" | "deleteShared",
  jest.Mock
>;
const client = pronunciationClient as unknown as MutableClient;

const MODEL_INFO = { version: "1.2.0", defaultContext: "hafs", calibration: {} };
const SHARING_ON = { isAvailable: true, isOn: true, recoveryCode: "ABC" };
const NO_SHARING = { isAvailable: false, isOn: false, recoveryCode: null };

const labError = (code: string) => Object.assign(new Error(code), { code });

function setConsent(consented: boolean) {
  quranCompanionPrefsStore.setState({
    prefs: {
      ...DEFAULT_COMPANION_PREFS,
      pronunciationConsentAt: consented ? "2026-11-26T00:00:00.000Z" : undefined,
    },
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  client.available = true;
  client.sharingState.mockResolvedValue(SHARING_ON);
  client.openModel.mockResolvedValue(MODEL_INFO);
  client.prefetch.mockResolvedValue(undefined);
  client.removeModels.mockResolvedValue(undefined);
  setConsent(false);
  quranPronunciationStore.setState({
    status: "unavailable",
    isReady: false,
    bytesDone: 0,
    bytesTotal: 0,
    error: null,
    errorNeeds: null,
    model: null,
    cached: null,
    sharing: NO_SHARING,
  });
});

const state = () => quranPronunciationStore.getState();

describe("load", () => {
  it("is unavailable on TV, where practice is hidden", async () => {
    const restore = setPlatform({ isTV: true });
    await state().load();
    restore();
    expect(state()).toMatchObject({ status: "unavailable", isReady: true });
  });

  it("is unavailable when the pronunciation client is missing", async () => {
    client.available = false;
    await state().load();
    expect(state()).toMatchObject({ status: "unavailable", isReady: true });
  });

  it("asks again when consent was given under the 3.x terms (before D66's disclosure)", async () => {
    quranCompanionPrefsStore.setState({
      prefs: { ...DEFAULT_COMPANION_PREFS, pronunciationConsentAt: "2026-11-01T00:00:00.000Z" },
    });
    await writeJSON(DB_KEYS.quranPronunciationModel, {
      version: "1",
      context: "hafs",
      reliable: [],
    });
    await state().load();
    expect(state().status).toBe("needs-consent");
    expect(hasCurrentPronunciationConsent(SDK4_CONSENT_FROM)).toBe(true);
    expect(hasCurrentPronunciationConsent(undefined)).toBe(false);
  });

  it("keeps SDK 4's errorCause.needs when a download fails offline", async () => {
    setConsent(true);
    client.prefetch.mockRejectedValue(
      Object.assign(new Error("[needs=lease stage=lease reason=network] x"), {
        code: "needs_connection",
      }),
    );
    await state().download();
    expect(state()).toMatchObject({
      status: "failed",
      error: "needs_connection",
      errorNeeds: "lease",
    });
  });

  it("asks for consent before anything else, keeping the cached heads", async () => {
    const cached = { version: "1", context: "hafs", reliable: ["madd"] };
    await writeJSON(DB_KEYS.quranPronunciationModel, cached);
    await state().load();
    expect(state()).toMatchObject({ status: "needs-consent", cached, isReady: true });
    expect(client.sharingState).not.toHaveBeenCalled();
  });

  it("is not-downloaded after consent when there is no cached model", async () => {
    setConsent(true);
    await state().load();
    expect(state().status).toBe("not-downloaded");
    expect(client.sharingState).not.toHaveBeenCalled();
  });

  it("is ready with a cached model and refreshes sharing", async () => {
    setConsent(true);
    await writeJSON(DB_KEYS.quranPronunciationModel, { version: "1", context: "c", reliable: [] });
    await state().load();
    expect(state().status).toBe("ready");
    await waitFor(() => expect(state().sharing).toEqual(SHARING_ON));
  });

  it("leaves an in-flight download alone", async () => {
    setConsent(true);
    quranPronunciationStore.setState({ status: "downloading" });
    await state().load();
    expect(state().status).toBe("downloading");
    expect(state().isReady).toBe(false);
  });
});

describe("download", () => {
  it("consentAndDownload records consent, downloads and opens the model", async () => {
    client.prefetch.mockImplementation(async (onProgress: (d: number, t: number) => void) => {
      onProgress(5, 10);
    });

    await state().consentAndDownload();

    expect(quranCompanionPrefsStore.getState().prefs.pronunciationConsentAt).toEqual(
      expect.any(String),
    );
    expect(state()).toMatchObject({
      status: "ready",
      bytesDone: 5,
      bytesTotal: 10,
      model: MODEL_INFO,
      cached: { version: "1.2.0", context: "hafs", reliable: ["madd"] },
    });
    expect(await readJSON(DB_KEYS.quranPronunciationModel, null)).toEqual({
      version: "1.2.0",
      context: "hafs",
      reliable: ["madd"],
    });
    await waitFor(() => expect(state().sharing).toEqual(SHARING_ON));
  });

  it("is a no-op while already downloading", async () => {
    quranPronunciationStore.setState({ status: "downloading" });
    await state().download();
    expect(client.prefetch).not.toHaveBeenCalled();
  });

  it("marks failed when the model cannot be opened after download", async () => {
    client.openModel.mockRejectedValue(labError("engine_failed"));
    await state().download();
    expect(state()).toMatchObject({ status: "failed", error: "engine_failed" });
  });

  it("does not report connectivity failures", async () => {
    client.prefetch.mockRejectedValue(labError("needs_connection"));
    await state().download();
    expect(state()).toMatchObject({ status: "failed", error: "needs_connection" });
    expect(reportPracticeError).not.toHaveBeenCalled();
  });

  it("reports other failures and drops the cache on a rejected key", async () => {
    await writeJSON(DB_KEYS.quranPronunciationModel, { version: "1", context: "c", reliable: [] });
    quranPronunciationStore.setState({ cached: { version: "1", context: "c", reliable: [] } });
    const error = labError("invalid_key");
    client.prefetch.mockRejectedValue(error);

    await state().download();

    expect(reportPracticeError).toHaveBeenCalledWith(
      error,
      "download-failed",
      "pronunciation-download",
    );
    expect(state()).toMatchObject({ status: "failed", error: "invalid_key", cached: null });
    expect(await readJSON(DB_KEYS.quranPronunciationModel, null)).toBeNull();
  });

  it("keeps the cache for a generic download failure", async () => {
    const cached = { version: "1", context: "c", reliable: [] };
    quranPronunciationStore.setState({ cached });
    client.prefetch.mockRejectedValue(labError("storage_full"));
    await state().download();
    expect(state()).toMatchObject({ status: "failed", error: "storage_full", cached });
  });
});

describe("open", () => {
  it("drops the model and cache when the server rejects the app", async () => {
    await writeJSON(DB_KEYS.quranPronunciationModel, { version: "1", context: "c", reliable: [] });
    client.openModel.mockRejectedValue(labError("server_rejected"));

    await expect(state().open()).resolves.toBeNull();

    expect(state()).toMatchObject({
      status: "failed",
      error: "server_rejected",
      model: null,
      cached: null,
    });
    expect(await readJSON(DB_KEYS.quranPronunciationModel, null)).toBeNull();
  });
});

describe("remove / sharing", () => {
  it("remove clears the model even when the SDK throws", async () => {
    client.removeModels.mockRejectedValue(new Error("boom"));
    await writeJSON(DB_KEYS.quranPronunciationModel, { version: "1", context: "c", reliable: [] });
    quranPronunciationStore.setState({ status: "ready", model: MODEL_INFO as never, bytesDone: 3 });

    await state().remove();

    expect(state()).toMatchObject({
      status: "not-downloaded",
      model: null,
      cached: null,
      bytesDone: 0,
    });
    expect(await readJSON(DB_KEYS.quranPronunciationModel, null)).toBeNull();
  });

  it("refreshSharing falls back to off when the SDK throws", async () => {
    quranPronunciationStore.setState({ sharing: SHARING_ON });
    client.sharingState.mockRejectedValue(new Error("offline"));
    await state().refreshSharing();
    expect(state().sharing).toEqual(NO_SHARING);
  });

  it("setSharingOn and deleteShared call the SDK then refresh", async () => {
    client.deleteShared.mockResolvedValue(true);

    await state().setSharingOn(true);
    expect(client.setSharingOn).toHaveBeenCalledWith(true);
    expect(state().sharing).toEqual(SHARING_ON);

    client.sharingState.mockResolvedValue(NO_SHARING);
    await expect(state().deleteShared()).resolves.toBe(true);
    expect(state().sharing).toEqual(NO_SHARING);
  });
});

describe("wipePronunciationModels", () => {
  it("removes SDK models and resets the store", async () => {
    quranPronunciationStore.setState({
      status: "ready",
      isReady: true,
      model: MODEL_INFO as never,
    });
    await wipePronunciationModels();
    expect(client.removeModels).toHaveBeenCalled();
    expect(state()).toMatchObject({ status: "unavailable", isReady: false, model: null });
  });

  it("skips the SDK when unavailable and swallows SDK errors", async () => {
    client.available = false;
    await wipePronunciationModels();
    expect(client.removeModels).not.toHaveBeenCalled();

    client.available = true;
    client.removeModels.mockRejectedValue(new Error("boom"));
    await expect(wipePronunciationModels()).resolves.toBeUndefined();
  });
});

describe("hooks", () => {
  it("loads on mount once and exposes the whole state", async () => {
    setConsent(true);
    const { result } = await renderHook(() => {
      useEnsurePronunciationLoaded();
      return usePronunciationState();
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.status).toBe("not-downloaded");

    const load = jest.spyOn(state(), "load");
    await renderHook(() => useEnsurePronunciationLoaded());
    expect(load).not.toHaveBeenCalled();
    load.mockRestore();
  });
});
