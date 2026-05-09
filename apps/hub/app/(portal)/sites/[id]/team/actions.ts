'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth';
import { env } from '@/lib/env';

const Input = z.object({
  email: z.string().email(),
  role: z.enum(['editor', 'owner']),
});

export async function inviteMember(orgId: string, email: string, role: 'editor' | 'owner'): Promise<string> {
  const user = await requireUser();
  Input.parse({ email, role });

  const admin = createAdminClient();
  // Caller must own the org or be an operator. RLS will enforce on the upsert below if we used the
  // user-bound client; with service role, we check explicitly.
  const { data: membership } = await admin
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!membership || (membership.role !== 'owner' && membership.role !== 'operator')) {
    throw new Error('Not authorized to invite to this org');
  }

  const { data: list } = await admin.auth.admin.listUsers();
  let invitedId = list?.users.find((u) => u.email === email)?.id;
  if (!invitedId) {
    const { data: created, error } = await admin.auth.admin.createUser({ email, email_confirm: false });
    if (error) throw new Error(error.message);
    invitedId = created.user!.id;
  }
  await admin
    .from('org_members')
    .upsert({ org_id: orgId, user_id: invitedId, role, invited_by: user.id }, { onConflict: 'org_id,user_id' });

  const { data: link } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `https://${env.NEXT_PUBLIC_BRAND_DOMAIN}/auth/callback?next=/dashboard` },
  });
  revalidatePath('/sites');
  return link?.properties?.action_link ?? `https://${env.NEXT_PUBLIC_BRAND_DOMAIN}/login`;
}
