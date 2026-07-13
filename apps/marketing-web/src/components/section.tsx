import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
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
  muted: "border-y border-white/10 bg-white/[0.03]",
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
            {eyebrow ? <Badge tone={isHeroBand ? "hero" : "default"}>{eyebrow}</Badge> : null}
            <h2
              className={cn(
                "mt-5 text-balance font-display text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]",
                isHeroBand ? "text-hero-text" : "text-foreground",
              )}
            >
              {title}
            </h2>
            {description ? (
              <p
                className={cn(
                  "mt-4 text-pretty text-lg leading-relaxed",
                  isHeroBand ? "text-hero-muted" : "text-muted",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        </Reveal>
        {children ? <div className="mt-14">{children}</div> : null}
      </div>
    </section>
  );
}
