import type { TasbeehDesignId } from "@munib-tracker/shared/types";
import { type ComponentType, lazy, Suspense } from "react";
import { View } from "react-native";

import { RingFace } from "./ring-face";
import type { TasbeehFaceProps } from "./types";

// Ring renders eagerly (default, D10). Every other face is a dynamic import so
// the bead / SVG code stays out of the web `__common` chunk (docs/PROFILING.md).
const LAZY_FACES: Partial<Record<TasbeehDesignId, ComponentType<TasbeehFaceProps>>> = {
  misbaha: lazy(() => import("./misbaha-face")),
  clicker: lazy(() => import("./clicker-face")),
  minimal: lazy(() => import("./minimal-face")),
  pebbles: lazy(() => import("./pebbles-face")),
  fingers: lazy(() => import("./fingers-face")),
  geometric: lazy(() => import("./geometric-face")),
  stars: lazy(() => import("./stars-face")),
};

/** Renders the face for a design; unknown or unshipped designs fall back to Ring. */
export function TasbeehFace(props: TasbeehFaceProps) {
  const design = props.appearance.design;
  const Face = design === "ring" ? undefined : LAZY_FACES[design];
  if (!Face) return <RingFace {...props} />;
  return (
    <Suspense fallback={<View style={{ width: props.size, height: props.size }} />}>
      <Face {...props} />
    </Suspense>
  );
}
