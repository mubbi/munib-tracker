/**
 * Metro resolves `expo-quick-actions` here when `EXPO_TV=1`.
 * Home-screen shortcuts are phone-only.
 */

export type Action = {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: string;
  params?: Record<string, unknown>;
};

export const initial: Action | null = null;

export async function isSupported(): Promise<boolean> {
  return false;
}

export async function setItems(_items: Action[]): Promise<void> {}

export function addListener(_listener: (action: Action) => void): { remove: () => void } {
  return { remove: () => {} };
}
