import "reflect-metadata";
import type { IncomingMessage, ServerResponse } from "node:http";
import express from "express";
import serverless from "serverless-http";
import { createApp } from "./create-app";
import { connectRedisIfConfigured } from "./redis/redisClient";

/**
 * Webpack entry for Vercel (`dist/vercel-handler.js`).
 * Workspace packages are bundled here so Node never loads `.ts` package exports.
 */
const expressApp = express();

let handler: ReturnType<typeof serverless> | undefined;
let ready: Promise<void> | undefined;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      // Redis is optional — never block Nest/TypeORM boot on it. A hanging
      // REDIS_URL used to stall every cold start until Vercel's 300s timeout.
      void connectRedisIfConfigured();
      console.log("[vercel-handler] creating Nest app");
      const nestApp = await createApp({ express: expressApp });
      console.log("[vercel-handler] Nest create done; init()");
      await nestApp.init();
      handler = serverless(expressApp);
      console.log("[vercel-handler] ready");
    })().catch((err) => {
      ready = undefined;
      handler = undefined;
      throw err;
    });
  }
  return ready;
}

export default async function vercelHandler(req: IncomingMessage, res: ServerResponse) {
  await ensureReady();
  if (!handler) {
    throw new Error("Serverless handler failed to initialize");
  }
  return handler(req, res);
}
