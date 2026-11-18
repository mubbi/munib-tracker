export const dynamic = "force-dynamic";

import { BookOpenCheck } from "lucide-react";
import { BarList, DonutChart, ProgressRow } from "@/components/ui/charts";
import { PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { getQuranPracticeOverview } from "@/lib/queries/quran-practice";
import { formatShare } from "@/lib/quran-practice-stats";
import { formatNumber } from "@/lib/utils";

/**
 * Module 15 — Qur'an practice. Aggregates from the synced practice blobs only
 * (signed-in users; guests never sync). No per-user rows, no ayah text, no audio:
 * the app never uploads recitation audio, and summaries hold counts only.
 */
export default async function QuranPracticePage() {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/quran-practice");
  const { sessions, prefs, memorization } = await getQuranPracticeOverview();
  const listener = sessions.listener;

  return (
    <PageShell
      title="Qur'an practice"
      moduleLabel="15"
      icon={<BookOpenCheck className="h-5 w-5" />}
      description="How signed-in users practise recitation: sessions, modes, listener quality, and revision. Aggregates only."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Practising users"
          value={formatNumber(sessions.users)}
          hint={`${formatNumber(prefs.users)} with practice settings`}
        />
        <StatCard
          label="Sessions, last 7 days"
          value={formatNumber(sessions.last7Days)}
          hint={`${formatNumber(sessions.last30Days)} in 30 days`}
          trend={sessions.dailyLast14}
        />
        <StatCard
          label="Median session"
          value={
            sessions.medianDurationSec == null
              ? "—"
              : `${Math.max(1, Math.round(sessions.medianDurationSec / 60))} min`
          }
          hint={
            sessions.meanAyahs == null
              ? "No sessions in 30 days"
              : `${sessions.meanAyahs.toFixed(1)} ayahs on average`
          }
        />
        <StatCard
          label="Ayahs due today"
          value={formatNumber(memorization.dueToday)}
          hint={`${formatNumber(memorization.ayahsTracked)} tracked by ${formatNumber(memorization.users)} users`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Modes" description="Sessions in the last 30 days">
          <DonutChart data={sessions.modes} centerLabel="sessions" emptyMessage="No sessions" />
        </SectionCard>
        <SectionCard
          title="Listener use"
          description="Listen only means the person practised without the downloaded listener"
        >
          <DonutChart data={sessions.engines} centerLabel="sessions" emptyMessage="No sessions" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Listener quality"
          description={`${formatNumber(listener.sessions)} sessions with the listener, last 30 days — share of words`}
        >
          {listener.sessions === 0 ? (
            <p className="text-sm text-fg-muted">No listener sessions yet.</p>
          ) : (
            <div className="space-y-4">
              <ShareRow label="Heard (matched)" value={listener.heardShare} />
              <ShareRow label="Not sure" value={listener.notSureShare} color="var(--chart-3)" />
              <ShareRow label="Try again" value={listener.tryAgainShare} color="var(--chart-4)" />
              <ShareRow
                label="Not reached"
                value={listener.notReachedShare}
                color="var(--chart-5)"
              />
              <p className="text-sm text-fg-muted">
                {formatNumber(listener.nothingHeard)} sessions heard no words at all (
                {formatShare(listener.sessions ? listener.nothingHeard / listener.sessions : null)}
                ). A rising share points at microphone or capture problems — check Sentry for{" "}
                <code>area: quran-practice</code>.
              </p>
            </div>
          )}
        </SectionCard>
        <SectionCard title="Most practised surahs" description="Sessions in the last 30 days">
          <BarList data={sessions.topSurahs} emptyMessage="No sessions" maxRows={10} />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Revision" description="From synced memorization maps">
          <div className="space-y-4">
            <ProgressRow
              label="Needs revision"
              value={memorization.needsRevision}
              total={memorization.ayahsTracked}
              color="var(--chart-4)"
            />
            <ProgressRow
              label="At the 30-day step"
              value={memorization.atTopOfLadder}
              total={memorization.ayahsTracked}
            />
            <ProgressRow
              label="Revision reminder on"
              value={prefs.revisionReminderOn}
              total={prefs.users}
              color="var(--chart-2)"
            />
          </div>
        </SectionCard>
        <SectionCard title="Default mode" description="Practice settings">
          <BarList data={prefs.defaultModes} colorByIndex emptyMessage="No settings synced" />
        </SectionCard>
        <SectionCard title="Feedback timing" description="Practice settings">
          <BarList data={prefs.feedbackTiming} colorByIndex emptyMessage="No settings synced" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Listener choice" description="Engine picked in settings">
          <BarList data={prefs.engineChoices} colorByIndex emptyMessage="No settings synced" />
        </SectionCard>
        <SectionCard title="Hear before reciting" description="Practice settings">
          <BarList data={prefs.hearBeforeRecite} colorByIndex emptyMessage="No settings synced" />
        </SectionCard>
        <SectionCard title="Other settings" description={`${formatNumber(prefs.users)} users`}>
          <div className="space-y-4">
            <ProgressRow
              label="Wi-Fi only downloads"
              value={prefs.wifiOnlyOn}
              total={prefs.users}
            />
            <ProgressRow
              label="Move on automatically"
              value={prefs.autoAdvanceOn}
              total={prefs.users}
              color="var(--chart-2)"
            />
            <ProgressRow
              label="Pronunciation drills accepted"
              value={prefs.pronunciationConsented}
              total={prefs.users}
              color="var(--chart-3)"
            />
          </div>
          {prefs.dailyLimits.length ? (
            <div className="mt-5">
              <BarList data={prefs.dailyLimits} emptyMessage="—" />
            </div>
          ) : null}
        </SectionCard>
      </div>

      <SectionCard title="Privacy">
        <p className="text-sm text-fg-muted">
          Only signed-in users sync practice data, and each device keeps its newest 30 session
          summaries. Summaries hold counts and ayah numbers — never recitation audio, a transcript,
          or ayah text. This page shows aggregates only; do not browse individual practice blobs.
        </p>
      </SectionCard>
    </PageShell>
  );
}

function ShareRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color?: string;
}) {
  const pct = value == null ? 0 : Math.round(value * 100);
  return (
    <ProgressRow label={`${label} · ${formatShare(value)}`} value={pct} total={100} color={color} />
  );
}
