import type { TFunction } from "i18next";
import { Platform } from "react-native";

import { buildAppUrl } from "@/lib/app-links";
import { WIDGET_APP_GROUP } from "@/lib/appSurfaces/config";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import { isAndroidTV, isTV } from "@/lib/platform/is-tv";
import {
  isTopShelfSupported,
  isTvHomeChannelSupported,
  publishTopShelf,
  publishTvHomeChannel,
} from "@/lib/tv-home/native";
import { buildTvHomePayload } from "@/lib/tv-home/tv-home-payload";

/**
 * Publishes the TV home surfaces from the widget snapshot:
 * - Android TV (not Fire TV): the "Munib Tracker" launcher channel row.
 * - Apple TV: the Top Shelf (only when the extension + App Group are present).
 *
 * Returns which surface was updated, for logging / tests.
 */
export async function syncTvHomeSurfaces(
  snapshot: WidgetSnapshot,
  t: TFunction,
  now: Date = new Date(),
): Promise<"channel" | "topShelf" | null> {
  if (!isTV()) return null;

  const payload = buildTvHomePayload(
    snapshot,
    {
      channelName: t("common.appName"),
      appLink: buildAppUrl("/"),
      todayTitle: t("common.today"),
      readTitle: t("tabs.library"),
    },
    now,
  );
  const json = JSON.stringify(payload);

  if (Platform.OS === "android") {
    if (!isAndroidTV() || !isTvHomeChannelSupported()) return null;
    return (await publishTvHomeChannel(json)) ? "channel" : null;
  }
  if (Platform.OS === "ios" && isTopShelfSupported()) {
    return (await publishTopShelf(json, WIDGET_APP_GROUP)) ? "topShelf" : null;
  }
  return null;
}
