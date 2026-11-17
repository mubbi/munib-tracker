import { createParamDecorator, type ExecutionContext, ValidationPipe } from "@nestjs/common";

/**
 * Validates the request body against the parameter's DTO class, but **strips**
 * unknown properties instead of rejecting them.
 *
 * The global `ValidationPipe` uses `forbidNonWhitelisted: true`, so a stray field
 * is a 400. A few auth routes must tolerate fields older app builds send
 * (`identityToken`, `email`): Nest's global pipes skip custom param decorators
 * (`validateCustomDecorators` is false there), and this decorator's own pipe
 * validates the declared fields and drops the rest.
 *
 * The parameter type must be a value import (not `import type`) so
 * `emitDecoratorMetadata` records the DTO class. Pair it with `@ApiBody({ type })`
 * for the OpenAPI contract, since Swagger only infers `@Body()` parameters.
 */
const RequestBody = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): unknown =>
    ctx.switchToHttp().getRequest<{ body?: unknown }>().body ?? {},
);

const LENIENT_BODY_PIPE = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: false,
  transform: true,
  // JSON bodies already carry real types; implicit conversion would turn
  // `{ "$ne": "" }` into the string "[object Object]" and let it past @IsString.
  transformOptions: { enableImplicitConversion: false },
  validateCustomDecorators: true,
});

export function LenientBody(): ParameterDecorator {
  return RequestBody(LENIENT_BODY_PIPE);
}
