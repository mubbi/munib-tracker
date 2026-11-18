import {
  createRecitationModelStore,
  deleteRecitationModelFiles,
  recitationModelBytesOnDisk,
} from "./model-store.ts";

describe("fallback recitation model store", () => {
  const store = createRecitationModelStore();
  const manifest = {
    engine: "tilawa-zipformer" as const,
    version: "v",
    files: [],
    downloadedAt: "",
  };

  it("reports nothing installed", async () => {
    expect(await store.sizeOnDisk()).toBe(0);
    expect(await store.isPresent(manifest)).toBe(false);
    expect(await store.freeBytes()).toBeNull();
    expect(store.canResume()).toBe(false);
    expect(await recitationModelBytesOnDisk()).toBe(0);
  });

  it("refuses to download or load", async () => {
    await expect(
      store.download("tilawa-zipformer", jest.fn(), { cancelled: false }),
    ).rejects.toMatchObject({
      code: "runtime-unsupported",
    });
    await expect(store.load(manifest)).rejects.toMatchObject({ code: "model-missing" });
  });

  it("treats cleanup as a no-op", async () => {
    await expect(store.deleteAll()).resolves.toBeUndefined();
    await expect(store.cleanupOrphans(null)).resolves.toBeUndefined();
    await expect(deleteRecitationModelFiles()).resolves.toBeUndefined();
  });
});
