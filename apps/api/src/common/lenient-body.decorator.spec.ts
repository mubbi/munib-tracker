import { BadRequestException, type ExecutionContext, type PipeTransform } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { IsString } from "class-validator";
import { describe, expect, it } from "vitest";
import { LenientBody } from "./lenient-body.decorator";

class SampleDto {
  @IsString()
  name!: string;
}

class SampleController {
  handle(@LenientBody() _dto: SampleDto): void {}
}

type RouteArg = {
  index: number;
  factory: (data: unknown, ctx: ExecutionContext) => unknown;
  pipes: PipeTransform[];
};

/** Reads the custom-param metadata `@LenientBody()` registered on `SampleController.handle`. */
function setup() {
  const meta = Reflect.getMetadata(ROUTE_ARGS_METADATA, SampleController, "handle") as Record<
    string,
    RouteArg
  >;
  const [arg] = Object.values(meta);
  if (!arg) throw new Error("LenientBody metadata missing");
  const extractBody = (body: unknown) =>
    arg.factory(undefined, {
      switchToHttp: () => ({ getRequest: () => ({ body }) }),
    } as unknown as ExecutionContext);
  const validate = (body: unknown) =>
    (arg.pipes[0] as PipeTransform).transform(body, { type: "custom", metatype: SampleDto });
  return { arg, extractBody, validate };
}

describe("LenientBody", () => {
  it("binds parameter 0 with exactly one validation pipe", () => {
    const { arg } = setup();
    expect(arg.index).toBe(0);
    expect(arg.pipes).toHaveLength(1);
  });

  it.each([
    [{ name: "x" }, { name: "x" }],
    [undefined, {}],
  ])("extracts body %j as %j", (body, expected) => {
    expect(setup().extractBody(body)).toEqual(expected);
  });

  it("strips unknown fields instead of rejecting them", async () => {
    const out = await setup().validate({ name: "ok", identityToken: "legacy", email: "a@b.c" });
    expect(out).toBeInstanceOf(SampleDto);
    expect(out).toEqual({ name: "ok" });
  });

  it("still validates declared fields without implicit conversion", async () => {
    await expect(setup().validate({ name: { $ne: "" } })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
