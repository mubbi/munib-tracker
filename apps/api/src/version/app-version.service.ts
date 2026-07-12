import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { AppVersionEntity } from "../database/entities";
import {
  appVersionPlatformConfigKey,
  cacheGetJson,
  cacheSetJson,
  invalidateAppVersionCache,
} from "../redis/redisJsonCache";
import type { UpdateRequired, VersionMetaResponseDto } from "./dto/version.dto";
import { isVersionLessThan } from "./lib/semver";

export type AppPlatform = "web" | "android" | "ios";

/** Platform config from DB is cached in memory for this long. */
export const APP_VERSION_CONFIG_CACHE_TTL_MS = 300_000;
/** Redis L2 TTL matches in-memory cache (seconds). */
const APP_VERSION_REDIS_TTL_SEC = Math.ceil(APP_VERSION_CONFIG_CACHE_TTL_MS / 1000);
const MEMORY_MAX_ENTRIES = 20;

interface PlatformVersionConfig {
  latestVersion: string;
  minSoftVersion: string;
  minHardVersion: string;
  message: string | null;
  storeUrl: string | null;
}

/** Envelope so Redis can distinguish a cache hit of `null` from a miss. */
type CachedPlatformConfig = { config: PlatformVersionConfig | null };

const DEFAULT_META: VersionMetaResponseDto = {
  updateRequired: "none",
  latestVersion: "1.0.0",
  minSoftVersion: "1.0.0",
  minHardVersion: "1.0.0",
  message: null,
  storeUrl: null,
};

const platformMemoryCache = new Map<
  string,
  { data: PlatformVersionConfig | null; expiresAt: number }
>();

function touchPlatformMemory(platform: AppPlatform, data: PlatformVersionConfig | null): void {
  if (platformMemoryCache.size >= MEMORY_MAX_ENTRIES) {
    const oldest = platformMemoryCache.keys().next().value;
    if (oldest !== undefined) platformMemoryCache.delete(oldest);
  }
  platformMemoryCache.set(platform, {
    data,
    expiresAt: Date.now() + APP_VERSION_CONFIG_CACHE_TTL_MS,
  });
}

function defaultMetaForClient(clientVersion: string): VersionMetaResponseDto {
  return {
    ...DEFAULT_META,
    latestVersion: clientVersion,
    minSoftVersion: clientVersion,
    minHardVersion: clientVersion,
  };
}

/** Normalize platform from header (e.g. "ios", "Android" -> "ios", "android"). */
export function normalizePlatform(platform: string | undefined): AppPlatform {
  if (!platform || typeof platform !== "string") return "web";
  const p = platform.trim().toLowerCase();
  if (p === "ios" || p === "iphone" || p === "ipad") return "ios";
  if (p === "android") return "android";
  return "web";
}

/** Pure version comparison against DB row fields (unit-tested). */
export function resolveUpdateRequired(
  clientVersion: string,
  latestVersion: string,
  minSoftVersion: string,
  minHardVersion: string,
  message: string | null = null,
  storeUrl: string | null = null,
): VersionMetaResponseDto {
  let updateRequired: UpdateRequired = "none";
  if (isVersionLessThan(clientVersion, minHardVersion)) {
    updateRequired = "hard";
  } else if (
    isVersionLessThan(clientVersion, minSoftVersion) ||
    isVersionLessThan(clientVersion, latestVersion)
  ) {
    updateRequired = "soft";
  }

  return {
    updateRequired,
    latestVersion,
    minSoftVersion,
    minHardVersion,
    message,
    storeUrl,
  };
}

@Injectable()
export class AppVersionService {
  private readonly logger = new Logger(AppVersionService.name);

  constructor(
    @InjectRepository(AppVersionEntity)
    private readonly appVersions: Repository<AppVersionEntity>,
  ) {}

  async clearAppVersionCache(platform?: AppPlatform): Promise<void> {
    if (platform) {
      platformMemoryCache.delete(platform);
    } else {
      platformMemoryCache.clear();
    }
    await invalidateAppVersionCache(platform);
  }

  async getAppVersionMeta(
    platform: AppPlatform,
    clientVersion: string,
  ): Promise<VersionMetaResponseDto> {
    const config = await this.getPlatformConfig(platform);
    if (!config) {
      return defaultMetaForClient(clientVersion);
    }

    return resolveUpdateRequired(
      clientVersion,
      config.latestVersion,
      config.minSoftVersion,
      config.minHardVersion,
      config.message,
      config.storeUrl,
    );
  }

  private async getPlatformConfig(platform: AppPlatform): Promise<PlatformVersionConfig | null> {
    const mem = platformMemoryCache.get(platform);
    if (mem && mem.expiresAt > Date.now()) {
      return mem.data;
    }

    const redisKey = appVersionPlatformConfigKey(platform);
    const cached = await cacheGetJson<CachedPlatformConfig>(redisKey);
    if (cached && typeof cached === "object" && "config" in cached) {
      touchPlatformMemory(platform, cached.config);
      return cached.config;
    }

    try {
      const row = await this.appVersions.findOne({ where: { platform } });
      const config = row
        ? {
            latestVersion: row.latestVersion,
            minSoftVersion: row.minSoftVersion,
            minHardVersion: row.minHardVersion,
            message: row.message ?? null,
            storeUrl: row.storeUrl ?? null,
          }
        : null;

      touchPlatformMemory(platform, config);
      await cacheSetJson(
        redisKey,
        { config } satisfies CachedPlatformConfig,
        APP_VERSION_REDIS_TTL_SEC,
      );
      if (!config) {
        this.logger.warn(
          `No app_versions row for platform "${platform}" — using client version defaults. ` +
            "Insert a row with platform exactly 'web', 'android', or 'ios'.",
        );
      }
      return config;
    } catch (err) {
      this.logger.error(`Failed to load app_versions for ${platform}`, err);
      return null;
    }
  }
}
