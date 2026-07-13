import { cn } from "@/lib/utils";

/** Ogee "onion" dome outline (pinches at the base, bulges, tapers to a point). */
function dome(cx: number, w: number, wb: number, by: number, ay: number) {
  const h = by - ay;
  return [
    `M ${cx - wb} ${by}`,
    `C ${cx - wb} ${by - 0.12 * h}, ${cx - w} ${by - 0.3 * h}, ${cx - w} ${by - 0.47 * h}`,
    `C ${cx - w} ${by - 0.72 * h}, ${cx - 0.34 * w} ${by - 0.86 * h}, ${cx} ${ay}`,
    `C ${cx + 0.34 * w} ${by - 0.86 * h}, ${cx + w} ${by - 0.72 * h}, ${cx + w} ${by - 0.47 * h}`,
    `C ${cx + w} ${by - 0.3 * h}, ${cx + wb} ${by - 0.12 * h}, ${cx + wb} ${by}`,
    "Z",
  ].join(" ");
}

/** Spire + ball + crescent finial topping domes and minarets. */
function Finial({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <rect x={x - 0.7 * s} y={y - 11 * s} width={1.4 * s} height={11 * s} />
      <circle cx={x} cy={y - 13 * s} r={1.9 * s} />
      <path
        d={`M ${x} ${y - 22 * s} a ${3.8 * s} ${3.8 * s} 0 1 0 ${2.4 * s} ${6.4 * s} a ${2.7 * s} ${2.7 * s} 0 1 1 -${2.4 * s} -${6.4 * s} Z`}
      />
    </g>
  );
}

/** Tall slender minaret with galleries, pavilion cap and crescent finial. */
function Minaret({ cx, top, ground }: { cx: number; top: number; ground: number }) {
  const w = 8;
  return (
    <g>
      <path
        d={`M ${cx - w / 2 - 2} ${ground} L ${cx - w / 2} ${top + 20} L ${cx + w / 2} ${top + 20} L ${cx + w / 2 + 2} ${ground} Z`}
      />
      <rect x={cx - w} y={top + 56} width={2 * w} height={5} rx={2} />
      <rect x={cx - w * 0.85} y={top + 92} width={1.7 * w} height={4} rx={2} />
      <rect x={cx - w * 0.75} y={top + 13} width={1.5 * w} height={8} />
      <path d={dome(cx, w * 0.85, w * 0.6, top + 13, top)} />
      <Finial x={cx} y={top} s={0.6} />
    </g>
  );
}

/** Window x-positions (mosque-group coords) shared by lit windows and water streaks. */
const WINDOW_XS = [214, 254, 294, 334, 374, 414, 454];

/**
 * Full coded horizon: layered mountain ridges, a grand mosque silhouette with
 * warm lit windows, a lit waterline and a still-water reflection with light
 * streaks — matching the photographic depth of the Day Arc concept.
 */
export function MosqueSkyline({
  className,
  /** `slice` fills the box (may crop the top); `meet` shows the full skyline. */
  fit = "slice",
}: {
  className?: string;
  fit?: "slice" | "meet";
}) {
  const WATER = 196;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 240"
      preserveAspectRatio={fit === "meet" ? "xMidYMax meet" : "xMidYMax slice"}
      className={cn("h-full w-full", className)}
    >
      <title>Mosque over still water at dusk</title>
      <defs>
        <linearGradient id="ms-mosque" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#132534" />
          <stop offset="0.55" stopColor="#0a1826" />
          <stop offset="1" stopColor="#050e18" />
        </linearGradient>
        <linearGradient id="ms-ridge-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3a4d" />
          <stop offset="1" stopColor="#14222f" />
        </linearGradient>
        <linearGradient id="ms-ridge-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2c3d" />
          <stop offset="1" stopColor="#0d1a26" />
        </linearGradient>
        <linearGradient id="ms-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#453527" />
          <stop offset="0.35" stopColor="#1d2432" />
          <stop offset="1" stopColor="#070f1a" />
        </linearGradient>
        <linearGradient id="ms-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ms-waterline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffcf96" stopOpacity="0" />
          <stop offset="0.35" stopColor="#ffd9a8" stopOpacity="0.6" />
          <stop offset="0.7" stopColor="#ffcf96" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffcf96" stopOpacity="0" />
        </linearGradient>
        <filter id="ms-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id="ms-soft4" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <filter id="ms-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* Distant ridge, hazy */}
      <path
        d="M0 176 L90 158 L200 170 L330 152 L470 168 L610 154 L760 170 L900 156 L1050 168 L1200 152 L1330 164 L1440 156 L1440 196 L0 196 Z"
        fill="url(#ms-ridge-far)"
        opacity="0.75"
        filter="url(#ms-soft)"
      />
      {/* Near ridge */}
      <path
        d="M0 184 L120 168 L260 180 L420 164 L600 180 L780 166 L960 180 L1130 164 L1300 178 L1440 168 L1440 196 L0 196 Z"
        fill="url(#ms-ridge-near)"
        opacity="0.9"
      />

      {/* ── Mosque complex ── */}
      <g id="ms-mosque-g" fill="url(#ms-mosque)">
        {/* long prayer-hall wall */}
        <rect x="150" y="162" width="380" height={WATER - 162} rx="3" />
        {/* arcade of small domes along the wall */}
        {[186, 240, 428, 482].map((cx) => (
          <g key={cx}>
            <path d={dome(cx, 18, 13, 162, 142)} />
            <Finial x={cx} y={142} s={0.38} />
          </g>
        ))}
        {/* shoulder domes */}
        <path d={dome(288, 27, 20, 158, 122)} />
        <path d={dome(380, 27, 20, 158, 122)} />
        <Finial x={288} y={122} s={0.45} />
        <Finial x={380} y={122} s={0.45} />
        {/* central drum + grand dome */}
        <rect x="296" y="148" width="76" height="14" rx="3" />
        <path d={dome(334, 56, 40, 148, 72)} />
        <Finial x={334} y={72} s={0.8} />
        {/* minarets — varied heights like the concept */}
        <Minaret cx={122} top={104} ground={WATER} />
        <Minaret cx={210} top={88} ground={WATER} />
        <Minaret cx={458} top={88} ground={WATER} />
        <Minaret cx={548} top={104} ground={WATER} />
      </g>

      {/* Warm lit windows along the wall */}
      <g>
        {WINDOW_XS.map((x) => (
          <g key={x}>
            <rect
              x={x - 2.2}
              y="176"
              width="4.4"
              height="8"
              rx="2.2"
              fill="#ffd9a0"
              opacity="0.9"
              filter="url(#ms-glow)"
            />
            <rect x={x - 1.4} y="177" width="2.8" height="6" rx="1.4" fill="#ffe9c4" />
          </g>
        ))}
        {/* drum windows */}
        {[312, 326, 340, 354].map((x) => (
          <circle
            key={x}
            cx={x}
            cy={155}
            r="1.6"
            fill="#ffd9a0"
            opacity="0.85"
            filter="url(#ms-glow)"
          />
        ))}
      </g>

      {/* ── Water ── */}
      <rect x="0" y={WATER} width="1440" height={240 - WATER} fill="url(#ms-water)" />
      {/* lit waterline */}
      <rect x="0" y={WATER - 1} width="1440" height="2" fill="url(#ms-waterline)" />
      {/* blurred mirrored mosque reflection */}
      <use
        href="#ms-mosque-g"
        transform={`translate(0 ${2 * WATER}) scale(1 -1)`}
        opacity="0.22"
        filter="url(#ms-soft4)"
      />
      {/* light streaks from windows */}
      {WINDOW_XS.map((x) => (
        <rect
          key={x}
          x={x - 1.4}
          y={WATER + 2}
          width="2.8"
          height="32"
          fill="url(#ms-streak)"
          opacity="0.8"
        />
      ))}
      {[334, 210, 458].map((x) => (
        <rect
          key={x}
          x={x - 0.9}
          y={WATER + 2}
          width="1.8"
          height="42"
          fill="url(#ms-streak)"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}
