import { type RenderOptions, render } from "@testing-library/react-native";
import type { ReactElement, ReactNode } from "react";

import { MunibThemeProvider } from "@/providers/theme-provider";

/** Wraps children in the app-wide providers screens rely on at runtime. */
function AppProviders({ children }: { children: ReactNode }) {
  return <MunibThemeProvider>{children}</MunibThemeProvider>;
}

/**
 * Renders a screen/component inside the real app providers (theme, etc.) so
 * feature tests exercise the same context the app uses. Mirrors Testing
 * Library's `render` signature.
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: AppProviders, ...options });
}
