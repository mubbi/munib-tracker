import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import type { Request } from "express";
import { resolveAccessToken } from "../auth/resolve-access-token";
import { clientIp } from "../common/client-ip";
import {
  type CircleActor,
  CircleActorService,
  CircleAuthGuard,
  CurrentCircleActor,
} from "./circle-auth";
import { CircleNearbyService } from "./circle-nearby.service";
import { isChildSessionToken } from "./circle-tokens";
import {
  CreateNearbyRequestDto,
  CreateNearbySessionDto,
  NearbyRequestCreatedDto,
  NearbyRequestDto,
  NearbyRequestListDto,
  NearbyRequestStatusDto,
  NearbyRequestTokenDto,
  NearbySessionDto,
  NearbySessionPreviewDto,
} from "./dto/nearby.dto";

/** NF-3.25 host side: open / end a nearby session and answer "Asking to join" (D42). */
@ApiTags("circles")
@ApiBearerAuth()
@UseGuards(CircleAuthGuard)
@Controller("circles/:circleId/nearby-sessions")
export class CircleNearbyHostController {
  constructor(private readonly nearby: CircleNearbyService) {}

  @Post()
  @ApiOperation({
    summary:
      "Open a 10-minute nearby (Bluetooth) session — same role rules as invites; `childId` links a child's device",
  })
  @ApiCreatedResponse({ type: NearbySessionDto })
  create(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: CreateNearbySessionDto,
  ): Promise<NearbySessionDto> {
    return this.nearby.createSession(actor, circleId, dto);
  }

  @Delete(":sessionId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "End a nearby session (host left the screen)" })
  @ApiNoContentResponse()
  async end(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("sessionId") sessionId: string,
  ): Promise<void> {
    await this.nearby.endSession(actor, circleId, sessionId);
  }

  @Get(":sessionId/requests")
  @ApiOperation({ summary: "Asking to join (host polls while the screen is open)" })
  @ApiOkResponse({ type: NearbyRequestListDto })
  requests(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("sessionId") sessionId: string,
  ): Promise<NearbyRequestListDto> {
    return this.nearby.listRequests(actor, circleId, sessionId);
  }

  @Post(":sessionId/requests/:requestId/accept")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Accept — joins them exactly like an invite (or links the child's device)",
  })
  @ApiOkResponse({ type: NearbyRequestDto })
  accept(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("sessionId") sessionId: string,
    @Param("requestId", ParseUUIDPipe) requestId: string,
  ): Promise<NearbyRequestDto> {
    return this.nearby.decide(actor, circleId, sessionId, requestId, "accept");
  }

  @Post(":sessionId/requests/:requestId/decline")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Decline a nearby join request" })
  @ApiOkResponse({ type: NearbyRequestDto })
  decline(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("sessionId") sessionId: string,
    @Param("requestId", ParseUUIDPipe) requestId: string,
  ): Promise<NearbyRequestDto> {
    return this.nearby.decide(actor, circleId, sessionId, requestId, "decline");
  }
}

/**
 * NF-3.25 joiner side. The preview and the request are keyed by the trusted
 * client IP (`clientIp`, never logged). Polling and cancelling are authorised
 * by the one-time request secret in the body (kept out of URLs and logs).
 */
@ApiTags("circles")
@Controller("nearby-sessions")
export class CircleNearbyJoinController {
  constructor(
    private readonly nearby: CircleNearbyService,
    private readonly actors: CircleActorService,
  ) {}

  @Get(":sessionId")
  @ApiOperation({ summary: "Preview a discovered nearby session (rate-limited per client)" })
  @ApiOkResponse({ type: NearbySessionPreviewDto })
  preview(
    @Req() req: Request,
    @Param("sessionId") sessionId: string,
  ): Promise<NearbySessionPreviewDto> {
    return this.nearby.preview(sessionId, clientIp(req));
  }

  @Post(":sessionId/requests")
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Ask to join after confirming the 4 digits (account session required, guests only for khatm; a child device needs none)",
  })
  @ApiCreatedResponse({ type: NearbyRequestCreatedDto })
  async request(
    @Req() req: Request,
    @Param("sessionId") sessionId: string,
    @Body() dto: CreateNearbyRequestDto,
  ): Promise<NearbyRequestCreatedDto> {
    const actor = await this.optionalActor(req);
    return this.nearby.createRequest(actor, sessionId, dto, clientIp(req));
  }

  @Post(":sessionId/requests/:requestId/status")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Joiner polls its request (child-device link: returns the child session once)",
  })
  @ApiOkResponse({ type: NearbyRequestStatusDto })
  status(
    @Param("sessionId") sessionId: string,
    @Param("requestId", ParseUUIDPipe) requestId: string,
    @Body() dto: NearbyRequestTokenDto,
  ): Promise<NearbyRequestStatusDto> {
    return this.nearby.status(sessionId, requestId, dto.requestToken);
  }

  @Post(":sessionId/requests/:requestId/cancel")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Joiner withdraws a pending request" })
  @ApiNoContentResponse()
  async cancel(
    @Param("sessionId") sessionId: string,
    @Param("requestId", ParseUUIDPipe) requestId: string,
    @Body() dto: NearbyRequestTokenDto,
  ): Promise<void> {
    await this.nearby.cancel(sessionId, requestId, dto.requestToken);
  }

  /**
   * The account behind the request, if any. A child device (child-session
   * bearer or no session at all) asks anonymously; an invalid account token
   * also resolves to "none" and the service answers 401 where an account is
   * required, so the client's refresher can retry.
   */
  private async optionalActor(req: Request): Promise<CircleActor | undefined> {
    let token: string;
    try {
      const header = req.headers.authorization;
      token = resolveAccessToken(req, typeof header === "string" ? header : undefined);
    } catch {
      return undefined;
    }
    if (isChildSessionToken(token)) return undefined;
    try {
      return await this.actors.resolve(token, false);
    } catch {
      return undefined;
    }
  }
}
