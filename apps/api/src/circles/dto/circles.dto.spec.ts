import { CIRCLE_LIMITS } from "@munib-tracker/shared/circles";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { PARENT_INVITE_MAX_TTL_HOURS } from "../circle-policy";
import { CreateInviteDto } from "./circles.dto";

function constraintsFor(body: Record<string, unknown>) {
  return validateSync(plainToInstance(CreateInviteDto, body)).flatMap((error) =>
    Object.keys(error.constraints ?? {}),
  );
}

describe("CreateInviteDto expiry", () => {
  it.each([
    ["a parent invite at the cap", { role: "parent", expiresInHours: PARENT_INVITE_MAX_TTL_HOURS }],
    ["a parent invite with the default expiry", { role: "parent" }],
    ["a member invite up to the general cap", { expiresInHours: CIRCLE_LIMITS.inviteMaxTtlHours }],
  ])("accepts %s", (_label, body) => {
    expect(constraintsFor(body)).toEqual([]);
  });

  it("rejects a parent invite that outlives the short parent cap", () => {
    expect(
      constraintsFor({ role: "parent", expiresInHours: PARENT_INVITE_MAX_TTL_HOURS + 1 }),
    ).toEqual(["maxParentInviteTtl"]);
  });

  it("keeps the general cap for every role", () => {
    expect(
      constraintsFor({ role: "member", expiresInHours: CIRCLE_LIMITS.inviteMaxTtlHours + 1 }),
    ).toEqual(["max"]);
  });
});
