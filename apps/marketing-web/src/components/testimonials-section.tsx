import { BadgeCheck, Star } from "lucide-react";
import { Section } from "@/components/section";
import { Marquee } from "@/components/ui/marquee";
import { TESTIMONIALS, type Testimonial } from "@/lib/marketing-content";

const STAR_KEYS = ["one", "two", "three", "four", "five"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex w-[320px] shrink-0 flex-col rounded-[var(--radius-card)] border border-border/60 bg-card p-6 shadow-sm sm:w-[358px]">
      <div className="flex items-center gap-1 text-gold" role="img" aria-label="Rated 5 out of 5">
        {STAR_KEYS.map((k) => (
          <Star key={`${testimonial.author}-${k}`} className="size-4 fill-current" aria-hidden />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 whitespace-normal text-pretty text-sm leading-relaxed text-foreground/90">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-sm font-bold text-white">
          {initials(testimonial.author)}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            {testimonial.author}
            <BadgeCheck className="size-4 text-brand" aria-label="Verified" />
          </span>
          <span className="block truncate text-xs text-muted">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  return (
    <Section
      id="testimonials"
      variant="muted"
      eyebrow="Loved by the ummah"
      title="Worship, gently supported"
      description="Real words from people rebuilding their prayer habit and learning their deen."
    >
      <div className="-mx-6 md:-mx-8">
        <Marquee>
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
