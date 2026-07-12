import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "warning" | "error" | "success";

type AlertProps = {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  className?: string;
};

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  info: "border-info-line/40 bg-info-bg/60 text-info ring-info-line/30",
  warning: "border-warning-line/40 bg-warning-bg/70 text-warning ring-warning-line/30",
  error: "border-danger-line/40 bg-danger-bg/70 text-danger ring-danger-line/30",
  success: "border-success-line/40 bg-success-bg/70 text-success ring-success-line/30",
};

const ACCENT_CLASSES: Record<AlertVariant, string> = {
  info: "border-l-info",
  warning: "border-l-warning",
  error: "border-l-danger",
  success: "border-l-success",
};

const ICONS: Record<AlertVariant, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle2,
};

export function Alert({ children, variant = "info", title, className }: AlertProps) {
  const Icon = ICONS[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border border-l-4 px-4 py-3 text-sm shadow-sm ring-1 ring-inset",
        VARIANT_CLASSES[variant],
        ACCENT_CLASSES[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 opacity-90" aria-hidden />
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn("leading-relaxed", title ? "mt-1 opacity-90" : undefined)}>
          {children}
        </div>
      </div>
    </div>
  );
}
