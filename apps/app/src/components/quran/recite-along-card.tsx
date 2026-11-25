import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { RECITE_ALONG_ICON, ReciteAlongButton } from "@/components/quran/recite-along-button";
import { usePassageLabel } from "@/components/quran/recite-along-label";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";
import type { Passage } from "@/lib/quran-companion/types";
import { passageKey, type ReciteAlongMode } from "@/lib/recite-along/passages";

/**
 * A small card with one recite-along button per passage (D68) — for guides and
 * lessons that show specific ayahs to recite. One passage → a single "Recite
 * along" button; several → one button per passage, labelled by reference.
 * Renders nothing where recite-along is unavailable (TV, unsupported runtime) or
 * with no valid passage.
 */
export function ReciteAlongCard({
  passages,
  title,
  body,
  mode = "follow",
}: {
  passages: readonly Passage[];
  /** Defaults to "Recite along". */
  title?: string;
  /** Defaults to the on-device privacy line. */
  body?: string;
  mode?: ReciteAlongMode;
}) {
  const { t } = useTranslation();
  const passageLabel = usePassageLabel();
  const available = useReciteAlongAvailable();
  if (!available || passages.length === 0) return null;
  const single = passages.length === 1;

  return (
    <Card padding="three">
      <SectionHeader title={title ?? t("reciteAlong.cardTitle")} icon={RECITE_ALONG_ICON} />
      <ThemedText type="small" themeColor="mutedForeground" style={styles.body}>
        {body ?? t("reciteAlong.cardBody")}
      </ThemedText>
      <View style={styles.buttons}>
        {passages.map((p) => (
          <ReciteAlongButton
            key={passageKey(p)}
            passage={p}
            mode={mode}
            label={single ? undefined : passageLabel(p)}
            size={single ? "md" : "sm"}
            fullWidth={single}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: Spacing.two, lineHeight: 20 },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
