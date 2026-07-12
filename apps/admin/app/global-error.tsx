"use client";

import { useEffect } from "react";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Catches errors thrown in the root layout itself. Must render its own
 * <html>/<body>, so it cannot use shared layout chrome or the theme provider.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Admin global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-fg antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="admin-surface px-6 py-10 sm:px-10">
              <p className="text-6xl font-semibold tracking-tight text-brand-600 tabular-nums dark:text-brand-400">
                500
              </p>
              <h1 className="mt-4 text-xl font-semibold tracking-tight text-fg">
                Something went wrong
              </h1>
              <p className="mt-2 text-sm/6 text-fg-muted">
                A critical error occurred. Please reload the console.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400"
                >
                  Try again
                </button>
                <a
                  href="/dashboard"
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-fg shadow-sm transition-colors hover:bg-surface-hover"
                >
                  Go to dashboard
                </a>
              </div>
              {error.digest ? (
                <p className="mt-6 font-mono text-xs text-fg-faint">
                  Error reference: {error.digest}
                </p>
              ) : null}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
