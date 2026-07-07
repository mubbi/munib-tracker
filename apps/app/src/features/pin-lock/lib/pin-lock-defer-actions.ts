/** Block deep links, quick actions, and sheets until PIN state is loaded and unlocked. */
export function shouldDeferActionsUntilPinUnlock(isReady: boolean, isLocked: boolean): boolean {
  return !isReady || isLocked;
}
