import { getPlatformCtx } from "./platform";
import {
  isAtDefault,
  isSettingAvailable,
  isSettingResettable,
  resolveDefault,
  SETTINGS_REGISTRY,
  settingsForGroup,
} from "./registry";
import type { SettingsGroupId } from "./routes";
import { runSideEffects } from "./side-effects";
import { getSettingsSnapshot } from "./snapshot";
import type { AnySettingDef, PlatformCtx, SettingSideEffect } from "./types";

/** Resettable defs whose current value differs from the default (what a reset would change). */
export function changedSettings(defs: readonly AnySettingDef[]): AnySettingDef[] {
  const snapshot = getSettingsSnapshot();
  return defs.filter((def) => isSettingResettable(def) && !isAtDefault(def, snapshot));
}

/**
 * Write each def's default (§4.5.7). Only settings change — logs, bookmarks,
 * notes and progress are never touched. Side effects run once at the end.
 */
export async function resetSettings(defs: readonly AnySettingDef[]): Promise<AnySettingDef[]> {
  const changed = changedSettings(defs);
  const effects = new Set<SettingSideEffect>();
  for (const def of changed) {
    // Re-read the snapshot per def: an earlier write can change a derived default.
    await def.write(resolveDefault(def, getSettingsSnapshot()));
    for (const effect of def.sideEffects ?? []) effects.add(effect);
  }
  await runSideEffects([...effects]);
  return changed;
}

/** Group section → "Reset to defaults". */
export function resetSection(
  group: SettingsGroupId,
  sectionKey: string,
  ctx: PlatformCtx = getPlatformCtx(),
): Promise<AnySettingDef[]> {
  return resetSettings(settingsForGroup(group, ctx).filter((def) => def.section === sectionKey));
}

/** Data & storage → "Reset settings to defaults" (keeps all user data). */
export function resetAllSettings(ctx: PlatformCtx = getPlatformCtx()): Promise<AnySettingDef[]> {
  return resetSettings(SETTINGS_REGISTRY.filter((def) => isSettingAvailable(def, ctx)));
}
