import QRCode from "qrcode";

import { BRAND_QR_DOTS, BRAND_QR_ERROR_LEVEL } from "./brandQrConstants";

const qrUriCache = new Map<string, string>();

function cacheKey(data: string, size: number, marginModules: number): string {
  return `${data}\0${size}\0${marginModules}`;
}

/** Sync lookup — returns a cached data URI when QR codes were pre-warmed. */
export function getCachedBrandQrDataUri(
  data: string,
  size: number,
  marginModules = 2,
): string | null {
  return qrUriCache.get(cacheKey(data, size, marginModules)) ?? null;
}

/** Raster QR for web — avoids react-native-svg DOM warnings from qrcode-styled. */
export async function brandQrDataUri(
  data: string,
  size: number,
  marginModules = 2,
): Promise<string> {
  const key = cacheKey(data, size, marginModules);
  const cached = qrUriCache.get(key);
  if (cached) return cached;

  const uri = await QRCode.toDataURL(data, {
    width: size,
    margin: marginModules,
    color: { dark: BRAND_QR_DOTS, light: "#FFFFFF" },
    errorCorrectionLevel: BRAND_QR_ERROR_LEVEL,
  });
  qrUriCache.set(key, uri);
  return uri;
}

/** Pre-generate footer QR data URIs so the first share tap stays inside the user-gesture window. */
export async function warmBrandQrDataUris(
  urls: string[],
  size: number,
  marginModules = 2,
): Promise<void> {
  await Promise.all(urls.map((url) => brandQrDataUri(url, size, marginModules)));
}
