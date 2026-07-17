import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { type ImageStyle, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isPdfMime } from "@/lib/attachments/attachment-mime";

/** Soft pulsing fill for attachment thumbs while remote/local media resolves. */
function AttachmentThumbPulse({ style, color }: { style?: StyleProp<ViewStyle>; color?: string }) {
  const { tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(reducedMotion ? 0.5 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [reducedMotion, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + pulse.value * 0.35,
  }));

  return (
    <Animated.View
      style={[
        styles.pulse,
        { backgroundColor: color ?? tokens.track, pointerEvents: "none" },
        animatedStyle,
        style,
      ]}
    />
  );
}

type AttachmentThumbProps = {
  uri: string;
  mimeType: string;
  headers?: Record<string, string>;
  /** Icon size for PDF placeholders. */
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  contentFit?: "cover" | "contain";
};

/**
 * Attachment thumbnail with a serene pulse until the image (or PDF icon) is ready.
 */
export function AttachmentThumb({
  uri,
  mimeType,
  headers,
  iconSize = 26,
  style,
  imageStyle,
  contentFit = "cover",
}: AttachmentThumbProps) {
  const { colors } = useThemeTokens();
  const pdf = isPdfMime(mimeType);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, []);

  return (
    <View style={[styles.root, style]}>
      {!ready ? <AttachmentThumbPulse style={StyleSheet.absoluteFill} /> : null}

      {pdf ? (
        <View
          style={[styles.pdf, !ready ? styles.hiddenContent : null]}
          onLayout={() => setReady(true)}
        >
          <SymbolView
            name={{ ios: "doc.richtext", android: "picture_as_pdf", web: "picture_as_pdf" }}
            size={iconSize}
            tintColor={colors.accent}
          />
        </View>
      ) : (
        <Image
          source={{ uri, headers }}
          style={[styles.image, imageStyle, !ready ? styles.hiddenContent : null]}
          contentFit={contentFit}
          transition={180}
          onLoad={() => setReady(true)}
          onError={() => setReady(true)}
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
}

/**
 * Full-bleed loader for the image viewer stage (same pulse language as thumbs).
 */
export function AttachmentMediaLoader({
  style,
  onDark = false,
}: {
  style?: StyleProp<ViewStyle>;
  /** Lighter pulse for near-black viewer backdrops. */
  onDark?: boolean;
}) {
  return (
    <View style={[styles.root, style]}>
      <AttachmentThumbPulse
        style={StyleSheet.absoluteFill}
        color={onDark ? "rgba(255,255,255,0.16)" : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  pulse: {
    borderCurve: "continuous",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pdf: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenContent: {
    opacity: 0,
  },
});
