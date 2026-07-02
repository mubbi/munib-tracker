import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export const SYNC_ENTITIES = [
  "prayer_logs",
  "zikr_progress",
  "qaza_entries",
  "preferences",
  "favorites",
] as const;

export type SyncEntity = (typeof SYNC_ENTITIES)[number];

export class SyncPullQueryDto {
  @ApiPropertyOptional({
    description: "ISO timestamp — return changes updated after this moment",
    example: "2026-01-01T00:00:00.000Z",
  })
  @IsOptional()
  @IsISO8601()
  since?: string;
}

export class SyncRecordDto {
  @ApiProperty({ enum: SYNC_ENTITIES })
  @IsString()
  @IsNotEmpty()
  entity!: SyncEntity;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ type: "object", additionalProperties: true })
  @IsObject()
  data!: Record<string, unknown>;

  @ApiProperty()
  @IsISO8601()
  updatedAt!: string;

  @ApiPropertyOptional({ description: "Set when the record was deleted on another device" })
  @IsOptional()
  @IsISO8601()
  deletedAt?: string;
}

export class SyncPushDto {
  @ApiProperty({ type: [SyncRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncRecordDto)
  changes!: SyncRecordDto[];
}

export class SyncPullResponseDto {
  @ApiProperty({ type: [SyncRecordDto] })
  changes!: SyncRecordDto[];

  @ApiProperty()
  serverTime!: string;
}

export class SyncPushResponseDto {
  @ApiProperty()
  accepted!: number;

  @ApiProperty({ type: [SyncRecordDto] })
  conflicts!: SyncRecordDto[];

  @ApiProperty()
  serverTime!: string;
}
