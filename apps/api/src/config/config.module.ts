import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnvironment } from "./env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [".env.local", ".env"],
      // Tests are hermetic: a developer's `.env` (Cloudinary, QStash, OAuth,
      // Postgres…) must never switch a spec onto a real service. CI has no
      // `.env`, so this keeps local runs identical to CI.
      ignoreEnvFile: process.env.NODE_ENV === "test",
      validate: validateEnvironment,
    }),
  ],
})
export class AppConfigModule {}
