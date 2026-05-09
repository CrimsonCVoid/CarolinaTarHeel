/**
 * Seed Southern Peak Brewery onto the restaurant_v2 template (idempotent upserts).
 * Invoke: pnpm --filter @tarheel/db tsx seeds/southern-peak.ts
 */

import { randomBytes } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import {
  defaultHome,
  defaultSweetwater,
  defaultWindyRoad,
  defaultBeer,
  defaultFood,
  defaultEvents,
  defaultAbout,
  defaultPrivateEvents,
  defaultCareers,
  defaultContact,
  defaultSettings,
} from '../../templates/src/restaurant-v2/default-content';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ORG_NAME = 'Southern Peak Brewery';
const ORG_SLUG = 'southern-peak-brewery';
const ORG_PLAN = 'standard';

const SITE_DOMAIN = 'southernpeakbrewery.com';
const SITE_TEMPLATE_ID = 'restaurant_v2';
const SITE_STATUS = 'draft';

const OWNER_EMAIL = 'info@southernpeakbrewery.com';
// TODO(operator): replace this placeholder with the real auth.users.id created
// when the owner accepts the magic-link invite via /admin/onboard. Until then
// the owner cannot sign in to edit the site — this row only exists so the
// (org_id, user_id) primary key on org_members is satisfied for the seed.
const OWNER_PLACEHOLDER_USER_ID = '00000000-0000-0000-0000-000000000001';

// ---------------------------------------------------------------------------
// Page manifest — slug == template_page_key for restaurant_v2
// ---------------------------------------------------------------------------

type PageContent = Record<string, unknown>;

interface PageSeed {
  slug: string;
  title: string;
  metaDescription: string;
  content: PageContent;
}

const PAGES: readonly PageSeed[] = [
  {
    slug: '/',
    title: 'Home',
    metaDescription:
      'Southern Peak Brewery — two Apex, NC taprooms pouring small-batch beer with wood-fired pizza at Sweetwater and rotating food trucks at Windy Road.',
    content: defaultHome as unknown as PageContent,
  },
  {
    slug: '/locations/sweetwater',
    title: 'Sweetwater Taproom & Pizzeria',
    metaDescription:
      'Sweetwater Taproom & Pizzeria in Apex, NC — wood-fired pizza, Southern Peak beer on tap, kid-friendly patio at 1451 Richardson Road. Open daily.',
    content: defaultSweetwater as unknown as PageContent,
  },
  {
    slug: '/locations/windy-road',
    title: 'Windy Road Brewery',
    metaDescription:
      'The original Southern Peak taproom on Windy Road in Apex, NC. Small-batch beer, dog-friendly patio, rotating food trucks Wednesday through Sunday.',
    content: defaultWindyRoad as unknown as PageContent,
  },
  {
    slug: '/beer',
    title: 'Our Beer',
    metaDescription:
      'Pilsners, IPAs, lagers and porters brewed in Apex, NC. Browse the current Southern Peak tap list — flagship year-rounds plus seasonal small-batch releases.',
    content: defaultBeer as unknown as PageContent,
  },
  {
    slug: '/food',
    title: 'Pizza Menu',
    metaDescription:
      'Wood-fired pizza in Apex, NC — Craft Peak Pies, Peak Pockets and snacks paired with Southern Peak beer. Order online for pickup at the Sweetwater taproom.',
    content: defaultFood as unknown as PageContent,
  },
  {
    slug: '/events',
    title: 'Events & Food Trucks',
    metaDescription:
      'Trivia, live music, run club, and the weekly food truck schedule at Southern Peak Brewery in Apex, NC. See what is on tap this week at both locations.',
    content: defaultEvents as unknown as PageContent,
  },
  {
    slug: '/about',
    title: 'About Us',
    metaDescription:
      'Southern Peak Brewery is an Apex, NC brewery founded by Ken Michalski and Nathan Poissant. Two taprooms, scratch pizza, and beer brewed to drink alongside it.',
    content: defaultAbout as unknown as PageContent,
  },
  {
    slug: '/private-events',
    title: 'Private Events',
    metaDescription:
      'Host your private event at Southern Peak Brewery in Apex, NC — Sweetwater buyouts, patio reservations, rehearsal dinners and corporate gatherings.',
    content: defaultPrivateEvents as unknown as PageContent,
  },
  {
    slug: '/careers',
    title: 'Careers',
    metaDescription:
      'Join the Southern Peak Brewery team in Apex, NC. Open roles in the taproom, kitchen and brewhouse — apply below or stop in to introduce yourself.',
    content: defaultCareers as unknown as PageContent,
  },
  {
    slug: '/contact',
    title: 'Contact',
    metaDescription:
      'Get in touch with Southern Peak Brewery in Apex, NC. Hours, addresses and phone numbers for the Sweetwater taproom and the original Windy Road brewery.',
    content: defaultContact as unknown as PageContent,
  },
];

// ---------------------------------------------------------------------------
// Env / client
// ---------------------------------------------------------------------------

function createSeedClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('Missing required env var SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Missing required env var SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const supabase = createSeedClient();

  // 1. Organization
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .upsert({ name: ORG_NAME, slug: ORG_SLUG, plan: ORG_PLAN }, { onConflict: 'slug' })
    .select('id')
    .single();
  if (orgErr) throw orgErr;
  const orgId = org.id as string;

  // 2. Owner membership (placeholder user_id — operator swaps to the real
  // auth.users.id post-invite; see TODO at top of file).
  const { error: memberErr } = await supabase
    .from('org_members')
    .upsert(
      { org_id: orgId, user_id: OWNER_PLACEHOLDER_USER_ID, role: 'owner' },
      { onConflict: 'org_id,user_id' },
    );
  if (memberErr) {
    // Non-fatal: the FK to auth.users may reject the placeholder until the
    // operator wires a real user. Log and keep going so the site/pages still
    // get seeded for the spec play.
    console.warn(
      `[southern-peak] org_members upsert skipped — owner email ${OWNER_EMAIL} ` +
        `must be invited via /admin/onboard before they can edit. (${memberErr.message})`,
    );
  }

  // 3. Site (revalidation/preview secrets explicit so the row is reproducible
  // even if the migration default changes later).
  const { data: site, error: siteErr } = await supabase
    .from('sites')
    .upsert(
      {
        org_id: orgId,
        domain: SITE_DOMAIN,
        template_id: SITE_TEMPLATE_ID,
        status: SITE_STATUS,
        revalidation_secret: randomBytes(32).toString('hex'),
        preview_secret: randomBytes(32).toString('hex'),
      },
      { onConflict: 'domain', ignoreDuplicates: false },
    )
    .select('id')
    .single();
  if (siteErr) throw siteErr;
  const siteId = site.id as string;

  // 4. Site settings (brand / contact / hours / social / seo from defaultSettings)
  const { error: settingsErr } = await supabase.from('site_settings').upsert(
    {
      site_id: siteId,
      brand: defaultSettings.brand,
      contact: defaultSettings.contact,
      hours: defaultSettings.hours,
      social: defaultSettings.social,
      seo: defaultSettings.seo,
    },
    { onConflict: 'site_id' },
  );
  if (settingsErr) throw settingsErr;

  // 5. Pages — one row per template page, draft and published in lockstep so
  // the public site can render immediately.
  const publishedAt = new Date().toISOString();
  for (const page of PAGES) {
    const { error: pageErr } = await supabase.from('pages').upsert(
      {
        site_id: siteId,
        slug: page.slug,
        template_page_key: page.slug,
        title: page.title,
        meta_description: page.metaDescription,
        og_image_url: null,
        draft_content: page.content,
        published_content: page.content,
        status: 'published',
        published_at: publishedAt,
      },
      { onConflict: 'site_id,slug' },
    );
    if (pageErr) {
      throw new Error(`Failed to upsert page ${page.slug}: ${pageErr.message}`);
    }
  }

  console.warn(
    `Seeded Southern Peak: org=${orgId} site=${siteId} pages=${PAGES.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
