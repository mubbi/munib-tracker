import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export type UpdateRequired = "none" | "soft" | "hard";

export class VersionMetaQueryDto {
  @ApiProperty({ example: "1.0.0", description: "Client semver (major.minor.patch)" })
  @IsString()
  @Matches(/^\d{1,5}\.\d{1,5}\.\d{1,5}$/)
  version!: string;

  @ApiPropertyOptional({ enum: ["web", "ios", "android"] })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({
    description: "Pass 1 or true to invalidate cached platform config",
  })
  @IsOptional()
  @IsString()
  refresh?: string;
}

export class VersionMetaResponseDto {
  @ApiProperty({ enum: ["none", "soft", "hard"] })
  updateRequired!: UpdateRequired;

  @ApiProperty({ example: "1.2.0" })
  latestVersion!: string;

  @ApiProperty({ example: "1.1.0" })
  minSoftVersion!: string;

  @ApiProperty({ example: "1.0.0" })
  minHardVersion!: string;

  @ApiPropertyOptional({ nullable: true })
  message?: string | null;

  @ApiPropertyOptional({ nullable: true })
  storeUrl?: string | null;
}
