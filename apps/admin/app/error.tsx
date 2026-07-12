"use client";

import { LayoutDashboard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/button";
import { StatusScreen } from "@/components/ui/status-screen";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Surface to the browser console in dev; production console is stripped.
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <StatusScreen
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. You can try again or head back to the dashboard."
    >
      <button type="button" onClick={() => reset()} className={buttonClasses("primary")}>
        <RotateCcw className="h-4 w-4" aria-hidden />
        Try again
      </button>
      <Link href="/dashboard" className={buttonClasses("secondary")}>
        <LayoutDashboard className="h-4 w-4" aria-hidden />
        Go to dashboard
      </Link>
      {error.digest ? (
        <p className="mt-2 w-full font-mono text-xs text-fg-faint">
          Error reference: {error.digest}
        </p>
      ) : null}
    </StatusScreen>
  );
}
