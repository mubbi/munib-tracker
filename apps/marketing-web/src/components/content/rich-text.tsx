import { Fragment, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Renders the tiny inline markup used in `src/content` strings:
 * `[label](href)` links and `**bold**`. Everything else is plain text, so
 * content data can never inject HTML.
 */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

const linkClass =
  "font-medium text-brand underline decoration-brand/35 underline-offset-[3px] transition-colors hover:decoration-brand";

export function RichText({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const [, label, href, bold] = match;
    if (bold) {
      out.push(
        <strong key={key++} className="font-semibold text-white">
          {bold}
        </strong>,
      );
    } else if (label && href) {
      out.push(
        href.startsWith("http") ? (
          <a
            key={key++}
            href={href}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        ) : (
          <Link key={key++} href={href} className={linkClass}>
            {label}
          </Link>
        ),
      );
    }
    last = index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}

/** All internal hrefs referenced from a string (for link-integrity tests). */
export function internalLinks(text: string): string[] {
  return [...text.matchAll(TOKEN)]
    .map((m) => m[2])
    .filter((href): href is string => Boolean(href) && !href?.startsWith("http"));
}
