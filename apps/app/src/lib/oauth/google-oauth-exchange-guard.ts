/**
 * Prevents exchanging the same Google authorization code twice
 * (oauth2redirect route + AuthSession response race).
 */

let lastExchangedAuthorizationCode: string | null = null;

const inFlightByCode = new Map<string, Promise<string>>();

export function shouldSkipGoogleAuthorizationCodeExchange(code: string): boolean {
  return lastExchangedAuthorizationCode === code;
}

export function clearGoogleAuthorizationCodeExchangeGuard(): void {
  lastExchangedAuthorizationCode = null;
  inFlightByCode.clear();
}

/**
 * Run Google code → access-token exchange once per authorization code;
 * concurrent callers share the same promise.
 */
export function getOrCreateGoogleOAuthExchange(
  code: string,
  start: () => Promise<string>,
): Promise<string | null> {
  if (shouldSkipGoogleAuthorizationCodeExchange(code)) {
    return Promise.resolve(null);
  }

  const existing = inFlightByCode.get(code);
  if (existing) return existing;

  const promise = start()
    .then((accessToken) => {
      lastExchangedAuthorizationCode = code;
      return accessToken;
    })
    .finally(() => {
      inFlightByCode.delete(code);
    });

  inFlightByCode.set(code, promise);
  return promise;
}
