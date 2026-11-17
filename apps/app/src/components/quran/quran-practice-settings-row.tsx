import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { SettingsRow } from "@/components/settings/settings-rows";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { downloadPercent } from "@/lib/quran-companion/model/download-job";
import {
  useCompanionPrefs,
  useCompanionPrefsReady,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import { useEnsureListenerLoaded, useListenerState } from "@/stores/quran-listener-store";

/**
 * Settings tab row → Settings → Qur'an practice (§9.5). The value is the
 * listener state: Ready, Not downloaded, Downloading N%, or Needs another try.
 * Never rendered on TV.
 */
export function QuranPracticeSettingsRow() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureCompanionPrefsLoaded();
  const ready = useCompanionPrefsReady();
  const prefs = useCompanionPrefs();
  useEnsureListenerLoaded(prefs.engineChoice, ready);
  const listener = useListenerState();

  if (!isPracticeAvailable()) return null;

  const value = (() => {
    switch (listener.status) {
      case "ready":
      case "update-available":
        return t("quranCompanion.settings.valueReady");
      case "downloading":
      case "verifying":
        return t("quranCompanion.settings.valueDownloading", {
          percent: downloadPercent(listener),
        });
      case "failed":
        return t("quranCompanion.settings.valueRetry");
      case "unsupported":
        return undefined;
      default:
        return t("quranCompanion.settings.valueNotDownloaded");
    }
  })();

  return (
    <SettingsRow
      icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
      title={t("quranCompanion.settings.title")}
      subtitle={t("quranCompanion.settings.rowSubtitle")}
      value={value}
      onPress={() => router.push("/settings/quran-practice" as Href)}
    />
  );
}
