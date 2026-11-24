import { useShowDhulHijjahCard } from "@/components/dhul-hijjah/dhul-hijjah-home-card";
import { useEnsureSunnahHabitsLoaded, useSunnahHabitsReady } from "@/stores/sunnah-habits-store";

/** Home module ids (`hiddenHomeModules`) for NF-3.5 and NF-3.3. */
export const SUNNAH_HABITS_HOME_MODULE = "sunnah-habits";
export const DHUL_HIJJAH_HOME_MODULE = "dhul-hijjah";

/**
 * Whether the Sunnah habits and Dhul-Hijjah home cards should mount — gated
 * before Stagger wraps them (a null child still takes a flex `gap` slot).
 */
export function useSeasonalHomeCards(hidden: ReadonlySet<string>): {
  showHabits: boolean;
  showDhulHijjah: boolean;
} {
  useEnsureSunnahHabitsLoaded();
  const habitsReady = useSunnahHabitsReady();
  const dhulHijjahSeason = useShowDhulHijjahCard();
  return {
    showHabits: habitsReady && !hidden.has(SUNNAH_HABITS_HOME_MODULE),
    showDhulHijjah: dhulHijjahSeason && !hidden.has(DHUL_HIJJAH_HOME_MODULE),
  };
}
