# Operations runbook

## Onboard a new client

1. Sign in to `https://tarheelweb.co/admin/onboard` as an operator.
2. Fill: business name, slug, owner email, production domain, template, plan tier.
3. The wizard:
   - Creates `organizations` + `org_members` (owner) + `sites` rows
   - Pre-populates pages from the template's `defaultContent`
   - Creates a Vercel project from `VERCEL_SITE_TEMPLATE_REPO`, attaches the domain, sets env vars (`SITE_ID`, secrets, etc.), and triggers a deploy
   - Returns a magic-link invite URL to send the client
4. Send the invite link to the client via email or text.
5. Walk the client through the Cloudflare DNS step (CNAME → `cname.vercel-dns.com`).

## Roll back a publish

`/sites/[id]/pages/[slug]/edit` → expand "Version history" → click **Restore** on the desired snapshot. This copies the version into `draft_content` and snapshots a new version with `reason='restore'`. Hit Publish to push to production.

## Add a new template version

1. Add `packages/templates/src/<vertical>-v<N>/` with `schema.ts`, `default-content.ts`, `editor-meta.ts`, `pages/*.tsx`, `index.ts`.
2. Register it in `packages/templates/src/registry.ts`.
3. Lighthouse-test by setting `template_id` on a staging site row.
4. To migrate an existing site to the new version, write a one-off script under `scripts/migrations/` that maps old content → new schema, validates with Zod, and updates `pages.draft_content` for the site. Operator publishes manually after review.

## Transfer a site to a client's own Vercel team

1. In Vercel, transfer the project to their team account (Vercel UI).
2. In our DB, set `sites.vercel_project_id = null` so we no longer treat it as ours.
3. Send the client `OPERATIONS_CLIENT_EXPORT.md` (export pack) — the JSON dump from the nightly backup, plus instructions to swap env vars to their own Supabase project if they want full ownership.

## Emergency: revoke a leaked secret

- Supabase service-role: rotate in Supabase dashboard → update on Vercel envs for hub + every site → redeploy. Watch `audit_log` for unfamiliar entries.
- Stripe: rotate restricted key or full SK in Stripe → update Vercel env on hub → redeploy. Re-set webhook secret if rotated.
- Revalidation/preview secrets: regenerate in DB (`update sites set revalidation_secret = encode(gen_random_bytes(32),'hex'), preview_secret = encode(gen_random_bytes(32),'hex') where id = $1;`) → update env on the affected site Vercel project → redeploy.

## Performance gates

- CI runs Lighthouse against the built site app on every PR touching `apps/site/**` or `packages/templates/**` (`/.github/workflows/lighthouse.yml`).
- Bundle-size hint is `error` in `apps/site/next.config.mjs` — a 200 KB asset will fail the build.

## Backups

- `.github/workflows/backup.yml` runs nightly, dumping all sites' content to `BACKUPS_REPO`. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BACKUPS_REPO`, `BACKUPS_TOKEN` as repo secrets.
- Manual: `pnpm tsx scripts/backup-content.ts ./out`.

## Common Supabase queries

```sql
-- Sites with a stale subscription
select o.name, o.stripe_subscription_status, s.domain
from organizations o
join sites s on s.org_id = o.id
where o.stripe_subscription_status not in ('active','trialing')
   or o.stripe_subscription_status is null;

-- New form submissions in last 24h, by site
select s.domain, count(*) from form_submissions f
join sites s on s.id = f.site_id
where f.created_at > now() - interval '1 day' and f.status = 'new'
group by s.domain;
```
