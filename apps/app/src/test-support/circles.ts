/**
 * Shared factories for circles (NF-3.16–3.18) tests — API response shapes from
 * `lib/circles/api.ts`. Override any field per test.
 */
import type {
  ChildProfile,
  CircleDetail,
  CircleMember,
  CircleSignal,
  KhatmDetail,
  KhatmPart,
  Nudge,
} from "@/lib/circles/api";

export function makeCircleMember(overrides: Partial<CircleMember> = {}): CircleMember {
  return {
    memberId: "m-me",
    memberKind: "user",
    role: "member",
    displayName: "Aisha",
    joinedAt: "2026-11-01T10:00:00.000Z",
    isMe: false,
    paused: false,
    shareFardStatus: false,
    child: null,
    ...overrides,
  };
}

export function makeCircleDetail(overrides: Partial<CircleDetail> = {}): CircleDetail {
  const members = overrides.members ?? [
    makeCircleMember({ memberId: "m-me", isMe: true, role: "owner", displayName: "Me" }),
    makeCircleMember({
      memberId: "m-2",
      displayName: "Bilal Ahmed",
      joinedAt: "2026-11-02T10:00:00.000Z",
    }),
  ];
  return {
    id: "c-1",
    type: "partner",
    name: "Circle",
    myRole: "owner",
    myMemberId: "m-me",
    memberCount: members.length,
    masjidOsmRef: null,
    createdAt: "2026-11-01T10:00:00.000Z",
    ...overrides,
    members,
  };
}

export function makeGoalDoneSignal(memberId: string, date: string): CircleSignal {
  return {
    memberId,
    date,
    kind: "goal_done",
    value: { done: true },
    updatedAt: `${date}T12:00:00.000Z`,
  };
}

export function makeNudge(overrides: Partial<Nudge> = {}): Nudge {
  return { id: "n-1", kind: "dua", createdAt: "2026-11-24T08:00:00.000Z", ...overrides };
}

export function makeKhatmPart(partNo: number, overrides: Partial<KhatmPart> = {}): KhatmPart {
  return {
    partNo,
    assigneeMemberId: null,
    status: "open",
    dealt: false,
    updatedAt: "2026-11-20T10:00:00.000Z",
    stale: false,
    ...overrides,
  };
}

export function makeKhatmDetail(overrides: Partial<KhatmDetail> = {}): KhatmDetail {
  const partCount = overrides.partCount ?? 30;
  const parts =
    overrides.parts ?? Array.from({ length: partCount }, (_, i) => makeKhatmPart(i + 1));
  return {
    id: "k-1",
    circleId: "c-k",
    title: "Ramadan khatm",
    intention: null,
    unit: "juz",
    partCount,
    assignmentMode: "self_pick",
    deadline: null,
    deadlinePassed: false,
    round: 1,
    status: "active",
    createdBy: "m-me",
    doneCount: parts.filter((p) => p.status === "done").length,
    createdAt: "2026-11-01T10:00:00.000Z",
    completedAt: null,
    ...overrides,
    parts,
  };
}

// ---------------------------------------------------------------------------
// NF-3.16 family & kids
// ---------------------------------------------------------------------------

export function makeChildProfile(overrides: Partial<ChildProfile> = {}): ChildProfile {
  return {
    id: "child-1",
    circleId: "c-fam",
    nickname: "Ali",
    birthYear: 2018,
    avatar: null,
    ageBand: "gentle",
    reward: null,
    graduationUnlocked: false,
    graduationAvailable: false,
    linkedDeviceAt: null,
    createdAt: "2026-11-01T10:00:00.000Z",
    ...overrides,
  };
}

export function makeFardSignal(
  memberId: string,
  date: string,
  value: Partial<Record<"fajr" | "dhuhr" | "asr" | "maghrib" | "isha", boolean>> = {},
): CircleSignal {
  return {
    memberId,
    date,
    kind: "fard_status",
    value: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, ...value },
    updatedAt: `${date}T20:00:00.000Z`,
  };
}

export const ALL_FIVE = { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true } as const;

export function makeRestDaySignal(memberId: string, date: string): CircleSignal {
  return {
    memberId,
    date,
    kind: "rest_day",
    value: { rest: true },
    updatedAt: `${date}T08:00:00.000Z`,
  };
}
