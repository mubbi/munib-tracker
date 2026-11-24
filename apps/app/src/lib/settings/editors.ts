import { type ComponentType, createElement, lazy } from "react";

import type { SettingId } from "./types";

type EditorProps = { settingId: SettingId };
type EditorsModule = typeof import("@/components/settings/editors");
export type EditorName = {
  [K in keyof EditorsModule]: EditorsModule[K] extends ComponentType<EditorProps> ? K : never;
}[keyof EditorsModule];

/**
 * Custom setting editors (`control.kind === "custom"`) load on demand from one
 * barrel, so the registry — imported by the hub, search and deep links — never
 * drags picker sheets, the Qur'an edition catalog or colour pickers into those
 * bundles. `SettingRow` renders them inside Suspense.
 *
 * Jest can't evaluate a native `import()` (see `settings/appearance` history), so
 * tests resolve the barrel synchronously at render time. The NODE_ENV ternary is
 * constant-folded by Metro before dependency collection, so the `require` never
 * reaches production bundles.
 */
const cache = new Map<EditorName, ComponentType<EditorProps>>();

export function editor(name: EditorName): ComponentType<EditorProps> {
  const cached = cache.get(name);
  if (cached) return cached;
  let component: ComponentType<EditorProps>;
  if (process.env.NODE_ENV === "test") {
    // biome-ignore lint/correctness/noComponentHookFactories: created once per editor name (cached above), test-only.
    const SyncEditor = (props: EditorProps) => {
      const mod = require("@/components/settings/editors") as EditorsModule;
      return createElement(mod[name] as ComponentType<EditorProps>, props);
    };
    SyncEditor.displayName = `SettingsEditor(${name})`;
    component = SyncEditor;
  } else {
    component = lazy(() =>
      import("@/components/settings/editors").then((m) => ({
        default: m[name] as ComponentType<EditorProps>,
      })),
    );
  }
  cache.set(name, component);
  return component;
}
