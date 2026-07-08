import type { AppLocale } from "@munib-tracker/shared/types";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";
import { FLAG_ASSETS } from "@/assets/flags";
import { Radius } from "@/constants/theme";

type LocaleFlagSize = "sm" | "md";

type Props = {
  locale: AppLocale;
  size?: LocaleFlagSize;
  /** Highlight container when the locale is selected (picker row). */
  active?: boolean;
  activeRingColor?: string;
  activeBackgroundColor?: string;
  backgroundColor?: string;
  borderColor?: string;
};

/** Locale → ISO region for flag assets + emoji fallback (web uses SVG; native uses emoji). */
export const LOCALE_FLAG_DISPLAY: Record<
  AppLocale,
  { regionCode: string; flag: string; english: string; native: string }
> = {
  en: { regionCode: "US", flag: "🇺🇸", english: "English", native: "English" },
  ar: { regionCode: "SA", flag: "🇸🇦", english: "Arabic", native: "العربية" },
  ur: { regionCode: "PK", flag: "🇵🇰", english: "Urdu", native: "اردو" },
};

const SIZES: Record<
  LocaleFlagSize,
  { box: number; flagWidth: number; flagHeight: number; emoji: number }
> = {
  sm: { box: 28, flagWidth: 20, flagHeight: 14, emoji: 16 },
  md: { box: 36, flagWidth: 28, flagHeight: 20, emoji: 22 },
};

/**
 * Renders a locale flag — SVG on web (Windows Chrome lacks emoji flags),
 * regional-indicator emoji on native.
 */
export function LocaleFlag({
  locale,
  size = "md",
  active = false,
  activeRingColor,
  activeBackgroundColor,
  backgroundColor,
  borderColor,
}: Props) {
  const { regionCode, flag } = LOCALE_FLAG_DISPLAY[locale];
  const metrics = SIZES[size];
  const regionKey = regionCode.toLowerCase();

  return (
    <View
      style={[
        styles.box,
        {
          width: metrics.box,
          height: metrics.box,
          borderRadius: Radius.sm,
          backgroundColor: active
            ? (activeBackgroundColor ?? "transparent")
            : (backgroundColor ?? "transparent"),
          borderColor: active ? (activeRingColor ?? "transparent") : (borderColor ?? "transparent"),
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Platform.OS === "web" && FLAG_ASSETS[regionKey] ? (
        <Image
          source={FLAG_ASSETS[regionKey]}
          style={{
            width: metrics.flagWidth,
            height: metrics.flagHeight,
            borderRadius: 2,
          }}
          contentFit="cover"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={[styles.emoji, { fontSize: metrics.emoji }]} allowFontScaling={false}>
          {flag}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  emoji: {
    lineHeight: undefined,
  },
});
