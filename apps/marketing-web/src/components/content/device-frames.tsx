import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Realistic frames for non-phone screenshots (the phone is
 * `day-arc/device-frame.tsx`). All sizes are container units, so each frame
 * keeps its proportions at any width. Finishes match the phone's silver.
 */

type FrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Preload in `<head>`: only for an above-the-fold (LCP) image. */
  preload?: boolean;
  sizes?: string;
};

const ALUMINIUM =
  "linear-gradient(90deg,#b9bec4 0%,#f3f4f6 8%,#d3d7db 22%,#e6e8eb 50%,#cfd3d8 78%,#f3f4f6 92%,#aeb3b9 100%)";
const BAND = "linear-gradient(90deg,#141a24 0%,#2a3344 18%,#323c4f 50%,#2a3344 82%,#141a24 100%)";

/** Sport band segment above or below a watch case. */
function Band({ position, width }: { position: "top" | "bottom"; width: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto h-[38cqw] shadow-[inset_0_0_2cqw_rgba(0,0,0,0.5)]",
        position === "top"
          ? "rounded-t-[7cqw] [mask-image:linear-gradient(to_top,#000_55%,transparent)]"
          : "rounded-b-[7cqw] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]",
      )}
      style={{ width, background: BAND }}
    >
      {/* Strap texture line and the lug that meets the case */}
      <span className="absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2 bg-white/5" />
      <span
        className={cn(
          "absolute inset-x-[-4%] h-[9cqw] bg-[linear-gradient(180deg,#1b2230,#0e131b)]",
          position === "top" ? "bottom-0 rounded-t-[2cqw]" : "top-0 rounded-b-[2cqw]",
        )}
      />
    </div>
  );
}

/** Apple Watch (rectangular case, Digital Crown + side button). */
export function AppleWatchFrame({
  src,
  alt,
  width,
  height,
  className,
  preload,
  sizes,
}: FrameProps) {
  return (
    <div className={cn("@container relative", className)}>
      <Band position="top" width="66%" />
      <div className="relative">
        {/* Digital Crown */}
        <span
          aria-hidden
          className="absolute -right-[4.2cqw] top-[24%] h-[15%] w-[5.2cqw] rounded-r-[1.6cqw] bg-[repeating-linear-gradient(180deg,#d9dde1_0_0.5cqw,#9aa0a7_0.5cqw_0.9cqw)] shadow-[0.4cqw_0_0.8cqw_rgba(0,0,0,0.4)]"
        />
        {/* Side button */}
        <span
          aria-hidden
          className="absolute -right-[1.8cqw] top-[50%] h-[20%] w-[2.2cqw] rounded-r-[1cqw] bg-[linear-gradient(90deg,#c9cdd2,#9ea4ab)]"
        />
        {/* Case */}
        <div
          className="relative rounded-[24cqw] p-[2.4cqw] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)]"
          style={{ background: ALUMINIUM }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[24cqw] shadow-[inset_0_0_0_0.5cqw_rgba(255,255,255,0.55)]"
          />
          {/* Glass + display */}
          <div className="relative rounded-[21.5cqw] bg-black p-[5cqw]">
            <div className="relative overflow-hidden rounded-[15cqw] bg-black">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                preload={preload}
                sizes={sizes ?? "220px"}
                className="block h-auto w-full"
              />
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[21.5cqw] bg-[linear-gradient(125deg,rgba(255,255,255,0.14),transparent_40%)]"
            />
          </div>
        </div>
      </div>
      <Band position="bottom" width="66%" />
    </div>
  );
}

/** Round Wear OS watch (round case, crown at 3 o'clock). */
export function RoundWatchFrame({
  src,
  alt,
  width,
  height,
  className,
  preload,
  sizes,
}: FrameProps) {
  return (
    <div className={cn("@container relative", className)}>
      <Band position="top" width="56%" />
      <div className="relative">
        {/* Crown */}
        <span
          aria-hidden
          className="absolute -right-[4.5cqw] top-1/2 h-[16%] w-[5.5cqw] -translate-y-1/2 rounded-r-[2cqw] bg-[repeating-linear-gradient(180deg,#d9dde1_0_0.5cqw,#9aa0a7_0.5cqw_0.9cqw)] shadow-[0.4cqw_0_0.8cqw_rgba(0,0,0,0.4)]"
        />
        {/* Case */}
        <div
          className="relative aspect-square rounded-full p-[2.6cqw] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)]"
          style={{ background: ALUMINIUM }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_0.5cqw_rgba(255,255,255,0.55)]"
          />
          {/* Bezel ring + display */}
          <div className="relative h-full w-full rounded-full bg-[radial-gradient(circle,#0c0e11_62%,#1b1f25_100%)] p-[6.5cqw]">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                preload={preload}
                sizes={sizes ?? "220px"}
                className="block h-full w-full object-cover"
              />
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(125deg,rgba(255,255,255,0.12),transparent_42%)]"
            />
          </div>
        </div>
      </div>
      <Band position="bottom" width="56%" />
    </div>
  );
}

/** Flat-screen TV with a thin bezel and a centred pedestal stand. */
export function TvFrame({ src, alt, width, height, className, preload, sizes }: FrameProps) {
  return (
    <div className={cn("@container relative", className)}>
      {/* Panel */}
      <div className="relative rounded-[0.9cqw] bg-[linear-gradient(180deg,#2a2e34,#0c0e11)] p-[0.35cqw] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        <div className="relative rounded-[0.6cqw] bg-black p-[0.9cqw] pb-[1.6cqw]">
          <div className="relative overflow-hidden rounded-[0.2cqw]">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              preload={preload}
              sizes={sizes ?? "(min-width: 1024px) 640px, 92vw"}
              className="block h-auto w-full"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_38%)]"
            />
          </div>
          {/* Power indicator on the chin */}
          <span
            aria-hidden
            className="absolute bottom-[0.6cqw] left-1/2 h-[0.35cqw] w-[0.35cqw] -translate-x-1/2 rounded-full bg-white/25"
          />
        </div>
      </div>
      {/* Stand: neck + base */}
      <div
        aria-hidden
        className="mx-auto h-[4.5cqw] w-[7cqw] bg-[linear-gradient(90deg,#1a1d22,#3a3f46_50%,#1a1d22)]"
      />
      <div
        aria-hidden
        className="mx-auto h-[1.4cqw] w-[34cqw] rounded-[0.7cqw] bg-[linear-gradient(180deg,#4a5058,#1b1e23)] shadow-[0_1.6cqw_2.4cqw_-0.4cqw_rgba(0,0,0,0.8)]"
      />
    </div>
  );
}
