import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get(HealthController);
  });

  it("returns ok status", () => {
    const response = controller.getHealth();

    expect(response.status).toBe("ok");
    expect(response.service).toBe("Munib Tracker");
    expect(response.timestamp).toBeTruthy();
  });
});
