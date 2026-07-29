import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { RootController } from "./root.controller";

describe("RootController", () => {
  let controller: RootController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
    }).compile();

    controller = module.get(RootController);
  });

  it("returns ok status", () => {
    const response = controller.getRoot();

    expect(response.status).toBe("ok");
    expect(response.service).toBe("Munib Tracker");
    expect(response.timestamp).toBeTruthy();
    expect(response.redis).toMatchObject({
      configured: false,
      connected: false,
    });
  });
});
