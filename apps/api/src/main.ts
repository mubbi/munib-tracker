import { createApp, getListenPort } from "./create-app";
import { closeRedis, connectRedisIfConfigured } from "./redis/redisClient";

async function bootstrap() {
  await connectRedisIfConfigured();
  const app = await createApp();

  if (process.env.EXPORT_OPENAPI === "true") {
    await app.close();
    await closeRedis();
    return;
  }

  await app.listen(getListenPort(app));

  const shutdown = async () => {
    await app.close();
    await closeRedis();
    process.exit(0);
  };
  process.once("SIGTERM", () => {
    void shutdown();
  });
  process.once("SIGINT", () => {
    void shutdown();
  });
}

bootstrap();
