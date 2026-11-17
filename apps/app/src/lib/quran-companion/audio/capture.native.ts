import {
  AudioModule,
  type AudioStream,
  type AudioStreamBuffer,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";

import { isTV } from "@/lib/platform/is-tv";

import { createResampler, int16ToFloat32, TARGET_SAMPLE_RATE } from "./resample";
import { CaptureError, type MicPermission, type RecitationCapture } from "./types";

/**
 * iOS / Android capture (§7, decision D1): `expo-audio` `AudioStream`, the
 * object behind `useAudioStream`. The requested 16 kHz mono float32 is a hint —
 * every buffer carries the delivered rate and channel count, and all of it goes
 * through the resampler. Nothing is written to disk.
 */

function toPermission(status: {
  granted: boolean;
  canAskAgain?: boolean;
  status?: string;
}): MicPermission {
  if (status.granted) return "granted";
  if (status.status === "undetermined" || status.canAskAgain) return "undetermined";
  return "denied";
}

export function createRecitationCapture(): RecitationCapture {
  let stream: AudioStream | null = null;
  let subscriptions: { remove: () => void }[] = [];
  let stopping = false;
  const resampler = createResampler(TARGET_SAMPLE_RATE);

  const release = () => {
    for (const sub of subscriptions) sub.remove();
    subscriptions = [];
    if (stream) {
      try {
        stream.stop();
      } catch {
        // already stopped
      }
      try {
        (stream as unknown as { release?: () => void }).release?.();
      } catch {
        // released
      }
    }
    stream = null;
    resampler.reset();
  };

  return {
    available: !isTV(),

    async getPermission() {
      try {
        return toPermission(await getRecordingPermissionsAsync());
      } catch {
        return "undetermined";
      }
    },

    async requestPermission() {
      try {
        return toPermission(await requestRecordingPermissionsAsync());
      } catch {
        return "denied";
      }
    },

    async start(onChunk, onStatus) {
      if (isTV()) throw new CaptureError("mic-unavailable");
      release();
      stopping = false;
      try {
        const StreamCtor = (
          AudioModule as unknown as {
            AudioStream: new (o: {
              sampleRate: number;
              channels: number;
              encoding: string;
            }) => AudioStream;
          }
        ).AudioStream;
        stream = new StreamCtor({
          sampleRate: TARGET_SAMPLE_RATE,
          channels: 1,
          encoding: "float32",
        });
      } catch (error) {
        throw new CaptureError("mic-unavailable", (error as Error)?.message);
      }
      const s = stream as unknown as {
        addListener: (event: string, fn: (payload: unknown) => void) => { remove: () => void };
      };
      subscriptions.push(
        s.addListener("audioStreamBuffer", (payload) => {
          const buffer = payload as AudioStreamBuffer;
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
        }),
        s.addListener("audioStreamStatus", (payload) => {
          const status = payload as { isStreaming: boolean };
          if (!status.isStreaming && !stopping) {
            onStatus?.({ interrupted: true });
          }
        }),
      );
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
