import { APP_NAME } from "@munib-tracker/shared/constants";
import { BookOpen, Info, Scale, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductAppLink } from "@/components/content/product-app-link";
import { RichText } from "@/components/content/rich-text";
import type { Block } from "@/content/types";
import { isProductAppHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Heading anchor id. ASCII slug for Latin text; headings with no ASCII
 * letters (Arabic, Urdu…) keep their own letters so ids are never empty.
 */
export function slugify(text: string): string {
  const ascii = text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (ascii) return ascii;
  return text
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

/** `{ id, text }` for every h2 — used for the article table of contents. */
export function tableOfContents(blocks: readonly Block[]) {
  return blocks
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: b.id ?? slugify(b.text), text: b.text }));
}

/** All plain text in a body (reading time, word count). */
export function blockText(blocks: readonly Block[]): string[] {
  return blocks.flatMap((b) => {
    switch (b.type) {
      case "p":
      case "h2":
      case "h3":
        return [b.text];
      case "ul":
      case "ol":
        return [...b.items];
      case "evidence":
        return b.translation ? [b.translation] : [];
      case "note":
        return [b.title ?? "", b.text];
      case "steps":
        return b.items.flatMap((s) => [s.title, s.text]);
      case "table":
        return [...b.head, ...b.rows.flat()];
      default:
        return [];
    }
  });
}

/** Note tones; the default label is `templates.notes.<tone>`. */
const NOTE_STYLE = {
  info: {
    icon: Info,
    ring: "border-sky-300/25 bg-[#0c2233]",
    tint: "text-sky-200",
  },
  scholar: {
    icon: Scale,
    ring: "border-gold/30 bg-[#231f14]",
    tint: "text-gold",
  },
  app: {
    icon: Smartphone,
    ring: "border-brand/30 bg-[#0b2a24]",
    tint: "text-brand",
  },
} as const;

export function Note({
  tone,
  title,
  text,
}: {
  tone: "info" | "scholar" | "app";
  title?: string;
  text: string;
}) {
  const t = useTranslations("templates");
  const style = NOTE_STYLE[tone];
  const Icon = style.icon;
  return (
    <aside className={cn("rounded-2xl border p-5 md:p-6", style.ring)}>
      <p
        className={cn(
          "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]",
          style.tint,
        )}
      >
        <Icon aria-hidden className="size-4" />
        {title ?? t(`notes.${tone}`, { appName: APP_NAME })}
      </p>
      <p className="mt-2.5 text-[15px] leading-relaxed text-white/78">
        <RichText text={text} />
      </p>
    </aside>
  );
}

/** Renders a long-form body. Server component — no client JS. */
export function Blocks({ blocks }: { blocks: readonly Block[] }) {
  const t = useTranslations("templates");
  return (
    <div className="flex flex-col gap-6 text-[17px] leading-[1.75] text-white/80">
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        switch (block.type) {
          case "p":
            return (
              <p key={key} className="text-pretty">
                <RichText text={block.text} />
              </p>
            );
          case "h2":
            return (
              <h2
                key={key}
                id={block.id ?? slugify(block.text)}
                className="mt-6 scroll-mt-28 text-balance font-display text-2xl font-bold leading-tight tracking-tight text-white md:text-[1.75rem]"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="mt-2 font-display text-lg font-semibold tracking-tight text-white md:text-xl"
              >
                {block.text}
              </h3>
            );
          case "ul":
          case "ol": {
            const List = block.type;
            return (
              <List
                key={key}
                className={cn(
                  "flex flex-col gap-2.5 ps-6 marker:text-brand",
                  block.type === "ul" ? "list-disc" : "list-decimal",
                )}
              >
                {block.items.map((item) => (
                  <li key={item} className="ps-1">
                    <RichText text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "evidence":
            return (
              <figure
                key={key}
                className="rounded-2xl border border-white/10 bg-[#0c2131] p-5 md:p-7"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  <BookOpen aria-hidden className="size-4" />
                  {t(`evidence.${block.kind}`)}
                </p>
                {block.arabic ? (
                  <p
                    lang="ar"
                    dir="rtl"
                    className="mt-4 font-quran text-[1.65rem] leading-[2.1] text-[#f4efe2] md:text-[1.9rem]"
                  >
                    {block.arabic}
                  </p>
                ) : null}
                {block.translation ? (
                  <blockquote
                    lang={block.translationLang}
                    dir={block.translationLang ? "auto" : undefined}
                    className="mt-4 border-s-2 border-gold/50 ps-4 text-[16px] italic leading-relaxed text-white/85"
                  >
                    {block.translation}
                  </blockquote>
                ) : null}
                <figcaption className="mt-4 text-sm text-white/60">
                  {block.href && isProductAppHref(block.href) ? (
                    <ProductAppLink
                      href={block.href}
                      className="font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
                    >
                      {block.reference}
                    </ProductAppLink>
                  ) : block.href ? (
                    <a
                      href={block.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
                    >
                      {block.reference}
                    </a>
                  ) : (
                    <span className="font-medium text-white/80">{block.reference}</span>
                  )}
                  {block.note ? <span> · {block.note}</span> : null}
                </figcaption>
              </figure>
            );
          case "note":
            return <Note key={key} tone={block.tone} title={block.title} text={block.text} />;
          case "steps":
            return (
              <ol key={key} className="flex flex-col gap-4">
                {block.items.map((step, n) => (
                  <li
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 font-display text-sm font-bold text-brand">
                      {n + 1}
                    </span>
                    <div>
                      <p className="font-display font-semibold text-white">{step.title}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-white/72">
                        <RichText text={step.text} />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={key} className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[30rem] border-collapse text-start text-[15px]">
                  {block.caption ? (
                    <caption className="px-4 pt-4 text-start text-sm text-white/60">
                      {block.caption}
                    </caption>
                  ) : null}
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.04]">
                      {block.head.map((h) => (
                        <th key={h} scope="col" className="px-4 py-3 font-semibold text-white">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr
                        key={row.join("|")}
                        className="border-b border-white/[0.06] last:border-0"
                      >
                        {row.map((cell, c) => (
                          <td
                            // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                            key={c}
                            className={cn(
                              "px-4 py-3 align-top text-white/75",
                              c === 0 && "font-medium text-white/90",
                            )}
                          >
                            <RichText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
