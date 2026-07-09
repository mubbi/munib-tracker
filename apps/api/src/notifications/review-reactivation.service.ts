import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UserEntity } from "../database/entities";

/** Must stay aligned with `@munib-tracker/shared/reviews/dedupe`. */
const REVIEW_REACTIVATION_WINDOW_DAYS = 60;

function reviewReactivationWindowKey(now: Date = new Date()): string {
  const windowIndex = Math.floor(
    now.getTime() / (REVIEW_REACTIVATION_WINDOW_DAYS * 24 * 60 * 60 * 1000),
  );
  return String(windowIndex);
}

/**
 * Server-side scaffold for review-reactivation OS push dedupe.
 * Call from a future weekly worship report push job (NF-1.6 server extension).
 */
@Injectable()
export class ReviewReactivationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * Atomically reserves the current 60-day window for a user.
   * Returns true when a server push should fire for this trigger.
   */
  async maybeDeliverServerReviewReactivation(
    userId: string,
    _triggerId: string,
    _locale?: string,
  ): Promise<boolean> {
    const windowKey = reviewReactivationWindowKey();
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return false;
    if (user.reviewReactivationLastWindowKey === windowKey) return false;

    const currentKey = user.reviewReactivationLastWindowKey;
    const result = await this.usersRepository.update(
      {
        id: userId,
        reviewReactivationLastWindowKey: currentKey == null ? IsNull() : currentKey,
      },
      { reviewReactivationLastWindowKey: windowKey },
    );
    return (result.affected ?? 0) > 0;
  }
}
