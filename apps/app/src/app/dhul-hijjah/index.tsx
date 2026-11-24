import {
  AHMAD_5446_CITATION,
  DHUL_HIJJAH_EVIDENCE,
} from "@munib-tracker/shared/content/dhul-hijjah";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { ArafahSection } from "@/components/dhul-hijjah/arafah-section";
import { DhulHijjahDeedsChecklist } from "@/components/dhul-hijjah/deeds-checklist";
import { DHUL_HIJJAH_ICON, phaseHeadline } from "@/components/dhul-hijjah/dhul-hijjah-home-card";
import { TashriqSection } from "@/components/dhul-hijjah/tashriq-section";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { ToggleRow } from "@/components/seasonal/toggle-row";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useDhulHijjahSeason } from "@/hooks/use-dhul-hijjah-season";
import { useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { dhulHijjahStart, hairNailsWindowActive } from "@/lib/dhul-hijjah";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import {
  useDhulHijjahActions,
  useDhulHijjahYear,
  useEnsureDhulHijjahLoaded,
} from "@/stores/dhul-hijjah-store";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Dhul-Hijjah mode (NF-3.3): the ten-days dashboard (day X/10, today's deeds),
 * the Day of Arafah, Takbir al-Tashriq X/N and the udhiyah intention. Teaser
 * from 25 Dhul-Qa'dah; off-season it shows when the next ten days begin.
 * `?focus=arafah|tashriq` brings that section to the top (reminder deep links).
 */
export default function DhulHijjahScreen() {
  // §4.1.1 item 4: once per session while the madhhab was never chosen.
  const madhhabPrompt = useMadhhabPrompt();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const season = useDhulHijjahSeason();
  const location = useLocation();
  useEnsureDhulHijjahLoaded();
  const state = useDhulHijjahYear(season.year);
  const { setIntendsUdhiyah } = useDhulHijjahActions();
  const { activeExcusedReason } = usePreferences();
  const seasonalReminder = useSetting<boolean>("notifications.seasonal.dhulHijjah");
  const takbirReminder = useSetting<boolean>("notifications.seasonal.takbirTashriq");
  const excused = activeExcusedReason ?? null;
  const inSeason = season.phase != null && season.phase !== "teaser";
  const hairNails = hairNailsWindowActive(state, new Date(), location.timeZone);
  const showArafah =
    season.phase === "teaser" || season.phase === "ten" || season.phase === "arafah";
  const showTashriq =
    season.phase === "arafah" || season.phase === "eid" || season.phase === "tashriq";

  const startLabel = (() => {
    try {
      return dhulHijjahStart(season.year).toLocaleDateString(i18n.language || "en", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    } catch {
      return dhulHijjahStart(season.year).toDateString();
    }
  })();

  const arafah =
    showArafah || focus === "arafah" ? (
      <ArafahSection key="arafah" year={season.year} isToday={season.phase === "arafah"} />
    ) : null;
  const tashriq =
    showTashriq || focus === "tashriq" ? <TashriqSection key="tashriq" season={season} /> : null;

  return (
    <ScreenLayout
      eyebrow={t("dhulHijjah.eyebrow")}
      title={t("dhulHijjah.title")}
      subtitle={
        season.phase ? phaseHeadline(t, season) : t("dhulHijjah.offSeason", { date: startLabel })
      }
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/dhul-hijjah" />
      {madhhabPrompt.sheet}
      <Stagger>
        {focus === "arafah" ? arafah : null}
        {focus === "tashriq" ? tashriq : null}

        <View>
          <ScriptureMeaning english={t("dhulHijjah.virtue")}>
            {(text) => <JannahCallout tone="accent">{text}</JannahCallout>}
          </ScriptureMeaning>
          <EvidenceLine refs={DHUL_HIJJAH_EVIDENCE.tenDaysVirtue} />
          <EvidenceLine
            refs={[
              ...DHUL_HIJJAH_EVIDENCE.remembrance,
              { kind: "citation", ...AHMAD_5446_CITATION },
            ]}
          />
        </View>

        {excused ? (
          <JannahCallout tone="info">{t("dhulHijjah.excusedBanner")}</JannahCallout>
        ) : null}

        {season.phase === "teaser" ? (
          <JannahCallout tone="info">
            {t("dhulHijjah.teaserBody", { date: startLabel })}
          </JannahCallout>
        ) : null}

        {inSeason ? (
          <DhulHijjahDeedsChecklist
            year={season.year}
            date={season.today}
            hijriDay={season.hijri.day}
            excusedReason={excused}
          />
        ) : null}

        {focus !== "arafah" ? arafah : null}
        {focus !== "tashriq" ? tashriq : null}

        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.udhiyah.title")}
            icon={{ ios: "leaf.fill", android: "eco", web: "eco" }}
          />
          <View style={styles.body}>
            <ToggleRow
              title={t("dhulHijjah.udhiyah.intendToggle")}
              subtitle={t("dhulHijjah.udhiyah.intendHint")}
              value={state?.intendsUdhiyah != null}
              onValueChange={(on) => void setIntendsUdhiyah(season.year, on)}
            />
            {hairNails ? (
              <ThemedText type="smallBold">{t("dhulHijjah.hairNails.active")}</ThemedText>
            ) : null}
            <MadhhabNote id="udhiyah.status" />
            {state?.intendsUdhiyah ? <MadhhabNote id="udhiyah.hairNails" /> : null}
            {state?.intendsUdhiyah ? <EvidenceLine refs={DHUL_HIJJAH_EVIDENCE.hairNails} /> : null}
            <NavRow
              icon={{ ios: "list.bullet.clipboard", android: "assignment", web: "assignment" }}
              label={t("dhulHijjah.udhiyah.openPlanner")}
              onPress={() => router.push("/dhul-hijjah/udhiyah" as Href)}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader title={t("dhulHijjah.eid.title")} icon={DHUL_HIJJAH_ICON} />
          <View style={styles.body}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("dhulHijjah.eid.body")}
            </ThemedText>
            <EvidenceLine refs={DHUL_HIJJAH_EVIDENCE.tashriqDays} />
            <NavRow
              icon={DHUL_HIJJAH_ICON}
              label={t("dhulHijjah.eid.link")}
              onPress={() => router.push("/eid" as Href)}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.reminders.title")}
            icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
          />
          <View style={styles.body}>
            <ToggleRow
              title={t("dhulHijjah.reminders.seasonal")}
              subtitle={t("dhulHijjah.reminders.seasonalHint")}
              value={seasonalReminder.value}
              onValueChange={(on) => void seasonalReminder.setValue(on)}
            />
            <ToggleRow
              title={t("dhulHijjah.reminders.takbir")}
              subtitle={t("dhulHijjah.reminders.takbirHint")}
              value={takbirReminder.value}
              onValueChange={(on) => void takbirReminder.setValue(on)}
            />
          </View>
        </Card>

        <JannahDisclaimer textKey="dhulHijjah.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/dhul-hijjah");
