import "reflect-metadata";
import type { IncomingMessage, ServerResponse } from "node:http";
import express from "express";
import serverless from "serverless-http";
import { createApp } from "../src/create-app";
import { connectRedisIfConfigured } from "../src/redis/redisClient";

/**
 * Vercel serverless entry (project root directory: `apps/api`).
 * `vercel.json` rewrites all paths to this function.
 */
const expressApp = express();

let handler: ReturnType<typeof serverless> | undefined;
let ready: Promise<void> | undefined;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await connectRedisIfConfigured();
      const nestApp = await createApp({ express: expressApp });
      await nestApp.init();
      handler = serverless(expressApp);
    })();
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
