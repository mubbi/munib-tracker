import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale-aware replacements for `next/link` and `next/navigation`. Always use
 * these for internal links so the current locale prefix is kept; `usePathname`
 * returns the path without the locale prefix.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
