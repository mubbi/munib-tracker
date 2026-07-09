import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Dev-only sink for the in-browser exporter: each rendered PNG is POSTed here
// and written under exports/, so bulk exports never accumulate in tab memory
// and the flow can run unattended (no download prompts).
const EXPORT_DIR = path.join(process.cwd(), "exports");
const SAFE_PATH = /^[A-Za-z0-9][A-Za-z0-9_\-./]*\.png$/;

export async function POST(req: Request) {
  let body: { path?: string; dataUrl?: string };
  try {
    body = (await req.json()) as { path?: string; dataUrl?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const rel = body?.path || "";
  if (!SAFE_PATH.test(rel) || rel.includes("..")) {
    return NextResponse.json({ ok: false, error: "Bad path" }, { status: 400 });
  }
  const m = /^data:image\/png;base64,(.+)$/.exec(body?.dataUrl || "");
  if (!m) {
    return NextResponse.json({ ok: false, error: "Expected PNG data URL" }, { status: 400 });
  }
  const bytes = Buffer.from(m[1], "base64");
  const abs = path.resolve(EXPORT_DIR, rel);
  if (!abs.startsWith(EXPORT_DIR + path.sep)) {
    return NextResponse.json({ ok: false, error: "Bad path" }, { status: 400 });
  }
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, bytes);
  return NextResponse.json({ ok: true, path: rel });
}
