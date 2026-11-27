import {
  CIRCLE_LIMITS,
  CIRCLE_NUDGE_KINDS,
  CIRCLE_ROLES,
  CIRCLE_SIGNAL_KINDS,
  CIRCLE_TYPES,
  type CircleNudgeKind,
  type CircleRole,
  type CircleSignalKind,
  type CircleType,
  KHATM_ASSIGNMENT_MODES,
  KHATM_PART_STATUSES,
  KHATM_STATUSES,
  KHATM_UNITS,
  type KhatmAssignmentMode,
  type KhatmPartStatus,
  type KhatmStatus,
  type KhatmUnit,
} from "@munib-tracker/shared/circles";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  Equals,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  registerDecorator,
  ValidateNested,
} from "class-validator";
import { PARENT_INVITE_MAX_TTL_HOURS } from "../circle-policy";

/** Trim user-entered text; strip control characters (never logged, but kept clean). */
const CleanText = () =>
  Transform(({ value }) =>
    typeof value === "string" ? value.replace(/\p{Cc}+/gu, " ").trim() : value,
  );

/**
 * `expiresInHours` on a `parent` invite is capped at {@link PARENT_INVITE_MAX_TTL_HOURS}
 * (the invite grants access to the children's data). Other roles keep the
 * general `@Max`; the service enforces the same rule for non-HTTP callers.
 */
const MaxParentInviteTtl = (): PropertyDecorator => (target, propertyName) =>
  registerDecorator({
    name: "maxParentInviteTtl",
    target: target.constructor,
    propertyName: String(propertyName),
    options: {
      message: `expiresInHours must not be greater than ${PARENT_INVITE_MAX_TTL_HOURS} for a parent invite`,
    },
    validator: {
      validate: (value, args) =>
        (args?.object as { role?: unknown } | undefined)?.role !== "parent" ||
        typeof value !== "number" ||
        value <= PARENT_INVITE_MAX_TTL_HOURS,
    },
  });

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const OSM_REF = /^(node|way|relation)\/\d{1,15}$/;

// ---------------------------------------------------------------------------
// Circles & members
// ---------------------------------------------------------------------------

export class CreateCircleDto {
  @ApiProperty({ enum: CIRCLE_TYPES })
  @IsIn(CIRCLE_TYPES)
  type!: CircleType;

  @ApiProperty({ maxLength: CIRCLE_LIMITS.nameMaxLength })
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.nameMaxLength)
  name!: string;

  @ApiPropertyOptional({
    maxLength: CIRCLE_LIMITS.displayNameMaxLength,
    description: "Your name inside this circle (never your account name)",
  })
  @IsOptional()
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.displayNameMaxLength)
  displayName?: string;

  @ApiPropertyOptional({
    description: "Khatm groups only: display-only OpenStreetMap ref, e.g. node/123",
    example: "node/123456",
  })
  @IsOptional()
  @Matches(OSM_REF)
  masjidOsmRef?: string;
}

export class UpdateCircleDto {
  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.nameMaxLength })
  @IsOptional()
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.nameMaxLength)
  name?: string;

  @ApiPropertyOptional({ nullable: true, description: "Khatm groups only; null clears" })
  @IsOptional()
  @Matches(OSM_REF)
  masjidOsmRef?: string | null;
}

export class UpdateMyMembershipDto {
  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.displayNameMaxLength, nullable: true })
  @IsOptional()
  @CleanText()
  @IsString()
  @MaxLength(CIRCLE_LIMITS.displayNameMaxLength)
  displayName?: string | null;

  @ApiPropertyOptional({ description: "Partner circles: pause sharing goal_done" })
  @IsOptional()
  @IsBoolean()
  paused?: boolean;

  @ApiPropertyOptional({
    description: "Family adult members only: opt in to share fard salah status with parents",
  })
  @IsOptional()
  @IsBoolean()
  shareFardStatus?: boolean;
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: ["admin", "parent", "member"] })
  @IsIn(["admin", "parent", "member"])
  role!: CircleRole;
}

export class ChildSummaryDto {
  @ApiProperty()
  nickname!: string;

  @ApiProperty()
  birthYear!: number;

  @ApiPropertyOptional({ nullable: true })
  avatar!: string | null;

  @ApiProperty({ enum: ["learning", "gentle", "graduate"] })
  ageBand!: "learning" | "gentle" | "graduate";

  @ApiProperty({
    description:
      "D34: transferred from a parent who deleted their account — a parent must re-confirm consent (POST …/children/:childId/consent); the parent view is hidden until then",
  })
  consentPending!: boolean;
}

export class CircleMemberDto {
  @ApiProperty({
    format: "uuid",
    description:
      "Opaque per-circle member id (child profiles: the child id). Never the account's user id; use it wherever an endpoint takes a memberId",
  })
  memberId!: string;

  @ApiProperty({ enum: ["user", "child"] })
  memberKind!: "user" | "child";

  @ApiProperty({ enum: CIRCLE_ROLES })
  role!: CircleRole;

  @ApiPropertyOptional({ nullable: true })
  displayName!: string | null;

  @ApiProperty({ type: String, format: "date-time" })
  joinedAt!: string;

  @ApiProperty()
  isMe!: boolean;

  @ApiProperty({ description: "Partner: sharing paused (shown as 'no signal')" })
  paused!: boolean;

  @ApiProperty({ description: "Family adult member shares fard status with parents" })
  shareFardStatus!: boolean;

  @ApiPropertyOptional({ type: ChildSummaryDto, nullable: true })
  child!: ChildSummaryDto | null;
}

export class CircleSummaryDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ enum: CIRCLE_TYPES })
  type!: CircleType;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: CIRCLE_ROLES })
  myRole!: CircleRole;

  @ApiProperty({ format: "uuid", description: "Your opaque per-circle member id" })
  myMemberId!: string;

  @ApiProperty()
  memberCount!: number;

  @ApiPropertyOptional({ nullable: true })
  masjidOsmRef!: string | null;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;
}

export class CircleDetailDto extends CircleSummaryDto {
  @ApiProperty({ type: [CircleMemberDto] })
  members!: CircleMemberDto[];
}

export class CircleListDto {
  @ApiProperty({ type: [CircleSummaryDto] })
  items!: CircleSummaryDto[];
}

// ---------------------------------------------------------------------------
// Invites
// ---------------------------------------------------------------------------

export class CreateInviteDto {
  @ApiPropertyOptional({
    enum: ["admin", "parent", "member"],
    default: "member",
    description:
      "`parent` (family) and `admin` (khatm group) invites are owner-only; a parent invite is always single-use",
  })
  @IsOptional()
  @IsIn(["admin", "parent", "member"])
  role?: CircleRole;

  @ApiPropertyOptional({ description: "Default 1 (family/partner) or 200 (khatm)" })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(CIRCLE_LIMITS.khatmGroupMaxMembers)
  maxUses?: number;

  @ApiPropertyOptional({
    default: CIRCLE_LIMITS.inviteDefaultTtlHours,
    description: `Default ${CIRCLE_LIMITS.inviteDefaultTtlHours} h (max ${CIRCLE_LIMITS.inviteMaxTtlHours}); a parent invite defaults to and is capped at ${PARENT_INVITE_MAX_TTL_HOURS} h`,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(CIRCLE_LIMITS.inviteMaxTtlHours)
  @MaxParentInviteTtl()
  expiresInHours?: number;
}

export class InviteDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ enum: CIRCLE_ROLES })
  role!: CircleRole;

  @ApiProperty()
  maxUses!: number;

  @ApiProperty()
  uses!: number;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;
}

export class InviteCreatedDto extends InviteDto {
  @ApiProperty({ description: "10-char base32 code — returned ONCE, stored only hashed" })
  code!: string;

  @ApiProperty({ example: "circle/join/ABCDEFGH23", description: "Deep-link path for QR / links" })
  joinPath!: string;
}

export class InviteListDto {
  @ApiProperty({ type: [InviteDto] })
  items!: InviteDto[];
}

export class InvitePreviewDto {
  @ApiProperty({ enum: CIRCLE_TYPES })
  circleType!: CircleType;

  @ApiProperty()
  circleName!: string;

  @ApiProperty()
  memberCount!: number;

  @ApiProperty({ enum: CIRCLE_ROLES })
  role!: CircleRole;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;

  @ApiProperty({ description: "Caller is already an active member" })
  alreadyMember!: boolean;
}

export class JoinCircleDto {
  @ApiProperty({ example: "ABCDE-FGH23" })
  @IsString()
  @MaxLength(32)
  code!: string;

  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.displayNameMaxLength })
  @IsOptional()
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.displayNameMaxLength)
  displayName?: string;
}

// ---------------------------------------------------------------------------
// Child profiles (D7)
// ---------------------------------------------------------------------------

export class ChildRewardDto {
  @ApiProperty({ maxLength: CIRCLE_LIMITS.rewardTitleMaxLength, example: "Park trip" })
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.rewardTitleMaxLength)
  title!: string;

  @ApiProperty({ description: "Days with all 5 prayers needed", example: 7 })
  @IsInt()
  @Min(1)
  @Max(CIRCLE_LIMITS.rewardMaxDays)
  days!: number;
}

export class CreateChildProfileDto {
  @ApiProperty({ maxLength: CIRCLE_LIMITS.nicknameMaxLength })
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.nicknameMaxLength)
  nickname!: string;

  @ApiProperty({ description: "Birth year only (no birth date); child must be under 13" })
  @IsInt()
  birthYear!: number;

  @ApiPropertyOptional({ description: "Bundled avatar id" })
  @IsOptional()
  @Matches(/^[a-z0-9-]{1,32}$/)
  avatar?: string;

  @ApiProperty({ description: "Parent confirms verifiable consent (must be true)" })
  @Equals(true)
  parentalConsent!: boolean;

  @ApiProperty({
    description: "Privacy policy version the parent consented to",
    example: "2026-11",
  })
  @IsString()
  @Matches(/^[A-Za-z0-9._-]{1,32}$/)
  consentPolicyVersion!: string;
}

export class UpdateChildProfileDto {
  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.nicknameMaxLength })
  @IsOptional()
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.nicknameMaxLength)
  nickname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  birthYear?: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Matches(/^[a-z0-9-]{1,32}$/)
  avatar?: string | null;

  @ApiPropertyOptional({ type: ChildRewardDto, nullable: true, description: "null clears" })
  @IsOptional()
  @ValidateNested()
  @Type(() => ChildRewardDto)
  reward?: ChildRewardDto | null;

  @ApiPropertyOptional({ description: "Allow graduation before the approximate age of 13" })
  @IsOptional()
  @IsBoolean()
  graduationUnlocked?: boolean;
}

export class ChildProfileDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ format: "uuid" })
  circleId!: string;

  @ApiProperty()
  nickname!: string;

  @ApiProperty()
  birthYear!: number;

  @ApiPropertyOptional({ nullable: true })
  avatar!: string | null;

  @ApiProperty({ enum: ["learning", "gentle", "graduate"] })
  ageBand!: "learning" | "gentle" | "graduate";

  @ApiPropertyOptional({ type: ChildRewardDto, nullable: true })
  reward!: ChildRewardDto | null;

  @ApiProperty()
  graduationUnlocked!: boolean;

  @ApiProperty({ description: "Graduation to a full account may be offered now" })
  graduationAvailable!: boolean;

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  linkedDeviceAt!: string | null;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;

  @ApiProperty({
    description:
      "D34: the consenting parent deleted their account and this profile passed to you — re-confirm consent to restore the parent view",
  })
  consentPending!: boolean;

  @ApiPropertyOptional({
    type: String,
    format: "date-time",
    nullable: true,
    description: "When consent became pending (transfer time); null when not pending",
  })
  consentTransferredAt!: string | null;

  @ApiPropertyOptional({
    type: String,
    format: "date-time",
    nullable: true,
    description: "The profile is deleted after this unless consent is re-confirmed",
  })
  consentPendingUntil!: string | null;
}

/** D34: a co-parent re-confirms parental consent for a transferred child profile. */
export class ConfirmChildConsentDto {
  @ApiProperty({ description: "Parent confirms verifiable consent (must be true)" })
  @Equals(true)
  parentalConsent!: boolean;

  @ApiProperty({
    description: "Privacy policy version the parent consented to",
    example: "2026-11",
  })
  @IsString()
  @Matches(/^[A-Za-z0-9._-]{1,32}$/)
  consentPolicyVersion!: string;
}

export class ChildDeviceLinkDto {
  @ApiProperty({ description: "One-time token for the QR code (5-min TTL)" })
  linkToken!: string;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;
}

export class RedeemChildLinkDto {
  @ApiProperty()
  @IsString()
  @Matches(/^mtl_[A-Za-z0-9_-]{16,64}$/)
  linkToken!: string;
}

export class ChildSessionDto {
  @ApiProperty({
    description:
      "Scoped child-session bearer (send as Authorization: Bearer). Write own salah status, read own signals only.",
  })
  childToken!: string;

  @ApiProperty({ type: ChildProfileDto })
  child!: ChildProfileDto;
}

export class GraduateChildDto {
  @ApiProperty({ description: "The child-session token held by the child's device" })
  @IsString()
  @Matches(/^mtc_[A-Za-z0-9_-]{16,64}$/)
  childToken!: string;

  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.displayNameMaxLength })
  @IsOptional()
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.displayNameMaxLength)
  displayName?: string;

  @ApiPropertyOptional({
    default: false,
    description: "Opt in to keep sharing fard salah status with parents",
  })
  @IsOptional()
  @IsBoolean()
  shareFardStatus?: boolean;
}

// ---------------------------------------------------------------------------
// Daily signals (closed schema per kind)
// ---------------------------------------------------------------------------

class SignalTargetDto {
  @ApiProperty({ example: "2026-11-23", description: "Member's local date" })
  @Matches(ISO_DATE)
  date!: string;

  @ApiPropertyOptional({
    format: "uuid",
    description: "Family parents writing on a child's behalf; defaults to yourself",
  })
  @IsOptional()
  @IsUUID()
  memberId?: string;
}

export class FardStatusSignalDto extends SignalTargetDto {
  @ApiProperty()
  @IsBoolean()
  fajr!: boolean;

  @ApiProperty()
  @IsBoolean()
  dhuhr!: boolean;

  @ApiProperty()
  @IsBoolean()
  asr!: boolean;

  @ApiProperty()
  @IsBoolean()
  maghrib!: boolean;

  @ApiProperty()
  @IsBoolean()
  isha!: boolean;
}

export class RestDaySignalDto extends SignalTargetDto {}

export class GoalDoneSignalDto {
  @ApiProperty({ example: "2026-11-23", description: "Your local date" })
  @Matches(ISO_DATE)
  date!: string;
}

export class SignalsQueryDto {
  @ApiProperty({ example: "2026-11-17" })
  @Matches(ISO_DATE)
  from!: string;

  @ApiProperty({ example: "2026-11-23" })
  @Matches(ISO_DATE)
  to!: string;
}

export class ClearSignalQueryDto {
  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional()
  @IsUUID()
  memberId?: string;
}

export class SignalDto {
  @ApiProperty({ format: "uuid" })
  memberId!: string;

  @ApiProperty({ example: "2026-11-23" })
  date!: string;

  @ApiProperty({ enum: CIRCLE_SIGNAL_KINDS })
  kind!: CircleSignalKind;

  @ApiProperty({
    type: "object",
    additionalProperties: { type: "boolean" },
    description: "fard_status: {fajr..isha}; rest_day: {rest}; goal_done: {done}",
  })
  value!: Record<string, boolean>;

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt!: string;
}

export class SignalListDto {
  @ApiProperty({ type: [SignalDto] })
  items!: SignalDto[];
}

// ---------------------------------------------------------------------------
// Nudges (partner)
// ---------------------------------------------------------------------------

export class CreateNudgeDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  toMemberId!: string;

  @ApiProperty({ enum: CIRCLE_NUDGE_KINDS })
  @IsIn(CIRCLE_NUDGE_KINDS)
  kind!: CircleNudgeKind;
}

export class NudgeDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ enum: CIRCLE_NUDGE_KINDS })
  kind!: CircleNudgeKind;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;
}

export class NudgeListDto {
  @ApiProperty({
    type: [NudgeDto],
    description: "Nudges received in the last 7 days — sender is never revealed",
  })
  items!: NudgeDto[];
}

// ---------------------------------------------------------------------------
// Group khatm
// ---------------------------------------------------------------------------

export class CreateKhatmDto {
  @ApiProperty({ maxLength: CIRCLE_LIMITS.khatmTitleMaxLength })
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.khatmTitleMaxLength)
  title!: string;

  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.khatmIntentionMaxLength })
  @IsOptional()
  @CleanText()
  @IsString()
  @MaxLength(CIRCLE_LIMITS.khatmIntentionMaxLength)
  intention?: string;

  @ApiPropertyOptional({ enum: KHATM_UNITS, default: "juz" })
  @IsOptional()
  @IsIn(KHATM_UNITS)
  unit?: KhatmUnit;

  @ApiPropertyOptional({ example: "2026-12-20" })
  @IsOptional()
  @Matches(ISO_DATE)
  deadline?: string;

  @ApiPropertyOptional({
    enum: KHATM_ASSIGNMENT_MODES,
    default: "self_pick",
    description:
      "round_robin deals parts in join order once the group has at least 2 members (until then parts stay open); " +
      "not-started parts are re-dealt when someone joins or via POST …/deal",
  })
  @IsOptional()
  @IsIn(KHATM_ASSIGNMENT_MODES)
  assignmentMode?: KhatmAssignmentMode;
}

export class UpdateKhatmDto {
  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.khatmTitleMaxLength })
  @IsOptional()
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.khatmTitleMaxLength)
  title?: string;

  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.khatmIntentionMaxLength, nullable: true })
  @IsOptional()
  @CleanText()
  @IsString()
  @MaxLength(CIRCLE_LIMITS.khatmIntentionMaxLength)
  intention?: string | null;

  @ApiPropertyOptional({ nullable: true, description: "Extend / change; null removes" })
  @IsOptional()
  @Matches(ISO_DATE)
  deadline?: string | null;

  @ApiPropertyOptional({
    description: "After the deadline: return every unfinished claimed part to the pool",
  })
  @IsOptional()
  @IsBoolean()
  openRemainingParts?: boolean;
}

export class AssignKhatmPartDto {
  @ApiPropertyOptional({
    format: "uuid",
    nullable: true,
    description: "null returns it to the pool",
  })
  @IsOptional()
  @IsUUID()
  memberId?: string | null;
}

export class KhatmPartDto {
  @ApiProperty()
  partNo!: number;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  assigneeMemberId!: string | null;

  @ApiProperty({ enum: KHATM_PART_STATUSES })
  status!: KhatmPartStatus;

  @ApiProperty({
    description:
      "Assigned by round-robin dealing (re-dealt when members join); false for a member's own claim, a manager's assignment, or any non-assigned part",
  })
  dealt!: boolean;

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt!: string;

  @ApiProperty({ description: "Claimed but idle past max(2, remaining/3) days — reassignable" })
  stale!: boolean;
}

export class KhatmDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ format: "uuid" })
  circleId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  intention!: string | null;

  @ApiProperty({ enum: KHATM_UNITS })
  unit!: KhatmUnit;

  @ApiProperty()
  partCount!: number;

  @ApiProperty({ enum: KHATM_ASSIGNMENT_MODES })
  assignmentMode!: KhatmAssignmentMode;

  @ApiPropertyOptional({ nullable: true, example: "2026-12-20" })
  deadline!: string | null;

  @ApiProperty()
  deadlinePassed!: boolean;

  @ApiProperty()
  round!: number;

  @ApiProperty({ enum: KHATM_STATUSES })
  status!: KhatmStatus;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  createdBy!: string | null;

  @ApiProperty()
  doneCount!: number;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;

  @ApiPropertyOptional({ type: String, format: "date-time", nullable: true })
  completedAt!: string | null;
}

export class KhatmDetailDto extends KhatmDto {
  @ApiProperty({ type: [KhatmPartDto] })
  parts!: KhatmPartDto[];
}

export class KhatmListDto {
  @ApiProperty({ type: [KhatmDto] })
  items!: KhatmDto[];
}
