import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "glass" | "hero";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-brand to-brand-strong text-white shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--color-brand)_70%,transparent)] hover:shadow-glow hover:brightness-[1.04]",
  gold: "bg-gradient-to-b from-gold-soft to-gold text-hero-to shadow-lg shadow-black/10 hover:brightness-[1.03]",
  outline:
    "border border-border bg-card text-foreground hover:border-brand/50 hover:bg-muted-surface/50",
  ghost: "text-muted hover:bg-muted-surface/60 hover:text-foreground",
  glass: "glass-hero text-hero-text hover:bg-white/10",
  hero: "bg-gradient-to-b from-gold-soft to-gold text-hero-to shadow-lg shadow-black/20 hover:brightness-[1.04]",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, sizes[size], variants[variant], className);
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  "aria-label"?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  const classNames = buttonClass(variant, size, className);
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} className={classNames} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames} {...rest}>
      {children}
    </Link>
  );
}
