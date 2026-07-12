"use client";

import { AlertTriangle } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type ButtonSize, type ButtonVariant, buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfirmBeforeOpenResult =
  | boolean
  | {
      proceed: boolean;
      message?: ReactNode;
      detail?: ReactNode;
    };

type ConfirmSubmitProps = {
  /** Trigger button label. */
  children: ReactNode;
  /** Confirmation question shown in the dialog. */
  message: ReactNode;
  /** Optional static detail block below the message (e.g. summary list). */
  detail?: ReactNode;
  /** Runs after validation; return false or `{ proceed: false }` to abort opening. */
  onBeforeOpen?: () => Promise<ConfirmBeforeOpenResult>;
  /** Trigger label while `onBeforeOpen` runs. */
  preparingLabel?: string;
  title?: string;
  confirmLabel?: string;
  /** Confirm-button colour in the dialog (use "danger" for destructive actions). */
  tone?: "default" | "danger";
  /** Render the trigger with shared Button styles; omit to use raw `className`. */
  variant?: ButtonVariant;
  /** Trigger size when `variant` is set. */
  size?: ButtonSize;
  /** Trigger class names (raw, or extra layout classes when `variant` is set). */
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

/**
 * A form submit button that opens a confirmation dialog before submitting.
 * Intercepts the click, runs native validation, then re-submits the parent
 * form via `requestSubmit()` on confirm — so the server action still runs.
 *
 * The dialog is portaled to `document.body` so `position: fixed` is always
 * viewport-relative (PageShell and other ancestors use transform animations).
 */
export function ConfirmSubmit({
  children,
  message,
  detail,
  onBeforeOpen,
  preparingLabel = "Checking…",
  title = "Confirm action",
  confirmLabel,
  tone = "default",
  variant,
  size = "md",
  className,
  disabled = false,
  "aria-label": ariaLabel,
}: ConfirmSubmitProps) {
  const [open, setOpen] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<ReactNode | null>(null);
  const [overlayDetail, setOverlayDetail] = useState<ReactNode | null>(null);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const scrollLockRef = useRef<{ scrollY: number } | null>(null);
  const titleId = useId();
  const messageId = useId();

  const closeDialog = useCallback(() => {
    setOpen(false);
    setOverlayMessage(null);
    setOverlayDetail(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    confirmRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDialog();
        return;
      }
      // Trap focus between Cancel and Confirm while the dialog is open.
      if (e.key === "Tab") {
        const cancel = cancelRef.current;
        const confirm = confirmRef.current;
        if (!cancel || !confirm) return;
        const active = document.activeElement;
        if (e.shiftKey && active === cancel) {
          e.preventDefault();
          confirm.focus();
        } else if (!e.shiftKey && active === confirm) {
          e.preventDefault();
          cancel.focus();
        }
      }
    };

    const scrollY = window.scrollY;
    scrollLockRef.current = { scrollY };
    const { style } = document.body;
    const prev = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
      paddingRight: style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    if (scrollbarWidth > 0) {
      style.paddingRight = `${scrollbarWidth}px`;
    }

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      style.overflow = prev.overflow;
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollLockRef.current?.scrollY ?? scrollY);
      scrollLockRef.current = null;
    };
  }, [closeDialog, open]);

  const triggerClass = variant ? buttonClasses(variant, className, size) : className;

  const dialogMessage = overlayMessage ?? message;
  const dialogDetail = overlayDetail ?? detail;

  const dialog =
    open && mounted ? (
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center overscroll-none p-4 sm:items-center"
        role="presentation"
      >
        <button
          type="button"
          aria-label="Cancel"
          className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[1px] motion-safe:animate-[dialog-backdrop-in_0.2s_ease-out]"
          onClick={closeDialog}
        />
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={messageId}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-xl ring-1 ring-line/80 motion-safe:animate-[dialog-panel-in_0.2s_ease-out]"
        >
          <div className="flex gap-4 px-6 pt-6">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                tone === "danger"
                  ? "bg-danger-bg text-danger ring-danger-line/40"
                  : "bg-brand-600/10 text-brand-600 ring-brand-500/20 dark:text-brand-300",
              )}
              aria-hidden
            >
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 id={titleId} className="text-base font-semibold text-fg">
                {title}
              </h2>
              <div id={messageId} className="mt-2 space-y-3 text-sm/6 text-fg-muted">
                <div>{dialogMessage}</div>
                {dialogDetail ? (
                  <div className="rounded-lg border border-line bg-surface-muted/40 p-3 text-fg">
                    {dialogDetail}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line bg-surface-muted/30 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              ref={cancelRef}
              type="button"
              className={buttonClasses("secondary", "w-full sm:w-auto", "sm")}
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              ref={confirmRef}
              type="button"
              className={buttonClasses(
                tone === "danger" ? "danger" : "primary",
                "w-full sm:w-auto",
                "sm",
              )}
              onClick={() => {
                closeDialog();
                formRef.current?.requestSubmit();
              }}
            >
              {confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="submit"
        className={triggerClass}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        disabled={disabled || preparing}
        onClick={async (e) => {
          e.preventDefault();
          const form = e.currentTarget.form;
          // Surface native validation (required fields) before confirming.
          if (form && !form.reportValidity()) return;
          formRef.current = form;

          if (onBeforeOpen) {
            setPreparing(true);
            try {
              const result = await onBeforeOpen();
              const proceed = typeof result === "boolean" ? result : result.proceed;
              if (!proceed) return;
              if (typeof result === "object") {
                setOverlayMessage(result.message ?? null);
                setOverlayDetail(result.detail ?? null);
              } else {
                setOverlayMessage(null);
                setOverlayDetail(null);
              }
            } finally {
              setPreparing(false);
            }
          }

          setOpen(true);
        }}
      >
        {preparing ? preparingLabel : children}
      </button>
      {dialog && mounted ? createPortal(dialog, document.body) : null}
    </>
  );
}
