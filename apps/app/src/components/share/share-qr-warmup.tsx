import { useEffect } from "react";
import { Platform } from "react-native";

import { useLocalizedSiteUrls } from "@/hooks/use-localized-site-urls";
import { useShareSnapshotWidth } from "@/hooks/use-share-snapshot-width";
import { BRAND_QR_SHARE_PADDING } from "@/lib/share/brandQrConfig";
import { warmBrandQrDataUris } from "@/lib/share/brandQrDataUri";
import { computeShareProofQrSize } from "@/lib/share/shareProofLayout";

/** Web-only: pre-generate share-footer QR codes so the first share opens the dialog. */
export function ShareQrWarmup() {
  const frameWidth = useShareSnapshotWidth();
  const { iosAppStoreUrl, androidPlayStoreUrl, webAppUrl } = useLocalizedSiteUrls();
  const qrSize = computeShareProofQrSize(frameWidth);
  const marginModules = Math.max(1, Math.round(BRAND_QR_SHARE_PADDING / 2));

  useEffect(() => {
    if (Platform.OS !== "web") return;
    void warmBrandQrDataUris(
      [iosAppStoreUrl, androidPlayStoreUrl, webAppUrl],
      qrSize,
      marginModules,
    );
  }, [androidPlayStoreUrl, iosAppStoreUrl, marginModules, qrSize, webAppUrl]);

  return null;
}
