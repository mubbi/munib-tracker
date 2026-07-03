import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  subtitle?: string;
}

export interface ToastContextValue {
  show: (title: string, options?: { type?: ToastType; subtitle?: string }) => void;
  success: (title: string, subtitle?: string) => void;
  error: (title: string, subtitle?: string) => void;
  info: (title: string, subtitle?: string) => void;
  warning: (title: string, subtitle?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION_MS = 3500;
const TOAST_TOP_WEB = 72;

let counter = 0;
function uid() {
  return `toast-${++counter}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const show = useCallback(
    (title: string, options?: { type?: ToastType; subtitle?: string }) => {
      const id = uid();
      const type: ToastType = options?.type ?? "info";
      const hapticMap: Record<ToastType, Parameters<typeof triggerHaptic>[0]> = {
        success: "success",
        error: "error",
        warning: "warning",
        info: "light",
      };
      triggerHaptic(hapticMap[type]);
      setToasts((prev) => [...prev.slice(-2), { id, type, title, subtitle: options?.subtitle }]);
      timers.current[id] = setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  useEffect(() => {
    return () => {
      for (const timer of Object.values(timers.current)) clearTimeout(timer);
      timers.current = {};
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (title, subtitle) => show(title, { type: "success", subtitle }),
      error: (title, subtitle) => show(title, { type: "error", subtitle }),
      info: (title, subtitle) => show(title, { type: "info", subtitle }),
      warning: (title, subtitle) => show(title, { type: "warning", subtitle }),
    }),
    [show],
  );

  const topOffset = Platform.OS === "web" ? TOAST_TOP_WEB : insets.top + 8;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 ? (
        <View style={[styles.container, { top: topOffset }]} pointerEvents="box-none">
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
          ))}
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { colors, tokens } = useThemeTokens();
  const statusKey = item.type === "error" ? "danger" : item.type;
  const palette = tokens.status[statusKey];

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOut.duration(160)}
      style={[
        styles.toast,
        {
          backgroundColor: colors.card,
          borderColor: tokens.hairline,
          borderLeftColor: palette.color,
        },
      ]}
    >
      <View style={styles.textWrap}>
        <ThemedText type="smallBold">{item.title}</ThemedText>
        {item.subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {item.subtitle}
          </ThemedText>
        ) : null}
      </View>
      <PressableScale onPress={onDismiss} accessibilityLabel="Dismiss">
        <ThemedText type="caption" themeColor="mutedForeground">
          ✕
        </ThemedText>
      </PressableScale>
    </Animated.View>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    zIndex: 10002,
    elevation: 10002,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
});
