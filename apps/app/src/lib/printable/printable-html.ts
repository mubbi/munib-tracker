/**
 * Self-contained, print-ready HTML for user documents (NF-3.9 wasiyyah, NF-3.8
 * debts statement). One renderer so both exports look and behave the same:
 * printed via the browser on web, shared as a file on native (see
 * `lib/printable/export-document.ts`).
 *
 * Everything user-entered is escaped here. The page uses fixed ink colours on
 * white on purpose — it is a paper document, not themed app chrome.
 */

export interface PrintableParagraph {
  /** Text in the document language. */
  text: string;
  /** English alongside (side-by-side mode), when different. */
  en?: string;
  /** Arabic scripture rendered from the dataset (RTL, larger). */
  arabic?: boolean;
  /** Muted helper text (notes, evidence). */
  muted?: boolean;
}

export interface PrintableTable {
  head: string[];
  rows: string[][];
}

export interface PrintableSection {
  heading: string;
  headingEn?: string;
  paragraphs?: PrintableParagraph[];
  table?: PrintableTable;
  /** Labels for signature lines (name / signature / date). */
  signatures?: string[];
}

export interface PrintableDocument {
  lang: string;
  dir: "ltr" | "rtl";
  title: string;
  titleEn?: string;
  subtitle?: string;
  sections: PrintableSection[];
  disclaimer: PrintableParagraph;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STYLE = `
*{box-sizing:border-box}
body{font-family:-apple-system,"Segoe UI",Roboto,"Noto Sans","Noto Naskh Arabic",sans-serif;color:#111;background:#fff;margin:0;padding:32px;line-height:1.55;font-size:14px}
h1{font-size:24px;margin:0 0 4px}
h2{font-size:16px;margin:24px 0 8px;border-bottom:1px solid #999;padding-bottom:4px}
.subtitle,.muted{color:#555}
.en{color:#444;font-style:italic;direction:ltr;text-align:left}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.arabic{font-size:22px;direction:rtl;text-align:right;font-family:"Amiri","Noto Naskh Arabic","Scheherazade New",serif;line-height:2}
table{width:100%;border-collapse:collapse;margin:8px 0}
th,td{border:1px solid #bbb;padding:6px 8px;text-align:start;vertical-align:top}
th{background:#f2f2f2}
.sig{display:flex;flex-wrap:wrap;gap:24px;margin-top:16px}
.sig div{flex:1 1 200px;border-top:1px solid #333;padding-top:4px;margin-top:36px;font-size:12px;color:#333}
.disclaimer{margin-top:32px;border:1px solid #333;padding:12px;font-size:12px}
@page{size:A4;margin:16mm}
@media print{body{padding:0}h2{break-after:avoid}tr,table,.sig,.disclaimer,.pair{break-inside:avoid}}
`;

function paragraph(p: PrintableParagraph): string {
  const cls = p.arabic ? "arabic" : p.muted ? "muted" : "";
  const main = `<p${cls ? ` class="${cls}"` : ""}${p.arabic ? ' lang="ar"' : ""}>${escapeHtml(p.text)}</p>`;
  if (!p.en || p.en === p.text) return main;
  return `<div class="pair">${main}<p class="en" lang="en">${escapeHtml(p.en)}</p></div>`;
}

function heading(tag: "h1" | "h2", text: string, en?: string): string {
  const main = escapeHtml(text);
  return en && en !== text
    ? `<${tag}>${main} <span class="en">/ ${escapeHtml(en)}</span></${tag}>`
    : `<${tag}>${main}</${tag}>`;
}

function table(t: PrintableTable): string {
  const head = t.head.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const rows = t.rows
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function renderPrintableHtml(doc: PrintableDocument): string {
  const body = doc.sections
    .map((s) =>
      [
        heading("h2", s.heading, s.headingEn),
        ...(s.paragraphs ?? []).map(paragraph),
        s.table?.rows.length ? table(s.table) : "",
        s.signatures?.length
          ? `<div class="sig">${s.signatures.map((l) => `<div>${escapeHtml(l)}</div>`).join("")}</div>`
          : "",
      ].join("\n"),
    )
    .join("\n");
  return `<!doctype html>
<html lang="${escapeHtml(doc.lang)}" dir="${doc.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(doc.title)}</title>
<style>${STYLE}</style>
</head>
<body>
${heading("h1", doc.title, doc.titleEn)}
${doc.subtitle ? `<p class="subtitle">${escapeHtml(doc.subtitle)}</p>` : ""}
${body}
<div class="disclaimer">${paragraph(doc.disclaimer)}</div>
</body>
</html>`;
}
