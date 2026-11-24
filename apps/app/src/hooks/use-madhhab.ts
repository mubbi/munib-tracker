import {
  type FiqhDomain,
  type FiqhPreferences,
  globalSchool,
  type MadhhabId,
  type MadhhabRules,
  type ResolvedFiqh,
  resolveFiqh,
  resolveSchool,
  rulesFor,
} from "@munib-tracker/shared/fiqh/core";
import { useMemo } from "react";

import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

export interface MadhhabState {
  /** Global school; `null` = show all views; `undefined` = never asked (or a malformed synced value). */
  madhhab: MadhhabId | null | undefined;
  /** School governing `domain` (domain override > global); `null` ⇒ show all views. */
  schoolFor: (domain: FiqhDomain) => MadhhabId | null;
  /** That school's rules with the user's custom values applied; `null` ⇒ show all views. */
  rules: (domain: FiqhDomain) => MadhhabRules | null;
  /** Full resolution (school, rules, override flag, custom keys) for calculators. */
  resolve: (domain: FiqhDomain) => ResolvedFiqh;
  /** No global school chosen (explicit "Show all views" or never asked). */
  isAllViews: boolean;
  /** Never asked — drives the onboarding step, home card and lazy sheet. */
  isUnset: boolean;
}

/**
 * The user's fiqh school (NF-3.0a). Subscribes only to the three fiqh fields,
 * so unrelated preference edits don't re-render consumers.
 */
export function useMadhhab(): MadhhabState {
  const madhhab = useStore(preferencesStore, (s) => s.prefs.madhhab);
  const madhhabOverrides = useStore(preferencesStore, (s) => s.prefs.madhhabOverrides);
  const fiqhCustom = useStore(preferencesStore, (s) => s.prefs.fiqhCustom);

  return useMemo(() => {
    const prefs: FiqhPreferences = { madhhab, madhhabOverrides, fiqhCustom };
    const global = globalSchool(prefs);
    return {
      madhhab: global,
      schoolFor: (domain) => resolveSchool(prefs, domain),
      rules: (domain) => rulesFor(prefs, domain),
      resolve: (domain) => resolveFiqh(prefs, domain),
      isAllViews: global == null,
      isUnset: global === undefined,
    };
  }, [madhhab, madhhabOverrides, fiqhCustom]);
}

/** Convenience: the school governing one domain (e.g. `useMadhhabFor("zakat")`). */
export function useMadhhabFor(domain: FiqhDomain): MadhhabId | null {
  return useMadhhab().schoolFor(domain);
}
