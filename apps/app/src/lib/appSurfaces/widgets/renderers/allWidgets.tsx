// Widget trees here are walked by react-native-android-widget via direct function
// calls, so opt out of the React Compiler to avoid "Invalid hook call" (blank widget).
"use no memo";

import type { WidgetInfo, WidgetRepresentation } from "react-native-android-widget";
import { FlexWidget } from "react-native-android-widget";

import {
  AndroidSurfaceCard,
  scheduleRowColor,
  themeColors,
  WidgetBodyText,
  WidgetHeroAmount,
  WidgetProgressBar,
  WidgetStatPill,
} from "@/lib/appSurfaces/widgets/androidCard";
import { isLargeWidgetSurface } from "@/lib/appSurfaces/widgets/androidCompact";
import { WIDGET_COMPACT_SCHEDULE_ROWS } from "@/lib/appSurfaces/widgets/constants";
import {
  readSnapshotForWidget,
  renderCompactOrCard,
} from "@/lib/appSurfaces/widgets/widgetRenderUtils";

export async function renderNextPrayerWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { nextPrayer, theme } = snapshot;

  return renderCompactOrCard(info, nextPrayer, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    const compact = info.height <= 120;
    return (
      <AndroidSurfaceCard
        title={nextPrayer.title}
        summary={compact ? "" : nextPrayer.displayDate}
        deepLink={nextPrayer.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={nextPrayer.title}
        theme={cardTheme}
        footer={compact ? undefined : nextPrayer.ctaLabel}
        updatedAgo={snapshot.updatedAgoLabel}
      >
        <WidgetHeroAmount
          label={nextPrayer.prayerName}
          amount={nextPrayer.prayerTime}
          theme={cardTheme}
          accent={cardTheme.primary}
        />
        <WidgetBodyText text={nextPrayer.countdownLabel} color={colors.textSecondary} />
        {!compact && nextPrayer.location ? (
          <WidgetBodyText text={nextPrayer.location} color={colors.textSecondary} size={12} />
        ) : null}
      </AndroidSurfaceCard>
    );
  });
}

export async function renderPrayerScheduleWidget(info: WidgetInfo): Promise<WidgetRepresentation> {
  const snapshot = await readSnapshotForWidget();
  const { schedule, theme } = snapshot;
  const large = isLargeWidgetSurface(info);
  const visible = large ? schedule.rows : schedule.rows.slice(0, WIDGET_COMPACT_SCHEDULE_ROWS);

  return renderCompactOrCard(info, schedule, theme.primary, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    return (
      <AndroidSurfaceCard
        title={schedule.title}
        summary={schedule.summary}
        deepLink={schedule.deepLink}
        accentColor={cardTheme.primary}
        accessibilityLabel={schedule.title}
        theme={cardTheme}
        footer={schedule.ctaLabel}
        updatedAgo={snapshot.updatedAgoLabel}
      >
        {visible.length === 0 ? (
          <WidgetBodyText text={schedule.summary} color={colors.textSecondary} />
        ) : (
          visible.map((row) => (
            <FlexWidget
              key={row.id}
              style={{ flexDirection: "row", justifyContent: "space-between", flexGap: 8 }}
            >
              <WidgetBodyText
                text={row.name}
                color={scheduleRowColor(row.status, cardTheme)}
                bold
              />
              <WidgetBodyText text={row.time} color={colors.textSecondary} />
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

  return renderCompactOrCard(info, progress, theme.success, theme, (cardTheme) => {
    const colors = themeColors(cardTheme);
    const compact = info.width <= 140;
    return (
      <AndroidSurfaceCard
        title={progress.title}
        summary={compact ? "" : progress.lockScreenDetail}
        deepLink={progress.deepLink}
        accentColor={cardTheme.success}
        accessibilityLabel={progress.title}
        theme={cardTheme}
        footer={compact ? undefined : progress.ctaLabel}
        updatedAgo={snapshot.updatedAgoLabel}
      >
        {compact ? (
          <WidgetBodyText text={progress.progressLabel} color={cardTheme.success} bold size={24} />
        ) : (
          <>
            <WidgetHeroAmount
              label={progress.title}
              amount={progress.progressLabel}
              theme={cardTheme}
              accent={cardTheme.success}
            />
            <WidgetProgressBar
              percent={progress.progressPercent}
              fillColor={cardTheme.success}
              trackColor={colors.border}
            />
            <FlexWidget style={{ flexDirection: "row", flexGap: 8 }}>
              <WidgetStatPill
                label="Done"
                value={String(progress.completed)}
                theme={cardTheme}
                valueColor={cardTheme.success}
              />
              <WidgetStatPill label="Total" value={String(progress.total)} theme={cardTheme} />
            </FlexWidget>
          </>
        )}
      </AndroidSurfaceCard>
    );
  });
}
