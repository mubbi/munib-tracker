# iOS signing (`ios-keys/`)

Signing and App Store Connect upload config lives **outside** `ios/` so `pnpm cleanbuild:app:ios` does not remove your credentials.

| File | Committed | Purpose |
|------|-----------|---------|
| `ExportOptions.plist.template` | Yes | App Store export template |
| `ExportOptions.plist` | No (generated) | Used by `pnpm release:app:ios` |
| `team.env` | No | `IOS_DEVELOPMENT_TEAM=…` |
| `app-store-connect.env.example` | Yes | Upload credentials template |
| `app-store-connect.env` | No | Issuer ID for `release:app:ios:upload` |
| `munib_build_api_AuthKey_*.p8` | No | App Store Connect API private key |
| `munib_signin_AuthKey_*.p8` | No | Sign in with Apple (API OAuth) |
| `munib_apn_AuthKey_*.p8` | No | APNs push key |

## Release IPA

```bash
# Bump EXPO_IOS_APP_BUILD_NUMBER in apps/app/.env before each App Store upload
pnpm release:app:ios
```

Output: `apps/app/ios/app-store-export/MunibTracker.ipa` (scheme name may vary).

## Upload to App Store Connect / TestFlight

Uses Xcode’s `altool` with `munib_build_api_AuthKey_<KEY_ID>.p8`.

```bash
# One-time setup
pnpm ios:setup-app-store-connect
# Edit ios-keys/app-store-connect.env and place munib_build_api_AuthKey_<KEY_ID>.p8 in ios-keys/

pnpm release:app:ios:upload
# Optional: validate IPA without uploading
pnpm release:app:ios:upload:validate
```

Custom IPA path: `pnpm --filter app exec node scripts/ios-upload.js --ipa /path/to.ipa`
