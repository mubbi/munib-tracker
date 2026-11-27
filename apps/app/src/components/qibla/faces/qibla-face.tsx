import { type ComponentType, lazy, Suspense } from "react";
import { View } from "react-native";

import { ClassicFace } from "./classic-face";
import type { QiblaCompassStyleId, QiblaFaceProps } from "./types";

// Classic renders eagerly (the default). Every other face is a dynamic import so
// its SVG artwork stays out of the web `__common` chunk (docs/PROFILING.md).
const LAZY_FACES: Partial<Record<QiblaCompassStyleId, ComponentType<QiblaFaceProps>>> = {
  minimal: lazy(() => import("./minimal-face")),
  mariner: lazy(() => import("./mariner-face")),
  precision: lazy(() => import("./precision-face")),
  astrolabe: lazy(() => import("./astrolabe-face")),
  mihrab: lazy(() => import("./mihrab-face")),
  radar: lazy(() => import("./radar-face")),
  night: lazy(() => import("./night-face")),
  arrow: lazy(() => import("./arrow-face")),
};

/** Renders the compass face for a style; unknown styles fall back to Classic. */
export function QiblaFace({ style, ...props }: QiblaFaceProps & { style: QiblaCompassStyleId }) {
  const Face = style === "classic" ? undefined : LAZY_FACES[style];
  if (!Face) return <ClassicFace {...props} />;
  return (
    <Suspense fallback={<View style={{ width: props.size, height: props.size }} />}>
      <Face {...props} />
    </Suspense>
  );
}
