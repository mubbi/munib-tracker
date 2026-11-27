import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { ChildProfileEntity } from "../database/entities";
import { ChildProfilesService } from "./child-profiles.service";
import { CircleAccessService } from "./circle-access.service";
import { CircleActorService, CircleAuthGuard } from "./circle-auth";
import {
  CircleChildrenController,
  CircleChildSessionController,
} from "./circle-children.controller";
import { CircleEventsService } from "./circle-events.service";
import { CircleNearbyHostController, CircleNearbyJoinController } from "./circle-nearby.controller";
import { CircleNearbyService } from "./circle-nearby.service";
import { CIRCLE_PUSH_PROVIDERS, CirclePushService } from "./circle-push.service";
import { CircleRetentionService } from "./circle-retention.service";
import { CircleSignalsController } from "./circle-signals.controller";
import { CircleSignalsService } from "./circle-signals.service";
import { CirclesController } from "./circles.controller";
import { CirclesService } from "./circles.service";
import { FamilyDigestService } from "./family-digest.service";
import { GroupKhatmController } from "./group-khatm.controller";
import { GroupKhatmService } from "./group-khatm.service";

/** Every circles controller (also mounted by the OpenAPI export module). */
export const CIRCLE_CONTROLLERS = [
  CirclesController,
  CircleChildrenController,
  CircleChildSessionController,
  CircleSignalsController,
  GroupKhatmController,
  CircleNearbyHostController,
  CircleNearbyJoinController,
];

/** Circles backend for NF-3.16 family, NF-3.17 partner, NF-3.18 group khatm (D1). */
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ChildProfileEntity])],
  controllers: CIRCLE_CONTROLLERS,
  providers: [
    CircleActorService,
    CircleAuthGuard,
    CircleAccessService,
    CircleEventsService,
    CirclePushService,
    ...CIRCLE_PUSH_PROVIDERS,
    CirclesService,
    ChildProfilesService,
    CircleSignalsService,
    GroupKhatmService,
    FamilyDigestService,
    CircleRetentionService,
    CircleNearbyService,
  ],
  // D40: the surface-push cron also ticks the weekly family digest, and (A4)
  // the circles retention sweep so deletions never wait for circle traffic.
  exports: [FamilyDigestService, CircleRetentionService],
})
export class CirclesModule {}
