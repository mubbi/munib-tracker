import { markdownPaths, pageMarkdown } from "@/lib/llms";
import { localizedUrl } from "@/lib/seo";

/**
 * Markdown edition of a content page (llmstxt.org `.md` convention). Public
 * URLs are `/en/<page>.md`; `next.config.ts` rewrites them here. The HTML page
 * stays canonical (`Link: rel="canonical"`), so search engines index the page,
 * not this copy.
 */
export function generateStaticParams() {
  return markdownPaths().map((path) => ({ path: path.slice(1).split("/") }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pagePath = `/${path.join("/")}`;
  const body = pageMarkdown(pagePath);
  if (!body) return new Response("Not found\n", { status: 404 });
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${localizedUrl(pagePath, "en")}>; rel="canonical"`,
    },
  });
}
