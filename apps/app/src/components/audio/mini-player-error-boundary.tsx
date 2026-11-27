import { Component, type ErrorInfo, type ReactNode } from "react";

import { recordReviewErrorMarker } from "@/features/reviews/lib/reviewEngagementBridge";
import { captureAppException } from "@/lib/sentry";

type Props = {
  children: ReactNode;
  /**
   * Changes whenever a new queue / track takes over (e.g. the current track id).
   * A crashed player gets another chance on the next queue instead of staying
   * hidden for the rest of the session.
   */
  resetKey?: string | null;
  /** Called once per caught error — the root layout stops playback so nothing plays unseen. */
  onError?: () => void;
};

type State = { failedKey: string | null | undefined; failed: boolean };

/**
 * Isolates the global mini-player (an overlay above every screen, outside the
 * per-screen `ScreenErrorBoundary`). Without it a render error in the player —
 * compact bar, expanded sheet, voice / playback controls — would bubble to the
 * root `Sentry.GlobalErrorBoundary` and replace the whole app with "Something
 * went wrong". Here the player just disappears, the error is reported, and the
 * app keeps working.
 */
export class MiniPlayerErrorBoundary extends Component<Props, State> {
  state: State = { failedKey: undefined, failed: false };

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    // A new track / queue after the failure: try rendering the player again.
    if (state.failed && state.failedKey !== undefined && props.resetKey !== state.failedKey) {
      return { failed: false, failedKey: undefined };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ failedKey: this.props.resetKey ?? null });
    recordReviewErrorMarker("session");
    captureAppException(error, {
      tags: { area: "audio", phase: "mini-player" },
      contexts: { react: { componentStack: info.componentStack ?? "" } },
    });
    if (__DEV__) {
      console.error("[MiniPlayer] crashed; hidden instead of the app:", error, info.componentStack);
    }
    try {
      this.props.onError?.();
    } catch {
      // Stopping playback is best effort.
    }
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}
