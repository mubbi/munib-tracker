import { APP_NAME } from "@munib-tracker/shared/constants/branding";
import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { getRedisHealth } from "../redis/redisClient";

@ApiTags("health")
@Controller()
export class RootController {
  @Get()
  @ApiOperation({ summary: "Root liveness probe" })
  @ApiOkResponse({ description: "API is reachable" })
  getRoot() {
    return {
      status: "ok",
      service: APP_NAME,
      timestamp: new Date().toISOString(),
      redis: getRedisHealth(),
    };
  }
}
