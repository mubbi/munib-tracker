import "reflect-metadata";
import type { IncomingMessage, ServerResponse } from "node:http";
import express from "express";
import { createApp } from "./create-app";
import { connectRedisIfConfigured } from "./redis/redisClient";

/**
 * Webpack entry for Vercel (`dist/vercel-handler.js`).
 * Workspace packages are bundled here so Node never loads `.ts` package exports.
 *
 * Vercel Node functions receive Node `(req, res)` — pass them straight to Express.
 * Do **not** wrap with `serverless-http` (AWS Lambda provider): it returns an API
 * Gateway object and never writes to `res`, which hangs until the function timeout.
 */
const expressApp = express();

let ready: Promise<void> | undefined;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      // Redis is optional — never block Nest/TypeORM boot on it.
      void connectRedisIfConfigured();
      console.log("[vercel-handler] creating Nest app");
      const nestApp = await createApp({ express: expressApp });
      console.log("[vercel-handler] Nest create done; init()");
      await nestApp.init();
      console.log("[vercel-handler] ready");
    })().catch((err) => {
      ready = undefined;
      throw err;
    });
  }
  return ready;
}

export default async function vercelHandler(req: IncomingMessage, res: ServerResponse) {
  await ensureReady();
  expressApp(req, res);
}
