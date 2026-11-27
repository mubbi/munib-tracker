import { buildLlmsFullTxt, LLMS_HEADERS } from "@/lib/llms";

/**
 * `/llms-full.txt`: the full text of every content page as Markdown, linked
 * from `/llms.txt`. Reads no request data, so it is prerendered at build time.
 */
export function GET() {
  return new Response(buildLlmsFullTxt(), { headers: LLMS_HEADERS });
}
