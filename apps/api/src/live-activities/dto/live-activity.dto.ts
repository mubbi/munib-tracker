import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsIn,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from "class-validator";

export enum LiveActivityApnsEnvironment {
  Sandbox = "sandbox",
  Production = "production",
}

export class LiveActivityScheduledUpdateDto {
  @ApiProperty({ example: "asr-mark" })
  @IsString()
  @MaxLength(32)
  phase!: string;

  @ApiProperty({ format: "date-time" })
  @IsISO8601({ strict: true })
  executeAt!: string;

  @ApiPropertyOptional({ format: "date-time" })
  @IsOptional()
  @IsISO8601({ strict: true })
  staleAt?: string;

  @ApiProperty({ type: "object", additionalProperties: true })
  @IsObject()
  contentState!: Record<string, unknown>;
}

export class UpsertLiveActivityDto {
  @ApiProperty()
  @IsString()
  @MaxLength(128)
  activityId!: string;

  @ApiProperty({ description: "ActivityKit per-activity APNs token as lowercase hex" })
  @IsString()
  @Matches(/^[0-9a-f]{64,512}$/)
  pushToken!: string;

  @ApiProperty({ enum: LiveActivityApnsEnvironment })
  @IsEnum(LiveActivityApnsEnvironment)
  environment!: LiveActivityApnsEnvironment;

  @ApiProperty({ type: [LiveActivityScheduledUpdateDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(24)
  @ValidateNested({ each: true })
  @Type(() => LiveActivityScheduledUpdateDto)
  updates!: LiveActivityScheduledUpdateDto[];
}

export class LiveActivityRegistrationResponseDto {
  @ApiProperty()
  activityId!: string;

  @ApiProperty({ format: "date-time" })
  expiresAt!: string;

  @ApiProperty()
  scheduled!: number;
}

export class LiveActivityLifecycleDto {
  @ApiProperty({ enum: ["ended", "dismissed"] })
  @IsIn(["ended", "dismissed"])
  state!: "ended" | "dismissed";
}

export class DispatchLiveActivityJobDto {
  @ApiProperty({ format: "uuid" })
  @IsString()
  jobId!: string;
}

export class LiveActivityDispatchResponseDto {
  @ApiProperty()
  processed!: number;

  @ApiProperty()
  cleaned!: number;
}
