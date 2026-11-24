import { Controller, Get, HttpException, HttpStatus, Param, Query, Req, Res } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import { clientIp } from "../common/client-ip";
import {
  MasjidDetailDto,
  MasjidDetailParamsDto,
  MasjidListQueryDto,
  MasjidListResponseDto,
} from "./dto/masjid.dto";
import { MasjidsService } from "./masjids.service";
import { isMasjidDetailRateLimited, isMasjidListRateLimited } from "./masjids-rate-limit";

/** Public data, no auth, no user id: shared caches may keep it briefly. */
const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";

/**
 * Masjid finder (NF-3.11, D5): a read-only OpenStreetMap proxy. Public,
 * unauthenticated, no user data. Request coordinates are a geohash-5 cell only.
 */
@ApiTags("masjids")
@Controller("masjids")
export class MasjidsController {
  constructor(private readonly masjidsService: MasjidsService) {}

  @Get()
  @ApiOperation({
    summary: "Masjids in a geohash-5 cell and its 8 neighbours (OpenStreetMap, ODbL)",
  })
  @ApiOkResponse({ type: MasjidListResponseDto })
  @ApiTooManyRequestsResponse({ description: "Rate limited" })
  async list(
    @Query() query: MasjidListQueryDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MasjidListResponseDto> {
    const ip = clientIp(req);
    if (await isMasjidListRateLimited(ip)) {
      throw new HttpException("Too many masjid requests", HttpStatus.TOO_MANY_REQUESTS);
    }
    const result = await this.masjidsService.list(query.cell, ip);
    res.setHeader("Cache-Control", result.stale ? "no-store" : CACHE_CONTROL);
    return result;
  }

  @Get(":osmType/:osmId")
  @ApiOperation({
    summary: "One masjid's public OpenStreetMap details (+ licence-cleared timetable)",
  })
  @ApiOkResponse({ type: MasjidDetailDto })
  @ApiNotFoundResponse({ description: "Not a masjid in OpenStreetMap" })
  @ApiServiceUnavailableResponse({ description: "Upstream unavailable and nothing cached" })
  @ApiTooManyRequestsResponse({ description: "Rate limited" })
  async detail(
    @Param() params: MasjidDetailParamsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MasjidDetailDto> {
    const ip = clientIp(req);
    if (await isMasjidDetailRateLimited(ip)) {
      throw new HttpException("Too many masjid requests", HttpStatus.TOO_MANY_REQUESTS);
    }
    const result = await this.masjidsService.detail(params.osmType, params.osmId, ip);
    res.setHeader("Cache-Control", result.stale ? "no-store" : CACHE_CONTROL);
    return result;
  }
}
