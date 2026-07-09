/**
 * When to run periodic GET /version/meta (logged-out or offline).
 * Mount + refocus checks always run — see useAppVersionBackgroundSync.
 */

export interface AppVersionBackgroundCheckInput {
  isLoggedIn: boolean;
  isOnline: boolean;
}

/**
 * Periodic poll (every 30 min) when routine API traffic is unlikely to carry version headers.
 *
 * | Logged in | Online | Periodic poll |
 * |-----------|--------|---------------|
 * | No        | —      | Yes           |
 * | Yes       | No     | Yes           |
 * | Yes       | Yes    | No (headers on API calls) |
 */
export function needsExplicitVersionPolling(input: AppVersionBackgroundCheckInput): boolean {
  if (!input.isLoggedIn) return true;
  if (!input.isOnline) return true;
  return false;
}
