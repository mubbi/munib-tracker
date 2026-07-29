import Svg, { Circle, Ellipse, G } from "react-native-svg";
import {
  CLOUD_HEIGHT_RATIO,
  type CloudPartSpec,
  type CloudVariant,
  cloudPartColor,
} from "@/components/weather/cloud-shape";

type CloudGraphicProps = {
  width: number;
  height: number;
  baseWidth: number;
  parts: CloudPartSpec[];
  variant: CloudVariant;
  offsetX: number;
  offsetY: number;
};

/**
 * Single SVG cumulus — overlapping circles/ellipses in one layer merge into a
 * cohesive cloud silhouette on native (unlike separate RN Views).
 */
export function CloudGraphic({
  width,
  height,
  baseWidth,
  parts,
  variant,
  offsetX,
  offsetY,
}: CloudGraphicProps) {
  const baseHeight = baseWidth * CLOUD_HEIGHT_RATIO;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G x={offsetX} y={offsetY}>
        {parts.map((part, index) => {
          const cx = baseWidth * part.cx;
          const cy = baseHeight * part.cy;
          const { fill, opacity } = cloudPartColor(variant, part.shade);

          if (part.kind === "ellipse") {
            const ry = baseWidth * part.r;
            const rx = ry * (part.rxScale ?? 1.5);
            return (
              <Ellipse
                key={`part-${index}`}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={fill}
                opacity={opacity}
              />
            );
          }

          const r = baseWidth * part.r;
          return (
            <Circle key={`part-${index}`} cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />
          );
        })}
      </G>
    </Svg>
  );
}
