import {
  type FardPrayer,
  type FardStatusValue,
  graduationPromptStage,
  shouldShowGraduationPrompt,
} from "@munib-tracker/shared/circles";
import type { DuaItem, ZikrItem } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FardDots } from "@/components/circles/fard-dots";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";
import { contentAudioTrack } from "@/lib/audio-tracks";
import {
  type ChildProfile,
  type CircleSignal,
  type FardStatusInput,
  listChildSignals,
  putFardStatus,
} from "@/lib/circles/api";
import {
  clearChildSession,
  dismissGraduationPrompt,
  flushPendingChildStatuses,
  refreshChildProfile,
  setChildDayStatus,
  useChildSession,
} from "@/lib/circles/child-session";
import {
  EMPTY_FARD_STATUS,
  indexSignals,
  prayedCount,
  rewardProgress,
  signalWindow,
} from "@/lib/circles/family";
import {
  useChildProfiles,
  useCircleAuth,
  useCircleMutation,
  useCircleSignals,
} from "@/lib/circles/hooks";
import {
  KIDS_ADHKAR_IDS,
  KIDS_DUA_IDS,
  KIDS_LEARN_ROUTES,
  KIDS_SURAHS,
} from "@/lib/circles/kids-content";
import { loadDuaItems, loadZikrItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahByNumber } from "@/lib/quran-meta";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { resolveTranslationField } from "@/lib/translation-locale";
import { useAudioPlayerContext } from "@/providers/audio-player-context";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";

type Tab = "pray" | "learn" | "duas";

/**
 * Kids mode shell (NF-3.16, D7/D27): Pray (5 big buttons), Learn (existing
 * Learn hubs + short surahs) and Duas (curated daily duas and adhkar from the
 * bundled datasets, existing audio only). Runs either on a linked child device
 * (scoped child session) or on a parent's device in "Child: <nickname>" mode.
 * No leaderboards, no sibling comparison, no hayd UI — the parent marks generic
 * rest days.
 */
export default function KidsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useChildSession();
  const auth = useCircleAuth();
  const params = useLocalSearchParams<{ childId?: string; circleId?: string }>();
  const onDevice = session.token != null && session.meta != null;
  const actingAsParent = !onDevice && auth.isAccount && !!params.childId && !!params.circleId;
  const [tab, setTab] = useState<Tab>("pray");

  useEffect(() => {
    if (onDevice) {
      void refreshChildProfile();
      void flushPendingChildStatuses();
    }
  }, [onDevice]);

  const parentChildren = useChildProfiles(actingAsParent ? params.circleId : undefined);
  const parentChild = parentChildren.data?.find((c) => c.id === params.childId);
  const child: ChildProfile | undefined = onDevice ? session.meta?.child : parentChild;

  if (isTV()) {
    return (
      <ScreenLayout title={t("kids.title")} onBack={() => goBackOrReplace(router, "/")}>
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {t("kids.tvUnavailable")}
          </ThemedText>
        </Card>
      </ScreenLayout>
    );
  }

  if (!onDevice && !actingAsParent) {
    return (
      <ScreenLayout
        eyebrow={t("kids.eyebrow")}
        title={t("kids.title")}
        onBack={() => goBackOrReplace(router, "/")}
      >
        <Seo path="/kids" index={false} />
        <Card padding="three" style={styles.gap}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("kids.notLinked")}
          </ThemedText>
          <Button label={t("kids.linkCta")} onPress={() => router.push("/kids/link")} />
        </Card>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={
        actingAsParent
          ? t("kids.parentEyebrow", { name: child?.nickname ?? "" })
          : t("kids.eyebrow")
      }
      title={child ? t("kids.hello", { name: child.nickname }) : t("kids.title")}
      // A linked child device stays inside kids mode (no back to the full app).
      onBack={actingAsParent ? () => goBackOrReplace(router, "/family") : undefined}
    >
      <Seo path="/kids" index={false} />
      <View style={styles.stack}>
        <SegmentedControl<Tab>
          options={[
            { id: "pray", label: t("kids.tab.pray") },
            { id: "learn", label: t("kids.tab.learn") },
            { id: "duas", label: t("kids.tab.duas") },
          ]}
          value={tab}
          onChange={setTab}
        />
        {!child ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("circles.common.loading")}
          </ThemedText>
        ) : tab === "pray" ? (
          onDevice ? (
            <DevicePrayTab child={child} />
          ) : (
            <ParentPrayTab child={child} circleId={params.circleId as string} />
          )
        ) : tab === "learn" ? (
          <LearnTab />
        ) : (
          <DuasTab />
        )}
        {onDevice && child ? <DeviceFooter child={child} /> : null}
      </View>
    </ScreenLayout>
  );
}

/** The five big buttons + stars + reward bar. */
function PrayPanel({
  child,
  value,
  onToggle,
  signals,
}: {
  child: ChildProfile;
  value: FardStatusValue;
  onToggle: (prayer: FardPrayer) => void;
  signals: readonly CircleSignal[];
}) {
  const { t } = useTranslation();
  const days = useMemo(() => indexSignals(signals).get(child.id), [signals, child.id]);
  const reward = child.reward ? rewardProgress(days, child.reward.days) : null;
  const stars = prayedCount(value);
  const learning = child.ageBand === "learning";
  return (
    <View style={styles.stack}>
      <Card padding="three" style={styles.gap}>
        <ThemedText type="small" themeColor="mutedForeground">
          {learning ? t("kids.pray.learningHint") : t("kids.pray.hint")}
        </ThemedText>
        <FardDots value={value} onToggle={onToggle} size="lg" />
        <ThemedText type="subtitle">
          {stars === 5 ? t("kids.pray.allFive") : t("kids.pray.stars", { count: stars })}
        </ThemedText>
      </Card>
      {child.reward && reward ? (
        <Card padding="three" style={styles.gap}>
          <ThemedText type="smallBold">
            {reward.reached
              ? t("family.reward.reached", { title: child.reward.title })
              : t("family.reward.progress", {
                  title: child.reward.title,
                  done: reward.done,
                  target: reward.target,
                })}
          </ThemedText>
          <ProgressBar value={reward.ratio} />
        </Card>
      ) : null}
    </View>
  );
}

function DevicePrayTab({ child }: { child: ChildProfile }) {
  const { t } = useTranslation();
  const session = useChildSession();
  const today = getLocalDateString();
  const window = signalWindow(today, 35);
  const token = session.token as string;
  const signals = useQuery({
    queryKey: ["circles", "child-device", child.id, window.from, window.to],
    queryFn: () => listChildSignals(token, child.circleId, window.from, window.to),
    enabled: !!token,
    staleTime: 30_000,
  });
  const local = session.meta?.days[today]?.value;
  const server = indexSignals(signals.data ?? [])
    .get(child.id)
    ?.get(today)?.fard;
  const value = local ?? server ?? EMPTY_FARD_STATUS;
  // Merge the device's own (maybe pending) taps over the server copy for the reward bar.
  const merged = useMemo(() => {
    const rows = (signals.data ?? []).filter(
      (s) => !(s.kind === "fard_status" && session.meta?.days[s.date]),
    );
    for (const [date, entry] of Object.entries(session.meta?.days ?? {})) {
      rows.push({
        memberId: child.id,
        date,
        kind: "fard_status",
        value: entry.value,
        updatedAt: "",
      });
    }
    return rows;
  }, [signals.data, session.meta?.days, child.id]);

  return (
    <View style={styles.stack}>
      {child.consentPending ? (
        // D34: calm, never punishing — taps are kept on this device meanwhile.
        <Card padding="three" style={styles.gap}>
          <ThemedText type="smallBold">{t("kids.consentPending.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("kids.consentPending.body")}
          </ThemedText>
        </Card>
      ) : null}
      <PrayPanel
        child={child}
        value={value}
        signals={merged}
        onToggle={(prayer) => void setChildDayStatus(today, { ...value, [prayer]: !value[prayer] })}
      />
    </View>
  );
}

function ParentPrayTab({ child, circleId }: { child: ChildProfile; circleId: string }) {
  const { t } = useTranslation();
  const toast = useToast();
  const today = getLocalDateString();
  const window = signalWindow(today, 35);
  const signals = useCircleSignals(circleId, window.from, window.to);
  const log = useCircleMutation((token, input: FardStatusInput) =>
    putFardStatus(token, circleId, input),
  );
  const value =
    indexSignals(signals.data ?? [])
      .get(child.id)
      ?.get(today)?.fard ?? EMPTY_FARD_STATUS;
  return (
    <PrayPanel
      child={child}
      value={value}
      signals={signals.data ?? []}
      onToggle={(prayer) =>
        void log
          .mutateAsync({ date: today, memberId: child.id, ...value, [prayer]: !value[prayer] })
          .catch(() => toast.error(t("circles.common.offline")))
      }
    />
  );
}

function LearnTab() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <View style={styles.stack}>
      <Card padding="two" style={styles.gap}>
        <NavRow
          icon={{
            ios: "figure.mind.and.body",
            android: "self_improvement",
            web: "self_improvement",
          }}
          label={t("kids.learn.salah")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.salahGuide as Href)}
        />
        <NavRow
          icon={{ ios: "book.fill", android: "auto_stories", web: "auto_stories" }}
          label={t("kids.learn.prophets")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.prophets as Href)}
        />
        <NavRow
          icon={{ ios: "character.book.closed.fill", android: "abc", web: "abc" }}
          label={t("kids.learn.letters")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.letters as Href)}
        />
        <NavRow
          icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
          label={t("kids.learn.names")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.names as Href)}
        />
      </Card>
      <ThemedText type="smallBold">{t("kids.learn.surahs")}</ThemedText>
      <Card padding="two" style={styles.gap}>
        {KIDS_SURAHS.map((n) => {
          const surah = getSurahByNumber(n);
          return (
            <NavRow
              key={n}
              icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
              label={surah ? `${n}. ${surah.nameTransliteration}` : String(n)}
              onPress={() =>
                router.push({ pathname: "/quran/[surah]", params: { surah: String(n) } })
              }
            />
          );
        })}
      </Card>
    </View>
  );
}

type KidsItem = { kind: "dua" | "zikr"; item: DuaItem | ZikrItem };

function DuasTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const prefs = usePreferences();
  const { play } = useAudioPlayerContext();
  const [items, setItems] = useState<KidsItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([loadDuaItems(), loadZikrItems()]).then(([duas, adhkar]) => {
      if (cancelled) return;
      const duaById = new Map(duas.map((d) => [d.id, d]));
      const zikrById = new Map(adhkar.map((z) => [z.id, z]));
      const out: KidsItem[] = [];
      for (const id of KIDS_DUA_IDS) {
        const item = duaById.get(id);
        if (item) out.push({ kind: "dua", item });
      }
      for (const id of KIDS_ADHKAR_IDS) {
        const item = zikrById.get(id);
        if (item) out.push({ kind: "zikr", item });
      }
      setItems(out);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items) {
    return (
      <ThemedText type="small" themeColor="mutedForeground">
        {t("circles.common.loading")}
      </ThemedText>
    );
  }

  return (
    <View style={styles.stack}>
      {items.map(({ kind, item }) => {
        const track = contentAudioTrack(item);
        return (
          <Card
            key={`${kind}:${item.id}`}
            padding="three"
            style={styles.gap}
            onPress={() =>
              router.push(
                kind === "dua"
                  ? { pathname: "/dua/detail/[id]", params: { id: item.id } }
                  : { pathname: "/zikr/detail/[id]", params: { id: item.id } },
              )
            }
            accessibilityLabel={item.title}
          >
            <ThemedText type="smallBold">{item.title}</ThemedText>
            <ThemedText type="arabic" style={styles.arabic}>
              {item.arabic}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {resolveTranslationField(item, prefs)}
            </ThemedText>
            {track ? (
              <Button
                label={t("kids.duas.listen")}
                variant="secondary"
                size="sm"
                icon={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
                onPress={() => play([track])}
              />
            ) : null}
          </Card>
        );
      })}
    </View>
  );
}

function DeviceFooter({ child }: { child: ChildProfile }) {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useChildSession();
  const [confirm, setConfirm] = useState(false);
  // E13: offered at 13 (or when a parent unlocks it), offered again at 15.
  const stage = graduationPromptStage(child.birthYear, child.graduationUnlocked);
  const showGraduation =
    child.graduationAvailable &&
    shouldShowGraduationPrompt(stage, session.meta?.graduationDismissed);
  return (
    <View style={styles.gap}>
      {showGraduation ? (
        <Card padding="three" style={styles.gap}>
          <ThemedText type="small">
            {stage === "reprompt" ? t("kids.graduate.reprompt") : t("kids.graduate.offer")}
          </ThemedText>
          <Button label={t("kids.graduate.cta")} onPress={() => router.push("/kids/graduate")} />
          <Button
            label={t("kids.graduate.notNow")}
            variant="ghost"
            size="sm"
            onPress={() => void dismissGraduationPrompt(stage)}
          />
        </Card>
      ) : null}
      <Button label={t("kids.unlink")} variant="ghost" onPress={() => setConfirm(true)} />
      <ConfirmDialog
        visible={confirm}
        title={t("kids.unlinkTitle")}
        message={t("kids.unlinkBody")}
        confirmLabel={t("kids.unlink")}
        destructive
        onConfirm={() => {
          setConfirm(false);
          void clearChildSession().then(() => router.replace("/"));
        }}
        onClose={() => setConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  arabic: { textAlign: "right", writingDirection: "rtl" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids");
