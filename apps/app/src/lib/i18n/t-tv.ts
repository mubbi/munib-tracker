import type { TFunction } from "i18next";

import { isTV } from "@/lib/platform/is-tv";

/**
 * Resolve a UI string with an optional TV-specific key.
 * Falls back to `phoneKey` when the TV key is missing or when not on TV.
 */
export function tTv(
  t: TFunction,
  phoneKey: string,
  tvKey: string,
  options?: Record<string, unknown>,
): string {
  if (!isTV()) return t(phoneKey, options);
  const tv = t(tvKey, { ...(options ?? {}), defaultValue: "" });
  if (typeof tv === "string" && tv.length > 0 && tv !== tvKey) return tv;
  return t(phoneKey, options);
}
