import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { isRtlLocale } from "@/lib/i18n/rtl-locale";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Keeps react-native-web's locale context aligned with the saved app locale on
 * web. `document.documentElement.dir` alone flips native HTML layout but leaves
 * RN's default `ltr` writing direction — disclosure chevrons and other
 * direction-sensitive glyphs can then disagree with the mirrored flex rows.
 */
export function WebLayoutDirectionBridge({ children }: { children: ReactNode }) {
  const locale = usePreferences().locale;

  if (Platform.OS !== "web") {
    return children;
  }

  const dir = isRtlLocale(locale) ? "rtl" : "ltr";

  return (
    <View style={styles.root} dir={dir}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
  },
});
