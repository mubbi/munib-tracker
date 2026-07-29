/**
 * Simple semantic version comparison (major.minor.patch).
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
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

export function isVersionLessThan(current: string, required: string): boolean {
  return compareVersions(current, required) < 0;
}
