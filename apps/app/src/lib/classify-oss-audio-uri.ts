import type {
  OssContentDownloadFailureMeta,
  OssContentKind,
} from "@munib-tracker/shared/types/oss-content-download-failure";

export type OssAudioUriClassification = {
  contentKind: OssContentKind;
  contentKey: string;
  sourceProvider: string;
  contentMeta: OssContentDownloadFailureMeta;
};

/** True when `host` is exactly `domain` or a subdomain of it. */
function hostnameMatches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/**
 * Map a remote audio URL to OSS failure telemetry fields so `audio-cache`
 * can report without each caller passing context.
 */
export function classifyOssAudioUri(remoteUri: string): OssAudioUriClassification {
  try {
    const url = new URL(remoteUri);
    const host = url.hostname.toLowerCase();
    const path = decodeURIComponent(url.pathname);

    if (hostnameMatches(host, "everyayah.com")) {
      const parts = path.split("/").filter(Boolean);
      // /data/{reciterDir}/{SSSAAA}.mp3
      const dataIdx = parts.indexOf("data");
      const reciterDir = dataIdx >= 0 ? parts[dataIdx + 1] : undefined;
      const file = parts[parts.length - 1] ?? "";
      const idMatch = /^(\d{3})(\d{3})\.mp3$/i.exec(file);
      const surah = idMatch ? Number(idMatch[1]) : undefined;
      const ayah = idMatch ? Number(idMatch[2]) : undefined;
      return {
        contentKind: "quran_audio",
        contentKey: `quran_audio:everyayah:${reciterDir ?? "unknown"}:${file || remoteUri}`,
        sourceProvider: "everyayah.com",
        contentMeta: {
          reciterDir,
          surah,
          ayah,
          trackId: file.replace(/\.mp3$/i, "") || undefined,
          decisionId: "D3",
        },
      };
    }

    if (hostnameMatches(host, "quranicaudio.com")) {
      return {
        contentKind: "quran_audio",
        contentKey: `quran_audio:quranicaudio:${path}`,
        sourceProvider: "download.quranicaudio.com",
        contentMeta: {
          decisionId: "D4",
          sourceSlug: path,
        },
      };
    }

    if (hostnameMatches(host, "jsdelivr.net") && /adhan-mp3/i.test(path)) {
      const file = path.split("/").pop() ?? path;
      return {
        contentKind: "adhan_audio",
        contentKey: `adhan_audio:${file}`,
        sourceProvider: "Kiwifu/adhan-mp3",
        contentMeta: {
          displayName: file,
          decisionId: "D11",
        },
      };
    }

    if (hostnameMatches(host, "jsdelivr.net") && /audio\/adhan\/phrases/i.test(path)) {
      const file = path.split("/").pop() ?? path;
      return {
        contentKind: "adhan_audio",
        contentKey: `adhan_audio:phrase:${file}`,
        sourceProvider: "munib-tracker/adhan-phrases",
        contentMeta: {
          displayName: file,
          decisionId: "D11",
        },
      };
    }

    if (hostnameMatches(host, "wikimedia.org") || hostnameMatches(host, "wikipedia.org")) {
      const file = path.split("/").pop() ?? path;
      return {
        contentKind: "adhan_audio",
        contentKey: `adhan_audio:wikimedia:${file}`,
        sourceProvider: "wikimedia-commons",
        contentMeta: {
          displayName: file,
          decisionId: "D11",
        },
      };
    }

    if (hostnameMatches(host, "jsdelivr.net") && /99-names-of-allah/i.test(path)) {
      return {
        contentKind: "content_audio",
        contentKey: `content_audio:names:${path.split("/").pop() ?? path}`,
        sourceProvider: "ProgrammerHasan/99-names-of-allah-audios",
        contentMeta: {
          decisionId: "D9",
          sourceSlug: path,
        },
      };
    }

    if (hostnameMatches(host, "archive.org") || hostnameMatches(host, "jsdelivr.net")) {
      return {
        contentKind: "content_audio",
        contentKey: `content_audio:${host}:${path.slice(0, 180)}`,
        sourceProvider: host,
        contentMeta: {
          decisionId: "D9",
          sourceSlug: path,
        },
      };
    }

    return {
      contentKind: "content_audio",
      contentKey: `content_audio:${host}:${path.slice(0, 180)}`,
      sourceProvider: host || "unknown-audio-cdn",
      contentMeta: {
        sourceSlug: path,
      },
    };
  } catch {
    return {
      contentKind: "content_audio",
      contentKey: `content_audio:${remoteUri.slice(0, 200)}`,
      sourceProvider: "unknown-audio-cdn",
      contentMeta: {},
    };
  }
}
