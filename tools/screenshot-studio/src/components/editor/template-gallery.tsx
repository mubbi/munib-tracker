"use client";
import { LayoutTemplate, Wand2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allowsLayout } from "@/lib/constants";
import { applyTemplate, DECK_RECIPES, SLIDE_TEMPLATES, type SlideTemplate } from "@/lib/templates";
import type { Device, Orientation, Slide, Theme } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getCanvas, SlideCanvas } from "./slide-canvas";

type Props = {
  slide: Slide;
  device: Device;
  orientation: Orientation;
  theme: Theme;
  locale: string;
  appName?: string;
  appIcon?: string;
  onApply: (patch: Partial<Slide>) => void;
  onApplyRecipe: (recipeId: string) => void;
};

const TILE_W = 132;

/** Live previews of every template applied to the current slide, plus whole-deck recipes. */
export function TemplateGallery({
  slide,
  device,
  orientation,
  theme,
  locale,
  appName,
  appIcon,
  onApply,
  onApplyRecipe,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [recipe, setRecipe] = React.useState(DECK_RECIPES[0].id);
  const { cW, cH } = getCanvas(device, orientation);
  const tileH = Math.round(TILE_W / (cW / cH));
  const scale = TILE_W / cW;
  const templates = SLIDE_TEMPLATES.filter((t) => allowsLayout(device, t.layout));
  const recipeHint = DECK_RECIPES.find((r) => r.id === recipe)?.hint;

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-2.5">
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs">
          <Wand2 className="size-3.5" /> Deck style
        </Label>
        <div className="flex gap-1.5">
          <Select value={recipe} onValueChange={setRecipe}>
            <SelectTrigger className="h-8 flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DECK_RECIPES.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8" onClick={() => onApplyRecipe(recipe)}>
            Apply to deck
          </Button>
        </div>
        {recipeHint && <p className="text-[11px] text-muted-foreground">{recipeHint}</p>}
      </div>

      <div className="space-y-1.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-xs font-medium"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="flex items-center gap-1.5">
            <LayoutTemplate className="size-3.5" /> Templates for this screen
          </span>
          <span className="text-muted-foreground">
            {open ? "Hide" : `Show ${templates.length}`}
          </span>
        </button>
        {open && (
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <TemplateTile
                key={t.id}
                template={t}
                slide={slide}
                device={device}
                orientation={orientation}
                theme={theme}
                locale={locale}
                appName={appName}
                appIcon={appIcon}
                tileH={tileH}
                scale={scale}
                cW={cW}
                cH={cH}
                onApply={onApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateTile({
  template,
  slide,
  device,
  orientation,
  theme,
  locale,
  appName,
  appIcon,
  tileH,
  scale,
  cW,
  cH,
  onApply,
}: {
  template: SlideTemplate;
  slide: Slide;
  device: Device;
  orientation: Orientation;
  theme: Theme;
  locale: string;
  appName?: string;
  appIcon?: string;
  tileH: number;
  scale: number;
  cW: number;
  cH: number;
  onApply: (patch: Partial<Slide>) => void;
}) {
  const patch = React.useMemo(() => applyTemplate(slide, template), [slide, template]);
  const preview: Slide = { ...slide, ...patch };
  const active =
    slide.layout === template.layout &&
    (slide.design?.background ?? "aurora") === (template.design.background ?? "aurora") &&
    (slide.design?.highlight ?? "gradient") === (template.design.highlight ?? "gradient");
  return (
    <button
      type="button"
      title={template.hint}
      onClick={() => onApply(patch)}
      className={cn(
        "group flex flex-col gap-1 rounded-md border bg-card p-1 text-left transition-colors hover:border-foreground/40",
        active && "border-primary ring-1 ring-primary",
      )}
    >
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{ height: tileH, maxHeight: 220 }}
      >
        <div
          style={{
            width: cW,
            height: cH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <SlideCanvas
            slide={preview}
            device={device}
            orientation={orientation}
            theme={theme}
            locale={locale}
            appName={appName}
            appIcon={appIcon}
            hideEmpty
          />
        </div>
      </div>
      <span className="px-0.5 text-[11px] font-medium leading-tight">{template.name}</span>
    </button>
  );
}
