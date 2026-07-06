import type { ImageSourcePropType } from "react-native";

import { Brand, Radius } from "@/constants/theme";

import { BRAND_QR_DOTS, BRAND_QR_SURFACE } from "./brandQrConstants";

export { BRAND_QR_DOTS, BRAND_QR_ERROR_LEVEL, BRAND_QR_SURFACE } from "./brandQrConstants";

export const BRAND_QR_DEFAULT_SIZE = 200;
export const BRAND_QR_DEFAULT_ACCENT = Brand.heroGlow;

export const BRAND_QR_LOGO = require("@/assets/images/icon-192.png") as ImageSourcePropType;

export const BRAND_QR_PADDING = 14;

/** Tighter quiet zone for small share-footer QRs so modules stay crisp. */
export const BRAND_QR_SHARE_PADDING = 4;

export const brandQrInnerEyesOptions = {
  borderRadius: "50%",
  color: BRAND_QR_DOTS,
} as const;

export function brandQrOuterEyesOptions(accentColor: string) {
  return {
    borderRadius: 12,
    color: accentColor,
  } as const;
}

export function brandQrContainerStyle(size: number) {
  return {
    backgroundColor: BRAND_QR_SURFACE,
    borderRadius: Radius.md,
    overflow: "hidden" as const,
    width: size,
    height: size,
  };
}

export const brandQrLogoOptions = {
  href: BRAND_QR_LOGO,
  padding: 4,
  scale: 0.82,
  hidePieces: true,
} as const;

export function brandQrIncludesLogo(size: number): boolean {
  return size >= 104;
}
