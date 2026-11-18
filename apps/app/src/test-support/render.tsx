import {
  type RenderHookOptions,
  type RenderOptions,
  render,
  renderHook,
} from "@testing-library/react-native";
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

/** Theme-only wrapper — enough for most leaf components that call `useTheme()`. */
export function ThemeWrapper({ children }: { children: ReactNode }) {
  return <MunibThemeProvider>{children}</MunibThemeProvider>;
}

/**
 * Renders a screen/component inside the real app providers (theme, etc.) so
 * feature tests exercise the same context the app uses. Mirrors Testing
 * Library's `render` signature.
 */
export async function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return await render(ui, { wrapper: TestProviders, ...options });
}

/**
 * Renders a component inside `MunibThemeProvider` only. Prefer this over
 * `renderWithProviders` for unit tests — it is faster and keeps the test's
 * dependency surface explicit.
 */
export async function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return await render(ui, { wrapper: ThemeWrapper, ...options });
}

/** `renderHook` with the theme provider mounted (for hooks that call `useTheme()`). */
export async function renderHookWithTheme<Result, Props>(
  hook: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper">,
) {
  return await renderHook(hook, { wrapper: ThemeWrapper, ...options });
}
