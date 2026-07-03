import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  variant?: "default" | "muted" | "hero-band";
  className?: string;
};

const variantClasses = {
  default: "",
  muted: "bg-muted-surface/40",
  "hero-band": "bg-gradient-to-b from-hero-from to-hero-to text-hero-text",
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  variant = "default",
  className = "",
}: SectionProps) {
  const isHeroBand = variant === "hero-band";

  return (
    <section id={id} className={`py-20 md:py-28 ${variantClasses[variant]} ${className}`}>
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <p
              className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                isHeroBand ? "text-hero-gold" : "text-brand"
              }`}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${
              isHeroBand ? "text-hero-text" : "text-foreground"
            }`}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={`mt-4 text-lg leading-relaxed ${
                isHeroBand ? "text-hero-muted" : "text-muted"
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>
        {children ? <div className="mt-14">{children}</div> : null}
      </div>
    </section>
  );
}
