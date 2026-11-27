import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { clientIp } from "../common/client-ip";
import { isRateLimited } from "../common/durable-rate-limit";
import { AppVersionService, normalizePlatform } from "./app-version.service";
import { VersionMetaQueryDto, VersionMetaResponseDto } from "./dto/version.dto";

/**
 * `refresh` is unauthenticated, so cap cache invalidations per IP: otherwise one
 * client can keep the platform cache cold and push every request that carries
 * `X-App-Version` (see `AppVersionHeadersMiddleware`) onto the database.
 */
export const VERSION_REFRESH_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;

@ApiTags("version")
@Controller("version")
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get("meta")
  @ApiOperation({ summary: "Compare client semver with platform update policy" })
  @ApiOkResponse({ type: VersionMetaResponseDto })
  async getVersionMeta(
    @Query() query: VersionMetaQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<VersionMetaResponseDto> {
    if (
      (query.refresh === "1" || query.refresh === "true") &&
      !(await isRateLimited({
        key: `version-refresh:ip:${clientIp(req)}`,
        ...VERSION_REFRESH_RATE_LIMIT,
      }))
    ) {
      await this.appVersionService.clearAppVersionCache(
        query.platform != null ? normalizePlatform(query.platform) : undefined,
      );
    }

    res.setHeader("Cache-Control", "private, no-cache");

    const version = query.version.trim();
    const platform = normalizePlatform(query.platform);
    return this.appVersionService.getAppVersionMeta(platform, version);
  }
}
