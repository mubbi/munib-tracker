import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { resolveAccessToken } from "../auth/resolve-access-token";
import { AppFeedbackService } from "./app-feedback.service";
import { SubmitAppFeedbackDto } from "./dto/app-feedback.dto";

@ApiTags("app-feedback")
@ApiBearerAuth()
@Controller("app-feedback")
export class AppFeedbackController {
  constructor(private readonly appFeedbackService: AppFeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Submit user-initiated app feedback (1–5 star rating + optional message)",
  })
  @ApiCreatedResponse({ description: "Feedback accepted" })
  submit(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Body() dto: SubmitAppFeedbackDto,
  ): Promise<void> {
    return this.appFeedbackService.submit(resolveAccessToken(req, authorization), dto);
  }
}
