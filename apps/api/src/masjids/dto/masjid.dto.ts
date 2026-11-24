import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsString, Matches } from "class-validator";

/** Geohash base-32 alphabet, precision 5 (~5 km cell). */
export const GEOHASH5_PATTERN = /^[0-9b-hjkmnp-z]{5}$/;

export class MasjidListQueryDto {
  @ApiProperty({
    example: "gcpvj",
    description:
      "Geohash precision-5 cell (~5 km). The client never sends precise coordinates; " +
      "the response covers this cell plus its 8 neighbours.",
  })
  @IsString()
  @Matches(GEOHASH5_PATTERN)
  cell!: string;
}

export class MasjidDetailParamsDto {
  @ApiProperty({ enum: ["node", "way", "relation"] })
  @IsIn(["node", "way", "relation"])
  osmType!: "node" | "way" | "relation";

  @ApiProperty({ example: "123456789", description: "OpenStreetMap element id" })
  @IsString()
  @Matches(/^[1-9]\d{0,15}$/)
  osmId!: string;
}

export class MasjidSummaryDto {
  @ApiProperty({ enum: ["node", "way", "relation"] })
  osmType!: "node" | "way" | "relation";

  @ApiProperty({ example: "123456789" })
  osmId!: string;

  @ApiPropertyOptional({ description: "OSM `name` tag (omitted when absent)" })
  name?: string;

  @ApiPropertyOptional({
    type: "object",
    additionalProperties: { type: "string" },
    description: "`name:<lang>` tags, lang → name",
  })
  names?: Record<string, string>;

  @ApiProperty()
  lat!: number;

  @ApiProperty()
  lon!: number;

  @ApiPropertyOptional({
    type: [String],
    description: "Friday `service_times` entries between 11:00 and 15:30 (HH:mm)",
  })
  jumuah?: string[];

  @ApiPropertyOptional({
    enum: ["wheelchair", "toilets", "toilets_wheelchair"],
    isArray: true,
  })
  badges?: Array<"wheelchair" | "toilets" | "toilets_wheelchair">;
}

export class MasjidListResponseDto {
  @ApiProperty({ type: [MasjidSummaryDto] })
  masjids!: MasjidSummaryDto[];

  @ApiProperty({
    type: [String],
    description: "Attribution lines the client must display (ODbL)",
  })
  attribution!: string[];

  @ApiProperty({ description: "True when upstream failed and cached data is stale or empty" })
  stale!: boolean;
}

export class MasjidAddressDto {
  @ApiPropertyOptional() housenumber?: string;
  @ApiPropertyOptional() street?: string;
  @ApiPropertyOptional() city?: string;
  @ApiPropertyOptional() postcode?: string;
  @ApiPropertyOptional() country?: string;
  @ApiPropertyOptional() full?: string;
}

export class IqamahDailyDto {
  @ApiPropertyOptional({ example: "05:30" }) fajr?: string;
  @ApiPropertyOptional() dhuhr?: string;
  @ApiPropertyOptional() asr?: string;
  @ApiPropertyOptional() maghrib?: string;
  @ApiPropertyOptional() isha?: string;
}

export class JumuahSlotDto {
  @ApiPropertyOptional({ example: "13:00" }) khutbahAt?: string;
  @ApiPropertyOptional({ example: "13:30" }) iqamahAt?: string;
}

/** Public sources always carry attribution + fetchedAt; "private" never comes from the API. */
export class TimetableSourceRefDto {
  @ApiProperty() id!: string;
  @ApiPropertyOptional() attribution?: string;
  @ApiPropertyOptional() fetchedAt?: string;
}

export class IqamahTimetableDto {
  @ApiPropertyOptional({ type: IqamahDailyDto }) daily?: IqamahDailyDto;

  @ApiPropertyOptional({
    type: "object",
    additionalProperties: { $ref: "#/components/schemas/IqamahDailyDto" },
    description: "YYYY-MM-DD → per-prayer times",
  })
  monthly?: Record<string, IqamahDailyDto>;

  @ApiPropertyOptional({ type: [JumuahSlotDto] }) jumuah?: JumuahSlotDto[];

  @ApiProperty({ type: TimetableSourceRefDto }) source!: TimetableSourceRefDto;
}

export class MasjidDetailDto extends MasjidSummaryDto {
  @ApiPropertyOptional({ type: MasjidAddressDto }) address?: MasjidAddressDto;
  @ApiPropertyOptional() website?: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() denomination?: string;

  @ApiPropertyOptional({
    type: [String],
    description: "Other `service_times` rules, verbatim (never per-prayer iqamah)",
  })
  serviceTimes?: string[];

  @ApiPropertyOptional({ description: "Raw `opening_hours` (clients show an open/closed hint)" })
  openingHours?: string;

  @ApiPropertyOptional({
    type: IqamahTimetableDto,
    description: "Public timetable from a licence-cleared source, with attribution",
  })
  timetable?: IqamahTimetableDto;

  @ApiProperty({ type: [String] })
  attribution!: string[];

  @ApiProperty()
  stale!: boolean;
}
