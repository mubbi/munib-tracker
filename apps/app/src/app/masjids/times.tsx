import {
  IQAMAH_PRAYERS,
  type IqamahDaily,
  type JumuahSlot,
  masjidKey,
  resolveIqamahTimetable,
} from "@munib-tracker/shared/masjid";
import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { TimetableRows } from "@/components/masjid/masjid-detail-view";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { WallClockPicker, type WallClockValue } from "@/components/ui/wall-clock-picker";
import { Spacing } from "@/constants/theme";
import { requestIqamahReschedule, useHomeMasjid } from "@/lib/masjid/home-masjid";
import { TIMETABLE_IMPORT_ROUTE } from "@/lib/masjid/timetable-import";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import { formatHhMm, parseHhMm } from "@/lib/time";
import { useToast } from "@/providers/toast-provider";
import {
  homeMasjidTimesActions,
  useEnsureHomeMasjidTimesLoaded,
  usePrivateMasjidTimes,
} from "@/stores/home-masjid-times-store";

const MAX_JUMUAH_SLOTS = 3;
const WALK_STEP = 5;
const DEFAULT_CLOCK: Record<ObligatoryPrayer, WallClockValue> = {
  fajr: { hour: 5, minute: 30 },
  dhuhr: { hour: 13, minute: 30 },
  asr: { hour: 16, minute: 30 },
  maghrib: { hour: 18, minute: 0 },
  isha: { hour: 20, minute: 0 },
};

type DraftDaily = Partial<Record<ObligatoryPrayer, WallClockValue>>;
type JumuahDraft = { id: number; value: WallClockValue };

let slotCounter = 0;
function nextSlotId(): number {
  slotCounter += 1;
  return slotCounter;
}

function toDraft(daily: IqamahDaily | undefined): DraftDaily {
  const out: DraftDaily = {};
  for (const prayer of IQAMAH_PRAYERS) {
    const at = daily?.[prayer];
    if (at) out[prayer] = parseHhMm(at);
  }
  return out;
}

function fromDraft(draft: DraftDaily): IqamahDaily {
  const out: IqamahDaily = {};
  for (const prayer of IQAMAH_PRAYERS) {
    const value = draft[prayer];
    if (value) out[prayer] = formatHhMm(value.hour, value.minute);
  }
  return out;
}

/**
 * "Your times" for the home masjid (NF-3.11): private iqamah + Jumu'ah times
 * entered by the user. Stored in `home_masjid_times`, synced only to the user's
 * own devices, never sent to the masjids API. Also hosts the iqamah reminder
 * toggle + walk minutes, and the NF-3.12 OCR import slot. TV is read-only.
 */
function YourTimes() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const tv = isTV();
  const home = useHomeMasjid();
  useEnsureHomeMasjidTimesLoaded();
  const key = home ? masjidKey(home) : null;
  const saved = usePrivateMasjidTimes(key);
  // Single write path (§4.5.4): the registry defs own the writes + reschedule.
  const reminder = useSetting<boolean>("notifications.salah.iqamah");
  const walkSetting = useSetting<number>("prayer-times.masjidWalkMinutes");
  const [daily, setDaily] = useState<DraftDaily>({});
  const [jumuah, setJumuah] = useState<JumuahDraft[]>([]);
  const [dirty, setDirty] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (dirty) return;
    setDaily(toDraft(saved?.daily));
    setJumuah(
      (saved?.jumuah ?? [])
        .map((slot) => slot.iqamahAt ?? slot.khutbahAt)
        .filter((at): at is string => !!at)
        .map((at) => ({ id: nextSlotId(), value: parseHhMm(at) })),
    );
  }, [saved, dirty]);

  if (!home || !key) {
    return (
      <EmptyState
        icon={{ ios: "house.fill", android: "home", web: "home" }}
        title={t("masjids.times.noHomeTitle")}
        description={t("masjids.times.noHomeBody")}
        actionLabel={tv ? undefined : t("masjids.times.findMasjid")}
        onAction={tv ? undefined : () => router.push("/masjids" as Href)}
      />
    );
  }

  const savedTimetable = resolveIqamahTimetable({ privateTimes: saved });
  const walk = walkSetting.value;

  if (tv) {
    return savedTimetable ? (
      <Card padding="three">
        <SectionHeader
          title={home.name ?? t("masjids.unnamed")}
          subtitle={t("masjids.yourTimes")}
        />
        <TimetableRows timetable={savedTimetable} />
      </Card>
    ) : null;
  }

  const editDaily = (prayer: ObligatoryPrayer, value: WallClockValue | null) => {
    setDirty(true);
    setDaily((prev) => {
      const next = { ...prev };
      if (value) next[prayer] = value;
      else delete next[prayer];
      return next;
    });
  };

  const editJumuah = (index: number, value: WallClockValue | null) => {
    setDirty(true);
    setJumuah((prev) => {
      const next = [...prev];
      if (!value) next.splice(index, 1);
      else next[index] = { id: next[index]?.id ?? nextSlotId(), value };
      return next;
    });
  };

  const save = async () => {
    const jumuahSlots: JumuahSlot[] = jumuah.map(({ value: v }) => ({
      iqamahAt: formatHhMm(v.hour, v.minute),
    }));
    try {
      await homeMasjidTimesActions.save(key, {
        daily: fromDraft(daily),
        jumuah: jumuahSlots,
        // Keep a monthly timetable imported via OCR (NF-3.12) untouched.
        ...(saved?.monthly ? { monthly: saved.monthly } : {}),
        origin: "manual",
      });
    } catch {
      toast.error(t("masjids.times.saveError"));
      return;
    }
    setDirty(false);
    requestIqamahReschedule();
    toast.success(t("masjids.times.savedToast"));
  };

  const clearAll = async () => {
    setConfirmClear(false);
    try {
      await homeMasjidTimesActions.remove(key);
    } catch {
      toast.error(t("masjids.times.saveError"));
      return;
    }
    setDirty(false);
    requestIqamahReschedule();
    toast.success(t("masjids.times.clearedToast"));
  };

  const setWalk = (minutes: number) => {
    void walkSetting.setValue(minutes);
  };

  return (
    <View style={styles.stack}>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("masjids.times.intro", { name: home.name ?? t("masjids.unnamed") })}
      </ThemedText>

      {TIMETABLE_IMPORT_ROUTE ? (
        <Button
          variant="secondary"
          icon={{ ios: "camera.fill", android: "photo_camera", web: "photo_camera" }}
          label={t("masjids.times.importPhoto")}
          accessibilityHint={t("masjids.times.importHint")}
          onPress={() =>
            router.push({
              pathname: TIMETABLE_IMPORT_ROUTE as never,
              params: { masjid: key },
            } as Href)
          }
        />
      ) : null}

      <Card padding="three">
        <SectionHeader title={t("masjids.times.dailyTitle")} />
        <View style={styles.list}>
          {IQAMAH_PRAYERS.map((prayer) => {
            const value = daily[prayer];
            return (
              <View key={prayer} style={styles.item}>
                <View style={styles.row}>
                  <ThemedText type="smallBold" style={styles.flex}>
                    {t(`prayers.${prayer}`)}
                  </ThemedText>
                  <Button
                    size="sm"
                    variant="ghost"
                    label={value ? t("masjids.times.clear") : t("masjids.times.add")}
                    accessibilityHint={t("masjids.times.prayerHint", {
                      prayer: t(`prayers.${prayer}`),
                    })}
                    onPress={() => editDaily(prayer, value ? null : DEFAULT_CLOCK[prayer])}
                  />
                </View>
                {value ? (
                  <WallClockPicker
                    label={t("masjids.times.iqamahAt", { prayer: t(`prayers.${prayer}`) })}
                    value={value}
                    onChange={(next) => editDaily(prayer, next)}
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader title={t("masjids.jumuah")} subtitle={t("masjids.times.jumuahSub")} />
        <View style={styles.list}>
          {jumuah.map(({ id, value }, index) => (
            <View key={id} style={styles.item}>
              <View style={styles.row}>
                <ThemedText type="smallBold" style={styles.flex}>
                  {t("masjids.times.jumuahSlot", { number: index + 1 })}
                </ThemedText>
                <Button
                  size="sm"
                  variant="ghost"
                  label={t("masjids.times.clear")}
                  onPress={() => editJumuah(index, null)}
                />
              </View>
              <WallClockPicker value={value} onChange={(next) => editJumuah(index, next)} />
            </View>
          ))}
          {jumuah.length < MAX_JUMUAH_SLOTS ? (
            <Button
              size="sm"
              variant="secondary"
              label={t("masjids.times.addJumuah")}
              onPress={() => editJumuah(jumuah.length, { hour: 13, minute: 30 })}
            />
          ) : null}
        </View>
      </Card>

      <View style={styles.row}>
        <Button label={t("masjids.times.save")} onPress={() => void save()} disabled={!dirty} />
        {saved ? (
          <Button
            variant="ghost"
            label={t("masjids.times.clearAll")}
            onPress={() => setConfirmClear(true)}
          />
        ) : null}
      </View>
      <ConfirmDialog
        visible={confirmClear}
        title={t("masjids.times.clearConfirmTitle")}
        message={t("masjids.times.clearConfirmBody")}
        confirmLabel={t("masjids.times.clearAll")}
        destructive
        onConfirm={() => void clearAll()}
        onClose={() => setConfirmClear(false)}
      />

      <ThemedText type="caption" themeColor="mutedForeground">
        {t("masjids.times.privacy")}
      </ThemedText>

      <Card padding="three">
        <SectionHeader
          title={t("masjids.reminder.settingTitle")}
          icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
        />
        <View style={styles.list}>
          <View style={styles.row}>
            <ThemedText type="small" style={styles.flex}>
              {t("masjids.reminder.toggle")}
            </ThemedText>
            <ThemedSwitch
              value={reminder.value}
              disabled={!reminder.enabled}
              onValueChange={(on) => void reminder.setValue(on)}
              accessibilityLabel={t("masjids.reminder.toggle")}
            />
          </View>
          <View style={styles.row}>
            <ThemedText type="small" style={styles.flex}>
              {t("masjids.reminder.walkMinutes", { minutes: walk })}
            </ThemedText>
            <Stepper
              value={walk}
              label={t("masjids.reminder.walkLabel")}
              onDecrement={() => setWalk(walk - WALK_STEP)}
              onIncrement={() => setWalk(walk + WALK_STEP)}
            />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground">
            {!reminder.enabled
              ? t("masjids.reminder.needsNotifications")
              : savedTimetable
                ? t("masjids.reminder.note")
                : t("masjids.reminder.needsTimes")}
          </ThemedText>
        </View>
      </Card>
    </View>
  );
}

export default function MasjidTimesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("masjids.eyebrow")}
      title={t("masjids.yourTimes")}
      onBack={() => goBackOrReplace(router, "/masjids" as Href)}
    >
      <Seo path="/masjids/times" />
      <YourTimes />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  list: { gap: Spacing.three, marginTop: Spacing.two },
  item: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  flex: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/masjids/times");
