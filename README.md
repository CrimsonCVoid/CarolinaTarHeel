# Tar Heel Web Co. — monorepo

Productized website builds + multi-tenant CMS for NC small businesses. Public sites stay <150 KB JS, hub at `tarheelweb.co` hosts the editor.

## Layout

```
apps/
  hub/      Marketing + client portal + editor (one Vercel project)
  site/     Public client site runtime (one Vercel project per client)
packages/
  db/         Migrations, Supabase clients, generated types
  templates/  Zod schemas + RSC components per template
  ui/         Shared shadcn-style primitives
  editor/     Form-from-schema generator + field components
  config/     Shared tsconfig / eslint / tailwind presets
```

## Getting started

```bash
pnpm install
cp .env.example .env.local            # then fill values
pnpm --filter @tarheel/db migrate     # runs Supabase migrations
pnpm --filter @tarheel/db seed        # creates demo org + site
pnpm dev                              # turbo runs hub + site in parallel
```

Hub at http://localhost:3000, site at http://localhost:3001.

## Before launch

See `RUN_THESE_BEFORE_LAUNCH.md` for credentialed steps (Supabase project, Stripe products, Vercel token, Resend domain).

## Operations

See `OPERATIONS.md` for: onboarding a client, rolling back a publish, adding a template version, transferring a site to a client's own Vercel team.

## Build manifest

The full build spec lives in `BUILD.md`. Non-negotiables: <150 KB JS on public sites, RLS on every table, no editor runtime on the public bundle, instant publish via on-demand revalidation.
