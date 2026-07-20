import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

/** Stable command ids written by native surfaces (Siri, watch, wear, assistant). */
export type ExternalCommand =
  | { type: "mark-current-obligatory"; source?: ExternalCommandSource }
  | {
      type: "mark-prayer";
      prayerId: ObligatoryPrayer;
      date: string;
      source?: ExternalCommandSource;
    }
  | { type: "open-route"; href: string; source?: ExternalCommandSource };

export type ExternalCommandSource =
  | "siri"
  | "assistant"
  | "watch"
  | "wear"
  | "deeplink"
  | "widget"
  | "notification"
  | "live_activity"
  | "ongoing"
  | "unknown";

export type CommandFailureReason =
  | "locked"
  | "not_ready"
  | "excused"
  | "no_location"
  | "already_done"
  | "none_pending"
  | "invalid_prayer"
  | "invalid_date";

export type CommandResult =
  | { ok: true; prayerId: ObligatoryPrayer; alreadyCompleted?: boolean }
  | { ok: false; reason: CommandFailureReason };

export type QueuedCommand = ExternalCommand & {
  id: string;
  enqueuedAt: string;
};
