/**
 * Simple semantic version comparison (major.minor.patch).
 * Returns: negative if a < b, 0 if equal, positive if a > b.
 */
export function compareVersions(a: string, b: string): number {
  const parse = (v: string): number[] => {
    const parts = v
      .replace(/^v/, "")
      .split(".")
      .map((p) => Number.parseInt(p, 10) || 0);
    return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
  };
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i++) {
    const aPart = pa[i] ?? 0;
    const bPart = pb[i] ?? 0;
    if (aPart !== bPart) return aPart - bPart;
  }
  return 0;
}

export function isVersionLessThan(current: string, required: string): boolean {
  return compareVersions(current, required) < 0;
}
