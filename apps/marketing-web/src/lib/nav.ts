import type { NavMenu } from "@/lib/site";

/** True when `href` is the current page or one of its ancestors ("/" only matches itself). */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** True when the menu's landing page or any of its items is the current section. */
export function menuIsActive(pathname: string, menu: NavMenu): boolean {
  return (
    isActivePath(pathname, menu.href) ||
    menu.columns.some((c) => c.items.some((i) => isActivePath(pathname, i.href)))
  );
}
