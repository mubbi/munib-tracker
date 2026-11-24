import { masjidKey } from "@munib-tracker/shared/masjid";
import { type OcrResult, parseTimetable } from "@munib-tracker/shared/timetable-parser";
import * as ImagePicker from "expo-image-picker";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

import { TimetableImportCapture } from "@/components/masjid/timetable-import-capture";
import { TimetableImportReview } from "@/components/masjid/timetable-import-review";
import { useKeptPhoto } from "@/components/masjid/use-kept-photo";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { toAppLocale } from "@/lib/locale-bcp47";
import { useHomeMasjid } from "@/lib/masjid/home-masjid";
import { saveImportedTimetable } from "@/lib/masjid/timetable-import";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { getZonedParts } from "@/lib/time";
import {
  calculatedTimesFor,
  discardPhoto,
  ocrAvailability,
  recognizeImage,
} from "@/lib/timetable-ocr";
import {
  draftFromParsed,
  draftToImported,
  type IqamahPrayer,
  overrideKey,
  type ReviewOverrides,
  shiftTimetablePeriod,
  type TimetablePeriod,
} from "@/lib/timetable-ocr/review";
import { useToast } from "@/providers/toast-provider";
import { useLocation } from "@/stores/location-store";

type Phase = "capture" | "recognizing" | "review" | "empty" | "error";

const TIMES_HREF = "/masjids/times" as Href;

/**
 * NF-3.12 timetable import (D3 — on-device only, permanently). Photograph or
 * pick the masjid's printed timetable → on-device text recognition → the
 * rule-based parser → a review grid (flagged cells first) → saved as the
 * user's private "Your times" for the home masjid. Nothing is uploaded; the
 * app's copy of the photo is deleted after reading unless the user keeps it
 * for the review. TV: phone-only (manual times stay on /masjids/times).
 */
function ImportFlow() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { colors } = useThemeTokens();
  const locale = toAppLocale(i18n.language);
  const home = useHomeMasjid();
  const location = useLocation();
  const availability = ocrAvailability();
  const web = Platform.OS === "web";

  const [phase, setPhase] = useState<Phase>("capture");
  const [arabic, setArabic] = useState(false);
  const [keepPhoto, setKeepPhoto] = useState(false);
  const photo = useKeptPhoto();
  const [ocr, setOcr] = useState<OcrResult | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [overrides, setOverrides] = useState<ReviewOverrides>({});
  const [jumuahEdits, setJumuahEdits] = useState<string[] | null>(null);
  const [period, setPeriod] = useState<TimetablePeriod | null>(null);
  /** The user's answer when the sheet has more than one possible date column. */
  const [dateColumn, setDateColumn] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const today = getZonedParts(new Date(), location.timeZone);
  const calculated = useMemo(() => calculatedTimesFor(location), [location]);

  const parsed = useMemo(() => {
    if (!ocr) return null;
    return parseTimetable(ocr, {
      referenceDate: { year: today.year, month: today.month, day: today.day },
      calculated,
      ...(period ?? {}),
      ...(dateColumn != null && { dateColumn }),
    });
  }, [ocr, period, dateColumn, calculated, today.year, today.month, today.day]);

  const draft = useMemo(() => {
    if (!parsed) return null;
    const base = draftFromParsed(parsed, overrides);
    if (base && jumuahEdits) {
      base.jumuah = jumuahEdits.map((text, i) => ({
        text,
        kind: base.jumuah[i]?.kind ?? "iqamah",
      }));
    }
    return base;
  }, [parsed, overrides, jumuahEdits]);

  if (!home) {
    return (
      <EmptyState
        icon={{ ios: "house.fill", android: "home", web: "home" }}
        title={t("masjids.times.noHomeTitle")}
        description={t("masjids.times.noHomeBody")}
        actionLabel={t("masjids.times.findMasjid")}
        onAction={() => router.push("/masjids" as Href)}
      />
    );
  }

  if (availability === "unavailable") {
    return (
      <EmptyState
        icon={{ ios: "text.viewfinder", android: "document_scanner", web: "document_scanner" }}
        title={t("timetableImport.unavailableTitle")}
        description={t("timetableImport.unavailableBody")}
        actionLabel={t("timetableImport.typeInstead")}
        onAction={() => router.replace(TIMES_HREF)}
      />
    );
  }

  const thisMonth = { year: today.year, month: today.month };

  const run = async (uri: string) => {
    setPhase("recognizing");
    setOverrides({});
    setJumuahEdits(null);
    setPeriod(null);
    setDateColumn(null);
    try {
      const result = await recognizeImage(uri, { arabic });
      setOcr(result);
      // A new reading replaces the last one, kept photo included.
      if (keepPhoto) photo.keep(uri);
      else {
        photo.clear();
        discardPhoto(uri);
      }
      const first = parseTimetable(result, {
        referenceDate: { year: today.year, month: today.month, day: today.day },
      });
      if (first.layout === "monthly") {
        setPeriod({
          year: first.monthHint.year ?? today.year,
          month: first.monthHint.month ?? today.month,
        });
      }
      setPhase(first.layout === "none" ? "empty" : "review");
    } catch {
      discardPhoto(uri);
      setPhase("error");
    }
  };

  const pick = async (source: "camera" | "library") => {
    setPermissionDenied(false);
    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setPermissionDenied(true);
        return;
      }
    }
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      allowsEditing: !web,
      quality: 1,
    };
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    const asset = result.canceled ? null : result.assets?.[0];
    if (asset?.uri) await run(asset.uri);
  };

  const reset = () => {
    photo.clear();
    setOcr(null);
    setPhase("capture");
  };

  const edit = (day: number | null, prayer: IqamahPrayer, text: string, monthOffset: number) => {
    setOverrides((prev) => ({ ...prev, [overrideKey(day, prayer, monthOffset)]: text }));
  };

  const chooseDateColumn = (id: number) => {
    // Rows are re-dated, so edits keyed by the old days no longer apply.
    setOverrides({});
    setDateColumn(id);
  };

  const editJumuah = (index: number, text: string) => {
    const current = jumuahEdits ?? draft?.jumuah.map((slot) => slot.text) ?? [];
    const next = [...current];
    next[index] = text;
    setJumuahEdits(next);
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const imported = draftToImported(draft, period ?? thisMonth);
      const ok = await saveImportedTimetable(masjidKey(home), imported);
      if (!ok) {
        toast.error(t("timetableImport.nothingToSave"));
        return;
      }
      photo.clear();
      toast.success(t("timetableImport.savedToast"), t("masjids.yourTimesNote"));
      router.replace(TIMES_HREF);
    } catch {
      toast.error(t("masjids.times.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (phase === "recognizing") {
    return (
      <Card padding="four">
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
          <ThemedText type="smallBold">{t("timetableImport.reading")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {web ? t("timetableImport.inBrowser") : t("timetableImport.onDevice")}
          </ThemedText>
        </View>
      </Card>
    );
  }

  if (phase === "review" && draft && parsed) {
    return (
      <TimetableImportReview
        draft={draft}
        period={period}
        photoUri={photo.uri}
        locale={locale}
        saving={saving}
        onShiftMonth={(delta) =>
          setPeriod((prev) => shiftTimetablePeriod(prev ?? thisMonth, delta))
        }
        onChooseDateColumn={chooseDateColumn}
        onEdit={edit}
        onEditJumuah={editJumuah}
        onSave={() => void save()}
        onRetake={reset}
      />
    );
  }

  return (
    <TimetableImportCapture
      masjidName={home.name ?? t("masjids.unnamed")}
      locale={locale}
      notice={phase === "empty" || phase === "error" ? phase : null}
      arabic={arabic}
      keepPhoto={keepPhoto}
      permissionDenied={permissionDenied}
      onArabicChange={setArabic}
      onKeepPhotoChange={setKeepPhoto}
      onPick={(source) => void pick(source)}
      onTypeInstead={() => router.replace(TIMES_HREF)}
    />
  );
}

export default function TimetableImportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("masjids.yourTimes")}
      title={t("timetableImport.title")}
      subtitle={t("timetableImport.subtitle")}
      onBack={() => goBackOrReplace(router, TIMES_HREF)}
    >
      <Seo path="/masjids/import" />
      {isTV() ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {t("timetableImport.tvNote")}
        </ThemedText>
      ) : (
        <ImportFlow />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", gap: Spacing.two, paddingVertical: Spacing.four },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/masjids/import");
