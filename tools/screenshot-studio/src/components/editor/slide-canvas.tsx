"use client";
import { RotateCw } from "lucide-react";
import * as React from "react";
import { Rnd } from "react-rnd";
import { alpha, mix, shade } from "@/lib/color";
import {
  ANDROID_RATIO,
  CANVAS,
  creativeSafeArea,
  creativeVariant,
  FOLD_L_RATIO,
  FOLD_P_RATIO,
  foldLW,
  foldPW,
  IPAD_RATIO,
  ipadW,
  MK_RATIO,
  phoneW,
  phoneWSmall,
  rendersCreativeAsset,
  type SafeArea,
  supportsLandscape,
  TAB_L_RATIO,
  TAB_P_RATIO,
  TV_RATIO,
  tabletLW,
  tabletPW,
  tvW,
  WATCH_RATIO,
  WEAR_RATIO,
  watchW,
  wearW,
} from "@/lib/constants";
import type { DeviceFinish, SlideDesign } from "@/lib/design";
import { defaultElementZ, toTextElementId } from "@/lib/elements";
import { img, imgAspect } from "@/lib/image-cache";
import {
  type GeoRect,
  headlineBand,
  isWideCanvas,
  lensRect,
  noDeviceFeaturesRect,
  templateLayoutRects,
} from "@/lib/layout-geometry";
import { pickText, resolveScreenshot, textDir } from "@/lib/locale";
import type {
  BuiltInElementId,
  Device,
  ElementId,
  ElementTransform,
  Orientation,
  SelectedElement,
  Slide,
  TextElement,
  Theme,
} from "@/lib/types";
import {
  AndroidPhone,
  AndroidTabletL,
  AndroidTabletP,
  AppleWatch,
  Bare,
  FoldableL,
  FoldableP,
  IPad,
  Phone,
  SCREEN_ASPECT,
  TvFrame,
  WearWatch,
} from "./device-frames";
import { Backdrop, FeatureChips, LensView, type Tone, toneFor } from "./slide-decor";

type FrameComp = React.ComponentType<{
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  hideEmpty?: boolean;
  finish?: DeviceFinish;
}>;

export function getCanvas(device: Device, orientation: Orientation) {
  const c = CANVAS[device];
  if (orientation === "landscape" && supportsLandscape(device)) {
    const { wL, hL } = c;
    if (wL != null && hL != null) return { cW: wL, cH: hL };
  }
  return { cW: c.w, cH: c.h };
}

// Aspect ratio (w/h) of each device frame — must match device-frames.tsx
function getFrameAspect(device: Device, orientation: Orientation) {
  switch (device) {
    case "iphone":
    // App Store creative assets showcase the iPhone frame.
    case "ios-universal":
    case "ios-header-wide":
    case "ios-search-3x2":
      return MK_RATIO;
    case "iphone-duo":
      return orientation === "landscape" ? FOLD_L_RATIO : FOLD_P_RATIO;
    case "android":
      return ANDROID_RATIO;
    case "ipad":
      return IPAD_RATIO;
    case "android-7":
    case "android-10":
      return orientation === "landscape" ? TAB_L_RATIO : TAB_P_RATIO;
    case "apple-watch":
      return WATCH_RATIO;
    case "wear-os":
      return WEAR_RATIO;
    case "apple-tv":
    case "android-tv":
      return TV_RATIO;
    default:
      return 1;
  }
}

/** Screenshot (screen opening) aspect w/h per device — see SCREEN_ASPECT in device-frames.tsx. */
function screenAspectFor(device: Device, orientation: Orientation) {
  const landscape = orientation === "landscape";
  switch (device) {
    case "android":
      return SCREEN_ASPECT.android;
    case "ipad":
      return SCREEN_ASPECT.ipad;
    case "android-7":
    case "android-10":
      return landscape ? SCREEN_ASPECT.tabletL : SCREEN_ASPECT.tabletP;
    case "iphone-duo":
      return landscape ? SCREEN_ASPECT.duoL : SCREEN_ASPECT.duoP;
    case "apple-watch":
      return SCREEN_ASPECT.watch;
    case "wear-os":
      return SCREEN_ASPECT.wear;
    case "apple-tv":
    case "android-tv":
      return SCREEN_ASPECT.tv;
    default:
      return SCREEN_ASPECT.iphone;
  }
}

export function getFrameForDevice(
  device: Device,
  orientation: Orientation,
): {
  Comp: FrameComp;
  widthFn: (cW: number, cH: number) => number;
  smallWidthFn: (cW: number, cH: number) => number;
} {
  switch (device) {
    case "iphone":
      return { Comp: Phone, widthFn: phoneW, smallWidthFn: phoneWSmall };
    case "ipad":
      return { Comp: IPad, widthFn: ipadW, smallWidthFn: (cW, cH) => ipadW(cW, cH, 0.6) };
    case "android":
      return { Comp: AndroidPhone, widthFn: phoneW, smallWidthFn: phoneWSmall };
    case "android-7":
    case "android-10":
      if (orientation === "landscape") {
        return {
          Comp: AndroidTabletL,
          widthFn: tabletLW,
          smallWidthFn: (cW, cH) => tabletLW(cW, cH, 0.5),
        };
      }
      return {
        Comp: AndroidTabletP,
        widthFn: tabletPW,
        smallWidthFn: (cW, cH) => tabletPW(cW, cH, 0.62),
      };
    case "iphone-duo":
      if (orientation === "landscape") {
        return { Comp: FoldableL, widthFn: foldLW, smallWidthFn: (cW, cH) => foldLW(cW, cH, 0.5) };
      }
      return { Comp: FoldableP, widthFn: foldPW, smallWidthFn: (cW, cH) => foldPW(cW, cH, 0.62) };
    case "apple-watch":
      return { Comp: AppleWatch, widthFn: watchW, smallWidthFn: (cW, cH) => watchW(cW, cH, 0.55) };
    case "wear-os":
      return { Comp: WearWatch, widthFn: wearW, smallWidthFn: (cW, cH) => wearW(cW, cH, 0.55) };
    case "apple-tv":
    case "android-tv":
      return { Comp: TvFrame, widthFn: tvW, smallWidthFn: (cW, cH) => tvW(cW, cH, 0.6) };
    default:
      return { Comp: Phone, widthFn: phoneW, smallWidthFn: phoneWSmall };
  }
}

type EditHandlers = {
  onLabelChange?: (v: string) => void;
  onHeadlineChange?: (v: string) => void;
  onTextElementTextChange?: (id: string, v: string) => void;
  onElementChange?: (id: ElementId, t: ElementTransform) => void;
  onSelectElement?: (id: ElementId | null) => void;
};

type Props = {
  slide: Slide;
  device: Device;
  orientation: Orientation;
  theme: Theme;
  locale: string;
  appName?: string;
  appIcon?: string;
  editable?: boolean;
  edit?: EditHandlers;
  selectedElementId?: ElementId | null;
  // Preview scale (1.0 = full size). Used so react-rnd maps drag deltas correctly
  // when the canvas is rendered inside a CSS-transformed container.
  previewScale?: number;
  /** When true, suppress the "Drop a screenshot here" placeholder. Used for export. */
  hideEmpty?: boolean;
};

type DeckEditHandlers = {
  onLabelChange?: (slideId: string, v: string) => void;
  onHeadlineChange?: (slideId: string, v: string) => void;
  onTextElementTextChange?: (slideId: string, id: string, v: string) => void;
  onElementChange?: (slideId: string, id: ElementId, t: ElementTransform) => void;
  onSelectElement?: (element: SelectedElement | null) => void;
  onSelectScreen?: (slideId: string) => void;
};

type DeckCanvasProps = {
  slides: Slide[];
  device: Device;
  orientation: Orientation;
  theme: Theme;
  locale: string;
  appName?: string;
  appIcon?: string;
  connectedCanvas?: boolean;
  editable?: boolean;
  edit?: DeckEditHandlers;
  selectedElement?: SelectedElement | null;
  activeSlideId?: string | null;
  previewScale?: number;
  hideEmpty?: boolean;
  showGuides?: boolean;
};

// ---------- Editable text helpers ----------

// **word** markers become gradient-emphasis spans (see .hl-em in globals.css).
// Raw markers are shown while the element is focused so they stay editable.
function emphasisHtml(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<span class="hl-em">$1</span>');
}

function EditableText({
  value,
  editable,
  onChange,
  style,
  multiline = false,
  placeholder,
  onFocus,
  dir,
  className,
}: {
  value: string;
  dir?: "rtl" | "ltr";
  className?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  style?: React.CSSProperties;
  multiline?: boolean;
  placeholder?: string;
  onFocus?: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const incoming = value || "";
    if (focused || document.activeElement === el) return;
    const html = emphasisHtml(incoming);
    if (el.innerHTML !== html) el.innerHTML = html;
  }, [value, focused]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!onChange) return;
    // biome-ignore lint/performance/useDomNodeTextContent: contentEditable line breaks (<br>/<div>) only survive via innerText; textContent would collapse multiline copy.
    const text = (e.currentTarget.innerText || "").replace(/\u00a0/g, " ");
    onChange(multiline ? text : text.replace(/\n/g, ""));
  };

  return (
    <div
      ref={ref}
      dir={dir}
      className={className}
      contentEditable={editable}
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={handleInput}
      onFocus={() => {
        // Swap the rendered emphasis spans for the raw **marked** text while editing.
        setFocused(true);
        const el = ref.current;
        const raw = value || "";
        if (el && el.textContent !== raw) el.textContent = raw;
        onFocus?.();
      }}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onMouseDown={(e) => {
        // Allow text editing without starting an Rnd drag.
        if (editable) {
          e.stopPropagation();
          onFocus?.();
        }
      }}
      onPointerDown={(e) => {
        if (editable) e.stopPropagation();
      }}
      style={{
        outline: "none",
        whiteSpace: multiline ? "pre-wrap" : "nowrap",
        cursor: editable ? "text" : "default",
        ...style,
      }}
    />
  );
}

// ---------- Caption (label + headline) ----------

/** Layouts with a dedicated headline band get open-assets-sized type (~8% of the short side). */
const BAND_LAYOUTS = new Set<Slide["layout"]>(["bleed-bottom", "tilted", "feature-list"]);

/** Headline leading per script: Latin tight; Arabic (Plex) and Urdu (Nastaliq) need room. */
function headlineLeading(locale: string, dir: "rtl" | "ltr") {
  if (dir !== "rtl") return 1.08;
  return locale.startsWith("ur") ? 1.72 : 1.32;
}

function Caption({
  cW,
  cH,
  slide,
  theme,
  locale,
  editable,
  edit,
  align = "center",
  inverted,
  onFocus,
}: {
  cW: number;
  cH: number;
  slide: Slide;
  theme: Theme;
  locale: string;
  editable?: boolean;
  edit?: EditHandlers;
  align?: "center" | "left";
  inverted?: boolean;
  onFocus?: () => void;
}) {
  const tone = toneFor(theme, !!inverted, slide.design);
  // Scale typography off the *shorter* dimension so landscape layouts don't
  // produce headlines so tall they overlap the device frame.
  const unit = Math.min(cW, cH);
  const label = pickText(slide.label, locale);
  const pill = slide.design?.labelStyle === "pill" && !!label;
  const headDir = textDir(slide.headline, locale);
  // Nastaliq sets tall and wide: scale Urdu display type down (marketing caps its Urdu hero too).
  const scriptScale = headDir === "rtl" && locale.startsWith("ur") ? 0.86 : 1;
  const headSize = unit * (BAND_LAYOUTS.has(slide.layout) ? 0.078 : 0.066) * scriptScale;
  return (
    <div
      data-hl={tone.highlight}
      style={{ textAlign: align, position: "relative", width: "100%", ...tone.vars }}
    >
      <div style={{ marginBottom: unit * (pill ? 0.026 : 0.016) }}>
        <EditableText
          className={pill ? "st-label-pill" : undefined}
          value={label}
          dir={textDir(slide.label, locale)}
          editable={editable}
          onChange={edit?.onLabelChange}
          onFocus={onFocus}
          placeholder="LABEL"
          style={{
            display: pill ? "inline-block" : "block",
            fontSize: unit * (pill ? 0.025 : 0.024),
            fontWeight: 700,
            // Tracking breaks the joins of cursive Arabic script.
            letterSpacing: textDir(slide.label, locale) === "rtl" ? 0 : unit * 0.0035,
            color: pill && !tone.light ? tone.fg : tone.accent,
            textTransform: "uppercase",
            minHeight: unit * 0.028,
            ...(pill
              ? {
                  background: alpha(tone.accent, tone.light ? 0.12 : 0.18),
                  border: `${Math.max(1, unit * 0.0016)}px solid ${alpha(tone.accent, tone.light ? 0.3 : 0.4)}`,
                }
              : {}),
          }}
        />
      </div>
      <EditableText
        className="st-headline"
        value={pickText(slide.headline, locale)}
        dir={headDir}
        editable={editable}
        multiline
        onChange={edit?.onHeadlineChange}
        onFocus={onFocus}
        placeholder="Headline goes here"
        style={{
          fontSize: headSize,
          fontWeight: 800,
          lineHeight: headlineLeading(locale, headDir),
          letterSpacing: headDir === "rtl" ? 0 : "-0.018em",
          color: tone.fg,
          textShadow: tone.textShadow,
        }}
      />
    </div>
  );
}

// ---------- Default element rects per layout ----------

type Rect = { x: number; y: number; width: number; height: number };
/** Default rect per element; `rotation` is the layout's default tilt. */
type LayoutRects = Partial<Record<BuiltInElementId, GeoRect>>;

/** Fit a device rect into the remaining band below/above the caption. */
function fitDevice(
  maxW: number,
  frameAspect: number,
  availH: number,
  maxFrac = 1,
): { width: number; height: number } {
  let width = maxW * maxFrac;
  let height = width / frameAspect;
  if (height > availH) {
    height = availH;
    width = height * frameAspect;
  }
  return { width, height };
}

function getDefaultRects(
  layout: Slide["layout"],
  cW: number,
  cH: number,
  frameAspect: number,
  fwFrac: number,
  _fwSmallFrac: number,
  design?: SlideDesign,
): LayoutRects {
  const deviceW = fwFrac * cW;
  const capW = cW * 0.84;
  // Keep caption band compact so headlines never collide with the device frame.
  // Wide canvases (TV, landscape tablets / Duo) need a taller copy band: type
  // scales off the short side, so the same two lines take more of the height.
  const wide = isWideCanvas(cW, cH);
  const topTextBand = cH * (wide ? 0.33 : 0.24);
  const bottomTextBand = cH * (wide ? 0.34 : 0.28);
  const gap = cH * 0.02;

  switch (layout) {
    case "hero": {
      const availH = cH - topTextBand - gap;
      const device = fitDevice(deviceW, frameAspect, availH * 1.08);
      return {
        caption: {
          x: cW * 0.08,
          y: cH * 0.055,
          width: capW,
          height: topTextBand * 0.9,
          align: "center",
        },
        device: {
          x: (cW - device.width) / 2,
          y: topTextBand + gap + Math.max(0, (availH - device.height) * 0.15),
          width: device.width,
          height: device.height,
        },
      };
    }
    case "device-bottom": {
      const availH = cH - topTextBand - gap - cH * 0.02;
      const device = fitDevice(deviceW, frameAspect, availH);
      return {
        caption: {
          x: cW * 0.08,
          y: cH * 0.05,
          width: capW,
          height: topTextBand * 0.88,
          align: "center",
        },
        device: {
          x: (cW - device.width) / 2,
          y: topTextBand + gap + Math.max(0, (availH - device.height) / 2),
          width: device.width,
          height: device.height,
        },
      };
    }
    case "device-top": {
      const availH = cH - bottomTextBand - gap;
      const device = fitDevice(deviceW, frameAspect, availH * 1.05);
      return {
        caption: {
          x: cW * 0.08,
          y: cH - bottomTextBand + cH * 0.02,
          width: capW,
          height: bottomTextBand * 0.85,
          align: "center",
        },
        device: {
          x: (cW - device.width) / 2,
          y: Math.min(0, availH - device.height) * 0.4,
          width: device.width,
          height: device.height,
        },
      };
    }
    case "two-devices": {
      // Two overlapping devices under a fixed headline band: the front one
      // docked on the right, the back one smaller, lower and tilted out (open-
      // assets "before/after" pair). Mirror swaps the sides.
      const band = cH * headlineBand(cW, cH);
      const top = band + cH * 0.015;
      const portrait = cH >= cW;
      const front = fitDevice(cW * (portrait ? 0.7 : 0.36), frameAspect, (cH - top) / 0.96);
      const back = { width: front.width * 0.88, height: front.height * 0.88 };
      const mirror = !!design?.mirror;
      // Portrait: spread the pair edge to edge so the back device bleeds ~14%
      // off the side and more of its screen shows.
      const bleed = back.width * 0.14;
      const pairW = portrait ? cW * 0.97 + bleed : front.width + back.width * 0.62;
      const left = portrait ? (mirror ? cW * 0.03 : -bleed) : (cW - pairW) / 2;
      const backX = mirror ? left + pairW - back.width : left;
      const frontX = mirror ? left : left + pairW - front.width;
      return {
        caption: {
          x: cW * 0.07,
          y: cH * 0.045,
          width: cW * 0.86,
          height: band - cH * 0.045,
          align: "center",
        },
        deviceSecondary: {
          x: backX,
          y: top + front.height * 0.08,
          width: back.width,
          height: back.height,
          rotation: mirror ? 5 : -5,
        },
        device: { x: frontX, y: top, width: front.width, height: front.height },
      };
    }
    case "no-device":
      return {
        caption: {
          x: cW * 0.1,
          y: cH * 0.26,
          width: cW * 0.8,
          height: cH * 0.5,
          align: "center",
        },
      };
    case "split-landscape": {
      if (frameAspect < 1 && cW / cH > 1.3) {
        // Portrait frame (iPhone) on a wide banner canvas — product page header /
        // search results: size off the height and centre it in the right half.
        const height = Math.min(cH * 0.86, (cW * 0.42) / frameAspect);
        const width = height * frameAspect;
        return {
          caption: {
            x: cW * 0.06,
            y: cH * 0.22,
            width: cW * 0.4,
            height: cH * 0.56,
            align: "left",
          },
          device: {
            x: cW * 0.5 + (cW * 0.5 - width) / 2,
            y: (cH - height) / 2,
            width,
            height,
          },
        };
      }
      const device = fitDevice(deviceW, frameAspect, cH * 0.9);
      return {
        caption: {
          x: cW * 0.05,
          y: cH * 0.22,
          width: cW * 0.38,
          height: cH * 0.56,
          align: "left",
        },
        device: {
          x: cW - device.width + cW * 0.02,
          y: (cH - device.height) / 2,
          width: device.width,
          height: device.height,
        },
      };
    }
    case "full-bleed":
      return { device: { x: 0, y: 0, width: cW, height: cH } };
    default:
      return templateLayoutRects(layout, cW, cH, frameAspect, design) ?? {};
  }
}

function rectFor(id: BuiltInElementId, slide: Slide, defaults: LayoutRects): GeoRect | undefined {
  const saved = slide.transforms?.[id];
  const def = defaults[id];
  if (!def && !saved) return undefined;
  if (!saved) return def;
  return {
    x: saved.x,
    y: saved.y,
    width: saved.width,
    height: saved.height,
    rotation: saved.rotation ?? def?.rotation,
    align: def?.align,
  };
}

function hasText(field: Record<string, string | undefined> | undefined) {
  return !!field && Object.values(field).some((v) => !!v?.trim());
}

function getSlideGeometry(slide: Slide, device: Device, orientation: Orientation) {
  const { cW, cH } = getCanvas(device, orientation);
  const fullBleed = slide.layout === "full-bleed";
  const deviceFrame = getFrameForDevice(device, orientation);
  const { widthFn, smallWidthFn } = deviceFrame;
  const Frame: FrameComp = fullBleed ? Bare : deviceFrame.Comp;
  const frameAspect = fullBleed ? cW / cH : getFrameAspect(device, orientation);
  const fwFrac = widthFn(cW, cH);
  const fwSmallFrac = smallWidthFn(cW, cH);
  const design = slide.design;
  const defaults = getDefaultRects(slide.layout, cW, cH, frameAspect, fwFrac, fwSmallFrac, design);
  // Magnifier lens hangs off the main device's outer edge.
  if (design?.lens && !fullBleed && slide.layout !== "no-device") {
    const dev = rectFor("device", slide, defaults);
    if (dev) defaults.lens = lensRect(cW, cH, dev, !!design.mirror);
  }
  // Feature chips: their own band in feature-list; under the headline when there is no device.
  if (!defaults.features && slide.layout === "no-device" && hasText(design?.features)) {
    defaults.features = noDeviceFeaturesRect(cW, cH);
  }
  return { cW, cH, Frame, frameAspect, defaults };
}

export function getElementTransform(
  slide: Slide,
  device: Device,
  orientation: Orientation,
  id: ElementId,
): ElementTransform | undefined {
  if (id.startsWith("text:")) {
    const textId = id.slice("text:".length);
    const textElement = slide.textElements?.find((element) => element.id === textId);
    return textElement?.transform;
  }
  const { defaults } = getSlideGeometry(slide, device, orientation);
  const rect = rectFor(id as BuiltInElementId, slide, defaults);
  if (!rect) return undefined;
  const saved = slide.transforms?.[id as BuiltInElementId];
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    rotation: rect.rotation ?? 0,
    zIndex: saved?.zIndex ?? defaultElementZ(id),
  };
}

// ---------- Main single-screen canvas ----------

export function SlideCanvas({
  slide,
  device,
  orientation,
  theme,
  locale,
  appName,
  appIcon,
  editable,
  edit,
  selectedElementId = null,
  previewScale = 1,
  hideEmpty,
}: Props) {
  const { cW, cH } = getCanvas(device, orientation);

  if (rendersCreativeAsset(device)) {
    return (
      <CreativeAssetCanvas
        slide={slide}
        device={device}
        cW={cW}
        cH={cH}
        theme={theme}
        locale={locale}
        appIcon={appIcon}
        appName={appName}
        editable={editable}
        edit={edit}
        hideEmpty={hideEmpty}
      />
    );
  }

  const handleBackgroundMouseDown = editable
    ? (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) edit?.onSelectElement?.(null);
      }
    : undefined;

  return (
    <div
      className="st-canvas"
      lang={locale}
      onMouseDown={handleBackgroundMouseDown}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SlideBackground slide={slide} device={device} orientation={orientation} theme={theme} />
      <SlideElements
        slide={slide}
        device={device}
        orientation={orientation}
        theme={theme}
        locale={locale}
        editable={editable}
        edit={edit}
        selectedElementId={selectedElementId}
        previewScale={previewScale}
        hideEmpty={hideEmpty}
        screenX={0}
        boundsW={cW}
        boundsH={cH}
        allowCrossScreen={false}
      />
    </div>
  );
}

// ---------- Connected deck canvas ----------

export function DeckCanvas({
  slides,
  device,
  orientation,
  theme,
  locale,
  appName,
  appIcon,
  connectedCanvas = true,
  editable,
  edit,
  selectedElement = null,
  activeSlideId = null,
  previewScale = 1,
  hideEmpty,
  showGuides = false,
}: DeckCanvasProps) {
  const { cW, cH } = getCanvas(device, orientation);
  const totalW = Math.max(1, slides.length) * cW;

  return (
    <div
      className="st-canvas"
      lang={locale}
      style={{
        width: totalW,
        height: cH,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {slides.map((slide, index) => {
        const screenX = index * cW;
        const active = activeSlideId === slide.id;
        if (rendersCreativeAsset(device)) {
          return (
            <div
              key={`${slide.id}-creative`}
              onMouseDown={(e) => {
                if (!editable || e.defaultPrevented) return;
                edit?.onSelectScreen?.(slide.id);
                edit?.onSelectElement?.(null);
              }}
              style={{
                position: "absolute",
                left: screenX,
                top: 0,
                width: cW,
                height: cH,
                overflow: "hidden",
              }}
            >
              <CreativeAssetCanvas
                slide={slide}
                device={device}
                cW={cW}
                cH={cH}
                theme={theme}
                locale={locale}
                appIcon={appIcon}
                appName={appName}
                editable={editable}
                hideEmpty={hideEmpty}
                showSafeArea={showGuides}
                edit={{
                  onLabelChange: (v) => edit?.onLabelChange?.(slide.id, v),
                  onHeadlineChange: (v) => edit?.onHeadlineChange?.(slide.id, v),
                }}
              />
              {showGuides && <ScreenGuide cW={cW} cH={cH} index={index} active={active} />}
            </div>
          );
        }
        return (
          <div
            key={`${slide.id}-bg`}
            onMouseDown={(e) => {
              if (!editable || e.defaultPrevented) return;
              edit?.onSelectScreen?.(slide.id);
              edit?.onSelectElement?.(null);
            }}
            style={{
              position: "absolute",
              left: screenX,
              top: 0,
              width: cW,
              height: cH,
              overflow: "hidden",
            }}
          >
            <SlideBackground
              slide={slide}
              device={device}
              orientation={orientation}
              theme={theme}
            />
            {showGuides && <ScreenGuide cW={cW} cH={cH} index={index} active={active} />}
          </div>
        );
      })}

      {slides.map((slide, index) => {
        if (rendersCreativeAsset(device)) return null;
        const selectedElementId =
          selectedElement?.slideId === slide.id ? selectedElement.elementId : null;
        const perSlideEdit: EditHandlers | undefined = editable
          ? {
              onLabelChange: (v) => edit?.onLabelChange?.(slide.id, v),
              onHeadlineChange: (v) => edit?.onHeadlineChange?.(slide.id, v),
              onTextElementTextChange: (id, v) => edit?.onTextElementTextChange?.(slide.id, id, v),
              onElementChange: (id, t) => edit?.onElementChange?.(slide.id, id, t),
              onSelectElement: (id) => {
                edit?.onSelectScreen?.(slide.id);
                edit?.onSelectElement?.(id ? { slideId: slide.id, elementId: id } : null);
              },
            }
          : undefined;

        const elements = (
          <SlideElements
            key={`${slide.id}-elements`}
            slide={slide}
            device={device}
            orientation={orientation}
            theme={theme}
            locale={locale}
            editable={editable}
            edit={perSlideEdit}
            selectedElementId={selectedElementId}
            previewScale={previewScale}
            hideEmpty={hideEmpty}
            screenX={connectedCanvas ? index * cW : 0}
            boundsW={connectedCanvas ? totalW : cW}
            boundsH={cH}
            allowCrossScreen={connectedCanvas}
          />
        );
        if (connectedCanvas) return elements;
        return (
          <div
            key={`${slide.id}-elements-isolated`}
            style={{
              position: "absolute",
              left: index * cW,
              top: 0,
              width: cW,
              height: cH,
              overflow: "hidden",
            }}
          >
            {elements}
          </div>
        );
      })}
    </div>
  );
}

function SlideBackground({
  slide,
  device,
  orientation,
  theme,
}: {
  slide: Slide;
  device: Device;
  orientation: Orientation;
  theme: Theme;
}) {
  const { cW, cH, defaults } = getSlideGeometry(slide, device, orientation);
  const focus = slide.layout === "full-bleed" ? undefined : rectFor("device", slide, defaults);
  return (
    <Backdrop
      design={slide.design}
      theme={theme}
      inverted={!!slide.inverted}
      cW={cW}
      cH={cH}
      seed={slide.id}
      focus={focus}
    />
  );
}

function ScreenGuide({
  cW,
  cH,
  index,
  active,
}: {
  cW: number;
  cH: number;
  index: number;
  active: boolean;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        outline: `${active ? Math.max(4, cW * 0.003) : Math.max(2, cW * 0.0015)}px solid ${
          active ? "rgba(91, 124, 250, 0.95)" : "rgba(15, 23, 42, 0.22)"
        }`,
        outlineOffset: active ? -Math.max(4, cW * 0.003) : -Math.max(2, cW * 0.0015),
        boxShadow: active
          ? "inset 0 0 0 9999px rgba(91, 124, 250, 0.03)"
          : "inset 0 0 0 1px rgba(255, 255, 255, 0.22)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: cW * 0.035,
          top: cH * 0.024,
          borderRadius: cW * 0.018,
          padding: `${cH * 0.006}px ${cW * 0.018}px`,
          background: active ? "rgba(91, 124, 250, 0.92)" : "rgba(15, 23, 42, 0.72)",
          color: "white",
          fontSize: Math.max(24, cW * 0.022),
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: 0,
        }}
      >
        {index + 1}
      </div>
    </div>
  );
}

// ---------- App Store creative asset (product page header / search results) ----------
//
// Apple crops these canvases per device, orientation and placement; only the
// art safe area (CREATIVE_SAFE_AREA) is guaranteed visible. So the composition
// is centred on the safe area: the icon + one short phrase live inside it, and
// everything outside it is atmosphere that may be cropped without losing the
// message: night sky, girih pattern, mihrab arch, masjid skyline and two
// tilted phones peeking in from the sides.

const CREATIVE_GOLD = "#E4CE9E";

/** Deterministic PRNG so the star field is identical in previews and exports. */
function seededRandom(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Pointed (mihrab) arch from the canvas floor up to an apex at (cx, top). */
function archPath(cx: number, top: number, width: number, floor: number) {
  const l = cx - width / 2;
  const r = cx + width / 2;
  const spring = top + width * 0.42;
  const shoulder = spring - width * 0.3;
  const nearApex = top + width * 0.1;
  return [
    `M ${l} ${floor}`,
    `L ${l} ${spring}`,
    `C ${l} ${shoulder} ${cx - width * 0.22} ${nearApex} ${cx} ${top}`,
    `C ${cx + width * 0.22} ${nearApex} ${r} ${shoulder} ${r} ${spring}`,
    `L ${r} ${floor}`,
  ].join(" ");
}

/** Onion dome sitting on `base`, `r` wide each side, `h` tall, with a finial. */
function domePath(cx: number, base: number, r: number, h: number) {
  const tip = base - h;
  return [
    `M ${cx - r} ${base}`,
    `C ${cx - r * 1.08} ${base - h * 0.55} ${cx - r * 0.2} ${base - h * 0.72} ${cx} ${tip}`,
    `C ${cx + r * 0.2} ${base - h * 0.72} ${cx + r * 1.08} ${base - h * 0.55} ${cx + r} ${base}`,
    "Z",
    // finial
    `M ${cx - r * 0.035} ${tip + h * 0.02} L ${cx - r * 0.035} ${tip - h * 0.22}`,
    `L ${cx + r * 0.035} ${tip - h * 0.22} L ${cx + r * 0.035} ${tip + h * 0.02} Z`,
  ].join(" ");
}

/** Minaret: shaft, balcony and a pointed cap. */
function minaretPath(cx: number, floor: number, w: number, h: number) {
  const top = floor - h;
  const bal = top + h * 0.22;
  return [
    `M ${cx - w / 2} ${floor} L ${cx - w / 2} ${top} L ${cx + w / 2} ${top} L ${cx + w / 2} ${floor} Z`,
    `M ${cx - w * 0.8} ${bal} L ${cx + w * 0.8} ${bal} L ${cx + w * 0.8} ${bal + w * 0.35} L ${cx - w * 0.8} ${bal + w * 0.35} Z`,
    `M ${cx - w * 0.62} ${top} L ${cx} ${top - w * 2.1} L ${cx + w * 0.62} ${top} Z`,
  ].join(" ");
}

/** Symmetric masjid skyline across the full canvas width, `u` = skyline unit height. */
function skylinePath(cW: number, cH: number, u: number) {
  const cx = cW / 2;
  const parts: string[] = [
    `M 0 ${cH} L 0 ${cH - u * 0.2} L ${cW} ${cH - u * 0.2} L ${cW} ${cH} Z`,
    // central prayer hall + main dome + flanking domes
    `M ${cx - u * 0.95} ${cH} L ${cx - u * 0.95} ${cH - u * 0.48} L ${cx + u * 0.95} ${cH - u * 0.48} L ${cx + u * 0.95} ${cH} Z`,
    domePath(cx, cH - u * 0.46, u * 0.52, u * 0.62),
  ];
  for (const side of [-1, 1]) {
    parts.push(domePath(cx + side * u * 0.7, cH - u * 0.46, u * 0.2, u * 0.26));
    parts.push(minaretPath(cx + side * u * 1.2, cH, u * 0.1, u * 1.02));
    // Rows of smaller houses and domes out to the canvas edges.
    for (let k = 0, x = u * 1.65; x < cW / 2 + u; k++, x += u * 0.95) {
      const bx = cx + side * x;
      const bodyH = u * (0.28 + 0.1 * ((k * 7) % 3));
      parts.push(
        `M ${bx - u * 0.42} ${cH} L ${bx - u * 0.42} ${cH - bodyH} L ${bx + u * 0.42} ${cH - bodyH} L ${bx + u * 0.42} ${cH} Z`,
      );
      if (k % 3 === 1) parts.push(minaretPath(bx + side * u * 0.3, cH, u * 0.08, u * 0.78));
      else parts.push(domePath(bx, cH - bodyH + u * 0.01, u * 0.24, u * 0.3));
    }
  }
  return parts.join(" ");
}

/** 8-point star (khatam) polygon centred in a `t`-sized pattern tile. */
function khatamPoints(t: number) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const rad = i % 2 === 0 ? t * 0.42 : t * 0.3;
    pts.push(`${(t / 2 + rad * Math.cos(a)).toFixed(2)},${(t / 2 + rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function CreativeAssetCanvas({
  slide,
  device,
  cW,
  cH,
  theme,
  locale,
  appIcon,
  appName,
  editable,
  edit,
  hideEmpty,
  showSafeArea = false,
}: {
  slide: Slide;
  device: Device;
  cW: number;
  cH: number;
  theme: Theme;
  locale: string;
  appIcon?: string;
  appName?: string;
  editable?: boolean;
  edit?: EditHandlers;
  hideEmpty?: boolean;
  showSafeArea?: boolean;
}) {
  const S: SafeArea = creativeSafeArea(device) ?? {
    x: cW * 0.3,
    y: cH * 0.3,
    w: cW * 0.4,
    h: cH * 0.4,
  };
  // Unique per instance: the preview, thumbnails and the off-screen export
  // container can all render the same deck at once.
  const uid = `ca${React.useId().replace(/[^A-Za-z0-9_-]/g, "")}`;
  const scx = S.x + S.w / 2;
  const scy = S.y + S.h / 2;
  // App Store: icon + phrase, phones in the auxiliary area. Play feature graphic:
  // name + phrase, no device imagery and no icon-like branding (Google's rules),
  // brighter greens so it doesn't sink into Play's dark UI. TV banner: the full
  // logo only (icon + name), nothing else.
  const variant = creativeVariant(device);
  const appStore = variant === "app-store";
  const tvBanner = variant === "tv-banner";
  const glow = mix(theme.bg, theme.accent, appStore ? 0.16 : 0.34);
  const base = mix(theme.bg, theme.accent, appStore ? 0.04 : 0.16);
  const edge = appStore ? shade(theme.bg, -7) : mix(theme.bg, theme.accent, 0.03);

  // --- Auxiliary art geometry ---
  const crescentR = cH * 0.034;
  const archW = Math.min(S.w * 1.1, cW * 0.8);
  const archTop = Math.max(S.y - S.h * 0.42, crescentR * 3.4);
  const archInset = archW * 0.035;
  const skyU = cH * (cW / cH > 2 ? 0.15 : 0.12);
  const tile = cH * 0.12;

  // Phones sit in the auxiliary area left/right of the safe area (which Apple
  // centres horizontally), tilted, and may bleed off the canvas edges.
  const tilt = 7;
  const rad = (tilt * Math.PI) / 180;
  const phoneH = Math.min(cH * 0.86, (S.x * 1.05) / MK_RATIO);
  const phoneW = phoneH * MK_RATIO;
  const halfBox = (phoneW * Math.cos(rad) + phoneH * Math.sin(rad)) / 2;
  const phoneGap = S.w * 0.035;
  const phoneCy = cH * 0.55;
  const phones = appStore
    ? [
        { key: "l", cx: S.x - phoneGap - halfBox, rotate: -tilt, src: slide.screenshot },
        {
          key: "r",
          cx: S.x + S.w + phoneGap + halfBox,
          rotate: tilt,
          src: slide.screenshotSecondary || slide.screenshot,
        },
      ]
    : [];

  const stars = React.useMemo(() => {
    const rand = seededRandom(Math.round(cW * 31 + cH));
    const out: { x: number; y: number; r: number; o: number }[] = [];
    const padX = S.w * 0.04;
    const padY = S.h * 0.06;
    while (out.length < 170) {
      const x = rand() * cW;
      const y = rand() * cH * 0.72;
      const r = cH * (0.0009 + rand() * 0.0022);
      const o = 0.18 + rand() * 0.6;
      // Keep the sky behind the message calm.
      if (x > S.x - padX && x < S.x + S.w + padX && y > S.y - padY && y < S.y + S.h + padY) {
        continue;
      }
      out.push({ x, y, r, o });
    }
    return out;
  }, [cW, cH, S.x, S.y, S.w, S.h]);

  // --- Safe-area message: icon + optional label + one short phrase ---
  const headline = pickText(slide.headline, locale);
  // Feature graphic: the app name stands in for the icon as a small gold label.
  const label =
    pickText(slide.label, locale) ||
    (variant === "feature-graphic" ? (appName || "").toUpperCase() : "");
  const dir = textDir(slide.headline, locale);
  const rtl = dir === "rtl";
  const lines = (headline || " ").replace(/\*\*/g, "").split("\n");
  const longest = Math.max(1, ...lines.map((l) => [...l].length));
  const padX = S.w * 0.05;
  const padY = S.h * 0.07;
  const innerW = S.w - padX * 2;
  const innerH = S.h - padY * 2;
  const iconSrc = appIcon ? img(appIcon) : "";
  const iconSize = appStore ? innerH * 0.26 : 0;
  const gapY = innerH * 0.055;
  const labelSize = label ? innerH * (appStore ? 0.06 : 0.085) : 0;
  const lineHeight = rtl ? 1.32 : 1.1;
  const textH =
    innerH - (iconSize ? iconSize + gapY : 0) - (label ? labelSize * 1.4 + gapY * 0.5 : 0);

  // TV banner lockup: icon + (two-line) app name, sized to fill the safe area.
  const nameLines = (appName || "App").trim().split(/\s+/);
  const nameLongest = Math.max(1, ...nameLines.map((l) => [...l].length));
  const tvIcon = innerH * 0.78;
  const tvGap = innerH * 0.12;
  const tvNameSize = Math.min(
    innerH / (nameLines.length * 1.04),
    (innerW - tvIcon - tvGap) / (nameLongest * 0.6),
  );
  // Size from the text itself (no DOM measuring, so previews and exports match):
  // the longest line must fit the safe width, all lines the remaining height.
  const fontSize = Math.min(
    innerH * 0.26,
    textH / (lines.length * lineHeight),
    innerW / (longest * (rtl ? 0.5 : 0.58)),
  );

  return (
    <div
      className="ca-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        color: theme.fg,
        background: `radial-gradient(ellipse ${S.w * 1.25}px ${S.h * 1.7}px at ${scx}px ${scy}px, ${glow} 0%, transparent 72%),
          radial-gradient(140% 120% at 50% 30%, ${mix(base, theme.accent, 0.04)} 0%, ${base} 48%, ${edge} 100%)`,
      }}
    >
      <svg
        aria-hidden
        width={cW}
        height={cH}
        viewBox={`0 0 ${cW} ${cH}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <pattern
            id={`${uid}-girih`}
            width={tile}
            height={tile}
            patternUnits="userSpaceOnUse"
            x={scx - tile / 2}
            y={scy - tile / 2}
          >
            <polygon
              points={khatamPoints(tile)}
              fill="none"
              stroke={theme.fg}
              strokeWidth={tile * 0.012}
            />
            {[
              [0, 0],
              [tile, 0],
              [0, tile],
              [tile, tile],
            ].map(([x, y]) => (
              <rect
                key={`${x}-${y}`}
                x={x - tile * 0.07}
                y={y - tile * 0.07}
                width={tile * 0.14}
                height={tile * 0.14}
                transform={`rotate(45 ${x} ${y})`}
                fill="none"
                stroke={theme.fg}
                strokeWidth={tile * 0.012}
              />
            ))}
          </pattern>
          <radialGradient
            id={`${uid}-fade`}
            gradientUnits="userSpaceOnUse"
            cx={scx}
            cy={scy}
            r={Math.max(cW, cH) * 0.62}
          >
            <stop offset="0" stopColor="#000" />
            <stop offset="0.28" stopColor="#000" />
            <stop offset="0.62" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.55" />
          </radialGradient>
          <mask id={`${uid}-pattern-mask`}>
            <rect width={cW} height={cH} fill={`url(#${uid}-fade)`} />
          </mask>
          <radialGradient
            id={`${uid}-glow`}
            gradientUnits="userSpaceOnUse"
            cx={scx}
            cy={scy}
            r={Math.max(S.w, S.h) * 0.75}
          >
            <stop offset="0" stopColor={theme.accent} stopOpacity="0.3" />
            <stop offset="0.55" stopColor={theme.accent} stopOpacity="0.08" />
            <stop offset="1" stopColor={theme.accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-arch-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={CREATIVE_GOLD} stopOpacity="0.1" />
            <stop offset="0.5" stopColor={theme.accent} stopOpacity="0.05" />
            <stop offset="1" stopColor={theme.bg} stopOpacity="0" />
          </linearGradient>
          <mask id={`${uid}-crescent`}>
            <circle cx={scx} cy={archTop - crescentR * 1.55} r={crescentR} fill="#fff" />
            <circle
              cx={scx}
              cy={archTop - crescentR * 1.55 - crescentR * 0.4}
              r={crescentR * 0.84}
              fill="#000"
            />
          </mask>
        </defs>

        {/* Girih pattern, faded out behind the message */}
        <rect
          width={cW}
          height={cH}
          fill={`url(#${uid}-girih)`}
          mask={`url(#${uid}-pattern-mask)`}
          opacity={0.075}
        />

        {/* Night sky */}
        {stars.map((s, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: deterministic, static star list
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={theme.fg} opacity={s.o} />
        ))}

        {/* Mihrab arch framing the safe area, with a crescent finial */}
        <rect width={cW} height={cH} fill={`url(#${uid}-glow)`} />
        {!tvBanner && (
          <>
            <path d={archPath(scx, archTop, archW, cH)} fill={`url(#${uid}-arch-fill)`} />
            <path
              d={archPath(scx, archTop, archW, cH)}
              fill="none"
              stroke={CREATIVE_GOLD}
              strokeOpacity={0.42}
              strokeWidth={cH * 0.0035}
            />
            <path
              d={archPath(scx, archTop + archInset * 1.5, archW - archInset * 2, cH)}
              fill="none"
              stroke={CREATIVE_GOLD}
              strokeOpacity={0.18}
              strokeWidth={cH * 0.0022}
            />
            <circle
              cx={scx}
              cy={archTop - crescentR * 1.55}
              r={crescentR * 2.4}
              fill={CREATIVE_GOLD}
              opacity={0.07}
            />
            <rect
              width={cW}
              height={cH}
              fill={CREATIVE_GOLD}
              mask={`url(#${uid}-crescent)`}
              opacity={0.9}
            />
            <rect
              x={scx - cH * 0.0016}
              y={archTop - crescentR * 0.62}
              width={cH * 0.0032}
              height={crescentR * 0.62}
              fill={CREATIVE_GOLD}
              opacity={0.6}
            />
          </>
        )}
      </svg>

      {/* Product, peeking in from the auxiliary area */}
      {phones.map((p) => (
        <div
          key={p.key}
          style={{
            position: "absolute",
            left: p.cx - phoneW / 2,
            top: phoneCy - phoneH / 2,
            width: phoneW,
            height: phoneH,
            transform: `rotate(${p.rotate}deg)`,
            filter: `drop-shadow(0 ${cH * 0.02}px ${cH * 0.035}px rgba(0,0,0,0.5))`,
          }}
        >
          <Phone
            src={resolveScreenshot(p.src, locale)}
            style={{ width: "100%", height: "100%" }}
            hideEmpty={hideEmpty}
          />
        </div>
      ))}

      {/* Masjid skyline + floor fade (also grounds the phones) */}
      <svg
        aria-hidden
        width={cW}
        height={cH}
        viewBox={`0 0 ${cW} ${cH}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={shade(theme.bg, -9)} stopOpacity="0" />
            <stop offset="1" stopColor={shade(theme.bg, -9)} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect y={cH - skyU * 2.2} width={cW} height={skyU * 2.2} fill={`url(#${uid}-floor)`} />
        <path d={skylinePath(cW, cH, skyU)} fill={shade(theme.bg, -8)} opacity={0.92} />
      </svg>

      {/* TV banner: the full logo (icon + name) and nothing else, inside the safe area */}
      {tvBanner && (
        <div
          dir="ltr"
          style={{
            position: "absolute",
            left: S.x,
            top: S.y,
            width: S.w,
            height: S.h,
            boxSizing: "border-box",
            padding: `${padY}px ${padX}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: tvGap,
            zIndex: 2,
          }}
        >
          {iconSrc ? (
            <img
              src={iconSrc}
              alt=""
              draggable={false}
              style={{
                width: tvIcon,
                height: tvIcon,
                borderRadius: tvIcon * 0.2237,
                flexShrink: 0,
                boxShadow: `0 ${tvIcon * 0.05}px ${tvIcon * 0.18}px rgba(0,0,0,0.4)`,
              }}
            />
          ) : null}
          <div
            style={{
              fontSize: tvNameSize,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -tvNameSize * 0.015,
              color: theme.fg,
              whiteSpace: "nowrap",
              textShadow: `0 ${tvNameSize * 0.04}px ${tvNameSize * 0.35}px rgba(0,0,0,0.35)`,
            }}
          >
            {nameLines.map((line, i) => (
              <div key={line} style={i > 0 ? { color: CREATIVE_GOLD } : undefined}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The message — always inside the safe area */}
      <div
        style={{
          position: "absolute",
          left: S.x,
          top: S.y,
          width: S.w,
          height: S.h,
          boxSizing: "border-box",
          padding: `${padY}px ${padX}px`,
          display: tvBanner ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: gapY,
          textAlign: "center",
          zIndex: 2,
        }}
      >
        {!appStore ? null : iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            draggable={false}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize * 0.2237,
              flexShrink: 0,
              boxShadow: `0 ${iconSize * 0.06}px ${iconSize * 0.2}px rgba(0,0,0,0.45), 0 0 0 ${Math.max(1, iconSize * 0.012)}px rgba(228,206,158,0.35)`,
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize * 0.2237,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${theme.accent}55, ${theme.accent})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: iconSize * 0.5,
            }}
          >
            {(appName || "A").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div style={{ width: "100%" }}>
          {label ? (
            <EditableText
              value={label}
              dir={textDir(slide.label, locale)}
              editable={editable}
              onChange={edit?.onLabelChange}
              style={{
                fontSize: labelSize,
                fontWeight: 700,
                letterSpacing: labelSize * 0.14,
                textTransform: "uppercase",
                color: CREATIVE_GOLD,
                marginBottom: gapY * 0.5,
              }}
            />
          ) : null}
          <EditableText
            value={headline}
            dir={dir}
            editable={editable}
            multiline
            onChange={edit?.onHeadlineChange}
            placeholder="One short phrase"
            style={{
              fontSize,
              fontWeight: 800,
              lineHeight,
              letterSpacing: rtl ? 0 : -fontSize * 0.012,
              color: theme.fg,
              textShadow: `0 ${fontSize * 0.04}px ${fontSize * 0.4}px rgba(0,0,0,0.45)`,
            }}
          />
        </div>
      </div>

      {showSafeArea && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: S.x,
            top: S.y,
            width: S.w,
            height: S.h,
            pointerEvents: "none",
            zIndex: 3,
            outline: `${Math.max(3, cW * 0.0012)}px dashed rgba(255, 214, 102, 0.95)`,
            boxShadow: "0 0 0 99999px rgba(0, 0, 0, 0.28)",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              bottom: "100%",
              marginBottom: cH * 0.008,
              padding: `${cH * 0.004}px ${cW * 0.006}px`,
              borderRadius: cW * 0.003,
              background: "rgba(255, 214, 102, 0.95)",
              color: "#1a1a1a",
              fontSize: Math.max(18, cH * 0.018),
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {appStore ? "Apple art safe area" : tvBanner ? "Logo safe area" : "Focal zone"} · {S.w}×
            {S.h} at ({S.x}, {S.y})
          </span>
        </div>
      )}
    </div>
  );
}

function SlideElements({
  slide,
  device,
  orientation,
  theme,
  locale,
  editable,
  edit,
  selectedElementId,
  previewScale,
  hideEmpty,
  screenX,
  boundsW,
  boundsH,
  allowCrossScreen,
}: {
  slide: Slide;
  device: Device;
  orientation: Orientation;
  theme: Theme;
  locale: string;
  editable?: boolean;
  edit?: EditHandlers;
  selectedElementId: ElementId | null;
  previewScale: number;
  hideEmpty?: boolean;
  screenX: number;
  boundsW: number;
  boundsH: number;
  allowCrossScreen: boolean;
}) {
  const landscape = orientation === "landscape";
  const screenshot = resolveScreenshot(
    (landscape && slide.screenshotLandscape) || slide.screenshot,
    locale,
  );
  const screenshotSecondary = resolveScreenshot(
    (landscape && slide.screenshotSecondaryLandscape) || slide.screenshotSecondary,
    locale,
  );
  const { cW, cH, Frame, frameAspect, defaults } = getSlideGeometry(slide, device, orientation);
  const inverted = !!slide.inverted;
  const captionRect = rectFor("caption", slide, defaults);
  const deviceRect = rectFor("device", slide, defaults);
  const secondaryRect = rectFor("deviceSecondary", slide, defaults);
  const lensBox = rectFor("lens", slide, defaults);
  const featuresBox = rectFor("features", slide, defaults);
  const tone: Tone = toneFor(theme, inverted, slide.design);
  const finish = slide.design?.finish;

  function toGlobal(rect: Rect): Rect {
    return { ...rect, x: rect.x + screenX };
  }

  function toLocal(t: ElementTransform): ElementTransform {
    return { ...t, x: t.x - screenX };
  }

  function renderCaption() {
    if (!captionRect) return null;
    const saved = slide.transforms?.caption;
    const rotation = captionRect.rotation ?? 0;
    const zIndex = saved?.zIndex ?? defaultElementZ("caption");
    const inner = (
      <Caption
        cW={cW}
        cH={cH}
        slide={slide}
        theme={theme}
        locale={locale}
        editable={editable}
        edit={edit}
        align={captionRect.align || "center"}
        inverted={inverted}
        onFocus={() => edit?.onSelectElement?.("caption")}
      />
    );
    return (
      <Movable
        rect={toGlobal(captionRect)}
        boundsW={boundsW}
        boundsH={boundsH}
        editable={editable}
        previewScale={previewScale}
        rotation={rotation}
        onChange={(t) =>
          edit?.onElementChange?.(
            "caption",
            toLocal({
              ...t,
              rotation: t.rotation ?? rotation,
              zIndex: t.zIndex ?? zIndex,
            }),
          )
        }
        zIndex={zIndex}
        selected={selectedElementId === "caption"}
        onSelect={() => edit?.onSelectElement?.("caption")}
        allowOverflow={allowCrossScreen}
      >
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-start" }}>
          {inner}
        </div>
      </Movable>
    );
  }

  function renderDevice(id: "device" | "deviceSecondary", rect: GeoRect, src: string) {
    const saved = slide.transforms?.[id];
    const rotation = rect.rotation ?? 0;
    const zIndex = saved?.zIndex ?? defaultElementZ(id);
    return (
      <Movable
        rect={toGlobal(rect)}
        boundsW={boundsW}
        boundsH={boundsH}
        editable={editable}
        previewScale={previewScale}
        rotation={rotation}
        onChange={(t) =>
          edit?.onElementChange?.(
            id,
            toLocal({
              ...t,
              rotation: t.rotation ?? rotation,
              zIndex: t.zIndex ?? zIndex,
            }),
          )
        }
        lockAspectRatio={frameAspect}
        zIndex={zIndex}
        allowOverflow
        selected={selectedElementId === id}
        onSelect={() => edit?.onSelectElement?.(id)}
      >
        <Frame
          src={src}
          hideEmpty={hideEmpty}
          finish={finish}
          style={{ width: "100%", height: "100%" }}
        />
      </Movable>
    );
  }

  /** Lens / feature chips: plain movable boxes with the layout's default rect. */
  function renderBox(
    id: "lens" | "features",
    rect: GeoRect,
    children: React.ReactNode,
    lockAspectRatio?: number,
  ) {
    const saved = slide.transforms?.[id];
    const rotation = rect.rotation ?? 0;
    const zIndex = saved?.zIndex ?? defaultElementZ(id);
    return (
      <Movable
        rect={toGlobal(rect)}
        boundsW={boundsW}
        boundsH={boundsH}
        editable={editable}
        previewScale={previewScale}
        rotation={rotation}
        onChange={(t) =>
          edit?.onElementChange?.(
            id,
            toLocal({ ...t, rotation: t.rotation ?? rotation, zIndex: t.zIndex ?? zIndex }),
          )
        }
        lockAspectRatio={lockAspectRatio}
        zIndex={zIndex}
        allowOverflow
        selected={selectedElementId === id}
        onSelect={() => edit?.onSelectElement?.(id)}
      >
        {children}
      </Movable>
    );
  }

  const featureLines = pickText(slide.design?.features, locale)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  function renderTextElement(textElement: TextElement, index: number) {
    const elementId = toTextElementId(textElement.id);
    const rect = textElement.transform;
    const rotation = rect.rotation ?? 0;
    const zIndex = rect.zIndex ?? 5 + index;
    const textColor = textElement.color || tone.fg;
    return (
      <Movable
        key={textElement.id}
        rect={toGlobal(rect)}
        boundsW={boundsW}
        boundsH={boundsH}
        editable={editable}
        previewScale={previewScale}
        rotation={rotation}
        onChange={(t) =>
          edit?.onElementChange?.(
            elementId,
            toLocal({
              ...t,
              rotation: t.rotation ?? rotation,
              zIndex: t.zIndex ?? zIndex,
            }),
          )
        }
        zIndex={zIndex}
        selected={selectedElementId === elementId}
        onSelect={() => edit?.onSelectElement?.(elementId)}
        allowOverflow={allowCrossScreen}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              textElement.align === "right"
                ? "flex-end"
                : textElement.align === "left"
                  ? "flex-start"
                  : "center",
            padding: `${Math.min(cW, cH) * 0.012}px`,
          }}
        >
          <EditableText
            value={pickText(textElement.text, locale)}
            dir={textDir(textElement.text, locale)}
            editable={editable}
            multiline
            onChange={(value) => edit?.onTextElementTextChange?.(textElement.id, value)}
            onFocus={() => edit?.onSelectElement?.(elementId)}
            placeholder="Text"
            style={{
              width: "100%",
              color: textColor,
              fontSize: textElement.fontSize ?? Math.min(cW, cH) * 0.06,
              fontWeight: textElement.fontWeight ?? 700,
              lineHeight: 1.05,
              textAlign: textElement.align ?? "center",
              textShadow: tone.textShadow,
            }}
          />
        </div>
      </Movable>
    );
  }

  return (
    <>
      {secondaryRect &&
        renderDevice("deviceSecondary", secondaryRect, screenshotSecondary || screenshot)}
      {deviceRect && renderDevice("device", deviceRect, screenshot)}
      {renderCaption()}
      {featuresBox &&
        featureLines.length > 0 &&
        renderBox(
          "features",
          featuresBox,
          <FeatureChips
            items={featureLines}
            tone={tone}
            unit={Math.min(cW, cH)}
            dir={textDir(slide.design?.features, locale)}
          />,
        )}
      {lensBox &&
        slide.design?.lens &&
        renderBox(
          "lens",
          lensBox,
          <LensView
            src={img(screenshot)}
            lens={
              // Per-locale captures of an RTL locale show the app mirrored, so mirror the focus.
              textDir(slide.headline, locale) === "rtl" && slide.screenshot.includes("{locale}")
                ? { ...slide.design.lens, x: 1 - slide.design.lens.x }
                : slide.design.lens
            }
            tint={tone.light ? "#152921" : "#000000"}
            imageAspect={imgAspect(screenshot) ?? screenAspectFor(device, orientation)}
          />,
          1,
        )}
      {(slide.textElements || []).map(renderTextElement)}
    </>
  );
}

// ---------- Movable wrapper ----------

// Fraction of an element's width/height that must remain inside the canvas
// when overflow is allowed. Keeps a graspable handle visible so the user can
// always drag the element back onto the canvas.
const MIN_VISIBLE_FRAC = 0.1;

function clampRect(
  r: { x: number; y: number; width: number; height: number },
  boundsW: number,
  boundsH: number,
  allowOverflow = false,
) {
  if (allowOverflow) {
    const width = r.width;
    const height = r.height;
    const minVisX = Math.max(8, width * MIN_VISIBLE_FRAC);
    const minVisY = Math.max(8, height * MIN_VISIBLE_FRAC);
    const x = Math.max(-(width - minVisX), Math.min(r.x, boundsW - minVisX));
    const y = Math.max(-(height - minVisY), Math.min(r.y, boundsH - minVisY));
    return { x, y, width, height };
  }
  const width = Math.min(r.width, boundsW);
  const height = Math.min(r.height, boundsH);
  const x = Math.max(0, Math.min(r.x, boundsW - width));
  const y = Math.max(0, Math.min(r.y, boundsH - height));
  return { x, y, width, height };
}

function Movable({
  rect,
  boundsW,
  boundsH,
  editable,
  previewScale,
  onChange,
  children,
  lockAspectRatio,
  zIndex,
  rotation = 0,
  allowOverflow = false,
  selected = false,
  onSelect,
}: {
  rect: Rect;
  boundsW: number;
  boundsH: number;
  editable?: boolean;
  previewScale: number;
  onChange: (t: ElementTransform) => void;
  children: React.ReactNode;
  lockAspectRatio?: number | boolean;
  zIndex?: number;
  rotation?: number;
  allowOverflow?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const rotationRef = React.useRef(rotation);
  React.useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  function startRotate(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.();

    const root = e.currentTarget.closest(".rnd-editable") as HTMLElement | null;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    const startAngle = pointerAngle(e.clientX, e.clientY, centerX, centerY);
    const startRotation = rotationRef.current;

    const handleMove = (event: PointerEvent) => {
      event.preventDefault();
      const nextRotation = normalizeRotation(
        startRotation + pointerAngle(event.clientX, event.clientY, centerX, centerY) - startAngle,
      );
      rotationRef.current = nextRotation;
      onChange({
        x: display.x,
        y: display.y,
        width: display.width,
        height: display.height,
        rotation: nextRotation,
        zIndex,
      });
    };
    const stopRotate = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stopRotate);
      window.removeEventListener("pointercancel", stopRotate);
    };

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", stopRotate, { once: true });
    window.addEventListener("pointercancel", stopRotate, { once: true });
  }

  // Rotation lives on the inner wrapper so the Rnd's axis-aligned rect remains
  // the authoritative bounding box for drag/resize math. A bare mousedown
  // listener (no stopPropagation — that would prevent react-rnd from starting
  // a drag) marks the element as the current selection.
  const rotated = (
    <div
      onMouseDown={() => {
        if (editable) onSelect?.();
      }}
      style={{
        width: "100%",
        height: "100%",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );

  // Non-editable (export/thumb) path: plain absolute-positioned div, no Rnd.
  if (!editable) {
    return (
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          zIndex,
        }}
      >
        {rotated}
      </div>
    );
  }

  const display = clampRect(rect, boundsW, boundsH, allowOverflow);
  const controlScale = Math.max(0.05, previewScale);

  return (
    <Rnd
      bounds={allowOverflow ? undefined : "parent"}
      scale={previewScale}
      lockAspectRatio={lockAspectRatio}
      position={{ x: display.x, y: display.y }}
      size={{ width: display.width, height: display.height }}
      onDragStart={() => onSelect?.()}
      onResizeStart={() => onSelect?.()}
      onDragStop={(_e, d) => {
        const next = clampRect(
          { x: d.x, y: d.y, width: display.width, height: display.height },
          boundsW,
          boundsH,
          allowOverflow,
        );
        onChange({ ...next, rotation, zIndex });
      }}
      onResizeStop={(_e, _dir, ref, _delta, position) => {
        const next = clampRect(
          {
            x: position.x,
            y: position.y,
            width: parseFloat(ref.style.width),
            height: parseFloat(ref.style.height),
          },
          boundsW,
          boundsH,
          allowOverflow,
        );
        onChange({ ...next, rotation, zIndex });
      }}
      style={{ zIndex }}
      resizeHandleStyles={handleStyle}
      className={selected ? "rnd-editable rnd-selected" : "rnd-editable"}
    >
      {rotated}
      <button
        type="button"
        className="rnd-rotate-handle"
        style={{
          right: -14 / controlScale,
          top: -14 / controlScale,
          width: 28 / controlScale,
          height: 28 / controlScale,
        }}
        onPointerDown={startRotate}
        title="Rotate"
        aria-label="Rotate element"
      >
        <RotateCw style={{ width: 14 / controlScale, height: 14 / controlScale }} />
      </button>
    </Rnd>
  );
}

function pointerAngle(x: number, y: number, centerX: number, centerY: number) {
  return (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
}

function normalizeRotation(degrees: number) {
  let next = degrees;
  while (next > 180) next -= 360;
  while (next < -180) next += 360;
  return Math.round(next);
}

// Subtle resize handles (visible only on hover via globals.css).
const handleSize = 14;
const handleStyle: Record<string, React.CSSProperties> = {
  top: { height: handleSize },
  right: { width: handleSize },
  bottom: { height: handleSize },
  left: { width: handleSize },
  topRight: { width: handleSize, height: handleSize },
  bottomRight: { width: handleSize, height: handleSize },
  bottomLeft: { width: handleSize, height: handleSize },
  topLeft: { width: handleSize, height: handleSize },
};
