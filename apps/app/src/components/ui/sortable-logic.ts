/**
 * Pure geometry + ordering for `ui/sortable.tsx`. Every function is a worklet so
 * the drag can run on the UI thread; they are plain functions in Jest.
 *
 * Coordinates are **logical**: `x` grows from the layout's start edge (left in
 * LTR, right in RTL) so the same maths serves both directions. The component
 * converts to physical transforms.
 */

/** Moves the item at `from` to `to` (both clamped); returns a new array. */
export function moveTo<T>(order: readonly T[], from: number, to: number): T[] {
  "worklet";
  const next = order.slice();
  if (from < 0 || from >= next.length) return next;
  const target = Math.max(0, Math.min(next.length - 1, to));
  const [item] = next.splice(from, 1);
  next.splice(target, 0, item as T);
  return next;
}

/** `ids` → `{ id: index }`. */
export function indexMap(ids: readonly string[]): Record<string, number> {
  "worklet";
  const map: Record<string, number> = {};
  for (let i = 0; i < ids.length; i += 1) map[ids[i] as string] = i;
  return map;
}

/** Ids sorted by their current slot. */
export function orderFromPositions(positions: Record<string, number>): string[] {
  "worklet";
  return Object.keys(positions).sort((a, b) => (positions[a] ?? 0) - (positions[b] ?? 0));
}

/** Moves `id` to `to` within a positions map, shifting the others; returns a new map. */
export function movePosition(
  positions: Record<string, number>,
  id: string,
  to: number,
): Record<string, number> {
  "worklet";
  const order = orderFromPositions(positions);
  const from = order.indexOf(id);
  return indexMap(moveTo(order, from, to));
}

export type GridMetrics = {
  columns: number;
  /** Cell width including its share of the column gap is `cellWidth + columnGap`. */
  cellWidth: number;
  rowHeight: number;
  columnGap: number;
  rowGap: number;
};

/** Logical top-start corner of grid slot `index`. */
export function gridSlotOrigin(index: number, m: GridMetrics): { x: number; y: number } {
  "worklet";
  const col = index % m.columns;
  const row = Math.floor(index / m.columns);
  return { x: col * (m.cellWidth + m.columnGap), y: row * (m.rowHeight + m.rowGap) };
}

/** Slot under the centre of a cell whose top-start corner sits at (`x`, `y`). */
export function gridSlotAt(x: number, y: number, count: number, m: GridMetrics): number {
  "worklet";
  if (count <= 0) return 0;
  const cx = x + m.cellWidth / 2;
  const cy = y + m.rowHeight / 2;
  const col = Math.max(0, Math.min(m.columns - 1, Math.floor(cx / (m.cellWidth + m.columnGap))));
  const rows = Math.ceil(count / m.columns);
  const row = Math.max(0, Math.min(rows - 1, Math.floor(cy / (m.rowHeight + m.rowGap))));
  return Math.max(0, Math.min(count - 1, row * m.columns + col));
}

/** Grid container height for `count` cells. */
export function gridHeight(count: number, m: GridMetrics): number {
  "worklet";
  const rows = Math.ceil(count / Math.max(1, m.columns));
  return rows <= 0 ? 0 : rows * m.rowHeight + (rows - 1) * m.rowGap;
}

/**
 * Top offset of every id in a vertical list laid out in `positions` order, with
 * each row's measured height (`fallback` until measured) and `gap` between rows.
 */
export function listOffsets(
  positions: Record<string, number>,
  heights: Record<string, number>,
  fallback: number,
  gap: number,
): Record<string, number> {
  "worklet";
  const order = orderFromPositions(positions);
  const tops: Record<string, number> = {};
  let y = 0;
  for (const id of order) {
    tops[id] = y;
    y += (heights[id] ?? fallback) + gap;
  }
  return tops;
}

/** Total list height (no trailing gap). */
export function listHeight(
  ids: readonly string[],
  heights: Record<string, number>,
  fallback: number,
  gap: number,
): number {
  "worklet";
  let y = 0;
  for (const id of ids) y += (heights[id] ?? fallback) + gap;
  return ids.length > 0 ? y - gap : 0;
}

/**
 * The slot a dragged list row belongs in: the index `k` whose top (with the row
 * removed and re-inserted at `k`) is closest to the row's dragged `top`.
 */
export function listSlotAt(
  activeId: string,
  top: number,
  positions: Record<string, number>,
  heights: Record<string, number>,
  fallback: number,
  gap: number,
): number {
  "worklet";
  const others = orderFromPositions(positions).filter((id) => id !== activeId);
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  let slotTop = 0;
  for (let k = 0; k <= others.length; k += 1) {
    const distance = Math.abs(slotTop - top);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = k;
    }
    const other = others[k];
    if (other != null) slotTop += (heights[other] ?? fallback) + gap;
  }
  return best;
}

/**
 * Keyboard / accessibility move: the new index for a grid step. `dx` is ±1
 * (earlier / later in reading order, already direction-resolved), `dy` ±1 row.
 */
export function gridStep(index: number, count: number, columns: number, dx: number, dy: number) {
  "worklet";
  const next = index + dx + dy * columns;
  return Math.max(0, Math.min(count - 1, next));
}
