import { CloudSun, Moon, Sun, Sunrise, Sunset } from "lucide-react";

type Prayer = {
  name: string;
  time: string;
  t: number;
  Icon: typeof Sun;
  color: string;
  glow: string;
  crescent?: boolean;
};

/** Color-coded prayer markers, matching the Day Arc concept (dawn blue → night green). */
const PRAYERS: Prayer[] = [
  { name: "Fajr", time: "04:38", t: 0.13, Icon: Sunrise, color: "#7db9ef", glow: "125,185,239" },
  { name: "Dhuhr", time: "12:45", t: 0.36, Icon: Sun, color: "#ffd36b", glow: "255,211,107" },
  { name: "Asr", time: "16:28", t: 0.55, Icon: CloudSun, color: "#f5b44e", glow: "245,180,78" },
  { name: "Maghrib", time: "19:05", t: 0.74, Icon: Sunset, color: "#ef7a5a", glow: "239,122,90" },
  {
    name: "Isha",
    time: "20:37",
    t: 0.86,
    Icon: Moon,
    color: "#57c98a",
    glow: "87,201,138",
    crescent: true,
  },
];

// Cubic Bézier control points (viewBox 0–100 = viewport fractions).
// Convex-right sweep spanning the full viewport height — the rim of a planet.
const P0 = { x: 84, y: -4 };
const P1 = { x: 92.5, y: 30 };
const P2 = { x: 92.5, y: 68 };
const P3 = { x: 83, y: 104 };

function bez(t: number, axis: "x" | "y") {
  const u = 1 - t;
  return (
    u * u * u * P0[axis] +
    3 * u * u * t * P1[axis] +
    3 * u * t * t * P2[axis] +
    t * t * t * P3[axis]
  );
}

const CURVE = Array.from({ length: 61 }, (_, i) => {
  const t = i / 60;
  return `${bez(t, "x").toFixed(2)},${bez(t, "y").toFixed(2)}`;
}).join(" ");

/** Ringed "current position" sun orb between Fajr and Dhuhr, as in the concept. */
const SUN_T = 0.24;

/** Four-point star flare that makes each arc marker shine like a star. */
function StarFlare({ color, size }: { color: string; size: number }) {
  return (
    <svg
      viewBox="-20 -20 40 40"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <title>Star flare</title>
      <path
        d="M0 -17 C 1 -5, 5 -1, 17 0 C 5 1, 1 5, 0 17 C -1 5, -5 1, -17 0 C -5 -1, -1 -5, 0 -17 Z"
        fill={color}
        opacity="0.85"
      />
    </svg>
  );
}

/** The signature day arc: a luminous curve down the right edge tracing the five prayers. */
export function PrayerArc() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <title>Daily prayer arc</title>
        <defs>
          <linearGradient
            id="arc-halo"
            x1="0"
            y1="0"
            x2="0"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffd696" stopOpacity="0" />
            <stop offset="0.18" stopColor="#ffd696" stopOpacity="0.14" />
            <stop offset="0.5" stopColor="#ffd696" stopOpacity="0.2" />
            <stop offset="0.82" stopColor="#ffd696" stopOpacity="0.14" />
            <stop offset="1" stopColor="#ffd696" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="arc-core"
            x1="0"
            y1="0"
            x2="0"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffecc4" stopOpacity="0" />
            <stop offset="0.16" stopColor="#ffecc4" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#ffecc4" stopOpacity="0.85" />
            <stop offset="0.84" stopColor="#ffecc4" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffecc4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={CURVE}
          stroke="url(#arc-halo)"
          strokeWidth="6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={CURVE}
          stroke="url(#arc-core)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Ringed golden sun orb riding the arc (current moment) */}
      <span
        className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ left: `${bez(SUN_T, "x")}%`, top: `${bez(SUN_T, "y")}%` }}
      >
        <span className="absolute size-9 rounded-full border border-[#ffe2a8]/60" />
        <span className="absolute size-9 rounded-full bg-[#ffd88e]/15 blur-[2px]" />
        <span className="size-4 rounded-full bg-[#ffe3a2] shadow-[0_0_26px_10px_rgba(255,210,130,0.75)]" />
      </span>

      {PRAYERS.map((prayer) => (
        <div
          key={prayer.name}
          className="absolute flex -translate-y-1/2 items-start gap-4"
          style={{ top: `${bez(prayer.t, "y")}%`, left: `${bez(prayer.t, "x")}%` }}
        >
          {/* Marker sits ON the arc line, shining like a star */}
          <span className="relative -ml-[5px] mt-[3px] flex size-2.5 shrink-0 items-center justify-center">
            <StarFlare color={prayer.color} size={30} />
            {prayer.crescent ? (
              <svg viewBox="0 0 24 24" className="relative size-4" aria-hidden>
                <title>Crescent</title>
                <path
                  d="M15.5 12a7 7 0 11-5.3-6.8A5.6 5.6 0 1015.5 12z"
                  fill="#ffd88e"
                  style={{ filter: `drop-shadow(0 0 8px rgba(${prayer.glow},0.9))` }}
                />
              </svg>
            ) : (
              <span
                className="relative rounded-full"
                style={{
                  width: 9,
                  height: 9,
                  background: `radial-gradient(circle at 38% 35%, #fff, ${prayer.color})`,
                  boxShadow: `0 0 14px 5px rgba(${prayer.glow},0.7), 0 0 3px 1px rgba(255,255,255,0.9)`,
                }}
              />
            )}
          </span>

          {/* Label block: icon + name row, time underneath */}
          <span className="flex flex-col leading-tight">
            <span className="flex items-center gap-2">
              <prayer.Icon className="size-[18px]" style={{ color: prayer.color }} />
              <span
                className="text-[13px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  color: prayer.crescent ? prayer.color : "#eef3fb",
                  textShadow: "0 1px 8px rgba(0,0,0,0.45)",
                }}
              >
                {prayer.name}
              </span>
            </span>
            <span
              className="mt-0.5 pl-[26px] text-[13px] tracking-wide"
              style={{
                color: prayer.crescent ? `rgba(${prayer.glow},0.85)` : "rgba(238,243,251,0.75)",
                textShadow: "0 1px 8px rgba(0,0,0,0.45)",
              }}
            >
              {prayer.time}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
