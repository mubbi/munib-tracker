import { createApp, getListenPort } from "./create-app";

async function bootstrap() {
  const app = await createApp();

  if (process.env.EXPORT_OPENAPI === "true") {
    await app.close();
    return;
  }

  await app.listen(getListenPort(app));
}

bootstrap();
