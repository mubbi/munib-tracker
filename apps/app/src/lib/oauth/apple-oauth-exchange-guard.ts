/**
 * Prevents exchanging the same Apple authorization code twice
 * (App Link route + AuthSession / Linking race).
 */

let lastExchangedAuthorizationCode: string | null = null;

const inFlightByCode = new Map<string, Promise<void>>();

export function shouldSkipAppleAuthorizationCodeExchange(code: string): boolean {
  return lastExchangedAuthorizationCode === code;
}

export function clearAppleAuthorizationCodeExchangeGuard(): void {
  lastExchangedAuthorizationCode = null;
  inFlightByCode.clear();
}

/**
 * Run Apple code → session exchange once per authorization code;
 * concurrent callers share the same promise.
 */
export function getOrCreateAppleOAuthExchange(
  code: string,
  start: () => Promise<void>,
  // biome-ignore lint/suspicious/noConfusingVoidType: null = skipped, void = exchanged
): Promise<void | null> {
  if (shouldSkipAppleAuthorizationCodeExchange(code)) {
    return Promise.resolve(null);
  }

  const existing = inFlightByCode.get(code);
  if (existing) return existing;

  const promise = start()
    .then(() => {
      lastExchangedAuthorizationCode = code;
    })
    .finally(() => {
      inFlightByCode.delete(code);
    });

  inFlightByCode.set(code, promise);
  return promise;
}
