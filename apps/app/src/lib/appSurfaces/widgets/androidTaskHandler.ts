import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { Platform } from "react-native";
import { registerWidgetTaskHandler } from "react-native-android-widget";
import { WIDGET_MARK_CLICK_ACTIONS } from "@/lib/appSurfaces/widgets/constants";
import { normalizeWidgetInfo } from "@/lib/appSurfaces/widgets/normalizeWidgetInfo";
import { APP_WIDGET_REGISTRY, getAppWidgetByName } from "@/lib/appSurfaces/widgets/registry";
import { nativeSendWidgetMarkBroadcast } from "@/lib/external-commands/native-bridge";

export { normalizeWidgetInfo } from "@/lib/appSurfaces/widgets/normalizeWidgetInfo";

/**
 * Handles the widget Mark control's `WIDGET_CLICK` by re-sending the tap as
 * the real `ACTION_MARK_CURRENT` / `ACTION_MARK_PRAYER` broadcast (the same
 * one Assistant/App Actions use), so `ExternalCommandReceiver` enqueues it —
 * no Activity/app UI is opened for this headless click task.
 */
async function handleWidgetMarkClick(
  clickAction: string | undefined,
  clickActionData: Record<string, unknown>,
): Promise<void> {
  if (clickAction === WIDGET_MARK_CLICK_ACTIONS.markCurrent) {
    await nativeSendWidgetMarkBroadcast({ type: "mark-current-obligatory", source: "widget" });
    return;
  }
  if (clickAction === WIDGET_MARK_CLICK_ACTIONS.markPrayer) {
    const prayerId = clickActionData.prayerId;
    if (typeof prayerId !== "string" || !prayerId) return;
    await nativeSendWidgetMarkBroadcast({
      type: "mark-prayer",
      prayerId: prayerId as ObligatoryPrayer,
      date: getLocalDateString(new Date()),
      source: "widget",
    });
  }
}

/** Headless entry for Android home-screen widgets (dev/prod native builds only). */
export function registerAndroidWidgetTaskHandler(): void {
  if (Platform.OS !== "android") return;

  registerWidgetTaskHandler(
    async ({ widgetInfo, renderWidget, widgetAction, clickAction, clickActionData }) => {
      if (widgetAction === "WIDGET_DELETED") return;
      if (widgetAction === "WIDGET_CLICK") {
        await handleWidgetMarkClick(clickAction, clickActionData ?? {});
      }
      const definition = getAppWidgetByName(widgetInfo.widgetName);
      if (!definition) return;
      const normalized = normalizeWidgetInfo(widgetInfo);
      renderWidget(await definition.render(normalized));
    },
  );
}

/** Push fresh JSX to every registered Android widget on the home screen. */
export async function refreshRegisteredAndroidWidgets(): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    const { requestWidgetUpdate } = await import("react-native-android-widget");
    await Promise.all(
      APP_WIDGET_REGISTRY.map((widget) =>
        requestWidgetUpdate({ widgetName: widget.name, renderWidget: widget.render }),
      ),
    );
  } catch {
    /* Widget runtime unavailable outside dev/prod native builds. */
  }
}
