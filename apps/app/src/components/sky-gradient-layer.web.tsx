import type { CSSProperties, ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

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

function MotionShell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={className} style={absoluteFill}>
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
  const gradientLayer = <View style={[styles.fill, gradient]} />;

  if (webMotionClassInner) {
    return (
      <MotionShell className={webMotionClass}>
        <MotionShell className={webMotionClassInner}>{gradientLayer}</MotionShell>
      </MotionShell>
    );
  }

  return <MotionShell className={webMotionClass}>{gradientLayer}</MotionShell>;
}

const styles = StyleSheet.create({
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
