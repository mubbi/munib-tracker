#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const appRoot = path.join(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(appRoot, ".env"));
loadEnvFile(path.join(appRoot, ".env.local"));

const required = ["APP_VERSION", "ANDROID_VERSION_CODE", "IOS_BUILD_NUMBER"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required version environment variables: ${missing.join(", ")}`);
  console.error("Copy apps/app/.env.example to apps/app/.env and set values.");
  process.exit(1);
}

const androidVersionCode = Number.parseInt(process.env.ANDROID_VERSION_CODE, 10);

if (!Number.isFinite(androidVersionCode) || androidVersionCode < 1) {
  console.error("ANDROID_VERSION_CODE must be a positive integer.");
  process.exit(1);
}

if (!/^\d+$/.test(process.env.IOS_BUILD_NUMBER)) {
  console.error("IOS_BUILD_NUMBER must be a positive integer string.");
  process.exit(1);
}

console.log(
  `Build versions: APP_VERSION=${process.env.APP_VERSION} ANDROID_VERSION_CODE=${process.env.ANDROID_VERSION_CODE} IOS_BUILD_NUMBER=${process.env.IOS_BUILD_NUMBER}`,
);
