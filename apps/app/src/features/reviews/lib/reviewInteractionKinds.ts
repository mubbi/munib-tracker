/** Meaningful interaction types — one count per kind per session (deduped in provider). */
export type ReviewInteractionKind =
  | "mark_prayer"
  | "mark_zikr"
  | "mark_qaza"
  | "view_statistics"
  | "daily_tracking"
  | "save_khushu";
