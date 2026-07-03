/** No-op on native — DOM focus APIs don't exist. */
export function blurActiveElement(): void {
  return;
}
