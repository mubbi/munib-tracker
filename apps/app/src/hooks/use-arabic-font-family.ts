import { resolveArabicFontFamily } from "@/lib/reading-typography";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

/** Resolves the user's chosen Arabic typeface for `TextInput` and other non-ThemedText nodes. */
export function useArabicFontFamily(): string | undefined {
  const family = useStore(preferencesStore, (s) => s.prefs.fontPrefs.arabic.family);
  return resolveArabicFontFamily(family);
}
