"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const REVEAL_STORAGE_KEY = "mt-admin-signin-reveal";

type AdminWindow = Window & {
  iAmAdmin?: () => void;
};

function readRevealFromLocation(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("iAmAdmin") === "1";
}

function readRevealFromSession(): boolean {
  try {
    return sessionStorage.getItem(REVEAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistReveal(): void {
  try {
    sessionStorage.setItem(REVEAL_STORAGE_KEY, "1");
  } catch {
    /* private browsing / disabled storage */
  }
}

type AdminSignInGateProps = {
  configured: boolean;
};

/** Hides Google sign-in until `iAmAdmin=1` or `iAmAdmin()` in the browser console. */
export function AdminSignInGate({ configured }: AdminSignInGateProps) {
  const [revealed, setRevealed] = useState(false);

  const reveal = useCallback(() => {
    persistReveal();
    setRevealed(true);
  }, []);

  useEffect(() => {
    if (readRevealFromLocation() || readRevealFromSession()) {
      setRevealed(true);
      if (readRevealFromLocation()) {
        persistReveal();
      }
    }
  }, []);

  useEffect(() => {
    const win = window as AdminWindow;
    win.iAmAdmin = () => {
      reveal();
    };
    return () => {
      delete win.iAmAdmin;
    };
  }, [reveal]);

  if (!revealed) {
    return (
      <Alert variant="error" title="Access restricted">
        You are not authorized to access this area.
      </Alert>
    );
  }

  if (!configured) {
    return (
      <Alert variant="warning" className="mt-4">
        Set DATABASE_URL, ADMIN_SESSION_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET in the
        Vercel admin project (or apps/admin/.env.local for local dev)
      </Alert>
    );
  }

  return (
    <a href="/api/auth/signin" className="block">
      <Button className="w-full" type="button">
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </Button>
    </a>
  );
}
