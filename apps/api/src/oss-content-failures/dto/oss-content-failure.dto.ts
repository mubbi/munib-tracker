import {
  OSS_CONTENT_ERROR_CODES,
  OSS_CONTENT_KINDS,
  type OssContentDownloadFailureMeta,
  type OssContentErrorCode,
  type OssContentKind,
} from "@munib-tracker/shared/types/oss-content-download-failure";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class ReportOssContentDownloadFailureDto {
  @ApiProperty({ enum: OSS_CONTENT_KINDS })
  @IsIn([...OSS_CONTENT_KINDS])
  contentKind!: OssContentKind;

  @ApiProperty({
    description: "Stable grouping key, e.g. quran_edition:en-saheehintl:2",
    maxLength: 256,
  })
  @IsString()
  @MaxLength(256)
  contentKey!: string;

  @ApiProperty({ example: "fawazahmed0/quran-api", maxLength: 128 })
  @IsString()
  @MaxLength(128)
  sourceProvider!: string;

  @ApiProperty({ description: "Full CDN URL that failed" })
  @IsString()
  @MaxLength(2048)
  sourceUrl!: string;

  @ApiProperty({
    description: "Identifying fields for the failed content (edition, surah, page, …)",
    type: "object",
    additionalProperties: true,
  })
  @IsObject()
  contentMeta!: OssContentDownloadFailureMeta;

  @ApiProperty({ enum: OSS_CONTENT_ERROR_CODES })
  @IsIn([...OSS_CONTENT_ERROR_CODES])
  errorCode!: OssContentErrorCode;

  @ApiProperty({ maxLength: 2000 })
  @IsString()
  @MaxLength(2000)
  errorMessage!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(599)
  httpStatus?: number;

  @ApiProperty({ maxLength: 32 })
  @IsString()
  @MaxLength(32)
  appVersion!: string;

  @ApiProperty({ enum: ["ios", "android", "web"] })
  @IsIn(["ios", "android", "web"])
  platform!: "ios" | "android" | "web";

  @ApiPropertyOptional({ maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  locale?: string;

  @ApiPropertyOptional({ maxLength: 16 })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  translationLocale?: string;
}
