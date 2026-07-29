import type { HadithItem } from "@munib-tracker/shared/types";

/** Map a hadith collection label from Jannah content to a remote/bundled collection id. */
export function matchHadithCollectionSlug(collectionLabel: string): string | null {
  const normalized = collectionLabel
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "");

  if (normalized.includes("bukhari")) return "bukhari";
  if (normalized.includes("muslim")) return "muslim";
  if (normalized.includes("tirmidhi")) return "tirmidhi";
  if (normalized.includes("abu dawud") || normalized.includes("abudawud")) return "abudawud";
  if (normalized.includes("nasai")) return "nasai";
  if (normalized.includes("ibn majah")) return "ibnmajah";
  if (normalized.includes("nawawi")) return "nawawi40";
  if (normalized.includes("riyad") || normalized.includes("salihin")) return "riyad_assalihin";
  return null;
}

/** Pull the first integer from a citation string (e.g. "7312" or "Book 81, Hadith 15"). */
export function extractHadithCitationNumber(citation: string): string | null {
  const match = citation.match(/\d+/);
  return match?.[0] ?? null;
}

/**
 * Resolve a Jannah hadith citation into the bookmark payload used by
 * {@link HadithRepository.toggleBookmark}. Returns null when the collection is
 * not available in the app's hadith reader.
 */
export function resolveHadithBookmarkTarget(
  collection: string,
  citation: string,
): Pick<HadithItem, "id" | "collection" | "number"> | null {
  const slug = matchHadithCollectionSlug(collection);
  const number = extractHadithCitationNumber(citation);
  if (!slug || !number) return null;
  const id = `${slug}:${number}`;
  return { id, collection: slug, number };
}
