// Widget trees here are walked by react-native-android-widget via direct function
// calls, so opt out of the React Compiler to avoid "Invalid hook call" (blank widget).
"use no memo";

import type { WidgetInfo, WidgetRepresentation } from "react-native-android-widget";
import { FlexWidget } from "react-native-android-widget";
import i18n from "@/i18n";
import { buildAppUrl } from "@/lib/app-links";
import {
  AndroidSurfaceCard,
  scheduleRowColor,
  themeColors,
  WidgetBodyText,
  WidgetHeroAmount,
  WidgetProgressBar,
  WidgetStatPill,
  WidgetStatusDot,
} from "@/lib/appSurfaces/widgets/androidCard";
import {
  isLargeWidgetSurface,
  isMediumWidgetSurface,
  isSmallHomeWidgetSurface,
} from "@/lib/appSurfaces/widgets/androidCompact";
import { formatUpdatedAgo } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import {
  WIDGET_COMPACT_SCHEDULE_ROWS,
  WIDGET_MARK_CLICK_ACTIONS,
  WIDGET_MAX_SCHEDULE_ROWS,
} from "@/lib/appSurfaces/widgets/constants";
import {
  readSnapshotForWidget,
  renderCompactOrCard,
} from "@/lib/appSurfaces/widgets/widgetRenderUtils";

const MARK_URI = buildAppUrl("/mark-current");

function liveUpdatedAgo(updatedAt: string): string | undefined {
  const label = formatUpdatedAgo(updatedAt, (key, fallback, options) =>
    i18n.t(key, { defaultValue: fallback, ...(options ?? {}) }),
  );
  return label || undefined;
}

export async function renderNextPrayerWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { nextPrayer, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);
  const medium = isMediumWidgetSurface(info);

  return renderCompactOrCard(info, nextPrayer, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={nextPrayer.title}
        summary={small ? "" : nextPrayer.displayDate}
        deepLink={nextPrayer.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={nextPrayer.accessibilityLabel}
        theme={cardTheme}
        markLabel={small || snapshot.locationDenied ? undefined : nextPrayer.markLabel}
        markClickAction={WIDGET_MARK_CLICK_ACTIONS.markCurrent}
        markClickActionData={{ source: "widget" }}
        compact={small}
      >
        <WidgetHeroAmount
          label={nextPrayer.prayerName}
          amount={nextPrayer.prayerTime}
          theme={cardTheme}
          accent={cardTheme.primary}
          amountSize={small ? 24 : 28}
        />
        <WidgetBodyText
          text={nextPrayer.countdownLabel}
          color={colors.textSecondary}
          maxLines={1}
        />
        {medium && nextPrayer.followingName ? (
          <WidgetBodyText
            text={`${nextPrayer.followingName} · ${nextPrayer.followingTime}`}
            color={colors.textSecondary}
            size={12}
            maxLines={1}
          />
        ) : null}
        {!small && nextPrayer.location ? (
          <WidgetBodyText
            text={nextPrayer.location}
            color={colors.textSecondary}
            size={12}
            maxLines={1}
          />
        ) : null}
      </AndroidSurfaceCard>
    );
  });
}

export async function renderPrayerScheduleWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { schedule, theme } = snapshot;
  const large = isLargeWidgetSurface(info);
  const small = isSmallHomeWidgetSurface(info);
  // Content budget: small = 3 rows; medium/large = full obligatory set (5).
  const visible = schedule.rows.slice(
    0,
    small ? WIDGET_COMPACT_SCHEDULE_ROWS : WIDGET_MAX_SCHEDULE_ROWS,
  );
  // Mark control targets the active (next due, not yet completed) row.
  const activePrayerId = schedule.rows.find((row) => row.status === "active")?.id;

  return renderCompactOrCard(info, schedule, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={schedule.title}
        summary={small ? "" : schedule.summary}
        deepLink={schedule.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={schedule.accessibilityLabel}
        theme={cardTheme}
        updatedAgo={large ? liveUpdatedAgo(snapshot.updatedAt) : undefined}
        compact={small}
        markLabel={
          small || snapshot.locationDenied || !activePrayerId ? undefined : schedule.markLabel
        }
        markClickAction={WIDGET_MARK_CLICK_ACTIONS.markPrayer}
        markClickActionData={{ prayerId: activePrayerId, source: "widget" }}
      >
        {visible.length === 0 ? (
          <WidgetBodyText text={schedule.summary} color={colors.textSecondary} maxLines={3} />
        ) : (
          visible.map((row) => (
            <FlexWidget
              key={row.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexGap: 8,
                width: "match_parent",
              }}
            >
              <FlexWidget
                style={{ flexDirection: "row", alignItems: "center", flexGap: 6, flex: 1 }}
              >
                <WidgetStatusDot color={scheduleRowColor(row.status, cardTheme)} />
                <WidgetBodyText
                  text={`${row.name} · ${row.statusLabel}`}
                  color={scheduleRowColor(row.status, cardTheme)}
                  bold
                  maxLines={1}
                />
              </FlexWidget>
              <WidgetBodyText text={row.time} color={colors.textSecondary} maxLines={1} />
            </FlexWidget>
          ))
        )}
      </AndroidSurfaceCard>
    );
  });
}

export async function renderPrayerProgressWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { progress, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, progress, theme.success, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={progress.title}
        summary={small ? "" : progress.lockScreenDetail}
        deepLink={progress.deepLink}
        accentColor={cardTheme.success}
        accessibilityLabel={progress.accessibilityLabel}
        theme={cardTheme}
        markLabel={small ? undefined : progress.markLabel}
        markUri={MARK_URI}
        compact={small}
      >
        <WidgetBodyText
          text={progress.progressLabel}
          color={cardTheme.success}
          bold
          size={small ? 28 : 32}
          maxLines={1}
        />
        <WidgetProgressBar
          percent={progress.progressPercent}
          fillColor={cardTheme.success}
          trackColor={colors.border}
        />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderSalahStreakWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { streak, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, streak, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={streak.title}
        summary={small ? "" : streak.lockScreenDetail}
        deepLink={streak.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={streak.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetBodyText
          text={streak.streakLabel}
          color={cardTheme.primary}
          bold
          size={small ? 36 : 40}
          maxLines={1}
        />
        <WidgetBodyText text={streak.summary} color={colors.textSecondary} maxLines={2} />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderQazaDebtWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { qaza, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, qaza, theme.warning, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={qaza.title}
        summary={small ? "" : qaza.todayLabel}
        deepLink={qaza.deepLink}
        accentColor={cardTheme.warning}
        accessibilityLabel={qaza.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetHeroAmount
          label={qaza.remainingLabel}
          amount={String(qaza.remaining)}
          theme={cardTheme}
          accent={cardTheme.warning}
          amountSize={small ? 28 : 32}
        />
        {qaza.todayTarget > 0 ? (
          <WidgetProgressBar
            percent={qaza.progressPercent}
            fillColor={cardTheme.warning}
            trackColor={colors.border}
          />
        ) : null}
      </AndroidSurfaceCard>
    );
  });
}

export async function renderRamadanWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { ramadan, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, ramadan, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={ramadan.title}
        summary={small ? "" : ramadan.dayLabel}
        deepLink={ramadan.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={ramadan.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <FlexWidget style={{ flexDirection: "row", flexGap: 8, width: "match_parent" }}>
          <WidgetStatPill
            label={ramadan.suhoorLabel}
            value={ramadan.suhoorTime}
            theme={cardTheme}
            valueColor={cardTheme.primary}
          />
          <WidgetStatPill
            label={ramadan.iftarLabel}
            value={ramadan.iftarTime}
            theme={cardTheme}
            valueColor={cardTheme.primary}
          />
        </FlexWidget>
        <WidgetBodyText text={ramadan.countdownLabel} color={colors.textSecondary} maxLines={2} />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderKhatmProgressWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { khatm, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, khatm, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={khatm.title}
        summary={small ? "" : khatm.paceLabel}
        deepLink={khatm.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={khatm.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetBodyText
          text={khatm.hasPlan ? khatm.progressLabel : "—"}
          color={cardTheme.primary}
          bold
          size={small ? 28 : 32}
          maxLines={1}
        />
        {khatm.hasPlan ? (
          <WidgetProgressBar
            percent={khatm.progressPercent}
            fillColor={cardTheme.primary}
            trackColor={colors.border}
          />
        ) : null}
        <WidgetBodyText text={khatm.todayLabel} color={colors.textSecondary} maxLines={2} />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderDailyHadithWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { dailyHadith, theme, isRtl } = snapshot;
  const small = isSmallHomeWidgetSurface(info);
  const large = isLargeWidgetSurface(info);

  return renderCompactOrCard(info, dailyHadith, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={dailyHadith.title}
        summary={small ? "" : dailyHadith.reference}
        deepLink={dailyHadith.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={dailyHadith.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        {!small && dailyHadith.arabic ? (
          <WidgetBodyText
            text={dailyHadith.arabic}
            color={colors.text}
            size={13}
            maxLines={large ? 3 : 2}
            align="right"
          />
        ) : null}
        <WidgetBodyText
          text={dailyHadith.meaning}
          color={colors.textSecondary}
          maxLines={small ? 2 : large ? 5 : 3}
          align={isRtl ? "right" : "left"}
        />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderHijriDateWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { hijriDate, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, hijriDate, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={hijriDate.title}
        summary={small ? "" : hijriDate.weekday}
        deepLink={hijriDate.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={hijriDate.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetBodyText
          text={hijriDate.hijriDate}
          color={colors.text}
          bold
          size={small ? 14 : 16}
          maxLines={2}
        />
        <WidgetBodyText
          text={hijriDate.gregorianDate}
          color={colors.textSecondary}
          size={12}
          maxLines={2}
        />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderTasbeehGlanceWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { tasbeeh, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, tasbeeh, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={tasbeeh.title}
        summary={small ? "" : tasbeeh.dhikrTitle}
        deepLink={tasbeeh.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={tasbeeh.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetBodyText
          text={tasbeeh.hasActivity ? tasbeeh.countLabel : "—"}
          color={cardTheme.primary}
          bold
          size={small ? 26 : 30}
          maxLines={1}
        />
        {tasbeeh.hasActivity && tasbeeh.target > 0 ? (
          <WidgetProgressBar
            percent={tasbeeh.progressPercent}
            fillColor={cardTheme.primary}
            trackColor={colors.border}
          />
        ) : null}
        <WidgetBodyText
          text={tasbeeh.hasActivity ? tasbeeh.dhikrTitle : tasbeeh.summary}
          color={colors.textSecondary}
          maxLines={2}
        />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderJumuahWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { friday, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, friday, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={friday.title}
        summary={small ? "" : friday.lockScreenDetail}
        deepLink={friday.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={friday.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetBodyText
          text={friday.isFriday ? `${friday.completed}/${friday.total}` : String(friday.daysUntil)}
          color={cardTheme.primary}
          bold
          size={small ? 26 : 30}
          maxLines={1}
        />
        {friday.isFriday && friday.total > 0 ? (
          <WidgetProgressBar
            percent={friday.progressPercent}
            fillColor={cardTheme.primary}
            trackColor={colors.border}
          />
        ) : null}
        <WidgetBodyText text={friday.summary} color={colors.textSecondary} maxLines={2} />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderQiblaBearingWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { qibla, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);

  return renderCompactOrCard(info, qibla, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={qibla.title}
        summary={small ? "" : qibla.location}
        deepLink={qibla.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={qibla.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetBodyText
          text={qibla.bearingLabel}
          color={cardTheme.primary}
          bold
          size={small ? 28 : 32}
          maxLines={1}
        />
        <WidgetBodyText text={qibla.lockScreenDetail} color={colors.textSecondary} maxLines={2} />
      </AndroidSurfaceCard>
    );
  });
}
