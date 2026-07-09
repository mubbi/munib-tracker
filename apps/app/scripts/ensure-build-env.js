#!/usr/bin/env node

const path = require("node:path");
const {
  loadAppEnv,
  assertVersionEnv,
  logReleaseVersionSummary,
} = require("./lib/release-app-env.cjs");

const appRoot = path.join(__dirname, "..");

loadAppEnv(appRoot);
assertVersionEnv();
logReleaseVersionSummary(appRoot);
