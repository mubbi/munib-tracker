import type { AttachmentPickOutcome } from "@/lib/attachments/attachment-file-manager";
import type { AttachmentPickErrorCode } from "@/lib/attachments/attachment-mime";

export type AttachmentPickFailure = {
  ok: false;
  canceled?: boolean;
  permissionDenied?: boolean;
  canAskAgain?: boolean;
  error?: AttachmentPickErrorCode;
};

/** Returns a failure result, or null when the user picked a file. */
export function attachmentPickFailureFromOutcome(
  outcome: AttachmentPickOutcome,
): AttachmentPickFailure | null {
  switch (outcome.kind) {
    case "picked":
      return null;
    case "canceled":
      return { ok: false, canceled: true };
    case "permission_denied":
      return {
        ok: false,
        permissionDenied: true,
        canAskAgain: outcome.canAskAgain,
        error: "PERMISSION_DENIED",
      };
    default:
      return { ok: false };
  }
}
