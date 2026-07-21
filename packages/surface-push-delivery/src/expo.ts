import type { SurfaceSender, SurfaceSendResult } from "./types.js";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

type ExpoPushTicket = {
  status: "ok" | "error";
  message?: string;
  details?: {
    error?: string;
  };
};

export function isValidExpoPushToken(token: string): boolean {
  return /^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/.test(token.trim());
}

/**
 * Sends a silent, high-priority Expo data notification. The Android app's
 * module-scope notification task applies the phase payload to the existing
 * ongoing / Live Update notification.
 */
export function createExpoPushSender(): SurfaceSender {
  return {
    channel: "expo",
    async send(target: string, payloadJson: string): Promise<SurfaceSendResult> {
      const token = target.trim();
      if (!isValidExpoPushToken(token)) {
        return {
          ok: false,
          reason: "Invalid Expo push token",
          retryable: false,
          invalidateToken: true,
        };
      }

      try {
        JSON.parse(payloadJson);
      } catch {
        return {
          ok: false,
          reason: "Malformed Expo surface payload",
          retryable: false,
          invalidateToken: false,
        };
      }

      try {
        const response = await fetch(EXPO_PUSH_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: token,
            priority: "high",
            ttl: 3600,
            _contentAvailable: true,
            data: {
              type: "salah_surface_phase",
              version: 1,
              payload: payloadJson,
            },
          }),
        });

        if (response.status === 429 || response.status >= 500) {
          return {
            ok: false,
            status: response.status,
            reason: `Transient Expo Push failure (${response.status})`,
            retryable: true,
            invalidateToken: false,
          };
        }
        if (!response.ok) {
          return {
            ok: false,
            status: response.status,
            reason: `Expo Push rejected request (${response.status})`,
            retryable: false,
            invalidateToken: false,
          };
        }

        const result = (await response.json()) as {
          data?: ExpoPushTicket | ExpoPushTicket[];
        };
        const ticket = Array.isArray(result.data) ? result.data[0] : result.data;
        if (!ticket || ticket.status === "ok") return { ok: true };

        const errorCode = ticket.details?.error;
        if (errorCode === "DeviceNotRegistered") {
          return {
            ok: false,
            reason: ticket.message ?? errorCode,
            retryable: false,
            invalidateToken: true,
          };
        }
        const retryable = errorCode === "MessageRateExceeded";
        return {
          ok: false,
          reason: ticket.message ?? errorCode ?? "Expo Push ticket failed",
          retryable,
          invalidateToken: false,
        };
      } catch (error) {
        return {
          ok: false,
          reason: error instanceof Error ? error.message : "Expo Push network error",
          retryable: true,
          invalidateToken: false,
        };
      }
    },
  };
}
