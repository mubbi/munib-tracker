import {
  APP_FEEDBACK_MAX_RATING,
  APP_FEEDBACK_MIN_RATING,
  APP_FEEDBACK_TRIGGER_IDS,
} from "@munib-tracker/shared/reviews/triggers.js";
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

const TRIGGER_VALUES = Object.values(APP_FEEDBACK_TRIGGER_IDS);

export class SubmitAppFeedbackDto {
  @IsInt()
  @Min(APP_FEEDBACK_MIN_RATING)
  @Max(APP_FEEDBACK_MAX_RATING)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsString()
  @MaxLength(64)
  source!: string;

  @IsOptional()
  @IsIn(TRIGGER_VALUES)
  triggerId?: string;

  @IsString()
  @MaxLength(32)
  appVersion!: string;

  @IsIn(["ios", "android", "web"])
  platform!: "ios" | "android" | "web";

  @IsOptional()
  @IsString()
  @MaxLength(16)
  locale?: string;
}
