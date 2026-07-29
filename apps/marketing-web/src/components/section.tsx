import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  variant?: "default" | "muted" | "hero-band";
  align?: "center" | "left";
  className?: string;
};

const variantClasses = {
  default: "",
  muted: "bg-white/[0.025]",
  "hero-band": "border-y border-white/10 bg-[#0a1c2e]/45 text-white",
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  variant = "default",
  align = "center",
  className = "",
}: SectionProps) {
  const isHeroBand = variant === "hero-band";
  const centered = align === "center";

  return (
    <section id={id} className={cn("relative py-20 md:py-28", variantClasses[variant], className)}>
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
            {eyebrow ? (
              isHeroBand ? (
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-hero-gold">
                  {eyebrow}
                </p>
              ) : (
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                  {eyebrow}
                </p>
              )
            ) : null}
            <h2
              className={cn(
                "text-balance font-display text-3xl font-bold tracking-tight text-white md:text-[2.35rem] md:leading-[1.15]",
                eyebrow ? "mt-3" : null,
                isHeroBand && "text-hero-text",
              )}
            >
              {title}
            </h2>
            {description ? (
              <p
                className={cn(
                  "mt-4 text-pretty text-lg leading-relaxed",
                  isHeroBand ? "text-hero-muted" : "text-white/65",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        </Reveal>
        {children ? <div className="mt-12 md:mt-14">{children}</div> : null}
      </div>
    </section>
  );
}
