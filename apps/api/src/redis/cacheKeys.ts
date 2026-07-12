/** Namespace prefix for all Redis keys (isolate prod/dev/local). */
export function redisNamespace(): string {
  const segment = process.env.REDIS_KEY_PREFIX?.trim() || process.env.NODE_ENV || "development";
  return `mt:${segment}`;
}
