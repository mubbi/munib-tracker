import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { Section } from "@/components/section";
import { TESTIMONIALS } from "@/lib/marketing-content";

export function TestimonialsSection() {
  return (
    <Section
      variant="muted"
      eyebrow="Community"
      title="Walking the journey together"
      description={`Muslims using ${APP_NAME} to stay consistent — ${APP_TAGLINE.toLowerCase()}`}
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <li key={item.author}>
            <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-border/50 bg-card p-6">
              <blockquote className="flex-1 text-sm leading-relaxed text-muted">
                <p>&ldquo;{item.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-5 border-t border-border/40 pt-4">
                <p className="font-semibold">{item.author}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
