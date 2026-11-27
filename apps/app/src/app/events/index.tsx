import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LearnHubScreen, type LearnHubSection } from "@/components/learn-guide/learn-hub-screen";
import { LearnGrid } from "@/components/learn-guide/learn-wide-layout";
import { ThemedText } from "@/components/themed-text";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useScreenFocus } from "@/hooks/use-screen-focus";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getUpcomingEvents } from "@/lib/islamic-events";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useLocation } from "@/stores/location-store";

/**
 * Where each event's guide / tracker lives (G-78). Events without a dedicated
 * screen stay plain, non-pressable cards.
 */
const EVENT_LINKS: Partial<Record<string, Href>> = {
  ashura: "/fasting" as Href,
  ramadan: "/ramadan" as Href,
  laylatQadr: "/laylat-al-qadr" as Href,
  eidFitr: "/eid" as Href,
  arafah: { pathname: "/dhul-hijjah", params: { focus: "arafah" } } as Href,
  eidAdha: "/eid" as Href,
};

type UpcomingEvent = ReturnType<typeof getUpcomingEvents>[number];

function EventCard({
  event,
  focused,
  focusRef,
  formatDate,
}: {
  event: UpcomingEvent;
  focused: boolean;
  /** `useScreenFocus().register(id)` — lets `?focus=` deep links scroll to the card. */
  focusRef: ReturnType<ReturnType<typeof useScreenFocus>["register"]>;
  formatDate: (iso: string) => string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevron = useChevronForward();
  const href = EVENT_LINKS[event.id];
  const name = t(`events.names.${event.id}`);
  const when = `${formatDate(event.date)} · ${t("events.hijriYear", { year: event.hijriYear })}`;
  const countdown =
    event.daysUntil === 0 ? t("events.today") : t("events.inDays", { count: event.daysUntil });
  const description = t(`events.descriptions.${event.id}`);

  const body = (
    <>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "star.fill", android: "star", web: "star" }}
            size={IconSize.sm}
            tintColor={tokens.accentOnSoft}
          />
        </View>
        <View style={styles.body}>
          <ThemedText type="smallBold">{name}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {when}
          </ThemedText>
        </View>
        <Pill label={countdown} tone="accent" />
        {href ? (
          <SymbolView name={chevron} size={IconSize.md} tintColor={colors.mutedForeground} />
        ) : null}
      </View>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.description}>
        {description}
      </ThemedText>
    </>
  );

  return (
    <FocusHighlight ref={focusRef} active={focused}>
      {href ? (
        <PressableScale
          haptic="light"
          accessibilityRole="link"
          accessibilityLabel={[name, when, countdown].join(". ")}
          onPress={() => router.push(href)}
          {...(focused ? { hasTVPreferredFocus: true } : {})}
          style={[styles.card, { backgroundColor: colors.muted }]}
        >
          {body}
        </PressableScale>
      ) : (
        // TV: prose-only cards stay D-pad stops so the list scrolls by remote.
        <TvReadableBlock preferredFocus={focused}>
          <View style={[styles.card, { backgroundColor: colors.muted }]}>{body}</View>
        </TvReadableBlock>
      )}
    </FocusHighlight>
  );
}

export default function IslamicEventsScreen() {
  const { t } = useTranslation();
  const { formatIso } = useFormatCalendarDate();
  const { scrollRef, register, onScroll, isFocused } = useScreenFocus();
  const location = useLocation();

  const events = useMemo(
    () => getUpcomingEvents(undefined, 12, location.timeZone),
    [location.timeZone],
  );

  const sections = useMemo<LearnHubSection[]>(() => {
    const formatDate = (iso: string) =>
      formatIso(iso, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
    return [
      {
        id: "upcoming",
        title: t("events.title"),
        icon: { ios: "calendar", android: "event", web: "event" },
        children: (
          <LearnGrid maxColumns={3} gap={Spacing.two} passthrough>
            {events.map((event) => (
              <EventCard
                key={`${event.id}-${event.hijriYear}`}
                event={event}
                focused={isFocused(event.id)}
                focusRef={register(event.id)}
                formatDate={formatDate}
              />
            ))}
          </LearnGrid>
        ),
      },
    ];
  }, [t, events, formatIso, isFocused, register]);

  return (
    <LearnHubScreen
      ns="events"
      basePath="/events"
      intro={null}
      sections={sections}
      quiz
      scrollRef={scrollRef}
      onScroll={onScroll}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  icon: {
    width: tvDp(40),
    height: tvDp(40),
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: Spacing.half },
  description: { marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/events");
