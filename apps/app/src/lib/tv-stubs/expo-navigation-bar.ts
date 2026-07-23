/**
 * Metro resolves `expo-navigation-bar` here when `EXPO_TV=1`.
 * Android system nav bar APIs — no-op on TV.
 */
import type { ReactElement } from "react";

export function NavigationBar(_props: { hidden?: boolean }): ReactElement | null {
  return null;
}

export async function setVisibilityAsync(_visibility: string): Promise<void> {}

export async function setBackgroundColorAsync(_color: string): Promise<void> {}

export async function setButtonStyleAsync(_style: string): Promise<void> {}

export default {
  NavigationBar,
  setVisibilityAsync,
  setBackgroundColorAsync,
  setButtonStyleAsync,
};
