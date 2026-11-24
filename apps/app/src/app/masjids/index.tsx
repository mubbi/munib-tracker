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
import { MasjidRow } from "@/components/masjid/masjid-row";
import { openDirections } from "@/components/masjid/open-directions";
import { OsmAttribution } from "@/components/masjid/osm-attribution";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { cellFor, fetchMasjidList, MasjidApiError, type MasjidListResult } from "@/lib/masjid/api";
import { setHomeMasjid, useHomeMasjid } from "@/lib/masjid/home-masjid";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";
import { useLocation, useLocationActions, useLocationStatus } from "@/stores/location-store";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; result: MasjidListResult }
  | { status: "error"; kind: MasjidApiError["kind"] };

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

/**
 * Masjid finder (NF-3.11, D5), list-first: nearby masjids from OpenStreetMap
 * sorted by exact distance on-device. Only the ~5 km geohash cell is sent to
 * the API. TV is read-only (no directions / home selection).
 */
function MasjidFinder() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const tv = isTV();
  const location = useLocation();
  const locationStatus = useLocationStatus();
  const { requestDeviceLocation } = useLocationActions();
  const home = useHomeMasjid();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  const hasLocation = location.source !== "default";
  const cell = hasLocation ? cellFor(location.latitude, location.longitude) : null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: reloadKey re-runs the fetch on "Try again".
  useEffect(() => {
    if (!cell) return;
    const controller = new AbortController();
    setState({ status: "loading" });
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
        ? sortByDistance(state.result.masjids, { lat: location.latitude, lon: location.longitude })
        : [],
    [state, location.latitude, location.longitude],
  );

  const homeKey = home ? masjidKey(home) : null;

  const onSetHome = useCallback(
    (m: MasjidSummary) => {
      const name = masjidDisplayName(m, i18n.language);
      void setHomeMasjid(toHome(m, name)).then(() =>
        toast.success(t("masjids.homeSetToast", { name: name ?? t("masjids.unnamed") })),
      );
    },
    [i18n.language, t, toast],
  );

  if (!hasLocation) {
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
          onAction={tv ? undefined : () => void requestDeviceLocation()}
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
        <Card padding="three" onPress={() => router.push(detailHref(home))}>
          <SectionHeader
            title={home.name ?? t("masjids.unnamed")}
            subtitle={t("masjids.homeTitle")}
            icon={{ ios: "house.fill", android: "home", web: "home" }}
          />
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

      <ThemedText type="caption" themeColor="mutedForeground">
        {t("masjids.privacyNote", { place: location.city ?? location.label })}
      </ThemedText>

      {state.status === "loading" ? (
        <ThemedText type="small" themeColor="mutedForeground" testID="masjids-loading">
          {t("masjids.loading")}
        </ThemedText>
      ) : null}

      {state.status === "error" ? (
        <EmptyState
          icon={{ ios: "wifi.slash", android: "wifi_off", web: "wifi_off" }}
          title={state.kind === "offline" ? t("masjids.offlineTitle") : t("masjids.errorTitle")}
          description={
            state.kind === "rate_limited" ? t("masjids.rateLimited") : t("masjids.errorBody")
          }
          actionLabel={t("masjids.retry")}
          onAction={() => setReloadKey((k) => k + 1)}
        />
      ) : null}

      {state.status === "ready" ? (
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
              {sorted.map((m) => (
                <MasjidRow
                  key={masjidKey(m)}
                  masjid={m}
                  isHome={homeKey === masjidKey(m)}
                  readOnly={tv}
                  onOpen={() => router.push(detailHref(m))}
                  onDirections={() =>
                    openDirections({
                      lat: m.lat,
                      lon: m.lon,
                      name: masjidDisplayName(m, i18n.language),
                    })
                  }
                  onSetHome={() => onSetHome(m)}
                />
              ))}
            </>
          )}
        </>
      ) : null}

      <OsmAttribution />
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
