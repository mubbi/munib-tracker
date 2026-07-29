import { APP_NAME } from "@munib-tracker/shared/constants/branding";
import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { getRedisHealth } from "../redis/redisClient";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Liveness and readiness probe" })
  @ApiOkResponse({ description: "API is healthy" })
  getHealth() {
    return {
      status: "ok",
      service: APP_NAME,
      timestamp: new Date().toISOString(),
      redis: getRedisHealth(),
    };
  }
}
