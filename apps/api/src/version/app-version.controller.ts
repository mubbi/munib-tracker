import { Controller, Get, Query, Res } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { AppVersionService, normalizePlatform } from "./app-version.service";
import { VersionMetaQueryDto, VersionMetaResponseDto } from "./dto/version.dto";

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
  ): Promise<VersionMetaResponseDto> {
    if (query.refresh === "1" || query.refresh === "true") {
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
