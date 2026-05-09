/**
 * Seed script — creates an operator user, one demo org, one demo site, one homepage,
 * three demo media rows. Run after migrations apply:
 *   pnpm --filter @tarheel/db seed
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_OPERATOR_EMAIL.
 */
import { createAdminClient } from './src/client.js';

const OPERATOR_EMAIL = process.env.SEED_OPERATOR_EMAIL ?? 'carter@carolinacomfort.info';

async function main() {
  const supabase = createAdminClient();

  // 1. Operator user
  const { data: operator, error: userErr } = await supabase.auth.admin.createUser({
    email: OPERATOR_EMAIL,
    email_confirm: true,
    user_metadata: { role: 'operator' },
  });
  if (userErr && !userErr.message.includes('already')) throw userErr;
  const operatorId = operator?.user?.id ?? (await findUserByEmail(OPERATOR_EMAIL));

  // 2. Demo org "Joe's Pizza"
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .upsert({ name: "Joe's Pizza", slug: 'joes-pizza', plan: 'standard' }, { onConflict: 'slug' })
    .select()
    .single();
  if (orgErr) throw orgErr;

  // 3. Operator membership
  await supabase
    .from('org_members')
    .upsert({ org_id: org.id, user_id: operatorId, role: 'operator' }, { onConflict: 'org_id,user_id' });

  // 4. Demo site
  const { data: site, error: siteErr } = await supabase
    .from('sites')
    .upsert(
      { org_id: org.id, domain: 'joes.test.local', template_id: 'restaurant_v1', status: 'live' },
      { onConflict: 'domain' },
    )
    .select()
    .single();
  if (siteErr) throw siteErr;

  // 5. Site settings
  await supabase.from('site_settings').upsert({
    site_id: site.id,
    brand: { name: "Joe's Pizza", primary: '#a02828' },
    contact: {
      phone: '(919) 555-0100',
      email: 'hello@joes.test',
      address: { line1: '123 Main St', city: 'Raleigh', state: 'NC', postalCode: '27601' },
    },
    hours: {
      mon: { open: '11:00', close: '21:00' },
      tue: { open: '11:00', close: '21:00' },
      wed: { open: '11:00', close: '21:00' },
      thu: { open: '11:00', close: '21:00' },
      fri: { open: '11:00', close: '22:00' },
      sat: { open: '11:00', close: '22:00' },
      sun: { closed: true },
    },
    social: { instagram: 'https://instagram.com/joespizza', google: 'https://g.page/joes' },
    seo: {},
  });

  // 6. Demo homepage
  await supabase.from('pages').upsert(
    {
      site_id: site.id,
      slug: '/',
      title: 'Joe\'s Pizza — Raleigh\'s neighborhood slice',
      meta_description: 'Hand-tossed New York-style pizza in downtown Raleigh since 1998.',
      draft_content: demoHomepageContent(),
      published_content: demoHomepageContent(),
      status: 'published',
      published_at: new Date().toISOString(),
    },
    { onConflict: 'site_id,slug' },
  );

  // 7. Demo media (URLs are placeholders — swap when real Supabase Storage is wired)
  for (let i = 0; i < 3; i++) {
    await supabase.from('media').upsert({
      site_id: site.id,
      storage_path: `${site.id}/demo-${i}.jpg`,
      public_url: `https://placehold.co/1200x800?text=Demo+${i}`,
      alt_text: `Demo image ${i}`,
      width: 1200,
      height: 800,
      mime_type: 'image/jpeg',
    });
  }

  console.warn('Seed complete. Operator:', OPERATOR_EMAIL, 'org:', org.id, 'site:', site.id);
}

async function findUserByEmail(email: string): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  const user = data.users.find((u) => u.email === email);
  if (!user) throw new Error(`User ${email} not found after creation`);
  return user.id;
}

function demoHomepageContent() {
  return {
    hero: {
      headline: "Raleigh's neighborhood slice",
      subheadline: 'Hand-tossed, wood-fired, open until 10.',
      backgroundImage: 'https://placehold.co/1920x1080?text=Hero',
      ctaLabel: 'See the menu',
      ctaUrl: '/menu',
    },
    intro: {
      headline: 'Made the way Joe\'s grandma did',
      body: 'Same dough, same sauce, same family — since 1998.',
    },
    featuredMenu: {
      enabled: true,
      headline: 'From the Kitchen',
      items: [
        { name: 'Margherita', description: 'San Marzano, fresh mozz, basil', price: '$14' },
        { name: 'Pepperoni', description: 'Crispy edges, lots of cheese', price: '$16' },
        { name: 'White Pie', description: 'Ricotta, garlic, rosemary', price: '$17' },
      ],
    },
    press: { enabled: false, logos: [] },
    testimonials: [
      { quote: 'Best slice in the Triangle.', author: 'Indy Week', source: 'Indy Week' },
    ],
    finalCta: {
      headline: 'Hungry yet?',
      label: 'Order online',
      url: '/order',
    },
  };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
