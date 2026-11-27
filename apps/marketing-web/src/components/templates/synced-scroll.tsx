"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * A wide table whose column headers stay visible while the page scrolls.
 *
 * `position: sticky` can't escape a horizontal-scroll box, so the headers
 * render in their own bar (`header`, sticky below the site header) and the
 * body scrolls sideways in `children`. This island only mirrors the body's
 * horizontal scroll onto the header bar; without JS the bar still sticks.
 * Both parts must use the same fixed column widths.
 */
export function SyncedScroll({
  header,
  children,
  className,
}: {
  header: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const head = headerRef.current;
    if (!body || !head) return;
    const sync = () => {
      head.scrollLeft = body.scrollLeft;
    };
    sync();
    body.addEventListener("scroll", sync, { passive: true });
    return () => body.removeEventListener("scroll", sync);
  }, []);

  return (
    <div className={className}>
      <div
        ref={headerRef}
        aria-hidden
        className="sticky top-20 z-20 overflow-hidden rounded-t-2xl border-b border-white/10 bg-[#0b1b28] shadow-[0_12px_24px_-16px_rgba(0,0,0,0.9)]"
      >
        {header}
      </div>
      <div ref={bodyRef} className="overflow-x-auto rounded-b-2xl">
        {children}
      </div>
    </div>
  );
}
