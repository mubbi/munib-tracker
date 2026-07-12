import type { SearchGroup } from "@/lib/search-types";

type LightSearchFn = (
  query: string,
  perGroupLimit: number,
) => SearchGroup[] | Promise<SearchGroup[]>;

let lightSearchImpl: LightSearchFn | undefined;

/** Jest-only: sync path so the search screen does not need dynamic `import()`. */
export function __setLightSearchWithGuidesForTests(fn: LightSearchFn): void {
  lightSearchImpl = fn;
}

/** Resolve light+guides search (async chunk in production). */
export async function runSearchLightWithGuides(
  query: string,
  perGroupLimit: number,
): Promise<SearchGroup[]> {
  if (lightSearchImpl) return lightSearchImpl(query, perGroupLimit);
  const { searchLightWithGuides } = await import("@/lib/search-with-guides");
  return searchLightWithGuides(query, perGroupLimit);
}
