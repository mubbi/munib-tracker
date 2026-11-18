import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { getNetworkStateAsync, NetworkStateType } from "expo-network";

import { engineDownloadBytes } from "@/constants/recitation-models";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { isEngineRuntimeSupported } from "@/lib/quran-companion/engine/tilawa";
import { PracticeError } from "@/lib/quran-companion/error-codes";
import { initialListenerState, type ListenerState } from "@/lib/quran-companion/model/download-job";
import type { RecitationModelManifest } from "@/lib/quran-companion/model/types";
import { captureAppException } from "@/lib/sentry";
import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";
import { buildRecitationManifest } from "@/test-support/fixtures/quran-companion";
import { setPlatform } from "@/test-support/platform";

import {
  loadInstalledModel,
  quranListenerStore,
  useEnsureListenerLoaded,
  useListenerBytesOnDisk,
  useListenerState,
} from "./quran-listener-store";

jest.mock("@/lib/quran-companion/model/model-store", () => {
  // Created at module load by the store, so the shared fake must live in the factory.
  const store = {
    sizeOnDisk: jest.fn(async () => 0),
    isPresent: jest.fn(async () => false),
    download: jest.fn(),
    canResume: jest.fn(() => false),
    deleteAll: jest.fn(async () => {}),
    cleanupOrphans: jest.fn(async () => {}),
    freeBytes: jest.fn(async () => null),
    load: jest.fn(),
  };
  return { createRecitationModelStore: () => store, __store: store };
});
jest.mock("@/lib/quran-companion/engine/tilawa", () => ({
  isEngineRuntimeSupported: jest.fn(() => true),
}));
jest.mock("@/lib/sentry", () => ({ captureAppException: jest.fn() }));
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(),
  NetworkStateType: { WIFI: "WIFI", ETHERNET: "ETHERNET", CELLULAR: "CELLULAR" },
}));

const mockModelStore = (
  jest.requireMock("@/lib/quran-companion/model/model-store") as {
    __store: Record<string, jest.Mock>;
  }
).__store;
const mockNetwork = getNetworkStateAsync as jest.Mock;
const mockRuntime = isEngineRuntimeSupported as jest.Mock;

const status = () => quranListenerStore.getState().listener.status;
const appState = captureAppStateListener();

function setListener(patch: Partial<ListenerState>) {
  quranListenerStore.setState({
    listener: { ...initialListenerState("tilawa-zipformer"), ...patch },
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  mockRuntime.mockReturnValue(true);
  mockModelStore.sizeOnDisk.mockResolvedValue(0);
  mockModelStore.isPresent.mockResolvedValue(false);
  mockModelStore.canResume.mockReturnValue(false);
  mockNetwork.mockResolvedValue({ type: NetworkStateType.WIFI });
  quranListenerStore.setState({
    listener: initialListenerState("tilawa-zipformer"),
    isReady: false,
    bytesOnDisk: 0,
  });
});

describe("load", () => {
  it("marks the listener unsupported when practice is unavailable", async () => {
    const restore = setPlatform({ isTV: true });
    await quranListenerStore.getState().load("tilawa-zipformer");
    restore();
    expect(status()).toBe("unsupported");
    expect(quranListenerStore.getState().isReady).toBe(true);
    expect(mockModelStore.cleanupOrphans).not.toHaveBeenCalled();
  });

  it("marks the listener unsupported when the engine runtime is missing", async () => {
    mockRuntime.mockReturnValue(false);
    await quranListenerStore.getState().load("tilawa-zipformer");
    expect(status()).toBe("unsupported");
  });

  it("arms the foreground resume listener only once", async () => {
    await quranListenerStore.getState().load("tilawa-zipformer");
    await quranListenerStore.getState().load("tilawa-zipformer");
    // Armed lazily by the first load in this module instance (possibly an earlier test).
    expect(appState.spy.mock.calls.length).toBeLessThanOrEqual(1);
    expect(appState.isArmed()).toBe(true);
  });

  it("does not interrupt a running download", async () => {
    setListener({ status: "downloading" });
    await quranListenerStore.getState().load("tilawa-zipformer");
    expect(status()).toBe("downloading");
    expect(quranListenerStore.getState().isReady).toBe(true);
    expect(mockModelStore.isPresent).not.toHaveBeenCalled();
  });

  it("loads an installed model as ready and reports bytes on disk", async () => {
    const manifest = buildRecitationManifest("tilawa-zipformer");
    await writeJSON(DB_KEYS.quranRecitationModel, manifest);
    mockModelStore.isPresent.mockResolvedValue(true);
    mockModelStore.sizeOnDisk.mockResolvedValue(1234);

    await quranListenerStore.getState().load("tilawa-zipformer");

    expect(status()).toBe("ready");
    expect(quranListenerStore.getState().listener.manifest).toEqual(manifest);
    expect(quranListenerStore.getState().bytesOnDisk).toBe(1234);
    expect(mockModelStore.cleanupOrphans).toHaveBeenCalledWith(manifest);
  });

  it("forgets a manifest whose files were evicted", async () => {
    await writeJSON(DB_KEYS.quranRecitationModel, buildRecitationManifest("tilawa-zipformer"));
    mockModelStore.isPresent.mockResolvedValue(false);

    await quranListenerStore.getState().load("tilawa-zipformer");

    expect(status()).toBe("not-downloaded");
    expect(await readJSON(DB_KEYS.quranRecitationModel, null)).toBeNull();
    expect(mockModelStore.cleanupOrphans).toHaveBeenCalledWith(null);
  });

  it("treats a missing manifest as not downloaded without probing files", async () => {
    await quranListenerStore.getState().load("tilawa-fastconformer");
    expect(status()).toBe("not-downloaded");
    expect(quranListenerStore.getState().listener.engine).toBe("tilawa-fastconformer");
    expect(mockModelStore.isPresent).not.toHaveBeenCalled();
  });
});

describe("download", () => {
  it("refuses while another job is running", async () => {
    for (const running of ["downloading", "verifying"] as const) {
      setListener({ status: running });
      await expect(
        quranListenerStore.getState().download("tilawa-zipformer", { wifiOnly: false }),
      ).resolves.toBe("busy");
    }
    expect(mockModelStore.download).not.toHaveBeenCalled();
  });

  it("asks before using cellular when wifi-only is on", async () => {
    mockNetwork.mockResolvedValue({ type: NetworkStateType.CELLULAR });
    await expect(
      quranListenerStore.getState().download("tilawa-zipformer", { wifiOnly: true }),
    ).resolves.toBe("needs-cellular-confirm");

    mockNetwork.mockRejectedValue(new Error("no network module"));
    await expect(
      quranListenerStore.getState().download("tilawa-zipformer", { wifiOnly: true }),
    ).resolves.toBe("needs-cellular-confirm");
    expect(mockModelStore.download).not.toHaveBeenCalled();
  });

  it("downloads on ethernet, tracks progress, verifies and persists the manifest", async () => {
    mockNetwork.mockResolvedValue({ type: NetworkStateType.ETHERNET });
    const manifest = buildRecitationManifest("tilawa-zipformer");
    const job = deferred<RecitationModelManifest>();
    let onProgress: ((p: { bytesDone: number; bytesTotal: number }) => void) | undefined;
    mockModelStore.download.mockImplementation((_engine, progress) => {
      onProgress = progress;
      return job.promise;
    });
    mockModelStore.sizeOnDisk.mockResolvedValue(999);

    const result = await quranListenerStore
      .getState()
      .download("tilawa-zipformer", { wifiOnly: true });

    expect(result).toBe("started");
    expect(status()).toBe("downloading");
    expect(quranListenerStore.getState().listener.bytesTotal).toBe(
      engineDownloadBytes("tilawa-zipformer"),
    );

    await waitFor(() => expect(onProgress).toBeDefined());
    onProgress?.({ bytesDone: 10, bytesTotal: 100 });
    expect(quranListenerStore.getState().listener.bytesDone).toBe(10);

    job.resolve(manifest);
    await waitFor(() => expect(status()).toBe("ready"));
    await waitFor(() => expect(quranListenerStore.getState().bytesOnDisk).toBe(999));
    expect(await readJSON(DB_KEYS.quranRecitationModel, null)).toEqual(manifest);
    expect(mockModelStore.cleanupOrphans).toHaveBeenCalledWith(manifest);
  });

  it("removes the other engine's files before switching engines", async () => {
    setListener({ status: "ready", manifest: buildRecitationManifest("tilawa-zipformer") });
    await writeJSON(DB_KEYS.quranRecitationModel, buildRecitationManifest("tilawa-zipformer"));
    const next = buildRecitationManifest("tilawa-fastconformer");
    mockModelStore.download.mockResolvedValue(next);

    await quranListenerStore
      .getState()
      .download("tilawa-fastconformer", { wifiOnly: false, allowCellular: false });

    await waitFor(() => expect(quranListenerStore.getState().listener.manifest).toEqual(next));
    expect(mockModelStore.deleteAll).toHaveBeenCalledTimes(1);
    expect(await readJSON(DB_KEYS.quranRecitationModel, null)).toEqual(next);
  });

  it("reports a failed download and lands in failed", async () => {
    const error = new PracticeError("checksum-mismatch");
    mockModelStore.download.mockRejectedValue(error);

    await quranListenerStore.getState().download("tilawa-zipformer", { wifiOnly: false });

    await waitFor(() => expect(status()).toBe("failed"));
    expect(quranListenerStore.getState().listener.error).toBe("checksum-mismatch");
    expect(captureAppException).toHaveBeenCalledWith(error, {
      tags: { area: "quran-practice", code: "checksum-mismatch", phase: "download" },
    });
  });

  it("cancel aborts the in-flight job without reporting an error", async () => {
    const job = deferred<RecitationModelManifest>();
    const onCancel = jest.fn(() => job.reject(new Error("aborted")));
    mockModelStore.download.mockImplementation((_engine, _progress, signal) => {
      signal.onCancel = onCancel;
      return job.promise;
    });

    await quranListenerStore.getState().download("tilawa-zipformer", { wifiOnly: false });
    await waitFor(() => expect(mockModelStore.download).toHaveBeenCalled());

    quranListenerStore.getState().cancel();

    await waitFor(() => expect(status()).toBe("not-downloaded"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(captureAppException).not.toHaveBeenCalled();

    // Once the job settled the signal is cleared, so a second cancel is a no-op.
    quranListenerStore.getState().cancel();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("treats a download-cancelled error as a cancel", async () => {
    mockModelStore.download.mockRejectedValue(new PracticeError("download-cancelled"));
    await quranListenerStore.getState().download("tilawa-zipformer", { wifiOnly: false });
    await waitFor(() => expect(mockModelStore.sizeOnDisk).toHaveBeenCalled());
    expect(status()).toBe("not-downloaded");
    expect(captureAppException).not.toHaveBeenCalled();
  });
});

describe("remove", () => {
  it("deletes files and the manifest", async () => {
    await writeJSON(DB_KEYS.quranRecitationModel, buildRecitationManifest("tilawa-zipformer"));
    setListener({ status: "ready", manifest: buildRecitationManifest("tilawa-zipformer") });
    quranListenerStore.setState({ bytesOnDisk: 50 });

    await quranListenerStore.getState().remove();

    expect(mockModelStore.deleteAll).toHaveBeenCalled();
    expect(await readJSON(DB_KEYS.quranRecitationModel, null)).toBeNull();
    expect(status()).toBe("not-downloaded");
    expect(quranListenerStore.getState().bytesOnDisk).toBe(0);
  });
});

describe("resumeIfInterrupted", () => {
  it("does nothing unless the last job failed and the store can resume", async () => {
    await quranListenerStore.getState().resumeIfInterrupted();
    setListener({ status: "failed" });
    await quranListenerStore.getState().resumeIfInterrupted();
    expect(mockModelStore.download).not.toHaveBeenCalled();
  });

  it("restarts a failed job on the next foreground", async () => {
    await quranListenerStore.getState().load("tilawa-zipformer");
    setListener({ status: "failed" });
    mockModelStore.canResume.mockReturnValue(true);
    mockModelStore.download.mockResolvedValue(buildRecitationManifest("tilawa-zipformer"));

    appState.emit("background");
    expect(mockModelStore.download).not.toHaveBeenCalled();

    appState.emit("active");
    await waitFor(() => expect(status()).toBe("ready"));
    expect(mockModelStore.download).toHaveBeenCalledWith(
      "tilawa-zipformer",
      expect.any(Function),
      expect.objectContaining({ cancelled: false }),
    );
  });
});

describe("loadInstalledModel", () => {
  it("throws model-missing when nothing is installed", async () => {
    await expect(loadInstalledModel()).rejects.toMatchObject({ code: "model-missing" });
  });

  it("loads assets for the stored manifest", async () => {
    const manifest = buildRecitationManifest("tilawa-zipformer");
    await writeJSON(DB_KEYS.quranRecitationModel, manifest);
    mockModelStore.load.mockResolvedValue({ modelPath: "/m" });

    await expect(loadInstalledModel()).resolves.toEqual({
      manifest,
      assets: { modelPath: "/m" },
    });
  });

  it("prefers the in-memory manifest and maps load failures to a PracticeError", async () => {
    const manifest = buildRecitationManifest("tilawa-zipformer");
    setListener({ manifest });
    mockModelStore.load.mockRejectedValue(new Error("Out of memory"));

    await expect(loadInstalledModel()).rejects.toMatchObject({
      name: "PracticeError",
      code: "out-of-memory",
      message: "Out of memory",
    });
    expect(mockModelStore.load).toHaveBeenCalledWith(manifest);
  });
});

describe("hooks", () => {
  it("loads once ready and when the engine changes", async () => {
    const { result, rerender } = await renderHook(
      ({
        engine,
        ready,
      }: {
        engine: "tilawa-zipformer" | "tilawa-fastconformer";
        ready: boolean;
      }) => {
        useEnsureListenerLoaded(engine, ready);
        return { listener: useListenerState(), bytes: useListenerBytesOnDisk() };
      },
      { initialProps: { engine: "tilawa-zipformer", ready: false } },
    );

    expect(quranListenerStore.getState().isReady).toBe(false);

    mockModelStore.sizeOnDisk.mockResolvedValue(7);
    await rerender({ engine: "tilawa-zipformer", ready: true });
    await waitFor(() => expect(result.current.bytes).toBe(7));
    expect(result.current.listener.status).toBe("not-downloaded");

    await rerender({ engine: "tilawa-fastconformer", ready: true });
    await waitFor(() => expect(result.current.listener.engine).toBe("tilawa-fastconformer"));

    // Already loaded for this engine: no reload.
    mockModelStore.cleanupOrphans.mockClear();
    await act(async () => {
      await rerender({ engine: "tilawa-fastconformer", ready: true });
    });
    expect(mockModelStore.cleanupOrphans).not.toHaveBeenCalled();
  });
});
