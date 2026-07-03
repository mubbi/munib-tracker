"use client";

import Link from "next/link";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "hero-primary" | "hero-outline" | "hero-ghost";
  className?: string;
};

const base =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-all duration-200";

const variants: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  primary: "bg-brand text-brand-foreground shadow-sm hover:opacity-90 active:scale-[0.98]",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted-surface/50 active:scale-[0.98]",
  "hero-primary":
    "bg-hero-gold text-hero-to shadow-lg shadow-black/20 hover:brightness-105 active:scale-[0.98]",
  "hero-outline":
    "border border-hero-muted/40 bg-white/5 text-hero-text backdrop-blur-sm hover:bg-white/10 active:scale-[0.98]",
  "hero-ghost":
    "h-auto bg-transparent px-2 py-1 text-hero-muted underline-offset-4 hover:text-hero-text hover:underline",
};

export function CtaButton({ href, children, variant = "primary", className = "" }: CtaButtonProps) {
  const classNames = `${base} ${variants[variant]} ${className}`;

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} className={classNames} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  );
}
