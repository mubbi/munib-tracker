"use client";
// Pre-loads images as base64 data URIs so html-to-image exports without
// non-deterministic image fetch races. Always use img(path) in render.

const cache = new Map<string, string>();
const failed = new Set<string>();
// Natural w/h per path, recorded at preload (the magnifier lens centres with it).
const aspects = new Map<string, number>();

async function fetchAsDataUrl(path: string): Promise<string | null> {
  try {
    const resp = await fetch(path);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    try {
      const bmp = await createImageBitmap(blob);
      if (bmp.height > 0) aspects.set(path, bmp.width / bmp.height);
      bmp.close();
    } catch {
      // Not decodable as a bitmap (e.g. SVG) — callers fall back to a default aspect.
    }
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function preloadImages(
  paths: string[],
  options: { retryFailed?: boolean } = {},
): Promise<void> {
  await Promise.all(
    paths
      .filter(Boolean)
      .filter((p) => !cache.has(p) && (options.retryFailed || !failed.has(p)))
      .map(async (p) => {
        const data = await fetchAsDataUrl(p);
        if (data) {
          cache.set(p, data);
          failed.delete(p);
        } else {
          failed.add(p);
        }
      }),
  );
}

export function img(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("data:")) return path;
  if (failed.has(path)) return "";
  return cache.get(path) || path;
}

export function setImage(path: string, dataUrl: string) {
  cache.set(path, dataUrl);
  failed.delete(path);
}

export function didFail(path: string | undefined): boolean {
  if (!path) return false;
  if (path.startsWith("data:")) return false;
  return failed.has(path);
}

/** Natural aspect (w/h) of a preloaded image, if known. */
export function imgAspect(path: string | undefined): number | undefined {
  return path ? aspects.get(path) : undefined;
}
