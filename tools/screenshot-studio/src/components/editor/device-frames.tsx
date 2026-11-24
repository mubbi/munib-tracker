"use client";
import type * as React from "react";
import { PHONE_SCREEN } from "@/lib/constants";
import { img } from "@/lib/image-cache";

type FrameProps = {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  /** When true, hide EmptySlot placeholder (so it doesn't bake into exports). */
  hideEmpty?: boolean;
};

/** Shared dark bezel for the Android / foldable frames. */
const BEZEL_BG = "linear-gradient(160deg, #2a2a2e 0%, #18181b 100%)";

// iPhone — uses pre-measured mockup.png overlay
export function Phone({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "1022 / 2082", ...style }}>
      <img
        src={img("/mockup.png")}
        alt=""
        style={{ display: "block", width: "100%", height: "100%" }}
        draggable={false}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          overflow: "hidden",
          left: `${PHONE_SCREEN.L}%`,
          top: `${PHONE_SCREEN.T}%`,
          width: `${PHONE_SCREEN.W}%`,
          height: `${PHONE_SCREEN.H}%`,
          borderRadius: `${PHONE_SCREEN.RX}% / ${PHONE_SCREEN.RY}%`,
          background: "#111",
        }}
      >
        <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} />
      </div>
    </div>
  );
}

export function AndroidPhone({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "9 / 19.5", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8% / 4%",
          background: BEZEL_BG,
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.1), 0 12px 48px rgba(0,0,0,0.45), 0 4px 16px rgba(11,42,34,0.35)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1.5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "3%",
            height: "1.4%",
            borderRadius: "50%",
            background: "#0d0d0f",
            border: "1px solid rgba(255,255,255,0.06)",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "3.5%",
            top: "2%",
            width: "93%",
            height: "96%",
            borderRadius: "5.5% / 2.6%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} />
        </div>
      </div>
    </div>
  );
}

export function AndroidTabletP({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "5 / 8", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "4.5% / 2.8%",
          background: BEZEL_BG,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 8px 48px rgba(0,0,0,0.6)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1.2%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "1.4%",
            height: "0.88%",
            borderRadius: "50%",
            background: "#0d0d0f",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "3.5%",
            top: "2.2%",
            width: "93%",
            height: "95.6%",
            borderRadius: "2.5% / 1.6%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} />
        </div>
      </div>
    </div>
  );
}

export function AndroidTabletL({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "8 / 5", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "2.8% / 4.5%",
          background: BEZEL_BG,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 8px 48px rgba(0,0,0,0.6)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "1.2%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "0.88%",
            height: "1.4%",
            borderRadius: "50%",
            background: "#0d0d0f",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "2.2%",
            top: "3.5%",
            width: "95.6%",
            height: "93%",
            borderRadius: "1.6% / 2.5%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} />
        </div>
      </div>
    </div>
  );
}

export function IPad({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "770 / 1000", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "5% / 3.6%",
          background: "linear-gradient(180deg, #2C2C2E 0%, #1C1C1E 100%)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1.2%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "0.9%",
            height: "0.65%",
            borderRadius: "50%",
            background: "#111113",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "4%",
            top: "2.8%",
            width: "92%",
            height: "94.4%",
            borderRadius: "2.2% / 1.6%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} />
        </div>
      </div>
    </div>
  );
}

// Screen content shared by every frame (cover-fit, top-anchored by default).
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

// iPhone Duo (foldable, unfolded). Portrait shows a vertical hinge crease.
function Foldable({
  src,
  alt = "",
  style,
  hideEmpty,
  landscape,
}: FrameProps & { landscape: boolean }) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: landscape ? "25 / 18" : "18 / 25", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: landscape ? "4.6% / 6.4%" : "6.4% / 4.6%",
          background: BEZEL_BG,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 10px 48px rgba(0,0,0,0.55)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: landscape ? "2.6%" : "3.6%",
            top: landscape ? "3.6%" : "2.6%",
            width: landscape ? "94.8%" : "92.8%",
            height: landscape ? "92.8%" : "94.8%",
            borderRadius: landscape ? "3% / 4.2%" : "4.2% / 3%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} />
          <div
            aria-hidden
            style={{
              position: "absolute",
              ...(landscape
                ? { left: 0, right: 0, top: "50%", height: "1.2%", transform: "translateY(-50%)" }
                : { top: 0, bottom: 0, left: "50%", width: "1.2%", transform: "translateX(-50%)" }),
              background: landscape
                ? "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.16) 50%, rgba(0,0,0,0) 100%)"
                : "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.16) 50%, rgba(0,0,0,0) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function FoldableP(props: FrameProps) {
  return <Foldable {...props} landscape={false} />;
}

export function FoldableL(props: FrameProps) {
  return <Foldable {...props} landscape />;
}

// Apple Watch Ultra — rounded titanium case with the digital crown on the right.
export function AppleWatch({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "41 / 50", ...style }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-3.5%",
          top: "28%",
          width: "5%",
          height: "18%",
          borderRadius: "30%",
          background: "linear-gradient(90deg, #6b6b70 0%, #3a3a3e 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "24% / 20%",
          background: "linear-gradient(160deg, #8e8e93 0%, #48484c 45%, #2c2c2e 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18), 0 10px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "7%",
            top: "6%",
            width: "86%",
            height: "88%",
            borderRadius: "19% / 16%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} />
        </div>
      </div>
    </div>
  );
}

// Wear OS — round case with a circular display.
export function WearWatch({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "1 / 1", ...style }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-3%",
          top: "42%",
          width: "5%",
          height: "16%",
          borderRadius: "30%",
          background: "linear-gradient(90deg, #5a5a5f 0%, #2e2e32 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "linear-gradient(160deg, #3a3a3e 0%, #18181b 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14), 0 10px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "7%",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} position="center" />
        </div>
      </div>
    </div>
  );
}

// Apple TV / Android TV — thin-bezel 16:9 panel.
export function TvFrame({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", aspectRatio: "1.75 / 1", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "1.2% / 2.1%",
          background: "linear-gradient(180deg, #232326 0%, #111113 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 16px 60px rgba(0,0,0,0.55)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "1.1%",
            top: "1.9%",
            width: "97.8%",
            height: "96.2%",
            borderRadius: "0.4% / 0.7%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} position="center" />
        </div>
      </div>
    </div>
  );
}

// No frame — the raw screenshot fills its rect (full-bleed layout).
export function Bare({ src, alt = "", style, hideEmpty }: FrameProps) {
  const resolved = img(src);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#000", ...style }}>
      <ScreenImage resolved={resolved} alt={alt} hideEmpty={hideEmpty} position="center" />
    </div>
  );
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
        color: "rgba(255,255,255,0.4)",
        fontSize: "min(2vw, 14px)",
        background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
        textAlign: "center",
        padding: "4%",
      }}
    >
      Drop a screenshot here
    </div>
  );
}
