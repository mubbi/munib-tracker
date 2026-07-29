import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { Platform } from "react-native";
import { WIDGET_MARK_CLICK_ACTIONS } from "@/lib/appSurfaces/widgets/constants";
import { normalizeWidgetInfo } from "@/lib/appSurfaces/widgets/normalizeWidgetInfo";
import { nativeSendWidgetMarkBroadcast } from "@/lib/external-commands/native-bridge";
import { isTV } from "@/lib/platform/is-tv";

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
  if (Platform.OS !== "android" || isTV()) return;

  // Dynamic imports keep `react-native-android-widget` + renderers out of the
  // TV cold-start graph (Metro also stubs the package when EXPO_TV=1).
  void Promise.all([
    import("react-native-android-widget"),
    import("@/lib/appSurfaces/widgets/registry"),
  ])
    .then(([{ registerWidgetTaskHandler }, { getAppWidgetByName }]) => {
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
    })
    .catch(() => {
      /* Widget native module unavailable (Expo Go / TV). */
    });
}

/** Push fresh JSX to every registered Android widget on the home screen. */
export async function refreshRegisteredAndroidWidgets(): Promise<void> {
  if (Platform.OS !== "android" || isTV()) return;
  try {
    const [{ requestWidgetUpdate }, { APP_WIDGET_REGISTRY }] = await Promise.all([
      import("react-native-android-widget"),
      import("@/lib/appSurfaces/widgets/registry"),
    ]);
    await Promise.all(
      APP_WIDGET_REGISTRY.map((widget) =>
        requestWidgetUpdate({ widgetName: widget.name, renderWidget: widget.render }),
      ),
    );
  } catch {
    /* Widget runtime unavailable outside dev/prod native builds. */
  }
}
