import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { memoryStorage } from "multer";
import { ContentReportsService, type UploadedAttachment } from "./content-reports.service";
import {
  ContentReportDetailDto,
  ContentReportListQueryDto,
  ContentReportListResponseDto,
  CreateContentReportDto,
} from "./dto/content-report.dto";

@ApiTags("content-reports")
@Controller("content-reports")
export class ContentReportsController {
  constructor(private readonly contentReportsService: ContentReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Submit a content issue report with optional proof attachments" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["payload"],
      properties: {
        payload: {
          type: "string",
          description: "JSON string matching CreateContentReportDto",
        },
        attachments: {
          type: "array",
          items: { type: "string", format: "binary" },
          maxItems: 3,
        },
      },
    },
  })
  @ApiCreatedResponse({ type: ContentReportDetailDto })
  @UseInterceptors(
    FilesInterceptor("attachments", 3, {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  create(
    @Headers("authorization") authorization: string | undefined,
    @Body("payload") payload: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ContentReportDetailDto> {
    const dto = this.parsePayload(payload);
    const attachments: UploadedAttachment[] = (files ?? []).map((file) => ({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    }));
    return this.contentReportsService.create(
      this.extractBearerToken(authorization),
      dto,
      attachments,
    );
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "List the current user's content reports" })
  @ApiOkResponse({ type: ContentReportListResponseDto })
  list(
    @Headers("authorization") authorization: string | undefined,
    @Query() query: ContentReportListQueryDto,
  ): Promise<ContentReportListResponseDto> {
    return this.contentReportsService.list(
      this.extractBearerToken(authorization),
      query.page,
      query.limit,
    );
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a single content report owned by the current user" })
  @ApiOkResponse({ type: ContentReportDetailDto })
  getById(
    @Headers("authorization") authorization: string | undefined,
    @Param("id") id: string,
  ): Promise<ContentReportDetailDto> {
    return this.contentReportsService.getById(this.extractBearerToken(authorization), id);
  }

  private parsePayload(payload: string): CreateContentReportDto {
    if (!payload?.trim()) {
      throw new BadRequestException("Missing report payload");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(payload);
    } catch {
      throw new BadRequestException("Invalid report payload JSON");
    }

    const dto = plainToInstance(CreateContentReportDto, parsed);
    const errors = validateSync(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    return dto;
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    return authorization.slice("Bearer ".length).trim();
  }
}
