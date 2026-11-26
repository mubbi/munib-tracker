import type { DurudItem } from "@munib-tracker/shared/types";

export type DuroodGradeClass = "sahih" | "hasan";

/**
 * Bucket a published grade ("Sahih", "Hasan (Al-Albani)", "Sahih Isnaad …") for
 * the badge. Only sahih / hasan narrations ship (the build rejects the rest),
 * so anything without a grade — e.g. a Hisnul Muslim citation that states its
 * own verdict — shows no badge.
 */
export function duroodGradeClass(grade: string | undefined): DuroodGradeClass | null {
  const lead = grade?.trim().toLowerCase();
  if (!lead) return null;
  if (lead.startsWith("hasan")) return "hasan";
  if (lead.startsWith("sahih")) return "sahih";
  return null;
}

export type DuroodSectionKey = "salawat" | "virtues" | "results";

export type DuroodSection = {
  key: DuroodSectionKey;
  items: DurudItem[];
};

/**
 * The browse sections: the salawat wordings to recite first, then the reports
 * on the virtue of sending salah. Dataset order is kept inside each section.
 */
export function groupDuroods(items: readonly DurudItem[]): DuroodSection[] {
  const salawat = items.filter((item) => item.kind !== "virtue");
  const virtues = items.filter((item) => item.kind === "virtue");
  const sections: DuroodSection[] = [];
  if (salawat.length > 0) sections.push({ key: "salawat", items: salawat });
  if (virtues.length > 0) sections.push({ key: "virtues", items: virtues });
  return sections;
}

/** Previous / next durood in browse order (salawat, then virtues). */
export function duroodNeighbors(
  items: readonly DurudItem[],
  id: string,
): { previous: DurudItem | null; next: DurudItem | null; position: number; total: number } | null {
  const ordered = groupDuroods(items).flatMap((section) => section.items);
  const at = ordered.findIndex((item) => item.id === id);
  if (at < 0) return null;
  return {
    previous: ordered[at - 1] ?? null,
    next: ordered[at + 1] ?? null,
    position: at + 1,
    total: ordered.length,
  };
}
