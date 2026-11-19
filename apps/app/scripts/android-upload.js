#!/usr/bin/env node
/**
 * Upload a signed Play Store AAB to the internal testing track.
 *
 * Requires: android-keys/play-console-service-account.json
 * Default AAB: android/play-upload/app-release.aab from pnpm release:app:android
 * TV AAB:      android/play-upload/tv/app-release.aab from pnpm release:app:android-tv
 * Wear AAB:    android/play-upload/wear/wear-release.aab from pnpm release:app:wear
 *
 * Usage:
 *   pnpm android:upload:release
 *   pnpm android:upload:release:tv
 *   node scripts/android-upload.js --aab path/to.aab
 *   node scripts/android-upload.js --tv
 *   node scripts/android-upload.js --wear   # Play Wear OS form-factor track (wear:internal)
 */
const fs = require("node:fs");
const path = require("node:path");
const { google } = require("googleapis");
const { loadAppEnv, assertVersionEnv } = require("./lib/release-app-env.cjs");
const {
  ANDROID_VERSION_CODE_ENV_KEY,
  resolvePlatformVersion,
  resolveAndroidVersionCode,
} = require("./lib/platform-versions.cjs");

const projectRoot = path.resolve(__dirname, "..");
const packageName = "app.munibtracker";
const isTv = process.argv.includes("--tv");
const isWear = process.argv.includes("--wear");
const defaultAabPath = path.join(
  projectRoot,
  "android",
  "play-upload",
  ...(isTv ? ["tv"] : isWear ? ["wear"] : []),
  isWear ? "wear-release.aab" : "app-release.aab",
);
const defaultServiceAccountPath = path.join(
  projectRoot,
  "android-keys",
  "play-console-service-account.json",
);

const ANDROID_PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
/** Play form-factor tracks are prefixed (e.g. "wear:internal"); phone and TV share "internal". */
const TRACK = isWear ? "wear:internal" : "internal";
/** Build command suffix for messages (pnpm release:app:<command>). */
const releaseCommand = isTv ? "android-tv" : isWear ? "wear" : "android";

function buildReleaseNotes(versionName) {
  const tvExtra = isTv
    ? `\n• Android TV / Fire TV — 10-foot focus UI, Leanback launcher\n`
    : isWear
      ? `\n• Wear OS tiles: next Salah (tap to mark) and a Tasbeeh counter\n`
      : `\n• Home screen widgets: next prayer, schedule, and progress\n`;
  return (
    `Munib Tracker ${versionName} — Track Your Journey Back to Allah\n` +
    `\n` +
    `Features:\n` +
    `• Track salah, streaks, and your honest calendar\n` +
    `• Plan and clear qaza at a steady pace\n` +
    `• Adhkar, tasbeeh, duas, Qur'an, and hadith — offline\n` +
    `• Prayer times, qibla, and optional adhan reminders` +
    tvExtra +
    `• 24 languages including Arabic, Urdu (RTL), and Hindi\n` +
    `• Private by default — no ads, optional sync & backup`
  );
}

function parseAabArg() {
  const idx = process.argv.indexOf("--aab");
  if (idx >= 0 && process.argv[idx + 1]) {
    return process.argv[idx + 1].trim();
  }
  return null;
}

function resolveAabPath(explicit) {
  const aabPath = path.resolve(explicit || defaultAabPath);
  if (!fs.existsSync(aabPath)) {
    console.error(
      `\nMissing AAB: ${aabPath}\n` +
        `  Build first: pnpm release:app:${releaseCommand}\n` +
        "  Or pass: node scripts/android-upload.js --aab /path/to.aab\n",
    );
    process.exit(1);
  }
  return aabPath;
}

function resolveServiceAccountPath() {
  const fromEnv = process.env.PLAY_CONSOLE_SERVICE_ACCOUNT_PATH?.trim();
  const serviceAccountPath = path.resolve(fromEnv || defaultServiceAccountPath);
  if (!fs.existsSync(serviceAccountPath)) {
    console.error(
      `\nMissing Play Console service account JSON:\n  ${serviceAccountPath}\n\n` +
        "  Place play-console-service-account.json in apps/app/android-keys/\n" +
        "  (Play Console → Users and permissions → Invite user → Service account)\n" +
        "  Or set PLAY_CONSOLE_SERVICE_ACCOUNT_PATH.\n\n" +
        "  Grant the account permission to release to the internal testing track.\n",
    );
    process.exit(1);
  }
  return serviceAccountPath;
}

async function main() {
  const envLoad = loadAppEnv(projectRoot);
  if (!envLoad.loaded) {
    console.error(
      "\nMissing apps/app/.env — need Android version env vars.\n" +
        (isTv
          ? "  EXPO_ANDROID_TV_APP_VERSION / EXPO_ANDROID_VERSION_CODE\n"
          : "  EXPO_ANDROID_APP_VERSION / EXPO_ANDROID_VERSION_CODE\n") +
        "  Copy apps/app/.env.example → apps/app/.env\n",
    );
    process.exit(1);
  }
  assertVersionEnv({ tv: isTv });

  const androidPlatform = isTv ? "android-tv" : isWear ? "wear" : "android";
  const versionName = resolvePlatformVersion(androidPlatform, projectRoot);
  process.env.MUNIB_REQUIRE_VERSION_CODES = "1";
  const expectedVersionCode = resolveAndroidVersionCode(androidPlatform);
  const versionCodeEnvKey = ANDROID_VERSION_CODE_ENV_KEY;
  const releaseName = `${versionName} (${expectedVersionCode})${isTv ? " TV" : isWear ? " Wear OS" : ""}`;
  const releaseNotes = buildReleaseNotes(versionName);

  const aabPath = resolveAabPath(parseAabArg());
  const serviceAccountPath = resolveServiceAccountPath();

  console.log(
    `\n--- Play Console upload (${TRACK})${isTv ? " — Android TV AAB" : isWear ? " — Wear OS AAB" : ""} ---`,
  );
  console.log(`  Package        → ${packageName}`);
  console.log(`  Track          → ${TRACK}`);
  console.log(`  Release name   → ${releaseName}`);
  console.log(`  AAB            → ${aabPath}`);
  console.log(`  Service account→ ${serviceAccountPath}\n`);
  if (isWear) {
    console.log(
      "  Note: same package as phone. Enable Wear OS in Play Console → Advanced settings → Form factors.\n",
    );
  }
  if (isTv) {
    console.log(
      "  Note: same package as phone. Enable Android TV in Play Console form factors.\n" +
        "  Fire TV listing uses Amazon console + APK (pnpm release:app:android-tv:apk), not this upload.\n",
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: [ANDROID_PUBLISHER_SCOPE],
  });
  const androidpublisher = google.androidpublisher({
    version: "v3",
    auth,
  });

  const editRes = await androidpublisher.edits.insert({ packageName });
  const editId = editRes.data.id;
  if (!editId) {
    console.error("Play API did not return an edit id.");
    process.exit(1);
  }

  console.log(`Created edit ${editId}. Uploading AAB…`);

  let bundleRes;
  try {
    bundleRes = await androidpublisher.edits.bundles.upload(
      {
        packageName,
        editId,
        media: {
          mimeType: "application/octet-stream",
          body: fs.createReadStream(aabPath),
        },
      },
      {
        // Large AABs need a long timeout; default often aborts mid-upload.
        timeout: 10 * 60 * 1000,
      },
    );
  } catch (err) {
    try {
      await androidpublisher.edits.delete({ packageName, editId });
    } catch {
      // ignore cleanup errors
    }
    throw err;
  }

  const uploadedVersionCode = Number(bundleRes.data.versionCode);
  if (!Number.isFinite(uploadedVersionCode) || uploadedVersionCode < 1) {
    console.error("Play API did not return a versionCode for the uploaded AAB.");
    process.exit(1);
  }

  if (uploadedVersionCode !== expectedVersionCode) {
    console.error(
      `\nAAB versionCode (${uploadedVersionCode}) does not match ${versionCodeEnvKey} (${expectedVersionCode}).\n` +
        `  Rebuild with pnpm release:app:${releaseCommand} after updating apps/app/.env, then upload again.\n`,
    );
    try {
      await androidpublisher.edits.delete({ packageName, editId });
    } catch {
      // ignore
    }
    process.exit(1);
  }

  console.log(`Uploaded versionCode ${uploadedVersionCode}. Assigning to ${TRACK}…`);

  await androidpublisher.edits.tracks.update({
    packageName,
    editId,
    track: TRACK,
    requestBody: {
      track: TRACK,
      releases: [
        {
          name: releaseName,
          versionCodes: [String(uploadedVersionCode)],
          status: "completed",
          releaseNotes: [
            {
              language: "en-US",
              text: releaseNotes,
            },
          ],
        },
      ],
    },
  });

  await androidpublisher.edits.commit({ packageName, editId });

  console.log(
    `\nUpload committed to ${TRACK} testing.\n` +
      `  Release: ${releaseName}\n` +
      `  Play Console → ${packageName} → Testing → Internal testing\n` +
      `  Processing can take a few minutes before testers see the build.\n`,
  );
}

main().catch((err) => {
  const apiMessage = err?.response?.data?.error?.message || err?.message || String(err);
  console.error(`\nPlay Console upload failed:\n  ${apiMessage}\n`);
  if (err?.response?.data) {
    console.error(JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
});
