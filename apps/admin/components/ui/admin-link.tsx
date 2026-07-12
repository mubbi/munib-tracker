import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type AdminLinkProps = ComponentProps<typeof Link>;

/** Shared brand link styling — reuse for external `<a>` tags too. */
export const ADMIN_LINK_CLASS =
  "font-medium text-brand-600 transition-colors hover:text-brand-500 hover:underline dark:text-brand-400 dark:hover:text-brand-300";

/** Inline link styled with brand accent — use instead of raw emerald classes. */
export function AdminLink({ className, ...props }: AdminLinkProps) {
  return <Link className={cn(ADMIN_LINK_CLASS, className)} {...props} />;
}
