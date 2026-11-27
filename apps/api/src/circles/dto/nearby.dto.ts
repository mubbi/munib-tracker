import {
  CIRCLE_LIMITS,
  CIRCLE_TYPES,
  type CircleRole,
  type CircleType,
} from "@munib-tracker/shared/circles";
import {
  NEARBY_JOINER_STATUSES,
  NEARBY_PURPOSES,
  NEARBY_REQUEST_STATUSES,
  type NearbyJoinerStatus,
  type NearbyPurpose,
  type NearbyRequestStatus,
} from "@munib-tracker/shared/circles/nearby";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from "class-validator";
import { ChildProfileDto } from "./circles.dto";

/**
 * NF-3.25 nearby join (D41–D44). Host endpoints live under
 * `/circles/:circleId/nearby-sessions`; joiner endpoints under `/nearby-sessions`.
 */

const CleanText = () =>
  Transform(({ value }) =>
    typeof value === "string" ? value.replace(/\p{Cc}+/gu, " ").trim() : value,
  );

export class CreateNearbySessionDto {
  @ApiPropertyOptional({
    enum: ["parent", "member"],
    default: "member",
    description:
      "Role granted on accept (same rules as invites: a family `parent` session is owner-only and single-use). Ignored with `childId`.",
  })
  @IsOptional()
  @IsIn(["parent", "member"])
  role?: Extract<CircleRole, "parent" | "member">;

  @ApiPropertyOptional({
    format: "uuid",
    description: "Link this child profile's device instead (family parents only, single-use)",
  })
  @IsOptional()
  @IsUUID()
  childId?: string;
}

export class NearbySessionDto {
  @ApiProperty({ description: "8-byte opaque id (16 hex chars) the host advertises over BLE" })
  sessionId!: string;

  @ApiProperty({ description: "128-bit BLE service UUID to advertise (app prefix + sessionId)" })
  serviceUuid!: string;

  @ApiProperty({ description: "4 digits both screens show (D44)", example: "0472" })
  matchCode!: string;

  @ApiProperty({ enum: NEARBY_PURPOSES })
  purpose!: NearbyPurpose;

  @ApiProperty({ enum: ["parent", "member", "child"] })
  role!: CircleRole;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;
}

export class NearbyRequestDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Name the joiner chose (may be empty)",
  })
  displayName!: string | null;

  @ApiProperty({
    enum: ["account", "guest", "device"],
    description: "`device` = a child's device (no account)",
  })
  requester!: "account" | "guest" | "device";

  @ApiProperty({ enum: NEARBY_REQUEST_STATUSES })
  status!: NearbyRequestStatus;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: string;
}

export class NearbyRequestListDto {
  @ApiProperty({ type: [NearbyRequestDto] })
  items!: NearbyRequestDto[];

  @ApiProperty({ description: "False once the session expired, ended or was used up" })
  active!: boolean;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;
}

export class NearbySessionPreviewDto {
  @ApiProperty({ enum: CIRCLE_TYPES })
  circleType!: CircleType;

  @ApiProperty()
  circleName!: string;

  @ApiProperty()
  memberCount!: number;

  @ApiProperty({ description: "Compare with the host's screen before asking (D44)" })
  matchCode!: string;

  @ApiProperty({ enum: NEARBY_PURPOSES })
  purpose!: NearbyPurpose;

  @ApiProperty({ description: "Asking needs a linked account (family / partner)" })
  needsAccount!: boolean;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;
}

export class CreateNearbyRequestDto {
  @ApiProperty({ example: "0472", description: "The 4 digits the joiner confirmed" })
  @IsString()
  @Matches(/^[0-9]{4}$/)
  matchCode!: string;

  @ApiPropertyOptional({ maxLength: CIRCLE_LIMITS.displayNameMaxLength })
  @IsOptional()
  @CleanText()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CIRCLE_LIMITS.displayNameMaxLength)
  displayName?: string;
}

export class NearbyRequestCreatedDto {
  @ApiProperty({ format: "uuid" })
  requestId!: string;

  @ApiProperty({ description: "One-time secret (`mtn_…`) for polling; returned once" })
  requestToken!: string;

  @ApiProperty({ enum: NEARBY_REQUEST_STATUSES })
  status!: NearbyRequestStatus;

  @ApiProperty({ type: String, format: "date-time" })
  expiresAt!: string;
}

export class NearbyRequestTokenDto {
  @ApiProperty()
  @IsString()
  @Matches(/^mtn_[A-Za-z0-9_-]{16,64}$/)
  requestToken!: string;
}

export class NearbyRequestStatusDto {
  @ApiProperty({ enum: NEARBY_JOINER_STATUSES })
  status!: NearbyJoinerStatus;

  @ApiProperty({ enum: CIRCLE_TYPES })
  circleType!: CircleType;

  @ApiProperty({
    type: String,
    nullable: true,
    format: "uuid",
    description: "Set once a member request is accepted",
  })
  circleId!: string | null;

  @ApiPropertyOptional({
    description:
      "Child-device link only: the scoped child-session bearer (`mtc_…`), returned exactly once",
  })
  childToken?: string;

  @ApiPropertyOptional({ type: ChildProfileDto })
  child?: ChildProfileDto;
}
