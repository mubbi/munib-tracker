import Image from "next/image";
import { cn } from "@/lib/utils";

/** Brushed-titanium rail gradient shared by the frame edge and side buttons. */
const TITANIUM =
  "linear-gradient(145deg,#eef0f2 0%,#b3b9c0 12%,#d8dce1 26%,#8b9199 46%,#c4c9cf 64%,#787e86 82%,#adb3bb 100%)";
const BUTTON = "linear-gradient(180deg,#c9ced4,#8b9199 55%,#6c727a)";

/**
 * Realistic iPhone Pro–style device frame with a brushed-titanium rail.
 * When `tilted`, applies the same sideways 3D perspective as the Day Arc concept.
 */
export function DeviceFrame({
  src,
  alt,
  className,
  tilted = false,
}: {
  src: string;
  alt: string;
  className?: string;
  tilted?: boolean;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={
        tilted
          ? {
              transform: "perspective(2000px) rotateY(-7deg) rotateX(1deg) rotateZ(5.5deg)",
              transformStyle: "preserve-3d",
            }
          : undefined
      }
    >
      <div
        className="relative rounded-[3.4rem] p-[4px] shadow-[0_50px_140px_-30px_rgba(0,0,0,0.9),12px_24px_50px_-20px_rgba(0,0,0,0.55)]"
        style={{ background: TITANIUM }}
      >
        {/* Side buttons — clearly visible on the camera-facing right rail */}
        <span
          aria-hidden
          className="absolute -left-[4px] top-[16%] h-9 w-[4px] rounded-l-md"
          style={{ background: BUTTON }}
        />
        <span
          aria-hidden
          className="absolute -left-[4px] top-[26%] h-14 w-[4px] rounded-l-md"
          style={{ background: BUTTON }}
        />
        <span
          aria-hidden
          className="absolute -left-[4px] top-[38%] h-14 w-[4px] rounded-l-md"
          style={{ background: BUTTON }}
        />
        <span
          aria-hidden
          className="absolute -right-[5px] top-[28%] h-24 w-[5px] rounded-r-md shadow-[1px_0_2px_rgba(0,0,0,0.5)]"
          style={{ background: BUTTON }}
        />

        {/* Black bezel + screen */}
        <div className="rounded-[3.1rem] bg-[#08090b] p-[10px] ring-1 ring-black/60">
          <div className="relative overflow-hidden rounded-[2.55rem]">
            <Image
              src={src}
              alt={alt}
              width={1206}
              height={2622}
              priority
              className="block h-auto w-full"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2.55rem] bg-[linear-gradient(115deg,rgba(255,255,255,0.16),transparent_38%)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
