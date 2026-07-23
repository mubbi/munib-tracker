/**
 * Lets the root TV back/menu policy ask the side rail to reclaim focus before
 * showing an exit confirm. Registered by {@link WideAppTabs} while mounted.
 */

type RailBackHandler = () => boolean;

let handler: RailBackHandler | null = null;

export function registerTvRailBackHandler(next: RailBackHandler | null): void {
  handler = next;
}

/** Returns true when the rail was collapsed and has now been expanded + focused. */
export function tryExpandTvRailOnBack(): boolean {
  return handler?.() ?? false;
}
