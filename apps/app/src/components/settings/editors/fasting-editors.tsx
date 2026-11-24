import type { TimeFormat, VoluntaryFastKind } from "@munib-tracker/shared/types";
import { DEFAULT_VOLUNTARY_FASTING_PREFS } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { FastKindChips } from "@/components/fasting/fast-kind-chips";
import { ThemedText } from "@/components/themed-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useSetting } from "@/lib/settings/use-setting";
import { formatDisplayHhMm } from "@/lib/time";
import {
  FASTING_INTENT_TIMES,
  type FastingIntentTime,
  toggleEnabledKind,
} from "@/lib/voluntary-fasting/prefs";

import { rowStyles } from "../row-styles";
import { SegmentedRow } from "../segmented-row";

/** Fiqh & madhhab › Voluntary fasting › "My fasts" (NF-3.2): the kinds the user follows. */
export function FastingKindsEditor({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { value, setValue, def, enabled } = useSetting<VoluntaryFastKind[]>(settingId);
  return (
    <View style={[rowStyles.block, isTV() && rowStyles.blockTv, { backgroundColor: colors.muted }]}>
      <View style={rowStyles.copy}>
        <ThemedText type="small">{t(def.titleKey)}</ThemedText>
        {def.subtitleKey ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(def.subtitleKey)}
          </ThemedText>
        ) : null}
      </View>
      <FastKindChips
        value={value}
        disabled={!enabled}
        onToggle={(kind) =>
          void setValue(
            toggleEnabledKind({ ...DEFAULT_VOLUNTARY_FASTING_PREFS, enabledKinds: value }, kind)
              .enabledKinds,
          )
        }
      />
    </View>
  );
}

/** Intention-reminder time options, labelled in the user's time format. */
export function useIntentTimeOptions(): { value: FastingIntentTime; label: string }[] {
  const { t } = useTranslation();
  const timeFormat = useSetting<TimeFormat>("language.timeFormat").value;
  return FASTING_INTENT_TIMES.map((value) => {
    if (value === "isha+30") return { value, label: t("voluntaryFasting.settings.afterIsha") };
    const [h, m] = value.split(":").map(Number);
    return { value, label: formatDisplayHhMm(h, m, timeFormat) };
  });
}

/** Reminders & notifications › Fasting › intention reminder time. */
export function FastingIntentTimeEditor({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { value, setValue, def, enabled } = useSetting<FastingIntentTime>(settingId);
  const options = useIntentTimeOptions();
  return (
    <SegmentedRow
      title={t(def.titleKey)}
      options={options}
      value={value}
      onChange={(next) => void setValue(next)}
      disabled={!enabled}
    />
  );
}
