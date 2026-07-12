"use client";

import type { AdminRole } from "@munib-tracker/db/schema";
import {
  Bell,
  BookOpen,
  CloudOff,
  Flag,
  Image,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Mail,
  Menu,
  RefreshCw,
  Server,
  ShieldEllipsis,
  ShieldX,
  Smartphone,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { LOGO_ICON_RADIUS_CLASS, LogoIcon } from "@/components/ui/logo-icon";
import { ThemeToggle } from "@/components/ui/theme-provider";
import { type NavItem, visibleNavItems } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: AdminRole;
  email: string;
};

/** Desktop sidebar width — keep in sync with the layout's `lg:pl-*` content offset. */
export const SIDEBAR_WIDTH_CLASS = "w-64";
/** Left padding applied to the main content so it clears the fixed desktop sidebar. */
export const SIDEBAR_OFFSET_CLASS = "lg:pl-64";

/** Per-route icons — kept in sync with each page's PageShell icon. */
const NAV_ICONS: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/users": Users,
  "/reports": Flag,
  "/feedback": Star,
  "/contact-messages": Mail,
  "/oss-failures": CloudOff,
  "/versions": Smartphone,
  "/notifications": Bell,
  "/media": Image,
  "/sync": RefreshCw,
  "/auth-abuse": ShieldX,
  "/platform": Server,
  "/administration": ShieldEllipsis,
  "/playbooks": BookOpen,
};

const NAV_GROUPS: { label: string; prefixes: string[] }[] = [
  { label: "Overview", prefixes: ["/dashboard"] },
  {
    label: "Users & content",
    prefixes: [
      "/users",
      "/reports",
      "/feedback",
      "/contact-messages",
      "/oss-failures",
      "/media",
      "/playbooks",
    ],
  },
  {
    label: "Product",
    prefixes: ["/versions", "/notifications", "/sync"],
  },
  { label: "Platform & ops", prefixes: ["/auth-abuse", "/platform", "/administration"] },
];

function groupNavItems(items: NavItem[]): { label: string; items: NavItem[] }[] {
  const byHref = new Map(items.map((item) => [item.href, item]));
  const used = new Set<string>();
  const groups: { label: string; items: NavItem[] }[] = [];

  for (const group of NAV_GROUPS) {
    const matched = group.prefixes
      .map((href) => byHref.get(href))
      .filter((item): item is NavItem => Boolean(item));
    if (matched.length === 0) continue;
    for (const item of matched) used.add(item.href);
    groups.push({ label: group.label, items: matched });
  }

  const remaining = items.filter((item) => !used.has(item.href));
  if (remaining.length > 0) {
    groups.push({ label: "Other", items: remaining });
  }

  return groups;
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = NAV_ICONS[item.href];
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/nav flex min-h-[36px] items-center gap-x-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-surface-muted text-brand-600 dark:text-brand-300"
          : "text-fg-subtle hover:bg-surface-hover hover:text-fg",
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            active
              ? "text-brand-600 dark:text-brand-300"
              : "text-fg-faint group-hover/nav:text-fg-subtle",
          )}
          aria-hidden
        />
      ) : null}
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarContent({ role, email, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = visibleNavItems(role);
  const groups = groupNavItems(items);

  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-5 pr-12 lg:pr-5">
        <LogoIcon
          className={cn(
            "h-8 w-8 shrink-0 object-cover ring-1 ring-line/50",
            LOGO_ICON_RADIUS_CLASS,
          )}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fg">Munib Tracker Admin</p>
          <p className="text-xs text-fg-subtle">Super Admin</p>
        </div>
      </div>

      <nav
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-4"
        aria-label="Admin navigation"
      >
        <ul className="flex flex-1 flex-col gap-y-6">
          {groups.map((group) => (
            <li key={group.label}>
              <p className="mb-2 px-2 text-xs/6 font-semibold uppercase tracking-wide text-fg-faint">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <NavLink item={item} active={active} onNavigate={onNavigate} />
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 space-y-3 border-t border-line p-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-fg-subtle">Appearance</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface-muted/50 p-3 ring-1 ring-inset ring-line/50">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold uppercase text-white"
            aria-hidden
          >
            {email.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-fg" title={email}>
              {email}
            </p>
            <Badge variant="brand" dot className="mt-1 capitalize">
              {role.replace("_", " ")}
            </Badge>
          </div>
          <form action="/api/auth/signout" method="post" className="shrink-0">
            <ConfirmSubmit
              className="flex h-9 w-9 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-danger-bg hover:text-danger"
              aria-label="Sign out"
              title="Sign out"
              message="Sign out of the admin console?"
              confirmLabel="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </>
  );
}

export function Sidebar({ role, email }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close drawer on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex min-h-14 items-center gap-3 border-b border-line bg-surface/95 px-4 pt-[env(safe-area-inset-top,0px)] shadow-sm backdrop-blur-sm lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-fg-subtle ring-1 ring-inset ring-line/50 hover:bg-surface-hover hover:text-fg"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <LogoIcon className={`h-7 w-7 ${LOGO_ICON_RADIUS_CLASS}`} />
          <span className="text-sm font-semibold text-fg">Munib Tracker Admin</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close navigation"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(16rem,85vw)] max-w-full flex-col bg-surface pt-[env(safe-area-inset-top,0px)] shadow-xl ring-1 ring-line/80 transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <button
          type="button"
          onClick={closeMobile}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle hover:bg-surface-hover hover:text-fg"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent role={role} email={email} onNavigate={closeMobile} />
      </aside>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-surface lg:flex",
          SIDEBAR_WIDTH_CLASS,
        )}
      >
        <SidebarContent role={role} email={email} />
      </aside>
    </>
  );
}
