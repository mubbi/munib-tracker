import { CIRCLE_SIGNAL_KINDS, type CircleSignalKind } from "@munib-tracker/shared/circles";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import {
  AllowChildSession,
  type CircleActor,
  CircleAuthGuard,
  CurrentCircleActor,
} from "./circle-auth";
import { CircleSignalsService } from "./circle-signals.service";
import {
  ClearSignalQueryDto,
  CreateNudgeDto,
  FardStatusSignalDto,
  GoalDoneSignalDto,
  NudgeDto,
  NudgeListDto,
  RestDaySignalDto,
  SignalDto,
  SignalListDto,
  SignalsQueryDto,
} from "./dto/circles.dto";

const SIGNAL_KIND_ENUM = Object.fromEntries(CIRCLE_SIGNAL_KINDS.map((kind) => [kind, kind]));

/** Daily signals (closed schema per kind) and partner nudges. */
@ApiTags("circles")
@ApiBearerAuth()
@UseGuards(CircleAuthGuard)
@Controller("circles/:circleId")
export class CircleSignalsController {
  constructor(private readonly signals: CircleSignalsService) {}

  @Get("signals")
  @AllowChildSession()
  @ApiOperation({
    summary:
      "Signals I may see for a date range (≤ 35 days). Absence = 'no signal', never 'missed'",
  })
  @ApiOkResponse({ type: SignalListDto })
  list(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Query() query: SignalsQueryDto,
  ): Promise<SignalListDto> {
    return this.signals.list(actor, circleId, query);
  }

  @Put("signals/fard-status")
  @AllowChildSession()
  @ApiOperation({
    summary: "Family: the 5 fard statuses for a day (child itself or a parent on its behalf)",
  })
  @ApiOkResponse({ type: SignalDto })
  putFardStatus(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: FardStatusSignalDto,
  ): Promise<SignalDto> {
    return this.signals.putFardStatus(actor, circleId, dto);
  }

  @Put("signals/rest-day")
  @ApiOperation({ summary: "Family: parent marks a generic rest day for a child" })
  @ApiOkResponse({ type: SignalDto })
  putRestDay(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: RestDaySignalDto,
  ): Promise<SignalDto> {
    return this.signals.putRestDay(actor, circleId, dto);
  }

  @Put("signals/goal-done")
  @ApiOperation({ summary: "Partner: share 'done' for a day (the goal itself is never shared)" })
  @ApiOkResponse({ type: SignalDto })
  putGoalDone(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: GoalDoneSignalDto,
  ): Promise<SignalDto> {
    return this.signals.putGoalDone(actor, circleId, dto);
  }

  @Delete("signals/:kind/:date")
  @AllowChildSession()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Un-share a day's signal" })
  @ApiParam({ name: "kind", enum: CIRCLE_SIGNAL_KINDS })
  @ApiNoContentResponse()
  async clear(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Param("kind", new ParseEnumPipe(SIGNAL_KIND_ENUM)) kind: CircleSignalKind,
    @Param("date") date: string,
    @Query() query: ClearSignalQueryDto,
  ): Promise<void> {
    await this.signals.clear(actor, circleId, kind, date, query.memberId);
  }

  @Post("nudges")
  @ApiOperation({
    summary: "Partner: 'made dua for you' or a gentle reminder — 1 per member pair per day",
  })
  @ApiCreatedResponse({ type: NudgeDto })
  nudge(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
    @Body() dto: CreateNudgeDto,
  ): Promise<NudgeDto> {
    return this.signals.nudge(actor, circleId, dto);
  }

  @Get("nudges")
  @ApiOperation({
    summary:
      "Nudges I received in the last 7 days (anonymous). Show 'reminder' only after local Isha",
  })
  @ApiOkResponse({ type: NudgeListDto })
  nudges(
    @CurrentCircleActor() actor: CircleActor,
    @Param("circleId", ParseUUIDPipe) circleId: string,
  ): Promise<NudgeListDto> {
    return this.signals.receivedNudges(actor, circleId);
  }
}
