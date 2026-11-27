import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { type CircleActor, CircleAuthGuard, CurrentCircleActor } from "./circle-auth";
import {
  AssignKhatmPartDto,
  CreateKhatmDto,
  KhatmDetailDto,
  KhatmListDto,
  UpdateKhatmDto,
} from "./dto/circles.dto";
import { GroupKhatmService } from "./group-khatm.service";

/** Group khatm (NF-3.18). All part transitions are compare-and-set; a lost race is 409. */
@ApiTags("circles")
@ApiBearerAuth()
@UseGuards(CircleAuthGuard)
@Controller("circles/:circleId/khatms")
export class GroupKhatmController {
  constructor(private readonly khatms: GroupKhatmService) {}

  @Post()
  @ApiOperation({
    summary: "Start a khatm (creator / admins); 30 juz default, 60 hizb, 114 surahs",
  })
  @ApiCreatedResponse({ type: KhatmDetailDto })
  create(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: CreateKhatmDto,
  ): Promise<KhatmDetailDto> {
    return this.khatms.create(actor, circleId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Khatms of this group (newest first)" })
  @ApiOkResponse({ type: KhatmListDto })
  list(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
  ): Promise<KhatmListDto> {
    return this.khatms.list(actor, circleId);
  }

  @Get(":khatmId")
  @ApiOperation({ summary: "Khatm with its part grid" })
  @ApiOkResponse({ type: KhatmDetailDto })
  detail(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
  ): Promise<KhatmDetailDto> {
    return this.khatms.detail(actor, circleId, khatmId);
  }

  @Patch(":khatmId")
  @ApiOperation({ summary: "Edit / extend deadline / open remaining parts after the deadline" })
  @ApiOkResponse({ type: KhatmDetailDto })
  update(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
    @Body() dto: UpdateKhatmDto,
  ): Promise<KhatmDetailDto> {
    return this.khatms.update(actor, circleId, khatmId, dto);
  }

  @Delete(":khatmId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a khatm (creator / admins)" })
  @ApiNoContentResponse()
  async remove(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
  ): Promise<void> {
    await this.khatms.remove(actor, circleId, khatmId);
  }

  @Post(":khatmId/rounds")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Start another round after completion (resets every part)" })
  @ApiOkResponse({ type: KhatmDetailDto })
  nextRound(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
  ): Promise<KhatmDetailDto> {
    return this.khatms.startNextRound(actor, circleId, khatmId);
  }

  @Post(":khatmId/deal")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Round-robin only (creator / admins): deal the parts nobody has started evenly over the current members",
    description:
      "Open parts and assigned-but-not-started parts are shared out in join order; parts being read or done never move. " +
      "Runs automatically when someone joins. 400 for other assignment modes, 409 with fewer than 2 members or a completed khatm.",
  })
  @ApiOkResponse({ type: KhatmDetailDto })
  @ApiBadRequestResponse({ description: "Not a round-robin khatm" })
  @ApiConflictResponse({ description: "Fewer than 2 members, or the khatm is complete" })
  deal(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
  ): Promise<KhatmDetailDto> {
    return this.khatms.deal(actor, circleId, khatmId);
  }

  @Post(":khatmId/parts/:partNo/claim")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Claim an open part (409 if someone else got it first)" })
  @ApiOkResponse({ type: KhatmDetailDto })
  claim(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
    @Param("partNo", ParseIntPipe) partNo: number,
  ): Promise<KhatmDetailDto> {
    return this.khatms.partAction(actor, circleId, khatmId, partNo, "claim");
  }

  @Post(":khatmId/parts/:partNo/release")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Give a part back to the pool (assignee, or creator / admins)" })
  @ApiOkResponse({ type: KhatmDetailDto })
  release(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
    @Param("partNo", ParseIntPipe) partNo: number,
  ): Promise<KhatmDetailDto> {
    return this.khatms.partAction(actor, circleId, khatmId, partNo, "release");
  }

  @Post(":khatmId/parts/:partNo/reading")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Mark my part as being read" })
  @ApiOkResponse({ type: KhatmDetailDto })
  reading(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
    @Param("partNo", ParseIntPipe) partNo: number,
  ): Promise<KhatmDetailDto> {
    return this.khatms.partAction(actor, circleId, khatmId, partNo, "reading");
  }

  @Post(":khatmId/parts/:partNo/complete")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Confirm 'Done' for my part (notifies the group)" })
  @ApiOkResponse({ type: KhatmDetailDto })
  complete(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
    @Param("partNo", ParseIntPipe) partNo: number,
  ): Promise<KhatmDetailDto> {
    return this.khatms.partAction(actor, circleId, khatmId, partNo, "complete");
  }

  @Post(":khatmId/parts/:partNo/assign")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Creator / admins assign or reassign a part (open, stale, or creator-assigns mode)",
  })
  @ApiOkResponse({ type: KhatmDetailDto })
  assign(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("khatmId", ParseUUIDPipe) khatmId: string,
    @Param("partNo", ParseIntPipe) partNo: number,
    @Body() dto: AssignKhatmPartDto,
  ): Promise<KhatmDetailDto> {
    return this.khatms.assign(actor, circleId, khatmId, partNo, dto);
  }
}
