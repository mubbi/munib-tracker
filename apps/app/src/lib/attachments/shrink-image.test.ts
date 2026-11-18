import { installBrowser } from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

import { shrinkImageForUpload } from "./shrink-image";

const BYTES = new Uint8Array([1, 2, 3]);

/** Fake canvas whose JPEG output size per attempt comes from `sizes`. */
function setup({ sizes = [10], width = 4000, height = 3000, context = true, decode = true } = {}) {
  const bitmap = { width, height, close: jest.fn() };
  const canvases: { width: number; height: number }[] = [];
  let attempt = 0;
  const restore = installBrowser({
    window: {
      createImageBitmap: jest.fn(async () => {
        if (!decode) throw new Error("undecodable");
        return bitmap;
      }),
      document: {
        createElement: () => {
          const canvas = {
            width: 0,
            height: 0,
            getContext: () =>
              context ? { fillRect: jest.fn(), drawImage: jest.fn(), fillStyle: "" } : null,
            toBlob: (cb: (b: Blob | null) => void) => {
              const size = sizes[Math.min(attempt++, sizes.length - 1)];
              cb(size < 0 ? null : new Blob([new Uint8Array(size)]));
            },
          };
          canvases.push(canvas);
          return canvas;
        },
      },
    },
  });
  Object.assign(URL, { createObjectURL: () => "blob:shrunk" });
  return { bitmap, canvases, restore };
}

describe("shrinkImageForUpload off the web", () => {
  it("returns null on native", async () => {
    expect(await shrinkImageForUpload(BYTES, "image/png", 100)).toBeNull();
  });
});

describe("shrinkImageForUpload on web", () => {
  usePlatform({ OS: "web" });
  let restore: () => void = () => {};
  afterEach(() => restore());

  it("returns null without canvas support", async () => {
    expect(await shrinkImageForUpload(BYTES, "image/png", 100)).toBeNull();
  });

  it("downscales the longest edge to 2048 and returns a JPEG", async () => {
    const env = setup();
    restore = env.restore;
    const result = await shrinkImageForUpload(BYTES, "image/png", 100);
    expect(result).toEqual({
      bytes: new Uint8Array(10),
      uri: "blob:shrunk",
      mimeType: "image/jpeg",
    });
    expect(env.canvases[0]).toMatchObject({ width: 2048, height: 1536 });
    expect(env.bitmap.close).toHaveBeenCalled();
  });

  it("steps down until the result fits", async () => {
    const env = setup({ sizes: [500, -1, 0, 50] });
    restore = env.restore;
    await shrinkImageForUpload(BYTES, "image/png", 100);
    expect(env.canvases).toHaveLength(4);
    expect(env.canvases[3].width).toBe(1024);
  });

  it("gives up when nothing fits", async () => {
    const env = setup({ sizes: [500] });
    restore = env.restore;
    expect(await shrinkImageForUpload(BYTES, "image/png", 100)).toBeNull();
    expect(env.canvases).toHaveLength(5);
  });

  it("keeps small images at their size", async () => {
    const env = setup({ width: 10, height: 0 });
    restore = env.restore;
    await shrinkImageForUpload(BYTES, "image/png", 100);
    expect(env.canvases[0]).toMatchObject({ width: 10, height: 1 });
  });

  it("returns null without a 2D context", async () => {
    const env = setup({ context: false });
    restore = env.restore;
    expect(await shrinkImageForUpload(BYTES, "image/png", 100)).toBeNull();
    expect(env.bitmap.close).toHaveBeenCalled();
  });

  it("returns null for undecodable images", async () => {
    restore = setup({ decode: false }).restore;
    expect(await shrinkImageForUpload(BYTES, "image/png", 100)).toBeNull();
  });
});
