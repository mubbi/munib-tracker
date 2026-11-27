"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { trackNavClick } from "@/lib/analytics";

/** Show the button once the visitor is this many viewport heights down. */
const SHOW_AFTER_VIEWPORTS = 1.5;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * "Back to top": a small round button in the bottom inline-end corner (mirrors
 * in RTL; the cookie card sits in the start corner). Appears after scrolling
 * about a screen and a half, scrolls smoothly back (instantly with reduced
 * motion), then moves keyboard focus to the start of the content (the skip
 * link target), so keyboard users continue from the top. Scroll checks are passive and rAF-throttled.
 */
export function BackToTop() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setVisible(window.scrollY > window.innerHeight * SHOW_AFTER_VIEWPORTS);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const backToTop = () => {
    trackNavClick("back_to_top", pathname);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    // Focus the start of the page without jumping the scroll a second time.
    const start = document.getElementById("main-content");
    if (start) {
      if (!start.hasAttribute("tabindex")) start.setAttribute("tabindex", "-1");
      start.focus({ preventScroll: true });
    }
  };

  return (
    <button
      type="button"
      onClick={backToTop}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      className="consent-in fixed bottom-5 end-4 z-30 flex size-11 items-center justify-center rounded-full border border-white/15 bg-[#0d2233]/90 text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#07141f] sm:bottom-6 sm:end-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <ArrowUp aria-hidden className="size-5" />
    </button>
  );
}
