"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cancelAdminBroadcast, resumeAdminBroadcast } from "@/lib/actions/broadcasts";
import type { AdminBroadcastRow } from "@/lib/queries/broadcasts";

type BroadcastRowActionsProps = {
  broadcast: AdminBroadcastRow;
};

export function BroadcastRowActions({ broadcast }: BroadcastRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const canCancel =
    broadcast.status === "pending" ||
    broadcast.status === "scheduled" ||
    broadcast.status === "processing";
  const canResume =
    broadcast.status === "failed" ||
    (broadcast.status === "processing" &&
      broadcast.totalUsers != null &&
      broadcast.usersProcessed < broadcast.totalUsers);

  if (!canCancel && !canResume) return null;

  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {canResume ? (
        <button
          type="button"
          disabled={pending}
          className={buttonClasses("secondary", undefined, "sm")}
          onClick={() => run(() => resumeAdminBroadcast(broadcast.id))}
        >
          Resume
        </button>
      ) : null}
      {canCancel ? (
        <button
          type="button"
          disabled={pending}
          className={buttonClasses("ghost", undefined, "sm")}
          onClick={() => run(() => cancelAdminBroadcast(broadcast.id))}
        >
          Cancel
        </button>
      ) : null}
    </div>
  );
}
