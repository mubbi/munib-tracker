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
import { ReportOssContentDownloadFailureDto } from "./dto/oss-content-failure.dto";
import { OssContentFailuresService } from "./oss-content-failures.service";

@ApiTags("oss-content-failures")
@ApiBearerAuth()
@Controller("oss-content-failures")
export class OssContentFailuresController {
  constructor(private readonly ossContentFailuresService: OssContentFailuresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Report a failed on-demand open-source content download (CDN / remote JSON / fonts)",
  })
  @ApiCreatedResponse({ description: "Failure recorded" })
  report(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: ReportOssContentDownloadFailureDto,
  ): Promise<void> {
    return this.ossContentFailuresService.report(this.extractBearerToken(authorization), dto);
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }
    return authorization.slice("Bearer ".length);
  }
}
