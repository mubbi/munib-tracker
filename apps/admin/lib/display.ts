export type DisplayBadgeVariant = "default" | "brand" | "warning" | "danger" | "muted";

/** Title-case a snake_case enum value for display. */
export function humanizeEnum(value: string): string {
  return value.replace(/_/g, " ");
}

export function feedbackRatingVariant(rating: number): DisplayBadgeVariant {
  if (rating <= 1) return "danger";
  if (rating === 2) return "warning";
  return "muted";
}

export function contentReportStatusVariant(status: string): DisplayBadgeVariant {
  if (status === "completed") return "brand";
  if (status === "spam" || status === "cancelled") return "danger";
  if (status === "in_progress" || status === "in_review") return "warning";
  return "default";
}
