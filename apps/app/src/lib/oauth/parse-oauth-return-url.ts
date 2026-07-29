/** Parse `code` (and optional `state`) from an OAuth return URL (query or hash). */
export function parseOAuthReturnUrl(url: string): { code: string; state: string | null } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const withScheme = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withScheme);
    const fromQuery = parsed.searchParams.get("code")?.trim();
    if (fromQuery) {
      return { code: fromQuery, state: parsed.searchParams.get("state") };
    }
    if (parsed.hash) {
      const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ""));
      const fromHash = hashParams.get("code")?.trim();
      if (fromHash) {
        return { code: fromHash, state: hashParams.get("state") };
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function parseAppleOAuthReturnUrl(
  url: string,
): { code: string; state: string | null } | null {
  const parsed = parseOAuthReturnUrl(url);
  if (!parsed) return null;
  try {
    const withScheme = url.includes("://") ? url : `https://${url}`;
    const pathname = new URL(withScheme).pathname.replace(/\/$/, "") || "/";
    if (pathname !== "/oauth/apple" && !pathname.endsWith("/oauth/apple")) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
