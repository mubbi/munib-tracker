# Security Policy

## Supported versions

Security fixes are applied to the latest `main` branch and the most recent
production release of Munib Tracker.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Prefer one of these private channels:

1. **GitHub Security Advisories** — use
   [Report a vulnerability](https://github.com/mubbi/munib-tracker/security/advisories/new)
   on this repository (enable private vulnerability reporting in repo settings if needed).
2. **Contact form** — [https://munibtracker.app/contact](https://munibtracker.app/contact)
   with subject line starting with `[SECURITY]`.

Include as much detail as you can:

- Affected app (`apps/app`, `apps/api`, `apps/admin`, `apps/marketing-web`) and version/commit
- Steps to reproduce
- Impact (auth bypass, data exposure, injection, etc.)
- Any proof-of-concept (kept private)

We aim to acknowledge reports within **7 days** and to share a remediation plan
or status update within **30 days**. Please give us reasonable time to fix and
release before any public disclosure.

## Scope highlights

In scope examples:

- Authentication / JWT / OAuth flows in `apps/api`
- Admin console session / allowlist bypass (`apps/admin`)
- Unauthorized access to synced worship data
- XSS or injection on marketing, admin, or Expo web surfaces
- Secrets or credential leakage in the repository or builds

Out of scope examples:

- Denial of service against third-party CDNs
- Issues that require physical access to an unlocked device
- Reports about missing commercial features
- Soliciting payment or sponsorship (we do not accept funding — see [SUPPORT.md](SUPPORT.md))

## Safe harbor

We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations and service disruption
- Report findings promptly through the channels above
- Do not exploit the issue beyond what is needed to demonstrate it
