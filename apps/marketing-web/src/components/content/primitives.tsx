import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppleWatchFrame, RoundWatchFrame, TvFrame } from "@/components/content/device-frames";
import { RichText } from "@/components/content/rich-text";
import { DeviceFrame } from "@/components/day-arc/device-frame";
import type { FaqItem, ScreenshotSlot } from "@/content/types";
import { getScreenshot } from "@/lib/screenshots";
import { breadcrumbSchema, type Crumb, graph } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/** Inline JSON-LD `<script>`; pass a `graph(...)` document. */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires an inline script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Visible breadcrumb trail + BreadcrumbList structured data. First crumb is Home. */
export function Breadcrumbs({ items, className }: { items: readonly Crumb[]; className?: string }) {
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLdScript data={graph(breadcrumbSchema(crumbs))} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-white/55">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="inline-flex items-center gap-1.5">
                {i > 0 ? <ChevronRight aria-hidden className="size-3.5 text-white/30" /> : null}
                {last ? (
                  <span aria-current="page" className="text-white/80">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-brand">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/** Width class that suits each frame when a caller doesn't size it. */
export function frameWidthClass(key: ScreenshotSlot["key"]): string {
  const frame = getScreenshot(key).frame;
  if (frame === "tv") return "w-full max-w-xl";
  if (frame === "phone") return "w-[200px] sm:w-[220px]";
  return "w-[170px] sm:w-[190px]";
}

/** A real screenshot inside the right device frame, with an optional caption. */
export function Screenshot({
  slot,
  preload = false,
  className,
  showCaption = true,
}: {
  slot: ScreenshotSlot;
  /** Preload in `<head>`: only for an above-the-fold (LCP) screenshot. */
  preload?: boolean;
  className?: string;
  showCaption?: boolean;
}) {
  const shot = getScreenshot(slot.key);
  let device: ReactNode;
  if (shot.frame === "phone") {
    device = (
      <DeviceFrame
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        preload={preload}
        className="w-full"
      />
    );
  } else {
    const props = {
      src: shot.src,
      alt: shot.alt,
      width: shot.width,
      height: shot.height,
      preload,
      className: "w-full",
    };
    device =
      shot.frame === "tv" ? (
        <TvFrame {...props} />
      ) : shot.frame === "round" ? (
        <RoundWatchFrame {...props} />
      ) : (
        <AppleWatchFrame {...props} />
      );
  }
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      {device}
      {showCaption ? (
        <figcaption className="mt-4 max-w-xs text-center text-sm leading-relaxed text-white/60">
          {slot.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Crawlable, zero-JS FAQ list built on `<details>`. */
export function FaqList({
  items,
  headingLevel = "h3",
}: {
  items: readonly FaqItem[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <details
          key={item.question}
          open={i === 0}
          className="group rounded-2xl border border-white/10 bg-white/[0.035] open:border-brand/35 open:bg-white/[0.05]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 marker:hidden focus-visible:outline-offset-2 md:px-6 [&::-webkit-details-marker]:hidden">
            <Heading className="font-display text-base font-semibold text-white md:text-[17px]">
              {item.question}
            </Heading>
            <Plus
              aria-hidden
              className="size-5 shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <div className="px-5 pb-5 text-[15px] leading-relaxed text-white/72 md:px-6">
            <RichText text={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}

/** Paragraphs of inline markup (`[label](/path)`, `**bold**`), one `<p>` each. */
export function RichParagraphs({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((p) => (
        <p key={p}>
          <RichText text={p} />
        </p>
      ))}
    </div>
  );
}

/** Template FAQ section: an H2 with an eyebrow over the zero-JS `<FaqList>`. */
export function FaqSection({
  items,
  title,
  tone,
}: {
  items: readonly FaqItem[];
  title: string;
  tone?: "default" | "band";
}) {
  return (
    <PageSection id="faq" tone={tone} eyebrow="FAQ" title={title}>
      <div className="max-w-3xl">
        <FaqList items={items} />
      </div>
    </PageSection>
  );
}

/** Section wrapper for template pages (server, no animation). */
export function PageSection({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  tone = "default",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
  tone?: "default" | "band";
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn(
        "relative py-14 md:py-20",
        tone === "band" && "border-y border-white/[0.07] bg-white/[0.025]",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          ) : null}
          <h2
            id={id ? `${id}-title` : undefined}
            className={cn(
              "text-balance font-display text-[1.75rem] font-bold leading-tight tracking-tight text-white md:text-[2.15rem]",
              eyebrow && "mt-3",
            )}
          >
            {title}
          </h2>
          {intro ? (
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/68 md:text-lg">
              <RichText text={intro} />
            </p>
          ) : null}
        </div>
        {children ? <div className="mt-9 md:mt-12">{children}</div> : null}
      </div>
    </section>
  );
}

/** Card linking to another page (hub grids, related content). */
export function LinkCard({
  href,
  title,
  description,
  icon,
  meta,
  className,
}: {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
  meta?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-white/10 bg-[#0c2131]/55 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-[#0f2a3b]/70 md:p-6",
        className,
      )}
    >
      {icon ? (
        <span className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-brand/12 text-brand ring-1 ring-brand/20">
          {icon}
        </span>
      ) : null}
      {meta ? (
        <span className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold/90">
          {meta}
        </span>
      ) : null}
      <span className="font-display text-[17px] font-semibold leading-snug text-white">
        {title}
      </span>
      <span className="mt-2 text-sm leading-relaxed text-white/62">{description}</span>
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand">
        Learn more
        <ChevronRight
          aria-hidden
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

/** Small "Updated …" stamp. */
export function DateStamp({ label, iso }: { label: string; iso: string }) {
  const formatted = new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <span>
      {label} <time dateTime={iso}>{formatted}</time>
    </span>
  );
}
