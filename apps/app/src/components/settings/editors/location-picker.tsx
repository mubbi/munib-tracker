import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { type LocationSearchResult, searchLocations } from "@/lib/location";
import { isTV } from "@/lib/platform/is-tv";
import { canOpenAppSettings, openAppSettings } from "@/lib/quran-companion/open-app-settings";
import { useChevronForward } from "@/lib/rtl";
import { runSideEffects } from "@/lib/settings/side-effects";
import {
  locationStore,
  useLocation,
  useLocationActions,
  useLocationStatus,
} from "@/stores/location-store";

const DEBOUNCE_MS = 300;
/** Languages the Open-Meteo geocoder understands; anything else falls back to English names. */
const GEOCODER_LANGS = new Set(["en", "de", "fr", "es", "it", "pt", "ru", "tr", "hi"]);

/**
 * Current place, "use my location" and city search (moved from `/location`,
 * which now redirects here). A manual choice sticks: background GPS refreshes
 * never overwrite it (`location-store`).
 */
export function LocationPicker() {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const location = useLocation();
  const status = useLocationStatus();
  const actions = useLocationActions();
  const tv = isTV();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [gpsError, setGpsError] = useState<"denied" | "error" | null>(null);

  const lang = useMemo(() => {
    const base = i18n.language?.split("-")[0] ?? "en";
    return GEOCODER_LANGS.has(base) ? base : "en";
  }, [i18n.language]);

  const locating = status === "loading";
  const trimmed = query.trim();

  // Debounced, cancellable forward-geocode; stale requests are aborted.
  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      const found = await searchLocations(trimmed, lang, controller.signal);
      if (controller.signal.aborted) return;
      setResults(found);
      setSearching(false);
    }, DEBOUNCE_MS);
    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [trimmed, lang]);

  const onUseCurrent = async () => {
    setGpsError(null);
    await actions.requestDeviceLocation();
    const next = locationStore.getState();
    if (next.status === "denied") setGpsError("denied");
    else if (next.status === "error") setGpsError("error");
    else await runSideEffects(["refresh-prayer-times"]);
  };

  const onSelect = async (place: LocationSearchResult) => {
    await actions.setManualLocation(place);
    setQuery("");
    setResults([]);
    await runSideEffects(["refresh-prayer-times"]);
  };

  const sourceBadge =
    location.source === "manual"
      ? t("location.manualBadge")
      : location.source === "device"
        ? t("location.gpsBadge")
        : t("location.defaultBadge");
  const showEmpty = !searching && trimmed.length >= 2 && results.length === 0;

  return (
    <View style={styles.stack}>
      <View style={[styles.current, { backgroundColor: colors.muted }]}>
        <View style={[styles.pin, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "location.fill", android: "location_on", web: "location_on" }}
            size={18}
            tintColor={colors.accent}
          />
        </View>
        <View style={styles.currentText}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {location.label}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("location.currentTitle")}
          </ThemedText>
        </View>
        <Pill label={sourceBadge} color={colors.accent} background={tokens.accentSoft} />
      </View>

      {!tv ? (
        <Button
          label={locating ? t("location.locating") : t("location.useCurrent")}
          icon={{ ios: "location.circle.fill", android: "my_location", web: "my_location" }}
          variant="secondary"
          fullWidth
          loading={locating}
          onPress={() => void onUseCurrent()}
        />
      ) : null}
      {!tv && !locating && gpsError === "denied" ? (
        // D-20: same recovery as the notification banner — one tap to the OS settings.
        <Callout
          tone="warning"
          title={t("location.permissionDeniedTitle")}
          action={
            canOpenAppSettings()
              ? { label: t("location.openSettings"), onPress: () => void openAppSettings() }
              : undefined
          }
        >
          {t("location.permissionDeniedBody")}
        </Callout>
      ) : !tv && !locating && gpsError === "error" ? (
        <Callout
          tone="danger"
          action={{ label: t("common.tryAgain"), onPress: () => void onUseCurrent() }}
        >
          {t("location.deviceErrorBody")}
        </Callout>
      ) : null}

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t("location.searchPlaceholder")}
      />
      {searching ? <SkeletonPlaceholder preset="rows" count={2} /> : null}
      {showEmpty ? (
        <View style={styles.empty}>
          <ThemedText type="smallBold">{t("location.noResultsTitle")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("location.noResultsDesc")}
          </ThemedText>
        </View>
      ) : results.length > 0 ? (
        <View style={styles.list}>
          {results.map((place) => {
            const selected = place.label === location.label;
            const subtitle = [place.admin, place.country].filter(Boolean).join(", ");
            return (
              <PressableScale
                key={place.id}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={place.label}
                accessibilityState={{ selected }}
                onPress={() => void onSelect(place)}
                style={[
                  styles.row,
                  tv ? { minHeight: TvLayout.minFocusTarget } : null,
                  { backgroundColor: colors.muted },
                ]}
              >
                <View style={styles.rowText}>
                  <ThemedText type="smallBold" numberOfLines={1}>
                    {place.name}
                  </ThemedText>
                  {subtitle ? (
                    <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                      {subtitle}
                    </ThemedText>
                  ) : null}
                </View>
                <SymbolView
                  name={
                    selected
                      ? {
                          ios: "checkmark.circle.fill",
                          android: "check_circle",
                          web: "check_circle",
                        }
                      : chevronForward
                  }
                  size={selected ? 20 : 15}
                  tintColor={selected ? colors.accent : colors.mutedForeground}
                />
              </PressableScale>
            );
          })}
        </View>
      ) : (
        <ThemedText type="caption" themeColor="mutedForeground">
          {tTv(t, "location.hint", "location.hintTv")}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  current: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  pin: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  currentText: { flex: 1, gap: Spacing.half },
  empty: { gap: Spacing.half },
  list: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowText: { flex: 1, gap: Spacing.half },
});
