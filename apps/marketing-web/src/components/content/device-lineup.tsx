import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { DeviceScreen } from "@/components/content/device-screen";
import {
  capture,
  captureAlt,
  type Device,
  type LocalizedScreenshot,
  type Theme,
} from "@/lib/screenshots";
import { cn } from "@/lib/utils";

export type LineupItem = { device: Device; scene: string; theme?: Theme };

/** One real capture per device the app ships on (handhelds and TV in the page locale). */
export const ALL_DEVICES: readonly LineupItem[] = [
  { device: "tv", scene: "home" },
  { device: "android-tablet", scene: "home" },
  { device: "ipad", scene: "quran" },
  { device: "iphone", scene: "tracker" },
  { device: "android", scene: "zikr" },
  { device: "watch", scene: "schedule" },
  { device: "wear", scene: "tasbeeh-tile" },
];

/** Big screens share a row; handhelds and watches sit together under them. */
const WIDE = new Set<Device>(["tv", "apple-tv", "android-tablet"]);

const WIDTH: Record<Device, string> = {
  tv: "w-full max-w-xl",
  "apple-tv": "w-full max-w-xl",
  "android-tablet": "w-full max-w-xl",
  ipad: "w-[190px] sm:w-[220px]",
  iphone: "w-[128px] sm:w-[150px]",
  android: "w-[128px] sm:w-[150px]",
  watch: "w-[108px] sm:w-[124px]",
  wear: "w-[108px] sm:w-[124px]",
};

const SIZES: Record<Device, string> = {
  tv: "(min-width: 768px) 560px, 92vw",
  "apple-tv": "(min-width: 768px) 560px, 92vw",
  "android-tablet": "(min-width: 768px) 560px, 92vw",
  ipad: "220px",
  iphone: "150px",
  android: "150px",
  watch: "124px",
  wear: "124px",
};

/**
 * Real captures of the app on each device, labelled with the device name —
 * TV and Android tablet on top, then iPad, phones and watches. Server only.
 * `footer` renders extra content under a device label (e.g. a download link).
 */
export function DeviceLineup({
  items = ALL_DEVICES,
  footer,
  className,
}: {
  items?: readonly LineupItem[];
  footer?: (shot: LocalizedScreenshot, deviceName: string) => ReactNode;
  className?: string;
}) {
  const t = useTranslations("screenshots");
  const locale = useLocale();
  const shots = items.map(({ device, scene, theme }) => ({
    ...capture(device, scene, locale, theme),
    alt: captureAlt(t, device, scene),
  }));
  const figure = (shot: LocalizedScreenshot) => {
    const name = t(`devices.${shot.device}`);
    return (
      <figure
        key={shot.src}
        className={cn(
          "flex flex-col items-center",
          WIDTH[shot.device],
          WIDE.has(shot.device) && "mx-auto",
        )}
      >
        <DeviceScreen shot={shot} sizes={SIZES[shot.device]} />
        <figcaption className="mt-3 text-center text-sm font-medium text-white/70">
          {name}
          {footer ? <span className="mt-1 block font-normal">{footer(shot, name)}</span> : null}
        </figcaption>
      </figure>
    );
  };
  const wide = shots.filter((s) => WIDE.has(s.device));
  const compact = shots.filter((s) => !WIDE.has(s.device));
  return (
    <div className={cn("flex flex-col gap-12", className)}>
      {wide.length ? (
        <div className="grid items-end gap-10 md:grid-cols-2">{wide.map(figure)}</div>
      ) : null}
      {compact.length ? (
        <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-10 sm:gap-x-10">
          {compact.map(figure)}
        </div>
      ) : null}
    </div>
  );
}
