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
import { type CircleActor, CircleAuthGuard, CurrentCircleActor } from "./circle-auth";
import { CirclesService } from "./circles.service";
import {
  CircleDetailDto,
  CircleListDto,
  CreateCircleDto,
  CreateInviteDto,
  InviteCreatedDto,
  InviteListDto,
  InvitePreviewDto,
  JoinCircleDto,
  UpdateCircleDto,
  UpdateMemberRoleDto,
  UpdateMyMembershipDto,
} from "./dto/circles.dto";

/** Circles, membership and invites (NF-3.16–3.18 backend, D1). */
@ApiTags("circles")
@ApiBearerAuth()
@UseGuards(CircleAuthGuard)
@Controller("circles")
export class CirclesController {
  constructor(private readonly circles: CirclesService) {}

  @Get()
  @ApiOperation({ summary: "My circles (active memberships)" })
  @ApiOkResponse({ type: CircleListDto })
  list(@CurrentCircleActor() actor: CircleActor): Promise<CircleListDto> {
    return this.circles.list(actor);
  }

  @Post()
  @ApiOperation({
    summary: "Create a circle (family / partner need a linked account; you become the owner)",
  })
  @ApiCreatedResponse({ type: CircleDetailDto })
  create(
    @CurrentCircleActor() actor: CircleActor,
    @Body() dto: CreateCircleDto,
  ): Promise<CircleDetailDto> {
    return this.circles.create(actor, dto);
  }

  @Get("join/:code")
  @ApiOperation({ summary: "Preview an invite before joining (rate-limited)" })
  @ApiOkResponse({ type: InvitePreviewDto })
  previewInvite(
    @CurrentCircleActor() actor: CircleActor,
    @Param("code") code: string,
  ): Promise<InvitePreviewDto> {
    return this.circles.previewInvite(actor, code);
  }

  @Post("join")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Join a circle with an invite code (deep link / QR)" })
  @ApiOkResponse({ type: CircleDetailDto })
  join(
    @CurrentCircleActor() actor: CircleActor,
    @Body() dto: JoinCircleDto,
  ): Promise<CircleDetailDto> {
    return this.circles.join(actor, dto);
  }

  @Get(":circleId")
  @ApiOperation({ summary: "Circle detail with members (members only)" })
  @ApiOkResponse({ type: CircleDetailDto })
  detail(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
  ): Promise<CircleDetailDto> {
    return this.circles.detail(actor, circleId);
  }

  @Patch(":circleId")
  @ApiOperation({ summary: "Rename / tag a circle (managers)" })
  @ApiOkResponse({ type: CircleDetailDto })
  update(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: UpdateCircleDto,
  ): Promise<CircleDetailDto> {
    return this.circles.update(actor, circleId, dto);
  }

  @Delete(":circleId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a circle and all its data now (owner)" })
  @ApiNoContentResponse()
  async remove(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
  ): Promise<void> {
    await this.circles.remove(actor, circleId);
  }

  @Patch(":circleId/members/me")
  @ApiOperation({ summary: "Update my display name / sharing switches in this circle" })
  @ApiOkResponse({ type: CircleDetailDto })
  updateMe(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: UpdateMyMembershipDto,
  ): Promise<CircleDetailDto> {
    return this.circles.updateMyMembership(actor, circleId, dto);
  }

  @Delete(":circleId/members/me")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Leave silently (signals purged after 30 days)" })
  @ApiNoContentResponse()
  async leave(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
  ): Promise<void> {
    await this.circles.leave(actor, circleId);
  }

  @Patch(":circleId/members/:memberId")
  @ApiOperation({ summary: "Change a member's role (owner)" })
  @ApiOkResponse({ type: CircleDetailDto })
  updateRole(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("memberId", ParseUUIDPipe) memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ): Promise<CircleDetailDto> {
    return this.circles.updateMemberRole(actor, circleId, memberId, dto);
  }

  @Delete(":circleId/members/:memberId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove an adult member (managers)" })
  @ApiNoContentResponse()
  async removeMember(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("memberId", ParseUUIDPipe) memberId: string,
  ): Promise<void> {
    await this.circles.removeMember(actor, circleId, memberId);
  }

  @Post(":circleId/invites")
  @ApiOperation({
    summary: "Create an invite (code returned once; 20 per user per day; default 7-day expiry)",
  })
  @ApiCreatedResponse({ type: InviteCreatedDto })
  createInvite(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: CreateInviteDto,
  ): Promise<InviteCreatedDto> {
    return this.circles.createInvite(actor, circleId, dto);
  }

  @Get(":circleId/invites")
  @ApiOperation({ summary: "Live invites (managers: all; others: their own)" })
  @ApiOkResponse({ type: InviteListDto })
  listInvites(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
  ): Promise<InviteListDto> {
    return this.circles.listInvites(actor, circleId);
  }

  @Delete(":circleId/invites/:inviteId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Revoke an invite" })
  @ApiNoContentResponse()
  async revokeInvite(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("inviteId", ParseUUIDPipe) inviteId: string,
  ): Promise<void> {
    await this.circles.revokeInvite(actor, circleId, inviteId);
  }
}
