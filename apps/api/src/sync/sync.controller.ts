import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { resolveAccessToken } from "../auth/resolve-access-token";
import {
  SyncPullQueryDto,
  SyncPullResponseDto,
  SyncPushDto,
  SyncPushResponseDto,
} from "./dto/sync.dto";
import { SyncService } from "./sync.service";

@ApiTags("sync")
@ApiBearerAuth()
@Controller("sync")
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get("pull")
  @ApiOperation({ summary: "Pull cloud changes since a timestamp" })
  @ApiOkResponse({ type: SyncPullResponseDto })
  pull(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Query() query: SyncPullQueryDto,
  ): Promise<SyncPullResponseDto> {
    return this.syncService.pull(resolveAccessToken(req, authorization), query.since);
  }

  @Post("push")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Push local changes using last-write-wins semantics" })
  @ApiOkResponse({ type: SyncPushResponseDto })
  push(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Body() dto: SyncPushDto,
  ): Promise<SyncPushResponseDto> {
    return this.syncService.push(resolveAccessToken(req, authorization), dto);
  }
}
