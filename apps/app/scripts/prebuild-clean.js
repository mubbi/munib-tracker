#!/usr/bin/env node
/**
 * Guardrail: bare `expo prebuild --clean` skips .env load and version sync.
 * Use platform orchestrators instead.
 */
console.error(
  "\nprebuild:clean runs bare Expo prebuild and skips Munib Tracker release wiring.\n\n" +
    "  Android (env + version sync):\n" +
    "    pnpm cleanbuild:app:android\n\n" +
    "  iOS (env + version sync + pod install after --clean):\n" +
    "    pnpm cleanbuild:app:ios\n\n" +
    "  Apple TV / Android TV (EXPO_TV=1):\n" +
    "    pnpm prebuild:app:tv\n\n" +
    "  Both platforms without orchestration (not recommended):\n" +
    "    cd apps/app && pnpm exec expo prebuild --clean\n",
);
process.exit(1);
