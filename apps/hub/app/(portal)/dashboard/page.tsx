import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Badge, Card, CardContent, Container } from '@tarheel/ui';
import { loadUserSites } from '@/lib/auth';
import { SaplingIllustration } from '@/components/illustrations';

export const metadata = { title: 'Sites' };

/*
 * Dashboard route.
 *
 * Single-site users are redirected straight to /sites/[id] — the
 * site overview is their real home. The dashboard grid only shows for
 * users (operators, multi-org owners) who genuinely have multiple sites.
 * Empty state surfaces the sapling illustration + onboarding hint.
 */
export default async function Dashboard() {
  const sites = await loadUserSites();
  if (sites.length === 1) {
    redirect(`/sites/${sites[0]!.id}`);
  }

  return (
    <Container className="py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Your sites</h1>
          <p className="mt-1 text-sm text-slate-600">
            {sites.length === 0
              ? "Looks like there's nothing here yet."
              : `${sites.length} sites under your account.`}
          </p>
        </div>
      </div>

      {sites.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => (
            <li key={s.id}>
              <Link href={`/sites/${s.id}`} className="block h-full">
                <Card className="h-full hover:border-brand-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-slate-900">{s.org?.name ?? 'Untitled'}</h2>
                      <Badge
                        variant={s.status === 'live' ? 'success' : s.status === 'archived' ? 'muted' : 'warning'}
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{s.domain}</p>
                    <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
                      {s.template_id} · {s.org?.plan ?? '—'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center p-12 text-center">
            <SaplingIllustration className="mb-6 h-20 w-20" />
            <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900">
              Let&apos;s plant your first site.
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              Your operator will provision one — or head to admin if that&apos;s you.
            </p>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
