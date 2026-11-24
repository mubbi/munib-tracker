import { describe, expect, it } from "vitest";
import {
  canInviteRole,
  canReadSignals,
  canWriteSignal,
  type PolicyMember,
  pickSuccessor,
} from "./circle-policy";
import {
  generateChildSessionToken,
  generateInviteCode,
  hashInviteCode,
  isChildSessionToken,
} from "./circle-tokens";

const member = (overrides: Partial<PolicyMember> & { memberId: string }): PolicyMember => ({
  memberKind: "user",
  role: "member",
  shareScope: {},
  ...overrides,
});

const parent = member({ memberId: "p", role: "owner" });
const coParent = member({ memberId: "q", role: "parent" });
const child = member({ memberId: "c", memberKind: "child", role: "child" });
const sibling = member({ memberId: "s", memberKind: "child", role: "child" });
const teen = member({ memberId: "t", role: "member" });
const sharingTeen = member({
  memberId: "u",
  role: "member",
  shareScope: { shareFardStatus: true },
});

describe("family signal policy (D7: parents see fard status only)", () => {
  it("lets a child and its parents write fard_status, not a sibling", () => {
    expect(canWriteSignal("family", "fard_status", child, child)).toBe(true);
    expect(canWriteSignal("family", "fard_status", parent, child)).toBe(true);
    expect(canWriteSignal("family", "fard_status", coParent, child)).toBe(true);
    expect(canWriteSignal("family", "fard_status", sibling, child)).toBe(false);
    expect(canWriteSignal("family", "fard_status", teen, child)).toBe(false);
  });

  it("never shares a parent's own salah, and adult members only after opting in", () => {
    expect(canWriteSignal("family", "fard_status", parent, parent)).toBe(false);
    expect(canWriteSignal("family", "fard_status", teen, teen)).toBe(false);
    expect(canWriteSignal("family", "fard_status", sharingTeen, sharingTeen)).toBe(true);
  });

  it("restricts rest days to parents marking children", () => {
    expect(canWriteSignal("family", "rest_day", parent, child)).toBe(true);
    expect(canWriteSignal("family", "rest_day", child, child)).toBe(false);
    expect(canWriteSignal("family", "rest_day", parent, teen)).toBe(false);
  });

  it("rejects kinds that don't belong to the circle type", () => {
    expect(canWriteSignal("family", "goal_done", parent, parent)).toBe(false);
    expect(canWriteSignal("khatm_group", "goal_done", parent, parent)).toBe(false);
  });

  it("lets parents read children and opted-in members; children read only themselves", () => {
    expect(canReadSignals("family", parent, child)).toBe(true);
    expect(canReadSignals("family", parent, teen)).toBe(false);
    expect(canReadSignals("family", parent, sharingTeen)).toBe(true);
    expect(canReadSignals("family", child, child)).toBe(true);
    expect(canReadSignals("family", child, sibling)).toBe(false);
    expect(canReadSignals("family", child, parent)).toBe(false);
    expect(canReadSignals("family", teen, child)).toBe(false);
  });
});

describe("partner signal policy", () => {
  const me = member({ memberId: "a" });
  const paused = member({ memberId: "b", shareScope: { paused: true } });

  it("only writes your own goal_done while not paused", () => {
    expect(canWriteSignal("partner", "goal_done", me, me)).toBe(true);
    expect(canWriteSignal("partner", "goal_done", me, paused)).toBe(false);
    expect(canWriteSignal("partner", "goal_done", paused, paused)).toBe(false);
  });

  it("hides paused members' signals from others", () => {
    expect(canReadSignals("partner", me, paused)).toBe(false);
    expect(canReadSignals("partner", paused, me)).toBe(true);
  });
});

describe("invite roles", () => {
  it("follows the per-type invitable roles and manager roles", () => {
    expect(canInviteRole("family", "owner", "parent")).toBe(true);
    // Parent invites expose the children's data: owner-only, not co-parents.
    expect(canInviteRole("family", "parent", "parent")).toBe(false);
    expect(canInviteRole("family", "parent", "member")).toBe(true);
    expect(canInviteRole("family", "member", "member")).toBe(false);
    expect(canInviteRole("family", "owner", "admin")).toBe(false);
    expect(canInviteRole("partner", "member", "member")).toBe(true);
    expect(canInviteRole("khatm_group", "admin", "member")).toBe(true);
    expect(canInviteRole("khatm_group", "admin", "admin")).toBe(false);
    expect(canInviteRole("khatm_group", "owner", "admin")).toBe(true);
    expect(canInviteRole("khatm_group", "member", "member")).toBe(false);
  });
});

describe("ownership succession", () => {
  const at = (minutes: number) => new Date(Date.UTC(2026, 0, 1, 0, minutes));

  it("passes a family only to another parent", () => {
    expect(
      pickSuccessor("family", [
        { ...teen, joinedAt: at(1) },
        { ...coParent, joinedAt: at(2) },
      ])?.memberId,
    ).toBe("q");
    expect(pickSuccessor("family", [{ ...teen, joinedAt: at(1) }])).toBeNull();
  });

  it("prefers khatm admins, else the oldest member", () => {
    const admin = member({ memberId: "x", role: "admin" });
    expect(
      pickSuccessor("khatm_group", [
        { ...teen, joinedAt: at(1) },
        { ...admin, joinedAt: at(5) },
      ])?.memberId,
    ).toBe("x");
    expect(
      pickSuccessor("partner", [
        { ...member({ memberId: "late" }), joinedAt: at(9) },
        { ...member({ memberId: "early" }), joinedAt: at(1) },
      ])?.memberId,
    ).toBe("early");
  });
});

describe("circle tokens", () => {
  it("generates 10-char base32 invite codes and hashes them case-insensitively", () => {
    const code = generateInviteCode();
    expect(code).toMatch(/^[A-Z2-7]{10}$/);
    expect(hashInviteCode(code.toLowerCase())).toBe(hashInviteCode(code));
    expect(hashInviteCode(code)).not.toContain(code);
  });

  it("marks child-session bearers with their own prefix", () => {
    expect(isChildSessionToken(generateChildSessionToken())).toBe(true);
    expect(isChildSessionToken("eyJhbGciOi")).toBe(false);
  });
});
