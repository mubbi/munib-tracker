import type { SymbolViewProps } from "expo-symbols";

/** Branded sentinel — use wherever the 99 Names feature needs an icon. */
export const NAMES_OF_ALLAH_ICON = { kind: "names-of-allah-glyph" } as const;
export type NamesOfAllahIcon = typeof NAMES_OF_ALLAH_ICON;

export type AppIcon = SymbolViewProps["name"] | NamesOfAllahIcon;

export const NAMES_OF_ALLAH_GLYPH = "الله";

export function isNamesOfAllahIcon(icon: AppIcon): icon is NamesOfAllahIcon {
  return (
    typeof icon === "object" &&
    icon !== null &&
    "kind" in icon &&
    icon.kind === "names-of-allah-glyph"
  );
}
