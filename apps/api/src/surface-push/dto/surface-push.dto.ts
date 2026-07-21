import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

export class SurfacePhaseUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phase!: string;

  @ApiProperty()
  @IsISO8601()
  executeAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  staleAt?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  dedupeKey!: string;

  @ApiProperty({ type: "object", additionalProperties: true })
  @IsObject()
  payload!: Record<string, unknown>;
}

export class UpsertSurfacePushDto {
  @ApiProperty({ enum: ["expo", "web_push"] })
  @IsIn(["expo", "web_push"])
  channel!: "expo" | "web_push";

  @ApiProperty({
    description: "Expo push token, or JSON string of a Web Push subscription",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  target!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  sessionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  deviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @ApiProperty({ type: [SurfacePhaseUpdateDto] })
  @IsArray()
  @ArrayMaxSize(48)
  @ValidateNested({ each: true })
  @Type(() => SurfacePhaseUpdateDto)
  updates!: SurfacePhaseUpdateDto[];
}

export class SurfacePushRegistrationResponseDto {
  @ApiProperty()
  registrationId!: number;

  @ApiProperty()
  channel!: string;

  @ApiProperty()
  scheduled!: number;

  @ApiPropertyOptional({ nullable: true })
  sessionId?: string | null;
}

export class SurfacePushLifecycleDto {
  @ApiProperty({ enum: ["ended", "dismissed"] })
  @IsIn(["ended", "dismissed"])
  state!: "ended" | "dismissed";
}

export class DispatchSurfaceJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobId!: string;
}

export class SurfacePushDispatchResponseDto {
  @ApiProperty()
  processed!: number;

  @ApiProperty()
  cleaned!: number;
}
