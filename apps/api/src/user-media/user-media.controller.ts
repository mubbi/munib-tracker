import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  StreamableFile,
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
import type { Request } from "express";
import { memoryStorage } from "multer";
import { resolveAccessToken } from "../auth/resolve-access-token";
import { UserMediaDto, UserMediaListResponseDto } from "./dto/user-media.dto";
import {
  type UploadedUserMedia,
  USER_MEDIA_MAX_BYTES_LIMIT,
  USER_MEDIA_MAX_FILES,
  UserMediaService,
} from "./user-media.service";

/**
 * `Content-Disposition` for a user-supplied filename. Header values must be
 * latin1 — a raw Arabic/Urdu name makes Node throw (500) — so send an ASCII
 * fallback plus the RFC 5987 `filename*` form for the real name.
 */
export function inlineContentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  const encoded = encodeURIComponent(filename).replace(
    /['()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `inline; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

@ApiTags("user-media")
@Controller("user-media")
export class UserMediaController {
  constructor(private readonly userMediaService: UserMediaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Upload private images/PDFs for custom adhkar (linked accounts only)",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { type: "string", format: "binary" },
          maxItems: USER_MEDIA_MAX_FILES,
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UserMediaListResponseDto })
  @UseInterceptors(
    FilesInterceptor("files", USER_MEDIA_MAX_FILES, {
      storage: memoryStorage(),
      limits: { fileSize: USER_MEDIA_MAX_BYTES_LIMIT },
    }),
  )
  async upload(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UserMediaListResponseDto> {
    const uploaded: UploadedUserMedia[] = (files ?? []).map((file) => ({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    }));
    const items = await this.userMediaService.upload(
      resolveAccessToken(req, authorization),
      uploaded,
    );
    return { items };
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get metadata for a media item owned by the current user" })
  @ApiOkResponse({ type: UserMediaDto })
  getMeta(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<UserMediaDto> {
    return this.userMediaService.getMeta(resolveAccessToken(req, authorization), id);
  }

  @Get(":id/content")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Download image bytes for a media item owned by the current user",
  })
  async getContent(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const { buffer, mimeType, filename } = await this.userMediaService.getContent(
      resolveAccessToken(req, authorization),
      id,
    );
    return new StreamableFile(buffer, {
      type: mimeType,
      disposition: inlineContentDisposition(filename),
    });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a media item owned by the current user" })
  async remove(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.userMediaService.remove(resolveAccessToken(req, authorization), id);
  }
}
