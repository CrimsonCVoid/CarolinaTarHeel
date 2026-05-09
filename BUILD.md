# Tar Heel Web Co. — Build Spec (condensed)

The original 12-phase build prompt drove this scaffold. Key non-negotiables that any future change must respect:

## Performance (per public client site)

- < 150 KB total JS, gzipped
- Lighthouse mobile: Perf ≥ 95, A11y ≥ 100, BP ≥ 95, SEO ≥ 95
- LCP < 1.5s · CLS < 0.05 · INP < 200ms · TBT < 100ms
- Zero editor / Supabase-auth runtime in the public bundle
- Self-hosted fonts via `next/font` only (max 2 families, `display: swap`)
- All images `next/image` with explicit width/height
- No CSS-in-JS runtime, no animation library by default, no carousels unless the template requires them
- `next.config.mjs` enforces `webpack.performance.hints = 'error'` with 200 KB asset cap

## Security

- RLS on every table (see `packages/db/migrations/0001_initial.sql`)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only; admin client throws on `typeof window !== 'undefined'`
- `SITE_ID` on the public site comes from the deployment env, never from the request
- All form endpoints rate-limited + Turnstile + honeypot
- Stripe webhooks verify signature
- Auth cookies httpOnly + secure + sameSite=lax
- Magic link expiry ≤ 60 min

## Architecture

- **Hub** (`apps/hub`) at `tarheelweb.co`: marketing, login, dashboard, editor, admin
- **Site** (`apps/site`): one Vercel project per client; reads published content via service role scoped by `env.SITE_ID`
- **Publish flow**: hub action validates draft against template Zod schema → snapshots a version → promotes draft → calls `https://CLIENT_DOMAIN/api/revalidate` with shared secret → live in <5s p95
- **Templates are fixed schemas, not page builders.** A site is locked to a template version (`restaurant_v1`); upgrading is a manual migration

## Out of scope (V1)

Drag-and-drop builder, AI-in-editor, e-commerce, i18n, A/B testing, real-time collab.

## Phase tracker

See task list in this Claude Code session. Status mirrored in `OPERATIONS.md` once shipped.
