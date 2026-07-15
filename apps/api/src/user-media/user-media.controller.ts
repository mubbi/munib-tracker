import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
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
    @Param("id") id: string,
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
    @Param("id") id: string,
  ): Promise<StreamableFile> {
    const { buffer, mimeType, filename } = await this.userMediaService.getContent(
      resolveAccessToken(req, authorization),
      id,
    );
    return new StreamableFile(buffer, {
      type: mimeType,
      disposition: `inline; filename="${filename.replace(/"/g, "")}"`,
    });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a media item owned by the current user" })
  async remove(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Param("id") id: string,
  ): Promise<void> {
    await this.userMediaService.remove(resolveAccessToken(req, authorization), id);
  }
}
