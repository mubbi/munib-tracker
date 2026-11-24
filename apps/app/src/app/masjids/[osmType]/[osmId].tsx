import {
  distanceMeters,
  type HomeMasjid,
  isMasjidOsmType,
  isValidOsmId,
  type MasjidDetailResponse,
  masjidDisplayName,
  masjidKey,
  osmUrl,
} from "@munib-tracker/shared/masjid";
import * as Linking from "expo-linking";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MasjidDetailView } from "@/components/masjid/masjid-detail-view";
import { openDirections } from "@/components/masjid/open-directions";
import { OsmAttribution } from "@/components/masjid/osm-attribution";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { fetchMasjidDetail, MasjidApiError } from "@/lib/masjid/api";
import {
  homeMasjidCacheStore,
  setHomeMasjid,
  useHomeIqamahTimetable,
  useHomeMasjid,
} from "@/lib/masjid/home-masjid";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";
import { useStore } from "@/stores/create-store";
import { useEnsureHomeMasjidTimesLoaded } from "@/stores/home-masjid-times-store";
import { useLocation } from "@/stores/location-store";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; detail: MasjidDetailResponse; cached: boolean }
  | { status: "error"; kind: MasjidApiError["kind"] };

function MasjidDetailScreenBody({
  osmType,
  osmId,
}: {
  osmType: HomeMasjid["osmType"];
  osmId: string;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const tv = isTV();
  const location = useLocation();
  const home = useHomeMasjid();
  useEnsureHomeMasjidTimesLoaded();
  const homeCache = useStore(homeMasjidCacheStore, (s) => s.cache);
  const homeTimetable = useHomeIqamahTimetable();
  const key = masjidKey({ osmType, osmId });
  const isHome = !!home && masjidKey(home) === key;
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!homeMasjidCacheStore.getState().isReady) void homeMasjidCacheStore.getState().load();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reloadKey re-runs the fetch on "Try again".
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetchMasjidDetail(osmType, osmId, controller.signal)
      .then((detail) => {
        if (controller.signal.aborted) return;
        setState({ status: "ready", detail, cached: false });
        if (isHome) {
          void homeMasjidCacheStore
            .getState()
            .set({ key, savedAt: new Date().toISOString(), detail });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          kind: error instanceof MasjidApiError ? error.kind : "unavailable",
        });
      });
    return () => controller.abort();
  }, [osmType, osmId, isHome, key, reloadKey]);

  // Offline: the home masjid's last public detail is cached on the device.
  const shown =
    state.status === "ready"
      ? state
      : state.status === "error" && homeCache?.key === key
        ? { status: "ready" as const, detail: homeCache.detail, cached: true }
        : null;

  if (!shown) {
    if (state.status === "loading") {
      return (
        <ThemedText type="small" themeColor="mutedForeground">
          {t("masjids.loading")}
        </ThemedText>
      );
    }
    const kind = state.status === "error" ? state.kind : "unavailable";
    return (
      <View style={styles.stack}>
        <EmptyState
          icon={{ ios: "wifi.slash", android: "wifi_off", web: "wifi_off" }}
          title={kind === "not_found" ? t("masjids.notFoundTitle") : t("masjids.errorTitle")}
          description={kind === "not_found" ? t("masjids.notFoundBody") : t("masjids.errorBody")}
          actionLabel={kind === "not_found" ? undefined : t("masjids.retry")}
          onAction={kind === "not_found" ? undefined : () => setReloadKey((k) => k + 1)}
        />
        <OsmAttribution />
      </View>
    );
  }

  const { detail } = shown;
  const name = masjidDisplayName(detail, i18n.language);
  const hasLocation = location.source !== "default";
  const distance = hasLocation
    ? distanceMeters({ lat: location.latitude, lon: location.longitude }, detail)
    : undefined;

  const setHome = (next: boolean) => {
    if (!next) {
      void setHomeMasjid(null).then(() => toast.success(t("masjids.homeClearedToast")));
      return;
    }
    const value: HomeMasjid = { osmType, osmId, lat: detail.lat, lon: detail.lon };
    if (name) value.name = name;
    void setHomeMasjid(value).then(() =>
      toast.success(t("masjids.homeSetToast", { name: name ?? t("masjids.unnamed") })),
    );
  };

  return (
    <View style={styles.stack}>
      {shown.cached || detail.stale ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {shown.cached ? t("masjids.offlineCached") : t("masjids.staleNote")}
        </ThemedText>
      ) : null}
      <MasjidDetailView
        detail={detail}
        distanceMeters={distance}
        isHome={isHome}
        privateTimetable={isHome && homeTimetable?.source.id === "private" ? homeTimetable : null}
      />
      {tv ? null : (
        <View style={styles.actions}>
          <Button
            icon={{
              ios: "arrow.triangle.turn.up.right.diamond.fill",
              android: "directions",
              web: "directions",
            }}
            label={t("masjids.directions")}
            accessibilityHint={t("masjids.directionsHint")}
            onPress={() => openDirections({ lat: detail.lat, lon: detail.lon, name })}
          />
          {isHome ? (
            <>
              <Button
                variant="secondary"
                label={t("masjids.yourTimes")}
                onPress={() => router.push("/masjids/times" as Href)}
              />
              <Button
                variant="ghost"
                label={t("masjids.removeHome")}
                onPress={() => setHome(false)}
              />
            </>
          ) : (
            <Button
              variant="secondary"
              label={t("masjids.setHome")}
              onPress={() => setHome(true)}
            />
          )}
          <Button
            variant="ghost"
            label={t("masjids.reportOnOsm")}
            accessibilityHint={t("masjids.reportOnOsmHint")}
            onPress={() => void Linking.openURL(osmUrl({ osmType, osmId }))}
          />
        </View>
      )}
      <OsmAttribution />
    </View>
  );
}

/** One masjid's public OSM details (NF-3.11); "Report a problem" goes upstream to OSM. */
export default function MasjidDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ osmType?: string; osmId?: string }>();
  const osmType = params.osmType;
  const osmId = params.osmId;
  const valid = isMasjidOsmType(osmType) && isValidOsmId(osmId);

  return (
    <ScreenLayout
      eyebrow={t("masjids.eyebrow")}
      title={t("masjids.detailTitle")}
      onBack={() => goBackOrReplace(router, "/masjids" as Href)}
    >
      <Seo path="/masjids" />
      {valid ? (
        <MasjidDetailScreenBody osmType={osmType} osmId={osmId} />
      ) : (
        <EmptyState
          icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
          title={t("masjids.notFoundTitle")}
          description={t("masjids.notFoundBody")}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/masjids/[osmType]/[osmId]");
