import { type FiqhDifferenceId, isFiqhDifferenceId } from "@munib-tracker/shared/fiqh";

/**
 * URL slugs for `/fiqh/[id]` (NF-3.0a). The id's one dot becomes a hyphen
 * (`witr.status` → `witr-status`): catalog ids never contain hyphens, and a
 * dotted last path segment reads as a file extension to static web hosts.
 */
export function differenceSlug(id: FiqhDifferenceId): string {
  return id.replace(".", "-");
}

export function differenceFromSlug(slug: string | string[] | undefined): FiqhDifferenceId | null {
  const raw = Array.isArray(slug) ? slug[0] : slug;
  if (!raw) return null;
  const id = raw.replace("-", ".");
  return isFiqhDifferenceId(id) ? id : null;
}
