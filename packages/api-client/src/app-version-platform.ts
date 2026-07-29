export type AppPlatform = "web" | "ios" | "android";

export function normalizeAppPlatform(platform: string | undefined): AppPlatform {
  if (!platform) return "web";
  const p = platform.trim().toLowerCase();
  if (p === "ios" || p === "iphone" || p === "ipad") return "ios";
  if (p === "android") return "android";
  return "web";
}
