import { createResampler, TARGET_SAMPLE_RATE } from "./resample";
import { CaptureError, type MicPermission, type RecitationCapture } from "./types";

/**
 * Web capture (§7, decision D2). `expo-audio`'s `useAudioStream` is a no-op on
 * web, so this uses `getUserMedia` + an `AudioWorkletNode` that posts Float32
 * frames. The AudioWorklet module is built from a Blob URL so no extra file is
 * served. 16 kHz is requested but `context.sampleRate` is read back, because
 * Safari may ignore the request; every frame still goes through the resampler.
 */

const WORKLET_SOURCE = `
class MunibCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0] && input[0].length) {
      const channels = input.length;
      const frames = input[0].length;
      const out = new Float32Array(frames * channels);
      for (let f = 0; f < frames; f++) for (let c = 0; c < channels; c++) out[f * channels + c] = input[c][f];
      this.port.postMessage({ samples: out, channels }, [out.buffer]);
    }
    return true;
  }
}
registerProcessor("munib-capture", MunibCaptureProcessor);
`;

function hasWebAudioCapture(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof AudioContext !== "undefined" &&
    typeof AudioWorkletNode !== "undefined"
  );
}

async function queryPermission(): Promise<MicPermission> {
  try {
    const status = await navigator.permissions?.query({ name: "microphone" as PermissionName });
    if (status?.state === "granted") return "granted";
    if (status?.state === "denied") return "denied";
  } catch {
    // Firefox / Safari may not support the microphone permission name.
  }
  return "undetermined";
}

export function createRecitationCapture(): RecitationCapture {
  let context: AudioContext | null = null;
  let media: MediaStream | null = null;
  let node: AudioWorkletNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let stopping = false;
  const resampler = createResampler(TARGET_SAMPLE_RATE);

  const release = async () => {
    try {
      node?.port.close();
      node?.disconnect();
      source?.disconnect();
    } catch {
      // already disconnected
    }
    for (const track of media?.getTracks() ?? []) track.stop();
    if (context && context.state !== "closed") {
      try {
        await context.close();
      } catch {
        // closing
      }
    }
    node = null;
    source = null;
    media = null;
    context = null;
    resampler.reset();
  };

  return {
    available: hasWebAudioCapture(),

    getPermission: queryPermission,

    async requestPermission() {
      if (!hasWebAudioCapture()) return "denied";
      try {
        const probe = await navigator.mediaDevices.getUserMedia({ audio: true });
        for (const track of probe.getTracks()) track.stop();
        return "granted";
      } catch {
        return "denied";
      }
    },

    async start(onChunk, onStatus) {
      if (!hasWebAudioCapture()) throw new CaptureError("runtime-unsupported");
      await release();
      stopping = false;
      try {
        media = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
      } catch (error) {
        const name = (error as DOMException)?.name ?? "";
        throw new CaptureError(
          name === "NotAllowedError" || name === "SecurityError" ? "mic-denied" : "mic-unavailable",
          (error as Error)?.message,
        );
      }
      try {
        try {
          context = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });
        } catch {
          context = new AudioContext();
        }
        const moduleUrl = URL.createObjectURL(
          new Blob([WORKLET_SOURCE], { type: "application/javascript" }),
        );
        try {
          await context.audioWorklet.addModule(moduleUrl);
        } finally {
          URL.revokeObjectURL(moduleUrl);
        }
        source = context.createMediaStreamSource(media);
        node = new AudioWorkletNode(context, "munib-capture");
        const rate = context.sampleRate;
        node.port.onmessage = (
          event: MessageEvent<{ samples: Float32Array; channels: number }>,
        ) => {
          const out = resampler.push(event.data.samples, rate, event.data.channels);
          if (out.length) onChunk(out);
        };
        source.connect(node);
        // The worklet must be pulled by the graph; route through a muted gain.
        const mute = context.createGain();
        mute.gain.value = 0;
        node.connect(mute).connect(context.destination);
        for (const track of media.getAudioTracks()) {
          track.onended = () => {
            if (!stopping) onStatus?.({ interrupted: true });
          };
        }
        if (context.state === "suspended") await context.resume();
        onStatus?.({ sampleRate: rate });
      } catch (error) {
        await release();
        throw new CaptureError("capture-failed", (error as Error)?.message);
      }
    },

    async stop() {
      stopping = true;
      await release();
    },
  };
}
