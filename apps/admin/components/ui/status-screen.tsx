import { APP_NAME } from "@munib-tracker/shared/constants/branding";
import type { ReactNode } from "react";
import { LOGO_ICON_RADIUS_CLASS, LogoIcon } from "@/components/ui/logo-icon";

type StatusScreenProps = {
  /** Large status code, e.g. "404" or "500". */
  code: string;
  title: string;
  description: string;
  /** Action buttons / links. */
  children?: ReactNode;
};

/** Centered full-screen status card — shared by 404 / 500 / error boundaries. */
export function StatusScreen({ code, title, description, children }: StatusScreenProps) {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <LogoIcon
            className={`h-9 w-9 shrink-0 object-cover ring-1 ring-line/50 ${LOGO_ICON_RADIUS_CLASS}`}
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-fg">{APP_NAME}</p>
            <p className="text-xs text-fg-subtle">Super Admin</p>
          </div>
        </div>

        <div className="glass-card px-6 py-10 sm:px-10">
          <p className="text-6xl font-semibold tracking-tight text-brand-600 tabular-nums dark:text-brand-400">
            {code}
          </p>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-fg">{title}</h1>
          <p className="mt-2 text-sm/6 text-fg-muted">{description}</p>
          {children ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
