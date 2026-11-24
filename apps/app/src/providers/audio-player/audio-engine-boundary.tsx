import { Component, type ErrorInfo, type ReactNode } from "react";

/** Isolates expo-audio engine failures so the app tree keeps a working context shell. */
export class AudioEngineBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error("[AudioPlayerProvider] Engine failed to start:", error, info.componentStack);
    }
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}
