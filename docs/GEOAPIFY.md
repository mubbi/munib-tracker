# Geoapify key — setup & security (masjid finder)

The masjid finder (NF-3.11) reads OpenStreetMap masjids through **Geoapify Places** when
`GEOAPIFY_API_KEY` is set on the API, and falls back to public Overpass otherwise. The key is a
**server-side secret**: only `apps/api` ever holds it. The Expo app, web build, admin and
marketing never see it — they call our `/api/v1/masjids` proxy, which sends Geoapify only the
coarse geohash bounding box (~15 km), never a user's coordinates, IP or id.

Code: `apps/api/src/masjids/geoapify.client.ts` (client), `masjids-rate-limit.ts` (credit budget),
`masjids.service.ts` (Geoapify → Overpass order). Data-flow proof: [`proofs/masjid-finder.md`](./proofs/masjid-finder.md).

## 1. Create the key

1. Sign up at <https://myprojects.geoapify.com/> (free plan — no card, no billing).
2. Create **one project per environment** — e.g. `munib-api-prod` and `munib-api-dev`. Each
   project has its own key and usage graph, so local experiments can't eat production's quota,
   and a leaked dev key can be killed without touching production.
3. Open the project → **API keys** → copy the key. Give it a description that says where it
   lives (e.g. `Vercel apps/api production`) — the default "Created on …" tells you nothing
   during an incident.

## 2. Store it

| Where                          | How                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local dev                      | `apps/api/.env` → `GEOAPIFY_API_KEY=…` (dev project's key). `.env` / `.env*.local` are gitignored.                                                                                          |
| Production (Vercel `apps/api`) | Project → Settings → Environment Variables → `GEOAPIFY_API_KEY`, **Production** only, marked **Sensitive** (value can't be read back from the dashboard). Redeploy so functions pick it up. |
| Preview deployments            | Use the dev key or leave unset (Overpass only) — previews are reachable by anyone with the URL.                                                                                             |

Never:

- prefix it `EXPO_PUBLIC_` / `NEXT_PUBLIC_` (that ships it inside the app/web bundle);
- put it in `apps/app`, `apps/admin`, `apps/marketing-web`, `eas.json`, CI logs or screenshots;
- paste it into issues, chats or commits — if that happens, **rotate** (section 5); deleting the
  message or rewriting git history is not enough.

The API never logs the request URL (the key travels in its query string, as Geoapify requires),
and error messages carry only the status class (`Geoapify rejected the API key`,
`Geoapify responded 503`, …) — keep it that way when touching the client.

## 3. Dashboard restrictions (the API keys page)

Geoapify offers four controls per key. Because this key is used **server-to-server**, not from a
browser, they apply differently than the dashboard's hints suggest:

| Control                   | Use it?                                    | Why                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Allowed IP addresses**  | **Yes, when the API has fixed egress IPs** | The only restriction that actually stops a stolen key. Standard Vercel Functions egress from shared, changing IPs, so an IP filter would block production — add one only if the API runs where outbound IPs are static (a Vercel plan with static IPs, Fly.io/VPS with a dedicated egress IP). For the **dev key**, you can allow your own public IP (re-add it if your ISP changes it). |
| **Allowed HTTP Referers** | **No**                                     | Browsers send `Referer`; our server-side `fetch` doesn't. A Referer filter would reject every API call (→ silent Overpass fallback). Non-browser clients can forge the header anyway, so it adds no protection for a server key.                                                                                                                                                         |
| **Allowed HTTP Origins**  | **No**                                     | Same reason: `Origin` is a browser header. Adding one breaks the API's requests.                                                                                                                                                                                                                                                                                                         |
| **CORS response origin**  | **Yes — change it from `*`**               | The key is never used from a web page, so set it to an origin that isn't a browser app of ours, e.g. `https://api.munibtracker.app`. Then if the key leaks, other websites can't use it from visitors' browsers (browsers refuse to read the responses). It doesn't stop `curl` — that's what the IP filter and rotation are for.                                                        |

## 4. Quota guard (already in code)

Free plan: 3,000 credits per day, up to 5 requests/second; Places costs 1 credit per 20 places
returned, Place Details 1 credit. Geoapify enforces this softly, so the API budgets itself:

- each area query asks for at most the nearest **200** places (≤ 10 credits);
- a per-**UTC-day** counter (Redis; in-memory fallback) allows 70 % of `GEOAPIFY_DAILY_CREDITS`
  (default 3,000) for area queries at worst case and 25 % for details, keeping a 5 % margin;
- when the day's budget is spent, Geoapify fails, or the key is rejected, the request falls back
  to public Overpass — users still get results, and the API logs one of:
  `Geoapify daily credit budget reached; using Overpass`,
  `Geoapify fetch failed (Geoapify rejected the API key); using Overpass`;
- results are cached per ~5 km cell for 7 days (served stale up to 30), shared by every user,
  plus the existing per-client and global upstream limits — a busy area costs credits about once
  a week, not once per user.

If several environments share one key, they share its 3,000 credits but each counts its own
budget — another reason for one project per environment. Raise `GEOAPIFY_DAILY_CREDITS` only on a
paid plan.

## 5. Rotate / respond to a leak

1. Geoapify dashboard → **API keys** → create a **new** key in the same project (restrictions from
   section 3 included).
2. Vercel `apps/api` → replace `GEOAPIFY_API_KEY` → **Redeploy** production.
3. Check `/api/v1/masjids?cell=…` for a cold cell returns masjids, and the API logs show no
   `rejected the API key` warnings.
4. Back in the dashboard → **Remove key** on the old one.
5. Look at the project's usage graph for traffic you can't explain (spikes at odd hours,
   requests after the old key was removed).

Rotate on a schedule too (e.g. yearly) and whenever someone with access to the Vercel project
leaves.

## 6. Monitoring

- **Geoapify dashboard → Usage**: daily credits per project; a sudden climb with no matching
  app traffic means the key is being used elsewhere.
- **API logs**: the warnings listed in section 4. Repeated `rejected the API key` = key removed or
  restricted (e.g. an Origin/Referer filter added by mistake).
- **Attribution**: the free plan requires Geoapify attribution. While a key is configured, the API
  adds `Powered by Geoapify https://www.geoapify.com/` to every masjid response's `attribution`
  and the app shows it next to “© OpenStreetMap contributors”. Don't remove it while on the free
  plan.
