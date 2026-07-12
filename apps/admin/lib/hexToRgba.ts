/** Convert #RRGGBB to rgba() — mirrors the Expo web chrome helper. */
export function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace(/^#/, "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) {
    return `rgba(46, 125, 50, ${alpha})`;
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
