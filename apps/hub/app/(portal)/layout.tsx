import Link from 'next/link';
import { Container } from '@tarheel/ui';
import { requireUser } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';
import { env } from '@/lib/env';
import { createServerClient } from '@/lib/supabase/server';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const supabase = await createServerClient();
  const { data: roles } = await supabase
    .from('org_members')
    .select('role')
    .eq('user_id', user.id);
  const isOperator = roles?.some((r) => r.role === 'operator') ?? false;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-display text-base font-semibold tracking-tight text-slate-900">
              {env.NEXT_PUBLIC_BRAND_NAME}
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="text-slate-700 hover:text-brand-700">
                Sites
              </Link>
              {isOperator ? (
                <Link href="/admin" className="text-slate-700 hover:text-brand-700">
                  Admin
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">{user.email}</span>
            <LogoutButton />
          </div>
        </Container>
      </header>
      <main>{children}</main>
    </div>
  );
}
