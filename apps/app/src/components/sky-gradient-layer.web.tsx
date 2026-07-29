import type { CSSProperties, ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

/** Gradient layers are drawn larger than the hero so drift transforms reveal shifting colour. */
const GRADIENT_OVERSCAN = 1.4;

type SkyGradientLayerProps = {
  gradient: ViewStyle;
  motionStyle?: ViewStyle;
  webMotionClass?: string;
  webMotionClassInner?: string;
};

const absoluteFill: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const overscanInset = `${((1 - GRADIENT_OVERSCAN) / 2) * 100}%`;

const overscanStyle: CSSProperties = {
  position: "absolute",
  width: `${GRADIENT_OVERSCAN * 100}%`,
  height: `${GRADIENT_OVERSCAN * 100}%`,
  left: overscanInset,
  top: overscanInset,
};

function MotionShell({
  className,
  children,
  clip = false,
  fill = false,
  style,
}: {
  className?: string;
  children: ReactNode;
  clip?: boolean;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        ...(fill ? absoluteFill : null),
        overflow: clip ? "hidden" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Web hero sky layer — CSS keyframes on plain DOM shells because Reanimated
 * transforms do not reliably animate RN Web views that carry `backgroundImage`.
 */
export function SkyGradientLayer({
  gradient,
  webMotionClass,
  webMotionClassInner,
}: SkyGradientLayerProps) {
  const gradientLayer = <View style={[styles.overscanFill, gradient]} />;

  if (webMotionClassInner) {
    return (
      <MotionShell clip fill>
        <MotionShell className={webMotionClass} style={overscanStyle}>
          <MotionShell className={webMotionClassInner} fill>
            {gradientLayer}
          </MotionShell>
        </MotionShell>
      </MotionShell>
    );
  }

  return (
    <MotionShell clip fill>
      <MotionShell className={webMotionClass} style={overscanStyle}>
        {gradientLayer}
      </MotionShell>
    </MotionShell>
  );
}

const styles = StyleSheet.create({
  overscanFill: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
