#!/usr/bin/env node

/**
 * Sync official NestJS documentation markdown from GitHub.
 * Uses a temp directory outside the monorepo git tree.
 */

import { execSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const skillDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = resolve(skillDir, "docs");
const repoUrl = "https://github.com/nestjs/docs.nestjs.com.git";
const branch = "master";

function run(command, cwd) {
  execSync(command, { stdio: "inherit", cwd });
}

function listMarkdownFiles(directory, prefix = "") {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath, relativePath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "SOURCE.md") {
      files.push(relativePath.replace(/\\/g, "/"));
    }
  }

  return files.sort();
}

const upstreamDir = mkdtempSync(join(tmpdir(), "nestjs-docs-"));

try {
  run(`git clone --depth 1 --branch ${branch} --filter=blob:none --sparse ${repoUrl} .`, upstreamDir);
  run("git sparse-checkout set content", upstreamDir);
  run("git checkout", upstreamDir);

  const contentDir = resolve(upstreamDir, "content");
  if (!statSync(contentDir).isDirectory()) {
    throw new Error(`Expected content directory at ${contentDir}`);
  }

  const commit = execSync("git rev-parse HEAD", {
    cwd: upstreamDir,
    encoding: "utf8",
  }).trim();

  rmSync(docsDir, { recursive: true, force: true });
  cpSync(contentDir, docsDir, { recursive: true });

  const syncedAt = new Date().toISOString();
  const files = listMarkdownFiles(docsDir);

  writeFileSync(
    resolve(docsDir, "SOURCE.md"),
    `# NestJS official docs mirror

- **Upstream:** [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com)
- **Branch:** \`${branch}\`
- **Commit:** \`${commit}\`
- **Synced at:** \`${syncedAt}\`
- **Files:** ${files.length} markdown guides

Re-sync with:

\`\`\`bash
node .agents/skills/nestjs/scripts/sync-docs.js
\`\`\`
`,
  );

  writeFileSync(
    resolve(skillDir, "docs-index.md"),
    `# NestJS docs index

Official markdown guides mirrored from [nestjs/docs.nestjs.com/content](https://github.com/nestjs/docs.nestjs.com/tree/master/content).

**Commit:** \`${commit}\` · **Synced:** \`${syncedAt}\` · **${files.length} files**

## All files

${files.map((file) => `- \`docs/${file}\``).join("\n")}
`,
  );

  console.log(`Synced ${files.length} NestJS docs from ${commit}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  rmSync(upstreamDir, { recursive: true, force: true });
}
