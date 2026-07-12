import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class VapidPublicKeyResponseDto {
  @ApiPropertyOptional({ nullable: true, description: "Web Push VAPID public key, if configured" })
  publicKey!: string | null;
}

export class UpsertPushTokenDto {
  @ApiProperty({ description: "Expo push token or web push subscription endpoint" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  token!: string;

  @ApiPropertyOptional({ description: "Stable device id for upsert" })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  deviceId?: string;

  @ApiProperty({ enum: ["expo", "web"] })
  @IsIn(["expo", "web"])
  platform!: "expo" | "web";

  @ApiPropertyOptional({ example: "en" })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  locale?: string;

  @ApiPropertyOptional({ description: "Client OS / runtime", example: "ios" })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  clientPlatform?: string;
}

export class PushTokenResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  token!: string;

  @ApiProperty({ enum: ["expo", "web"] })
  platform!: string;

  @ApiPropertyOptional({ nullable: true })
  deviceId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  locale?: string | null;

  @ApiPropertyOptional({ nullable: true })
  clientPlatform?: string | null;

  @ApiProperty()
  updatedAt!: string;
}

export class InAppNotificationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ example: "admin_announcement" })
  kind!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiPropertyOptional({ nullable: true })
  subtitle?: string | null;

  @ApiPropertyOptional({ nullable: true, type: "object", additionalProperties: true })
  routeData?: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true })
  dedupeKey?: string | null;

  @ApiPropertyOptional({ nullable: true })
  broadcastId?: number | null;

  @ApiPropertyOptional({ nullable: true })
  readAt?: string | null;

  @ApiPropertyOptional({ nullable: true })
  clickedAt?: string | null;

  @ApiProperty()
  createdAt!: string;
}

export class InAppNotificationListResponseDto {
  @ApiProperty({ type: [InAppNotificationDto] })
  items!: InAppNotificationDto[];
}

export class UnreadCountResponseDto {
  @ApiProperty({ example: 3 })
  count!: number;
}

export class EngageInAppNotificationDto {
  @ApiProperty({ enum: ["open", "click"] })
  @IsIn(["open", "click"])
  action!: "open" | "click";
}
