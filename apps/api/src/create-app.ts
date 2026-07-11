import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants/branding";
import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter, type NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AppOpenApiModule } from "./app.openapi.module";
import type { EnvironmentVariables } from "./config/env.schema";
import { parseCorsOrigins } from "./config/env.validation";
import { APP_VERSION_CORS_EXPOSED_HEADERS } from "./version/lib/app-version-response-headers";

export type CreateAppOptions = {
  /** When set, Nest mounts on this Express instance (Vercel / serverless). */
  express?: Express;
  /** Skip Swagger UI (still builds the OpenAPI document when exporting). */
  enableSwagger?: boolean;
};

/**
 * Shared Nest bootstrap for local `listen()` and the Vercel serverless entry.
 * Returns the configured app; callers either `listen()` or `init()`.
 */
export async function createApp(
  options: CreateAppOptions = {},
): Promise<INestApplication | NestExpressApplication> {
  const rootModule = process.env.EXPORT_OPENAPI === "true" ? AppOpenApiModule : AppModule;
  const enableSwagger = options.enableSwagger ?? process.env.EXPORT_OPENAPI !== "true";

  const app = options.express
    ? await NestFactory.create<NestExpressApplication>(
        rootModule,
        new ExpressAdapter(options.express),
      )
    : await NestFactory.create(rootModule);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const corsOrigins = parseCorsOrigins(configService.get("CORS_ORIGINS", { infer: true }));

  app.use(helmet());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  // Only enable credentialed CORS against an explicit allowlist. When no origins
  // are configured, `corsOrigins` is `false` (deny) so we never reflect an
  // arbitrary origin back with `credentials: true`.
  app.enableCors({
    origin: corsOrigins,
    credentials: corsOrigins !== false,
    exposedHeaders: APP_VERSION_CORS_EXPOSED_HEADERS,
  });

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${APP_NAME} API`)
    .setDescription(
      `Cloud sync, authentication, and backend services for ${APP_NAME}. ${APP_TAGLINE}`,
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  if (process.env.EXPORT_OPENAPI === "true") {
    const outputPath = resolve(process.cwd(), "../../packages/api-contract/openapi.json");
    writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
    return app;
  }

  if (enableSwagger) {
    SwaggerModule.setup("docs", app, document);
  }

  return app;
}

export function getListenPort(app: INestApplication): number {
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  return configService.get("PORT", { infer: true });
}
