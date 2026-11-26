"use client";
import type * as React from "react";
import type { DeviceFinish } from "@/lib/design";
import { img } from "@/lib/image-cache";

export type { DeviceFinish };

/*
 * Device frames — the same hardware language as the marketing site
 * (apps/marketing-web/src/components/day-arc/device-frame.tsx and
 * components/content/device-frames.tsx): an aluminium/titanium rail with a
 * polished chamfer, a slim black glass bezel, real camera cut-outs and the
 * side buttons, all in container units so a frame keeps its proportions from
 * a 120px thumbnail to a 5,000px export.
 *
 * Every frame is built from one geometry spec (`FrameSpec`). Its outer aspect
 * is *derived* from the capture's aspect plus the rail and bezel, so the
 * screen opening matches the real screenshot exactly and nothing is silently
 * cropped. `FRAME_ASPECT` exports those ratios for the layout maths.
 */

// ---------- Finishes ----------

type Finish = {
  label: string;
  /** 8 stops across the rail: light catching the rounded edges at 4% / 96%. */
  stops: [string, string, string, string, string, string, string, string];
  /** Polished chamfer highlight. */
  edge: string;
  /** Swatch for the inspector. */
  swatch: string;
};

const RAIL_POSITIONS = [0, 4, 9, 30, 70, 91, 96, 100];

export const DEVICE_FINISHES: Record<DeviceFinish, Finish> = {
  // Marketing site default (iPhone 17 Pro silver).
  silver: {
    label: "Silver",
    stops: ["#c9cdd2", "#f7f8f9", "#d4d8dc", "#eceef0", "#e3e6e9", "#d4d8dc", "#f7f8f9", "#c3c7cc"],
    edge: "rgba(255,255,255,0.75)",
    swatch: "#e3e6e9",
  },
  titanium: {
    label: "Natural titanium",
    stops: ["#86827c", "#d9d5cd", "#a19d96", "#c3bfb7", "#bbb7af", "#a19d96", "#d9d5cd", "#807c76"],
    edge: "rgba(255,255,255,0.55)",
    swatch: "#bbb7af",
  },
  "space-black": {
    label: "Space black",
    stops: ["#151619", "#4b4d52", "#232428", "#303136", "#2b2c31", "#232428", "#4b4d52", "#121315"],
    edge: "rgba(255,255,255,0.22)",
    swatch: "#2b2c31",
  },
  "deep-blue": {
    label: "Deep blue",
    stops: ["#1a2540", "#5b6d90", "#2a3a5c", "#35476c", "#304164", "#2a3a5c", "#5b6d90", "#172138"],
    edge: "rgba(255,255,255,0.3)",
    swatch: "#35476c",
  },
  "cosmic-orange": {
    label: "Cosmic orange",
    stops: ["#a64b18", "#f4a26c", "#cc682a", "#df7b3b", "#d87433", "#cc682a", "#f4a26c", "#9c4616"],
    edge: "rgba(255,236,220,0.6)",
    swatch: "#df7b3b",
  },
  // Brand gold (Brand.heroAccent #E4CE9E).
  gold: {
    label: "Gold",
    stops: ["#ad966e", "#f4e7c8", "#cdb68c", "#e4d2aa", "#dcc9a1", "#cdb68c", "#f4e7c8", "#a58e67"],
    edge: "rgba(255,250,236,0.7)",
    swatch: "#e4ce9e",
  },
  // Brand forest (Brand.heroTop #12463A / heroGlow #1F7A63).
  sage: {
    label: "Forest",
    stops: ["#1d3a31", "#78a090", "#2f5a4c", "#3f6c5d", "#3a6657", "#2f5a4c", "#78a090", "#1a342c"],
    edge: "rgba(220,255,240,0.35)",
    swatch: "#3f6c5d",
  },
};

function rail(f: Finish, angle = 90) {
  const stops = f.stops.map((c, i) => `${c} ${RAIL_POSITIONS[i]}%`).join(",");
  return `linear-gradient(${angle}deg,${stops})`;
}

function buttonFill(f: Finish, angle: number) {
  return `linear-gradient(${angle}deg,${f.stops[1]} 0%,${f.stops[3]} 55%,${f.stops[0]} 100%)`;
}

// ---------- Geometry ----------

/**
 * All lengths are in "short-side units": 1 = 1% of the frame's shorter side
 * (width in portrait, height in landscape). `k` converts them to cqw.
 */
type FrameSpec = {
  /** Screenshot aspect (w/h) the screen opening must match. */
  screen: number;
  rim: number;
  bezel: number;
  radius: number;
  screenRadius: number;
};

function outerAspect({ screen, rim, bezel }: FrameSpec) {
  const inset = 2 * (rim + bezel);
  if (screen < 1) return 100 / ((100 - inset) / screen + inset);
  return ((100 - inset) * screen + inset) / 100;
}

const SPEC = {
  // iPhone 17 Pro Max — 1206×2622 / 1320×2868 captures (marketing DeviceFrame values).
  iphone: { screen: 1206 / 2622, rim: 1.05, bezel: 2.2, radius: 17, screenRadius: 13.8 },
  // Pixel-style Android phone — 1080×2400 captures.
  android: { screen: 1080 / 2400, rim: 1.2, bezel: 2.6, radius: 11, screenRadius: 8 },
  // iPad Pro 13" — 2064×2752.
  ipad: { screen: 2064 / 2752, rim: 0.8, bezel: 4.2, radius: 7.6, screenRadius: 2.6 },
  // Android 7"/10" tablets — 1200×1920 / 1600×2560 (10:16).
  tabletP: { screen: 10 / 16, rim: 0.8, bezel: 3, radius: 5.4, screenRadius: 2.2 },
  tabletL: { screen: 16 / 10, rim: 0.8, bezel: 3, radius: 5.4, screenRadius: 2.2 },
  // iPhone Duo inner display — 2007×2853 portrait / 2853×2007 landscape.
  duoP: { screen: 2007 / 2853, rim: 1.1, bezel: 2.6, radius: 8.5, screenRadius: 4.8 },
  duoL: { screen: 2853 / 2007, rim: 1.1, bezel: 2.6, radius: 8.5, screenRadius: 4.8 },
  // Apple Watch Ultra — 422×514 (410×502).
  watch: { screen: 422 / 514, rim: 4, bezel: 5, radius: 21, screenRadius: 12 },
  // Round Wear OS watch — 454×454 / 1024×1024.
  wear: { screen: 1, rim: 2.6, bezel: 6.5, radius: 50, screenRadius: 50 },
  // Apple TV / Android TV panel — 16:9.
  tv: { screen: 16 / 9, rim: 0.45, bezel: 1.35, radius: 1.6, screenRadius: 0.35 },
} satisfies Record<string, FrameSpec>;

/** Screen (capture) aspect w/h per frame — the magnifier lens centres with it. */
export const SCREEN_ASPECT = {
  iphone: SPEC.iphone.screen,
  android: SPEC.android.screen,
  ipad: SPEC.ipad.screen,
  tabletP: SPEC.tabletP.screen,
  tabletL: SPEC.tabletL.screen,
  duoP: SPEC.duoP.screen,
  duoL: SPEC.duoL.screen,
  watch: SPEC.watch.screen,
  wear: 1,
  tv: SPEC.tv.screen,
} as const;

/** Outer frame aspect (w/h) per frame — the layout maths must use these. */
export const FRAME_ASPECT = {
  iphone: outerAspect(SPEC.iphone),
  android: outerAspect(SPEC.android),
  ipad: outerAspect(SPEC.ipad),
  tabletP: outerAspect(SPEC.tabletP),
  tabletL: outerAspect(SPEC.tabletL),
  duoP: outerAspect(SPEC.duoP),
  duoL: outerAspect(SPEC.duoL),
  watch: outerAspect(SPEC.watch),
  wear: 1,
  tv: outerAspect(SPEC.tv),
} as const;

// ---------- Shared shell ----------

export type FrameProps = {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  /** When true, hide EmptySlot placeholder (so it doesn't bake into exports). */
  hideEmpty?: boolean;
  /** Hardware finish; each frame has its own default. */
  finish?: DeviceFinish;
  /** Drop the frame's own drop shadow (when the layout casts its own). */
  flat?: boolean;
};

type Edge = "left" | "right" | "top" | "bottom";

/** A side button / crown sticking out of the rail. `at` and `length` are % along the edge. */
type ButtonSpec = {
  edge: Edge;
  at: number;
  length: number;
  /** Protrusion in short-side units. */
  depth: number;
  fill?: string;
  ridged?: boolean;
};

function Shell({
  spec,
  finish,
  src,
  alt = "",
  style,
  hideEmpty,
  flat,
  buttons = [],
  bezelExtras,
  screenExtras,
  screenPosition = "top",
  glare = 0.1,
  railAngle = 90,
  rimExtras,
}: {
  spec: FrameSpec;
  finish: Finish;
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  hideEmpty?: boolean;
  flat?: boolean;
  buttons?: ButtonSpec[];
  bezelExtras?: (k: number) => React.ReactNode;
  screenExtras?: (k: number) => React.ReactNode;
  screenPosition?: "top" | "center";
  glare?: number;
  railAngle?: number;
  rimExtras?: (k: number) => React.ReactNode;
}) {
  const aspect = outerAspect(spec);
  // short-side unit → cqw (cqw is % of the frame width)
  const k = aspect >= 1 ? 1 / aspect : 1;
  const u = (v: number) => `${v * k}cqw`;
  const resolved = img(src);

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: `${aspect}`,
        containerType: "inline-size",
        ...style,
      }}
    >
      {buttons.map((b) => (
        <SideButton key={`${b.edge}-${b.at}`} b={b} finish={finish} u={u} />
      ))}
      {/* Body: metal rail */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: u(spec.radius),
          background: rail(finish, railAngle),
          boxShadow: flat
            ? undefined
            : `0 ${u(9)} ${u(22)} ${u(-7)} rgba(0,0,0,0.55), 0 ${u(3)} ${u(8)} ${u(-3)} rgba(0,0,0,0.42)`,
        }}
      >
        {/* Polished chamfer */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: u(spec.radius),
            pointerEvents: "none",
            boxShadow: `inset 0 0 0 ${u(0.35)} ${finish.edge}, inset 0 ${u(0.6)} ${u(1)} rgba(255,255,255,0.18)`,
          }}
        />
        {rimExtras?.(k)}
        {/* Black glass bezel */}
        <div
          style={{
            position: "absolute",
            inset: u(spec.rim),
            borderRadius: u(spec.radius - spec.rim),
            background: "#050607",
            boxShadow: `inset 0 0 0 ${u(0.18)} rgba(255,255,255,0.07)`,
          }}
        >
          {bezelExtras?.(k)}
          {/* Display */}
          <div
            style={{
              position: "absolute",
              inset: u(spec.bezel),
              borderRadius: u(spec.screenRadius),
              overflow: "hidden",
              background: "#000",
            }}
          >
            <ScreenImage
              resolved={resolved}
              alt={alt}
              hideEmpty={hideEmpty}
              position={screenPosition}
            />
            {screenExtras?.(k)}
            {glare > 0 && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background: `linear-gradient(115deg,rgba(255,255,255,${glare}),transparent 36%)`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SideButton({ b, finish, u }: { b: ButtonSpec; finish: Finish; u: (v: number) => string }) {
  const vertical = b.edge === "left" || b.edge === "right";
  const thick = u(b.depth + 0.5);
  const out = u(-b.depth);
  const round = u(Math.min(0.7, b.depth * 0.6));
  const fill = b.ridged
    ? `repeating-linear-gradient(${vertical ? 180 : 90}deg,${finish.stops[1]} 0 ${u(0.5)},${finish.stops[0]} ${u(0.5)} ${u(0.9)})`
    : b.fill || buttonFill(finish, vertical ? 180 : 90);
  const radius: Record<Edge, string> = {
    left: `${round} 0 0 ${round}`,
    right: `0 ${round} ${round} 0`,
    top: `${round} ${round} 0 0`,
    bottom: `0 0 ${round} ${round}`,
  };
  const pos: React.CSSProperties = vertical
    ? { top: `${b.at}%`, height: `${b.length}%`, width: thick, [b.edge]: out }
    : { left: `${b.at}%`, width: `${b.length}%`, height: thick, [b.edge]: out };
  const shadowX = b.edge === "left" ? -0.2 : b.edge === "right" ? 0.2 : 0;
  const shadowY = b.edge === "top" ? -0.2 : b.edge === "bottom" ? 0.2 : 0;
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        ...pos,
        borderRadius: radius[b.edge],
        background: fill,
        boxShadow: `${u(shadowX)} ${u(shadowY)} ${u(0.4)} rgba(0,0,0,0.35)`,
      }}
    />
  );
}

/** Punch-hole / front camera lens. */
function Lens({ size, style }: { size: string; style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%,#2b3a52 0%,#0b0f16 45%,#000 75%)",
        boxShadow: "0 0 0 0.25cqw rgba(12,15,20,0.9)",
        ...style,
      }}
    />
  );
}

// ---------- iPhone ----------

/** Left: Action, volume up, volume down. Right: side button, Camera Control. */
const IPHONE_BUTTONS: ButtonSpec[] = [
  { edge: "left", at: 19.5, length: 4.2, depth: 0.75 },
  { edge: "left", at: 26.5, length: 7.6, depth: 0.75 },
  { edge: "left", at: 35.6, length: 7.6, depth: 0.75 },
  { edge: "right", at: 29, length: 11, depth: 0.75 },
  {
    edge: "right",
    at: 54,
    length: 6.4,
    depth: 0.35,
    fill: "linear-gradient(180deg,#3a3f46,#1d2126)",
  },
];

/** iPhone 17 Pro Max — the marketing site's DeviceFrame. */
export function Phone({ finish = "silver", ...props }: FrameProps) {
  return (
    <Shell
      {...props}
      spec={SPEC.iphone}
      finish={DEVICE_FINISHES[finish]}
      buttons={IPHONE_BUTTONS}
      screenExtras={() => (
        // Dynamic Island — hardware: the camera stays on the right in RTL too.
        <span
          aria-hidden
          dir="ltr"
          style={{
            position: "absolute",
            left: "50%",
            top: "1.25%",
            height: "3.85%",
            width: "31%",
            transform: "translateX(-50%)",
            borderRadius: 9999,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "3.2%",
            zIndex: 2,
          }}
        >
          <span
            style={{
              display: "block",
              height: "42%",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%,#2b3a52,#0b0f16 70%)",
            }}
          />
        </span>
      )}
    />
  );
}

// ---------- Android phone ----------

export function AndroidPhone({ finish = "silver", ...props }: FrameProps) {
  return (
    <Shell
      {...props}
      spec={SPEC.android}
      finish={DEVICE_FINISHES[finish]}
      buttons={[
        { edge: "right", at: 22, length: 9, depth: 0.7 },
        { edge: "right", at: 34, length: 14, depth: 0.7 },
      ]}
      screenExtras={() => (
        <Lens size="3.4cqw" style={{ left: "50%", top: "2.2cqw", transform: "translateX(-50%)" }} />
      )}
    />
  );
}

// ---------- Android tablets ----------

function TabletBezelCamera({
  k,
  spec,
  landscape,
}: {
  k: number;
  spec: FrameSpec;
  landscape: boolean;
}) {
  const size = 1.1 * k;
  const centre = ((spec.bezel - 1.1) / 2) * k;
  return (
    <Lens
      size={`${size}cqw`}
      style={
        landscape
          ? { left: "50%", top: `${centre}cqw`, transform: "translateX(-50%)" }
          : { left: "50%", top: `${centre}cqw`, transform: "translateX(-50%)" }
      }
    />
  );
}

export function AndroidTabletP({ finish = "space-black", ...props }: FrameProps) {
  return (
    <Shell
      {...props}
      spec={SPEC.tabletP}
      finish={DEVICE_FINISHES[finish]}
      glare={0.07}
      buttons={[
        { edge: "right", at: 10, length: 6, depth: 0.5 },
        { edge: "right", at: 18, length: 10, depth: 0.5 },
      ]}
      bezelExtras={(k) => <TabletBezelCamera k={k} spec={SPEC.tabletP} landscape={false} />}
    />
  );
}

export function AndroidTabletL({ finish = "space-black", ...props }: FrameProps) {
  return (
    <Shell
      {...props}
      spec={SPEC.tabletL}
      finish={DEVICE_FINISHES[finish]}
      glare={0.07}
      railAngle={180}
      buttons={[
        { edge: "top", at: 8, length: 6, depth: 0.5 },
        { edge: "top", at: 16, length: 10, depth: 0.5 },
      ]}
      bezelExtras={(k) => <TabletBezelCamera k={k} spec={SPEC.tabletL} landscape />}
    />
  );
}

// ---------- iPad Pro ----------

/** iPad Pro 13" (M4+): even bezel, landscape front camera on the long edge (right in portrait). */
export function IPad({ finish = "silver", ...props }: FrameProps) {
  const spec = SPEC.ipad;
  return (
    <Shell
      {...props}
      spec={spec}
      finish={DEVICE_FINISHES[finish]}
      glare={0.07}
      buttons={[
        { edge: "top", at: 78, length: 8, depth: 0.5 },
        { edge: "right", at: 7, length: 5, depth: 0.5 },
        { edge: "right", at: 13.5, length: 5, depth: 0.5 },
      ]}
      bezelExtras={() => (
        <Lens
          size="1.2cqw"
          style={{
            right: `${(spec.bezel - 1.2) / 2}cqw`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      )}
    />
  );
}

// ---------- iPhone Duo (unfolded) ----------
//
// Book-style foldable: unfolded it is a wide two-pane display whose hinge runs
// across the long axis, so the crease splits the screen into two phone-sized
// halves (vertical crease in landscape, horizontal in portrait). Satin rail
// with hinge seams where the crease meets the frame, a uniform thin bezel,
// a punch-hole front camera in the top-right corner and the button pair on
// the top edge (landscape) / right edge (portrait).

function Foldable({ landscape, finish = "silver", ...props }: FrameProps & { landscape: boolean }) {
  const spec = landscape ? SPEC.duoL : SPEC.duoP;
  const crease: React.CSSProperties = landscape
    ? { top: 0, bottom: 0, left: "50%", width: "2.2%", transform: "translateX(-50%)" }
    : { left: 0, right: 0, top: "50%", height: "2.2%", transform: "translateY(-50%)" };
  const dir = landscape ? 90 : 180;
  return (
    <Shell
      {...props}
      spec={spec}
      finish={DEVICE_FINISHES[finish]}
      railAngle={landscape ? 180 : 90}
      buttons={
        landscape
          ? [
              { edge: "top", at: 70, length: 6, depth: 0.7 },
              { edge: "top", at: 79, length: 11, depth: 0.7 },
            ]
          : [
              { edge: "right", at: 14, length: 6, depth: 0.7 },
              { edge: "right", at: 23, length: 11, depth: 0.7 },
            ]
      }
      rimExtras={(k) => {
        // Hinge seams: two hairlines across the rail at each end of the crease.
        const seam = (side: "a" | "b"): React.CSSProperties =>
          landscape
            ? {
                left: "50%",
                width: `${0.45 * k}cqw`,
                height: `${spec.rim * k}cqw`,
                transform: "translateX(-50%)",
                ...(side === "a" ? { top: 0 } : { bottom: 0 }),
              }
            : {
                top: "50%",
                height: `${0.45 * k}cqw`,
                width: `${spec.rim * k}cqw`,
                transform: "translateY(-50%)",
                ...(side === "a" ? { left: 0 } : { right: 0 }),
              };
        return (["a", "b"] as const).map((s) => (
          <span
            key={s}
            aria-hidden
            style={{
              position: "absolute",
              background: "rgba(0,0,0,0.38)",
              boxShadow: "0 0 0.15cqw rgba(255,255,255,0.35)",
              ...seam(s),
            }}
          />
        ));
      }}
      screenExtras={(k) => (
        <>
          {/* Crease: a broad soft dip plus a thin sheen line on the hinge */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              pointerEvents: "none",
              ...(landscape
                ? { top: 0, bottom: 0, left: "50%", width: "12%", transform: "translateX(-50%)" }
                : { left: 0, right: 0, top: "50%", height: "12%", transform: "translateY(-50%)" }),
              background: `linear-gradient(${dir}deg,transparent 0%,rgba(0,0,0,0.05) 40%,rgba(0,0,0,0.08) 50%,rgba(0,0,0,0.05) 60%,transparent 100%)`,
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              pointerEvents: "none",
              ...crease,
              background: `linear-gradient(${dir}deg,transparent 0%,rgba(0,0,0,0.12) 35%,rgba(255,255,255,0.14) 50%,rgba(0,0,0,0.12) 65%,transparent 100%)`,
            }}
          />
          <Lens
            size={`${2.6 * k}cqw`}
            style={{ right: `${3.4 * k}cqw`, top: `${3.4 * k}cqw`, zIndex: 2 }}
          />
        </>
      )}
    />
  );
}

export function FoldableP(props: FrameProps) {
  return <Foldable {...props} landscape={false} />;
}

export function FoldableL(props: FrameProps) {
  return <Foldable {...props} landscape />;
}

// ---------- Apple Watch Ultra ----------

/** Titanium case with a raised rim around flat sapphire, orange Action button, guarded crown. */
export function AppleWatch({ finish = "titanium", ...props }: FrameProps) {
  const spec = SPEC.watch;
  return (
    <Shell
      {...props}
      spec={spec}
      finish={DEVICE_FINISHES[finish]}
      glare={0.12}
      buttons={[
        // Action button (International Orange)
        {
          edge: "left",
          at: 28,
          length: 17,
          depth: 1.6,
          fill: "linear-gradient(180deg,#ff8a4a 0%,#ff5f1f 50%,#d8460f 100%)",
        },
        // Crown guard, crown, side button
        { edge: "right", at: 19, length: 30, depth: 2.2 },
        { edge: "right", at: 26, length: 16, depth: 4.4, ridged: true },
        { edge: "right", at: 56, length: 18, depth: 1.6 },
      ]}
      bezelExtras={(k) => (
        // Raised titanium lip around the sapphire.
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: `${(spec.radius - spec.rim) * k}cqw`,
            boxShadow:
              "inset 0 0 0 0.5cqw rgba(255,255,255,0.12), inset 0 0.8cqw 1.4cqw rgba(0,0,0,0.6)",
            pointerEvents: "none",
          }}
        />
      )}
    />
  );
}

// ---------- Wear OS ----------

/** Round watch (Pixel Watch style): domed glass, crown at 3 o'clock. */
export function WearWatch({ finish = "silver", ...props }: FrameProps) {
  return (
    <Shell
      {...props}
      spec={SPEC.wear}
      finish={DEVICE_FINISHES[finish]}
      screenPosition="center"
      glare={0}
      buttons={[{ edge: "right", at: 42, length: 16, depth: 4.5, ridged: true }]}
      screenExtras={() => (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(120% 80% at 30% 15%,rgba(255,255,255,0.16),transparent 45%), radial-gradient(circle,transparent 70%,rgba(0,0,0,0.35) 100%)",
          }}
        />
      )}
    />
  );
}

// ---------- TV ----------

/** Apple TV / Android TV: slim dark-aluminium panel, even bezel, 16:9 picture. */
export function TvFrame({ finish = "space-black", ...props }: FrameProps) {
  return (
    <Shell
      {...props}
      spec={SPEC.tv}
      finish={DEVICE_FINISHES[finish]}
      railAngle={180}
      screenPosition="center"
      glare={0.06}
    />
  );
}

// ---------- No frame ----------

/** The raw screenshot fills its rect (full-bleed layout). */
export function Bare({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#000",
        containerType: "inline-size",
        ...style,
      }}
    >
      <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} position="center" />
    </div>
  );
}

// ---------- Screen content ----------

// Cover-fit, top-anchored by default.
function ScreenImage({
  resolved,
  alt,
  hideEmpty,
  position = "top",
}: {
  resolved: string;
  alt: string;
  hideEmpty?: boolean;
  position?: "top" | "center";
}) {
  if (resolved) {
    return (
      <img
        src={resolved}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
        }}
        draggable={false}
      />
    );
  }
  return hideEmpty ? null : <EmptySlot />;
}

function EmptySlot() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.45)",
        fontSize: "4cqw",
        fontWeight: 600,
        background:
          "repeating-linear-gradient(135deg,rgba(255,255,255,0.035) 0 2cqw,transparent 2cqw 4cqw), linear-gradient(160deg,#1c1d20 0%,#0a0a0b 100%)",
        textAlign: "center",
        padding: "8%",
      }}
    >
      Drop a screenshot here
    </div>
  );
}
