import type { TimetableDateColumn } from "@munib-tracker/shared/timetable-parser";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";

/**
 * NF-3.12 (M8): a monthly sheet with more than one column of day numbers —
 * typically a Ramadan-day column next to the Gregorian date — whose headers
 * didn't say which is which. Saving waits until the user picks the column
 * with the day of the month; the sheet is then re-read with that column.
 */
export function TimetableDateColumnQuestion({
  columns,
  onChoose,
}: {
  columns: readonly TimetableDateColumn[];
  onChoose: (id: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <Card padding="three">
      <SectionHeader
        title={t("timetableImport.dateColumnTitle")}
        icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
        {t("timetableImport.dateColumnBody")}
      </ThemedText>
      <View style={styles.options}>
        {columns.map((column) => {
          const range = t("timetableImport.dateColumnOption", {
            first: column.first,
            last: column.last,
          });
          const label =
            column.header === "hijri"
              ? `${range} · ${t("timetableImport.dateColumnHijri")}`
              : column.header === "gregorian"
                ? `${range} · ${t("timetableImport.dateColumnDate")}`
                : range;
          return (
            <Button
              key={column.id}
              size="sm"
              variant="secondary"
              label={label}
              onPress={() => onChoose(column.id)}
            />
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  gapTop: { marginTop: Spacing.two },
  options: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});
