import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  hasNext: boolean;
  /** Page path, e.g. "/users". */
  basePath: string;
  /** Other query params to preserve across page navigation (q, source, …). */
  params?: Record<string, string | undefined>;
  pageParam?: string;
};

function hrefFor(
  basePath: string,
  params: Record<string, string | undefined>,
  pageParam: string,
  page: number,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  if (page > 1) sp.set(pageParam, String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Prev / page / next control for offset-paginated tables. Renders nothing for a single page. */
export function Pagination({
  page,
  hasNext,
  basePath,
  params = {},
  pageParam = "page",
}: PaginationProps) {
  const hasPrev = page > 1;
  if (!hasPrev && !hasNext) return null;

  const enabled = buttonClasses("secondary", "gap-1.5", "sm");
  const disabled = cn(enabled, "pointer-events-none opacity-40");

  return (
    <nav
      className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-surface px-2 py-2 shadow-sm ring-1 ring-inset ring-line/50 sm:gap-3 sm:px-4"
      aria-label="Pagination"
    >
      {hasPrev ? (
        <Link href={hrefFor(basePath, params, pageParam, page - 1)} className={enabled} rel="prev">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Previous</span>
          <span className="sr-only sm:hidden">Previous page</span>
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}
      <span className="px-1 text-sm font-medium text-fg-subtle">
        Page <span className="text-fg">{page}</span>
      </span>
      {hasNext ? (
        <Link href={hrefFor(basePath, params, pageParam, page + 1)} className={enabled} rel="next">
          <span className="hidden sm:inline">Next</span>
          <span className="sr-only sm:hidden">Next page</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
