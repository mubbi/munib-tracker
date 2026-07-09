import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { AppVersionService, normalizePlatform } from "./app-version.service";
import {
  APP_VERSION_REQUEST_HEADERS,
  setAppVersionResponseHeaders,
} from "./lib/app-version-response-headers";

/**
 * When the client sends X-App-Version and X-App-Platform, attach version meta to
 * every /api/v1 response so clients can detect updates without GET /version/meta.
 */
@Injectable()
export class AppVersionHeadersMiddleware implements NestMiddleware {
  constructor(private readonly appVersionService: AppVersionService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const clientVersion = req.headers[APP_VERSION_REQUEST_HEADERS.version] as string | undefined;

    if (!clientVersion?.trim()) {
      next();
      return;
    }

    try {
      const platformRaw = req.headers[APP_VERSION_REQUEST_HEADERS.platform] as string | undefined;
      const platform = normalizePlatform(platformRaw);
      const meta = await this.appVersionService.getAppVersionMeta(platform, clientVersion.trim());
      setAppVersionResponseHeaders(res, meta);
    } catch {
      // Don't block requests if version check fails (e.g. DB down)
    }

    next();
  }
}
