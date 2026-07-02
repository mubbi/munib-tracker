import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

const SERVICE_NAME = "Munib Tracker";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Liveness and readiness probe" })
  @ApiOkResponse({ description: "API is healthy" })
  getHealth() {
    return {
      status: "ok",
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
