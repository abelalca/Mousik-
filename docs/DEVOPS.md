# Mousik — Environments, security and delivery

## Environments

| | DEV | QA | PROD |
|---|---|---|---|
| Trigger | merge to `main` | tag `vX.Y.Z-rc.N` | tag `vX.Y.Z` + approval |
| Web | Cloudflare Pages branch `dev` | branch `qa` | branch `main` (production) |
| Database | Supabase **local** (Docker) on each machine and in CI | Supabase project (free) | Supabase project (free) |
| Data | test data | test data | real — never copied to other environments |

Cost: **US$0/month** (Supabase free plan allows 2 projects; DEV runs locally).

### Every environment needs a backend
Mousik is **online-only and has no guest mode**: learners must sign up, and all state
(settings, progress, XP, streak, hearts, song) lives in Supabase. Without a backend the app
shows "Mousik is not available"; without a connection it shows "No connection" and does not open.

This means the **DEV web deployment needs a Supabase project too** — today the `dev` GitHub
environment has none (the two free projects are used by QA and PROD), so DEV only shows the
"not available" screen. Options (pick one; no secrets are changed by this repo):

1. **Point DEV at QA's project**: set the `dev` environment's `SUPABASE_URL` / `SUPABASE_ANON_KEY`
   variables to QA's values. Free, but DEV and QA share test data and DEV runs against QA's schema
   (migrations are only pushed to QA on `-rc` tags, so a DEV build with new migrations can break).
2. **A third Supabase project for DEV** (paid plan, or a second free organization) and add a
   `supabase db push` step to the `dev` deploy job, like QA.
3. Keep DEV web-only for reviewing visuals and do functional testing locally (`npx supabase start`).

The static preview build (`npm run build:preview`, in-memory routing, no service worker) also
shows the "not available" screen unless it is given a backend.

## Development cycle

```
feature/xyz ──PR──► main ──► DEV
                     │
                     └─ git tag v0.2.0-rc.1 ──► QA (TestFlight later)
                                  │ validated
                     git tag v0.2.0 ──► approval ──► backup ──► PROD
```

1. Branch from `main`: `git checkout -b feature/rhythm-unit`.
2. Open a PR. CI must pass: types, unit tests, content validation, build, size budget,
   database security tests, secret scan, dependency audit (and CodeQL on public repos).
3. Merge → DEV deploys automatically.
4. Release candidate: `git tag v0.2.0-rc.1 && git push origin v0.2.0-rc.1` → QA.
5. Release: `git tag v0.2.0 && git push origin v0.2.0` → a reviewer approves → PROD.

## Local development

```bash
npm install
npx supabase start          # Postgres + Auth + API in Docker (prints URL and anon key)
cp .env.example .env.local  # paste the anon key
npm run dev                 # http://localhost:5173
npx supabase test db        # database security tests
npm test                    # unit tests
```

Without `.env.local` (no backend) the app shows the "not available" screen: there is no guest mode.

## Database rules

- Every change is a **new** migration in `supabase/migrations/` (`npx supabase migration new <name>`).
  Never edit a migration that has been applied anywhere.
- Every table: RLS enabled, deny by default, explicit policies, pgTAP test in `supabase/tests/`.
- Progress/XP/streak are written only through `start_lesson` / `complete_lesson`, and hearts only
  through `lose_heart` / `get_status` (validated server-side). Clients may only update
  `display_name`, `settings`, `onboarded` and `song`.
- New lessons: run `npx tsx --tsconfig tsconfig.json scripts/lesson-catalog.ts` and put the
  output in a new migration. `npm run validate` fails if the catalog is out of date.
- Only CI applies migrations to QA/PROD. Nobody changes production by hand.

## One-time setup (when you are ready to deploy)

### 1. Supabase (free)
Create two projects: `mousik-qa` and `mousik-prod`. In each:
- **Authentication → Providers → Email**: enable "Confirm email", minimum password length 8,
  require lowercase, uppercase and digits; enable "Secure password change".
- **Authentication → URL Configuration**: Site URL = the environment's web URL; add
  `mousik://auth/callback` (mobile) to redirect URLs.
- Google / Apple sign-in: configure later under Providers, then list them in `AUTH_PROVIDERS`.
- Note the **project ref**, **URL**, **anon key** and the **database password**.

### 2. Cloudflare Pages (free)
Create a Pages project (direct upload) named `mousik`. Create an API token with the
"Cloudflare Pages — Edit" permission and note your account ID.

### 3. GitHub
**Settings → Environments**: create `dev`, `qa`, `production` and `production-backup`.

| Environment | Variables | Secrets |
|---|---|---|
| dev | `CLOUDFLARE_PROJECT` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| qa | `CLOUDFLARE_PROJECT`, `SUPABASE_PROJECT_REF`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AUTH_PROVIDERS` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` |
| production | same as qa (production values) | same as qa + `BACKUP_PASSPHRASE` |
| production-backup | `SUPABASE_PROJECT_REF` | `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `BACKUP_PASSPHRASE` |

- `production`: add **Required reviewers** (you) and restrict deployments to tags `v*`.
- **Settings → Branches → main**: require a pull request, require status checks
  (`App`, `Database`, `Security`), block force pushes.
- **Settings → Code security**: enable Dependabot alerts, secret scanning and push protection.

Until these are configured, deploy jobs skip their steps and CI still runs.

## Security baseline

| Area | Measure |
|---|---|
| Data | Only email, display name, settings and progress. No trackers. TLS + encryption at rest. |
| Database | RLS everywhere, column-level grants, SECURITY DEFINER functions with fixed `search_path`, anon has no table access, 61 pgTAP tests. |
| Auth | PKCE OAuth, short-lived JWT + rotating refresh tokens, strong passwords, email confirmation, rate limits, in-app account deletion, no learner data stored on the device (in-memory only, cleared on sign-out). |
| Web | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy (`public/_headers`). |
| Supply chain | Lockfile, `npm audit` gate, Dependabot, gitleaks, CodeQL (public repos). |
| Operations | Encrypted nightly backup and pre-deploy backup of PROD (GitHub artifacts, AES-256). |

### Pending (next phases)
- CAPTCHA (Cloudflare Turnstile) on sign-up and password reset.
- Self-host fonts (removes Google Fonts from the CSP).
- React Router 7 (fixes a moderate advisory in v6).
- End-to-end tests (Playwright) in CI.
- Capacitor iOS app: Keychain session storage, deep links, Xcode Cloud → TestFlight.
- Sentry with PII scrubbing; external pentest before launch.
