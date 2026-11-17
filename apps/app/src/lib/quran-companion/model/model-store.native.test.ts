import { File } from "expo-file-system";

import { RECITATION_MODELS } from "@/constants/recitation-models";

import { createRecitationModelStore } from "./model-store.native";

type ProgressEvent = { bytesWritten: unknown; totalBytes: unknown };

const createDownloadTask = File.createDownloadTask as unknown as jest.Mock;

describe("recitation model store — native download progress", () => {
  afterEach(() => {
    createDownloadTask.mockReset();
  });

  it("accepts BigInt progress counters from the native event payload", async () => {
    // SDK 58 delivers the Int64 `bytesWritten` event field as a BigInt, despite
    // the `number` typing. Math.min(BigInt, number) used to throw here.
    createDownloadTask.mockImplementation(
      (_url: string, _dest: unknown, options?: { onProgress?: (p: ProgressEvent) => void }) => ({
        downloadAsync: jest.fn(async () => {
          options?.onProgress?.({ bytesWritten: BigInt(1024), totalBytes: BigInt(4096) });
          // Stop after the first file: a transport error (no HTTP status).
          throw new Error("The network connection was lost.");
        }),
        cancel: jest.fn(),
        release: jest.fn(),
      }),
    );

    const spec = RECITATION_MODELS["tilawa-zipformer"];
    const total = spec.files.reduce((sum, f) => sum + f.bytes, 0);
    const onProgress = jest.fn();

    await expect(
      createRecitationModelStore().download("tilawa-zipformer", onProgress, {
        cancelled: false,
      }),
    ).rejects.toMatchObject({ code: "no-connection" });

    expect(onProgress).toHaveBeenCalledWith({
      bytesDone: Math.min(1024, spec.files[0].bytes),
      bytesTotal: total,
    });
    for (const [event] of onProgress.mock.calls) {
      expect(typeof event.bytesDone).toBe("number");
    }
  });
});
