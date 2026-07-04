import { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/** Themed, calm fallback shown when a subtree throws during render. */
function ErrorFallback({ onReset }: { onReset: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>Something went wrong</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        The app ran into an unexpected problem. Your saved data is safe — you can try again.
      </Text>
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.buttonLabel, { color: colors.accentForeground }]}>Try again</Text>
      </Pressable>
    </View>
  );
}

interface Props {
  children: ReactNode;
  /** Optional custom fallback; receives a reset callback. */
  fallback?: (reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render/lifecycle errors in its subtree and shows a recoverable
 * fallback instead of white-screening the whole app. React has no hook
 * equivalent, so this must stay a class component.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error, info.componentStack);
    }
  }

  private readonly reset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback?.(this.reset) ?? <ErrorFallback onReset={this.reset} />;
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
  },
  button: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
