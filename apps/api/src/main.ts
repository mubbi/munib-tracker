import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants/branding";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AppOpenApiModule } from "./app.openapi.module";
import type { EnvironmentVariables } from "./config/env.schema";
import { parseCorsOrigins } from "./config/env.validation";

async function bootstrap() {
  const rootModule = process.env.EXPORT_OPENAPI === "true" ? AppOpenApiModule : AppModule;
  const app = await NestFactory.create(rootModule);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const port = configService.get("PORT", { infer: true });
  const corsOrigins = parseCorsOrigins(configService.get("CORS_ORIGINS", { infer: true }));

  app.use(helmet());
  // Only enable credentialed CORS against an explicit allowlist. When no origins
  // are configured, `corsOrigins` is `false` (deny) so we never reflect an
  // arbitrary origin back with `credentials: true`.
  app.enableCors({
    origin: corsOrigins,
    credentials: corsOrigins !== false,
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
    await app.close();
    return;
  }

  SwaggerModule.setup("docs", app, document);

  await app.listen(port);
}

bootstrap();
