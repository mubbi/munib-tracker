import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  /** The form control (Input, Select, Textarea, …). Wrapped by the <label> for auto-association. */
  children: ReactNode;
  hint?: string;
  required?: boolean;
  className?: string;
  /** Use a `<div>` wrapper when children include a `<form>` (labels must not wrap forms). */
  asGroup?: boolean;
};

/** Catalyst Field — label above control with optional description. */
export function Field({ label, children, hint, required, className, asGroup }: FieldProps) {
  const Wrapper = asGroup ? "div" : "label";
  return (
    <Wrapper className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm/6 font-medium text-fg">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {children}
      {hint ? <p className="text-xs/5 text-fg-subtle">{hint}</p> : null}
    </Wrapper>
  );
}

/** Right-aligned form footer with a top divider — holds the primary action. */
export function FormActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-line bg-surface-muted/20 px-0 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Two-column responsive form grid for CRUD panels. */
export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-5 sm:grid-cols-2", className)}>{children}</div>;
}

type FieldsetProps = {
  legend: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Catalyst Fieldset — grouped fields with legend + optional description. */
export function Fieldset({ legend, description, children, className }: FieldsetProps) {
  return (
    <fieldset className={cn("space-y-5", className)}>
      <legend className="text-base font-semibold text-fg">{legend}</legend>
      {description ? <p className="-mt-3 text-sm/6 text-fg-subtle">{description}</p> : null}
      {children}
    </fieldset>
  );
}

/** Bordered panel wrapper for standalone forms (search, CRUD). */
export function FormPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-6", className)}>
      {children}
    </div>
  );
}
