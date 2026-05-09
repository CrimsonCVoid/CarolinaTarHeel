import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const explicitNext = url.searchParams.get('next');

  let userId: string | null = null;
  if (code) {
    const supabase = await createServerClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    userId = data?.user?.id ?? null;
  }

  // If the link contained an explicit `next`, honor it (used for invite flows
  // pointing at a specific site or admin route).
  if (explicitNext) {
    return NextResponse.redirect(new URL(explicitNext, req.url));
  }

  // Smart default: solo-site users land directly on their site overview.
  // Multi-site users (operators or owners-of-multiple) hit the dashboard
  // grid. /dashboard itself does the same single-site detection so direct
  // visits behave consistently.
  if (userId) {
    const supabase = await createServerClient();
    const { data: sites } = await supabase.from('sites').select('id').limit(2);
    if (sites && sites.length === 1) {
      return NextResponse.redirect(new URL(`/sites/${sites[0]!.id}`, req.url));
    }
  }
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
