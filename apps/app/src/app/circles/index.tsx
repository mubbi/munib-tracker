import { type Href, useRouter } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, type TextInputInstance, View } from "react-native";

import { CircleCodeEntry } from "@/components/circles/code-entry";
import { JoinNearbyButton } from "@/components/circles/nearby/nearby-join-sheet";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { circleHomeHref } from "@/lib/circles/family";
import { useCircleAuth, useCircles } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

const TYPE_ICON = {
  family: {
    ios: "figure.2.and.child.holdinghands",
    android: "family_restroom",
    web: "family_restroom",
  },
  partner: { ios: "person.2.fill", android: "group", web: "group" },
  khatm_group: { ios: "book.fill", android: "menu_book", web: "menu_book" },
} as const;

/**
 * Circles hub (NF-3.16–3.18): every circle I belong to, join with a code, and
 * start a family circle. Partner and group khatm creation live on their own
 * screens (NF-3.17 / NF-3.18).
 */
export default function CirclesHubScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useCircleAuth();
  const circles = useCircles();
  const tv = isTV();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const codeRef = useRef<TextInputInstance>(null);
  const sections = useRef({ start: 0, join: 0 });
  const reduceMotion = useHydrationSafeReducedMotion();

  const scrollTo = (key: "start" | "join") =>
    scrollRef.current?.scrollTo({
      y: Math.max(0, sections.current[key] - 8),
      animated: !reduceMotion,
    });

  const join = (code: string) => router.push({ pathname: "/circle/join/[code]", params: { code } });

  const hasCircles = (circles.data ?? []).length > 0;

  return (
    <ScreenLayout
      eyebrow={t("circles.hub.eyebrow")}
      title={t("circles.hub.title")}
      subtitle={t("circles.hub.subtitle")}
      onBack={() => goBackOrReplace(router, "/library")}
      scrollRef={scrollRef}
    >
      <Seo path="/circles" index={false} />
      <View style={styles.stack}>
        {circles.isLoading ? (
          <CircleLoading />
        ) : circles.isError ? (
          <CircleRetryCard onRetry={() => void circles.refetch()} />
        ) : !hasCircles ? (
          <>
            <EmptyState
              icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
              title={t("circles.hub.emptyTitle")}
              description={t("circles.hub.emptyBody")}
              actionLabel={t("circles.hub.startTitle")}
              onAction={() => scrollTo("start")}
            />
            {!tv ? (
              <Button
                variant="secondary"
                label={t("circles.hub.joinTitle")}
                onPress={() => {
                  scrollTo("join");
                  codeRef.current?.focus();
                }}
              />
            ) : null}
          </>
        ) : (
          <Card padding="two" style={styles.gap}>
            {(circles.data ?? []).map((circle) => (
              <NavRow
                key={circle.id}
                icon={TYPE_ICON[circle.type]}
                label={circle.name}
                badge={t(`circles.type.${circle.type}`)}
                onPress={() => router.push(circleHomeHref(circle) as Href)}
              />
            ))}
          </Card>
        )}

        {/* Invited people join first: a code (or a nearby host) is the shortest path in. */}
        {!tv ? (
          <View
            onLayout={(e) => (sections.current.join = e.nativeEvent.layout.y)}
            style={styles.stack}
          >
            <SectionHeader title={t("circles.hub.joinTitle")} />
            <Card style={styles.gap}>
              <CircleCodeEntry ref={codeRef} onSubmit={join} />
              {/* NF-3.25: phones next to each other, host-approved (hidden on web / TV). */}
              <JoinNearbyButton />
            </Card>
          </View>
        ) : null}

        {/* Three ways to start, one look: each opens its own screen (NF-3.16 – 3.18). */}
        <View
          onLayout={(e) => (sections.current.start = e.nativeEvent.layout.y)}
          style={styles.stack}
        >
          <SectionHeader title={t("circles.hub.startTitle")} />
          <Card padding="two" style={styles.gap}>
            <NavRow
              icon={TYPE_ICON.family}
              label={t("circles.hub.familyTitle")}
              subtitle={
                auth.isAccount ? t("circles.hub.familyShort") : t("circles.hub.familyNeedsAccount")
              }
              onPress={() => router.push("/family")}
              href="/family"
            />
            <NavRow
              icon={TYPE_ICON.partner}
              label={t("partnerCircle.title")}
              subtitle={t("partnerCircle.subtitle")}
              onPress={() => router.push("/partner" as Href)}
              href="/partner"
            />
            <NavRow
              icon={TYPE_ICON.khatm_group}
              label={t("khatmGroups.title")}
              subtitle={t("khatmGroups.subtitle")}
              onPress={() => router.push("/khatm-groups" as Href)}
              href="/khatm-groups"
            />
          </Card>
        </View>

        <Card style={styles.gap}>
          <ThemedText type="smallBold">{t("circles.privacy.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("circles.privacy.body")}
          </ThemedText>
        </Card>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/circles");
