import type { ExternalCommand } from "@/lib/external-commands/types";

/** How long a widget tap's own mark is trusted before the native queue shows it. */
const LOCAL_MARK_TTL_MS = 15_000;
let localMarks: { command: ExternalCommand; at: number }[] = [];

/**
 * Remember a mark sent from a widget tap. The broadcast reaches the native queue
 * asynchronously, so the redraw right after the tap would not see it yet
 * (Android widget quality WT-3.1: reflect the action immediately). Kept free of
 * widget-library imports so the task handler stays out of the TV graph.
 */
export function rememberLocalWidgetMark(command: ExternalCommand, nowMs = Date.now()): void {
  localMarks = [
    ...localMarks.filter((mark) => nowMs - mark.at < LOCAL_MARK_TTL_MS),
    { command, at: nowMs },
  ];
}

export function recentLocalWidgetMarks(nowMs = Date.now()): ExternalCommand[] {
  return localMarks.filter((mark) => nowMs - mark.at < LOCAL_MARK_TTL_MS).map((m) => m.command);
}

/** Test hook. */
export function clearLocalWidgetMarks(): void {
  localMarks = [];
}
