import { type RenderOptions, render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import messages from "@/messages/en";

/** Wraps children in the English catalog, as the `[locale]` layout does. */
export function IntlWrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * `render()` with next-intl context. Components that call `useTranslations`
 * (server or client) need it; async components that call `getTranslations`
 * can't be rendered by Testing Library — keep those to pages/metadata.
 */
export function renderWithIntl(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: IntlWrapper, ...options });
}
