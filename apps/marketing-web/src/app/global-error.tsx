"use client";

import { createTranslator } from "next-intl";
import error from "@/messages/en/error.json";

/**
 * Renders outside every layout and provider, so it can't read the request
 * locale: it uses the English `error` catalog directly (imported alone so the
 * rest of the catalog stays out of this client bundle).
 */
const t = createTranslator({ locale: "en", messages: { error }, namespace: "error" });

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-bold">{t("heading")}</h1>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-emerald-600 px-6 py-2 text-white"
        >
          {t("retry")}
        </button>
      </body>
    </html>
  );
}
