import { frameWidthClass, Screenshot } from "@/components/content/primitives";
import type { ScreenshotSlot } from "@/content/types";
import { type Frame, getScreenshot } from "@/lib/screenshots";
import { cn } from "@/lib/utils";

/** Frames too wide to share a row with phones and watches. */
const WIDE_FRAMES = new Set<Frame>(["tv", "tablet-landscape"]);

export const slotFrame = (slot: ScreenshotSlot): Frame =>
  getScreenshot(slot.key, undefined, slot.device).frame;

const slotKey = (slot: ScreenshotSlot) => `${slot.key}:${slot.device ?? ""}`;

/** Width in a gallery: an iPad sits beside phones at a similar height; others use the frame default. */
function galleryWidth(slot: ScreenshotSlot): string {
  return slotFrame(slot) === "tablet"
    ? "w-[260px] sm:w-[300px]"
    : frameWidthClass(slot.key, slot.device);
}

/**
 * Captioned real screenshots on mixed devices: TVs and landscape tablets get
 * their own row (two side by side from `md`), then phones, iPads and watches
 * wrap together. Images are lazy; captions come from the content slot.
 */
export function ScreenshotGallery({
  slots,
  className,
}: {
  slots: readonly ScreenshotSlot[];
  className?: string;
}) {
  const wide = slots.filter((slot) => WIDE_FRAMES.has(slotFrame(slot)));
  const compact = slots.filter((slot) => !WIDE_FRAMES.has(slotFrame(slot)));
  return (
    <div className={cn("flex flex-col gap-14", className)}>
      {wide.length > 0 ? (
        <div className={cn("grid items-start gap-12", wide.length > 1 && "md:grid-cols-2")}>
          {wide.map((slot) => (
            <Screenshot
              key={slotKey(slot)}
              slot={slot}
              className={cn("mx-auto", frameWidthClass(slot.key, slot.device))}
              sizes={wide.length > 1 ? "(min-width: 768px) 540px, 92vw" : undefined}
            />
          ))}
        </div>
      ) : null}
      {compact.length > 0 ? (
        <div className="flex flex-wrap items-start justify-center gap-10">
          {compact.map((slot) => (
            <Screenshot key={slotKey(slot)} slot={slot} className={galleryWidth(slot)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
