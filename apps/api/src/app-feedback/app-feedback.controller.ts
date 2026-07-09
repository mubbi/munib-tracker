import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppFeedbackService } from "./app-feedback.service";
import { SubmitAppFeedbackDto } from "./dto/app-feedback.dto";

@ApiTags("app-feedback")
@ApiBearerAuth()
@Controller("app-feedback")
export class AppFeedbackController {
  constructor(private readonly appFeedbackService: AppFeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Submit low-star in-app review feedback (1–3 stars)" })
  @ApiCreatedResponse({ description: "Feedback accepted" })
  submit(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: SubmitAppFeedbackDto,
  ): Promise<void> {
    return this.appFeedbackService.submit(this.extractBearerToken(authorization), dto);
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }
    return authorization.slice("Bearer ".length);
  }
}
