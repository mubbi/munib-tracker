"use client";
import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BACKGROUND_LABEL,
  type BackgroundStyle,
  DEFAULT_LENS,
  type DeviceFinish,
  HIGHLIGHT_LABEL,
  type HighlightStyle,
  type LensSpec,
  type SlideDesign,
} from "@/lib/design";
import { pickText, writeLocalized } from "@/lib/locale";
import type { Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DEVICE_FINISHES } from "./device-frames";

type Props = {
  slide: Slide;
  locale: string;
  /** Whether the slide shows a device (finish, glow, lens, mirror only apply then). */
  hasDevice: boolean;
  onChange: (patch: Partial<Slide>) => void;
};

/** Per-slide look: background, emphasis, label, device finish, effects, lens, feature chips. */
export function DesignControls({ slide, locale, hasDevice, onChange }: Props) {
  const design = slide.design ?? {};
  const set = React.useCallback(
    (patch: Partial<SlideDesign>) => onChange({ design: { ...design, ...patch } }),
    [design, onChange],
  );
  const lens = design.lens;
  const showFeatures = slide.layout === "feature-list" || slide.layout === "no-device";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Background</Label>
          <Select
            value={design.background ?? "aurora"}
            onValueChange={(v) => set({ background: v as BackgroundStyle })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BACKGROUND_LABEL).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">**Emphasis**</Label>
          <Select
            value={design.highlight ?? "gradient"}
            onValueChange={(v) => set({ highlight: v as HighlightStyle })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(HIGHLIGHT_LABEL).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        <Toggle
          label="Label as pill"
          checked={design.labelStyle === "pill"}
          onChange={(v) => set({ labelStyle: v ? "pill" : "eyebrow" })}
        />
        <Toggle
          label="Dark variant"
          checked={!!slide.inverted}
          onChange={(v) => onChange({ inverted: v })}
        />
        <Toggle label="Film grain" checked={!!design.grain} onChange={(v) => set({ grain: v })} />
        {hasDevice && (
          <>
            <Toggle
              label="Device glow"
              checked={!!design.glow}
              onChange={(v) => set({ glow: v })}
            />
            <Toggle
              label="Mirror"
              checked={!!design.mirror}
              onChange={(v) =>
                onChange({ design: { ...design, mirror: v }, transforms: undefined })
              }
            />
          </>
        )}
      </div>

      {hasDevice && (
        <div className="space-y-1.5">
          <Label className="text-xs">Device finish</Label>
          <div className="flex flex-wrap gap-1.5">
            <FinishSwatch
              label="Default"
              active={!design.finish}
              onClick={() => set({ finish: undefined })}
            />
            {(Object.keys(DEVICE_FINISHES) as DeviceFinish[]).map((f) => (
              <FinishSwatch
                key={f}
                label={DEVICE_FINISHES[f].label}
                color={DEVICE_FINISHES[f].swatch}
                active={design.finish === f}
                onClick={() => set({ finish: f })}
              />
            ))}
          </div>
        </div>
      )}

      {hasDevice && (
        <div className="space-y-1.5 rounded-md border p-2">
          <Toggle
            label="Magnifier lens"
            checked={!!lens}
            onChange={(v) =>
              onChange({ design: { ...design, lens: v ? DEFAULT_LENS : undefined } })
            }
          />
          {lens && (
            <div className="space-y-1.5 pt-1">
              <Range
                label="Focus X"
                value={lens.x}
                min={0}
                max={1}
                step={0.01}
                onChange={(x) => set({ lens: { ...lens, x } })}
              />
              <Range
                label="Focus Y"
                value={lens.y}
                min={0}
                max={1}
                step={0.01}
                onChange={(y) => set({ lens: { ...lens, y } })}
              />
              <Range
                label="Zoom"
                value={lens.zoom}
                min={1.5}
                max={5}
                step={0.1}
                onChange={(zoom) => set({ lens: { ...lens, zoom } as LensSpec })}
              />
              <p className="text-[10px] text-muted-foreground">
                Drag the lens on the canvas to move it; it zooms into this slide&apos;s own
                screenshot, so it follows the locale.
              </p>
            </div>
          )}
        </div>
      )}

      {showFeatures && (
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label className="text-xs">Feature chips</Label>
            <span className="text-[10px] text-muted-foreground">one per line · {locale}</span>
          </div>
          <Textarea
            rows={4}
            value={design.features?.[locale] ?? ""}
            placeholder={pickText(design.features, locale) || "Works offline\nPrivate by design"}
            onChange={(e) =>
              set({ features: writeLocalized(design.features, locale, e.target.value) })
            }
          />
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs select-none">
      <input
        type="checkbox"
        className="size-3.5 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px]">
      <span className="w-12 shrink-0 text-muted-foreground">{label}</span>
      <input
        type="range"
        className="h-1 flex-1 accent-primary"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="w-8 text-right tabular-nums">{value.toFixed(step < 0.1 ? 2 : 1)}</span>
    </label>
  );
}

function FinishSwatch({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex size-6 items-center justify-center rounded-full border text-[9px] font-semibold text-muted-foreground transition-transform hover:scale-110",
        active && "ring-2 ring-primary ring-offset-1 ring-offset-background",
      )}
      style={color ? { background: color } : undefined}
    >
      {color ? null : "A"}
    </button>
  );
}
