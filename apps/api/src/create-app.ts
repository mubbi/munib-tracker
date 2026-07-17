import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants/branding";
import { type INestApplication, RequestMethod, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter, type NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";
import helmet from "helmet";
import { DataSource } from "typeorm";
import { AppModule } from "./app.module";
import { AppOpenApiModule } from "./app.openapi.module";
import { type EnvironmentVariables, NodeEnvironment } from "./config/env.schema";
import { parseCorsOrigins } from "./config/env.validation";
import { assertPostgresUtf8Encoding } from "./database/postgres-connection";
import { APP_VERSION_CORS_EXPOSED_HEADERS } from "./version/lib/app-version-response-headers";

export type CreateAppOptions = {
  /** When set, Nest mounts on this Express instance (Vercel / serverless). */
  express?: Express;
  /**
   * Force Swagger UI on/off. Defaults to on only for local/dev (`NODE_ENV` is
   * not `production`) and never while exporting OpenAPI.
   */
  enableSwagger?: boolean;
};

/**
 * Webpack bundles `swagger-ui-dist/absolute-path.js` with a wrong `__dirname`
 * (`apps/api/dist`), so Nest's default asset path 404s. Resolve the real package.
 */
function resolveSwaggerUiDistPath(): string {
  const requireFromCwd = createRequire(join(process.cwd(), "package.json"));
  return dirname(requireFromCwd.resolve("swagger-ui-dist/package.json"));
}

function shouldEnableSwaggerUi(
  configService: ConfigService<EnvironmentVariables, true>,
  options: CreateAppOptions,
): boolean {
  if (process.env.EXPORT_OPENAPI === "true") {
    return false;
  }
  if (options.enableSwagger !== undefined) {
    return options.enableSwagger;
  }
  return configService.get("NODE_ENV", { infer: true }) !== NodeEnvironment.Production;
}

/**
 * Shared Nest bootstrap for local `listen()` and the Vercel serverless entry.
 * Returns the configured app; callers either `listen()` or `init()`.
 */
export async function createApp(
  options: CreateAppOptions = {},
): Promise<INestApplication | NestExpressApplication> {
  const rootModule = process.env.EXPORT_OPENAPI === "true" ? AppOpenApiModule : AppModule;

  const app = options.express
    ? await NestFactory.create<NestExpressApplication>(
        rootModule,
        new ExpressAdapter(options.express),
      )
    : await NestFactory.create(rootModule);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const corsOrigins = parseCorsOrigins(configService.get("CORS_ORIGINS", { infer: true }));
  const enableSwagger = shouldEnableSwaggerUi(configService, options);

  if (process.env.EXPORT_OPENAPI !== "true") {
    try {
      const dataSource = app.get(DataSource);
      if (dataSource.options.type === "postgres") {
        await assertPostgresUtf8Encoding((sql) => dataSource.query(sql));
      }
    } catch (error) {
      // DataSource may be absent in OpenAPI-only / sqlite test boots.
      if (error instanceof Error && error.message.includes("requires UTF8")) {
        throw error;
      }
    }
  }

  // CORP default is `same-origin`, which blocks Expo web (`my.*` / :8081) from
  // embedding authenticated `/user-media/*/content` images served from the API
  // host (`api.*` / :3001). Auth still gates bytes; SameSite cookies are not
  // sent on cross-site embeds from unrelated origins.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
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

  app.setGlobalPrefix("api/v1", {
    exclude: [{ path: "/", method: RequestMethod.GET }],
  });

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

  if (process.env.EXPORT_OPENAPI === "true" || enableSwagger) {
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

    SwaggerModule.setup("docs", app, document, {
      customSwaggerUiPath: resolveSwaggerUiDistPath(),
    });
  }

  return app;
}

export function getListenPort(app: INestApplication): number {
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  return configService.get("PORT", { infer: true });
}
