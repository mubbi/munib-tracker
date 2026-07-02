import { Body, Controller, Get, Headers, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  type SyncPullQueryDto,
  SyncPullResponseDto,
  type SyncPushDto,
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
    @Query() query: SyncPullQueryDto,
  ): Promise<SyncPullResponseDto> {
    return this.syncService.pull(this.extractBearerToken(authorization), query.since);
  }

  @Post("push")
  @ApiOperation({ summary: "Push local changes using last-write-wins semantics" })
  @ApiOkResponse({ type: SyncPushResponseDto })
  push(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: SyncPushDto,
  ): Promise<SyncPushResponseDto> {
    return this.syncService.push(this.extractBearerToken(authorization), dto);
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    return authorization.slice("Bearer ".length).trim();
  }
}
