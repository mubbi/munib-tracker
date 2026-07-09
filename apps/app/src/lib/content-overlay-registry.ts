/**
 * Central registry of Learn-content overlay maps keyed by English export name.
 * Keeps lib accessors free of per-locale import boilerplate.
 */
import * as contentOverlays from "@munib-tracker/shared/content-i18n";
import {
  buildContentOverlay,
  buildContentOverlays,
  type ContentOverlay,
  type ContentOverlays,
} from "@munib-tracker/shared/content-i18n";

export function overlayList<T>(baseKey: string): ContentOverlays<T> {
  return buildContentOverlays<T>(baseKey, contentOverlays as Record<string, unknown>);
}

export function overlayObject<T>(baseKey: string): ContentOverlay<T> {
  return buildContentOverlay<T>(baseKey, contentOverlays as Record<string, unknown>);
}
