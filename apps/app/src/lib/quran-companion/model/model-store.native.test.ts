import {
  type MockNativeFile,
  mockDeletePath,
  mockNativeFiles as mockDisk,
  mockNativeFileStore,
  resetNativeFileStoreMock,
} from "@/test-support/mocks/native-file-store";
import {
  RECITATION_FIXTURE_FILES,
  type RecitationFixtureName,
} from "@/test-support/mocks/recitation-models";

import type { RecitationModelManifest } from "./types";

jest.mock(
  "@/constants/recitation-models",
  () => require("@/test-support/mocks/recitation-models").recitationModelsMock,
);

let mockFreeBytes: unknown = 1e12;

type DownloadOptions = { onProgress?: (p: { bytesWritten: unknown; totalBytes: unknown }) => void };
const mockCreateDownloadTask = jest.fn();

jest.mock("expo-file-system", () => ({
  File: class {
    static createDownloadTask = (...args: unknown[]) => mockCreateDownloadTask(...args);
    readonly uri: string;
    constructor(mockUri: string) {
      this.uri = mockUri;
    }
    async digest() {
      const { mockNativeFiles } = require("@/test-support/mocks/native-file-store");
      return mockNativeFiles.get(this.uri)?.md5?.toUpperCase() ?? "";
    }
    async text() {
      const { mockNativeFiles } = require("@/test-support/mocks/native-file-store");
      const entry = mockNativeFiles.get(this.uri);
      if (entry?.text == null) throw new Error("missing");
      return entry.text;
    }
  },
  Paths: {
    get availableDiskSpace() {
      if (mockFreeBytes instanceof Error) throw mockFreeBytes;
      return mockFreeBytes;
    },
  },
}));

jest.mock(
  "@/lib/native-file-store",
  () => require("@/test-support/mocks/native-file-store").nativeFileStoreMock,
);

import {
  createRecitationModelStore,
  deleteRecitationModelFiles,
  MODEL_DIR,
  recitationModelBytesOnDisk,
} from "./model-store.native";

const [MODEL] = RECITATION_FIXTURE_FILES;
const TOTAL = RECITATION_FIXTURE_FILES.reduce((sum, f) => sum + f.bytes, 0);
const uriOf = (name: string) => `${MODEL_DIR}${name}`;

/** Writes a file that matches the pinned spec (or a corrupt one). */
function putFile(name: RecitationFixtureName | string, overrides: Partial<MockNativeFile> = {}) {
  const spec = RECITATION_FIXTURE_FILES.find((f) => f.fileName === name);
  mockDisk.set(uriOf(name), { size: spec?.bytes ?? 1, md5: spec?.md5 ?? "x", ...overrides });
}

type TaskBehaviour = {
  reject?: Error;
  resolveNull?: boolean;
  write?: Partial<MockNativeFile> | null;
};

/** Each download task writes a valid `.part` file unless told otherwise. */
function serveDownloads(behaviours: TaskBehaviour[] = []) {
  let call = 0;
  const tasks: { cancel: jest.Mock; release: jest.Mock }[] = [];
  mockCreateDownloadTask.mockImplementation(
    (_url: string, dest: { uri: string }, options?: DownloadOptions) => {
      const behaviour = behaviours[call++] ?? {};
      const task = {
        cancel: jest.fn(),
        release: jest.fn(),
        downloadAsync: jest.fn(async () => {
          const name = dest.uri.replace(MODEL_DIR, "").replace(/\.part$/, "");
          const spec = RECITATION_FIXTURE_FILES.find((f) => f.fileName === name);
          options?.onProgress?.({ bytesWritten: BigInt(spec?.bytes ?? 0), totalBytes: 0 });
          if (behaviour.reject) throw behaviour.reject;
          if (behaviour.resolveNull) return null;
          if (behaviour.write !== null) {
            mockDisk.set(dest.uri, {
              size: spec?.bytes ?? 0,
              md5: spec?.md5 ?? "",
              ...behaviour.write,
            });
          }
          return dest;
        }),
      };
      tasks.push(task);
      return task;
    },
  );
  return tasks;
}

const manifestFor = (names: string[]): RecitationModelManifest => ({
  engine: "tilawa-zipformer",
  version: "v1",
  files: RECITATION_FIXTURE_FILES.filter((f) => names.includes(f.fileName)),
  downloadedAt: "2026-01-01T00:00:00.000Z",
});

function download(signal: { cancelled: boolean; onCancel?: () => void } = { cancelled: false }) {
  const onProgress = jest.fn();
  const result = createRecitationModelStore().download("tilawa-zipformer", onProgress, signal);
  return { result, onProgress };
}

beforeEach(async () => {
  resetNativeFileStoreMock();
  mockFreeBytes = 1e12;
  mockCreateDownloadTask.mockReset();
  await deleteRecitationModelFiles();
  mockDeletePath.mockClear();
});

describe("sizeOnDisk", () => {
  it("sums file sizes and ignores directories", async () => {
    putFile("m.onnx");
    mockDisk.set(uriOf("sub/"), { size: 999, md5: "", isDirectory: true });
    expect(await recitationModelBytesOnDisk()).toBe(MODEL.bytes);
  });

  it.each([
    ["does not exist", false],
    ["cannot be read", new Error("io")],
  ])("is 0 when the folder %s", async (_label, state) => {
    mockNativeFileStore.directoriesExist = state;
    expect(await createRecitationModelStore().sizeOnDisk()).toBe(0);
  });
});

describe("isPresent", () => {
  it("is true when every manifest file has the pinned size", async () => {
    putFile("m.onnx");
    putFile("c.json");
    expect(await createRecitationModelStore().isPresent(manifestFor(["m.onnx", "c.json"]))).toBe(
      true,
    );
  });

  it.each([
    ["missing", () => undefined],
    ["truncated", () => putFile("m.onnx", { size: 1 })],
  ])("is false when a file is %s", async (_label, arrange) => {
    arrange();
    expect(await createRecitationModelStore().isPresent(manifestFor(["m.onnx"]))).toBe(false);
  });
});

describe("freeBytes", () => {
  it.each([
    [123, 123],
    [Number.NaN, null],
    ["n/a", null],
    [new Error("io"), null],
  ])("maps availableDiskSpace %p to %p", async (value, expected) => {
    mockFreeBytes = value;
    expect(await createRecitationModelStore().freeBytes()).toBe(expected);
  });
});

describe("download", () => {
  it("downloads each file to .part, verifies MD5 and moves it into place", async () => {
    serveDownloads();
    const manifest = await download().result;
    expect(mockDisk.has(uriOf("m.onnx"))).toBe(true);
    expect(mockDisk.has(uriOf("m.onnx.part"))).toBe(false);
    expect(manifest.files.map((f) => f.fileName)).toEqual(["m.onnx", "c.json", "l.txt"]);
    expect(manifest.files[0]).not.toHaveProperty("url");
  });

  it("reports BigInt native progress as numbers capped at the file size", async () => {
    serveDownloads();
    const { result, onProgress } = download();
    await result;
    expect(onProgress).toHaveBeenCalledWith({ bytesDone: MODEL.bytes, bytesTotal: TOTAL });
    expect(onProgress).toHaveBeenLastCalledWith({ bytesDone: TOTAL, bytesTotal: TOTAL });
    for (const [event] of onProgress.mock.calls) expect(typeof event.bytesDone).toBe("number");
  });

  it("skips files already on disk that match the spec", async () => {
    putFile("m.onnx");
    serveDownloads();
    await download().result;
    expect(mockCreateDownloadTask).toHaveBeenCalledTimes(2);
  });

  it("rejects when there is less than twice the download free", async () => {
    mockFreeBytes = TOTAL;
    await expect(download().result).rejects.toMatchObject({ code: "not-enough-space" });
  });

  it("rejects before starting when already cancelled", async () => {
    await expect(download({ cancelled: true }).result).rejects.toMatchObject({
      code: "download-cancelled",
    });
    expect(mockCreateDownloadTask).not.toHaveBeenCalled();
  });

  it.each([
    [
      "a network failure",
      { reject: new Error("The network connection was lost.") },
      "no-connection",
    ],
    ["an unknown failure", { reject: new Error("disk exploded") }, "download-failed"],
    ["an HTTP error", { reject: new Error("HTTP 503") }, "download-failed"],
    ["a paused (null) result", { resolveNull: true }, "download-failed"],
    ["a bad checksum", { write: { md5: "deadbeef" } }, "checksum-mismatch"],
  ])("maps %s to %s", async (_label, behaviour, code) => {
    serveDownloads([behaviour]);
    await expect(download().result).rejects.toMatchObject({ code });
  });

  it("keeps the .part for one resume after a transport failure only", async () => {
    serveDownloads([{ reject: new Error("timed out") }]);
    await expect(download().result).rejects.toMatchObject({ code: "no-connection" });
    expect(createRecitationModelStore().canResume()).toBe(true);

    serveDownloads([{ reject: new Error("HTTP 404") }]);
    await expect(download().result).rejects.toMatchObject({ message: "HTTP 404" });
    expect(createRecitationModelStore().canResume()).toBe(false);
  });

  it("deletes the partial file on HTTP errors", async () => {
    serveDownloads([{ reject: new Error("HTTP 500"), write: null }]);
    await expect(download().result).rejects.toMatchObject({ code: "download-failed" });
    expect(mockDeletePath).toHaveBeenCalledWith(uriOf("m.onnx.part"));
  });

  it("cancels the native task and cleans up when cancelled mid-download", async () => {
    const signal: { cancelled: boolean; onCancel?: () => void } = { cancelled: false };
    const task = { cancel: jest.fn(), release: jest.fn(), downloadAsync: jest.fn() };
    task.downloadAsync.mockImplementation(async () => {
      signal.cancelled = true;
      signal.onCancel?.();
      throw new Error("cancelled");
    });
    mockCreateDownloadTask.mockReturnValue(task);
    await expect(download(signal).result).rejects.toMatchObject({ code: "download-cancelled" });
    expect(task.cancel).toHaveBeenCalled();
    expect(task.release).toHaveBeenCalled();
    expect(mockDeletePath).toHaveBeenCalledWith(uriOf("m.onnx.part"));
  });

  it("swallows a cancel on an already-settled task", async () => {
    const signal: { cancelled: boolean; onCancel?: () => void } = { cancelled: false };
    const tasks = serveDownloads();
    const { result } = download(signal);
    await result;
    tasks[0].cancel.mockImplementation(() => {
      throw new Error("settled");
    });
    expect(() => signal.onCancel?.()).not.toThrow();
  });

  it("reports cancelled when the signal flips after a successful download", async () => {
    const signal: { cancelled: boolean; onCancel?: () => void } = { cancelled: false };
    mockCreateDownloadTask.mockImplementation((_url: string, dest: { uri: string }) => ({
      cancel: jest.fn(),
      release: jest.fn(),
      downloadAsync: jest.fn(async () => {
        signal.cancelled = true;
        return dest;
      }),
    }));
    await expect(download(signal).result).rejects.toMatchObject({ code: "download-cancelled" });
  });
});

describe("deleteAll / cleanupOrphans", () => {
  it("deleteAll removes the folder and clears the resume marker", async () => {
    serveDownloads([{ reject: new Error("offline") }]);
    await expect(download().result).rejects.toBeDefined();
    const store = createRecitationModelStore();
    await store.deleteAll();
    expect(mockDeletePath).toHaveBeenCalledWith(MODEL_DIR);
    expect(store.canResume()).toBe(false);
  });

  it("deleteRecitationModelFiles swallows delete errors", async () => {
    mockDeletePath.mockImplementationOnce(() => {
      throw new Error("busy");
    });
    await expect(deleteRecitationModelFiles()).resolves.toBeUndefined();
  });

  it("removes files the manifest does not reference", async () => {
    putFile("m.onnx");
    putFile("stale.bin");
    await createRecitationModelStore().cleanupOrphans(manifestFor(["m.onnx"]));
    expect([...mockDisk.keys()]).toEqual([uriOf("m.onnx")]);
  });

  it("keeps a .part file while a resume is pending", async () => {
    serveDownloads([{ reject: new Error("offline") }]);
    await expect(download().result).rejects.toBeDefined();
    putFile("m.onnx.part");
    await createRecitationModelStore().cleanupOrphans(null);
    expect(mockDisk.has(uriOf("m.onnx.part"))).toBe(true);
  });

  it("does nothing without the folder and swallows errors", async () => {
    mockNativeFileStore.directoriesExist = false;
    putFile("x");
    await createRecitationModelStore().cleanupOrphans(null);
    expect(mockDisk.size).toBe(1);
    mockNativeFileStore.directoriesExist = true;
    mockDeletePath.mockImplementationOnce(() => {
      throw new Error("busy");
    });
    await expect(createRecitationModelStore().cleanupOrphans(null)).resolves.toBeUndefined();
  });
});

describe("load", () => {
  it("returns the model path without a scheme and parsed JSON", async () => {
    putFile("m.onnx");
    putFile("c.json", { text: '{"a":1}' });
    const loaded = await createRecitationModelStore().load(manifestFor([]));
    expect(loaded.modelPath).toBe("/doc/recitation-models/m.onnx");
    expect(loaded.json).toEqual({ "c.json": { a: 1 } });
  });

  it("throws model-missing when the model file is gone", async () => {
    await expect(createRecitationModelStore().load(manifestFor([]))).rejects.toMatchObject({
      code: "model-missing",
    });
  });

  it("throws model-missing when a JSON file cannot be read", async () => {
    putFile("m.onnx");
    putFile("c.json", { text: "{bad" });
    await expect(createRecitationModelStore().load(manifestFor([]))).rejects.toMatchObject({
      code: "model-missing",
    });
  });
});
