import type { ContactKind } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { RelativeCard } from "@/components/family-ties/relative-card";
import { useContactActions } from "@/components/family-ties/use-contact-actions";
import { useRecordAction } from "@/components/records/use-record-action";
import { ScreenLayout } from "@/components/screen-layout";
import { ChoiceChips } from "@/components/self-review/choice-chips";
import { EvidenceLinks, type EvidenceRef } from "@/components/self-review/evidence-links";
import { PhoneOnlyNotice } from "@/components/self-review/phone-only-notice";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Sheet } from "@/components/ui/sheet";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { WallClockPicker } from "@/components/ui/wall-clock-picker";
import { VaultLockGate } from "@/components/vault";
import { Spacing } from "@/constants/theme";
import { DUA_TOPICS } from "@/lib/dua-browse";
import { familyTiesActions, useFamilyTies } from "@/lib/family-ties/family-ties-store";
import { buildDueList, buildUpcomingList, CONTACT_KINDS } from "@/lib/family-ties/model";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import { formatHhMm, parseHhMm } from "@/lib/time";
import { useToast } from "@/providers/toast-provider";

/** Evidence by reference (docs/proofs/silat-al-rahim.md); corpus numbers match Bukhari's. */
export const FAMILY_TIES_EVIDENCE: readonly EvidenceRef[] = [
  { kind: "quran", surah: 4, ayah: 1, labelKey: "familyTies.evidence.quran41" },
  { kind: "quran", surah: 47, ayah: 22, labelKey: "familyTies.evidence.quran4722" },
  { kind: "hadith", collection: "bukhari", number: "5986", labelKey: "familyTies.evidence.b5986" },
  { kind: "hadith", collection: "bukhari", number: "5984", labelKey: "familyTies.evidence.b5984" },
  { kind: "hadith", collection: "bukhari", number: "5971", labelKey: "familyTies.evidence.b5971" },
];

/** Duas section narrowed to the duas for the deceased (Hisnul Muslim funeral + burial). */
const DECEASED_DUAS_HREF = {
  pathname: "/dua/[category]",
  params: { category: DUA_TOPICS.deceased.categoryId, topic: "deceased" },
} as Href;

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
/** `Date#getDay()` for Friday: "after Jumu'ah" only means that on Fridays (otherwise after Dhuhr). */
const FRIDAY = 5;
type DigestMode = "after-jumuah" | "custom";

function FamilyTiesContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const run = useRecordAction();
  const digestReminder = useSetting<boolean>("notifications.personal.familyTies");
  const { relatives, settings, status, error } = useFamilyTies();
  const { open } = useContactActions();
  const [logFor, setLogFor] = useState<string | null>(null);
  const today = getLocalDateString();

  const due = useMemo(() => buildDueList(relatives, today), [relatives, today]);
  const upcoming = useMemo(() => buildUpcomingList(relatives, today), [relatives, today]);
  const remembered = relatives.filter((r) => r.deceased);
  const paused = relatives.filter((r) => r.paused && !r.deceased);

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (status !== "ready") return null;

  const edit = (id?: string) =>
    router.push(
      (id ? { pathname: "/family-ties/edit", params: { id } } : "/family-ties/edit") as Href,
    );

  const log = async (relativeId: string, kind: ContactKind) => {
    await familyTiesActions.logContact(relativeId, kind);
    toast.success(t("familyTies.loggedToast", { kind: t(`familyTies.contact.${kind}`) }));
  };

  const card = (relative: (typeof relatives)[number], isDue: boolean) => (
    <RelativeCard
      key={relative.id}
      relative={relative}
      due={isDue}
      today={today}
      onEdit={() => edit(relative.id)}
      onContact={(channel) => void open(relative.id, channel, relative.phone)}
      onLog={() => setLogFor(relative.id)}
      onDua={() => void log(relative.id, "dua")}
    />
  );

  const digestMode: DigestMode = settings.digestTime === "after-jumuah" ? "after-jumuah" : "custom";
  const digestClock = parseHhMm(digestMode === "custom" ? settings.digestTime : "14:00", {
    hour: 14,
    minute: 0,
  });

  if (relatives.length === 0) {
    return (
      <View style={styles.stack}>
        <EmptyState
          icon={{ ios: "person.2.fill", android: "group", web: "group" }}
          title={t("familyTies.emptyTitle")}
          description={t("familyTies.emptyBody")}
          actionLabel={t("familyTies.add")}
          onAction={() => edit()}
        />
        <EvidenceLinks titleKey="familyTies.evidence.title" refs={FAMILY_TIES_EVIDENCE} />
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Button label={t("familyTies.add")} onPress={() => edit()} />
        <Button
          label={t("familyTies.historyLink")}
          variant="ghost"
          onPress={() => router.push("/family-ties/history")}
        />
      </View>

      <SectionHeader
        title={t("familyTies.dueTitle")}
        subtitle={
          due.length === 0 ? t("familyTies.dueNone") : t("familyTies.dueSub", { count: due.length })
        }
        icon={{ ios: "heart.circle.fill", android: "favorite", web: "favorite" }}
      />
      {due.map(({ relative }) => card(relative, true))}

      {upcoming.length > 0 ? (
        <>
          <SectionHeader
            title={t("familyTies.upcomingTitle")}
            icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          />
          {upcoming.map(({ relative }) => card(relative, false))}
        </>
      ) : null}

      {paused.length > 0 ? (
        <>
          <SectionHeader
            title={t("familyTies.pausedTitle")}
            icon={{ ios: "pause.circle.fill", android: "pause_circle", web: "pause_circle" }}
          />
          {paused.map((relative) => card(relative, false))}
        </>
      ) : null}

      {remembered.length > 0 ? (
        <Card padding="three">
          <SectionHeader
            title={t("familyTies.rememberTitle")}
            subtitle={t("familyTies.rememberSub")}
            icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
          />
          <View style={styles.list}>
            {remembered.map((relative) => (
              <View key={relative.id} style={styles.switchRow}>
                <ThemedText type="small" style={styles.flex}>
                  {relative.name}
                </ThemedText>
                <Button
                  label={t("familyTies.actions.dua")}
                  size="sm"
                  variant="ghost"
                  accessibilityHint={relative.name}
                  onPress={() => void log(relative.id, "dua")}
                />
                {/* Otherwise a relative marked as passed away could never be edited again. */}
                <Button
                  label={t("common.edit")}
                  size="sm"
                  variant="ghost"
                  accessibilityHint={relative.name}
                  onPress={() => edit(relative.id)}
                />
              </View>
            ))}
            <Button
              label={t("familyTies.janazahDuas")}
              variant="secondary"
              onPress={() => router.push(DECEASED_DUAS_HREF)}
            />
          </View>
        </Card>
      ) : null}

      <Card padding="three">
        <SectionHeader
          title={t("familyTies.digestTitle")}
          icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
        />
        <View style={styles.list}>
          <View style={styles.switchRow}>
            <ThemedText type="small" style={styles.flex}>
              {t("familyTies.digestToggle")}
            </ThemedText>
            <ThemedSwitch
              value={digestReminder.value}
              onValueChange={(on) => void digestReminder.setValue(on)}
              accessibilityLabel={t("familyTies.digestToggle")}
            />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("familyTies.digestPrivacy")}
          </ThemedText>
          {digestReminder.value ? (
            <>
              <ChoiceChips
                options={WEEKDAYS.map((day) => ({
                  id: String(day),
                  // 2024-01-07 was a Sunday: locale weekday names without extra i18n keys.
                  label: new Intl.DateTimeFormat(i18n.language, { weekday: "short" }).format(
                    new Date(2024, 0, 7 + day),
                  ),
                }))}
                value={String(settings.digestWeekday)}
                onChange={(day) =>
                  void run(
                    familyTiesActions.saveSettings({ ...settings, digestWeekday: Number(day) }),
                  )
                }
                accessibilityLabel={t("familyTies.digestDay")}
              />
              <ChoiceChips<DigestMode>
                options={[
                  {
                    id: "after-jumuah",
                    label:
                      settings.digestWeekday === FRIDAY
                        ? t("familyTies.digestAfterJumuah")
                        : t("privateUx.familyTies.digestAfterDhuhr"),
                  },
                  { id: "custom", label: t("familyTies.digestCustom") },
                ]}
                value={digestMode}
                onChange={(mode) =>
                  void run(
                    familyTiesActions.saveSettings({
                      ...settings,
                      digestTime:
                        mode === "after-jumuah"
                          ? "after-jumuah"
                          : formatHhMm(digestClock.hour, digestClock.minute),
                    }),
                  )
                }
                accessibilityLabel={t("familyTies.digestTime")}
              />
              {digestMode === "custom" ? (
                <WallClockPicker
                  value={digestClock}
                  onChange={(value) =>
                    void run(
                      familyTiesActions.saveSettings({
                        ...settings,
                        digestTime: formatHhMm(value.hour, value.minute),
                      }),
                    )
                  }
                />
              ) : null}
            </>
          ) : null}
        </View>
      </Card>

      <EvidenceLinks titleKey="familyTies.evidence.title" refs={FAMILY_TIES_EVIDENCE} />

      <Sheet visible={logFor != null} onClose={() => setLogFor(null)} variant="bottom">
        <ThemedText type="subtitle">{t("familyTies.logTitle")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("familyTies.logBody")}
        </ThemedText>
        <View style={styles.sheetActions}>
          {CONTACT_KINDS.filter((kind) => kind !== "dua").map((kind) => (
            <Button
              key={kind}
              label={t(`familyTies.contact.${kind}`)}
              variant="secondary"
              onPress={() => {
                const id = logFor;
                setLogFor(null);
                if (id) void log(id, kind);
              }}
            />
          ))}
        </View>
      </Sheet>
    </View>
  );
}

export default function FamilyTiesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("familyTies.eyebrow")}
      title={t("familyTies.title")}
      subtitle={t("familyTies.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/family-ties" />
      {isTV() ? (
        <PhoneOnlyNotice />
      ) : (
        <VaultLockGate>
          <FamilyTiesContent />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
  sheetActions: { gap: Spacing.two, marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family-ties");
