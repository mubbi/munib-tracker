# Circles backend (NF-3.16 family · NF-3.17 partner · NF-3.18 group khatm)

Decision **D1** ([`DECISIONS.md`](./DECISIONS.md)): a `circles` module in `apps/api`
(Postgres + TypeORM migration `1720000012000-Circles`, Drizzle mirror
`packages/db/src/schema/circles.ts`). Shared vocabulary and pure rules (roles, signal kinds,
age bands, invite-code format, khatm units / stale rule) live in `@munib-tracker/shared/circles`
so the app and the API agree. The app UIs have shipped ([`FEATURES.md`](./FEATURES.md#social-circles));
this document covers the server.

## Code map

| Path                                               | What                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| `apps/api/src/circles/circles.*`                   | Circles, membership, invites, join                                     |
| `apps/api/src/circles/child-profiles.*`            | Child profiles (D7), QR device link, child session, graduation         |
| `apps/api/src/circles/circle-signals.*`            | Daily signals (closed schema) + partner nudges                         |
| `apps/api/src/circles/group-khatm.*`               | Group khatm + compare-and-set part transitions                         |
| `apps/api/src/circles/circle-auth.ts`              | `CircleAuthGuard`, `@CurrentCircleActor()`, `@AllowChildSession()`     |
| `apps/api/src/circles/circle-policy.ts`            | Pure authorisation rules (who may read / write what)                   |
| `apps/api/src/circles/circle-lifecycle.ts`         | Leave / dissolve / child delete / account-deletion cascade / retention |
| `apps/api/src/circles/circle-retention.service.ts` | Cron-driven (surface-push `dispatch-due`) retention sweep              |
| `apps/api/src/circles/circle-events.service.ts`    | Event fan-out into the in-app inbox + OS push (D33)                    |
| `apps/api/src/circles/circle-push.service.ts`      | Expo + Web Push delivery, prefs gating, server-side localization       |
| `apps/api/src/circles/family-digest.service.ts`    | D40 weekly family digest (inbox + push to parents, counts only)        |
| `apps/api/src/circles/circle-nearby.*`             | NF-3.25 nearby join: BLE sessions, match code, host-approved requests  |
| `apps/api/src/database/entities/circles.ts`        | TypeORM entities (`CIRCLE_ENTITIES`)                                   |

## Tables

`circles`, `circle_members` (PK `circleId, memberId`), `circle_invites`, `child_profiles`,
`daily_signals` (PK `circleId, memberId, date, kind`), `group_khatms`, `khatm_parts`
(PK `khatmId, partNo`), `circle_nudges`, `circle_nearby_sessions`, `circle_nearby_requests`
(NF-3.25, see "Nearby join" below). Column names follow the existing camelCase convention.
CHECK constraints (types, roles, kinds, units, statuses, part ranges) and RLS (enabled + forced,
like every other table) are in the migration. Differences from the plan's sketch:

- `child_profiles` gains `circleId` (a child belongs to one family), `reward`,
  `graduationUnlocked`, `consentedAt` / `consentPolicyVersion` (the consenting parent is
  `createdBy`), `consentTransferredAt` (D34 — consent pending after a transfer), and a hashed one-time `linkTokenHash` + `linkTokenExpiresAt` for the QR.
  There is no `deleted_at` / `graduated_at`: deletion and graduation are **hard deletes**.
- `khatm_parts.dealt` (L12) marks an assignment made by round-robin dealing; a member's own claim
  or a manager's assignment is `false` and is never re-dealt.
- `group_khatms` adds `partCount`, `assignmentMode`, `updatedAt`, `completedAt`.
- `circle_nudges.day` (UTC date, `nudgeLimitDay`) backs the unique rate-limit index `(circleId, fromMember, toMember, kind, day)` — one nudge per kind per pair per circle per UTC day (D32).
- Khatm progress is the `khatm_parts` table, not a `khatm_part` daily signal.

## Authentication

Every endpoint uses the existing session (`Authorization: Bearer <jwt>` or the web cookie)
through `CircleAuthGuard`, which calls `AuthService.getCurrentUser`. Family and partner circles
require a linked account; khatm groups accept guests (web join without an account).

**Child sessions (D7).** A parent calls `POST /circles/:id/children/:childId/device-link` and
shows the one-time token (`mtl_…`, 5-minute TTL, stored hashed) as a QR. The child's device
redeems it at `POST /circle-child/session` (rate-limited per IP; consumed by a conditional
UPDATE, so it is single-use) and receives a scoped bearer `mtc_…` (stored as SHA-256 only;
one linked device per child; the parent revokes it with `DELETE …/device`). Child bearers are
rejected (403) everywhere except endpoints marked `@AllowChildSession()`: `GET /circle-child/me`,
`GET /circles/:id` (sees itself and the adults only), `GET /circles/:id/signals` (own only),
`PUT /circles/:id/signals/fard-status` (own only) and `DELETE /circles/:id/signals/:kind/:date`. Both
writes return 403 `CHILD_CONSENT_PENDING` while the profile awaits re-confirmed consent (D34, below).

## Privacy model

- **Membership gate.** Non-members and departed members get **404** for every circle URL.
- **Closed signal schemas.** `fard_status` = exactly `{fajr, dhuhr, asr, maghrib, isha}`
  booleans; `rest_day` = `{rest: true}` (generic — never a reason, no hayd UI); `goal_done` =
  `{done: true}`. The DTOs reject any other field (`forbidNonWhitelisted`), so notes, qaza and
  journals can't be stored. There is no "missed" state: no signal means "no signal".
- **Family (D7).** Parents see **children's fard status only** (plus generic rest days). A
  parent's own salah is never shared. Adult members (13+, including graduated children) share
  nothing unless they opt in with `shareFardStatus`. Children never see siblings.
- **Partner (NF-3.17).** Only `goal_done` is shared; the goal itself stays on the device.
  Pausing stops sharing and hides that member's signals from others. Nudges are anonymous
  ("Someone made dua for you") and `GET …/nudges` never returns the sender.
- **No ibadah leaderboards.** No endpoint returns per-member totals, rankings or comparisons;
  khatm responses expose the part grid and a group `doneCount` only.
- **Names.** Members choose a per-circle `displayName`; the account name/email is never exposed.
- **Member ids (L11).** No response carries an account's global `users.id`. Every `memberId`
  (`CircleMemberDto.memberId`, `myMemberId`, `SignalDto.memberId`, khatm `assigneeMemberId` /
  `createdBy`) is an opaque per-circle id — an HMAC of `(circleId, userId)` keyed from
  `JWT_SECRET`, shaped as a UUID (`publicMemberId` in `circle-tokens.ts`) — so the same person
  can't be linked across circles. Child profiles keep their own (already per-circle, random)
  id. Endpoints that take a member id (`PATCH/DELETE …/members/:memberId`, signal `memberId`,
  nudge `toMemberId`, khatm `assign`) take this opaque id; a raw user id gets 404. Rotating
  `JWT_SECRET` changes the ids (the app just re-reads them).
- **Logging.** Nothing user-written (circle names, nicknames, intentions, rewards) is logged;
  the event service logs only the event type and error class.
- **Notifications.** Event copy is fixed and content-free (no names, no intentions, no counts);
  the D40 weekly family digest carries aggregate counts only (no names).

## Realtime & push (D33)

The app polls (TanStack Query, 60 s while a circle screen is open). Server events —
`khatm_part_done`, `khatm_completed`, `dua_received` — are written to the existing in-app inbox
(`in_app_notifications`, `kind = "circle"`, `routeData = { type: "circle", event, circleId,
khatmId? }`, de-duplicated per user). The app should localise by `routeData.event` rather than
show the English fallback copy. Gentle **reminders** are deliberately not pushed: the receiver's
app fetches them and shows them only after its own local Isha (the server has no prayer times).
Each event also goes out as an **OS push** (Expo for native, Web Push for the PWA) through
`CirclePushService`, reusing the `push_tokens` registry (`PUT /notifications/push-token`) and
the typed visible-notification path in `@munib-tracker/surface-push-delivery`
(`createExpoVisiblePushSender` / `createWebVisiblePushSender` — the silent `SurfaceSender` stays
Salah-phase only):

- **Copy** is fixed and content-free (`CIRCLE_PUSH_COPY` in `@munib-tracker/shared/circles`): no
  child names, no salah status, no circle or member names. It is localized server-side per
  device from the locale the push token was registered with, else the synced UI locale, else
  English. Inbox rows keep the English copy; the app re-localizes them (`circles.inbox.*`).
- **Gating:** each kind has its own `notificationPrefs` toggle — `circleKhatmProgress`,
  `circleKhatmCompleted`, `circleDuaReceived` (unset ⇒ on; Settings › Family & circles ›
  Notifications) — plus the master switch. The server reads them from the user's synced
  `preferences` record (`sync_records`), so no extra endpoint is needed; a toggle takes effect
  after the next sync. No synced record ⇒ allowed (registering a token already needed OS
  permission). **Guest accounts get no circle push**: they can't sync preferences, so the server
  couldn't honour their toggles (guests only join khatm groups and see progress by polling).
- **Tap routing:** `data.route` (native) / `data.url` (service worker) and the inbox row's
  `routeData.href` are the same `circleEventHref`: `/khatm-groups?circleId=…&khatmId=…` for khatm
  events, `/partner?circleId=…` for a dua.
- **Dedupe / rate limit:** a push is sent only for a newly written inbox row (a replayed event
  never pushes twice); "part completed" collapses to **one push per recipient per khatm per hour**
  (the inbox still lists every part); the Web Push `tag` `circle:khatm:<khatmId>` replaces the
  previous khatm notification on the device. Nudges are already one dua per pair per day.
- **Hygiene:** tokens the provider reports gone (`DeviceNotRegistered`, 404/410) are deleted.
  Logs carry the event type and counts only — never copy, names or ids.

### Weekly family digest (D40)

Each parent (owner / `parent` role, linked account) of a family circle gets **one** digest per
family per ISO week: an inbox row (`kind = "circle"`, `routeData = { type: "circle", event:
"family_digest", circleId, prayed, possible, href }`) plus an OS push, both opening
`/family?circleId=…`.

- **Copy is counts only** — "Your family's week · 28 of 35 Salah logged this week — mashaAllah."
  (`FAMILY_DIGEST_PUSH_COPY` in `@munib-tracker/shared/circles/push`; English only for now, other
  locales fall back). No child names, no per-child or per-prayer detail; the push `data` carries
  ids and the route only.
- **Counted:** child profiles only — not consent-pending children (D34) and not the under-7
  "learning" band. Per child per day five are possible; generic rest days are excluded (same
  rule as the on-screen digest). The window is the seven complete days before the send day
  (Friday → Thursday). A week with nothing logged sends nothing.
- **When:** Friday 18:00 UTC (the server stores no timezone) until the end of that ISO week; a
  week whose window was missed entirely is skipped. Driven by the existing surface-push cron
  (`POST /surface-push/internal/dispatch-due`, every 1–5 min — no new cron, env var or table),
  throttled to one pass per 15 min per process.
- **Idempotent:** the inbox row's `dedupeKey` `circle:digest:<circleId>:<isoWeek>` is unique per
  user (`in_app_notifications_user_dedupe`); a push goes out only when that run wrote the row.
- **Gating:** `notificationPrefs.circleFamilyDigest` (unset ⇒ on; Settings › Family & circles ›
  Notifications) plus the master switch, read from the synced preferences like the D33 toggles.
  The inbox row is written either way. Guests never get it.
## Rate limits & caps

| What                  | Limit                                                                                           | Where                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Invites               | 20 per user per rolling 24 h                                                                    | DB count                                                         |
| Nudges                | 1 per kind per (sender, receiver) pair per circle per UTC day (D32: one `dua` + one `reminder`) | unique index `(circleId, fromMember, toMember, kind, day)` → 429 |
| Join / invite preview | 30 per user per hour                                                                            | `durable-rate-limit` (Redis)                                     |
| Child-link redeem     | 20 per IP per 15 min                                                                            | `durable-rate-limit`                                             |
| Nearby sessions       | 30 per host per rolling 24 h; one live session per host per circle                              | DB count → 429                                                   |
| Nearby preview        | 120 per client IP per 15 min (a crowded masjid shares one IP)                                   | `durable-rate-limit`                                             |
| Nearby requests       | 60 per client IP per 15 min; ≤ 20 pending per session                                           | `durable-rate-limit` + DB count → 429                            |
| Nearby status polls   | 450 per request per 15 min (3 s polling for 10 min, with headroom)                              | `durable-rate-limit`                                             |
| Members               | partner 2–5, khatm group 200, family 24 (≤ 12 children)                                         | service                                                          |
| Circles               | 30 active memberships per user                                                                  | service                                                          |

Invite `max_uses` defaults to 1 (family/partner) or 200 (khatm). Expiry defaults to 7 days
(max 30). A **parent** invite grants access to the children's data, so it is locked down
further: only the circle **owner** may create one (co-parents get 403 but can still invite
members), it is always **single-use** whatever `maxUses` asks for, and it expires after
**48 h** by default and at most (`PARENT_INVITE_MAX_TTL_HOURS` in `circle-policy.ts`;
`expiresInHours > 48` on a parent invite → 400 from the DTO and the service). Khatm `admin`
invites are owner-only too. The child-link redeem limit is keyed on the trusted client IP
(`common/client-ip.ts`, see [PRODUCTION.md](./PRODUCTION.md)), not a spoofable first
`X-Forwarded-For` hop.

**Nudge day (D32).** The limit counts per circle, as the plan states ("per member pair"), and
the day is the **UTC calendar day** of the send (`nudgeLimitDay` in `@munib-tracker/shared/circles`).
The server stores no time zone and the two members may live in different ones, so UTC is the one
boundary applied identically to both; a nudge at 23:59 UTC and another at 00:01 UTC fall on two
different days by design. Invite uses are claimed with a conditional `UPDATE … WHERE uses < maxUses`.

## Group khatm concurrency

Every part transition (`claim`, `release`, `reading`, `complete`, `assign`, `deal`) is a
compare-and-set `UPDATE … WHERE <expected state>`; the loser of a race gets **409**. Completion
of the last part flips the khatm `active → completed` with a conditional update on
`(status, round)`, so the completion event fires once. A claimed part becomes reassignable after
`max(2, (deadline − now) / 3)` idle days (7 without a deadline) — the app asks the member first.

**Round-robin dealing.** `assignmentMode: "round_robin"` deals parts in join order (account
members only, never child profiles) — but only once the group has **at least 2 members**
(`KHATM_ROUND_ROBIN_MIN_MEMBERS`): a khatm (or a new round) started before anyone joins keeps
every part `open` instead of handing them all to the creator. The not-started parts — `open`,
or `assigned` but not yet `reading` — are then (re-)dealt by `planKhatmDeal`
(`@munib-tracker/shared/circles`):

Only **dealt** parts move (`khatm_parts.dealt`, L12): a part a member claimed themselves or a
manager assigned is pinned to its holder, never re-dealt and not counted toward anyone's share.

- automatically whenever someone joins the group (`CirclesService.join` → `GroupKhatmService.onMemberJoined`,
  best effort — the join never fails because of it), and
- on demand by the creator / admins: `POST /circles/:circleId/khatms/:khatmId/deal`
  ("Deal remaining parts"; 400 outside round-robin, 409 with fewer than 2 members or a completed khatm).

The not-started pool is split evenly (the first `pool % n` members in join order take one extra);
each member keeps their own lowest-numbered not-started parts up to their share and the rest are
dealt in part order. `reading` and `done` parts never move. Every move is a compare-and-set
`UPDATE … WHERE status = <expected> AND assigneeMemberId = <expected>`; a move that loses a race
(the part was claimed, started or given back meanwhile) is skipped and the plan is recomputed
from a fresh read (up to 3 attempts), so concurrent deals and joins converge. Self-pick and
creator-assigns khatms are never dealt. A leaver's unfinished parts return to the pool; a manager
can deal them out again.

## Deletion & retention

| Event                                       | Effect                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leave a circle                              | Hidden immediately; unfinished khatm parts return to the pool; a parent's consented child profiles transfer (D34, below); signals + membership purged after 30 days                                                                                                                                                                                                       |
| Parent removed / demoted                    | Same D34 transfer of the child profiles they consented to. Only the **owner** can remove or demote a parent (a co-parent can't strip the consent holder's ability to erase their child's data)                                                                                                                                                                            |
| Owner leaves / deletes account              | Ownership passes to the oldest parent (family), admin (khatm) or member (partner); none → circle dissolved                                                                                                                                                                                                                                                                |
| Delete a circle (owner)                     | All rows deleted now; a content-free tombstone (no name/owner) is purged after 30 days                                                                                                                                                                                                                                                                                    |
| Delete a child profile                      | **Immediate** hard delete of profile, membership, signals and nudges                                                                                                                                                                                                                                                                                                      |
| Child graduates                             | Child profile + its signals deleted; the young person joins as an adult `member`, sharing off by default                                                                                                                                                                                                                                                                  |
| Account deletion                            | Runs inside `AuthService.deleteAccount`'s transaction (`purgeUserCircleData`): owned circles handed over or dissolved, child profiles this parent consented to **transferred to a remaining co-parent with consent pending** (D34, below) or deleted when there is none, memberships / signals / nudges / invites removed, finished parts keep "done" without an assignee |
| Transferred child, consent not re-confirmed | Deleted (profile, membership, signals, nudges) 30 days after the transfer (D34)                                                                                                                                                                                                                                                                                           |
| Daily signals                               | Purged after 90 days (data minimisation)                                                                                                                                                                                                                                                                                                                                  |
| Nudges                                      | Purged after 30 days                                                                                                                                                                                                                                                                                                                                                      |
| Nearby sessions + requests                  | Purged 1 day after the session expired; deleted with the circle, the child profile (link sessions) and the host's / requester's account (NF-3.25)                                                                                                                                                                                                                         |
| Expired / revoked invites                   | Purged 30 days after expiry / revocation                                                                                                                                                                                                                                                                                                                                  |

### Child profiles when the consenting parent leaves, is removed or demoted, or deletes their account (D34)

The same transfer runs whenever the consenting parent stops being a parent of the family —
leaving, being removed by the owner, being demoted to `member`, or deleting the account
(`transferChildrenConsentedBy` / `transferOrDeleteChildProfile` in `circle-lifecycle.ts`). If another parent (owner / `parent` role) is still in the family, each child profile the
deleting parent consented to passes to the longest-standing one: `createdBy` becomes that parent
and `consentTransferredAt` is set (an already-pending transfer keeps its original clock; any
unused QR link token is cleared). While consent is pending (`consentPending: true` on
`ChildProfileDto` and on the member's `ChildSummaryDto`, with `consentTransferredAt` /
`consentPendingUntil`):

- **The server accepts no new data about the child** (conservative reading of COPPA / GDPR
  Art. 8 while no current parent has consented): `PUT …/signals/fard-status` and
  `DELETE …/signals/:kind/:date` return **403 `CHILD_CONSENT_PENDING`**
  (`CHILD_CONSENT_PENDING_CODE` in `@munib-tracker/shared/circles`) for the child session as
  well as for parents. The child session itself stays valid: `GET /circle-child/me` reports
  `consentPending: true` and the child can read what was already shared.
- **The child app keeps working locally** (`apps/app/src/lib/circles/child-session.ts`): taps
  stay queued in the device's offline cache (`pending: true`, nothing is lost and the session
  is not unlinked), the kids shell shows a calm "Waiting for your parent" note — no warning,
  no lost stars — and the queue uploads automatically once `/circle-child/me` reports consent
  again (on app foreground / kids screen open). The queue covers the server's sharing window
  (`signalBackfillDays`, 14 days); a tap older than that when consent returns is dropped by
  the server's 400 like any late tap. If the profile is deleted (30 days without consent) the
  child token stops resolving (401) and the app clears the session and its queue.
- **The parent view stays hidden:** `GET …/signals` omits the child for parents, and parent-side
  processing of the child's data waits — writing/clearing signals on the child's behalf, editing
  the profile and issuing a device-link QR return **403 `CHILD_CONSENT_PENDING`**. Listing,
  re-confirming, revoking the device and deleting the profile stay available.
- The co-parent re-confirms with `POST /circles/:circleId/children/:childId/consent`
  `{ parentalConsent: true, consentPolicyVersion }` (also usable to record a newer policy
  version); `createdBy`, `consentedAt` and `consentPolicyVersion` are updated and the parent view
  returns. After the 30-day window it answers **410** and deletes the lapsed profile (late consent
  can't revive it). `DELETE …/children/:childId` (any parent) still deletes immediately.
- Not re-confirmed within `CIRCLE_LIMITS.childConsentTransferDays` (30) → the retention sweep
  deletes it. With no co-parent the profile is deleted immediately (as before).

The retention sweep (`purgeExpiredCircleData`, wrapped by `CircleRetentionService`) runs from
the **existing surface-push cron** (`POST /surface-push/internal/dispatch-due`, every 1–5 min,
`SURFACE_PUSH_CRON_SECRET`) so deletions never depend on circle traffic — no new cron or env
var. It runs even when that tick's push dispatch fails (independent `finally`), is throttled to
once an hour per instance, never fails the dispatch, and is idempotent (deletes by cut-off only),
so overlapping instances are harmless. It never runs inside a user's request (`GET /circles` has
no lazy call).

## Nearby join (NF-3.25, D41–D44)

Phones standing next to each other find each other over **Bluetooth LE** instead of typing a code.
Offered for **group khatm, family (adult members; parents owner-only), accountability partner and
child-device linking** (D43). Web and TV keep QR / code only, and the code / QR stays one tap away
on phones too ("Code & QR" | "Nearby" tabs).

**Flow**

1. **Host** opens an invite's **Nearby** tab (or the device card on a child's profile) and taps
   **Make visible** → `POST /circles/:circleId/nearby-sessions` `{ role? | childId? }` returns
   `{ sessionId, serviceUuid, matchCode, purpose, role, expiresAt }`. Role rules are the invite
   rules (`canInviteRole` + `nearbyRolesFor`): `parent` sessions are owner-only, khatm `admin`
   stays code-only, a `childId` session needs a parent and confirmed consent (D34). Opening a new
   session ends the host's previous one for that circle.
2. The host's phone advertises **one 128-bit service UUID**: the fixed app prefix
   `9a3c5e71-2b84-4f06` + the 8-byte random `sessionId` (`nearbyServiceUuid` in
   `@munib-tracker/shared/circles/nearby`). No invite code, name, account id or device name is
   broadcast, and the id dies with the session (10 min, `NEARBY_SESSION_TTL_MINUTES`).
3. **Joiner** opens **Join nearby** (circles hub) or **Link with a parent's phone nearby** (kids
   link screen). The phone scans for the prefix only while the sheet is open and previews each
   beacon once: `GET /nearby-sessions/:sessionId` → circle name, type, member count, purpose,
   `needsAccount` and the 4-digit match code (no auth; rate-limited per trusted client IP via
   `clientIp`). The hub lists `member` sessions, the kids screen only `child_link` ones; closest
   first with a coarse "Very close / Nearby / Farther away" hint (never a number).
4. **Match code (D44).** Both screens show the same 4 digits — an HMAC of the session id with a
   server key (`nearbyMatchCode`, never stored). A phone advertising its own session under a
   look-alike name shows different digits, so the joiner taps **They match** only when the host's
   screen agrees. `POST /nearby-sessions/:sessionId/requests` `{ matchCode, displayName? }`
   echoes the digits (409 `NEARBY_MATCH_MISMATCH` otherwise) and returns
   `{ requestId, requestToken }` — a one-time `mtn_…` poll secret stored as SHA-256 only. Member
   sessions need the account bearer (guests only for khatm; family / partner need a linked
   account → 401; already a member → 409 `NEARBY_ALREADY_MEMBER`). A child device asks without an
   account. Asking again replaces the joiner's earlier pending request.
5. **Host approval (D42).** The host panel polls `GET …/nearby-sessions/:sessionId/requests` every
   3 s ("Asking to join", with the name each joiner chose; a child device shows as "Your child's
   phone") and taps **Accept** / **Decline** (`POST …/requests/:requestId/accept|decline`).
   Nothing auto-joins.
   - **Accept (member)** runs the same membership creation as an invite join —
     `CirclesService.admitMember` (linked-account rule, member / circle caps, khatm round-robin
     deal) with the request claimed by a conditional `UPDATE … WHERE status = 'pending'` in the
     same transaction. The host's rights are re-checked at decision time.
   - **Accept (child link)** flips the request to `accepted`; the child's phone collects its scoped
     child session on its next poll, within 5 minutes.
   - `parent` and child-link sessions are **single-use**: the first accept consumes the session
     with a conditional `UPDATE … WHERE consumedAt IS NULL AND endedAt IS NULL AND expiresAt > now`.
6. **Joiner waits.** `POST /nearby-sessions/:sessionId/requests/:requestId/status`
   `{ requestToken }` (secret in the body, never the URL) → `pending | accepted | declined |
   cancelled | completed | expired` (+ `circleId` once a member is in; the app then navigates like
   an invite join). For a child link the first poll after the accept atomically flips
   `accepted → completed`, mints the `mtc_…` child session (same effect as the QR redeem: one
   linked device, re-linking replaces it) and returns it **exactly once** with the child profile;
   the app stores it and opens the kids shell. Closing the sheet withdraws a pending request
   (`…/cancel`).
7. The host's **Stop**, leaving the screen (blur / unmount), backgrounding the app, Bluetooth
   turning off and the 10-minute expiry all stop advertising **and** end the session
   (`DELETE /circles/:circleId/nearby-sessions/:sessionId`); a still-pending request then reads
   `expired`.

**Privacy.** Nothing user-written, no IP, id or code is logged. Stored: the session (circle, host,
role, child id, times) and requests (requester account id + account type, chosen display name,
token hash, status, times). The preview exposes no more than an invite preview — never child
nicknames. Sessions and requests are purged a day after expiry and on circle / child / account
deletion (`deleteNearbySessions` in `circle-lifecycle.ts`).

**App code.** `apps/app/src/lib/nearby/` — `native.ts` (JS ↔ native; null on web / TV / Expo Go),
`permissions.ts` (rationale first, then the OS prompt), `machine.ts` (pure host / joiner reducers,
preflight, beacon list), `use-nearby-host.ts`, `use-nearby-join.ts`; UI in
`components/circles/nearby/` (`InviteMethodTabs` on `InvitePanel` and the child device card,
`NearbyHostPanel`, `NearbyJoinSheet` / `JoinNearbyButton`, `MatchCode`). Native module and the
device QA checklist: [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md#nearby-join-nf-325).

## Admin console

Nothing is exposed in the admin console. The Drizzle mirror exists so the admin app shares one
schema; any future admin view must not surface signal values, child nicknames, rewards or
khatm intentions without a documented need.

## External items (done)

Under D35 kids profiles launched with v1 while the legal review ran in parallel; the owner
confirmed the review complete on 2026-11-25. App copy still never claims compliance.

- [x] **Legal review of kids' data**: COPPA (US — verifiable parental consent method; the
      server records `consentedAt` + `consentPolicyVersion` from an in-app parental
      confirmation, which legal must confirm is sufficient), GDPR Art. 8 (EU — age of digital
      consent varies 13–16 by member state; the 13 cut-off for child profiles and graduation
      needs review per market), UK Age Appropriate Design Code (high-privacy defaults, DPIA).
- [x] **Privacy policy update** covering kids profiles, family/partner sharing and group khatm,
      with a versioned `consentPolicyVersion` the app sends.
- [x] **DPIA** for the circles data flows.
- [x] Confirm no ads / third-party analytics run in child sessions and that Sentry is limited to
      crash data with no user ids there (app-side: child sessions send crash data only — no user,
      request, breadcrumbs or transactions; see [`DATA_INVENTORY.md`](./DATA_INVENTORY.md)).

## Engineering status

- The Orval client is generated (`packages/api-client/src/generated/endpoints/circles/`).
- Khatm invite links open the Expo web join screen (`app/circle/join/[code].tsx`); D36 dropped the
  marketing-site landing page. Open engineering follow-ups live in
  [`BACKLOG.md`](./BACKLOG.md#engineering-follow-ups).
