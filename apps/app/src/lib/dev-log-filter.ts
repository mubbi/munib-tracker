/**
 * Dev-only console filter for known-noise React Native logs.
 *
 * VirtualizedList's "large list that is slow to update" log does not measure
 * render time — it measures the gap between consecutive scroll *events*
 * (`dt > 500 && prevDt > 500 && contentLength > 5 * visibleLength`). Any two
 * isolated scroll events (initial layout adjustment, reading-chrome collapse,
 * the first frame of a follow-scroll animation) spaced >500ms apart trip it,
 * even on a completely idle JS thread. Documented upstream false positive:
 * https://github.com/facebook/react-native/issues/32680 ("dt is exactly how
 * long I spend idle"). Genuine ayah-reader jank was fixed by moving playback /
 * word-by-word state into contexts; this filter drops the remaining noise.
 *
 * Arguments are sanitized before they reach the underlying console so credential
 * env names (e.g. App Store Connect issuer IDs) cannot be logged in clear text.
 */
const SUPPRESSED_LOG_PREFIXES = ["VirtualizedList: You have a large list that is slow to update"];

const SENSITIVE_ENV_NAME_PATTERN =
  /EXPO_ASC_API_KEY_ISSUER_ID|APP_STORE_CONNECT_API_ISSUER_ID|EXPO_ASC_ISSUER_ID|EXPO_ASC_API_KEY_ID|EXPO_ASC_KEY_ID|EXPO_ASC_API_KEY_PATH|APP_STORE_CONNECT_API_KEY_ID|APP_STORE_CONNECT_API_KEY_PATH|APP_STORE_CONNECT_APP_PASSWORD|SENTRY_AUTH_TOKEN/gi;

const SENSITIVE_OBJECT_KEY_PATTERN =
  /^(?:EXPO_ASC_API_KEY_ISSUER_ID|APP_STORE_CONNECT_API_ISSUER_ID|EXPO_ASC_ISSUER_ID|EXPO_ASC_API_KEY_ID|EXPO_ASC_KEY_ID|EXPO_ASC_API_KEY_PATH|APP_STORE_CONNECT_API_KEY_ID|APP_STORE_CONNECT_API_KEY_PATH|APP_STORE_CONNECT_APP_PASSWORD|SENTRY_AUTH_TOKEN|token|secret|password|passwd|authorization|api[_-]?key)$/i;

const REDACTED = "[REDACTED]";

function isPlainObject(value: object): value is Record<string, unknown> {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** Redact credential env names and secret-like object keys before logging. */
export function sanitizeLogValue(value: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
  if (typeof value === "string") {
    return value.replace(SENSITIVE_ENV_NAME_PATTERN, REDACTED);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLogValue(item, seen));
  }

  if (value && typeof value === "object" && isPlainObject(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = SENSITIVE_OBJECT_KEY_PATTERN.test(key) ? REDACTED : sanitizeLogValue(nested, seen);
    }
    return out;
  }

  return value;
}

export function sanitizeLogArgs(args: readonly unknown[]): unknown[] {
  return args.map((arg) => sanitizeLogValue(arg));
}

export function shouldSuppressDevLog(args: readonly unknown[]): boolean {
  const first = args[0];
  return (
    typeof first === "string" && SUPPRESSED_LOG_PREFIXES.some((prefix) => first.startsWith(prefix))
  );
}

if (__DEV__) {
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    if (shouldSuppressDevLog(args)) {
      return;
    }
    originalLog(...sanitizeLogArgs(args));
  };
}
