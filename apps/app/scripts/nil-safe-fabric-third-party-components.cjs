#!/usr/bin/env node
/**
 * Rewrite RCTThirdPartyComponentsProvider.mm so NSClassFromString nils are
 * skipped instead of crashing NSDictionary literals.
 *
 * Needed on tvOS (and other partial-link targets): codegen still lists Fabric
 * components for packages that CocoaPods did not link (no :tvos / excluded).
 *
 * Usage:
 *   node scripts/nil-safe-fabric-third-party-components.cjs [path-to.mm]
 * Default path: ios/build/generated/ios/ReactCodegen/RCTThirdPartyComponentsProvider.mm
 */
const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_REL = path.join(
  "ios",
  "build",
  "generated",
  "ios",
  "ReactCodegen",
  "RCTThirdPartyComponentsProvider.mm",
);

function transform(source) {
  if (source.includes("Nil-safe Fabric components (Munib Tracker TV)")) {
    return source;
  }

  const entryRe = /^\s*@"([^"]+)":\s*NSClassFromString\(@"([^"]+)"\)(?:,)?\s*(?:\/\/[^\n]*)?$/gm;
  const entries = [];
  let match = entryRe.exec(source);
  while (match) {
    entries.push({ name: match[1], className: match[2] });
    match = entryRe.exec(source);
  }
  if (!entries.length) {
    return source;
  }

  const addLines = entries
    .map(
      ({ name, className }) =>
        `\t\t{\n\t\t\tClass cls = NSClassFromString(@"${className}");\n\t\t\tif (cls != nil) {\n\t\t\t\tcomponents[@"${name}"] = cls;\n\t\t\t}\n\t\t}`,
    )
    .join("\n");

  const replacement = `// Nil-safe Fabric components (Munib Tracker TV) — skip unlinked Classes
    NSMutableDictionary<NSString *, Class<RCTComponentViewProtocol>> *components =
        [NSMutableDictionary new];
${addLines}
    thirdPartyComponents = [components copy];`;

  const blockRe = /thirdPartyComponents\s*=\s*@\{[\s\S]*?\};\s*(?=\n\s*\}\);)/;
  if (!blockRe.test(source)) {
    throw new Error("nil-safe-fabric: could not find thirdPartyComponents = @{ ... }; block");
  }
  return source.replace(blockRe, `${replacement}\n  `);
}

function main() {
  const appRoot = path.resolve(__dirname, "..");
  const target = path.resolve(process.argv[2] || path.join(appRoot, DEFAULT_REL));
  if (!fs.existsSync(target)) {
    console.warn(`nil-safe-fabric: skip (missing ${target})`);
    process.exit(0);
  }
  const before = fs.readFileSync(target, "utf8");
  const after = transform(before);
  if (after === before) {
    console.log(`nil-safe-fabric: already patched ${target}`);
    return;
  }
  fs.writeFileSync(target, after);
  console.log(`nil-safe-fabric: patched ${target}`);
}

main();
