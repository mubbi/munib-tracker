import {
  type ActiveSeasonalBanner,
  currentSeasonalBanner,
  SEASONAL_BANNER_HOME_MODULE,
} from "@/lib/seasonal-themes";
import { useLocation } from "@/stores/location-store";
import {
  useEnsureSeasonalBannerLoaded,
  useSeasonalBannerDismissed,
  useSeasonalBannerReady,
} from "@/stores/seasonal-banner-store";

/**
 * The home seasonal banner to show right now, or null — out of season, turned
 * off in Customize home (`seasonal-banner`), or hidden "for this season" on this
 * device. Waits for the dismissal list so a hidden banner never flashes in.
 * Gate on this before `Stagger` wraps the banner (a null child still takes a gap).
 */
export function useSeasonalBanner(hidden: ReadonlySet<string>): ActiveSeasonalBanner | null {
  useEnsureSeasonalBannerLoaded();
  const ready = useSeasonalBannerReady();
  const dismissed = useSeasonalBannerDismissed();
  const location = useLocation();
  if (!ready || hidden.has(SEASONAL_BANNER_HOME_MODULE)) return null;
  const banner = currentSeasonalBanner(new Date(), location.timeZone);
  if (!banner || dismissed.includes(banner.dismissKey)) return null;
  return banner;
}
