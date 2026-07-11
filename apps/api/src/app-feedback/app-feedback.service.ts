import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import type { EnvironmentVariables } from "../config/env.schema";
import { AppFeedbackEntity } from "../database/entities";
import { configureAppFeedbackRateLimit, isAppFeedbackRateLimited } from "./app-feedback-rate-limit";
import { SubmitAppFeedbackDto } from "./dto/app-feedback.dto";

@Injectable()
export class AppFeedbackService implements OnModuleInit {
  constructor(
    @InjectRepository(AppFeedbackEntity)
    private readonly feedbackRepository: Repository<AppFeedbackEntity>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  onModuleInit(): void {
    configureAppFeedbackRateLimit({
      upstashUrl: this.configService.get("UPSTASH_REDIS_REST_URL", { infer: true }),
      upstashToken: this.configService.get("UPSTASH_REDIS_REST_TOKEN", { infer: true }),
    });
  }

  async submit(accessToken: string, dto: SubmitAppFeedbackDto): Promise<void> {
    if (!Number.isInteger(dto.rating) || dto.rating < 1 || dto.rating > 3) {
      throw new BadRequestException("Rating must be an integer between 1 and 3.");
    }

    if (!accessToken) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const user = await this.authService.getCurrentUser(accessToken);

    if (await isAppFeedbackRateLimited(user.userId)) {
      throw new HttpException(
        "Feedback rate limit exceeded. Try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const trimmedMessage =
      dto.message != null && dto.message.trim().length > 0 ? dto.message.trim() : null;

    await this.feedbackRepository.save(
      this.feedbackRepository.create({
        id: randomUUID(),
        userId: user.userId,
        deviceId: user.userId,
        rating: dto.rating,
        message: trimmedMessage,
        source: dto.source,
        triggerId: dto.triggerId ?? null,
        appVersion: dto.appVersion,
        platform: dto.platform,
        locale: dto.locale ?? null,
      }),
    );
  }
}
