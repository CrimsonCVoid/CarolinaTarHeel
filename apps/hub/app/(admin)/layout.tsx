import Link from 'next/link';
import { Container } from '@tarheel/ui';
import { requireOperator } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireOperator();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-amber-300 bg-amber-50">
        <Container className="flex h-14 items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold text-amber-900">
              Operator console
            </Link>
            <Link href="/admin/onboard" className="text-amber-900 hover:underline">
              Onboard new client
            </Link>
            <Link href="/dashboard" className="text-amber-900 hover:underline">
              ↩ Back to my sites
            </Link>
          </div>
          <div className="flex items-center gap-2 text-amber-900">
            <span>{user.email}</span>
            <LogoutButton />
          </div>
        </Container>
      </header>
      <main>{children}</main>
    </div>
  );
}
