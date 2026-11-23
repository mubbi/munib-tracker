import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * iPhone 17 Pro Max colourways. One finish is used everywhere on the site
 * (silver reads best on the night-sky background); the others are kept so a
 * page can opt in without redrawing the frame.
 */
const FINISHES = {
  silver: {
    // Horizontal gradient = light catching the rounded aluminium edges.
    rail: "linear-gradient(90deg,#c9cdd2 0%,#f7f8f9 4%,#d4d8dc 9%,#eceef0 30%,#e3e6e9 70%,#d4d8dc 91%,#f7f8f9 96%,#c3c7cc 100%)",
    button: "linear-gradient(180deg,#eef0f2 0%,#c2c6cb 55%,#a9aeb4 100%)",
    edge: "rgba(255,255,255,0.75)",
  },
  "deep-blue": {
    rail: "linear-gradient(90deg,#26314a 0%,#5a6b90 4%,#33405e 9%,#3d4b6c 30%,#37445f 70%,#33405e 91%,#5a6b90 96%,#222c43 100%)",
    button: "linear-gradient(180deg,#56678b 0%,#36435f 55%,#28324a 100%)",
    edge: "rgba(160,180,220,0.45)",
  },
  "cosmic-orange": {
    rail: "linear-gradient(90deg,#b4501a 0%,#f2a167 4%,#cf6424 9%,#e0782f 30%,#d96f2a 70%,#cf6424 91%,#f2a167 96%,#a9481a 100%)",
    button: "linear-gradient(180deg,#f39a5c 0%,#d36a28 55%,#b4521c 100%)",
    edge: "rgba(255,200,160,0.6)",
  },
} as const;

export type DeviceFinish = keyof typeof FINISHES;

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
  tilted = false,
  priority = true,
  width = 1206,
  height = 2622,
  sizes = "(min-width: 1024px) 300px, 260px",
  finish = "silver",
}: {
  src: string;
  alt: string;
  className?: string;
  tilted?: boolean;
  /** Only the above-the-fold hero device should be `priority`. */
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  finish?: DeviceFinish;
}) {
  const f = FINISHES[finish];
  return (
    <div
      className={cn("@container relative", className)}
      style={
        tilted
          ? {
              transform: "perspective(2000px) rotateY(-7deg) rotateX(1deg) rotateZ(5.5deg)",
              transformStyle: "preserve-3d",
            }
          : undefined
      }
    >
      {/* Body: aluminium rail */}
      <div
        className="relative rounded-[17cqw] p-[1.05cqw] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85),0_18px_40px_-18px_rgba(0,0,0,0.6)]"
        style={{ background: f.rail }}
      >
        {/* Polished chamfer highlight on the rail */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[17cqw]"
          style={{
            boxShadow: `inset 0 0 0 0.35cqw ${f.edge}, inset 0 0.6cqw 1cqw rgba(255,255,255,0.18)`,
          }}
        />

        {LEFT_BUTTONS.map(([top, h]) => (
          <span
            key={top}
            aria-hidden
            className="absolute -left-[0.75cqw] w-[0.95cqw] rounded-l-[0.6cqw] shadow-[-0.2cqw_0_0.4cqw_rgba(0,0,0,0.35)]"
            style={{ top: `${top}%`, height: `${h}%`, background: f.button }}
          />
        ))}
        <span
          aria-hidden
          className="absolute -right-[0.75cqw] w-[0.95cqw] rounded-r-[0.6cqw] shadow-[0.2cqw_0_0.4cqw_rgba(0,0,0,0.35)]"
          style={{ top: `${SIDE_BUTTON[0]}%`, height: `${SIDE_BUTTON[1]}%`, background: f.button }}
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
              priority={priority}
              sizes={sizes}
              className="block h-auto w-full"
            />
            {/* Dynamic Island */}
            <span
              aria-hidden
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
