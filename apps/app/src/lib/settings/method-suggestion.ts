import { methodSuggestionKey } from "@/lib/prayer-method-suggestion";
import type { CalculationMethodKey } from "@/lib/prayer-times";
import { setDevicePreferences } from "@/stores/device-preferences-store";

import { getSetting } from "./registry";
import { writeSetting } from "./use-setting";

/** "Use this method": written through the registered setting (reschedules, marks reviewed). */
export async function acceptMethodSuggestion(method: CalculationMethodKey): Promise<void> {
  const def = getSetting("prayer-times.method");
  if (def) await writeSetting(def, method);
}

/** "Keep current": hide this suggestion for this country (a new country or method asks again). */
export function dismissMethodSuggestion(
  countryCode: string,
  method: CalculationMethodKey,
): Promise<void> {
  return setDevicePreferences({
    methodSuggestionDismissed: methodSuggestionKey(countryCode, method),
  });
}
