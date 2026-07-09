import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

const TRIGGER_VALUES = [
  "perfect_day",
  "achievement_unlock",
  "weekly_report",
  "streak_milestone",
  "qaza_cleared",
  "manual",
] as const;

export class SubmitAppFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(3)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsString()
  @MaxLength(64)
  source!: string;

  @IsOptional()
  @IsIn(TRIGGER_VALUES as unknown as string[])
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
