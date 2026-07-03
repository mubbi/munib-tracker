/**
 * Compact, collision-resistant id for locally created records. Avoids adding a
 * uuid dependency; good enough for single-device offline records that are keyed
 * by (entity, prayer/zikr, date) in practice.
 */
export function createId(prefix = "id"): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${time}${rand}`;
}
