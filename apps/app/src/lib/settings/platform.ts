import { Platform } from "react-native";

import { isLiveActivitySupported } from "@/lib/live-activity";
import { isTV } from "@/lib/platform/is-tv";

import type { PlatformCtx } from "./types";

/** Live platform facts for `SettingDef.available` (tests build their own ctx). */
export function getPlatformCtx(): PlatformCtx {
  const tv = isTV();
  const os = Platform.OS as PlatformCtx["os"];
  const native = (os === "ios" || os === "android") && !tv;
  let liveActivitySupported = false;
  if (native && os === "ios") {
    try {
      liveActivitySupported = isLiveActivitySupported();
    } catch {
      liveActivitySupported = false;
    }
  }
  return { os, tv, native, web: os === "web", liveActivitySupported };
}

/** Convenience predicates shared by many defs. */
export const notOnTv = (ctx: PlatformCtx) => !ctx.tv;
export const nativeOnly = (ctx: PlatformCtx) => ctx.native;
export const webOnly = (ctx: PlatformCtx) => ctx.web;
