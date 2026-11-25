"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { LOCALE_META } from "@/i18n/locales";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALES } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  /** `menu`: a compact button + popover (header, footer). `list`: every language inline (mobile drawer). */
  variant?: "menu" | "list";
  /** Which way the `menu` popover opens. */
  direction?: "down" | "up";
  /** Which edge of the button the `menu` popover lines up with. */
  align?: "start" | "end";
  className?: string;
  /** Called after a language is picked (e.g. to close the mobile drawer). */
  onNavigate?: () => void;
};

/**
 * Language picker: links to the current page in every published locale.
 * Scales from one locale (English, selected) to the full list — the popover
 * scrolls once it outgrows the viewport.
 */
export function LocaleSwitcher({
  variant = "menu",
  direction = "down",
  align = "end",
  className,
  onNavigate,
}: LocaleSwitcherProps) {
  const t = useTranslations("localeSwitcher");
  const current = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = `${baseId}-list`;
  const labelId = `${baseId}-label`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const choose = () => {
    setOpen(false);
    onNavigate?.();
  };

  const options = LOCALES.map((code) => {
    const meta = LOCALE_META[code];
    const selected = code === current;
    return (
      <li key={code}>
        <Link
          href={pathname}
          // Another locale gets an explicit prefix (`/en/…`) so the middleware
          // updates the locale cookie before redirecting; the current one stays canonical.
          locale={selected ? undefined : code}
          lang={meta.hreflang}
          hrefLang={meta.hreflang}
          dir={meta.dir}
          aria-current={selected ? "true" : undefined}
          onClick={choose}
          className={cn(
            variant === "menu"
              ? "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
              : "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors",
            variant === "list" &&
              (selected
                ? "border-brand/50 bg-brand/10 text-white"
                : "border-white/15 text-white/75 hover:border-white/30 hover:text-white"),
            variant === "menu" && (selected ? "text-white" : "text-white/75 hover:text-white"),
          )}
        >
          <span className="flex flex-col">
            <span className="font-medium">{meta.nativeName}</span>
            {variant === "menu" && meta.englishName !== meta.nativeName ? (
              <span lang="en" className="text-xs text-white/50">
                {meta.englishName}
              </span>
            ) : null}
          </span>
          {selected ? <Check aria-hidden className="size-4 shrink-0 text-brand" /> : null}
        </Link>
      </li>
    );
  });

  if (variant === "list") {
    return (
      <section aria-labelledby={labelId} className={className}>
        <p
          id={labelId}
          className="flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold"
        >
          <Languages aria-hidden className="size-4" />
          {t("label")}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2 px-2">{options}</ul>
      </section>
    );
  }

  const currentName = LOCALE_META[current].nativeName;
  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={t("current", { language: currentName })}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]",
          open ? "bg-white/[0.07] text-white" : "text-white/75 hover:text-white",
        )}
      >
        <Languages aria-hidden className="size-4" />
        <span>{currentName}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 transition-transform",
            (direction === "up") !== open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <ul
          id={listId}
          aria-label={t("label")}
          className={cn(
            "absolute z-50 flex max-h-[min(60vh,26rem)] min-w-48 flex-col gap-0.5 overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#081a27] p-1.5 text-start shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]",
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2",
            align === "end" ? "end-0" : "start-0",
          )}
        >
          {options}
        </ul>
      ) : null}
    </div>
  );
}
