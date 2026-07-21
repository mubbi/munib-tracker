import type { RawBodyRequest } from "@nestjs/common";
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { resolveAccessToken } from "../auth/resolve-access-token";
import type { EnvironmentVariables } from "../config/env.schema";
import {
  DispatchLiveActivityJobDto,
  LiveActivityDispatchResponseDto,
  LiveActivityLifecycleDto,
  LiveActivityRegistrationResponseDto,
  UpsertLiveActivityDto,
} from "./dto/live-activity.dto";
import { LiveActivitiesService } from "./live-activities.service";
import { LiveActivityQStashService } from "./live-activity-qstash.service";

@ApiTags("live-activities")
@Controller("live-activities")
export class LiveActivitiesController {
  constructor(
    private readonly liveActivitiesService: LiveActivitiesService,
    private readonly qstash: LiveActivityQStashService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Register an ActivityKit push token and schedule phase boundary updates",
  })
  @ApiOkResponse({ type: LiveActivityRegistrationResponseDto })
  upsert(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Body() dto: UpsertLiveActivityDto,
  ): Promise<LiveActivityRegistrationResponseDto> {
    return this.liveActivitiesService.upsert(resolveAccessToken(req, authorization), dto);
  }

  @Put(":activityId/lifecycle")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark a Live Activity as ended/dismissed and cancel jobs" })
  lifecycle(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("activityId") activityId: string,
    @Body() dto: LiveActivityLifecycleDto,
  ): Promise<void> {
    return this.liveActivitiesService.lifecycle(
      resolveAccessToken(req, authorization),
      activityId,
      dto,
    );
  }

  @Post("internal/deliver")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "QStash callback: deliver one scheduled ActivityKit update" })
  async deliver(
    @Headers("upstash-signature") signature: string | undefined,
    @Req() req: RawBodyRequest<Request>,
    @Body() dto: DispatchLiveActivityJobDto,
  ): Promise<{ ok: true }> {
    const valid = await this.qstash.verify(signature, req.rawBody);
    if (!valid) throw new UnauthorizedException("Invalid QStash signature");
    await this.liveActivitiesService.deliver(dto.jobId);
    return { ok: true };
  }

  @Post("internal/dispatch-due")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Cron fallback: deliver due ActivityKit jobs and clean expired tokens",
  })
  @ApiOkResponse({ type: LiveActivityDispatchResponseDto })
  async dispatchDue(
    @Headers("authorization") authorization: string | undefined,
  ): Promise<LiveActivityDispatchResponseDto> {
    this.assertInternalSecret(authorization);
    return this.liveActivitiesService.dispatchDue();
  }

  private assertInternalSecret(authorization: string | undefined): void {
    const secret = this.config.get("LIVE_ACTIVITY_CRON_SECRET", { infer: true })?.trim();
    if (!secret) throw new UnauthorizedException("Live Activity cron is not configured");
    if (authorization !== `Bearer ${secret}`) {
      throw new UnauthorizedException("Invalid Live Activity cron secret");
    }
  }
}
