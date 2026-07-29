export const dynamic = "force-dynamic";

import { OFFICIAL_GUIDES_URL, OFFICIAL_SITE_ORIGIN } from "@munib-tracker/shared";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { CannedRepliesManager } from "@/components/support/canned-replies";
import { ADMIN_LINK_CLASS } from "@/components/ui/admin-link";
import { Alert } from "@/components/ui/alert";
import { DataTable, PageShell, SectionCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { canPerformSupportActions } from "@/lib/permissions";
import { listCannedReplies } from "@/lib/queries/admin";

const PLAYBOOK_LINKS = [
  { label: "Privacy policy", href: `${OFFICIAL_SITE_ORIGIN}/en/privacy` },
  { label: "User guides", href: OFFICIAL_GUIDES_URL },
  { label: "Content reports inbox", href: "/reports" },
  { label: "App feedback", href: "/feedback" },
  { label: "Contact messages", href: "/contact-messages" },
  { label: "Broadcast history", href: "/notifications/broadcasts" },
  { label: "App versions", href: "/versions" },
] as const;

const SUPPORT_TOPICS: { topic: string; playbook: string }[] = [
  {
    topic: "Guest vs linked account",
    playbook:
      "Guests are device-scoped and cannot sync or submit reports. Linked users have provider + email. Confirm account type before lookup.",
  },
  {
    topic: "Marketing contact form",
    playbook:
      "Contact messages → filter new → open detail → reply offline via email → set status and leave admin notes for context/reminders. Limit is 2 submissions per email per 24h.",
  },
  {
    topic: "Content report triage",
    playbook:
      "Reports → filter pending → open detail → verify Arabic/translation snapshot → set status (in_review → completed) with admin notes.",
  },
  {
    topic: "Push / inbox not delivering",
    playbook:
      "User detail → check push_tokens → send test push. Confirm VAPID keys match API. Linked users must sync in-app announcements when signed in.",
  },
  {
    topic: "Forced / soft update",
    playbook:
      "Versions → set minSoftVersion (dismissible) or minHardVersion (blocking) per platform. Bust API cache with GET /version/meta?refresh=1.",
  },
  {
    topic: "Broadcast stuck processing",
    playbook:
      "Notifications → history → resume/cancel. Confirm cron-job.org hits /api/cron/process-broadcasts every 15m with ADMIN_CRON_SECRET.",
  },
  {
    topic: "Custom adhkar media abuse",
    playbook: "User media → delete the row. Clean Cloudinary/disk object separately if needed.",
  },
];

type PlaybooksPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PlaybooksPage({ searchParams }: PlaybooksPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/playbooks");
  const params = await searchParams;
  const canned = await listCannedReplies();
  const canAct = canPerformSupportActions(session.role);

  return (
    <PageShell
      title="Support playbooks"
      moduleLabel="12"
      icon={<BookOpen className="h-5 w-5" />}
      description="Munib runbooks for content reports, accounts, push, releases, and broadcasts."
    >
      {params.error ? (
        <Alert variant="error" className="mb-4">
          {params.error}
        </Alert>
      ) : null}

      <SectionCard title="Runbook links">
        <ul className="space-y-2 text-sm">
          {PLAYBOOK_LINKS.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("/") ? (
                <Link href={link.href} className={ADMIN_LINK_CLASS}>
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className={ADMIN_LINK_CLASS} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Common topics">
        <DataTable
          rows={SUPPORT_TOPICS}
          rowKey={(r) => r.topic}
          columns={[
            {
              key: "topic",
              header: "Topic",
              render: (r) => <span className="font-medium text-fg">{r.topic}</span>,
            },
            {
              key: "playbook",
              header: "Playbook",
              render: (r) => <span className="text-fg-muted">{r.playbook}</span>,
            },
          ]}
        />
      </SectionCard>

      <CannedRepliesManager rows={canned} canAct={canAct} />
    </PageShell>
  );
}
