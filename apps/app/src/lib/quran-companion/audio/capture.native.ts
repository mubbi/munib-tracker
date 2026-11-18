import {
  type AudioStream,
  type AudioStreamBuffer,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  useAudioStream,
} from "expo-audio";
import { useMemo, useRef } from "react";

import { isTV } from "@/lib/platform/is-tv";

import { createResampler, int16ToFloat32, TARGET_SAMPLE_RATE } from "./resample";
import { CaptureError, type MicPermission, type RecitationCapture } from "./types";

/**
 * iOS / Android capture (§7, decision D1): expo-audio's public `useAudioStream`
 * hook. The hook owns the native `AudioStream` (created on mount, released on
 * unmount); this module only starts/stops it per take. The requested 16 kHz mono
 * float32 is a hint — every buffer carries the delivered rate and channel count,
 * and all of it goes through the resampler. Nothing is written to disk.
 */

/** Requested stream format. Constant, so the hook never recreates the stream. */
const STREAM_OPTIONS = {
  sampleRate: TARGET_SAMPLE_RATE,
  channels: 1,
  encoding: "float32",
} as const;

type BufferSink = { current: ((buffer: AudioStreamBuffer) => void) | null };

function toPermission(status: {
  granted: boolean;
  canAskAgain?: boolean;
  status?: string;
}): MicPermission {
  if (status.granted) return "granted";
  if (status.status === "undetermined" || status.canAskAgain) return "undetermined";
  return "denied";
}

async function getPermission(): Promise<MicPermission> {
  try {
    return toPermission(await getRecordingPermissionsAsync());
  } catch {
    return "undetermined";
  }
}

async function requestPermission(): Promise<MicPermission> {
  try {
    return toPermission(await requestRecordingPermissionsAsync());
  } catch {
    return "denied";
  }
}

/**
 * Capture around a hook-owned stream. Without a stream (module scope, e.g. the
 * settings screen) only the permission helpers work.
 */
export function createRecitationCapture(
  stream: AudioStream | null = null,
  sink: BufferSink = { current: null },
): RecitationCapture {
  let statusSub: { remove: () => void } | null = null;
  let stopping = false;
  const resampler = createResampler(TARGET_SAMPLE_RATE);

  const release = () => {
    sink.current = null;
    statusSub?.remove();
    statusSub = null;
    if (stream) {
      try {
        stream.stop();
      } catch {
        // already stopped, or released by the hook on unmount
      }
    }
    resampler.reset();
  };

  return {
    available: !isTV() && stream != null,
    getPermission,
    requestPermission,

    async start(onChunk, onStatus) {
      if (isTV() || !stream) throw new CaptureError("mic-unavailable");
      release();
      stopping = false;
      sink.current = (buffer) => {
        if (!buffer?.data) return;
        // We request float32; only the rate and channel count may differ from the request.
        const samples =
          buffer.data.byteLength % 4 === 0
            ? new Float32Array(buffer.data)
            : int16ToFloat32(buffer.data);
        const out = resampler.push(
          samples,
          buffer.sampleRate || TARGET_SAMPLE_RATE,
          buffer.channels || 1,
        );
        if (out.length) onChunk(out);
      };
      try {
        statusSub = stream.addListener("audioStreamStatus", (status) => {
          if (!status.isStreaming && !stopping) onStatus?.({ interrupted: true });
        });
      } catch (error) {
        release();
        throw new CaptureError("mic-unavailable", (error as Error)?.message);
      }
      try {
        await stream.start();
        onStatus?.({ sampleRate: stream.sampleRate });
      } catch (error) {
        release();
        const message = (error as Error)?.message ?? "";
        throw new CaptureError(
          /permission|denied/i.test(message) ? "mic-denied" : "capture-failed",
          message,
        );
      }
    },

    async stop() {
      stopping = true;
      release();
    },
  };
}

function usePhoneRecitationCapture(): RecitationCapture {
  const sink = useRef<((buffer: AudioStreamBuffer) => void) | null>(null);
  const { stream } = useAudioStream({
    ...STREAM_OPTIONS,
    onBuffer: (buffer) => sink.current?.(buffer),
  });
  return useMemo(() => createRecitationCapture(stream, sink), [stream]);
}

function useTvRecitationCapture(): RecitationCapture {
  return useMemo(() => createRecitationCapture(), []);
}

/**
 * One capture per mounted practice session. TV never constructs a native stream
 * (`AudioStream` is not built for tvOS), so the hook is chosen once at module
 * load — `isTV()` is fixed for the process, so hook order never changes.
 */
export const useRecitationCapture: () => RecitationCapture = isTV()
  ? useTvRecitationCapture
  : usePhoneRecitationCapture;
