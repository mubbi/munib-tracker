import { Module } from "@nestjs/common";
import { MasjidsController } from "./masjids.controller";
import { MasjidsService } from "./masjids.service";
import { OverpassClient } from "./overpass.client";
import { TIMETABLE_SOURCES, TIMETABLE_SOURCES_TOKEN } from "./timetable-source";

/** NF-3.11 read-only OpenStreetMap masjid proxy. No database tables, no user data. */
@Module({
  controllers: [MasjidsController],
  providers: [
    MasjidsService,
    OverpassClient,
    { provide: TIMETABLE_SOURCES_TOKEN, useValue: TIMETABLE_SOURCES },
  ],
})
export class MasjidsModule {}
