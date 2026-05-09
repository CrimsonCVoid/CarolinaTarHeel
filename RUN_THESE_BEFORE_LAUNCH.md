# Run these before launch

The repo compiles, but these are the credentialed / external setup steps that need to happen before the first paying client. Work top-to-bottom.

## 1. Install + boot

```bash
cd /Users/carterbrady/Downloads/tarheelweb
pnpm install
cp .env.example apps/hub/.env.local
cp .env.example apps/site/.env.local
```

Fill values as you go through the steps below.

## 2. Supabase

1. Create a project at supabase.com (region: `us-east-1`).
2. Copy `Project URL`, `anon` key, and `service_role` key into both `.env.local` files (hub + site).
3. Link the CLI:
   ```bash
   cd packages/db
   npx supabase link --project-ref <ref>
   ```
4. Apply the migration:
   ```bash
   npx supabase db push
   ```
5. Generate real types (replaces the hand-typed `database.types.ts`):
   ```bash
   pnpm --filter @tarheel/db gen-types
   ```
6. Seed:
   ```bash
   SEED_OPERATOR_EMAIL=carter@carolinacomfort.info pnpm --filter @tarheel/db seed
   ```
   This creates an operator user, demo org "Joe's Pizza", demo site `joes.test.local`, demo homepage, three demo media rows.

## 3. Stripe

1. **Run the setup script** to create all 6 products + prices in one shot:
   ```bash
   STRIPE_SECRET_KEY=sk_test_... pnpm tsx scripts/stripe-setup.ts
   ```
   It prints the `STRIPE_PRICE_*` env-var lines — copy them into your Vercel project. Re-running is idempotent (it finds existing products by metadata key).
2. **Webhook**: Stripe → Developers → Webhooks → Add endpoint `https://tarheelweb.co/api/stripe/webhook`. Subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.updated`

   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
3. **Test mode → Live**: re-run `stripe-setup.ts` with `sk_live_...` to create the same products in live mode, swap the env vars, redeploy. The billing page automatically shows a yellow "Stripe test mode" banner whenever the secret starts with `sk_test_`.
4. **Customer portal**: enable in Stripe → Settings → Billing → Customer portal. Allow plan changes between Starter/Standard/Premium, allow cancellation, point return URL at `https://tarheelweb.co/dashboard`.
5. **Test card**: `4242 4242 4242 4242` with any future expiration + any CVC.

## 4. Resend

1. Verify the `tarheelweb.co` domain at resend.com (DNS records via Cloudflare).
2. Create an API key, set `RESEND_API_KEY`. Set `RESEND_FROM_EMAIL=hello@tarheelweb.co`.
3. (Per-site) when provisioning a client, set `FORM_NOTIFICATION_EMAIL` on the site Vercel project to where their inbox routes.

## 5. Vercel

1. Push this repo to GitHub. (Suggested name: `tarheelweb-monorepo`.)
2. Create the Vercel team `tarheelweb`.
3. Import twice — once with `apps/hub` as root (project: `tarheelweb-hub`, primary domain: `tarheelweb.co`); once with `apps/site` as root (project: `tarheelweb-site-template` — this stays as a template only, no domain).
4. Generate a Vercel API token: Vercel → Settings → Tokens. Set `VERCEL_API_TOKEN` and `VERCEL_TEAM_ID` on the hub. Set `VERCEL_SITE_TEMPLATE_REPO=<your-org>/tarheelweb-monorepo`.
5. The `/admin/onboard` wizard now creates new client Vercel projects from this template.

## 6. Cloudflare Turnstile (optional but recommended)

1. cloudflare.com → Turnstile → add a site key for `tarheelweb.co`.
2. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` on hub and on each site project.

## 7. Sentry (optional)

1. Create a Sentry project. Set `NEXT_PUBLIC_SENTRY_DSN` on hub.
2. Add Sentry SDK init when you turn it on (deferred — ship without it first).

## 8. Backups

1. Create an empty private repo `tarheelweb-content-backups`.
2. Generate a fine-grained PAT with `Contents: read+write` on that repo.
3. In the monorepo's GitHub repo settings → Actions secrets, set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BACKUPS_REPO=<your-org>/tarheelweb-content-backups`
   - `BACKUPS_TOKEN=<the PAT>`

## 9. Local dev

```bash
pnpm dev
```

Hub at http://localhost:3000, site at http://localhost:3001. The site needs `SITE_ID` of the seeded "Joe's Pizza" row plus its `revalidation_secret` and `preview_secret` in `apps/site/.env.local` to render.

## 10. First production client

1. `/admin/onboard` → fill the form → wait ~1 min for Vercel deploy.
2. Walk the client through Cloudflare DNS for their domain.
3. Send them the magic-link URL the wizard returns.
4. They log in at `/dashboard`, click their site, and start editing.

## Production readiness checklist

- [ ] RLS verified by logging in as a test client and trying to read another org's data via dev tools (should 0-row)
- [ ] CI green: typecheck + lint + service-role-leak grep + Lighthouse on `apps/site`
- [ ] Stripe webhook tested with the Stripe CLI (`stripe listen --forward-to ...`)
- [ ] Resend domain verified, lead-form email arriving
- [ ] First test publish → site updates within 5s
- [ ] Backup workflow has run at least once and pushed to `BACKUPS_REPO`
