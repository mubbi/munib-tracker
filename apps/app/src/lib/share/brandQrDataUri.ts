import QRCode from "qrcode";

import { BRAND_QR_DOTS, BRAND_QR_ERROR_LEVEL } from "./brandQrConstants";

/** Raster QR for web — avoids react-native-svg DOM warnings from qrcode-styled. */
export async function brandQrDataUri(
  data: string,
  size: number,
  marginModules = 2,
): Promise<string> {
  return QRCode.toDataURL(data, {
    width: size,
    margin: marginModules,
    color: { dark: BRAND_QR_DOTS, light: "#FFFFFF" },
    errorCorrectionLevel: BRAND_QR_ERROR_LEVEL,
  });
}
