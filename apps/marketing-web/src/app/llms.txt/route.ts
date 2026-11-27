import { buildLlmsTxt, LLMS_HEADERS } from "@/lib/llms";

/**
 * `/llms.txt` (https://llmstxt.org): a Markdown index of the site for AI
 * assistants. Reads no request data, so it is prerendered at build time.
 */
export function GET() {
  return new Response(buildLlmsTxt(), { headers: LLMS_HEADERS });
}
