'use server';

import { z } from 'zod';
import { getTemplate } from '@tarheel/templates';
import { requireOperator } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSiteProject } from '@/lib/vercel';
import { env } from '@/lib/env';

const Input = z.object({
  orgName: z.string().min(1).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1).max(60),
  ownerEmail: z.string().email(),
  domain: z.string().min(3).max(120),
  templateId: z.string(),
  plan: z.enum(['starter', 'standard', 'premium']),
});

export async function runOnboarding(raw: unknown) {
  await requireOperator();
  const input = Input.parse(raw);
  const template = getTemplate(input.templateId);
  const admin = createAdminClient();

  const { data: org, error: orgErr } = await admin
    .from('organizations')
    .insert({ name: input.orgName, slug: input.slug, plan: input.plan })
    .select()
    .single();
  if (orgErr) throw new Error(`Org create failed: ${orgErr.message}`);

  const { data: ownerLookup } = await admin.auth.admin.listUsers();
  let ownerId = ownerLookup?.users.find((u) => u.email === input.ownerEmail)?.id;
  if (!ownerId) {
    const { data: created, error: userErr } = await admin.auth.admin.createUser({
      email: input.ownerEmail,
      email_confirm: false,
    });
    if (userErr) throw new Error(`User create failed: ${userErr.message}`);
    ownerId = created.user!.id;
  }
  await admin.from('org_members').upsert({ org_id: org.id, user_id: ownerId, role: 'owner' });

  const { data: site, error: siteErr } = await admin
    .from('sites')
    .insert({ org_id: org.id, domain: input.domain, template_id: input.templateId, status: 'draft' })
    .select()
    .single();
  if (siteErr) throw new Error(`Site create failed: ${siteErr.message}`);

  await admin.from('site_settings').upsert({
    site_id: site.id,
    brand: { name: input.orgName },
    contact: {},
    hours: {},
    social: {},
    seo: {},
  });

  for (const page of template.pages) {
    await admin.from('pages').upsert(
      {
        site_id: site.id,
        slug: page.slug,
        title: page.title,
        draft_content: page.defaultContent,
        published_content: page.defaultContent,
        status: 'published',
        published_at: new Date().toISOString(),
      },
      { onConflict: 'site_id,slug' },
    );
  }

  let projectId: string | null = null;
  let deploymentUrl: string | undefined;
  if (env.VERCEL_API_TOKEN && env.VERCEL_SITE_TEMPLATE_REPO) {
    const projectName = `tarheel-site-${input.slug}`.slice(0, 100);
    const out = await createSiteProject({
      projectName,
      domain: input.domain,
      envVars: [
        { key: 'NEXT_PUBLIC_SUPABASE_URL', value: env.NEXT_PUBLIC_SUPABASE_URL, target: ['production', 'preview'], type: 'plain' },
        { key: 'SUPABASE_SERVICE_ROLE_KEY', value: env.SUPABASE_SERVICE_ROLE_KEY, target: ['production', 'preview'], type: 'encrypted' },
        { key: 'SITE_ID', value: site.id, target: ['production', 'preview'], type: 'plain' },
        { key: 'REVALIDATION_SECRET', value: site.revalidation_secret, target: ['production', 'preview'], type: 'encrypted' },
        { key: 'PREVIEW_SECRET', value: site.preview_secret, target: ['production', 'preview'], type: 'encrypted' },
      ],
    });
    projectId = out.projectId;
    deploymentUrl = out.deploymentUrl;
    await admin
      .from('sites')
      .update({ vercel_project_id: projectId, vercel_deployment_url: deploymentUrl ?? null })
      .eq('id', site.id);
  }

  await admin.from('audit_log').insert({
    org_id: org.id,
    site_id: site.id,
    action: 'site.provisioned',
    metadata: { projectId, domain: input.domain, plan: input.plan },
  });

  // Magic-link invite for the client
  const { data: link } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: input.ownerEmail,
    options: {
      redirectTo: `https://${env.NEXT_PUBLIC_BRAND_DOMAIN}/auth/callback?next=/dashboard`,
    },
  });

  return {
    orgId: org.id,
    siteId: site.id,
    inviteUrl: link?.properties?.action_link ?? `https://${env.NEXT_PUBLIC_BRAND_DOMAIN}/login`,
    deploymentUrl,
  };
}
