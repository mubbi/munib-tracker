# Salah focus lock — store filings (NF-3.13, D4 / D25)

Draft text for the owner to submit. Tick each box only once you have submitted it and record the date and the reviewer's answer. **Apple's Family Controls (Distribution) entitlement was approved on 2026-11-24 (owner-reported)**, so the iOS hard block is now **on by default** (`EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0` builds the D17 soft-prompt fallback). Plan §4.3 lists the lead times (Apple: weeks, can be rejected; Play: days to weeks).

D17 (Apple refusal) no longer applies; it remains available as a build switch (`EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0`: soft in-app prompt only, extensions and entitlement left out automatically). If Play rejects `specialUse`, the plan's fallback is an overlay triggered from the exact alarm only, without the service (lower reliability).

| #   | Filing                                                                    | Where                                                            | Status                                                                                                                               |
| --- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Family Controls (Distribution) entitlement — 4 bundle ids                 | Apple Developer › Request the Family Controls entitlement        | ☑ approved 2026-11-24 — confirm the capability is enabled on all 4 App IDs (app + 3 extensions) and regenerate provisioning profiles |
| 2   | Foreground service `specialUse` declaration + video                       | Play Console › App content › Foreground service permissions      | ☐ not filed                                                                                                                          |
| 3   | Usage access (`PACKAGE_USAGE_STATS`) + overlay justification; Data safety | Play Console › App content › Sensitive permissions / Data safety | ☐ not filed                                                                                                                          |
| 4   | Privacy policy paragraph                                                  | `apps/marketing-web` privacy page (owner / marketing agent)      | ☐ not updated                                                                                                                        |

---

## 1. Apple — Family Controls (Distribution) entitlement

Request form: <https://developer.apple.com/contact/request/family-controls-distribution> (signed in as the Account Holder). Submit **one request per bundle id**; each must carry `com.apple.developer.family-controls`:

| Target                   | Bundle id                                   | Type                            |
| ------------------------ | ------------------------------------------- | ------------------------------- |
| Munib Tracker (app)      | `app.munibtracker`                          | App                             |
| MunibTrackerFocusMonitor | `app.munibtracker.munibtrackerfocusmonitor` | DeviceActivityMonitor extension |
| MunibTrackerFocusShield  | `app.munibtracker.munibtrackerfocusshield`  | ShieldConfiguration extension   |
| MunibTrackerFocusAction  | `app.munibtracker.munibtrackerfocusaction`  | ShieldAction extension          |

All four also use the App Group `group.app.munibtracker.widgets`. After approval, enable the capability on each App ID and regenerate the provisioning profiles (EAS credentials or Xcode), then build normally (the hard block is on by default since the approval).

**Draft answer — "Describe how your app uses the Family Controls framework":**

> Munib Tracker is a free Islamic worship companion that helps Muslims keep their five daily prayers (Salah). Its optional "Salah focus lock" lets an adult user put their own distracting apps away during a short window around each prayer time that they choose themselves (default: 20 minutes from the call to prayer).
>
> We use FamilyControls with `AuthorizationCenter.requestAuthorization(for: .individual)` — the user manages only their own device; there is no parent/child or remote management. The user picks the apps and categories with Apple's `FamilyActivityPicker`; the opaque selection is stored only in our App Group on that device and is never uploaded, synced or shared.
>
> A DeviceActivityMonitor extension applies a `ManagedSettingsStore` shield to the chosen apps when a prayer window starts and clears it when the window ends (at most 12 one-off schedules, two days ahead, computed on the device from prayer times). A ShieldConfiguration extension shows "It's time for {prayer}" with our colours. A ShieldAction extension offers "I've prayed", which posts a local notification that opens our app so the user can mark the prayer — marking it ends the window immediately — and a limited, user-configured number of emergency unlocks per day. Phone, Messages and emergency calling are never shielded.
>
> No usage data, app names or tokens leave the device. The feature is off by default and can be paused for a day or turned off at any time.

**Draft answer — "Why is the entitlement needed (vs. Screen Time settings)":** Built-in Screen Time Downtime is a fixed daily schedule; prayer times move every day with the sun and by location, and the user wants the block to end as soon as they have prayed. Only DeviceActivity schedules computed from that day's prayer times can do this.

---

## 2. Google Play — foreground service `specialUse`

Manifest (merged from `modules/munib-focus-lock/android/src/main/AndroidManifest.xml`):

```xml
<service android:name="expo.modules.munibfocuslock.FocusLockService"
  android:exported="false" android:foregroundServiceType="specialUse">
  <property android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
    android:value="Salah focus lock: during a short prayer-time window the user scheduled, keeps the apps the user chose paused by showing a full-screen Salah reminder over them until the user marks the prayer or the window ends." />
</service>
```

**Draft declaration — "Describe the feature that uses this foreground service type":**

> Salah focus lock is an opt-in, user-initiated feature. The user chooses apps that distract them and a short window around each of their daily prayers (default 20 minutes). At the start of a window, an exact alarm the user scheduled starts this foreground service, which shows a persistent low-priority notification ("Salah focus on"). While the window runs, the service checks which app is in the foreground (UsageStatsManager) and, if it is one the user chose, shows a full-screen reminder over it with "I've prayed" and a limited emergency unlock. The service stops as soon as the user marks the prayer or the window ends (typically 5–60 minutes, a few times a day).

**Why no other type fits:** it isn't media, location, data sync, health, phone call or connected device work; it must keep running for the whole user-visible window to enforce the user's own block, and must start at a precise time while the app is in the background, so WorkManager / JobScheduler can't be used.

**Video (required):** record on a release build — Settings › Salah focus › setup (permissions, pick apps, "Start a 1-minute test") → open a chosen app → overlay appears → "I've prayed" → app opens and marks the Salah → overlay and ongoing notification disappear. Also show the ongoing notification and that Phone and Messages stay usable.

---

## 3. Google Play — usage access + display over other apps

**`PACKAGE_USAGE_STATS` (Usage access) — draft justification:**

> Used only by Salah focus lock, only while a prayer window the user scheduled is running, to read which app is in the foreground (UsageEvents `ACTIVITY_RESUMED`) so the app can cover the apps the user chose. The user grants it in Settings › Usage access from an explained setup step. Usage events are read in memory and immediately discarded; they are never stored, uploaded or shared. We do not use the Accessibility API and do not request `QUERY_ALL_PACKAGES` (the app picker uses a launcher `<queries>` intent).

**`SYSTEM_ALERT_WINDOW` (Display over other apps) — draft justification:**

> Shows the full-screen Salah reminder on top of an app the user chose to block, during the prayer window they scheduled. Granted by the user in Settings, explained in setup, removable at any time; the feature degrades to an in-app reminder without it.

**Data safety form:** no new data types are collected or shared. "App activity › Other actions" is processed **on device only** (not collected) — usage events are ephemeral. Picked app package names stay in local SharedPreferences and are not transmitted. `SCHEDULE_EXACT_ALARM` is already declared for Precise Adhan (NF-1.36) and is reused.

---

## 4. Privacy policy (owner / marketing)

> **Salah focus lock (optional).** If you turn it on, the apps you choose to pause stay on your device. On iPhone they are kept by Apple's Screen Time framework as private tokens we cannot read; on Android the app checks which app is open only while one of your prayer windows is running and never stores or sends that information. Your focus-lock settings (which prayers, timing, mode) sync with your account like other preferences; your app choices and emergency-unlock history do not.
