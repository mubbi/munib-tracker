import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppVersionEntity } from "../database/entities";
import { AppVersionController } from "./app-version.controller";
import { AppVersionHeadersMiddleware } from "./app-version.middleware";
import { AppVersionService } from "./app-version.service";

@Module({
  imports: [TypeOrmModule.forFeature([AppVersionEntity])],
  controllers: [AppVersionController],
  providers: [AppVersionService, AppVersionHeadersMiddleware],
  exports: [AppVersionService],
})
export class VersionModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppVersionHeadersMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
