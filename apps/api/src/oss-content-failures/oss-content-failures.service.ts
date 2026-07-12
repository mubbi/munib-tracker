import { randomUUID } from "node:crypto";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { OssContentDownloadFailureEntity } from "../database/entities";
import { ReportOssContentDownloadFailureDto } from "./dto/oss-content-failure.dto";
import { isOssContentFailureRateLimited } from "./oss-content-failure-rate-limit";

@Injectable()
export class OssContentFailuresService {
  constructor(
    @InjectRepository(OssContentDownloadFailureEntity)
    private readonly failuresRepository: Repository<OssContentDownloadFailureEntity>,
    private readonly authService: AuthService,
  ) {}

  async report(accessToken: string, dto: ReportOssContentDownloadFailureDto): Promise<void> {
    if (!accessToken) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const user = await this.authService.getCurrentUser(accessToken);

    if (await isOssContentFailureRateLimited(user.userId)) {
      throw new HttpException(
        "OSS content failure rate limit exceeded. Try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const trimmedMessage = dto.errorMessage.trim();
    const meta =
      dto.contentMeta && typeof dto.contentMeta === "object" && !Array.isArray(dto.contentMeta)
        ? dto.contentMeta
        : {};

    await this.failuresRepository.save(
      this.failuresRepository.create({
        id: randomUUID(),
        userId: user.userId,
        contentKind: dto.contentKind,
        contentKey: dto.contentKey.trim().slice(0, 256),
        sourceProvider: dto.sourceProvider.trim().slice(0, 128),
        sourceUrl: dto.sourceUrl.trim().slice(0, 2048),
        contentMeta: meta as Record<string, unknown>,
        errorCode: dto.errorCode,
        errorMessage: trimmedMessage.slice(0, 2000) || dto.errorCode,
        httpStatus: dto.httpStatus ?? null,
        appVersion: dto.appVersion,
        platform: dto.platform,
        locale: dto.locale?.trim() || null,
        translationLocale: dto.translationLocale?.trim() || null,
      }),
    );
  }
}
