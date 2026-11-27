# iOS signing (`ios-keys/`)

Signing and App Store Connect upload config lives **outside** `ios/` so `pnpm cleanbuild:app:ios` does not remove your credentials.

| File                                     | Committed                   | Purpose                                                                                   |
| ---------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| `ExportOptions.plist.template`           | Yes                         | App Store export template                                                                 |
| `ExportOptions.plist`                    | No (generated / gitignored) | Used by `pnpm release:app:ios`                                                            |
| `ExportOptions.tvos.plist`               | No (generated / gitignored) | Used by `pnpm release:app:tvos`                                                           |
| `team.env`                               | No (gitignored)             | `IOS_DEVELOPMENT_TEAM=…` (fallback when `EXPO_APPLE_TEAM_ID` is unset in `apps/app/.env`) |
| `app-store-connect.env.example`          | Yes                         | Upload credentials template                                                               |
| `app-store-connect.env`                  | No (gitignored)             | Issuer ID for `pnpm release:app:ios:upload`                                               |
| `keys.env.example`                       | Yes                         | Local key path hints                                                                      |
| `tvos-signing/README.txt.example`        | Yes                         | Template for local tvOS signing notes                                                     |
| `tvos-signing/README.txt`                | No (gitignored)             | Your local `.p12` password + cert id                                                      |
| `tvos-signing/*.cer` / `*.key` / `*.p12` | No (gitignored)             | Distribution certificate + private key                                                    |
| `munib_build_api_AuthKey_*.p8`           | No                          | App Store Connect API private key                                                         |
| `munib_signin_AuthKey_*.p8`              | No                          | Sign in with Apple (API OAuth)                                                            |
| `munib_apn_AuthKey_*.p8`                 | No                          | APNs push key                                                                             |

**Never commit** `*.env` (except `*.env.example`), `ExportOptions.plist`, `ExportOptions.tvos.plist`, `*.cer`, `*.key`, `*.p12`, or `*.p8` files.

## Release IPA

```bash
# Bump EXPO_IOS_APP_BUILD_NUMBER in apps/app/.env before each App Store upload
pnpm release:app:ios

# Apple TV (after `pnpm prebuild:app:tv:ios`): bump EXPO_TVOS_APP_BUILD_NUMBER, then
pnpm release:app:tvos
```

Output: `apps/app/ios/app-store-export/MunibTracker.ipa` (scheme name may vary); tvOS → `apps/app/ios/app-store-export-tvos/*.ipa`. tvOS uses manual signing with a `TVOS_APP_STORE` profile (override with `TVOS_PROVISIONING_PROFILE`) — see [`docs/TV.md`](../../../docs/TV.md).

**After enabling an App ID capability** (e.g. Family Controls (Distribution)) Apple invalidates every App Store profile for that bundle id. The phone export (automatic signing) has to regenerate the Xcode-managed profile; an API key without cloud-managed distribution certificate access cannot, so `pnpm release:app:ios` retries the export once with the Apple ID signed in to Xcode (Settings › Accounts). The tvOS profile is manual — regenerate it in the developer portal (or recreate it with the same name) and install it before `pnpm release:app:tvos`.

## Upload to App Store Connect / TestFlight

Uses Xcode’s `altool` with `munib_build_api_AuthKey_<KEY_ID>.p8`.

```bash
# One-time setup
pnpm ios:setup-app-store-connect
# Edit ios-keys/app-store-connect.env and place munib_build_api_AuthKey_<KEY_ID>.p8 in ios-keys/

pnpm release:app:ios:upload
# Optional: validate IPA without uploading
pnpm release:app:ios:upload:validate

# Apple TV (altool --type appletvos)
pnpm release:app:tvos:upload
pnpm release:app:tvos:upload:validate
```

Custom IPA path: `pnpm --filter app exec node scripts/ios-upload.js --ipa /path/to.ipa`
