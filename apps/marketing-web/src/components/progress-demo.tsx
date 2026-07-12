"use client";

import { useState } from "react";
import { trackDemoEngage } from "@/lib/analytics";

const DEMO_MAX = 5;
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export function ProgressDemo() {
  const [value, setValue] = useState(3);

  const percentage = Math.round((value / DEMO_MAX) * 100);

  return (
    <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-6">
      <h3 className="text-lg font-semibold">Today&apos;s prayer progress</h3>
      <p className="mt-1 text-sm text-muted">
        Interactive demo — tap a fard prayer to mark it complete.
      </p>

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={DEMO_MAX}
        aria-label={`${value} of ${DEMO_MAX} fard prayers completed`}
        className="mt-6"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {value} of {DEMO_MAX} complete
          </span>
          <span className="text-muted">{percentage}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted-surface">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PRAYERS.map((prayer, index) => {
          const done = index < value;
          return (
            <li key={prayer}>
              <button
                type="button"
                aria-pressed={done}
                onClick={() => {
                  const next = index < value ? index : index + 1;
                  setValue(next);
                  trackDemoEngage({
                    demo: "prayer_progress",
                    action: "toggle_prayer",
                    prayer: prayer.toLowerCase(),
                    completed_count: next,
                  });
                }}
                className={`w-full rounded-xl border px-3 py-3 text-sm font-medium transition-[transform,colors] active:scale-[0.98] ${
                  done
                    ? "border-brand/30 bg-brand/10 text-brand"
                    : "border-border/60 hover:bg-muted-surface/40"
                }`}
              >
                {prayer} {done ? "✓" : ""}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-muted">
        In the app: five statuses, sunnah prayers, notes, streaks, and calendar history.
      </p>
    </div>
  );
}
