import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";

/** Error class name only — never the message, which may carry user values (e.g. a DB key). */
export function errorClassName(exception: unknown): string {
  if (exception instanceof Error) return exception.constructor?.name || exception.name || "Error";
  return typeof exception;
}

/**
 * The matched route **template** (`/api/v1/circles/:circleId`), never the raw
 * URL, so ids, codes and query strings stay out of logs.
 */
export function routeTemplate(req: Pick<Request, "route" | "method">): string {
  const path = (req.route as { path?: unknown } | undefined)?.path;
  return typeof path === "string" ? path : "(unmatched route)";
}

/**
 * Global exception filter (data-integrity review, D46 follow-up). Nest's
 * default handler logs an unknown error's message and stack, which can include
 * request or user values (a database driver message quoting a unique key, a
 * payload fragment). This filter logs only the error class, the HTTP method, the
 * route template and the status — and answers unknown errors with a generic 500.
 * `HttpException`s keep their normal response body and are not logged unless
 * they are 5xx.
 */
@Catch()
export class SafeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("Exceptions");

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== "http") throw exception;
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= 500) {
      this.logger.error(
        `${errorClassName(exception)} ${req.method} ${routeTemplate(req)} ${status}`,
      );
    }
    if (res.headersSent) return;

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      res
        .status(status)
        .json(typeof body === "string" ? { statusCode: status, message: body } : body);
      return;
    }
    res.status(status).json({ statusCode: status, message: "Internal server error" });
  }
}
