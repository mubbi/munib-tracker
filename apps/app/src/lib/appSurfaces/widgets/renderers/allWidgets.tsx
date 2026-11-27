// Widget trees here are walked by react-native-android-widget via direct function
// calls, so opt out of the React Compiler to avoid "Invalid hook call" (blank widget).
"use no memo";

import type { WidgetInfo, WidgetRepresentation } from "react-native-android-widget";
import { FlexWidget } from "react-native-android-widget";
import i18n from "@/i18n";
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
import { formatUpdatedAgo, pickDueAdhkarSet } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import {
  WIDGET_COMPACT_SCHEDULE_ROWS,
  WIDGET_MARK_CLICK_ACTIONS,
  WIDGET_MAX_SCHEDULE_ROWS,
} from "@/lib/appSurfaces/widgets/constants";
import type { WidgetScheduleRow, WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  readSnapshotForWidget,
  renderCompactOrCard,
} from "@/lib/appSurfaces/widgets/widgetRenderUtils";

/**
 * The Salah whose window is running now and is still unmarked: the only one a
 * one-tap Mark may complete (same rule as `resolve-markable-prayer.ts`).
 */
export function markableRow(
  snapshot: WidgetSnapshot,
  nowMs = Date.now(),
): WidgetScheduleRow | undefined {
  if (snapshot.locationDenied) return undefined;
  const started = snapshot.schedule.rows.filter((row) => row.atMs > 0 && row.atMs <= nowMs);
  const current = started[started.length - 1];
  // The resolver clears `currentPrayerId` on a days-old snapshot: no Mark for another day.
  if (!current || current.id !== snapshot.nextPrayer.currentPrayerId) return undefined;
  return current.status !== "completed" ? current : undefined;
}

function markLabelFor(snapshot: WidgetSnapshot, label: string): string | undefined {
  const row = markableRow(snapshot);
  return row ? `${label} · ${row.name}` : undefined;
}

/** Local calendar day (YYYY-MM-DD) without pulling date utils into the widget graph. */
function localDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function liveUpdatedAgo(updatedAt: string): string | undefined {
  const label = formatUpdatedAgo(updatedAt, i18n.t);
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
        markLabel={small ? undefined : markLabelFor(snapshot, nextPrayer.markLabel)}
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
          // Last 15 minutes before Adhan: warm accent so the urgency reads at a glance.
          color={
            nextPrayer.minutesUntil > 0 && nextPrayer.minutesUntil <= 15
              ? cardTheme.warning
              : colors.textSecondary
          }
          bold={nextPrayer.minutesUntil > 0 && nextPrayer.minutesUntil <= 15}
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
  // Mark targets the Salah whose time is running, never the next one (its Adhan
  // has not begun; `handleExternalCommand` rejects that as not_started).
  const markable = markableRow(snapshot);

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
        markLabel={small ? undefined : markLabelFor(snapshot, schedule.markLabel)}
        markClickAction={WIDGET_MARK_CLICK_ACTIONS.markPrayer}
        markClickActionData={{ prayerId: markable?.id, source: "widget" }}
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
                  bold={row.status !== "pending"}
                  maxLines={1}
                />
              </FlexWidget>
              <WidgetBodyText
                text={row.time}
                color={row.status === "active" ? cardTheme.primary : colors.textSecondary}
                bold={row.status === "active"}
                maxLines={1}
              />
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
        markLabel={small ? undefined : markLabelFor(snapshot, progress.markLabel)}
        markClickAction={WIDGET_MARK_CLICK_ACTIONS.markCurrent}
        markClickActionData={{ source: "widget" }}
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

export async function renderAdhkarWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { adhkar, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);
  const pick = pickDueAdhkarSet(adhkar.sets, Date.now());
  const due = pick?.kind === "due" ? pick.set : undefined;
  const percent = due && due.total > 0 ? Math.round((due.completed / due.total) * 100) : 0;

  return renderCompactOrCard(info, adhkar, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={adhkar.title}
        summary={small ? "" : adhkar.summary}
        deepLink={pick?.set.deepLink ?? adhkar.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={adhkar.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        <WidgetBodyText
          text={pick?.set.title ?? adhkar.allDoneLabel}
          color={colors.text}
          bold
          size={small ? 15 : 17}
          maxLines={2}
        />
        {due ? (
          <WidgetProgressBar
            percent={percent}
            fillColor={cardTheme.primary}
            trackColor={colors.border}
          />
        ) : null}
        <WidgetBodyText
          text={due ? due.progressLabel : (pick?.set.nextLabel ?? adhkar.lockScreenDetail)}
          color={colors.textSecondary}
          maxLines={2}
        />
      </AndroidSurfaceCard>
    );
  });
}

export async function renderIslamicEventsWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { events, theme } = snapshot;
  const small = isSmallHomeWidgetSurface(info);
  const large = isLargeWidgetSurface(info);
  const today = localDay(new Date());
  // Relative labels ("in 3 days") are only true on the day they were written.
  const fresh = snapshot.date === today;
  const [first, ...rest] = events.items.filter((item) => item.date >= today);

  return renderCompactOrCard(info, events, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={events.title}
        summary=""
        deepLink={events.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={events.accessibilityLabel}
        theme={cardTheme}
        compact={small}
      >
        {first ? (
          <WidgetHeroAmount
            label={first.name}
            amount={fresh ? first.relativeLabel : first.dateLabel}
            theme={cardTheme}
            accent={cardTheme.primary}
            amountSize={small ? 18 : 22}
          />
        ) : (
          <WidgetBodyText text={events.summary} color={colors.textSecondary} maxLines={2} />
        )}
        {first && fresh && !small ? (
          <WidgetBodyText
            text={first.dateLabel}
            color={colors.textSecondary}
            size={12}
            maxLines={1}
          />
        ) : null}
        {small
          ? null
          : rest.slice(0, large ? 2 : 1).map((item) => (
              <FlexWidget
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexGap: 8,
                  width: "match_parent",
                }}
              >
                <WidgetBodyText text={item.name} color={colors.text} size={12} maxLines={1} />
                <WidgetBodyText
                  text={fresh ? item.relativeLabel : item.dateLabel}
                  color={colors.textSecondary}
                  size={12}
                  maxLines={1}
                />
              </FlexWidget>
            ))}
      </AndroidSurfaceCard>
    );
  });
}
