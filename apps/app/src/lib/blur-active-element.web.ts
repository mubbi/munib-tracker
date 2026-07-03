/**
 * Clears the currently focused DOM element. Called before route transitions on
 * web so React Navigation can mark the outgoing screen `aria-hidden` without
 * leaving focus trapped inside it (which triggers a browser a11y violation).
 */
export function blurActiveElement(): void {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
}
