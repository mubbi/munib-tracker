import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { clientIp } from "../common/client-ip";
import { ChildProfilesService } from "./child-profiles.service";
import {
  AllowChildSession,
  type CircleActor,
  CircleAuthGuard,
  CurrentCircleActor,
} from "./circle-auth";
import {
  ChildDeviceLinkDto,
  ChildProfileDto,
  ChildSessionDto,
  CircleSummaryDto,
  ConfirmChildConsentDto,
  CreateChildProfileDto,
  GraduateChildDto,
  RedeemChildLinkDto,
  UpdateChildProfileDto,
} from "./dto/circles.dto";

/** Parent-managed child profiles inside a family circle (D7). */
@ApiTags("circles")
@ApiBearerAuth()
@UseGuards(CircleAuthGuard)
@Controller("circles/:circleId/children")
export class CircleChildrenController {
  constructor(private readonly children: ChildProfilesService) {}

  @Get()
  @ApiOperation({ summary: "Child profiles in a family circle (parents)" })
  @ApiOkResponse({ type: [ChildProfileDto] })
  list(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
  ): Promise<ChildProfileDto[]> {
    return this.children.list(actor, circleId);
  }

  @Post()
  @ApiOperation({
    summary:
      "Create a child profile — nickname + birth year only, under 13, records parental consent",
  })
  @ApiCreatedResponse({ type: ChildProfileDto })
  create(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: CreateChildProfileDto,
  ): Promise<ChildProfileDto> {
    return this.children.create(actor, circleId, dto);
  }

  @Patch(":childId")
  @ApiOperation({ summary: "Edit nickname / birth year / avatar / reward / early graduation" })
  @ApiOkResponse({ type: ChildProfileDto })
  update(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("childId", ParseUUIDPipe) childId: string,
    @Body() dto: UpdateChildProfileDto,
  ): Promise<ChildProfileDto> {
    return this.children.update(actor, circleId, childId, dto);
  }

  @Delete(":childId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a child profile and all its data immediately" })
  @ApiNoContentResponse()
  async remove(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("childId", ParseUUIDPipe) childId: string,
  ): Promise<void> {
    await this.children.remove(actor, circleId, childId);
  }

  @Post(":childId/consent")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Re-confirm parental consent (D34: a profile transferred from a parent who deleted their account)",
  })
  @ApiOkResponse({ type: ChildProfileDto })
  confirmConsent(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("childId", ParseUUIDPipe) childId: string,
    @Body() dto: ConfirmChildConsentDto,
  ): Promise<ChildProfileDto> {
    return this.children.confirmConsent(actor, circleId, childId, dto);
  }

  @Post(":childId/device-link")
  @ApiOperation({ summary: "One-time QR token (5 min) to link the child's device" })
  @ApiCreatedResponse({ type: ChildDeviceLinkDto })
  deviceLink(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("childId", ParseUUIDPipe) childId: string,
  ): Promise<ChildDeviceLinkDto> {
    return this.children.createDeviceLink(actor, circleId, childId);
  }

  @Delete(":childId/device")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Revoke the child's linked device session" })
  @ApiNoContentResponse()
  async revokeDevice(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("childId", ParseUUIDPipe) childId: string,
  ): Promise<void> {
    await this.children.revokeDevice(actor, circleId, childId);
  }
}

/** Child-device endpoints: redeem the QR, read own profile, graduate. */
@ApiTags("circles")
@Controller("circle-child")
export class CircleChildSessionController {
  constructor(private readonly children: ChildProfilesService) {}

  @Post("session")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Child device: exchange the one-time QR token for a scoped child session",
  })
  @ApiOkResponse({ type: ChildSessionDto })
  redeem(@Req() req: Request, @Body() dto: RedeemChildLinkDto): Promise<ChildSessionDto> {
    return this.children.redeemDeviceLink(dto.linkToken, clientIp(req));
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(CircleAuthGuard)
  @AllowChildSession()
  @ApiOperation({ summary: "Child session: my profile (nickname, age band, reward)" })
  @ApiOkResponse({ type: ChildProfileDto })
  me(@CurrentCircleActor() actor: CircleActor): Promise<ChildProfileDto> {
    return this.children.me(actor);
  }

  @Post("graduate")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(CircleAuthGuard)
  @ApiOperation({
    summary: "Signed-in young person converts their child profile into an adult family membership",
  })
  @ApiOkResponse({ type: CircleSummaryDto })
  graduate(
    @CurrentCircleActor() actor: CircleActor,
    @Body() dto: GraduateChildDto,
  ): Promise<CircleSummaryDto> {
    return this.children.graduate(actor, dto);
  }
}
