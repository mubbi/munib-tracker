import { StreamableFile, UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import { buildMulterFile, buildUpload } from "../test-support/uploads";
import { inlineContentDisposition, UserMediaController } from "./user-media.controller";
import type { UserMediaService } from "./user-media.service";

function setup() {
  const service = {
    upload: vi.fn().mockResolvedValue([{ id: "m1" }]),
    getMeta: vi.fn().mockResolvedValue({ id: "m1" }),
    getContent: vi.fn().mockResolvedValue({
      buffer: Buffer.from("bytes"),
      mimeType: "image/png",
      filename: "a.png",
    }),
    remove: vi.fn().mockResolvedValue(undefined),
  };
  const controller = new UserMediaController(service as unknown as UserMediaService);
  return { service, controller, req: buildRequest() };
}

describe("inlineContentDisposition", () => {
  it.each([
    ["plain ASCII", "photo.png", `inline; filename="photo.png"; filename*=UTF-8''photo.png`],
    [
      "non-ASCII, quotes and RFC 5987 reserved characters",
      `دعا "x"\\(1)*'.pdf`,
      `inline; filename="___ _x__(1)*'.pdf"; filename*=UTF-8''%D8%AF%D8%B9%D8%A7%20%22x%22%5C%281%29%2A%27.pdf`,
    ],
  ])("encodes %s", (_label, filename, expected) => {
    expect(inlineContentDisposition(filename)).toBe(expected);
  });
});

describe("UserMediaController", () => {
  it("unwraps Multer files for the service", async () => {
    const { service, controller, req } = setup();
    await controller.upload(TEST_BEARER, req, [buildMulterFile()]);
    expect(service.upload).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, [buildUpload()]);
  });

  it("wraps uploaded items in a list response", async () => {
    const { controller, req } = setup();
    await expect(controller.upload(TEST_BEARER, req, [buildMulterFile()])).resolves.toEqual({
      items: [{ id: "m1" }],
    });
  });

  it("uploads an empty list when no files are attached", async () => {
    const { service, controller, req } = setup();
    await controller.upload(TEST_BEARER, req);
    expect(service.upload).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, []);
  });

  it("requires credentials", async () => {
    const { controller, req } = setup();
    await expect(controller.upload(undefined, req)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("returns metadata", async () => {
    const { service, controller, req } = setup();
    await expect(controller.getMeta(TEST_BEARER, req, "m1")).resolves.toEqual({ id: "m1" });
    expect(service.getMeta).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, "m1");
  });

  it("streams content with its type and an inline disposition", async () => {
    const { controller, req } = setup();
    const file = await controller.getContent(TEST_BEARER, req, "m1");
    expect(file).toBeInstanceOf(StreamableFile);
    expect(file.getHeaders()).toMatchObject({
      type: "image/png",
      disposition: inlineContentDisposition("a.png"),
    });
  });

  it("deletes media", async () => {
    const { service, controller, req } = setup();
    await expect(controller.remove(TEST_BEARER, req, "m1")).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, "m1");
  });
});
