import {
  AndroidPhoneFrame,
  AppleWatchFrame,
  RoundWatchFrame,
  TabletFrame,
  TvFrame,
} from "@/components/content/device-frames";
import { DeviceFrame } from "@/components/day-arc/device-frame";
import type { Frame, LocalizedScreenshot } from "@/lib/screenshots";

/**
 * A real capture inside the frame of the device it was taken on (iPhone,
 * Android phone, iPad, Android tablet, TV, Apple Watch, Wear OS). The image
 * carries `lang` so screen readers know the app UI's language.
 */
export function DeviceScreen({
  shot,
  className = "w-full",
  preload = false,
  sizes,
}: {
  shot: LocalizedScreenshot;
  className?: string;
  /** Preload in `<head>`: only for an above-the-fold (LCP) capture. */
  preload?: boolean;
  sizes?: string;
}) {
  const props = {
    src: shot.src,
    alt: shot.alt,
    width: shot.width,
    height: shot.height,
    preload,
    sizes,
    className,
  };
  switch (shot.frame) {
    case "phone":
      return <DeviceFrame {...props} />;
    case "android":
      return <AndroidPhoneFrame {...props} />;
    case "tablet":
      return <TabletFrame {...props} />;
    case "tablet-landscape":
      return <TabletFrame {...props} orientation="landscape" />;
    case "tv":
      return <TvFrame {...props} />;
    case "round":
      return <RoundWatchFrame {...props} />;
    case "watch":
      return <AppleWatchFrame {...props} />;
  }
}

/** Width that suits each frame when a caller doesn't size it. */
export const FRAME_WIDTH: Record<Frame, string> = {
  phone: "w-[200px] sm:w-[220px]",
  android: "w-[200px] sm:w-[220px]",
  tablet: "w-full max-w-[22rem]",
  "tablet-landscape": "w-full max-w-xl",
  tv: "w-full max-w-xl",
  watch: "w-[170px] sm:w-[190px]",
  round: "w-[170px] sm:w-[190px]",
};
