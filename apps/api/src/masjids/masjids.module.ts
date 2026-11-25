import { Module } from "@nestjs/common";
import { GeoapifyClient } from "./geoapify.client";
import { MasjidsController } from "./masjids.controller";
import { MasjidsService } from "./masjids.service";
import { OverpassClient } from "./overpass.client";
import { TIMETABLE_SOURCES, TIMETABLE_SOURCES_TOKEN } from "./timetable-source";

/**
 * NF-3.11 read-only OpenStreetMap masjid proxy (Geoapify when keyed, Overpass
 * fallback). No database tables, no user data.
 */
@Module({
  controllers: [MasjidsController],
  providers: [
    MasjidsService,
    OverpassClient,
    GeoapifyClient,
    { provide: TIMETABLE_SOURCES_TOKEN, useValue: TIMETABLE_SOURCES },
  ],
})
export class MasjidsModule {}
