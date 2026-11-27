import { Coordinates, Qibla } from "adhan";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { QiblaFace } from "@/components/qibla/faces/qibla-face";
import { useStaticQiblaMotion } from "@/components/qibla/faces/shared";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  QIBLA_COMPASS_STYLES,
  type QiblaCompassStyleId,
  qiblaCompassStyleKeys,
  resolveQiblaCompassStyle,
} from "@/lib/qibla-compass-styles";
import { useSetting } from "@/lib/settings/use-setting";
import { useLocation } from "@/stores/location-store";

/** The registry setting this editor writes (`lib/settings/defs/appearance.ts`). */
export const QIBLA_COMPASS_SETTING_ID = "appearance.qiblaCompass";

const STAGE = 188;
const THUMB = 76;
/** Cards aim for this width; the grid fits as many per row as it can, evenly. */
const CARD_MIN = 100;

/** Width of each card so `CARD_MIN`-ish cards fill a row of `rowWidth` exactly. */
export function qiblaCardWidth(rowWidth: number): number {
  const columns = Math.max(1, Math.floor((rowWidth + Spacing.two) / (CARD_MIN + Spacing.two)));
  return Math.floor((rowWidth - Spacing.two * (columns - 1)) / columns);
}

/**
 * The "Compass style" picker, shared by Settings › Appearance and the Qibla
 * screen's style sheet. A large live preview of the chosen (or hovered) style,
 * then a grid of thumbnails drawn with the user's real qibla bearing. Every
 * change applies at once through the synced preferences.
 */
export function QiblaCompassStyleEditor({
  focusSelected = false,
}: {
  /** TV: give the selected card the initial focus (style sheet only). */
  focusSelected?: boolean;
} = {}) {
  const { t } = useTranslation();
  const { value, setValue } = useSetting<QiblaCompassStyleId>(QIBLA_COMPASS_SETTING_ID);
  const selected = resolveQiblaCompassStyle(value);
  const [hovered, setHovered] = useState<QiblaCompassStyleId | null>(null);
  const [rowWidth, setRowWidth] = useState(0);
  const location = useLocation();
  const bearing = useMemo(
    () => Qibla(new Coordinates(location.latitude, location.longitude)),
    [location.latitude, location.longitude],
  );
  const shown = hovered ?? selected;
  const cardWidth = rowWidth ? qiblaCardWidth(rowWidth) : undefined;

  return (
    <View style={styles.root}>
      <DemoStage style={shown} bearing={bearing} />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.desc}>
        {t(qiblaCompassStyleKeys(shown).desc)}
      </ThemedText>
      <View style={styles.grid} onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}>
        {QIBLA_COMPASS_STYLES.map((id) => (
          <View key={id} style={cardWidth ? { width: cardWidth } : styles.cardFallback}>
            <StyleCard
              id={id}
              bearing={bearing}
              selected={id === selected}
              preferredFocus={focusSelected && id === selected}
              onSelect={() => void setValue(id)}
              onHover={setHovered}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

function DemoStage({ style, bearing }: { style: QiblaCompassStyleId; bearing: number }) {
  const motion = useStaticQiblaMotion(bearing);
  const reduceMotion = useReducedMotion();
  return (
    <View style={styles.stage} pointerEvents="none" importantForAccessibility="no-hide-descendants">
      <QiblaFace
        style={style}
        size={STAGE}
        bearing={bearing}
        hasCompass={false}
        aligned={false}
        offsetDeg={0}
        motion={motion}
        reduceMotion={reduceMotion}
      />
    </View>
  );
}

function StyleCard({
  id,
  bearing,
  selected,
  preferredFocus,
  onSelect,
  onHover,
}: {
  id: QiblaCompassStyleId;
  bearing: number;
  selected: boolean;
  preferredFocus: boolean;
  onSelect: () => void;
  onHover: (id: QiblaCompassStyleId | null) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const motion = useStaticQiblaMotion(bearing);
  const tv = isTV();
  const keys = qiblaCompassStyleKeys(id);
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={t(keys.name)}
      accessibilityHint={t(keys.desc)}
      accessibilityState={{ selected }}
      onPress={onSelect}
      onHoverIn={() => onHover(id)}
      onHoverOut={() => onHover(null)}
      {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.card,
        tv && styles.cardTv,
        {
          backgroundColor: selected ? tokens.accentSoft : colors.muted,
          borderColor: selected ? colors.accent : "transparent",
        },
      ]}
    >
      {/* Thumbnails stay still; the stage above shows the chosen style large. */}
      <View style={styles.thumb} pointerEvents="none">
        <QiblaFace
          style={id}
          size={THUMB}
          bearing={bearing}
          hasCompass={false}
          aligned={false}
          offsetDeg={0}
          motion={motion}
          reduceMotion
          preview
        />
      </View>
      <View style={styles.nameRow}>
        {selected ? (
          <SymbolView
            name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
            size={14}
            tintColor={colors.accent}
          />
        ) : null}
        <ThemedText
          type="smallBold"
          numberOfLines={2}
          style={[styles.cardName, selected && { color: colors.accentText }]}
        >
          {t(keys.name)}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
  },
  stage: {
    alignSelf: "center",
    width: STAGE,
    height: STAGE,
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    textAlign: "center",
    minHeight: 34,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  cardFallback: {
    width: CARD_MIN,
  },
  card: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
  },
  cardTv: {
    minHeight: TvLayout.minFocusTarget * 2,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.half,
  },
  cardName: {
    textAlign: "center",
    flexShrink: 1,
  },
});
