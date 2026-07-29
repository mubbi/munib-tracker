import { StyleSheet, View } from "react-native";

import { moonIconGeometry, moonPhase } from "@/lib/moon";

type MoonPhaseIconProps = {
  /** Instant to render the moon for. */
  date: Date;
  /** Diameter of the disc. */
  size?: number;
  /** Illuminated surface colour. */
  litColor?: string;
  /** Shadowed surface colour (also the "new moon" disc). */
  shadowColor?: string;
  /** Mirror the lit side for observers south of the equator. */
  southernHemisphere?: boolean;
  accessibilityLabel?: string;
};

/**
 * The moon's current shape, drawn entirely with Views — no SVG or native dep,
 * so it renders identically on iOS/Android/Web. A dark base disc carries a lit
 * hemisphere; a horizontally-scaled circle forms the elliptical terminator,
 * which reproduces every phase from thin crescent through full.
 */
export function MoonPhaseIcon({
  date,
  size = 18,
  litColor = "#F4E9C8",
  shadowColor = "#324C74",
  southernHemisphere = false,
  accessibilityLabel,
}: MoonPhaseIconProps) {
  const { fraction, waxing } = moonPhase(date);
  const { litOnRight, isCrescent, terminatorScaleX } = moonIconGeometry(
    fraction,
    waxing,
    southernHemisphere,
  );

  return (
    <View
      accessible={accessibilityLabel != null}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.disc,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: shadowColor },
      ]}
    >
      {/* The base lit hemisphere: right when waxing (north), left when waning. */}
      <View
        style={[
          styles.half,
          { width: size / 2, backgroundColor: litColor },
          litOnRight ? styles.right : styles.left,
        ]}
      />
      {/* Elliptical terminator: dark carves a crescent, lit fills a gibbous. */}
      <View
        style={[
          styles.terminator,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isCrescent ? shadowColor : litColor,
            transform: [{ scaleX: terminatorScaleX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    overflow: "hidden",
  },
  half: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  left: { left: 0 },
  right: { right: 0 },
  terminator: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
