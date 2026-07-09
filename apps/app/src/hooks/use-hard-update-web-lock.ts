import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * Web-only: lock document scroll and reduce focus escape while hard update blocks the app.
 */
export function useHardUpdateWebLock(active: boolean): void {
  useEffect(() => {
    if (!active || Platform.OS !== "web" || typeof document === "undefined") return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const trapTab = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const host = document.getElementById("hard-update-block-root");
        if (host && !host.contains(document.activeElement)) {
          event.preventDefault();
          const focusable = host.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          focusable?.focus();
        }
      }
    };

    document.addEventListener("keydown", trapTab, true);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      document.removeEventListener("keydown", trapTab, true);
    };
  }, [active]);
}
