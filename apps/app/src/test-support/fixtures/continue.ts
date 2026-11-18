import type { ContinueActivity } from "@/lib/continue-activity";

/** A recently read dua unless overridden. */
export function buildContinueActivity(overrides: Partial<ContinueActivity> = {}): ContinueActivity {
  return {
    kind: "dua",
    href: "/dua/morning-1",
    title: "Morning protection",
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}
