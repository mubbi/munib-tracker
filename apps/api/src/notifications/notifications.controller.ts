import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { resolveAccessToken } from "../auth/resolve-access-token";
import {
  EngageInAppNotificationDto,
  InAppNotificationDto,
  InAppNotificationListResponseDto,
  PushTokenResponseDto,
  UnreadCountResponseDto,
  UpsertPushTokenDto,
  VapidPublicKeyResponseDto,
} from "./dto/notifications.dto";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("vapid-public-key")
  @ApiOperation({ summary: "Public Web Push VAPID key (null when unset)" })
  @ApiOkResponse({ type: VapidPublicKeyResponseDto })
  getVapidPublicKey(): VapidPublicKeyResponseDto {
    return this.notificationsService.getVapidPublicKey();
  }

  @Put("push-token")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Register or refresh a push token (guest + linked accounts)" })
  @ApiOkResponse({ type: PushTokenResponseDto })
  upsertPushToken(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Body() dto: UpsertPushTokenDto,
  ): Promise<PushTokenResponseDto> {
    return this.notificationsService.upsertPushToken(resolveAccessToken(req, authorization), dto);
  }

  @Get("in-app")
  @ApiBearerAuth()
  @ApiOperation({ summary: "List in-app notifications for the current user (newest first)" })
  @ApiOkResponse({ type: InAppNotificationListResponseDto })
  listInApp(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
  ): Promise<InAppNotificationListResponseDto> {
    return this.notificationsService.listInApp(resolveAccessToken(req, authorization));
  }

  @Get("in-app/unread-count")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Unread in-app notification count" })
  @ApiOkResponse({ type: UnreadCountResponseDto })
  unreadCount(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
  ): Promise<UnreadCountResponseDto> {
    return this.notificationsService.unreadCount(resolveAccessToken(req, authorization));
  }

  @Post("in-app/mark-all-read")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark all in-app notifications as read" })
  @ApiOkResponse({ type: UnreadCountResponseDto })
  markAllRead(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
  ): Promise<UnreadCountResponseDto> {
    return this.notificationsService.markAllRead(resolveAccessToken(req, authorization));
  }

  @Patch("in-app/:id/read")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark a single in-app notification as read" })
  @ApiOkResponse({ type: InAppNotificationDto })
  markRead(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<InAppNotificationDto> {
    return this.notificationsService.markRead(resolveAccessToken(req, authorization), id);
  }

  @Post("in-app/:id/engage")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Record open/click engagement (increments broadcast counters)" })
  @ApiOkResponse({ type: InAppNotificationDto })
  engage(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: EngageInAppNotificationDto,
  ): Promise<InAppNotificationDto> {
    return this.notificationsService.engage(resolveAccessToken(req, authorization), id, dto);
  }
}
