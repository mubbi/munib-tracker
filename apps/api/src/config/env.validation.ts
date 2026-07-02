import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvironmentVariables } from "./env.schema";

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}

export function parseCorsOrigins(origins?: string): string[] | boolean {
  if (!origins || origins.trim() === "") {
    return true;
  }

  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
