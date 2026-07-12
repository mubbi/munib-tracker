import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "xs" | "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "min-h-[28px] px-2.5 py-1 text-xs",
  sm: "min-h-[34px] px-3 py-1.5 text-[13px]",
  md: "min-h-[40px] px-3.5 py-2 text-sm",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white ring-1 ring-inset ring-brand-700/20 hover:bg-brand-500 active:bg-brand-700 dark:bg-brand-500 dark:ring-brand-400/20 dark:hover:bg-brand-400",
  secondary:
    "bg-surface text-fg ring-1 ring-inset ring-line-strong/50 hover:bg-surface-hover active:bg-surface-muted",
  outline:
    "bg-transparent text-fg-muted ring-1 ring-inset ring-line-strong/50 hover:bg-surface-hover hover:text-fg",
  ghost: "bg-transparent text-fg-subtle shadow-none hover:bg-surface-hover hover:text-fg",
  danger:
    "bg-danger-bg text-danger ring-1 ring-inset ring-danger-line hover:bg-danger-bg/80 active:brightness-95",
};

/** Shared button class builder — reused by Button and ConfirmSubmit. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  className?: string,
  size: ButtonSize = "md",
): string {
  return cn(BASE_CLASSES, SIZE_CLASSES[size], VARIANT_CLASSES[variant], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button type="button" className={buttonClasses(variant, className, size)} {...props}>
      {children}
    </button>
  );
}
