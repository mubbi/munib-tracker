import {
  isWitrQazaEnabled,
  type RawatibConfig,
  type RawatibTravelMode,
  resolveRawatibConfig,
  travelRawatibMode,
  witrQazaDefault,
} from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * The user's rawatib setup (NF-3.1, D8). Subscribes only to the fields it reads
 * so unrelated preference edits don't re-render the tracker chips.
 */
export function useRawatibConfig(): RawatibConfig {
  const madhhab = useStore(preferencesStore, (s) => s.prefs.madhhab);
  const madhhabOverrides = useStore(preferencesStore, (s) => s.prefs.madhhabOverrides);
  const fiqhCustom = useStore(preferencesStore, (s) => s.prefs.fiqhCustom);
  const rawatib = useStore(preferencesStore, (s) => s.prefs.rawatib);
  return useMemo(
    () => resolveRawatibConfig({ madhhab, madhhabOverrides, fiqhCustom, rawatib }),
    [madhhab, madhhabOverrides, fiqhCustom, rawatib],
  );
}

/** The travel rule for rawatib in the school governing travel (`null` ⇒ all views). */
export function useTravelRawatibMode(): RawatibTravelMode | null {
  const madhhab = useStore(preferencesStore, (s) => s.prefs.madhhab);
  const madhhabOverrides = useStore(preferencesStore, (s) => s.prefs.madhhabOverrides);
  return useMemo(
    () => travelRawatibMode({ madhhab, madhhabOverrides }),
    [madhhab, madhhabOverrides],
  );
}

export interface WitrQazaState {
  /** Marking Witr missed offers to add it to qaza. */
  enabled: boolean;
  /** The school default (on only for Hanafi; on with no school, as before). */
  schoolDefault: boolean;
  /** True when the user picked explicitly (not following the default). */
  isCustom: boolean;
}

/** Witr qaza accrual (§4.1.4 retrofit). */
export function useWitrQaza(): WitrQazaState {
  const madhhab = useStore(preferencesStore, (s) => s.prefs.madhhab);
  const madhhabOverrides = useStore(preferencesStore, (s) => s.prefs.madhhabOverrides);
  const witrQaza = useStore(preferencesStore, (s) => s.prefs.witrQaza);
  return useMemo(() => {
    const prefs = { madhhab, madhhabOverrides, witrQaza };
    return {
      enabled: isWitrQazaEnabled(prefs),
      schoolDefault: witrQazaDefault(prefs),
      isCustom: typeof witrQaza === "boolean",
    };
  }, [madhhab, madhhabOverrides, witrQaza]);
}
