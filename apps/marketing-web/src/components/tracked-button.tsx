"use client";

import type { ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { type CtaName, type CtaPlacement, trackCtaClick } from "@/lib/analytics";

type TrackedButtonProps = {
  href: string;
  children: ReactNode;
  cta: CtaName;
  placement: CtaPlacement;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** Button CTA that records a `cta_click` event. */
export function TrackedButton({
  href,
  children,
  cta,
  placement,
  variant,
  size,
  className,
}: TrackedButtonProps) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() => trackCtaClick(cta, placement)}
    >
      {children}
    </Button>
  );
}
