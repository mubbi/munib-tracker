import { randomUUID } from "node:crypto";
import {
  APP_FEEDBACK_MAX_RATING,
  APP_FEEDBACK_MIN_RATING,
} from "@munib-tracker/shared/reviews/triggers.js";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { AppFeedbackEntity } from "../database/entities";
import { isAppFeedbackRateLimited } from "./app-feedback-rate-limit";
import { SubmitAppFeedbackDto } from "./dto/app-feedback.dto";

@Injectable()
export class AppFeedbackService {
  constructor(
    @InjectRepository(AppFeedbackEntity)
    private readonly feedbackRepository: Repository<AppFeedbackEntity>,
    private readonly authService: AuthService,
  ) {}

  async submit(accessToken: string, dto: SubmitAppFeedbackDto): Promise<void> {
    if (
      !Number.isInteger(dto.rating) ||
      dto.rating < APP_FEEDBACK_MIN_RATING ||
      dto.rating > APP_FEEDBACK_MAX_RATING
    ) {
      throw new BadRequestException(
        `Rating must be an integer between ${APP_FEEDBACK_MIN_RATING} and ${APP_FEEDBACK_MAX_RATING}.`,
      );
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
