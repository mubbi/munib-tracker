import type { TasbeehBeadShape } from "@munib-tracker/shared/types";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Line, Polygon, RadialGradient, Stop } from "react-native-svg";
import { BorderWidth } from "@/constants/theme";
import { gradientBackground } from "@/lib/gradient";
import { beadGradient, type MaterialRecipe } from "@/lib/tasbeeh/materials";

/** Width / height factors per shape (height runs along the thread). */
export function beadBox(shape: TasbeehBeadShape, size: number): { width: number; height: number } {
  switch (shape) {
    case "olive":
      return { width: size * 0.82, height: size * 1.22 };
    case "cylinder":
      return { width: size * 0.86, height: size * 1.08 };
    case "rondelle":
      return { width: size * 1.14, height: size * 0.62 };
    default:
      return { width: size, height: size };
  }
}

type BeadProps = {
  shape: TasbeehBeadShape;
  recipe: MaterialRecipe;
  size: number;
  /** Silhouette outline (contrasts with the theme surface). */
  edge: string;
};

/**
 * One procedurally shaded bead. Round, olive, cylinder and rondelle are views
 * with a radial-gradient body; faceted is an SVG octagon with facet lines.
 */
export const Bead = memo(function Bead({ shape, recipe, size, edge }: BeadProps) {
  const { width, height } = beadBox(shape, size);
  if (shape === "faceted") {
    return <FacetedBead recipe={recipe} size={size} edge={edge} />;
  }
  const radius =
    shape === "cylinder"
      ? size * 0.22
      : shape === "rondelle"
        ? height / 2
        : Math.min(width, height) / 2;
  return (
    <View
      style={[
        styles.bead,
        {
          width,
          height,
          borderRadius: shape === "round" ? size / 2 : radius,
          borderColor: edge,
          backgroundColor: recipe.base,
        },
        gradientBackground(beadGradient(recipe)),
      ]}
    >
      {recipe.grain ? (
        <View
          style={[
            styles.grain,
            { borderRadius: radius, borderColor: recipe.shadow, opacity: 0.22 },
          ]}
        />
      ) : null}
    </View>
  );
});

function FacetedBead({
  recipe,
  size,
  edge,
}: {
  recipe: MaterialRecipe;
  size: number;
  edge: string;
}) {
  const r = size / 2;
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = Math.PI / 8 + (i * Math.PI) / 4;
    points.push(`${(r + r * Math.cos(angle)).toFixed(2)},${(r + r * Math.sin(angle)).toFixed(2)}`);
  }
  const inner = r * 0.45;
  const opacity = 1 - recipe.translucency * 0.6;
  // Unique per recipe: web shares one document-wide SVG id namespace.
  const id = `facet-${recipe.base.replace("#", "")}-${recipe.shadow.replace("#", "")}`;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={id} cx="34%" cy="30%" r="75%">
          <Stop offset="0" stopColor={recipe.highlight} stopOpacity={Math.min(1, opacity + 0.2)} />
          <Stop offset="0.45" stopColor={recipe.base} stopOpacity={opacity} />
          <Stop offset="1" stopColor={recipe.shadow} stopOpacity={Math.min(1, opacity + 0.15)} />
        </RadialGradient>
      </Defs>
      <Polygon points={points.join(" ")} fill={`url(#${id})`} stroke={edge} strokeWidth={0.75} />
      {[0, 1, 2, 3].map((i) => {
        const angle = Math.PI / 8 + (i * Math.PI) / 2;
        return (
          <Line
            key={i}
            x1={r + inner * Math.cos(angle)}
            y1={r + inner * Math.sin(angle)}
            x2={r + r * Math.cos(angle)}
            y2={r + r * Math.sin(angle)}
            stroke={recipe.highlight}
            strokeOpacity={0.35}
            strokeWidth={0.6}
          />
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  bead: {
    borderWidth: BorderWidth.hairline,
    overflow: "hidden",
  },
  grain: {
    ...StyleSheet.absoluteFill,
    borderWidth: BorderWidth.thin,
    transform: [{ scaleX: 0.55 }],
  },
});
