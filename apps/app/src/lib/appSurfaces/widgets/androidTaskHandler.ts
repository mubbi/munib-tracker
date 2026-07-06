import { Platform } from "react-native";
import { registerWidgetTaskHandler } from "react-native-android-widget";
import { normalizeWidgetInfo } from "@/lib/appSurfaces/widgets/normalizeWidgetInfo";
import { APP_WIDGET_REGISTRY, getAppWidgetByName } from "@/lib/appSurfaces/widgets/registry";

export { normalizeWidgetInfo } from "@/lib/appSurfaces/widgets/normalizeWidgetInfo";

/** Headless entry for Android home-screen widgets (dev/prod native builds only). */
export function registerAndroidWidgetTaskHandler(): void {
  if (Platform.OS !== "android") return;

  registerWidgetTaskHandler(async ({ widgetInfo, renderWidget, widgetAction }) => {
    if (widgetAction === "WIDGET_DELETED") return;
    const definition = getAppWidgetByName(widgetInfo.widgetName);
    if (!definition) return;
    const normalized = normalizeWidgetInfo(widgetInfo);
    renderWidget(await definition.render(normalized));
  });
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
