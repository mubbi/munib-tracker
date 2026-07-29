import { type RenderOptions, render } from "@testing-library/react-native";
import type { ReactElement, ReactNode } from "react";
import { AppProviders } from "@/providers/app-providers";
import { InAppNotificationsProvider } from "@/providers/in-app-notifications-provider";
import { MunibThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

/** Wraps children in the app-wide providers screens rely on at runtime. */
function TestProviders({ children }: { children: ReactNode }) {
  return (
    <MunibThemeProvider>
      <AppProviders>
        <ToastProvider>
          <InAppNotificationsProvider>{children}</InAppNotificationsProvider>
        </ToastProvider>
      </AppProviders>
    </MunibThemeProvider>
  );
}

/**
 * Renders a screen/component inside the real app providers (theme, etc.) so
 * feature tests exercise the same context the app uses. Mirrors Testing
 * Library's `render` signature.
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: TestProviders, ...options });
}
