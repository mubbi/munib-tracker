import {
  IQAMAH_PRAYERS,
  type IqamahTimetable,
  isOpenAt,
  jumuahIqamahTimes,
  type MasjidAddress,
  type MasjidDetail,
  masjidDisplayName,
} from "@munib-tracker/shared/masjid";
import * as Linking from "expo-linking";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MasjidBadges, MasjidJumuahLine } from "@/components/masjid/masjid-badges";
import { useMasjidFormat } from "@/components/masjid/use-masjid-format";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { openExternalLink } from "@/lib/open-external-link";

/** One-line address from `addr:*`, or undefined when OSM has none. */
export function formatMasjidAddress(address: MasjidAddress | undefined): string | undefined {
  if (!address) return undefined;
  if (address.full) return address.full;
  const line1 = [address.housenumber, address.street].filter(Boolean).join(" ");
  const line2 = [address.postcode, address.city].filter(Boolean).join(" ");
  const parts = [line1, line2, address.country].filter((p): p is string => !!p);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

function Section({
  title,
  children,
  testID,
}: {
  title: string;
  children: ReactNode;
  testID: string;
}) {
  return (
    <Card>
      <View style={styles.section} testID={testID}>
        <SectionHeader title={title} />
        {children}
      </View>
    </Card>
  );
}

/** Daily / Jumu'ah rows of a timetable; renders nothing for missing prayers. */
export function TimetableRows({ timetable }: { timetable: IqamahTimetable }) {
  const { t } = useTranslation();
  const format = useMasjidFormat();
  const jumuah = jumuahIqamahTimes(timetable);
  return (
    <View style={styles.rows}>
      {IQAMAH_PRAYERS.map((prayer) => {
        const at = timetable.daily?.[prayer];
        if (!at) return null;
        return (
          <View key={prayer} style={styles.row}>
            <ThemedText type="small" style={styles.flex}>
              {t(`prayers.${prayer}`)}
            </ThemedText>
            <ThemedText type="smallBold">{format.time(at)}</ThemedText>
          </View>
        );
      })}
      {jumuah.length > 0 ? (
        <View style={styles.row}>
          <ThemedText type="small" style={styles.flex}>
            {t("masjids.jumuah")}
          </ThemedText>
          <ThemedText type="smallBold">{jumuah.map(format.time).join(" · ")}</ThemedText>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Public OSM details. **Every section renders only when it has data** (D5): no
 * empty states, no "unknown", no "add times" prompts.
 */
export function MasjidDetailView({
  detail,
  distanceMeters,
  isHome,
  privateTimetable,
  now = new Date(),
}: {
  detail: MasjidDetail;
  distanceMeters?: number;
  isHome: boolean;
  /** The user's own times ("Your times") — only for the home masjid. */
  privateTimetable?: IqamahTimetable | null;
  now?: Date;
}) {
  const { t, i18n } = useTranslation();
  const format = useMasjidFormat();
  const name = masjidDisplayName(detail, i18n.language) ?? t("masjids.unnamed");
  const address = formatMasjidAddress(detail.address);
  const open = isOpenAt(detail.openingHours, now.getDay(), now.getHours() * 60 + now.getMinutes());
  const publicTimetable = detail.timetable?.source.id !== "private" ? detail.timetable : undefined;
  const publicAttribution =
    publicTimetable && "attribution" in publicTimetable.source
      ? publicTimetable.source.attribution
      : undefined;

  return (
    <View style={styles.stack}>
      <Card>
        <View style={styles.section}>
          <ThemedText type="subtitle" heading={2}>
            {name}
          </ThemedText>
          {distanceMeters != null ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("masjids.awayFromYou", { distance: format.distance(distanceMeters) })}
            </ThemedText>
          ) : null}
          {isHome ? (
            <Pill
              compact
              icon={{ ios: "house.fill", android: "home", web: "home" }}
              label={t("masjids.homeBadge")}
            />
          ) : null}
          {address ? (
            <ThemedText type="small" testID="masjid-address">
              {address}
            </ThemedText>
          ) : null}
          {detail.denomination ? (
            <ThemedText type="caption" themeColor="mutedForeground" testID="masjid-denomination">
              {t("masjids.denomination", { value: detail.denomination })}
            </ThemedText>
          ) : null}
          {open !== null ? (
            <ThemedText type="caption" themeColor="mutedForeground" testID="masjid-open">
              {open ? t("masjids.openNow") : t("masjids.closedNow")}
            </ThemedText>
          ) : null}
          <MasjidBadges badges={detail.badges} />
        </View>
      </Card>

      {privateTimetable ? (
        <Section title={t("masjids.yourTimes")} testID="masjid-private-times">
          <TimetableRows timetable={privateTimetable} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("masjids.yourTimesNote")}
          </ThemedText>
        </Section>
      ) : null}

      {publicTimetable ? (
        <Section title={t("masjids.iqamahTitle")} testID="masjid-public-times">
          <TimetableRows timetable={publicTimetable} />
          {publicAttribution ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("masjids.timetableSource", { source: publicAttribution })}
            </ThemedText>
          ) : null}
        </Section>
      ) : null}

      {detail.jumuah && detail.jumuah.length > 0 ? (
        <Section title={t("masjids.jumuah")} testID="masjid-jumuah-section">
          <MasjidJumuahLine times={detail.jumuah} format={format.time} />
        </Section>
      ) : null}

      {detail.serviceTimes && detail.serviceTimes.length > 0 ? (
        <Section title={t("masjids.serviceTimesFromOsm")} testID="masjid-service-times">
          {detail.serviceTimes.map((rule) => (
            <ThemedText key={rule} type="small" style={styles.ltr}>
              {rule}
            </ThemedText>
          ))}
        </Section>
      ) : null}

      {detail.website || detail.phone ? (
        <Section title={t("masjids.contact")} testID="masjid-contact">
          {detail.website ? (
            <ThemedText
              type="linkPrimary"
              accessibilityRole="link"
              onPress={() => void openExternalLink(detail.website as string)}
            >
              {t("masjids.website")}
            </ThemedText>
          ) : null}
          {detail.phone ? (
            <ThemedText
              type="linkPrimary"
              accessibilityRole="link"
              accessibilityLabel={t("masjids.callA11y", { phone: detail.phone })}
              onPress={() => void Linking.openURL(`tel:${detail.phone?.replace(/[^\d+]/g, "")}`)}
              style={styles.ltr}
            >
              {detail.phone}
            </ThemedText>
          ) : null}
        </Section>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  section: { gap: Spacing.two },
  rows: { gap: Spacing.one },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
  // OSM rule syntax / phone numbers are Latin and read left-to-right.
  ltr: { writingDirection: "ltr" },
});
