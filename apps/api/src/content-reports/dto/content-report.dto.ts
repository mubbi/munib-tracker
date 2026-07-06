import type {
  ContentReportIssueType,
  ContentReportKind,
  ContentReportReference,
  ContentReportSnapshot,
  ContentReportStatus,
} from "@munib-tracker/shared/types/content-report";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export const CONTENT_REPORT_KINDS = [
  "quran_ayah",
  "hadith",
  "dua",
  "zikr",
  "durood",
  "name",
  "salah_guide",
  "jannah",
  "battles",
  "learn_quran",
  "learn_dua",
  "taharah",
  "prophets",
  "aqeedah",
  "zakat",
  "seerah",
  "hajj",
  "travel",
  "excused",
  "screen",
] as const;

export const CONTENT_REPORT_ISSUE_TYPES = [
  "incorrect_arabic",
  "incorrect_translation",
  "incorrect_transliteration",
  "wrong_reference",
  "missing_content",
  "audio_issue",
  "typo",
  "other",
] as const;

export const CONTENT_REPORT_STATUSES = [
  "pending",
  "in_review",
  "in_progress",
  "completed",
  "cancelled",
  "spam",
] as const;

export class ContentReportSnapshotDto implements ContentReportSnapshot {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  arabic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  transliteration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  translation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reference?: string;
}

export class ContentReportReferenceDto implements ContentReportReference {
  @ApiProperty({ enum: CONTENT_REPORT_KINDS })
  @IsIn([...CONTENT_REPORT_KINDS])
  kind!: ContentReportKind;

  @ApiProperty()
  @IsString()
  @MaxLength(256)
  contentId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  parentId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  route!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(16)
  locale!: string;

  @ApiPropertyOptional({ type: ContentReportSnapshotDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentReportSnapshotDto)
  snapshot?: ContentReportSnapshotDto;
}

export class CreateContentReportDto {
  @ApiProperty({ enum: CONTENT_REPORT_ISSUE_TYPES })
  @IsIn([...CONTENT_REPORT_ISSUE_TYPES])
  issueType!: ContentReportIssueType;

  @ApiProperty({ minLength: 10, maxLength: 4000 })
  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  description!: string;

  @ApiPropertyOptional({ maxLength: 4000 })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  suggestedCorrection?: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  userReference?: string;

  @ApiProperty({ type: ContentReportReferenceDto })
  @ValidateNested()
  @Type(() => ContentReportReferenceDto)
  content!: ContentReportReferenceDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  appVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  platform?: string;
}

export class ContentReportSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: CONTENT_REPORT_STATUSES })
  status!: ContentReportStatus;

  @ApiProperty({ enum: CONTENT_REPORT_ISSUE_TYPES })
  issueType!: ContentReportIssueType;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: ContentReportReferenceDto })
  content!: ContentReportReferenceDto;

  @ApiProperty()
  attachmentCount!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiPropertyOptional({ nullable: true })
  resolvedAt?: string | null;
}

export class ContentReportDetailDto extends ContentReportSummaryDto {
  @ApiPropertyOptional({ nullable: true })
  suggestedCorrection?: string | null;

  @ApiPropertyOptional({ nullable: true })
  userReference?: string | null;

  @ApiPropertyOptional({ nullable: true })
  appVersion?: string | null;

  @ApiPropertyOptional({ nullable: true })
  platform?: string | null;
}

export class ContentReportListQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class ContentReportListResponseDto {
  @ApiProperty({ type: [ContentReportSummaryDto] })
  items!: ContentReportSummaryDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}

export class AdminUpdateContentReportDto {
  @ApiPropertyOptional({ enum: CONTENT_REPORT_STATUSES })
  @IsOptional()
  @IsIn([...CONTENT_REPORT_STATUSES])
  status?: ContentReportStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  adminNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  resolvedAt?: string;
}

export class AdminContentReportDetailDto extends ContentReportDetailDto {
  @ApiPropertyOptional({ nullable: true })
  adminNotes?: string | null;
}
