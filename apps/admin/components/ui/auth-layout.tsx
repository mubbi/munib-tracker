import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants/branding";
import type { ReactNode } from "react";
import { LOGO_ICON_RADIUS_CLASS, LogoIcon } from "@/components/ui/logo-icon";
import { ThemeToggle } from "@/components/ui/theme-provider";
import { WaveBackdrop } from "@/components/ui/wave-backdrop";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

/** Split-panel auth shell — Munib brand panel + form card. */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <main className="relative z-10 flex min-h-screen">
      <WaveBackdrop className="fixed inset-0 -z-10" />
      {/* Brand panel — desktop only (hero deep-green band) */}
      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0d4235] via-[#0a2f27] to-[#05201a] px-10 py-12 lg:flex lg:w-5/12 xl:w-1/2">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(230,192,101,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(230,192,101,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="relative flex items-center gap-3">
          <LogoIcon
            className={`h-10 w-10 shrink-0 object-cover ${LOGO_ICON_RADIUS_CLASS} ring-2 ring-white/20`}
          />
          <div>
            <p className="text-sm font-semibold text-[#f3f7f2]">{APP_NAME}</p>
            <p className="text-xs text-[#a7c6ba]">Super Admin Console</p>
          </div>
        </div>
        <div className="relative max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#e6c065]">Admin</p>
          <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-3xl font-semibold tracking-tight text-[#f3f7f2]">
            {APP_TAGLINE}
          </h2>
          <p className="mt-3 text-sm text-[#a7c6ba]">
            Operations console for content reports, feedback, versions, and broadcasts.
          </p>
        </div>
        <p className="relative text-xs text-[#a7c6ba]/80">admin.munibtracker.app</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2.5">
            <LogoIcon className={`h-9 w-9 ${LOGO_ICON_RADIUS_CLASS}`} />
            <span className="text-sm font-semibold text-fg">{APP_NAME} Admin</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 hidden justify-end lg:flex">
            <ThemeToggle />
          </div>
          <div className="glass-card p-8 sm:p-10">
            <p className="text-xs font-medium text-fg-subtle lg:hidden">Super Admin</p>
            <h1 className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              {title}
            </h1>
            {subtitle ? <p className="mt-2 text-sm/6 text-fg-muted">{subtitle}</p> : null}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
