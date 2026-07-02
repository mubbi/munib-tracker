"use client";

import Link from "next/link";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export function CtaButton({ href, children, variant = "primary" }: CtaButtonProps) {
  const className =
    variant === "primary"
      ? "inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 font-medium text-brand-foreground transition-opacity hover:opacity-90"
      : "inline-flex h-12 items-center justify-center rounded-full border border-black/15 px-6 font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10";

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
