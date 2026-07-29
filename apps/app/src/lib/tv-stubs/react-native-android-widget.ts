/**
 * Metro resolves `react-native-android-widget` here when `EXPO_TV=1`.
 * Phone widget JSX must not pull TurboModules into Leanback / tvOS bundles.
 */
import type { ReactNode } from "react";

export type WidgetInfo = {
  widgetName: string;
  width: number;
  height: number;
  [key: string]: unknown;
};

export type WidgetRepresentation = ReactNode;

type WidgetProps = {
  children?: ReactNode;
  style?: unknown;
  [key: string]: unknown;
};

export function FlexWidget(_props: WidgetProps): null {
  return null;
}

export function TextWidget(_props: WidgetProps): null {
  return null;
}

export function registerWidgetTaskHandler(
  _handler: (...args: unknown[]) => Promise<void> | void,
): void {}

export async function requestWidgetUpdate(_options: {
  widgetName: string;
  renderWidget: (info: WidgetInfo) => Promise<WidgetRepresentation> | WidgetRepresentation;
}): Promise<void> {}
