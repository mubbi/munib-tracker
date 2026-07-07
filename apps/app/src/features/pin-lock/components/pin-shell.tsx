import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useCallback, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { PinDotsRow } from "@/features/pin-lock/components/pin-keypad";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type Props = {
  title: string;
  subtitle: string;
  filledCount?: number;
  dotsLoading?: boolean;
  dotsError?: boolean;
  errorMessage?: string | null;
  shakeTrigger?: string | null;
  onClose?: () => void;
  closeDisabled?: boolean;
  footer?: ReactNode;
  keypad?: ReactNode;
  successBody?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  presentation?: "lock" | "modal";
};

export function PinShell({
  title,
  subtitle,
  filledCount = 0,
  dotsLoading = false,
  dotsError = false,
  errorMessage = null,
  shakeTrigger = null,
  onClose,
  closeDisabled = false,
  footer,
  keypad,
  successBody,
  contentStyle,
  presentation = "modal",
}: Props) {
  const { colors, scheme, tokens } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const triggerShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }, [shakeX]);

  useEffect(() => {
    if (shakeTrigger) triggerShake();
  }, [shakeTrigger, triggerShake]);

  const topPadding = insets.top + (presentation === "lock" ? Spacing.six : Spacing.four);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BlurView
        intensity={60}
        tint={scheme === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.contentLayer}
        behavior={Platform.OS === "ios" || Platform.OS === "android" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "android" ? insets.top : 0}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: topPadding,
              paddingBottom: Math.max(insets.bottom, Spacing.four),
            },
            contentStyle,
          ]}
        >
          {onClose ? (
            <View style={styles.closeRow}>
              <PressableScale
                onPress={onClose}
                hitSlop={12}
                disabled={closeDisabled}
                haptic="selection"
                scaleTo={0.9}
                style={[styles.closeBtn, { opacity: closeDisabled ? 0.4 : 1 }]}
                accessibilityLabel="Close"
              >
                <SymbolView
                  name={{ ios: "xmark", android: "close", web: "close" }}
                  size={22}
                  tintColor={colors.foreground}
                />
              </PressableScale>
            </View>
          ) : null}

          {successBody ? (
            <View style={styles.successBody}>
              <ThemedText type="title">{title}</ThemedText>
              {successBody}
            </View>
          ) : (
            <>
              <View style={styles.topSection}>
                <View style={[styles.headerBadge, { backgroundColor: tokens.accentSoft }]}>
                  <SymbolView
                    name={{ ios: "lock.fill", android: "lock", web: "lock" }}
                    size={20}
                    tintColor={colors.accent}
                  />
                </View>
                <ThemedText type="title" style={styles.title}>
                  {title}
                </ThemedText>
                {subtitle ? (
                  <ThemedText type="small" themeColor="mutedForeground" style={styles.subtitle}>
                    {subtitle}
                  </ThemedText>
                ) : null}

                <Animated.View style={[styles.pinBlock, shakeStyle]}>
                  <PinDotsRow
                    filledCount={filledCount}
                    isLoading={dotsLoading}
                    hasError={dotsError}
                  />
                  <View style={styles.errorSlot}>
                    {errorMessage ? (
                      <ThemedText
                        type="caption"
                        style={{ color: tokens.status.danger.color, textAlign: "center" }}
                        accessibilityLiveRegion="polite"
                      >
                        {errorMessage}
                      </ThemedText>
                    ) : null}
                  </View>
                </Animated.View>

                {footer ? <View style={styles.footerSlot}>{footer}</View> : null}
              </View>

              {keypad ? <View style={styles.keypadSection}>{keypad}</View> : null}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentLayer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  closeRow: {
    alignItems: "flex-end",
    marginBottom: Spacing.two,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.pill,
  },
  topSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  headerBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.three,
  },
  pinBlock: {
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 56,
  },
  errorSlot: {
    minHeight: 20,
    justifyContent: "center",
  },
  footerSlot: {
    marginTop: Spacing.three,
  },
  keypadSection: {
    paddingBottom: Spacing.three,
  },
  successBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.four,
  },
});
