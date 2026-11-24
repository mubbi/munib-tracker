import { NextResponse } from "next/server";

/**
 * The studio's API routes write to disk. Any web page open in the same browser
 * could otherwise POST a "simple" (text/plain) request to localhost:3010 and
 * overwrite the project file or drop files into exports/ / public/. Requiring
 * JSON forces a CORS preflight (which this server never grants), and
 * `Sec-Fetch-Site` rejects cross-site requests from modern browsers outright.
 * Returns a 403/415 response to send, or `null` when the request may proceed.
 */
export function rejectCrossSiteWrite(req: Request): NextResponse | null {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return NextResponse.json({ ok: false, error: "Cross-site request" }, { status: 403 });
  }
  const contentType = req.headers.get("content-type") ?? "";
  if (!/^application\/json\b/i.test(contentType.trim())) {
    return NextResponse.json(
      { ok: false, error: "Content-Type must be application/json" },
      { status: 415 },
    );
  }
  return null;
}
