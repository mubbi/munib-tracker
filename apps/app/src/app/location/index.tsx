import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type LocationSearchResult, searchLocations } from "@/lib/location";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  CALCULATION_METHOD_KEYS,
  type CalculationMethodKey,
  type MadhabKey,
} from "@/lib/prayer-times";
import { useChevronForward } from "@/lib/rtl";
import { rescheduleAll } from "@/notifications/scheduler";
import {
  locationStore,
  useLocation,
  useLocationActions,
  useLocationStatus,
} from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";

const DEBOUNCE_MS = 300;
/** Languages the Open-Meteo geocoder understands; anything else falls back to English names. */
const GEOCODER_LANGS = new Set(["en", "de", "fr", "es", "it", "pt", "ru", "tr", "hi"]);

/**
 * Location picker: lets the user search any city/country via the open Open-Meteo
 * geocoder and set it as their location, or fall back to a fresh GPS fix. A
 * manual choice sticks — background GPS refreshes won't overwrite it (see
 * `location-store`), so a denied/wrong device fix never traps the user with the
 * wrong prayer times.
 */
export default function LocationScreen() {
  const router = useRouter();
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
  const [methodSheetOpen, setMethodSheetOpen] = useState(false);

  // Changing the method/madhab re-derives every computed prayer time, so the
  // scheduled reminders must be rebuilt to match (no-op on web).
  const reschedule = () =>
    rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);

  const onSelectMethod = async (key: CalculationMethodKey) => {
    setMethodSheetOpen(false);
    await actions.setMethod(key);
    await reschedule();
  };

  const onSelectMadhab = async (key: MadhabKey) => {
    if (key === location.madhab) return;
    await actions.setMadhab(key);
    await reschedule();
  };

  const lang = useMemo(() => {
    const base = i18n.language?.split("-")[0] ?? "en";
    return GEOCODER_LANGS.has(base) ? base : "en";
  }, [i18n.language]);

  const locating = status === "loading";
  const trimmed = query.trim();

  // Debounced, cancellable forward-geocode. An AbortController drops stale
  // in-flight requests so results never arrive out of order.
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
    if (next.status === "ready" && next.location.source === "device") {
      goBackOrReplace(router, "/");
    } else if (next.status === "denied") {
      setGpsError("denied");
    } else if (next.status === "error") {
      setGpsError("error");
    }
  };

  const onSelect = async (place: LocationSearchResult) => {
    await actions.setManualLocation(place);
    goBackOrReplace(router, "/");
  };

  const showEmpty = !searching && trimmed.length >= 2 && results.length === 0;
  const sourceBadge =
    location.source === "manual"
      ? t("location.manualBadge")
      : location.source === "device"
        ? t("location.gpsBadge")
        : t("location.defaultBadge");

  return (
    <ScreenLayout
      eyebrow={t("location.eyebrow")}
      title={t("location.title")}
      subtitle={t("location.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/location" />
      <Card>
        <View style={styles.currentHeader}>
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
            disabled={locating}
            onPress={onUseCurrent}
            style={styles.useCurrent}
          />
        ) : null}
        {!tv && locating ? (
          <View style={styles.gpsStatus}>
            <ActivityIndicator size="small" color={colors.accent} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("location.locating")}
            </ThemedText>
          </View>
        ) : !tv && gpsError ? (
          <ThemedText
            type="caption"
            style={[styles.gpsError, { color: tokens.status.danger.color }]}
          >
            {gpsError === "denied" ? t("location.permissionDenied") : t("location.deviceError")}
          </ThemedText>
        ) : null}
      </Card>

      <Card padding="three">
        <View style={[styles.searchBox, { backgroundColor: colors.muted }]}>
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={17}
            tintColor={colors.mutedForeground}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("location.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("location.searchLabel")}
            autoFocus={!tv}
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.input, { color: colors.foreground }]}
          />
          {searching ? <ActivityIndicator size="small" color={colors.accent} /> : null}
        </View>

        {showEmpty ? (
          <EmptyState
            icon={{ ios: "mappin.slash", android: "wrong_location", web: "wrong_location" }}
            title={t("location.noResultsTitle")}
            description={t("location.noResultsDesc")}
          />
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
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("location.hint")}
          </ThemedText>
        )}
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("location.calculationTitle")}
          icon={{ ios: "gearshape.fill", android: "tune", web: "tune" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.calcHint}>
          {t("location.methodHint")}
        </ThemedText>
        <View style={styles.calcRow}>
          <SettingsRow
            icon={{ ios: "globe", android: "public", web: "public" }}
            title={t("location.method")}
            value={t(`location.methods.${location.method}`)}
            onPress={() => setMethodSheetOpen(true)}
          />
        </View>

        <ThemedText type="smallBold" style={styles.madhabLabel}>
          {t("location.madhab")}
        </ThemedText>
        <SegmentedControl<MadhabKey>
          options={[
            { id: "shafi", label: t("location.madhabShafi") },
            { id: "hanafi", label: t("location.madhabHanafi") },
          ]}
          value={location.madhab}
          onChange={(key) => void onSelectMadhab(key)}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.calcHint}>
          {t("location.madhabHint")}
        </ThemedText>

        <View style={styles.calcRow}>
          <SettingsRow
            icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
            title={t("prayerTuning.title")}
            value={t("prayerTuning.rowValue")}
            onPress={() => router.push("/settings/prayer-tuning")}
          />
        </View>
      </Card>

      <Sheet visible={methodSheetOpen} onClose={() => setMethodSheetOpen(false)} variant="bottom">
        <ThemedText type="subtitle" style={styles.sheetTitle}>
          {t("location.method")}
        </ThemedText>
        <TvScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetList}
          showsVerticalScrollIndicator={false}
        >
          {CALCULATION_METHOD_KEYS.map((key) => {
            const selected = key === location.method;
            return (
              <PressableScale
                key={key}
                haptic="selection"
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={t(`location.methods.${key}`)}
                onPress={() => void onSelectMethod(key)}
                style={[
                  styles.methodRow,
                  { backgroundColor: selected ? tokens.accentSoft : colors.muted },
                ]}
              >
                <View style={styles.methodText}>
                  <ThemedText type="small">{t(`location.methods.${key}`)}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t(`location.methodHints.${key}`)}
                  </ThemedText>
                </View>
                {selected ? (
                  <SymbolView
                    name={{
                      ios: "checkmark.circle.fill",
                      android: "check_circle",
                      web: "check_circle",
                    }}
                    size={22}
                    tintColor={colors.accent}
                  />
                ) : null}
              </PressableScale>
            );
          })}
        </TvScrollView>
      </Sheet>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  currentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  pin: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  currentText: { flex: 1, gap: 2 },
  useCurrent: { marginTop: Spacing.three },
  gpsStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  gpsError: { marginTop: Spacing.two },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  hint: { marginTop: Spacing.three },
  calcHint: { marginTop: Spacing.two },
  calcRow: { marginTop: Spacing.three },
  madhabLabel: { marginTop: Spacing.four, marginBottom: Spacing.three },
  sheetTitle: { marginBottom: Spacing.two },
  sheetScroll: { alignSelf: "stretch" },
  sheetList: { gap: Spacing.two, paddingBottom: Spacing.two },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  methodText: { flex: 1, gap: 2 },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowText: { flex: 1, gap: 2 },
});
