/**
 * Non-hook write helpers for in-context shortcuts (reader toolbars, the audio
 * provider, TTS voice pickers). Every write still goes through the setting's
 * def (`write` + declared side effects) — the single-write test forbids feature
 * code from calling the pref stores' setters directly (§4.5.4).
 */
import { getSetting } from "./registry";
import { getSettingsSnapshot } from "./snapshot";
import type { AnySettingDef, SettingId } from "./types";
import { writeSetting } from "./use-setting";

function requireSetting(id: SettingId): AnySettingDef {
  const def = getSetting(id);
  if (!def) throw new Error(`Unknown setting: ${id}`);
  return def;
}

/** Current value of a setting (outside React). */
export function readSetting<V = unknown>(id: SettingId): V {
  return requireSetting(id).read(getSettingsSnapshot()) as V;
}

/** Write a setting by id through its def. */
export function setSetting<V>(id: SettingId, value: V): Promise<void> {
  return writeSetting(requireSetting(id), value);
}

/** Flip a boolean setting by id. */
export function toggleSetting(id: SettingId): Promise<void> {
  const def = requireSetting(id);
  return writeSetting(def, !def.read(getSettingsSnapshot()));
}
