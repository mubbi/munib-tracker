"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "admin-theme";
const THEME_EVENT = "admin-theme-change";

/** Runs before paint (injected in <head>) to set the theme class with no flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=t==="dark"||((!t||t==="system")&&m);var c=document.documentElement.classList;c.add(d?"dark":"light");c.remove(d?"light":"dark");document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.add("dark");}})();`;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// --- External store: theme preference (localStorage) ---
function getThemeSnapshot(): Theme {
  try {
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? "system";
  } catch {
    return "system";
  }
}
function subscribeTheme(callback: () => void): () => void {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// --- External store: OS color-scheme preference ---
function getSystemSnapshot(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function subscribeSystem(callback: () => void): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function applyTheme(resolved: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, getThemeSnapshot, () => "system");
  // Server snapshot assumes light to match the `:root` default in globals.css; the
  // no-flash inline script applies the real resolved theme before first paint.
  const systemDark = useSyncExternalStore<boolean>(subscribeSystem, getSystemSnapshot, () => false);
  const resolvedTheme: ResolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  // Keep the <html> class in sync with the resolved theme (DOM side effect only).
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode); the event still updates this tab
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/** Segmented light / dark / system control. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl border border-line bg-surface-muted/60 p-0.5",
        className,
      )}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: segmented control uses buttons, not native radios
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-7 w-8 items-center justify-center rounded-lg transition-colors",
              active
                ? "bg-brand-500/15 text-brand-500 ring-1 ring-brand-400/30 dark:text-brand-300"
                : "text-fg-subtle hover:bg-surface-hover hover:text-fg",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
