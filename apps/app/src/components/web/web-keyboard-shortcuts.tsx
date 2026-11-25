import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { isTypingTarget } from "@/lib/web/is-typing-target";
import { isChromelessRoute } from "@/lib/web/nav-section";

/**
 * Desktop web affordances, mounted once in the root overlays:
 *
 * - `/` or `Ctrl/⌘ + K` opens universal search (not while typing, not on
 *   first-run / auth routes).
 *
 * Renders nothing; no-op on native.
 */
export function WebKeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    if (isChromelessRoute(pathname)) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey) return;
      const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !event.metaKey && !event.ctrlKey;
      if (!commandK && !slash) return;
      // Ctrl/⌘+K works from inside fields too (like most apps); "/" must not
      // hijack typing a slash.
      if (slash && isTypingTarget(event.target)) return;
      if (pathname === "/search") return;
      event.preventDefault();
      router.push("/search");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router]);

  return null;
}
