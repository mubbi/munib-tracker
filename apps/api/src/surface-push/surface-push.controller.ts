import type { RawBodyRequest } from "@nestjs/common";
import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
  DispatchSurfaceJobDto,
  SurfacePushDispatchResponseDto,
  SurfacePushLifecycleDto,
  SurfacePushRegistrationResponseDto,
  UpsertSurfacePushDto,
} from "./dto/surface-push.dto";
import { SurfacePushService } from "./surface-push.service";
import { SurfacePushQStashService } from "./surface-push-qstash.service";

@ApiTags("surface-push")
@Controller("surface-push")
export class SurfacePushController {
  constructor(
    private readonly surfacePushService: SurfacePushService,
    private readonly qstash: SurfacePushQStashService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Register Expo or Web Push target and schedule Salah phase updates (guest + linked)",
  })
  @ApiOkResponse({ type: SurfacePushRegistrationResponseDto })
  upsert(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Body() dto: UpsertSurfacePushDto,
  ): Promise<SurfacePushRegistrationResponseDto> {
    return this.surfacePushService.upsert(resolveAccessToken(req, authorization), dto);
  }

  @Put(":registrationId/lifecycle")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark a surface registration as ended/dismissed and cancel jobs" })
  lifecycle(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("registrationId", ParseIntPipe) registrationId: number,
    @Body() dto: SurfacePushLifecycleDto,
  ): Promise<void> {
    return this.surfacePushService.lifecycle(
      resolveAccessToken(req, authorization),
      registrationId,
      dto,
    );
  }

  @Delete(":registrationId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a surface push registration and cancel jobs" })
  delete(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("registrationId", ParseIntPipe) registrationId: number,
  ): Promise<void> {
    return this.surfacePushService.deleteRegistration(
      resolveAccessToken(req, authorization),
      registrationId,
    );
  }

  @Post("internal/deliver")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "QStash callback: deliver one scheduled surface push job" })
  async deliver(
    @Headers("upstash-signature") signature: string | undefined,
    @Req() req: RawBodyRequest<Request>,
    @Body() dto: DispatchSurfaceJobDto,
  ): Promise<{ ok: true }> {
    const valid = await this.qstash.verify(signature, req.rawBody);
    if (!valid) throw new UnauthorizedException("Invalid QStash signature");
    await this.surfacePushService.deliver(dto.jobId);
    return { ok: true };
  }

  @Post("internal/dispatch-due")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cron fallback: deliver due surface push jobs" })
  @ApiOkResponse({ type: SurfacePushDispatchResponseDto })
  async dispatchDue(
    @Headers("authorization") authorization: string | undefined,
  ): Promise<SurfacePushDispatchResponseDto> {
    this.assertInternalSecret(authorization);
    return this.surfacePushService.dispatchDue();
  }

  private assertInternalSecret(authorization: string | undefined): void {
    const secret = this.config.get("SURFACE_PUSH_CRON_SECRET", { infer: true })?.trim();
    if (!secret) throw new UnauthorizedException("Surface push cron is not configured");
    if (authorization !== `Bearer ${secret}`) {
      throw new UnauthorizedException("Invalid surface push cron secret");
    }
  }
}
