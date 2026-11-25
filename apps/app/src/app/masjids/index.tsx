import {
  type HomeMasjid,
  type MasjidSummary,
  masjidDisplayName,
  masjidKey,
  sortByDistance,
} from "@munib-tracker/shared/masjid";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MasjidEvidence } from "@/components/masjid/masjid-evidence";
import { MasjidListSkeleton } from "@/components/masjid/masjid-list-skeleton";
import { MasjidMap } from "@/components/masjid/masjid-map";
import { MasjidRow } from "@/components/masjid/masjid-row";
import { openDirections } from "@/components/masjid/open-directions";
import { OsmAttribution } from "@/components/masjid/osm-attribution";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";
import { getCurrentCoordinates } from "@/lib/location";
import { cellFor, fetchMasjidList, MasjidApiError, type MasjidListResult } from "@/lib/masjid/api";
import { setHomeMasjid, useHomeMasjid } from "@/lib/masjid/home-masjid";
import type { MasjidMapPoint } from "@/lib/masjid/map-html";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";
import { useLocation, useLocationStatus } from "@/stores/location-store";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; result: MasjidListResult }
  | { status: "error"; kind: MasjidApiError["kind"] };

/** First page of nearby masjids; "Show more" adds the same again (OSM can return hundreds). */
export const MASJID_PAGE_SIZE = 15;
/** Map view height — tall enough to read the neighbourhood, short enough to show the selected card. */
const MAP_HEIGHT = 360;

function detailHref(m: { osmType: string; osmId: string }): Href {
  return {
    pathname: "/masjids/[osmType]/[osmId]",
    params: { osmType: m.osmType, osmId: m.osmId },
  } as Href;
}

function toHome(m: MasjidSummary, name: string | undefined): HomeMasjid {
  const home: HomeMasjid = { osmType: m.osmType, osmId: m.osmId, lat: m.lat, lon: m.lon };
  if (name) home.name = name;
  return home;
}

/** Where the search is centred: `pending` while the first silent fix is in flight. */
type Fix = { latitude: number; longitude: number } | "pending" | null;

/**
 * Masjid finder (NF-3.11, D5), list-first: nearby masjids from OpenStreetMap
 * sorted by exact distance on-device. Only the ~5 km geohash cell is sent to
 * the API. Centred on where the device is now (a one-off fix that is never
 * stored, so a hand-picked Salah-times city is left alone); the saved location
 * is the fallback when there's no permission or fix. TV is read-only (no
 * directions / home selection) and has no GPS.
 */
function MasjidFinder() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const tv = isTV();
  const location = useLocation();
  const locationStatus = useLocationStatus();
  const home = useHomeMasjid();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(MASJID_PAGE_SIZE);

  // Silent fix on open (no prompt): only when permission was already granted.
  const [fix, setFix] = useState<Fix>(tv ? null : "pending");
  useEffect(() => {
    if (tv) return;
    let alive = true;
    void getCurrentCoordinates(false).then((result) => {
      if (alive) setFix(result.status === "ok" ? result : null);
    });
    return () => {
      alive = false;
    };
  }, [tv]);

  /** "Use my location" — asks for permission on this tap; never changes the saved location. */
  const locateMe = useCallback(async () => {
    setFix("pending");
    const result = await getCurrentCoordinates(true);
    if (result.status === "ok") {
      setFix(result);
      return;
    }
    setFix(null);
    toast.error(
      result.status === "denied" ? t("masjids.locationDenied") : t("masjids.locationFixFailed"),
    );
  }, [t, toast]);

  const here = fix !== null && fix !== "pending" ? fix : null;
  const nearYou = here !== null;
  const hasSavedLocation = location.source !== "default";
  const originLat = here
    ? here.latitude
    : fix === null && hasSavedLocation
      ? location.latitude
      : null;
  const originLon = here
    ? here.longitude
    : fix === null && hasSavedLocation
      ? location.longitude
      : null;
  // Stable identity: the map document is rebuilt (and reloaded) only when the origin moves.
  const origin = useMemo(
    () => (originLat !== null && originLon !== null ? { lat: originLat, lon: originLon } : null),
    [originLat, originLon],
  );
  const cell = origin ? cellFor(origin.lat, origin.lon) : null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: reloadKey re-runs the fetch on "Try again".
  useEffect(() => {
    if (!cell) return;
    const controller = new AbortController();
    setState({ status: "loading" });
    setVisibleCount(MASJID_PAGE_SIZE);
    fetchMasjidList(cell, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setState({ status: "ready", result });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          kind: error instanceof MasjidApiError ? error.kind : "unavailable",
        });
      });
    return () => controller.abort();
  }, [cell, reloadKey]);

  const sorted = useMemo(
    () =>
      state.status === "ready"
        ? sortByDistance(state.result.masjids, {
            lat: origin?.lat ?? location.latitude,
            lon: origin?.lon ?? location.longitude,
          })
        : [],
    [state, origin?.lat, origin?.lon, location.latitude, location.longitude],
  );

  const homeKey = home ? masjidKey(home) : null;

  // Stable row callbacks (rows are memoised; each handler receives its masjid).
  const onSetHome = useCallback(
    (m: MasjidSummary) => {
      const name = masjidDisplayName(m, i18n.language);
      void setHomeMasjid(toHome(m, name)).then(() =>
        toast.success(t("masjids.homeSetToast", { name: name ?? t("masjids.unnamed") })),
      );
    },
    [i18n.language, t, toast],
  );
  const onOpen = useCallback((m: MasjidSummary) => router.push(detailHref(m)), [router]);
  const onDirections = useCallback(
    (m: MasjidSummary) =>
      void openDirections({ lat: m.lat, lon: m.lon, name: masjidDisplayName(m, i18n.language) }),
    [i18n.language],
  );
  const visible = useMemo(() => sorted.slice(0, visibleCount), [sorted, visibleCount]);

  const [view, setView] = useState<"list" | "map">("list");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const mapPoints = useMemo<MasjidMapPoint[]>(
    () =>
      sorted.map((m) => ({
        key: masjidKey(m),
        lat: m.lat,
        lon: m.lon,
        name: masjidDisplayName(m, i18n.language) ?? t("masjids.unnamed"),
        home: masjidKey(m) === homeKey,
      })),
    [sorted, i18n.language, t, homeKey],
  );
  const selected = selectedKey ? sorted.find((m) => masjidKey(m) === selectedKey) : undefined;
  // A new search (origin/cell) clears the pin selection.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on a new search only.
  useEffect(() => setSelectedKey(null), [cell]);

  if (fix === null && !hasSavedLocation) {
    return (
      <View style={styles.stack}>
        <EmptyState
          icon={{ ios: "location.fill", android: "location_on", web: "location_on" }}
          title={t("masjids.noLocationTitle")}
          description={
            tv
              ? t("masjids.noLocationTv")
              : locationStatus === "denied"
                ? t("masjids.locationDenied")
                : t("masjids.noLocationBody")
          }
          actionLabel={tv ? undefined : t("masjids.useMyLocation")}
          onAction={tv ? undefined : () => void locateMe()}
        />
        {tv ? null : (
          <Button
            variant="ghost"
            label={t("masjids.chooseCity")}
            onPress={() => router.push("/location" as Href)}
          />
        )}
        <OsmAttribution />
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {home ? (
        // Open target and "Your times" are siblings (no <button> inside a <button> on web).
        <Card>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={home.name ?? t("masjids.unnamed")}
            scaleTo={0.985}
            haptic="light"
            onPress={() => router.push(detailHref(home))}
          >
            <SectionHeader
              title={home.name ?? t("masjids.unnamed")}
              subtitle={t("masjids.homeTitle")}
              icon={{ ios: "house.fill", android: "home", web: "home" }}
            />
          </PressableScale>
          {tv ? null : (
            <View style={styles.actions}>
              <Button
                size="sm"
                variant="secondary"
                label={t("masjids.yourTimes")}
                onPress={() => router.push("/masjids/times" as Href)}
              />
            </View>
          )}
        </Card>
      ) : null}

      <ThemedText type="caption" themeColor="mutedForeground" testID="masjids-origin-note">
        {nearYou || fix === "pending"
          ? t("masjids.privacyNoteNearYou")
          : t("masjids.privacyNote", { place: location.city ?? location.label })}
      </ThemedText>
      {tv || nearYou || fix === "pending" ? null : (
        <View style={styles.actions}>
          <Button
            size="sm"
            variant="secondary"
            icon={{ ios: "location.fill", android: "my_location", web: "my_location" }}
            label={t("masjids.useMyLocation")}
            onPress={() => void locateMe()}
          />
        </View>
      )}

      {fix === "pending" || state.status === "loading" ? (
        <MasjidListSkeleton readOnly={tv} />
      ) : null}

      {fix !== "pending" && state.status === "error" ? (
        <EmptyState
          icon={
            state.kind === "offline"
              ? { ios: "wifi.slash", android: "wifi_off", web: "wifi_off" }
              : { ios: "exclamationmark.triangle", android: "warning", web: "warning" }
          }
          title={state.kind === "offline" ? t("masjids.offlineTitle") : t("masjids.errorTitle")}
          description={
            state.kind === "rate_limited"
              ? t("masjids.rateLimited")
              : state.kind === "offline"
                ? t("masjids.errorBody")
                : t("masjids.unavailableBody")
          }
          actionLabel={t("masjids.retry")}
          onAction={() => setReloadKey((k) => k + 1)}
        />
      ) : null}

      {fix !== "pending" && state.status === "ready" ? (
        <>
          {state.result.offline || state.result.stale ? (
            <ThemedText type="caption" themeColor="mutedForeground" testID="masjids-stale">
              {state.result.offline ? t("masjids.offlineCached") : t("masjids.staleNote")}
            </ThemedText>
          ) : null}
          {sorted.length === 0 ? (
            <EmptyState
              icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
              title={t("masjids.emptyTitle")}
              description={t("masjids.emptyBody")}
            />
          ) : (
            <>
              <SectionHeader title={t("masjids.nearbyTitle")} subtitle={t("masjids.nearbySub")} />
              {tv || !origin ? null : (
                <SegmentedControl
                  options={[
                    { id: "list", label: t("masjids.viewList") },
                    { id: "map", label: t("masjids.viewMap") },
                  ]}
                  value={view}
                  onChange={setView}
                />
              )}
            </>
          )}
          {sorted.length > 0 && view === "map" && !tv && origin ? (
            <>
              <ThemedText type="caption" themeColor="mutedForeground" testID="masjids-map-note">
                {t("masjids.mapPrivacy")}
              </ThemedText>
              <MasjidMap
                me={origin}
                masjids={mapPoints}
                onSelect={setSelectedKey}
                height={MAP_HEIGHT}
              />
              {selected ? (
                <MasjidRow
                  masjid={selected}
                  isHome={homeKey === masjidKey(selected)}
                  readOnly={false}
                  onOpen={onOpen}
                  onDirections={onDirections}
                  onSetHome={onSetHome}
                />
              ) : (
                <ThemedText type="small" themeColor="mutedForeground">
                  {t("masjids.mapHint")}
                </ThemedText>
              )}
            </>
          ) : null}
          {sorted.length > 0 && (view === "list" || tv || !origin) ? (
            <>
              {visible.map((m) => (
                <MasjidRow
                  key={masjidKey(m)}
                  masjid={m}
                  isHome={homeKey === masjidKey(m)}
                  readOnly={tv}
                  onOpen={onOpen}
                  onDirections={onDirections}
                  onSetHome={onSetHome}
                />
              ))}
              {sorted.length > visibleCount ? (
                <Button
                  variant="secondary"
                  label={t("masjids.showMore")}
                  onPress={() => setVisibleCount((n) => n + MASJID_PAGE_SIZE)}
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : null}

      <OsmAttribution
        attribution={state.status === "ready" ? state.result.attribution : undefined}
      />
      <MasjidEvidence />
    </View>
  );
}

export default function MasjidsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("masjids.eyebrow")}
      title={t("masjids.title")}
      subtitle={t("masjids.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/masjids" />
      <MasjidFinder />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/masjids");
