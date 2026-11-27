import { Component, type ErrorInfo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { recordReviewErrorMarker } from "@/features/reviews/lib/reviewEngagementBridge";
import { useTheme } from "@/hooks/use-theme";
import { captureAppException } from "@/lib/sentry";

/** Themed, calm fallback shown when a subtree throws during render. */
export function ErrorFallback({ onReset }: { onReset: () => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ThemedText type="title" heading={2} style={styles.centered}>
        {t("errors.title")}
      </ThemedText>
      <ThemedText themeColor="mutedForeground" style={[styles.centered, styles.body]}>
        {t("errors.body")}
      </ThemedText>
      <Button label={t("common.tryAgain")} onPress={onReset} preferredFocus style={styles.button} />
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
    recordReviewErrorMarker();
    captureAppException(error, {
      contexts: {
        react: {
          componentStack: info.componentStack ?? "",
        },
      },
    });
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
  centered: {
    textAlign: "center",
  },
  body: {
    maxWidth: 360,
  },
  button: {
    marginTop: Spacing.two,
  },
});
