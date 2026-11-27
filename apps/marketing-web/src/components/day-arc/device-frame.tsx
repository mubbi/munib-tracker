import Image from "next/image";
import { cn } from "@/lib/utils";

/** Silver iPhone 17 Pro Max finish (reads best on the night-sky background). */
const FINISH = {
  // Horizontal gradient = light catching the rounded aluminium edges.
  rail: "linear-gradient(90deg,#c9cdd2 0%,#f7f8f9 4%,#d4d8dc 9%,#eceef0 30%,#e3e6e9 70%,#d4d8dc 91%,#f7f8f9 96%,#c3c7cc 100%)",
  button: "linear-gradient(180deg,#eef0f2 0%,#c2c6cb 55%,#a9aeb4 100%)",
  edge: "rgba(255,255,255,0.75)",
} as const;

/** Side buttons as [top %, height %] of the body. Left: Action, volume up, volume down. */
const LEFT_BUTTONS = [
  [19.5, 4.2],
  [26.5, 7.6],
  [35.6, 7.6],
] as const;
/** Right: side button, then Camera Control (sits flush, sapphire-dark). */
const SIDE_BUTTON = [29, 11] as const;
const CAMERA_CONTROL = [54, 6.4] as const;

/**
 * iPhone 17 Pro Max device frame: thin aluminium rail, slim black bezel,
 * Dynamic Island, and the Pro button layout. Every size is in container
 * units, so the frame keeps the same proportions from a 150px thumbnail to
 * the 300px hero phone. Use it for every real screenshot on the site.
 */
export function DeviceFrame({
  src,
  alt,
  className,
  preload = false,
  width = 1206,
  height = 2622,
  sizes = "(min-width: 1024px) 300px, 260px",
}: {
  src: string;
  alt: string;
  className?: string;
  /** Preload in `<head>`: only for the above-the-fold (LCP) device. */
  preload?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}) {
  return (
    <div className={cn("@container relative", className)}>
      {/* Body: aluminium rail */}
      <div
        className="relative rounded-[17cqw] p-[1.05cqw] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85),0_18px_40px_-18px_rgba(0,0,0,0.6)]"
        style={{ background: FINISH.rail }}
      >
        {/* Polished chamfer highlight on the rail */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[17cqw]"
          style={{
            boxShadow: `inset 0 0 0 0.35cqw ${FINISH.edge}, inset 0 0.6cqw 1cqw rgba(255,255,255,0.18)`,
          }}
        />

        {LEFT_BUTTONS.map(([top, h]) => (
          <span
            key={top}
            aria-hidden
            className="absolute -left-[0.75cqw] w-[0.95cqw] rounded-l-[0.6cqw] shadow-[-0.2cqw_0_0.4cqw_rgba(0,0,0,0.35)]"
            style={{ top: `${top}%`, height: `${h}%`, background: FINISH.button }}
          />
        ))}
        <span
          aria-hidden
          className="absolute -right-[0.75cqw] w-[0.95cqw] rounded-r-[0.6cqw] shadow-[0.2cqw_0_0.4cqw_rgba(0,0,0,0.35)]"
          style={{
            top: `${SIDE_BUTTON[0]}%`,
            height: `${SIDE_BUTTON[1]}%`,
            background: FINISH.button,
          }}
        />
        <span
          aria-hidden
          className="absolute -right-[0.35cqw] w-[0.55cqw] rounded-r-[0.4cqw] bg-[linear-gradient(180deg,#3a3f46,#1d2126)]"
          style={{ top: `${CAMERA_CONTROL[0]}%`, height: `${CAMERA_CONTROL[1]}%` }}
        />

        {/* Black bezel */}
        <div className="relative rounded-[16cqw] bg-[#050607] p-[2.2cqw]">
          {/* Display */}
          <div className="relative overflow-hidden rounded-[13.8cqw] bg-black">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              preload={preload}
              sizes={sizes}
              className="block h-auto w-full"
            />
            {/* Dynamic Island (hardware art: the camera stays on the right in RTL too) */}
            <span
              aria-hidden
              dir="ltr"
              className="absolute left-1/2 top-[1.25%] flex h-[3.85%] w-[31%] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[3.2%]"
            >
              <span className="block aspect-square h-[42%] rounded-full bg-[radial-gradient(circle_at_35%_35%,#2b3a52,#0b0f16_70%)]" />
            </span>
            {/* Glass glare */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.13),transparent_36%)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
