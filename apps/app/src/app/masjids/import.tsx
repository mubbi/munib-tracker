import { masjidKey } from "@munib-tracker/shared/masjid";
import {
  daysInMonth,
  type OcrResult,
  parseTimetable,
  timetablePeriodFor,
} from "@munib-tracker/shared/timetable-parser";
import * as ImagePicker from "expo-image-picker";
import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { TimetableDateColumnQuestion } from "@/components/masjid/timetable-date-column-question";
import { TimetableReviewGrid } from "@/components/masjid/timetable-review-grid";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
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
  ocrDownloadAccepted,
  ocrDownloadBytes,
  recognizeImage,
} from "@/lib/timetable-ocr";
import {
  draftFromParsed,
  draftToImported,
  type IqamahPrayer,
  overrideKey,
  type ReviewOverrides,
  reviewCounts,
} from "@/lib/timetable-ocr/review";
import { useToast } from "@/providers/toast-provider";
import { useLocation } from "@/stores/location-store";

type Phase = "capture" | "recognizing" | "review" | "empty" | "error";

const TIMES_HREF = "/masjids/times" as Href;

function formatMegabytes(bytes: number, locale: string): string {
  return (bytes / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 1 });
}

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
  const { colors, tokens } = useThemeTokens();
  const locale = toAppLocale(i18n.language);
  const home = useHomeMasjid();
  const location = useLocation();
  const availability = ocrAvailability();
  const web = Platform.OS === "web";

  const [phase, setPhase] = useState<Phase>("capture");
  const [arabic, setArabic] = useState(false);
  const [keepPhoto, setKeepPhoto] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [ocr, setOcr] = useState<OcrResult | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [overrides, setOverrides] = useState<ReviewOverrides>({});
  const [jumuahEdits, setJumuahEdits] = useState<string[] | null>(null);
  const [period, setPeriod] = useState<{ year: number; month: number } | null>(null);
  /** The user's answer when the sheet has more than one possible date column. */
  const [dateColumn, setDateColumn] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const photoRef = useRef<string | null>(null);
  photoRef.current = photoUri;

  // Whatever happens, the app's copy of the photo never outlives this screen.
  useEffect(() => () => discardPhoto(photoRef.current), []);

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

  const run = async (uri: string) => {
    setPhase("recognizing");
    setOverrides({});
    setJumuahEdits(null);
    setPeriod(null);
    setDateColumn(null);
    try {
      const result = await recognizeImage(uri, { arabic });
      setOcr(result);
      if (keepPhoto) setPhotoUri(uri);
      else discardPhoto(uri);
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
    discardPhoto(photoUri);
    setPhotoUri(null);
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

  const shiftMonth = (delta: number) => {
    setPeriod((prev) => {
      const base = prev ?? { year: today.year, month: today.month };
      const index = base.year * 12 + (base.month - 1) + delta;
      return { year: Math.floor(index / 12), month: (index % 12) + 1 };
    });
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const imported = draftToImported(draft, period ?? { year: today.year, month: today.month });
      const ok = await saveImportedTimetable(masjidKey(home), imported);
      if (!ok) {
        toast.error(t("timetableImport.nothingToSave"));
        return;
      }
      discardPhoto(photoUri);
      setPhotoUri(null);
      toast.success(t("timetableImport.savedToast"), t("masjids.yourTimesNote"));
      router.replace(TIMES_HREF);
    } catch {
      toast.error(t("masjids.times.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const deviceBadge = web ? t("timetableImport.inBrowser") : t("timetableImport.onDevice");

  if (phase === "recognizing") {
    return (
      <Card padding="four">
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
          <ThemedText type="smallBold">{t("timetableImport.reading")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {deviceBadge}
          </ThemedText>
        </View>
      </Card>
    );
  }

  if (phase === "review" && draft && parsed) {
    const counts = reviewCounts(draft);
    const monthLabel =
      period &&
      new Date(period.year, period.month - 1, 1).toLocaleDateString(locale, {
        month: "long",
        year: "numeric",
      });
    const dayLabel = (day: number, monthOffset: number) =>
      period
        ? new Date(period.year, period.month - 1 + monthOffset, day).toLocaleDateString(locale, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
        : String(day);
    const outOfMonth =
      period && draft.layout === "monthly"
        ? draft.rows.some((row) => {
            const month = timetablePeriodFor(period, row.monthOffset ?? 0);
            return (row.day ?? 0) > daysInMonth(month.year, month.month);
          })
        : false;
    return (
      <View style={styles.stack}>
        <Card padding="three">
          <SectionHeader
            title={t("timetableImport.reviewTitle")}
            subtitle={t("timetableImport.reviewSummary", {
              filled: counts.filled,
              check: counts.toCheck,
            })}
            icon={{ ios: "checkmark.shield.fill", android: "verified_user", web: "verified_user" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
            {t("timetableImport.reviewHint")}
          </ThemedText>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={[styles.photo, { borderColor: colors.border }]}
              resizeMode="contain"
              accessibilityLabel={t("timetableImport.photoA11y")}
            />
          ) : null}
        </Card>

        {draft.layout === "monthly" && period ? (
          <Card padding="three">
            <SectionHeader title={t("timetableImport.monthTitle")} />
            <View style={styles.monthRow}>
              <Button
                size="sm"
                variant="secondary"
                label={t("timetableImport.prevMonth")}
                onPress={() => shiftMonth(-1)}
              />
              <ThemedText type="smallBold" style={styles.flexCenter}>
                {monthLabel}
              </ThemedText>
              <Button
                size="sm"
                variant="secondary"
                label={t("timetableImport.nextMonth")}
                onPress={() => shiftMonth(1)}
              />
            </View>
            {outOfMonth ? (
              <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
                {t("timetableImport.outOfMonth")}
              </ThemedText>
            ) : null}
          </Card>
        ) : null}

        {draft.dateQuestion ? (
          <TimetableDateColumnQuestion
            columns={draft.dateQuestion.columns}
            onChoose={chooseDateColumn}
          />
        ) : null}

        <Card padding="three">
          <SectionHeader title={t("timetableImport.iqamahTitle")} />
          <View style={styles.gapTop}>
            <TimetableReviewGrid draft={draft} dayLabel={dayLabel} onEdit={edit} />
          </View>
        </Card>

        {draft.jumuah.length > 0 ? (
          <Card padding="three">
            <SectionHeader title={t("masjids.jumuah")} />
            <View style={styles.list}>
              {draft.jumuah.map((slot, index) => (
                <View key={`j-${index.toString()}`} style={styles.monthRow}>
                  <ThemedText type="small" style={styles.flex}>
                    {slot.kind === "khutbah"
                      ? t("timetableImport.khutbah")
                      : t("masjids.times.jumuahSlot", { number: index + 1 })}
                  </ThemedText>
                  <JumuahInput value={slot.text} onChange={(text) => editJumuah(index, text)} />
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        {counts.invalid > 0 ? (
          <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
            {t("timetableImport.fixInvalid", { count: counts.invalid })}
          </ThemedText>
        ) : null}
        <View style={styles.monthRow}>
          <Button
            label={t("timetableImport.save")}
            onPress={() => void save()}
            disabled={saving || counts.blocked || counts.invalid > 0 || counts.filled === 0}
          />
          <Button variant="ghost" label={t("timetableImport.retake")} onPress={reset} />
        </View>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("masjids.times.privacy")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {phase === "empty" || phase === "error" ? (
        <Card padding="three">
          <SectionHeader
            title={
              phase === "empty" ? t("timetableImport.emptyTitle") : t("timetableImport.errorTitle")
            }
            icon={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
          />
          <ThemedText type="small" style={styles.gapTop}>
            {phase === "empty" ? t("timetableImport.emptyBody") : t("timetableImport.errorBody")}
          </ThemedText>
          <View style={[styles.monthRow, styles.gapTop]}>
            <Button
              size="sm"
              variant="secondary"
              label={t("timetableImport.typeInstead")}
              onPress={() => router.replace(TIMES_HREF)}
            />
          </View>
        </Card>
      ) : null}

      <Card padding="three">
        <SectionHeader
          title={t("timetableImport.captureTitle")}
          icon={{ ios: "camera.viewfinder", android: "document_scanner", web: "document_scanner" }}
        />
        <View style={styles.list}>
          <ThemedText type="small">
            {t("timetableImport.intro", { name: home.name ?? t("masjids.unnamed") })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("timetableImport.tips")}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: tokens.status.success.soft }]}>
            <ThemedText type="caption" style={{ color: tokens.status.success.text }}>
              {deviceBadge}
            </ThemedText>
          </View>
          {web ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {ocrDownloadAccepted()
                ? t("timetableImport.webCached")
                : t("timetableImport.webDownload", {
                    size: formatMegabytes(ocrDownloadBytes({ arabic }), locale),
                  })}
            </ThemedText>
          ) : null}
          {web ? (
            <ToggleRow
              label={t("timetableImport.arabicToggle", {
                size: formatMegabytes(
                  ocrDownloadBytes({ arabic: true }) - ocrDownloadBytes(),
                  locale,
                ),
              })}
              value={arabic}
              onChange={setArabic}
            />
          ) : null}
          <ToggleRow
            label={t("timetableImport.keepPhoto")}
            hint={t("timetableImport.keepPhotoHint")}
            value={keepPhoto}
            onChange={setKeepPhoto}
          />
          <View style={styles.monthRow}>
            {!web ? (
              <Button
                icon={{ ios: "camera.fill", android: "photo_camera", web: "photo_camera" }}
                label={t("timetableImport.takePhoto")}
                onPress={() => void pick("camera")}
              />
            ) : null}
            <Button
              variant={web ? "primary" : "secondary"}
              icon={{ ios: "photo.on.rectangle", android: "image", web: "image" }}
              label={
                web && !ocrDownloadAccepted()
                  ? t("timetableImport.choosePhotoDownload")
                  : t("timetableImport.choosePhoto")
              }
              onPress={() => void pick("library")}
            />
          </View>
          {permissionDenied ? (
            <View style={styles.list}>
              <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
                {t("timetableImport.cameraDenied")}
              </ThemedText>
              <Button
                size="sm"
                variant="ghost"
                label={t("timetableImport.openSettings")}
                onPress={() => void Linking.openSettings()}
              />
            </View>
          ) : null}
        </View>
      </Card>

      <ThemedText type="caption" themeColor="mutedForeground">
        {t("timetableImport.privacy")}
      </ThemedText>
    </View>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.monthRow}>
      <View style={styles.flex}>
        <ThemedText type="small">{label}</ThemedText>
        {hint ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      <ThemedSwitch value={value} onValueChange={onChange} accessibilityLabel={label} />
    </View>
  );
}

function JumuahInput({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="--:--"
      placeholderTextColor={colors.mutedForeground}
      inputMode="numeric"
      maxLength={5}
      accessibilityLabel={t("masjids.jumuah")}
      style={[
        styles.input,
        styles.jumuahInput,
        tokens.inputSurface,
        { color: colors.foreground, borderColor: colors.border },
      ]}
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
  stack: { gap: Spacing.three },
  list: { gap: Spacing.two, marginTop: Spacing.two },
  gapTop: { marginTop: Spacing.two },
  center: { alignItems: "center", gap: Spacing.two, paddingVertical: Spacing.four },
  monthRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  flex: { flex: 1 },
  flexCenter: { flex: 1, textAlign: "center" },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  photo: {
    marginTop: Spacing.two,
    width: "100%",
    height: 220,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  jumuahInput: { width: 96 },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/masjids/import");
