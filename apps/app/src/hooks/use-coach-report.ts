import type { CoachContext, CoachReport } from "@munib-tracker/shared/types";
import {
  buildCoachWeekReport,
  type CoachWeekWindow,
  coachWeekFor,
  getLocalDateString,
  normalizeCoachWeekday,
  recordCoachReport,
} from "@munib-tracker/shared/utils";
import { useEffect, useMemo, useState } from "react";

import { loadCoachContext } from "@/lib/coach/load-context";
import { captureAppException } from "@/lib/sentry";
import {
  coachHistoryStore,
  useCoachHistory,
  useCoachHistoryReady,
  useEnsureCoachHistoryLoaded,
} from "@/stores/coach-history-store";
import { usePreferences } from "@/stores/preferences-store";

export interface CoachReportState {
  window: CoachWeekWindow;
  report: CoachReport | null;
  /** Counts behind the report (week at a glance). */
  context: CoachContext | null;
  loading: boolean;
}

/**
 * The current weekly reflection (NF-3.14): reviewed week from the coach day,
 * context from every tracker (on-device only, D3) and the pure rules engine.
 * `record` (the coach screen) stores what was shown — for cooldowns — and the
 * outcome of last week's goal; the home card only reads.
 */
export function useCoachReport({
  enabled = true,
  record = false,
}: {
  enabled?: boolean;
  record?: boolean;
} = {}): CoachReportState {
  useEnsureCoachHistoryLoaded();
  const history = useCoachHistory();
  const historyReady = useCoachHistoryReady();
  const { coachWeekday, activeExcusedReason } = usePreferences();
  const weekday = normalizeCoachWeekday(coachWeekday);
  const today = getLocalDateString();
  const window = useMemo(() => coachWeekFor(today, weekday), [today, weekday]);
  const [ctx, setCtx] = useState<CoachContext | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reload when an excused period starts or ends (loadCoachContext reads it from the preferences store).
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setCtx(null);
    void loadCoachContext(window.weekStart, today)
      .then((next) => {
        if (active) setCtx(next);
      })
      .catch((error) => {
        // Tags only — never user content (§2 privacy).
        captureAppException(error, { tags: { area: "coach", phase: "context" } });
      });
    return () => {
      active = false;
    };
  }, [enabled, window.weekStart, today, activeExcusedReason]);

  const report = useMemo(
    () => (ctx && historyReady ? buildCoachWeekReport(ctx, history) : null),
    [ctx, history, historyReady],
  );

  useEffect(() => {
    if (!record || !report) return;
    void coachHistoryStore.getState().apply((data) => recordCoachReport(data, report));
  }, [record, report]);

  return { window, report, context: ctx, loading: enabled && report == null };
}
