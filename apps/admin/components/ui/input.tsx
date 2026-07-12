import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export type ControlSize = "md" | "sm";

/**
 * Catalyst-style form control chrome — explicit 1px border, white/dark input
 * background, and a clear focus ring. Matches Tailwind UI / Catalyst Input docs.
 */
export function controlClasses(size: ControlSize = "md", className?: string): string {
  return cn(
    "block w-full rounded-lg border border-input-border bg-input text-sm text-fg shadow-sm",
    "transition-[border-color,box-shadow,background-color]",
    "placeholder:text-fg-subtle",
    "hover:border-input-border-hover",
    "focus:border-input-border-focus focus:outline-none focus:ring-2 focus:ring-brand-500/30",
    "disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:text-fg-faint disabled:shadow-none",
    "dark:focus:ring-brand-400/25",
    size === "md" ? "px-3 py-2" : "px-2.5 py-1.5 text-xs",
    className,
  );
}

const FIELD_CLASSES = controlClasses();

/** Tailwind v4: use explicit bg-position/bg-size — legacy bg-[right_*] is not parsed as position. */
const SELECT_CHEVRON_BASE =
  "bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat pr-10";

const SELECT_CHEVRON_LIGHT =
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%234a554d%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.75%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]";

const SELECT_CHEVRON_DARK =
  "dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23a1a1aa%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.75%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD_CLASSES, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(FIELD_CLASSES, "min-h-[100px] resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        FIELD_CLASSES,
        "cursor-pointer appearance-none scheme-light dark:scheme-dark",
        SELECT_CHEVRON_BASE,
        SELECT_CHEVRON_LIGHT,
        SELECT_CHEVRON_DARK,
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

type InputGroupProps = {
  children: ReactNode;
  className?: string;
};

/** Wraps a control with optional leading/trailing slots — Catalyst input group. */
export function InputGroup({ children, className }: InputGroupProps) {
  return <div className={cn("relative isolate", className)}>{children}</div>;
}

type InputLeadingIconProps = {
  children: ReactNode;
};

export function InputLeadingIcon({ children }: InputLeadingIconProps) {
  return (
    <span
      className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-fg-subtle"
      aria-hidden
    >
      {children}
    </span>
  );
}

/** Input with left padding reserved for a leading icon inside InputGroup. */
export function InputWithLeading({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <Input className={cn("pl-10", className)} {...props} />;
}

const CHECKBOX_BOX =
  "h-[1.125rem] w-[1.125rem] rounded-[0.3rem] border border-input-border bg-input shadow-sm transition-[border-color,background-color,box-shadow] peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-focus-visible:border-input-border-focus peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/30 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:peer-checked:border-brand-500 dark:peer-checked:bg-brand-500";

/** Custom-styled checkbox — Catalyst Checkbox pattern (visible bordered box). */
export function Checkbox({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="group/check flex cursor-pointer items-start gap-3 text-sm/6 text-fg-muted">
      <span className="relative mt-0.5 flex shrink-0 items-center justify-center">
        <input
          type="checkbox"
          className={cn(
            "peer absolute h-[1.125rem] w-[1.125rem] cursor-pointer opacity-0",
            className,
          )}
          {...props}
        />
        <span className={CHECKBOX_BOX} aria-hidden />
        <svg
          className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="leading-snug group-hover/check:text-fg">{label}</span>
    </label>
  );
}
