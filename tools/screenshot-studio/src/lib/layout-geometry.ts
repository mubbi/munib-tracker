// Default element rects for the template layouts added on top of the original
// six (see getDefaultRects in components/editor/slide-canvas.tsx, which
// delegates here). Canvas pixel space; `rotation` is the layout's default tilt.
//
// Composition rules (from Parra-Inc/open-assets, measured on its example sets):
// - a fixed-height headline band (~25% of the canvas) so devices land at the
//   same y on every slide, whatever the locale wraps to;
// - the device is docked to the bottom edge and bleeds 7–12% off it;
// - single-device tilts are bold (6–8°) and alternate direction across a deck.

import type { SlideDesign } from "./design";
import type { SlideLayout } from "./types";

export type GeoRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  align?: "center" | "left";
};

export type TemplateRects = {
  caption?: GeoRect;
  device?: GeoRect;
  deviceSecondary?: GeoRect;
  features?: GeoRect;
};

/** Headline band shared by the template layouts (fraction of canvas height). */
export const HEADLINE_BAND = 0.25;

/** Canvases wider than this (TV, landscape tablets, Duo landscape) need a taller band. */
export function isWideCanvas(cW: number, cH: number) {
  return cW / cH > 1.15;
}

/**
 * Band height as a fraction of the canvas: type scales off the short side, so on
 * wide canvases two headline lines + label take ~30% of the height, not ~22%.
 */
export function headlineBand(cW: number, cH: number) {
  return isWideCanvas(cW, cH) ? 0.34 : HEADLINE_BAND;
}

function captionBand(cW: number, cH: number, band = headlineBand(cW, cH)): GeoRect {
  const wide = isWideCanvas(cW, cH);
  return {
    x: cW * (wide ? 0.12 : 0.07),
    y: cH * (wide ? 0.06 : 0.045),
    width: cW * (wide ? 0.76 : 0.86),
    height: cH * (band - 0.045),
    align: "center",
  };
}

/** Width of a device docked below the headline band that bleeds `bleed` of its height. */
function dockedSize(
  cW: number,
  cH: number,
  frameAspect: number,
  top: number,
  maxWFrac: number,
  bleed: number,
) {
  const visibleH = cH - top;
  let height = visibleH / (1 - bleed);
  let width = height * frameAspect;
  const maxW = cW * maxWFrac;
  if (width > maxW) {
    width = maxW;
    height = width / frameAspect;
  }
  return { width, height };
}

export function templateLayoutRects(
  layout: SlideLayout,
  cW: number,
  cH: number,
  frameAspect: number,
  design?: SlideDesign,
): TemplateRects | undefined {
  const mirror = !!design?.mirror;
  switch (layout) {
    case "bleed-bottom": {
      const caption = captionBand(cW, cH);
      const top = cH * (headlineBand(cW, cH) + 0.015);
      const d = dockedSize(cW, cH, frameAspect, top, cW > cH ? 0.7 : 0.84, 0.1);
      return {
        caption,
        device: { x: (cW - d.width) / 2, y: top, width: d.width, height: d.height },
      };
    }
    case "tilted": {
      const caption = captionBand(cW, cH);
      const top = cH * (headlineBand(cW, cH) + 0.04);
      const d = dockedSize(cW, cH, frameAspect, top, cW > cH ? 0.6 : 0.78, 0.14);
      const cx = cW * (mirror ? 0.44 : 0.56);
      return {
        caption,
        device: {
          x: cx - d.width / 2,
          y: top,
          width: d.width,
          height: d.height,
          rotation: mirror ? 7 : -7,
        },
      };
    }
    case "feature-list": {
      const wide = isWideCanvas(cW, cH);
      const caption = captionBand(cW, cH, wide ? 0.3 : 0.2);
      const chipsTop = cH * (wide ? 0.305 : 0.205);
      const chipsH = cH * (wide ? 0.1 : 0.11);
      const top = chipsTop + chipsH + cH * 0.02;
      const d = dockedSize(cW, cH, frameAspect, top, cW > cH ? 0.5 : 0.7, 0.12);
      return {
        caption,
        features: { x: cW * 0.06, y: chipsTop, width: cW * 0.88, height: chipsH },
        device: { x: (cW - d.width) / 2, y: top, width: d.width, height: d.height },
      };
    }
    default:
      return undefined;
  }
}

/** Feature chips under a standalone headline (no-device layout). */
export function noDeviceFeaturesRect(cW: number, cH: number): GeoRect {
  return { x: cW * 0.08, y: cH * 0.64, width: cW * 0.84, height: cH * 0.18 };
}

/**
 * Magnifier lens: a circle ~42% of the short side, overlapping the device's
 * outer edge at ~20% of its height (open-assets "Skimmer" zoom).
 */
export function lensRect(
  cW: number,
  cH: number,
  device: { x: number; y: number; width: number; height: number },
  mirror = false,
): GeoRect {
  const size = Math.min(cW, cH) * 0.42;
  const y = Math.max(cH * 0.02, device.y + device.height * 0.16);
  const leftX = device.x - size * 0.38;
  const rightX = device.x + device.width - size * 0.62;
  const x = mirror ? Math.min(cW - size * 1.02, rightX) : Math.max(cW * 0.02, leftX);
  return { x, y, width: size, height: size };
}
