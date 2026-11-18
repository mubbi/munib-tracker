/**
 * Apple TV (tvOS) shim for `expo-symbols`, wired by metro.config.js only when
 * `EXPO_TV=1` and the bundle platform is `ios`. Every `<SymbolView size>` in the
 * app is authored in Android-TV dp; tvOS lays out at 2× (1920×1080pt), so scale
 * the glyph box by TV_DENSITY here instead of touching ~140 call sites.
 *
 * Imports below resolve to the real package — the Metro resolver skips the shim
 * when the importer is this file.
 */
import { SymbolView as BaseSymbolView, type SymbolViewProps } from "expo-symbols";

import { TV_DENSITY } from "@/constants/tv-density";

export * from "expo-symbols";

/** expo-symbols' own default glyph box when `size` is omitted. */
const DEFAULT_SYMBOL_SIZE = 24;

export function SymbolView({ size, ...rest }: SymbolViewProps) {
  return <BaseSymbolView {...rest} size={(size ?? DEFAULT_SYMBOL_SIZE) * TV_DENSITY} />;
}
